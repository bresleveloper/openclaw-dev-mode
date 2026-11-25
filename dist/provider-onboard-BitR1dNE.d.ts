import { r as OpenClawConfig } from "./types.openclaw-D8uW-XQA.js";
import "./model-input-Cl5jEhsO.js";
/** Pair of preset appliers exposed by provider setup modules. */
type ProviderOnboardPresetAppliers<TArgs extends unknown[]> = {
  applyProviderConfig: (cfg: OpenClawConfig, ...args: TArgs) => OpenClawConfig;
  applyConfig: (cfg: OpenClawConfig, ...args: TArgs) => OpenClawConfig;
};
export { ProviderOnboardPresetAppliers as t };