import { s as formatErrorMessage } from "./error-coercion-BwMr25F8.mjs";
import { t as settlesWithin } from "./settle-within-DLEx44ea.mjs";
import { t as createChildAdapter } from "./child-DngHEd7s.mjs";
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
				startupCleanup = cleanup.then(() => ({}), (failure) => ({ failure }));
			}
		});
		await ready;
		return adapter;
	} catch (error) {
		if (!startupCleanup) throw error;
		const cleanup = await settlesWithin(startupCleanup, 5e3) ? await startupCleanup : { failure: /* @__PURE__ */ new Error("stdio startup cleanup did not settle within 5s") };
		if (!("failure" in cleanup)) throw error;
		throw new OwnedStdioCleanupError(`${formatErrorMessage(error)}; stdio startup cleanup also did not confirm closure, so restart the Gateway before retrying`, { cause: new AggregateError([error, cleanup.failure], formatErrorMessage(error)) });
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
export { closeOwnedStdioProcess as n, createOwnedStdioProcess as r, OwnedStdioCleanupError as t };
