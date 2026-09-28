import "./src-CZ2wJvNB.mjs";
import { t as expectDefined } from "./expect-lbe3Hgrh.mjs";
import { n as readConfigMachineState } from "./config-machine-state-BfMkd608.mjs";
import { r as updateConfigMachineState } from "./config-machine-state-write-CSLKAek3.mjs";
//#region src/hooks/installs.ts
/** Read canonical hook install records from machine state. */
function readHookInstalls(options = {}) {
	return readConfigMachineState("hooks.internal.installs", options) ?? {};
}
/** Persist one hook install record in machine state. */
function recordHookInstall(update, options = {}) {
	const { hookId, ...record } = update;
	let receipt;
	updateConfigMachineState("hooks.internal.installs", (current) => {
		const previous = current && Object.hasOwn(current, hookId) ? current[hookId] : void 0;
		const written = {
			...previous,
			...record,
			installedAt: record.installedAt ?? (/* @__PURE__ */ new Date()).toISOString()
		};
		receipt = {
			hookId,
			previous,
			writtenJson: JSON.stringify(written),
			bucketExisted: current !== void 0
		};
		return {
			...current,
			[hookId]: written
		};
	}, options);
	return expectDefined(receipt, "hook install write receipt");
}
/** Undo only this install's record, preserving unrelated or newer writers. */
function restoreHookInstallIfCurrent(receipt, options = {}) {
	let restored = false;
	updateConfigMachineState("hooks.internal.installs", (current) => {
		if (!current || !Object.hasOwn(current, receipt.hookId) || JSON.stringify(current[receipt.hookId]) !== receipt.writtenJson) return current;
		const next = { ...current };
		if (receipt.previous) next[receipt.hookId] = receipt.previous;
		else delete next[receipt.hookId];
		restored = true;
		return !receipt.bucketExisted && Object.keys(next).length === 0 ? void 0 : next;
	}, options);
	return restored;
}
//#endregion
export { recordHookInstall as n, restoreHookInstallIfCurrent as r, readHookInstalls as t };
