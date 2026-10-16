//#region src/daemon/runtime-binary.ts
/** Classifies runtime executable paths for daemon command rendering. */
const NODE_VERSIONED_PATTERN = /^node(?:-\d+|\d+)(?:\.\d+)*(?:\.exe)?$/;
function normalizeRuntimeBasename(execPath) {
	const trimmed = execPath.trim().replace(/^["']|["']$/g, "");
	const lastSlash = Math.max(trimmed.lastIndexOf("/"), trimmed.lastIndexOf("\\"));
	return (lastSlash === -1 ? trimmed : trimmed.slice(lastSlash + 1)).trim().toLowerCase();
}
/** Returns whether an executable path names a Node runtime binary. */
function isNodeRuntime(execPath) {
	const base = normalizeRuntimeBasename(execPath);
	return /^node(?:js)?(?:\.exe)?$/.test(base) || NODE_VERSIONED_PATTERN.test(base);
}
/** Returns whether an executable path names a Bun runtime binary. */
function isBunRuntime(execPath) {
	const base = normalizeRuntimeBasename(execPath);
	return base === "bun" || base === "bun.exe";
}
const RUNTIME_MODULE_OPTIONS = /* @__PURE__ */ new Set([
	"-r",
	"--preload",
	"--require",
	"--import",
	"--loader",
	"--experimental-loader",
	"--test-reporter",
	"--test-global-setup"
]);
const RUNTIME_VALUE_OPTIONS = /* @__PURE__ */ new Set([
	...RUNTIME_MODULE_OPTIONS,
	"-C",
	"--env-file",
	"--env-file-if-exists",
	"--tsconfig",
	"--cwd",
	"--conditions",
	"--icu-data-dir",
	"--openssl-config",
	"--title",
	"--disable-warning",
	"--disable-proto",
	"--cpu-prof-name",
	"--max-old-space-size",
	"--max-semi-space-size"
]);
const RUNTIME_BOOLEAN_OPTIONS = /* @__PURE__ */ new Set([
	"--inspect",
	"--inspect-brk",
	"--inspect-wait",
	"--expose-gc",
	"--jitless",
	"--no-opt",
	"--experimental-strip-types",
	"--watch",
	"--no-warnings",
	"--trace-uncaught",
	"--bun"
]);
/** One runtime walk preserves command identity and possible artifact operands. */
function resolveRuntimeScriptPosition(args) {
	const operands = [];
	const executable = args[0] ?? "";
	const basename = executable.replaceAll("\\", "/").trim().toLowerCase().split("/").at(-1);
	const bun = isBunRuntime(executable);
	const tsx = basename === "tsx" || basename === "tsx.cmd";
	let pendingSubcommand = bun ? "run" : tsx ? "watch" : void 0;
	let unresolved;
	let inlineCommand = false;
	if (!isNodeRuntime(executable) && !bun && !tsx) return {
		position: { kind: "not-runtime" },
		operands
	};
	for (let index = 1; index < args.length; index++) {
		const arg = args[index];
		if (arg === "--") {
			if (!unresolved) return {
				position: !inlineCommand && args[index + 1] ? index + 1 : { kind: "other" },
				operands
			};
			operands.push(...args.slice(index + 1).map((value) => ({
				value,
				module: false
			})));
			break;
		}
		if (arg === "-e" || arg === "-p" || /^--(?:eval|print|run)(?:=|$)/.test(arg)) {
			inlineCommand = true;
			if (!arg.includes("=")) index++;
			continue;
		}
		const equals = arg.indexOf("=");
		const option = equals < 0 ? arg : arg.slice(0, equals);
		if (arg.startsWith("-r") && !arg.startsWith("--") && arg.length > 2) operands.push({
			value: arg.slice(2),
			module: true
		});
		else if (RUNTIME_VALUE_OPTIONS.has(option)) {
			const value = equals < 0 ? args[++index] ?? "" : arg.slice(equals + 1);
			const builtinReporter = !bun && option === "--test-reporter" && /^(?:dot|spec|tap)$/.test(value);
			if (RUNTIME_MODULE_OPTIONS.has(option) && !builtinReporter && (!bun || option !== "--loader")) operands.push({
				value,
				module: true
			});
		} else if (arg.startsWith("-")) {
			const negated = `--no-${option.replace(/^--(?:no-)?/, "")}`;
			const nodeOption = !bun && process.allowedNodeEnvironmentFlags.has(option);
			const knownBoolean = RUNTIME_BOOLEAN_OPTIONS.has(option) || bun && (option === "--hot" || option === "--no-install") || nodeOption && process.allowedNodeEnvironmentFlags.has(negated);
			if (!inlineCommand && !knownBoolean && !/^--[^=]+=/.test(arg)) unresolved ??= {
				kind: "unclassified",
				reason: `unsupported runtime option ${arg}`
			};
			if (equals >= 0 && !knownBoolean && !nodeOption) operands.push({
				value: arg.slice(equals + 1),
				module: true
			});
		} else if (!inlineCommand && arg === pendingSubcommand) pendingSubcommand = void 0;
		else if (!inlineCommand) {
			if (!unresolved) return {
				position: index,
				operands
			};
			pendingSubcommand = void 0;
			operands.push({
				value: arg,
				module: false
			});
		}
	}
	return {
		position: unresolved ?? { kind: "other" },
		operands
	};
}
//#endregion
export { isNodeRuntime as n, resolveRuntimeScriptPosition as r, isBunRuntime as t };
