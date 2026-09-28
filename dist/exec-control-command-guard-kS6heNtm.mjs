import "./src-CZ2wJvNB.mjs";
import { t as expectDefined } from "./expect-lbe3Hgrh.mjs";
import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import { d as normalizeStringEntries } from "./string-normalization-_gRhJUDw.mjs";
import { n as resolvePathViaExistingAncestorSync } from "./boundary-path-BzetEUdq.mjs";
import { r as isPathInside } from "./path-guards-D5kuI0Tv.mjs";
import { r as splitShellArgs } from "./shell-argv-DE1kujuY.mjs";
import { n as buildCommandPayloadCandidates, t as buildCommandPayloadArgvCandidates } from "./risks-HzTsadnl.mjs";
import { n as explainShellCommand, t as CommandExplanationWorkLimitError } from "./extract-BVuxTK6I.mjs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import os from "node:os";
//#region src/infra/exec-control-command-guard.ts
const SQLITE_OPTIONS_WITH_VALUES = /* @__PURE__ */ new Map([
	["cmd", 1],
	["escape", 1],
	["heap", 1],
	["init", 1],
	["lookaside", 2],
	["maxsize", 1],
	["mmap", 1],
	["newline", 1],
	["nonce", 1],
	["nullvalue", 1],
	["pagecache", 2],
	["separator", 1],
	["vfs", 1]
]);
const SQLITE_OPEN_OPTIONS_WITH_VALUES = /* @__PURE__ */ new Map([
	["hexkey", 1],
	["key", 1],
	["maxsize", 1],
	["textkey", 1]
]);
function parseExecApprovalShellCommand(raw) {
	const match = raw.trimStart().match(/^\/approve(?:@[^\s]+)?\s+([A-Za-z0-9][A-Za-z0-9._:-]*)\s+(allow-once|allow-always|always|deny)\b/i);
	if (!match) return null;
	return {
		approvalId: expectDefined(match[1], "exec control command guard regex capture 1"),
		decision: normalizeLowercaseStringOrEmpty(match[2]) === "always" ? "allow-always" : normalizeLowercaseStringOrEmpty(match[2])
	};
}
function normalizeCommandBaseName(token) {
	if (!token) return "";
	return normalizeLowercaseStringOrEmpty(token.split(/[\\/]/u).at(-1)).replace(/\.(?:cmd|exe)$/u, "");
}
function stripOpenClawPackageRunner(argv) {
	const commandName = normalizeCommandBaseName(argv[0]);
	if (commandName === "openclaw") return argv;
	if ((commandName === "pnpm" || commandName === "npm" || commandName === "yarn") && normalizeCommandBaseName(argv[1]) === "openclaw") return argv.slice(1);
	if ((commandName === "pnpm" || commandName === "npm" || commandName === "yarn") && (argv[1] === "exec" || argv[1] === "dlx" || argv[1] === "run") && normalizeCommandBaseName(argv[2]) === "openclaw") return argv.slice(2);
	if (commandName === "npx" || commandName === "bunx") {
		let idx = 1;
		while (idx < argv.length) {
			const token = expectDefined(argv[idx], "argv entry at idx");
			if (token === "--") {
				idx += 1;
				break;
			}
			if (!token.startsWith("-") || token === "-") break;
			idx += 1;
			if ((token === "-p" || token === "--package") && idx < argv.length) idx += 1;
		}
		if (normalizeCommandBaseName(argv[idx]) === "openclaw") return argv.slice(idx);
	}
	return argv;
}
function parseOpenClawChannelsLoginShellCommand(raw) {
	const argv = splitShellArgs(raw);
	if (!argv) return false;
	const openclawArgv = stripOpenClawPackageRunner(argv);
	return normalizeCommandBaseName(openclawArgv[0]) === "openclaw" && (openclawArgv[1] === "channels" || openclawArgv[1] === "channel") && openclawArgv[2] === "login";
}
function parseSqliteOpenCommandDatabaseToken(command) {
	const argv = splitShellArgs(command);
	if (!argv || !/^\.op(?:e(?:n)?)?$/u.test(argv[0] ?? "")) return null;
	for (let index = 1; index < argv.length; index += 1) {
		const token = expectDefined(argv[index], "sqlite3 .open argv entry");
		if (token === "--") return argv[index + 1] ?? null;
		if (token === "-" || !token.startsWith("-")) return token;
		const optionName = token.replace(/^-+/u, "").split("=", 1)[0]?.toLowerCase() ?? "";
		if (!token.includes("=")) index += SQLITE_OPEN_OPTIONS_WITH_VALUES.get(optionName) ?? 0;
	}
	return null;
}
function parseSqliteDatabaseTokens(argv) {
	if (normalizeCommandBaseName(argv[0]) !== "sqlite3") return [];
	const databaseTokens = [];
	const commandTokens = [];
	for (let index = 1; index < argv.length; index += 1) {
		const token = expectDefined(argv[index], "sqlite3 argv entry");
		if (token === "--") {
			const databaseToken = argv[index + 1];
			if (databaseToken) databaseTokens.push(databaseToken);
			commandTokens.push(...argv.slice(index + 2));
			break;
		}
		if (token === "-" || !token.startsWith("-")) {
			databaseTokens.push(token);
			commandTokens.push(...argv.slice(index + 1));
			break;
		}
		const optionName = token.replace(/^-+/u, "").split("=", 1)[0]?.toLowerCase() ?? "";
		if (optionName === "cmd") {
			const commandToken = token.includes("=") ? token.slice(token.indexOf("=") + 1) : argv[index + 1];
			if (commandToken) commandTokens.push(commandToken);
		}
		if (!token.includes("=")) index += SQLITE_OPTIONS_WITH_VALUES.get(optionName) ?? 0;
	}
	for (const commandToken of commandTokens) {
		const databaseToken = parseSqliteOpenCommandDatabaseToken(commandToken);
		if (databaseToken) databaseTokens.push(databaseToken);
	}
	return databaseTokens;
}
function expandSqliteDatabaseToken(token, stateDir) {
	let expanded = token.trim();
	if (!expanded || expanded === ":memory:") return null;
	const stateVariable = expanded.match(/^\$(?:OPENCLAW_STATE_DIR|\{OPENCLAW_STATE_DIR\})(?=$|[\\/])/u);
	if (stateVariable) expanded = `${stateDir}${expanded.slice(stateVariable[0].length)}`;
	const homeVariable = expanded.match(/^\$(?:HOME|\{HOME\})(?=$|[\\/])/u);
	if (homeVariable) expanded = `${os.homedir()}${expanded.slice(homeVariable[0].length)}`;
	if (expanded === "~" || expanded.startsWith("~/") || expanded.startsWith("~\\")) expanded = path.join(os.homedir(), expanded.slice(2));
	if (expanded.toLowerCase().startsWith("file:")) try {
		expanded = fileURLToPath(expanded);
	} catch {
		const filename = expanded.slice(5).split(/[?#]/u, 1)[0];
		if (!filename) return null;
		try {
			expanded = decodeURIComponent(filename);
		} catch {
			expanded = filename;
		}
	}
	return expanded;
}
function targetsLiveStateSqliteDatabase(argv, context) {
	const stateDir = context.stateDir?.trim();
	if (!stateDir) return false;
	const canonicalStateDir = resolvePathViaExistingAncestorSync(stateDir);
	return parseSqliteDatabaseTokens(argv).some((databaseToken) => {
		const expandedTarget = expandSqliteDatabaseToken(databaseToken, stateDir);
		if (!expandedTarget) return false;
		const targetPath = path.isAbsolute(expandedTarget) ? expandedTarget : path.resolve(context.workdir ?? process.cwd(), expandedTarget);
		const canonicalTarget = resolvePathViaExistingAncestorSync(targetPath);
		return canonicalTarget === canonicalStateDir || isPathInside(canonicalStateDir, canonicalTarget);
	});
}
async function detectUnsafeExecControlShellCommand(command, context = {}) {
	const rawCommand = command.trim();
	let explanation = null;
	try {
		explanation = await explainShellCommand(rawCommand);
	} catch (error) {
		if (error instanceof CommandExplanationWorkLimitError) return "incomplete-analysis";
	}
	const { controlCandidates, argvCandidates } = (() => {
		if (explanation?.ok) {
			const commands = [...explanation.topLevelCommands, ...explanation.nestedCommands];
			return {
				controlCandidates: commands.flatMap((step) => buildCommandPayloadCandidates(step.argv)),
				argvCandidates: commands.flatMap((step) => buildCommandPayloadArgvCandidates(step.argv))
			};
		}
		const fallbackArgv = normalizeStringEntries(rawCommand.split(/\r?\n/)).map((line) => {
			return {
				argv: splitShellArgs(line),
				line
			};
		});
		return {
			controlCandidates: fallbackArgv.flatMap(({ argv, line }) => argv ? buildCommandPayloadCandidates(argv) : [line]),
			argvCandidates: fallbackArgv.flatMap(({ argv, line }) => argv ? buildCommandPayloadArgvCandidates(argv) : [[line]])
		};
	})();
	for (const candidate of controlCandidates) {
		if (parseExecApprovalShellCommand(candidate)) return "approve";
		if (parseOpenClawChannelsLoginShellCommand(candidate)) return "channel-login";
	}
	for (const candidateArgv of argvCandidates) if (targetsLiveStateSqliteDatabase(candidateArgv, context)) return "live-state-sqlite";
	return null;
}
function rejectIncompleteCommandAnalysis(unsafeKind) {
	if (unsafeKind === "incomplete-analysis") throw new Error("exec cannot run a shell command that exceeds the command explanation work limit. Simplify the command so its complete syntax can be inspected before execution.");
}
async function rejectUnsafeExecControlShellCommand(command) {
	const unsafeKind = await detectUnsafeExecControlShellCommand(command);
	rejectIncompleteCommandAnalysis(unsafeKind);
	if (unsafeKind === "approve") throw new Error(["exec cannot run /approve commands.", "Show the /approve command to the user as chat text, or route it through the approval command handler instead of shell execution."].join(" "));
	if (unsafeKind === "channel-login") throw new Error(["exec cannot run interactive OpenClaw channel login commands.", "Run `openclaw channels login` in a terminal on the gateway host, or use the channel-specific login agent tool when available (for WhatsApp: `whatsapp_login`)."].join(" "));
}
async function rejectUnsafeExecLiveStateSqliteShellCommand(command, context) {
	const unsafeKind = await detectUnsafeExecControlShellCommand(command, context);
	rejectIncompleteCommandAnalysis(unsafeKind);
	if (unsafeKind !== "live-state-sqlite") return;
	throw new Error(["external sqlite3 cannot open databases under the active OpenClaw state directory.", "Use OpenClaw commands for live state, or inspect a private backup copy outside `OPENCLAW_STATE_DIR`."].join(" "));
}
//#endregion
export { rejectUnsafeExecControlShellCommand as n, rejectUnsafeExecLiveStateSqliteShellCommand as r, detectUnsafeExecControlShellCommand as t };
