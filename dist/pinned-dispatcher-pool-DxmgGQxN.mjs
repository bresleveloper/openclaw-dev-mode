import { i as closeDispatcher } from "./ssrf-BQRtcdBp.mjs";
import { AsyncLocalStorage } from "node:async_hooks";
//#region src/infra/net/pinned-dispatcher-pool.ts
const runInDispatcherPoolContext = AsyncLocalStorage.snapshot();
/**
* Bounded cache of reusable DNS-pinned dispatchers.
*
* Callers must perform fresh DNS and SSRF validation before every acquisition
* and include the resulting origin, address set, and connection policy in the key.
*/
var PinnedDispatcherPool = class {
	constructor(options) {
		this.entries = /* @__PURE__ */ new Map();
		this.ownedEntries = /* @__PURE__ */ new Set();
		this.closed = false;
		this.maxEntries = options.maxEntries;
		this.idleTtlMs = options.idleTtlMs;
	}
	acquire(params) {
		if (this.closed) return;
		const existing = this.entries.get(params.key);
		if (existing) {
			if (existing.idleTimer) {
				clearTimeout(existing.idleTimer);
				existing.idleTimer = void 0;
			}
			existing.activeLeases += 1;
			this.entries.delete(existing.key);
			this.entries.set(existing.key, existing);
			return this.createLease(existing, true);
		}
		for (const entry of this.entries.values()) if (entry.groupKey === params.groupKey) this.retireEntry(entry);
		if (this.entries.size >= this.maxEntries) {
			const idleEntry = [...this.entries.values()].find((entry) => entry.activeLeases === 0);
			if (idleEntry) this.retireEntry(idleEntry);
		}
		if (this.entries.size >= this.maxEntries) return;
		const entry = {
			key: params.key,
			groupKey: params.groupKey,
			dispatcher: params.createDispatcher(),
			activeLeases: 1
		};
		this.ownedEntries.add(entry);
		this.entries.set(entry.key, entry);
		return this.createLease(entry, false);
	}
	async closeAll() {
		this.closed = true;
		const entries = [...this.ownedEntries];
		this.entries.clear();
		await Promise.all(entries.map((entry) => {
			if (entry.idleTimer) {
				clearTimeout(entry.idleTimer);
				entry.idleTimer = void 0;
			}
			return this.startClose(entry);
		}));
	}
	createLease(entry, reused) {
		let released = false;
		return {
			dispatcher: entry.dispatcher,
			reused,
			release: async () => {
				if (released) return;
				released = true;
				entry.activeLeases -= 1;
				if (entry.activeLeases > 0) return;
				if (this.closed || this.entries.get(entry.key) !== entry) {
					await this.startClose(entry);
					return;
				}
				entry.idleTimer = runInDispatcherPoolContext(() => setTimeout(() => this.retireEntry(entry), this.idleTtlMs));
				entry.idleTimer.unref?.();
			}
		};
	}
	retireEntry(entry) {
		if (this.entries.get(entry.key) === entry) this.entries.delete(entry.key);
		if (entry.idleTimer) {
			clearTimeout(entry.idleTimer);
			entry.idleTimer = void 0;
		}
		if (entry.activeLeases === 0) this.startClose(entry);
	}
	startClose(entry) {
		entry.closePromise ??= runInDispatcherPoolContext(() => closeDispatcher(entry.dispatcher).finally(() => {
			this.ownedEntries.delete(entry);
		}));
		return entry.closePromise;
	}
};
//#endregion
export { PinnedDispatcherPool as t };
