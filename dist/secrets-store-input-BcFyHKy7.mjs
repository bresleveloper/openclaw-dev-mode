import { s as readFileDescriptorBounded } from "./boundary-file-read-CCth2Hwg.mjs";
import { c as SECRET_STORE_VALUE_MAX_BYTES, l as SecretStoreValidationError } from "./openclaw-state-worker-error-B93Lf_P2.mjs";
import "./secret-store-d5UF_g7X.mjs";
import { t as readByteStreamWithLimit } from "./read-byte-stream-with-limit-CNew-qG0.mjs";
import fs from "node:fs/promises";
import { password } from "@clack/prompts";
//#region src/secrets/store/dotenv.ts
const DOTENV_ASSIGNMENT_RE = /^\s*(?:export\s+)?([\w.-]+)(?:\s*=\s*?|:\s+?)(\s*'(?:\\'|[^'])*'|\s*"(?:\\"|[^"])*"|\s*`(?:\\`|[^`])*`|[^#\r\n]+)?\s*(?:#.*)?$/gmu;
/** Parse dotenv assignments, including quoted multi-line values, without Node built-ins. */
function parseSecretStoreDotEnvText(raw) {
	const entries = {};
	const normalized = raw.replace(/\r\n?/gu, "\n");
	DOTENV_ASSIGNMENT_RE.lastIndex = 0;
	let match;
	while ((match = DOTENV_ASSIGNMENT_RE.exec(normalized)) !== null) {
		const key = match[1];
		if (!key) continue;
		let value = (match[2] ?? "").trim();
		const quote = value[0];
		value = value.replace(/^(['"`])([\s\S]*)\1$/gmu, "$2");
		if (quote === "\"") value = value.replace(/\\n/gu, "\n").replace(/\\r/gu, "\r");
		entries[key] = value;
	}
	return entries;
}
//#endregion
//#region src/cli/secrets-store-input.ts
const SECRET_STORE_IMPORT_MAX_BYTES = 16777216;
async function readBoundedStdin(maxBytes) {
	return (await readByteStreamWithLimit(process.stdin, {
		maxBytes,
		onOverflow: ({ maxBytes: limit }) => new SecretStoreValidationError("SECRET_STORE_VALUE_TOO_LARGE", `Stdin input exceeds ${limit} bytes.`)
	})).toString("utf8");
}
async function readBoundedFile(pathname, maxBytes) {
	const flags = process.platform === "win32" ? "r" : fs.constants.O_RDONLY | fs.constants.O_NONBLOCK;
	const file = await fs.open(pathname, flags);
	try {
		const stat = await file.stat();
		if (!stat.isFile()) throw new Error(`Input path is not a regular file: ${pathname}`);
		if (stat.size > maxBytes) throw new SecretStoreValidationError("SECRET_STORE_VALUE_TOO_LARGE", `Input file exceeds ${maxBytes} bytes: ${pathname}`);
		return (await readFileDescriptorBounded(file.fd, maxBytes)).toString("utf8");
	} finally {
		await file.close();
	}
}
async function readSecretStoreInput(valueFile) {
	if (valueFile && valueFile !== "-") return await readBoundedFile(valueFile, SECRET_STORE_VALUE_MAX_BYTES);
	if (valueFile === "-" || !process.stdin.isTTY) return (await readBoundedStdin(SECRET_STORE_VALUE_MAX_BYTES)).replace(/\r?\n$/u, "");
	const value = await password({
		message: "Secret value",
		mask: "",
		validate: (candidate) => Buffer.byteLength(candidate ?? "", "utf8") <= 65536 ? void 0 : `Value exceeds ${SECRET_STORE_VALUE_MAX_BYTES} UTF-8 bytes.`
	});
	if (typeof value === "symbol") throw new Error("Secret input cancelled.");
	return value;
}
async function readSecretStoreImport(from) {
	return parseSecretStoreDotEnvText(from && from !== "-" ? await readBoundedFile(from, SECRET_STORE_IMPORT_MAX_BYTES) : await readBoundedStdin(SECRET_STORE_IMPORT_MAX_BYTES));
}
//#endregion
export { readSecretStoreImport, readSecretStoreInput };
