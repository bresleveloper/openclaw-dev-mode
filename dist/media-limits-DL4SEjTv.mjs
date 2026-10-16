import "./session-key-C09ow4h0.mjs";
import { n as normalizeAccountId } from "./account-id-DbRsdayc.mjs";
//#region src/channels/plugins/media-limits.ts
const MB = 1048576;
/** Resolves channel media limit bytes from account-specific config or agent defaults. */
function resolveChannelMediaMaxBytes(params) {
	const accountId = normalizeAccountId(params.accountId);
	const limitMb = params.resolveChannelLimitMb({
		cfg: params.cfg,
		accountId
	}) || params.cfg.agents?.defaults?.mediaMaxMb;
	return limitMb ? limitMb * MB : void 0;
}
//#endregion
export { resolveChannelMediaMaxBytes as t };
