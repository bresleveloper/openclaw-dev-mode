import { t as isBunRuntime } from "./runtime-binary-Cy5Lhult.mjs";
import { r as resolveOpenClawPackageRootSync } from "./openclaw-root-Cur9Uhkp.mjs";
import { n as tryProcessCwd } from "./safe-cwd-DOxDm8mD.mjs";
import { t as resolveRuntimeWorkerArgv } from "./runtime-worker-url-B4o9tqvO.mjs";
import { createRequire } from "node:module";
import fs from "node:fs";
import { pathToFileURL } from "node:url";
import path from "node:path";
//#region src/infra/openclaw-cli-invocation.ts
const requireFromHere = createRequire(import.meta.url);
const OPENCLAW_CLI_ENTRY_BASENAMES = /* @__PURE__ */ new Set(["openclaw", "openclaw.mjs"]);
const OPENCLAW_PACKAGE_ENTRY_PATHS = /* @__PURE__ */ new Set([
	path.join("dist", "entry.js"),
	path.join("dist", "entry.mjs"),
	path.join("dist", "index.js"),
	path.join("dist", "index.mjs"),
	path.join("src", "entry.ts")
]);
function resolveTsxImport(packageRoot) {
	return pathToFileURL(requireFromHere.resolve("tsx", { paths: [packageRoot] })).href;
}
/** Keep parent runtime flags, pin its known TSX preload, and leave debugger ownership behind. */
function filterOpenClawChildExecArgv(execArgv, sourceRoot) {
	const filtered = [];
	for (let index = 0; index < execArgv.length; index += 1) {
		const arg = execArgv[index] ?? "";
		if (/^--inspect(?:-brk|-wait|-port)?(?:=|$)/.test(arg)) {
			const next = execArgv[index + 1];
			if (!arg.includes("=") && typeof next === "string" && !next.startsWith("-")) index += 1;
			continue;
		}
		const bareTsx = arg === "tsx" && execArgv[index - 1] === "--import";
		filtered.push(sourceRoot && (bareTsx || arg === "--import=tsx") ? `${bareTsx ? "" : "--import="}${resolveTsxImport(sourceRoot)}` : arg);
	}
	return filtered;
}
function buildPackageRootCliArgs(packageRoot, execPath) {
	const sourceEntry = path.join(packageRoot, "src", "entry.ts");
	if (fs.existsSync(sourceEntry)) try {
		return filterOpenClawChildExecArgv(resolveRuntimeWorkerArgv(pathToFileURL(sourceEntry), execPath), packageRoot);
	} catch {}
	return [path.join(packageRoot, "openclaw.mjs")];
}
function resolveCurrentOpenClawCliInvocation(args, options = {}) {
	const execPath = options.execPath ?? process.execPath;
	const entry = (options.argv1 ?? process.argv[1])?.trim();
	const cwd = options.cwd ?? tryProcessCwd();
	const entryPackageRoot = entry ? resolveOpenClawPackageRootSync({ argv1: entry }) : null;
	const packageRoot = entryPackageRoot ?? resolveOpenClawPackageRootSync({
		argv1: entry,
		cwd,
		moduleUrl: options.moduleUrl ?? import.meta.url
	});
	const invocationCwd = packageRoot ?? cwd ?? (entry ? path.dirname(path.resolve(entry)) : path.dirname(execPath));
	const sourceEntry = packageRoot ? path.join(packageRoot, "src", "entry.ts") : void 0;
	const currentEntry = entry && entry !== execPath && entryPackageRoot && (OPENCLAW_CLI_ENTRY_BASENAMES.has(path.basename(entry)) || OPENCLAW_PACKAGE_ENTRY_PATHS.has(path.relative(path.resolve(entryPackageRoot), path.resolve(entry)))) ? entry : void 0;
	const cliArgs = currentEntry ? [...filterOpenClawChildExecArgv(options.execArgv ?? process.execArgv, currentEntry === sourceEntry && !isBunRuntime(execPath) ? packageRoot ?? void 0 : void 0), currentEntry] : packageRoot ? buildPackageRootCliArgs(packageRoot, execPath) : entry && entry !== execPath ? [entry] : [];
	const env = packageRoot && !isBunRuntime(execPath) && cliArgs.at(-1) === sourceEntry ? { TSX_TSCONFIG_PATH: path.join(packageRoot, "tsconfig.json") } : void 0;
	return {
		command: execPath,
		args: [...cliArgs, ...args],
		cwd: invocationCwd,
		...env ? { env } : {}
	};
}
//#endregion
export { resolveCurrentOpenClawCliInvocation as n, filterOpenClawChildExecArgv as t };
