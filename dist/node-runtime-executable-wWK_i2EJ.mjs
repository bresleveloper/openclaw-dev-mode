import path from "node:path";
import { execFileSync } from "node:child_process";
//#region src/infra/node-runtime-executable.ts
const NODE_RUNTIME_PROBE_TIMEOUT_MS = 5e3;
const NODE_RUNTIME_CACHE_MAX_ENTRIES = 16;
const resolvedNodeRuntimeExecutables = /* @__PURE__ */ new Map();
function buildProbeEnv(env) {
	const probeEnv = {};
	for (const key of [
		"SystemRoot",
		"SYSTEMROOT",
		"WINDIR",
		"TEMP",
		"TMP",
		"TMPDIR"
	]) {
		const value = env[key];
		if (value) probeEnv[key] = value;
	}
	return probeEnv;
}
function buildNodeExecutableCandidates(env) {
	const names = process.platform === "win32" ? (env.PATHEXT ?? ".EXE;.CMD;.BAT;.COM").split(";").filter(Boolean).map((extension) => `node${extension.toLowerCase()}`) : ["node"];
	const candidates = (env.PATH ?? "").split(path.delimiter).filter(Boolean).flatMap((directory) => names.map((name) => path.join(directory, name)));
	if (process.platform === "darwin") candidates.push("/opt/homebrew/bin/node", "/opt/homebrew/opt/node/bin/node", "/usr/local/bin/node", "/usr/local/opt/node/bin/node", "/usr/bin/node");
	else if (process.platform === "linux") candidates.push("/usr/local/bin/node", "/usr/bin/node");
	return [...new Set(candidates)];
}
/** Resolves a real Node executable, skipping Bun's optional `node` shim. */
function resolveNodeRuntimeExecutable(options) {
	const env = options?.env ?? process.env;
	const requiredFlag = options?.requiredFlag;
	if (!process.versions.bun && (!requiredFlag || process.allowedNodeEnvironmentFlags.has(requiredFlag))) return process.execPath;
	const cacheKey = [
		process.platform,
		process.versions.bun ?? process.versions.node,
		requiredFlag ?? "",
		env.PATH ?? "",
		env.PATHEXT ?? ""
	].join("\0");
	const cached = resolvedNodeRuntimeExecutables.get(cacheKey);
	if (cached !== void 0) return cached ?? void 0;
	const probeSource = `const requiredFlag=${JSON.stringify(requiredFlag)};process.stdout.write(!process.versions.bun&&(!requiredFlag||process.allowedNodeEnvironmentFlags.has(requiredFlag))?process.execPath:"")`;
	let resolved;
	for (const candidate of buildNodeExecutableCandidates(env)) try {
		const nodePath = execFileSync(candidate, ["--eval", probeSource], {
			encoding: "utf8",
			env: buildProbeEnv(env),
			stdio: [
				"ignore",
				"pipe",
				"ignore"
			],
			timeout: NODE_RUNTIME_PROBE_TIMEOUT_MS
		}).trim();
		if (nodePath) {
			resolved = nodePath;
			break;
		}
	} catch {}
	resolvedNodeRuntimeExecutables.set(cacheKey, resolved ?? null);
	while (resolvedNodeRuntimeExecutables.size > NODE_RUNTIME_CACHE_MAX_ENTRIES) {
		const oldest = resolvedNodeRuntimeExecutables.keys().next().value;
		if (oldest === void 0) break;
		resolvedNodeRuntimeExecutables.delete(oldest);
	}
	return resolved;
}
//#endregion
export { resolveNodeRuntimeExecutable as t };
