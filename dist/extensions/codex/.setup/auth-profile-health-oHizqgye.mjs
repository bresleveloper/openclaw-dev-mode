import { r as formatCodexAuthProfileUnavailableMessage, t as CODEX_NATIVE_PROFILE_IMPORT_COMMAND } from "./auth-profile-recovery-BREezV0L.mjs";
//#region extensions/codex/src/auth-profile-health.ts
const CHECK_ID = "codex/native-profile-recovery";
const PROFILE_ID = "openai:default";
async function collectFindings(config, env) {
	const declared = config.auth?.profiles?.[PROFILE_ID];
	if (declared?.provider !== "openai" || declared.mode !== "oauth") return [];
	const [{ loadAuthProfileStoreForRuntime }, { listAgentIds, resolveAgentDir }] = await Promise.all([import("openclaw/plugin-sdk/agent-runtime"), import("openclaw/plugin-sdk/agent-scope-runtime")]);
	const findings = [];
	const missing = [];
	for (const agentId of listAgentIds(config)) try {
		if (!loadAuthProfileStoreForRuntime(resolveAgentDir(config, agentId, env), {
			readOnly: true,
			config,
			externalCli: { mode: "none" }
		}, env).profiles[PROFILE_ID]) missing.push(agentId);
	} catch (error) {
		findings.push({
			checkId: CHECK_ID,
			source: "codex",
			severity: "warning",
			message: `Could not inspect OpenAI auth profiles for agent "${agentId}": ${error instanceof Error ? error.message : String(error)}`,
			fixHint: "openclaw doctor --fix"
		});
	}
	if (missing.length > 0) findings.push({
		checkId: CHECK_ID,
		source: "codex",
		severity: "warning",
		message: `${formatCodexAuthProfileUnavailableMessage(PROFILE_ID)} Affected agents: ${missing.join(", ")}.`,
		fixHint: CODEX_NATIVE_PROFILE_IMPORT_COMMAND
	});
	return findings;
}
const codexNativeProfileRecoveryHealthCheck = {
	id: CHECK_ID,
	kind: "plugin",
	source: "codex",
	description: "Explain recovery for a configured profile formerly supplied by native Codex login.",
	detect: (ctx) => collectFindings(ctx.cfg, ctx.env ?? process.env)
};
const codexNativeProfileRecoveryService = {
	id: CHECK_ID,
	async start(ctx) {
		const findings = await collectFindings(ctx.config, {
			...process.env,
			OPENCLAW_STATE_DIR: ctx.stateDir
		});
		for (const finding of findings) ctx.logger.warn(finding.message);
	}
};
//#endregion
export { codexNativeProfileRecoveryService as n, codexNativeProfileRecoveryHealthCheck as t };
