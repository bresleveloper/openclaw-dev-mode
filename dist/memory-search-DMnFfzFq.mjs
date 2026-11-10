import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { u as normalizePluginsConfig } from "./config-state-DkDfCu7E.mjs";
import "./session-key-CSDERtm3.mjs";
import { _ as resolveDefaultAgentId, t as AgentSelectionRequiredError } from "./agent-scope-config-fjA2T9Gz.mjs";
import { i as listAgentIds } from "./agent-roster-gkYP38su.mjs";
import { Ng as errorShape } from "./src-pLJQA6J5.mjs";
import "./agent-scope-DXrnO3F4.mjs";
import { n as loadBundledPluginPublicArtifactModuleSync } from "./public-surface-loader-Dmwzhxit.mjs";
import { t as ErrorCodes } from "./gateway-error-details-Cl-eEOTQ.mjs";
import { i as readMemorySearchManagerStatus, s as resolveMemorySearchStaleness } from "./types-CGuNDIwt.mjs";
import { l as resolveActiveMemoryBackendConfig, o as getActiveMemorySearchManagerCore, s as isActiveMemoryProviderNative } from "./memory-runtime-CXcwwGi2.mjs";
import { n as localStateOwnerChangedError, r as runWithLocalStateMutationOwner } from "./local-state-owner-Ces8bTrZ.mjs";
//#region src/gateway/server-methods/memory-search.ts
const DEFAULT_MAX_RESULTS = 20;
const MAX_RESULTS = 50;
function resolveSearchMode(status) {
	const statusMode = status.custom?.searchMode;
	if (statusMode === "hybrid" || statusMode === "fts-only") return statusMode;
	return status.provider === "none" || status.vector?.enabled === false ? "fts-only" : "hybrid";
}
function resolveSearchOptions(params, cli = false) {
	const rawMaxResults = params.maxResults;
	if (rawMaxResults !== void 0 && (typeof rawMaxResults !== "number" || !Number.isFinite(rawMaxResults))) return null;
	if (cli && rawMaxResults !== void 0 && (!Number.isInteger(rawMaxResults) || rawMaxResults < 1)) return null;
	const maxResults = Math.min(MAX_RESULTS, Math.max(1, Math.floor(rawMaxResults ?? DEFAULT_MAX_RESULTS)));
	const rawMinScore = params.minScore;
	if (rawMinScore !== void 0 && (typeof rawMinScore !== "number" || !Number.isFinite(rawMinScore))) return null;
	return {
		...cli ? rawMaxResults === void 0 ? {} : { maxResults: rawMaxResults } : { maxResults },
		...rawMinScore === void 0 ? {} : { minScore: rawMinScore }
	};
}
function hasUsableAgentIdInput(value) {
	return normalizeAgentId(`${value}a`) !== "a";
}
async function searchMemory(options, assertCurrent) {
	const { params, respond, context } = options;
	if (!assertCurrent && params?.version === 2) {
		const { memoryProviderHandlers } = await import("./memory-provider-JAwQO3JC.mjs");
		await memoryProviderHandlers["memory.search"](options);
		return;
	}
	if (params?.version !== void 0 && params.version !== 1) {
		respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "unsupported memory version"));
		return;
	}
	const record = params && typeof params === "object" ? params : {};
	const query = typeof record.query === "string" ? record.query : "";
	const searchQuery = assertCurrent ? query : query.trim();
	if (!query.trim()) {
		respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "query must be a non-empty string"));
		return;
	}
	const searchOptions = resolveSearchOptions(record, Boolean(assertCurrent));
	if (!searchOptions) {
		respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, assertCurrent ? "maxResults must be a positive integer and minScore a finite number when provided" : "maxResults and minScore must be finite numbers when provided"));
		return;
	}
	const cfg = context.getRuntimeConfig();
	if (assertCurrent) {
		if (normalizePluginsConfig(cfg.plugins).slots.memory !== "memory-core") {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `Memory Core search is unavailable for the selected memory slot. Use the selected plugin's memory tools.`));
			return;
		}
	}
	const hasAgentId = Object.hasOwn(record, "agentId");
	if (hasAgentId && typeof record.agentId !== "string") {
		respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "agentId must be a string"));
		return;
	}
	if (hasAgentId && !hasUsableAgentIdInput(record.agentId)) {
		respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "unknown agentId"));
		return;
	}
	const requestedAgentId = hasAgentId ? normalizeAgentId(record.agentId) : null;
	if (requestedAgentId !== null && !listAgentIds(cfg).includes(requestedAgentId)) {
		respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "unknown agentId"));
		return;
	}
	let agentId = requestedAgentId;
	if (!agentId) try {
		agentId = resolveDefaultAgentId(cfg, {
			surface: "memory search",
			hint: "Pass agentId to select a configured agent."
		});
	} catch (error) {
		if (!(error instanceof AgentSelectionRequiredError)) throw error;
		respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, error.message));
		return;
	}
	const backend = isActiveMemoryProviderNative({
		cfg,
		agentId
	}) ? resolveActiveMemoryBackendConfig({
		cfg,
		agentId
	}) : null;
	if (backend?.backend === "provider-runtime") {
		respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `memory plugin "${backend.providerId}" uses the provider runtime; retry memory.search with version: 2`));
		return;
	}
	let acquired;
	try {
		acquired = await getActiveMemorySearchManagerCore({
			cfg,
			agentId,
			purpose: "cli",
			...assertCurrent ? { inspectSources: true } : {}
		});
	} catch (error) {
		respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, `memory search unavailable: ${formatErrorMessage(error)}`));
		return;
	}
	const { manager, error: acquireError } = acquired;
	if (!manager) {
		if (assertCurrent) {
			assertCurrent();
			respond(true, acquireError?.trim() ? {
				agentId,
				status: "failed",
				error: acquireError
			} : {
				agentId,
				status: "disabled"
			}, void 0);
			return;
		}
		respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, acquireError ?? "memory search unavailable"));
		return;
	}
	let readRebuildWarning = () => void 0;
	try {
		if (assertCurrent) {
			assertCurrent();
			if (!acquired.searchForCli) throw new Error("The memory runtime does not support CLI search.");
			const payload = await acquired.searchForCli({
				manager,
				cfg,
				agentId,
				query: searchQuery,
				...searchOptions,
				assertCurrent
			});
			assertCurrent();
			respond(true, payload, void 0);
			return;
		}
		const { captureMemoryRebuildNotice } = loadBundledPluginPublicArtifactModuleSync({
			dirName: "memory-core",
			artifactBasename: "search-api.js"
		});
		readRebuildWarning = captureMemoryRebuildNotice(await readMemorySearchManagerStatus(manager));
		const results = await manager.search(searchQuery, searchOptions);
		const status = await readMemorySearchManagerStatus(manager);
		const staleness = resolveMemorySearchStaleness(status, agentId);
		const warning = [staleness?.warning, readRebuildWarning()].filter((message) => typeof message === "string").join(" ");
		respond(true, {
			agentId,
			provider: status.provider,
			searchMode: resolveSearchMode(status),
			results,
			...staleness,
			...warning ? { warning } : {}
		}, void 0);
	} catch (error) {
		respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, [`memory search failed: ${formatErrorMessage(error)}`, readRebuildWarning()].filter(Boolean).join(" ")));
	} finally {
		if (assertCurrent) await manager.close?.();
		else await manager.close?.().catch(() => {});
	}
}
/** Operator-scoped search over the active agent memory index. */
const memorySearchHandlers = {
	"memory.get": async (options) => {
		const { memoryProviderHandlers } = await import("./memory-provider-JAwQO3JC.mjs");
		await memoryProviderHandlers["memory.get"](options);
	},
	"memory.status": async (options) => {
		const { memoryProviderHandlers } = await import("./memory-provider-JAwQO3JC.mjs");
		await memoryProviderHandlers["memory.status"](options);
	},
	"memory.search": (options) => searchMemory(options),
	"memory.search.owner": async (options) => {
		const expectedOwnerId = options.params?.expectedOwnerId;
		if (typeof expectedOwnerId !== "string" || !expectedOwnerId.trim()) {
			options.respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "expectedOwnerId is required"));
			return;
		}
		let domainEntered = false;
		try {
			let response;
			(await runWithLocalStateMutationOwner(expectedOwnerId, options, async (assertCurrent) => {
				domainEntered = true;
				await searchMemory({
					...options,
					respond: (...args) => {
						response = args;
					}
				}, assertCurrent);
				return assertCurrent;
			}))();
			if (response) options.respond(...response);
		} catch (error) {
			options.respond(false, void 0, domainEntered ? errorShape(ErrorCodes.UNAVAILABLE, formatErrorMessage(error)) : localStateOwnerChangedError(error));
		}
	}
};
//#endregion
export { memorySearchHandlers };
