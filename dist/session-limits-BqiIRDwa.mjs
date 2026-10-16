//#region src/gateway/terminal/session-limits.ts
/**
* Rolling output retained per session for reattach replay and agent tool reads,
* in UTF-16 code units. The session cap keeps worst-case memory bounded.
*/
const DEFAULT_SCROLLBACK_CHARS = 262144;
/** Default grace period before a detached session is killed (seconds). */
const DEFAULT_TERMINAL_DETACH_SECONDS = 300;
//#endregion
export { DEFAULT_TERMINAL_DETACH_SECONDS as n, DEFAULT_SCROLLBACK_CHARS as t };
