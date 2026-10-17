import { a as isConfigReadFailure, t as configFailureHeading } from "./io.invalid-config-BzeD3bi5.mjs";
import { t as formatCliCommand } from "./command-format-DwEdrDKL.mjs";
import { t as exitCliAfterOutput } from "./one-shot-exit-Bd4757D_.mjs";
import { r as isPluginPackagingRuntimeOutputInvalidConfigSnapshot } from "./recovery-policy-CgbblNbu.mjs";
import { c as readConfigFileSnapshot, u as readConfigFileSnapshotForWrite } from "./io.runtime-BSum32pK.mjs";
import "./config-9720xhC5.mjs";
import { r as isJsonOutputModeActive } from "./json-output-mode-DhC0xNZP.mjs";
import { n as formatPluginPackagingRuntimeOutputRecoveryHint } from "./config-recovery-hints-BcovfhC8.mjs";
import { t as renderConfigValidationIssueLines } from "./issue-location-nU8-G0tV.mjs";
//#region src/commands/config-validation.ts
/** Read the config file and exit through the runtime when validation fails. */
async function requireValidConfigFileSnapshot(runtime, opts) {
	const readOptions = {
		...opts?.observe === false ? { observe: false } : {},
		...opts?.skipPluginValidation ? { skipPluginValidation: true } : {}
	};
	return validateConfigFileSnapshot(opts?.adoptPluginMetadata ? (await (await import("./command-config-snapshot-BN8d01j_.mjs")).readCommandConfigSnapshot(readOptions)).snapshot : await readConfigFileSnapshot(Object.keys(readOptions).length > 0 ? readOptions : void 0), runtime);
}
/** Preserve native read-time ownership through commands that can write after awaits. */
async function requireValidConfigForWrite(runtime) {
	const read = await readConfigFileSnapshotForWrite();
	if (!await validateConfigFileSnapshot(read.snapshot, runtime)) return null;
	return read;
}
/** Each command phase owns prepared facts; installation ends the preceding metadata scope. */
async function withCommandPluginMetadata(params, run) {
	const [{ completePluginMetadataSnapshot, resolvePluginMetadataSnapshot }, { withPluginMetadataSnapshotScope }] = await Promise.all([import("./plugin-metadata-snapshot-DcoK08YM.mjs"), import("./current-plugin-metadata-snapshot-DwYzXsSh.mjs")]);
	return await withPluginMetadataSnapshotScope(completePluginMetadataSnapshot(params) ?? resolvePluginMetadataSnapshot(params), run, {
		config: params.config,
		workspaceDir: params.workspaceDir
	});
}
async function validateConfigFileSnapshot(snapshot, runtime) {
	if (snapshot.exists && !snapshot.valid) {
		if (isJsonOutputModeActive(process.argv)) {
			const { writeInvalidConfigCliJson } = await import("./config-validation-output-erKJV715.mjs");
			writeInvalidConfigCliJson(runtime, snapshot);
			exitCliAfterOutput(runtime, 1);
		}
		const issues = snapshot.issues.length > 0 ? renderConfigValidationIssueLines(snapshot).join("\n") : "Unknown validation issue.";
		runtime.error(`${configFailureHeading(snapshot)}: ${snapshot.path}\n${issues}`);
		runtime.error(isConfigReadFailure(snapshot) ? "Resolve the read error shown above, then retry." : isPluginPackagingRuntimeOutputInvalidConfigSnapshot(snapshot) ? `Fix: ${formatPluginPackagingRuntimeOutputRecoveryHint()}` : `Fix: ${formatCliCommand("openclaw doctor --fix")}`);
		runtime.error(`Inspect: ${formatCliCommand("openclaw config validate")}`);
		runtime.exit(1);
		return null;
	}
	return snapshot;
}
/** Read and return a valid OpenClaw config, or null after reporting validation errors. */
async function requireValidConfig(runtime, opts) {
	return (await requireValidConfigFileSnapshot(runtime, opts))?.config ?? null;
}
//#endregion
export { withCommandPluginMetadata as i, requireValidConfigFileSnapshot as n, requireValidConfigForWrite as r, requireValidConfig as t };
