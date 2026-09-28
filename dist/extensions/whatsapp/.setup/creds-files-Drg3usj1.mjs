import path from "node:path";
import { assertNoSymlinkParents, assertNoSymlinkParentsSync, readRegularFile, readRegularFileSync, statRegularFile, statRegularFileSync } from "openclaw/plugin-sdk/file-access-runtime";
//#region extensions/whatsapp/src/creds-files.ts
const BAILEYS_SIGNAL_AUTH_CATEGORIES = {
	"app-state-sync-key": true,
	"app-state-sync-version": true,
	"device-list": true,
	"identity-key": true,
	"lid-mapping": true,
	"pre-key": true,
	"sender-key": true,
	"sender-key-memory": true,
	session: true,
	tctoken: true
};
function isWhatsAppBaileysAuthFileName(name) {
	if (name === "creds.json" || name === "creds.json.bak") return true;
	return name.endsWith(".json") && Object.keys(BAILEYS_SIGNAL_AUTH_CATEGORIES).some((category) => name.startsWith(`${category}-`));
}
function resolveWebCredsPath(authDir) {
	return path.join(authDir, "creds.json");
}
function resolveWebCredsBackupPath(authDir) {
	return path.join(authDir, "creds.json.bak");
}
function resolveWebCredsParentCheck(filePath) {
	const dir = path.resolve(path.dirname(filePath));
	return {
		rootDir: path.parse(dir).root,
		targetPath: dir,
		allowMissing: true,
		allowRootChildSymlink: true,
		requireDirectories: true,
		messagePrefix: "WhatsApp credential file path"
	};
}
async function assertWebCredsParentPathSafe(filePath) {
	await assertNoSymlinkParents(resolveWebCredsParentCheck(filePath));
}
function assertWebCredsParentPathSafeSync(filePath) {
	assertNoSymlinkParentsSync(resolveWebCredsParentCheck(filePath));
}
async function assertWebCredsPathRegularFileOrMissing(filePath) {
	try {
		await assertWebCredsParentPathSafe(filePath);
		await statRegularFile(filePath);
	} catch (error) {
		throw new Error(`WhatsApp credential file path is unsafe; creds.json must be a regular file or missing: ${filePath}`, { cause: error });
	}
}
function readWebCredsJsonRawSync(filePath) {
	try {
		assertWebCredsParentPathSafeSync(filePath);
		const { buffer, stat } = readRegularFileSync({ filePath });
		return stat.size > 1 ? buffer.toString("utf-8") : null;
	} catch {
		return null;
	}
}
async function readWebCredsJsonRaw(filePath) {
	try {
		await assertWebCredsParentPathSafe(filePath);
		const { buffer, stat } = await readRegularFile({ filePath });
		return stat.size > 1 ? buffer.toString("utf-8") : null;
	} catch {
		return null;
	}
}
function statWebCredsFileSync(filePath) {
	try {
		assertWebCredsParentPathSafeSync(filePath);
		const result = statRegularFileSync(filePath);
		if (result.missing || result.stat.size <= 1) return null;
		return {
			mtimeMs: result.stat.mtimeMs,
			size: result.stat.size
		};
	} catch {
		return null;
	}
}
function hasWebCredsRegularFileSync(authDir) {
	try {
		const credsPath = resolveWebCredsPath(authDir);
		assertWebCredsParentPathSafeSync(credsPath);
		return !statRegularFileSync(credsPath).missing;
	} catch {
		return false;
	}
}
function hasWebCredsSync(authDir) {
	return statWebCredsFileSync(resolveWebCredsPath(authDir)) !== null;
}
//#endregion
export { readWebCredsJsonRaw as a, resolveWebCredsPath as c, isWhatsAppBaileysAuthFileName as i, statWebCredsFileSync as l, hasWebCredsRegularFileSync as n, readWebCredsJsonRawSync as o, hasWebCredsSync as r, resolveWebCredsBackupPath as s, assertWebCredsPathRegularFileOrMissing as t };
