import { Jt as OpenClawConfig, Yt as ModelDefinitionConfig, Zt as ModelProviderDeclarationConfig } from "../../runtime-api-Bekxb7wO.js";
import "../../provider-model-shared-D4njaASJ.js";
//#region extensions/together/models.d.ts
export declare const TOGETHER_BASE_URL: string;
export declare const TOGETHER_MODEL_CATALOG: ModelDefinitionConfig[];
//#endregion
//#region extensions/together/provider-catalog.d.ts
export declare function buildTogetherProvider(): ModelProviderDeclarationConfig;
//#endregion
//#region extensions/together/onboard.d.ts
export declare const TOGETHER_DEFAULT_MODEL_REF: string;
export declare const applyTogetherConfig: (cfg: OpenClawConfig) => OpenClawConfig;
//#endregion