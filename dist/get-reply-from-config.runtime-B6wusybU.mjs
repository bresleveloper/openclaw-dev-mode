import { n as prewarmReplyRunRuntimes, t as getReplyFromConfig } from "./get-reply-D_5gWRAo.mjs";
//#region src/auto-reply/reply/get-reply-from-config.runtime.ts
/** Runtime facade for config-driven reply resolution. */
async function prewarmConfigDrivenReplyRuntime() {
	await prewarmReplyRunRuntimes();
}
//#endregion
export { getReplyFromConfig, prewarmConfigDrivenReplyRuntime };
