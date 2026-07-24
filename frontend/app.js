const serverOrigin = window.location.origin;
const apiBase = `${serverOrigin}/api`;
const storedSession = (() => { try { return JSON.parse(localStorage.getItem('code-golf-session')); } catch { return null; } })();
const state = { player: storedSession?.player ?? null, token: storedSession?.token ?? null, problems: [], room: null, socket: null };
const $ = (selector) => document.querySelector(selector);
const notice = (message, type = '') => { const element = $('#notice'); element.textContent = message; element.className = `notice ${type}`; };
const bytes = (text) => new TextEncoder().encode(text).length;

const request = async (path, options = {}) => {
  const response = await fetch(`${apiBase}${path}`, {
    ...options,
    headers: { 'content-type': 'application/json', ...(state.token ? { authorization: `Bearer ${state.token}` } : {}), ...options.headers },
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.message ?? 'Request failed.');
  return payload.data;
};

const selectedProblem = () => state.problems.find((problem) => problem._id === $('#problem-select').value);
const renderLanguages = () => { const problem = selectedProblem(); $('#language-select').innerHTML = (problem?.supportedLanguages ?? []).map((language) => `<option value="${language}">${language}</option>`).join(''); };
const renderProblems = () => { $('#problem-select').innerHTML = state.problems.map((problem) => `<option value="${problem._id}">${problem.title}</option>`).join(''); renderLanguages(); };
const renderLeaderboard = async () => {
  if (!state.room) return;
  const entries = await request(`/leaderboard/rooms/${state.room._id}`);
  $('#leaderboard-list').innerHTML = entries.length ? entries.map((entry) => `<li>${entry.rank ? `#${entry.rank} ` : ''}<strong>${entry.displayName}</strong> — ${entry.codeLength === null ? '—' : `${entry.codeLength} bytes`}</li>`).join('') : '<li>No players yet.</li>';
};
const renderRoom = async () => {
  const room = state.room;
  $('#room-card').classList.remove('hidden'); $('#active-room-code').textContent = room.code; $('#room-status').textContent = room.status;
  const problem = state.problems.find((item) => item._id === String(room.problem)) ?? selectedProblem();
  $('#room-title').textContent = problem?.title ?? 'Match room'; $('#problem-description').textContent = problem?.description ?? '';
  $('#players-list').innerHTML = room.players.map(({ player }) => `<li>${String(player) === state.player._id ? 'You' : String(player)}</li>`).join('');
  const host = String(room.host) === state.player._id;
  const canStart = host && room.status === 'waiting' && room.players.length >= 2;
  const startButton = $('#start-button');
  startButton.classList.toggle('hidden', !(host && room.status === 'waiting'));
  startButton.disabled = !canStart;
  $('#room-hint').textContent = room.status === 'waiting' && room.players.length < 2
    ? `Waiting for ${2 - room.players.length} more player. Share room code ${room.code} and have them join from another browser tab.`
    : host && room.status === 'waiting' ? 'All players are ready. Start the match when you are ready.' : '';
  $('#submission-form').classList.toggle('hidden', room.status !== 'in_progress');
  await renderLeaderboard();
};
const connectSocket = () => {
  if (!window.io || state.socket) return;
  state.socket = window.io(serverOrigin, { auth: { token: state.token } });
  state.socket.on('leaderboard-update', ({ leaderboard }) => { $('#leaderboard-list').innerHTML = leaderboard.map((entry) => `<li>#${entry.rank ?? '—'} ${entry.displayName} — ${entry.codeLength ?? '—'} bytes</li>`).join(''); });
  state.socket.on('player-joined', async () => { state.room = await request(`/rooms/${state.room._id}`); renderRoom(); });
  state.socket.on('player-left', async () => { state.room = await request(`/rooms/${state.room._id}`); renderRoom(); });
  state.socket.on('match-started', async ({ room }) => { state.room = room; await renderRoom(); notice('The match has started.', 'success'); });
  state.socket.on('match-ended', async ({ room }) => { state.room = room; await renderRoom(); notice('The match has ended.'); });
};
const socketRequest = (event, payload) => new Promise((resolve, reject) => {
  if (!state.socket?.connected) return reject(new Error('Realtime connection is not ready. Please try again.'));
  state.socket.emit(event, payload, (response) => response?.success ? resolve(response.data) : reject(new Error(response?.error?.message ?? 'Socket request failed.')));
});

const showPlayerSession = () => { $('#player-label').textContent = `Playing as ${state.player.displayName}`; $('#identity-card').classList.add('hidden'); $('#lobby-card').classList.remove('hidden'); connectSocket(); };
$('#identity-form').addEventListener('submit', async (event) => { event.preventDefault(); try { const session = await request('/players', { method: 'POST', body: JSON.stringify({ displayName: $('#display-name').value }) }); state.player = session.player; state.token = session.token; localStorage.setItem('code-golf-session', JSON.stringify(session)); showPlayerSession(); notice('You are ready to play.', 'success'); } catch (error) { notice(error.message, 'error'); } });
$('#problem-select').addEventListener('change', renderLanguages);
$('#create-form').addEventListener('submit', async (event) => { event.preventDefault(); try { state.room = await request('/rooms', { method: 'POST', body: JSON.stringify({ problemId: $('#problem-select').value, language: $('#language-select').value, maxPlayers: Number($('#max-players').value) }) }); state.socket?.emit('join-room', { roomCode: state.room.code }); await renderRoom(); notice(`Room ${state.room.code} created. Share its code with another player.`, 'success'); } catch (error) { notice(error.message, 'error'); } });
$('#join-form').addEventListener('submit', async (event) => { event.preventDefault(); try { state.room = await socketRequest('join-room', { roomCode: $('#room-code').value.trim().toUpperCase() }); await renderRoom(); notice('Joined room.', 'success'); } catch (error) { notice(error.message, 'error'); } });
$('#start-button').addEventListener('click', async () => { try { state.room = await request(`/rooms/${state.room._id}/start`, { method: 'POST', body: '{}' }); await renderRoom(); notice('Match started. Submit your shortest correct solution.', 'success'); } catch (error) { notice(error.message, 'error'); } });
$('#source-code').addEventListener('input', () => { $('#byte-count').textContent = `${bytes($('#source-code').value)} bytes`; });
$('#submission-form').addEventListener('submit', async (event) => { event.preventDefault(); try { const result = await request('/submissions', { method: 'POST', body: JSON.stringify({ roomId: state.room._id, sourceCode: $('#source-code').value }) }); $('#result-panel').classList.remove('hidden'); $('#result-panel').textContent = `${result.submission.judgeStatus.toUpperCase()}\n${result.results.map((item) => item.status?.description ?? item.status?.id).join('\n')}`; await renderLeaderboard(); notice(`Submission ${result.submission.judgeStatus}.`, result.submission.judgeStatus === 'accepted' ? 'success' : 'error'); } catch (error) { notice(error.message, 'error'); } });

try { state.problems = await request('/problems'); renderProblems(); if (state.player && state.token) { showPlayerSession(); notice('Welcome back. Create a room or join one with a room code.'); } else { notice('Choose a name to enter the arena.'); } } catch (error) { notice(`Could not load challenges: ${error.message}. Start the backend and run its seed command.`, 'error'); }
