import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { d as redactToolPayloadTextWithConfig } from "./redact-BcXJu5HP.mjs";
import "./session-key-CSDERtm3.mjs";
import { n as normalizeAccountId } from "./account-id-ifCOO7_9.mjs";
import { l as getActivePluginRegistry } from "./runtime-DkPagH0y.mjs";
import { c as findActiveDegradedSecretOwner, n as SecretSurfaceUnavailableError } from "./runtime-degraded-state-SptB0g_t.mjs";
import { t as isChannelAccountExplicitlyDisabled } from "./account-config-enabled-Ck6QSq-W.mjs";
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
function resolveChannelAccountState(input) {
	const lastError = input.runtime?.lastError ?? null;
	if (!input.enabled) return {
		displayState: "disabled",
		snapshot: {
			configured: input.configured,
			...typeof input.linked === "boolean" ? { linked: input.linked } : {},
			running: false,
			stateReason: input.disabledReason ?? "disabled",
			lastError
		}
	};
	if (!input.configured || input.linked === false) return {
		displayState: input.configured ? "not linked" : "not configured",
		snapshot: {
			configured: input.configured,
			...input.configured ? { linked: false } : {},
			running: false,
			stateReason: input.configured ? input.unlinkedReason ?? "not linked" : input.unconfiguredReason ?? "not configured",
			lastError
		}
	};
	return {
		displayState: input.linked ? "linked" : void 0,
		snapshot: {
			configured: true,
			...input.linked ? { linked: true } : {},
			running: input.runtime?.running === true,
			...typeof input.runtime?.connected === "boolean" ? { connected: input.runtime.connected } : {},
			lastError
		}
	};
}
function resolveChannelAccountLinked(state, fallback) {
	return state ? state === "unknown" ? void 0 : state === "linked" : fallback;
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
	Object.assign(snapshot, state.snapshot);
}
function projectChannelAccountDisplayState(state, fallback) {
	return state.displayState ?? fallback ?? "configured";
}
//#endregion
export { resolveUnavailableChannelAccountSnapshot as a, resolveChannelAccountState as i, projectChannelAccountDisplayState as n, resolveChannelAccountLinked as r, applyChannelAccountState as t };
