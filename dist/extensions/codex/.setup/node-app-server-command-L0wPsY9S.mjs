import { isRecord } from "openclaw/plugin-sdk/string-coerce-runtime";
import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { resolveStateDir } from "openclaw/plugin-sdk/state-paths";
import { parse } from "smol-toml";
// extensions/codex/src/node-app-server-command.ts
/** Exact command identity fences a placement to its enrolled model configuration. */
const PREFIX = "codex.app-server.stdio.v1";
/** Availability and execution consume the same enrolled command-auth contract. */
function resolveCodexWorkerAuthHelper(config, directory) {
	let native;
	try {
		native = parse(config);
	} catch {
		throw new Error("Cloud worker Codex configuration is invalid");
	}
	const providerId = isRecord(native) ? native.model_provider : void 0;
	const providers = isRecord(native) ? native.model_providers : void 0;
	const provider = typeof providerId === "string" && isRecord(providers) ? providers[providerId] : void 0;
	const selected = isRecord(provider) ? provider : void 0;
	const auth = isRecord(selected?.auth) ? selected.auth : void 0;
	const helper = Array.isArray(auth?.args) && auth.args.length === 1 ? auth.args[0] : void 0;
	if (selected?.wire_api !== "responses" || auth?.command !== "node" || typeof helper !== "string" || !/^[A-Za-z0-9][A-Za-z0-9._-]*\.mjs$/.test(path.basename(helper)) || path.join(directory, path.basename(helper)) !== helper || selected.requires_openai_auth === true || selected.aws != null || ["env_key", "experimental_bearer_token"].some((key) => Object.hasOwn(selected, key))) throw new Error("Cloud worker Codex command-auth provider is incomplete");
	return helper;
}
/** Relocation does not change identity; helper name, config and executable bytes do. */
function deriveCodexWorkerConfigurationVersion(configToml, helperPath, helperScript) {
	if (configToml.split(helperPath).length !== 2) throw new Error("Worker Codex helper path is missing or ambiguous");
	return createHash("sha256").update(JSON.stringify([
		"codex-worker-provisioning-v1",
		configToml.replace(helperPath, path.basename(helperPath)),
		helperScript
	])).digest("hex");
}
function readPrivateSource(file) {
	const stat = fs.lstatSync(file);
	if (!stat.isFile() || stat.size < 1 || stat.size > 16384 || process.platform !== "win32" && (stat.mode & 63) !== 0) throw new Error("Worker Codex bundle requires private bounded regular files");
	const bytes = fs.readFileSync(file);
	if (bytes.length < 1 || bytes.length > 16384) throw new Error("Worker Codex bundle exceeds its size limit");
	return new TextDecoder("utf-8", { fatal: true }).decode(bytes);
}
/** Operator-owned worker inputs only; never the Gateway's CODEX_HOME or credentials. */
function readCodexWorkerProvisioningBundle(env = process.env) {
	const directory = path.join(resolveStateDir(env), "worker-provisioning", "codex");
	try {
		const stat = fs.lstatSync(directory, { throwIfNoEntry: false });
		if (!stat) return;
		if (!stat.isDirectory() || fs.realpathSync(directory) !== directory || process.platform !== "win32" && (stat.mode & 63) !== 0) throw new Error("Unsafe bundle directory");
		const configToml = readPrivateSource(path.join(directory, "config.toml"));
		const helperPath = resolveCodexWorkerAuthHelper(configToml, directory);
		const helperScript = readPrivateSource(helperPath);
		return {
			configToml,
			helperScript,
			helperPath,
			configVersion: deriveCodexWorkerConfigurationVersion(configToml, helperPath, helperScript)
		};
	} catch {
		throw new Error("Worker Codex provisioning bundle is invalid or unavailable; check its private config.toml and auth helper");
	}
}
function resolveCodexWorkerAppServerCommand(env = process.env, required = false) {
	let enrolled;
	const versionPath = path.join(resolveStateDir(env), "codex-runtime", "version");
	try {
		if (fs.lstatSync(versionPath, { throwIfNoEntry: false })) enrolled = readPrivateSource(versionPath);
	} catch {
		throw new Error("Worker Codex enrolled configuration version is unavailable");
	}
	const configured = readCodexWorkerProvisioningBundle(env)?.configVersion;
	const version = enrolled ?? configured;
	if (!version) {
		if (required) throw new Error("Worker Codex configuration version is unavailable");
		return PREFIX;
	}
	if (!/^[a-f0-9]{64}$/.test(version) || enrolled && configured && enrolled !== configured) throw new Error("Worker Codex configuration version is invalid or mismatched");
	return PREFIX + "." + version;
}
export { resolveCodexWorkerAuthHelper as i, readCodexWorkerProvisioningBundle as n, resolveCodexWorkerAppServerCommand as r, deriveCodexWorkerConfigurationVersion as t };
