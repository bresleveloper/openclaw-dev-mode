import { t as getBundledChannelAccountInspector } from "./bundled-DN3obb3J.mjs";
import { n as getLoadedChannelPlugin } from "./registry-DOE8N7Jo.mjs";
//#region src/channels/read-only-account-inspect.ts
/** Inspects channel account config without loading mutable runtime surfaces. */
async function inspectReadOnlyChannelAccount(params) {
	const inspectAccount = getLoadedChannelPlugin(params.channelId)?.config.inspectAccount ?? getBundledChannelAccountInspector(params.channelId);
	if (!inspectAccount) return null;
	return await inspectAccount(params.cfg, params.accountId);
}
//#endregion
export { inspectReadOnlyChannelAccount as t };
