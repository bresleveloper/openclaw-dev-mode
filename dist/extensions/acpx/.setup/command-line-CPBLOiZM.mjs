//#region extensions/acpx/src/codex-adapter.ts
const CODEX_ACP_PACKAGE = "@agentclientprotocol/codex-acp";
const CODEX_ACP_BIN = "codex-acp";
const LEGACY_CODEX_ACP_PACKAGE = "@zed-industries/codex-acp";
const OPENCLAW_CODEX_CONFIG_ARG = "--openclaw-codex-config";
//#endregion
//#region extensions/acpx/src/command-line.ts
/** Match ACPX's persisted argv identity; scalar records keep their original bytes. */
function renderAgentCommand(command) {
	return typeof command === "string" ? command : command.map((part) => /^[A-Za-z0-9_@%+=:,./^~-]+$/.test(part) ? part : JSON.stringify(part)).join(" ");
}
/** Split a command string into argv-like parts using simple quote/backslash rules. */
function splitCommandParts(value) {
	if (Array.isArray(value)) return value;
	const windows = process.platform === "win32";
	const parts = [];
	let current = "";
	let quote = null;
	let escaping = false;
	let hasPart = false;
	for (const ch of value) {
		if (escaping) {
			current += ch;
			escaping = false;
			hasPart = true;
			continue;
		}
		if (ch === "\\" && quote !== "'" && !windows) {
			escaping = true;
			hasPart = true;
			continue;
		}
		if (windows && ch === "\"" && quote !== "'") {
			const backslashes = current.match(/\\+$/)?.[0].length ?? 0;
			current = current.slice(0, current.length - backslashes) + "\\".repeat(Math.floor(backslashes / 2));
			if (backslashes % 2 === 1) {
				current += "\"";
				continue;
			}
		}
		if (quote) {
			if (ch === quote) quote = null;
			else current += ch;
			continue;
		}
		if (ch === "'" || ch === "\"") {
			quote = ch;
			hasPart = true;
			continue;
		}
		if (/\s/.test(ch)) {
			if (hasPart) {
				parts.push(current);
				current = "";
				hasPart = false;
			}
			continue;
		}
		current += ch;
		hasPart = true;
	}
	if (escaping) current += "\\";
	if (quote) throw new Error("Invalid agent command: unterminated quote");
	if (hasPart) parts.push(current);
	return parts;
}
const OPENCLAW_BRIDGE_EXECUTABLE = "openclaw";
const OPENCLAW_BRIDGE_SUBCOMMAND = "acp";
function normalizeAgentName(value) {
	const normalized = value?.trim().toLowerCase();
	return normalized ? normalized : void 0;
}
function basename(value) {
	return value.split(/[\\/]/).pop() ?? value;
}
function isEnvAssignment(value) {
	return /^[A-Za-z_][A-Za-z0-9_]*=/.test(value);
}
function unwrapEnvCommand(parts) {
	const command = parts.at(0);
	if (!command || basename(command) !== "env") return parts;
	let index = 1;
	while (true) {
		const part = parts.at(index);
		if (!part || !isEnvAssignment(part)) break;
		index += 1;
	}
	return parts.slice(index);
}
function matchesExecutableName(value, executableName) {
	const normalized = basename(value).toLowerCase();
	return normalized === executableName || normalized === `${executableName}.exe`;
}
function matchesPackageSpec(value, packageName) {
	const normalized = value.trim().toLowerCase();
	return normalized === packageName || normalized.startsWith(`${packageName}@`);
}
function stripModuleExtension(value) {
	return value.replace(/\.[cm]?js$/i, "").toLowerCase();
}
function isAcpCommand(command, params) {
	if (!command) return false;
	const parts = unwrapEnvCommand(splitCommandParts(command));
	if (!parts.length) return false;
	if (parts.some((part) => matchesPackageSpec(part, params.packageName))) return true;
	const commandName = basename(parts[0] ?? "");
	if (matchesExecutableName(commandName, params.executableName)) return true;
	if (!matchesExecutableName(commandName, "node")) return false;
	const scriptName = stripModuleExtension(basename(parts[1] ?? ""));
	return scriptName === params.executableName || scriptName === `${params.executableName}-wrapper`;
}
function isOpenClawBridgeCommand(command) {
	if (!command) return false;
	const parts = unwrapEnvCommand(splitCommandParts(command));
	if (basename(parts[0] ?? "") === OPENCLAW_BRIDGE_EXECUTABLE) return parts[1] === OPENCLAW_BRIDGE_SUBCOMMAND;
	if (basename(parts[0] ?? "") !== "node") return false;
	const scriptName = basename(parts[1] ?? "");
	return /^openclaw(?:\.[cm]?js)?$/i.test(scriptName) && parts[2] === OPENCLAW_BRIDGE_SUBCOMMAND;
}
function isCodexAcpCommand(command) {
	return isAcpCommand(command, {
		packageName: CODEX_ACP_PACKAGE,
		executableName: "codex-acp"
	});
}
function isClaudeAcpCommand(command) {
	return isAcpCommand(command, {
		packageName: "@agentclientprotocol/claude-agent-acp",
		executableName: "claude-agent-acp"
	});
}
function resolveAgentCommand(params) {
	const normalizedAgentName = normalizeAgentName(params.agentName);
	if (!normalizedAgentName) return;
	return splitCommandParts(params.agentRegistry.resolve(normalizedAgentName));
}
//#endregion
export { renderAgentCommand as a, CODEX_ACP_BIN as c, OPENCLAW_CODEX_CONFIG_ARG as d, normalizeAgentName as i, CODEX_ACP_PACKAGE as l, isCodexAcpCommand as n, resolveAgentCommand as o, isOpenClawBridgeCommand as r, splitCommandParts as s, isClaudeAcpCommand as t, LEGACY_CODEX_ACP_PACKAGE as u };
