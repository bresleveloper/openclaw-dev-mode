import { n as resolveBuzzAccountConfig } from "./account-config-BKcQfUTN.mjs";
import { resolveSecretInputString } from "openclaw/plugin-sdk/secret-input";
import { getPublicKey, nip19 } from "nostr-tools";
import { assertSecretOwnerAvailable } from "openclaw/plugin-sdk/channel-secret-owner-runtime";
import { normalizeLowercaseStringOrEmpty, normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
// extensions/buzz/src/types.ts
function decodeBuzzPrivateKey(value) {
	const trimmed = value.trim();
	if (/^[0-9a-f]{64}$/iu.test(trimmed)) return Uint8Array.from(Buffer.from(trimmed, "hex"));
	const decoded = nip19.decode(trimmed);
	if (decoded.type !== "nsec") throw new Error("Buzz private key must be nsec or 64-character hex");
	return decoded.data;
}
function resolveBuzzPublicKey(privateKey) {
	return getPublicKey(decodeBuzzPrivateKey(privateKey));
}
function resolveBuzzAccount(params) {
	const { accountId, config, configPath, allowEnv } = resolveBuzzAccountConfig(params);
	const relayUrl = config.relayUrl?.trim() || (allowEnv ? process.env.BUZZ_RELAY_URL?.trim() : "") || "";
	const resolveCredential = (field) => resolveSecretInputString({
		value: config[field],
		path: `${configPath}.${field}`,
		mode: "inspect"
	});
	const privateKeyResolution = resolveCredential("privateKey");
	const authTagResolution = resolveCredential("authTag");
	const privateKey = privateKeyResolution.value ?? (allowEnv && privateKeyResolution.status === "missing" ? process.env.BUZZ_PRIVATE_KEY?.trim() || "" : "");
	const authTag = authTagResolution.value ?? (allowEnv && authTagResolution.status === "missing" ? process.env.BUZZ_AUTH_TAG?.trim() || "" : "");
	let publicKey = "";
	if (privateKey) try {
		publicKey = resolveBuzzPublicKey(privateKey);
	} catch {}
	return {
		accountId,
		name: normalizeOptionalString(config.name) ?? "OpenClaw",
		enabled: config.enabled !== false,
		configured: Boolean(relayUrl && (privateKey || privateKeyResolution.ref)),
		relayUrl,
		privateKey,
		authTag,
		publicKey,
		tokenStatus: privateKeyResolution.ref || authTagResolution.ref ? "configured_unavailable" : privateKey ? "available" : "missing",
		config
	};
}
function assertBuzzAccountAvailable(account) {
	assertSecretOwnerAvailable("account", `buzz:${account.accountId}`);
	if (account.tokenStatus === "configured_unavailable") throw new Error(`Buzz credentials for account "${account.accountId}" are configured but unavailable.`);
}
// extensions/buzz/src/directory-query.ts
function applyBuzzDirectoryQueryAndLimit(entries, params) {
	const query = normalizeLowercaseStringOrEmpty(params.query).normalize("NFC");
	const limit = params.limit != null && params.limit > 0 ? Math.floor(params.limit) : void 0;
	const result = [];
	for (const entry of entries) {
		if (query && ![
			entry.id,
			entry.name,
			entry.handle
		].some((value) => normalizeLowercaseStringOrEmpty(value).normalize("NFC").includes(query))) continue;
		result.push(entry);
		if (limit !== void 0 && result.length >= limit) break;
	}
	return result;
}
export { resolveBuzzPublicKey as a, resolveBuzzAccount as i, assertBuzzAccountAvailable as n, decodeBuzzPrivateKey as r, applyBuzzDirectoryQueryAndLimit as t };
