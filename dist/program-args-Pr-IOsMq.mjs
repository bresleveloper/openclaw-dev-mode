import { n as SUPPORTED_NODE_VERSIONS } from "./node-version-DdJ6cN09.mjs";
import { n as resolveBrewOpenClawPath } from "./brew-1OE2HOX6.mjs";
import { n as findFirstAccessibleGatewayEntrypoint, r as isGatewayDistEntrypointPath, t as buildGatewayDistEntrypointCandidates } from "./gateway-entrypoint-Cko-Hb6h.mjs";
import { i as resolveGatewayHeapExecArgv } from "./gateway-heap-9PZ2gCSQ.mjs";
import { constants } from "node:fs";
import path from "node:path";
import fs$1 from "node:fs/promises";
//#region src/daemon/program-args.ts
/** Builds runtime command arguments for gateway and node service installs. */
const OPENCLAW_WRAPPER_ENV_KEY = "OPENCLAW_WRAPPER";
async function resolveCliEntrypointPathForService() {
	const argv1 = process.argv[1];
	if (!argv1) throw new Error("Unable to resolve CLI entrypoint path");
	const normalized = path.resolve(argv1);
	const resolvedPath = await resolveRealpathSafe(normalized);
	if (isGatewayDistEntrypointPath(resolvedPath)) {
		const preferredDistEntrypoint = await findFirstAccessibleGatewayEntrypoint(buildGatewayDistEntrypointCandidates(normalized, resolvedPath), async (candidate) => {
			try {
				await fs$1.access(candidate);
				return true;
			} catch {
				return false;
			}
		});
		if (preferredDistEntrypoint) return preferredDistEntrypoint;
		if (isGatewayDistEntrypointPath(normalized) && normalized !== resolvedPath) try {
			await fs$1.access(normalized);
			return normalized;
		} catch {}
		return resolvedPath;
	}
	const distCandidates = buildDistCandidates(resolvedPath, normalized);
	for (const candidate of distCandidates) try {
		await fs$1.access(candidate);
		return candidate;
	} catch {}
	throw new Error(`Cannot find built CLI at ${distCandidates.join(" or ")}. Run "pnpm build" first, or use dev mode.`);
}
async function resolveRealpathSafe(inputPath) {
	try {
		return await fs$1.realpath(inputPath);
	} catch {
		return inputPath;
	}
}
function buildDistCandidates(...inputs) {
	const candidates = [];
	const seen = /* @__PURE__ */ new Set();
	for (const inputPath of inputs) {
		if (!inputPath) continue;
		const baseDir = path.dirname(inputPath);
		appendDistCandidates(candidates, seen, path.resolve(baseDir, ".."));
		appendDistCandidates(candidates, seen, baseDir);
		appendNodeModulesBinCandidates(candidates, seen, inputPath);
	}
	return candidates;
}
function appendDistCandidates(candidates, seen, baseDir) {
	const distDir = path.resolve(baseDir, "dist");
	const distEntries = [
		path.join(distDir, "index.js"),
		path.join(distDir, "index.mjs"),
		path.join(distDir, "entry.js"),
		path.join(distDir, "entry.mjs")
	];
	for (const entry of distEntries) {
		if (seen.has(entry)) continue;
		seen.add(entry);
		candidates.push(entry);
	}
}
function appendNodeModulesBinCandidates(candidates, seen, inputPath) {
	const parts = inputPath.split(path.sep);
	const binIndex = parts.lastIndexOf(".bin");
	if (binIndex <= 0) return;
	if (parts[binIndex - 1] !== "node_modules") return;
	const binName = path.basename(inputPath);
	const nodeModulesDir = parts.slice(0, binIndex).join(path.sep);
	appendDistCandidates(candidates, seen, path.join(nodeModulesDir, binName));
}
function resolveRepoRootForDev() {
	const argv1 = process.argv[1];
	if (!argv1) throw new Error("Unable to resolve repo root");
	const parts = path.resolve(argv1).split(path.sep);
	const srcIndex = parts.lastIndexOf("src");
	if (srcIndex === -1) throw new Error("Dev mode requires running from repo (src/entry.ts)");
	return parts.slice(0, srcIndex).join(path.sep);
}
async function resolveOpenClawWrapperPath(inputPath) {
	const trimmed = inputPath?.trim();
	if (!trimmed) return;
	const resolved = path.resolve(trimmed);
	try {
		if (!(await fs$1.stat(resolved)).isFile()) throw new Error("not a regular file");
		await fs$1.access(resolved, constants.X_OK);
	} catch (error) {
		const detail = error instanceof Error ? ` (${error.message})` : "";
		throw new Error(`${OPENCLAW_WRAPPER_ENV_KEY} must point to an executable file: ${resolved}${detail}`, { cause: error });
	}
	return resolved;
}
async function resolveCliProgramArguments(params) {
	const wrapperPath = await resolveOpenClawWrapperPath(params.wrapperPath);
	if (wrapperPath) return { programArguments: [wrapperPath, ...params.args] };
	if (!params.runtimePath?.trim()) throw new Error(params.runtime === "bun" ? "No supported Bun runtime was selected for the daemon. Install Bun 1.4 or newer with WAL-reset-safe node:sqlite, then retry." : `No supported Node runtime was selected for the daemon. Install Node ${SUPPORTED_NODE_VERSIONS}, then retry.`);
	const runtimePath = params.runtimePath;
	if (params.dev) {
		const repoRoot = resolveRepoRootForDev();
		const devCliPath = path.join(repoRoot, "src", "entry.ts");
		await fs$1.access(devCliPath);
		return {
			programArguments: params.runtime === "bun" ? [
				runtimePath,
				devCliPath,
				...params.args
			] : [
				runtimePath,
				"--import",
				"tsx",
				devCliPath,
				...params.args
			],
			workingDirectory: repoRoot
		};
	}
	const cliEntrypointPath = await resolveCliEntrypointPathForService();
	return { programArguments: [
		runtimePath,
		await resolveBrewOpenClawPath(cliEntrypointPath) ?? cliEntrypointPath,
		...params.args
	] };
}
async function resolveGatewayProgramArguments(params) {
	const gatewayArgs = [
		"gateway",
		"--port",
		String(params.port)
	];
	if (params.allowUnconfigured) gatewayArgs.push("--allow-unconfigured");
	const result = await resolveCliProgramArguments({
		args: gatewayArgs,
		dev: params.dev,
		runtime: params.runtime,
		runtimePath: params.runtimePath,
		wrapperPath: params.wrapperPath
	});
	if (params.runtime === "node" && !params.wrapperPath?.trim()) result.programArguments.splice(1, 0, ...resolveGatewayHeapExecArgv(params.existingCommand));
	return result;
}
async function resolveNodeProgramArguments(params) {
	const args = [
		"node",
		"run",
		"--host",
		params.host,
		"--port",
		String(params.port)
	];
	if (params.tls === false && !params.tlsFingerprint) args.push("--no-tls");
	else if (params.tls || params.tlsFingerprint) args.push("--tls");
	if (params.tlsFingerprint) args.push("--tls-fingerprint", params.tlsFingerprint);
	if (params.contextPath) args.push("--context-path", params.contextPath);
	if (params.nodeId) args.push("--node-id", params.nodeId);
	if (params.displayName) args.push("--display-name", params.displayName);
	if (params.installedAppsSharing !== void 0) args.push(params.installedAppsSharing ? "--share-installed-apps" : "--no-share-installed-apps");
	if (params.allCommands) args.push("--all-commands");
	else if (params.commands !== void 0) args.push("--commands", params.commands.join(","));
	return resolveCliProgramArguments({
		args,
		dev: params.dev,
		runtime: params.runtime,
		runtimePath: params.runtimePath,
		wrapperPath: params.wrapperPath
	});
}
//#endregion
export { resolveOpenClawWrapperPath as i, resolveGatewayProgramArguments as n, resolveNodeProgramArguments as r, OPENCLAW_WRAPPER_ENV_KEY as t };
