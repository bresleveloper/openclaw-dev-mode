import { t as resolveAcpxSessionResource } from "./session-resource-BaJ6bs5d.mjs";
import { i as toAcpMcpServers, n as resolveAcpxPluginRoot, r as resolveOpenClawRoot, t as resolveAcpxPluginConfig } from "./config-CdPsIued.mjs";
import { a as renderAgentCommand, c as CODEX_ACP_BIN, d as OPENCLAW_CODEX_CONFIG_ARG, i as normalizeAgentName, l as CODEX_ACP_PACKAGE, n as isCodexAcpCommand, o as resolveAgentCommand, r as isOpenClawBridgeCommand, s as splitCommandParts, t as isClaudeAcpCommand, u as LEGACY_CODEX_ACP_PACKAGE } from "./command-line-CPBLOiZM.mjs";
import { a as hashAcpxProcessCommand, c as openAcpxProcessLeaseStateStore, d as ACPX_GATEWAY_INSTANCE_KEY, f as ACPX_GATEWAY_INSTANCE_NAMESPACE, h as normalizeAcpxGatewayInstanceRecord, i as createAcpxProcessLeaseStore, l as readAcpxProcessLeaseIdentity, n as OPENCLAW_ACPX_LEASE_ID_ARG, r as OPENCLAW_GATEWAY_INSTANCE_ID_ARG, t as ACPX_PROBE_LEASE_SESSION_KEY, u as withAcpxLeaseArgs } from "./process-lease-C3dNPtu8.mjs";
import { AcpRuntimeError } from "../runtime-api.js";
import { createRequire } from "node:module";
import { AcpxRuntime, createAgentRegistry, createFileSessionStore, decodeAcpxRuntimeHandleState, isRequestedModelUnsupportedError } from "acpx/runtime";
import { finiteSecondsToTimerSafeMilliseconds, parseStrictPositiveInteger } from "openclaw/plugin-sdk/number-runtime";
import fs from "node:fs";
import path, { resolve } from "node:path";
import { isRecord, normalizeLowercaseStringOrEmpty, normalizeStringEntries } from "openclaw/plugin-sdk/string-coerce-runtime";
import os, { availableParallelism } from "node:os";
import fs$1 from "node:fs/promises";
import { randomUUID } from "node:crypto";
import { formatErrorMessage } from "openclaw/plugin-sdk/error-runtime";
import { escapeRegExp, sliceUtf16Safe } from "openclaw/plugin-sdk/text-utility-runtime";
import { readJsonFileWithFallback } from "openclaw/plugin-sdk/json-store";
import { parse, stringify } from "smol-toml";
import { isPidAlive, runExec } from "openclaw/plugin-sdk/process-runtime";
import { AsyncLocalStorage } from "node:async_hooks";
import { isDeepStrictEqual } from "node:util";
import { redactSensitiveText } from "openclaw/plugin-sdk/security-runtime";
import { KeyedAsyncQueue } from "openclaw/plugin-sdk/keyed-async-queue";
//#region extensions/acpx/src/codex-trust-config.ts
/**
* Builds isolated Codex config for ACPX sessions. It preserves safe inherited
* runtime options while rendering only trusted project entries for the session.
*/
function stripTomlComment(line) {
	let quote = null;
	let escaping = false;
	for (let index = 0; index < line.length; index += 1) {
		const ch = line[index];
		if (escaping) {
			escaping = false;
			continue;
		}
		if (quote === "\"" && ch === "\\") {
			escaping = true;
			continue;
		}
		if (quote) {
			if (ch === quote) quote = null;
			continue;
		}
		if (ch === "'" || ch === "\"") {
			quote = ch;
			continue;
		}
		if (ch === "#") return line.slice(0, index);
	}
	return line;
}
function parseTomlString(value) {
	const trimmed = value.trim();
	if (trimmed.startsWith("\"") && trimmed.endsWith("\"")) try {
		return JSON.parse(trimmed);
	} catch {
		return;
	}
	if (trimmed.startsWith("'") && trimmed.endsWith("'")) return trimmed.slice(1, -1);
}
function parseTomlDottedKey(value) {
	const parts = [];
	let current = "";
	let quote = null;
	let escaping = false;
	for (const ch of value.trim()) {
		if (escaping) {
			current += ch;
			escaping = false;
			continue;
		}
		if (quote === "\"" && ch === "\\") {
			current += ch;
			escaping = true;
			continue;
		}
		if (quote) {
			current += ch;
			if (ch === quote) quote = null;
			continue;
		}
		if (ch === "'" || ch === "\"") {
			quote = ch;
			current += ch;
			continue;
		}
		if (ch === ".") {
			parts.push(current.trim());
			current = "";
			continue;
		}
		current += ch;
	}
	if (current.trim()) parts.push(current.trim());
	return parts.map((part) => parseTomlString(part) ?? part);
}
function parseProjectHeader(line) {
	const trimmed = line.trim();
	if (!trimmed.startsWith("[") || !trimmed.endsWith("]") || trimmed.startsWith("[[")) return;
	const parts = parseTomlDottedKey(trimmed.slice(1, -1));
	return parts.length === 2 && parts[0] === "projects" ? parts[1] : void 0;
}
function parseTrustedInlineProjectEntries(value) {
	const trusted = [];
	for (const match of value.matchAll(/(?<key>"(?:\\.|[^"\\])*"|'[^']*'|[A-Za-z0-9_\-/.~:]+)\s*=\s*\{(?<body>[^{}]*(?:\{[^{}]*\}[^{}]*)*)\}/g)) {
		const key = match.groups?.key;
		const body = match.groups?.body;
		if (!key || !body || !/\btrust_level\s*=\s*["']trusted["']/.test(body)) continue;
		const projectPath = parseTomlString(key) ?? key.trim();
		if (projectPath) trusted.push(projectPath);
	}
	return trusted;
}
/** Extract trusted project paths from Codex TOML config. */
function extractTrustedCodexProjectPaths(configToml) {
	const trusted = /* @__PURE__ */ new Set();
	let currentProjectPath;
	let inProjectsTable = false;
	for (const rawLine of configToml.split(/\r?\n/)) {
		const line = stripTomlComment(rawLine).trim();
		if (!line) continue;
		if (line.startsWith("[")) {
			currentProjectPath = parseProjectHeader(line);
			inProjectsTable = line === "[projects]";
			continue;
		}
		if (currentProjectPath && /^trust_level\s*=\s*["']trusted["']\s*$/.test(line)) {
			trusted.add(currentProjectPath);
			continue;
		}
		const assignment = /^(?<key>"(?:\\.|[^"\\])*"|'[^']*'|[A-Za-z0-9_\-/.~:]+)\s*=\s*(?<value>.+)$/.exec(line);
		const rawKey = assignment?.groups?.key;
		const rawValue = assignment?.groups?.value;
		if (!rawKey || rawValue === void 0) continue;
		const key = parseTomlString(rawKey) ?? rawKey;
		const value = rawValue.trim();
		if (inProjectsTable && /^\{.*\}$/.test(value)) {
			if (/\btrust_level\s*=\s*["']trusted["']/.test(value) && key) trusted.add(key);
			continue;
		}
		if (key === "projects" || inProjectsTable) for (const projectPath of parseTrustedInlineProjectEntries(value)) trusted.add(projectPath);
	}
	return Array.from(trusted);
}
const INHERITED_TOP_LEVEL_CODEX_CONFIG_KEYS = /* @__PURE__ */ new Set([
	"model",
	"model_provider",
	"model_reasoning_effort",
	"sandbox_mode"
]);
const INHERITED_MODEL_PROVIDER_CONFIG_KEYS = /* @__PURE__ */ new Set([
	"name",
	"base_url",
	"wire_api",
	"env_key",
	"env_key_instructions",
	"requires_openai_auth",
	"request_max_retries",
	"stream_max_retries",
	"stream_idle_timeout_ms"
]);
function parseTableHeader(line) {
	const trimmed = line.trim();
	if (!trimmed.startsWith("[") || !trimmed.endsWith("]") || trimmed.startsWith("[[")) return;
	return parseTomlDottedKey(trimmed.slice(1, -1));
}
function isInheritedModelProviderTable(parts) {
	return parts?.[0] === "model_providers" && parts.length === 2;
}
function parseTopLevelAssignmentKey(line) {
	return /^(?<key>[A-Za-z0-9_-]+)\s*=\s*(?<value>.+)$/.exec(line)?.groups?.key;
}
function extractInheritedCodexRuntimeConfig(configToml) {
	const inheritedLines = [];
	let inAnyTable = false;
	let inInheritedTable = false;
	let pendingInheritedTableHeader = "";
	function flushInheritedTableHeader() {
		if (!pendingInheritedTableHeader) return;
		if (inheritedLines.length > 0 && inheritedLines[inheritedLines.length - 1] !== "") inheritedLines.push("");
		inheritedLines.push(pendingInheritedTableHeader);
		pendingInheritedTableHeader = "";
	}
	for (const rawLine of configToml.split(/\r?\n/)) {
		const trimmedLine = rawLine.trim();
		const semanticLine = stripTomlComment(rawLine).trim();
		if (trimmedLine.startsWith("[")) {
			const tableParts = parseTableHeader(trimmedLine);
			inAnyTable = true;
			inInheritedTable = isInheritedModelProviderTable(tableParts);
			if (inInheritedTable) pendingInheritedTableHeader = rawLine.trimEnd();
			else pendingInheritedTableHeader = "";
			continue;
		}
		if (inInheritedTable) {
			if (!semanticLine) continue;
			const key = parseTopLevelAssignmentKey(semanticLine);
			if (!key || !INHERITED_MODEL_PROVIDER_CONFIG_KEYS.has(key)) continue;
			flushInheritedTableHeader();
			inheritedLines.push(rawLine.trimEnd());
			continue;
		}
		if (inAnyTable) continue;
		const key = parseTopLevelAssignmentKey(semanticLine);
		if (!key) continue;
		if (!INHERITED_TOP_LEVEL_CODEX_CONFIG_KEYS.has(key)) continue;
		inheritedLines.push(rawLine.trimEnd());
	}
	while (inheritedLines.length > 0 && inheritedLines[inheritedLines.length - 1] === "") inheritedLines.pop();
	return inheritedLines.join("\n");
}
/** Render a session-local Codex config with inherited runtime settings and trust entries. */
function renderIsolatedCodexConfig(params) {
	const normalized = Array.from(new Set(params.projectPaths.map((projectPath) => projectPath.trim()).filter(Boolean).map((projectPath) => path.resolve(projectPath)))).toSorted((left, right) => left.localeCompare(right));
	return [
		"# Generated by OpenClaw for Codex ACP sessions.",
		params.sourceConfigToml ? extractInheritedCodexRuntimeConfig(params.sourceConfigToml) : "",
		...normalized.flatMap((projectPath) => [
			"",
			`[projects.${JSON.stringify(projectPath)}]`,
			"trust_level = \"trusted\""
		]),
		""
	].filter((line, index, lines) => !(line === "" && lines[index - 1] === "")).join("\n");
}
//#endregion
//#region extensions/acpx/src/codex-auth-bridge.ts
/**
* Prepares isolated Codex and Claude ACP wrapper commands for ACPX. The bridge
* copies safe auth/config state into plugin-owned homes and redacts diagnostics.
*/
const CLAUDE_ACP_PACKAGE = "@agentclientprotocol/claude-agent-acp";
const CLAUDE_ACP_BIN = "claude-agent-acp";
const RUN_CONFIGURED_COMMAND_SENTINEL = "--openclaw-run-configured";
const requireFromHere$1 = createRequire(import.meta.url);
function readSelfManifest() {
	const manifestPath = path.join(resolveAcpxPluginRoot(import.meta.url), "package.json");
	return JSON.parse(fs.readFileSync(manifestPath, "utf8"));
}
function readManifestDependencyVersion(packageName) {
	const version = readSelfManifest().dependencies?.[packageName];
	if (typeof version !== "string" || version.trim() === "") throw new Error(`Missing ${packageName} dependency version in @openclaw/acpx manifest`);
	return version;
}
const CODEX_ACP_PACKAGE_VERSION = readManifestDependencyVersion(CODEX_ACP_PACKAGE);
const CLAUDE_ACP_PACKAGE_VERSION = readManifestDependencyVersion(CLAUDE_ACP_PACKAGE);
function basename(value) {
	return value.split(/[\\/]/).pop() ?? value;
}
function resolvePackageBinPath(packageJsonPath, manifest, binName) {
	const { bin } = manifest;
	const relativeBinPath = typeof bin === "string" ? bin : bin && typeof bin === "object" ? bin[binName] : void 0;
	if (typeof relativeBinPath !== "string" || relativeBinPath.trim() === "") return;
	return path.resolve(path.dirname(packageJsonPath), relativeBinPath);
}
async function resolveInstalledAcpPackageBinPath(packageName, binName) {
	try {
		const packageJsonPath = requireFromHere$1.resolve(`${packageName}/package.json`);
		const { value: manifest } = await readJsonFileWithFallback(packageJsonPath, {});
		if (manifest.name !== packageName) return;
		const binPath = resolvePackageBinPath(packageJsonPath, manifest, binName);
		if (!binPath) return;
		await fs$1.access(binPath);
		return binPath;
	} catch {
		return;
	}
}
async function resolveInstalledCodexAcpBinPath() {
	return await resolveInstalledAcpPackageBinPath(CODEX_ACP_PACKAGE, CODEX_ACP_BIN);
}
async function resolveInstalledClaudeAcpBinPath() {
	return await resolveInstalledAcpPackageBinPath(CLAUDE_ACP_PACKAGE, CLAUDE_ACP_BIN);
}
const DIAGNOSTIC_REDACTION_RULES = [
	{
		source: String.raw`(authorization\s*[:=]\s*bearer\s+)[^\s'"<>]+`,
		flags: "gi",
		replacement: "$1[REDACTED]"
	},
	{
		source: String.raw`((?:api[_-]?key|apiKey|access[_-]?token|refresh[_-]?token|client[_-]?secret|token|secret|password|passwd|credential)\s*[:=]\s*)[^\s'"<>]+`,
		flags: "gi",
		replacement: "$1[REDACTED]"
	},
	{
		source: String.raw`("(?:apiKey|token|secret|password|passwd|accessToken|refreshToken)"\s*:\s*")[^"]+`,
		flags: "g",
		replacement: "$1[REDACTED]"
	},
	{
		source: String.raw`(["']?(?:api[-_]?key|apiKey|access[-_]?token|accessToken|refresh[-_]?token|refreshToken|id[-_]?token|idToken|auth[-_]?token|authToken|client[-_]?secret|clientSecret|app[-_]?secret|appSecret|token|secret|password|passwd|credential)["']?\s*[:=]\s*["']?)[^"',}\s<>]+`,
		flags: "gi",
		replacement: "$1[REDACTED]"
	},
	{
		source: String.raw`([?&](?:access[-_]?token|auth[-_]?token|refresh[-_]?token|api[-_]?key|client[-_]?secret|token|key|secret|password|pass|passwd|auth|signature)=)[^&\s'"<>]+`,
		flags: "gi",
		replacement: "$1[REDACTED]"
	},
	{
		source: String.raw`(--(?:api[-_]?key|token|secret|password|passwd)\s+)[^\s'"]+`,
		flags: "gi",
		replacement: "$1[REDACTED]"
	},
	{
		source: String.raw`-----BEGIN [A-Z ]*PRI` + String.raw`VATE KEY-----[\s\S]+?-----END [A-Z ]*PRI` + String.raw`VATE KEY-----`,
		flags: "g",
		replacement: "[REDACTED_PRIVATE_KEY]"
	},
	{
		source: String.raw`\b(sk-[A-Za-z0-9_-]{8,})\b`,
		flags: "g",
		replacement: "[REDACTED_OPENAI_KEY]"
	},
	{
		source: String.raw`\b(gh[pousr]_[A-Za-z0-9_]{20,})\b`,
		flags: "g",
		replacement: "[REDACTED_GITHUB_TOKEN]"
	},
	{
		source: String.raw`\b(github_pat_[A-Za-z0-9_]{20,})\b`,
		flags: "g",
		replacement: "[REDACTED_GITHUB_TOKEN]"
	},
	{
		source: String.raw`\b(xox[baprs]-[A-Za-z0-9-]{10,})\b`,
		flags: "g",
		replacement: "[REDACTED_SLACK_TOKEN]"
	},
	{
		source: String.raw`\b(gsk_[A-Za-z0-9_-]{10,})\b`,
		flags: "g",
		replacement: "[REDACTED_API_KEY]"
	},
	{
		source: String.raw`\b(AIza[0-9A-Za-z\-_]{20,})\b`,
		flags: "g",
		replacement: "[REDACTED_GOOGLE_KEY]"
	},
	{
		source: String.raw`\b(ya29\.[0-9A-Za-z_\-./+=]{10,})\b`,
		flags: "g",
		replacement: "[REDACTED_GOOGLE_TOKEN]"
	},
	{
		source: String.raw`\b(eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,})\b`,
		flags: "g",
		replacement: "[REDACTED_JWT]"
	},
	{
		source: String.raw`\b(pplx-[A-Za-z0-9_-]{10,})\b`,
		flags: "g",
		replacement: "[REDACTED_API_KEY]"
	},
	{
		source: String.raw`\b(npm_[A-Za-z0-9]{10,})\b`,
		flags: "g",
		replacement: "[REDACTED_NPM_TOKEN]"
	},
	{
		source: String.raw`\b(LTAI[A-Za-z0-9]{10,})\b`,
		flags: "g",
		replacement: "[REDACTED_ACCESS_KEY]"
	},
	{
		source: String.raw`\b(hf_[A-Za-z0-9]{10,})\b`,
		flags: "g",
		replacement: "[REDACTED_API_KEY]"
	},
	{
		source: String.raw`\bbot(\d{6,}:[A-Za-z0-9_-]{20,})\b`,
		flags: "g",
		replacement: "bot[REDACTED_TELEGRAM_TOKEN]"
	},
	{
		source: String.raw`\b(\d{6,}:[A-Za-z0-9_-]{20,})\b`,
		flags: "g",
		replacement: "[REDACTED_TELEGRAM_TOKEN]"
	}
];
function buildAdapterWrapperScript(params) {
	return `#!/usr/bin/env node
import { appendFileSync, existsSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";
import { StringDecoder } from "node:string_decoder";
import { fileURLToPath } from "node:url";

${params.envSetup}
const stderrLogFileNamePrefix = ${params.stderrLogFileNamePrefix ? JSON.stringify(params.stderrLogFileNamePrefix) : "undefined"};
const stderrLogMaxChars = 256 * 1024;

const openClawWrapperArgs = new Set([
  ${JSON.stringify(OPENCLAW_ACPX_LEASE_ID_ARG)},
  ${JSON.stringify(OPENCLAW_GATEWAY_INSTANCE_ID_ARG)},
  ${(params.openClawWrapperArgs ?? []).map((arg) => JSON.stringify(arg)).join(",\n  ")}
]);

function readOpenClawWrapperArg(args, name) {
  const index = args.indexOf(name);
  if (index < 0) {
    return undefined;
  }
  const value = args[index + 1];
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function readOpenClawWrapperArgs(args, name) {
  const values = [];
  for (let index = 0; index < args.length; index += 1) {
    if (args[index] !== name) {
      continue;
    }
    const value = args[index + 1];
    if (typeof value === "string" && value.trim()) {
      values.push(value.trim());
    }
    index += 1;
  }
  return values;
}

function safeDiagnosticFilePart(value) {
  const sanitized = String(value || "").replace(/[^A-Za-z0-9._-]/g, "_").slice(0, 120);
  return sanitized || "pid-" + process.pid;
}

function resolveStderrLogPath(args) {
  if (!stderrLogFileNamePrefix) {
    return undefined;
  }
  const leaseId =
    readOpenClawWrapperArg(args, ${JSON.stringify(OPENCLAW_ACPX_LEASE_ID_ARG)}) ||
    "pid-" + process.pid;
  const fileName = stderrLogFileNamePrefix + "." + safeDiagnosticFilePart(leaseId) + ".log";
  return fileURLToPath(new URL("./" + fileName, import.meta.url));
}

const diagnosticRedactionRules = ${JSON.stringify(DIAGNOSTIC_REDACTION_RULES)}.map((rule) => [
  new RegExp(rule.source, rule.flags),
  rule.replacement,
]);

function redactDiagnosticText(text) {
  let redacted = text;
  for (const [pattern, replacement] of diagnosticRedactionRules) {
    redacted = redacted.replace(pattern, replacement);
  }
  return redacted;
}

function tailUtf16Safe(text, maxChars) {
  let start = Math.max(0, text.length - maxChars);
  const startsInsideSurrogatePair =
    start > 0 &&
    start < text.length &&
    text.charCodeAt(start) >= 0xdc00 &&
    text.charCodeAt(start) <= 0xdfff &&
    text.charCodeAt(start - 1) >= 0xd800 &&
    text.charCodeAt(start - 1) <= 0xdbff;
  if (startsInsideSurrogatePair) {
    start += 1;
  }
  return text.slice(start);
}

let pendingStderrLogText = "";
// Pipe chunks can split a UTF-8 sequence. Preserve decoder state so diagnostic
// capture does not manufacture replacement characters between chunks.
const stderrDecoder = new StringDecoder("utf8");
const stderrPrivateKeyEndPattern = /-----END [A-Z ]*PRIVATE KEY-----/;

function hasUnclosedPrivateKeyBlock(text) {
  let lastBeginIndex = -1;
  for (const match of text.matchAll(/-----BEGIN [A-Z ]*PRIVATE KEY-----/g)) {
    lastBeginIndex = match.index ?? lastBeginIndex;
  }
  if (lastBeginIndex === -1) {
    return -1;
  }
  return stderrPrivateKeyEndPattern.test(text.slice(lastBeginIndex)) ? -1 : lastBeginIndex;
}

function writeRedactedStderrLog(text) {
  if (!stderrLogPath) {
    return;
  }
  if (!text) {
    return;
  }
  try {
    appendFileSync(stderrLogPath, redactDiagnosticText(text), "utf8");
    const current = readFileSync(stderrLogPath, "utf8");
    if (current.length > stderrLogMaxChars) {
      writeFileSync(stderrLogPath, tailUtf16Safe(current, stderrLogMaxChars), "utf8");
    }
  } catch {
    // Stderr capture is diagnostic-only; never break the ACP adapter.
  }
}

function redactIncompletePrivateKeyTail(text) {
  const unclosedPrivateKeyStart = hasUnclosedPrivateKeyBlock(text);
  if (unclosedPrivateKeyStart === -1) {
    return text;
  }
  return text.slice(0, unclosedPrivateKeyStart) + "[REDACTED_PRIVATE_KEY]";
}

function flushFinalizedStderrLogText() {
  const lastLineBreak = pendingStderrLogText.lastIndexOf("\\n");
  if (lastLineBreak === -1) {
    if (pendingStderrLogText.length > stderrLogMaxChars) {
      pendingStderrLogText = tailUtf16Safe(pendingStderrLogText, stderrLogMaxChars);
    }
    return;
  }
  let flushEnd = lastLineBreak + 1;
  const unclosedPrivateKeyStart = hasUnclosedPrivateKeyBlock(
    pendingStderrLogText.slice(0, flushEnd),
  );
  if (unclosedPrivateKeyStart !== -1) {
    flushEnd = unclosedPrivateKeyStart;
  }
  if (flushEnd <= 0) {
    if (pendingStderrLogText.length > stderrLogMaxChars) {
      pendingStderrLogText = tailUtf16Safe(pendingStderrLogText, stderrLogMaxChars);
    }
    return;
  }
  const finalizedText = pendingStderrLogText.slice(0, flushEnd);
  pendingStderrLogText = pendingStderrLogText.slice(flushEnd);
  writeRedactedStderrLog(finalizedText);
}

function appendStderrLog(chunk) {
  const text = stderrDecoder.write(chunk);
  if (!text) {
    return;
  }
  pendingStderrLogText += text;
  flushFinalizedStderrLogText();
}

function finishStderrLog() {
  pendingStderrLogText += stderrDecoder.end();
  const text = redactIncompletePrivateKeyTail(pendingStderrLogText);
  pendingStderrLogText = "";
  writeRedactedStderrLog(text);
}

function stripOpenClawWrapperArgs(args) {
  const stripped = [];
  for (let index = 0; index < args.length; index += 1) {
    const value = args[index];
    if (openClawWrapperArgs.has(value)) {
      index += 1;
      continue;
    }
    stripped.push(value);
  }
  return stripped;
}

const rawConfiguredArgs = process.argv.slice(2);
${params.envConfigSetup ?? ""}
const stderrLogPath = resolveStderrLogPath(rawConfiguredArgs);
if (stderrLogPath) {
  try {
    rmSync(stderrLogPath, { force: true });
  } catch {
    // Diagnostic cleanup must never prevent the adapter from starting.
  }
}

const configuredArgs = stripOpenClawWrapperArgs(rawConfiguredArgs);

function resolveNpmCliPath() {
  const candidate = path.resolve(
    path.dirname(process.execPath),
    "..",
    "lib",
    "node_modules",
    "npm",
    "bin",
    "npm-cli.js",
  );
  return existsSync(candidate) ? candidate : undefined;
}

const npmCliPath = resolveNpmCliPath();
const installedBinPath = ${params.installedBinPath ? JSON.stringify(params.installedBinPath) : "undefined"};
let defaultCommand;
let defaultArgs;
if (installedBinPath) {
  defaultCommand = process.execPath;
  defaultArgs = [installedBinPath];
} else if (npmCliPath) {
  defaultCommand = process.execPath;
  defaultArgs = [npmCliPath, "exec", "--yes", "--package", "${params.packageSpec}", "--", "${params.binName}"];
} else {
  defaultCommand = process.platform === "win32" ? "npx.cmd" : "npx";
  defaultArgs = ["--yes", "--package", "${params.packageSpec}", "--", "${params.binName}"];
}
const command =
  configuredArgs[0] === "${RUN_CONFIGURED_COMMAND_SENTINEL}" ? configuredArgs[1] : defaultCommand;
const args =
  configuredArgs[0] === "${RUN_CONFIGURED_COMMAND_SENTINEL}"
    ? configuredArgs.slice(2)
    : [...defaultArgs, ...configuredArgs];

if (!command) {
  console.error("[openclaw] missing configured ${params.displayName} ACP command");
  process.exit(1);
}

const child = spawn(command, args, {
  detached: process.platform !== "win32",
  env,
  stdio: ["inherit", "inherit", "pipe"],
  windowsHide: true,
});

child.stderr?.on("data", (chunk) => {
  appendStderrLog(chunk);
  process.stderr.write(chunk);
});

let forceKillTimer;
let orphanCleanupStarted = false;
let childExitCode = 1;

function killChildTree(signal, options = {}) {
  if (!child.pid || (!options.force && child.killed)) {
    return;
  }
  if (process.platform !== "win32") {
    try {
      // The adapter can spawn grandchildren; signaling the process group keeps
      // the generated wrapper from leaving an ACP tree behind.
      process.kill(-child.pid, signal);
      return;
    } catch {
      // Fall back to direct child signaling below.
    }
  }
  child.kill(signal);
}

for (const signal of ["SIGINT", "SIGTERM", "SIGHUP"]) {
  process.once(signal, () => {
    killChildTree(signal);
  });
}

const originalParentPid = process.ppid;
const parentWatcher =
  process.platform === "win32"
    ? undefined
    : setInterval(() => {
        // Orphan detection: parent PID changed means our original parent died.
        // The new parent could be PID 1 (init) on bare-metal hosts, OR a
        // systemd user-session manager, OR a container init, OR a session
        // leader — depending on environment. Previously this only triggered
        // on PPID == 1, which missed all systemd-managed deployments and
        // leaked codex-acp adapter trees on every gateway restart.
        if (process.ppid === originalParentPid) {
          return;
        }
        if (orphanCleanupStarted) {
          return;
        }
        orphanCleanupStarted = true;
        if (parentWatcher) {
          clearInterval(parentWatcher);
        }
        killChildTree("SIGTERM");
        // Keep the wrapper alive long enough for stubborn adapters to receive
        // a forced fallback signal after SIGTERM.
        forceKillTimer = setTimeout(() => {
          killChildTree("SIGKILL", { force: true });
          childExitCode = 1;
        }, 1_500);
      }, 1_000);
parentWatcher?.unref?.();

child.on("error", (error) => {
  console.error(\`[openclaw] failed to launch ${params.displayName} ACP wrapper: \${error.message}\`);
  process.exit(1);
});

child.on("exit", (code, signal) => {
  if (parentWatcher) {
    clearInterval(parentWatcher);
  }
  if (orphanCleanupStarted) {
    return;
  }
  if (forceKillTimer) {
    clearTimeout(forceKillTimer);
  }
  if (code !== null) {
    childExitCode = code;
    return;
  }
  childExitCode = signal ? 1 : 0;
});

child.on("close", () => {
  finishStderrLog();
  process.exit(childExitCode);
});
`;
}
function buildCodexAcpWrapperScript(installedBinPath) {
	return buildAdapterWrapperScript({
		displayName: "Codex",
		packageSpec: `${CODEX_ACP_PACKAGE}@${CODEX_ACP_PACKAGE_VERSION}`,
		binName: CODEX_ACP_BIN,
		installedBinPath,
		stderrLogFileNamePrefix: "codex-acp-wrapper.stderr",
		openClawWrapperArgs: [OPENCLAW_CODEX_CONFIG_ARG],
		envSetup: `const codexHome = fileURLToPath(new URL("./codex-home/", import.meta.url));
const codexAuthPath = fileURLToPath(new URL("./codex-home/auth.json", import.meta.url));
const codexApiKey = (process.env.CODEX_API_KEY || process.env.OPENAI_API_KEY || "").trim();
let shouldWriteCodexApiKeyAuth = false;
if (codexApiKey) {
  if (!existsSync(codexAuthPath)) {
    shouldWriteCodexApiKeyAuth = true;
  } else {
    try {
      const existingCodexAuth = JSON.parse(readFileSync(codexAuthPath, "utf8"));
      shouldWriteCodexApiKeyAuth =
        !existingCodexAuth ||
        typeof existingCodexAuth !== "object" ||
        typeof existingCodexAuth.OPENAI_API_KEY === "string";
    } catch {
      shouldWriteCodexApiKeyAuth = true;
    }
  }
}
if (shouldWriteCodexApiKeyAuth) {
  writeFileSync(
    codexAuthPath,
    JSON.stringify({
      OPENAI_API_KEY: codexApiKey,
      tokens: null,
      last_refresh: null,
    }) + "\\n",
    { mode: 0o600 },
  );
}
const env = {
  ...process.env,
  CODEX_HOME: codexHome,
};`,
		envConfigSetup: `function isCodexConfigObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function mergeCodexConfig(base, override) {
  const merged = Object.assign(Object.create(null), base);
  for (const [key, value] of Object.entries(override)) {
    const existing = merged[key];
    merged[key] =
      isCodexConfigObject(existing) && isCodexConfigObject(value)
        ? mergeCodexConfig(existing, value)
        : value;
  }
  return merged;
}

const openClawCodexConfigs = readOpenClawWrapperArgs(
  rawConfiguredArgs,
  ${JSON.stringify(OPENCLAW_CODEX_CONFIG_ARG)},
);
if (openClawCodexConfigs.length > 0) {
  let existingCodexConfig = {};
  if (typeof env.CODEX_CONFIG === "string" && env.CODEX_CONFIG.trim()) {
    try {
      const parsedCodexConfig = JSON.parse(env.CODEX_CONFIG);
      if (!parsedCodexConfig || typeof parsedCodexConfig !== "object" || Array.isArray(parsedCodexConfig)) {
        throw new Error("CODEX_CONFIG must be a JSON object");
      }
      existingCodexConfig = parsedCodexConfig;
    } catch {
      console.error("[openclaw] CODEX_CONFIG must be a valid JSON object");
      process.exit(1);
    }
  }
  for (const openClawCodexConfig of openClawCodexConfigs) {
    try {
      const parsedOpenClawCodexConfig = JSON.parse(openClawCodexConfig);
      if (
        !parsedOpenClawCodexConfig ||
        typeof parsedOpenClawCodexConfig !== "object" ||
        Array.isArray(parsedOpenClawCodexConfig)
      ) {
        throw new Error("invalid OpenClaw Codex config");
      }
      existingCodexConfig = mergeCodexConfig(existingCodexConfig, parsedOpenClawCodexConfig);
    } catch {
      console.error("[openclaw] invalid generated Codex ACP startup config");
      process.exit(1);
    }
  }
  env.CODEX_CONFIG = JSON.stringify(existingCodexConfig);
}`
	});
}
function buildClaudeAcpWrapperScript(installedBinPath) {
	return buildAdapterWrapperScript({
		displayName: "Claude",
		packageSpec: `${CLAUDE_ACP_PACKAGE}@${CLAUDE_ACP_PACKAGE_VERSION}`,
		binName: CLAUDE_ACP_BIN,
		installedBinPath,
		envSetup: `const env = {
  ...process.env,
};`
	});
}
async function readSourceCodexConfig(codexHome) {
	try {
		return await fs$1.readFile(path.join(codexHome, "config.toml"), "utf8");
	} catch (error) {
		if (error.code === "ENOENT") return;
		throw error;
	}
}
async function prepareIsolatedCodexHome(params) {
	const sourceConfig = await readSourceCodexConfig(process.env.CODEX_HOME || path.join(os.homedir(), ".codex"));
	const trustedProjectPaths = [...sourceConfig ? extractTrustedCodexProjectPaths(sourceConfig) : [], params.workspaceDir];
	const codexHome = path.join(params.baseDir, "codex-home");
	await fs$1.mkdir(codexHome, { recursive: true });
	await fs$1.writeFile(path.join(codexHome, "config.toml"), renderIsolatedCodexConfig({
		sourceConfigToml: sourceConfig,
		projectPaths: trustedProjectPaths
	}), "utf8");
	return codexHome;
}
async function writeAdapterWrapper(baseDir, fileName, script) {
	await fs$1.mkdir(baseDir, { recursive: true });
	const wrapperPath = path.join(baseDir, fileName);
	await fs$1.writeFile(wrapperPath, script, { encoding: "utf8" });
	try {
		await fs$1.chmod(wrapperPath, 493);
	} catch {}
	return wrapperPath;
}
function buildWrapperCommand(wrapperPath, args = []) {
	return [
		process.execPath,
		wrapperPath,
		...args
	];
}
function isAcpPackageSpec(value, packageName) {
	const escapedPackageName = packageName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
	return new RegExp(`^${escapedPackageName}(?:@.+)?$`, "i").test(value.trim());
}
function isAcpBinName(value, binName) {
	const commandName = basename(value);
	const escapedBinName = binName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
	return new RegExp(`^${escapedBinName}(?:\\.exe|\\.[cm]?js)?$`, "i").test(commandName);
}
function isPackageRunnerCommand(value) {
	return /^(?:npx|npm|pnpm|bunx)(?:\.cmd|\.exe)?$/i.test(basename(value));
}
function extractConfiguredAdapterArgs(params) {
	const parts = splitCommandParts(params.configuredCommand ?? []);
	if (!parts.length) return [];
	const packageIndex = parts.findIndex((part) => isAcpPackageSpec(part, params.packageName));
	if (packageIndex >= 0) {
		if (!isPackageRunnerCommand(parts[0] ?? "")) return;
		const afterPackage = parts.slice(packageIndex + 1);
		if (afterPackage[0] === "--" && isAcpBinName(afterPackage[1] ?? "", params.binName)) return afterPackage.slice(2);
		if (isAcpBinName(afterPackage[0] ?? "", params.binName)) return afterPackage.slice(1);
		return afterPackage[0] === "--" ? afterPackage.slice(1) : afterPackage;
	}
	if (isAcpBinName(parts[0] ?? "", params.binName)) return parts.slice(1);
	if (basename(parts[0] ?? "") === "node" && isAcpBinName(parts[1] ?? "", params.binName)) return parts.slice(2);
}
function mergeConfigRecords(base, override) {
	const merged = { ...base };
	for (const [key, value] of Object.entries(override)) {
		const existing = merged[key];
		const nextValue = isRecord(existing) && isRecord(value) ? mergeConfigRecords(existing, value) : value;
		Object.defineProperty(merged, key, {
			value: nextValue,
			configurable: true,
			enumerable: true,
			writable: true
		});
	}
	return merged;
}
function parseLegacyCodexConfigAssignment(assignment) {
	const separator = assignment.indexOf("=");
	if (separator <= 0) throw new Error(`Invalid legacy Codex ACP config override: ${assignment}`);
	const rawKey = assignment.slice(0, separator).trim();
	const key = rawKey === "use_legacy_landlock" ? "features.use_legacy_landlock" : rawKey;
	const rawValue = assignment.slice(separator + 1).trim();
	try {
		return parse(`${key} = ${rawValue}`);
	} catch {
		const literal = rawValue.replace(/^["']+|["']+$/g, "");
		return parse(`${key} = ${JSON.stringify(literal)}`);
	}
}
function migrateLegacyCodexArgs(args) {
	let config = {};
	const forwardedArgs = [];
	let hadOverrides = false;
	for (let index = 0; index < args.length; index += 1) {
		const arg = args[index] ?? "";
		let assignment;
		if (arg === "-c" || arg === "--config") assignment = args[index += 1];
		else if (arg.startsWith("--config=")) assignment = arg.slice(9);
		else if (arg.startsWith("-c=")) assignment = arg.slice(3);
		else if (arg.startsWith("-c") && arg.length > 2) assignment = arg.slice(2);
		else {
			forwardedArgs.push(arg);
			continue;
		}
		if (!assignment) throw new Error(`Missing value for legacy Codex ACP option ${arg}`);
		hadOverrides = true;
		config = mergeConfigRecords(config, parseLegacyCodexConfigAssignment(assignment));
	}
	return {
		config,
		forwardedArgs,
		hadOverrides
	};
}
function resolveCodexAdapterLaunch(configuredCommand) {
	const legacyAdapterArgs = extractConfiguredAdapterArgs({
		configuredCommand,
		packageName: LEGACY_CODEX_ACP_PACKAGE,
		binName: CODEX_ACP_BIN
	});
	if (legacyAdapterArgs) {
		const migration = migrateLegacyCodexArgs(legacyAdapterArgs);
		return {
			args: [...migration.hadOverrides ? [OPENCLAW_CODEX_CONFIG_ARG, JSON.stringify(migration.config)] : [], ...migration.forwardedArgs],
			...migration.hadOverrides ? { migratedConfig: migration.config } : {}
		};
	}
	const maintainedAdapterArgs = extractConfiguredAdapterArgs({
		configuredCommand,
		packageName: CODEX_ACP_PACKAGE,
		binName: CODEX_ACP_BIN
	});
	if (!maintainedAdapterArgs) return;
	return { args: maintainedAdapterArgs };
}
async function persistMigratedCodexMcpConfig(params) {
	const mcpServers = params.migratedConfig?.mcp_servers;
	if (!isRecord(mcpServers)) return;
	const configPath = path.join(params.codexHome, "config.toml");
	const merged = mergeConfigRecords(parse(await fs$1.readFile(configPath, "utf8")), { mcp_servers: mcpServers });
	await fs$1.writeFile(configPath, stringify(merged), "utf8");
}
function buildClaudeAcpWrapperCommand(wrapperPath, configuredCommand) {
	const configuredAdapterArgs = extractConfiguredAdapterArgs({
		configuredCommand,
		packageName: CLAUDE_ACP_PACKAGE,
		binName: CLAUDE_ACP_BIN
	});
	if (configuredAdapterArgs) return buildWrapperCommand(wrapperPath, configuredAdapterArgs);
	return configuredCommand ?? buildWrapperCommand(wrapperPath);
}
/** Prepare ACPX agent commands and isolated auth homes for Codex/Claude adapters. */
async function prepareAcpxCodexAuthConfig(params) {
	params.logger;
	const codexBaseDir = path.join(params.stateDir, "acpx");
	const configuredCodexCommand = params.pluginConfig.agents.codex;
	const configuredClaudeCommand = params.pluginConfig.agents.claude;
	const codexLaunch = resolveCodexAdapterLaunch(configuredCodexCommand);
	await persistMigratedCodexMcpConfig({
		codexHome: await prepareIsolatedCodexHome({
			baseDir: codexBaseDir,
			workspaceDir: params.pluginConfig.cwd
		}),
		migratedConfig: codexLaunch?.migratedConfig
	});
	const installedCodexBinPath = await (params.resolveInstalledCodexAcpBinPath ?? resolveInstalledCodexAcpBinPath)();
	const installedClaudeBinPath = await (params.resolveInstalledClaudeAcpBinPath ?? resolveInstalledClaudeAcpBinPath)();
	const wrapperPath = await writeAdapterWrapper(codexBaseDir, "codex-acp-wrapper.mjs", buildCodexAcpWrapperScript(installedCodexBinPath));
	const claudeWrapperPath = await writeAdapterWrapper(codexBaseDir, "claude-agent-acp-wrapper.mjs", buildClaudeAcpWrapperScript(installedClaudeBinPath));
	return {
		...params.pluginConfig,
		agents: {
			...params.pluginConfig.agents,
			codex: buildWrapperCommand(wrapperPath, codexLaunch?.args ?? [RUN_CONFIGURED_COMMAND_SENTINEL, ...splitCommandParts(configuredCodexCommand ?? [])]),
			claude: buildClaudeAcpWrapperCommand(claudeWrapperPath, configuredClaudeCommand)
		}
	};
}
//#endregion
//#region extensions/acpx/src/process-reaper.ts
/**
* ACPX process ownership checks and cleanup. The reaper only terminates
* OpenClaw-owned wrapper trees after validating paths, packages, and lease ids.
*/
const requireFromHere = createRequire(import.meta.url);
const GENERATED_WRAPPER_BASENAMES = /* @__PURE__ */ new Set(["codex-acp-wrapper.mjs", "claude-agent-acp-wrapper.mjs"]);
const OPENCLAW_PLUGIN_DEPS_MARKER = "/plugin-runtime-deps/";
const ACPX_PROCESS_LIST_TIMEOUT_MS = 2e3;
const OWNED_ACP_PACKAGE_NAMES = [
	CODEX_ACP_PACKAGE,
	LEGACY_CODEX_ACP_PACKAGE,
	"@zed-industries/codex-acp-darwin-arm64",
	"@zed-industries/codex-acp-darwin-x64",
	"@zed-industries/codex-acp-linux-arm64",
	"@zed-industries/codex-acp-linux-x64",
	"@zed-industries/codex-acp-win32-arm64",
	"@zed-industries/codex-acp-win32-x64",
	"@agentclientprotocol/claude-agent-acp",
	"acpx"
];
const PLUGIN_DEPS_CODEX_PACKAGE_NAMES = [
	"@openai/codex",
	"@openai/codex-darwin-arm64",
	"@openai/codex-darwin-x64",
	"@openai/codex-linux-arm64",
	"@openai/codex-linux-x64",
	"@openai/codex-win32-arm64",
	"@openai/codex-win32-x64"
];
const ACP_PACKAGE_MARKERS = [
	...OWNED_ACP_PACKAGE_NAMES.map((packageName) => `/node_modules/${packageName}/`),
	...PLUGIN_DEPS_CODEX_PACKAGE_NAMES.map((packageName) => `/node_modules/${packageName}/`),
	"/acpx/dist/"
];
function normalizePathLike(value) {
	return value.replaceAll("\\", "/");
}
function resolvePackageRoot(packageName) {
	try {
		return normalizePathLike(path.dirname(requireFromHere.resolve(`${packageName}/package.json`)));
	} catch {
		return;
	}
}
function resolveOwnedAcpPackageRootCandidates(packageName) {
	const pluginRoot = resolveAcpxPluginRoot(import.meta.url);
	const openClawRoot = resolveOpenClawRoot(pluginRoot);
	return [
		resolvePackageRoot(packageName),
		path.join(pluginRoot, "node_modules", packageName),
		path.join(openClawRoot, "node_modules", packageName)
	].flatMap((root) => root ? [normalizePathLike(root)] : []);
}
const OWNED_ACP_PACKAGE_ROOTS = Array.from(new Set(OWNED_ACP_PACKAGE_NAMES.flatMap(resolveOwnedAcpPackageRootCandidates)));
function commandBelongsToResolvedAcpPackage(command) {
	return OWNED_ACP_PACKAGE_ROOTS.some((root) => command.includes(`${root}/`));
}
function commandMentionsGeneratedWrapper(command) {
	return Array.from(GENERATED_WRAPPER_BASENAMES).some((basename) => command.includes(basename));
}
function commandContainsExactWrapperPath(command, wrapperPath) {
	const expectedPath = normalizePathLike(wrapperPath);
	return new RegExp(`(?:^|[\\s"'])${escapeRegExp(expectedPath)}(?=$|[\\s"'])`).test(normalizePathLike(command));
}
function wrapperPathBelongsToRoot(wrapperPath, wrapperRoot) {
	const normalizedPath = normalizePathLike(wrapperPath);
	const normalizedRoot = normalizePathLike(wrapperRoot).replace(/\/+$/, "");
	return GENERATED_WRAPPER_BASENAMES.has(path.posix.basename(normalizedPath)) && normalizedPath.startsWith(`${normalizedRoot}/`);
}
/** Check whether a command references an OpenClaw-generated ACPX wrapper path. */
function isOpenClawLeaseAwareAcpxProcessCommand(params) {
	const command = normalizePathLike(Array.isArray(params.command) ? params.command.join(" ") : params.command ?? "");
	const root = params.wrapperRoot ? `${normalizePathLike(params.wrapperRoot).replace(/\/+$/, "")}/` : "";
	return Array.from(GENERATED_WRAPPER_BASENAMES).some((basename) => command.includes(`${root}${basename}`));
}
function commandsReferToSameRootCommand(liveCommand, storedCommand) {
	if (!storedCommand?.trim()) return true;
	return normalizePathLike(liveCommand).trim() === normalizePathLike(storedCommand).trim();
}
function liveCommandMatchesLeaseIdentity(params) {
	if (!params.expectedLeaseId && !params.expectedGatewayInstanceId) return true;
	const identity = readAcpxProcessLeaseIdentity(params.command);
	return (!params.expectedLeaseId || identity?.leaseId === params.expectedLeaseId) && (!params.expectedGatewayInstanceId || identity?.gatewayInstanceId === params.expectedGatewayInstanceId);
}
/** Check whether a command is owned by OpenClaw ACPX runtime packages or wrappers. */
function isOpenClawOwnedAcpxProcessCommand(params) {
	const command = params.command?.trim();
	if (!command) return false;
	const normalized = normalizePathLike(command);
	if (isOpenClawLeaseAwareAcpxProcessCommand({
		command: normalized,
		wrapperRoot: params.wrapperRoot
	})) return true;
	if (commandBelongsToResolvedAcpPackage(normalized)) return true;
	if (!normalized.includes(OPENCLAW_PLUGIN_DEPS_MARKER)) return false;
	return ACP_PACKAGE_MARKERS.some((marker) => normalized.includes(marker));
}
function parseProcessList(stdout) {
	const processes = [];
	for (const line of stdout.split(/\r?\n/)) {
		const match = /^\s*(?<pid>\d+)\s+(?<ppid>\d+)\s+(?<command>.+?)\s*$/.exec(line);
		const pid = match?.groups?.pid;
		const ppid = match?.groups?.ppid;
		const command = match?.groups?.command;
		if (!pid || !ppid || !command) continue;
		processes.push({
			pid: Number.parseInt(pid, 10),
			ppid: Number.parseInt(ppid, 10),
			command
		});
	}
	return processes;
}
/** List host processes in the compact shape needed by ACPX cleanup. */
async function listPlatformProcesses() {
	if (process.platform === "win32") return [];
	const { stdout } = await runExec("ps", ["-axo", "pid=,ppid=,command="], {
		logOutput: false,
		maxBuffer: 8388608,
		timeoutMs: ACPX_PROCESS_LIST_TIMEOUT_MS
	});
	return parseProcessList(stdout);
}
function collectProcessTree(processes, rootPid) {
	const childrenByParent = /* @__PURE__ */ new Map();
	for (const processInfo of processes) {
		const children = childrenByParent.get(processInfo.ppid) ?? [];
		children.push(processInfo);
		childrenByParent.set(processInfo.ppid, children);
	}
	const root = new Map(processes.map((processInfo) => [processInfo.pid, processInfo])).get(rootPid);
	const collected = [];
	if (root) collected.push(root);
	const queue = [...childrenByParent.get(rootPid) ?? []];
	while (queue.length > 0) {
		const next = queue.shift();
		if (!next || collected.some((processInfo) => processInfo.pid === next.pid)) continue;
		collected.push(next);
		queue.push(...childrenByParent.get(next.pid) ?? []);
	}
	return collected;
}
function uniquePids(processes) {
	return Array.from(new Set(processes.map((processInfo) => processInfo.pid).filter((pid) => Number.isInteger(pid) && pid > 0 && pid !== process.pid)));
}
async function terminatePids(pids, deps) {
	const killProcess = deps?.killProcess ?? ((pid, signal) => process.kill(pid, signal));
	const sleep = deps?.sleep ?? ((ms) => new Promise((resolve) => {
		setTimeout(resolve, ms);
	}));
	const terminated = [];
	for (const pid of pids) {
		deps?.assertCurrent?.();
		try {
			killProcess(pid, "SIGTERM");
			terminated.push(pid);
		} catch {}
	}
	if (terminated.length === 0) return terminated;
	await sleep(750);
	for (const pid of terminated) {
		deps?.assertCurrent?.();
		if (deps?.killProcess || isPidAlive(pid)) try {
			killProcess(pid, "SIGKILL");
		} catch {}
	}
	return terminated;
}
/** Terminate one validated OpenClaw-owned ACPX wrapper process tree. */
async function cleanupOpenClawOwnedAcpxProcessTree(params) {
	const rootPid = params.rootPid;
	if (!rootPid || rootPid <= 0 || rootPid === process.pid) return {
		inspectedPids: [],
		terminatedPids: [],
		skippedReason: "missing-root"
	};
	if ((params.deps?.platform ?? process.platform) === "win32") return {
		inspectedPids: [],
		terminatedPids: [],
		skippedReason: "unsupported-platform"
	};
	let processes;
	try {
		processes = await (params.deps?.listProcesses ?? listPlatformProcesses)();
	} catch {
		return {
			inspectedPids: [],
			terminatedPids: [],
			skippedReason: "process-list-unavailable"
		};
	}
	const listedTree = collectProcessTree(processes, rootPid);
	if (listedTree.length === 0) return {
		inspectedPids: [],
		terminatedPids: [],
		skippedReason: "unverified-root"
	};
	const rootCommand = listedTree[0]?.command ?? params.rootCommand;
	const liveCommandWasGeneratedWrapper = commandMentionsGeneratedWrapper(normalizePathLike(rootCommand ?? ""));
	const storedCommandWasGeneratedWrapper = commandMentionsGeneratedWrapper(normalizePathLike(params.rootCommand ?? ""));
	if (!liveCommandWasGeneratedWrapper && (storedCommandWasGeneratedWrapper || !commandsReferToSameRootCommand(rootCommand ?? "", params.rootCommand)) || !isOpenClawOwnedAcpxProcessCommand({
		command: rootCommand,
		wrapperRoot: params.wrapperRoot
	}) || !liveCommandMatchesLeaseIdentity({
		command: rootCommand,
		expectedLeaseId: params.expectedLeaseId,
		expectedGatewayInstanceId: params.expectedGatewayInstanceId
	})) return {
		inspectedPids: listedTree.map((processInfo) => processInfo.pid),
		terminatedPids: [],
		skippedReason: "not-openclaw-owned"
	};
	const pids = uniquePids(listedTree.toReversed());
	return {
		inspectedPids: uniquePids(listedTree),
		terminatedPids: await terminatePids(pids, params.deps)
	};
}
/** Recover a pending lease by matching its exact live wrapper identity. */
async function cleanupOpenClawOwnedAcpxPendingLease(params) {
	if ((params.deps?.platform ?? process.platform) === "win32") return {
		inspectedPids: [],
		terminatedPids: [],
		skippedReason: "unsupported-platform"
	};
	if (!params.wrapperPath || !wrapperPathBelongsToRoot(params.wrapperPath, params.wrapperRoot)) return {
		inspectedPids: [],
		terminatedPids: [],
		skippedReason: "unverified-root"
	};
	let processes;
	try {
		processes = await (params.deps?.listProcesses ?? listPlatformProcesses)();
	} catch {
		return {
			inspectedPids: [],
			terminatedPids: [],
			skippedReason: "process-list-unavailable"
		};
	}
	const matchingRoots = processes.filter((processInfo) => commandContainsExactWrapperPath(processInfo.command, params.wrapperPath) && liveCommandMatchesLeaseIdentity({
		command: processInfo.command,
		expectedLeaseId: params.leaseId,
		expectedGatewayInstanceId: params.gatewayInstanceId
	}));
	if (matchingRoots.length === 0) return {
		inspectedPids: [],
		terminatedPids: [],
		skippedReason: "missing-root"
	};
	if (matchingRoots.length > 1) return {
		inspectedPids: uniquePids(matchingRoots),
		terminatedPids: [],
		skippedReason: "ambiguous-root"
	};
	const listedTree = collectProcessTree(processes, matchingRoots[0].pid);
	const pids = uniquePids(listedTree.toReversed());
	return {
		inspectedPids: uniquePids(listedTree),
		terminatedPids: await terminatePids(pids, params.deps)
	};
}
/** Reap orphaned OpenClaw-owned ACPX wrapper trees during runtime startup. */
async function reapStaleOpenClawOwnedAcpxOrphans(params) {
	if ((params.deps?.platform ?? process.platform) === "win32") return {
		inspectedPids: [],
		terminatedPids: [],
		skippedReason: "unsupported-platform"
	};
	let processes;
	try {
		processes = await (params.deps?.listProcesses ?? listPlatformProcesses)();
	} catch {
		return {
			inspectedPids: [],
			terminatedPids: [],
			skippedReason: "process-list-unavailable"
		};
	}
	const orphanTrees = processes.filter((processInfo) => processInfo.ppid === 1 && !readAcpxProcessLeaseIdentity(processInfo.command) && isOpenClawOwnedAcpxProcessCommand({
		command: processInfo.command,
		wrapperRoot: params.wrapperRoot
	})).map((orphan) => collectProcessTree(processes, orphan.pid));
	return {
		inspectedPids: uniquePids(orphanTrees.flat()),
		terminatedPids: await terminatePids(uniquePids(orphanTrees.flatMap((tree) => tree.toReversed())), params.deps)
	};
}
//#endregion
//#region extensions/acpx/src/model-ref.ts
function withAcpxSessionOptions(input) {
	const model = input.model?.trim() || input.sessionOptions?.model;
	const sessionOptions = model ? {
		...input.sessionOptions,
		model
	} : input.sessionOptions;
	const { modelExplicit: _modelExplicit, thinkingExplicit: _thinkingExplicit, ...rest } = input;
	return {
		...rest,
		...sessionOptions ? { sessionOptions } : {}
	};
}
async function withOpenClawModelRef(requested, apply) {
	try {
		return await apply(requested);
	} catch (error) {
		const model = requested.trim();
		const slash = model.indexOf("/");
		if (!isRequestedModelUnsupportedError(error) || error.reason !== "unadvertised-model" || error.ambiguous === true || slash <= 0 || slash === model.length - 1) throw error;
		return await apply(model.slice(slash + 1));
	}
}
async function ensureSessionWithModelRef(ensureSession, input) {
	const ensure = (model) => ensureSession(withAcpxSessionOptions({
		...input,
		model
	}));
	const requested = input.model?.trim();
	try {
		return requested ? await withOpenClawModelRef(requested, ensure) : await ensureSession(withAcpxSessionOptions(input));
	} catch (error) {
		if (!requested || input.modelExplicit || !isRequestedModelUnsupportedError(error) || error.reason !== "missing-capability") throw error;
		return {
			...await ensure(void 0),
			appliedModel: { kind: "dropped" }
		};
	}
}
//#endregion
//#region extensions/acpx/src/runtime-generations.ts
var AcpxGenerationRegistry = class {
	constructor(sessionStore, delegate, createDelegate) {
		this.sessionStore = sessionStore;
		this.delegate = delegate;
		this.createDelegate = createDelegate;
		this.generations = /* @__PURE__ */ new Map();
		this.isolatedSessionResources = /* @__PURE__ */ new Set();
		this.privateDelegates = /* @__PURE__ */ new Set();
		this.retiringDelegates = /* @__PURE__ */ new WeakSet();
		this.nextGenerationId = 0;
		this.generationOwner = Symbol("acpx-runtime-owner");
		this.stopping = false;
	}
	get isStopping() {
		return this.stopping;
	}
	assertRunning() {
		if (this.stopping) throw new AcpRuntimeError("ACP_BACKEND_UNAVAILABLE", "ACP runtime is shut down.");
	}
	fromCaptured(resource, captured) {
		return captured?.owner === this.generationOwner ? captured : this.currentGeneration(resource);
	}
	prepareFresh(resource) {
		const generation = this.generations.get(resource);
		if (generation) this.retireGeneration(generation);
		else this.sessionStore.markFresh(resource);
	}
	resolveDelegate(generation, nativeTools) {
		this.assertRunning();
		if (generation.delegate && generation.nativeTools !== nativeTools) throw new AcpRuntimeError("ACP_TURN_FAILED", "ACP session tool ownership changed.");
		if (!generation.delegate) {
			generation.delegate = generation.afterReset ? this.createDelegate() : this.delegate;
			generation.nativeTools = nativeTools;
			if (generation.delegate !== this.delegate) this.privateDelegates.add(generation.delegate);
		}
		return generation.delegate;
	}
	currentGeneration(resource) {
		if (this.stopping) throw new AcpRuntimeError("ACP_BACKEND_UNAVAILABLE", "ACP runtime is shut down.");
		let generation = this.generations.get(resource);
		if (!generation) {
			const fresh = this.sessionStore.isFresh(resource);
			const afterReset = fresh || this.isolatedSessionResources.has(resource);
			if (afterReset) this.isolatedSessionResources.add(resource);
			generation = {
				id: ++this.nextGenerationId,
				owner: this.generationOwner,
				resource,
				ensureQueue: new KeyedAsyncQueue(),
				retired: false,
				activeOperations: 0,
				pendingAdmissions: 0,
				admissionState: "unadmitted",
				activeRecordOperations: /* @__PURE__ */ new Map(),
				closedRecordIds: /* @__PURE__ */ new Set(),
				records: /* @__PURE__ */ new Map(),
				closeCompleted: false,
				afterReset,
				awaitPriorWrites: fresh
			};
			this.generations.set(resource, generation);
		}
		return generation;
	}
	async runAdmission(resource, run) {
		const generation = this.currentGeneration(resource);
		generation.pendingAdmissions += 1;
		try {
			return await generation.ensureQueue.enqueue(resource + "\0" + generation.id, async () => {
				try {
					const result = await run(generation);
					generation.admissionState = "admitted";
					return result;
				} catch (error) {
					if (generation.admissionState !== "admitted") generation.admissionState = "failed";
					throw error;
				}
			});
		} finally {
			generation.pendingAdmissions -= 1;
			this.releaseIdleGeneration(generation);
		}
	}
	retireGeneration(generation) {
		generation.retired = true;
		if (this.generations.get(generation.resource) === generation) {
			this.generations.delete(generation.resource);
			this.sessionStore.markFresh(generation.resource);
		}
		this.releaseRetiredDelegate(generation);
	}
	releaseRetiredDelegate(generation) {
		const delegate = generation.delegate;
		if (!generation.retired || generation.activeOperations !== 0 || generation.pendingAdmissions !== 0 || !delegate || delegate === this.delegate || this.retiringDelegates.has(delegate)) return;
		this.retiringDelegates.add(delegate);
		delegate.shutdown().then(() => this.privateDelegates.delete(delegate), () => {});
	}
	retainGenerationOperation(generation, recordId) {
		generation.activeOperations += 1;
		generation.activeRecordOperations.set(recordId, (generation.activeRecordOperations.get(recordId) ?? 0) + 1);
		return () => {
			const remaining = (generation.activeRecordOperations.get(recordId) ?? 1) - 1;
			if (remaining === 0) {
				generation.activeRecordOperations.delete(recordId);
				generation.closedRecordIds.delete(recordId);
			} else generation.activeRecordOperations.set(recordId, remaining);
			generation.activeOperations -= 1;
			this.releaseIdleGeneration(generation);
		};
	}
	releaseIdleGeneration(generation) {
		if (!generation.retired && (generation.closeCompleted || generation.admissionState === "failed") && generation.pendingAdmissions === 0 && generation.activeOperations === 0 && generation.records.size === 0 && this.generations.get(generation.resource) === generation) {
			generation.retired = true;
			this.generations.delete(generation.resource);
		}
		this.releaseRetiredDelegate(generation);
	}
	assertCurrentGeneration(generation) {
		if (this.stopping || generation.retired) throw new AcpRuntimeError("ACP_TURN_FAILED", "ACP runtime operation was superseded by reset.");
	}
	async shutdown() {
		this.stopping = true;
		const errors = (await Promise.allSettled([this.delegate, ...this.privateDelegates].map((delegate) => delegate.shutdown()))).flatMap((result) => result.status === "rejected" ? [result.reason] : []);
		if (errors.length) throw new AggregateError(errors, "ACP runtime shutdown failed.");
		this.privateDelegates.clear();
		this.generations.clear();
		this.isolatedSessionResources.clear();
	}
};
//#endregion
//#region extensions/acpx/src/runtime-probe.ts
var AcpxRuntimeProbe = class {
	constructor(params) {
		this.params = params;
		this.tail = Promise.resolve();
	}
	isHealthy() {
		return this.health !== void 0 && (this.health.agent !== this.params.getAgent() || this.health.ok);
	}
	async doctor() {
		const probe = this.tail.then(async () => {
			this.params.assertRunning();
			const agent = this.params.getAgent();
			const runtime = this.params.createRuntime(agent);
			try {
				const report = await this.params.runWithLease(agent, () => runtime.doctor());
				this.params.assertRunning();
				this.health = {
					agent,
					ok: report.ok
				};
				return report;
			} finally {
				await runtime.shutdown();
			}
		});
		this.tail = probe.catch(() => {});
		return await probe;
	}
	async shutdown() {
		this.health = void 0;
		await this.tail;
	}
};
//#endregion
//#region extensions/acpx/src/runtime-session-store.ts
/** Generation-bound persistence and process-lease metadata for ACPX resets. */
function withOpenClawLeaseSessionMetadata(record, lease) {
	return {
		...record,
		openclawLeaseId: lease.leaseId,
		openclawGatewayInstanceId: lease.gatewayInstanceId
	};
}
function captureGenerationRecord(generation, record) {
	if (record.closed || generation.closedRecordIds.has(record.acpxRecordId)) generation.records.delete(record.acpxRecordId);
	else generation.records.set(record.acpxRecordId, record);
}
const acpxGenerationKey = Symbol("openclaw.acpxGeneration");
const acpxOperationScope = new AsyncLocalStorage();
function readSessionRecordName(record) {
	if (typeof record !== "object" || record === null) return "";
	const { name } = record;
	return typeof name === "string" ? name.trim() : "";
}
function readRecordAgentCommand(record) {
	return record?.agentArgv ?? record?.agentCommand;
}
function readRecordCwd(record) {
	if (typeof record !== "object" || record === null) return;
	const { cwd } = record;
	return typeof cwd === "string" ? cwd.trim() || void 0 : void 0;
}
function readRecordResetOnNextEnsure(record) {
	if (typeof record !== "object" || record === null) return false;
	const { acpx } = record;
	if (typeof acpx !== "object" || acpx === null) return false;
	return acpx.reset_on_next_ensure === true;
}
function readRecordAgentPid(record) {
	if (typeof record !== "object" || record === null) return;
	const { pid, processId } = record;
	const rawPid = pid ?? processId;
	const numericPid = typeof rawPid === "number" ? rawPid : typeof rawPid === "string" ? parseStrictPositiveInteger(rawPid) : void 0;
	return numericPid && Number.isInteger(numericPid) && numericPid > 0 ? numericPid : void 0;
}
function readOpenClawLeaseIdFromRecord(record) {
	if (typeof record !== "object" || record === null) return;
	const { openclawLeaseId } = record;
	return typeof openclawLeaseId === "string" ? openclawLeaseId.trim() || void 0 : void 0;
}
function readOpenClawGatewayInstanceIdFromRecord(record) {
	if (typeof record !== "object" || record === null) return;
	const { openclawGatewayInstanceId } = record;
	return typeof openclawGatewayInstanceId === "string" ? openclawGatewayInstanceId.trim() || void 0 : void 0;
}
function extractGeneratedWrapperPath(command) {
	return splitCommandParts(command ?? "").find((part) => (part.split(/[\\/]/).pop() ?? "") === "codex-acp-wrapper.mjs" || (part.split(/[\\/]/).pop() ?? "") === "claude-agent-acp-wrapper.mjs") ?? "";
}
function selectCurrentSessionLease(params) {
	const sessionKeys = new Set(normalizeStringEntries(params.sessionKeys));
	const candidates = params.leases.filter((lease) => sessionKeys.has(lease.sessionKey));
	if (params.rootPid) return candidates.find((lease) => lease.rootPid === params.rootPid);
	let selected;
	for (const lease of candidates) if (!selected || lease.startedAt > selected.startedAt) selected = lease;
	return selected;
}
function createResetAwareSessionStore(baseStore, params) {
	const freshSessionKeys = /* @__PURE__ */ new Set();
	const stateQueue = new KeyedAsyncQueue();
	const pendingWrites = /* @__PURE__ */ new Map();
	return {
		async load(sessionId) {
			const scope = acpxOperationScope.getStore();
			if (scope?.closeRecord && (sessionId === scope.generation.resource || sessionId === scope.closeRecord.acpxRecordId)) return scope.closeRecord;
			const resource = scope?.generation.resource ?? sessionId.trim();
			const pending = pendingWrites.get(sessionId.trim());
			if (pending && (scope?.generation.awaitPriorWrites || freshSessionKeys.has(resource))) await Promise.allSettled(pending);
			const load = async () => {
				if (scope?.generation.retired) return;
				const normalized = sessionId.trim();
				if (normalized && freshSessionKeys.has(normalized)) return;
				const record = await baseStore.load(sessionId);
				if (scope?.generation.retired || freshSessionKeys.has(scope?.generation.resource ?? normalized)) return;
				if (scope && record) captureGenerationRecord(scope.generation, record);
				if (!record || !params?.leaseStore || !params.gatewayInstanceId) return record;
				const sessionName = readSessionRecordName(record) || normalized;
				const lease = selectCurrentSessionLease({
					leases: await params.leaseStore.listOpen(params.gatewayInstanceId),
					sessionKeys: [sessionName, normalized],
					rootPid: readRecordAgentPid(record)
				});
				if (!lease) return record;
				if (scope?.generation.retired) return;
				const leasedRecord = withOpenClawLeaseSessionMetadata(record, lease);
				if (scope) captureGenerationRecord(scope.generation, leasedRecord);
				return leasedRecord;
			};
			return await load();
		},
		async save(record) {
			const scope = acpxOperationScope.getStore();
			if (scope) captureGenerationRecord(scope.generation, record);
			const resource = record.acpxRecordId;
			const retiredCloseRecord = scope?.generation.retired && record.closed && record.acpx?.reset_on_next_ensure === true ? scope.closeRecord : void 0;
			const writeRecord = async () => {
				if (scope?.generation.retired) {
					if (!retiredCloseRecord) return;
					const persisted = await baseStore.load(record.acpxRecordId);
					if (!persisted || persisted.acpxRecordId !== retiredCloseRecord.acpxRecordId || persisted.acpSessionId !== retiredCloseRecord.acpSessionId || persisted.createdAt !== retiredCloseRecord.createdAt) return;
					await baseStore.save(record);
					return;
				}
				let recordToSave = record;
				const launch = params?.launchScope?.getStore();
				const sessionName = readSessionRecordName(record);
				const agentCommand = readRecordAgentCommand(record);
				const leasedCommand = launch?.leasedCommand ?? agentCommand;
				const leaseIdentity = launch ?? readAcpxProcessLeaseIdentity(leasedCommand);
				if (params?.leaseStore && params.gatewayInstanceId && params.wrapperRoot && (!launch || sessionName === launch.sessionKey) && leasedCommand && leaseIdentity?.gatewayInstanceId === params.gatewayInstanceId && isOpenClawLeaseAwareAcpxProcessCommand({
					command: leasedCommand,
					wrapperRoot: params.wrapperRoot
				})) {
					const existing = await params.leaseStore.load(leaseIdentity.leaseId);
					if (scope?.generation.retired) return;
					if (!existing || existing.gatewayInstanceId === leaseIdentity.gatewayInstanceId && existing.sessionKey === sessionName && existing.wrapperRoot === params.wrapperRoot) {
						const adoptingLease = Boolean(launch && !isDeepStrictEqual(splitCommandParts(launch.resolvedCommand), splitCommandParts(launch.leasedCommand)));
						const persistedCommand = launch && !adoptingLease ? launch.resolvedCommand : leasedCommand;
						recordToSave = withOpenClawLeaseSessionMetadata({
							...adoptingLease ? {
								...record,
								pid: void 0,
								processId: void 0,
								agentStartedAt: void 0
							} : record,
							agentCommand: renderAgentCommand(persistedCommand),
							agentArgv: Array.isArray(persistedCommand) ? persistedCommand : void 0
						}, leaseIdentity);
					}
				}
				if (scope?.generation.retired) return;
				await baseStore.save(recordToSave);
				if (scope && !scope.generation.retired) scope.generation.awaitPriorWrites = false;
				if (sessionName && !scope?.generation.retired) freshSessionKeys.delete(sessionName);
			};
			const writes = pendingWrites.get(resource) ?? /* @__PURE__ */ new Set();
			const previous = [...writes];
			const write = scope?.generation.awaitPriorWrites || retiredCloseRecord ? Promise.allSettled(previous).then(() => stateQueue.enqueue(resource, writeRecord)) : writeRecord();
			writes.add(write);
			pendingWrites.set(resource, writes);
			try {
				await write;
			} finally {
				writes.delete(write);
				if (writes.size === 0 && pendingWrites.get(resource) === writes) pendingWrites.delete(resource);
			}
		},
		loadForClose: (sessionKey) => baseStore.load(sessionKey),
		isFresh: (sessionKey) => freshSessionKeys.has(sessionKey),
		markFresh(sessionKey) {
			const normalized = sessionKey.trim();
			if (normalized) freshSessionKeys.add(normalized);
		}
	};
}
//#endregion
//#region extensions/acpx/src/runtime-process-cleanup.ts
/** Capture OpenClaw wrapper cleanup ownership before a backend close can yield. */
async function prepareAcpxProcessCleanup(params) {
	const { leaseStore, gatewayInstanceId, wrapperRoot, deps } = params;
	const rootPid = readRecordAgentPid(params.record);
	const rootCommand = params.command ? renderAgentCommand(params.command) : void 0;
	const identity = readAcpxProcessLeaseIdentity(params.command);
	const leaseId = readOpenClawLeaseIdFromRecord(params.record) ?? identity?.leaseId;
	const expectedGatewayInstanceId = readOpenClawGatewayInstanceIdFromRecord(params.record) ?? identity?.gatewayInstanceId;
	const sessionKeys = [params.sessionKey, readSessionRecordName(params.record)];
	const openLeases = rootPid && gatewayInstanceId && leaseStore ? await leaseStore.listOpen(gatewayInstanceId) : [];
	const selectedLease = rootPid ? selectCurrentSessionLease({
		leases: openLeases,
		sessionKeys,
		rootPid
	}) : void 0;
	const loadedLease = leaseId ? await leaseStore?.load(leaseId) : void 0;
	const ownedLease = selectedLease ?? (loadedLease && loadedLease.gatewayInstanceId === gatewayInstanceId && (!rootPid || loadedLease.rootPid === rootPid) && sessionKeys.includes(loadedLease.sessionKey) ? loadedLease : void 0);
	const lease = ownedLease ? { ...ownedLease } : void 0;
	return async () => {
		if (lease && lease.gatewayInstanceId === gatewayInstanceId) {
			await leaseStore?.markState(lease.leaseId, "closing");
			const result = lease.rootPid > 0 ? await cleanupOpenClawOwnedAcpxProcessTree({
				rootPid: lease.rootPid,
				rootCommand,
				expectedLeaseId: lease.leaseId,
				expectedGatewayInstanceId: lease.gatewayInstanceId,
				wrapperRoot: lease.wrapperRoot,
				deps
			}) : await cleanupOpenClawOwnedAcpxPendingLease({
				leaseId: lease.leaseId,
				gatewayInstanceId: lease.gatewayInstanceId,
				wrapperRoot: lease.wrapperRoot,
				wrapperPath: lease.wrapperPath,
				deps
			});
			await leaseStore?.markState(lease.leaseId, result.skippedReason === "process-list-unavailable" || result.skippedReason === "unsupported-platform" || lease.rootPid <= 0 && (result.skippedReason === "ambiguous-root" || result.skippedReason === "unverified-root") ? "open" : result.terminatedPids.length > 0 || result.skippedReason === "missing-root" ? "closed" : "lost");
			return;
		}
		if (!rootPid || !rootCommand) return;
		await cleanupOpenClawOwnedAcpxProcessTree({
			rootPid,
			rootCommand,
			...leaseId ? { expectedLeaseId: leaseId } : {},
			...expectedGatewayInstanceId ? { expectedGatewayInstanceId } : {},
			wrapperRoot,
			deps
		});
	};
}
//#endregion
//#region extensions/acpx/src/session-owner.ts
function requireAcpxOwnerMigration(sessionKey) {
	throw new AcpRuntimeError("ACP_SESSION_INIT_FAILED", `ACP session "${sessionKey}" has an unqualified or unverifiable backend locator. Stop the Gateway and run "openclaw doctor --fix" to migrate ownership without losing history, then restart.`, { detailCode: "SESSION_OWNER_MIGRATION_REQUIRED" });
}
function assertAcpxSessionOwnerLocator(target, legacyBareSessionKeys) {
	const resource = resolveAcpxSessionResource(target);
	const qualified = resource === target.sessionKey.trim().toLowerCase();
	const persisted = target.persistedHandle;
	if (!qualified && (legacyBareSessionKeys?.has(target.sessionKey.trim().toLowerCase()) || legacyBareSessionKeys?.has(resource) && !persisted)) requireAcpxOwnerMigration(target.sessionKey);
	if (persisted) {
		const decoded = decodeAcpxRuntimeHandleState(persisted.runtimeSessionName);
		if (!qualified && !decoded || decoded && (decoded.name !== resource || persisted.acpxRecordId && decoded.acpxRecordId !== persisted.acpxRecordId)) requireAcpxOwnerMigration(target.sessionKey);
	}
	return resource;
}
/** Preserve physical oneshot record IDs and the upstream-encoded runtime handle. */
function toAcpxResourceInput(input) {
	const sessionKey = assertAcpxSessionOwnerLocator({
		...input.handle,
		persistedHandle: input.handle
	});
	return {
		...input,
		handle: {
			...input.handle,
			sessionKey
		}
	};
}
//#endregion
//#region extensions/acpx/src/runtime.ts
/**
* OpenClaw ACPX runtime adapter. It wraps the upstream acpx runtime with
* OpenClaw session metadata, lease tracking, model scoping, and cleanup policy.
*/
const ACPX_PLUGIN_TOOLS_MCP_SERVER_NAME = "openclaw-plugin-tools";
const ACPX_OPENCLAW_TOOLS_MCP_SERVER_NAME = "openclaw-tools";
const OPENCLAW_TOOLS_MCP_AGENT_SESSION_KEY_ENV = "OPENCLAW_TOOLS_MCP_AGENT_SESSION_KEY";
const CODEX_WRAPPER_STDERR_LOG_PREFIX = "codex-acp-wrapper.stderr";
function safeDiagnosticFilePart(value) {
	return value.replace(/[^A-Za-z0-9._-]/g, "_").slice(0, 120) || "unknown";
}
function codexWrapperStderrLogFileName(leaseId) {
	return `${CODEX_WRAPPER_STDERR_LOG_PREFIX}.${safeDiagnosticFilePart(leaseId)}.log`;
}
function compactDiagnosticText(value) {
	return value.replace(/\s+/g, " ").trim();
}
function isGenericInternalAcpErrorMessage(message) {
	return message.trim() === "Internal error";
}
function isGenericInternalAcpError(error) {
	return error instanceof Error && isGenericInternalAcpErrorMessage(error.message);
}
async function readCodexWrapperStderrTail(params) {
	if (!params.wrapperRoot || !params.leaseId) return "";
	try {
		const text = await fs$1.readFile(path.join(params.wrapperRoot, codexWrapperStderrLogFileName(params.leaseId)), "utf8");
		return compactDiagnosticText(redactSensitiveText(sliceUtf16Safe(text, -6e3)));
	} catch {
		return "";
	}
}
const CODEX_ACP_AGENT_ID = "codex";
const CODEX_ACP_OPENCLAW_PREFIX = "openai/";
const CLAUDE_ACP_OPENCLAW_PREFIX = /^(?:anthropic|amazon-bedrock)\//i;
const CODEX_ACP_THINKING_ALIASES = /* @__PURE__ */ new Map([
	["off", void 0],
	["minimal", "low"],
	["low", "low"],
	["medium", "medium"],
	["high", "high"],
	["x-high", "xhigh"],
	["x_high", "xhigh"],
	["extra-high", "xhigh"],
	["extra_high", "xhigh"],
	["extra high", "xhigh"],
	["xhigh", "xhigh"]
]);
function readAgentFromSessionKey(sessionKey) {
	const normalized = sessionKey?.trim();
	if (!normalized) return;
	const match = /^agent:(?<agent>[^:]+):/i.exec(normalized);
	return normalizeAgentName(match?.groups?.agent);
}
function readAgentFromHandle(handle) {
	const decoded = decodeAcpxRuntimeHandleState(handle.runtimeSessionName);
	return normalizeAgentName(decoded?.agent) ?? readAgentFromSessionKey(handle.sessionKey);
}
function failUnsupportedCodexAcpModel(rawModel) {
	throw new AcpRuntimeError("ACP_INVALID_RUNTIME_OPTION", `Codex ACP model "${rawModel}" is not supported. Use openai/<model> or <model>/<reasoning-effort>.`);
}
const WIRE_TIMEOUT_CONFIG_KEYS = /* @__PURE__ */ new Set(["timeout", "timeout_seconds"]);
function assertSupportedRuntimeSessionMode(mode) {
	if (mode === "persistent" || mode === "oneshot") return;
	throw new AcpRuntimeError("ACP_INVALID_RUNTIME_OPTION", `Unsupported ACP runtime session mode ${JSON.stringify(mode)}. Expected one of: persistent, oneshot.`);
}
function failUnsupportedCodexAcpThinking(rawThinking) {
	throw new AcpRuntimeError("ACP_INVALID_RUNTIME_OPTION", `Codex ACP thinking level "${rawThinking}" is not supported. Use off, minimal, low, medium, high, or xhigh.`);
}
function normalizeCodexAcpReasoningEffort(rawThinking) {
	const normalized = rawThinking?.trim().toLowerCase();
	if (!normalized) return;
	if (!CODEX_ACP_THINKING_ALIASES.has(normalized)) failUnsupportedCodexAcpThinking(rawThinking ?? "");
	return CODEX_ACP_THINKING_ALIASES.get(normalized);
}
function isCodexAcpReasoningEffortAlias(value) {
	const normalized = value?.trim().toLowerCase();
	return Boolean(normalized && CODEX_ACP_THINKING_ALIASES.has(normalized));
}
function classifyCodexAcpModelRequest(rawModel, rawThinking) {
	const raw = rawModel?.trim();
	const thinkingReasoningEffort = normalizeCodexAcpReasoningEffort(rawThinking);
	const thinkingOnlyOverride = thinkingReasoningEffort ? { reasoningEffort: thinkingReasoningEffort } : void 0;
	if (!raw) return {
		kind: "override",
		override: thinkingOnlyOverride ?? {}
	};
	let value = raw;
	let hadOpenAiQualifier = false;
	if (value.toLowerCase().startsWith(CODEX_ACP_OPENCLAW_PREFIX)) {
		value = value.slice(7);
		hadOpenAiQualifier = true;
	}
	let model = value.trim();
	let modelReasoningEffort;
	const slashIndex = value.lastIndexOf("/");
	if (slashIndex >= 0 && isCodexAcpReasoningEffortAlias(value.slice(slashIndex + 1))) {
		modelReasoningEffort = normalizeCodexAcpReasoningEffort(value.slice(slashIndex + 1));
		model = value.slice(0, slashIndex).trim();
	}
	if (hadOpenAiQualifier && (!model || model.includes("/"))) failUnsupportedCodexAcpModel(raw);
	if (!model || model.includes("/")) return thinkingOnlyOverride ? {
		kind: "unsupported",
		thinkingOverride: thinkingOnlyOverride
	} : { kind: "unsupported" };
	const reasoningEffort = rawThinking?.trim() ? thinkingReasoningEffort : modelReasoningEffort;
	return {
		kind: "override",
		override: {
			model,
			...reasoningEffort ? { reasoningEffort } : {}
		}
	};
}
function withCodexSessionModel(input, override) {
	const next = { ...input };
	if (override?.model) next.model = override.model;
	else delete next.model;
	return next;
}
function normalizeClaudeAcpModelOverride(rawModel) {
	const raw = rawModel?.trim();
	if (!raw) return;
	const prefix = raw.match(CLAUDE_ACP_OPENCLAW_PREFIX);
	if (!prefix) return raw;
	return raw.slice(prefix[0].length).trim() || void 0;
}
function appendCodexAcpConfigOverrides(command, override) {
	const config = {
		...override.model ? { model: override.model } : {},
		...override.reasoningEffort ? { model_reasoning_effort: override.reasoningEffort } : {}
	};
	if (Object.keys(config).length === 0) return command;
	return [
		...splitCommandParts(command),
		OPENCLAW_CODEX_CONFIG_ARG,
		JSON.stringify(config)
	];
}
function withManagedToolsMcpSessionEnv(params) {
	const sessionKey = params.sessionKey.trim();
	if (!params.pluginToolsEnabled && !params.openclawToolsEnabled || !sessionKey || !params.mcpServers?.length) return params.mcpServers;
	let changed = false;
	const nextServers = params.mcpServers.map((server) => {
		const isManagedPluginTools = params.pluginToolsEnabled && server.name === ACPX_PLUGIN_TOOLS_MCP_SERVER_NAME;
		const isManagedOpenClawTools = params.openclawToolsEnabled && server.name === ACPX_OPENCLAW_TOOLS_MCP_SERVER_NAME;
		if (!isManagedPluginTools && !isManagedOpenClawTools || !("command" in server)) return server;
		changed = true;
		const env = [...server.env.filter((entry) => entry.name !== OPENCLAW_TOOLS_MCP_AGENT_SESSION_KEY_ENV), {
			name: OPENCLAW_TOOLS_MCP_AGENT_SESSION_KEY_ENV,
			value: sessionKey
		}];
		return {
			...server,
			env,
			args: params.agentId ? [
				...server.args,
				"--openclaw-agent-id",
				params.agentId
			] : server.args
		};
	});
	return changed ? nextServers : params.mcpServers;
}
function resolveBridgeSession(handle) {
	return handle.bridgeSession === void 0 ? handle : handle.bridgeSession;
}
/** OpenClaw-managed ACP runtime implementation backed by the upstream acpx runtime. */
var AcpxRuntime$1 = class {
	constructor(options, testOptions) {
		this.ownerAwareSessions = 1;
		this.launchCommandScope = new AsyncLocalStorage();
		this.sessionScope = new AsyncLocalStorage();
		this.launchLeaseScope = new AsyncLocalStorage();
		this.legacyBareSessionKeys = new Set(options.openclawLegacyBareSessionKeys);
		const { openclawProcessCleanup, ...delegateTestOptions } = testOptions ?? {};
		this.processCleanupDeps = openclawProcessCleanup;
		this.wrapperRoot = options.openclawWrapperRoot;
		this.gatewayInstanceId = options.openclawGatewayInstanceId;
		this.processLeaseStore = options.openclawProcessLeaseStore;
		this.pluginToolsMcpBridgeEnabled = options.pluginToolsMcpBridgeEnabled === true;
		this.openclawToolsMcpBridgeEnabled = options.openclawToolsMcpBridgeEnabled === true;
		this.managedToolsMcpBridgeEnabled = this.pluginToolsMcpBridgeEnabled || this.openclawToolsMcpBridgeEnabled;
		this.cwd = options.cwd;
		this.sessionStore = createResetAwareSessionStore(options.sessionStore, {
			gatewayInstanceId: this.gatewayInstanceId,
			leaseStore: this.processLeaseStore,
			launchScope: this.launchLeaseScope,
			wrapperRoot: this.wrapperRoot
		});
		this.agentRegistry = options.agentRegistry;
		this.scopedAgentRegistry = {
			resolve: (agentName) => {
				const launch = this.launchCommandScope.getStore();
				return launch && launch.agent === normalizeAgentName(agentName) && launch.command ? launch.command : this.agentRegistry.resolve(agentName);
			},
			list: () => this.agentRegistry.list()
		};
		const createDelegate = (probeAgent = options.probeAgent) => new AcpxRuntime({
			...options,
			probeAgent,
			sessionStore: this.sessionStore,
			agentRegistry: this.scopedAgentRegistry,
			sessionPermissions: (context) => {
				const permissions = options.sessionPermissions?.(context);
				const session = this.sessionScope.getStore();
				return {
					...permissions,
					...session?.native ? { permissionMode: "approve-all" } : {},
					...session === null || session?.native ? { onPermissionRequest: async () => ({ outcome: "cancel" }) } : {}
				};
			},
			mcpServers: (context) => {
				const servers = typeof options.mcpServers === "function" ? options.mcpServers(context) : options.mcpServers ?? [];
				if (isOpenClawBridgeCommand(context.agentArgv ?? context.agentCommand)) return [];
				const target = this.sessionScope.getStore();
				if (target === null) return [];
				if (!this.managedToolsMcpBridgeEnabled) return servers;
				if (!target) throw new AcpRuntimeError("ACP_SESSION_INIT_FAILED", "ACP tool bridge has no session owner");
				return withManagedToolsMcpSessionEnv({
					pluginToolsEnabled: this.pluginToolsMcpBridgeEnabled,
					openclawToolsEnabled: this.openclawToolsMcpBridgeEnabled,
					mcpServers: servers,
					...target
				});
			},
			processLifecycle: {
				onBeforeSpawn: async (launch) => {
					await options.processLifecycle?.onBeforeSpawn?.(launch);
					await this.recordProcessLaunch(launch);
				},
				onSpawned: async (process) => {
					await this.recordProcessLaunch(process);
					await options.processLifecycle?.onSpawned?.(process);
				},
				onSpawnFailed: options.processLifecycle?.onSpawnFailed,
				onExit: options.processLifecycle?.onExit
			}
		}, delegateTestOptions);
		this.delegate = createDelegate();
		this.generationRegistry = new AcpxGenerationRegistry(this.sessionStore, this.delegate, createDelegate);
		this.probe = new AcpxRuntimeProbe({
			getAgent: () => normalizeAgentName(options.getProbeAgent?.() ?? options.probeAgent) ?? "codex",
			createRuntime: createDelegate,
			assertRunning: () => this.generationRegistry.assertRunning(),
			runWithLease: (agent, run) => this.runWithLaunchLease({
				agent,
				sessionKey: ACPX_PROBE_LEASE_SESSION_KEY,
				command: resolveAgentCommand({
					agentName: agent,
					agentRegistry: this.agentRegistry
				}),
				finalizeCompletedProbe: true,
				run
			})
		});
	}
	async runInGeneration(target, scope, run) {
		const release = this.generationRegistry.retainGenerationOperation(scope.generation, scope.recordId ?? target.acpxRecordId ?? scope.generation.resource);
		try {
			return await this.sessionScope.run(resolveBridgeSession(target), () => acpxOperationScope.run(scope, run));
		} finally {
			release();
		}
	}
	generationForHandle(handle) {
		const resource = assertAcpxSessionOwnerLocator({
			...handle,
			persistedHandle: handle
		}, this.legacyBareSessionKeys);
		const capturedGeneration = handle[acpxGenerationKey];
		return this.generationRegistry.fromCaptured(resource, capturedGeneration);
	}
	async loadOperationSnapshotForHandle(handle, generation, allowRetired = false) {
		const resource = generation.resource;
		if (!allowRetired) this.generationRegistry.assertCurrentGeneration(generation);
		const ownedRecord = generation.records.get(handle.acpxRecordId ?? resource);
		if (ownedRecord && (handle.acpxRecordId && ownedRecord.acpxRecordId !== handle.acpxRecordId || handle.backendSessionId && ownedRecord.acpSessionId && ownedRecord.acpSessionId !== handle.backendSessionId)) throw new AcpRuntimeError("ACP_TURN_FAILED", "ACP handle no longer owns this runtime generation.");
		let record = allowRetired ? generation.retired ? ownedRecord : await this.sessionStore.loadForClose(handle.acpxRecordId ?? resource) : await acpxOperationScope.run({ generation }, () => this.sessionStore.load(handle.acpxRecordId ?? resource));
		if (allowRetired && generation.retired && ownedRecord) record = ownedRecord;
		if (allowRetired && record) captureGenerationRecord(generation, record);
		if (!allowRetired) this.generationRegistry.assertCurrentGeneration(generation);
		if (record && (handle.acpxRecordId && handle.acpxRecordId !== record.acpxRecordId || handle.backendSessionId && record.acpSessionId && handle.backendSessionId !== record.acpSessionId)) throw new AcpRuntimeError("ACP_TURN_FAILED", "ACP handle no longer owns this runtime record.");
		const command = readRecordAgentCommand(record) ?? resolveAgentCommand({
			agentName: readAgentFromHandle(handle),
			agentRegistry: this.agentRegistry
		});
		const identity = readAcpxProcessLeaseIdentity(command);
		if (identity && this.processLeaseStore && this.gatewayInstanceId && this.wrapperRoot) {
			const lease = await this.processLeaseStore.load(identity.leaseId);
			if (identity.gatewayInstanceId !== this.gatewayInstanceId) throw new AcpRuntimeError("ACP_TURN_FAILED", `ACPX process lease ${identity.leaseId} belongs to another gateway`);
			if (lease && (lease.gatewayInstanceId !== identity.gatewayInstanceId || lease.sessionKey !== resolveAcpxSessionResource(handle) || lease.wrapperRoot !== this.wrapperRoot)) throw new AcpRuntimeError("ACP_TURN_FAILED", `ACPX process lease ${identity.leaseId} belongs to another session`);
		}
		if (!allowRetired) this.generationRegistry.assertCurrentGeneration(generation);
		return {
			record,
			command,
			generation
		};
	}
	async runWithOperationSnapshot(handle, run) {
		const generation = this.generationForHandle(handle);
		return await this.runInGeneration(handle, { generation }, async () => {
			const snapshot = await this.loadOperationSnapshotForHandle(handle, generation);
			this.generationRegistry.assertCurrentGeneration(generation);
			return await this.runInGeneration(handle, {
				generation,
				recordId: snapshot.record?.acpxRecordId
			}, () => run(snapshot));
		});
	}
	resolveDelegateForOperationSnapshot(handle, snapshot) {
		return this.generationRegistry.resolveDelegate(snapshot.generation, snapshot.generation.nativeTools ?? resolveBridgeSession(handle)?.native === true);
	}
	async readReusablePersistentSessionCommand(params) {
		if (params.mode !== "persistent" || !params.command) return;
		const existing = await this.sessionStore.load(params.sessionKey);
		if (!existing || readRecordResetOnNextEnsure(existing)) return;
		const recordCwd = readRecordCwd(existing);
		if (!recordCwd || resolve(recordCwd) !== resolve(params.cwd?.trim() || this.cwd)) return;
		const recordCommand = readRecordAgentCommand(existing);
		if (!recordCommand) return;
		const leaseIdentity = readAcpxProcessLeaseIdentity(recordCommand);
		if (leaseIdentity && leaseIdentity.gatewayInstanceId !== this.gatewayInstanceId) return;
		const stableRecordCommand = leaseIdentity ? withAcpxLeaseArgs({
			command: params.command,
			leaseId: leaseIdentity.leaseId,
			gatewayInstanceId: leaseIdentity.gatewayInstanceId
		}) : params.command;
		if (!isDeepStrictEqual(splitCommandParts(recordCommand), splitCommandParts(stableRecordCommand))) return;
		return !params.resumeSessionId || existing.acpSessionId === params.resumeSessionId ? recordCommand : void 0;
	}
	async runWithLaunchLease(params) {
		if (!params.command || !this.wrapperRoot || !this.gatewayInstanceId || !this.processLeaseStore || !isOpenClawLeaseAwareAcpxProcessCommand({
			command: params.command,
			wrapperRoot: this.wrapperRoot
		})) return await this.launchCommandScope.run({
			agent: normalizeAgentName(params.agent) ?? params.agent,
			command: params.reusableCommand ?? params.command
		}, params.run);
		const reusableIdentity = readAcpxProcessLeaseIdentity(params.reusableCommand);
		const leaseId = reusableIdentity?.gatewayInstanceId === this.gatewayInstanceId ? reusableIdentity.leaseId : params.finalizeCompletedProbe ? `probe-${hashAcpxProcessCommand(`${this.gatewayInstanceId}\0${extractGeneratedWrapperPath(params.command)}`)}` : randomUUID();
		const leasedCommand = withAcpxLeaseArgs({
			command: params.command,
			leaseId,
			gatewayInstanceId: this.gatewayInstanceId
		});
		const launch = {
			leaseId,
			gatewayInstanceId: this.gatewayInstanceId,
			sessionKey: params.sessionKey,
			wrapperRoot: this.wrapperRoot,
			resolvedCommand: params.reusableCommand ?? leasedCommand,
			leasedCommand
		};
		const result = await this.launchLeaseScope.run(launch, () => this.launchCommandScope.run({
			agent: normalizeAgentName(params.agent) ?? params.agent,
			command: launch.resolvedCommand
		}, params.run));
		if (params.finalizeCompletedProbe) await cleanupOpenClawOwnedAcpxPendingLease({
			leaseId,
			gatewayInstanceId: launch.gatewayInstanceId,
			wrapperRoot: launch.wrapperRoot,
			wrapperPath: extractGeneratedWrapperPath(leasedCommand),
			deps: this.processCleanupDeps
		});
		return result;
	}
	async recordProcessLaunch(process) {
		const command = [process.command, ...process.args];
		const identity = readAcpxProcessLeaseIdentity(command);
		if (!identity || !this.processLeaseStore || !this.wrapperRoot) return;
		const sessionKey = process.scope.kind === "runtime-session" ? process.scope.sessionKey : ACPX_PROBE_LEASE_SESSION_KEY;
		const existing = await this.processLeaseStore.load(identity.leaseId);
		if (identity.gatewayInstanceId !== this.gatewayInstanceId || existing && (existing.gatewayInstanceId !== identity.gatewayInstanceId || existing.sessionKey !== sessionKey || existing.wrapperRoot !== this.wrapperRoot)) throw new AcpRuntimeError("ACP_SESSION_INIT_FAILED", "ACP process lease belongs to another owner");
		if (!isOpenClawLeaseAwareAcpxProcessCommand({
			command,
			wrapperRoot: this.wrapperRoot
		})) throw new AcpRuntimeError("ACP_SESSION_INIT_FAILED", "ACP process lease has no owned wrapper");
		await this.processLeaseStore.save({
			...identity,
			sessionKey,
			wrapperRoot: this.wrapperRoot,
			wrapperPath: extractGeneratedWrapperPath(command),
			rootPid: "pid" in process ? process.pid : 0,
			commandHash: hashAcpxProcessCommand(command),
			startedAt: "startedAt" in process ? Date.parse(process.startedAt) : Date.now(),
			state: "open"
		});
	}
	async withCodexWrapperDiagnostics(params) {
		try {
			return await params.run();
		} catch (error) {
			if (!isCodexAcpCommand(params.command) || !isGenericInternalAcpError(error)) throw error;
			const stderrTail = params.handle ? await this.readCodexTurnFailureStderr({ handle: params.handle }) : await readCodexWrapperStderrTail({
				wrapperRoot: this.wrapperRoot,
				leaseId: this.launchLeaseScope.getStore()?.leaseId
			});
			if (!stderrTail) throw error;
			throw new AcpRuntimeError(params.fallbackCode, `Internal error: ${stderrTail}`, { cause: error });
		}
	}
	async readCodexTurnFailureStderr(params) {
		const record = await this.sessionStore.load(params.handle.acpxRecordId ?? resolveAcpxSessionResource(params.handle));
		return readCodexWrapperStderrTail({
			wrapperRoot: this.wrapperRoot,
			leaseId: readOpenClawLeaseIdFromRecord(record)
		});
	}
	async findSession(input) {
		const resource = assertAcpxSessionOwnerLocator(input, this.legacyBareSessionKeys);
		const generation = this.generationRegistry.currentGeneration(resource);
		return this.runInGeneration(input, { generation }, async () => {
			const handle = await (generation.delegate ?? this.delegate).findSession({
				sessionKey: resource,
				agent: input.agent
			});
			this.generationRegistry.assertCurrentGeneration(generation);
			return handle ? {
				...handle,
				sessionKey: input.sessionKey,
				agentId: input.agentId,
				[acpxGenerationKey]: generation
			} : void 0;
		});
	}
	async shutdown() {
		const [sessions] = await Promise.allSettled([this.generationRegistry.shutdown(), this.probe.shutdown()]);
		if (sessions.status === "rejected") throw sessions.reason;
	}
	isHealthy() {
		return this.probe.isHealthy();
	}
	async doctor() {
		return await this.probe.doctor();
	}
	async ensureSession(input) {
		const resource = assertAcpxSessionOwnerLocator(input, this.legacyBareSessionKeys);
		return await this.generationRegistry.runAdmission(resource, (generation) => this.runInGeneration(input, { generation }, async () => {
			this.generationRegistry.assertCurrentGeneration(generation);
			const handle = {
				...await this.ensureSessionUnlocked(input, generation),
				[acpxGenerationKey]: generation
			};
			if (generation.retired && !this.generationRegistry.isStopping) await this.close({
				handle,
				reason: "superseded-initialization",
				discardPersistentState: true
			});
			this.generationRegistry.assertCurrentGeneration(generation);
			return handle;
		}));
	}
	async ensureSessionUnlocked(logicalInput, generation) {
		assertSupportedRuntimeSessionMode(logicalInput.mode);
		const command = logicalInput.agentCommand ?? resolveAgentCommand({
			agentName: logicalInput.agent,
			agentRegistry: this.agentRegistry
		});
		const delegate = this.generationRegistry.resolveDelegate(generation, resolveBridgeSession(logicalInput)?.native === true);
		const logicalTarget = {
			sessionKey: logicalInput.sessionKey,
			agentId: logicalInput.agentId,
			bridgeSession: logicalInput.bridgeSession
		};
		const input = {
			...logicalInput,
			sessionKey: resolveAcpxSessionResource(logicalInput)
		};
		const isCodexAcp = normalizeAgentName(input.agent) === CODEX_ACP_AGENT_ID && isCodexAcpCommand(command);
		const dropInheritedCodexMax = isCodexAcp && input.thinking === "max" && input.thinkingExplicit === false;
		const effectiveInput = dropInheritedCodexMax ? { ...input } : input;
		if (dropInheritedCodexMax) delete effectiveInput.thinking;
		const claudeModelOverride = isClaudeAcpCommand(command) ? normalizeClaudeAcpModelOverride(input.model) : void 0;
		const codexClassification = isCodexAcp ? classifyCodexAcpModelRequest(effectiveInput.model, effectiveInput.thinking) : void 0;
		if (codexClassification?.kind === "unsupported" && input.modelExplicit) failUnsupportedCodexAcpModel(input.model ?? "");
		const classifiedCodexOverride = codexClassification?.kind === "override" ? codexClassification.override : codexClassification?.thinkingOverride;
		const codexModelOverride = classifiedCodexOverride && Object.keys(classifiedCodexOverride).length > 0 ? classifiedCodexOverride : void 0;
		const requestedModel = effectiveInput.model?.trim();
		const appliedModel = isCodexAcp && requestedModel ? codexModelOverride?.model ? {
			kind: "applied",
			model: requestedModel
		} : { kind: "dropped" } : void 0;
		const ensureInput = isCodexAcp ? withCodexSessionModel(effectiveInput, codexModelOverride) : claudeModelOverride ? {
			...effectiveInput,
			model: claudeModelOverride
		} : effectiveInput;
		const stableLaunchCommand = codexModelOverride && command ? appendCodexAcpConfigOverrides(command, codexModelOverride) : command;
		const reusableCommand = await this.readReusablePersistentSessionCommand({
			sessionKey: input.sessionKey,
			mode: input.mode,
			cwd: input.cwd,
			command: stableLaunchCommand,
			resumeSessionId: input.resumeSessionId
		});
		return {
			...await this.runWithLaunchLease({
				agent: ensureInput.agent,
				sessionKey: ensureInput.sessionKey,
				command: stableLaunchCommand,
				reusableCommand,
				run: () => this.withCodexWrapperDiagnostics({
					command: stableLaunchCommand,
					fallbackCode: "ACP_SESSION_INIT_FAILED",
					run: () => codexModelOverride ? delegate.ensureSession(withAcpxSessionOptions(ensureInput)) : ensureSessionWithModelRef((request) => {
						this.generationRegistry.assertCurrentGeneration(generation);
						return delegate.ensureSession(request);
					}, ensureInput)
				})
			}),
			...logicalTarget,
			...appliedModel ? { appliedModel } : {},
			...dropInheritedCodexMax ? { appliedThinking: { kind: "dropped" } } : {}
		};
	}
	async *runTurn(input) {
		const turn = this.startTurn(input);
		turn.result.catch(() => {});
		let completed = false;
		try {
			yield* turn.events;
			const result = await turn.result;
			completed = true;
			yield result.status === "failed" ? {
				type: "error",
				...result.error
			} : {
				type: "done",
				...result.stopReason ? { stopReason: result.stopReason } : {}
			};
		} finally {
			if (!completed) {
				await turn.cancel({ reason: "stream-closed" }).catch(() => {});
				await turn.closeStream({ reason: "stream-closed" }).catch(() => {});
				await turn.result.catch(() => {});
			}
		}
	}
	startTurn(input) {
		const withTurnDiagnostics = (command, run) => this.withCodexWrapperDiagnostics({
			command,
			handle: input.handle,
			fallbackCode: "ACP_TURN_FAILED",
			run
		});
		const turnPromise = this.runWithOperationSnapshot(input.handle, (snapshot) => {
			const { command, generation } = snapshot;
			this.generationRegistry.assertCurrentGeneration(generation);
			const delegate = this.resolveDelegateForOperationSnapshot(input.handle, snapshot);
			return this.sessionScope.run(resolveBridgeSession(input.handle), () => acpxOperationScope.run({ generation }, () => withTurnDiagnostics(command, async () => {
				const release = this.generationRegistry.retainGenerationOperation(generation, snapshot.record?.acpxRecordId ?? input.handle.acpxRecordId ?? generation.resource);
				try {
					const turn = delegate.startTurn({
						...toAcpxResourceInput(input),
						timeoutMs: 0
					});
					turn.result.then(release, release);
					return {
						command,
						turn
					};
				} catch (error) {
					release();
					throw error;
				}
			})));
		});
		return {
			requestId: input.requestId,
			get promptStarted() {
				return turnPromise.then(({ turn }) => turn.promptStarted);
			},
			events: { async *[Symbol.asyncIterator]() {
				const { command, turn } = await turnPromise;
				try {
					yield* turn.events;
				} catch (error) {
					if (!isGenericInternalAcpError(error)) throw error;
					await withTurnDiagnostics(command, () => Promise.reject(error));
				}
			} },
			result: turnPromise.then(({ command, turn }) => withTurnDiagnostics(command, async () => {
				const result = await turn.result;
				if (result.status !== "failed" || !isCodexAcpCommand(command) || !isGenericInternalAcpErrorMessage(result.error.message)) return result;
				const stderrTail = await this.readCodexTurnFailureStderr({ handle: input.handle });
				if (!stderrTail) return result;
				return {
					status: "failed",
					error: {
						...result.error,
						code: "ACP_TURN_FAILED",
						message: `Internal error: ${stderrTail}`
					}
				};
			})),
			cancel(inputArgs) {
				return turnPromise.then(({ turn }) => turn.cancel(inputArgs));
			},
			closeStream(inputArgs) {
				return turnPromise.then(({ turn }) => turn.closeStream(inputArgs));
			}
		};
	}
	async getCapabilities(input) {
		const capabilities = await this.delegate.getCapabilities(input?.handle ? toAcpxResourceInput({ handle: input.handle }) : input);
		return {
			...capabilities,
			controls: capabilities.controls.filter((control) => control !== "session/set_model")
		};
	}
	async getStatus(input) {
		return this.runWithOperationSnapshot(input.handle, (snapshot) => this.resolveDelegateForOperationSnapshot(input.handle, snapshot).getStatus(toAcpxResourceInput(input)));
	}
	async setModel(input) {
		await this.runWithOperationSnapshot(input.handle, (snapshot) => {
			input.signal?.throwIfAborted();
			input.assertActive?.();
			return this.resolveDelegateForOperationSnapshot(input.handle, snapshot).setModel(toAcpxResourceInput(input));
		});
	}
	async setMode(input) {
		await this.runWithOperationSnapshot(input.handle, (snapshot) => this.resolveDelegateForOperationSnapshot(input.handle, snapshot).setMode(toAcpxResourceInput(input)));
	}
	async setConfigOption(input) {
		return await this.runWithOperationSnapshot(input.handle, (snapshot) => this.setConfigOptionUnlocked(input, snapshot));
	}
	async setConfigOptionUnlocked(logicalInput, snapshot) {
		const { command } = snapshot;
		const delegate = this.resolveDelegateForOperationSnapshot(logicalInput.handle, snapshot);
		const input = toAcpxResourceInput(logicalInput);
		const key = input.key.trim().toLowerCase();
		const isCodexAcp = isCodexAcpCommand(command);
		if (WIRE_TIMEOUT_CONFIG_KEYS.has(key) && (isCodexAcp || isClaudeAcpCommand(command))) return;
		if (isCodexAcp) {
			if (key === "model") {
				const classification = classifyCodexAcpModelRequest(input.value);
				if (classification.kind === "unsupported") failUnsupportedCodexAcpModel(input.value);
				const { override } = classification;
				const modelResult = override.model ? await delegate.setConfigOption({
					...input,
					key: "model",
					value: override.model
				}) : void 0;
				this.generationRegistry.assertCurrentGeneration(snapshot.generation);
				if (override.reasoningEffort) return await delegate.setConfigOption({
					...input,
					key: "reasoning_effort",
					value: override.reasoningEffort
				});
				return modelResult;
			}
			if (key === "thinking" || key === "thought_level" || key === "reasoning_effort") {
				const classification = classifyCodexAcpModelRequest(void 0, input.value);
				const reasoningEffort = classification.kind === "override" ? classification.override.reasoningEffort : void 0;
				if (!reasoningEffort) throw new AcpRuntimeError("ACP_BACKEND_UNSUPPORTED_CONTROL", "Clearing Codex reasoning effort on an existing session is unsupported. Choose a supported explicit effort; the current effort is unchanged.");
				return await delegate.setConfigOption({
					...input,
					key: "reasoning_effort",
					value: reasoningEffort
				});
			}
		}
		if (isClaudeAcpCommand(command) && key === "model") return await delegate.setConfigOption({
			...input,
			value: normalizeClaudeAcpModelOverride(input.value) ?? input.value
		});
		if (key === "model") return await withOpenClawModelRef(input.value, (value) => {
			this.generationRegistry.assertCurrentGeneration(snapshot.generation);
			return delegate.setConfigOption({
				...input,
				value
			});
		});
		return await delegate.setConfigOption(input);
	}
	async cancel(input) {
		await this.runWithOperationSnapshot(input.handle, (snapshot) => this.resolveDelegateForOperationSnapshot(input.handle, snapshot).cancel(toAcpxResourceInput(input)));
	}
	async prepareFreshSession(input) {
		if ("handle" in input) {
			await this.closeSession({
				handle: input.handle,
				reason: "prepare-fresh"
			}, "prepare-fresh");
			return;
		}
		const resource = assertAcpxSessionOwnerLocator(input, this.legacyBareSessionKeys);
		this.generationRegistry.prepareFresh(resource);
		this.legacyBareSessionKeys.delete(resource);
	}
	async close(input) {
		await this.closeSession(input, "close");
	}
	async closeSession(input, intent) {
		const generation = this.generationForHandle(input.handle);
		await this.runInGeneration(input.handle, { generation }, async () => {
			const snapshot = await this.loadOperationSnapshotForHandle(input.handle, generation, true);
			const delegate = this.resolveDelegateForOperationSnapshot(input.handle, snapshot);
			await acpxOperationScope.run({
				generation,
				closeRecord: snapshot.record
			}, async () => {
				if ((intent === "prepare-fresh" || input.discardPersistentState) && decodeAcpxRuntimeHandleState(input.handle.runtimeSessionName)?.mode !== "oneshot") {
					this.generationRegistry.retireGeneration(generation);
					this.legacyBareSessionKeys.delete(generation.resource);
				}
				const cleanup = await prepareAcpxProcessCleanup({
					record: snapshot.record,
					command: snapshot.command,
					sessionKey: resolveAcpxSessionResource(input.handle),
					gatewayInstanceId: this.gatewayInstanceId,
					wrapperRoot: this.wrapperRoot,
					leaseStore: this.processLeaseStore,
					deps: this.processCleanupDeps
				}).catch((error) => async () => {
					throw error;
				});
				try {
					if (intent === "prepare-fresh") await delegate.prepareFreshSession(toAcpxResourceInput(input));
					else await delegate.close(toAcpxResourceInput(input));
				} finally {
					await cleanup();
				}
				const recordId = snapshot.record?.acpxRecordId ?? input.handle.acpxRecordId ?? generation.resource;
				const currentRecord = generation.records.get(recordId);
				if (!currentRecord || currentRecord.acpSessionId === snapshot.record?.acpSessionId && currentRecord.createdAt === snapshot.record?.createdAt) {
					generation.records.delete(recordId);
					if (generation.activeRecordOperations.has(recordId)) generation.closedRecordIds.add(recordId);
				}
				generation.closeCompleted = true;
			});
		});
	}
};
//#endregion
//#region extensions/acpx/src/service.ts
/**
* ACPX plugin service lifecycle. It resolves config, prepares isolated adapter
* wrappers, registers the ACP backend, and manages startup/cleanup probes.
*/
const ENABLE_STARTUP_PROBE_ENV = "OPENCLAW_ACPX_RUNTIME_STARTUP_PROBE";
const SKIP_RUNTIME_PROBE_ENV = "OPENCLAW_SKIP_ACPX_RUNTIME_PROBE";
const MAX_ACPX_TOKIO_WORKER_THREADS = 8;
function resolveAcpxTimerTimeoutMs(timeoutSeconds) {
	if (timeoutSeconds === void 0) return;
	return finiteSecondsToTimerSafeMilliseconds(timeoutSeconds) ?? 1;
}
function resolveAgentProcessEnv() {
	if (process.env.TOKIO_WORKER_THREADS?.trim()) return;
	return { TOKIO_WORKER_THREADS: String(Math.min(availableParallelism(), MAX_ACPX_TOKIO_WORKER_THREADS)) };
}
async function createDefaultRuntime(params) {
	const names = await fs$1.readdir(path.join(params.pluginConfig.stateDir, "sessions")).catch((error) => {
		if (error instanceof Error && "code" in error && error.code === "ENOENT") return [];
		throw error;
	});
	const legacyBareSessionKeys = /* @__PURE__ */ new Set();
	for (const name of names) {
		if (!name.endsWith(".json")) continue;
		const recordId = decodeURIComponent(name.slice(0, -5));
		if (!recordId.startsWith("agent:") && !recordId.startsWith(".openclaw-owner-") && !recordId.includes(":oneshot:")) legacyBareSessionKeys.add(recordId.toLowerCase());
	}
	return new AcpxRuntime$1({
		cwd: params.pluginConfig.cwd,
		agentProcessEnv: resolveAgentProcessEnv(),
		openclawLegacyBareSessionKeys: legacyBareSessionKeys,
		openclawGatewayInstanceId: params.gatewayInstanceId,
		openclawProcessLeaseStore: params.processLeaseStore,
		openclawWrapperRoot: params.wrapperRoot,
		sessionStore: createFileSessionStore({ stateDir: params.pluginConfig.stateDir }),
		agentRegistry: createAgentRegistry({ overrides: params.pluginConfig.agents }),
		getProbeAgent: params.getProbeAgent,
		mcpServers: toAcpMcpServers(params.pluginConfig.mcpServers),
		pluginToolsMcpBridgeEnabled: params.pluginConfig.pluginToolsMcpBridge,
		openclawToolsMcpBridgeEnabled: params.pluginConfig.openClawToolsMcpBridge,
		permissionMode: params.pluginConfig.permissionMode,
		nonInteractivePermissions: params.pluginConfig.nonInteractivePermissions,
		elicitationModes: ["form", "url"],
		timeoutMs: resolveAcpxTimerTimeoutMs(params.pluginConfig.timeoutSeconds)
	});
}
function formatDoctorFailureMessage(report) {
	const detailText = report.details?.map((detail) => detail.trim()).filter(Boolean).join("; ");
	return detailText ? `${report.message} (${detailText})` : report.message;
}
async function measureAcpxStartup(ctx, name, run) {
	return ctx.startupTrace ? await ctx.startupTrace.measure(name, run) : await run();
}
function shouldProbeRuntimeAtStartup(env = process.env) {
	return env[ENABLE_STARTUP_PROBE_ENV] !== "0" && env[SKIP_RUNTIME_PROBE_ENV] !== "1";
}
async function withStartupProbeTimeout(params) {
	let timeout;
	const timeoutMs = resolveAcpxTimerTimeoutMs(params.timeoutSeconds) ?? 1;
	try {
		return await Promise.race([params.promise, new Promise((_, reject) => {
			timeout = setTimeout(() => {
				reject(/* @__PURE__ */ new Error(`embedded acpx runtime backend startup probe timed out after ${params.timeoutSeconds}s`));
			}, timeoutMs);
			timeout.unref?.();
		})]);
	} finally {
		if (timeout) clearTimeout(timeout);
	}
}
function openGatewayInstanceStateStore(openKeyedStore) {
	return openKeyedStore({
		namespace: ACPX_GATEWAY_INSTANCE_NAMESPACE,
		maxEntries: 1
	});
}
async function resolveGatewayInstanceId(openKeyedStore) {
	const store = openGatewayInstanceStateStore(openKeyedStore);
	const existing = normalizeAcpxGatewayInstanceRecord(await store.lookup(ACPX_GATEWAY_INSTANCE_KEY));
	if (existing) return existing.instanceId;
	const next = randomUUID();
	await store.register(ACPX_GATEWAY_INSTANCE_KEY, {
		instanceId: next,
		createdAt: Date.now()
	});
	return next;
}
async function reapOpenAcpxProcessLeases(params) {
	const assertCurrent = () => {
		params.assertCurrent?.();
		params.deps?.assertCurrent?.();
	};
	const deps = {
		...params.deps,
		assertCurrent
	};
	const leases = await params.leaseStore.listOpen(params.gatewayInstanceId);
	const inspectedPids = [];
	const terminatedPids = [];
	const legacyWrapperRoots = /* @__PURE__ */ new Set();
	for (const lease of leases) {
		if (lease.rootPid <= 0) {
			legacyWrapperRoots.add(lease.wrapperRoot);
			assertCurrent();
			await params.leaseStore.markState(lease.leaseId, "closing");
			assertCurrent();
			const result = await cleanupOpenClawOwnedAcpxPendingLease({
				leaseId: lease.leaseId,
				gatewayInstanceId: lease.gatewayInstanceId,
				wrapperRoot: lease.wrapperRoot,
				wrapperPath: lease.wrapperPath,
				deps
			});
			inspectedPids.push(...result.inspectedPids);
			terminatedPids.push(...result.terminatedPids);
			const retryableEvidenceFailure = result.skippedReason === "ambiguous-root" || result.skippedReason === "process-list-unavailable" || result.skippedReason === "unsupported-platform" || result.skippedReason === "unverified-root" || lease.sessionKey === "openclaw:acpx:probe" && result.skippedReason === "missing-root";
			assertCurrent();
			await params.leaseStore.markState(lease.leaseId, retryableEvidenceFailure ? "open" : result.terminatedPids.length > 0 ? "closed" : "lost");
			continue;
		}
		assertCurrent();
		await params.leaseStore.markState(lease.leaseId, "closing");
		assertCurrent();
		const result = await cleanupOpenClawOwnedAcpxProcessTree({
			rootPid: lease.rootPid,
			expectedLeaseId: lease.leaseId,
			expectedGatewayInstanceId: lease.gatewayInstanceId,
			wrapperRoot: lease.wrapperRoot,
			deps
		});
		inspectedPids.push(...result.inspectedPids);
		terminatedPids.push(...result.terminatedPids);
		assertCurrent();
		await params.leaseStore.markState(lease.leaseId, result.skippedReason === "process-list-unavailable" || result.skippedReason === "unsupported-platform" ? "open" : result.terminatedPids.length > 0 ? "closed" : "lost");
	}
	for (const wrapperRoot of legacyWrapperRoots) {
		assertCurrent();
		const legacyResult = await reapStaleOpenClawOwnedAcpxOrphans({
			wrapperRoot,
			deps
		});
		inspectedPids.push(...legacyResult.inspectedPids);
		terminatedPids.push(...legacyResult.terminatedPids);
	}
	return {
		inspectedPids,
		terminatedPids
	};
}
/** Create the ACPX plugin service that owns runtime registration and cleanup. */
function createAcpxRuntimeService(params) {
	let runtime = null;
	let recoverProcesses;
	let recoveryPromise;
	let lifecycleRevision = 0;
	const promote = async (ctx, assertOwner = params.assertCurrent) => {
		const recover = recoverProcesses;
		if (!recover) throw new Error("ACPX runtime service is not initialized");
		const revision = lifecycleRevision;
		const assertCurrent = () => {
			if (revision !== lifecycleRevision || recoverProcesses !== recover) throw new Error("ACPX runtime service stopped during recovery");
			assertOwner?.();
		};
		assertCurrent();
		recoveryPromise ??= measureAcpxStartup(ctx, "process-leases.reap", async () => {
			const result = await recover(assertCurrent);
			assertCurrent();
			if (result.terminatedPids.length > 0) ctx.logger.info(`reaped ${result.terminatedPids.length} stale OpenClaw-owned ACPX processes`);
		});
		await recoveryPromise;
		assertCurrent();
	};
	return {
		id: "acpx-runtime",
		promote,
		async start(ctx) {
			if (process.env.OPENCLAW_SKIP_ACPX_RUNTIME === "1") {
				ctx.logger.info("skipping embedded acpx runtime backend (OPENCLAW_SKIP_ACPX_RUNTIME=1)");
				return;
			}
			const openKeyedStore = params.openKeyedStore;
			if (!openKeyedStore) throw new Error("ACPX runtime service requires plugin keyed state");
			const basePluginConfig = await measureAcpxStartup(ctx, "config.resolve", () => resolveAcpxPluginConfig({
				rawConfig: params.pluginConfig,
				workspaceDir: ctx.workspaceDir
			}));
			const pluginConfig = await measureAcpxStartup(ctx, "config.prepare-codex-auth", () => prepareAcpxCodexAuthConfig({
				pluginConfig: basePluginConfig,
				stateDir: ctx.stateDir,
				logger: ctx.logger
			}));
			const wrapperRoot = path.join(ctx.stateDir, "acpx");
			await measureAcpxStartup(ctx, "filesystem.prepare", async () => {
				await fs$1.mkdir(pluginConfig.stateDir, { recursive: true });
				await fs$1.mkdir(wrapperRoot, { recursive: true });
			});
			const gatewayInstanceId = await measureAcpxStartup(ctx, "gateway-instance-id", () => resolveGatewayInstanceId(openKeyedStore));
			const processLeaseStore = createAcpxProcessLeaseStore({ store: openAcpxProcessLeaseStateStore(openKeyedStore) });
			recoverProcesses = (assertCurrent) => reapOpenAcpxProcessLeases({
				gatewayInstanceId,
				leaseStore: processLeaseStore,
				deps: params.processCleanupDeps,
				assertCurrent
			});
			if (params.startupPurpose !== "inspection") await promote(ctx);
			const getAllowedAgents = params.getAllowedAgents ?? (() => ctx.config.acp?.allowedAgents);
			const getProbeAgent = () => pluginConfig.probeAgent ?? getAllowedAgents()?.map(normalizeLowercaseStringOrEmpty).find(Boolean);
			const startedRuntime = await measureAcpxStartup(ctx, "runtime.create", () => (params.runtimeFactory ?? createDefaultRuntime)({
				pluginConfig,
				getProbeAgent,
				gatewayInstanceId,
				processLeaseStore,
				wrapperRoot,
				logger: ctx.logger
			}));
			runtime = startedRuntime;
			const shouldProbeRuntime = params.probeAtStartup !== false && shouldProbeRuntimeAtStartup();
			ctx.startupTrace?.detail?.("probe-policy", [["startupProbeEnabledCount", shouldProbeRuntime ? 1 : 0], ["probeAgent", getProbeAgent() ?? "default"]]);
			await measureAcpxStartup(ctx, "backend.register", () => {
				const backend = {
					runtime: startedRuntime,
					...shouldProbeRuntime ? { healthy: () => runtime?.isHealthy() ?? false } : {}
				};
				params.backendLifecycle.publish(backend);
				ctx.logger.info(`embedded acpx runtime backend registered (cwd: ${pluginConfig.cwd})`);
			});
			if (!shouldProbeRuntime) return;
			lifecycleRevision += 1;
			const currentRevision = lifecycleRevision;
			try {
				const doctorReport = await measureAcpxStartup(ctx, "probe.availability", () => withStartupProbeTimeout({
					promise: startedRuntime.doctor(),
					timeoutSeconds: pluginConfig.timeoutSeconds ?? 120
				}));
				if (currentRevision !== lifecycleRevision) return;
				if (doctorReport.ok) {
					ctx.startupTrace?.detail?.("probe.result", [["healthyCount", 1]]);
					ctx.logger.info("embedded acpx runtime backend ready");
					return;
				}
				ctx.startupTrace?.detail?.("probe.result", [["healthyCount", 0]]);
				ctx.logger.warn(`embedded acpx runtime backend probe failed: ${formatDoctorFailureMessage(doctorReport)}`);
			} catch (err) {
				if (currentRevision !== lifecycleRevision) return;
				ctx.startupTrace?.detail?.("probe.result", [["healthyCount", 0]]);
				ctx.logger.warn(`embedded acpx runtime setup failed: ${formatErrorMessage(err)}`);
			}
		},
		async stop(_ctx) {
			lifecycleRevision += 1;
			if (runtime) {
				params.backendLifecycle.retract(runtime);
				const [shutdown] = await Promise.allSettled([runtime.shutdown(), recoveryPromise]);
				if (shutdown.status === "rejected") throw shutdown.reason;
			} else await recoveryPromise?.catch(() => void 0);
			runtime = null;
			recoverProcesses = void 0;
			recoveryPromise = void 0;
		}
	};
}
//#endregion
export { createAcpxRuntimeService };
