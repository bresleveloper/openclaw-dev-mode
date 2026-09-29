import { i as getOrCreatePromise } from "./lazy-promise-DGqyc4Y4.mjs";
import { i as normalizeChatChannelId } from "./ids-NACrHrny.mjs";
import "./registry-BKdVEB34.mjs";
//#region src/cli/deps.ts
const NON_CHANNEL_DEP_KEYS = /* @__PURE__ */ new Set([
	"__proto__",
	"constructor",
	"cron",
	"cronConfig",
	"cronEnabled",
	"defaultAgentId",
	"enqueueSystemEvent",
	"getQueueSize",
	"hasOwnProperty",
	"inspect",
	"log",
	"migrateOrphanedSessionKeys",
	"nowMs",
	"onEvent",
	"requestHeartbeat",
	"resolveSessionStorePath",
	"runHeartbeatOnce",
	"runIsolatedAgentJob",
	"runtime",
	"sendCronFailureAlert",
	"sessionStorePath",
	"storePath",
	"then",
	"toJSON",
	"toString",
	"valueOf"
]);
function resolveKnownChannelId(raw) {
	return normalizeChatChannelId(raw) ?? void 0;
}
const senderCache = /* @__PURE__ */ new Map();
/**
* Create a lazy-loading send function proxy for a channel.
* The channel's module is loaded on first call and cached for reuse.
*/
function createLazySender(channelId, loader) {
	return async (...args) => {
		return await (await getOrCreatePromise(senderCache, channelId, async () => (await loader()).runtimeSend, { cacheRejections: false })).sendMessage(...args);
	};
}
function createDefaultDeps() {
	const deps = {};
	const resolveSender = (channelId) => createLazySender(channelId, async () => {
		const { createChannelOutboundRuntimeSend } = await import("./channel-outbound-send-s3sJguom.mjs");
		return { runtimeSend: createChannelOutboundRuntimeSend({
			channelId,
			unavailableMessage: `${channelId} outbound adapter is unavailable.`
		}) };
	});
	return new Proxy(deps, { get(target, property, receiver) {
		if (typeof property !== "string") return Reflect.get(target, property, receiver);
		const existing = Reflect.get(target, property, receiver);
		if (existing !== void 0 || NON_CHANNEL_DEP_KEYS.has(property)) return existing;
		const channelId = resolveKnownChannelId(property);
		if (!channelId) return existing;
		return resolveSender(channelId);
	} });
}
//#endregion
export { createDefaultDeps as t };
