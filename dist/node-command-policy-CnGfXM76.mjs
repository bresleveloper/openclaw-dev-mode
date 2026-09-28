import "./src-CZ2wJvNB.mjs";
import { t as expectDefined } from "./expect-lbe3Hgrh.mjs";
import { c as normalizeOptionalLowercaseString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import { h as normalizeUniqueStringEntries } from "./string-normalization-_gRhJUDw.mjs";
import { t as getActivePluginGatewayNodePolicyRegistry } from "./runtime-state-C5tDvNBc.mjs";
import { C as NODE_WORKER_PRIVATE_COMMANDS, N as isPrivateNodeInvokeCommand, a as NODE_EXEC_APPROVALS_COMMANDS, c as NODE_MCP_TOOLS_CALL_COMMAND, m as NODE_SYSTEM_RUN_COMMANDS, n as NODE_BROWSER_PROXY_COMMANDS, o as NODE_FILE_COMMANDS, p as NODE_SYSTEM_NOTIFY_COMMAND, r as NODE_DEVICE_APPS_COMMAND, t as NODE_AGENT_CLI_CLAUDE_RUN_COMMAND } from "./node-commands-BLhGKTZa.mjs";
import { n as NODE_DESKTOP_STREAM_COMMAND } from "./node-desktop-stream-BZM2AiRA.mjs";
//#region src/gateway/device-metadata-normalization.ts
function normalizeTrimmedMetadata(value) {
	if (typeof value !== "string") return "";
	const trimmed = value.trim();
	return trimmed ? trimmed : "";
}
/** Normalize device metadata for policy classification. */
function normalizeDeviceMetadataForPolicy(value) {
	const trimmed = normalizeTrimmedMetadata(value);
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
const CANONICAL_PLATFORM_IDS = /* @__PURE__ */ new Set([
	"ios",
	"watchos",
	"android",
	"macos",
	"windows",
	"linux"
]);
const DEVICE_FAMILY_TOKEN_RULES = [
	{
		id: "ios",
		tokens: [
			"iphone",
			"ipad",
			"ios"
		]
	},
	{
		id: "watchos",
		tokens: ["apple watch", "watchos"]
	},
	{
		id: "android",
		tokens: ["android"]
	},
	{
		id: "macos",
		tokens: ["mac"]
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
function resolvePlatformIdByExactMatch(value) {
	if (CANONICAL_PLATFORM_IDS.has(value)) return value;
}
function platformMatchesDeviceFamily(platformId, family) {
	switch (platformId) {
		case "ios": return family === "" || /^(?:iphone|ipad|ios)$/.test(family);
		case "watchos": return family === "apple watch" || family === "watchos";
		case "android": return family === "" || family === "android";
		case "macos": return family === "mac";
		case "windows": return family === "windows";
		case "linux": return family === "linux";
	}
	return false;
}
function resolvePlatformIdByNativeLabel(platform, deviceFamily) {
	if (/^(?:ios|ipados) \d+(?:\.\d+){0,2}$/.test(platform)) return /^(?:iphone|ipad|ios)$/.test(deviceFamily) ? "ios" : void 0;
	if (/^watchos \d+(?:\.\d+){0,2}$/.test(platform)) return /^(?:apple watch|watchos)$/.test(deviceFamily) ? "watchos" : void 0;
	if (/^macos \d+(?:\.\d+){0,2}$/.test(platform)) return deviceFamily === "mac" ? "macos" : void 0;
	if (/^android \d+(?: \(sdk \d+\))?$/.test(platform)) return deviceFamily === "android" ? "android" : void 0;
}
function resolvePlatformIdByDeviceFamily(value) {
	for (const rule of DEVICE_FAMILY_TOKEN_RULES) if (rule.tokens.some((token) => value.includes(token))) return rule.id;
}
function normalizePlatformId(platform, deviceFamily) {
	const raw = normalizeDeviceMetadataForPolicy(platform);
	const family = normalizeDeviceMetadataForPolicy(deviceFamily);
	const byPlatform = resolvePlatformIdByExactMatch(raw);
	if (byPlatform) return platformMatchesDeviceFamily(byPlatform, family) ? byPlatform : "unknown";
	const byNativeLabel = resolvePlatformIdByNativeLabel(raw, family);
	if (byNativeLabel) return byNativeLabel;
	if (raw) return "unknown";
	return resolvePlatformIdByDeviceFamily(family) ?? "unknown";
}
function listDangerousPluginNodeCommands() {
	const registry = getActivePluginGatewayNodePolicyRegistry();
	if (!registry) return [];
	const commands = [];
	registry.nodeHostCommands.forEach(({ command }) => {
		if (command.dangerous === true) commands.push(command.command);
	});
	registry.nodeInvokePolicies.forEach(({ policy }) => {
		if (policy.dangerous === true) policy.commands.forEach((command) => commands.push(command));
	});
	return normalizeUniqueStringEntries(commands);
}
function listDefaultPluginNodeCommands(platformId) {
	if (platformId === "watchos") return [];
	const registry = getActivePluginGatewayNodePolicyRegistry();
	if (!registry) return [];
	const commands = [];
	registry.nodeInvokePolicies.forEach(({ policy }) => {
		if (policy.dangerous !== true && policy.defaultPlatforms?.includes(platformId)) policy.commands.forEach((command) => commands.push(command));
	});
	registry.nodeHostCommands.forEach(({ command: { dangerous, agentTool, command } }) => {
		if (dangerous !== true && agentTool?.defaultPlatforms?.includes(platformId)) commands.push(command);
	});
	return normalizeUniqueStringEntries(commands);
}
function isForegroundRestrictedPluginNodeCommand(command) {
	const registry = getActivePluginGatewayNodePolicyRegistry();
	if (!registry) return false;
	const normalized = command.trim();
	if (!normalized) return false;
	return registry.nodeInvokePolicies.some((entry) => entry.policy.foregroundRestrictedOnIos === true && entry.policy.commands.some((policyCommand) => policyCommand.trim() === normalized));
}
function isDesktopPlatformId(platformId) {
	return platformId === "macos" || platformId === "windows" || platformId === "linux";
}
function filterDesktopHostCommandDefaults(params) {
	if (params.includeDesktopHostCommands === true || !isDesktopPlatformId(params.platformId)) return [...params.commands];
	return params.commands.filter((command) => !DESKTOP_HOST_COMMANDS.has(command));
}
function filterApprovedRuntimeCommands(params) {
	if (!isDesktopPlatformId(params.platformId)) return [];
	return params.commands.filter((command) => DESKTOP_HOST_COMMANDS.has(command.trim()));
}
function isLiveNodeSession(node) {
	return typeof node?.nodeId === "string" && node.nodeId.trim() !== "" && typeof node.connId === "string" && node.connId.trim() !== "";
}
function hasTalkSurface(node) {
	if (!node) return false;
	return (node.caps ?? []).some((capability) => normalizeOptionalLowercaseString(capability) === "talk") || (node.commands ?? []).some((command) => normalizeOptionalLowercaseString(command)?.startsWith("talk."));
}
function resolveNodeCommandAllowlistInternal(cfg, node, options) {
	const platformId = normalizePlatformId(node?.platform, node?.deviceFamily);
	const base = filterDesktopHostCommandDefaults({
		platformId,
		commands: expectDefined(PLATFORM_DEFAULTS[platformId], "platform defaults entry at platform id") ?? PLATFORM_DEFAULTS.unknown,
		includeDesktopHostCommands: options?.includeDesktopHostCommands
	});
	const watchRelayCommands = platformId === "ios" && normalizeDeviceMetadataForPolicy(node?.deviceFamily) === "iphone" ? IOS_WATCH_RELAY_COMMANDS : [];
	const talkCommands = hasTalkSurface(node) ? TALK_PTT_COMMANDS : [];
	const pluginDefaults = listDefaultPluginNodeCommands(platformId);
	const approved = filterApprovedRuntimeCommands({
		platformId,
		commands: node?.approvedCommands ?? (isLiveNodeSession(node) ? node?.commands ?? [] : [])
	});
	const extra = cfg.gateway?.nodes?.commands?.allow ?? [];
	const deny = new Set(cfg.gateway?.nodes?.commands?.deny ?? []);
	const baseCommands = new Set(base);
	const dangerousPluginCommands = new Set(listDangerousPluginNodeCommands().filter((command) => !baseCommands.has(command)));
	const dangerousBuiltinCommands = options?.includeDangerousDefaults === true ? /* @__PURE__ */ new Set() : new Set(DEFAULT_DANGEROUS_NODE_COMMANDS);
	const allow = new Set([
		...base,
		...watchRelayCommands,
		...talkCommands,
		...pluginDefaults,
		...approved,
		...extra
	].map((cmd) => cmd.trim()).filter((cmd) => cmd && !dangerousPluginCommands.has(cmd) && !dangerousBuiltinCommands.has(cmd)));
	for (const cmd of extra) {
		const trimmed = cmd.trim();
		if (trimmed) allow.add(trimmed);
	}
	if (cfg.wizard?.appRecommendations === false) allow.delete(NODE_DEVICE_APPS_COMMAND);
	const denyExemptDeclarable = options?.includeDangerousDefaults === true ? new Set(DEFAULT_DANGEROUS_NODE_COMMANDS) : /* @__PURE__ */ new Set();
	for (const blocked of deny) {
		const trimmed = blocked.trim();
		if (trimmed && !denyExemptDeclarable.has(trimmed)) allow.delete(trimmed);
	}
	for (const privateCommand of NODE_WORKER_PRIVATE_COMMANDS) allow.delete(privateCommand);
	return allow;
}
function resolveNodeCommandAllowlist(cfg, node) {
	return resolveNodeCommandAllowlistInternal(cfg, node);
}
function resolveNodePairingCommandAllowlist(cfg, node) {
	return resolveNodeCommandAllowlistInternal(cfg, node, {
		includeDesktopHostCommands: true,
		includeDangerousDefaults: true
	});
}
function normalizeDeclaredCommands(commands) {
	if (!Array.isArray(commands)) return [];
	const seen = /* @__PURE__ */ new Set();
	const normalized = [];
	for (const value of commands) {
		const trimmed = value.trim();
		if (!trimmed || seen.has(trimmed) || isPrivateNodeInvokeCommand(trimmed)) continue;
		seen.add(trimmed);
		normalized.push(trimmed);
	}
	return normalized;
}
function normalizeDeclaredNodeCommands(params) {
	return normalizeDeclaredCommands(params.declaredCommands).filter((command) => params.allowlist.has(command));
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
	if (isPrivateNodeInvokeCommand(command)) return {
		ok: false,
		reason: "command not allowlisted"
	};
	if (!params.allowlist.has(command)) return {
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
/**
* Resolves declaration, pairing, and runtime policy once at their Gateway owner.
* Clients receive one closed state instead of rebuilding authority from partial lists.
*/
function resolveRequiredNodeCommandAuthority(params) {
	const declaredCommands = new Set(params.declaredCommands);
	const effectiveCommands = new Set(params.effectiveCommands);
	const denied = params.requiredCommands.find((cmd) => params.withheldCommands.includes(cmd));
	if (denied) return {
		command: denied,
		state: "unauthorized"
	};
	for (const command of params.requiredCommands) {
		if (effectiveCommands.has(command) && isNodeCommandAllowed({
			command,
			declaredCommands: params.effectiveCommands,
			allowlist: params.allowlist
		}).ok) continue;
		if (declaredCommands.has(command) && !effectiveCommands.has(command)) return {
			command,
			state: "pending-approval"
		};
		if (declaredCommands.has(command)) return {
			command,
			state: "unauthorized"
		};
		return {
			command,
			state: "undeclared"
		};
	}
	const command = params.requiredCommands[0];
	return command ? {
		command,
		state: "invocable"
	} : void 0;
}
//#endregion
export { isForegroundRestrictedPluginNodeCommand as a, normalizeDeclaredNodeCommands as c, resolveRequiredNodeCommandAuthority as d, retainFulfilledNodeCapabilities as f, TALK_PTT_COMMANDS as i, resolveNodeCommandAllowlist as l, IOS_WATCH_RELAY_COMMANDS as n, isNodeCommandAllowed as o, PLATFORM_DEFAULTS as r, listDangerousPluginNodeCommands as s, DEFAULT_DANGEROUS_NODE_COMMANDS as t, resolveNodePairingCommandAllowlist as u };
