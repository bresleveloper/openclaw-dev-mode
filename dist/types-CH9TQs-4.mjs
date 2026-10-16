import { c as normalizeOptionalLowercaseString } from "./string-coerce-1VuiLaaR.mjs";
//#region packages/acp-core/src/types.ts
const ACP_PROVENANCE_MODE_VALUES = [
	"off",
	"meta",
	"meta+receipt"
];
function normalizeAcpProvenanceMode(value) {
	const normalized = normalizeOptionalLowercaseString(value);
	return ACP_PROVENANCE_MODE_VALUES.find((mode) => mode === normalized);
}
//#endregion
export { normalizeAcpProvenanceMode as t };
