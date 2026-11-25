import{c as normalizeOptionalLowercaseString}from"./string-coerce-CpTFcSwY.mjs";
//!packages/acp-core/src/types.ts
const ACP_PROVENANCE_MODE_VALUES=[`off`,`meta`,`meta+receipt`];function normalizeAcpProvenanceMode(e){const t=normalizeOptionalLowercaseString(e);return ACP_PROVENANCE_MODE_VALUES.find(e=>e===t)}export{normalizeAcpProvenanceMode as t};