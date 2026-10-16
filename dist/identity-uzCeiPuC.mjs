import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { o as resolveAgentEntry } from "./agent-scope-config-CDYpzA0r.mjs";
import "./session-key-C09ow4h0.mjs";
import { r as resolveChannelAccountEntry } from "./account-lookup-D_rRUHd5.mjs";
//#region src/agents/identity.ts
const DEFAULT_ACK_REACTION = "👀";
/** Resolve the configured identity block for one agent. */
function resolveAgentIdentity(cfg, agentId) {
	return resolveAgentEntry(cfg, normalizeAgentId(agentId))?.identity;
}
/** Resolve the acknowledgement reaction using account, channel, global, then identity fallback. */
function resolveAckReaction(cfg, agentId, opts) {
	const configured = resolveChannelMessageSetting(cfg, "ackReaction", opts);
	if (configured !== void 0) return configured.trim();
	return resolveAgentIdentity(cfg, agentId)?.emoji?.trim() || DEFAULT_ACK_REACTION;
}
/** Build the automatic `[name]` prefix for an agent identity. */
function resolveIdentityNamePrefix(cfg, agentId) {
	const name = resolveAgentIdentity(cfg, agentId)?.name?.trim();
	if (!name) return;
	return `[${name}]`;
}
function getChannelConfig(cfg, channel) {
	const value = cfg.channels?.[channel];
	return typeof value === "object" && value !== null ? value : void 0;
}
/** Preserve explicit empty settings through account, channel, and global precedence. */
function resolveChannelMessageSetting(cfg, key, opts) {
	if (opts?.channel) {
		const channelCfg = getChannelConfig(cfg, opts.channel);
		if (opts.accountId) {
			const accounts = channelCfg?.accounts;
			const accountValue = resolveChannelAccountEntry(accounts, opts.accountId, opts.channel, (id) => id)?.[key];
			if (accountValue !== void 0) return accountValue;
		}
		const channelValue = channelCfg?.[key];
		if (channelValue !== void 0) return channelValue;
	}
	return cfg.messages?.[key];
}
/** Resolve the optional response prefix, expanding `auto` to the identity name prefix. */
function resolveResponsePrefix(cfg, agentId, opts) {
	const configured = resolveChannelMessageSetting(cfg, "responsePrefix", opts);
	return configured === "auto" ? resolveIdentityNamePrefix(cfg, agentId) : configured;
}
/** Resolve message and response prefix values together for channel delivery. */
function resolveEffectiveMessagesConfig(cfg, agentId, opts) {
	return {
		messagePrefix: opts?.hasAllowFrom === true ? "" : resolveIdentityNamePrefix(cfg, agentId) ?? opts?.fallbackMessagePrefix ?? "[openclaw]",
		responsePrefix: resolveResponsePrefix(cfg, agentId, opts)
	};
}
/** Resolve per-agent human-delay settings over global agent defaults. */
function resolveHumanDelayConfig(cfg, agentId) {
	const defaults = cfg.agents?.defaults?.humanDelay;
	const overrides = resolveAgentEntry(cfg, normalizeAgentId(agentId))?.humanDelay;
	if (!defaults && !overrides) return;
	return {
		mode: overrides?.mode ?? defaults?.mode,
		minMs: overrides?.minMs ?? defaults?.minMs,
		maxMs: overrides?.maxMs ?? defaults?.maxMs
	};
}
//#endregion
export { resolveIdentityNamePrefix as a, resolveHumanDelayConfig as i, resolveAgentIdentity as n, resolveResponsePrefix as o, resolveEffectiveMessagesConfig as r, resolveAckReaction as t };
