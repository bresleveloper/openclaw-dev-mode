import { s as normalizeNullableString } from "./string-coerce-1VuiLaaR.mjs";
import { r as asNullableRecord } from "./record-coerce-TIsquoVR.mjs";
import { r as resolveEnvironmentValue } from "./process-env-DlZFJzq6.mjs";
import { i as nodeRuntimeFailure, n as detectCurrentSqliteCapabilities } from "./node-sqlite-DWn4GVXM.mjs";
import { a as resolveExecutableFromPathEnv } from "./executable-path-CP2HPhgU.mjs";
import { l as tryReadJson } from "./json-files-C5mNTScg.mjs";
import { r as mergePathPrepend } from "./path-prepend-Cv1ulMUG.mjs";
import { a as nodeVersionSatisfiesEngine } from "./runtime-guard-BoZCdLcu.mjs";
import { d as resolveSystemNodeInfo, o as resolveNodeRuntimeInfo } from "./runtime-paths-D7k3lrcM.mjs";
import path from "node:path";
//#region src/infra/update-runner-git-node-preflight.ts
const MAX_PACKAGE_JSON_BYTES = 1048576;
async function readCandidateNodeEngine(root) {
	const manifest = asNullableRecord(await tryReadJson(path.join(root, "package.json"), { maxBytes: MAX_PACKAGE_JSON_BYTES }));
	const engines = asNullableRecord(manifest?.engines);
	return normalizeNullableString(engines?.node);
}
async function resolveCandidateNode(env, engine) {
	let firstAvailable = null;
	const directories = (resolveEnvironmentValue(env, "PATH") ?? "").split(path.delimiter).filter((directory) => path.isAbsolute(directory));
	for (const directory of new Set(directories)) {
		const executable = resolveExecutableFromPathEnv("node", [directory], env, { useCache: false });
		if (!executable) continue;
		const runtime = {
			...await resolveNodeRuntimeInfo(executable, env),
			path: executable
		};
		if (runtime.status === "supported" && nodeVersionSatisfiesEngine(runtime.version, engine) !== false) return runtime;
		firstAvailable ??= runtime;
	}
	const systemNode = await resolveSystemNodeInfo({
		env,
		acceptNodeVersion: (version) => nodeVersionSatisfiesEngine(version, engine) !== false
	});
	return systemNode?.status === "supported" && nodeVersionSatisfiesEngine(systemNode.version, engine) !== false ? systemNode : firstAvailable ?? systemNode;
}
/** Qualify package-tooling Node and bind candidate commands without changing the Gateway runtime. */
async function prepareGitCandidateNodeRuntime(root, env = process.env, mode = "package-tooling") {
	const startedAt = Date.now();
	const engine = await readCandidateNodeEngine(root);
	let currentVersion = process.versions.node;
	let currentPath = process.execPath;
	let capabilityError = process.versions.bun ? null : nodeRuntimeFailure(currentVersion, await detectCurrentSqliteCapabilities());
	let systemNode = null;
	if (process.versions.bun || mode === "package-tooling" && path.basename(currentPath) !== (process.platform === "win32" ? "node.exe" : "node") && !capabilityError && nodeVersionSatisfiesEngine(currentVersion, engine) !== false) {
		systemNode = await resolveCandidateNode(env, engine);
		currentPath = systemNode?.path ?? "system Node";
		currentVersion = systemNode?.status === "supported" || systemNode?.status === "unsupported" ? systemNode.version ?? "unknown" : "unavailable";
		capabilityError = systemNode === null ? "No Node executable was found." : systemNode.status === "probe-failed" ? systemNode.error.message : systemNode.status === "unsupported" ? systemNode.capabilityError ?? nodeRuntimeFailure(systemNode.version, systemNode.sqliteProbe) ?? "Node requires WAL-reset-safe SQLite." : null;
	}
	if (!capabilityError && nodeVersionSatisfiesEngine(currentVersion, engine) !== false) {
		const pathKey = Object.keys(env).toSorted().find((key) => process.platform === "win32" ? key.toUpperCase() === "PATH" : key === "PATH") ?? "PATH";
		const runtimeDirectory = path.dirname(currentPath);
		const directories = (resolveEnvironmentValue(env, "PATH") ?? "").split(path.delimiter).filter((directory) => directory !== runtimeDirectory);
		const firstNode = directories.findIndex((directory) => resolveExecutableFromPathEnv("node", [directory], env, {
			cwd: root,
			useCache: false
		}));
		const prefixLength = firstNode < 0 ? directories.length : firstNode;
		return { env: {
			...env,
			[pathKey]: mergePathPrepend(directories.slice(prefixLength).join(path.delimiter), [...directories.slice(0, prefixLength), runtimeDirectory])
		} };
	}
	systemNode ??= await resolveSystemNodeInfo({
		env,
		acceptNodeVersion: (version) => nodeVersionSatisfiesEngine(version, engine) !== false
	});
	let systemDiagnostic;
	if (systemNode?.status === "probe-failed") systemDiagnostic = `System Node compatibility remains unknown because its probe failed: ${systemNode.error.message}`;
	else if (systemNode?.status === "supported" && nodeVersionSatisfiesEngine(systemNode.version, engine) !== false) systemDiagnostic = `OpenClaw did not select or activate another runtime. Existing compatible Node ${systemNode.version}: ${systemNode.path}`;
	else systemDiagnostic = "No compatible existing system Node was found.";
	return { step: {
		name: "preflight-node-runtime",
		command: `check Node ${currentVersion} against engines.node ${engine}`,
		cwd: root,
		durationMs: Date.now() - startedAt,
		exitCode: 1,
		stdoutTail: `Node ${currentVersion} (${currentPath}); requires engines.node ${engine}`,
		stderrTail: `${capabilityError ? `${capabilityError}\n` : ""}Activate a compatible Node for the CLI, then retry. ${systemDiagnostic}`
	} };
}
//#endregion
export { prepareGitCandidateNodeRuntime as t };
