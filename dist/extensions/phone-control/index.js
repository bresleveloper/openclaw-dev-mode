import { a as normalizeLowercaseStringOrEmpty, s as normalizeOptionalLowercaseString } from "../../string-coerce-DW4mBlAt.js";
import { C as resolveExpiresAtMsFromDurationMs, o as asDateTimestampMs } from "../../number-coercion-CJQ8TR--.js";
import { g as sortUniqueStrings, l as normalizeStringEntries } from "../../string-normalization-CRyoFBPt.js";
import "../../number-runtime-DBLVDypr.js";
import "../../string-coerce-runtime-BiZzULo_.js";
import { t as definePluginEntry } from "../../plugin-entry-BZpzqykQ.js";
import "../../runtime-api-Cr-D7veM.js";
//#region extensions/phone-control/index.ts
const STATE_VERSION = 2;
const ARM_STATE_NAMESPACE = "armed";
const ARM_STATE_KEY = "current";
const PHONE_ADMIN_SCOPE = "operator.admin";
const GROUP_COMMANDS = {
	camera: ["camera.snap", "camera.clip"],
	screen: ["screen.record"],
	writes: [
		"calendar.add",
		"contacts.add",
		"reminders.add",
		"sms.send"
	]
};
const PHONE_CONTROL_COMMANDS = Object.values(GROUP_COMMANDS).flat();
function uniqSorted(values) {
	return sortUniqueStrings(normalizeStringEntries(values));
}
function resolveCommandsForGroup(group) {
	if (group === "all") return uniqSorted(Object.values(GROUP_COMMANDS).flat());
	return uniqSorted(GROUP_COMMANDS[group]);
}
function formatGroupList() {
	return [
		"camera",
		"screen",
		"writes",
		"all"
	].join(", ");
}
function parseDurationMs(input) {
	const raw = normalizeOptionalLowercaseString(input);
	if (!raw) return null;
	const m = raw.match(/^(\d+)(s|m|h|d)$/);
	if (!m) return null;
	const n = Number.parseInt(m[1] ?? "", 10);
	if (!Number.isFinite(n) || n <= 0) return null;
	const unit = m[2];
	const durationMs = n * (unit === "s" ? 1e3 : unit === "m" ? 6e4 : unit === "h" ? 36e5 : 864e5);
	return Number.isSafeInteger(durationMs) ? durationMs : null;
}
function formatDuration(ms) {
	const s = Math.max(0, Math.floor(ms / 1e3));
	if (s < 60) return `${s}s`;
	const m = Math.floor(s / 60);
	if (m < 60) return `${m}m`;
	const h = Math.floor(m / 60);
	if (h < 48) return `${h}h`;
	return `${Math.floor(h / 24)}d`;
}
function openArmStateStore(api) {
	return api.runtime.state.openKeyedStore({
		namespace: ARM_STATE_NAMESPACE,
		maxEntries: 1
	});
}
async function readArmState(api) {
	return await openArmStateStore(api).lookup(ARM_STATE_KEY) ?? null;
}
async function writeArmState(api, state) {
	const store = openArmStateStore(api);
	if (!state) {
		await store.delete(ARM_STATE_KEY);
		return;
	}
	await store.register(ARM_STATE_KEY, state);
}
function normalizeDenyList(cfg) {
	return uniqSorted([...cfg.gateway?.nodes?.denyCommands ?? []]);
}
function normalizeAllowList(cfg) {
	return uniqSorted([...cfg.gateway?.nodes?.allowCommands ?? []]);
}
function hasPhoneControlAllowOverride(cfg) {
	const allow = new Set(normalizeAllowList(cfg));
	return PHONE_CONTROL_COMMANDS.some((cmd) => allow.has(cmd));
}
function patchConfigNodeLists(cfg, next) {
	return {
		...cfg,
		gateway: {
			...cfg.gateway,
			nodes: {
				...cfg.gateway?.nodes,
				allowCommands: next.allowCommands,
				denyCommands: next.denyCommands
			}
		}
	};
}
async function disarmNow(params) {
	const { api, reason } = params;
	const state = await readArmState(api);
	if (!state) return {
		changed: false,
		restored: [],
		removed: []
	};
	const cfg = api.runtime.config.current();
	const allow = new Set(normalizeAllowList(cfg));
	const deny = new Set(normalizeDenyList(cfg));
	const removed = [];
	const restored = [];
	if (state.version === 1) {
		for (const cmd of state.removedFromDeny) if (!deny.has(cmd)) {
			deny.add(cmd);
			restored.push(cmd);
		}
	} else {
		for (const cmd of state.addedToAllow) if (allow.delete(cmd)) removed.push(cmd);
		for (const cmd of state.removedFromDeny) if (!deny.has(cmd)) {
			deny.add(cmd);
			restored.push(cmd);
		}
	}
	if (removed.length > 0 || restored.length > 0) await api.runtime.config.mutateConfigFile({
		afterWrite: { mode: "auto" },
		mutate: (draft) => {
			const next = patchConfigNodeLists(draft, {
				allowCommands: uniqSorted([...allow]),
				denyCommands: uniqSorted([...deny])
			});
			Object.assign(draft, next);
		}
	});
	await writeArmState(api, null);
	api.logger.info(`phone-control: disarmed (${reason})`);
	return {
		changed: removed.length > 0 || restored.length > 0,
		removed: uniqSorted(removed),
		restored: uniqSorted(restored)
	};
}
function formatHelp() {
	return [
		"Phone control commands:",
		"",
		"/phone status",
		"/phone arm <group> [duration]",
		"/phone disarm",
		"",
		"Groups:",
		`- ${formatGroupList()}`,
		"",
		"Duration format: 30s | 10m | 2h | 1d (default: 10m).",
		"",
		"Notes:",
		"- This only toggles what the gateway is allowed to invoke on phone nodes.",
		"- iOS will still ask for permissions (camera, photos, contacts, etc.) on first use."
	].join("\n");
}
function parseGroup(raw) {
	const value = normalizeOptionalLowercaseString(raw) ?? "";
	if (!value) return null;
	if (value === "camera" || value === "screen" || value === "writes" || value === "all") return value;
	return null;
}
function lacksAdminToMutatePhoneControl(params) {
	const { senderIsOwner, gatewayClientScopes } = params;
	if (Array.isArray(gatewayClientScopes)) return !gatewayClientScopes.includes(PHONE_ADMIN_SCOPE);
	return senderIsOwner !== true;
}
function resolveArmExpiryStatus(state, nowRaw = Date.now()) {
	if (state.expiresAtMs == null) return "manual disarm required";
	const now = asDateTimestampMs(nowRaw);
	if (now === void 0) return "expiry unavailable";
	const expiresAt = asDateTimestampMs(state.expiresAtMs);
	if (expiresAt === void 0 || expiresAt <= now) return "expired";
	return `expires in ${formatDuration(expiresAt - now)}`;
}
function isArmStateExpired(state, nowRaw = Date.now()) {
	if (state.expiresAtMs == null) return false;
	const now = asDateTimestampMs(nowRaw);
	if (now === void 0) return false;
	const expiresAt = asDateTimestampMs(state.expiresAtMs);
	return expiresAt === void 0 || expiresAt <= now;
}
function formatStatus(state) {
	if (!state) return "Phone control: disarmed.";
	const until = resolveArmExpiryStatus(state);
	const cmds = uniqSorted(state.version === 1 ? state.removedFromDeny : state.armedCommands.length > 0 ? state.armedCommands : [...state.addedToAllow, ...state.removedFromDeny]);
	return `Phone control: armed (${until}).\nTemporarily allowed: ${cmds.length > 0 ? cmds.join(", ") : "none"}`;
}
var phone_control_default = definePluginEntry({
	id: "phone-control",
	name: "Phone Control",
	description: "Temporary allowlist control for phone automation commands",
	register(api) {
		let expiryInterval = null;
		let initialExpiryTick = null;
		api.registerService({
			id: "phone-control-expiry",
			start: async (ctx) => {
				const tick = async () => {
					const state = await readArmState(api);
					if (!state || state.expiresAtMs == null) return;
					if (!isArmStateExpired(state)) return;
					await disarmNow({
						api,
						reason: "expired"
					});
				};
				expiryInterval = setInterval(() => {
					tick().catch(() => {});
				}, 15e3);
				expiryInterval.unref?.();
				if (hasPhoneControlAllowOverride(ctx.config)) await tick().catch(() => {});
				else {
					initialExpiryTick = setImmediate(() => {
						initialExpiryTick = null;
						tick().catch(() => {});
					});
					initialExpiryTick.unref?.();
				}
			},
			stop: async () => {
				if (initialExpiryTick) {
					clearImmediate(initialExpiryTick);
					initialExpiryTick = null;
				}
				if (expiryInterval) {
					clearInterval(expiryInterval);
					expiryInterval = null;
				}
			}
		});
		api.registerCommand({
			name: "phone",
			description: "Arm/disarm high-risk phone node commands (camera/screen/writes).",
			acceptsArgs: true,
			exposeSenderIsOwner: true,
			handler: async (ctx) => {
				const tokens = (ctx.args?.trim() ?? "").split(/\s+/).filter(Boolean);
				const action = normalizeLowercaseStringOrEmpty(tokens[0]);
				if (!action || action === "help") return { text: `${formatStatus(await readArmState(api))}\n\n${formatHelp()}` };
				if (action === "status") return { text: formatStatus(await readArmState(api)) };
				if (action === "disarm") {
					if (lacksAdminToMutatePhoneControl({
						senderIsOwner: ctx.senderIsOwner,
						gatewayClientScopes: ctx.gatewayClientScopes
					})) return { text: "⚠️ /phone disarm requires operator.admin." };
					const res = await disarmNow({
						api,
						reason: "manual"
					});
					if (!res.changed) return { text: "Phone control: disarmed." };
					const restoredLabel = res.restored.length > 0 ? res.restored.join(", ") : "none";
					return { text: `Phone control: disarmed.\nRemoved allowlist: ${res.removed.length > 0 ? res.removed.join(", ") : "none"}\nRestored denylist: ${restoredLabel}` };
				}
				if (action === "arm") {
					if (lacksAdminToMutatePhoneControl({
						senderIsOwner: ctx.senderIsOwner,
						gatewayClientScopes: ctx.gatewayClientScopes
					})) return { text: "⚠️ /phone arm requires operator.admin." };
					const group = parseGroup(tokens[1]);
					if (!group) return { text: `Usage: /phone arm <group> [duration]\nGroups: ${formatGroupList()}` };
					const durationMs = tokens[2] === void 0 ? 10 * 6e4 : parseDurationMs(tokens[2]);
					if (durationMs === null) return { text: "Invalid duration. Use values like 30s, 10m, 2h, or 1d." };
					const armedAtMs = asDateTimestampMs(Date.now());
					const expiresAtMs = armedAtMs === void 0 ? void 0 : resolveExpiresAtMsFromDurationMs(durationMs, { nowMs: armedAtMs });
					if (armedAtMs === void 0 || expiresAtMs === void 0) return { text: "Invalid duration. Use values like 30s, 10m, 2h, or 1d." };
					const commands = resolveCommandsForGroup(group);
					const cfg = api.runtime.config.current();
					const allowSet = new Set(normalizeAllowList(cfg));
					const denySet = new Set(normalizeDenyList(cfg));
					const addedToAllow = [];
					const removedFromDeny = [];
					for (const cmd of commands) {
						if (!allowSet.has(cmd)) {
							allowSet.add(cmd);
							addedToAllow.push(cmd);
						}
						if (denySet.delete(cmd)) removedFromDeny.push(cmd);
					}
					await api.runtime.config.mutateConfigFile({
						afterWrite: { mode: "auto" },
						mutate: (draft) => {
							const next = patchConfigNodeLists(draft, {
								allowCommands: uniqSorted([...allowSet]),
								denyCommands: uniqSorted([...denySet])
							});
							Object.assign(draft, next);
						}
					});
					await writeArmState(api, {
						version: STATE_VERSION,
						armedAtMs,
						expiresAtMs,
						group,
						armedCommands: uniqSorted(commands),
						addedToAllow: uniqSorted(addedToAllow),
						removedFromDeny: uniqSorted(removedFromDeny)
					});
					const allowedLabel = uniqSorted(commands).join(", ");
					return { text: `Phone control: armed for ${formatDuration(durationMs)}.\nTemporarily allowed: ${allowedLabel}\nTo disarm early: /phone disarm` };
				}
				return { text: formatHelp() };
			}
		});
	}
});
//#endregion
export { phone_control_default as default };
