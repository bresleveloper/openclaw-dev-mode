import { t as splitTrailingAuthProfile } from "./model-ref-profile-BNjB2hED.mjs";
import { o as resolveAgentEffectiveModelPrimary } from "./agent-scope-CG17uXFn.mjs";
import { r as callGateway } from "./call-DnqhP17M.mjs";
import { x as toSavedAuthSetupKind } from "./setup-inference-core-DRaaZAu8.mjs";
import { t as activateSetupInference } from "./setup-inference-CZ9mnfHf.mjs";
import { i as loadValidConfigSnapshotOrThrow, l as resolveModelsTargetAgent } from "./shared-CiQX6hqA.mjs";
import { n as refreshRunningGatewayAuthState } from "./auth-refresh-CqPLnyJc.mjs";
//#region src/commands/models/auth-activate.ts
async function modelsAuthActivateCommand(opts, runtime) {
	const { runtimeConfig } = await loadValidConfigSnapshotOrThrow();
	const { agentId } = resolveModelsTargetAgent(runtimeConfig, opts.agent, { kind: "mutation" });
	const result = await activateSetupInference({
		kind: toSavedAuthSetupKind(opts.profileId.trim()),
		agentId,
		surface: "cli",
		activationConfirmed: true,
		runtime
	});
	if (!result.ok) throw new Error(result.error);
	const refreshed = await refreshRunningGatewayAuthState(agentId, "update", runtime);
	for (const line of result.lines) runtime.log(line);
	let applied = false;
	if (refreshed === "refreshed") try {
		const current = await callGateway({
			method: "config.get",
			params: {},
			timeoutMs: 3e3,
			requireLocalBackendSharedAuth: true
		});
		applied = current.configRevisionHash === current.appliedConfigHash && splitTrailingAuthProfile(resolveAgentEffectiveModelPrimary(current.config, agentId) ?? "").profile === opts.profileId.trim();
	} catch {}
	runtime.log(applied ? `Saved sign-in activated for ${agentId}: ${opts.profileId}` : "Sign-in verified and saved. The running connection could not be confirmed. Run `openclaw gateway restart` to apply the saved settings.");
}
//#endregion
export { modelsAuthActivateCommand };
