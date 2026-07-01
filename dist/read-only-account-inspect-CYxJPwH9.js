import { n as getBundledChannelAccountInspector } from "./bundled-rTRi0B0q.js";
import { n as getLoadedChannelPlugin } from "./registry-Ba1KQQW12.js";
//#region src/channels/read-only-account-inspect.ts
/** Inspects channel account config without loading mutable runtime surfaces. */
async function inspectReadOnlyChannelAccount(params) {
	const inspectAccount = getLoadedChannelPlugin(params.channelId)?.config.inspectAccount ?? getBundledChannelAccountInspector(params.channelId);
	if (!inspectAccount) return null;
	return await Promise.resolve(inspectAccount(params.cfg, params.accountId));
}
//#endregion
export { inspectReadOnlyChannelAccount as t };
