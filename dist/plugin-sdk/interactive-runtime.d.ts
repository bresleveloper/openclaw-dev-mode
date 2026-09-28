import "../templating-OpWn1DzT.js";
import { h as ReplyPayload } from "../reply-payload-Dv0rYqXd.js";
import { $ as resolveMessagePresentationButtonAction, A as ModelPickerAction, B as legacyInteractiveReplyToPresentation, C as MessagePresentationInteractiveBlock, D as MessagePresentationTableCell, E as MessagePresentationTableBlock, F as hasMessagePresentationBlocks, G as presentationToInteractiveReply, H as normalizeLegacyInteractiveReply, I as hasReplyChannelData, J as renderMessagePresentationFallbackText, K as reduceLegacyInteractiveReply, L as hasReplyContent, M as ReplyPayloadDeliveryPin, N as hasInteractiveReplyBlocks, O as MessagePresentationTextBlock, P as hasLegacyInteractiveReplyBlocks, Q as resolveMessagePresentationActionValue, R as interactiveReplyToPresentation, S as MessagePresentationDividerBlock, T as MessagePresentationSelectBlock, U as normalizeMessagePresentation, V as normalizeInteractiveReply, W as presentationToInteractiveControlsReply, X as resolveInteractiveTextFallback, Y as renderMessagePresentationTableFallbackText, Z as resolveLegacyInteractiveTextFallback, _ as MessagePresentationButtonsBlock, a as InteractiveReplyOption, b as MessagePresentationChartSeries, c as LegacyInteractiveReplyButton, d as LegacyInteractiveReplyTextBlock, et as resolveMessagePresentationControlValue, f as MessagePresentation, g as MessagePresentationButtonStyle, h as MessagePresentationButton, i as InteractiveReplyButton, j as ReplyPayloadDelivery, k as MessagePresentationTone, l as LegacyInteractiveReplyOption, m as MessagePresentationBlock, n as InteractiveReply, o as LegacyInteractiveReply, p as MessagePresentationAction, q as renderMessagePresentationChartFallbackText, r as InteractiveReplyBlock, s as LegacyInteractiveReplyBlock, t as InteractiveButtonStyle, tt as resolveMessagePresentationOptionAction, u as LegacyInteractiveReplySelectBlock, v as MessagePresentationChartBlock, w as MessagePresentationOption, x as MessagePresentationContextBlock, y as MessagePresentationChartSegment, z as isMessagePresentationInteractiveBlock } from "../payload-Co5fPRVS.js";
import { a as ChannelPresentationCapabilities } from "../outbound.types-HYq1MKG1.js";
//#region src/channels/plugins/outbound/presentation-limits.d.ts
/**
 * Adapt a portable presentation to the target channel's advertised capabilities.
 *
 * Unsupported controls are downgraded to text/context fallback blocks where possible, and
 * controls honor channel limits while authored and fallback text retain every character.
 */
export declare function adaptMessagePresentationForChannel(params: {
  presentation: MessagePresentation;
  capabilities?: ChannelPresentationCapabilities;
}): MessagePresentation;
/** Return the subset of buttons that can still be rendered under action limits. */
export declare function applyPresentationActionLimits(buttons: readonly MessagePresentationButton[], capabilities?: ChannelPresentationCapabilities): MessagePresentationButton[];
/** Resolve an action page size that leaves room for reserved actions on the target channel. */
export declare function presentationPageSize(capabilities?: ChannelPresentationCapabilities, reservedActions?: number, maxPageSize?: number): number;
//#endregion
//#region src/model-picker/capabilities.d.ts
type ModelPickerCapabilityProfile = {
  presentation: ChannelPresentationCapabilities;
  callback: {
    limit: number;
    unit: "utf8-bytes" | "utf16-units";
  };
  response: {
    supportsEphemeral: boolean;
    supportsEdit: boolean;
    supportsReplace: boolean;
  };
};
//#endregion
//#region src/channels/plugins/outbound/presentation-delivery.d.ts
/** Apply the same native rendering and fallback policy to every channel delivery path. */
export declare function renderPresentationForDelivery(handler: {
  presentationCapabilities?: ChannelPresentationCapabilities;
  renderPresentation?: (payload: ReplyPayload & {
    presentation: MessagePresentation;
  }, sourcePresentation?: MessagePresentation) => ReplyPayload | null | Promise<ReplyPayload | null>;
}, payload: ReplyPayload): Promise<ReplyPayload>;
//#endregion
//#region src/plugin-sdk/interactive-runtime.d.ts
/** @deprecated Use MessagePresentation helpers for new rendering paths. */
export declare const reduceInteractiveReply: typeof reduceLegacyInteractiveReply;
//#endregion
export { type InteractiveButtonStyle, type InteractiveReply, type InteractiveReplyBlock, type InteractiveReplyButton, type InteractiveReplyOption, type LegacyInteractiveReply, type LegacyInteractiveReplyBlock, type LegacyInteractiveReplyButton, type LegacyInteractiveReplyOption, type LegacyInteractiveReplySelectBlock, type LegacyInteractiveReplyTextBlock, type MessagePresentation, type MessagePresentationAction, type MessagePresentationBlock, type MessagePresentationButton, type MessagePresentationButtonStyle, type MessagePresentationButtonsBlock, type MessagePresentationChartBlock, type MessagePresentationChartSegment, type MessagePresentationChartSeries, type MessagePresentationContextBlock, type MessagePresentationDividerBlock, type MessagePresentationInteractiveBlock, type MessagePresentationOption, type MessagePresentationSelectBlock, type MessagePresentationTableBlock, type MessagePresentationTableCell, type MessagePresentationTextBlock, type MessagePresentationTone, type ModelPickerAction, type ModelPickerCapabilityProfile, type ReplyPayloadDelivery, type ReplyPayloadDeliveryPin, hasInteractiveReplyBlocks, hasLegacyInteractiveReplyBlocks, hasMessagePresentationBlocks, hasReplyChannelData, hasReplyContent, interactiveReplyToPresentation, isMessagePresentationInteractiveBlock, legacyInteractiveReplyToPresentation, normalizeInteractiveReply, normalizeLegacyInteractiveReply, normalizeMessagePresentation, presentationToInteractiveControlsReply, presentationToInteractiveReply, reduceLegacyInteractiveReply, renderMessagePresentationChartFallbackText, renderMessagePresentationFallbackText, renderMessagePresentationTableFallbackText, resolveInteractiveTextFallback, resolveLegacyInteractiveTextFallback, resolveMessagePresentationActionValue, resolveMessagePresentationButtonAction, resolveMessagePresentationControlValue, resolveMessagePresentationOptionAction };