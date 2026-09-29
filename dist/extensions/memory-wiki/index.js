import { t as asNonArrayRecord } from "../../record-coerce-DItp3I4t.mjs";
import { y as uniqueStrings } from "../../string-normalization-_gRhJUDw.mjs";
import { r as truncateUtf16Safe } from "../../utf16-slice-D_ngcYKd.mjs";
import "../../api-CJ6hmLgL.mjs";
import { m as resolveDefaultAgentId } from "../../agent-scope-config-IQKOEtZ4.mjs";
import { t as formatErrorMessage } from "../../errors-DnjwnOju.mjs";
import { t as ErrorCodes } from "../../gateway-error-details-D85F07e9.mjs";
import { f as errorShape } from "../../error-codes-DvB36bCj.mjs";
import "../../error-runtime-Bf1fYXFh.mjs";
import { n as textResult } from "../../tool-results-BCM3fdVS.mjs";
import { d as readPositiveIntegerParam } from "../../common-XfKigJno.mjs";
import "../../string-coerce-runtime-C_MKhRVt.mjs";
import "../../text-utility-runtime-D7I29NA0.mjs";
import { i as optionalFiniteNumberSchema } from "../../typebox-DIBvVmm8.mjs";
import { n as buildPluginConfigSchema } from "../../config-schema-c9utjSlx.mjs";
import { t as definePluginEntry } from "../../plugin-entry-BOulgRcx.mjs";
import "../../gateway-runtime-BCC8MoQW.mjs";
import { s as mapPluginConfigIssues } from "../../extension-shared-N0S3ppSB.mjs";
import "../../channel-actions-BjxmEiuN.mjs";
import "../../memory-host-core-CExmomyE.mjs";
import "../../param-readers-BfezLD6d.mjs";
import { A as ensureMemoryWikiVaultGeneration, B as setMemoryWikiDashboardState, C as listMemoryWikiImportInsights, D as initializeMemoryWikiVault, E as searchMemoryWiki, F as createMemoryWikiCompiledCacheStore, I as deactivateMemoryWikiCompiledCacheOwnersExcept, L as loadMemoryWikiCompiledCache, M as MemoryWikiDashboardUnavailableError, N as activateMemoryWikiCompiledCacheOwner, P as configureMemoryWikiCompiledCacheStore, R as reconcileMemoryWikiCompiledCacheOwner, T as getMemoryWikiPage, _ as ingestMemoryWikiSource, a as renderMemoryWikiStatus, b as compileMemoryWikiVault, c as waitForMemoryWikiImportedSourceSyncs, d as probeObsidianCli, f as runObsidianCommand, g as lintMemoryWikiVault, h as runObsidianSearch, j as loadMemoryWikiValidatedVaultIdentity, m as runObsidianOpen, n as renderWikiSearchResults, o as resolveMemoryWikiStatus, p as runObsidianDaily, r as buildMemoryWikiDoctorReport, s as syncMemoryWikiImportedSources, t as renderWikiMutationSummary, v as applyMemoryWikiMutation, w as WIKI_SEARCH_MODES, x as listMemoryWikiOverview, y as normalizeMemoryWikiMutationInput, z as resolveMemoryWikiCompiledCacheOwnerId } from "../../presentation-Ctgs8QCr.mjs";
import { a as resolveMemoryWikiConfig, i as resolveMemoryWikiAgentConfig, n as WIKI_SEARCH_BACKENDS, o as resolveMemoryWikiConfiguredAgentIds, r as WIKI_SEARCH_CORPORA, t as MemoryWikiConfigSource } from "../../config-DtaJXrmb.mjs";
import { a as createMemoryWikiImportRunStateStore, h as createMemoryWikiSourceSyncStateStore, m as configureMemoryWikiSourceSyncStateStore, o as listMemoryWikiImportRunRecords, r as configureMemoryWikiImportRunStateStore } from "../../import-runs-state-CE1H5GV6.mjs";
import path from "node:path";
import fs from "node:fs/promises";
import { Type } from "typebox";
//#region extensions/memory-wiki/src/config-schema.ts
const memoryWikiConfigSchema = buildPluginConfigSchema(MemoryWikiConfigSource, { safeParse(value) {
	if (value === void 0) return {
		success: true,
		data: resolveMemoryWikiConfig(void 0)
	};
	const result = MemoryWikiConfigSource.safeParse(value);
	if (result.success) return {
		success: true,
		data: resolveMemoryWikiConfig(result.data)
	};
	return {
		success: false,
		error: { issues: mapPluginConfigIssues(result.error.issues) }
	};
} });
//#endregion
//#region extensions/memory-wiki/src/corpus-supplement.ts
function createWikiCorpusSupplement(params) {
	return {
		search: async (input) => {
			const appConfig = params.getAppConfig();
			const config = params.resolveConfig(input.agentId, appConfig);
			return await searchMemoryWiki({
				config,
				appConfig,
				agentId: config.agentId ?? input.agentId,
				agentSessionKey: input.agentSessionKey,
				sandboxed: input.sandboxed,
				query: input.query,
				maxResults: input.maxResults,
				searchBackend: "local",
				searchCorpus: "wiki"
			});
		},
		get: async (input) => {
			const appConfig = params.getAppConfig();
			const config = params.resolveConfig(input.agentId, appConfig);
			return await getMemoryWikiPage({
				config,
				appConfig,
				agentId: config.agentId ?? input.agentId,
				agentSessionKey: input.agentSessionKey,
				sandboxed: input.sandboxed,
				lookup: input.lookup,
				fromLine: input.fromLine,
				lineCount: input.lineCount,
				searchBackend: "local",
				searchCorpus: "wiki"
			});
		}
	};
}
//#endregion
//#region extensions/memory-wiki/src/import-runs.ts
function toImportRunSummary(record) {
	const createdPaths = record.createdPaths.map((entry) => entry.path);
	const updatedPaths = record.updatedPaths.map((entry) => entry.path);
	const pagePaths = uniqueStrings([...createdPaths, ...updatedPaths]);
	const rollingBack = Boolean(record.rollbackStartedAt || record.rollbackTargetsFinalizedAt);
	return {
		runId: record.runId,
		importType: record.importType,
		appliedAt: record.appliedAt,
		exportPath: record.exportPath,
		sourcePath: record.sourcePath,
		conversationCount: record.conversationCount,
		createdCount: record.createdCount,
		updatedCount: record.updatedCount,
		skippedCount: record.skippedCount,
		status: record.rolledBackAt ? "rolled_back" : rollingBack ? "rolling_back" : "applied",
		...record.rollbackStartedAt ? { rollbackStartedAt: record.rollbackStartedAt } : {},
		...record.rollbackTargetsFinalizedAt ? { rollbackTargetsFinalizedAt: record.rollbackTargetsFinalizedAt } : {},
		...record.rolledBackAt ? { rolledBackAt: record.rolledBackAt } : {},
		pagePaths,
		samplePaths: pagePaths.slice(0, 5)
	};
}
async function listMemoryWikiImportRuns(config, options) {
	const limit = Math.max(1, Math.floor(options?.limit ?? 10));
	const runs = (await listMemoryWikiImportRunRecords(config.vault.path)).map(toImportRunSummary).toSorted((left, right) => right.appliedAt.localeCompare(left.appliedAt));
	return {
		runs: runs.slice(0, limit),
		totalRuns: runs.length,
		activeRuns: runs.filter((entry) => entry.status !== "rolled_back").length,
		rolledBackRuns: runs.filter((entry) => entry.status === "rolled_back").length
	};
}
//#endregion
//#region extensions/memory-wiki/src/gateway.ts
const READ_SCOPE = "operator.read";
const WRITE_SCOPE = "operator.write";
const LOCAL_FILE_INGEST_SCOPE = "operator.admin";
function readStringParam(params, key, options) {
	const value = params[key];
	if (typeof value === "string" && value.trim()) return value.trim();
	if (options?.required) throw new Error(`${key} is required.`);
}
function readEnumParam(params, key, allowed) {
	const value = readStringParam(params, key);
	if (!value) return;
	if (allowed.includes(value)) return value;
	throw new Error(`${key} must be one of: ${allowed.join(", ")}.`);
}
function respondError(respond, error) {
	if (error instanceof MemoryWikiDashboardUnavailableError) {
		const retryable = error.state === "rebuilding";
		respond(false, void 0, errorShape(error.state === "compile-required" ? ErrorCodes.INVALID_REQUEST : ErrorCodes.UNAVAILABLE, error.message, {
			details: { state: error.state },
			...retryable ? {
				retryable: true,
				retryAfterMs: 500
			} : {}
		}));
		return;
	}
	respond(false, void 0, {
		code: "internal_error",
		message: formatErrorMessage(error)
	});
}
function registerMemoryWikiGatewayMethods(params) {
	const { api, config: baseConfig } = params;
	const registerResultMethod = (method, scope, handler) => {
		api.registerGatewayMethod(method, async ({ params: requestParams, respond }) => {
			try {
				respond(true, await handler(requestParams));
			} catch (error) {
				respondError(respond, error);
			}
		}, { scope });
	};
	const syncImportedSourcesInBackground = (config, appConfig) => {
		const signal = params.resolveSourceSyncSignal?.();
		if (params.resolveSourceSyncSignal && !signal) return;
		syncMemoryWikiImportedSources({
			config,
			appConfig,
			...signal ? { signal } : {}
		}).catch((error) => {
			if (signal?.aborted) return;
			setMemoryWikiDashboardState(config, { state: "failed" });
			api.logger.warn(`memory-wiki: background source sync failed: ${formatErrorMessage(error)}`);
		});
	};
	const getAppConfig = () => {
		if (params.getAppConfig) return params.getAppConfig();
		if (typeof api.runtime.config?.current === "function") return api.runtime.config.current();
		return params.appConfig;
	};
	const resolveSourceSyncSignal = () => {
		const signal = params.resolveSourceSyncSignal?.();
		if (params.resolveSourceSyncSignal && !signal) throw new Error("Memory Wiki service is not active.");
		return signal;
	};
	const resolveRequestContext = (requestParams) => {
		const signal = resolveSourceSyncSignal();
		const appConfig = getAppConfig();
		const requestedAgentId = readStringParam(requestParams, "agentId");
		const config = params.resolveConfig ? params.resolveConfig(requestedAgentId, appConfig) : resolveMemoryWikiAgentConfig({
			config: baseConfig,
			appConfig,
			...requestedAgentId ? { agentId: requestedAgentId } : {}
		});
		return {
			agentId: config.agentId ?? requestedAgentId ?? (appConfig ? resolveDefaultAgentId(appConfig) : void 0),
			appConfig,
			config,
			signal
		};
	};
	const assertOfficialObsidianCliSupported = (config) => {
		if (config.vault.scope === "agent") throw new Error("Official Obsidian CLI actions do not support memory-wiki vault.scope=agent.");
	};
	registerResultMethod("wiki.status", READ_SCOPE, async (requestParams) => {
		const { appConfig, config, signal } = resolveRequestContext(requestParams);
		await syncMemoryWikiImportedSources({
			config,
			appConfig,
			...signal ? { signal } : {}
		});
		return await resolveMemoryWikiStatus(config, { appConfig });
	});
	registerResultMethod("wiki.importRuns", READ_SCOPE, async (requestParams) => {
		const { config } = resolveRequestContext(requestParams);
		const limit = readPositiveIntegerParam(requestParams, "limit");
		return await listMemoryWikiImportRuns(config, limit !== void 0 ? { limit } : {});
	});
	registerResultMethod("wiki.importInsights", READ_SCOPE, async (requestParams) => {
		const { appConfig, config } = resolveRequestContext(requestParams);
		syncImportedSourcesInBackground(config, appConfig);
		return await listMemoryWikiImportInsights(config);
	});
	registerResultMethod("wiki.overview", READ_SCOPE, async (requestParams) => {
		const { appConfig, config } = resolveRequestContext(requestParams);
		syncImportedSourcesInBackground(config, appConfig);
		return await listMemoryWikiOverview(config);
	});
	registerResultMethod("wiki.init", WRITE_SCOPE, async (requestParams) => {
		const { config, signal } = resolveRequestContext(requestParams);
		return await initializeMemoryWikiVault(config, signal ? { signal } : void 0);
	});
	registerResultMethod("wiki.doctor", READ_SCOPE, async (requestParams) => {
		const { appConfig, config, signal } = resolveRequestContext(requestParams);
		await syncMemoryWikiImportedSources({
			config,
			appConfig,
			...signal ? { signal } : {}
		});
		const status = await resolveMemoryWikiStatus(config, { appConfig });
		return buildMemoryWikiDoctorReport(status);
	});
	registerResultMethod("wiki.compile", WRITE_SCOPE, async (requestParams) => {
		const { appConfig, config, signal } = resolveRequestContext(requestParams);
		await syncMemoryWikiImportedSources({
			config,
			appConfig,
			...signal ? { signal } : {}
		});
		return await compileMemoryWikiVault(config, signal ? { signal } : void 0);
	});
	registerResultMethod("wiki.ingest", LOCAL_FILE_INGEST_SCOPE, async (requestParams) => {
		const { config, signal } = resolveRequestContext(requestParams);
		const inputPath = readStringParam(requestParams, "inputPath", { required: true });
		const title = readStringParam(requestParams, "title");
		return await ingestMemoryWikiSource({
			config,
			inputPath,
			...title ? { title } : {},
			...signal ? { signal } : {}
		});
	});
	registerResultMethod("wiki.lint", WRITE_SCOPE, async (requestParams) => {
		const { appConfig, config, signal } = resolveRequestContext(requestParams);
		await syncMemoryWikiImportedSources({
			config,
			appConfig,
			...signal ? { signal } : {}
		});
		return await lintMemoryWikiVault(config, signal ? { signal } : void 0);
	});
	registerResultMethod("wiki.bridge.import", WRITE_SCOPE, async (requestParams) => {
		const { appConfig, config, signal } = resolveRequestContext(requestParams);
		return await syncMemoryWikiImportedSources({
			config: {
				...config,
				vaultMode: "bridge"
			},
			appConfig,
			...signal ? { signal } : {}
		});
	});
	registerResultMethod("wiki.unsafeLocal.import", WRITE_SCOPE, async (requestParams) => {
		const { appConfig, config, signal } = resolveRequestContext(requestParams);
		if (config.vault.scope === "agent") throw new Error("Unsafe-local import does not support memory-wiki vault.scope=agent.");
		return await syncMemoryWikiImportedSources({
			config: {
				...config,
				vaultMode: "unsafe-local"
			},
			appConfig,
			...signal ? { signal } : {}
		});
	});
	registerResultMethod("wiki.search", READ_SCOPE, async (requestParams) => {
		const { agentId, appConfig, config, signal } = resolveRequestContext(requestParams);
		await syncMemoryWikiImportedSources({
			config,
			appConfig,
			...signal ? { signal } : {}
		});
		const query = readStringParam(requestParams, "query", { required: true });
		const maxResults = readPositiveIntegerParam(requestParams, "maxResults");
		const searchBackend = readEnumParam(requestParams, "backend", WIKI_SEARCH_BACKENDS);
		const searchCorpus = readEnumParam(requestParams, "corpus", WIKI_SEARCH_CORPORA);
		const mode = readEnumParam(requestParams, "mode", WIKI_SEARCH_MODES);
		return await searchMemoryWiki({
			config,
			appConfig,
			...agentId ? { agentId } : {},
			query,
			maxResults,
			searchBackend,
			searchCorpus,
			mode
		});
	});
	registerResultMethod("wiki.apply", WRITE_SCOPE, async (requestParams) => {
		const { appConfig, config, signal } = resolveRequestContext(requestParams);
		const mutation = normalizeMemoryWikiMutationInput(requestParams);
		await syncMemoryWikiImportedSources({
			config,
			appConfig,
			...signal ? { signal } : {}
		});
		return await applyMemoryWikiMutation({
			config,
			mutation,
			...signal ? { signal } : {}
		});
	});
	registerResultMethod("wiki.get", READ_SCOPE, async (requestParams) => {
		const { agentId, appConfig, config, signal } = resolveRequestContext(requestParams);
		await syncMemoryWikiImportedSources({
			config,
			appConfig,
			...signal ? { signal } : {}
		});
		const lookup = readStringParam(requestParams, "lookup", { required: true });
		const fromLine = readPositiveIntegerParam(requestParams, "fromLine");
		const lineCount = readPositiveIntegerParam(requestParams, "lineCount");
		const searchBackend = readEnumParam(requestParams, "backend", WIKI_SEARCH_BACKENDS);
		const searchCorpus = readEnumParam(requestParams, "corpus", WIKI_SEARCH_CORPORA);
		return await getMemoryWikiPage({
			config,
			appConfig,
			...agentId ? { agentId } : {},
			lookup,
			fromLine,
			lineCount,
			searchBackend,
			searchCorpus
		});
	});
	registerResultMethod("wiki.obsidian.status", READ_SCOPE, () => probeObsidianCli());
	registerResultMethod("wiki.obsidian.search", WRITE_SCOPE, async (requestParams) => {
		const { config } = resolveRequestContext(requestParams);
		assertOfficialObsidianCliSupported(config);
		const query = readStringParam(requestParams, "query", { required: true });
		return await runObsidianSearch({
			config,
			query
		});
	});
	registerResultMethod("wiki.obsidian.open", WRITE_SCOPE, async (requestParams) => {
		const { config } = resolveRequestContext(requestParams);
		assertOfficialObsidianCliSupported(config);
		const vaultPath = readStringParam(requestParams, "path", { required: true });
		return await runObsidianOpen({
			config,
			vaultPath
		});
	});
	registerResultMethod("wiki.obsidian.command", WRITE_SCOPE, async (requestParams) => {
		const { config } = resolveRequestContext(requestParams);
		assertOfficialObsidianCliSupported(config);
		const id = readStringParam(requestParams, "id", { required: true });
		return await runObsidianCommand({
			config,
			id
		});
	});
	registerResultMethod("wiki.obsidian.daily", WRITE_SCOPE, async (requestParams) => {
		const { config } = resolveRequestContext(requestParams);
		assertOfficialObsidianCliSupported(config);
		return await runObsidianDaily({ config });
	});
}
//#endregion
//#region extensions/memory-wiki/src/prompt-section.ts
const DIGEST_MAX_PAGES = 4;
const DIGEST_MAX_CLAIMS_PER_PAGE = 2;
const DIGEST_MAX_PAGE_TITLE_CHARS = 160;
const DIGEST_MAX_CLAIM_CHARS = 700;
const DIGEST_MAX_PROMPT_CHARS = 2800;
function rankPromptDigestPage(page) {
	return (page.contradictions?.length ?? 0) * 6 + (page.questions?.length ?? 0) * 4 + Math.min(page.claimCount ?? 0, 6) * 2 + Math.min(page.topClaims?.length ?? 0, 3);
}
function rankPromptClaimFreshness(level) {
	switch (level) {
		case "fresh": return 3;
		case "aging": return 2;
		case "stale": return 1;
		default: return 0;
	}
}
function sortPromptClaims(claims) {
	return [...claims].toSorted((left, right) => {
		const leftConfidence = typeof left.confidence === "number" ? left.confidence : -1;
		const rightConfidence = typeof right.confidence === "number" ? right.confidence : -1;
		if (leftConfidence !== rightConfidence) return rightConfidence - leftConfidence;
		const leftFreshness = rankPromptClaimFreshness(left.freshnessLevel);
		const rightFreshness = rankPromptClaimFreshness(right.freshnessLevel);
		if (leftFreshness !== rightFreshness) return rightFreshness - leftFreshness;
		return left.text.localeCompare(right.text);
	});
}
function formatPromptClaim(claim) {
	const qualifiers = [
		claim.status?.trim() ? `status ${claim.status.trim()}` : null,
		typeof claim.confidence === "number" ? `confidence ${claim.confidence.toFixed(2)}` : null,
		claim.freshnessLevel?.trim() ? `freshness ${claim.freshnessLevel.trim()}` : null
	].filter(Boolean);
	if (qualifiers.length === 0) return claim.text;
	return `${claim.text} (${qualifiers.join(", ")})`;
}
function buildDigestPromptSection(digest) {
	if (!digest?.pages?.length) return [];
	const selectedPages = [...digest.pages].filter((page) => (page.claimCount ?? 0) > 0 || (page.questions?.length ?? 0) > 0 || (page.contradictions?.length ?? 0) > 0).toSorted((left, right) => {
		const leftScore = rankPromptDigestPage(left);
		const rightScore = rankPromptDigestPage(right);
		if (leftScore !== rightScore) return rightScore - leftScore;
		return left.title.localeCompare(right.title);
	}).slice(0, DIGEST_MAX_PAGES);
	if (selectedPages.length === 0) return [];
	const lines = ["## Compiled Wiki Snapshot", `Compiled wiki currently tracks ${digest.claimCount ?? 0} claims across ${selectedPages.length} high-signal pages.`];
	lines.push(`Contradiction clusters: ${digest.contradictionCount}.`);
	for (const page of selectedPages) {
		const details = [
			page.kind,
			`${page.claimCount} claims`,
			(page.questions?.length ?? 0) > 0 ? `${page.questions?.length} open questions` : null,
			(page.contradictions?.length ?? 0) > 0 ? `${page.contradictions?.length} contradiction notes` : null
		].filter(Boolean);
		lines.push(`- ${truncateUtf16Safe(page.title, DIGEST_MAX_PAGE_TITLE_CHARS)}: ${details.join(", ")}`);
		for (const claim of sortPromptClaims(page.topClaims ?? []).slice(0, DIGEST_MAX_CLAIMS_PER_PAGE)) lines.push(`  - ${truncateUtf16Safe(formatPromptClaim(claim), DIGEST_MAX_CLAIM_CHARS)}`);
	}
	lines.push("");
	return truncateUtf16Safe(lines.join("\n"), DIGEST_MAX_PROMPT_CHARS).split("\n");
}
function buildWikiToolGuidance(availableTools) {
	const hasMemorySearch = availableTools.has("memory_search");
	const hasMemoryGet = availableTools.has("memory_get");
	const hasWikiSearch = availableTools.has("wiki_search");
	const hasWikiGet = availableTools.has("wiki_get");
	const hasWikiApply = availableTools.has("wiki_apply");
	const hasWikiLint = availableTools.has("wiki_lint");
	if (!hasMemorySearch && !hasMemoryGet && !hasWikiSearch && !hasWikiGet && !hasWikiApply && !hasWikiLint) return [];
	const lines = ["## Compiled Wiki", "Use the wiki when the answer depends on accumulated project knowledge, prior syntheses, entity pages, or source-backed notes that should survive beyond one conversation."];
	if (hasMemorySearch) lines.push("Prefer `memory_search` with `corpus=all` for one recall pass across durable memory and the compiled wiki when both are relevant.");
	if (hasMemoryGet) lines.push("Use `memory_get` with `corpus=wiki` or `corpus=all` when you already know the page path and want a small excerpt without leaving the shared memory tool flow.");
	if (hasWikiSearch && hasWikiGet) lines.push("Workflow: `wiki_search` first, then `wiki_get` for the exact page or imported memory file you need. Use this when you want wiki-specific ranking or provenance details instead of the broader shared memory flow.");
	else if (hasWikiSearch) lines.push("Use `wiki_search` before answering from stored knowledge when you want wiki-specific ranking or provenance details.");
	else if (hasWikiGet) lines.push("Use `wiki_get` to inspect specific wiki pages or imported memory files by path/id.");
	if (hasWikiApply) lines.push("Use `wiki_apply` for narrow synthesis filing and metadata repair instead of rewriting managed markdown blocks by hand.");
	if (hasWikiLint) lines.push("After meaningful wiki updates, run `wiki_lint` before trusting the vault.");
	lines.push("");
	return lines;
}
function createWikiPromptSectionBuilder() {
	return ({ availableTools }) => buildWikiToolGuidance(availableTools);
}
function createWikiPromptSectionPreparer(params) {
	return async ({ agentId }) => {
		if (params.config.vault.scope === "agent" && !agentId) return [];
		const config = params.resolveConfig(agentId);
		if (!config.context.includeCompiledDigestPrompt) return [];
		return buildDigestPromptSection((await loadMemoryWikiCompiledCache(config))?.digest);
	};
}
//#endregion
//#region extensions/memory-wiki/src/tool.ts
function formatWikiToolReportPath(config, reportPath) {
	const vaultRoot = path.resolve(config.vault.path);
	const resolvedReportPath = path.resolve(reportPath);
	const relativeReportPath = path.relative(vaultRoot, resolvedReportPath);
	if (!relativeReportPath || relativeReportPath.startsWith("..") || path.isAbsolute(relativeReportPath)) return reportPath;
	return relativeReportPath.replace(/\\/g, "/");
}
const WikiStatusSchema = Type.Object({}, { additionalProperties: false });
const WikiLintSchema = Type.Object({}, { additionalProperties: false });
const WikiSearchBackendSchema = Type.Union(WIKI_SEARCH_BACKENDS.map((value) => Type.Literal(value)));
const WikiSearchCorpusSchema = Type.Union(WIKI_SEARCH_CORPORA.map((value) => Type.Literal(value)));
const WikiSearchModeSchema = Type.Union(WIKI_SEARCH_MODES.map((value) => Type.Literal(value)));
const WikiSearchSchema = Type.Object({
	query: Type.String({ minLength: 1 }),
	maxResults: Type.Optional(Type.Integer({ minimum: 1 })),
	backend: Type.Optional(WikiSearchBackendSchema),
	corpus: Type.Optional(WikiSearchCorpusSchema),
	mode: Type.Optional(WikiSearchModeSchema)
}, { additionalProperties: false });
const WikiGetSchema = Type.Object({
	lookup: Type.String({ minLength: 1 }),
	fromLine: Type.Optional(Type.Integer({ minimum: 1 })),
	lineCount: Type.Optional(Type.Integer({ minimum: 1 })),
	backend: Type.Optional(WikiSearchBackendSchema),
	corpus: Type.Optional(WikiSearchCorpusSchema)
}, { additionalProperties: false });
const WikiClaimEvidenceSchema = Type.Object({
	kind: Type.Optional(Type.String({ minLength: 1 })),
	sourceId: Type.Optional(Type.String({ minLength: 1 })),
	path: Type.Optional(Type.String({ minLength: 1 })),
	lines: Type.Optional(Type.String({ minLength: 1 })),
	weight: optionalFiniteNumberSchema({ minimum: 0 }),
	note: Type.Optional(Type.String({ minLength: 1 })),
	confidence: optionalFiniteNumberSchema({
		minimum: 0,
		maximum: 1
	}),
	privacyTier: Type.Optional(Type.String({ minLength: 1 })),
	updatedAt: Type.Optional(Type.String({ minLength: 1 }))
}, { additionalProperties: false });
const WikiClaimSchema = Type.Object({
	id: Type.Optional(Type.String({ minLength: 1 })),
	text: Type.String({ minLength: 1 }),
	status: Type.Optional(Type.String({ minLength: 1 })),
	confidence: optionalFiniteNumberSchema({
		minimum: 0,
		maximum: 1
	}),
	evidence: Type.Optional(Type.Array(WikiClaimEvidenceSchema)),
	updatedAt: Type.Optional(Type.String({ minLength: 1 }))
}, { additionalProperties: false });
const WikiApplySchema = Type.Object({
	op: Type.Union([
		Type.Literal("create_synthesis"),
		Type.Literal("update_metadata"),
		Type.Literal("synthesis"),
		Type.Literal("metadata")
	]),
	title: Type.Optional(Type.String({ minLength: 1 })),
	body: Type.Optional(Type.String({ minLength: 1 })),
	lookup: Type.Optional(Type.String({ minLength: 1 })),
	sourceIds: Type.Optional(Type.Array(Type.String({ minLength: 1 }))),
	claims: Type.Optional(Type.Array(WikiClaimSchema)),
	contradictions: Type.Optional(Type.Array(Type.String({ minLength: 1 }))),
	questions: Type.Optional(Type.Array(Type.String({ minLength: 1 }))),
	confidence: Type.Optional(Type.Union([Type.Number({
		minimum: 0,
		maximum: 1
	}), Type.Null()])),
	status: Type.Optional(Type.String({ minLength: 1 }))
}, { additionalProperties: false });
async function syncImportedSourcesIfNeeded(config, appConfig, signal) {
	await syncMemoryWikiImportedSources({
		config,
		appConfig,
		...signal ? { signal } : {}
	});
}
function createWikiStatusTool(config, appConfig, memoryContext = {}) {
	return {
		name: "wiki_status",
		label: "Wiki Status",
		description: "Inspect the current memory wiki vault mode, health, and Obsidian CLI availability.",
		parameters: WikiStatusSchema,
		execute: async () => {
			await syncImportedSourcesIfNeeded(config, appConfig, memoryContext.signal);
			const status = await resolveMemoryWikiStatus(config, {
				appConfig,
				callerAgentId: memoryContext.agentId
			});
			return textResult(renderMemoryWikiStatus(status), status);
		}
	};
}
function createWikiSearchTool(config, appConfig, memoryContext = {}) {
	return {
		name: "wiki_search",
		label: "Wiki Search",
		description: "Search wiki pages and, when shared search is enabled, the active memory corpus by title, path, id, or body text.",
		parameters: WikiSearchSchema,
		execute: async (_toolCallId, rawParams) => {
			const params = rawParams;
			await syncImportedSourcesIfNeeded(config, appConfig, memoryContext.signal);
			const results = await searchMemoryWiki({
				config,
				appConfig,
				agentId: memoryContext.agentId,
				agentSessionKey: memoryContext.agentSessionKey,
				sandboxed: memoryContext.sandboxed,
				conversationRecall: memoryContext.conversationRecall,
				query: params.query,
				maxResults: params.maxResults,
				...params.backend ? { searchBackend: params.backend } : {},
				...params.corpus ? { searchCorpus: params.corpus } : {},
				...params.mode ? { mode: params.mode } : {}
			});
			return textResult(renderWikiSearchResults(results), { results });
		}
	};
}
function createWikiLintTool(config, appConfig, signal) {
	return {
		name: "wiki_lint",
		label: "Wiki Lint",
		description: "Lint the wiki vault and surface structural issues, provenance gaps, contradictions, and open questions.",
		parameters: WikiLintSchema,
		execute: async () => {
			await syncImportedSourcesIfNeeded(config, appConfig, signal);
			const result = await lintMemoryWikiVault(config, signal ? { signal } : void 0);
			const contradictions = result.issuesByCategory.contradictions.length;
			const openQuestions = result.issuesByCategory["open-questions"].length;
			const provenance = result.issuesByCategory.provenance.length;
			const errors = result.issues.filter((issue) => issue.severity === "error").length;
			const warnings = result.issues.filter((issue) => issue.severity === "warning").length;
			const reportPath = formatWikiToolReportPath(config, result.reportPath);
			const summary = result.issueCount === 0 ? "No wiki lint issues." : [
				`Issues: ${result.issueCount} total (${errors} errors, ${warnings} warnings)`,
				`Contradictions: ${contradictions}`,
				`Open questions: ${openQuestions}`,
				`Provenance gaps: ${provenance}`,
				`Report: ${reportPath}`
			].join("\n");
			return textResult(summary, {
				issueCount: result.issueCount,
				issues: result.issues,
				issuesByCategory: result.issuesByCategory,
				reportPath
			});
		}
	};
}
function createWikiApplyTool(config, appConfig, signal) {
	return {
		name: "wiki_apply",
		label: "Wiki Apply",
		description: "Apply narrow wiki mutations for syntheses and page metadata without freeform markdown surgery.",
		parameters: WikiApplySchema,
		execute: async (_toolCallId, rawParams) => {
			const mutation = normalizeMemoryWikiMutationInput(rawParams);
			await syncImportedSourcesIfNeeded(config, appConfig, signal);
			const result = await applyMemoryWikiMutation({
				config,
				mutation,
				...signal ? { signal } : {}
			});
			return textResult(renderWikiMutationSummary(result), result);
		}
	};
}
function createWikiGetTool(config, appConfig, memoryContext = {}) {
	return {
		name: "wiki_get",
		label: "Wiki Get",
		description: "Read a wiki page by id or relative path, or fall back to the active memory corpus when shared search is enabled.",
		parameters: WikiGetSchema,
		execute: async (_toolCallId, rawParams) => {
			const params = asNonArrayRecord(rawParams);
			const lookup = typeof params.lookup === "string" ? params.lookup.trim() : "";
			if (!lookup) return textResult("wiki_get requires a non-empty `lookup` path or id.", { found: false });
			await syncImportedSourcesIfNeeded(config, appConfig, memoryContext.signal);
			const result = await getMemoryWikiPage({
				config,
				appConfig,
				agentId: memoryContext.agentId,
				agentSessionKey: memoryContext.agentSessionKey,
				sandboxed: memoryContext.sandboxed,
				conversationRecall: memoryContext.conversationRecall,
				lookup,
				fromLine: params.fromLine,
				lineCount: params.lineCount,
				...params.backend ? { searchBackend: params.backend } : {},
				...params.corpus ? { searchCorpus: params.corpus } : {}
			});
			if (!result) return textResult(`Wiki page not found: ${lookup}`, { found: false });
			return textResult(result.content, {
				found: true,
				...result
			});
		}
	};
}
//#endregion
//#region extensions/memory-wiki/index.ts
async function loadConfiguredVaultIdentity(vaultRoot) {
	const identity = await loadMemoryWikiValidatedVaultIdentity(vaultRoot);
	if (identity.vaultGeneration) return {
		vaultGeneration: identity.vaultGeneration,
		compiledCachePublicationId: identity.compiledCachePublicationId
	};
	try {
		if (!(await fs.stat(path.join(vaultRoot, ".openclaw-wiki", "log.jsonl"))).isFile()) return null;
	} catch (error) {
		if (error instanceof Error && "code" in error && error.code === "ENOENT") return null;
		throw error;
	}
	return {
		vaultGeneration: await ensureMemoryWikiVaultGeneration(vaultRoot),
		compiledCachePublicationId: null
	};
}
var memory_wiki_default = definePluginEntry({
	id: "memory-wiki",
	name: "Memory Wiki",
	description: "Persistent wiki compiler and Obsidian-friendly knowledge vault for OpenClaw.",
	configSchema: memoryWikiConfigSchema,
	register(api) {
		const config = resolveMemoryWikiConfig(api.pluginConfig);
		const getAppConfig = () => api.runtime.config?.current?.() ?? api.config;
		const resolveConfig = (agentId, appConfig = getAppConfig()) => resolveMemoryWikiAgentConfig({
			config,
			appConfig,
			agentId
		});
		const resolveToolContext = (agentId) => {
			const appConfig = getAppConfig();
			if (config.vault.scope === "agent" && !agentId && resolveMemoryWikiConfiguredAgentIds(appConfig).length > 1) return null;
			return {
				appConfig,
				config: resolveConfig(agentId, appConfig),
				...sourceSyncAbortController ? { signal: sourceSyncAbortController.signal } : {}
			};
		};
		configureMemoryWikiSourceSyncStateStore(createMemoryWikiSourceSyncStateStore(api.runtime.state.openKeyedStore));
		configureMemoryWikiImportRunStateStore(createMemoryWikiImportRunStateStore(api.runtime.state.openKeyedStore));
		const compiledCacheStore = createMemoryWikiCompiledCacheStore(api.runtime.state.openBlobStore, { onReadError(error) {
			api.logger.warn(`memory-wiki: compiled cache unavailable: ${String(error)}`);
		} });
		configureMemoryWikiCompiledCacheStore(compiledCacheStore);
		let sourceSyncAbortController;
		api.registerService({
			id: "memory-wiki-compiled-cache-owner-cleanup",
			async start() {
				sourceSyncAbortController?.abort();
				const abortController = new AbortController();
				sourceSyncAbortController = abortController;
				try {
					const appConfig = getAppConfig();
					const activeConfigs = config.vault.scope === "global" ? [resolveConfig(void 0, appConfig)] : resolveMemoryWikiConfiguredAgentIds(appConfig).map((agentId) => resolveConfig(agentId, appConfig));
					deactivateMemoryWikiCompiledCacheOwnersExcept(/* @__PURE__ */ new Set());
					const preparedOwners = [];
					for (const activeConfig of activeConfigs) {
						const identity = await loadConfiguredVaultIdentity(activeConfig.vault.path);
						if (identity) preparedOwners.push({
							config: activeConfig,
							identity
						});
					}
					const activeOwnerIds = /* @__PURE__ */ new Set();
					for (const { config: activeConfig, identity } of preparedOwners) {
						activateMemoryWikiCompiledCacheOwner(activeConfig, identity.vaultGeneration, identity.compiledCachePublicationId);
						await reconcileMemoryWikiCompiledCacheOwner(activeConfig, () => loadMemoryWikiValidatedVaultIdentity(activeConfig.vault.path));
						activeOwnerIds.add(resolveMemoryWikiCompiledCacheOwnerId(activeConfig));
					}
					deactivateMemoryWikiCompiledCacheOwnersExcept(activeOwnerIds);
					await compiledCacheStore.deleteOwnersExcept(activeOwnerIds);
				} catch (error) {
					abortController.abort();
					if (sourceSyncAbortController === abortController) sourceSyncAbortController = void 0;
					deactivateMemoryWikiCompiledCacheOwnersExcept(/* @__PURE__ */ new Set());
					throw error;
				}
			},
			async stop() {
				sourceSyncAbortController?.abort();
				sourceSyncAbortController = void 0;
				deactivateMemoryWikiCompiledCacheOwnersExcept(/* @__PURE__ */ new Set());
				await waitForMemoryWikiImportedSourceSyncs();
				deactivateMemoryWikiCompiledCacheOwnersExcept(/* @__PURE__ */ new Set());
			}
		});
		api.registerMemoryPromptSupplement(createWikiPromptSectionBuilder());
		api.registerMemoryPromptPreparation(createWikiPromptSectionPreparer({
			config,
			resolveConfig
		}));
		api.registerMemoryCorpusSupplement(createWikiCorpusSupplement({
			resolveConfig,
			getAppConfig
		}));
		registerMemoryWikiGatewayMethods({
			api,
			config,
			appConfig: api.config,
			getAppConfig,
			resolveConfig,
			resolveSourceSyncSignal: () => sourceSyncAbortController?.signal
		});
		api.registerTool((ctx) => {
			const resolved = resolveToolContext(ctx.agentId);
			return resolved ? createWikiStatusTool(resolved.config, resolved.appConfig, {
				agentId: resolved.config.agentId ?? ctx.agentId,
				...resolved.signal ? { signal: resolved.signal } : {}
			}) : null;
		}, { name: "wiki_status" });
		for (const [name, createTool] of [["wiki_lint", createWikiLintTool], ["wiki_apply", createWikiApplyTool]]) api.registerTool((ctx) => {
			const resolved = resolveToolContext(ctx.agentId);
			return resolved ? createTool(resolved.config, resolved.appConfig, resolved.signal) : null;
		}, { name });
		for (const [name, createTool] of [["wiki_search", createWikiSearchTool], ["wiki_get", createWikiGetTool]]) api.registerTool((ctx) => {
			const resolved = resolveToolContext(ctx.agentId);
			if (!resolved) return null;
			return createTool(resolved.config, resolved.appConfig, {
				agentId: resolved.config.agentId ?? ctx.agentId,
				agentSessionKey: ctx.sessionKey,
				sandboxed: ctx.sandboxed,
				conversationRecall: ctx.conversationRecall,
				...resolved.signal ? { signal: resolved.signal } : {}
			});
		}, { name });
		api.registerCli(async ({ program }) => {
			const { registerWikiCli } = await import("../../cli-CIYuJ5pI.mjs");
			registerWikiCli(program, {
				config,
				resolveConfig,
				getAppConfig
			});
		}, { descriptors: [{
			name: "wiki",
			description: "Inspect and initialize the memory wiki vault",
			hasSubcommands: true
		}] });
	}
});
//#endregion
export { memory_wiki_default as default };
