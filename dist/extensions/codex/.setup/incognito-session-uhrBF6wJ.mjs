import { resolveGlobalSingleton } from "openclaw/plugin-sdk/global-singleton";
import { KeyedAsyncQueue } from "openclaw/plugin-sdk/keyed-async-queue";
import { isIncognitoSessionKey as isIncognitoSessionKey$1 } from "openclaw/plugin-sdk/session-key-runtime";
//#region extensions/codex/src/app-server/thread-ownership-queue.ts
const nativeThreadOwners = resolveGlobalSingleton(Symbol.for("openclaw.codexNativeThreadOwners"), () => new KeyedAsyncQueue());
/** Serialize OpenClaw-owned lifecycle changes, not native-internal thread controllers. */
async function withCodexAppServerThreadMutation(threadId, run) {
	return await nativeThreadOwners.enqueue(`thread:${threadId}`, run);
}
/** Serializes bound turns and retirement so detach cannot unsubscribe an active turn. */
async function withCodexConversationThreadActivity(bindingId, run) {
	return await nativeThreadOwners.enqueue(`conversation:${bindingId}`, run);
}
//#endregion
export { withCodexAppServerThreadMutation as n, withCodexConversationThreadActivity as r, isIncognitoSessionKey$1 as t };
