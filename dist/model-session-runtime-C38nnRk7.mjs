import "./agent-limits-CB2bq0ey.mjs";
import "./session-runtime-compat-BQN27lQg.mjs";
import "./session-model-ref-BTkDCi12.mjs";
import "./store-runtime-CwqGD12G.mjs";
import "./model-overrides-DCHjkmdI.mjs";
import "./auth-profile-preservation-UYIf2L8-.mjs";
import { t as applySessionModelSelectionInternal } from "./apply-session-model-selection-Deuwlvc3.mjs";
//#region src/plugin-sdk/model-session-runtime.ts
/**
* Runtime SDK subpath for model overrides and agent concurrency session helpers.
*/
const applySessionModelSelection = (params) => applySessionModelSelectionInternal({
	...params,
	...params.validateAuthProfileSelection ? { nativeCommitValidation: true } : {}
});
//#endregion
export { applySessionModelSelection as t };
