import { r as requestBrowserJson, t as browserClientTimeout } from "./client-request-B7F7uOcw.mjs";
//#region extensions/browser/src/browser/client-tab-close.runtime.ts
/** Close a canonical raw target id selected by OpenClaw's internal tab bookkeeping. */
async function browserCloseTabByRawTargetId(baseUrl, targetId, opts) {
	const path = `/tabs/${encodeURIComponent(targetId)}?targetIdMode=raw`;
	await requestBrowserJson(baseUrl, path, {
		profile: opts?.profile,
		method: "DELETE",
		timeoutMs: browserClientTimeout(baseUrl, opts?.timeoutMs, 5e3),
		signal: opts?.signal
	});
}
//#endregion
export { browserCloseTabByRawTargetId };
