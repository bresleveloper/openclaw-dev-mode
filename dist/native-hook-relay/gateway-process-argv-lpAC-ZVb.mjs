import { i as extractErrorCode } from "./error-coercion-DKQY4wyF.mjs";
import { D as isRecord, g as normalizeLowercaseStringOrEmpty } from "./number-coercion-CmpLVzZ6.mjs";
import { n as resolveDiagnosticProcessEnv } from "./process-env-DlZFJzq6.mjs";
import { n as isNodeRuntime, r as resolveRuntimeScriptPosition, t as isBunRuntime } from "./runtime-binary-BAwmhhZ0.mjs";
import { n as isLegacyPluginSourceCaptureName } from "./plugin-source-capture-path-DrCyVB7i.mjs";
import { spawnSync } from "node:child_process";
import fsSync from "node:fs";
import path from "node:path";
//#region src/process/windows-command-line.ts
/** Parse an Arguments field; it does not contain the executable's special first token. */
function parseWindowsNativeArguments(value) {
	const args = [];
	let index = 0;
	while (index < value.length) {
		while (/[ \t]/.test(value.charAt(index))) index++;
		if (index === value.length) break;
		let argument = "";
		let quoted = false;
		while (index < value.length) {
			let backslashes = 0;
			while (value[index] === "\\") {
				backslashes++;
				index++;
			}
			if (value[index] === "\"") {
				argument += "\\".repeat(Math.floor(backslashes / 2));
				if (backslashes % 2 === 1) {
					argument += "\"";
					index++;
				} else if (quoted && value[index + 1] === "\"") {
					argument += "\"";
					index += 2;
				} else {
					quoted = !quoted;
					index++;
				}
				continue;
			}
			argument += "\\".repeat(backslashes);
			if (index === value.length || !quoted && /[ \t]/.test(value.charAt(index))) break;
			argument += value.charAt(index++);
		}
		args.push(argument);
	}
	return args;
}
/** Parse a native process command line; argv[0] preserves backslashes before quotes. */
function parseWindowsNativeCommandLine(value) {
	if (value.includes("\0")) return null;
	let index = 0;
	while (/[ \t]/.test(value.charAt(index))) index++;
	if (index === value.length) return [];
	let executable = "";
	let quoted = false;
	while (index < value.length && (quoted || !/[ \t]/.test(value.charAt(index)))) {
		const character = value.charAt(index++);
		if (character === "\"") quoted = !quoted;
		else executable += character;
	}
	if (quoted || !executable) return null;
	return [executable, ...parseWindowsNativeArguments(value.slice(index))];
}
const ROOT_BOOLEAN_FLAGS = /* @__PURE__ */ new Set(["--dev", "--no-color"]);
const ROOT_VALUE_FLAGS = /* @__PURE__ */ new Set([
	"--profile",
	"--log-level",
	"--container"
]);
/** Returns whether a token can be consumed as a root option value. */
function isValueToken(arg) {
	if (!arg || arg === "--") return false;
	if (!arg.startsWith("-")) return true;
	return /^-\d+(?:\.\d+)?$/.test(arg);
}
/** Consume required root values by their Commander role before startup policy is selected. */
function consumeRootCommandOptionToken(args, index) {
	return consumeKnownOptionToken(args, index, ROOT_BOOLEAN_FLAGS, ROOT_VALUE_FLAGS, "command-path");
}
/** Read positional command tokens while accepting root options at any pre-terminator position. */
function getRootOptionAwareCommandPath(argv, depth) {
	const args = argv.slice(2);
	const path = [];
	let literal = false;
	for (let index = 0; index < args.length; index += 1) {
		const arg = args[index];
		if (!arg) break;
		if (!literal && arg === "--") {
			if (path.length > 0) break;
			literal = true;
			continue;
		}
		const consumed = literal ? 0 : consumeRootCommandOptionToken(args, index);
		if (consumed > 0) {
			index += consumed - 1;
			continue;
		}
		if (!literal && arg.startsWith("-")) continue;
		path.push(arg);
		if (path.length >= depth) break;
	}
	return path;
}
function consumeKnownOptionToken(args, index, booleanFlags, valueFlags, mode) {
	const arg = args[index];
	if (!arg || arg === "--" || !arg.startsWith("-")) return 0;
	const equalsIndex = arg.indexOf("=");
	const flag = equalsIndex === -1 ? arg : arg.slice(0, equalsIndex);
	if (booleanFlags.has(flag)) return equalsIndex === -1 ? 1 : 0;
	if (!valueFlags.has(flag)) return 0;
	if (equalsIndex !== -1) return mode === "command-path" || arg.slice(equalsIndex + 1).trim() ? 1 : 0;
	if (mode === "command-path") return args[index + 1] !== void 0 ? 2 : 0;
	return isValueToken(args[index + 1]) ? 2 : 0;
}
//#endregion
//#region src/infra/gateway-process-argv.ts
function normalizeProcArg(arg) {
	return normalizeLowercaseStringOrEmpty(arg.replaceAll("\\", "/"));
}
const ENTRY_CANDIDATES = [
	"openclaw.mjs",
	"dist/index.js",
	"dist/entry.js",
	"scripts/run-node.mjs",
	"src/entry.ts",
	"src/index.ts"
];
function referencesRetainedArtifact(value) {
	return value.split(/[\\/=]/u).some((part) => isLegacyPluginSourceCaptureName(part) || /^openclaw-update-runtime-[A-Za-z0-9]{6}$/u.test(part));
}
/** Only absent nested manifests permit ancestor lookup; unreadable identities stay unresolved. */
function readProcessPackageIdentity(directory, searchParents = false) {
	for (let current = directory;;) {
		let manifest;
		try {
			manifest = JSON.parse(fsSync.readFileSync(path.join(current, "package.json"), "utf8"));
		} catch (error) {
			const parent = path.dirname(current);
			if (searchParents && extractErrorCode(error) === "ENOENT" && parent !== current && path.basename(current) !== "node_modules") {
				current = parent;
				continue;
			}
			throw new Error("could not read package identity", { cause: error });
		}
		if (!isRecord(manifest) || typeof manifest.name !== "string" || !manifest.name.trim() || manifest.name !== manifest.name.trim()) throw new Error("package identity has no valid name");
		return {
			name: manifest.name,
			scripts: isRecord(manifest.scripts) ? manifest.scripts : {}
		};
	}
}
function readProcessWorkingDirectories(pids) {
	const requested = new Set(pids.filter((pid) => Number.isSafeInteger(pid) && pid > 0));
	const directories = /* @__PURE__ */ new Map();
	if (requested.size === 0) return directories;
	if (process.platform === "linux") {
		for (const pid of requested) try {
			directories.set(pid, fsSync.readlinkSync(`/proc/${pid}/cwd`));
		} catch {}
		return directories;
	}
	try {
		if (process.platform === "darwin") {
			const result = spawnSync("/usr/sbin/lsof", [
				"-a",
				"-p",
				[...requested].join(","),
				"-d",
				"cwd",
				"-F0pn"
			], {
				encoding: "utf8",
				timeout: 5e3,
				maxBuffer: 4194304,
				env: resolveDiagnosticProcessEnv()
			});
			if (result.error || result.status !== 0 && result.status !== 1) return directories;
			const fields = result.stdout.split("\0");
			fields.pop();
			const ambiguous = /* @__PURE__ */ new Set();
			let pid;
			for (const raw of fields) {
				const field = raw.replace(/^\n/, "");
				if (field.startsWith("p")) {
					const candidate = /^p(\d+)$/.exec(field);
					pid = candidate && requested.has(Number(candidate[1])) ? Number(candidate[1]) : void 0;
				} else if (pid !== void 0 && field.startsWith("n") && path.isAbsolute(field.slice(1))) {
					if (directories.has(pid)) {
						directories.delete(pid);
						ambiguous.add(pid);
					} else if (!ambiguous.has(pid)) directories.set(pid, field.slice(1));
				}
			}
		}
	} catch {}
	return directories;
}
/** Generic script names identify OpenClaw only inside a verified package root. */
function classifyEntrypoint(args, opts = {}) {
	const exe = normalizeProcArg(args[0] ?? "").replace(/\.(bat|cmd|exe)$/i, "");
	if (!opts.requirePackageIdentity && (exe.endsWith("/openclaw") || exe === "openclaw")) return {
		kind: "openclaw",
		entryIndex: 0
	};
	const entryIndex = /(?:^|\/)openclaw\.mjs$/.test(exe) ? 0 : resolveRuntimeScriptPosition(args).position;
	if (typeof entryIndex !== "number") return entryIndex.kind === "unclassified" ? {
		kind: "unclassified",
		cause: "runtime-syntax",
		reason: entryIndex.reason
	} : { kind: "other" };
	const script = args[entryIndex];
	if (opts.inspectPackage && !opts.requirePackageIdentity && opts.cwd && path.isAbsolute(opts.cwd) && isBunRuntime(args[0] ?? "") && !/[\\/]/u.test(script) && !path.extname(script)) {
		const pkg = readProcessPackageIdentity(opts.cwd, true);
		const task = pkg.scripts[script];
		if (typeof task === "string" && task.trim()) return pkg.name === "openclaw" ? { kind: "openclaw" } : { kind: "other" };
	}
	const identity = classifyOpenClawEntrypointPath(script, opts);
	return identity.kind === "openclaw" ? {
		...identity,
		entryIndex
	} : identity;
}
/** Path evidence is shared with cleanup even when launcher syntax is unfamiliar. */
function classifyOpenClawEntrypointPath(script, opts = {}) {
	const normalized = normalizeProcArg(script);
	if (!opts.requirePackageIdentity && /(?:^|\/)openclaw\.mjs$/.test(normalized)) return { kind: "openclaw" };
	const entrypoints = [...ENTRY_CANDIDATES, ...opts.additionalEntrypoints ?? []];
	let scriptPath = script;
	if (!path.isAbsolute(script)) {
		const cwd = opts.cwd ?? (opts.pid === void 0 ? void 0 : readProcessWorkingDirectories([opts.pid]).get(opts.pid));
		if (!cwd || !path.isAbsolute(cwd)) return {
			kind: "unclassified",
			cause: "cwd",
			reason: "working directory is unavailable"
		};
		scriptPath = path.resolve(cwd, script);
	}
	let resolved;
	let directory;
	try {
		resolved = fsSync.realpathSync(scriptPath);
		if (opts.inspectPackage && !opts.requirePackageIdentity && referencesRetainedArtifact(resolved)) return { kind: "openclaw" };
		const stat = opts.requirePackageIdentity || opts.inspectPackage ? fsSync.statSync(resolved) : void 0;
		if (opts.requirePackageIdentity && !stat?.isFile()) return {
			kind: "unclassified",
			cause: "script",
			reason: `entrypoint is not a regular file: ${script}`
		};
		directory = stat?.isDirectory() ?? false;
	} catch {
		return {
			kind: "unclassified",
			cause: "script",
			reason: "could not resolve script"
		};
	}
	const resolvedNormalized = normalizeProcArg(resolved);
	const entry = directory ? void 0 : entrypoints.find((candidate) => resolvedNormalized.endsWith(`/${candidate}`));
	if (!entry && (!opts.inspectPackage || opts.requirePackageIdentity)) return { kind: "other" };
	const root = entry ? resolved.slice(0, -entry.length) : directory ? resolved : path.dirname(resolved);
	try {
		return readProcessPackageIdentity(root, !entry && !directory).name === "openclaw" ? {
			kind: "openclaw",
			...opts.requirePackageIdentity ? { packageIdentity: {
				root: path.resolve(root),
				entrypoint: resolved
			} } : {}
		} : { kind: "other" };
	} catch (error) {
		return {
			kind: "unclassified",
			cause: "package-identity",
			reason: error instanceof Error ? error.message : String(error)
		};
	}
}
/** One classification for process owners, command consumers, and diagnostics. */
function classifyOpenClawArgv(args, opts = {}) {
	const { command, owner, pid, port } = opts;
	if (!opts.requirePackageIdentity && command === "gateway" && owner?.pid === pid && owner?.state === "live" && (port === void 0 || owner.port === port)) return { kind: "openclaw" };
	const executable = normalizeProcArg(args[0] ?? "").split("/").at(-1)?.replace(/\.(exe|cmd|bat)$/, "") ?? "";
	if (!opts.requirePackageIdentity && /^openclaw-[a-z0-9-]+$/.test(executable)) return !command || executable === `openclaw-${command}` ? { kind: "openclaw" } : { kind: "other" };
	const identity = classifyEntrypoint(args, opts);
	if (command) return identity.kind === "openclaw" && normalizeProcArg(getRootOptionAwareCommandPath(["node", ...args.slice(identity.entryIndex)], 1)[0] ?? "") !== command ? { kind: "other" } : identity;
	if (identity.kind === "openclaw" || !opts.requirePackageIdentity && args.some((arg) => arg.replaceAll("\\", "/").split("/").some(isLegacyPluginSourceCaptureName))) return identity.kind === "openclaw" ? identity : { kind: "openclaw" };
	let marker = opts.serviceMarker;
	if (pid !== void 0 && process.platform === "linux" && (isNodeRuntime(executable) || isBunRuntime(executable) || executable === "tsx")) try {
		marker = fsSync.readFileSync(`/proc/${pid}/environ`, "utf8").split("\0").find((entry) => entry.startsWith("OPENCLAW_SERVICE_MARKER="))?.slice(24);
	} catch (error) {
		return {
			kind: "unclassified",
			cause: "service-marker",
			reason: `process identity inspection failed (${extractErrorCode(error) ?? "unavailable"})`
		};
	}
	return !opts.requirePackageIdentity && marker === "openclaw" ? { kind: "openclaw" } : identity;
}
//#endregion
export { referencesRetainedArtifact as a, readProcessWorkingDirectories as i, classifyOpenClawEntrypointPath as n, getRootOptionAwareCommandPath as o, readProcessPackageIdentity as r, parseWindowsNativeCommandLine as s, classifyOpenClawArgv as t };
