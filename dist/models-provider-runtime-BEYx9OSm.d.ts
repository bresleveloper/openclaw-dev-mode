import "./agent-harness-runtime-wMciqZ6Z.js";
import { r as OpenClawConfig } from "./types.openclaw-Ccmw-oTa.js";
import "./templating-0ElMwhje.js";
import { h as ReplyPayload } from "./reply-payload-DSrL-UWv.js";
import { i as buildPreparedModelsProviderData, n as ModelsProviderData, o as ModelsProviderMenu, t as ModelsCommandSessionEntry } from "./commands-models-catalog-B6bZhKt4.js";
//#region src/auto-reply/reply/commands-models.d.ts
declare const MODEL_PICKER_CHANGED_MESSAGE = "Available models changed. Open /models and choose again.";
declare function formatModelsAvailableHeader(params: {
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
declare function resolveModelsCommandReply(params: ModelsCommandReplyParams): Promise<ReplyPayload | null>;
//#endregion
//#region src/plugin-sdk/models-provider-runtime.d.ts
declare function buildModelsProviderData(...args: Parameters<typeof buildPreparedModelsProviderData>): Promise<ModelsProviderData>;
//#endregion
export { resolveModelsCommandReply as i, MODEL_PICKER_CHANGED_MESSAGE as n, formatModelsAvailableHeader as r, buildModelsProviderData as t };