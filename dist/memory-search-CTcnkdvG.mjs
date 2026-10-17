import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { g as resolveDefaultAgentId, t as AgentSelectionRequiredError } from "./agent-scope-config-CDYpzA0r.mjs";
import "./session-key-C09ow4h0.mjs";
import { i as listAgentIds } from "./agent-roster-BXD1uMJD.mjs";
import "./agent-scope-CG17uXFn.mjs";
import { n as loadBundledPluginPublicArtifactModuleSync } from "./public-surface-loader-BzW1QYAL.mjs";
import { t as ErrorCodes } from "./gateway-error-details-DIefe7Zy.mjs";
import { f as errorShape } from "./error-codes-Dh56LniQ.mjs";
import { s as resolveMemorySearchStaleness } from "./types-DTVBdCzw.mjs";
import { l as resolveActiveMemoryBackendConfig, o as getActiveMemorySearchManagerCore, s as isActiveMemoryProviderNative } from "./memory-runtime-B776pEel.mjs";
//#region src/gateway/server-methods/memory-search.ts
const DEFAULT_MAX_RESULTS = 20;
const MAX_RESULTS = 50;
function resolveSearchMode(status) {
	const statusMode = status.custom?.searchMode;
	if (statusMode === "hybrid" || statusMode === "fts-only") return statusMode;
	return status.provider === "none" || status.vector?.enabled === false ? "fts-only" : "hybrid";
}
function resolveSearchOptions(params) {
	const rawMaxResults = params.maxResults;
	if (rawMaxResults !== void 0 && (typeof rawMaxResults !== "number" || !Number.isFinite(rawMaxResults))) return null;
	const maxResults = Math.min(MAX_RESULTS, Math.max(1, Math.floor(rawMaxResults ?? DEFAULT_MAX_RESULTS)));
	const rawMinScore = params.minScore;
	if (rawMinScore !== void 0 && (typeof rawMinScore !== "number" || !Number.isFinite(rawMinScore))) return null;
	return {
		maxResults,
		...rawMinScore === void 0 ? {} : { minScore: rawMinScore }
	};
}
function hasUsableAgentIdInput(value) {
	return normalizeAgentId(`${value}a`) !== "a";
}
/** Operator-scoped search over the active agent memory index. */
const memorySearchHandlers = {
	"memory.get": async (options) => {
		const { memoryProviderHandlers } = await import("./memory-provider-CJ2C_X4U.mjs");
		await memoryProviderHandlers["memory.get"](options);
	},
	"memory.status": async (options) => {
		const { memoryProviderHandlers } = await import("./memory-provider-CJ2C_X4U.mjs");
		await memoryProviderHandlers["memory.status"](options);
	},
	"memory.search": async (options) => {
		const { params, respond, context } = options;
		if (params?.version === 2) {
			const { memoryProviderHandlers } = await import("./memory-provider-CJ2C_X4U.mjs");
			await memoryProviderHandlers["memory.search"](options);
			return;
		}
		if (params?.version !== void 0 && params.version !== 1) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "unsupported memory version"));
			return;
		}
		const record = params && typeof params === "object" ? params : {};
		const query = typeof record.query === "string" ? record.query.trim() : "";
		if (!query) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "query must be a non-empty string"));
			return;
		}
		const searchOptions = resolveSearchOptions(record);
		if (!searchOptions) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "maxResults and minScore must be finite numbers when provided"));
			return;
		}
		const cfg = context.getRuntimeConfig();
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
				purpose: "cli"
			});
		} catch (error) {
			respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, `memory search unavailable: ${formatErrorMessage(error)}`));
			return;
		}
		const { manager, error: acquireError } = acquired;
		if (!manager) {
			respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, acquireError ?? "memory search unavailable"));
			return;
		}
		let readRebuildWarning = () => void 0;
		try {
			const { captureMemoryRebuildNotice } = loadBundledPluginPublicArtifactModuleSync({
				dirName: "memory-core",
				artifactBasename: "search-api.js"
			});
			readRebuildWarning = captureMemoryRebuildNotice(manager.status());
			const results = await manager.search(query, searchOptions);
			const status = manager.status();
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
			await manager.close?.().catch(() => {});
		}
	}
};
//#endregion
export { memorySearchHandlers };
