import { r as defaultRuntime } from "./runtime-DlO3PTAd.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { t as exitCliAfterOutput } from "./one-shot-exit-Bd4757D_.mjs";
import { c as parseUpdateTimeoutMs, p as resolveUpdateRoot } from "./shared-D-l8dmoD.mjs";
import { n as inspectImmutableInstall, r as prepareImmutableUpdate, t as adoptImmutableInstall } from "./update-immutable-install-C2Prgk-C.mjs";
//#region src/cli/update-cli/update-command-immutable.ts
const PREPARATION_ONLY = "Preparation only. Enable activation explicitly with openclaw update adopt-immutable --enable-activation and the installation's original adoption arguments.";
const ACTIVATION_MESSAGES = {
	succeeded: "Immutable activation verified; the recovery record was retired.",
	"rolled-back": "The sealed predecessor is serving. The activation record remains available for openclaw update recover.",
	"already-current": "The immutable installation has no activation work to recover.",
	pending: "Immutable activation remains pending. Run openclaw update recover --root <installation-root> to verify the serving generation."
};
function activationMessage(result) {
	return result.status === "error" ? `Immutable activation failed: ${result.reason ?? "inspect the retained activation record"}.` : ACTIVATION_MESSAGES[result.status];
}
function exitFailedActivation(result) {
	if (!["succeeded", "already-current"].includes(result.status)) exitCliAfterOutput(defaultRuntime, 1);
}
function reportImmutableFailure(error, json, reason = "immutable-preparation-refused") {
	const message = formatErrorMessage(error);
	if (json) defaultRuntime.writeJson({
		status: "error",
		installKind: "immutable",
		reason,
		message
	});
	else defaultRuntime.error(message);
	return exitCliAfterOutput(defaultRuntime, 1);
}
async function refuseImmutableUpdateActivation(root, opts) {
	let installation;
	try {
		installation = await inspectImmutableInstall(root);
	} catch (error) {
		return reportImmutableFailure(error, opts.json);
	}
	if (installation) reportImmutableFailure("Immutable installations use openclaw update for preparation and enabled activation, or openclaw update recover --root <installation-root> for retained recovery. update repair does not own this installation.", opts.json, "immutable-repair-unsupported");
}
/** Dispatch before the mutable updater admits state, retains runtime, or inspects services. */
async function tryRunImmutableUpdateCommand(opts) {
	const root = opts.sourceUpdate?.root ?? await resolveUpdateRoot();
	let installation;
	try {
		installation = await inspectImmutableInstall(root);
	} catch (error) {
		return reportImmutableFailure(error, opts.json);
	}
	if (!installation) {
		if (opts.drainTimeout !== void 0) throw new Error("--drain-timeout requires an adopted immutable installation.");
		return false;
	}
	let result;
	let drainTimeoutMs;
	try {
		drainTimeoutMs = parseUpdateTimeoutMs(opts.drainTimeout, "--drain-timeout");
		if (opts.channel !== void 0 && opts.channel !== "dev" || opts.tag !== void 0 || opts.reapplyLocalOverrides || opts.sourceUpdate || opts.recovery || opts.run) throw new Error("Immutable updates support official main or --sha only. Use openclaw update recover --root <installation-root> for retained activation recovery; channel switching and package overrides are unsupported.");
		result = await prepareImmutableUpdate({
			root,
			sha: opts.sha,
			dryRun: opts.dryRun,
			timeoutMs: parseUpdateTimeoutMs(opts.timeout)
		});
	} catch (error) {
		return reportImmutableFailure(error, opts.json);
	}
	const receipts = [];
	let activation = !installation.activationEnabled ? "disabled" : opts.restart === false ? "skipped" : result.status === "dry-run" ? "planned" : "not-needed";
	if (result.status === "prepared" && installation.activationEnabled && opts.restart !== false) try {
		const { activateImmutableUpdate } = await import("./update-immutable-activation-CdI6w9Av.mjs");
		const expectedPrepared = result.installation.prepared;
		if (!expectedPrepared) throw new Error("Immutable preparation returned no generation receipt; activation was not attempted.");
		activation = await activateImmutableUpdate({
			root: installation.root,
			expectedPrepared,
			timeoutMs: parseUpdateTimeoutMs(opts.timeout),
			drainTimeoutMs,
			onReceipt: (line) => {
				receipts.push(line);
				if (!opts.json) defaultRuntime.log(line);
			}
		});
	} catch (error) {
		return reportImmutableFailure(error, opts.json, "immutable-activation-failed");
	}
	const message = result.status === "error" ? "Immutable preparation failed; the selected generation was preserved." : typeof activation !== "string" ? activationMessage(activation) : activation === "disabled" ? PREPARATION_ONLY : activation === "skipped" ? "Sealed generation preparation completed; activation was skipped by --no-restart." : activation === "planned" ? "Would activate the prepared generation under the enabled adoption record." : "No immutable activation was needed.";
	if (opts.json) defaultRuntime.writeJson({
		...result,
		...typeof activation !== "string" ? {
			status: activation.status,
			installation: activation.installation
		} : {},
		installKind: "immutable",
		activation,
		receipts,
		message
	});
	else {
		const target = result.targetSha ? ` ${result.targetSha}` : "";
		defaultRuntime.log(result.status === "already-current" ? `Immutable generation${target} is already current.` : result.status === "dry-run" ? `Would prepare immutable generation${target}.` : result.status === "prepared" ? `Prepared immutable generation${target}.` : `Immutable preparation failed: ${result.reason ?? "candidate preparation failed"}.`);
		for (const warning of result.warnings) defaultRuntime.error(`Warning: ${warning}`);
		defaultRuntime.log(message);
		if (typeof activation !== "string" && activation.recoveryCommand) defaultRuntime.log(`Recovery: ${activation.recoveryCommand}`);
	}
	if (result.status === "error") exitCliAfterOutput(defaultRuntime, 1);
	if (typeof activation !== "string") exitFailedActivation(activation);
	return true;
}
async function updateAdoptImmutableCommand(opts) {
	let installation;
	try {
		installation = await adoptImmutableInstall(opts);
	} catch (error) {
		return reportImmutableFailure(error, opts.json);
	}
	if (opts.json) defaultRuntime.writeJson({
		status: "adopted",
		installKind: "immutable",
		installation,
		activation: installation.activationEnabled ? "enabled" : "disabled"
	});
	else {
		defaultRuntime.log(installation.activationEnabled ? "Recorded immutable installation ownership with native activation enabled. openclaw update can prepare, activate, and verify sealed generations." : "Recorded immutable installation ownership. openclaw update can now prepare sealed generations.");
		if (!installation.activationEnabled) defaultRuntime.log(PREPARATION_ONLY);
	}
}
async function updateRecoverImmutableCommand(opts) {
	const receipts = [];
	let result;
	try {
		const { recoverImmutableUpdate } = await import("./update-immutable-activation-CdI6w9Av.mjs");
		result = await recoverImmutableUpdate({
			root: opts.root,
			timeoutMs: parseUpdateTimeoutMs(opts.timeout),
			drainTimeoutMs: parseUpdateTimeoutMs(opts.drainTimeout, "--drain-timeout"),
			onReceipt: (line) => {
				receipts.push(line);
				if (!opts.json) defaultRuntime.log(line);
			}
		});
	} catch (error) {
		return reportImmutableFailure(error, opts.json, "immutable-recovery-failed");
	}
	if (opts.json) defaultRuntime.writeJson({
		...result,
		installKind: "immutable",
		receipts
	});
	else {
		defaultRuntime.log(activationMessage(result));
		if (result.recoveryCommand) defaultRuntime.log(`Recovery: ${result.recoveryCommand}`);
	}
	exitFailedActivation(result);
}
//#endregion
export { updateRecoverImmutableCommand as i, tryRunImmutableUpdateCommand as n, updateAdoptImmutableCommand as r, refuseImmutableUpdateActivation as t };
