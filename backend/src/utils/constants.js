// Shared protocol names used by the REST and Socket.IO layers.
export const constants = {
  roomStatuses: Object.freeze(['waiting', 'in_progress', 'finished']),
  socketEvents: Object.freeze({
    playerJoined: 'player-joined',
    playerLeft: 'player-left',
    leaderboardUpdate: 'leaderboard-update',
    submissionFeedback: 'submission-feedback',
  }),
};
