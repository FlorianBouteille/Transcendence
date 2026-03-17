const addFriendForm = document.getElementById('add-friend-form');
const friendPseudonymInput = document.getElementById('friend-pseudonym');
const addFriendBtn = document.getElementById('add-friend-btn');
const feedbackEl = document.getElementById('friends-feedback');

const friendsListEl = document.getElementById('friends-list');
const requestsReceivedListEl = document.getElementById('requests-received-list');
const requestsSentListEl = document.getElementById('requests-sent-list');

const API_BASE = '/api';
let currentUserId = null;
let friendIds = new Set();
let sentRequestIds = new Set();
let receivedRequestIds = new Set();

function setFeedback(message, isError = false) {
	feedbackEl.textContent = isError ? `Error: ${message}` : message;
}

async function apiFetch(path, options = {}) {
	const response = await fetch(`${API_BASE}${path}`, {
		credentials: 'include',
		headers: {
			'Content-Type': 'application/json',
			...(options.headers || {})
		},
		...options
	});

	if (response.status === 401 || response.status === 403) {
		window.location.href = 'already.html';
		throw new Error('Unauthorized');
	}

	let payload = null;
	try {
		payload = await response.json();
	} catch {
		payload = null;
	}

	if (!response.ok) {
		const apiMessage = payload?.error || payload?.message || `Request failed (${response.status})`;
		throw new Error(apiMessage);
	}

	return payload;
}

async function sendFriendRequest(friendId) {
	const response = await fetch(`${API_BASE}/friends/me/requests/${friendId}`, {
		method: 'POST',
		credentials: 'include',
		headers: {
			'Content-Type': 'application/json'
		}
	});

	if (response.status === 401 || response.status === 403) {
		window.location.href = 'already.html';
		throw new Error('Unauthorized');
	}

	let payload = null;
	try {
		payload = await response.json();
	} catch {
		payload = null;
	}

	if (response.status === 409) {
		return {
			alreadyExists: true,
			message: payload?.error || payload?.message || 'Friend already added'
		};
	}

	if (!response.ok) {
		const apiMessage = payload?.error || payload?.message || `Request failed (${response.status})`;
		throw new Error(apiMessage);
	}

	return {
		alreadyExists: false,
		message: payload?.message || 'Friend request sent'
	};
}

function isOnline(friend) {
	return (
		friend?.is_online === true ||
		friend?.online === true ||
		friend?.isOnline === true ||
		friend?.connected === true ||
		friend?.status === 'online'
	);
}

function applyStatusDotStyles(statusDot, friend) {
	const online = isOnline(friend);

	statusDot.style.display = 'inline-block';
	statusDot.style.width = '10px';
	statusDot.style.height = '10px';
	statusDot.style.minWidth = '10px';
	statusDot.style.borderRadius = '999px';
	statusDot.style.flexShrink = '0';
	statusDot.style.backgroundColor = online ? '#22c55e' : '#9ca3af';
	statusDot.style.boxShadow = online ? '0 0 6px rgba(34, 197, 94, 0.7)' : 'none';
	statusDot.setAttribute('aria-label', online ? 'Online' : 'Offline');
	statusDot.setAttribute('title', online ? 'Online' : 'Offline');
}

function emptyStateItem(text) {
	const li = document.createElement('li');
	li.textContent = text;
	return li;
}

function createActionButton(label, className, onClick) {
	const button = document.createElement('button');
	button.type = 'button';
	button.textContent = label;
	button.className = className;
	button.addEventListener('click', onClick);
	return button;
}

function createSimpleItem(friend, actions = []) {
	const li = document.createElement('li');
	const line = document.createElement('p');
	line.textContent = `${friend.pseudonym} (lvl ${friend.level ?? 0})`;
	li.appendChild(line);

	if (actions.length > 0) {
		const actionsWrap = document.createElement('div');
		actionsWrap.className = 'menu-buttons';
		actions.forEach((btn) => actionsWrap.appendChild(btn));
		li.appendChild(actionsWrap);
	}

	return li;
}

function renderFriends(friends) {
	friendsListEl.innerHTML = '';

	if (!friends.length) {
		friendsListEl.appendChild(emptyStateItem('No friends yet.'));
		return;
	}

	friends.forEach((friend) => {
		const removeButton = createActionButton('×', 'friends-remove-btn', async () => {
			try {
				await apiFetch(`/friends/me/${friend.id}`, { method: 'DELETE' });
				setFeedback(`${friend.pseudonym} removed from your friends.`);
				await refreshAll();
			} catch (error) {
				setFeedback(error.message, true);
			}
		});
		removeButton.setAttribute('aria-label', `Remove ${friend.pseudonym}`);
		removeButton.setAttribute('title', 'Remove friend');

		const item = document.createElement('li');
		item.className = 'friends-list-item';

		const row = document.createElement('div');
		row.className = 'friends-list-row';

		const left = document.createElement('div');
		left.className = 'friends-list-left';
		left.style.display = 'flex';
		left.style.alignItems = 'center';
		left.style.gap = '10px';

		const statusDot = document.createElement('span');
		statusDot.className = `friends-status-dot${isOnline(friend) ? '' : ' is-offline'}`;
		applyStatusDotStyles(statusDot, friend);

		const name = document.createElement('p');
		name.className = 'friends-list-name';
		name.textContent = `${friend.pseudonym} (lvl ${friend.level ?? 0})`;
		name.style.margin = '0';

		left.appendChild(statusDot);
		left.appendChild(name);
		row.appendChild(left);
		row.appendChild(removeButton);
		item.appendChild(row);
		friendsListEl.appendChild(item);
	});
}

