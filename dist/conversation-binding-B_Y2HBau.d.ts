import { a as PluginConversationBindingResolvedEvent, i as PluginConversationBindingResolutionDecision, n as PluginConversationBindingRequestParams, r as PluginConversationBindingRequestResult, t as PluginConversationBinding } from "./conversation-binding.types-DddMb3XF.js";
//#region src/plugins/conversation-binding-pending.d.ts
type PendingPluginBindingRequest = PluginConversationBindingResolvedEvent["request"] & {
  id: string;
  pluginId: string;
  pluginName?: string;
  pluginRoot: string;
};
//#endregion
//#region src/plugins/conversation-binding.d.ts
type PluginBindingApprovalDecision = PluginConversationBindingResolutionDecision;
type PluginBindingConversation = PluginConversationBindingResolvedEvent["request"]["conversation"];
type PluginBindingApprovalAction = {
  approvalId: string;
  decision: PluginBindingApprovalDecision;
};
type PluginBindingResolveResult = {
  status: "approved";
  binding: PluginConversationBinding;
  request: PendingPluginBindingRequest;
  decision: Exclude<PluginBindingApprovalDecision, "deny">;
} | {
  status: "denied";
  request: PendingPluginBindingRequest;
} | {
  status: "expired";
};
declare function buildPluginBindingApprovalCustomId(approvalId: string, decision: PluginBindingApprovalDecision): string;
declare function parsePluginBindingApprovalCustomId(value: string): PluginBindingApprovalAction | null;
declare function requestPluginConversationBinding(params: {
  pluginId: string;
  pluginName?: string;
  pluginRoot: string;
  conversation: PluginBindingConversation;
  requestedBySenderId?: string;
  binding: PluginConversationBindingRequestParams | undefined;
  assertCurrent?: () => void;
}): Promise<PluginConversationBindingRequestResult>;
declare function resolvePluginConversationBindingApproval(params: {
  approvalId: string;
  decision: PluginBindingApprovalDecision;
  senderId?: string;
}): Promise<PluginBindingResolveResult>;
declare function buildPluginBindingResolvedText(params: PluginBindingResolveResult): string;
//#endregion
export { resolvePluginConversationBindingApproval as a, requestPluginConversationBinding as i, buildPluginBindingResolvedText as n, parsePluginBindingApprovalCustomId as r, buildPluginBindingApprovalCustomId as t };