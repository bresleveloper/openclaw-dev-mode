import crypto from "node:crypto";
import { projectDiagnosticValue } from "@openclaw/ai/diagnostics";
//#region src/agents/payload-redaction.ts
/**
* Redacts diagnostic payloads before persistence. It removes credential-like
* fields, masks embedded auth strings, and replaces media/base64 data with
* size and digest metadata.
*/
const REDACTED_MEDIA_DATA = "<redacted>";
function mediaDigest(source) {
	return crypto.createHash("sha256").update(source).digest("hex");
}
const CORE_DIAGNOSTIC_PROJECTION = {
	omitField: (key) => key === "providerReplay",
	propertyScope: "enumerable",
	projectBinary: (binary) => ({
		redacted: REDACTED_MEDIA_DATA,
		bytes: binary.byteLength,
		sha256: mediaDigest(binary)
	}),
	projectMedia: (key, media) => ({
		[key]: REDACTED_MEDIA_DATA,
		...media.source === void 0 ? {} : {
			bytes: media.bytes,
			sha256: mediaDigest(media.source)
		}
	})
};
/** Removes credentials and inline media bytes from diagnostic payloads before persistence. */
function sanitizeDiagnosticPayload(value) {
	return projectDiagnosticValue(value, CORE_DIAGNOSTIC_PROJECTION);
}
//#endregion
export { sanitizeDiagnosticPayload as t };
