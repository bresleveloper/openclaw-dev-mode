import crypto from "node:crypto";
//#region extensions/file-transfer/src/tools/fetch-payload.ts
function decodeFetchPayload(command, payload) {
	const file = command === "file.fetch";
	const canonicalPath = typeof payload.path === "string" ? payload.path : "";
	const rawSize = payload[file ? "size" : "tarBytes"];
	const size = typeof rawSize === "number" ? rawSize : -1;
	const base64 = payload[file ? "base64" : "tarBase64"];
	const mimeType = file && typeof payload.mimeType === "string" ? payload.mimeType : "";
	const sha256 = typeof payload.sha256 === "string" ? payload.sha256 : "";
	if (!canonicalPath || size < 0 || typeof base64 !== "string" || !(file ? mimeType : base64) || !sha256) throw new Error(`invalid ${command} payload (missing fields)`);
	const buffer = Buffer.from(base64, "base64");
	if (buffer.byteLength !== size) throw new Error(`${command} size mismatch: payload says ${size} bytes, decoded ${buffer.byteLength}`);
	if (crypto.createHash("sha256").update(buffer).digest("hex") !== sha256) throw new Error(`${command} sha256 mismatch (integrity failure)`);
	return {
		canonicalPath,
		size,
		base64,
		mimeType,
		sha256,
		buffer
	};
}
//#endregion
export { decodeFetchPayload as t };
