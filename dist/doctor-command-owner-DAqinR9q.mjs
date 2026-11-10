import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { d as normalizeStringEntries } from "./string-normalization-D6DKCpwE.mjs";
import { i as normalizeChatChannelId } from "./ids-DhLNdNuz.mjs";
import { t as formatCliCommand } from "./command-format-CYoE8cOC.mjs";
import "./message-channel-constants-B3vfipkP.mjs";
import { i as resolveChannelPluginRegistration, t as getChannelPlugin } from "./registry-B91r5qN6.mjs";
import { t as note } from "./note-CmoIRLec.mjs";
import { r as resolveReadOnlyChannelPluginsForConfig } from "./read-only-BTHRPuD9.mjs";
//#region src/commands/doctor-command-owner.ts
/** Doctor warning for missing command owners on privileged channel commands. */
/** Resolve installed setup contracts without activating channel runtimes during Doctor. */
function createCommandOwnerChannelResolver(cfg) {
	let plugins;
	return (channel) => {
		const loaded = resolveChannelPluginRegistration(channel, { loadedOnly: true })?.plugin;
		if (loaded) return loaded;
		if (!plugins) try {
			plugins = resolveReadOnlyChannelPluginsForConfig(cfg, {
				includePersistedAuthState: false,
				includeSetupFallbackPlugins: true
			}).plugins;
		} catch {
			plugins = [];
		}
		const setup = plugins.find((plugin) => plugin.id === channel);
		return setup?.messaging?.inferTargetChatType ? setup : getChannelPlugin(channel) ?? setup;
	};
}
/** Preserve plugin-owned target kinds while normalizing legacy owner envelopes. */
function migrateLegacyCommandOwners(cfg, changes) {
	const owners = cfg.commands?.ownerAllowFrom;
	if (!Array.isArray(owners)) return cfg;
	let changed = false;
	const resolveChannel = createCommandOwnerChannelResolver(cfg);
	const ownerAllowFrom = owners.map((entry, index) => {
		const legacy = typeof entry === "string" ? /^([^:]+):user:([^:\s*]+)$/i.exec(entry.trim()) : null;
		const channel = legacy && normalizeChatChannelId(legacy[1]);
		if (!channel || !legacy) return entry;
		const plugin = resolveChannel(channel);
		if (!plugin || plugin.messaging?.directTargetStyle === "user-prefixed") return entry;
		changed = true;
		changes.push(`Normalized commands.ownerAllowFrom[${index}] from ${channel}:user:id to ${channel}:id.`);
		return `${channel}:${legacy[2]}`;
	});
	return changed ? {
		...cfg,
		commands: {
			...cfg.commands,
			ownerAllowFrom
		}
	} : cfg;
}
function resolveConfiguredCommandOwners(cfg) {
	const owners = cfg.commands?.ownerAllowFrom;
	if (!Array.isArray(owners)) return [];
	return normalizeStringEntries(owners.map((entry) => String(entry ?? ""))).filter((entry) => entry !== "*" && !entry.endsWith(":*"));
}
/** Returns true when at least one owner sender id is configured. */
function hasConfiguredCommandOwners(cfg) {
	return resolveConfiguredCommandOwners(cfg).length > 0;
}
/** Formats a channel sender id into the commands.ownerAllowFrom entry shape. */
function formatCommandOwnerFromChannelSender(params) {
	const id = normalizeOptionalString(params.id);
	if (!id) return null;
	const separatorIndex = id.indexOf(":");
	if (separatorIndex > 0) {
		if (id.slice(0, separatorIndex).toLowerCase() === String(params.channel).toLowerCase()) return id;
	}
	return `${params.channel}:${id}`;
}
/** Gives admitted senders an operator-run command without granting owner authority. */
function formatCommandOwnerHint(params) {
	if (params.channel === "webchat") return "Ask the operator to grant this Gateway client operator.admin access.";
	const owner = params.channel && params.id ? formatCommandOwnerFromChannelSender({
		channel: params.channel,
		id: params.id
	}) : null;
	if (!owner) return "Ask the operator to set commands.ownerAllowFrom to your channel user id.";
	if (!params.cfg) return `Ask the operator to add \`${owner}\` to \`commands.ownerAllowFrom\`.`;
	const owners = JSON.stringify([.../* @__PURE__ */ new Set([...resolveConfiguredCommandOwners(params.cfg), owner])]).replaceAll("'", process.platform === "win32" ? "''" : "'\\''");
	return `Ask the operator to run \`${formatCliCommand("openclaw config set commands.ownerAllowFrom")} '${owners}'\` in a terminal to make this sender a command owner.`;
}
/** Emits setup guidance when privileged command ownership is not configured. */
function noteCommandOwnerHealth(cfg) {
	if (hasConfiguredCommandOwners(cfg)) return;
	note([
		"No command owner is configured.",
		"A command owner is your trusted human operator account, allowed to update OpenClaw with /update, restart the Gateway, change configuration, and approve commands. Chat allowlists do not grant this authority.",
		`Run ${formatCliCommand("openclaw channels add")} and complete a channel's setup to choose your operator account, including servers and groups without DM pairing.`,
		"CLI pairing approval records the first command owner. Control UI pairing approval has a separate owner checkbox.",
		`Fix: set commands.ownerAllowFrom to your channel user id, for example ${formatCliCommand("openclaw config set commands.ownerAllowFrom '[\"telegram:123456789\"]'")}`,
		"Restart the gateway after changing this if it is already running."
	].join("\n"), "Command owner");
}
//#endregion
export { migrateLegacyCommandOwners as a, hasConfiguredCommandOwners as i, formatCommandOwnerFromChannelSender as n, noteCommandOwnerHealth as o, formatCommandOwnerHint as r, createCommandOwnerChannelResolver as t };
