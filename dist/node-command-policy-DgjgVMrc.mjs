import { c as normalizeOptionalLowercaseString, l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { _ as normalizeUniqueTrimmedStringList, h as normalizeUniqueStringEntries } from "./string-normalization-CECOqf64.mjs";
import { t as getActivePluginGatewayNodePolicyRegistry } from "./runtime-state-Cd-Ga9cg.mjs";
import { C as NODE_WORKER_PRIVATE_COMMANDS, N as isPrivateNodeInvokeCommand, a as NODE_EXEC_APPROVALS_COMMANDS, c as NODE_MCP_TOOLS_CALL_COMMAND, m as NODE_SYSTEM_RUN_COMMANDS, n as NODE_BROWSER_PROXY_COMMANDS, o as NODE_FILE_COMMANDS, p as NODE_SYSTEM_NOTIFY_COMMAND, r as NODE_DEVICE_APPS_COMMAND, t as NODE_AGENT_CLI_CLAUDE_RUN_COMMAND } from "./node-commands-BLhGKTZa.mjs";
import { n as NODE_DESKTOP_STREAM_COMMAND } from "./node-desktop-stream-BZM2AiRA.mjs";
//#region src/gateway/device-metadata-normalization.ts
/** Normalize device metadata for policy classification. */
function normalizeDeviceMetadataForPolicy(value) {
	const trimmed = normalizeOptionalString(value);
	if (!trimmed) return "";
	return normalizeLowercaseStringOrEmpty(trimmed.normalize("NFKD").replace(/\p{M}/gu, ""));
}
//#endregion
//#region src/gateway/node-command-policy-mobile.ts
const NOTIFICATION_COMMANDS = ["notifications.list"];
const MOBILE_NODE_COMMANDS = {
	location: ["location.get"],
	notification: NOTIFICATION_COMMANDS,
	androidNotification: [...NOTIFICATION_COMMANDS, "notifications.actions"],
	device: ["device.info", "device.status"]
};
//#endregion
//#region src/gateway/node-command-policy.ts
const CAMERA_COMMANDS = ["camera.list"];
const MAC_CAMERA_COMMANDS = ["camera.ptz.status"];
const CAMERA_DANGEROUS_COMMANDS = [
	"camera.snap",
	"camera.clip",
	"camera.ptz.control"
];
const SCREEN_COMMANDS = ["screen.snapshot"];
const SCREEN_DANGEROUS_COMMANDS = ["screen.record"];
const DESKTOP_SCREEN_COMMANDS = [...SCREEN_COMMANDS, NODE_DESKTOP_STREAM_COMMAND];
const COMPUTER_COMMANDS = ["computer.act"];
const MOBILE_UI_COMMANDS = ["mobile.ui.observe", "mobile.ui.act"];
const ANDROID_DEVICE_COMMANDS = [
	...MOBILE_NODE_COMMANDS.device,
	"device.permissions",
	"device.health",
	NODE_DEVICE_APPS_COMMAND
];
const CONTACTS_COMMANDS = ["contacts.search"];
const CONTACTS_DANGEROUS_COMMANDS = ["contacts.add"];
const CALENDAR_COMMANDS = ["calendar.events"];
const CALENDAR_DANGEROUS_COMMANDS = ["calendar.add"];
const CALL_LOG_COMMANDS = ["callLog.search"];
const REMINDERS_COMMANDS = ["reminders.list"];
const REMINDERS_DANGEROUS_COMMANDS = ["reminders.add"];
const PHOTOS_COMMANDS = ["photos.latest"];
const MOTION_COMMANDS = ["motion.activity", "motion.pedometer"];
const HEALTH_DANGEROUS_COMMANDS = ["health.summary"];
const SMS_DANGEROUS_COMMANDS = ["sms.send", "sms.search"];
const TALK_PTT_COMMANDS = [
	"talk.ptt.start",
	"talk.ptt.stop",
	"talk.ptt.cancel",
	"talk.ptt.once"
];
const IOS_WATCH_RELAY_COMMANDS = ["watch.status", "watch.notify"];
const IOS_SYSTEM_COMMANDS = [NODE_SYSTEM_NOTIFY_COMMAND];
const SYSTEM_COMMANDS = [
	...NODE_SYSTEM_RUN_COMMANDS,
	...NODE_EXEC_APPROVALS_COMMANDS,
	...NODE_FILE_COMMANDS,
	NODE_SYSTEM_NOTIFY_COMMAND,
	...NODE_BROWSER_PROXY_COMMANDS,
	NODE_MCP_TOOLS_CALL_COMMAND,
	NODE_AGENT_CLI_CLAUDE_RUN_COMMAND
];
const DESKTOP_HOST_COMMANDS = /* @__PURE__ */ new Set([
	...NODE_SYSTEM_RUN_COMMANDS,
	...NODE_EXEC_APPROVALS_COMMANDS,
	...NODE_FILE_COMMANDS,
	...NODE_BROWSER_PROXY_COMMANDS,
	NODE_MCP_TOOLS_CALL_COMMAND,
	NODE_AGENT_CLI_CLAUDE_RUN_COMMAND,
	...SCREEN_COMMANDS,
	NODE_DESKTOP_STREAM_COMMAND
]);
const UNKNOWN_PLATFORM_COMMANDS = [
	...CAMERA_COMMANDS,
	...MOBILE_NODE_COMMANDS.location,
	NODE_SYSTEM_NOTIFY_COMMAND
];
const DEFAULT_DANGEROUS_NODE_COMMANDS = [
	...CAMERA_DANGEROUS_COMMANDS,
	...SCREEN_DANGEROUS_COMMANDS,
	...CONTACTS_DANGEROUS_COMMANDS,
	...CALENDAR_DANGEROUS_COMMANDS,
	...REMINDERS_DANGEROUS_COMMANDS,
	...SMS_DANGEROUS_COMMANDS,
	...HEALTH_DANGEROUS_COMMANDS
];
const PLATFORM_DEFAULTS = {
	ios: [
		...CAMERA_COMMANDS,
		...MOBILE_NODE_COMMANDS.location,
		...MOBILE_NODE_COMMANDS.device,
		...CONTACTS_COMMANDS,
		...CALENDAR_COMMANDS,
		...REMINDERS_COMMANDS,
		...PHOTOS_COMMANDS,
		...MOTION_COMMANDS,
		...IOS_SYSTEM_COMMANDS
	],
	watchos: [...MOBILE_NODE_COMMANDS.device, ...IOS_SYSTEM_COMMANDS],
	android: [
		...CAMERA_COMMANDS,
		...MOBILE_NODE_COMMANDS.location,
		...MOBILE_NODE_COMMANDS.androidNotification,
		NODE_SYSTEM_NOTIFY_COMMAND,
		...ANDROID_DEVICE_COMMANDS,
		...CONTACTS_COMMANDS,
		...CALENDAR_COMMANDS,
		...CALL_LOG_COMMANDS,
		...REMINDERS_COMMANDS,
		...PHOTOS_COMMANDS,
		...MOTION_COMMANDS,
		...MOBILE_UI_COMMANDS
	],
	macos: [
		...CAMERA_COMMANDS,
		...MAC_CAMERA_COMMANDS,
		...MOBILE_NODE_COMMANDS.location,
		...MOBILE_NODE_COMMANDS.device,
		NODE_DEVICE_APPS_COMMAND,
		...CONTACTS_COMMANDS,
		...CALENDAR_COMMANDS,
		...REMINDERS_COMMANDS,
		...PHOTOS_COMMANDS,
		...MOTION_COMMANDS,
		...SYSTEM_COMMANDS,
		...DESKTOP_SCREEN_COMMANDS,
		...COMPUTER_COMMANDS
	],
	linux: [
		...SYSTEM_COMMANDS,
		...DESKTOP_SCREEN_COMMANDS,
		...COMPUTER_COMMANDS
	],
	windows: [
		...CAMERA_COMMANDS,
		...MOBILE_NODE_COMMANDS.location,
		...MOBILE_NODE_COMMANDS.device,
		...SYSTEM_COMMANDS,
		...DESKTOP_SCREEN_COMMANDS,
		...COMPUTER_COMMANDS
	],
	unknown: [...UNKNOWN_PLATFORM_COMMANDS]
};
const PLATFORM_RULES = [
	{
		id: "ios",
		tokens: [
			"iphone",
			"ipad",
			"ios"
		],
		nativeLabel: /^(?:ios|ipados) \d+(?:\.\d+){0,2}$/,
		allowEmptyFamily: true
	},
	{
		id: "watchos",
		tokens: ["apple watch", "watchos"],
		nativeLabel: /^watchos \d+(?:\.\d+){0,2}$/
	},
	{
		id: "android",
		tokens: ["android"],
		nativeLabel: /^android \d+(?: \(sdk \d+\))?$/,
		allowEmptyFamily: true
	},
	{
		id: "macos",
		tokens: ["mac"],
		nativeLabel: /^macos \d+(?:\.\d+){0,2}$/
	},
	{
		id: "windows",
		tokens: ["windows"]
	},
	{
		id: "linux",
		tokens: ["linux"]
	}
];
function normalizePlatformId(platform, deviceFamily) {
	const raw = normalizeDeviceMetadataForPolicy(platform);
	const family = normalizeDeviceMetadataForPolicy(deviceFamily);
	if (raw) {
		const rule = PLATFORM_RULES.find((candidate) => candidate.id === raw);
		if (rule) return rule.tokens.includes(family) || family === "" && rule.allowEmptyFamily ? rule.id : "unknown";
		return PLATFORM_RULES.find((candidate) => candidate.nativeLabel?.test(raw) && candidate.tokens.includes(family))?.id ?? "unknown";
	}
	return PLATFORM_RULES.find((rule) => rule.tokens.some((token) => family.includes(token)))?.id ?? "unknown";
}
function listDangerousPluginNodeCommands() {
	const registry = getActivePluginGatewayNodePolicyRegistry();
	if (!registry) return [];
	return normalizeUniqueStringEntries([...registry.nodeHostCommands.flatMap(({ command }) => command.dangerous === true ? [command.command] : []), ...registry.nodeInvokePolicies.flatMap(({ policy }) => policy.dangerous === true ? policy.commands : [])]);
}
function listDefaultPluginNodeCommands(platformId) {
	if (platformId === "watchos") return [];
	const registry = getActivePluginGatewayNodePolicyRegistry();
	if (!registry) return [];
	return normalizeUniqueStringEntries([...registry.nodeInvokePolicies.flatMap(({ policy }) => policy.dangerous !== true && policy.defaultPlatforms?.includes(platformId) ? policy.commands : []), ...registry.nodeHostCommands.flatMap(({ command: { dangerous, agentTool, command } }) => dangerous !== true && agentTool?.defaultPlatforms?.includes(platformId) ? [command] : [])]);
}
function isForegroundRestrictedPluginNodeCommand(command) {
	const registry = getActivePluginGatewayNodePolicyRegistry();
	const normalized = command.trim();
	if (!registry || !normalized) return false;
	return registry.nodeInvokePolicies.some((entry) => entry.policy.foregroundRestrictedOnIos === true && entry.policy.commands.some((policyCommand) => policyCommand.trim() === normalized));
}
function isLiveNodeSession(node) {
	return typeof node?.nodeId === "string" && node.nodeId.trim() !== "" && typeof node.connId === "string" && node.connId.trim() !== "";
}
function hasTalkSurface(node) {
	return (node?.caps ?? []).some((capability) => normalizeOptionalLowercaseString(capability) === "talk") || (node?.commands ?? []).some((command) => normalizeOptionalLowercaseString(command)?.startsWith("talk."));
}
function resolveNodeCommandAllowlistInternal(cfg, node, pairing = false) {
	const platformId = normalizePlatformId(node?.platform, node?.deviceFamily);
	const desktop = platformId === "macos" || platformId === "windows" || platformId === "linux";
	const base = PLATFORM_DEFAULTS[platformId].filter((command) => pairing || !desktop || !DESKTOP_HOST_COMMANDS.has(command));
	const watchRelayCommands = platformId === "ios" && normalizeDeviceMetadataForPolicy(node?.deviceFamily) === "iphone" ? IOS_WATCH_RELAY_COMMANDS : [];
	const talkCommands = hasTalkSurface(node) ? TALK_PTT_COMMANDS : [];
	const pluginDefaults = listDefaultPluginNodeCommands(platformId);
	const approved = desktop ? (node?.approvedCommands ?? (isLiveNodeSession(node) ? node?.commands ?? [] : [])).filter((command) => DESKTOP_HOST_COMMANDS.has(command.trim())) : [];
	const extra = cfg.gateway?.nodes?.commands?.allow ?? [];
	const deny = new Set(cfg.gateway?.nodes?.commands?.deny ?? []);
	const baseCommands = new Set(base);
	const dangerousPluginCommands = new Set(listDangerousPluginNodeCommands().filter((command) => !baseCommands.has(command)));
	const dangerousBuiltinCommands = new Set(DEFAULT_DANGEROUS_NODE_COMMANDS);
	const allow = new Set([
		...base,
		...watchRelayCommands,
		...talkCommands,
		...pluginDefaults,
		...approved,
		...extra
	].map((cmd) => cmd.trim()).filter((cmd) => cmd && !dangerousPluginCommands.has(cmd) && (pairing || !dangerousBuiltinCommands.has(cmd))));
	for (const cmd of extra) {
		const trimmed = cmd.trim();
		if (trimmed) allow.add(trimmed);
	}
	if (cfg.wizard?.appRecommendations === false) allow.delete(NODE_DEVICE_APPS_COMMAND);
	for (const blocked of deny) {
		const trimmed = blocked.trim();
		if (trimmed && (!pairing || !dangerousBuiltinCommands.has(trimmed))) allow.delete(trimmed);
	}
	for (const privateCommand of NODE_WORKER_PRIVATE_COMMANDS) allow.delete(privateCommand);
	return allow;
}
function resolveNodeCommandAllowlist(cfg, node) {
	return resolveNodeCommandAllowlistInternal(cfg, node);
}
function resolveNodePairingCommandAllowlist(cfg, node) {
	return resolveNodeCommandAllowlistInternal(cfg, node, true);
}
function normalizeDeclaredNodeCommands(params) {
	return normalizeUniqueTrimmedStringList(params.declaredCommands).filter((command) => !isPrivateNodeInvokeCommand(command) && params.allowlist.has(command));
}
const CAPABILITY_COMMAND_FAMILIES = /* @__PURE__ */ new Map([
	["camera", /* @__PURE__ */ new Set([
		...CAMERA_COMMANDS,
		...MAC_CAMERA_COMMANDS,
		...CAMERA_DANGEROUS_COMMANDS
	])],
	["computer", new Set(COMPUTER_COMMANDS)],
	["location", new Set(MOBILE_NODE_COMMANDS.location)],
	["screen", /* @__PURE__ */ new Set([...DESKTOP_SCREEN_COMMANDS, ...SCREEN_DANGEROUS_COMMANDS])]
]);
/** Drops capabilities whose commands policy withheld without admitting a sibling. */
function retainFulfilledNodeCapabilities(params) {
	return params.caps.filter((capability) => {
		const family = CAPABILITY_COMMAND_FAMILIES.get(capability);
		return !family || !params.withheldCommands.some((command) => family.has(command)) || params.admittedCommands.some((command) => family.has(command));
	});
}
function isNodeCommandAllowed(params) {
	const command = params.command.trim();
	if (!command) return {
		ok: false,
		reason: "command required"
	};
	if (isPrivateNodeInvokeCommand(command) || !params.allowlist.has(command)) return {
		ok: false,
		reason: "command not allowlisted"
	};
	if (Array.isArray(params.declaredCommands) && params.declaredCommands.length > 0) {
		if (!params.declaredCommands.includes(command)) return {
			ok: false,
			reason: "command not declared by node"
		};
	} else return {
		ok: false,
		reason: "node did not declare commands"
	};
	return { ok: true };
}
/** Present the failed authority layer without suggesting that another layer can grant it. */
function formatRequiredNodeCommandUnavailable(command, state, nodeId) {
	const prefix = `paired-device command ${command}`;
	if (state === "undeclared") {
		const pluginId = getActivePluginGatewayNodePolicyRegistry()?.nodeHostCommands.find((entry) => entry.command.command === command)?.pluginId;
		return `${prefix} is not advertised by node ${nodeId}; ${pluginId ? `${pluginId === "codex" ? "install the codex plugin on that node if missing (openclaw plugins install @openclaw/codex), then " : ""}enable the ${pluginId} plugin on that node (openclaw plugins enable ${pluginId})` : "enable the plugin or node capability that provides this command on that node"}, then restart the node (openclaw node restart) and approve its updated command surface`;
	}
	if (state === "pending-approval") return `${prefix} is awaiting pairing approval for node ${nodeId}; find its updated command surface request with openclaw nodes pending, then run openclaw nodes approve <requestId>`;
	return `${prefix} is blocked by Gateway policy for node ${nodeId}; allow it in gateway.nodes.commands.allow and remove any matching gateway.nodes.commands.deny entry`;
}
/**
* Resolves declaration, pairing, and runtime policy once at their Gateway owner.
* Clients receive one closed state instead of rebuilding authority from partial lists.
*/
function resolveRequiredNodeCommandAuthority(params) {
	const declaredCommands = new Set(params.declaredCommands);
	const effectiveCommands = new Set(params.effectiveCommands);
	const denied = params.requiredCommands.find((cmd) => params.withheldCommands.includes(cmd));
	const command = denied || params.requiredCommands.find((cmd) => !effectiveCommands.has(cmd) || !isNodeCommandAllowed({
		command: cmd,
		declaredCommands: params.effectiveCommands,
		allowlist: params.allowlist
	}).ok);
	if (command === void 0) {
		const first = params.requiredCommands[0];
		return first ? {
			command: first,
			state: "invocable"
		} : void 0;
	}
	const state = denied ? "unauthorized" : !declaredCommands.has(command) ? "undeclared" : effectiveCommands.has(command) ? "unauthorized" : "pending-approval";
	return {
		command,
		state,
		message: formatRequiredNodeCommandUnavailable(command, state, params.nodeId)
	};
}
//#endregion
export { isForegroundRestrictedPluginNodeCommand as a, normalizeDeclaredNodeCommands as c, resolveRequiredNodeCommandAuthority as d, retainFulfilledNodeCapabilities as f, TALK_PTT_COMMANDS as i, resolveNodeCommandAllowlist as l, IOS_WATCH_RELAY_COMMANDS as n, isNodeCommandAllowed as o, PLATFORM_DEFAULTS as r, listDangerousPluginNodeCommands as s, DEFAULT_DANGEROUS_NODE_COMMANDS as t, resolveNodePairingCommandAllowlist as u };
