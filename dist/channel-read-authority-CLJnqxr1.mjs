import { i as resolveGlobalSingleton } from "./global-singleton-Dc_stLtU.mjs";
import { AsyncLocalStorage } from "node:async_hooks";
//#region src/shared/channel-read-authority.ts
const completionKey = Symbol.for("openclaw.channelReadAuthority.completion");
const authorityScope = resolveGlobalSingleton(Symbol.for("openclaw.channelReadAuthority"), () => new AsyncLocalStorage());
/** Capture at request submission; retain this exact check through queues and retries. */
function captureChannelReadAuthority() {
	return authorityScope.getStore();
}
/** Internal media ownership; the SDK continues to expose only the callable assertion. */
function captureChannelReadScope() {
	return authorityScope.getStore()?.[completionKey];
}
/** Preserve the read failure while reporting failures to release its owned output. */
async function settleChannelReadResource(resource, accepted) {
	try {
		await resource.settle(accepted);
	} catch (error) {
		try {
			const [{ createSubsystemLogger }, { redactToolPayloadText }] = await Promise.all([import("./subsystem-CT4G8X3T.mjs"), import("./redact-omZQGwDV.mjs")]);
			const log = createSubsystemLogger("channels");
			const failures = error instanceof AggregateError ? error.errors : [error];
			for (const failure of failures) log.error(`Channel read output cleanup failed: ${redactToolPayloadText(String(failure))}`);
		} catch {
			console.error("Channel read output cleanup failed; diagnostic logger unavailable.");
		}
	}
}
async function settleReadResources(resources, accepted) {
	await Promise.all(Array.from(resources, (resource) => settleChannelReadResource(resource, accepted)));
	resources.clear();
}
/** Host-only entry: neither model params nor plugin declarations mint read authority. */
async function withChannelReadAuthority(assertCurrent, run, signal, onAccepted) {
	if (!assertCurrent) {
		const result = await run();
		onAccepted?.(result);
		return result;
	}
	const parent = authorityScope.getStore();
	const parentCompletion = parent?.[completionKey];
	const sourceSignals = [parentCompletion?.signal, signal].filter((source) => Boolean(source));
	const sourceSignal = sourceSignals.length > 1 ? AbortSignal.any(sourceSignals) : sourceSignals[0];
	const resources = /* @__PURE__ */ new Set();
	let open = true;
	const assertAuthority = () => {
		parent?.();
		if (!open) throw new Error("Channel read authority is no longer active.");
		sourceSignal?.throwIfAborted();
		assertCurrent();
		for (const resource of resources) resource.assertCurrent?.();
	};
	const scopedAuthority = Object.assign(assertAuthority, { [completionKey]: {
		assertCurrent: assertAuthority,
		signal: sourceSignal,
		registerResource: (resource) => {
			assertAuthority();
			resources.add({
				key: resource.key,
				settle: resource.settle,
				assertCurrent: () => {
					sourceSignal?.throwIfAborted();
					assertCurrent();
					resource.assertCurrent?.();
				}
			});
		},
		discardResource: async (key) => {
			const resource = Array.from(resources).find((entry) => entry.key === key);
			if (!resource) return await parentCompletion?.discardResource(key) ?? false;
			await settleChannelReadResource(resource, false);
			resources.delete(resource);
			return true;
		}
	} });
	assertAuthority();
	try {
		let result;
		try {
			result = await authorityScope.run(scopedAuthority, run);
		} finally {
			assertAuthority();
		}
		if (parentCompletion) {
			for (const resource of resources) parentCompletion.registerResource(resource);
			resources.clear();
		}
		onAccepted?.(result);
		open = false;
		if (resources.size > 0) await settleReadResources(resources, true);
		return result;
	} catch (error) {
		open = false;
		if (resources.size > 0) await settleReadResources(resources, false);
		throw error;
	} finally {
		open = false;
	}
}
//#endregion
export { withChannelReadAuthority as i, captureChannelReadScope as n, settleChannelReadResource as r, captureChannelReadAuthority as t };
