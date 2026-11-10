import { n as INSTALLED_CODEX_PROBE_TIMEOUT_MS } from "./managed-binary-CN7ii1MZ.mjs";
import { n as resolveCodexAppServerSpawnEnv, r as resolveCodexAppServerSpawnInvocation } from "./transport-stdio-DeNmLOea.mjs";
import { n as buildCodexAppServerInitializeParams, o as readCodexVersionFromUserAgent } from "./client-initialize-C-iqKdkR.mjs";
import { runUtf8CommandWithTimeout, signalProcessTree } from "openclaw/plugin-sdk/process-runtime";
import path from "node:path";
import { access, mkdtemp, rm } from "node:fs/promises";
import { once } from "node:events";
import { spawn } from "node:child_process";
import { setTimeout as setTimeout$1 } from "node:timers/promises";
import { resolvePreferredOpenClawTmpDir } from "openclaw/plugin-sdk/temp-path";
import { createDeferred } from "openclaw/plugin-sdk/extension-shared";
//#region extensions/codex/src/app-server/installed-probe.ts
/**
* Bounded initialize handshake that qualifies a user-installed Codex before
* selection. The candidate runs privately against a throwaway CODEX_HOME: it is
* never registered as a Gateway app-server and never opens OpenClaw state.
*/
const HANDSHAKE_MAX_OUTPUT_CHARS = 1048576;
const HANDSHAKE_EXIT_TIMEOUT_MS = 2e3;
const INITIALIZE_REQUEST_ID = 1;
async function assertProbeCanOverrideStorage(timeoutMs) {
	const metadataOptions = {
		baseEnv: {
			...process.env,
			LC_ALL: "C"
		},
		input: "",
		timeoutMs: Math.min(1e3, timeoutMs),
		maxOutputBytes: 4096,
		killProcessTree: true,
		killSignal: "SIGKILL",
		killGraceMs: 0
	};
	let managedPaths = ["/etc/codex/managed_config.toml", "/etc/codex/requirements.toml"];
	if (process.platform === "win32") {
		const result = await runUtf8CommandWithTimeout([
			"powershell.exe",
			"-NoProfile",
			"-NonInteractive",
			"-Command",
			"[Console]::OutputEncoding = [System.Text.UTF8Encoding]::new($false); [Environment]::GetFolderPath('CommonApplicationData')"
		], metadataOptions);
		const programData = result.stdout.trim();
		if (result.termination !== "exit" || result.code !== 0 || result.outputLimitExceeded || !path.win32.isAbsolute(programData)) throw new Error("cannot locate managed Codex requirements for an isolated selection probe");
		managedPaths = [path.win32.join(programData, "OpenAI", "Codex", "requirements.toml")];
	}
	for (const managedPath of managedPaths) if (await access(managedPath).then(() => true, (error) => {
		if (error instanceof Error && "code" in error && error.code === "ENOENT") return false;
		throw error;
	})) throw new Error("managed Codex configuration prevents an isolated selection probe");
	if (process.platform === "darwin") for (const key of ["config_toml_base64", "requirements_toml_base64"]) {
		const result = await runUtf8CommandWithTimeout([
			"/usr/bin/defaults",
			"read-type",
			"com.openai.codex",
			key
		], metadataOptions);
		const missing = result.stderr.includes("does not exist") || result.stderr.includes(`Could not find key '${key}'`) || result.stderr.includes("Domain 'com.openai.codex' not found.");
		if (result.termination !== "exit" || result.code !== 1 || result.outputLimitExceeded || !missing) throw new Error("managed Codex preferences cannot be excluded from the selection probe");
	}
}
/** Sends one initialize request and returns the Codex version from its reply. */
async function probeCodexAppServerHandshake(command, timeoutMs = INSTALLED_CODEX_PROBE_TIMEOUT_MS) {
	const deadline = performance.now() + timeoutMs;
	await assertProbeCanOverrideStorage(timeoutMs);
	const codexHome = await mkdtemp(path.join(resolvePreferredOpenClawTmpDir(), "openclaw-codex-probe-"));
	try {
		const remainingMs = deadline - performance.now();
		if (remainingMs <= 0) throw new Error("selection probe timed out before initialize");
		return await exchangeInitialize(command, codexHome, remainingMs);
	} finally {
		await rm(codexHome, {
			recursive: true,
			force: true
		});
	}
}
async function exchangeInitialize(command, codexHome, timeoutMs) {
	const options = {
		transport: "stdio",
		command,
		commandSource: "resolved-managed",
		args: [
			"-c",
			`sqlite_home=${JSON.stringify(codexHome)}`,
			"app-server",
			"--listen",
			"stdio://"
		],
		headers: {},
		env: {
			CODEX_HOME: codexHome,
			CODEX_SQLITE_HOME: codexHome
		}
	};
	const env = resolveCodexAppServerSpawnEnv(options);
	const invocation = resolveCodexAppServerSpawnInvocation(options, env);
	const detached = process.platform !== "win32";
	const child = spawn(invocation.command, invocation.argv, {
		env,
		detached,
		shell: invocation.shell,
		stdio: [
			"pipe",
			"pipe",
			"pipe"
		],
		windowsHide: invocation.windowsHide
	});
	const closed = once(child, "close").then(() => void 0, () => void 0);
	try {
		return await readInitializeReply(child, timeoutMs);
	} finally {
		if (child.pid !== void 0 && child.exitCode === null && child.signalCode === null) signalProcessTree(child.pid, "SIGKILL", { detached });
		await Promise.race([closed, setTimeout$1(HANDSHAKE_EXIT_TIMEOUT_MS, void 0, { ref: false })]);
		child.stdin.destroy();
		child.stdout.destroy();
		child.stderr.destroy();
	}
}
async function readInitializeReply(child, timeoutMs) {
	const { promise, resolve, reject } = createDeferred();
	let pending = "";
	let received = 0;
	let stderrTail = "";
	const timer = setTimeout(() => reject(/* @__PURE__ */ new Error(`timed out after ${timeoutMs} ms`)), timeoutMs);
	child.once("error", reject);
	child.once("exit", (code, signal) => {
		const stderr = stderrTail.trim();
		reject(/* @__PURE__ */ new Error(`exited (${signal ?? code}) before answering initialize${stderr ? `: ${stderr}` : ""}`));
	});
	child.stderr.setEncoding("utf8");
	child.stderr.on("data", (chunk) => {
		stderrTail = `${stderrTail}${chunk}`.slice(-1024);
	});
	child.stdout.setEncoding("utf8");
	child.stdout.on("data", (chunk) => {
		received += chunk.length;
		if (received > HANDSHAKE_MAX_OUTPUT_CHARS) {
			reject(/* @__PURE__ */ new Error("output exceeded its capture limit before initialize"));
			return;
		}
		pending += chunk;
		for (let newline = pending.indexOf("\n"); newline >= 0; newline = pending.indexOf("\n")) {
			const reply = parseInitializeReply(pending.slice(0, newline));
			pending = pending.slice(newline + 1);
			if (reply && "error" in reply) {
				reject(/* @__PURE__ */ new Error(`initialize failed: ${JSON.stringify(reply.error).slice(0, 512)}`));
				return;
			}
			if (reply) {
				resolve(readCodexVersionFromUserAgent(reply.userAgent));
				return;
			}
		}
	});
	child.stdin.on("error", () => void 0);
	child.stdin.write(`${JSON.stringify({
		id: INITIALIZE_REQUEST_ID,
		method: "initialize",
		params: buildCodexAppServerInitializeParams()
	})}\n`);
	try {
		return await promise;
	} finally {
		clearTimeout(timer);
	}
}
/** Codex frames JSON-RPC as one JSON object per line, without a `jsonrpc` field. */
function parseInitializeReply(line) {
	let message;
	try {
		message = JSON.parse(line);
	} catch {
		return;
	}
	if (typeof message !== "object" || message === null || !("id" in message)) return;
	if (message.id !== INITIALIZE_REQUEST_ID) return;
	if ("error" in message) return { error: message.error };
	const result = "result" in message ? message.result : void 0;
	const userAgent = typeof result === "object" && result !== null && "userAgent" in result ? result.userAgent : void 0;
	return { userAgent: typeof userAgent === "string" ? userAgent : void 0 };
}
//#endregion
export { probeCodexAppServerHandshake };
