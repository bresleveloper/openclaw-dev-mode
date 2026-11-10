import { U as ModelProviderDeclarationConfig, z as ModelDefinitionConfig } from "../../types-D7I_F5Ux.js";
import "../../provider-model-shared-uYxY__EE.js";
import { t as ProviderOnboardPresetAppliers } from "../../provider-onboard-BNuhTHon.js";
//#region extensions/together/models.d.ts
export declare const TOGETHER_BASE_URL: string;
export declare const TOGETHER_MODEL_CATALOG: ModelDefinitionConfig[];
//#endregion
//#region extensions/together/provider-catalog.d.ts
export declare function buildTogetherProvider(): ModelProviderDeclarationConfig;
//#endregion
//#region extensions/together/onboard.d.ts
export declare const TOGETHER_DEFAULT_MODEL_REF: string;
declare const { applyConfig: applyTogetherConfig }: ProviderOnboardPresetAppliers<[]>;
declare const { applyConfig: applyTogetherConnectionConfig }: ProviderOnboardPresetAppliers<[]>;
//#endregion
export { applyTogetherConfig };