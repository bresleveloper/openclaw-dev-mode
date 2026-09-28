import "./session-key-CBvmC8zz.mjs";
import { n as normalizeAccountId } from "./account-id-B1bfbA5J.mjs";
//#region src/channels/plugins/media-limits.ts
const MB = 1048576;
/** Resolves channel media limit bytes from account-specific config or agent defaults. */
function resolveChannelMediaMaxBytes(params) {
	const accountId = normalizeAccountId(params.accountId);
	const channelLimit = params.resolveChannelLimitMb({
		cfg: params.cfg,
		accountId
	});
	if (channelLimit) return channelLimit * MB;
	if (params.cfg.agents?.defaults?.mediaMaxMb) return params.cfg.agents.defaults.mediaMaxMb * MB;
}
//#endregion
export { resolveChannelMediaMaxBytes as t };
