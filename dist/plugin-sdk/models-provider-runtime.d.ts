import { r as OpenClawConfig } from "../types.openclaw-DWWUw8hA.js";
import { pn as ReplyPayload } from "../reply-payload-DazZPys5.js";
import "../config-Dpca5-xX.js";
import "../defaults-D0SAbcb2.js";
import "../approval-types-DOLowId2.js";
import "../index-B4F-ENEv.js";
import "../agent-harness-runtime-DZjstJNb.js";
import "../thinking.shared-BC6c30Ed.js";
import "../types-D0Cawybo.js";
import "../types.public-DpLTXZT0.js";
import { a as getModelsRuntimeChoices, i as buildPreparedModelsProviderData, n as ModelsProviderData, o as ModelsProviderMenu, r as ModelsRuntimeChoice, t as ModelsCommandSessionEntry } from "../commands-models-catalog-tFbmIe35.js";
import "../model-visibility-policy-DQTUSh5_.js";
//#region src/auto-reply/reply/commands-models.d.ts
export declare const MODEL_PICKER_CHANGED_MESSAGE = "Available models changed. Open /models and choose again.";
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