import { n as createLazyPromise } from "./lazy-promise-DGqyc4Y4.mjs";
import { i as normalizeChatChannelId } from "./ids-DhLNdNuz.mjs";
import "./registry-DqsL4UWB.mjs";
//#region src/cli/deps.ts
const loadSendRuntime = createLazyPromise(() => import("./channel-outbound-send-CoNXaG8P.mjs"));
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
function createDefaultDeps() {
	return new Proxy({}, { get(target, property, receiver) {
		if (typeof property !== "string") return Reflect.get(target, property, receiver);
		const existing = Reflect.get(target, property, receiver);
		if (existing !== void 0 || NON_CHANNEL_DEP_KEYS.has(property)) return existing;
		const channelId = normalizeChatChannelId(property);
		if (!channelId) return existing;
		return async (to, text, opts) => await (await loadSendRuntime()).sendChannelOutboundMessage(channelId, to, text, opts);
	} });
}
//#endregion
export { createDefaultDeps as t };
