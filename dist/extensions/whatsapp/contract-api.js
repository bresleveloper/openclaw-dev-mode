import { c as normalizeWhatsAppTarget$1, t as isWhatsAppGroupJid$1 } from "./.setup/normalize-target-BGra1ZnM.mjs";
import { t as whatsappCommandPolicy$1 } from "./.setup/command-policy-BIOSHySD.mjs";
import { t as resolveLegacyGroupSessionKey$1 } from "./.setup/group-session-contract-DDnZSsJ1.mjs";
import { r as isLegacyGroupSessionKey$1, t as canonicalizeLegacySessionKey$1 } from "./.setup/session-contract-DMTm6Q_L.mjs";
import { resolveOpenProviderRuntimeGroupPolicy } from "openclaw/plugin-sdk/runtime-group-policy";
//#region extensions/whatsapp/contract-api.ts
const canonicalizeLegacySessionKey = canonicalizeLegacySessionKey$1;
const isLegacyGroupSessionKey = isLegacyGroupSessionKey$1;
const isWhatsAppGroupJid = isWhatsAppGroupJid$1;
const normalizeWhatsAppTarget = normalizeWhatsAppTarget$1;
const resolveLegacyGroupSessionKey = resolveLegacyGroupSessionKey$1;
const resolveWhatsAppRuntimeGroupPolicy = resolveOpenProviderRuntimeGroupPolicy;
const whatsappCommandPolicy = whatsappCommandPolicy$1;
//#endregion
export { canonicalizeLegacySessionKey, isLegacyGroupSessionKey, isWhatsAppGroupJid, normalizeWhatsAppTarget, resolveLegacyGroupSessionKey, resolveWhatsAppRuntimeGroupPolicy, whatsappCommandPolicy };
