import { n as formatConcreteConfigPath } from "./dot-path-CVD5Jolm.mjs";
import "./paths-orClZ-2Z.mjs";
import { u as hasUnresolvedConfigPath } from "./resolution-facts-D_pto3MV.mjs";
import "./path-context-B0Rya5D6.mjs";
import "./gateway-http-route-contracts-jBtizxKU.mjs";
//#region src/config/unresolved-config-value.ts
/**
* Reports whether config loading left a `${VAR}` reference unresolved at this value.
* Pass the root runtime config (facts do not survive copies) and concrete path
* segments, so peer names containing dots are quoted exactly as the loader records them.
*/
function hasUnresolvedConfigValue(cfg, segments) {
	return hasUnresolvedConfigPath(cfg, formatConcreteConfigPath(segments, cfg));
}
//#endregion
export { hasUnresolvedConfigValue as t };
