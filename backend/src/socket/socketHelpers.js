// Shares acknowledgement, error, and room-channel conventions across Socket.IO handlers.
export const roomChannel = (roomId) => `room:${roomId}`;

export const withSocketAcknowledgement = (socket, handler) => async (payload = {}, acknowledgement) => {
  try {
    const data = await handler(payload);
    const response = { success: true, data };

    if (typeof acknowledgement === 'function') {
      acknowledgement(response);
    }
  } catch (error) {
    const response = {
      success: false,
      error: {
        message: error.message ?? 'Socket operation failed.',
        statusCode: error.statusCode ?? 500,
      },
    };

    socket.emit('socket-error', response);

    if (typeof acknowledgement === 'function') {
      acknowledgement(response);
    }
  }
};
