import { a as extractErrorCode } from "./error-coercion-BwMr25F8.mjs";
import { d as sleepWithAbort } from "./src-Bzfi3cQM.mjs";
import { T as resolveOAuthDir } from "./paths-orClZ-2Z.mjs";
import { t as createSubsystemLogger } from "./subsystem-mStysHHC.mjs";
import "./security-runtime-6domDoE8.mjs";
import "./retry-runtime-CUY_Gz8_.mjs";
import { c as tryReadSecretFileSync, i as createSecretFileAtomic } from "./secret-file-B1IW-_m6.mjs";
import "./secret-file-Dqf0GOQ3.mjs";
import "./logging-core-CsXmxYo2.mjs";
import "./state-paths-FoyMccMm.mjs";
import fs from "node:fs";
import crypto from "node:crypto";
import path from "node:path";
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
const CHANGING = { status: "changing" };
function resolveExtensionRelaySecretPath(env = process.env) {
	return path.join(resolveOAuthDir(env), RELAY_SECRET_FILE);
}
function normalizeToken(raw) {
	const value = raw.trim();
	return /^[0-9a-f]{64}$/.test(value) ? value : null;
}
function inspectContent(raw) {
	if (!raw.trim()) return { status: "empty" };
	const token = normalizeToken(raw);
	return token ? {
		status: "token",
		token
	} : {
		status: "rejected",
		problem: "does not contain a 64-character lowercase hex token"
	};
}
function describeRejectedShape(stat, uid) {
	if (stat.isSymbolicLink()) return "is a symlink";
	if (!stat.isFile()) return "is not a regular file";
	if (stat.uid !== uid) return `is owned by another user (uid ${stat.uid})`;
	if (stat.nlink !== 1) return `has ${stat.nlink} hard links`;
	return null;
}
function inspectExtensionRelaySecret(secretPath) {
	if (process.platform === "win32") {
		try {
			fs.lstatSync(secretPath);
		} catch (error) {
			if (extractErrorCode(error) === "ENOENT") return { status: "missing" };
		}
		const raw = tryReadSecretFileSync(secretPath, "browser extension relay secret", { rejectSymlink: true });
		return raw === void 0 ? {
			status: "rejected",
			problem: "could not be read privately"
		} : inspectContent(raw);
	}
	const uid = process.getuid?.();
	let fd;
	let raw;
	try {
		const before = fs.lstatSync(secretPath);
		const shapeProblem = describeRejectedShape(before, uid);
		if (shapeProblem) return {
			status: "rejected",
			problem: shapeProblem
		};
		fd = fs.openSync(secretPath, fs.constants.O_RDONLY | fs.constants.O_NOFOLLOW | fs.constants.O_NONBLOCK);
		const sameFile = (stat) => stat.isFile() && stat.uid === uid && stat.nlink === 1 && stat.dev === before.dev && stat.ino === before.ino;
		const opened = fs.fstatSync(fd);
		if (!sameFile(opened) || !sameFile(fs.lstatSync(secretPath))) return CHANGING;
		if ((opened.mode & 63) !== 0) {
			try {
				fs.fchmodSync(fd, PRIVATE_SECRET_FILE_MODE);
			} catch {
				return {
					status: "rejected",
					problem: "is readable by other users and its permissions could not be tightened to 0600"
				};
			}
			log.warn("tightened extension relay secret permissions to 0600");
		}
		const buffer = Buffer.alloc(16385);
		let length = 0;
		while (length < buffer.length) {
			const count = fs.readSync(fd, buffer, length, buffer.length - length, null);
			if (count === 0) break;
			length += count;
		}
		if (length > MAX_RELAY_SECRET_BYTES) return {
			status: "rejected",
			problem: "is larger than 16 KiB"
		};
		const after = fs.fstatSync(fd);
		if (!sameFile(after) || (after.mode & 63) !== 0 || !sameFile(fs.lstatSync(secretPath))) return CHANGING;
		raw = buffer.subarray(0, length).toString("utf8");
	} catch (error) {
		const code = extractErrorCode(error);
		if (fd === void 0 && code === "ENOENT") return { status: "missing" };
		if (code === "ENOENT" || code === "ELOOP") return CHANGING;
		log.warn("ignoring extension relay secret: file could not be read privately");
		return {
			status: "rejected",
			problem: `could not be read (${code ?? "unknown error"})`
		};
	} finally {
		if (fd !== void 0) fs.closeSync(fd);
	}
	return inspectContent(raw);
}
/** Read the host-local relay token, or null when it is missing or unusable. */
function readExtensionRelayToken(env = process.env) {
	const secret = inspectExtensionRelaySecret(resolveExtensionRelaySecretPath(env));
	if (secret.status === "empty") throw new Error("extension relay secret is empty");
	return secret.status === "token" ? secret.token : null;
}
async function relaySecretError(secretPath, problem) {
	const { formatCliCommand } = await import("./plugin-sdk/setup-tools.js");
	return /* @__PURE__ */ new Error(`Browser extension relay secret ${secretPath} ${problem}. Move it aside, then run \`${formatCliCommand("openclaw browser extension pair")}\` to create a new secret and re-pair the Chrome extension.`);
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
* is re-read. An existing file the reader rejects is never replaced: it fails
* immediately with the reason so the operator can move it aside.
*/
async function ensureExtensionRelayToken(env = process.env) {
	const secretPath = resolveExtensionRelaySecretPath(env);
	let problem = "did not become readable";
	for (let attempt = 0; attempt < RELAY_SECRET_REREAD_ATTEMPTS; attempt += 1) {
		const secret = inspectExtensionRelaySecret(secretPath);
		if (secret.status === "token") return secret.token;
		if (secret.status === "rejected") throw await relaySecretError(secretPath, secret.problem);
		if (secret.status === "empty") problem = "is empty";
		else if (secret.status === "changing") problem = "kept changing while it was read";
		else if (attempt === 0) {
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
			}
		}
		await sleepWithAbort(RELAY_SECRET_REREAD_DELAY_MS);
	}
	throw await relaySecretError(secretPath, problem);
}
//#endregion
export { readExtensionRelayToken as n, ensureExtensionRelayToken as t };
