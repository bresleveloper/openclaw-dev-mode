import { aM as ReplyPayload } from "../config-contracts-hzlacViZ.js";
import { r as OpenClawConfig } from "../types.openclaw-D8uW-XQA.js";
import "../index-DSy-_0fC.js";
import "../thinking.shared-CbDUpGH9.js";
import "../approval-types-Bh5AmS0_.js";
import "../types-BLzNI-JA.js";
import "../provider-context-BvC7EnIY.js";
import { a as getModelsRuntimeChoices, i as buildPreparedModelsProviderData, n as ModelsProviderData, o as ModelsProviderMenu, r as ModelsRuntimeChoice, t as ModelsCommandSessionEntry } from "../commands-models-catalog-CBQbtldN.js";
import "../model-visibility-policy-WSpkRJ6C.js";
export declare const MODEL_PICKER_CHANGED_MESSAGE = "Available models changed. Open /models and choose again.";
/** @deprecated Use formatModelsAvailableHeaderAsync. Supported through 2026-12-31. Removal in the first January 2027 stable release. */
export declare function formatModelsAvailableHeader(params: {
  provider: string;
  total: number;
  cfg: OpenClawConfig;
  agentId?: string;
  agentDir?: string;
  workspaceDir?: string;
  sessionEntry?: ModelsCommandSessionEntry;
  availability?: ModelsProviderMenu;
}): string;
export declare function formatModelsAvailableHeaderAsync(params: Parameters<typeof formatModelsAvailableHeader>[0]): Promise<string>;
type ModelsCommandReplyParams = {
  cfg: OpenClawConfig;
  commandBodyNormalized: string;
  surface?: string;
  currentModel?: string;
  agentId?: string;
  agentDir?: string;
  workspaceDir?: string;
  sessionEntry?: ModelsCommandSessionEntry;
};
export declare function resolveModelsCommandReply(params: ModelsCommandReplyParams): Promise<ReplyPayload | null>;
export declare function buildModelsProviderData(...args: Parameters<typeof buildPreparedModelsProviderData>): Promise<ModelsProviderData>;
export { type ModelsProviderData, type ModelsRuntimeChoice, buildPreparedModelsProviderData, getModelsRuntimeChoices };