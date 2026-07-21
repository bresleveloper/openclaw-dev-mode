import { t as DEFAULT_ACCOUNT_ID } from "../../account-id-C7N4Rwku.js";
import { r as buildChannelConfigSchema } from "../../config-schema-Bh8lZGlx.js";
import { p as formatTrimmedAllowFromEntries } from "../../channel-config-helpers-BH5RG2Ab.js";
import { a as resolveChannelMediaMaxBytes } from "../../media-runtime-DIRKCpVy.js";
import { t as chunkTextForOutbound } from "../../text-chunking-D2ymAM_S.js";
import { c as getChatChannelMeta } from "../../core-BsEPrOqQ.js";
import { t as PAIRING_APPROVED_MESSAGE } from "../../pairing-message-DNhqI-OE.js";
import { c as collectStatusIssuesFromLastError, r as buildComputedAccountStatusSnapshot } from "../../status-helpers-Dy-C1WAt.js";
import "../../channel-status-D0V3ybJh.js";
import { i as IMessageConfigSchema } from "../../bundled-channel-config-schema-CkfMA6sO.js";
import { a as resolveIMessageAccount } from "../../accounts-Dn5X-Fpm.js";
import { p as setIMessageRuntime } from "../../monitor-reply-cache-Bgia7eU4.js";
import { o as probeIMessage } from "../../sanitize-outbound-B2Vcaw3B.js";
import { n as resolveIMessageGroupToolPolicy, r as imessageMessageActions, t as resolveIMessageGroupRequireMention } from "../../group-policy-CgppL1Pb.js";
import { n as normalizeIMessageMessagingTarget, t as looksLikeIMessageTargetId } from "../../normalize-HkrX_pcN.js";
import "../../config-api-BlfjZlG_.js";
import { t as monitorIMessageProvider } from "../../monitor-B15kZ1N6.js";
import { t as sendMessageIMessage } from "../../send-Ct_t5gVj.js";
//#region extensions/imessage/src/config-accessors.ts
function resolveIMessageConfigAllowFrom(params) {
	return (resolveIMessageAccount(params).config.allowFrom ?? []).map((entry) => String(entry));
}
function resolveIMessageConfigDefaultTo(params) {
	const defaultTo = resolveIMessageAccount(params).config.defaultTo;
	if (defaultTo == null) return;
	return defaultTo.trim() || void 0;
}
//#endregion
export { DEFAULT_ACCOUNT_ID, IMessageConfigSchema, PAIRING_APPROVED_MESSAGE, buildChannelConfigSchema, buildComputedAccountStatusSnapshot, chunkTextForOutbound, collectStatusIssuesFromLastError, formatTrimmedAllowFromEntries, getChatChannelMeta, imessageMessageActions, looksLikeIMessageTargetId, monitorIMessageProvider, normalizeIMessageMessagingTarget, probeIMessage, resolveChannelMediaMaxBytes, resolveIMessageConfigAllowFrom, resolveIMessageConfigDefaultTo, resolveIMessageGroupRequireMention, resolveIMessageGroupToolPolicy, sendMessageIMessage, setIMessageRuntime };
