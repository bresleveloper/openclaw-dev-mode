import { m as resolveUserPath } from "./utils-CRO4LGEB.js";
import { i as resolveAgentModelPrimaryValue } from "./model-input-B5RmygIK.js";
import { t as appendCrestodianAuditEntry } from "./audit-CLdXzhcz.js";
import { o as transformConfigWithPendingPluginInstalls } from "./plugins-install-record-commit-Dci_oYIb.js";
import { t as mergeWizardConfigOntoLatest } from "./setup.shared-DcRpwcRn.js";
//#region src/crestodian/model-setup.ts
async function runCrestodianModelSetup(params) {
	const [{ DEFAULT_WORKSPACE }, { readSetupConfigFileSnapshot }] = await Promise.all([import("./onboard-helpers-C3VZoo6M.js"), import("./setup.shared-BQEP9sD0.js")]);
	const before = await readSetupConfigFileSnapshot();
	if (before.exists && !before.valid) throw new Error("openclaw.json is invalid; run `openclaw doctor` before model setup");
	const baseConfig = before.exists ? before.sourceConfig ?? before.config : {};
	const workspace = resolveUserPath(params.workspace?.trim() || baseConfig.agents?.defaults?.workspace?.trim() || DEFAULT_WORKSPACE);
	const { runSetupModelAuthStep } = await import("./setup.model-auth-JEqY_7Ko.js");
	const nextConfig = await runSetupModelAuthStep({
		config: baseConfig,
		opts: {},
		prompter: params.prompter,
		runtime: params.runtime,
		workspaceDir: workspace
	});
	const committed = await transformConfigWithPendingPluginInstalls({
		afterWrite: { mode: "auto" },
		writeOptions: { allowConfigSizeDrop: false },
		transform: (currentConfig, context) => {
			if (!context.snapshot.valid) throw new Error("openclaw.json became invalid during model setup; run `openclaw doctor`");
			return { nextConfig: mergeWizardConfigOntoLatest(currentConfig, baseConfig, nextConfig) };
		}
	});
	const model = resolveAgentModelPrimaryValue(committed.nextConfig.agents?.defaults?.model);
	await appendCrestodianAuditEntry({
		operation: "models.setup",
		summary: model ? `Configured model provider with ${model}` : "Ran model provider setup",
		configPath: committed.path,
		configHashBefore: committed.previousHash,
		configHashAfter: committed.persistedHash,
		details: {
			workspace,
			...model ? { model } : {}
		}
	});
	return model ? { model } : {};
}
//#endregion
export { runCrestodianModelSetup };
