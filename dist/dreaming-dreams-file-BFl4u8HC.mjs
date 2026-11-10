import { g as readStringValue, l as normalizeOptionalString, m as readNonBlankString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { c as asFiniteNumberInRange, l as asNonNegativeFiniteNumber, s as asFiniteNumber, y as parseDateStringTimestampMs } from "./number-coercion-CkhMiRw8.mjs";
import { a as extractErrorCode } from "./error-coercion-BwMr25F8.mjs";
import { i as asOptionalObjectRecord, r as asNullableRecord } from "./record-coerce-TIsquoVR.mjs";
import { _ as normalizeUniqueTrimmedStringList } from "./string-normalization-D6DKCpwE.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { t as escapeRegExp } from "./regexp-BZyMFTlj.mjs";
import { a as isPidDefinitelyDead, t as getFileLockProcessStartTime } from "./pid-alive-dd7OR8F6.mjs";
import { g as readRegularFile } from "./fs-safe-6Z4UiMS4.mjs";
import { t as KeyedAsyncQueue } from "./keyed-async-queue-CTreGrmR.mjs";
import "./dreaming-D2xE6WEV.mjs";
import { r as decodeUtf8Input } from "./utf8-input-n9WHttrc.mjs";
import "./error-runtime-ikopZs5O.mjs";
import "./string-coerce-runtime-BbIJhy7G.mjs";
import "./text-utility-runtime-B9RB6Cg0.mjs";
import { r as replaceFileAtomic } from "./security-runtime-6domDoE8.mjs";
import "./runtime-doctor-migrations-BuGkvNDu.mjs";
import { n as getMemoryWorkspaceMaintenance } from "./memory-workspace-files-_Z-dpV0O.mjs";
import "./number-runtime-D3v2w3D4.mjs";
import "./process-runtime-CG9_3L3N.mjs";
import "./memory-core-host-status-EFn_AMM-.mjs";
import { t as replaceManagedMarkdownBlock } from "./memory-host-markdown-DwzbxsY_.mjs";
import { b as writeMemoryCoreWorkspaceEntry, c as SHORT_TERM_META_NAMESPACE, h as memoryCoreWorkspaceStateKey, l as SHORT_TERM_PHASE_SIGNAL_NAMESPACE, m as memoryCoreStateReference, s as SHORT_TERM_LOCK_NAMESPACE, u as SHORT_TERM_RECALL_NAMESPACE, v as readMemoryCoreWorkspaceEntries, x as captureMemoryMutationAuthority, y as writeMemoryCoreWorkspaceEntries } from "./dreaming-state-D1mfF5St.mjs";
import { n as DEFAULT_PROMOTION_MIN_SCORE, r as DEFAULT_PROMOTION_MIN_UNIQUE_QUERIES, t as DEFAULT_PROMOTION_MIN_RECALL_COUNT } from "./short-term-promotion-types-DzT_IEmC.mjs";
import { createHash } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { AsyncLocalStorage } from "node:async_hooks";
//#region extensions/memory-core/src/memory-workspace-lock.ts
const SHORT_TERM_LOCK_STALE_MS = 6e4;
const inProcessMemoryWorkspaceLocks = new KeyedAsyncQueue();
const memoryWorkspaceLockScopes = new AsyncLocalStorage();
function findActiveWorkspaceLockScope(key) {
	let scope = memoryWorkspaceLockScopes.getStore();
	while (scope) {
		if (!scope.active || !scope.lease.active) return;
		if (scope.lease.key === key) return scope;
		scope = scope.parent;
	}
}
async function runWorkspaceLockScope(lease, task) {
	const scope = {
		lease,
		active: true,
		childTail: Promise.resolve(),
		parent: memoryWorkspaceLockScopes.getStore()
	};
	try {
		return await memoryWorkspaceLockScopes.run(scope, task);
	} finally {
		scope.active = false;
		await scope.childTail;
	}
}
function resolveLockPath(workspaceDir) {
	return memoryCoreStateReference(SHORT_TERM_LOCK_NAMESPACE, workspaceDir);
}
function parseLockOwnerPid(raw) {
	const match = raw.trim().match(/^(\d+):/);
	const pid = Number.parseInt(match?.[1] ?? "", 10);
	return Number.isInteger(pid) && pid > 0 ? pid : null;
}
function isShortTermLockStealable(existing, nowMs) {
	if (nowMs - existing.acquiredAt <= SHORT_TERM_LOCK_STALE_MS) return false;
	const ownerPid = parseLockOwnerPid(existing.owner);
	if (ownerPid === null) return true;
	if (ownerPid === process.pid) return true;
	if (isPidDefinitelyDead(ownerPid)) return true;
	if (existing.ownerStartTime === void 0) return false;
	const currentStartTime = getFileLockProcessStartTime(ownerPid);
	return currentStartTime !== null && currentStartTime !== existing.ownerStartTime;
}
async function deleteShortTermLockEntryIfCurrent(lockStore, lockKey, expected, initialObservation) {
	if (!lockStore.observe || !lockStore.compareAndApply) throw new Error("memory-core short-term lock store requires atomic comparisons");
	const { owner, acquiredAt } = expected;
	const decideDeletion = (current) => ({
		operation: "delete",
		action: current !== void 0 && current.owner === owner && current.acquiredAt === acquiredAt ? "delete" : "keep"
	});
	let observation = initialObservation ?? await lockStore.observe(lockKey);
	while (true) {
		const result = await lockStore.compareAndApply(lockKey, observation.comparison, decideDeletion(observation.value));
		if (result.status !== "conflict") return result.status === "applied";
		observation = result.current;
	}
}
/** Captured input preparation shares local ordering without claiming a durable write lease. */
async function withMemoryWorkspacePreparation(workspaceDir, prepare) {
	const key = memoryCoreWorkspaceStateKey(workspaceDir);
	if (findActiveWorkspaceLockScope(key)) return await withMemoryWorkspaceLock(workspaceDir, prepare);
	return await inProcessMemoryWorkspaceLocks.enqueue(key, prepare);
}
async function withMemoryWorkspaceLock(workspaceDir, task) {
	const lockKey = memoryCoreWorkspaceStateKey(workspaceDir);
	const scope = findActiveWorkspaceLockScope(lockKey);
	if (scope) {
		const child = scope.childTail.then(() => runWorkspaceLockScope(scope.lease, task));
		scope.childTail = child.then(() => void 0, () => void 0);
		return await child;
	}
	return await inProcessMemoryWorkspaceLocks.enqueue(lockKey, async () => {
		const lease = {
			key: lockKey,
			active: true
		};
		try {
			return await runWorkspaceLockScope(lease, task);
		} finally {
			lease.active = false;
		}
	});
}
const CONCEPT_STOP_WORDS = new Set(Object.values({
	shared: [
		"about",
		"after",
		"agent",
		"again",
		"also",
		"assistant",
		"because",
		"before",
		"being",
		"between",
		"build",
		"called",
		"could",
		"daily",
		"default",
		"deploy",
		"during",
		"every",
		"file",
		"files",
		"from",
		"have",
		"into",
		"just",
		"line",
		"lines",
		"long",
		"main",
		"make",
		"memory",
		"month",
		"more",
		"most",
		"move",
		"much",
		"next",
		"note",
		"notes",
		"over",
		"part",
		"past",
		"port",
		"same",
		"score",
		"search",
		"session",
		"sessions",
		"short",
		"should",
		"since",
		"some",
		"subagent",
		"system",
		"than",
		"that",
		"their",
		"there",
		"these",
		"they",
		"this",
		"through",
		"today",
		"user",
		"using",
		"with",
		"work",
		"workspace",
		"year"
	],
	english: [
		"and",
		"are",
		"for",
		"into",
		"its",
		"our",
		"the",
		"then",
		"were",
		"you",
		"your"
	],
	spanish: [
		"al",
		"con",
		"como",
		"de",
		"del",
		"el",
		"en",
		"es",
		"la",
		"las",
		"los",
		"para",
		"por",
		"que",
		"se",
		"sin",
		"su",
		"sus",
		"una",
		"uno",
		"unos",
		"unas",
		"y"
	],
	french: [
		"au",
		"aux",
		"avec",
		"dans",
		"de",
		"des",
		"du",
		"en",
		"est",
		"et",
		"la",
		"le",
		"les",
		"ou",
		"pour",
		"que",
		"qui",
		"sans",
		"ses",
		"son",
		"sur",
		"une",
		"un"
	],
	german: [
		"auf",
		"aus",
		"bei",
		"das",
		"dem",
		"den",
		"der",
		"des",
		"die",
		"ein",
		"eine",
		"einem",
		"einen",
		"einer",
		"für",
		"im",
		"in",
		"mit",
		"nach",
		"oder",
		"ohne",
		"über",
		"und",
		"von",
		"zu",
		"zum",
		"zur"
	],
	cjk: [
		"が",
		"から",
		"する",
		"して",
		"した",
		"で",
		"と",
		"に",
		"の",
		"は",
		"へ",
		"まで",
		"も",
		"や",
		"を",
		"与",
		"为",
		"了",
		"及",
		"和",
		"在",
		"将",
		"或",
		"把",
		"是",
		"用",
		"的",
		"과",
		"는",
		"도",
		"로",
		"를",
		"에",
		"에서",
		"와",
		"은",
		"으로",
		"을",
		"이",
		"하다",
		"한",
		"할",
		"해",
		"했다"
	],
	pathNoise: [
		"cjs",
		"cpp",
		"cts",
		"jsx",
		"json",
		"md",
		"mjs",
		"mts",
		"text",
		"toml",
		"ts",
		"tsx",
		"txt",
		"yaml",
		"yml"
	]
}).flat().map((word) => normalizeLowercaseStringOrEmpty(word)));
const PROTECTED_GLOSSARY = [
	"backup",
	"backups",
	"embedding",
	"embeddings",
	"failover",
	"gateway",
	"glacier",
	"gpt",
	"kv",
	"network",
	"openai",
	"router",
	"s3",
	"vlan",
	"sauvegarde",
	"routeur",
	"passerelle",
	"konfiguration",
	"sicherung",
	"überwachung",
	"configuración",
	"respaldo",
	"enrutador",
	"puerta-de-enlace",
	"バックアップ",
	"フェイルオーバー",
	"ルーター",
	"ネットワーク",
	"ゲートウェイ",
	"障害対応",
	"路由器",
	"备份",
	"故障转移",
	"网络",
	"网关",
	"라우터",
	"백업",
	"페일오버",
	"네트워크",
	"게이트웨이",
	"장애대응"
].map((word) => normalizeLowercaseStringOrEmpty(word.normalize("NFKC")));
const COMPOUND_TOKEN_RE = /[\p{L}\p{N}]+(?:[._/-][\p{L}\p{N}]+)+/gu;
const LETTER_OR_NUMBER_RE = /[\p{L}\p{N}]/u;
const LATIN_RE = /\p{Script=Latin}/u;
const HAN_RE = /\p{Script=Han}/u;
const HIRAGANA_RE = /\p{Script=Hiragana}/u;
const KATAKANA_RE = /\p{Script=Katakana}/u;
const HANGUL_RE = /\p{Script=Hangul}/u;
const DEFAULT_WORD_SEGMENTER = new Intl.Segmenter("und", { granularity: "word" });
function classifyConceptTagScript(tag) {
	const normalized = tag.normalize("NFKC");
	const hasLatin = LATIN_RE.test(normalized);
	const hasCjk = HAN_RE.test(normalized) || HIRAGANA_RE.test(normalized) || KATAKANA_RE.test(normalized) || HANGUL_RE.test(normalized);
	if (hasLatin && hasCjk) return "mixed";
	if (hasCjk) return "cjk";
	if (hasLatin) return "latin";
	return "other";
}
function minimumTokenLengthForScript(script) {
	if (script === "cjk") return 2;
	return 3;
}
function isKanaOnlyToken(value) {
	return !HAN_RE.test(value) && !HANGUL_RE.test(value) && (HIRAGANA_RE.test(value) || KATAKANA_RE.test(value));
}
function normalizeConceptToken(rawToken) {
	const normalized = normalizeLowercaseStringOrEmpty(rawToken.normalize("NFKC").replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, "").replaceAll("_", "-"));
	if (!normalized || !LETTER_OR_NUMBER_RE.test(normalized) || normalized.length > 32) return null;
	if (/^\p{N}+(?:[./-]\p{N}+)*$/u.test(normalized) || /^\d{4}-\d{2}-\d{2}\.[\p{L}\p{N}]+$/u.test(normalized)) return null;
	const script = classifyConceptTagScript(normalized);
	if (normalized.length < minimumTokenLengthForScript(script) && !PROTECTED_GLOSSARY.includes(normalized)) return null;
	if (isKanaOnlyToken(normalized) && normalized.length < 3) return null;
	if (CONCEPT_STOP_WORDS.has(normalized)) return null;
	return normalized;
}
const GLOSSARY_ENTRIES = PROTECTED_GLOSSARY.map((entry) => ({
	entry,
	wholeWord: entry.length < minimumTokenLengthForScript(classifyConceptTagScript(entry)) ? new RegExp(`(?<![\\p{L}\\p{N}])${escapeRegExp(entry)}(?![\\p{L}\\p{N}])`, "u") : void 0
}));
function collectGlossaryMatches(source) {
	const normalizedSource = normalizeLowercaseStringOrEmpty(source.normalize("NFKC"));
	return GLOSSARY_ENTRIES.filter(({ entry, wholeWord }) => wholeWord ? wholeWord.test(normalizedSource) : normalizedSource.includes(entry)).map(({ entry }) => entry);
}
function collectSegmentTokens(source) {
	return Array.from(DEFAULT_WORD_SEGMENTER.segment(source), (part) => part.isWordLike ? part.segment : "").filter(Boolean);
}
function deriveConceptTags(params) {
	const visibleSnippet = params.snippet.replace(/<!--[\s\S]*?-->/gu, " ");
	const source = `${path.basename(params.path)} ${visibleSnippet}`;
	const tags = [];
	const tokenSources = [
		collectGlossaryMatches(source),
		source.match(COMPOUND_TOKEN_RE) ?? [],
		collectSegmentTokens(source)
	];
	for (const tokens of tokenSources) for (const rawToken of tokens) {
		const normalized = normalizeConceptToken(rawToken);
		if (!normalized || tags.includes(normalized)) continue;
		tags.push(normalized);
		if (tags.length >= 8) return tags;
	}
	return tags;
}
function summarizeConceptTagScriptCoverage(conceptTagsByEntry) {
	const coverage = {
		latinEntryCount: 0,
		cjkEntryCount: 0,
		mixedEntryCount: 0,
		otherEntryCount: 0
	};
	for (const conceptTags of conceptTagsByEntry) if (conceptTags.length > 0) coverage[`${classifyConceptTagScript(conceptTags.join(" "))}EntryCount`] += 1;
	return coverage;
}
//#endregion
//#region extensions/memory-core/src/short-term-promotion-utils.ts
const GENERIC_DAY_HEADING_RE = /^(?:(?:mon|monday|tue|tues|tuesday|wed|wednesday|thu|thur|thurs|thursday|fri|friday|sat|saturday|sun|sunday)(?:,\s+)?)?(?:(?:jan|january|feb|february|mar|march|apr|april|may|jun|june|jul|july|aug|august|sep|sept|september|oct|october|nov|november|dec|december)\s+\d{1,2}(?:st|nd|rd|th)?(?:,\s*\d{4})?|\d{1,2}[/-]\d{1,2}(?:[/-]\d{2,4})?|\d{4}[/-]\d{2}[/-]\d{2})$/i;
const SHORT_TERM_PATH_RE = /(?:^|\/)memory\/(?:[^/]+\/)*(\d{4})-(\d{2})-(\d{2})(?:-[^/]+)?\.md$/;
const DREAMING_MEMORY_PATH_RE = /(?:^|\/)memory\/dreaming\//;
const SHORT_TERM_SESSION_CORPUS_RE = /(?:^|\/)memory\/\.dreams\/session-corpus\/(\d{4})-(\d{2})-(\d{2})\.(?:md|txt)$/;
const SHORT_TERM_BASENAME_RE = /^(\d{4})-(\d{2})-(\d{2})(?:-[^/]+)?\.md$/;
const SHORT_TERM_RECALL_MAX_SNIPPET_CHARS = 800;
const DREAMING_TRANSCRIPT_PROMPT_LINE_RE = /\[[^\]]*dreaming-narrative[^\]]*]\s*(?:User|Assistant):\s*Write a dream diary entry from these memory fragments:?/i;
const RAW_SESSION_METADATA_RE = /\bSession Key\b.{0,260}\bSession ID\b|\bSession ID\b.{0,260}\bSession Key\b/i;
const RAW_CONVERSATION_SUMMARY_RE = /^(?:[-*+]\s*)?Conversation Summary:\s*(?:$|(?:[-*+]\s*)?(?:user|assistant|(?:\*\*)?Session (?:Key|ID)(?:\*\*)?):\s)/i;
const RAW_TRANSCRIPT_TURN_RE = /^(?:[-*+]\s*)?(?:user|assistant):\s/i;
const MEMORY_FLUSH_PROMPT_RE = /Save important context from this session to the daily memory file\.\s*STRICT RULES:/i;
const PROMOTION_SCORE_METADATA_RE = /\[\s*score=\d+(?:\.\d+)?\s+(?:signals=\d+\s+)?recalls=\d+\s+avg=\d+(?:\.\d+)?\s+source=memory\//i;
const DREAMING_DIFF_PREFIX_RE = /@@\s*-\d+(?:,\d+)?\s+[-*+]\s+/iy;
function clampScore(value) {
	if (!Number.isFinite(value)) return 0;
	return Math.max(0, Math.min(1, value));
}
function resolvePromotionThresholds(options) {
	return {
		minScore: asFiniteNumberInRange(Number(options.minScore), {
			min: 0,
			max: 1
		}) ?? DEFAULT_PROMOTION_MIN_SCORE,
		minRecallCount: toFiniteNonNegativeInt(options.minRecallCount, DEFAULT_PROMOTION_MIN_RECALL_COUNT),
		minUniqueQueries: toFiniteNonNegativeInt(options.minUniqueQueries, DEFAULT_PROMOTION_MIN_UNIQUE_QUERIES),
		maxAgeDays: toFiniteNonNegativeInt(options.maxAgeDays, -1)
	};
}
function isGenericDailyHeading(heading) {
	const normalized = heading.trim().replace(/\s+/g, " ");
	return !normalized || /^(today|yesterday|tomorrow|morning|afternoon|evening|night)$/i.test(normalized) || GENERIC_DAY_HEADING_RE.test(normalized);
}
function normalizeSnippet(raw) {
	return raw.trim().replace(/\s+/g, " ");
}
const PROMOTED_SNIPPET_CHARS_PER_TOKEN_ESTIMATE = 4;
function truncatePromotedSnippet(snippet, maxTokens) {
	const limit = toFiniteNonNegativeInt(maxTokens, 160) * PROMOTED_SNIPPET_CHARS_PER_TOKEN_ESTIMATE;
	if (limit === 0 || snippet.length <= limit) return snippet;
	const hardLimit = truncateUtf16Safe(snippet, limit);
	const sentenceBoundary = Math.max(hardLimit.lastIndexOf(". "), hardLimit.lastIndexOf("! "), hardLimit.lastIndexOf("? "));
	const wordBoundary = hardLimit.lastIndexOf(" ");
	const cutAt = sentenceBoundary >= Math.floor(limit * .55) ? sentenceBoundary + 1 : wordBoundary >= Math.floor(limit * .65) ? wordBoundary : limit;
	return `${hardLimit.slice(0, cutAt).trimEnd()}...`;
}
function formatPromotedSnippetForMemory(rawSnippet, maxTokens) {
	return truncatePromotedSnippet(normalizeSnippet(rawSnippet || "(no snippet captured)").replace(/^[-*+] +/, "").trim() || "(no snippet captured)", maxTokens);
}
function normalizeProjectKeyList(value) {
	if (typeof value !== "string") return;
	const keys = /* @__PURE__ */ new Set();
	for (const rawKey of value.split(";")) {
		const trimmed = rawKey.trim();
		if (!trimmed || /[\r\n<>]/u.test(trimmed)) continue;
		if (trimmed.startsWith("path:")) {
			keys.add(trimmed);
			continue;
		}
		const separator = trimmed.indexOf("/");
		if (separator < 1) {
			keys.add(trimmed);
			continue;
		}
		keys.add(`${trimmed.slice(0, separator).toLowerCase()}${trimmed.slice(separator)}`);
	}
	return keys.size > 0 ? [...keys].join("; ") : void 0;
}
function mergeProjectKeyLists(...values) {
	return normalizeProjectKeyList(values.filter((value) => typeof value === "string").join(";"));
}
function truncateShortTermSnippet(snippet) {
	if (snippet.length <= SHORT_TERM_RECALL_MAX_SNIPPET_CHARS) return snippet;
	return truncateUtf16Safe(snippet, SHORT_TERM_RECALL_MAX_SNIPPET_CHARS).trimEnd();
}
function enforceShortTermRecallSnippetCap(store) {
	for (const entry of Object.values(store.entries)) entry.snippet = truncateShortTermSnippet(entry.snippet);
}
function consumeDreamingLeadPrefix(snippet) {
	let index = 0;
	while (index < snippet.length) {
		DREAMING_DIFF_PREFIX_RE.lastIndex = index;
		if (DREAMING_DIFF_PREFIX_RE.exec(snippet)) {
			index = DREAMING_DIFF_PREFIX_RE.lastIndex;
			continue;
		}
		const char = snippet[index];
		if (char === "[" || char === "(") {
			index += 1;
			while (snippet[index] === " ") index += 1;
			continue;
		}
		if ((char === "-" || char === "*" || char === "+" || char === ">") && snippet[index + 1] === " ") {
			index += 2;
			continue;
		}
		break;
	}
	return snippet.slice(index);
}
function hasDreamingNarrativeLead(snippet) {
	const withoutPrefix = consumeDreamingLeadPrefix(snippet);
	const head = truncateUtf16Safe(withoutPrefix, 200);
	return /\b(?:Candidate|Reflections?):/i.test(head) || /#{1,6}\s+Reflections?\b/i.test(head);
}
function isContaminatedDreamingSnippet(raw, opts = {}) {
	const snippet = normalizeSnippet(raw);
	if (!snippet) return false;
	if (/<!--\s*openclaw-memory-promotion:/i.test(snippet) || DREAMING_TRANSCRIPT_PROMPT_LINE_RE.test(snippet) || RAW_SESSION_METADATA_RE.test(snippet) || RAW_CONVERSATION_SUMMARY_RE.test(snippet) || !opts.allowTranscriptTurnSnippet && RAW_TRANSCRIPT_TURN_RE.test(snippet) || MEMORY_FLUSH_PROMPT_RE.test(snippet) || PROMOTION_SCORE_METADATA_RE.test(snippet)) return true;
	const hasNarrativeLead = hasDreamingNarrativeLead(snippet);
	const hasConfidence = /\bconfidence:\s*\d/i.test(snippet);
	const hasEvidence = /\bevidence:\s*(?:memory\/\.dreams\/session-corpus\/|memory\/)/i.test(snippet);
	const hasStatus = /\bstatus:\s*staged\b/i.test(snippet);
	const hasRecalls = /\brecalls:\s*\d+\b/i.test(snippet);
	const hasReflectionNote = /\bnote:\s*reflection\b/i.test(snippet);
	return hasNarrativeLead && hasConfidence && hasEvidence && (hasStatus && hasRecalls || hasReflectionNote);
}
function normalizeMemoryPath(rawPath) {
	return rawPath.replaceAll("\\", "/").replace(/^\.\//, "");
}
function buildClaimHash(snippet) {
	return createHash("sha1").update(normalizeSnippet(snippet)).digest("hex").slice(0, 12);
}
function buildDailyClaimEntryKey(claimHash) {
	return `memory:claim:${claimHash}`;
}
function buildEntryKey(result) {
	const base = `${result.source}:${normalizeMemoryPath(result.path)}:${result.startLine}:${result.endLine}`;
	return result.claimHash ? `${base}:${result.claimHash}` : base;
}
function hashQuery(query) {
	return createHash("sha1").update(normalizeLowercaseStringOrEmpty(query)).digest("hex").slice(0, 12);
}
function mergeRecentDistinct(existing, nextValue, limit) {
	const next = [...new Set(existing.filter((value) => typeof value === "string" && value.length > 0))];
	if (nextValue && !next.includes(nextValue)) next.push(nextValue);
	return next.length <= limit ? next : next.slice(next.length - limit);
}
function normalizeIsoDay(isoLike) {
	if (typeof isoLike !== "string") return null;
	return isoLike.trim().match(/^(\d{4}-\d{2}-\d{2})/)?.[1] ?? null;
}
function totalSignalCountForEntry(entry) {
	return entry.recallCount + entry.dailyCount + entry.groundedCount;
}
function normalizeShortTermRecallStore(raw, nowIso) {
	const record = asOptionalObjectRecord(raw);
	if (!record) return {
		version: 1,
		updatedAt: nowIso,
		entries: {}
	};
	const entriesRaw = asOptionalObjectRecord(record.entries);
	const entries = {};
	if (entriesRaw) for (const [key, value] of Object.entries(entriesRaw)) {
		const entry = asOptionalObjectRecord(value);
		if (!entry) continue;
		const entryPath = typeof entry.path === "string" ? normalizeMemoryPath(entry.path) : "";
		const startLine = Number(entry.startLine);
		const endLine = Number(entry.endLine);
		const source = entry.source === "memory" ? "memory" : null;
		if (!entryPath || !Number.isInteger(startLine) || !Number.isInteger(endLine) || !source) continue;
		const recallCount = Math.max(0, Math.floor(Number(entry.recallCount) || 0));
		const dailyCount = Math.max(0, Math.floor(Number(entry.dailyCount) || 0));
		const groundedCount = Math.max(0, Math.floor(Number(entry.groundedCount) || 0));
		const totalScore = Math.max(0, Number(entry.totalScore) || 0);
		const maxScore = clampScore(Number(entry.maxScore) || 0);
		const firstRecalledAt = readStringValue(entry.firstRecalledAt) ?? nowIso;
		const lastRecalledAt = readStringValue(entry.lastRecalledAt) ?? nowIso;
		const promotedAt = readStringValue(entry.promotedAt);
		const claimHash = normalizeOptionalString(entry.claimHash);
		const projectKey = normalizeProjectKeyList(entry.projectKey);
		const fullSnippet = typeof entry.snippet === "string" ? normalizeSnippet(entry.snippet) : "";
		if (fullSnippet && isContaminatedDreamingSnippet(fullSnippet, { allowTranscriptTurnSnippet: isShortTermSessionCorpusPath(entryPath) })) continue;
		const snippet = truncateShortTermSnippet(fullSnippet);
		const queryHashes = normalizeUniqueTrimmedStringList(entry.queryHashes).slice(0, 32);
		const userQueryHashes = (Array.isArray(entry.userQueryHashes) ? normalizeUniqueTrimmedStringList(entry.userQueryHashes).slice(0, 32) : void 0) ?? (dailyCount === 0 && groundedCount === 0 ? queryHashes : void 0);
		const recallDays = Array.isArray(entry.recallDays) ? entry.recallDays.map(normalizeIsoDay).filter((valueLocal) => valueLocal !== null) : [];
		const conceptTags = Array.isArray(entry.conceptTags) ? normalizeUniqueTrimmedStringList(entry.conceptTags.map(normalizeLowercaseStringOrEmpty)).slice(0, 8) : deriveConceptTags({
			path: entryPath,
			snippet: fullSnippet
		});
		const provenanceRaw = asOptionalObjectRecord(entry.provenance);
		const supersedesKey = normalizeOptionalString(provenanceRaw?.supersedesKey);
		const lastObservedAt = Date.parse(lastRecalledAt);
		const fallbackObservedAt = Number.isFinite(lastObservedAt) ? lastObservedAt : Date.parse(nowIso);
		const provenance = provenanceRaw ? {
			originClass: provenanceRaw.originClass === "owner" || provenanceRaw.originClass === "agent" || provenanceRaw.originClass === "system" || provenanceRaw.originClass === "untrusted" ? provenanceRaw.originClass : "untrusted",
			sessionKind: provenanceRaw.sessionKind === "interactive" || provenanceRaw.sessionKind === "cron" || provenanceRaw.sessionKind === "heartbeat" || provenanceRaw.sessionKind === "subagent" || provenanceRaw.sessionKind === "unknown" ? provenanceRaw.sessionKind : "unknown",
			observedAt: asFiniteNumber(provenanceRaw.observedAt) ?? fallbackObservedAt,
			...supersedesKey ? { supersedesKey } : {}
		} : void 0;
		const normalizedKey = key || buildEntryKey({
			path: entryPath,
			startLine,
			endLine,
			source,
			claimHash
		});
		entries[normalizedKey] = {
			key: normalizedKey,
			path: entryPath,
			startLine,
			endLine,
			source,
			snippet,
			recallCount,
			dailyCount,
			groundedCount,
			totalScore,
			maxScore,
			firstRecalledAt,
			lastRecalledAt,
			queryHashes,
			...userQueryHashes ? { userQueryHashes } : {},
			recallDays: recallDays.slice(-16),
			conceptTags,
			...provenance ? { provenance } : {},
			...claimHash ? { claimHash } : {},
			...projectKey ? { projectKey } : {},
			...promotedAt ? { promotedAt } : {}
		};
	}
	return {
		version: 1,
		updatedAt: readStringValue(record.updatedAt) ?? nowIso,
		entries
	};
}
function parseStoreTimestampMs(value) {
	return parseDateStringTimestampMs(value) ?? Number.NEGATIVE_INFINITY;
}
function compareStoreTimestampDesc(left, right) {
	const leftMs = parseStoreTimestampMs(left);
	const rightMs = parseStoreTimestampMs(right);
	if (leftMs === rightMs) return 0;
	return rightMs > leftMs ? 1 : -1;
}
function compareShortTermRecallRetention(a, b) {
	const lastDiff = compareStoreTimestampDesc(a.lastRecalledAt, b.lastRecalledAt);
	if (lastDiff !== 0) return lastDiff;
	const signalDiff = totalSignalCountForEntry(b) - totalSignalCountForEntry(a);
	if (signalDiff !== 0) return signalDiff;
	const totalScoreDiff = b.totalScore - a.totalScore;
	if (totalScoreDiff !== 0) return totalScoreDiff;
	const maxScoreDiff = b.maxScore - a.maxScore;
	if (maxScoreDiff !== 0) return maxScoreDiff;
	const promotedDiff = compareStoreTimestampDesc(a.promotedAt, b.promotedAt);
	if (promotedDiff !== 0) return promotedDiff;
	return a.key.localeCompare(b.key);
}
function enforceShortTermRecallStoreRetention(store) {
	const entries = Object.entries(store.entries);
	if (entries.length <= 512) return 0;
	const retained = entries.toSorted(([, a], [, b]) => compareShortTermRecallRetention(a, b)).slice(0, 512);
	store.entries = Object.fromEntries(retained.toSorted(([a], [b]) => a.localeCompare(b)));
	return entries.length - retained.length;
}
function toFiniteNonNegativeInt(value, fallback = 0) {
	return asNonNegativeFiniteNumber(Math.floor(Number(value))) ?? fallback;
}
function calculateRecencyComponent(ageDays, halfLifeDays) {
	if (!Number.isFinite(ageDays) || ageDays < 0) return 1;
	if (!Number.isFinite(halfLifeDays) || halfLifeDays <= 0) return 1;
	const lambda = Math.LN2 / halfLifeDays;
	return Math.exp(-lambda * ageDays);
}
function isShortTermMemoryPath(filePath) {
	const normalized = normalizeMemoryPath(filePath);
	return !DREAMING_MEMORY_PATH_RE.test(normalized) && (SHORT_TERM_PATH_RE.test(normalized) || SHORT_TERM_SESSION_CORPUS_RE.test(normalized) || SHORT_TERM_BASENAME_RE.test(normalized));
}
function isShortTermSessionCorpusPath(filePath) {
	return SHORT_TERM_SESSION_CORPUS_RE.test(normalizeMemoryPath(filePath));
}
function normalizeMemoryPathForWorkspace(workspaceDir, rawPath) {
	const normalized = normalizeMemoryPath(rawPath);
	const workspaceNormalized = normalizeMemoryPath(workspaceDir);
	if (path.isAbsolute(rawPath) && normalized.startsWith(`${workspaceNormalized}/`)) return normalized.slice(workspaceNormalized.length + 1);
	return normalized;
}
function parseEntryRangeFromKey(key, fallbackStartLine, fallbackEndLine) {
	const startLine = toFiniteNonNegativeInt(fallbackStartLine);
	const endLine = toFiniteNonNegativeInt(fallbackEndLine);
	if (startLine > 0 && endLine > 0) return {
		startLine,
		endLine
	};
	const match = key.match(/:(\d+):(\d+)$/);
	if (match) return {
		startLine: Math.max(1, toFiniteNonNegativeInt(match[1])),
		endLine: Math.max(1, toFiniteNonNegativeInt(match[2]))
	};
	return {
		startLine: 1,
		endLine: 1
	};
}
//#endregion
//#region extensions/memory-core/src/short-term-promotion-store.ts
const SHORT_TERM_STORE_NAMESPACES = {
	recall: SHORT_TERM_RECALL_NAMESPACE,
	phase: SHORT_TERM_PHASE_SIGNAL_NAMESPACE
};
async function readShortTermStore(workspaceDir, kind, nowIso) {
	const [entryRows, metaRows] = await Promise.all([readMemoryCoreWorkspaceEntries({
		namespace: SHORT_TERM_STORE_NAMESPACES[kind],
		workspaceDir
	}), readMemoryCoreWorkspaceEntries({
		namespace: SHORT_TERM_META_NAMESPACE,
		workspaceDir
	})]);
	return {
		version: 1,
		updatedAt: metaRows.find((entry) => entry.key === kind)?.value?.updatedAt ?? nowIso,
		entries: Object.fromEntries(entryRows.map((entry) => [entry.key, entry.value]))
	};
}
async function writeShortTermStore(workspaceDir, kind, store) {
	await writeMemoryCoreWorkspaceEntries({
		namespace: SHORT_TERM_STORE_NAMESPACES[kind],
		workspaceDir,
		entries: Object.entries(store.entries).map(([key, value]) => ({
			key,
			value
		}))
	});
	await writeMemoryCoreWorkspaceEntry({
		namespace: SHORT_TERM_META_NAMESPACE,
		workspaceDir,
		key: kind,
		value: { updatedAt: store.updatedAt }
	});
}
function resolveStorePath(workspaceDir) {
	return memoryCoreStateReference(SHORT_TERM_RECALL_NAMESPACE, workspaceDir);
}
function resolvePhaseSignalPath(workspaceDir) {
	return memoryCoreStateReference(SHORT_TERM_PHASE_SIGNAL_NAMESPACE, workspaceDir);
}
async function readStore(workspaceDir, nowIso) {
	const store = normalizeShortTermRecallStore(await readShortTermStore(workspaceDir, "recall", nowIso), nowIso);
	enforceShortTermRecallStoreRetention(store);
	return store;
}
function emptyPhaseSignalStore(nowIso) {
	return {
		version: 1,
		updatedAt: nowIso,
		entries: {}
	};
}
async function readPhaseSignalStore(workspaceDir, nowIso) {
	const record = await readShortTermStore(workspaceDir, "phase", nowIso);
	const entries = {};
	for (const [mapKey, value] of Object.entries(record.entries)) {
		const entry = asNullableRecord(value);
		if (!entry) continue;
		const key = readNonBlankString(entry.key) ?? mapKey;
		const lightHits = toFiniteNonNegativeInt(entry.lightHits, 0);
		const remHits = toFiniteNonNegativeInt(entry.remHits, 0);
		if (lightHits === 0 && remHits === 0) continue;
		const lastLightAt = readNonBlankString(entry.lastLightAt);
		const lastRemAt = readNonBlankString(entry.lastRemAt);
		const lastRemConsideredAt = readNonBlankString(entry.lastRemConsideredAt);
		entries[key] = {
			key,
			lightHits,
			remHits,
			...lastLightAt ? { lastLightAt } : {},
			...lastRemAt ? { lastRemAt } : {},
			...lastRemConsideredAt ? { lastRemConsideredAt } : {}
		};
	}
	return {
		version: 1,
		updatedAt: readNonBlankString(record.updatedAt) ?? nowIso,
		entries
	};
}
async function writePhaseSignalStore(workspaceDir, store) {
	await writeShortTermStore(workspaceDir, "phase", store);
}
async function writeStore(workspaceDir, store) {
	enforceShortTermRecallSnippetCap(store);
	enforceShortTermRecallStoreRetention(store);
	await writeShortTermStore(workspaceDir, "recall", store);
}
//#endregion
//#region extensions/memory-core/src/dreaming-dreams-file.ts
const DREAMS_FILENAMES = ["DREAMS.md", "dreams.md"];
const DEEP_START_MARKER = "<!-- openclaw:dreaming:deep:start -->";
const DEEP_END_MARKER = "<!-- openclaw:dreaming:deep:end -->";
async function resolveDreamsPath(workspaceDir) {
	const files = getMemoryWorkspaceMaintenance(workspaceDir);
	if (files) return await files.resolveDreamsPath();
	for (const name of DREAMS_FILENAMES) {
		const target = path.join(workspaceDir, name);
		try {
			await fs.access(target);
			return target;
		} catch (err) {
			if (extractErrorCode(err) !== "ENOENT") throw err;
		}
	}
	return path.join(workspaceDir, DREAMS_FILENAMES[0]);
}
function isEmptyDreamsReadError(err, code) {
	if (code === "ENOENT" || code === "ENOTDIR" || code === "not-found" || code === "not-file" || code === "path-alias" || code === "path-mismatch" || code === "symlink") return true;
	return err instanceof Error && err.message === "path must be a regular file";
}
async function readDreamsFile(dreamsPath, workspaceDir) {
	const files = workspaceDir ? getMemoryWorkspaceMaintenance(workspaceDir) : void 0;
	if (files) return await files.readDreams(dreamsPath);
	try {
		return decodeUtf8Input((await readRegularFile({ filePath: dreamsPath })).buffer, `DREAMS.md ${dreamsPath} (preserve the original and convert a copy to UTF-8 before retrying)`);
	} catch (err) {
		if (isEmptyDreamsReadError(err, extractErrorCode(err))) return "";
		throw err;
	}
}
async function assertSafeDreamsPath(dreamsPath) {
	const stat = await fs.lstat(dreamsPath).catch((err) => {
		if (extractErrorCode(err) === "ENOENT") return null;
		throw err;
	});
	if (!stat) return;
	if (stat.isSymbolicLink()) throw new Error("Refusing to write symlinked DREAMS.md");
	if (!stat.isFile()) throw new Error("Refusing to write non-file DREAMS.md");
}
async function writeDreamsFileAtomic(dreamsPath, content, workspaceDir) {
	const assertCurrent = captureMemoryMutationAuthority();
	assertCurrent?.();
	const files = workspaceDir ? getMemoryWorkspaceMaintenance(workspaceDir) : void 0;
	if (files) return await files.writeDreams(dreamsPath, content, assertCurrent);
	await fs.mkdir(path.dirname(dreamsPath), { recursive: true });
	await assertSafeDreamsPath(dreamsPath);
	await replaceFileAtomic({
		filePath: dreamsPath,
		content,
		mode: 384,
		preserveExistingMode: true,
		tempPrefix: `${path.basename(dreamsPath)}.dreams`,
		throwOnCleanupError: true,
		assertBeforeMutation: assertCurrent
	});
}
async function updateDreamsFile(params) {
	return await withMemoryWorkspaceLock(params.workspaceDir, async () => {
		const dreamsPath = await resolveDreamsPath(params.workspaceDir);
		const existing = await readDreamsFile(dreamsPath, params.workspaceDir);
		const { content, result, shouldWrite = true } = await params.updater(existing, dreamsPath);
		if (shouldWrite) await writeDreamsFileAtomic(dreamsPath, content.endsWith("\n") ? content : `${content}\n`, params.workspaceDir);
		return result;
	});
}
async function updateDeepDreamsFile(params) {
	const body = params.bodyLines.join("\n");
	return await updateDreamsFile({
		workspaceDir: params.workspaceDir,
		updater: (existing, dreamsPath) => ({
			content: replaceManagedMarkdownBlock({
				original: existing,
				heading: "## Deep Sleep",
				startMarker: DEEP_START_MARKER,
				endMarker: DEEP_END_MARKER,
				body
			}),
			result: dreamsPath,
			shouldWrite: params.bodyLines.length > 0
		})
	});
}
const DIARY_START_MARKER = "<!-- openclaw:dreaming:diary:start -->";
const DIARY_END_MARKER = "<!-- openclaw:dreaming:diary:end -->";
const BACKFILL_ENTRY_MARKER = "openclaw:dreaming:backfill-entry";
const RECENT_DIARY_CONTEXT_LIMIT = 3;
const RECENT_DIARY_CONTEXT_MAX_CHARS = 360;
function formatNarrativeDate(epochMs, timezone) {
	const opts = {
		timeZone: timezone ?? process.env.TZ,
		year: "numeric",
		month: "long",
		day: "numeric",
		hour: "numeric",
		minute: "2-digit",
		hour12: true,
		timeZoneName: "short"
	};
	return new Intl.DateTimeFormat("en-US", opts).format(new Date(epochMs));
}
function ensureDiarySection(existing) {
	if (existing.includes(DIARY_START_MARKER) && existing.includes(DIARY_END_MARKER)) return existing;
	const diarySection = `# Dream Diary\n\n${DIARY_START_MARKER}\n${DIARY_END_MARKER}\n`;
	if (existing.trim().length === 0) return diarySection;
	return diarySection + "\n" + existing;
}
function replaceDiaryContent(existing, diaryContent) {
	const ensured = ensureDiarySection(existing);
	const startIdx = ensured.indexOf(DIARY_START_MARKER);
	const endIdx = ensured.indexOf(DIARY_END_MARKER);
	if (startIdx < 0 || endIdx < 0 || endIdx < startIdx) return ensured;
	const before = ensured.slice(0, startIdx + 38);
	const after = ensured.slice(endIdx);
	return before + (diaryContent.trim().length > 0 ? `\n${diaryContent.trim()}\n` : "\n") + after;
}
function splitDiaryBlocks(diaryContent) {
	return diaryContent.split(/\n---\n/).map((block) => block.trim()).filter((block) => block.length > 0);
}
function clampDreamDiaryContextEntry(entry) {
	const normalized = entry.replace(/\s+/g, " ").trim();
	if (normalized.length <= RECENT_DIARY_CONTEXT_MAX_CHARS) return normalized;
	return `${truncateUtf16Safe(normalized, RECENT_DIARY_CONTEXT_MAX_CHARS).trimEnd()}...`;
}
function diaryTextLines(block) {
	return block.split("\n").map((line) => line.trim()).filter((line) => line.length > 0 && !line.startsWith("<!--") && !line.startsWith("#"));
}
function normalizeDiaryBlockBody(block) {
	return clampDreamDiaryContextEntry(diaryTextLines(block).filter((line) => !(line.startsWith("*") && line.endsWith("*") && line.length > 2)).join(" "));
}
function isOptionalDiaryContextReadError(err) {
	const code = extractErrorCode(err);
	return code === "EACCES" || code === "EPERM" || code === "ERR_INVALID_UTF8" || isEmptyDreamsReadError(err, code);
}
function readDiaryBlocks(existing) {
	const startIdx = existing.indexOf(DIARY_START_MARKER);
	const endIdx = existing.indexOf(DIARY_END_MARKER);
	if (startIdx < 0 || endIdx < startIdx) return null;
	return splitDiaryBlocks(existing.slice(startIdx + 38, endIdx));
}
function getDiaryContextEntries(existing) {
	return (readDiaryBlocks(existing) ?? []).map(normalizeDiaryBlockBody).filter((entry) => entry.length > 0);
}
async function readRecentDreamDiaryEntries(params) {
	const limit = Math.max(0, Math.floor(params.limit ?? RECENT_DIARY_CONTEXT_LIMIT));
	if (limit === 0) return [];
	let existing;
	try {
		existing = await readDreamsFile(await resolveDreamsPath(params.workspaceDir), params.workspaceDir);
	} catch (err) {
		if (isOptionalDiaryContextReadError(err)) return [];
		throw err;
	}
	return getDiaryContextEntries(existing).slice(-limit).toReversed();
}
function normalizeDiaryBlockFingerprint(block) {
	let dateLine = "";
	const bodyLines = [];
	for (const line of diaryTextLines(block)) {
		if (!dateLine && line.startsWith("*") && line.endsWith("*") && line.length > 2) {
			dateLine = line.slice(1, -1).trim();
			continue;
		}
		bodyLines.push(line);
	}
	return `${dateLine.replace(/\s+/g, " ").trim()}\n${bodyLines.join("\n")}`;
}
function joinDiaryBlocks(blocks) {
	return blocks.map((block) => `---\n\n${block.trim()}\n`).join("\n");
}
function dedupeDiaryBlocks(blocks, seen = /* @__PURE__ */ new Set()) {
	return blocks.filter((block) => {
		const fingerprint = normalizeDiaryBlockFingerprint(block);
		if (seen.has(fingerprint)) return false;
		seen.add(fingerprint);
		return true;
	});
}
function filterDiaryContent(existing, filter) {
	const ensured = ensureDiarySection(existing);
	const blocks = readDiaryBlocks(ensured);
	if (!blocks) return {
		updated: ensured,
		removed: 0,
		kept: 0
	};
	const kept = filter(blocks);
	return {
		updated: replaceDiaryContent(ensured, joinDiaryBlocks(kept)),
		removed: blocks.length - kept.length,
		kept: kept.length
	};
}
function stripBackfillDiaryBlocks(existing) {
	return filterDiaryContent(existing, (blocks) => blocks.filter((block) => !block.includes(BACKFILL_ENTRY_MARKER)));
}
function formatBackfillDiaryDate(isoDay) {
	const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoDay);
	if (!match) return isoDay;
	const [, year, month, day] = match;
	const opts = {
		timeZone: "UTC",
		year: "numeric",
		month: "long",
		day: "numeric"
	};
	const epochMs = Date.UTC(Number(year), Number(month) - 1, Number(day), 12);
	return new Intl.DateTimeFormat("en-US", opts).format(new Date(epochMs));
}
function buildBackfillDiaryEntry(params) {
	const dateStr = formatBackfillDiaryDate(params.isoDay);
	const marker = `<!-- ${BACKFILL_ENTRY_MARKER} day=${params.isoDay}${params.sourcePath ? ` source=${params.sourcePath}` : ""} -->`;
	const body = params.bodyLines.map((line) => line.trimEnd()).join("\n").trim();
	return [
		`*${dateStr}*`,
		marker,
		body
	].filter((part) => part.length > 0).join("\n\n");
}
async function writeBackfillDiaryEntries(params) {
	return await updateDreamsFile({
		workspaceDir: params.workspaceDir,
		updater: (existing, dreamsPath) => {
			const stripped = params.preserveExisting ? {
				updated: existing,
				removed: 0
			} : stripBackfillDiaryBlocks(existing);
			const preservedBlocks = readDiaryBlocks(stripped.updated) ?? [];
			const additions = params.entries.map(buildBackfillDiaryEntry);
			const existingFingerprints = new Set(preservedBlocks.map((block) => normalizeDiaryBlockFingerprint(block)));
			const appended = params.preserveExisting ? dedupeDiaryBlocks(additions, existingFingerprints) : additions;
			const nextBlocks = [...preservedBlocks, ...appended];
			return {
				content: replaceDiaryContent(stripped.updated, joinDiaryBlocks(nextBlocks)),
				result: {
					dreamsPath,
					written: appended.length,
					replaced: stripped.removed
				}
			};
		}
	});
}
async function removeBackfillDiaryEntries(params) {
	return await updateDreamsFile({
		workspaceDir: params.workspaceDir,
		updater: (existing, dreamsPath) => {
			const stripped = stripBackfillDiaryBlocks(existing);
			return {
				content: stripped.updated,
				result: {
					dreamsPath,
					removed: stripped.removed
				},
				shouldWrite: stripped.removed > 0 || existing.length > 0
			};
		}
	});
}
async function dedupeDreamDiaryEntries(params) {
	return await updateDreamsFile({
		workspaceDir: params.workspaceDir,
		updater: (existing, dreamsPath) => {
			const { updated, removed, kept } = filterDiaryContent(existing, dedupeDiaryBlocks);
			return {
				content: updated,
				result: {
					dreamsPath,
					removed,
					kept
				},
				shouldWrite: removed > 0
			};
		}
	});
}
async function appendNarrativeEntry(params) {
	const entry = `\n---\n\n*${formatNarrativeDate(params.nowMs, params.timezone)}*\n\n${params.narrative}\n`;
	return await updateDreamsFile({
		workspaceDir: params.workspaceDir,
		updater: async (existing, dreamsPath) => {
			const sourceKeys = params.sourceEntryKeys ?? [];
			const currentSources = sourceKeys.length > 0 ? (await readStore(params.workspaceDir, new Date(params.nowMs).toISOString())).entries : void 0;
			const currentDiary = new Set(getDiaryContextEntries(existing));
			if (sourceKeys.some((key) => !currentSources?.[key]) || params.recentDiaryEntries?.some((block) => !currentDiary.has(block))) return {
				content: existing,
				result: void 0,
				shouldWrite: false
			};
			let updated;
			if (existing.includes(DIARY_START_MARKER) && existing.includes(DIARY_END_MARKER)) {
				const endIdx = existing.lastIndexOf(DIARY_END_MARKER);
				updated = existing.slice(0, endIdx) + entry + "\n" + existing.slice(endIdx);
			} else if (existing.includes(DIARY_START_MARKER)) {
				const startIdx = existing.indexOf(DIARY_START_MARKER) + 38;
				updated = existing.slice(0, startIdx) + entry + "\n<!-- openclaw:dreaming:diary:end -->\n" + existing.slice(startIdx);
			} else {
				const diarySection = `# Dream Diary\n\n${DIARY_START_MARKER}${entry}\n${DIARY_END_MARKER}\n`;
				updated = existing.trim().length === 0 ? diarySection : `${diarySection}\n${existing}`;
			}
			return {
				content: updated,
				result: dreamsPath
			};
		}
	});
}
//#endregion
export { resolveLockPath as $, hashQuery as A, normalizeShortTermRecallStore as B, buildDailyClaimEntryKey as C, compareStoreTimestampDesc as D, clampScore as E, mergeProjectKeyLists as F, toFiniteNonNegativeInt as G, parseEntryRangeFromKey as H, mergeRecentDistinct as I, deriveConceptTags as J, totalSignalCountForEntry as K, normalizeIsoDay as L, isGenericDailyHeading as M, isShortTermMemoryPath as N, enforceShortTermRecallStoreRetention as O, isShortTermSessionCorpusPath as P, isShortTermLockStealable as Q, normalizeMemoryPath as R, buildClaimHash as S, calculateRecencyComponent as T, parseStoreTimestampMs as U, normalizeSnippet as V, resolvePromotionThresholds as W, summarizeConceptTagScriptCoverage as X, normalizeConceptToken as Y, deleteShortTermLockEntryIfCurrent as Z, resolvePhaseSignalPath as _, readDreamsFile as a, writeStore as b, resolveDreamsPath as c, writeBackfillDiaryEntries as d, withMemoryWorkspaceLock as et, writeDreamsFileAtomic as f, readStore as g, readShortTermStore as h, dedupeDreamDiaryEntries as i, isContaminatedDreamingSnippet as j, formatPromotedSnippetForMemory as k, updateDeepDreamsFile as l, readPhaseSignalStore as m, appendNarrativeEntry as n, readRecentDreamDiaryEntries as o, emptyPhaseSignalStore as p, truncateShortTermSnippet as q, clampDreamDiaryContextEntry as r, removeBackfillDiaryEntries as s, DREAMS_FILENAMES as t, withMemoryWorkspacePreparation as tt, updateDreamsFile as u, resolveStorePath as v, buildEntryKey as w, SHORT_TERM_BASENAME_RE as x, writePhaseSignalStore as y, normalizeMemoryPathForWorkspace as z };
