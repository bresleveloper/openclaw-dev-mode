import { t as pruneMapToMaxSize } from "./map-size-BlrH_CnE.mjs";
import "./src-Djeo9OvP.mjs";
import { t as expectDefined } from "./expect-lbe3Hgrh.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { t as hasErrnoCode } from "./errno-FR4CRyya.mjs";
import { p as isPathInside } from "./includes-rygJQufe.mjs";
import { t as escapeRegExp } from "./regexp-BZyMFTlj.mjs";
import "./errors-DPfGDWk1.mjs";
import { h as readLocalFileSafely, t as FsSafeError } from "./fs-safe-6Z4UiMS4.mjs";
import fs from "node:fs/promises";
import path from "node:path";
import { walkDirectory } from "@openclaw/fs-safe/walk";
//#region src/skills/security/scan-evidence.ts
const LITERAL_SECRET_PATTERN = /\b(?:sk-(?:proj-|svcacct-)?[A-Za-z0-9_-]{32,}|gh[pousr]_[A-Za-z0-9]{20,}|github_pat_[A-Za-z0-9_]{20,}|xox[baprs]-[A-Za-z0-9-]{20,}|AIza[0-9A-Za-z_-]{35})(?![A-Za-z0-9_-])|-----BEGIN ([A-Z0-9 ]*PRIVATE KEY)-----\r?\n(?=(?:[A-Za-z0-9+/=]\r?\n?){48,}-----END \1-----)(?:[A-Za-z0-9+/=]+\r?\n)+-----END \1-----/;
const LITERAL_SECRET_SKILL_CONTENT_RULE = {
	ruleId: "literal-secret",
	severity: "critical",
	message: "Skill text contains a recognized literal credential",
	pattern: LITERAL_SECRET_PATTERN
};
function formatScanEvidence(evidence) {
	const normalized = evidence.trim();
	return LITERAL_SECRET_PATTERN.test(normalized) ? "[REDACTED CREDENTIAL]" : normalized.length > 120 ? `${truncateUtf16Safe(normalized, 120)}…` : normalized;
}
//#endregion
//#region src/skills/security/scanner.ts
const SCANNABLE_EXTENSIONS = /* @__PURE__ */ new Set([
	".js",
	".ts",
	".mjs",
	".cjs",
	".mts",
	".cts",
	".jsx",
	".tsx"
]);
const DEFAULT_MAX_SCAN_FILES = 500;
const DEFAULT_MAX_FILE_BYTES = 1048576;
const MAX_LINE_RULE_FINDINGS_PER_RULE = 32;
const MAX_SCAN_DIRECTORY_ENTRIES = 1e5;
const FILE_SCAN_CACHE = /* @__PURE__ */ new Map();
function isScannable(filePath) {
	return SCANNABLE_EXTENSIONS.has(path.extname(filePath).toLowerCase());
}
function fileScanIdentity({ dev, ino, size, mtimeMs, ctimeMs }) {
	return {
		dev,
		ino,
		size,
		mtimeMs,
		ctimeMs
	};
}
function sameFileScanIdentity(left, right) {
	return left.dev === right.dev && left.ino === right.ino && left.size === right.size && left.mtimeMs === right.mtimeMs && left.ctimeMs === right.ctimeMs;
}
function setCachedFileScanResult(filePath, entry) {
	pruneMapToMaxSize(FILE_SCAN_CACHE, 4999);
	FILE_SCAN_CACHE.set(filePath, entry);
	return {
		scanned: entry.scanned,
		findings: entry.findings
	};
}
const LINE_RULES = [
	{
		ruleId: "dangerous-exec",
		severity: "critical",
		message: "Shell command execution detected (child_process)",
		pattern: /\b(exec|execSync|spawn|spawnSync|execFile|execFileSync)\s*\(|["'](exec|execSync|spawn|spawnSync|execFile|execFileSync)["']\s*\]\s*\(/,
		requiresContext: /child_process/
	},
	{
		ruleId: "dynamic-code-execution",
		severity: "critical",
		message: "Dynamic code execution detected",
		pattern: /\beval\s*\(|new\s+Function\s*\(/
	},
	{
		ruleId: "crypto-mining",
		severity: "critical",
		message: "Possible crypto-mining reference detected",
		pattern: /stratum\+tcp|stratum\+ssl|coinhive|cryptonight|xmrig/i
	},
	{
		ruleId: "suspicious-network",
		severity: "warn",
		message: "WebSocket connection to non-standard port",
		pattern: /new\s+WebSocket\s*\(\s*["']wss?:\/\/[^"']*:(\d+)/
	}
];
const STANDARD_PORTS = /* @__PURE__ */ new Set([
	80,
	443,
	8080,
	8443,
	3e3
]);
const NETWORK_SEND_CONTEXT_PATTERN = /\bfetch\s*\(|\bpost\s*\(|\.\s*post\s*\(|http\.request\s*\(/i;
const SOURCE_RULES = [
	{
		ruleId: "potential-exfiltration",
		severity: "warn",
		message: "File read combined with network send — possible data exfiltration",
		pattern: /readFileSync|readFile/,
		requiresContext: NETWORK_SEND_CONTEXT_PATTERN
	},
	{
		ruleId: "obfuscated-code",
		severity: "warn",
		message: "Hex-encoded string sequence detected (possible obfuscation)",
		pattern: /(\\x[0-9a-fA-F]{2}){6,}/
	},
	{
		ruleId: "obfuscated-code",
		severity: "warn",
		message: "Large base64 payload with decode call detected (possible obfuscation)",
		pattern: /(?:atob|Buffer\.from)\s*\(\s*["'][A-Za-z0-9+/=]{200,}["']/
	},
	{
		ruleId: "env-harvesting",
		severity: "critical",
		message: "Environment variable access combined with network send — possible credential harvesting",
		pattern: /process\.env/,
		requiresContext: NETWORK_SEND_CONTEXT_PATTERN,
		requiresContextWindowLines: 8
	}
];
const SKILL_CONTENT_RULES = [
	LITERAL_SECRET_SKILL_CONTENT_RULE,
	{
		ruleId: "shell-pipe-to-shell",
		severity: "critical",
		message: "Skill text includes pipe-to-shell install pattern",
		pattern: /\b(curl|wget)\b[^|\n]{0,120}\|\s*(sh|bash|zsh)\b/i
	},
	{
		ruleId: "secret-exfiltration",
		severity: "critical",
		message: "Skill text may exfiltrate environment variables",
		pattern: /\b(process\.env|env)\b.{0,80}\b(fetch|curl|wget|http|https)\b/i
	},
	{
		ruleId: "destructive-delete",
		severity: "warn",
		message: "Skill text contains broad destructive delete command",
		pattern: /\brm\s+-rf\s+(\/|\$HOME|~|\.)/i
	},
	{
		ruleId: "unsafe-permissions",
		severity: "warn",
		message: "Skill text contains unsafe permission change",
		pattern: /\bchmod\s+(-R\s+)?777\b/i
	}
];
const CHILD_PROCESS_EXEC_METHODS = /* @__PURE__ */ new Set([
	"exec",
	"execSync",
	"spawn",
	"spawnSync",
	"execFile",
	"execFileSync"
]);
function collectChildProcessBindings(source) {
	const methodAliases = /* @__PURE__ */ new Set();
	const namespaceAliases = /* @__PURE__ */ new Set();
	const esmNamed = /\bimport\s*\{([^}]*)\}\s*from\s*["'](?:node:)?child_process["']/g;
	const esmDefault = /\bimport\s+(\w+)\s+from\s*["'](?:node:)?child_process["']/g;
	const esmNamespace = /\bimport\s*\*\s*as\s+(\w+)\s+from\s*["'](?:node:)?child_process["']/g;
	const cjsDestructured = /\b(?:const|let|var)\s*\{([^}]*)\}\s*=\s*require\s*\(\s*["'](?:node:)?child_process["']\s*\)/g;
	const cjsNamespace = /\b(?:const|let|var)\s+(\w+)\s*=\s*require\s*\(\s*["'](?:node:)?child_process["']\s*\)/g;
	const collectSpecifiers = (specText) => {
		for (const rawSpec of specText.split(",")) {
			const spec = rawSpec.trim();
			const asMatch = spec.match(/^(\w+)\s+(?:as)\s+(\w+)$/) ?? spec.match(/^(\w+)\s*:\s*(\w+)$/);
			if (asMatch?.[1] && asMatch[2]) {
				if (CHILD_PROCESS_EXEC_METHODS.has(asMatch[1])) methodAliases.add(asMatch[2]);
			}
		}
	};
	for (const pattern of [esmNamed, cjsDestructured]) for (const match of source.matchAll(pattern)) collectSpecifiers(expectDefined(match[1], "child_process import specifiers"));
	for (const pattern of [
		esmDefault,
		esmNamespace,
		cjsNamespace
	]) for (const match of source.matchAll(pattern)) namespaceAliases.add(expectDefined(match[1], "child_process namespace"));
	return {
		methodAliases,
		namespaceAliases
	};
}
function matchAliasedChildProcessCalls(line, methodAliases) {
	const calls = [];
	for (const alias of methodAliases) {
		const pattern = new RegExp(`(?<![\\w.])${escapeRegExp(alias)}\\s*\\(`, "g");
		for (const callMatch of line.matchAll(pattern)) calls.push(callMatch.index);
	}
	return calls.toSorted((a, b) => a - b);
}
const LITERAL_NAMESPACE_RECEIVERS = /* @__PURE__ */ new Set([
	"cp",
	"childProcess",
	"child_process"
]);
function isBenignMemberExecMatch(line, match, namespaceAliases) {
	const command = match[1] ?? match[2];
	if (!command) return false;
	const matchIndex = match.index;
	const charAtMatch = line[matchIndex];
	let receiver;
	if (charAtMatch === "\"" || charAtMatch === "'") receiver = line.slice(0, matchIndex).match(/(\w+)\s*\[\s*$/)?.[1];
	else if (command === "exec" && matchIndex > 0 && line[matchIndex - 1] === ".") receiver = line.slice(0, matchIndex - 1).match(/(\w+)\s*$/)?.[1];
	else return false;
	return !receiver || !namespaceAliases.has(receiver) && !LITERAL_NAMESPACE_RECEIVERS.has(receiver);
}
function stripCommentsForHeuristics(source) {
	let stripped = "";
	let quote = null;
	let escaped = false;
	for (let i = 0; i < source.length; i++) {
		const ch = source[i] ?? "";
		const next = source[i + 1] ?? "";
		if (quote) {
			stripped += ch;
			if (escaped) escaped = false;
			else if (ch === "\\") escaped = true;
			else if (ch === quote) quote = null;
			continue;
		}
		if (ch === "'" || ch === "\"" || ch === "`") {
			quote = ch;
			stripped += ch;
			continue;
		}
		if (ch === "/" && (next === "/" || next === "*")) {
			const end = source.indexOf(next === "/" ? "\n" : "*/", i + 2);
			const afterComment = end < 0 ? source.length : end + (next === "/" ? 1 : 2);
			stripped += source.slice(i, afterComment).replace(/[^\n]/g, "");
			i = afterComment - 1;
			continue;
		}
		stripped += ch;
	}
	return stripped;
}
function findSourceRuleMatch(params) {
	const sourceMatch = params.rule.pattern.exec(params.source);
	if (!sourceMatch) return null;
	if (params.rule.requiresContext && !params.rule.requiresContext.test(params.source)) return null;
	for (let i = 0; i < params.lines.length; i++) {
		if (!params.rule.pattern.test(params.lines[i] ?? "")) continue;
		if (params.rule.requiresContext && params.rule.requiresContextWindowLines !== void 0) {
			const start = Math.max(0, i - params.rule.requiresContextWindowLines);
			const end = Math.min(params.lines.length, i + params.rule.requiresContextWindowLines + 1);
			const windowSource = params.lines.slice(start, end).join("\n");
			if (!params.rule.requiresContext.test(windowSource)) continue;
		}
		return {
			line: i + 1,
			evidence: params.lines[i] ?? ""
		};
	}
	if (params.rule.requiresContextWindowLines !== void 0) return null;
	let line = 1;
	for (let i = 0; i < sourceMatch.index; i++) if (params.source.charCodeAt(i) === 10) line += 1;
	return {
		line,
		evidence: params.lines[line - 1] ?? truncateUtf16Safe(params.source, 120)
	};
}
function scanSource(source, filePath) {
	const findings = [];
	const lines = source.split("\n");
	const heuristicSource = stripCommentsForHeuristics(source);
	const { methodAliases, namespaceAliases } = collectChildProcessBindings(heuristicSource);
	for (const rule of LINE_RULES) {
		if (rule.requiresContext && !rule.requiresContext.test(source)) continue;
		let acceptedMatches = 0;
		let omittedMatches = 0;
		let lastOmittedLine;
		const addFinding = (line, lineNumber) => {
			if (acceptedMatches >= MAX_LINE_RULE_FINDINGS_PER_RULE) {
				omittedMatches += 1;
				lastOmittedLine = lineNumber;
				return;
			}
			findings.push({
				ruleId: rule.ruleId,
				severity: rule.severity,
				file: filePath,
				line: lineNumber,
				message: rule.message,
				evidence: formatScanEvidence(line)
			});
			acceptedMatches += 1;
		};
		for (const [i, line] of lines.entries()) {
			const matches = line.matchAll(new RegExp(rule.pattern.source, rule.pattern.flags.includes("g") ? rule.pattern.flags : `${rule.pattern.flags}g`));
			const literalDangerousExecIndexes = /* @__PURE__ */ new Set();
			for (const match of matches) {
				if (rule.ruleId === "dangerous-exec" && isBenignMemberExecMatch(line, match, namespaceAliases)) continue;
				if (rule.ruleId === "suspicious-network") {
					const port = Number.parseInt(expectDefined(match[1], "scanner regex capture 1"), 10);
					if (STANDARD_PORTS.has(port)) continue;
				}
				addFinding(line, i + 1);
				if (rule.ruleId === "dangerous-exec") literalDangerousExecIndexes.add(match.index);
			}
			if (rule.ruleId === "dangerous-exec" && methodAliases.size > 0) for (const index of matchAliasedChildProcessCalls(line, methodAliases)) {
				if (literalDangerousExecIndexes.has(index)) continue;
				addFinding(line, i + 1);
			}
		}
		if (lastOmittedLine !== void 0) findings.push({
			ruleId: `${rule.ruleId}-truncated`,
			severity: rule.severity,
			file: filePath,
			line: lastOmittedLine,
			message: `${omittedMatches} additional ${rule.ruleId} matches omitted after ${MAX_LINE_RULE_FINDINGS_PER_RULE} findings`,
			evidence: `[${omittedMatches} additional matches omitted after ${MAX_LINE_RULE_FINDINGS_PER_RULE} findings]`
		});
	}
	findings.push(...scanSourceRules(SOURCE_RULES, heuristicSource, filePath, lines));
	return findings;
}
function scanSkillContent(content, filePath) {
	return scanSourceRules(SKILL_CONTENT_RULES, content, filePath);
}
function scanSourceRules(rules, source, filePath, evidenceLines) {
	const findings = [];
	const lines = source.split("\n");
	for (const rule of rules) {
		const match = findSourceRuleMatch({
			rule,
			source,
			lines
		});
		if (!match) continue;
		findings.push({
			ruleId: rule.ruleId,
			severity: rule.severity,
			file: filePath,
			line: match.line,
			message: rule.message,
			evidence: rule.ruleId === "literal-secret" ? "[REDACTED CREDENTIAL]" : formatScanEvidence((evidenceLines ?? lines)[match.line - 1] ?? match.evidence)
		});
	}
	return findings;
}
async function statIfPresent(filePath) {
	try {
		return await fs.stat(filePath);
	} catch (err) {
		if (hasErrnoCode(err, "ENOENT")) return null;
		throw err;
	}
}
async function resolveForcedFiles(params) {
	const seen = /* @__PURE__ */ new Set();
	for (const rawIncludePath of params.includeFiles) {
		const includePath = path.resolve(params.rootDir, rawIncludePath);
		if (!isPathInside(params.rootDir, includePath) || !isScannable(includePath) || seen.has(includePath)) continue;
		if (!(await statIfPresent(includePath))?.isFile()) continue;
		seen.add(includePath);
	}
	return [...seen];
}
async function collectScannableFiles(dirPath, opts) {
	const forcedFiles = await resolveForcedFiles({
		rootDir: dirPath,
		includeFiles: opts.includeFiles
	});
	if (forcedFiles.length > opts.maxFiles) return {
		files: forcedFiles.slice(0, opts.maxFiles),
		truncated: true
	};
	const files = new Set(forcedFiles);
	const include = ({ name }) => !name.startsWith(".") && name !== "node_modules";
	const walked = await walkDirectory(dirPath, {
		maxEntries: Math.max(MAX_SCAN_DIRECTORY_ENTRIES, Math.min(Number.MAX_SAFE_INTEGER, Math.ceil(opts.maxFiles) * 100)),
		symlinks: "skip",
		include: (entry) => {
			if (files.size <= opts.maxFiles && entry.kind === "file" && isScannable(entry.name) && include(entry) && !files.has(entry.path)) files.add(entry.path);
			return false;
		},
		descend: (entry) => files.size <= opts.maxFiles && include(entry)
	});
	for (const { error } of walked.failedDirs) if (!hasErrnoCode(error, "ENOENT")) throw error;
	return {
		files: [...files].slice(0, opts.maxFiles),
		truncated: walked.truncated || files.size > opts.maxFiles
	};
}
async function scanFileWithCache(filePath, maxFileBytes) {
	const st = await statIfPresent(filePath);
	if (!st?.isFile()) return {
		scanned: false,
		findings: []
	};
	const cached = FILE_SCAN_CACHE.get(filePath);
	if (cached && sameFileScanIdentity(cached.identity, st) && cached.maxFileBytes === maxFileBytes) return cached;
	FILE_SCAN_CACHE.delete(filePath);
	if (st.size > maxFileBytes) return setCachedFileScanResult(filePath, {
		identity: fileScanIdentity(st),
		maxFileBytes,
		scanned: false,
		findings: []
	});
	try {
		const { buffer, stat } = await readLocalFileSafely({
			filePath: await fs.realpath(filePath),
			maxBytes: maxFileBytes
		});
		const findings = scanSource(buffer.toString("utf8"), filePath);
		return setCachedFileScanResult(filePath, {
			identity: fileScanIdentity(stat),
			maxFileBytes,
			scanned: true,
			findings
		});
	} catch (err) {
		if (hasErrnoCode(err, "ENOENT") || err instanceof FsSafeError && (err.code === "not-found" || err.code === "not-file" || err.code === "too-large")) return {
			scanned: false,
			findings: []
		};
		throw err;
	}
}
async function scanDirectoryWithSummary(dirPath, opts) {
	const scanOptions = {
		includeFiles: opts?.includeFiles ?? [],
		maxFiles: Math.max(1, opts?.maxFiles ?? DEFAULT_MAX_SCAN_FILES),
		maxFileBytes: Math.max(1, opts?.maxFileBytes ?? DEFAULT_MAX_FILE_BYTES)
	};
	const { files, truncated } = await collectScannableFiles(dirPath, scanOptions);
	const allFindings = [];
	let scannedFiles = 0;
	const counts = {
		critical: 0,
		warn: 0,
		info: 0
	};
	for (const file of files) {
		const scanResult = await scanFileWithCache(file, scanOptions.maxFileBytes);
		if (!scanResult.scanned) continue;
		scannedFiles += 1;
		for (const finding of scanResult.findings) {
			allFindings.push(finding);
			counts[finding.severity] += 1;
		}
	}
	return {
		scannedFiles,
		...counts,
		truncated,
		findings: allFindings
	};
}
//#endregion
export { scanSource as i, scanDirectoryWithSummary as n, scanSkillContent as r, isScannable as t };
