import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { c as isSecretRef, p as isValidSecretRef } from "./ref-contract-Bfd9_-Lp.mjs";
import "./types.secrets-Dgbd2kyP.mjs";
import { t as isPluginJsonValue } from "./host-hook-json-CvItNyy3.mjs";
import { t as isSensitiveConfigPath } from "./sensitive-paths-CieLU95K.mjs";
//#region src/config/provider-settings.ts
/** Provider settings stay bounded JSON and retain secrets as references until provider use. */
function validateProviderSettings(value, label) {
	if (typeof value !== "object" || value === null || Array.isArray(value) || !isPluginJsonValue(value)) return `${label} settings must be bounded finite JSON`;
	const visit = (entry) => {
		if (Array.isArray(entry)) return entry.map(visit).find((error) => error !== void 0);
		if (typeof entry !== "object" || entry === null) return;
		for (const [key, child] of Object.entries(entry)) {
			const baseKey = key.replace(/ref$/i, "");
			if (key.toLowerCase() === "keyref" || /^(?:accesskeyid|passphrase)$/i.test(baseKey) || isSensitiveConfigPath(key) || baseKey !== key && isSensitiveConfigPath(baseKey)) {
				if (isSecretRef(child) && isValidSecretRef(child)) continue;
				if (baseKey.toLowerCase().endsWith("secrets") && isRecord(child) && Object.values(child).every((ref) => isSecretRef(ref) && isValidSecretRef(ref))) continue;
				return `${label} ${key} must use a SecretRef or a map of SecretRefs for plural secrets`;
			}
			const error = visit(child);
			if (error) return error;
		}
	};
	return visit(value);
}
//#endregion
export { validateProviderSettings as t };
