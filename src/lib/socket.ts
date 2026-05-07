import { io, type Socket } from 'socket.io-client'

let socket: Socket | null = null

export function getSocket(): Socket {
  if (socket) {
    return socket
  }

  const token = localStorage.getItem('token') ?? ''
  const baseUrl = import.meta.env.VITE_SOCKET_URL ?? window.location.origin

  socket = io(baseUrl, {
    transports: ['websocket'],
    auth: {
      token,
    },
  })

  return socket
}

export function disconnectSocket(): void {
  if (!socket) {
    return
  }
  socket.disconnect()
  socket = null
}
