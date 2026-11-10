import { S as resolveIsConfigReadOnly } from "./paths-orClZ-2Z.mjs";
import "./operator-scopes-BO7_XQCg.mjs";
import { n as resolveStickyModelSelectionPolicy } from "./sticky-model-selection-BU6sDfPI.mjs";
//#region src/gateway/server-methods/session-model-selection-policy.ts
function resolveGatewayModelSelectionPolicy(params) {
	return resolveStickyModelSelectionPolicy({
		canPersistConfig: params.callerScopes.includes("operator.admin") && !resolveIsConfigReadOnly(process.env),
		cfg: params.cfg,
		...params.scope ? { scope: params.scope } : {}
	});
}
//#endregion
export { resolveGatewayModelSelectionPolicy as t };
