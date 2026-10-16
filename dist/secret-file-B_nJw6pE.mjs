import { o as resolveUserPath } from "./home-dir-Dc6nN6HB.mjs";
import "./utils-DgZn2dLu.mjs";
import { t as tightenPrivateDirChain } from "./private-dir-mode-CfIQtph_.mjs";
import path from "node:path";
import { FsSafeError } from "@openclaw/fs-safe";
import { DEFAULT_SECRET_FILE_MAX_BYTES, PRIVATE_SECRET_DIR_MODE, PRIVATE_SECRET_DIR_MODE as PRIVATE_SECRET_DIR_MODE$1, PRIVATE_SECRET_FILE_MODE, createSecretFileAtomic, readSecretFile as readSecretFile$1, readSecretFileSync, readSecretFileSync as readSecretFileSync$1, tryReadSecretFileSync, writeSecretFileAtomic } from "@openclaw/fs-safe/secret";
//#region src/infra/secret-file.ts
function tightenSecretDirectoryModes(params) {
	return tightenPrivateDirChain(params.rootDir, path.dirname(params.filePath), params.dirMode ?? PRIVATE_SECRET_DIR_MODE);
}
async function writePrivateSecretFileAtomic(params) {
	await tightenSecretDirectoryModes(params);
	await writeSecretFileAtomic(params);
}
async function createSecretFileAtomic$1(params) {
	await tightenSecretDirectoryModes(params);
	await createSecretFileAtomic(params);
}
function tryReadSecretFileSync$1(filePath, label, options = {}, diagnostic) {
	if ("credentialDiagnostic" in options) {
		const { credentialDiagnostic, ...readOptions } = options;
		const result = tryReadSecretFileSync$1(filePath, label, readOptions, credentialDiagnostic);
		if (result.status === "configured_unavailable") credentialDiagnostic.report(result.diagnostic);
		return result.status === "available" ? result.value : void 0;
	}
	if (!diagnostic) return tryReadSecretFileSync(filePath, label, options);
	if (!filePath?.trim()) return { status: "missing" };
	try {
		return {
			status: "available",
			value: readSecretFileSync(filePath, label, options)
		};
	} catch (error) {
		if (!(error instanceof FsSafeError)) throw error;
		return {
			status: "configured_unavailable",
			diagnostic: {
				code: "CREDENTIAL_FILE_UNAVAILABLE",
				path: diagnostic.configPath,
				reason: error.code
			}
		};
	}
}
/** @deprecated Use readSecretFileSync() or tryReadSecretFileSync(). */
function loadSecretFileSync(filePath, label, options = {}) {
	const trimmedPath = filePath.trim();
	const resolvedPath = resolveUserPath(trimmedPath);
	if (!resolvedPath) return {
		ok: false,
		message: `${label} file path is empty.`
	};
	try {
		return {
			ok: true,
			secret: readSecretFileSync(filePath, label, options),
			resolvedPath
		};
	} catch (error) {
		return {
			ok: false,
			message: error instanceof Error ? error.message : String(error),
			resolvedPath,
			error
		};
	}
}
//#endregion
export { loadSecretFileSync as a, tryReadSecretFileSync$1 as c, createSecretFileAtomic$1 as i, writePrivateSecretFileAtomic as l, PRIVATE_SECRET_DIR_MODE$1 as n, readSecretFile$1 as o, PRIVATE_SECRET_FILE_MODE as r, readSecretFileSync$1 as s, DEFAULT_SECRET_FILE_MAX_BYTES as t };
