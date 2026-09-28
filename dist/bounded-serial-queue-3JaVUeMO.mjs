//#region src/shared/bounded-serial-queue.ts
/**
* Single-worker FIFO with bounded waiting work.
*
* The active task is owned separately from the waiting budget. Overflow seals
* admission but preserves the already accepted prefix for flush and close.
*/
var BoundedSerialQueue = class {
	constructor(options) {
		this.options = options;
		this.pending = [];
		this.pendingWeight = 0;
		this.active = false;
		this.sealed = false;
		this.overflowed = false;
		this.acceptedSequence = 0;
		this.settledPrefix = Promise.resolve();
		if (!Number.isSafeInteger(options.maxPendingCount) || options.maxPendingCount < 0) throw new Error("maxPendingCount must be a non-negative safe integer");
		if (!Number.isFinite(options.maxPendingWeight) || options.maxPendingWeight < 0) throw new Error("maxPendingWeight must be a non-negative finite number");
	}
	get isIdle() {
		return !this.active && this.pending.length === 0;
	}
	get didOverflow() {
		return this.overflowed;
	}
	enqueue(run, options = {}) {
		if (this.sealed) return {
			accepted: false,
			reason: "sealed"
		};
		const weight = options.weight ?? 1;
		if (!Number.isFinite(weight) || weight < 0) throw new Error("queue task weight must be a non-negative finite number");
		if (this.active && (this.pending.length >= this.options.maxPendingCount || this.pendingWeight + weight > this.options.maxPendingWeight)) {
			if (options.sealOnOverflow === false) return {
				accepted: false,
				reason: "capacity"
			};
			this.sealed = true;
			this.overflowed = true;
			return {
				accepted: false,
				reason: "overflow"
			};
		}
		let resolve;
		let reject;
		const completion = new Promise((accept, fail) => {
			resolve = accept;
			reject = fail;
		});
		const task = {
			sequence: ++this.acceptedSequence,
			weight,
			run,
			resolve: (value) => resolve(value),
			reject
		};
		this.settledPrefix = completion.then(() => void 0, () => void 0);
		if (this.active) {
			this.pending.push(task);
			this.pendingWeight += weight;
		} else {
			this.active = true;
			this.startTask(task);
		}
		return {
			accepted: true,
			completion
		};
	}
	seal() {
		this.sealed = true;
	}
	/**
	* Waits for the accepted prefix visible at call time.
	*
	* Later admissions do not extend this barrier, which keeps consult flushes
	* finite while close can seal first to drain the entire accepted prefix.
	* Success checks exclude later tasks that fail before this barrier resumes.
	*/
	flush(options = {}) {
		const prefix = this.settledPrefix;
		const sequence = this.acceptedSequence;
		if (options.requireSuccess !== true) return prefix;
		return prefix.then(() => {
			if (this.firstFailure && this.firstFailure.sequence <= sequence) throw this.firstFailure.error;
		});
	}
	startTask(task) {
		this.runTask(task);
	}
	async runTask(task) {
		try {
			task.resolve(await task.run());
		} catch (error) {
			this.firstFailure ??= {
				sequence: task.sequence,
				error
			};
			task.reject(error);
		} finally {
			const next = this.pending.shift();
			if (next) {
				this.pendingWeight -= next.weight;
				queueMicrotask(() => this.startTask(next));
			} else this.active = false;
		}
	}
};
//#endregion
export { BoundedSerialQueue as t };
