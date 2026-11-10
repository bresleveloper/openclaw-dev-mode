import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { r as getAsyncWorkSignal } from "./async-work-scope-BH2yUdBz.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { t as sleep } from "./sleep-BJ5slSa3.mjs";
import { M as parseAgentSessionKey } from "./session-key-CSDERtm3.mjs";
import { a as resolveAgentDir } from "./agent-scope-config-fjA2T9Gz.mjs";
import { i as isPrimarySessionTranscriptFileName } from "./transcript-file-names-BZ8jA63H.mjs";
import { a as isSessionArchiveArtifactName, l as parseSessionArchiveTimestamp } from "./artifacts-C6u8F4sP.mjs";
import { d as resolveSessionTranscriptsDirForAgent, o as resolveSessionFilePathCore } from "./paths-YgcBNLgG.mjs";
import { i as prepareSqliteTargetFromSessionStorePath } from "./session-sqlite-target-DJQA0Ssz.mjs";
import { n as parseSqliteSessionFileMarker, t as formatSqliteSessionFileMarker } from "./legacy-sqlite-marker-CkjJ0jcJ.mjs";
import { o as stripInboundMetadata } from "./strip-inbound-meta-D65t0FgP.mjs";
import { n as selectVisibleTranscriptEvents } from "./transcript-visible-events-Ct6pwJvk.mjs";
import { n as captureSessionActorStorageOwner, s as withSessionActorStorage } from "./session-actor-storage-binding-oCtbPk00.mjs";
import { l as withSessionEntryReadOnlyInWorker } from "./session-entry-read-runtime-CgqUrGct.mjs";
import { n as materializeSessionArchiveForRead } from "./archive-compression-wxOTBVKt.mjs";
import { t as loadSessionTranscriptEvents } from "./session-transcript-events-BFcYGLfY.mjs";
import { t as streamSessionTranscriptLines } from "./transcript-stream--bqxYj-r.mjs";
import { t as stripUserEnvelopeForDisplay } from "./user-envelope-display-DD6S7AbG.mjs";
import { n as isToolCallContentType } from "./tool-content-CCdCNdqN.mjs";
import { i as computeUsageTokenTotals } from "./session-cost-usage-rollup-scan-C-xPJUWE.mjs";
import { a as refreshCostUsageCacheForAgent, c as runUsageCostWorker, d as resolveUsageCostPricingFingerprint, l as createUsageCostResolver, o as prepareUsageCostWorker, s as resolveUsageCostWorkerDayBucket, u as parseUsageCostTranscriptEntryAsync } from "./session-cost-usage-cache-runtime-CYTPw1GD.mjs";
import fs from "node:fs";
import path from "node:path";
//#region src/infra/session-cost-usage-reporting.ts
const USAGE_COST_DIRECT_REFRESH_RETRY_MS = 25;
async function withSessionUsageDiagnosticSource(params, read) {
	const source = await resolveUsageSessionSource(params);
	if (!source || !parseSqliteSessionFileMarker(source.sessionFile) && !fs.existsSync(source.sessionFile)) return null;
	const signal = getAsyncWorkSignal();
	const marker = parseSqliteSessionFileMarker(source.sessionFile);
	const memory = marker && captureSessionActorStorageOwner(marker, {
		assertCurrent: () => signal?.throwIfAborted(),
		authorize() {}
	});
	const result = await read(params, source.sessionFile);
	memory?.owner?.assertCurrent();
	memory?.authority.assertCurrent();
	return result;
}
async function discoverAllSessions(params) {
	const result = await runUsageCostWorker(prepareUsageCostWorker(params), {
		kind: "inventory",
		minMtimeMs: params.startMs
	});
	if (result.kind !== "inventory") throw new Error("Usage worker returned an invalid session inventory");
	const discovered = /* @__PURE__ */ new Map();
	for (const file of result.files) {
		const { sourcePath: sessionFile, sessionId } = file;
		if (!sessionId) continue;
		const isPrimaryTranscript = file.kind === "sqlite" || isPrimarySessionTranscriptFileName(path.basename(sessionFile));
		const existing = discovered.get(sessionId);
		const existingIsPrimary = existing ? isPrimarySessionTranscriptFileName(path.basename(existing.sessionFile)) : false;
		if (!existing || isPrimaryTranscript && !existingIsPrimary || isPrimaryTranscript === existingIsPrimary && file.mtimeMs >= existing.mtime) discovered.set(sessionId, {
			sessionId,
			sessionFile,
			mtime: file.mtimeMs,
			...file.transcriptFile ? { transcriptFile: file.transcriptFile } : {}
		});
	}
	return Array.from(discovered.values()).toSorted((a, b) => b.mtime - a.mtime);
}
async function loadSessionCostSummary(params) {
	const source = await resolveUsageSessionSource(params);
	if (!source) return null;
	const { sessionFile } = source;
	const prepared = prepareUsageCostWorker({
		...params,
		sessionFiles: [sessionFile]
	});
	const inventory = await runUsageCostWorker(prepared, {
		kind: "inventory",
		sessionFiles: [sessionFile]
	});
	if (inventory.kind !== "inventory") throw new Error("Usage worker returned an invalid session inventory");
	if (inventory.files.length === 0) return null;
	while (await refreshCostUsageCacheForAgent({
		config: params.config,
		agentId: params.agentId,
		agentDir: prepared.agentDir,
		databasePath: prepared.location.databasePath,
		storePath: prepared.location.storePath,
		env: prepared.location.env,
		sessionFiles: [sessionFile],
		sessionActor: prepared.sessionActor
	}) === "busy") await sleep(USAGE_COST_DIRECT_REFRESH_RETRY_MS);
	const pricingFingerprint = await resolveUsageCostPricingFingerprint(prepared.config, prepared.agentDir);
	const result = await runUsageCostWorker(prepared, {
		kind: "sessions",
		pricingFingerprint,
		sessions: [{
			sessionId: params.sessionId,
			sessionFile
		}],
		startMs: params.startMs,
		endMs: params.endMs,
		includeUntimestamped: params.includeUntimestamped,
		dayBucket: resolveUsageCostWorkerDayBucket(params.dayBucket)
	});
	if (result.kind !== "sessions") throw new Error("Usage worker returned an invalid session summary");
	return result.summaries[0] ?? null;
}
async function loadSessionUsageTimeSeries(params) {
	return withSessionUsageDiagnosticSource(params, async (scoped, sessionFile) => {
		if (scoped.maxPoints !== void 0 && scoped.maxPoints !== null) {
			if (!Number.isFinite(scoped.maxPoints) || scoped.maxPoints <= 0) return {
				sessionId: scoped.sessionId,
				points: []
			};
		}
		let points = [];
		let usageUnavailable = false;
		const agentDir = resolveAgentDir(scoped.config ?? {}, scoped.agentId);
		const resolveCost = createUsageCostResolver({
			config: scoped.config,
			agentDir
		});
		for await (const record of readTranscriptRecords(sessionFile)) {
			const entry = await parseUsageCostTranscriptEntryAsync(record, resolveCost, scoped.config);
			const timestamp = entry?.timestamp?.getTime();
			if (!entry?.usage || !timestamp) continue;
			if (entry.usage.usageReport?.state === "unavailable") {
				usageUnavailable = true;
				continue;
			}
			points.push({
				timestamp,
				...computeUsageTokenTotals(entry.usage),
				cost: entry.costTotal ?? 0
			});
		}
		points.sort((a, b) => a.timestamp - b.timestamp);
		const maxPoints = scoped.maxPoints ?? 100;
		if (points.length > maxPoints) {
			const step = Math.ceil(points.length / maxPoints);
			const downsampled = [];
			let bucket;
			for (const [index, point] of points.entries()) {
				if (!bucket || index % step === 0) {
					bucket = {
						timestamp: point.timestamp,
						input: 0,
						output: 0,
						cacheRead: 0,
						cacheWrite: 0,
						totalTokens: 0,
						cost: 0
					};
					downsampled.push(bucket);
				}
				bucket.timestamp = point.timestamp;
				bucket.input += point.input;
				bucket.output += point.output;
				bucket.cacheRead += point.cacheRead;
				bucket.cacheWrite += point.cacheWrite;
				bucket.totalTokens += point.totalTokens;
				bucket.cost += point.cost;
			}
			points = downsampled;
		}
		let cumulativeTokens = 0;
		let cumulativeCost = 0;
		return {
			sessionId: scoped.sessionId,
			...usageUnavailable ? { usageReport: { state: "unavailable" } } : {},
			points: points.map((point) => {
				cumulativeTokens += point.totalTokens;
				cumulativeCost += point.cost;
				return Object.assign(point, {
					cumulativeTokens,
					cumulativeCost
				});
			})
		};
	});
}
async function loadSessionLogs(params) {
	return withSessionUsageDiagnosticSource(params, async (scoped, sessionFile) => {
		const logs = [];
		if (scoped.limit !== void 0 && scoped.limit !== null) {
			if (!Number.isFinite(scoped.limit) || scoped.limit <= 0) return [];
		}
		const limit = scoped.limit ?? 50;
		const boundedLimit = Number.isInteger(limit);
		const retentionLimit = limit * 2;
		const agentDir = resolveAgentDir(scoped.config ?? {}, scoped.agentId);
		const resolveCost = createUsageCostResolver({
			config: scoped.config,
			agentDir
		});
		for await (const parsed of readTranscriptRecordsBestEffort(sessionFile)) {
			let role;
			let content;
			try {
				const message = parsed.message;
				if (!message) continue;
				const recordRole = message.role;
				if (recordRole !== "user" && recordRole !== "assistant" && recordRole !== "tool" && recordRole !== "toolResult") continue;
				role = recordRole;
				const contentParts = [];
				const rawToolName = message.toolName ?? message.tool_name ?? message.name ?? message.tool;
				const toolName = normalizeOptionalString(rawToolName);
				if (role === "tool" || role === "toolResult") {
					contentParts.push(`[Tool: ${toolName ?? "tool"}]`);
					contentParts.push("[Tool Result]");
				}
				const rawContent = message.content;
				if (typeof rawContent === "string") contentParts.push(rawContent);
				else if (Array.isArray(rawContent)) {
					const contentText = rawContent.map((block) => {
						if (typeof block === "string") return block;
						const b = block;
						if (b.type === "text" && typeof b.text === "string") return b.text;
						if (isToolCallContentType(normalizeOptionalString(b.type))) return `[Tool: ${typeof b.name === "string" ? b.name : "unknown"}]`;
						if (b.type === "tool_result") return "[Tool Result]";
						return "";
					}).filter(Boolean).join("\n");
					if (contentText) contentParts.push(contentText);
				}
				const rawToolCalls = message.tool_calls ?? message.toolCalls ?? message.function_call ?? message.functionCall;
				const toolCalls = Array.isArray(rawToolCalls) ? rawToolCalls : rawToolCalls ? [rawToolCalls] : [];
				for (const call of toolCalls) {
					const callObj = call;
					const directName = typeof callObj.name === "string" ? callObj.name : void 0;
					const fn = callObj.function;
					const fnName = typeof fn?.name === "string" ? fn.name : void 0;
					const name = directName ?? fnName ?? "unknown";
					contentParts.push(`[Tool: ${name}]`);
				}
				const rawText = contentParts.join("\n");
				content = role === "user" ? stripUserEnvelopeForDisplay(rawText).trim() : stripInboundMetadata(rawText.trim());
				if (!content) continue;
				const maxLen = 2e3;
				if (content.length > maxLen) content = truncateUtf16Safe(content, maxLen) + "…";
			} catch {
				continue;
			}
			const entry = await parseUsageCostTranscriptEntryAsync(parsed, resolveCost, scoped.config);
			const usage = role === "assistant" && entry?.usage?.usageReport?.state !== "unavailable" ? entry?.usage : void 0;
			logs.push({
				timestamp: entry?.timestamp?.getTime() ?? 0,
				role,
				content,
				tokens: usage ? computeUsageTokenTotals(usage).totalTokens : void 0,
				cost: usage ? entry?.costTotal : void 0
			});
			if (boundedLimit && logs.length > retentionLimit) {
				logs.sort((a, b) => a.timestamp - b.timestamp);
				logs.splice(0, logs.length - limit);
			}
		}
		logs.sort((a, b) => a.timestamp - b.timestamp);
		return logs.length > limit ? logs.slice(-limit) : logs;
	});
}
async function* readTranscriptRecords(filePath) {
	const marker = parseSqliteSessionFileMarker(filePath);
	if (marker) {
		const signal = getAsyncWorkSignal();
		const memory = captureSessionActorStorageOwner(marker, {
			assertCurrent: () => signal?.throwIfAborted(),
			authorize() {}
		});
		let events;
		if (memory) events = await withSessionActorStorage(marker, {
			authority: memory.authority,
			lifetime: {
				assertCurrent: () => memory.authority.assertCurrent(),
				assertReadable: () => memory.authority.assertCurrent()
			}
		}, async (binding) => {
			return ((await binding.actor.storage.read({
				type: "session.usage.snapshot",
				input: {
					sessionIds: [marker.sessionId],
					includeEvents: true
				}
			}, binding.authority))[0]?.events ?? []).map(({ eventJson }) => JSON.parse(eventJson));
		}) ?? [];
		else events = await loadSessionTranscriptEvents(marker);
		for (const event of selectVisibleTranscriptEvents(events)) if (isRecord(event)) yield event;
		return;
	}
	const transcriptPath = await materializeSessionArchiveForRead(filePath);
	for await (const line of streamSessionTranscriptLines(transcriptPath)) try {
		const parsed = JSON.parse(line);
		if (isRecord(parsed)) yield parsed;
	} catch {}
}
async function* readTranscriptRecordsBestEffort(filePath) {
	try {
		yield* readTranscriptRecords(filePath);
	} catch (error) {
		if (parseSqliteSessionFileMarker(filePath)) throw error;
	}
}
async function resolveUsageSessionSource(input) {
	const params = input;
	const signal = getAsyncWorkSignal();
	const assertCurrent = () => signal?.throwIfAborted();
	assertCurrent();
	const sessionId = normalizeOptionalString(params.sessionId);
	const target = params.sessionTarget;
	if (target) {
		const agentId = normalizeOptionalString(target.agentId);
		const targetSessionId = normalizeOptionalString(target.sessionId);
		const sessionKey = normalizeOptionalString(target.sessionKey);
		const storePath = normalizeOptionalString(target.storePath);
		if (!agentId || !targetSessionId || !sessionKey || !storePath) return;
		const targetKeyAgentId = parseAgentSessionKey(sessionKey)?.agentId;
		if (sessionId !== void 0 && targetSessionId !== sessionId || agentId !== params.agentId || targetKeyAgentId && targetKeyAgentId !== agentId) return;
		const memory = captureSessionActorStorageOwner({
			agentId,
			sessionKey,
			storePath
		}, {
			assertCurrent,
			authorize() {}
		});
		if (memory) return withSessionActorStorage({
			agentId,
			sessionKey,
			storePath
		}, {
			authority: memory.authority,
			lifetime: {
				assertCurrent,
				assertReadable: assertCurrent
			}
		}, async (binding) => {
			const entry = await binding.actor.storage.read({
				type: "session.entry.read",
				input: {}
			}, binding.authority);
			if (entry && entry.sessionId !== targetSessionId) return;
			return {
				entry,
				sessionFile: formatSqliteSessionFileMarker({
					agentId,
					sessionId: targetSessionId,
					storePath: binding.path
				})
			};
		});
		return withSessionEntryReadOnlyInWorker({
			agentId,
			sessionKey,
			storePath,
			projection: "list"
		}, assertCurrent, async (read, owner) => {
			if (!read.ok) throw read.error;
			if (read.value && read.value.sessionId !== targetSessionId) return;
			const physicalPath = owner.scope?.storePath ?? (await prepareSqliteTargetFromSessionStorePath(storePath, { agentId }, signal)).path;
			owner.assertCurrent();
			return {
				entry: read.value,
				sessionFile: formatSqliteSessionFileMarker({
					agentId,
					sessionId: targetSessionId,
					storePath: physicalPath
				})
			};
		});
	}
	const sqliteMarker = parseSqliteSessionFileMarker(params.sessionFile);
	if (sqliteMarker) {
		if (sqliteMarker.agentId !== params.agentId || sessionId && sqliteMarker.sessionId !== sessionId) return;
		return { sessionFile: formatSqliteSessionFileMarker(sqliteMarker) };
	}
	const candidate = params.sessionFile ?? (sessionId ? resolveSessionFilePathCore(sessionId, void 0, { agentId: params.agentId }) : void 0);
	if (candidate && fs.existsSync(candidate)) return { sessionFile: candidate };
	if (!sessionId) return candidate ? { sessionFile: candidate } : void 0;
	try {
		const sessionsDir = candidate ? path.dirname(candidate) : resolveSessionTranscriptsDirForAgent(params.agentId);
		const baseFileName = `${sessionId}.jsonl`;
		const entries = fs.readdirSync(sessionsDir, { withFileTypes: true }).filter((entry) => {
			return entry.isFile() && (entry.name === baseFileName || entry.name.startsWith(`${baseFileName}.reset.`) || entry.name.startsWith(`${baseFileName}.deleted.`));
		});
		const primary = entries.find((entry) => entry.name === baseFileName);
		if (primary) return { sessionFile: path.join(sessionsDir, primary.name) };
		const archiveTimestamp = (name) => parseSessionArchiveTimestamp(name, "deleted") ?? parseSessionArchiveTimestamp(name, "reset") ?? 0;
		const latestArchive = entries.filter((entry) => isSessionArchiveArtifactName(entry.name)).map((entry) => entry.name).toSorted((a, b) => archiveTimestamp(b) - archiveTimestamp(a) || b.localeCompare(a))[0];
		const sessionFile = latestArchive ? path.join(sessionsDir, latestArchive) : candidate;
		return sessionFile ? { sessionFile } : void 0;
	} catch {
		return candidate ? { sessionFile: candidate } : void 0;
	}
}
//#endregion
export { resolveUsageSessionSource as a, loadSessionUsageTimeSeries as i, loadSessionCostSummary as n, loadSessionLogs as r, discoverAllSessions as t };
