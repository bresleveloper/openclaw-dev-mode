import { b as parseStrictPositiveInteger } from "./number-coercion-CJQ8TR--.js";
import "./parse-finite-number-Z7n6tXLk.js";
import { spawn } from "node:child_process";
//#region src/infra/ssh-config.ts
const SSH_CONFIG_OUTPUT_MAX_CHARS = 64 * 1024;
function parsePort(value) {
	if (!value) return;
	const parsed = parseStrictPositiveInteger(value);
	if (parsed === void 0 || parsed > 65535) return;
	return parsed;
}
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
				result.port = parsePort(value);
				break;
			case "identityfile":
				if (value !== "none") result.identityFiles.push(value);
				break;
			default: break;
		}
	}
	return result;
}
function appendSshConfigOutput(current, chunk, maxChars = SSH_CONFIG_OUTPUT_MAX_CHARS) {
	const next = current + String(chunk);
	if (next.length > maxChars) return {
		ok: false,
		reason: "too-large"
	};
	return {
		ok: true,
		value: next
	};
}
async function resolveSshConfig(target, opts = {}) {
	const sshPath = "/usr/bin/ssh";
	const args = ["-G"];
	if (target.port > 0 && target.port !== 22) args.push("-p", String(target.port));
	if (opts.identity?.trim()) args.push("-i", opts.identity.trim());
	const userHost = target.user ? `${target.user}@${target.host}` : target.host;
	args.push("--", userHost);
	return await new Promise((resolve) => {
		const child = spawn(sshPath, args, { stdio: [
			"ignore",
			"pipe",
			"ignore"
		] });
		let stdout = "";
		let outputTooLarge = false;
		child.stdout?.setEncoding("utf8");
		child.stdout?.on("data", (chunk) => {
			const appended = appendSshConfigOutput(stdout, chunk);
			if (!appended.ok) {
				outputTooLarge = true;
				child.kill("SIGKILL");
				return;
			}
			stdout = appended.value;
		});
		const timeoutMs = Math.max(200, opts.timeoutMs ?? 800);
		const timer = setTimeout(() => {
			try {
				child.kill("SIGKILL");
			} finally {
				resolve(null);
			}
		}, timeoutMs);
		child.once("error", () => {
			clearTimeout(timer);
			resolve(null);
		});
		child.once("exit", (code) => {
			clearTimeout(timer);
			if (outputTooLarge || code !== 0 || !stdout.trim()) {
				resolve(null);
				return;
			}
			resolve(parseSshConfigOutput(stdout));
		});
	});
}
//#endregion
export { SSH_CONFIG_OUTPUT_MAX_CHARS, appendSshConfigOutput, parseSshConfigOutput, resolveSshConfig };
