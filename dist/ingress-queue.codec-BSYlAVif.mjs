//#region src/channels/message/ingress-queue.codec.ts
const FAILED_NULL_PAYLOAD_SENTINEL = "OPENCLAW_CHANNEL_INGRESS_FAILED_NULL_V1";
function parseJson(value) {
	try {
		return {
			ok: true,
			value: JSON.parse(value)
		};
	} catch {
		return { ok: false };
	}
}
function parseFailedPayload(value) {
	return value === "OPENCLAW_CHANNEL_INGRESS_FAILED_NULL_V1" ? {
		ok: true,
		value: null
	} : parseJson(value);
}
function baseRecord(row) {
	const payloadResult = parseJson(row.payload_json);
	if (!payloadResult.ok) return null;
	const metaResult = row.metadata_json === null ? null : parseJson(row.metadata_json);
	return {
		id: row.event_id,
		channelId: row.channel_id,
		accountId: row.account_id,
		queueName: row.queue_name,
		payload: payloadResult.value,
		...metaResult === null || !metaResult.ok ? {} : { metadata: metaResult.value },
		receivedAt: row.received_at,
		updatedAt: row.updated_at,
		...row.lane_key === null ? {} : { laneKey: row.lane_key },
		attempts: row.attempts,
		...row.last_attempt_at === null ? {} : { lastAttemptAt: row.last_attempt_at },
		...row.last_error === null ? {} : { lastError: row.last_error }
	};
}
function decodeClaimColumns(row) {
	if (!row.claim_token || !row.claim_owner || row.claimed_at === null) return null;
	return {
		token: row.claim_token,
		ownerId: row.claim_owner,
		claimedAt: row.claimed_at
	};
}
function claimedRecord(row) {
	const claim = decodeClaimColumns(row);
	const base = claim === null ? null : baseRecord(row);
	if (claim === null || base === null) return null;
	return {
		...base,
		claim
	};
}
function corruptClaimRecord(row, claim) {
	return {
		id: row.event_id,
		channelId: row.channel_id,
		accountId: row.account_id,
		queueName: row.queue_name,
		...row.lane_key === null ? {} : { laneKey: row.lane_key },
		reason: "corrupt_payload",
		claim
	};
}
function completedRecord(row) {
	const metaResult = row.completed_metadata_json === null ? null : parseJson(row.completed_metadata_json);
	return {
		id: row.event_id,
		channelId: row.channel_id,
		accountId: row.account_id,
		queueName: row.queue_name,
		completedAt: row.completed_at ?? row.updated_at,
		...metaResult === null || !metaResult.ok ? {} : { metadata: metaResult.value }
	};
}
function failedRecord(row) {
	const payloadResult = parseFailedPayload(row.payload_json);
	const metadataResult = row.metadata_json === null ? null : parseJson(row.metadata_json);
	return {
		id: row.event_id,
		channelId: row.channel_id,
		accountId: row.account_id,
		queueName: row.queue_name,
		...payloadResult.ok && row.payload_json !== "null" ? { payload: payloadResult.value } : {},
		...metadataResult?.ok ? { metadata: metadataResult.value } : {},
		receivedAt: row.received_at,
		updatedAt: row.updated_at,
		...row.lane_key === null ? {} : { laneKey: row.lane_key },
		attempts: row.attempts,
		...row.last_attempt_at === null ? {} : { lastAttemptAt: row.last_attempt_at },
		failedAt: row.failed_at ?? row.updated_at,
		reason: row.failed_reason ?? "failed",
		...row.last_error === null ? {} : { message: row.last_error }
	};
}
/** Resolve host policy only for the rows the original bounded scan would visit. */
function selectChannelIngressClaim(snapshot, request, resolveLane) {
	const blocked = new Set(request.blockedLaneKeys);
	for (const row of snapshot.claimed) {
		const lane = resolveLane(row);
		if (lane) blocked.add(lane);
	}
	const corruptIds = [];
	let pending = snapshot.pending;
	while (true) {
		const removed = /* @__PURE__ */ new Set();
		for (const row of pending.slice(0, Math.max(1, Math.floor(request.scanLimit ?? 100)))) {
			if (!baseRecord(row)) {
				if (corruptIds.length < 100) {
					corruptIds.push(row.event_id);
					removed.add(row.event_id);
				}
				continue;
			}
			const laneKey = resolveLane(row);
			if (!laneKey || !blocked.has(laneKey)) return {
				corruptIds,
				selected: {
					id: row.event_id,
					laneKey
				}
			};
		}
		if (removed.size === 0 || corruptIds.length >= 100) return { corruptIds };
		pending = pending.filter((row) => !removed.has(row.event_id));
	}
}
//#endregion
export { corruptClaimRecord as a, parseFailedPayload as c, completedRecord as i, selectChannelIngressClaim as l, baseRecord as n, decodeClaimColumns as o, claimedRecord as r, failedRecord as s, FAILED_NULL_PAYLOAD_SENTINEL as t };
