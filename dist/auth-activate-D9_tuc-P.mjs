import { t as splitTrailingAuthProfile } from "./model-ref-profile-BIKs-96s.mjs";
import { o as resolveAgentEffectiveModelPrimary } from "./agent-scope-CTuYDtny.mjs";
import { o as callGateway } from "./call-C_MP4_Gs.mjs";
import { x as toSavedAuthSetupKind } from "./setup-inference-core-BJt7syGS.mjs";
import { t as activateSetupInference } from "./setup-inference-CrngN_Xl.mjs";
import { i as loadValidConfigSnapshotOrThrow, l as resolveModelsTargetAgent } from "./shared-yzzedLUF.mjs";
import { t as refreshRunningGatewayAuthState } from "./auth-refresh-BO5R6QVA.mjs";
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
