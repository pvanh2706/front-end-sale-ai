export interface AiSuggestionContext {
  name?: string
  company?: string
}

/**
 * Generate a contextual AI action suggestion for a given activity.
 * All copy is in Vietnamese, matching the app's UI language.
 */
export function generateAiSuggestion(
  type: string,
  subType: string,
  note: string,
  ctx: AiSuggestionContext = {},
): string {
  const n = ctx.name?.trim() || 'khách hàng'
  const c = ctx.company?.trim() || 'doanh nghiệp'
  const noteHint = note.trim()
    ? `\n\n📌 Dựa trên ghi chú của bạn:\n"${note.slice(0, 80)}${note.length > 80 ? '...' : ''}"`
    : ''

  // ── Gọi điện ────────────────────────────────────────────────
  if (type === 'call') {
    if (subType === 'Cold Call') {
      return (
        `📞 Script Cold Call gợi ý:\n\n` +
        `"Xin chào, cho hỏi đây có phải ${n} không ạ? Em là [Tên] từ [Công ty]. ` +
        `Em gọi vì thấy ${c} đang [pain point ngành hàng]. ` +
        `Anh/chị có 3 phút để em chia sẻ một giải pháp không ạ?"` +
        noteHint +
        `\n\n💡 Nếu bị từ chối: Hỏi thời điểm phù hợp hơn và gửi email giới thiệu trước.`
      )
    }
    if (subType === 'Follow-up Call') {
      return (
        `📞 Script Follow-up Call:\n\n` +
        `"Xin chào ${n}, em là [Tên] — lần trước mình đã có buổi trao đổi. ` +
        `Em muốn theo dõi xem anh/chị đã cân nhắc kỹ hơn về đề xuất của chúng em chưa ạ?"` +
        noteHint +
        `\n\n💡 Mục tiêu: Xử lý objection, xác nhận demo hoặc bước báo giá tiếp theo.`
      )
    }
    if (subType === 'Demo Call') {
      return (
        `📞 Demo Call checklist:\n\n` +
        `✅ Trước cuộc gọi:\n` +
        `• Test link Zoom/Meet trước 5 phút\n` +
        `• Mở sẵn tab demo với dữ liệu của ${c}\n` +
        `• Chuẩn bị câu hỏi discovery` +
        noteHint +
        `\n\n✅ Trong demo:\n` +
        `• Hỏi khám phá nhu cầu trước → demo sau\n` +
        `• Nhấn tính năng giải quyết đúng pain point\n` +
        `• Kết thúc: "Anh/chị thấy phần nào phù hợp nhất?"`
      )
    }
    if (subType === 'Tư vấn') {
      return (
        `📞 Cuộc gọi tư vấn:\n\n` +
        `• Lắng nghe để hiểu rõ bối cảnh hiện tại của ${c}\n` +
        `• Đặt câu hỏi mở: "Hiện tại khó khăn lớn nhất của anh/chị là gì?"\n` +
        `• Đề xuất giải pháp dựa trên nhu cầu thực tế` +
        noteHint +
        `\n\n💡 Tư vấn tốt là khi khách hàng cảm thấy được lắng nghe, không bị bán hàng.`
      )
    }
    return (
      `📞 Gợi ý cuộc gọi:\n\n` +
      `• Nhắc lại context từ lần trao đổi trước\n` +
      `• Đặt câu hỏi về nhu cầu hiện tại của ${c}\n` +
      `• Lắng nghe trước khi đề xuất giải pháp` +
      noteHint +
      `\n\n💡 Chốt cuộc gọi bằng bước tiếp theo cụ thể: hẹn demo / gửi báo giá.`
    )
  }

  // ── Gửi Email ────────────────────────────────────────────────
  if (type === 'email') {
    if (subType === 'Cold Email') {
      return (
        `✉️ Cold Email gợi ý:\n\n` +
        `Chủ đề: Giải pháp [cụ thể] cho ${c}\n\n` +
        `"Kính gửi ${n},\n\n` +
        `Em thấy ${c} đang [pain point liên quan]. Chúng em đã giúp [Khách hàng tương tự] ` +
        `giải quyết vấn đề này và đạt [kết quả cụ thể].\n\n` +
        `Anh/chị có 15 phút để trao đổi không ạ?\n\nTrân trọng"` +
        noteHint +
        `\n\n💡 Subject có tên người nhận tăng tỷ lệ mở email lên 35%.`
      )
    }
    if (subType === 'Email giới thiệu') {
      return (
        `✉️ Email giới thiệu:\n\n` +
        `Chủ đề: [Tên] từ [Công ty] — Giải pháp cho ${c}\n\n` +
        `"Kính gửi ${n},\n\n` +
        `Em là [Tên], phụ trách [khu vực] tại [Công ty]. ` +
        `Chúng em chuyên cung cấp [giải pháp] giúp doanh nghiệp như ${c} ` +
        `[lợi ích chính — tiết kiệm thời gian / tăng doanh thu].\n\n` +
        `Em có thể gửi tài liệu giới thiệu để anh/chị tham khảo không ạ?"` +
        noteHint
      )
    }
    if (subType === 'Nurturing') {
      return (
        `✉️ Email Nurturing:\n\n` +
        `Chủ đề: Tài liệu hữu ích dành cho ${c}\n\n` +
        `"Kính gửi ${n},\n\n` +
        `Gửi kèm [case study / bài viết] phù hợp với lĩnh vực của ${c}.` +
        noteHint +
        `\n\nHy vọng nội dung này hữu ích. Hãy liên hệ nếu có câu hỏi!\n\nTrân trọng"` +
        `\n\n💡 Nurturing: chia sẻ giá trị trước, bán hàng sau. Mục tiêu là duy trì brand awareness.`
      )
    }
    if (subType === 'Email báo giá') {
      return (
        `✉️ Email báo giá:\n\n` +
        `Chủ đề: Đề xuất & báo giá cho ${c}\n\n` +
        `"Kính gửi ${n},\n\n` +
        `Theo buổi trao đổi của chúng ta, đây là đề xuất phù hợp nhất cho ${c}:\n\n` +
        `[Tóm tắt giải pháp được đề xuất]\n[Bảng giá chi tiết]\n[Điều khoản & timeline]\n\n` +
        `Rất mong nhận được phản hồi từ anh/chị.\n\nTrân trọng"` +
        noteHint +
        `\n\n💡 Gọi điện ngay sau khi gửi (trong 1 giờ) để tăng tỷ lệ phản hồi lên 40%.`
      )
    }
    return (
      `✉️ Email gợi ý:\n\n` +
      `Chủ đề: Theo dõi — ${n} & ${c}` +
      noteHint +
      `\n\nNội dung:\n` +
      `• Nhắc lại điểm nổi bật từ trao đổi trước\n` +
      `• Đề xuất bước tiếp theo cụ thể\n` +
      `• CTA rõ ràng: "Anh/chị xác nhận lịch demo vào [ngày] được không?"`
    )
  }

  // ── Nhắn tin ─────────────────────────────────────────────────
  if (type === 'message') {
    if (subType === 'Zalo') {
      return (
        `💬 Tin nhắn Zalo:\n\n` +
        `"Xin chào ${n} ạ! Em là [Tên] bên [Công ty] 😊\n\n` +
        `${note.trim() || `Em muốn chia sẻ thông tin về giải pháp phù hợp cho ${c}.`}\n\n` +
        `Anh/chị có muốn em gửi tài liệu giới thiệu không ạ?"` +
        noteHint +
        `\n\n💡 Zalo: ngắn gọn, thân thiện, emoji vừa phải. Gửi lúc 9–11h hoặc 14–16h.`
      )
    }
    if (subType === 'WhatsApp') {
      return (
        `💬 WhatsApp message:\n\n` +
        `"Hi ${n}! 👋 This is [Name] from [Company].\n\n` +
        `${note.trim() || `I'd love to connect about a solution that could benefit ${c}.`}\n\n` +
        `Would you be available for a quick 15-min chat this week?"` +
        noteHint +
        `\n\n💡 WhatsApp: brief & professional. Best sent 10am–12pm local time.`
      )
    }
    if (subType === 'SMS') {
      return (
        `📱 SMS (tối đa 160 ký tự):\n\n` +
        `"Xin chào ${n}, [Tên] từ [Công ty]. Muốn hỗ trợ ${c} về [giải pháp]. Tiện gọi lại? Cảm ơn!"\n\n` +
        `💡 SMS: cực ngắn, có CTA rõ ràng. Không gửi quá 1 SMS/tuần.`
      )
    }
    return (
      `💬 Tin nhắn gợi ý:\n\n` +
      `"Xin chào ${n}, em là [Tên] bên [Công ty]. ` +
      `${note.trim() || `Em muốn kết nối và chia sẻ thông tin hữu ích cho ${c}.`}\n\n` +
      `Anh/chị phản hồi giúp em nhé ạ!"` +
      noteHint
    )
  }

  // ── Mạng xã hội ──────────────────────────────────────────────
  if (type === 'social') {
    if (subType === 'LinkedIn InMail') {
      return (
        `🔗 LinkedIn InMail:\n\n` +
        `Tiêu đề: Giải pháp phù hợp cho ${c}\n\n` +
        `"Xin chào ${n},\n\n` +
        `Tôi thấy bạn đang phụ trách [lĩnh vực] tại ${c}. ` +
        `Chúng tôi đã giúp nhiều doanh nghiệp tương tự đạt [kết quả cụ thể].\n\n` +
        `Bạn có thể dành 15 phút để trao đổi không?"` +
        noteHint +
        `\n\n💡 InMail có tỷ lệ phản hồi cao hơn khi đề cập điểm liên quan cụ thể đến công việc của họ.`
      )
    }
    return (
      `📱 Social Outreach:\n\n` +
      `✅ Trước khi nhắn:\n` +
      `• Like/comment bài viết gần đây của ${n}\n` +
      `• Đọc profile để tìm điểm chung\n\n` +
      `✅ Nội dung nhắn:\n` +
      `• Đề cập điểm chung hoặc bài đăng của họ\n` +
      `• Cá nhân hóa 100% — không dùng template chung` +
      noteHint +
      `\n\n💡 Warm-up 3–5 ngày trước khi pitch tăng 60% tỷ lệ phản hồi.`
    )
  }

  // ── Gặp trực tiếp ────────────────────────────────────────────
  if (type === 'meeting') {
    return (
      `📋 Chuẩn bị gặp ${n} — ${c}:\n\n` +
      `✅ Agenda (${subType || 'buổi gặp'}):\n` +
      `• 5 phút: Giới thiệu & xác nhận agenda\n` +
      `• 10 phút: Khám phá nhu cầu & pain point\n` +
      `• 10 phút: Demo / trình bày giải pháp phù hợp\n` +
      `• 5 phút: Q&A & thống nhất next steps` +
      noteHint +
      `\n\n📌 Tài liệu cần mang:\n` +
      `• Case study khách hàng cùng ngành\n` +
      `• Đề xuất giá sơ bộ\n` +
      `• Hợp đồng mẫu (nếu gần chốt)`
    )
  }

  // ── Ghi chú ──────────────────────────────────────────────────
  if (type === 'note') {
    return (
      `📝 Ghi chú hiệu quả:\n\n` +
      `✅ Nên ghi lại:\n` +
      `• Điểm chính từ cuộc trao đổi với ${n}\n` +
      `• Pain point cụ thể của ${c}\n` +
      `• Cam kết / hứa hẹn từ hai phía\n` +
      `• Bước tiếp theo đã thống nhất` +
      noteHint +
      `\n\n💡 Ghi chú ngay sau cuộc gặp — bộ nhớ giảm 40% sau 1 giờ. Ghi súc tích, dùng bullet point.`
    )
  }

  // ── Tác vụ ───────────────────────────────────────────────────
  if (type === 'task') {
    if (subType === 'Gọi lại') {
      return (
        `📋 Tác vụ: Gọi lại ${n}\n\n` +
        `• Chuẩn bị context từ lần trao đổi trước\n` +
        `• Mục tiêu cuộc gọi: [xác nhận / xử lý objection / chốt]\n` +
        `• Thời điểm gọi tốt nhất: 9–11h hoặc 14–16h` +
        noteHint +
        `\n\n💡 Đặt reminder 15 phút trước để chuẩn bị script.`
      )
    }
    if (subType === 'Gửi tài liệu') {
      return (
        `📋 Tác vụ: Gửi tài liệu cho ${n}\n\n` +
        `✅ Checklist trước khi gửi:\n` +
        `• Cá nhân hóa tài liệu với tên / logo của ${c}\n` +
        `• Đính kèm case study cùng ngành\n` +
        `• Viết email ngắn gọn kèm tài liệu — đừng gửi không có context\n` +
        `• Đặt follow-up sau 24–48h nếu chưa có phản hồi` +
        noteHint
      )
    }
    if (subType === 'Lên lịch demo') {
      return (
        `📋 Tác vụ: Lên lịch demo với ${n}\n\n` +
        `• Gợi ý 2–3 khung giờ cụ thể (tránh thứ Hai sáng / thứ Sáu chiều)\n` +
        `• Gửi link đặt lịch (Calendly / Google Calendar)\n` +
        `• Xác nhận 24h trước qua Zalo hoặc Email\n` +
        `• Chuẩn bị demo với dữ liệu thực tế của ${c}` +
        noteHint +
        `\n\n💡 Demo được chuẩn bị cá nhân hóa tăng tỷ lệ chốt lên 60%.`
      )
    }
    return (
      `📋 Tác vụ cần hoàn thành:\n\n` +
      `• Xác định deadline cụ thể\n` +
      `• Ghi rõ kết quả mong đợi\n` +
      `• Đặt reminder nhắc nhở trước deadline` +
      noteHint +
      `\n\n💡 Tác vụ có deadline cụ thể tăng tỷ lệ hoàn thành lên 2.5 lần so với "làm khi có thể".`
    )
  }

  // ── Khác / Default ────────────────────────────────────────────
  return (
    `💡 Gợi ý follow-up:` +
    noteHint +
    `\n\n• Ghi lại kết quả vào CRM ngay sau hoạt động\n` +
    `• Lên kế hoạch follow-up trong 24–48h\n` +
    `• Cập nhật trạng thái deal/lead nếu có thay đổi quan trọng`
  )
}
