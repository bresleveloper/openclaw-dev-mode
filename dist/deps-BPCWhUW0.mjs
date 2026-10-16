import { i as getOrCreatePromise } from "./lazy-promise-DGqyc4Y4.mjs";
import { i as normalizeChatChannelId } from "./ids-BFfFS5ep.mjs";
import "./registry-B3Y-vjit.mjs";
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
const senderCache = /* @__PURE__ */ new Map();
function createLazySender(channelId) {
	return async (...args) => {
		return await (await getOrCreatePromise(senderCache, channelId, async () => {
			const { createChannelOutboundRuntimeSend } = await import("./channel-outbound-send-C8eP2OMK.mjs");
			return createChannelOutboundRuntimeSend({
				channelId,
				unavailableMessage: `${channelId} outbound adapter is unavailable.`
			});
		}, { cacheRejections: false })).sendMessage(...args);
	};
}
function createDefaultDeps() {
	return new Proxy({}, { get(target, property, receiver) {
		if (typeof property !== "string") return Reflect.get(target, property, receiver);
		const existing = Reflect.get(target, property, receiver);
		if (existing !== void 0 || NON_CHANNEL_DEP_KEYS.has(property)) return existing;
		const channelId = normalizeChatChannelId(property);
		if (!channelId) return existing;
		return createLazySender(channelId);
	} });
}
//#endregion
export { createDefaultDeps as t };
