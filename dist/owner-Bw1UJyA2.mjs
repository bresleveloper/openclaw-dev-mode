import { f as resolveAgentWorkspaceDir, h as resolveConfiguredAgentId, l as resolveAgentOperationAgentId } from "./agent-scope-config-fjA2T9Gz.mjs";
import "./agent-scope-DXrnO3F4.mjs";
//#region src/commands/channel-setup/owner.ts
/** Validate the selected operation owner before using its workspace for discovery. */
function resolveChannelSetupOwner(cfg, requestedAgentId) {
	const requested = requestedAgentId?.trim();
	if (requestedAgentId !== void 0 && !requested) throw new Error("--agent must not be blank");
	const agentId = resolveConfiguredAgentId(cfg, requested ?? resolveAgentOperationAgentId(cfg, void 0, {
		surface: "channel plugin discovery",
		hint: "Pass --agent <id> to channels commands or set agents.defaults.systemAgent.agentId."
	}));
	return {
		agentId,
		workspaceDir: resolveAgentWorkspaceDir(cfg, agentId)
	};
}
//#endregion
export { resolveChannelSetupOwner as t };
