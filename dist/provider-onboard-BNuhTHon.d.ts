import { M as OpenClawConfig } from "./types-D7I_F5Ux.js";
import "./model-input-Dw6jSbg2.js";
//#region src/plugin-sdk/provider-onboard.d.ts
/** Pair of preset appliers exposed by provider setup modules. */
type ProviderOnboardPresetAppliers<TArgs extends unknown[]> = {
  applyProviderConfig: (cfg: OpenClawConfig, ...args: TArgs) => OpenClawConfig;
  applyConfig: (cfg: OpenClawConfig, ...args: TArgs) => OpenClawConfig;
};
//#endregion
export { ProviderOnboardPresetAppliers as t };