//#region src/gateway/server-methods/artifacts-base64.ts
function mimeFromDataUrl(value) {
	return /^data:([^;,]+)(?:;[^,]*)?,/i.exec(value.trim())?.[1]?.toLowerCase();
}
function base64FromDataUrl(value) {
	const trimmed = value.trim();
	const commaIndex = trimmed.indexOf(",");
	if (commaIndex < 0 || trimmed.slice(0, 5).toLowerCase() !== "data:") return;
	if (!trimmed.slice(0, commaIndex).toLowerCase().includes(";base64")) return;
	return trimmed.slice(commaIndex + 1);
}
function normalizeArtifactBase64Alphabet(value) {
	if (!/[-_]/.test(value)) return value;
	const bytes = Buffer.from(value, "ascii");
	for (let index = 0; index < bytes.length; index++) if (bytes[index] === 45) bytes[index] = 43;
	else if (bytes[index] === 95) bytes[index] = 47;
	return bytes.toString("ascii");
}
function readArtifactBase64Payload(value, opts) {
	if (value === void 0) return;
	if (/[^A-Za-z0-9+/_= \n\r\t-]/.test(value)) return;
	const paddingStart = value.indexOf("=");
	if (paddingStart >= 0 && !/^(?:=[ \n\r\t]*){1,2}$/.test(value.slice(paddingStart))) return;
	const padding = paddingStart < 0 ? 0 : value.lastIndexOf("=") === paddingStart ? 1 : 2;
	const hasWhitespace = /[ \n\r\t]/.test(value);
	let encodedLength = value.length;
	if (hasWhitespace) for (let index = 0; index < value.length; index++) {
		const code = value.charCodeAt(index);
		if (code === 32 || code === 10 || code === 13 || code === 9) encodedLength -= 1;
	}
	const remainder = encodedLength % 4;
	if (padding > 0 && remainder !== 0 || remainder === 1) return;
	let data = opts.includeData ? normalizeArtifactBase64Alphabet(hasWhitespace ? value.replace(/[ \n\r\t]/g, "") : value) : void 0;
	if (data !== void 0 && padding === 0 && remainder > 0) data += "=".repeat(4 - remainder);
	return {
		...data !== void 0 ? { data } : {},
		sizeBytes: Math.max(0, Math.floor(encodedLength * 3 / 4) - padding)
	};
}
//#endregion
export { mimeFromDataUrl as n, readArtifactBase64Payload as r, base64FromDataUrl as t };
