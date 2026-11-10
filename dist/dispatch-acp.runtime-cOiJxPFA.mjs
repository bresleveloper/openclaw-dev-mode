import { n as createLazyPromise } from "./lazy-promise-DGqyc4Y4.mjs";
//#region src/auto-reply/reply/dispatch-acp.runtime.ts
const loadDispatchAcp = createLazyPromise(() => import("./dispatch-acp-Dphz64Fm.mjs"));
const loadDispatchAcpCommandBypass = createLazyPromise(() => import("./dispatch-acp-command-bypass-Ceb3f4dL.mjs"));
async function shouldBypassAcpDispatchForCommand(...args) {
	return (await loadDispatchAcpCommandBypass()).shouldBypassAcpDispatchForCommand(...args);
}
async function tryDispatchAcpReply(...args) {
	return await (await loadDispatchAcp()).tryDispatchAcpReplyCore(...args);
}
//#endregion
export { shouldBypassAcpDispatchForCommand, tryDispatchAcpReply };
