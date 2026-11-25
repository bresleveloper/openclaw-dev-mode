import { n as SessionEntry } from "./config-contracts-hzlacViZ.js";
import { r as OpenClawConfig } from "./types.openclaw-D8uW-XQA.js";
import { C as ModelCatalogEntry } from "./provider-context-BvC7EnIY.js";
type ModelsProviderMenu = {
  available: number;
  notice: string;
};
type ModelsMenu = {
  modelNames: ReadonlyMap<string, string>;
  byProvider: ReadonlyMap<string, ModelsProviderMenu>;
};
type ModelsCommandSessionEntry = Partial<Pick<SessionEntry, "authProfileOverride" | "authProfileOverrideSource" | "authProfileOverrideCompactionCount" | "modelProvider" | "providerOverride" | "model" | "modelSelectionLocked" | "agentRuntimeOverride">>;
type ModelsProviderData = {
  byProvider: Map<string, Set<string>>;
  pendingProviders?: readonly string[];
  providers: string[];
  resolvedDefault: {
    provider: string;
    model: string;
  };
  modelNames: Map<string, string>;
  modelMenu?: ModelsMenu;
  refreshWarning?: string;
  runtimeChoicesByProvider?: Map<string, ModelsRuntimeChoice[]>;
  runtimeChoicesByModel?: Map<string, ModelsRuntimeChoice[]>;
  isCurrent?: () => boolean;
};
type PreparedModelsProviderData = ModelsProviderData & {
  modelCatalog: ModelCatalogEntry[];
};
type ModelsBrowseOptions = {
  view?: "default" | "all";
  workspaceDir?: string;
  sessionEntry?: ModelsCommandSessionEntry;
};
type ModelsRuntimeChoice = {
  id: string;
  label: string;
  description: string;
};
/** Undefined is unknown; an empty list is an authoritative refusal. */
declare function getModelsRuntimeChoices(data: ModelsProviderData, provider: string, model?: string): ModelsRuntimeChoice[] | undefined;
declare function buildPreparedModelsProviderData(cfg: OpenClawConfig, agentId?: string, options?: ModelsBrowseOptions): Promise<PreparedModelsProviderData>;
export { getModelsRuntimeChoices as a, buildPreparedModelsProviderData as i, ModelsProviderData as n, ModelsProviderMenu as o, ModelsRuntimeChoice as r, ModelsCommandSessionEntry as t };