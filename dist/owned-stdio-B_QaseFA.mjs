import { t as createChildAdapter } from "./child-WoujtRwa.mjs";
//#region src/shared/settle-within.ts
/** A deadline bounds waiting; fulfillment alone does not certify resource cleanup. */
async function settlesWithin(promise, timeoutMs) {
	let timer;
	try {
		return await Promise.race([promise.then(() => true), new Promise((resolve) => {
			timer = setTimeout(() => resolve(false), timeoutMs);
			timer.unref?.();
		})]);
	} finally {
		clearTimeout(timer);
	}
}
//#endregion
//#region src/process/owned-stdio.ts
var OwnedStdioCleanupError = class extends Error {};
async function createOwnedStdioProcess(params) {
	let startupCleanup;
	try {
		const { adapter, ready } = await createChildAdapter({
			...params,
			ownProcessTree: true,
			stdinMode: "pipe-open",
			onSpawnCleanup: (cleanup) => {
				startupCleanup = cleanup.then(() => true, () => false);
			}
		});
		await ready;
		return adapter;
	} catch (error) {
		if (startupCleanup && (!await settlesWithin(startupCleanup, 500) || !await startupCleanup)) throw new OwnedStdioCleanupError("stdio startup cleanup did not confirm closure", { cause: error });
		throw error;
	}
}
/** Protocol EOF requests shutdown; only the spawn owner can certify descendant extinction. */
async function closeOwnedStdioProcess(process, options = {}) {
	const settled = Promise.allSettled([process.wait(), process.waitForExtinction?.() ?? Promise.reject(/* @__PURE__ */ new Error("stdio process cleanup cannot confirm descendant extinction"))]);
	try {
		if (!options.force) {
			try {
				process.stdin?.end();
			} catch {
				process.kill("SIGTERM");
			}
			const graceMs = options.graceMs ?? 2e3;
			if (!await settlesWithin(settled, graceMs)) {
				process.kill("SIGTERM");
				if (!await settlesWithin(settled, graceMs)) process.kill("SIGKILL");
			}
		} else process.kill("SIGKILL");
		const failure = (await settled).find((result) => result.status === "rejected");
		if (failure) throw failure.reason;
		return process.cleanupResult;
	} finally {
		process.dispose();
	}
}
//#endregion
export { settlesWithin as i, closeOwnedStdioProcess as n, createOwnedStdioProcess as r, OwnedStdioCleanupError as t };
