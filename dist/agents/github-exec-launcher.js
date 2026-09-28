import { c as isRecord } from "../record-coerce-DItp3I4t.mjs";
import { v as readSecureFile } from "../fs-safe-BAPek8At.mjs";
import { a as inspectPathPermissions } from "../permissions-DOmAO-Zd.mjs";
import path from "node:path";
import fs from "node:fs/promises";
import { parseDocument } from "yaml";
//#region src/agents/github-exec-credential.ts
const GITHUB_EXEC_CREDENTIAL_UNAVAILABLE = "GitHub Identity credential is unavailable or insecure. Reconnect or change GitHub Identity, then retry.";
async function privateProfileStat(profileDir) {
	const stat = await fs.lstat(profileDir);
	if (!stat.isDirectory() || stat.isSymbolicLink()) throw new Error(GITHUB_EXEC_CREDENTIAL_UNAVAILABLE);
	if (process.platform === "win32") {
		const permissions = await inspectPathPermissions(profileDir);
		if (!permissions.ok || permissions.source !== "windows-acl" || permissions.ownerTrusted !== true || permissions.groupReadable || permissions.worldReadable || permissions.groupWritable || permissions.worldWritable) throw new Error(GITHUB_EXEC_CREDENTIAL_UNAVAILABLE);
	} else if ((stat.mode & 63) !== 0 || stat.uid !== process.getuid?.()) throw new Error(GITHUB_EXEC_CREDENTIAL_UNAVAILABLE);
	return stat;
}
/** Called only inside the local launcher, never by the Gateway or its supervision pipeline. */
async function readGitHubExecToken(profileDir) {
	try {
		const profile = await privateProfileStat(profileDir);
		const realProfileDir = await fs.realpath(profileDir);
		const filePath = path.join(profileDir, "hosts.yml");
		const hosts = await fs.lstat(filePath);
		if (!hosts.isFile() || hosts.isSymbolicLink() || hosts.nlink !== 1) throw new Error(GITHUB_EXEC_CREDENTIAL_UNAVAILABLE);
		const snapshot = await readSecureFile({
			filePath,
			trust: { trustedDirs: [realProfileDir] },
			io: {
				maxBytes: 65536,
				timeoutMs: 5e3
			}
		});
		try {
			const currentProfile = await privateProfileStat(profileDir);
			if (currentProfile.dev !== profile.dev || currentProfile.ino !== profile.ino || path.dirname(snapshot.realPath) !== realProfileDir || snapshot.stat.nlink !== 1) throw new Error(GITHUB_EXEC_CREDENTIAL_UNAVAILABLE);
			const document = parseDocument(snapshot.buffer.toString("utf8"), { prettyErrors: false });
			if (document.errors.length || document.warnings.length) throw new Error(GITHUB_EXEC_CREDENTIAL_UNAVAILABLE);
			const parsed = document.toJS({ maxAliasCount: 0 });
			const host = isRecord(parsed) ? parsed["github.com"] : void 0;
			const token = isRecord(host) && typeof host.oauth_token === "string" ? host.oauth_token.trim() : "";
			if (!token || /[\r\n\0]/u.test(token)) throw new Error(GITHUB_EXEC_CREDENTIAL_UNAVAILABLE);
			return token;
		} finally {
			snapshot.buffer.fill(0);
		}
	} catch {
		throw new Error(GITHUB_EXEC_CREDENTIAL_UNAVAILABLE);
	}
}
//#endregion
//#region src/agents/github-exec-launcher.ts
async function resolveCredential() {
	const token = await readGitHubExecToken(process.argv[2] ?? "");
	process.stdout.write(token);
}
function credentialUnavailable() {
	process.exitCode = 1;
	process.stderr.write(`${GITHUB_EXEC_CREDENTIAL_UNAVAILABLE}\n`);
}
process.stdout.on("error", credentialUnavailable);
process.stderr.on("error", () => {
	process.exitCode = 1;
});
resolveCredential().catch(credentialUnavailable);
//#endregion
export {};
