import { n as sha256Hex } from "./node-crypto-BG4u3UnX.mjs";
import { projectDiagnosticValue } from "@openclaw/ai/diagnostics";
//#region src/agents/payload-redaction.ts
/**
* Redacts diagnostic payloads before persistence. It removes credential-like
* fields, masks embedded auth strings, and replaces media/base64 data with
* size and digest metadata.
*/
const REDACTED_MEDIA_DATA = "<redacted>";
const CORE_DIAGNOSTIC_PROJECTION = {
	omitField: (key) => key === "providerReplay",
	propertyScope: "enumerable",
	projectBinary: (binary) => ({
		redacted: REDACTED_MEDIA_DATA,
		bytes: binary.byteLength,
		sha256: sha256Hex(binary)
	}),
	projectMedia: (key, media) => ({
		[key]: REDACTED_MEDIA_DATA,
		...media.source === void 0 ? {} : {
			bytes: media.bytes,
			sha256: sha256Hex(media.source)
		}
	})
};
/** Removes credentials and inline media bytes from diagnostic payloads before persistence. */
function sanitizeDiagnosticPayload(value) {
	return projectDiagnosticValue(value, CORE_DIAGNOSTIC_PROJECTION);
}
//#endregion
export { sanitizeDiagnosticPayload as t };
