import { resolveGlobalSingleton } from "openclaw/plugin-sdk/global-singleton";
import { KeyedAsyncQueue } from "openclaw/plugin-sdk/keyed-async-queue";
//#region extensions/codex/src/app-server/thread-ownership-queue.ts
const nativeThreadOwners = resolveGlobalSingleton(Symbol.for("openclaw.codexNativeThreadOwners"), () => new KeyedAsyncQueue());
function mutationQueue(namespace) {
	return async (id, run) => await nativeThreadOwners.enqueue(`${namespace}:${id}`, run);
}
/** Serialize OpenClaw-owned lifecycle changes, not native-internal thread controllers. */
const withCodexAppServerThreadMutation = mutationQueue("thread");
/** Serializes bound turns and retirement so detach cannot unsubscribe an active turn. */
const withCodexConversationThreadActivity = mutationQueue("conversation");
//#endregion
export { withCodexConversationThreadActivity as n, withCodexAppServerThreadMutation as t };
