import { t as stableStringify } from "./stable-stringify-CkQ0IEj1.mjs";
import { n as sha256Hex } from "./node-crypto-Df3MIs6V.mjs";
import "./crypto-digest-D9Nqq3c7.mjs";
import { r as readServiceFileState } from "./service-stage-CuqWOVHS.mjs";
import { AsyncLocalStorage } from "node:async_hooks";
//#region src/daemon/service-rebind.ts
const captures = new AsyncLocalStorage();
/** Content/identity evidence only. Neither a digest nor a receipt grants mutation authority. */
async function fingerprintGatewayServiceDefinition(command) {
	if (!command) throw new Error("Managed service definition is unavailable.");
	const paths = [.../* @__PURE__ */ new Set([...command.definitionPaths ?? [], ...command.sourcePath ? [command.sourcePath] : []])].toSorted();
	const files = await Promise.all(paths.map(async (file) => ({
		path: file,
		state: await readServiceFileState(file)
	})));
	if (files.some((file) => !file.state)) throw new Error("Managed service definition disappeared.");
	return sha256Hex(stableStringify({
		command,
		files
	}));
}
/** Installed only inside an admitted receiver's live executor, never from a saved receipt. */
async function withGatewayServiceRebindCapture(before, operation, runtimePinBefore) {
	if (!/^[a-f0-9]{64}$/.test(before)) throw new Error("Invalid original definition binding.");
	if (runtimePinBefore !== void 0 && !/^[a-f0-9]{64}$/.test(runtimePinBefore)) throw new Error("Invalid original runtime intent binding.");
	const capture = {
		before,
		runtimePinBefore,
		active: true
	};
	try {
		return await captures.run(capture, operation);
	} finally {
		capture.active = false;
	}
}
function currentGatewayServiceRebindReceipt() {
	const capture = captures.getStore();
	return capture?.active ? capture.receipt : void 0;
}
/** Called under the final native operation lock, including the failing-install path. */
async function captureGatewayServiceRebind(read, assertCurrent, mutate, readRuntimePinRevision) {
	const capture = captures.getStore();
	if (!capture) return await mutate(false);
	if (!capture.active || capture.refresh) throw new Error("Original service rebind interval is closed.");
	const before = await fingerprintGatewayServiceDefinition(await read());
	assertCurrent();
	if (before !== capture.before) throw new Error("Original service definition changed before rebind.");
	const runtimePinBefore = readRuntimePinRevision?.();
	assertCurrent();
	if (capture.runtimePinBefore !== void 0 && runtimePinBefore !== capture.runtimePinBefore) throw new Error("Original runtime intent changed before rebind.");
	capture.refresh = async (assertFinalCurrent) => {
		capture.receipt = void 0;
		if (!capture.active) throw new Error("Original service rebind interval is closed.");
		assertFinalCurrent();
		const after = await fingerprintGatewayServiceDefinition(await read());
		assertFinalCurrent();
		const runtimePinAfter = readRuntimePinRevision?.();
		assertFinalCurrent();
		if (after !== before || runtimePinAfter !== runtimePinBefore) capture.mutated = true;
		capture.receipt = {
			before,
			after,
			...capture.mutated ? { mutated: true } : {},
			...runtimePinBefore !== void 0 ? {
				runtimePinBefore,
				runtimePinAfter
			} : {}
		};
	};
	try {
		return await mutate(true);
	} finally {
		await capture.refresh(assertCurrent);
	}
}
/** The installer may compensate outside the inner service writer. Observe its
* final definition under the surrounding native lock, before emitting a receipt. */
async function settleGatewayServiceRebind(assertCurrent, operation) {
	const capture = captures.getStore();
	if (!capture) return await operation();
	const [outcome] = await Promise.allSettled([operation()]);
	try {
		await capture.refresh?.(assertCurrent);
	} catch (error) {
		if (outcome.status === "rejected") throw new AggregateError([outcome.reason, error], "Service rebind settlement could not be verified.", { cause: error });
		throw error;
	}
	if (outcome.status === "rejected") throw outcome.reason;
	return outcome.value;
}
//#endregion
export { withGatewayServiceRebindCapture as a, settleGatewayServiceRebind as i, currentGatewayServiceRebindReceipt as n, fingerprintGatewayServiceDefinition as r, captureGatewayServiceRebind as t };
