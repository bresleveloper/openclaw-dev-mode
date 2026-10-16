import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { R as timestampMsToIsoString, w as parseStrictPositiveInteger } from "./number-coercion-CuVhdCBs.mjs";
import { i as extractErrorCode } from "./error-coercion-CvJK4lmH.mjs";
import { c as isRecord, r as asNullableRecord } from "./record-coerce-TIsquoVR.mjs";
import { c as normalizeSingleOrTrimmedStringList, d as normalizeStringEntries, y as uniqueStrings } from "./string-normalization-CECOqf64.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { D as statRegularFileSync, t as FsSafeError, w as root } from "./fs-safe-BUXBSN-4.mjs";
import { r as isPathInside } from "./path-guards-CH7noY0Z.mjs";
import { g as resolveDefaultAgentId } from "./agent-scope-config-CDYpzA0r.mjs";
import { n as callGatewayFromCli } from "./gateway-rpc-Cl_Z2Z7Q.mjs";
import "./string-coerce-runtime-50qKeWeL.mjs";
import "./file-access-runtime-BMp89X4Y.mjs";
import "./security-runtime-CpTHQYW2.mjs";
import "./text-utility-runtime-BDs7x8Fk.mjs";
import "./number-runtime-CgyXj1A5.mjs";
import "./gateway-runtime-DMDKFL1_.mjs";
import "./memory-host-core-BFby6pBK.mjs";
import { n as withTrailingNewline, t as replaceManagedMarkdownBlock } from "./memory-host-markdown-CDZAV0_W.mjs";
import { C as searchMemoryWiki, E as appendMemoryWikiLog, S as getMemoryWikiPage, T as resolveMemoryWikiTimestamp, _ as readExistingWikiPage, a as renderMemoryWikiStatus, b as withMemoryWikiVaultMutation, d as probeObsidianCli, f as runObsidianAction, h as applyMemoryWikiMutation, i as renderMemoryWikiDoctor, l as OBSIDIAN_ACTIONS, m as ingestMemoryWikiSource, n as renderWikiSearchResults, o as resolveMemoryWikiStatus, p as lintMemoryWikiVault, r as buildMemoryWikiDoctorReport, s as syncMemoryWikiImportedSources, t as renderWikiMutationSummary, u as assertOfficialObsidianCliSupported, v as writeGuardedVaultPage, w as initializeMemoryWikiVault, x as WIKI_SEARCH_MODES, y as compileMemoryWikiVault } from "./presentation-DVqsdtcK.mjs";
import { i as resolveMemoryWikiAgentConfig, n as WIKI_SEARCH_BACKENDS, r as WIKI_SEARCH_CORPORA } from "./config-BATWLWdx.mjs";
import { C as parseWikiMarkdown, E as renderWikiMarkdown, F as walkMemoryWikiDirectory, M as WIKI_RELATED_START_MARKER, N as forEachMarkdownCodeRange, c as writeMemoryWikiImportRunRecord, j as WIKI_RELATED_END_MARKER, k as slugifyWikiSegment, o as readMemoryWikiImportRunRecord, r as countMemoryWikiImportRunStateRows, s as resolveMemoryWikiImportRunsDir, t as MEMORY_WIKI_IMPORT_RUN_STATE_MAX_ENTRIES, y as createWikiPageFilename } from "./import-runs-state-DGOSREgh.mjs";
import path from "node:path";
import fs from "node:fs/promises";
import { createHash, randomUUID } from "node:crypto";
//#region extensions/memory-wiki/src/chatgpt-import-recovery.ts
function recoverySlotPrefix(ref) {
	return `${ref.kind}-${ref.index}-${createHash("sha256").update(ref.entry.path).digest("hex")}-`;
}
function resolveContainedImportPath(root, relativePath, label) {
	if (!relativePath || path.isAbsolute(relativePath) || path.win32.isAbsolute(relativePath)) throw new Error(`${label} must be a relative path: ${relativePath}`);
	const resolvedRoot = path.resolve(root);
	const resolvedPath = path.resolve(resolvedRoot, relativePath);
	if (!isPathInside(resolvedRoot, resolvedPath)) throw new Error(`${label} must stay inside ${resolvedRoot}: ${relativePath}`);
	return resolvedPath;
}
function isFsSafeErrorCode(error, code) {
	return error instanceof FsSafeError && error.code === code;
}
async function reserveRecoverySlot(runRoot, ref) {
	await runRoot.mkdir("recovered");
	const slotRelativePath = path.posix.join("recovered", `${recoverySlotPrefix(ref)}${randomUUID()}`);
	await runRoot.mkdir(slotRelativePath);
	return {
		slotRelativePath,
		contentRelativePath: path.posix.join(slotRelativePath, "content")
	};
}
async function removeEmptyRecoverySlot(runRoot, slotRelativePath) {
	try {
		if ((await runRoot.list(slotRelativePath)).length > 0) return;
		await runRoot.remove(slotRelativePath);
	} catch (error) {
		if (isFsSafeErrorCode(error, "not-found")) return;
		throw error;
	}
}
async function moveTargetToRecovery(params) {
	const sourcePath = resolveContainedImportPath(params.vaultRoot.rootReal, params.ref.entry.path, "Memory Wiki import page path");
	for (;;) {
		const slot = await reserveRecoverySlot(params.runRoot, params.ref);
		const recoveryVaultRelativePath = path.posix.join(params.runRelativePath, slot.contentRelativePath);
		try {
			await params.vaultRoot.move(params.ref.entry.path, recoveryVaultRelativePath, { assertBeforeMutation: () => {
				let source;
				try {
					source = statRegularFileSync(sourcePath);
				} catch (cause) {
					if (extractErrorCode(cause)) throw cause;
					throw new FsSafeError("invalid-path", "Memory Wiki rollback requires a regular file", { cause });
				}
				if (source.missing) throw new FsSafeError("not-found", "Memory Wiki rollback target no longer exists");
			} });
			return {
				ref: params.ref,
				...slot
			};
		} catch (error) {
			await removeEmptyRecoverySlot(params.runRoot, slot.slotRelativePath);
			if (isFsSafeErrorCode(error, "not-found")) return null;
			if (isFsSafeErrorCode(error, "already-exists")) continue;
			throw error;
		}
	}
}
//#endregion
//#region extensions/memory-wiki/src/chatgpt-import.ts
const CHATGPT_PREFERENCE_SIGNAL_RE = /\b(prefer|prefers|preference|want|wants|need|needs|avoid|avoids|hate|hates|love|loves|default to|should default to|always use|don't want|does not want|likes|dislikes)\b/i;
const HUMAN_START_MARKER = "<!-- openclaw:human:start -->";
const HUMAN_END_MARKER = "<!-- openclaw:human:end -->";
const MAX_ROLLBACK_RECREATE_ATTEMPTS = 32;
const CHATGPT_RISK_RULES = [
	{
		label: "relationships",
		pattern: /\b(relationship|dating|breakup|jealous|sex|intimacy|partner|apology|trust|boyfriend|girlfriend|husband|wife)\b/i
	},
	{
		label: "health",
		pattern: /\b(supplement|medication|diagnosis|symptom|therapy|depression|anxiety|mri|migraine|injury|pain|cortisol|sleep)\b/i
	},
	{
		label: "legal_tax",
		pattern: /\b(contract|tax|legal|law|lawsuit|visa|immigration|license|insurance|claim|non-residence|residency)\b/i
	},
	{
		label: "finance",
		pattern: /\b(investment|invest|portfolio|dividend|yield|coupon|valuation|mortgage|loan|crypto|covered call|call option|put option)\b/i
	},
	{
		label: "drugs",
		pattern: /\b(vape|weed|cannabis|nicotine|opioid|ketamine)\b/i
	}
];
function normalizeWhitespace(value) {
	return value.trim().replace(/\s+/g, " ");
}
async function loadConversations(exportInputPath) {
	const exportPath = path.resolve(exportInputPath);
	const conversationsPath = exportPath.endsWith(".json") ? exportPath : path.join(exportPath, "conversations.json");
	const raw = await fs.readFile(conversationsPath, "utf8");
	const parsed = JSON.parse(raw);
	const conversations = Array.isArray(parsed) ? parsed : Object.values(asNullableRecord(parsed) ?? {}).find(Array.isArray);
	if (!conversations) throw new Error(`Unrecognized ChatGPT conversations export format: ${conversationsPath}`);
	return {
		exportPath,
		conversationsPath,
		conversations: conversations.filter(isRecord)
	};
}
function isoFromUnix(raw) {
	if (typeof raw !== "number" && typeof raw !== "string") return;
	const numeric = Number(raw);
	if (!Number.isFinite(numeric)) return;
	return timestampMsToIsoString(numeric * 1e3);
}
function cleanMessageText(value) {
	const trimmed = value.trim();
	if (!trimmed) return "";
	if ((trimmed.includes("asset_pointer") || trimmed.includes("image_asset_pointer") || trimmed.includes("dalle") || trimmed.includes("file_service")) && trimmed.length > 40) return "";
	if (trimmed.startsWith("{") && trimmed.length > 80 && (trimmed.includes(":") || trimmed.includes("content_type"))) {
		const textMatch = trimmed.match(/["']text["']\s*:\s*(["'])(.+?)\1/s);
		return textMatch?.[2] ? normalizeWhitespace(textMatch[2]) : "";
	}
	return trimmed;
}
function extractMessageText(message) {
	const content = asNullableRecord(message.content);
	if (content) {
		const parts = content.parts;
		if (Array.isArray(parts)) {
			const collected = [];
			for (const part of parts) {
				if (typeof part === "string") {
					const cleaned = cleanMessageText(part);
					if (cleaned) collected.push(cleaned);
					continue;
				}
				const partRecord = asNullableRecord(part);
				if (partRecord && typeof partRecord.text === "string" && partRecord.text.trim()) collected.push(partRecord.text.trim());
			}
			return collected.join("\n").trim();
		}
		if (typeof content.text === "string") return cleanMessageText(content.text);
	}
	return typeof message.text === "string" ? cleanMessageText(message.text) : "";
}
function activeBranchMessages(conversation) {
	const mapping = asNullableRecord(conversation.mapping);
	if (!mapping) return [];
	let currentNode = typeof conversation.current_node === "string" ? conversation.current_node : void 0;
	const seen = /* @__PURE__ */ new Set();
	const chain = [];
	while (currentNode && !seen.has(currentNode)) {
		seen.add(currentNode);
		const node = asNullableRecord(mapping[currentNode]);
		if (!node) break;
		const message = asNullableRecord(node.message);
		if (message) {
			const author = asNullableRecord(message.author);
			const role = typeof author?.role === "string" ? author.role : "unknown";
			const text = extractMessageText(message);
			if (text) chain.push({
				role,
				text
			});
		}
		currentNode = typeof node.parent === "string" ? node.parent : void 0;
	}
	return chain.toReversed();
}
function inferRisk(title, sampleText) {
	const blob = `${title}\n${sampleText}`.toLowerCase();
	const reasons = CHATGPT_RISK_RULES.filter((rule) => rule.pattern.test(blob)).map((rule) => rule.label);
	if (reasons.length > 0) return {
		level: "high",
		reasons: uniqueStrings(reasons)
	};
	if (/\b(career|job|salary|interview|offer|resume|cover letter)\b/i.test(blob)) return {
		level: "medium",
		reasons: ["work_career"]
	};
	return {
		level: "low",
		reasons: []
	};
}
function inferLabels(title, sampleText) {
	const blob = `${title}\n${sampleText}`.toLowerCase();
	const labels = /* @__PURE__ */ new Set(["domain/personal"]);
	const addAreaTopic = (area, topic = area) => {
		labels.add(`area/${area}`);
		labels.add(`topic/${topic}`);
	};
	if (/\b(translate|translation|traduc\w*|traducc\w*|traduç\w*|traducci[oó]n|traduccio|traducció|traduzione)\b/i.test(blob)) labels.add("topic/translation");
	for (const [area, pattern] of [
		["language-learning", /\b(anki|flashcards?|grammar|conjugat\w*|declension|pronunciation|vocab(?:ular(?:y|io))?|lesson|tutor|teacher|jlpt|kanji|hiragana|katakana|study|learn|practice)\b/i],
		["travel", /\b(hike|trail|hotel|flight|trip|travel|airport|itinerary|booking|airbnb|train|stay)\b/i],
		["cooking", /\b(recipe|cook|cooking|bread|sourdough|pizza|espresso|coffee|mousse|cast iron|meatballs?)\b/i],
		["gardening", /\b(garden|orchard|plant|soil|compost|agroforestry|permaculture|mulch|beds?|irrigation|seeds?)\b/i],
		["relationships", /\b(dating|relationship|partner|jealous|breakup|trust)\b/i],
		["finance", /\b(investment|invest|portfolio|dividend|yield|coupon|valuation|return|mortgage|loan|kraken|crypto|covered call|call option|put option|option chain|bond|stocks?)\b/i],
		["legal-tax", /\b(contract|mou|tax|impuesto|legal|law|lawsuit|visa|immigration|license|licencia|dispute|claim|insurance|non-residence|residency)\b/i],
		["health", /\b(supplement|medication|diagnos(?:is|e)|symptom|therapy|depress(?:ion|ed)|anxiet(?:y|ies)|mri|migraine|injur(?:y|ies)|pain|cortisol|sleep|dentist|dermatolog(?:ist|y))\b/i],
		["life-admin", /\b(book (an )?appointment|rebook|open (a )?new account|driving test|exam|gestor(?:a)?|itv)\b/i]
	]) if (pattern.test(blob)) addAreaTopic(area);
	if (/\b(frc|robot|robotics|wpilib|limelight|chiefdelphi)\b/i.test(blob)) addAreaTopic("work", "robotics");
	else if (/\b(docker|git|python|node|npm|pip|sql|postgres|api|bug|stack trace|permission denied)\b/i.test(blob)) addAreaTopic("work", "software");
	else if (/\b(job|interview|cover letter|resume|cv)\b/i.test(blob)) addAreaTopic("work", "career");
	if (/\b(wifi|wi-fi|starlink|router|mesh|network|orbi|milesight|coverage)\b/i.test(blob)) addAreaTopic("home", "home-infrastructure");
	if (/\b(p38|range rover|porsche|bmw|bobcat|excavator|auger|trailer|chainsaw|stihl)\b/i.test(blob)) addAreaTopic("vehicles");
	if (![...labels].some((label) => label.startsWith("area/"))) labels.add("area/other");
	return [...labels];
}
function collectPreferenceSignals(userTexts) {
	const signals = [];
	const seen = /* @__PURE__ */ new Set();
	for (const text of userTexts.slice(0, 25)) for (const rawLine of text.split(/\r?\n/)) {
		const line = normalizeWhitespace(rawLine);
		if (!line || !CHATGPT_PREFERENCE_SIGNAL_RE.test(line)) continue;
		const key = line.toLowerCase();
		if (seen.has(key)) continue;
		seen.add(key);
		signals.push(line);
		if (signals.length >= 10) return signals;
	}
	return signals;
}
function buildTranscript(messages) {
	if (messages.length === 0) return "_No active-branch transcript could be reconstructed._";
	return messages.flatMap((message) => [
		`### ${message.role[0]?.toUpperCase() ?? "U"}${message.role.slice(1)}`,
		"",
		message.text,
		""
	]).join("\n").trim();
}
function resolveConversationPagePath(record) {
	const conversationSlug = record.conversationId.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
	const pageId = `source.chatgpt.${conversationSlug || createHash("sha1").update(record.conversationId).digest("hex").slice(0, 12)}`;
	const datePrefix = record.createdAt?.slice(0, 10) ?? "undated";
	return {
		pageId,
		pagePath: path.join("sources", `chatgpt-${datePrefix}-${conversationSlug || "export"}.md`).replace(/\\/g, "/")
	};
}
function toConversationRecord(conversation, sourcePath) {
	const conversationId = typeof conversation.conversation_id === "string" ? conversation.conversation_id.trim() : "";
	if (!conversationId) return null;
	const title = typeof conversation.title === "string" && conversation.title.trim() ? conversation.title.trim() : "Untitled conversation";
	const transcript = activeBranchMessages(conversation);
	const userTexts = transcript.filter((entry) => entry.role === "user").map((entry) => entry.text);
	const assistantTexts = transcript.filter((entry) => entry.role === "assistant");
	const sampleText = userTexts.slice(0, 6).join("\n");
	const createdAt = isoFromUnix(conversation.create_time);
	const risk = inferRisk(title, sampleText);
	const labels = inferLabels(title, sampleText);
	const { pageId, pagePath } = resolveConversationPagePath({
		conversationId,
		createdAt
	});
	return {
		conversationId,
		title,
		createdAt,
		updatedAt: isoFromUnix(conversation.update_time) ?? createdAt,
		sourcePath,
		pageId,
		pagePath,
		labels,
		risk,
		userMessageCount: userTexts.length,
		assistantMessageCount: assistantTexts.length,
		preferenceSignals: risk.level === "low" ? collectPreferenceSignals(userTexts) : [],
		firstUserLine: userTexts[0]?.split(/\r?\n/)[0]?.trim(),
		lastUserLine: userTexts.at(-1)?.split(/\r?\n/)[0]?.trim(),
		transcript
	};
}
function renderConversationPage(record) {
	const autoDigestLines = record.risk.level === "low" ? [
		`- User messages: ${record.userMessageCount}`,
		`- Assistant messages: ${record.assistantMessageCount}`,
		...record.firstUserLine ? [`- First user line: ${record.firstUserLine}`] : [],
		...record.lastUserLine ? [`- Last user line: ${record.lastUserLine}`] : [],
		...record.preferenceSignals.length > 0 ? ["- Preference signals:", ...record.preferenceSignals.map((line) => `  - ${line}`)] : ["- Preference signals: none detected"]
	] : ["- Auto digest withheld from durable-candidate generation until reviewed.", `- Risk reasons: ${record.risk.reasons.length > 0 ? record.risk.reasons.join(", ") : "none recorded"}`];
	return renderWikiMarkdown({
		frontmatter: {
			pageType: "source",
			id: record.pageId,
			title: `ChatGPT Export: ${record.title}`,
			sourceType: "chatgpt-export",
			sourceSystem: "chatgpt",
			sourcePath: record.sourcePath,
			conversationId: record.conversationId,
			riskLevel: record.risk.level,
			riskReasons: record.risk.reasons,
			labels: record.labels,
			status: "draft",
			...record.createdAt ? { createdAt: record.createdAt } : {},
			...record.updatedAt ? { updatedAt: record.updatedAt } : {}
		},
		body: [
			`# ChatGPT Export: ${record.title}`,
			"",
			"## Source",
			`- Conversation id: \`${record.conversationId}\``,
			`- Export file: \`${record.sourcePath}\``,
			...record.createdAt ? [`- Created: ${record.createdAt}`] : [],
			...record.updatedAt ? [`- Updated: ${record.updatedAt}`] : [],
			"",
			"## Auto Triage",
			`- Risk level: \`${record.risk.level}\``,
			`- Labels: ${record.labels.join(", ")}`,
			`- Active-branch messages: ${record.transcript.length}`,
			"",
			"## Auto Digest",
			...autoDigestLines,
			"",
			"## Active Branch Transcript",
			buildTranscript(record.transcript),
			"",
			"## Notes",
			HUMAN_START_MARKER,
			HUMAN_END_MARKER,
			""
		].join("\n")
	});
}
const HUMAN_BLOCK_PATTERN = new RegExp(`${HUMAN_START_MARKER}[\\s\\S]*?${HUMAN_END_MARKER}`);
const RELATED_BLOCK_BODY_PATTERN = new RegExp(`${WIKI_RELATED_START_MARKER}\\n?([\\s\\S]*?)\\n?${WIKI_RELATED_END_MARKER}`);
function preserveExistingPageBlocks(rendered, existing) {
	if (!existing.trim()) return withTrailingNewline(rendered);
	const parsedExisting = parseWikiMarkdown(existing);
	const parsedRendered = parseWikiMarkdown(rendered);
	let nextBody = parsedRendered.body;
	const humanBlock = parsedExisting.body.match(HUMAN_BLOCK_PATTERN)?.[0];
	if (humanBlock) nextBody = nextBody.replace(HUMAN_BLOCK_PATTERN, () => humanBlock);
	const relatedBody = parsedExisting.body.match(RELATED_BLOCK_BODY_PATTERN)?.[1]?.trim();
	if (relatedBody) nextBody = replaceManagedMarkdownBlock({
		original: nextBody,
		heading: "## Related",
		startMarker: WIKI_RELATED_START_MARKER,
		endMarker: WIKI_RELATED_END_MARKER,
		body: relatedBody
	});
	return withTrailingNewline(renderWikiMarkdown({
		frontmatter: parsedRendered.frontmatter,
		body: nextBody
	}));
}
function buildRunId(exportPath, nowIso) {
	const seed = `${exportPath}:${nowIso}:${Math.random()}`;
	return `chatgpt-${createHash("sha1").update(seed).digest("hex").slice(0, 12)}`;
}
function normalizeConversationActions(records, operations) {
	return records.map((record) => ({
		conversationId: record.conversationId,
		title: record.title,
		pagePath: record.pagePath,
		operation: operations.get(record.pagePath) ?? "skip",
		riskLevel: record.risk.level,
		labels: record.labels,
		userMessageCount: record.userMessageCount,
		assistantMessageCount: record.assistantMessageCount,
		preferenceSignals: record.preferenceSignals
	}));
}
async function readImportRunRecord(vaultRoot, runId) {
	const record = await readMemoryWikiImportRunRecord(vaultRoot, runId);
	if (!record) throw new Error(`Memory Wiki import run not found: ${runId}`);
	return record;
}
const MACHINE_RELATED_BLOCK_PATTERN = new RegExp(`(?:^|\\n\\n)## Related\\n${WIKI_RELATED_START_MARKER}\\n[\\s\\S]*?\\n${WIKI_RELATED_END_MARKER}`, "g");
function hashChatGptImportContent(content) {
	const importOwnedContent = content.replace(MACHINE_RELATED_BLOCK_PATTERN, "");
	return createHash("sha256").update(importOwnedContent, "utf8").digest("hex");
}
async function writeTrackedImportPage(params) {
	const absolutePath = path.join(params.vaultRoot, params.relativePath);
	const contentHash = hashChatGptImportContent(params.rendered);
	await fs.mkdir(path.dirname(absolutePath), { recursive: true });
	if (!params.existing) {
		await fs.writeFile(absolutePath, params.rendered, "utf8");
		params.record.createdPaths.push({
			path: params.relativePath,
			contentHash
		});
		return;
	}
	const snapshotHash = createHash("sha1").update(params.relativePath).digest("hex").slice(0, 12);
	const snapshotRelativePath = path.join("snapshots", `${snapshotHash}.md`).replace(/\\/g, "/");
	const snapshotAbsolutePath = path.join(params.runDir, snapshotRelativePath);
	await fs.mkdir(path.dirname(snapshotAbsolutePath), { recursive: true });
	await fs.writeFile(snapshotAbsolutePath, params.existing, "utf8");
	await fs.writeFile(absolutePath, params.rendered, "utf8");
	params.record.updatedPaths.push({
		path: params.relativePath,
		snapshotPath: snapshotRelativePath,
		contentHash
	});
}
async function importChatGptConversations(params) {
	return await withMemoryWikiVaultMutation(params.config.vault.path, async () => {
		await initializeMemoryWikiVault(params.config, { nowMs: params.nowMs });
		const { exportPath, conversationsPath, conversations } = await loadConversations(params.exportPath);
		const records = conversations.map((conversation) => toConversationRecord(conversation, conversationsPath)).filter((entry) => entry !== null).toSorted((left, right) => left.pagePath.localeCompare(right.pagePath));
		const operations = /* @__PURE__ */ new Map();
		let createdCount = 0;
		let updatedCount = 0;
		let skippedCount = 0;
		let runId;
		const nowIso = resolveMemoryWikiTimestamp(params.nowMs);
		const importPlans = [];
		for (const record of records) {
			const rendered = renderConversationPage(record);
			const absolutePath = path.join(params.config.vault.path, record.pagePath);
			const existing = await readExistingWikiPage(() => fs.readFile(absolutePath, "utf8"), (error) => asNullableRecord(error)?.code === "ENOENT");
			const stabilized = preserveExistingPageBlocks(rendered, existing);
			const operation = existing === stabilized ? "skip" : existing ? "update" : "create";
			operations.set(record.pagePath, operation);
			if (operation === "create") createdCount += 1;
			else if (operation === "update") updatedCount += 1;
			else skippedCount += 1;
			importPlans.push({
				relativePath: record.pagePath,
				existing,
				rendered: stabilized,
				operation
			});
		}
		let importRunRecord;
		const changedCount = createdCount + updatedCount;
		if (!params.dryRun && changedCount > 0) {
			const requiredStateRows = 1 + changedCount;
			const projectedStateRows = await countMemoryWikiImportRunStateRows() + requiredStateRows;
			if (projectedStateRows > 2e4) throw new Error(`Memory Wiki ChatGPT import exceeds SQLite import-run entry limit (${projectedStateRows}/${MEMORY_WIKI_IMPORT_RUN_STATE_MAX_ENTRIES})`);
			runId = buildRunId(exportPath, nowIso);
			const importRunDir = path.join(resolveMemoryWikiImportRunsDir(params.config.vault.path), runId);
			importRunRecord = {
				version: 1,
				runId,
				importType: "chatgpt",
				exportPath,
				sourcePath: conversationsPath,
				appliedAt: nowIso,
				conversationCount: records.length,
				createdCount,
				updatedCount,
				skippedCount,
				createdPaths: [],
				updatedPaths: []
			};
			for (const plan of importPlans) {
				if (plan.operation === "skip") continue;
				await writeTrackedImportPage({
					vaultRoot: params.config.vault.path,
					runDir: importRunDir,
					relativePath: plan.relativePath,
					existing: plan.existing,
					rendered: plan.rendered,
					record: importRunRecord
				});
			}
		}
		let indexUpdatedFiles = [];
		if (!params.dryRun && importRunRecord) {
			await writeMemoryWikiImportRunRecord(params.config.vault.path, importRunRecord);
			indexUpdatedFiles = (await compileMemoryWikiVault(params.config).catch((error) => {
				const message = error instanceof Error ? error.message : String(error);
				throw new Error(`Memory Wiki ChatGPT import run ${importRunRecord.runId} changed source pages, but vault compilation failed: ${message}. After fixing the compile error, run \`openclaw wiki chatgpt rollback ${importRunRecord.runId}\` to restore the imported pages.`, { cause: error });
			})).updatedFiles;
			await appendMemoryWikiLog(params.config.vault.path, {
				type: "ingest",
				timestamp: nowIso,
				details: {
					sourceType: "chatgpt-export",
					runId: importRunRecord.runId,
					exportPath,
					sourcePath: conversationsPath,
					conversationCount: records.length,
					createdCount: importRunRecord.createdPaths.length,
					updatedCount: importRunRecord.updatedPaths.length,
					skippedCount
				}
			});
		}
		return {
			dryRun: Boolean(params.dryRun),
			exportPath,
			sourcePath: conversationsPath,
			conversationCount: records.length,
			createdCount,
			updatedCount,
			skippedCount,
			actions: normalizeConversationActions(records, operations),
			pagePaths: records.map((record) => record.pagePath),
			...runId ? { runId } : {},
			indexUpdatedFiles
		};
	});
}
function toVaultRelativePath(vaultRoot, absolutePath) {
	return path.relative(vaultRoot, absolutePath).replace(/\\/g, "/");
}
function buildRollbackEntryRefs(record) {
	return [...record.createdPaths.map((entry, index) => ({
		entry,
		kind: "created",
		index
	})), ...record.updatedPaths.map((entry, index) => ({
		entry,
		kind: "updated",
		index
	}))];
}
function listPreservedPaths(record) {
	return [...record.createdPaths, ...record.updatedPaths].flatMap((entry) => (entry.recoveryPaths ?? []).map((recoveryPath) => ({
		path: entry.path,
		recoveryPath
	})));
}
function recordRecoveryPath(entry, recoveryPath) {
	const recoveryPaths = entry.recoveryPaths ?? [];
	if (recoveryPaths.includes(recoveryPath)) return false;
	entry.recoveryPaths = [...recoveryPaths, recoveryPath];
	return true;
}
async function scanRecoverySlots(params) {
	const refs = buildRollbackEntryRefs(params.record);
	const refsByPrefix = new Map(refs.map((ref) => [recoverySlotPrefix(ref), ref]));
	let slots;
	try {
		slots = await params.runRoot.list("recovered", { withFileTypes: true });
	} catch (error) {
		if (isFsSafeErrorCode(error, "not-found")) return [];
		throw error;
	}
	const recovered = [];
	for (const slot of slots) {
		if (!slot.isDirectory || slot.isSymbolicLink) continue;
		const prefix = /^(?:created|updated)-\d+-[a-f0-9]{64}-/.exec(slot.name)?.[0];
		const ref = prefix ? refsByPrefix.get(prefix) : void 0;
		if (!ref) continue;
		const slotRelativePath = path.posix.join("recovered", slot.name);
		recovered.push({
			ref,
			slotRelativePath,
			contentRelativePath: path.posix.join(slotRelativePath, "content")
		});
	}
	return recovered;
}
async function classifyRecoverySlots(params) {
	const seen = /* @__PURE__ */ new Set();
	let recordChanged = false;
	for (const slot of params.slots) {
		if (seen.has(slot.contentRelativePath)) continue;
		seen.add(slot.contentRelativePath);
		const { entry } = slot.ref;
		const recoveryPath = toVaultRelativePath(params.vaultRoot, path.join(params.runRoot.rootDir, slot.contentRelativePath));
		if (entry.recoveryPaths?.includes(recoveryPath)) continue;
		let recoveryHash = null;
		try {
			const stat = await params.runRoot.stat(slot.contentRelativePath);
			if (stat.isFile && !stat.isSymbolicLink) recoveryHash = hashChatGptImportContent(await params.runRoot.readText(slot.contentRelativePath));
		} catch (error) {
			if (isFsSafeErrorCode(error, "not-found")) {
				await removeEmptyRecoverySlot(params.runRoot, slot.slotRelativePath);
				continue;
			}
			throw error;
		}
		if (entry.contentHash && recoveryHash === entry.contentHash) {
			await params.runRoot.remove(slot.contentRelativePath);
			await removeEmptyRecoverySlot(params.runRoot, slot.slotRelativePath);
			continue;
		}
		recordChanged = recordRecoveryPath(entry, recoveryPath) || recordChanged;
	}
	return recordChanged;
}
async function targetMatchesSnapshot(vaultRoot, targetRelativePath, snapshot) {
	try {
		return hashChatGptImportContent(await vaultRoot.readText(targetRelativePath)) === hashChatGptImportContent(snapshot);
	} catch (error) {
		if (isFsSafeErrorCode(error, "not-found")) return false;
		throw error;
	}
}
async function rollbackChatGptImportRun(params) {
	return await withMemoryWikiVaultMutation(params.config.vault.path, async () => {
		const vaultRoot = params.config.vault.path;
		const record = await readImportRunRecord(vaultRoot, params.runId);
		if (record.rolledBackAt) return {
			runId: record.runId,
			removedCount: 0,
			restoredCount: 0,
			preservedPaths: listPreservedPaths(record),
			pagePaths: [...record.createdPaths.map((entry) => entry.path), ...record.updatedPaths.map((entry) => entry.path)].toSorted((left, right) => left.localeCompare(right)),
			indexUpdatedFiles: [],
			alreadyRolledBack: true
		};
		const runDir = resolveContainedImportPath(resolveMemoryWikiImportRunsDir(vaultRoot), record.runId, "Memory Wiki import run id");
		const refs = buildRollbackEntryRefs(record);
		for (const ref of refs) {
			resolveContainedImportPath(vaultRoot, ref.entry.path, "Memory Wiki import page path");
			if (ref.entry.snapshotPath) resolveContainedImportPath(runDir, ref.entry.snapshotPath, "Memory Wiki import snapshot path");
		}
		if (!record.rollbackStartedAt) {
			record.rollbackStartedAt = (/* @__PURE__ */ new Date()).toISOString();
			await writeMemoryWikiImportRunRecord(vaultRoot, record);
		}
		if (!record.rollbackTargetsFinalizedAt) {
			await initializeMemoryWikiVault(params.config);
			const vaultFs = await root(vaultRoot);
			const runRelativePath = toVaultRelativePath(vaultRoot, runDir);
			await vaultFs.mkdir(runRelativePath);
			const runFs = await root(runDir);
			if (await classifyRecoverySlots({
				vaultRoot,
				runRoot: runFs,
				slots: await scanRecoverySlots({
					runRoot: runFs,
					record
				})
			})) await writeMemoryWikiImportRunRecord(vaultRoot, record);
			for (const ref of refs) {
				const { entry } = ref;
				if (ref.kind === "updated" && !entry.snapshotPath) continue;
				const snapshot = ref.kind === "updated" && entry.snapshotPath ? await runFs.readText(entry.snapshotPath) : void 0;
				let completed = false;
				for (let attempt = 0; attempt < MAX_ROLLBACK_RECREATE_ATTEMPTS; attempt += 1) {
					if (snapshot !== void 0 && await targetMatchesSnapshot(vaultFs, entry.path, snapshot)) {
						completed = true;
						break;
					}
					const slot = await moveTargetToRecovery({
						vaultRoot: vaultFs,
						runRoot: runFs,
						runRelativePath,
						ref
					});
					if (slot && await classifyRecoverySlots({
						vaultRoot,
						runRoot: runFs,
						slots: [slot]
					})) await writeMemoryWikiImportRunRecord(vaultRoot, record);
					if (snapshot === void 0) {
						if (slot) continue;
						completed = true;
						break;
					}
					try {
						await vaultFs.create(entry.path, snapshot, {
							encoding: "utf8",
							mkdir: true
						});
						completed = true;
						break;
					} catch (error) {
						if (!isFsSafeErrorCode(error, "already-exists")) throw error;
					}
				}
				if (!completed) throw new Error(`Memory Wiki rollback could not ${ref.kind === "created" ? "remove" : "restore"} ${entry.path} after ${MAX_ROLLBACK_RECREATE_ATTEMPTS} concurrent recreations`);
			}
			record.rollbackTargetsFinalizedAt = (/* @__PURE__ */ new Date()).toISOString();
			await writeMemoryWikiImportRunRecord(vaultRoot, record);
		}
		const compile = await compileMemoryWikiVault(params.config, { sourcePageWrites: "preserve" });
		record.rolledBackAt = (/* @__PURE__ */ new Date()).toISOString();
		await writeMemoryWikiImportRunRecord(vaultRoot, record);
		const preservedPaths = listPreservedPaths(record);
		const removedCount = record.createdPaths.length;
		const restoredCount = record.updatedPaths.filter((entry) => entry.snapshotPath).length;
		await appendMemoryWikiLog(vaultRoot, {
			type: "ingest",
			timestamp: record.rolledBackAt,
			details: {
				sourceType: "chatgpt-export",
				runId: record.runId,
				rollback: true,
				removedCount,
				restoredCount,
				preservedCount: preservedPaths.length
			}
		}).catch(() => void 0);
		return {
			runId: record.runId,
			removedCount,
			restoredCount,
			preservedPaths,
			pagePaths: [...record.createdPaths.map((entry) => entry.path), ...record.updatedPaths.map((entry) => entry.path)].toSorted((left, right) => left.localeCompare(right)),
			indexUpdatedFiles: compile.updatedFiles,
			alreadyRolledBack: false
		};
	});
}
//#endregion
//#region extensions/memory-wiki/src/okf.ts
const OKF_RESERVED_FILENAMES = /* @__PURE__ */ new Set(["index.md", "log.md"]);
const OKF_MARKDOWN_LINK_PATTERN = /(!?)\[([^\]]*)\]\(([^)]+)\)/g;
const OKF_RELATED_SECTION_PATTERN = new RegExp(`\\n+## Related\\n${WIKI_RELATED_START_MARKER}[\\s\\S]*?${WIKI_RELATED_END_MARKER}\\n?`, "g");
const OKF_VOLATILE_TIMESTAMP_LINE_PATTERN = /^(?:importedAt|updatedAt): .*\n/gm;
const OKF_HASH_CHARS = 8;
function toPosixPath(value) {
	return value.split(path.sep).join("/");
}
function trimMarkdownExtension(value) {
	return value.replace(/\.md$/i, "");
}
function createOkfBundleKey(params) {
	const producerId = normalizeOptionalString(params.rootFrontmatter.id) ?? normalizeOptionalString(params.rootFrontmatter.okf_id);
	if (producerId) return slugifyWikiSegment(producerId);
	const label = normalizeOptionalString(params.rootFrontmatter.name) ?? normalizeOptionalString(params.rootFrontmatter.title) ?? params.bundleName;
	const hash = createHash("sha1").update(params.bundlePath).digest("hex").slice(0, OKF_HASH_CHARS);
	return `${slugifyWikiSegment(label)}-${hash}`;
}
function createOkfPageStem(bundleKey, conceptId) {
	return `okf-${bundleKey}-${slugifyWikiSegment(conceptId.replace(/\//g, "-"))}-${createHash("sha1").update(conceptId).digest("hex").slice(0, OKF_HASH_CHARS)}`;
}
function createOkfPageIdentity(bundleKey, conceptId) {
	const fileName = createWikiPageFilename(createOkfPageStem(bundleKey, conceptId));
	return {
		pageId: `concept.${trimMarkdownExtension(fileName)}`,
		pagePath: `concepts/${fileName}`
	};
}
async function collectOkfMarkdownFiles(rootDir, warnings) {
	const entries = await walkMemoryWikiDirectory(rootDir, "", {
		entryFilter: (entry) => entry.kind === "directory" && [".git", "node_modules"].includes(path.basename(entry.relativePath)) ? "skip-subtree" : "include",
		onDirectoryError: "skip-and-report"
	});
	const files = [];
	for (const entry of entries) {
		if (entry.kind === "directory-error") {
			warnings.push({
				code: "unreadable-entry",
				path: toPosixPath(entry.relativePath) || ".",
				message: entry.error instanceof Error ? entry.error.message : "Unable to read OKF directory."
			});
			continue;
		}
		if (entry.kind === "file" && entry.relativePath.endsWith(".md")) files.push(toPosixPath(entry.relativePath));
	}
	return files.toSorted((left, right) => left.localeCompare(right));
}
function parseOkfMarkdown(content, relativePath) {
	const normalizedContent = content.replace(/\r\n/g, "\n");
	try {
		return parseWikiMarkdown(normalizedContent);
	} catch (err) {
		return {
			frontmatter: {},
			body: normalizedContent,
			warning: {
				code: "invalid-concept",
				path: relativePath,
				message: err instanceof Error ? err.message : "Unable to parse OKF frontmatter."
			}
		};
	}
}
async function readOkfTextFile(params) {
	return await params.bundleRoot.readText(params.relativePath).catch((err) => {
		params.warnings.push({
			code: "unreadable-entry",
			path: params.relativePath,
			message: err instanceof FsSafeError && err.code === "not-file" ? "Refusing to import OKF concept through non-regular or hardlinked file." : err instanceof Error ? err.message : "Unable to read OKF concept."
		});
		return null;
	});
}
function deriveOkfTitle(relativePath, frontmatter) {
	return normalizeOptionalString(frontmatter.title) ?? path.posix.basename(relativePath, ".md").replace(/[-_]+/g, " ").trim();
}
function normalizeOkfConcept(params) {
	const parsed = parseOkfMarkdown(params.content, params.relativePath);
	if (parsed.warning) return { warning: parsed.warning };
	const type = normalizeOptionalString(parsed.frontmatter.type);
	if (!type) return { warning: {
		code: "missing-type",
		path: params.relativePath,
		message: "OKF concept is missing required non-empty type frontmatter."
	} };
	const conceptId = trimMarkdownExtension(params.relativePath);
	const timestamp = normalizeOptionalString(parsed.frontmatter.timestamp);
	const description = normalizeOptionalString(parsed.frontmatter.description);
	const resource = normalizeOptionalString(parsed.frontmatter.resource);
	return { concept: {
		conceptId,
		relativePath: params.relativePath,
		absolutePath: path.join(params.bundlePath, params.relativePath),
		frontmatter: parsed.frontmatter,
		body: parsed.body,
		type,
		title: deriveOkfTitle(params.relativePath, parsed.frontmatter),
		...description ? { description } : {},
		...resource ? { resource } : {},
		tags: normalizeSingleOrTrimmedStringList(parsed.frontmatter.tags),
		...timestamp ? { timestamp } : {}
	} };
}
function splitMarkdownLinkDestination(target) {
	const trimmed = target.trim();
	if (trimmed.startsWith("<")) {
		const end = trimmed.indexOf(">");
		if (end > 0) return {
			destination: trimmed.slice(1, end),
			titleSuffix: trimmed.slice(end + 1)
		};
	}
	const match = trimmed.match(/^(\S+)(\s+[\s\S]+)?$/);
	return {
		destination: match?.[1] ?? trimmed,
		titleSuffix: match?.[2] ?? ""
	};
}
function resolveOkfMarkdownTarget(sourceRelativePath, target) {
	const { destination } = splitMarkdownLinkDestination(target);
	const trimmed = destination.trim();
	if (!trimmed || trimmed.startsWith("#") || /^[a-z][a-z0-9+.-]*:/i.test(trimmed)) return null;
	const rawTargetWithoutSuffix = trimmed.split("#")[0]?.split("?")[0]?.replace(/\\/g, "/").trim();
	const targetWithoutSuffix = safeDecodeOkfLinkPath(rawTargetWithoutSuffix);
	if (!targetWithoutSuffix || !targetWithoutSuffix.endsWith(".md")) return null;
	const conceptId = trimMarkdownExtension(targetWithoutSuffix.startsWith("/") ? path.posix.normalize(targetWithoutSuffix.slice(1)) : path.posix.normalize(path.posix.join(path.posix.dirname(sourceRelativePath), targetWithoutSuffix)));
	return conceptId.startsWith("../") ? null : conceptId;
}
function safeDecodeOkfLinkPath(value) {
	if (!value) return "";
	try {
		return decodeURIComponent(value);
	} catch {
		return value;
	}
}
function getMarkdownDestinationSuffix(destination) {
	const suffixIndex = destination.search(/[?#]/);
	return suffixIndex === -1 ? "" : destination.slice(suffixIndex);
}
function rewriteOkfMarkdownLinks(params) {
	const linkedConceptIds = [];
	if (!params.body.includes("[")) return {
		body: params.body,
		linkedConceptIds
	};
	const rewriteLinks = (markdown) => markdown.replace(OKF_MARKDOWN_LINK_PATTERN, (match, imagePrefix, label, rawTarget) => {
		const conceptId = resolveOkfMarkdownTarget(params.sourceRelativePath, rawTarget);
		if (!conceptId) return match;
		const target = params.pageByConceptId.get(conceptId);
		if (!target) return match;
		linkedConceptIds.push(conceptId);
		const { destination, titleSuffix } = splitMarkdownLinkDestination(rawTarget);
		return `${imagePrefix}[${label}](${path.posix.relative(path.posix.dirname(params.sourcePagePath), target.pagePath)}${getMarkdownDestinationSuffix(destination)}${titleSuffix})`;
	});
	return {
		body: rewriteMarkdownOutsideCode(params.body, rewriteLinks),
		linkedConceptIds: uniqueStrings(linkedConceptIds)
	};
}
function rewriteMarkdownOutsideCode(markdown, rewriteLinks) {
	const parts = [];
	const rewriteLines = (text) => text.split("\n").map(rewriteLinks).join("\n");
	let cursor = 0;
	forEachMarkdownCodeRange(markdown, (start, end) => {
		parts.push(rewriteLines(markdown.slice(cursor, start)), markdown.slice(start, end));
		cursor = end;
	});
	parts.push(rewriteLines(markdown.slice(cursor)));
	return parts.join("");
}
function normalizeOkfRenderedPageForComparison(content) {
	const withoutRelated = content.replace(OKF_RELATED_SECTION_PATTERN, "\n");
	const frontmatterMatch = withoutRelated.match(/^---\n([\s\S]*?)\n---\n?/);
	if (!frontmatterMatch) return withoutRelated.trimEnd();
	const normalizedFrontmatter = frontmatterMatch[1]?.replace(OKF_VOLATILE_TIMESTAMP_LINE_PATTERN, "") ?? "";
	return `---\n${normalizedFrontmatter.endsWith("\n") ? normalizedFrontmatter : `${normalizedFrontmatter}\n`}---\n${withoutRelated.slice(frontmatterMatch[0].length)}`.trimEnd();
}
async function writeOkfConceptPage(params) {
	const vault = await root(params.vaultRoot);
	const pageStat = await vault.stat(params.pagePath).catch((error) => {
		if (error instanceof FsSafeError && (error.code === "not-found" || error.code === "path-alias")) return null;
		throw error;
	});
	const existing = pageStat ? await vault.readText(params.pagePath).catch(() => "") : "";
	if (existing === params.content || normalizeOkfRenderedPageForComparison(existing) === normalizeOkfRenderedPageForComparison(params.content)) return {
		changed: false,
		created: !pageStat
	};
	await writeGuardedVaultPage({
		vault,
		pagePath: params.pagePath,
		content: params.content,
		pageStat,
		pageLabel: "OKF concept page"
	});
	return {
		changed: true,
		created: !pageStat
	};
}
async function removeStaleOkfConceptPages(params) {
	const vault = await root(params.vaultRoot);
	const entries = await walkMemoryWikiDirectory(params.vaultRoot, "concepts", {
		maxDepth: 0,
		entryFilter: (entry) => entry.kind === "directory" ? "skip-subtree" : "include",
		onDirectoryError: "skip-and-report"
	});
	const removedPagePaths = [];
	for (const entry of entries) {
		const entryName = path.basename(entry.relativePath);
		if (entry.kind !== "file" || !entryName.endsWith(".md") || entryName === "index.md") continue;
		const pagePath = `concepts/${entryName}`;
		if (params.currentPagePaths.has(pagePath)) continue;
		const raw = await vault.readText(pagePath).catch(() => "");
		const parsed = parseWikiMarkdown(raw);
		if (asNullableRecord(parsed.frontmatter.okf)?.bundleKey === params.bundleKey) {
			await vault.remove(pagePath);
			removedPagePaths.push(pagePath);
		}
	}
	return removedPagePaths;
}
function readRootOkfMetadata(params) {
	const parsed = parseOkfMarkdown(params.rootIndex ?? "", "index.md");
	const version = normalizeOptionalString(parsed.frontmatter.okf_version);
	return {
		key: createOkfBundleKey({
			rootFrontmatter: parsed.frontmatter,
			bundleName: params.bundleName,
			bundlePath: params.bundlePath
		}),
		...version ? { version } : {}
	};
}
function formatOkfImportSummary(result) {
	return `Imported ${result.importedCount} OKF concept${result.importedCount === 1 ? "" : "s"} from ${result.bundlePath} into memory wiki. Updated ${result.updatedCount}; removed ${result.removedCount}; skipped ${result.skippedCount}; refreshed ${result.indexUpdatedFiles.length} index file${result.indexUpdatedFiles.length === 1 ? "" : "s"}.`;
}
async function importMemoryWikiOkfBundle(params) {
	await initializeMemoryWikiVault(params.config, { nowMs: params.nowMs });
	const bundlePath = path.resolve(params.bundlePath);
	if (!(await fs.stat(bundlePath)).isDirectory()) throw new Error("wiki okf import expects an unpacked OKF bundle directory.");
	const bundleRoot = await root(bundlePath);
	const warnings = [];
	const markdownFiles = await collectOkfMarkdownFiles(bundlePath, warnings);
	const concepts = [];
	let rootIndexContent;
	for (const relativePath of markdownFiles) {
		if (relativePath === "index.md") rootIndexContent = await readOkfTextFile({
			bundleRoot,
			relativePath,
			warnings
		}) ?? void 0;
		if (OKF_RESERVED_FILENAMES.has(path.posix.basename(relativePath))) continue;
		const content = await readOkfTextFile({
			bundleRoot,
			relativePath,
			warnings
		});
		if (content === null) continue;
		const normalized = normalizeOkfConcept({
			bundlePath,
			relativePath,
			content
		});
		if (normalized.warning) {
			warnings.push(normalized.warning);
			continue;
		}
		if (normalized.concept) concepts.push(normalized.concept);
	}
	const timestamp = resolveMemoryWikiTimestamp(params.nowMs);
	const bundleName = path.basename(bundlePath);
	const bundleMetadata = readRootOkfMetadata({
		rootIndex: rootIndexContent,
		bundleName,
		bundlePath
	});
	const bundleKey = bundleMetadata.key;
	const pageByConceptId = /* @__PURE__ */ new Map();
	for (const concept of concepts) pageByConceptId.set(concept.conceptId, {
		...createOkfPageIdentity(bundleKey, concept.conceptId),
		title: concept.title
	});
	const pagePaths = [];
	let updatedCount = 0;
	await fs.mkdir(path.join(params.config.vault.path, "concepts"), { recursive: true });
	for (const concept of concepts.toSorted((left, right) => left.conceptId.localeCompare(right.conceptId))) {
		const page = pageByConceptId.get(concept.conceptId);
		if (!page) continue;
		const rewritten = rewriteOkfMarkdownLinks({
			body: concept.body,
			sourcePagePath: page.pagePath,
			sourceRelativePath: concept.relativePath,
			pageByConceptId
		});
		const relationships = rewritten.linkedConceptIds.flatMap((conceptId) => {
			const target = pageByConceptId.get(conceptId);
			return target ? [{
				targetId: target.pageId,
				targetPath: target.pagePath,
				targetTitle: target.title,
				kind: "okf-link",
				evidenceKind: "okf-markdown-link"
			}] : [];
		});
		const frontmatter = {
			pageType: "concept",
			id: page.pageId,
			title: concept.title,
			sourceType: "okf",
			provenanceMode: "okf-import",
			sourcePath: concept.absolutePath,
			okfConceptId: concept.conceptId,
			okfType: concept.type,
			sourceIds: [`source.okf.${bundleKey}`],
			importedAt: timestamp,
			updatedAt: concept.timestamp ?? timestamp,
			status: "active",
			...concept.description ? { description: concept.description } : {},
			...concept.resource ? { resource: concept.resource } : {},
			...concept.tags.length > 0 ? { tags: concept.tags } : {},
			...concept.timestamp ? { okfTimestamp: concept.timestamp } : {},
			...relationships.length > 0 ? { relationships } : {},
			okf: {
				...bundleMetadata.version ? { version: bundleMetadata.version } : {},
				bundleName,
				bundleKey,
				conceptId: concept.conceptId,
				sourceRelativePath: concept.relativePath,
				frontmatter: concept.frontmatter
			}
		};
		const writeResult = await writeOkfConceptPage({
			vaultRoot: params.config.vault.path,
			pagePath: page.pagePath,
			content: renderWikiMarkdown({
				frontmatter,
				body: rewritten.body
			})
		});
		if (!writeResult.created && writeResult.changed) updatedCount++;
		pagePaths.push(page.pagePath);
	}
	const currentPagePaths = new Set(pagePaths);
	const removedPagePaths = warnings.length === 0 ? await removeStaleOkfConceptPages({
		vaultRoot: params.config.vault.path,
		bundleKey,
		currentPagePaths
	}) : [];
	await appendMemoryWikiLog(params.config.vault.path, {
		type: "okf-import",
		timestamp,
		details: {
			bundlePath,
			bundleName,
			importedCount: pagePaths.length,
			updatedCount,
			removedCount: removedPagePaths.length,
			skippedCount: warnings.length,
			pagePaths,
			removedPagePaths
		}
	});
	const compile = await compileMemoryWikiVault(params.config);
	return {
		bundlePath,
		bundleName,
		...bundleMetadata.version ? { okfVersion: bundleMetadata.version } : {},
		importedCount: pagePaths.length,
		updatedCount,
		removedCount: removedPagePaths.length,
		skippedCount: warnings.length,
		pagePaths,
		removedPagePaths,
		warnings,
		indexUpdatedFiles: compile.updatedFiles
	};
}
//#endregion
//#region extensions/memory-wiki/src/cli.ts
const WIKI_GATEWAY_TIMEOUT_MS = "30000";
const GATEWAY_TERMINAL_STRING_MAX_CHARS = 2e3;
const GATEWAY_RESPONSE_MAX_ARRAY_ITEMS = 1e4;
const GATEWAY_RESPONSE_MAX_STRING_CHARS = 1e4;
const GATEWAY_RESPONSE_MAX_CODE_CHARS = 256;
const ANSI_ESCAPE_SEQUENCE_PATTERN = new RegExp(String.raw`(?:\x1B\[[0-?]*[ -/]*[@-~]|\x1B[@-Z\\-_]|\x9B[0-?]*[ -/]*[@-~])`, "g");
const TERMINAL_CONTROL_CHARACTER_PATTERN = new RegExp(String.raw`[\x00-\x1F\x7F-\x9F]+`, "g");
const UNICODE_FORMAT_CONTROL_PATTERN = /[\u061C\u200B-\u200F\u202A-\u202E\u2060-\u206F\uFEFF]/g;
function sanitizeGatewayStringForTerminal(value) {
	const sanitized = (value.length > GATEWAY_TERMINAL_STRING_MAX_CHARS ? truncateUtf16Safe(value, GATEWAY_TERMINAL_STRING_MAX_CHARS) : value).replace(ANSI_ESCAPE_SEQUENCE_PATTERN, "").replace(TERMINAL_CONTROL_CHARACTER_PATTERN, " ").replace(UNICODE_FORMAT_CONTROL_PATTERN, "");
	return value.length > GATEWAY_TERMINAL_STRING_MAX_CHARS ? `${sanitized}... [truncated]` : sanitized;
}
function escapeGatewayJsonForTerminal(json) {
	return json.replace(UNICODE_FORMAT_CONTROL_PATTERN, (char) => {
		const codePoint = char.codePointAt(0);
		return typeof codePoint === "number" ? `\\u${codePoint.toString(16).padStart(4, "0")}` : "";
	});
}
function writeOutput(output) {
	process.stdout.write(output.endsWith("\n") ? output : `${output}\n`);
}
function shouldRouteBridgeRuntimeThroughGateway(config) {
	return config.vaultMode === "bridge" && config.bridge.enabled && config.bridge.readMemoryArtifacts;
}
function isBoundedGatewayString(value, maxChars = GATEWAY_RESPONSE_MAX_STRING_CHARS) {
	return typeof value === "string" && value.length <= maxChars;
}
function isStringArray(value, maxChars = GATEWAY_RESPONSE_MAX_STRING_CHARS) {
	return Array.isArray(value) && value.length <= GATEWAY_RESPONSE_MAX_ARRAY_ITEMS && value.every((item) => isBoundedGatewayString(item, maxChars));
}
function hasNumberFields(value, keys) {
	return keys.every((key) => typeof value[key] === "number");
}
function isWarningList(value) {
	return Array.isArray(value) && value.length <= GATEWAY_RESPONSE_MAX_ARRAY_ITEMS && value.every((item) => isRecord(item) && isBoundedGatewayString(item.code, GATEWAY_RESPONSE_MAX_CODE_CHARS) && isBoundedGatewayString(item.message));
}
function isMemoryWikiStatus(value) {
	if (!isRecord(value)) return false;
	const bridge = value.bridge;
	const obsidianCli = value.obsidianCli;
	const unsafeLocal = value.unsafeLocal;
	const pageCounts = value.pageCounts;
	const sourceCounts = value.sourceCounts;
	return isBoundedGatewayString(value.vaultScope, GATEWAY_RESPONSE_MAX_CODE_CHARS) && (isBoundedGatewayString(value.agentId, GATEWAY_RESPONSE_MAX_CODE_CHARS) || value.agentId === null) && isBoundedGatewayString(value.vaultMode, GATEWAY_RESPONSE_MAX_CODE_CHARS) && isBoundedGatewayString(value.renderMode, GATEWAY_RESPONSE_MAX_CODE_CHARS) && isBoundedGatewayString(value.vaultPath) && typeof value.vaultExists === "boolean" && (typeof value.bridgePublicArtifactCount === "number" || value.bridgePublicArtifactCount === null) && isRecord(bridge) && typeof bridge.enabled === "boolean" && isRecord(obsidianCli) && typeof obsidianCli.enabled === "boolean" && typeof obsidianCli.requested === "boolean" && typeof obsidianCli.available === "boolean" && (isBoundedGatewayString(obsidianCli.command) || obsidianCli.command === null) && isRecord(unsafeLocal) && typeof unsafeLocal.allowPrivateMemoryCoreAccess === "boolean" && typeof unsafeLocal.pathCount === "number" && isRecord(pageCounts) && hasNumberFields(pageCounts, [
		"source",
		"entity",
		"concept",
		"synthesis",
		"report"
	]) && isRecord(sourceCounts) && hasNumberFields(sourceCounts, [
		"native",
		"bridge",
		"bridgeEvents",
		"unsafeLocal",
		"other"
	]) && isWarningList(value.warnings);
}
function isMemoryWikiDoctorReport(value) {
	return isRecord(value) && typeof value.healthy === "boolean" && typeof value.warningCount === "number" && isMemoryWikiStatus(value.status) && isWarningList(value.fixes);
}
function isMemoryWikiImportResult(value) {
	return isRecord(value) && hasNumberFields(value, [
		"importedCount",
		"updatedCount",
		"skippedCount",
		"removedCount",
		"artifactCount",
		"workspaces"
	]) && isStringArray(value.pagePaths) && typeof value.indexesRefreshed === "boolean" && isStringArray(value.indexUpdatedFiles) && isBoundedGatewayString(value.indexRefreshReason, GATEWAY_RESPONSE_MAX_CODE_CHARS);
}
async function callWikiGateway(method, agentId) {
	const result = await callGatewayFromCli(method, { timeout: WIKI_GATEWAY_TIMEOUT_MS }, agentId ? { agentId } : void 0, { progress: false });
	if (method === "wiki.status" && isMemoryWikiStatus(result) || method === "wiki.doctor" && isMemoryWikiDoctorReport(result) || method === "wiki.bridge.import" && isMemoryWikiImportResult(result)) return result;
	throw new Error(`Invalid Gateway response for ${method}.`);
}
function normalizeCliStringList(values) {
	const uniqueValues = uniqueStrings(normalizeStringEntries(values ?? []));
	return uniqueValues.length > 0 ? uniqueValues : void 0;
}
function resolveCliMutationMetadata(opts) {
	const sourceIds = normalizeCliStringList(opts.sourceId);
	const contradictions = normalizeCliStringList(opts.contradiction);
	const questions = normalizeCliStringList(opts.question);
	return {
		...sourceIds ? { sourceIds } : {},
		...contradictions ? { contradictions } : {},
		...questions ? { questions } : {},
		...opts.status?.trim() ? { status: opts.status.trim() } : {}
	};
}
function collectCliValues(value, acc = []) {
	acc.push(value);
	return acc;
}
function parseWikiSearchEnumOption(value, allowed, label) {
	if (allowed.includes(value)) return value;
	throw new Error(`Invalid ${label}: ${value}. Expected one of: ${allowed.join(", ")}`);
}
async function resolveWikiApplyBody(params) {
	if (params.body?.trim()) return params.body;
	if (params.bodyFile?.trim()) return await fs.readFile(params.bodyFile, "utf8");
	throw new Error("wiki apply synthesis requires --body or --body-file.");
}
function formatJsonOrText(result, json, render) {
	return json ? JSON.stringify(result, null, 2) : render(result);
}
function formatGatewayJsonOrText(result, json, render) {
	return json ? escapeGatewayJsonForTerminal(JSON.stringify(result, null, 2)) : sanitizeGatewayStringForTerminal(render(result));
}
function printWikiResult(result, json, render) {
	writeOutput(formatJsonOrText(result, json, render));
	return result;
}
function addWikiSearchConfigOptions(command) {
	return command.option("--backend <backend>", `Search backend (${WIKI_SEARCH_BACKENDS.join(", ")})`, (value) => parseWikiSearchEnumOption(value, WIKI_SEARCH_BACKENDS, "backend")).option("--corpus <corpus>", `Search corpus (${WIKI_SEARCH_CORPORA.join(", ")})`, (value) => parseWikiSearchEnumOption(value, WIKI_SEARCH_CORPORA, "corpus"));
}
function invalidCliArgument(message) {
	return Object.assign(new Error(message), {
		name: "InvalidArgumentError",
		code: "commander.invalidArgument",
		exitCode: 1
	});
}
function parseWikiConfidenceOption(value) {
	const trimmed = value.trim();
	const confidence = /^[+-]?(?:\d+(?:\.\d+)?|\.\d+)$/.test(trimmed) ? Number(trimmed) : NaN;
	if (!Number.isFinite(confidence) || confidence < 0 || confidence > 1) throw invalidCliArgument("--confidence must be a number between 0 and 1.");
	return confidence;
}
function parseWikiPositiveIntegerOption(value, flag) {
	const parsed = parseStrictPositiveInteger(value);
	if (parsed === void 0) throw invalidCliArgument(`${flag} must be a positive integer.`);
	return parsed;
}
function addWikiApplyMutationOptions(command) {
	return command.option("--source-id <id>", "Source id", collectCliValues).option("--contradiction <text>", "Contradiction note", collectCliValues).option("--question <text>", "Open question", collectCliValues).option("--confidence <n>", "Confidence score between 0 and 1", parseWikiConfidenceOption).option("--status <status>", "Page status");
}
async function runWikiStatus(params) {
	const routeThroughGateway = shouldRouteBridgeRuntimeThroughGateway(params.config);
	let localStatus;
	if (!routeThroughGateway) {
		await syncMemoryWikiImportedSources({
			config: params.config,
			appConfig: params.appConfig
		});
		localStatus = await resolveMemoryWikiStatus(params.config, { appConfig: params.appConfig });
	}
	const format = routeThroughGateway ? formatGatewayJsonOrText : formatJsonOrText;
	if (params.doctor) {
		const report = localStatus ? buildMemoryWikiDoctorReport(localStatus) : await callWikiGateway("wiki.doctor", params.agentId);
		if (!report.healthy) process.exitCode = 1;
		writeOutput(format(report, params.json, renderMemoryWikiDoctor));
		return report;
	}
	const status = localStatus ?? await callWikiGateway("wiki.status", params.agentId);
	writeOutput(format(status, params.json, renderMemoryWikiStatus));
	return status;
}
async function runWikiBridgeImport(params) {
	const render = (value) => `Bridge import synced ${value.artifactCount} artifacts across ${value.workspaces} workspaces (${value.importedCount} new, ${value.updatedCount} updated, ${value.skippedCount} unchanged, ${value.removedCount} removed). Indexes ${value.indexesRefreshed ? `refreshed (${value.indexUpdatedFiles.length} files)` : `not refreshed (${value.indexRefreshReason})`}.`;
	if (shouldRouteBridgeRuntimeThroughGateway(params.config)) {
		const result = await callWikiGateway("wiki.bridge.import", params.agentId);
		writeOutput(formatGatewayJsonOrText(result, params.json, render));
		return result;
	}
	return printWikiResult(await syncMemoryWikiImportedSources({
		config: params.config,
		appConfig: params.appConfig
	}), params.json, render);
}
function formatChatGptImportSummary(result) {
	if (result.dryRun) return `ChatGPT import dry run scanned ${result.conversationCount} conversations (${result.createdCount} new, ${result.updatedCount} updated, ${result.skippedCount} unchanged).`;
	const runSuffix = result.runId ? ` Run id: ${result.runId}.` : "";
	return `ChatGPT import applied ${result.conversationCount} conversations (${result.createdCount} new, ${result.updatedCount} updated, ${result.skippedCount} unchanged). Refreshed ${result.indexUpdatedFiles.length} index file${result.indexUpdatedFiles.length === 1 ? "" : "s"}.${runSuffix}`;
}
function formatChatGptRollbackSummary(result) {
	const preservedNote = result.preservedPaths.length > 0 ? ` Preserved ${result.preservedPaths.length} page${result.preservedPaths.length === 1 ? "" : "s"} edited after import: ${result.preservedPaths.map((entry) => entry.recoveryPath).join(", ")}.` : "";
	if (result.alreadyRolledBack) return `ChatGPT import run ${result.runId} was already rolled back.${preservedNote}`;
	return `Rolled back ChatGPT import run ${result.runId} (${result.removedCount} removed, ${result.restoredCount} restored).${preservedNote} Refreshed ${result.indexUpdatedFiles.length} index file${result.indexUpdatedFiles.length === 1 ? "" : "s"}.`;
}
function registerWikiCli(program, registration) {
	const resolveConfig = registration.resolveConfig ?? ((agentId, currentAppConfig) => resolveMemoryWikiAgentConfig({
		config: registration.config,
		appConfig: currentAppConfig,
		...agentId ? { agentId } : {}
	}));
	let commandContext;
	const requireCommandContext = () => {
		if (!commandContext) throw new Error("Memory Wiki CLI agent context was not resolved.");
		return commandContext;
	};
	const wiki = program.command("wiki").description("Inspect and initialize the memory wiki vault").option("--agent <id>", "Agent id for agent-scoped wiki vaults");
	wiki.hook("preAction", (_thisCommand, actionCommand) => {
		const needsAgent = actionCommand.options.some((option) => option.long === "--agent");
		const requestedAgentId = actionCommand.opts().agent?.trim() || wiki.opts().agent?.trim() || void 0;
		const currentAppConfig = registration.getAppConfig?.();
		let agentId = requestedAgentId;
		if (needsAgent && !agentId && (registration.config.vault.scope === "agent" || currentAppConfig)) try {
			agentId = resolveDefaultAgentId(currentAppConfig ?? {});
		} catch {
			throw new Error("No default memory-wiki agent is configured. Pass --agent <id>, or add an agent with `openclaw agents add`.");
		}
		const config = needsAgent ? resolveConfig(agentId, currentAppConfig) : registration.config;
		agentId = config.agentId ?? agentId;
		commandContext = {
			config,
			...currentAppConfig ? { appConfig: currentAppConfig } : {},
			...agentId ? { agentId } : {}
		};
	});
	const vaultCommand = (parent, name, description) => parent.command(name).description(description).option("--agent <id>", "Agent id (default: configured default agent)");
	for (const [name, description] of [["status", "Show wiki vault status"], ["doctor", "Audit wiki vault setup and report actionable fixes"]]) vaultCommand(wiki, name, description).option("--json", "Print JSON").action(async (opts) => {
		await runWikiStatus({
			...requireCommandContext(),
			json: opts.json,
			doctor: name === "doctor"
		});
	});
	vaultCommand(wiki, "init", "Initialize the wiki vault layout").option("--json", "Print JSON").action(async (opts) => {
		const { config } = requireCommandContext();
		printWikiResult(await initializeMemoryWikiVault(config), opts.json, (value) => `Initialized wiki vault at ${value.rootDir} (${value.createdDirectories.length} dirs, ${value.createdFiles.length} files).`);
	});
	vaultCommand(wiki, "compile", "Refresh generated wiki indexes").option("--json", "Print JSON").action(async (opts) => {
		const { appConfig, config } = requireCommandContext();
		await syncMemoryWikiImportedSources({
			config,
			appConfig
		});
		printWikiResult(await compileMemoryWikiVault(config), opts.json, (value) => `Compiled wiki vault at ${value.vaultRoot} (${value.pages.length} pages, ${value.updatedFiles.length} indexes updated).`);
	});
	vaultCommand(wiki, "lint", "Lint the wiki vault and write a report").option("--json", "Print JSON").action(async (opts) => {
		const { appConfig, config } = requireCommandContext();
		await syncMemoryWikiImportedSources({
			config,
			appConfig
		});
		printWikiResult(await lintMemoryWikiVault(config), opts.json, (value) => `Linted wiki vault at ${value.vaultRoot} (${value.issueCount} issues, report: ${value.reportPath}).`);
	});
	vaultCommand(wiki, "ingest", "Ingest a local file into the wiki sources folder").argument("<path>", "Local file path to ingest").option("--title <title>", "Override the source title").option("--json", "Print JSON").action(async (inputPath, opts) => {
		const { config } = requireCommandContext();
		printWikiResult(await ingestMemoryWikiSource({
			config,
			inputPath,
			title: opts.title
		}), opts.json, (value) => `Ingested ${value.sourcePath} into ${value.pagePath}. Refreshed ${value.indexUpdatedFiles.length} index file${value.indexUpdatedFiles.length === 1 ? "" : "s"}.`);
	});
	vaultCommand(wiki.command("okf").description("Import Open Knowledge Format bundles"), "import", "Import an unpacked OKF bundle into wiki concept pages").argument("<path>", "OKF bundle directory").option("--json", "Print JSON").action(async (bundlePath, opts) => {
		const { config } = requireCommandContext();
		printWikiResult(await importMemoryWikiOkfBundle({
			config,
			bundlePath
		}), opts.json, formatOkfImportSummary);
	});
	addWikiSearchConfigOptions(vaultCommand(wiki, "search", "Search wiki pages and, when configured, the active memory corpus").argument("<query>", "Search query").option("--max-results <n>", "Maximum results", (value) => parseWikiPositiveIntegerOption(value, "--max-results")).option("--mode <mode>", `Search mode (${WIKI_SEARCH_MODES.join(", ")})`)).option("--json", "Print JSON").action(async (query, opts) => {
		const { agentId, appConfig, config } = requireCommandContext();
		if (opts.mode && !WIKI_SEARCH_MODES.includes(opts.mode)) throw new Error(`wiki search --mode must be one of: ${WIKI_SEARCH_MODES.join(", ")}.`);
		await syncMemoryWikiImportedSources({
			config,
			appConfig
		});
		writeOutput(formatJsonOrText(await searchMemoryWiki({
			config,
			appConfig,
			...agentId ? { agentId } : {},
			query,
			maxResults: opts.maxResults,
			searchBackend: opts.backend,
			searchCorpus: opts.corpus,
			mode: opts.mode
		}), opts.json, renderWikiSearchResults));
	});
	addWikiSearchConfigOptions(vaultCommand(wiki, "get", "Read a wiki page by id or relative path, with optional active-memory fallback").argument("<lookup>", "Relative path or page id").option("--from <n>", "Start line", (value) => parseWikiPositiveIntegerOption(value, "--from")).option("--lines <n>", "Number of lines", (value) => parseWikiPositiveIntegerOption(value, "--lines"))).option("--json", "Print JSON").action(async (lookup, opts) => {
		const { agentId, appConfig, config } = requireCommandContext();
		await syncMemoryWikiImportedSources({
			config,
			appConfig
		});
		const result = await getMemoryWikiPage({
			config,
			appConfig,
			...agentId ? { agentId } : {},
			lookup,
			fromLine: opts.from,
			lineCount: opts.lines,
			searchBackend: opts.backend,
			searchCorpus: opts.corpus
		});
		writeOutput(opts.json ? JSON.stringify(result, null, 2) : result?.content ?? `Wiki page not found: ${lookup}`);
	});
	const apply = wiki.command("apply").description("Apply narrow wiki mutations");
	addWikiApplyMutationOptions(vaultCommand(apply, "synthesis", "Create or refresh a synthesis page with managed summary content").argument("<title>", "Synthesis title").option("--body <text>", "Summary body text").option("--body-file <path>", "Read summary body text from a file")).option("--json", "Print JSON").action(async (title, opts) => {
		const { appConfig, config } = requireCommandContext();
		const metadata = resolveCliMutationMetadata(opts);
		const sourceIds = metadata.sourceIds;
		if (!sourceIds) throw new Error("wiki apply synthesis requires at least one --source-id.");
		const body = await resolveWikiApplyBody({
			body: opts.body,
			bodyFile: opts.bodyFile
		});
		await syncMemoryWikiImportedSources({
			config,
			appConfig
		});
		writeOutput(formatJsonOrText(await applyMemoryWikiMutation({
			config,
			mutation: {
				op: "create_synthesis",
				title,
				body,
				...metadata,
				sourceIds,
				...typeof opts.confidence === "number" ? { confidence: opts.confidence } : {}
			}
		}), opts.json, renderWikiMutationSummary));
	});
	addWikiApplyMutationOptions(vaultCommand(apply, "metadata", "Update metadata on an existing page").argument("<lookup>", "Relative path or page id")).option("--clear-confidence", "Remove any stored confidence value").option("--json", "Print JSON").action(async (lookup, opts) => {
		const { appConfig, config } = requireCommandContext();
		await syncMemoryWikiImportedSources({
			config,
			appConfig
		});
		writeOutput(formatJsonOrText(await applyMemoryWikiMutation({
			config,
			mutation: {
				op: "update_metadata",
				lookup,
				...resolveCliMutationMetadata(opts),
				...opts.clearConfidence ? { confidence: null } : typeof opts.confidence === "number" ? { confidence: opts.confidence } : {}
			}
		}), opts.json, renderWikiMutationSummary));
	});
	vaultCommand(wiki.command("bridge").description("Import public memory artifacts into the wiki vault"), "import", "Sync bridge-backed memory artifacts into wiki source pages").option("--json", "Print JSON").action(async (opts) => {
		const { agentId, appConfig, config } = requireCommandContext();
		await runWikiBridgeImport({
			config,
			appConfig,
			agentId,
			json: opts.json
		});
	});
	wiki.command("unsafe-local").description("Import explicitly configured private local paths into wiki source pages").command("import").description("Sync unsafe-local configured paths into wiki source pages").option("--json", "Print JSON").action(async (opts) => {
		const { appConfig, config } = requireCommandContext();
		if (config.vault.scope === "agent") throw new Error("Unsafe-local import does not support memory-wiki vault.scope=agent.");
		printWikiResult(await syncMemoryWikiImportedSources({
			config,
			appConfig
		}), opts.json, (value) => `Unsafe-local import synced ${value.artifactCount} artifacts (${value.importedCount} new, ${value.updatedCount} updated, ${value.skippedCount} unchanged, ${value.removedCount} removed). Indexes ${value.indexesRefreshed ? `refreshed (${value.indexUpdatedFiles.length} files)` : `not refreshed (${value.indexRefreshReason})`}.`);
	});
	const chatgpt = wiki.command("chatgpt").description("Import ChatGPT export history into wiki source pages");
	chatgpt.command("import").description("Import a ChatGPT export into draft wiki source pages").requiredOption("--export <path>", "ChatGPT export directory or conversations.json path").option("--agent <id>", "Agent id (default: configured default agent)").option("--dry-run", "Preview changes without writing", false).option("--json", "Print JSON").action(async (opts) => {
		const { config } = requireCommandContext();
		printWikiResult(await importChatGptConversations({
			config,
			exportPath: opts.export,
			dryRun: opts.dryRun
		}), opts.json, formatChatGptImportSummary);
	});
	vaultCommand(chatgpt, "rollback", "Roll back a previously applied ChatGPT import run").argument("<run-id>", "Import run id").option("--json", "Print JSON").action(async (runId, opts) => {
		const { config } = requireCommandContext();
		printWikiResult(await rollbackChatGptImportRun({
			config,
			runId
		}), opts.json, formatChatGptRollbackSummary);
	});
	const obsidian = wiki.command("obsidian").description("Run official Obsidian CLI helpers");
	obsidian.command("status").description("Probe the Obsidian CLI").option("--json", "Print JSON").action(async (opts) => {
		requireCommandContext();
		printWikiResult(await probeObsidianCli(), opts.json, (value) => value.available ? `Obsidian CLI available at ${value.command}` : "Obsidian CLI is not available on PATH.");
	});
	for (const action of OBSIDIAN_ACTIONS) {
		const command = obsidian.command(action.command).description(action.description);
		if (action.argument) command.argument(`<${action.argument.name}>`, action.argument.description);
		command.option("--json", "Print JSON");
		const run = async (value, opts) => {
			const { config } = requireCommandContext();
			assertOfficialObsidianCliSupported(config);
			printWikiResult(await runObsidianAction({
				config,
				action,
				value
			}), opts.json, (result) => result.stdout.trim() || action.success);
		};
		if (action.argument) command.action((value, opts) => run(value, opts));
		else command.action((opts) => run(void 0, opts));
	}
}
//#endregion
export { registerWikiCli };
