import { t as DEFAULT_ACCOUNT_ID } from "../../account-id-5IgE9UKY.js";
import { r as buildChannelConfigSchema } from "../../config-schema-BlCHjLEp.js";
import { p as formatTrimmedAllowFromEntries } from "../../channel-config-helpers-CMg35hQR.js";
import { a as resolveChannelMediaMaxBytes } from "../../media-runtime-BGWQwoXi.js";
import { t as chunkTextForOutbound } from "../../text-chunking-nijjGL3g.js";
import { c as getChatChannelMeta } from "../../core-BbmhFA6e.js";
import { t as PAIRING_APPROVED_MESSAGE } from "../../pairing-message-DNhqI-OE.js";
import { c as collectStatusIssuesFromLastError, r as buildComputedAccountStatusSnapshot } from "../../status-helpers-DjJ0OuL_.js";
import "../../channel-status-CxP0h-5H.js";
import { i as IMessageConfigSchema } from "../../bundled-channel-config-schema-CqRzCASC.js";
import { a as resolveIMessageAccount } from "../../accounts-DUM5L2-f.js";
import { p as setIMessageRuntime } from "../../monitor-reply-cache-CmItiAN-.js";
import { o as probeIMessage } from "../../sanitize-outbound-D5gKfyEf.js";
import { n as resolveIMessageGroupToolPolicy, r as imessageMessageActions, t as resolveIMessageGroupRequireMention } from "../../group-policy-Chb5241K.js";
import { n as normalizeIMessageMessagingTarget, t as looksLikeIMessageTargetId } from "../../normalize-C2UJdO1F.js";
import "../../config-api-e5ZAUlR4.js";
import { t as monitorIMessageProvider } from "../../monitor-B3JMiT1u.js";
import { t as sendMessageIMessage } from "../../send-CdQ_Lu71.js";
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
