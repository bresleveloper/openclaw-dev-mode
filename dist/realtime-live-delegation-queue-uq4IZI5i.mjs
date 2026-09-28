//#region extensions/openai/realtime-live-delegation-queue.ts
const INPUT_WAIT_MS = 15e3;
const MAX_PENDING_DELEGATIONS = 32;
const MAX_SESSION_DELEGATIONS = 4096;
/** Claims public delegation notices until their transcript is available or the call retires. */
var OpenAILiveDelegationQueue = class {
	constructor(options) {
		this.options = options;
		this.claimed = /* @__PURE__ */ new Set();
		this.pending = /* @__PURE__ */ new Map();
		this.stopped = false;
	}
	enqueue(id) {
		if (this.stopped || !this.options.isActive() || this.claimed.has(id)) return;
		if (id.length > 512 || this.claimed.size >= MAX_SESSION_DELEGATIONS || this.pending.size >= MAX_PENDING_DELEGATIONS) {
			this.stop();
			this.options.onError(/* @__PURE__ */ new Error("GPT-Live delegation notice limit exceeded"));
			return;
		}
		this.claimed.add(id);
		const timeout = setTimeout(() => {
			this.pending.delete(id);
			if (this.stopped || !this.options.isActive()) return;
			try {
				this.options.onExpired(id);
			} catch {
				this.stop();
				this.options.onError(/* @__PURE__ */ new Error("GPT-Live could not request missing delegation input"));
			}
		}, INPUT_WAIT_MS);
		timeout.unref?.();
		this.pending.set(id, timeout);
		this.resume();
	}
	resume() {
		for (const [id, timeout] of this.pending) {
			if (this.stopped || !this.options.isActive()) return;
			const input = this.options.readInput();
			if (!input.trim()) return;
			this.pending.delete(id);
			clearTimeout(timeout);
			this.options.dispatch(id, input);
		}
	}
	stop() {
		this.stopped = true;
		for (const timeout of this.pending.values()) clearTimeout(timeout);
		this.pending.clear();
		this.claimed.clear();
	}
};
//#endregion
export { OpenAILiveDelegationQueue as t };
