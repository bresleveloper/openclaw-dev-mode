import { i as extractErrorCode } from "./error-coercion-C787aVxk.mjs";
import { C as resolveOAuthDir } from "./paths-DehQwyE0.mjs";
import { t as createSubsystemLogger } from "./subsystem-DleLyu58.mjs";
import { c as tryReadSecretFileSync, i as createSecretFileAtomic } from "./secret-file-BqGFHdII.mjs";
import "./secret-file-C-pb0auB.mjs";
import "./state-paths-Bk2vDLZh.mjs";
import "./errors-DS4y5mrd.mjs";
import "./subsystem-D9tMtJfF.mjs";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
//#region extensions/browser/src/browser/extension-relay/relay-auth.ts
/**
* Extension relay auth material.
*
* The relay authenticates the loopback link between OpenClaw and the paired
* Chrome extension with a host-local secret. It is persisted per machine in the
* credentials dir, so the gateway host and every browser node host each own an
* independent token — the extension pairs with whichever machine runs its
* Chrome, and no gateway credential ever has to travel to a node.
*/
const log = createSubsystemLogger("browser").child("extension-relay");
const RELAY_SECRET_FILE = "browser-extension-relay.secret";
const RELAY_SECRET_REREAD_ATTEMPTS = 50;
const RELAY_SECRET_REREAD_DELAY_MS = 10;
const PRIVATE_SECRET_FILE_MODE = 384;
const MAX_RELAY_SECRET_BYTES = 16384;
function resolveExtensionRelaySecretPath(env = process.env) {
	return path.join(resolveOAuthDir(env), RELAY_SECRET_FILE);
}
function normalizeToken(raw) {
	const value = raw.trim();
	return /^[0-9a-f]{64}$/.test(value) ? value : null;
}
/** Read the host-local relay token, or null when it has not been created yet. */
function readExtensionRelayToken(env = process.env) {
	const secretPath = resolveExtensionRelaySecretPath(env);
	if (process.platform === "win32") return normalizeToken(tryReadSecretFileSync(secretPath, "browser extension relay secret", { rejectSymlink: true }) ?? "");
	const uid = process.getuid?.();
	let fd;
	let raw;
	try {
		const before = fs.lstatSync(secretPath);
		if (!before.isFile() || before.uid !== uid || before.nlink !== 1) return null;
		fd = fs.openSync(secretPath, fs.constants.O_RDONLY | fs.constants.O_NOFOLLOW | fs.constants.O_NONBLOCK);
		const sameFile = (stat) => stat.isFile() && stat.uid === uid && stat.nlink === 1 && stat.dev === before.dev && stat.ino === before.ino;
		const opened = fs.fstatSync(fd);
		if (!sameFile(opened) || !sameFile(fs.lstatSync(secretPath))) return null;
		if ((opened.mode & 63) !== 0) {
			fs.fchmodSync(fd, PRIVATE_SECRET_FILE_MODE);
			log.warn("tightened extension relay secret permissions to 0600");
		}
		const buffer = Buffer.alloc(16385);
		let length = 0;
		while (length < buffer.length) {
			const count = fs.readSync(fd, buffer, length, buffer.length - length, null);
			if (count === 0) break;
			length += count;
		}
		const after = fs.fstatSync(fd);
		if (length > MAX_RELAY_SECRET_BYTES || !sameFile(after) || (after.mode & 63) !== 0 || !sameFile(fs.lstatSync(secretPath))) return null;
		raw = buffer.subarray(0, length).toString("utf8");
	} catch (error) {
		if (extractErrorCode(error) !== "ENOENT") log.warn("ignoring extension relay secret: file changed or could not be read privately");
		return null;
	} finally {
		if (fd !== void 0) fs.closeSync(fd);
	}
	if (!raw.trim()) throw new Error("extension relay secret is empty");
	return normalizeToken(raw);
}
/**
* Read the host-local relay token, creating it on first use. Called from relay
* startup and `openclaw browser extension pair` — both run on the machine that
* hosts the browser, so they resolve the same per-host secret.
*
* The create is atomic (O_CREAT|O_EXCL): the gateway service and the pair CLI
* are separate processes that can race on a fresh host, and a non-atomic
* read-then-write would let each mint a distinct token (relay expects one, the
* printed pairing string carries the other → 401). On EEXIST the winner's token
* is re-read.
*/
async function ensureExtensionRelayToken(env = process.env) {
	const secretPath = resolveExtensionRelaySecretPath(env);
	let lastError;
	for (let attempt = 0; attempt < RELAY_SECRET_REREAD_ATTEMPTS; attempt += 1) {
		let canCreate = false;
		try {
			const winner = readExtensionRelayToken(env);
			if (winner) return winner;
			canCreate = attempt === 0;
		} catch (err) {
			lastError = err;
		}
		if (canCreate) {
			const token = crypto.randomBytes(32).toString("hex");
			try {
				await createSecretFileAtomic({
					rootDir: path.dirname(secretPath),
					filePath: secretPath,
					content: `${token}\n`
				});
				return token;
			} catch (err) {
				if (extractErrorCode(err) !== "secret-exists") throw err;
				lastError = err;
			}
		}
		await new Promise((resolve) => {
			setTimeout(resolve, RELAY_SECRET_REREAD_DELAY_MS);
		});
	}
	throw new Error("extension relay secret exists but is unreadable/malformed", { cause: lastError });
}
//#endregion
export { readExtensionRelayToken as n, ensureExtensionRelayToken as t };
