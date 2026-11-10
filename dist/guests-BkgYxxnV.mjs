import { r as resolveAgentConfig } from "./agent-scope-config-fjA2T9Gz.mjs";
import { o as resolveAgentRoute } from "./resolve-route-DvaXhzgP.mjs";
import "./routing-Dl7FngGa.mjs";
import "./agent-scope-runtime-Dld1eD8B.mjs";
import { n as resolveXGuestSettings } from "./guest-policy-BDR2IA-u.mjs";
import { n as XGuestUsageUnavailableError, r as openXGuestUsage } from "./guest-usage-AjpeBr4l.mjs";
//#region extensions/x/src/guests.ts
function resolveXGuestContainmentError(cfg, agentId) {
	const agent = resolveAgentConfig(cfg, agentId);
	if ((agent?.tools?.fs?.workspaceOnly ?? cfg.tools?.fs?.workspaceOnly) !== true) return `X guest mode requires agents.entries.${agentId}.tools.fs.workspaceOnly=true (or tools.fs.workspaceOnly=true) and the OpenClaw clone as the agent working directory.`;
	const skills = agent?.skills ?? cfg.agents?.defaults?.skills;
	if (!skills || skills.length !== 0) return `X guest mode requires agents.entries.${agentId}.skills=[] so read cannot access external skill directories.`;
	const sandbox = agent?.sandbox;
	const defaults = cfg.agents?.defaults?.sandbox;
	if ((sandbox?.mode ?? defaults?.mode ?? "off") !== "off") return `X guest mode requires agents.entries.${agentId}.sandbox.mode="off" and workspace-only file tools; sandbox mounts can expose files outside the repository.`;
	const queueMode = cfg.messages?.queue?.byChannel?.x ?? cfg.messages?.queue?.mode ?? "steer";
	if (queueMode !== "followup" && queueMode !== "collect") return "X guest mode requires messages.queue.byChannel.x=\"followup\" or \"collect\" (or messages.queue.mode with either value) so guests cannot steer or interrupt an active turn.";
}
function resolveXGuestReadinessError(cfg, accountId, routedAgentId) {
	const peerIds = /* @__PURE__ */ new Set(["__x_guest_default__", ...(cfg.bindings ?? []).flatMap((binding) => binding.match.channel === "x" && binding.match.peer?.kind === "group" ? [binding.match.peer.id] : [])]);
	let agentIds;
	try {
		agentIds = routedAgentId ? [routedAgentId] : [...peerIds].map((id) => resolveAgentRoute({
			cfg,
			channel: "x",
			accountId,
			peer: {
				kind: "group",
				id
			}
		}).agentId);
	} catch {
		return "X guest mode requires valid X agent bindings. Add a channel-wide X binding and correct any missing target agents.";
	}
	const failures = [...new Set(agentIds)].flatMap((id) => resolveXGuestContainmentError(cfg, id) ?? []);
	return failures.length ? failures.join(" ") : void 0;
}
async function getXGuestStatus(runtime, account, cfg, routedAgentId) {
	const { enabled, maxMentionsPerAuthorPerDay } = resolveXGuestSettings(account);
	const blockedReason = enabled ? resolveXGuestReadinessError(cfg, account.accountId, routedAgentId) : void 0;
	try {
		return {
			enabled,
			helpersAvailable: true,
			maxMentionsPerAuthorPerDay,
			...blockedReason ? { blockedReason } : {},
			...await openXGuestUsage(runtime).counts(account.accountId)
		};
	} catch (error) {
		if (!(error instanceof XGuestUsageUnavailableError)) throw error;
		return {
			enabled,
			helpersAvailable: true,
			maxMentionsPerAuthorPerDay,
			admittedToday: 0,
			rateLimitedToday: 0,
			blockedReason: error.message
		};
	}
}
//#endregion
export { resolveXGuestContainmentError as n, getXGuestStatus as t };
