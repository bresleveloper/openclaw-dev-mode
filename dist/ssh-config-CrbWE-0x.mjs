import { n as parseTcpPort } from "./tcp-port-BVV_ljmK.mjs";
import { i as runCommandWithTimeout } from "./exec-shcN2-sN.mjs";
import { t as resolveSshClient } from "./ssh-client-D1lvRJ3v.mjs";
//#region src/infra/ssh-config.ts
const SSH_CONFIG_OUTPUT_MAX_CHARS = 65536;
function parseSshConfigOutput(output) {
	const result = { identityFiles: [] };
	const lines = output.split("\n");
	for (const raw of lines) {
		const line = raw.trim();
		if (!line) continue;
		const [key, ...rest] = line.split(/\s+/);
		const value = rest.join(" ").trim();
		if (!key || !value) continue;
		switch (key) {
			case "user":
				result.user = value;
				break;
			case "hostname":
				result.host = value;
				break;
			case "port":
				result.port = parseTcpPort(value) ?? void 0;
				break;
			case "identityfile": if (value !== "none") result.identityFiles.push(value);
		}
	}
	return result;
}
async function resolveSshConfig(target, opts = {}) {
	const sshPath = resolveSshClient();
	if (!sshPath) return null;
	const args = ["-G"];
	if (target.port > 0 && target.port !== 22) args.push("-p", String(target.port));
	if (opts.identity?.trim()) args.push("-i", opts.identity.trim());
	const userHost = target.user ? `${target.user}@${target.host}` : target.host;
	args.push("--", userHost);
	try {
		const result = await runCommandWithTimeout([sshPath, ...args], {
			maxOutputBytes: SSH_CONFIG_OUTPUT_MAX_CHARS,
			outputCapture: "head",
			terminateOnOutputLimit: true,
			timeoutMs: Math.max(200, opts.timeoutMs ?? 800)
		});
		if (result.code !== 0 || result.termination !== "exit" || !result.stdout.trim()) return null;
		return parseSshConfigOutput(result.stdout);
	} catch {
		return null;
	}
}
//#endregion
export { SSH_CONFIG_OUTPUT_MAX_CHARS, parseSshConfigOutput, resolveSshConfig };
