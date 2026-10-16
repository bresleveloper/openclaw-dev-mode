//#region src/shared/pending-approval-registry.ts
function createPendingApprovalRegistry() {
	const pending = /* @__PURE__ */ new Map();
	let expiryStopped = false;
	const remove = (id, expected) => {
		const entry = pending.get(id);
		if (!entry || expected && entry !== expected) return;
		pending.delete(id);
		clearTimeout(entry.timeoutId);
		return entry;
	};
	const isCurrent = (entry) => pending.get(entry.id) === entry;
	const begin = (id, value) => {
		remove(id);
		const entry = {
			id,
			value,
			delivering: true
		};
		pending.set(id, entry);
		return entry;
	};
	const completeDelivery = async (entry, value) => {
		if (!isCurrent(entry)) return;
		entry.value = value;
		entry.delivering = false;
		if (entry.queued) {
			remove(entry.id, entry);
			await entry.queued(entry);
		}
	};
	const settle = (id, terminal) => {
		const entry = pending.get(id);
		if (!entry) return { status: "missing" };
		if (entry.delivering) {
			entry.queued ??= terminal;
			return { status: "queued" };
		}
		remove(id, entry);
		return {
			status: "taken",
			entry,
			terminal
		};
	};
	const scheduleExpiry = (entry, timeoutMs, onExpire) => {
		if (expiryStopped || !isCurrent(entry)) return;
		entry.timeoutId = setTimeout(() => {
			if (expiryStopped || !isCurrent(entry)) return;
			const expired = settle(entry.id, onExpire);
			if (expired.status === "taken") expired.terminal(expired.entry);
		}, timeoutMs);
		entry.timeoutId.unref?.();
	};
	const clear = () => {
		for (const entry of pending.values()) clearTimeout(entry.timeoutId);
		pending.clear();
	};
	const stopExpiryTimers = () => {
		expiryStopped = true;
		for (const entry of pending.values()) clearTimeout(entry.timeoutId);
	};
	const has = (id) => pending.has(id);
	return {
		has,
		begin,
		isCurrent,
		completeDelivery,
		settle,
		scheduleExpiry,
		remove,
		clear,
		stopExpiryTimers
	};
}
//#endregion
export { createPendingApprovalRegistry as t };
