import { a as asOptionalRecord } from "./record-coerce-DItp3I4t.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import "./session-key-CBvmC8zz.mjs";
import { n as normalizeAccountId } from "./account-id-B1bfbA5J.mjs";
import { x as redactToolPayloadTextWithConfig } from "./redact-B5EGyLvV.mjs";
import { l as getActivePluginRegistry } from "./runtime-BvdPUus5.mjs";
import { c as findActiveDegradedSecretOwner, n as SecretSurfaceUnavailableError } from "./runtime-degraded-state-DVMYGogL.mjs";
import { r as resolveChannelAccountEntry } from "./account-lookup-CVHGcV8B.mjs";
//#region src/channels/account-config-enabled.ts
/** Reads an operator's explicit disable without resolving an operational account. */
function isChannelAccountExplicitlyDisabled(params) {
	const channel = asOptionalRecord(params.cfg.channels?.[params.channel]);
	const account = asOptionalRecord(resolveChannelAccountEntry(asOptionalRecord(channel?.accounts), params.accountId, params.channel));
	return channel?.enabled === false || account?.enabled === false;
}
//#endregion
//#region src/channels/status/account-state.ts
function resolveUnavailableChannelAccountSnapshot(cfg, params) {
	const accountId = normalizeAccountId(params.accountId);
	const owner = findActiveDegradedSecretOwner("account", `${params.channelId}:${accountId}`);
	const registry = params.registry ?? getActivePluginRegistry();
	const failedPlugin = !registry?.channels.some(({ plugin }) => plugin.id === params.channelId) && registry?.plugins.find((plugin) => plugin.enabled && plugin.status === "error" && plugin.channelIds.includes(params.channelId));
	const pluginError = failedPlugin && redactToolPayloadTextWithConfig(`Plugin ${failedPlugin.id} failed: ${failedPlugin.error}`, cfg.logging);
	const lastError = owner ? new SecretSurfaceUnavailableError(owner).message : pluginError && `${truncateUtf16Safe(pluginError, 1e3)}; run openclaw doctor`;
	if (!lastError) return;
	const runtime = failedPlugin ? void 0 : params.runtime;
	return {
		...runtime,
		accountId: params.accountId,
		enabled: failedPlugin ? !isChannelAccountExplicitlyDisabled({
			cfg,
			channel: params.channelId,
			accountId
		}) : runtime?.enabled ?? true,
		configured: true,
		running: false,
		...typeof runtime?.connected === "boolean" ? { connected: false } : {},
		restartPending: false,
		lifecycle: "blocked",
		stateReason: lastError,
		lastError
	};
}
function assertNeverState(state) {
	throw new Error(`Unhandled channel account state: ${String(state)}`);
}
function resolveChannelAccountState(input) {
	const failure = input.runtime?.lastError ?? null;
	if (!input.enabled) return {
		kind: "disabled",
		configured: input.configured,
		linked: input.linked,
		reason: input.disabledReason ?? "disabled",
		failure
	};
	if (!input.configured) return {
		kind: "unconfigured",
		reason: input.unconfiguredReason ?? "not configured",
		failure
	};
	if (input.linked === false) return {
		kind: "unlinked",
		reason: input.unlinkedReason ?? "not linked",
		failure
	};
	if (input.runtime?.running === true) return {
		kind: "running",
		linked: input.linked,
		connected: input.runtime.connected,
		failure
	};
	return {
		kind: "stopped",
		linked: input.linked,
		connected: input.runtime?.connected,
		failure
	};
}
function resolveChannelAccountLinked(state, fallback) {
	return state ? state === "unknown" ? void 0 : state === "linked" : fallback;
}
function projectChannelAccountState(state) {
	switch (state.kind) {
		case "disabled": return {
			configured: state.configured,
			...typeof state.linked === "boolean" ? { linked: state.linked } : {},
			running: false,
			stateReason: state.reason,
			lastError: state.failure
		};
		case "unconfigured":
		case "unlinked": return {
			configured: state.kind === "unlinked",
			...state.kind === "unlinked" ? { linked: false } : {},
			running: false,
			stateReason: state.reason,
			lastError: state.failure
		};
		case "running":
		case "stopped": return {
			configured: true,
			...state.linked ? { linked: true } : {},
			running: state.kind === "running",
			...typeof state.connected === "boolean" ? { connected: state.connected } : {},
			lastError: state.failure
		};
	}
	return assertNeverState(state);
}
const CHANNEL_ACCOUNT_STATE_FIELDS = [
	"configured",
	"linked",
	"running",
	"connected",
	"stateReason",
	"lastError"
];
function applyChannelAccountState(snapshot, state) {
	for (const field of CHANNEL_ACCOUNT_STATE_FIELDS) delete snapshot[field];
	Object.assign(snapshot, projectChannelAccountState(state));
}
function projectChannelAccountDisplayState(state, fallback) {
	switch (state.kind) {
		case "disabled": return "disabled";
		case "unconfigured": return "not configured";
		case "unlinked": return "not linked";
		case "running":
		case "stopped": return state.linked ? "linked" : fallback ?? "configured";
	}
	return assertNeverState(state);
}
//#endregion
export { resolveUnavailableChannelAccountSnapshot as a, resolveChannelAccountState as i, projectChannelAccountDisplayState as n, isChannelAccountExplicitlyDisabled as o, resolveChannelAccountLinked as r, applyChannelAccountState as t };
