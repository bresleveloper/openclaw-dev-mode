import { createRequire } from "node:module";
import path from "node:path";
//#region extensions/codex/src/app-server/launch-args.ts
const CODEX_VALUE_OPTIONS = /* @__PURE__ */ new Set([
	"-m",
	"--model",
	"--local-provider",
	"-p",
	"--profile",
	"-s",
	"--sandbox",
	"-a",
	"--ask-for-approval",
	"-C",
	"--cd",
	"--add-dir",
	"--remote",
	"--remote-auth-token-env",
	"-c",
	"--config",
	"--enable",
	"--disable",
	"--listen",
	"--sock",
	"--code-mode-host",
	"--ws-auth",
	"--ws-token-file",
	"--ws-token-sha256",
	"--ws-shared-secret-file",
	"--ws-issuer",
	"--ws-audience",
	"--ws-max-clock-skew-seconds"
]);
/** One tokenization owner for launch, turn policy, reviewer trust, and private turns. */
function readCodexArgs(args) {
	const tokens = [];
	let nativeSubcommand = false;
	let end = 0;
	for (const [index, arg] of args.entries()) {
		if (index < end) continue;
		end = index + 1;
		const attached = /^(--[^=]+)=([\s\S]*)$/u.exec(arg) ?? /^(-[cmpisaC])=?([\s\S]+)$/u.exec(arg);
		const name = attached?.[1] ?? arg;
		let value = attached?.[2];
		if (name === "-i" || name === "--image") while (args[end]?.startsWith("-") === false) end += 1;
		else if (!attached && CODEX_VALUE_OPTIONS.has(name)) {
			value = args[end];
			if (value !== void 0) end += 1;
		}
		tokens.push({
			index,
			end,
			name,
			value
		});
		if (name === "app-server") nativeSubcommand = true;
		if (name === "--" && nativeSubcommand) break;
	}
	return tokens;
}
/** Uses the native CLI configuration for status without starting its transport. */
function buildCodexLoginStatusArgs(args) {
	const options = /* @__PURE__ */ new Set([
		"-c",
		"--config",
		"-p",
		"--profile",
		"--enable",
		"--disable"
	]);
	const tokens = readCodexArgs(args);
	const subcommandIndex = tokens.findLast(({ name }) => name === "app-server")?.index ?? -1;
	const prefix = subcommandIndex < 0 ? [] : args.slice(0, subcommandIndex);
	const configArgs = tokens.filter(({ index, name }) => index > subcommandIndex && options.has(name)).flatMap(({ index, end }) => args.slice(index, end));
	return [
		...prefix,
		...configArgs,
		"login",
		"status"
	];
}
function readCodexAppServerConfigOptions(args) {
	return readCodexArgs(args).filter(({ name }) => name === "-c" || name === "--config" || name === "-p" || name === "--profile");
}
const NODE_LAUNCH_VALUE_OPTIONS = /* @__PURE__ */ new Set([
	"-r",
	"--require",
	"--import",
	"--loader",
	"--experimental-loader",
	"--max-old-space-size",
	"--max-semi-space-size",
	"--stack-size"
]);
const NODE_LAUNCH_FLAGS = /* @__PURE__ */ new Set([
	"--enable-source-maps",
	"--no-warnings",
	"--trace-warnings",
	"--trace-uncaught",
	"--no-deprecation",
	"--trace-deprecation",
	"--experimental-strip-types",
	"--experimental-transform-types",
	"--no-experimental-strip-types",
	"--use-strict",
	"--expose-gc"
]);
function resolveNodeLauncherModule(value, option, cwd) {
	if (path.isAbsolute(value)) return value;
	if (/^\.{1,2}[\\/]/u.test(value)) return path.resolve(cwd, value);
	if (option === "-r" || option === "--require") return createRequire(path.join(cwd, "openclaw-codex-launcher.cjs")).resolve(value);
	if (/^(?:file|data|node):/u.test(value)) return value;
	throw new Error("Private Codex turns require an absolute or relative file path for ESM preloads");
}
/** Separates a supported launcher from native flags before a private turn sanitizes them. */
function resolveCodexPrivateLauncher(params) {
	const launcherArgs = [];
	let nativeArgs = [...params.args];
	const executable = params.command.split(/[\\/]/u).at(-1)?.toLowerCase();
	if (executable && [
		"node",
		"node.exe",
		"nodejs",
		"nodejs.exe"
	].includes(executable)) {
		let index = 0;
		while (params.args[index]?.startsWith("-")) {
			const raw = params.args[index];
			index += 1;
			if (raw === "--") {
				launcherArgs.push(raw);
				break;
			}
			const attached = /^(--[^=]+)=([\s\S]*)$/u.exec(raw) ?? /^(-r)([\s\S]+)$/u.exec(raw);
			const name = attached?.[1] ?? raw;
			const normalizedName = name.replaceAll("_", "-");
			if (NODE_LAUNCH_VALUE_OPTIONS.has(normalizedName)) {
				const value = attached?.[2] ?? params.args[index++];
				if (value === void 0 || !value.trim()) throw new Error("Private Codex turns received a Node launcher option without its value");
				const moduleOption = [
					"-r",
					"--require",
					"--import",
					"--loader",
					"--experimental-loader"
				].includes(normalizedName);
				if (attached && !moduleOption) launcherArgs.push(raw);
				else launcherArgs.push(name, moduleOption ? resolveNodeLauncherModule(value, normalizedName, path.resolve(params.cwd)) : value);
			} else if (!attached && NODE_LAUNCH_FLAGS.has(name)) launcherArgs.push(raw);
			else throw new Error(`Private Codex turns cannot isolate unsupported Node launcher option ${name}`);
		}
		const script = params.args[index];
		if (!script) throw new Error("Private Codex turns require a Node wrapper script");
		launcherArgs.push(path.resolve(params.cwd, script));
		nativeArgs = params.args.slice(index + 1);
		if (!readCodexArgs(nativeArgs).some(({ name }) => name === "app-server")) throw new Error("Private Codex turns require a native app-server command after the Node wrapper");
	}
	if (executable && /^(?:(?:ba|da|z|fi)?sh|python(?:\d+(?:\.\d+)*)?|ruby|perl|cmd|powershell|pwsh)(?:\.exe)?$/u.test(executable)) throw new Error("Private Codex turns cannot isolate inline or interpreted wrappers; use a Node script or a directly executable wrapper");
	const tokens = readCodexArgs(nativeArgs);
	const serverIndex = tokens.findLast(({ name }) => name === "app-server")?.index ?? nativeArgs.length;
	if (tokens.some(({ index, name }) => index < serverIndex && (!name.startsWith("-") || name === "--"))) throw new Error("Private Codex turns cannot isolate this launcher prefix; use a Node script or a directly executable wrapper");
	return {
		launcherArgs,
		nativeArgs
	};
}
/** The stdio proxy forwards to an external server; it does not own that runtime. */
function isCodexAppServerProxyLaunch(args) {
	const tokens = readCodexArgs(args);
	const server = tokens.findLastIndex(({ name }) => name === "app-server");
	return server >= 0 && tokens.slice(server + 1).find(({ name }) => !name.startsWith("-"))?.name === "proxy";
}
/** Keeps Codex overrides in one CLI scope without rewriting raw TOML or wrapper prefixes. */
function normalizeCodexAppServerArgs(rawArgs, enforcedOverride) {
	const tokens = readCodexArgs(rawArgs);
	const subcommandIndex = tokens.findLast(({ name }) => name === "app-server")?.index ?? -1;
	const prefix = subcommandIndex < 0 ? [...rawArgs] : rawArgs.slice(0, subcommandIndex);
	const suffix = [];
	if (subcommandIndex >= 0) for (const token of tokens) {
		if (token.index <= subcommandIndex) continue;
		if (token.name === "--") {
			suffix.push(...rawArgs.slice(token.index));
			break;
		}
		(token.name === "-c" || token.name === "--config" ? prefix : suffix).push(...rawArgs.slice(token.index, token.end));
	}
	if (enforcedOverride && !(prefix.at(-2) === "-c" && prefix.at(-1) === enforcedOverride)) prefix.push("-c", enforcedOverride);
	const normalized = subcommandIndex < 0 ? prefix : [
		...prefix,
		"app-server",
		...suffix
	];
	return normalized.length === rawArgs.length && normalized.every((arg, index) => arg === rawArgs[index]) ? rawArgs : normalized;
}
//#endregion
export { resolveCodexPrivateLauncher as a, readCodexAppServerConfigOptions as i, isCodexAppServerProxyLaunch as n, normalizeCodexAppServerArgs as r, buildCodexLoginStatusArgs as t };