function renderRequestsReceived(requests) {
	requestsReceivedListEl.innerHTML = '';

	if (!requests.length) {
		requestsReceivedListEl.appendChild(emptyStateItem('No incoming request.'));
		return;
	}

	requests.forEach((friend) => {
		const acceptButton = createActionButton('Accept', 'btn btn--primary btn--sm', async () => {
			try {
				await apiFetch(`/friends/me/requests/${friend.id}`, { method: 'PUT' });
				setFeedback(`Request from ${friend.pseudonym} accepted.`);
				await refreshAll();
			} catch (error) {
				setFeedback(error.message, true);
			}
		});

		const rejectButton = createActionButton('Refuse', 'btn btn--danger btn--sm', async () => {
			try {
				await apiFetch(`/friends/me/requests/${friend.id}`, { method: 'DELETE' });
				setFeedback(`Request from ${friend.pseudonym} refused.`);
				await refreshAll();
			} catch (error) {
				setFeedback(error.message, true);
			}
		});

		requestsReceivedListEl.appendChild(createSimpleItem(friend, [acceptButton, rejectButton]));
	});
}

function renderRequestsSent(requests) {
	requestsSentListEl.innerHTML = '';

	if (!requests.length) {
		requestsSentListEl.appendChild(emptyStateItem('No pending request sent.'));
		return;
	}

	requests.forEach((friend) => {
		const cancelButton = createActionButton('Cancel', 'btn btn--ghost btn--sm', async () => {
			try {
				await apiFetch(`/friends/me/${friend.id}`, { method: 'DELETE' });
				setFeedback(`Request to ${friend.pseudonym} cancelled.`);
				await refreshAll();
			} catch (error) {
				setFeedback(error.message, true);
			}
		});

		requestsSentListEl.appendChild(createSimpleItem(friend, [cancelButton]));
	});
}

async function searchProfileByPseudonym(pseudonym) {
	const response = await apiFetch(`/profiles?pseudonym=${encodeURIComponent(pseudonym)}`);
	if (!response?.data || !Array.isArray(response.data) || response.data.length === 0) {
		return null;
	}
	return response.data[0];
}

async function ensureCurrentUserId() {
	if (currentUserId) {
		return currentUserId;
	}

	const meRes = await apiFetch('/me');
	currentUserId = Number(meRes?.id) || null;
	return currentUserId;
}

async function refreshAll() {
	const [friendsRes, receivedRes, sentRes] = await Promise.all([
		apiFetch('/friends/me'),
		apiFetch('/friends/me/requests/received'),
		apiFetch('/friends/me/requests/sent')
	]);

	friendIds = new Set((friendsRes?.data || []).map((friend) => Number(friend.id)).filter(Boolean));
	sentRequestIds = new Set((sentRes?.data || []).map((friend) => Number(friend.id)).filter(Boolean));
	receivedRequestIds = new Set((receivedRes?.data || []).map((friend) => Number(friend.id)).filter(Boolean));

	renderFriends(friendsRes?.data || []);
	renderRequestsReceived(receivedRes?.data || []);
	renderRequestsSent(sentRes?.data || []);
}

addFriendForm.addEventListener('submit', async (event) => {
	event.preventDefault();

	const pseudonym = friendPseudonymInput.value.trim();
	if (!pseudonym) {
		setFeedback('Please type a pseudonym.', true);
		return;
	}

	addFriendBtn.disabled = true;

	try {
		const target = await searchProfileByPseudonym(pseudonym);
		if (!target) {
			setFeedback(`No player found for "${pseudonym}".`, true);
			return;
		}

		const targetId = Number(target.id);
		const myUserId = await ensureCurrentUserId();
		if (myUserId && targetId === myUserId) {
			setFeedback('You cannot add yourself as a friend.');
			return;
		}

		if (friendIds.has(targetId)) {
			setFeedback(`${target.pseudonym} is already in your friend list.`);
			return;
		}

		if (sentRequestIds.has(targetId)) {
			setFeedback(`Friend request already sent to ${target.pseudonym}.`);
			return;
		}

		if (receivedRequestIds.has(targetId)) {
			setFeedback(`${target.pseudonym} already sent you a friend request.`);
			return;
		}

		const result = await sendFriendRequest(targetId);
		if (result.alreadyExists) {
			setFeedback(result.message);
		} else {
			setFeedback(`Friend request sent to ${target.pseudonym}.`);
		}
		addFriendForm.reset();
		await refreshAll();
	} catch (error) {
		setFeedback(error.message, true);
	} finally {
		addFriendBtn.disabled = false;
	}
});

(async function init() {
	try {
		setFeedback('Loading friends...');
		await refreshAll();
		setFeedback('Friends data up to date.');
	} catch (error) {
		setFeedback(error.message, true);
	}
})();
