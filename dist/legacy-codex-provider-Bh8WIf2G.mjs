import{c as normalizeOptionalLowercaseString}from"./string-coerce-CpTFcSwY.mjs";
//!src/config/legacy-codex-provider.ts
const LEGACY_CODEX_PROVIDER_IDS=/* @__PURE__ */ new Set([`codex`,`openai-codex`]);function isLegacyCodexProviderId(e){const t=normalizeOptionalLowercaseString(e);return t?LEGACY_CODEX_PROVIDER_IDS.has(t):false}export{isLegacyCodexProviderId as t};