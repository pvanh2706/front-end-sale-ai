import cors from 'cors'
import express from 'express'
import multer from 'multer'

const app = express()
const port = Number(process.env.PORT ?? 4000)

app.use(cors())
app.use(express.json())

// 1 GB hard limit at app level. Keep this aligned with Nginx/CloudFront limits.
const HARD_FILE_LIMIT_BYTES = 1024 * 1024 * 1024

const PLAN_LIMITS = {
  free: {
    maxFileSizeBytes: 25 * 1024 * 1024,
    maxFilesPerUpload: 5,
    maxStorageBytes: 1 * 1024 * 1024 * 1024,
  },
  trial: {
    maxFileSizeBytes: 25 * 1024 * 1024,
    maxFilesPerUpload: 5,
    maxStorageBytes: 1 * 1024 * 1024 * 1024,
  },
  standard: {
    maxFileSizeBytes: 50 * 1024 * 1024,
    maxFilesPerUpload: 10,
    maxStorageBytes: 50 * 1024 * 1024 * 1024,
  },
  pro: {
    maxFileSizeBytes: 100 * 1024 * 1024,
    maxFilesPerUpload: 20,
    maxStorageBytes: 500 * 1024 * 1024 * 1024,
  },
  enterprise: {
    maxFileSizeBytes: 500 * 1024 * 1024,
    maxFilesPerUpload: 50,
    maxStorageBytes: Number.POSITIVE_INFINITY,
  },
}

const storage = multer.memoryStorage()
const upload = multer({
  storage,
  limits: {
    fileSize: HARD_FILE_LIMIT_BYTES,
  },
})

/**
 * In production, move these to a real database.
 * orgState = {
 *   [orgId]: { usedBytes: number, files: Array<{id, name, sizeBytes, uploadedAt}> }
 * }
 */
const orgState = new Map()

function bytesToMB(value) {
  return Number((value / (1024 * 1024)).toFixed(2))
}

function getPlan(planRaw) {
  const plan = String(planRaw ?? '').toLowerCase()
  return PLAN_LIMITS[plan] ? plan : null
}

function getOrCreateOrg(orgId) {
  if (!orgState.has(orgId)) {
    orgState.set(orgId, {
      usedBytes: 0,
      files: [],
    })
  }
  return orgState.get(orgId)
}

function serializeLimit(plan) {
  const limit = PLAN_LIMITS[plan]
  return {
    plan,
    maxFileSizeMB: bytesToMB(limit.maxFileSizeBytes),
    maxFilesPerUpload: limit.maxFilesPerUpload,
    maxStorageGB: Number.isFinite(limit.maxStorageBytes)
      ? Number((limit.maxStorageBytes / (1024 * 1024 * 1024)).toFixed(2))
      : null,
    hardFileLimitMB: bytesToMB(HARD_FILE_LIMIT_BYTES),
  }
}

app.get('/api/doc-library/limits', (req, res) => {
  const plan = getPlan(req.query.plan)
  if (!plan) {
    res.status(400).json({
      ok: false,
      error: 'Plan khong hop le. Dung: free, trial, standard, pro, enterprise',
    })
    return
  }

  res.json({
    ok: true,
    data: serializeLimit(plan),
  })
})

app.get('/api/doc-library/orgs/:orgId/storage', (req, res) => {
  const plan = getPlan(req.query.plan)
  if (!plan) {
    res.status(400).json({
      ok: false,
      error: 'Plan khong hop le. Dung: free, trial, standard, pro, enterprise',
    })
    return
  }

  const orgId = req.params.orgId
  const org = getOrCreateOrg(orgId)
  const planLimit = PLAN_LIMITS[plan]

  const maxStorageBytes = planLimit.maxStorageBytes
  const remainingBytes = Number.isFinite(maxStorageBytes)
    ? Math.max(0, maxStorageBytes - org.usedBytes)
    : Number.POSITIVE_INFINITY

  res.json({
    ok: true,
    data: {
      orgId,
      plan,
      usedStorageMB: bytesToMB(org.usedBytes),
      remainingStorageMB: Number.isFinite(remainingBytes) ? bytesToMB(remainingBytes) : null,
      maxStorageMB: Number.isFinite(maxStorageBytes) ? bytesToMB(maxStorageBytes) : null,
      totalFiles: org.files.length,
    },
  })
})

