import { P as isRecord } from "./utils-C25eiuh1.mjs";
import { o as verifyEd25519SignatureBytes, r as normalizeEd25519PublicKeyBase64Url } from "./ed25519-signature-C0LsxiQM.mjs";
import { c as isOfficialExternalPluginCatalogFeed } from "./official-external-plugin-catalog-source-D_PnrId8.mjs";
import "./official-external-plugin-catalog-3L_moyvU.mjs";
//#region src/plugins/official-external-plugin-catalog-envelope.ts
const OFFICIAL_EXTERNAL_PLUGIN_CATALOG_FEED_PAYLOAD_TYPE = "openclaw.official-external-plugin-catalog-feed.v1";
const OFFICIAL_EXTERNAL_PLUGIN_CATALOG_MAX_SIGNATURES = 16;
function createOfficialExternalPluginCatalogEnvelopeSigningInput(params) {
	return dssePreAuthenticationEncoding(params.payloadType, params.payloadBytes);
}
function verifyOfficialExternalPluginCatalogSignedEnvelope(raw, params) {
	const envelope = parseOfficialExternalPluginCatalogSignedEnvelope(raw, { allowLegacyBetaEnvelope: params.allowLegacyBetaEnvelope === true });
	if (!envelope) return {
		ok: false,
		error: "invalid-envelope",
		message: "hosted catalog signed envelope is malformed"
	};
	if (envelope.payloadType !== OFFICIAL_EXTERNAL_PLUGIN_CATALOG_FEED_PAYLOAD_TYPE) return {
		ok: false,
		error: "unsupported-payload",
		message: "hosted catalog signed envelope payload type is unsupported"
	};
	const payloadBytes = decodeOfficialExternalPluginCatalogEnvelopePayloadBytes(envelope.payload);
	if (!payloadBytes) return {
		ok: false,
		error: "invalid-payload",
		message: "hosted catalog signed envelope payload is invalid"
	};
	const signingInput = createOfficialExternalPluginCatalogEnvelopeSigningInput({
		payloadType: envelope.payloadType,
		payloadBytes
	});
	const threshold = Math.max(1, Math.trunc(params.threshold ?? 1));
	const trustedSignatureKeyIds = [];
	const trustedSignaturePublicKeys = /* @__PURE__ */ new Set();
	for (const envelopeSignature of envelope.signatures) {
		const keyId = envelopeSignature.keyid;
		const trustedKey = params.trustedKeys.find((candidate) => candidate.keyId === keyId);
		if (!trustedKey || trustedSignatureKeyIds.includes(trustedKey.keyId)) continue;
		const normalizedPublicKey = normalizeEd25519PublicKeyBase64Url(trustedKey.publicKey);
		if (!normalizedPublicKey || trustedSignaturePublicKeys.has(normalizedPublicKey)) continue;
		if (verifyEd25519SignatureBytes({
			publicKey: trustedKey.publicKey,
			payload: signingInput,
			signatureBase64Url: envelopeSignature.sig
		})) {
			trustedSignatureKeyIds.push(trustedKey.keyId);
			trustedSignaturePublicKeys.add(normalizedPublicKey);
			if (trustedSignaturePublicKeys.size >= threshold) break;
		}
	}
	if (trustedSignaturePublicKeys.size >= threshold) {
		const decoded = decodeOfficialExternalPluginCatalogEnvelopePayload(payloadBytes);
		if (!decoded?.feed) return {
			ok: false,
			error: "invalid-payload",
			message: "hosted catalog signed envelope payload is invalid",
			...decoded ? { authenticatedPayload: decoded.raw } : {}
		};
		return {
			ok: true,
			feed: decoded.feed,
			signedBy: trustedSignatureKeyIds[0] ?? "",
			...threshold > 1 ? {
				signedByKeyIds: trustedSignatureKeyIds,
				signatureCount: trustedSignaturePublicKeys.size,
				threshold
			} : {}
		};
	}
	return envelope.signatures.some((signature) => params.trustedKeys.some((key) => key.keyId === signature.keyid)) ? {
		ok: false,
		error: "invalid-signature",
		message: trustedSignatureKeyIds.length > 0 ? "hosted catalog signed envelope did not meet the configured signature threshold" : "hosted catalog signed envelope signature is invalid"
	} : {
		ok: false,
		error: "missing-trust-key",
		message: "hosted catalog signed envelope was not signed by a trusted key"
	};
}
function parseOfficialExternalPluginCatalogSignedEnvelope(raw, params) {
	if (!isRecord(raw)) return null;
	const payloadType = raw.payloadType;
	const payload = raw.payload;
	const signatures = raw.signatures;
	if (typeof payloadType !== "string" || typeof payload !== "string") return null;
	if (!Array.isArray(signatures) || signatures.length === 0) return null;
	if (signatures.length > OFFICIAL_EXTERNAL_PLUGIN_CATALOG_MAX_SIGNATURES) return null;
	const standardSignatures = signatures.filter((signature) => isRecord(signature) && typeof signature.keyid === "string" && signature.keyid.trim().length > 0 && typeof signature.sig === "string" && signature.sig.trim().length > 0);
	const legacySignatures = raw.schemaVersion === 1 ? signatures.filter((signature) => isRecord(signature) && typeof signature.keyId === "string" && signature.keyId.trim().length > 0 && signature.algorithm === "ed25519" && typeof signature.signature === "string" && signature.signature.trim().length > 0).map((signature) => ({
		keyid: signature.keyId,
		sig: signature.signature
	})) : [];
	if (standardSignatures.length > 0 && legacySignatures.length > 0) return null;
	const parsedSignatures = standardSignatures.length > 0 ? standardSignatures : params.allowLegacyBetaEnvelope ? legacySignatures : [];
	if (parsedSignatures.length === 0) return null;
	if (parsedSignatures.length > OFFICIAL_EXTERNAL_PLUGIN_CATALOG_MAX_SIGNATURES) return null;
	const keyIds = /* @__PURE__ */ new Set();
	for (const signature of parsedSignatures) {
		if (keyIds.has(signature.keyid)) return null;
		keyIds.add(signature.keyid);
	}
	return {
		payloadType,
		payload,
		signatures: parsedSignatures
	};
}
function dssePreAuthenticationEncoding(payloadType, payloadBytes) {
	const payloadTypeBytes = Buffer.from(payloadType, "utf8");
	const prefix = Buffer.from(`DSSEv1 ${payloadTypeBytes.length} ${payloadType} ${payloadBytes.length} `, "utf8");
	return Buffer.concat([prefix, payloadBytes]);
}
function decodeOfficialExternalPluginCatalogEnvelopePayloadBytes(payload) {
	try {
		return Buffer.from(payload, "base64");
	} catch {
		return null;
	}
}
function decodeOfficialExternalPluginCatalogEnvelopePayload(payloadBytes) {
	try {
		const raw = JSON.parse(payloadBytes.toString("utf8"));
		return {
			raw,
			feed: isOfficialExternalPluginCatalogFeed(raw) ? raw : null
		};
	} catch {
		return null;
	}
}
//#endregion
export { verifyOfficialExternalPluginCatalogSignedEnvelope };
