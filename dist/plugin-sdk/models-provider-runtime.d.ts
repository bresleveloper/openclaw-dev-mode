import { M as OpenClawConfig } from "../types-D7I_F5Ux.js";
import { _k as ReplyPayload } from "../config-contracts-CY87ANNp.js";
import "../index-8f56f6LD.js";
import "../approval-types-faKMZQ8q.js";
import "../model-selection-DoE_lu2k.js";
import "../config-S5Zm-Svf.js";
import "../thinking.shared-COcvrWJf.js";
import "../types-CeA70ktN.js";
import { a as getModelsRuntimeChoices, i as buildPreparedModelsProviderData, n as ModelsProviderData, o as ModelsProviderMenu, r as ModelsRuntimeChoice, t as ModelsCommandSessionEntry } from "../commands-models-catalog-DJDeWgJv.js";
import "../model-visibility-policy-B7QpSRrk.js";
//#region src/auto-reply/reply/commands-models.d.ts
export declare const MODEL_PICKER_CHANGED_MESSAGE = "Available models changed. Open /models and choose again.";
/** @deprecated Use formatModelsAvailableHeaderAsync. Supported through 2026-12-31. */
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
//#endregion
//#region src/plugin-sdk/models-provider-runtime.d.ts
export declare function buildModelsProviderData(...args: Parameters<typeof buildPreparedModelsProviderData>): Promise<ModelsProviderData>;
//#endregion
export { type ModelsProviderData, type ModelsRuntimeChoice, buildPreparedModelsProviderData, getModelsRuntimeChoices };