app.post('/api/doc-library/upload', upload.array('files'), (req, res) => {
  const plan = getPlan(req.body.plan)
  const orgId = String(req.body.orgId ?? '').trim()

  if (!plan) {
    res.status(400).json({
      ok: false,
      error: 'Plan khong hop le. Dung: free, trial, standard, pro, enterprise',
    })
    return
  }

  if (!orgId) {
    res.status(400).json({
      ok: false,
      error: 'Thieu orgId',
    })
    return
  }

  const files = Array.isArray(req.files) ? req.files : []
  if (files.length === 0) {
    res.status(400).json({
      ok: false,
      error: 'Khong co file nao duoc gui len',
    })
    return
  }

  const limit = PLAN_LIMITS[plan]

  if (files.length > limit.maxFilesPerUpload) {
    res.status(413).json({
      ok: false,
      code: 'UPLOAD_FILE_COUNT_LIMIT_EXCEEDED',
      error: `Gioi han ${limit.maxFilesPerUpload} file/lan upload cho plan ${plan}`,
      details: {
        uploadedFileCount: files.length,
        maxFilesPerUpload: limit.maxFilesPerUpload,
      },
    })
    return
  }

  for (const file of files) {
    if (file.size > HARD_FILE_LIMIT_BYTES) {
      res.status(413).json({
        ok: false,
        code: 'UPLOAD_HARD_FILE_LIMIT_EXCEEDED',
        error: 'File vuot hard limit 1GB cua he thong',
        details: {
          fileName: file.originalname,
          fileSizeMB: bytesToMB(file.size),
          hardFileLimitMB: bytesToMB(HARD_FILE_LIMIT_BYTES),
        },
      })
      return
    }

    if (file.size > limit.maxFileSizeBytes) {
      res.status(413).json({
        ok: false,
        code: 'UPLOAD_PLAN_FILE_SIZE_LIMIT_EXCEEDED',
        error: `Plan ${plan} chi cho phep toi da ${bytesToMB(limit.maxFileSizeBytes)} MB/file`,
        details: {
          fileName: file.originalname,
          fileSizeMB: bytesToMB(file.size),
          planFileSizeLimitMB: bytesToMB(limit.maxFileSizeBytes),
        },
      })
      return
    }
  }

  const org = getOrCreateOrg(orgId)
  const uploadBytes = files.reduce((sum, file) => sum + file.size, 0)

  if (Number.isFinite(limit.maxStorageBytes) && org.usedBytes + uploadBytes > limit.maxStorageBytes) {
    res.status(413).json({
      ok: false,
      code: 'UPLOAD_ORG_STORAGE_QUOTA_EXCEEDED',
      error: `Vuot tong storage cua org theo plan ${plan}`,
      details: {
        orgId,
        currentUsedMB: bytesToMB(org.usedBytes),
        uploadBatchMB: bytesToMB(uploadBytes),
        maxStorageMB: bytesToMB(limit.maxStorageBytes),
      },
    })
    return
  }

  const now = new Date().toISOString()
  const acceptedFiles = files.map((file) => {
    const id = `${Date.now()}-${Math.random().toString(16).slice(2, 10)}`
    const fileRecord = {
      id,
      name: file.originalname,
      mimeType: file.mimetype,
      sizeBytes: file.size,
      uploadedAt: now,
      status: 'queued_for_rag_pipeline',
    }

    org.files.push(fileRecord)
    return {
      id: fileRecord.id,
      name: fileRecord.name,
      mimeType: fileRecord.mimeType,
      sizeMB: bytesToMB(fileRecord.sizeBytes),
      uploadedAt: fileRecord.uploadedAt,
      status: fileRecord.status,
    }
  })

  org.usedBytes += uploadBytes

  res.status(201).json({
    ok: true,
    data: {
      orgId,
      plan,
      acceptedCount: acceptedFiles.length,
      files: acceptedFiles,
      quota: {
        usedStorageMB: bytesToMB(org.usedBytes),
        remainingStorageMB: Number.isFinite(limit.maxStorageBytes)
          ? bytesToMB(Math.max(0, limit.maxStorageBytes - org.usedBytes))
          : null,
        maxStorageMB: Number.isFinite(limit.maxStorageBytes)
          ? bytesToMB(limit.maxStorageBytes)
          : null,
      },
    },
  })
})

app.delete('/api/doc-library/orgs/:orgId/files/:fileId', (req, res) => {
  const org = orgState.get(req.params.orgId)
  if (!org) {
    res.status(404).json({ ok: false, error: 'Khong tim thay org' })
    return
  }

  const idx = org.files.findIndex((f) => f.id === req.params.fileId)
  if (idx < 0) {
    res.status(404).json({ ok: false, error: 'Khong tim thay file' })
    return
  }

  const [removed] = org.files.splice(idx, 1)
  org.usedBytes = Math.max(0, org.usedBytes - removed.sizeBytes)

  res.json({
    ok: true,
    data: {
      orgId: req.params.orgId,
      fileId: removed.id,
      removedSizeMB: bytesToMB(removed.sizeBytes),
      usedStorageMB: bytesToMB(org.usedBytes),
    },
  })
})

app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
    res.status(413).json({
      ok: false,
      code: 'UPLOAD_HARD_FILE_LIMIT_EXCEEDED',
      error: 'File vuot hard limit 1GB cua he thong',
      details: {
        hardFileLimitMB: bytesToMB(HARD_FILE_LIMIT_BYTES),
      },
    })
    return
  }

  console.error(err)
  res.status(500).json({
    ok: false,
    error: 'Loi he thong',
  })
})

app.listen(port, () => {
  console.log(`Doc Library backend running on http://localhost:${port}`)
})
