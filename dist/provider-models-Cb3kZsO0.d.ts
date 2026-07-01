import { f as Model, n as Api } from "./types-Boa_mcGH.js";
import { Kt as ProviderResolveDynamicModelContext } from "./plugin-entry-DpILbQ7M.js";

//#region extensions/xai/provider-models.d.ts
declare function isModernXaiModel(modelId: string): boolean;
declare function resolveXaiForwardCompatModel(params: {
  providerId: string;
  ctx: ProviderResolveDynamicModelContext;
}): (Model<Api> & {
  compat: Record<string, unknown>;
  thinkingLevelMap: Partial<Record<"off" | "minimal" | "high" | "low" | "medium" | "xhigh", string | null>>;
}) | undefined;
//#endregion
export { resolveXaiForwardCompatModel as n, isModernXaiModel as t };