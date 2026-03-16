const ACTIVE_WINDOW_MS = 2 * 60 * 1000;

const lastSeenByUserId = new Map();

function normalizeUserId(userId) {
	const normalized = Number(userId);
	return Number.isInteger(normalized) && normalized > 0 ? normalized : null;
}

function pruneStale() {
	const now = Date.now();
	for (const [userId, lastSeen] of lastSeenByUserId.entries()) {
		if (now - lastSeen > ACTIVE_WINDOW_MS) {
			lastSeenByUserId.delete(userId);
		}
	}
}

export function markUserOnline(userId) {
	const normalizedUserId = normalizeUserId(userId);
	if (!normalizedUserId) return;
	lastSeenByUserId.set(normalizedUserId, Date.now());
}

export function markUserOffline(userId) {
	const normalizedUserId = normalizeUserId(userId);
	if (!normalizedUserId) return;
	lastSeenByUserId.delete(normalizedUserId);
}

export function isUserOnline(userId) {
	pruneStale();
	const normalizedUserId = normalizeUserId(userId);
	if (!normalizedUserId) return false;

	const lastSeen = lastSeenByUserId.get(normalizedUserId);
	if (!lastSeen) return false;

	return Date.now() - lastSeen <= ACTIVE_WINDOW_MS;
}

export function attachOnlineStatus(players = []) {
	pruneStale();
	return players.map((player) => ({
		...player,
		is_online: isUserOnline(player.id)
	}));
}
