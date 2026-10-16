import { resolveOpenProviderRuntimeGroupPolicy as resolveZaloRuntimeGroupPolicy } from "openclaw/plugin-sdk/runtime-group-policy";
//#region extensions/zalo/src/group-access.ts
const ZALO_ALLOW_FROM_PREFIX_RE = /^(zalo|zl):/i;
function normalizeZaloAllowEntry(value) {
	return value.trim().replace(ZALO_ALLOW_FROM_PREFIX_RE, "").trim().toLowerCase();
}
//#endregion
export { resolveZaloRuntimeGroupPolicy as n, normalizeZaloAllowEntry as t };
