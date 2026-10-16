import { s as registerSecretValueForRedaction } from "./secret-redaction-registry-DorVHn0l.mjs";
import { n as resolvePreferredOpenClawTmpDir } from "./tmp-openclaw-dir-DR7bHNl9.mjs";
import { n as normalizeScpRemoteHost } from "./scp-host-DbBwyscY.mjs";
import { o as shellEscape } from "./remote-shell-command-B-D0MPN3.mjs";
import path from "node:path";
import fs from "node:fs/promises";
//#region src/gateway/worker-environments/ssh.ts
const MAX_HOST_KEY_LENGTH = 16384;
const MAX_COMMAND_OUTPUT_BYTES = 65536;
const OPENSSH_HOST_KEY_TYPE_PATTERN = /^(?:ssh|ecdsa-sha2|sk-(?:ssh|ecdsa-sha2))-[A-Za-z0-9@._+-]+$/u;
const OPENSSH_HOST_KEY_DATA_PATTERN = /^[A-Za-z0-9+/]+={0,2}$/u;
function normalizeIdentityMaterial(contents) {
	const normalized = contents.replace(/^\uFEFF/u, "").replace(/\r\n?/gu, "\n").replace(/\\r\\n|\\r/gu, "\\n").replace(/\\n/gu, "\n");
	return normalized.endsWith("\n") ? normalized : `${normalized}\n`;
}
function normalizeEndpoint(ssh) {
	const host = ssh.host.trim();
	const user = ssh.user.trim();
	if (!Number.isInteger(ssh.port) || ssh.port < 1 || ssh.port > 65535) throw new Error("Worker SSH port must be an integer between 1 and 65535");
	const bracketedHost = host.includes(":") && !host.startsWith("[") ? `[${host}]` : host;
	const scpTarget = normalizeScpRemoteHost(`${user}@${bracketedHost}`);
	if (!scpTarget) throw new Error("Worker SSH endpoint contains an invalid user or host");
	const normalizedHost = bracketedHost.startsWith("[") ? bracketedHost.slice(1, -1) : bracketedHost;
	return {
		sshTarget: `${user}@${normalizedHost}`,
		scpTarget,
		host: normalizedHost,
		port: ssh.port
	};
}
function pinnedKnownHostsLine(params) {
	if (params.pinnedHostKey.length > MAX_HOST_KEY_LENGTH || params.pinnedHostKey.includes("\n") || params.pinnedHostKey.includes("\r")) throw new Error("Pinned worker SSH host key must contain exactly one public key");
	const tokens = params.pinnedHostKey.trim().split(/\s+/u);
	const [algorithm, encodedKey] = tokens;
	if (tokens.length !== 2 || !algorithm || !encodedKey || !OPENSSH_HOST_KEY_TYPE_PATTERN.test(algorithm) || !OPENSSH_HOST_KEY_DATA_PATTERN.test(encodedKey) || encodedKey.length % 4 !== 0) throw new Error("Pinned worker SSH host key must use OpenSSH public-key format");
	return `${params.port === 22 ? params.host : `[${params.host}]:${params.port}`} ${algorithm} ${encodedKey}\n`;
}
/** Adapts a provisioned, pinned worker endpoint to the SSH sandbox transport contract. */
function resolveWorkerSshSandboxSettings(params) {
	const endpoint = normalizeEndpoint(params.ssh);
	const knownHostsData = [endpoint.port, ...params.ssh.fallbackPorts ?? []].map((port) => pinnedKnownHostsLine({
		host: endpoint.host,
		port,
		pinnedHostKey: params.ssh.hostKey
	})).join("");
	return {
		target: `${endpoint.sshTarget}:${endpoint.port}`,
		command: "ssh",
		strictHostKeyChecking: true,
		updateHostKeys: false,
		...params.identity.kind === "path" ? { identityFile: params.identity.path } : { identityData: params.identity.contents },
		knownHostsData
	};
}
/** Materializes one pinned identity/known-hosts context for a complete SSH ownership lifetime. */
async function prepareWorkerSsh(params) {
	let preparing = true;
	const assertPreparing = () => {
		if (!preparing) throw new Error("Worker SSH preparation invocation is closed");
		params.assertCurrent?.();
	};
	assertPreparing();
	if (params.pinnedHostKey === void 0) throw new Error("Worker SSH setup is missing pinnedHostKey; WorkerProvider.provision() must return ssh.hostKey");
	const pinnedHostKey = params.pinnedHostKey;
	const endpoint = normalizeEndpoint(params.ssh);
	const advertisedPorts = [endpoint.port, ...params.ssh.fallbackPorts ?? []];
	const knownHosts = advertisedPorts.map((port) => pinnedKnownHostsLine({
		host: endpoint.host,
		port,
		pinnedHostKey
	})).join("");
	const temporaryDir = await fs.mkdtemp(path.resolve(resolvePreferredOpenClawTmpDir(), params.temporaryDirectoryPrefix ?? "openclaw-worker-ssh-"));
	try {
		assertPreparing();
		const identity = await params.resolveIdentity(params.ssh.keyRef, { assertCurrent: assertPreparing });
		assertPreparing();
		let identityPath;
		if (identity.kind === "path") {
			const resolvedPath = identity.path.trim();
			if (!resolvedPath || !path.isAbsolute(resolvedPath)) throw new Error("Worker SSH identity path must be absolute");
			identityPath = resolvedPath;
		} else {
			if (!identity.contents.trim()) throw new Error("Worker SSH identity material must be non-empty");
			registerSecretValueForRedaction(identity.contents);
			const normalizedContents = normalizeIdentityMaterial(identity.contents);
			if (normalizedContents !== identity.contents) registerSecretValueForRedaction(normalizedContents);
			identityPath = path.join(temporaryDir, "identity");
			await fs.writeFile(identityPath, normalizedContents, { mode: 384 });
			assertPreparing();
			await fs.chmod(identityPath, 384);
			assertPreparing();
		}
		const knownHostsPath = path.join(temporaryDir, "known_hosts");
		await fs.writeFile(knownHostsPath, knownHosts, { mode: 384 });
		assertPreparing();
		let disposed = false;
		let selectedPort = endpoint.port;
		return {
			sshTarget: endpoint.sshTarget,
			scpTarget: endpoint.scpTarget,
			host: endpoint.host,
			advertisedPorts,
			get port() {
				return selectedPort;
			},
			identityPath,
			knownHostsPath,
			selectPort(port) {
				if (!advertisedPorts.includes(port)) throw new Error("Worker SSH selected an unadvertised port");
				selectedPort = port;
			},
			async dispose() {
				if (disposed) return;
				await fs.rm(temporaryDir, {
					recursive: true,
					force: true
				});
				disposed = true;
			}
		};
	} catch (error) {
		await fs.rm(temporaryDir, {
			recursive: true,
			force: true
		});
		throw error;
	} finally {
		preparing = false;
	}
}
/** Returns advertised candidates in stable circular order from the lifecycle selection. */
function workerSshCandidatePorts(prepared) {
	const selectedIndex = prepared.advertisedPorts.indexOf(prepared.port);
	if (selectedIndex <= 0) return prepared.advertisedPorts;
	return [...prepared.advertisedPorts.slice(selectedIndex), ...prepared.advertisedPorts.slice(0, selectedIndex)];
}
/** Retries SSH's transport-level exit 255 under one deadline and records proven exits. */
async function runWorkerSshCandidates(prepared, timeoutMs, run) {
	const deadlineMs = Date.now() + timeoutMs;
	let lastResult;
	for (const port of workerSshCandidatePorts(prepared)) {
		const remainingTimeoutMs = deadlineMs - Date.now();
		if (lastResult !== void 0 && remainingTimeoutMs <= 0) return lastResult;
		const result = await run(port, Math.max(0, remainingTimeoutMs));
		lastResult = result;
		if (result.termination === "exit" && result.code !== null && result.code !== 255) {
			prepared.selectPort(port);
			return result;
		}
		if (result.termination !== "exit" || result.code !== 255) return result;
	}
	return lastResult;
}
/** Pinned SSH options shared by bootstrap, tunnel control, and workspace transfer. */
function workerSshOptions(prepared, params) {
	return [
		"-F",
		"none",
		...[
			"BatchMode=yes",
			"ConnectTimeout=10",
			"NumberOfPasswordPrompts=0",
			"PreferredAuthentications=publickey",
			"StrictHostKeyChecking=yes",
			`UserKnownHostsFile=${prepared.knownHostsPath}`,
			"GlobalKnownHostsFile=none",
			"UpdateHostKeys=no",
			"ForwardAgent=no",
			"ForwardX11=no",
			"ForwardX11Trusted=no",
			`ClearAllForwardings=${params.forwarding === "disabled" ? "yes" : "no"}`,
			"ExitOnForwardFailure=yes",
			"IdentityAgent=none"
		].flatMap((option) => ["-o", option]),
		"-i",
		prepared.identityPath,
		"-o",
		"IdentitiesOnly=yes",
		"-o",
		"ControlMaster=no",
		"-o",
		"ControlPath=none"
	];
}
function workerSshCommandOptions(params) {
	const baseEnv = Object.fromEntries([
		"HOME",
		"PATH",
		"LANG",
		"LC_ALL",
		"TZ",
		"SystemRoot",
		"WINDIR"
	].flatMap((name) => process.env[name] === void 0 ? [] : [[name, process.env[name]]]));
	return {
		timeoutMs: params.timeoutMs,
		input: params.input,
		signal: params.signal,
		baseEnv,
		maxOutputBytes: MAX_COMMAND_OUTPUT_BYTES,
		killProcessTree: true
	};
}
function workerSshRemoteCommand(argv) {
	return argv.map(shellEscape).join(" ");
}
//#endregion
export { workerSshOptions as a, workerSshCommandOptions as i, resolveWorkerSshSandboxSettings as n, workerSshRemoteCommand as o, runWorkerSshCandidates as r, prepareWorkerSsh as t };
