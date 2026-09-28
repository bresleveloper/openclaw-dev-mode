import "./src-CZ2wJvNB.mjs";
import { t as expectDefined } from "./expect-lbe3Hgrh.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { s as readFileHandleBounded } from "./fs-safe-advanced-CJC-NYf3.mjs";
import { t as FsSafeError, u as openLocalFileSafely } from "./fs-safe-BAPek8At.mjs";
import { t as hasErrnoCode } from "./errno-CkbDOfLk.mjs";
import { n as isPathInside } from "./path-safety-0BfxAYBQ.mjs";
import "./includes-CaaCq-XN.mjs";
import { t as pruneMapToMaxSize } from "./map-size-CNcWiFKu.mjs";
import "./errors-DnjwnOju.mjs";
import path from "node:path";
import fs from "node:fs/promises";
//#region src/skills/security/scan-evidence.ts
const LITERAL_SECRET_PATTERN = /\b(?:sk-(?:proj-|svcacct-)?[A-Za-z0-9_-]{32,}|gh[pousr]_[A-Za-z0-9]{20,}|github_pat_[A-Za-z0-9_]{20,}|xox[baprs]-[A-Za-z0-9-]{20,}|AIza[0-9A-Za-z_-]{35})(?![A-Za-z0-9_-])|-----BEGIN ([A-Z0-9 ]*PRIVATE KEY)-----\r?\n(?=(?:[A-Za-z0-9+/=]\r?\n?){48,}-----END \1-----)(?:[A-Za-z0-9+/=]+\r?\n)+-----END \1-----/;
const LITERAL_SECRET_SKILL_CONTENT_RULE = {
	ruleId: "literal-secret",
	severity: "critical",
	message: "Skill text contains a recognized literal credential",
	pattern: LITERAL_SECRET_PATTERN
};
function truncateEvidence(evidence, maxLen = 120) {
	if (evidence.length <= maxLen) return evidence;
	return `${truncateUtf16Safe(evidence, maxLen)}…`;
}
function formatScanEvidence(evidence) {
	const normalized = evidence.trim();
	return LITERAL_SECRET_PATTERN.test(normalized) ? "[REDACTED CREDENTIAL]" : truncateEvidence(normalized);
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
const TEST_DIRECTORY_NAMES = /* @__PURE__ */ new Set([
	"__fixtures__",
	"__mocks__",
	"__tests__",
	"test",
	"tests"
]);
const TEST_FILE_NAME_PATTERN = /\.(?:mock|spec|test|test-helper|test-support)\.[^.]+$/i;
const FILE_SCAN_CACHE = /* @__PURE__ */ new Map();
const DIR_ENTRY_CACHE = /* @__PURE__ */ new Map();
function isScannable(filePath) {
	return SCANNABLE_EXTENSIONS.has(path.extname(filePath).toLowerCase());
}
function getCachedFileScanResult(params) {
	const cached = FILE_SCAN_CACHE.get(params.filePath);
	if (!cached) return;
	if (!sameFileScanIdentity(cached.identity, params.identity) || cached.maxFileBytes !== params.maxFileBytes) {
		FILE_SCAN_CACHE.delete(params.filePath);
		return;
	}
	return cached;
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
}
function setCachedDirEntries(dirPath, entry) {
	pruneMapToMaxSize(DIR_ENTRY_CACHE, 4999);
	DIR_ENTRY_CACHE.set(dirPath, entry);
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
	const methodAliases = /* @__PURE__ */ new Map();
	const namespaceAliases = /* @__PURE__ */ new Set();
	const esmNamed = /\bimport\s*\{([^}]*)\}\s*from\s*["'](?:node:)?child_process["']/g;
	const esmDefault = /\bimport\s+(\w+)\s+from\s*["'](?:node:)?child_process["']/g;
	const esmNamespace = /\bimport\s*\*\s*as\s+(\w+)\s+from\s*["'](?:node:)?child_process["']/g;
	const cjsDestructured = /\b(?:const|let|var)\s*\{([^}]*)\}\s*=\s*require\s*\(\s*["'](?:node:)?child_process["']\s*\)/g;
	const cjsNamespace = /\b(?:const|let|var)\s+(\w+)\s*=\s*require\s*\(\s*["'](?:node:)?child_process["']\s*\)/g;
	const collectSpecifiers = (specText) => {
		for (const rawSpec of specText.split(",")) {
			const spec = rawSpec.trim();
			if (!spec) continue;
			const asMatch = spec.match(/^(\w+)\s+(?:as)\s+(\w+)$/) ?? spec.match(/^(\w+)\s*:\s*(\w+)$/);
			if (asMatch?.[1] && asMatch[2]) {
				const original = asMatch[1];
				const alias = asMatch[2];
				if (CHILD_PROCESS_EXEC_METHODS.has(original)) methodAliases.set(alias, original);
			}
		}
	};
	let match;
	while (match = esmNamed.exec(source)) collectSpecifiers(expectDefined(match[1], "child_process esm named import specifiers"));
	while (match = cjsDestructured.exec(source)) collectSpecifiers(expectDefined(match[1], "child_process cjs destructured specifiers"));
	while (match = esmDefault.exec(source)) namespaceAliases.add(expectDefined(match[1], "child_process esm default namespace"));
	while (match = esmNamespace.exec(source)) namespaceAliases.add(expectDefined(match[1], "child_process esm namespace import"));
	while (match = cjsNamespace.exec(source)) namespaceAliases.add(expectDefined(match[1], "child_process cjs namespace"));
	return {
		methodAliases,
		namespaceAliases
	};
}
/**
* Detects every call to a renamed child_process method alias on a single line
* (e.g. `launch("node", [...])` for `spawn as launch`, `run("...")` for
* `exec: run`). Only matches stand-alone calls (not member calls like
* `obj.launch(`) so an unrelated `.launch()` on another object is not flagged.
* The alias name is already provenance-scoped to child_process by the caller.
* Returns one entry per proven alias call occurrence, ordered by position, so
* a line with several calls (e.g. `run("a"); run("b")`) reports each of them
* instead of only the first (ClawSweeper P1: report every aliased execution
* call on a line).
*/
function matchAliasedChildProcessCalls(line, methodAliases) {
	const calls = [];
	for (const alias of methodAliases.keys()) {
		const pattern = new RegExp(`(?<![\\w.])${escapeRegExp(alias)}\\s*\\(`, "g");
		for (const callMatch of line.matchAll(pattern)) calls.push({
			alias,
			index: callMatch.index ?? -1
		});
	}
	return calls.toSorted((a, b) => a.index - b.index);
}
function escapeRegExp(value) {
	return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
const LITERAL_NAMESPACE_RECEIVERS = /* @__PURE__ */ new Set([
	"cp",
	"childProcess",
	"child_process"
]);
function isBenignMemberExecMatch(line, match, namespaceAliases) {
	const command = match[1] ?? match[2];
	if (!command) return false;
	const matchIndex = match.index ?? -1;
	if (matchIndex < 0) return false;
	const charAtMatch = line[matchIndex];
	if (charAtMatch === "\"" || charAtMatch === "'") {
		const receiver = line.slice(0, matchIndex).match(/(\w+)\s*\[\s*$/)?.[1];
		if (receiver && (namespaceAliases.has(receiver) || LITERAL_NAMESPACE_RECEIVERS.has(receiver))) return false;
		return true;
	}
	if (command === "exec" && matchIndex > 0 && line[matchIndex - 1] === ".") {
		const receiver = line.slice(0, matchIndex - 1).match(/(\w+)\s*$/)?.[1];
		if (receiver && (namespaceAliases.has(receiver) || LITERAL_NAMESPACE_RECEIVERS.has(receiver))) return false;
		return true;
	}
	return false;
}
function stripCommentsForHeuristics(source) {
	let stripped = "";
	let quote = null;
	let escaped = false;
	let inBlockComment = false;
	for (let i = 0; i < source.length; i++) {
		const ch = source[i] ?? "";
		const next = source[i + 1] ?? "";
		if (inBlockComment) {
			if (ch === "*" && next === "/") {
				inBlockComment = false;
				i++;
				continue;
			}
			if (ch === "\n") stripped += "\n";
			continue;
		}
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
		if (ch === "/" && next === "/") {
			while (i < source.length && source[i] !== "\n") i++;
			if (source[i] === "\n") stripped += "\n";
			continue;
		}
		if (ch === "/" && next === "*") {
			inBlockComment = true;
			i++;
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
	const heuristicLines = heuristicSource.split("\n");
	const { methodAliases, namespaceAliases } = collectChildProcessBindings(heuristicSource);
	for (const rule of LINE_RULES) {
		if (rule.requiresContext && !rule.requiresContext.test(source)) continue;
		let acceptedMatches = 0;
		let omittedMatches = 0;
		let lastOmittedLine;
		for (const [i, line] of lines.entries()) {
			const matches = line.matchAll(new RegExp(rule.pattern.source, rule.pattern.flags.includes("g") ? rule.pattern.flags : `${rule.pattern.flags}g`));
			const literalDangerousExecIndexes = /* @__PURE__ */ new Set();
			for (const match of matches) {
				if (rule.ruleId === "dangerous-exec" && isBenignMemberExecMatch(line, match, namespaceAliases)) continue;
				if (rule.ruleId === "suspicious-network") {
					const port = Number.parseInt(expectDefined(match[1], "scanner regex capture 1"), 10);
					if (STANDARD_PORTS.has(port)) continue;
				}
				if (acceptedMatches >= MAX_LINE_RULE_FINDINGS_PER_RULE) {
					omittedMatches += 1;
					lastOmittedLine = i + 1;
					continue;
				}
				findings.push({
					ruleId: rule.ruleId,
					severity: rule.severity,
					file: filePath,
					line: i + 1,
					message: rule.message,
					evidence: formatScanEvidence(line)
				});
				acceptedMatches += 1;
				if (rule.ruleId === "dangerous-exec") literalDangerousExecIndexes.add(match.index ?? -1);
			}
			if (rule.ruleId === "dangerous-exec" && methodAliases.size > 0) for (const aliasMatch of matchAliasedChildProcessCalls(line, methodAliases)) {
				if (literalDangerousExecIndexes.has(aliasMatch.index)) continue;
				if (acceptedMatches >= MAX_LINE_RULE_FINDINGS_PER_RULE) {
					omittedMatches += 1;
					lastOmittedLine = i + 1;
					continue;
				}
				findings.push({
					ruleId: rule.ruleId,
					severity: rule.severity,
					file: filePath,
					line: i + 1,
					message: rule.message,
					evidence: formatScanEvidence(line)
				});
				acceptedMatches += 1;
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
	const matchedSourceRules = /* @__PURE__ */ new Set();
	for (const rule of SOURCE_RULES) {
		const ruleKey = `${rule.ruleId}::${rule.message}`;
		if (matchedSourceRules.has(ruleKey)) continue;
		const match = findSourceRuleMatch({
			rule,
			source: heuristicSource,
			lines: heuristicLines
		});
		if (!match) continue;
		findings.push({
			ruleId: rule.ruleId,
			severity: rule.severity,
			file: filePath,
			line: match.line,
			message: rule.message,
			evidence: formatScanEvidence(lines[match.line - 1] ?? match.evidence)
		});
		matchedSourceRules.add(ruleKey);
	}
	return findings;
}
function scanSkillContent(content, filePath) {
	const findings = [];
	const lines = content.split("\n");
	const matchedRules = /* @__PURE__ */ new Set();
	for (const rule of SKILL_CONTENT_RULES) {
		if (matchedRules.has(rule.ruleId)) continue;
		const match = findSourceRuleMatch({
			rule,
			source: content,
			lines
		});
		if (!match) continue;
		findings.push({
			ruleId: rule.ruleId,
			severity: rule.severity,
			file: filePath,
			line: match.line,
			message: rule.message,
			evidence: rule.ruleId === "literal-secret" ? "[REDACTED CREDENTIAL]" : formatScanEvidence(lines[match.line - 1] ?? match.evidence)
		});
		matchedRules.add(rule.ruleId);
	}
	return findings;
}
function normalizeScanOptions(opts) {
	return {
		excludeTestFiles: opts?.excludeTestFiles ?? false,
		includeHiddenDirectories: opts?.includeHiddenDirectories ?? false,
		includeNestedNodeModulesTestFiles: opts?.includeNestedNodeModulesTestFiles ?? false,
		includeNodeModules: opts?.includeNodeModules ?? false,
		includeFiles: opts?.includeFiles ?? [],
		onlyIncludeFiles: opts?.onlyIncludeFiles ?? false,
		maxFiles: Math.max(1, opts?.maxFiles ?? DEFAULT_MAX_SCAN_FILES),
		maxFileBytes: Math.max(1, opts?.maxFileBytes ?? DEFAULT_MAX_FILE_BYTES)
	};
}
function isExcludedTestDirectoryName(name) {
	return TEST_DIRECTORY_NAMES.has(name);
}
function isExcludedTestFileName(name) {
	return TEST_FILE_NAME_PATTERN.test(name);
}
function pathContainsNodeModulesSegment(relativePath) {
	return relativePath.split(/[\\/]+/u).includes("node_modules");
}
async function walkDirWithLimit(rootDir, dirPath, candidateLimit, excludeTestFiles, includeHiddenDirectories, includeNestedNodeModulesTestFiles, includeNodeModules) {
	const files = [];
	const stack = [dirPath];
	while (stack.length > 0 && files.length < candidateLimit) {
		const currentDir = stack.pop();
		if (!currentDir) break;
		const entries = await readDirEntriesWithCache(currentDir);
		for (const entry of entries) {
			if (files.length >= candidateLimit) break;
			if (!includeHiddenDirectories && entry.name.startsWith(".") || !includeNodeModules && entry.name === "node_modules") continue;
			const fullPath = path.join(currentDir, entry.name);
			const isExcludedTestPath = entry.kind === "dir" ? isExcludedTestDirectoryName(entry.name) : isExcludedTestFileName(entry.name);
			if (excludeTestFiles && isExcludedTestPath && !(includeNestedNodeModulesTestFiles && pathContainsNodeModulesSegment(path.relative(rootDir, fullPath)))) continue;
			if (entry.kind === "dir") stack.push(fullPath);
			else if (entry.kind === "file" && isScannable(entry.name)) files.push(fullPath);
		}
	}
	return {
		files,
		truncated: files.length >= candidateLimit
	};
}
async function readDirEntriesWithCache(dirPath) {
	let st;
	try {
		st = await fs.stat(dirPath);
	} catch (err) {
		if (hasErrnoCode(err, "ENOENT")) return [];
		throw err;
	}
	if (!st?.isDirectory()) return [];
	const cached = DIR_ENTRY_CACHE.get(dirPath);
	if (cached && cached.mtimeMs === st.mtimeMs) return cached.entries;
	const dirents = await fs.readdir(dirPath, { withFileTypes: true });
	const entries = [];
	for (const entry of dirents) if (entry.isDirectory()) entries.push({
		name: entry.name,
		kind: "dir"
	});
	else if (entry.isFile()) entries.push({
		name: entry.name,
		kind: "file"
	});
	setCachedDirEntries(dirPath, {
		mtimeMs: st.mtimeMs,
		entries
	});
	return entries;
}
async function resolveForcedFiles(params) {
	if (params.includeFiles.length === 0) return [];
	const seen = /* @__PURE__ */ new Set();
	const out = [];
	for (const rawIncludePath of params.includeFiles) {
		const includePath = path.resolve(params.rootDir, rawIncludePath);
		if (!isPathInside(params.rootDir, includePath)) continue;
		if (!isScannable(includePath)) continue;
		if (seen.has(includePath)) continue;
		let st;
		try {
			st = await fs.stat(includePath);
		} catch (err) {
			if (hasErrnoCode(err, "ENOENT")) continue;
			throw err;
		}
		if (!st?.isFile()) continue;
		out.push(includePath);
		seen.add(includePath);
	}
	return out;
}
async function collectScannableFiles(dirPath, opts) {
	const forcedFiles = await resolveForcedFiles({
		rootDir: dirPath,
		includeFiles: opts.includeFiles
	});
	if (opts.onlyIncludeFiles) return {
		files: forcedFiles.slice(0, opts.maxFiles),
		truncated: forcedFiles.length > opts.maxFiles
	};
	if (forcedFiles.length > opts.maxFiles) return {
		files: forcedFiles.slice(0, opts.maxFiles),
		truncated: true
	};
	const walked = await walkDirWithLimit(dirPath, dirPath, opts.maxFiles + 1, opts.excludeTestFiles, opts.includeHiddenDirectories, opts.includeNestedNodeModulesTestFiles, opts.includeNodeModules);
	const seen = new Set(forcedFiles.map((f) => path.resolve(f)));
	const out = [...forcedFiles];
	for (const walkedFile of walked.files) {
		const resolved = path.resolve(walkedFile);
		if (seen.has(resolved)) continue;
		if (out.length >= opts.maxFiles) return {
			files: out.slice(0, opts.maxFiles),
			truncated: true
		};
		out.push(walkedFile);
		seen.add(resolved);
	}
	return {
		files: out,
		truncated: false
	};
}
async function scanFileWithCache(params) {
	const { filePath, maxFileBytes } = params;
	let st;
	try {
		st = await fs.stat(filePath);
	} catch (err) {
		if (hasErrnoCode(err, "ENOENT")) return {
			scanned: false,
			findings: []
		};
		throw err;
	}
	if (!st?.isFile()) return {
		scanned: false,
		findings: []
	};
	const cached = getCachedFileScanResult({
		filePath,
		identity: st,
		maxFileBytes
	});
	if (cached) return {
		scanned: cached.scanned,
		findings: cached.findings
	};
	if (st.size > maxFileBytes) {
		setCachedFileScanResult(filePath, {
			identity: fileScanIdentity(st),
			maxFileBytes,
			scanned: false,
			findings: []
		});
		return {
			scanned: false,
			findings: []
		};
	}
	try {
		const opened = await openLocalFileSafely({ filePath: await fs.realpath(filePath) });
		try {
			const content = await readFileHandleBounded(opened.handle, maxFileBytes);
			const after = await opened.handle.stat();
			if (!sameFileScanIdentity(opened.stat, after) || content.byteLength !== after.size) throw new Error(`File changed while scanning: ${filePath}`);
			const findings = scanSource(content.toString("utf8"), filePath);
			setCachedFileScanResult(filePath, {
				identity: fileScanIdentity(after),
				maxFileBytes,
				scanned: true,
				findings
			});
			return {
				scanned: true,
				findings
			};
		} finally {
			await opened.handle.close();
		}
	} catch (err) {
		if (hasErrnoCode(err, "ENOENT") || err instanceof FsSafeError && (err.code === "not-found" || err.code === "not-file" || err.code === "too-large")) return {
			scanned: false,
			findings: []
		};
		throw err;
	}
}
async function scanDirectoryWithSummary(dirPath, opts) {
	const scanOptions = normalizeScanOptions(opts);
	const { files, truncated } = await collectScannableFiles(dirPath, scanOptions);
	const allFindings = [];
	let scannedFiles = 0;
	let critical = 0;
	let warn = 0;
	let info = 0;
	for (const file of files) {
		const scanResult = await scanFileWithCache({
			filePath: file,
			maxFileBytes: scanOptions.maxFileBytes
		});
		if (!scanResult.scanned) continue;
		scannedFiles += 1;
		for (const finding of scanResult.findings) {
			allFindings.push(finding);
			if (finding.severity === "critical") critical += 1;
			else if (finding.severity === "warn") warn += 1;
			else info += 1;
		}
	}
	return {
		scannedFiles,
		critical,
		warn,
		info,
		truncated,
		findings: allFindings
	};
}
//#endregion
export { scanSource as i, scanDirectoryWithSummary as n, scanSkillContent as r, isScannable as t };
