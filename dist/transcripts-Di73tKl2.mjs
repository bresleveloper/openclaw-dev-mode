import { y as parseDateStringTimestampMs } from "./number-coercion-CkhMiRw8.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { r as resolveStateDir } from "./state-dir-C8s3cOPX.mjs";
import "./paths-orClZ-2Z.mjs";
import { i as getPluginRegistryForContext } from "./gateway-request-scope-1BXD1G3l.mjs";
import { n as sanitizeTerminalText } from "./safe-text-BjmWJADa.mjs";
import { i as getCurrentPluginMetadataSnapshot } from "./current-plugin-metadata-snapshot-BK2DY7Lo.mjs";
import { Ng as errorShape, ds as validateTranscriptsListParams, fs as validateTranscriptsStatusParams, ls as validateTranscriptsExportParams, ps as validateTranscriptsSummarizeParams, us as validateTranscriptsGetParams } from "./src-pLJQA6J5.mjs";
import { t as ErrorCodes } from "./gateway-error-details-Cl-eEOTQ.mjs";
import { c as TRANSCRIPTS_RESULT_MAX_BYTES, i as TRANSCRIPTS_LEGACY_RESULT_MAX_BYTES, n as TRANSCRIPTS_LEGACY_MAX_TEXT_LENGTH, t as TRANSCRIPTS_EXPORT_MAX_BYTES } from "./transcripts-PqBPncW0.mjs";
import { o as operatorSessionCap } from "./operator-role-policy-Coro3qc5.mjs";
import { d as isGatewayAdmin } from "./session-sharing-policy-vx7GWqzs.mjs";
import "./session-sharing-DuL10izq.mjs";
import { t as formatForLog } from "./ws-log-BIFX57Bv.mjs";
import { t as assertValidParams } from "./validation--xIH1Pj-.mjs";
import { t as isTranscriptArtifactText } from "./transcription-text-DGY3Kmgr.mjs";
import { a as readGatewayRequestMutationAuthority } from "./session-mutation-guards-ClTdEKsf.mjs";
import { n as ensureTranscriptSummary } from "./capture-summary-8Zx0dPNW.mjs";
import { n as renderTranscriptsMarkdown } from "./store-Dea_YwMr.mjs";
import { d as readTranscriptCaptureSnapshot, f as resolveSourceProvider, h as manualTranscriptSourceProvider, t as createTranscriptsStore } from "./capture-operations-DwDzC-nq.mjs";
import { t as resolveTranscriptsConfig } from "./config-B42acf6V.mjs";
import { _ as projectTranscriptSource, a as assertTranscriptByteLimit, c as encodeCursor, g as projectTranscriptSession, h as projectTranscriptNotes, i as assertTranscriptByteCount, m as projectTranscriptMarkdown, o as cursorScope, r as TranscriptLibraryError, s as decodeCursor, v as projectTranscriptUtterance } from "./store-date-preparation-B2niPXMn.mjs";
import { S as transcriptSessionSelector, b as safeTranscriptPathSegment } from "./store-sqlite-DPxaUsRY.mjs";
import { t as presentTranscriptSession } from "./read-live-CTLPVM3k.mjs";
import { n as readConfiguredTranscriptStarts } from "./configured-start-status-9I_ii1aD.mjs";
import { createHash } from "node:crypto";
//#region src/transcripts/library.ts
function normalizeDate(value) {
	if (value === void 0) return;
	const time = parseDateStringTimestampMs(value);
	if (time === void 0) throw new TranscriptLibraryError("transcript_invalid_filter", "Invalid transcript date filter.");
	return new Date(time).toISOString();
}
async function listTranscriptLibrary(store, params, providerName) {
	const { cursor, ...filters } = params;
	const startedAfter = normalizeDate(filters.startedAfter);
	const startedBefore = normalizeDate(filters.startedBefore);
	if (startedAfter && startedBefore && startedAfter >= startedBefore) throw new TranscriptLibraryError("transcript_invalid_filter", "Transcript date range must end after it starts.");
	const scope = cursorScope([
		"list",
		filters.query,
		filters.providerId,
		filters.accountId,
		filters.agentId,
		startedAfter,
		startedBefore
	]);
	const position = decodeCursor(cursor, scope);
	let after;
	if (position) {
		const [startedAt, sessionId] = position;
		if (position.length !== 2 || typeof startedAt !== "string" || typeof sessionId !== "string") throw new TranscriptLibraryError("transcript_invalid_cursor", "Invalid transcript library cursor.");
		after = {
			startedAt,
			sessionId
		};
	}
	const { entries, hasMore } = await store.listReadEntries({
		...filters,
		startedAfter,
		startedBefore,
		after,
		projection: "public"
	});
	const captures = readTranscriptCaptureSnapshot();
	const sessions = entries.map((entry) => presentTranscriptSession(entry, captures, providerName?.(entry.providerId)));
	const last = sessions.at(-1);
	const result = {
		sessions,
		nextCursor: hasMore && last ? encodeCursor(scope, [last.startedAt, last.sessionId]) : null
	};
	assertTranscriptByteLimit(JSON.stringify(result));
	return result;
}
async function getTranscriptLibrary(store, params, providerName) {
	const { entry, page, notes, purpose, scope } = await store.readLibraryEntry(params);
	const utterances = page?.utterances.filter((utterance) => !isTranscriptArtifactText(utterance.text)).map((utterance) => {
		const projected = projectTranscriptUtterance(utterance);
		if (purpose === "legacy") projected.text = truncateUtf16Safe(projected.text, TRANSCRIPTS_LEGACY_MAX_TEXT_LENGTH);
		return projected;
	});
	const last = page?.utterances.at(-1);
	const result = {
		session: presentTranscriptSession(projectTranscriptSession(entry), void 0, providerName?.(entry.session.source.providerId)),
		...utterances ? { utterances } : {},
		nextCursor: page?.hasMore && last ? encodeCursor(scope, [last.sequence]) : null,
		summary: projectTranscriptNotes(notes)
	};
	assertTranscriptByteLimit(JSON.stringify(result), purpose === "legacy" ? TRANSCRIPTS_LEGACY_RESULT_MAX_BYTES : TRANSCRIPTS_RESULT_MAX_BYTES);
	return result;
}
async function exportTranscriptLibrary(store, params) {
	const parts = [];
	let sizeBytes = 0;
	const { entry, notes } = await store.streamExport(params.selector, params.format === "markdown", (rows) => {
		for (const utterance of rows) {
			if (isTranscriptArtifactText(utterance.text)) continue;
			const text = params.format === "jsonl" ? `${JSON.stringify(projectTranscriptUtterance(utterance))}\n` : sanitizeTerminalText(utterance.text).trim();
			const speaker = sanitizeTerminalText(utterance.speakerLabel ?? "").trim();
			const line = params.format === "markdown" && speaker ? `${speaker}: ${text}` : text;
			sizeBytes += Buffer.byteLength(line, "utf8") + (params.format === "markdown" ? 3 : 0);
			assertTranscriptByteCount(sizeBytes, TRANSCRIPTS_EXPORT_MAX_BYTES, true);
			parts.push(line);
		}
	});
	const summary = notes?.summary;
	const title = sanitizeTerminalText(entry.session.title ?? "").trim() || "Transcript";
	const body = params.format === "jsonl" ? parts.join("") : notes?.markdown !== void 0 ? [
		projectTranscriptMarkdown(notes.markdown),
		...summary ? [`Summary covers ${summary.utteranceCount} saved utterances.`] : [],
		`## Full Transcript\n${parts.map((line) => `- ${line}`).join("\n")}`,
		`Transcript utterances: ${entry.utteranceCount}\n`
	].join("\n\n") : summary ? `${renderTranscriptsMarkdown({
		...summary,
		title,
		transcript: parts,
		utteranceCount: entry.utteranceCount
	})}\n\nSummary covers ${summary.utteranceCount} saved utterances.\n` : `# ${title}\n\nSession: ${sanitizeTerminalText(entry.session.sessionId)}\nStarted: ${entry.session.startedAt}\n\n## Transcript\n${parts.map((line) => `- ${line}`).join("\n")}\n`;
	const bodySizeBytes = Buffer.byteLength(body, "utf8");
	assertTranscriptByteCount(bodySizeBytes, TRANSCRIPTS_EXPORT_MAX_BYTES, true);
	const digest = createHash("sha256").update(entry.selector).digest("hex").slice(0, 12);
	const filename = `transcript-${safeTranscriptPathSegment(entry.session.startedAt.slice(0, 10))}-${digest}.${params.format === "markdown" ? "md" : "jsonl"}`;
	return {
		selector: entry.selector,
		filename,
		mimeType: params.format === "markdown" ? "text/markdown;charset=utf-8" : "application/x-ndjson;charset=utf-8",
		encoding: "base64",
		data: Buffer.from(body, "utf8").toString("base64"),
		sizeBytes: bodySizeBytes
	};
}
//#endregion
//#region src/transcripts/status.ts
/** Reads lifecycle snapshots only; status must not discover/import providers or probe audio. */
async function readTranscriptLibraryStatus(store, cfg) {
	const config = resolveTranscriptsConfig(cfg.transcripts);
	const metadata = getCurrentPluginMetadataSnapshot({
		config: cfg,
		allowWorkspaceScopedSnapshot: true
	});
	const registry = getPluginRegistryForContext();
	const providers = /* @__PURE__ */ new Map();
	const installed = new Map(metadata?.index.plugins.map((plugin) => [plugin.pluginId, plugin]));
	const runtime = new Map(registry?.plugins.map((plugin) => [plugin.id, plugin]));
	for (const plugin of metadata?.plugins ?? []) for (const providerId of plugin.contracts?.transcriptSourceProviders ?? []) {
		const record = runtime.get(plugin.id);
		const enabled = installed.get(plugin.id)?.enabled;
		const descriptor = plugin.transcriptSources?.[providerId];
		providers.set(providerId, {
			providerId,
			pluginId: plugin.id,
			name: descriptor?.name ?? plugin.name ?? providerId,
			...descriptor?.autoStart ? { autoStart: descriptor.autoStart } : {},
			availability: record?.status === "error" ? "unavailable" : record?.enabled === false || enabled === false ? "disabled" : enabled === true ? "enabled" : "unknown"
		});
	}
	const registrations = [{
		provider: manualTranscriptSourceProvider,
		pluginId: void 0
	}, ...registry?.transcriptSourceProviders ?? []];
	const aliases = /* @__PURE__ */ new Map();
	for (const { provider, pluginId } of registrations) {
		aliases.set(provider.id.toLowerCase(), provider.id);
		for (const alias of provider.aliases ?? []) aliases.set(alias.toLowerCase(), provider.id);
		const record = pluginId ? runtime.get(pluginId) : void 0;
		const existing = providers.get(provider.id);
		providers.set(provider.id, {
			providerId: provider.id,
			...pluginId ? { pluginId } : {},
			name: existing?.name ?? provider.name,
			availability: record?.status === "error" ? "unavailable" : record?.enabled === false || existing?.availability === "disabled" ? "disabled" : "enabled",
			sourceKinds: [...provider.sourceKinds],
			canStart: Boolean(provider.start),
			canStop: Boolean(provider.stop),
			canImport: Boolean(provider.importTranscript),
			...existing?.pluginId === pluginId && existing?.autoStart ? { autoStart: existing.autoStart } : {}
		});
	}
	const captures = readTranscriptCaptureSnapshot();
	for (const source of [...config.autoStart, ...captures.map((capture) => capture.session.source)]) {
		const providerId = aliases.get(source.providerId.toLowerCase()) ?? source.providerId;
		if (!providers.has(providerId)) providers.set(providerId, {
			providerId,
			name: providerId,
			availability: metadata && metadata.pluginIds === void 0 ? "unavailable" : "unknown"
		});
	}
	const allProviders = [...providers.values()].toSorted((a, b) => a.providerId.localeCompare(b.providerId));
	const selectedCaptures = captures.toSorted((a, b) => a.session.startedAt.localeCompare(b.session.startedAt) || a.session.sessionId.localeCompare(b.session.sessionId)).slice(0, 100);
	const active = [];
	let activeBytes = 0;
	for (const capture of selectedCaptures) {
		const entry = await store.readEntry(transcriptSessionSelector(capture.session));
		if (entry) {
			const projected = presentTranscriptSession(projectTranscriptSession(entry), captures);
			activeBytes += Buffer.byteLength(JSON.stringify(projected), "utf8");
			assertTranscriptByteCount(activeBytes);
			active.push(projected);
		}
	}
	const configuredStarts = readConfiguredTranscriptStarts(cfg.transcripts);
	const configuredSources = config.autoStart.slice(0, 100).map((configured, index) => {
		const start = configuredStarts?.get(index);
		const requestedId = configured.providerId;
		const providerId = aliases.get(requestedId.toLowerCase()) ?? requestedId;
		const matches = captures.flatMap((capture) => {
			if (start) return capture.lifecycleToken === start.lifecycleToken ? [{
				capture,
				exact: true
			}] : [];
			const source = capture.configuredSource ?? capture.session.source;
			if (capture.providerId.toLowerCase() !== providerId.toLowerCase() && source.providerId.toLowerCase() !== requestedId.toLowerCase() || configured.sessionId && configured.sessionId !== capture.session.sessionId) return [];
			if (capture.configuredSource && Boolean(configured.meetingUrl) !== capture.configuredSource.meetingUrl) return [];
			let exact = !configured.meetingUrl && !source.meetingUrl;
			for (const key of [
				"accountId",
				"guildId",
				"channelId"
			]) {
				if (configured[key] === source[key]) continue;
				if (capture.configuredSource || configured[key] !== void 0 && source[key] !== void 0) return [];
				exact = false;
			}
			return [{
				capture,
				exact
			}];
		});
		const activeSelectors = matches.filter(({ capture, exact }) => exact && capture.state === "armed").slice(0, 100).map(({ capture }) => transcriptSessionSelector(capture.session));
		const provider = providers.get(providerId);
		const { whenOccupied: _whenOccupied, title, sessionId, ...source } = configured;
		const result = {
			source: projectTranscriptSource(source),
			title,
			sessionId,
			state: !config.enabled ? "disabled" : activeSelectors.length > 0 ? "armed" : matches.length > 0 || start?.diagnostic === "starting" || start?.diagnostic === "retrying" || !start && provider?.availability === "unknown" ? "unknown" : "not-active",
			activeSelectors
		};
		if (start?.diagnostic) result.startDiagnostic = start.diagnostic;
		return result;
	});
	const latest = await store.readLatestEntry();
	const result = {
		enabled: config.enabled,
		providers: allProviders.slice(0, 100),
		configuredSources,
		active,
		latestTranscript: latest ? presentTranscriptSession(projectTranscriptSession(latest), captures) : null,
		omitted: {
			providers: Math.max(0, allProviders.length - 100),
			configuredSources: Math.max(0, config.autoStart.length - 100),
			active: Math.max(0, captures.length - 100)
		}
	};
	assertTranscriptByteLimit(JSON.stringify(result));
	return result;
}
//#endregion
//#region src/gateway/server-methods/transcripts.ts
function transcriptMethod(method, validate, read) {
	return async (options) => {
		const { params, context, client, respond } = options;
		if (!assertValidParams(params, validate, method, respond)) return;
		const cfg = context.getRuntimeConfig();
		if (!isGatewayAdmin(client) && operatorSessionCap(client, cfg) === "none") {
			respond(false, void 0, errorShape(ErrorCodes.FORBIDDEN, "The transcript archive includes sessions hidden by your operator role; ask a Gateway administrator for archive access."));
			return;
		}
		try {
			const store = createTranscriptsStore({
				stateDir: resolveStateDir(),
				config: cfg,
				logger: console
			});
			const authority = readGatewayRequestMutationAuthority(options);
			const assertCurrent = () => {
				authority.assertCurrent();
				if (!isGatewayAdmin(client) && operatorSessionCap(client, context.getRuntimeConfig()) === "none") throw new Error("Transcript archive access changed");
			};
			const result = await read(store, params, cfg, assertCurrent);
			assertCurrent();
			respond(true, result);
		} catch (error) {
			if (!(error instanceof TranscriptLibraryError)) context.logGateway.warn(`${method} failed: ${formatForLog(error)}`);
			respond(false, void 0, error instanceof TranscriptLibraryError ? errorShape(ErrorCodes.INVALID_REQUEST, error.message, { details: {
				type: error.type,
				...error.maxBytes !== void 0 ? { maxBytes: error.maxBytes } : {}
			} }) : errorShape(ErrorCodes.UNAVAILABLE, `${method === "transcripts.summarize" ? "The meeting summary could not be generated" : "The transcript archive could not be read"}. Check Gateway diagnostics and retry.`));
		}
	};
}
const transcriptsHandlers = {
	"transcripts.list": transcriptMethod("transcripts.list", validateTranscriptsListParams, (store, params, cfg) => listTranscriptLibrary(store, params, providerNames(cfg))),
	"transcripts.get": transcriptMethod("transcripts.get", validateTranscriptsGetParams, (store, params, cfg) => getTranscriptLibrary(store, params, providerNames(cfg))),
	"transcripts.summarize": transcriptMethod("transcripts.summarize", validateTranscriptsSummarizeParams, async (store, params, cfg, assertCurrent) => {
		const { entry } = await store.readLibraryEntry(params);
		assertCurrent();
		if (!entry.hasSummary && entry.utteranceCount > 0) await ensureTranscriptSummary({
			stateDir: resolveStateDir(),
			store,
			session: entry.session,
			config: resolveTranscriptsConfig(cfg.transcripts),
			cfg,
			allowAppends: entry.session.stoppedAt === void 0,
			assertCurrent
		});
		assertCurrent();
		const result = await getTranscriptLibrary(store, params, providerNames(cfg));
		assertCurrent();
		return result;
	}),
	"transcripts.export": transcriptMethod("transcripts.export", validateTranscriptsExportParams, exportTranscriptLibrary),
	"transcripts.status": transcriptMethod("transcripts.status", validateTranscriptsStatusParams, (store, _params, cfg) => readTranscriptLibraryStatus(store, cfg))
};
function providerNames(config) {
	const names = /* @__PURE__ */ new Map();
	return (providerId) => {
		if (!names.has(providerId)) names.set(providerId, resolveSourceProvider(providerId, {
			config,
			stateDir: resolveStateDir(),
			logger: console
		})?.name);
		return names.get(providerId);
	};
}
//#endregion
export { transcriptsHandlers };
