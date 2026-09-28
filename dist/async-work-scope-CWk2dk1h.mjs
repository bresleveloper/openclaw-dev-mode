import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { i as resolveGlobalSingleton } from "./global-singleton-Dc_stLtU.mjs";
import { AsyncLocalStorage, AsyncResource } from "node:async_hooks";
//#region src/shared/async-work-scope.ts
const currentWorkScope = resolveGlobalSingleton(Symbol.for("openclaw.asyncWorkScope"), () => new AsyncLocalStorage());
const currentWorkScopeAncestry = resolveGlobalSingleton(Symbol.for("openclaw.asyncWorkScopeAncestry"), () => new AsyncLocalStorage());
const detachedAsyncContext = resolveGlobalSingleton(Symbol.for("openclaw.detachedAsyncContext"), () => new AsyncResource("openclaw.detached-async-context"));
/** Joins cooperating descendants even when their caller returns a cached value first. */
var AsyncWorkScope = class AsyncWorkScope {
	constructor(failures) {
		this.failures = failures;
		this.pending = /* @__PURE__ */ new Set();
		this.controller = new AbortController();
		this.phase = "open";
	}
	get signal() {
		return this.controller.signal;
	}
	get hasPendingWork() {
		return this.pending.size > 0;
	}
	get isClosing() {
		return this.phase !== "open";
	}
	enter(run) {
		const owner = currentWorkScope.getStore();
		const ancestry = currentWorkScopeAncestry.getStore();
		const parent = owner ? ancestry?.scope === owner ? ancestry : { scope: owner } : void 0;
		return currentWorkScopeAncestry.run({
			scope: this,
			parent
		}, () => currentWorkScope.run(this, run));
	}
	/** Enters synchronous work without inspecting or assimilating its return value. */
	run(run) {
		if (this.phase === "closed") throw new Error("Async work scope is closed");
		const operation = createDeferredCore();
		this.pending.add(operation.promise);
		try {
			return this.enter(run);
		} finally {
			operation.resolve();
			this.pending.delete(operation.promise);
		}
	}
	track(run) {
		if (this.phase === "closed") return Promise.reject(/* @__PURE__ */ new Error("Async work scope is closed"));
		const operation = this.registerWork();
		try {
			operation.resolve(this.enter(run));
		} catch (error) {
			operation.reject(error);
		}
		return operation.promise;
	}
	registerWork() {
		const operation = createDeferredCore();
		this.pending.add(operation.promise);
		operation.promise.then(() => this.pending.delete(operation.promise), (error) => {
			this.pending.delete(operation.promise);
			this.failures?.add(error);
		});
		return operation;
	}
	beginClose(reason) {
		if (this.phase !== "open") return;
		this.phase = "closing";
		this.controller.abort(reason);
	}
	/** Starts the next phase in the same continuation that observes settled pending work. */
	runWhenIdle(run) {
		return AsyncWorkScope.runWhenAllIdle(() => [this], () => this.track(run));
	}
	/** Reselects owners so work admitted into a later phase is not mistaken for earlier work. */
	static async runWhenAllIdle(selectScopes, run) {
		let scopes = selectScopes();
		while (scopes.some((scope) => scope.pending.size > 0)) {
			await Promise.allSettled(scopes.flatMap((scope) => Array.from(scope.pending)));
			scopes = selectScopes();
		}
		return run();
	}
	async drain() {
		this.beginClose();
		while (this.pending.size > 0) await Promise.allSettled(this.pending);
		this.phase = "closed";
	}
};
/** Inspect retained scopes by identity, including instances created by a released runtime. */
function isAsyncWorkScopeActiveHere(scope) {
	const owner = currentWorkScope.getStore();
	if (owner === scope) return true;
	const ancestry = currentWorkScopeAncestry.getStore();
	if (!owner || ancestry?.scope !== owner) return false;
	for (let frame = ancestry; frame; frame = frame.parent) if (frame.scope === scope) return true;
	return false;
}
/** Outside a managed scope, the returned promise remains the caller's responsibility. */
async function trackAsyncWork(run) {
	const scope = currentWorkScope.getStore();
	return await (scope ? scope.track(run) : run());
}
/** Captures only work ownership, never the caller's authorization or other async context. */
function captureAsyncWorkTracker() {
	const scope = currentWorkScope.getStore();
	return async (run) => await (scope ? scope.track(run) : runOutsideAsyncWorkScope(run));
}
/** Starts work its caller does not own, so the caller's scope neither waits for it nor closes under it. */
function runOutsideAsyncWorkScope(run) {
	return currentWorkScope.exit(() => currentWorkScopeAncestry.exit(run));
}
/** Runs under the context-free async root initialized before managed work can begin. */
function runInDetachedAsyncContext(run) {
	return detachedAsyncContext.runInAsyncScope(run);
}
function getAsyncWorkSignal() {
	return currentWorkScope.getStore()?.signal;
}
/** Preserves cancellation context until cooperating work ends, without delaying its result. */
async function runWithTrackedCancellation(signal, run) {
	const parentWork = currentWorkScope.getStore();
	if (!parentWork) return await run(signal);
	const result = createDeferredCore();
	parentWork.track(async () => {
		const work = new AsyncWorkScope();
		const controller = new AbortController();
		const context = work.run(() => AsyncLocalStorage.snapshot());
		const abort = () => context(() => controller.abort(signal.reason));
		const closeWork = () => context(() => work.beginClose(parentWork.signal.reason));
		signal.addEventListener("abort", abort, { once: true });
		parentWork.signal.addEventListener("abort", closeWork, { once: true });
		if (signal.aborted) abort();
		if (parentWork.signal.aborted) closeWork();
		try {
			result.resolve(await work.track(() => run(controller.signal)));
		} catch (error) {
			result.reject(error);
		} finally {
			try {
				await AsyncWorkScope.runWhenAllIdle(() => [work], () => context(() => work.drain()));
			} finally {
				signal.removeEventListener("abort", abort);
				parentWork.signal.removeEventListener("abort", closeWork);
			}
		}
	}).catch(result.reject);
	return await result.promise;
}
//#endregion
export { runInDetachedAsyncContext as a, trackAsyncWork as c, isAsyncWorkScopeActiveHere as i, captureAsyncWorkTracker as n, runOutsideAsyncWorkScope as o, getAsyncWorkSignal as r, runWithTrackedCancellation as s, AsyncWorkScope as t };
