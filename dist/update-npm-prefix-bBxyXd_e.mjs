import { d as pathExists } from "./fs-safe-BUXBSN-4.mjs";
import { o as resolveExecutablePath } from "./executable-path-CP2HPhgU.mjs";
import { t as applyPathPrepend } from "./path-prepend-Cv1ulMUG.mjs";
import path from "node:path";
import fs from "node:fs/promises";
//#region src/infra/update-npm-prefix.ts
/** Reads the command value after package-manager warnings printed on stdout. */
function readPackageManagerProbeValue(stdout) {
	return stdout.split(/\r?\n/u).findLast((line) => line.trim())?.trim() ?? "";
}
/**
* Infers npm prefix, package root, and bin paths from an npm global root.
* Direct `node_modules` roots are accepted only when the caller opts into them.
*/
function resolveNpmGlobalPrefixLayoutFromGlobalRoot(globalRoot, options = {}) {
	const trimmed = globalRoot?.trim();
	if (!trimmed) return null;
	const normalized = path.resolve(trimmed);
	if (path.basename(normalized) !== "node_modules") return null;
	const parentDir = path.dirname(normalized);
	if (path.basename(parentDir) === "lib") {
		const prefix = path.dirname(parentDir);
		return {
			prefix,
			globalRoot: normalized,
			binDir: path.join(prefix, "bin")
		};
	}
	if (process.platform === "win32") return {
		prefix: parentDir,
		globalRoot: normalized,
		binDir: parentDir
	};
	if (options.allowDirectNodeModulesRoot) return {
		prefix: parentDir,
		globalRoot: normalized,
		binDir: path.join(normalized, ".bin")
	};
	return null;
}
/**
* Derives npm's global package and bin directories from a prefix root.
* Used for staged installs where OpenClaw creates the prefix itself.
*/
function resolveNpmGlobalPrefixLayoutFromPrefix(prefix) {
	const resolvedPrefix = path.resolve(prefix);
	const windows = process.platform === "win32";
	return {
		prefix: resolvedPrefix,
		globalRoot: path.join(resolvedPrefix, windows ? "" : "lib", "node_modules"),
		binDir: windows ? resolvedPrefix : path.join(resolvedPrefix, "bin")
	};
}
async function probeNpmGlobalPrefix(runCommand, timeoutMs, command = "npm", diagnostics = []) {
	const executable = resolveExecutablePath(command);
	const cli = executable ? process.platform === "win32" ? path.join(path.dirname(executable), "node_modules", "npm", "bin", "npm-cli.js") : await fs.realpath(executable).catch(() => path.resolve(executable)) : null;
	const argv = cli && path.basename(cli) === "npm-cli.js" && await pathExists(cli) ? [
		process.execPath,
		cli,
		"prefix",
		"-g"
	] : [
		command,
		"prefix",
		"-g"
	];
	const env = {};
	for (const [key, value] of Object.entries(process.env)) if (value !== void 0) env[key] = value;
	applyPathPrepend(env, [path.dirname(process.execPath)]);
	const result = await runCommand(argv, {
		timeoutMs,
		env
	}).catch(() => null);
	const prefix = result?.code === 0 ? readPackageManagerProbeValue(result.stdout) : "";
	diagnostics.push(`${argv.join(" ")}: ${prefix || "unavailable"}`);
	return prefix && path.isAbsolute(prefix) ? resolveNpmGlobalPrefixLayoutFromPrefix(prefix) : null;
}
async function inspectNpmLauncher(layout) {
	const launcher = path.join(layout.binDir, process.platform === "win32" ? "openclaw.cmd" : "openclaw");
	let launcherTarget = await fs.realpath(launcher).catch(() => null);
	if (process.platform === "win32" && launcherTarget) {
		const script = await fs.readFile(launcher, "utf8").catch(() => "");
		const relative = /"(?:%dp0%|%~dp0)[\\/]([^"\r\n]+)"[ \t]+%\*/iu.exec(script)?.[1];
		launcherTarget = relative ? await fs.realpath(path.resolve(layout.binDir, ...relative.split(/[\\/]/u))).catch(() => null) : null;
	}
	return {
		launcher,
		launcherTarget
	};
}
//#endregion
export { resolveNpmGlobalPrefixLayoutFromPrefix as a, resolveNpmGlobalPrefixLayoutFromGlobalRoot as i, probeNpmGlobalPrefix as n, readPackageManagerProbeValue as r, inspectNpmLauncher as t };
