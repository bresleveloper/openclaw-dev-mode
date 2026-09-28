import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { n as captureAsyncWorkTracker, r as getAsyncWorkSignal, t as AsyncWorkScope } from "./async-work-scope-CWk2dk1h.mjs";
import { AsyncLocalStorage } from "node:async_hooks";
//#region src/shared/async-work-resources.ts
/** Returns the logical result while retaining resources through owned cleanup. */
async function runWithAsyncWorkResources(run, options) {
	const result = createDeferredCore();
	const trackOwner = captureAsyncWorkTracker();
	const parentSignal = getAsyncWorkSignal();
	trackOwner(async () => {
		const work = new AsyncWorkScope();
		let resources;
		let runInContext = work.run(() => AsyncLocalStorage.snapshot());
		const closeFromParent = () => runInContext(() => work.beginClose(parentSignal?.reason));
		parentSignal?.addEventListener("abort", closeFromParent, { once: true });
		if (parentSignal?.aborted) closeFromParent();
		try {
			const value = await work.track(() => run((acquired) => {
				resources = acquired;
			}, () => {
				runInContext = AsyncLocalStorage.snapshot();
			}));
			if (resources?.releaseBeforeResultWhenIdle && !work.hasPendingWork) {
				const completedResources = resources;
				resources = void 0;
				await runInContext(() => work.drain());
				await completedResources.release();
			}
			result.resolve(value);
		} catch (error) {
			if (options?.cancelOnError) {
				runInContext(() => work.beginClose(error));
				await runInContext(() => work.drain());
			}
			result.reject(error);
		} finally {
			try {
				await AsyncWorkScope.runWhenAllIdle(() => [work], () => runInContext(() => work.drain()));
			} finally {
				parentSignal?.removeEventListener("abort", closeFromParent);
				await resources?.release();
			}
		}
	}).catch(result.reject);
	return await result.promise;
}
//#endregion
export { runWithAsyncWorkResources as t };
