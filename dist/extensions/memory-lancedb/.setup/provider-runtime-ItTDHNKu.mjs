import { t as MemoryRecallEmbeddingError } from "./embeddings-CA5O6Qvd.mjs";
import { l as normalizeRecallQuery, n as cleanMemorySearchResults } from "./memory-policy-CuH1eGcw.mjs";
import { t as startMemoryRecall } from "./recall-service-k18mFCeT.mjs";
import { formatErrorMessage } from "openclaw/plugin-sdk/error-runtime";
import { normalizeAgentId } from "openclaw/plugin-sdk/routing";
import { truncateUtf16Safe } from "openclaw/plugin-sdk/text-utility-runtime";
// extensions/memory-lancedb/provider-runtime.ts
const PROVIDER_SEARCH_TIMEOUT_MS = 15e3;
const DEFAULT_PROVIDER_SEARCH_RESULTS = 5;
const MAX_PROVIDER_SEARCH_RESULTS = 50;
const PROVIDER_SEARCH_OVERFETCH_EXTRA = 10;
const DEFAULT_PROVIDER_MIN_SCORE = .1;
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
/** Records the latest embedding outcome per agent so health never spends a provider call. */
function createEmbeddingHealthTracker(inner) {
	const failures = /* @__PURE__ */ new Map();
	return {
		embeddings: {
			...inner,
			async embed(agentId, text, embeddingConfig, timeoutMs) {
				try {
					const vector = await inner.embed(agentId, text, embeddingConfig, timeoutMs);
					failures.delete(agentId);
					return vector;
				} catch (error) {
					failures.set(agentId, { atMs: Date.now() });
					throw error;
				}
			}
		},
		lastFailure: (agentId) => failures.get(agentId)
	};
}
/**
* Stored memories belong to the agent owner. Operators act for the opened agent; a session
* reads them only under a host-minted owner-private audience for that same agent.
*/
function resolveReadDenial(authority, agentId) {
	if (authority.kind === "operator") return;
	if (authority.kind === "host") return "host operations cannot read stored memories";
	const audience = authority.audience;
	if (audience?.kind !== "owner-private") return "this session has no owner-private memory audience";
	if (normalizeAgentId(audience.agentId) !== agentId) return "the memory audience belongs to another agent";
}
function sliceLines(text, from, lines) {
	const all = text.split("\n");
	const start = Math.max(1, Math.floor(from ?? 1));
	const count = lines === void 0 ? all.length : Math.max(1, Math.floor(lines));
	const selected = all.slice(start - 1, start - 1 + count);
	const end = start - 1 + selected.length;
	const truncated = end < all.length;
	return {
		text: selected.join("\n"),
		from: start,
		lines: selected.length,
		truncated,
		...truncated ? { nextFrom: end + 1 } : {}
	};
}
/** Neutral host read access to the plugin's own store; its tools and hooks keep their paths. */
function createLanceDbMemoryProviderRuntime(deps) {
	return { async open(params) {
		const agentId = deps.resolveEnabledAgentId(params.agentId);
		if (!agentId) return {
			provider: null,
			error: "Memory is disabled for this agent."
		};
		const { context } = params;
		const readDenial = resolveReadDenial(context.authority, agentId);
		const assertCurrent = () => {
			context.assertCurrent();
			context.signal?.throwIfAborted();
			if (!deps.resolveEnabledAgentId(agentId)) throw new Error("Memory is disabled for this agent.");
		};
		const assertReadAllowed = () => {
			if (readDenial) throw new Error(`memory-lancedb: memory access denied: ${readDenial}`);
			assertCurrent();
		};
		const reference = (id) => ({
			providerId: deps.providerId,
			id
		});
		return { provider: {
			capabilities: {
				sources: ["memory"],
				pagination: false,
				candidates: [],
				projectFilter: false
			},
			async search(request) {
				if (readDenial) {
					assertCurrent();
					return {
						hits: [],
						warning: `memory-lancedb: stored memories were not searched: ${readDenial}`
					};
				}
				assertCurrent();
				const query = request.query.trim();
				if (!query) return {
					hits: [],
					coverage: "complete"
				};
				const cooldown = deps.readRecallCooldown(agentId);
				if (cooldown) throw new Error(`memory-lancedb: memory search is unavailable: ${cooldown.error}`);
				const currentCfg = deps.resolveCurrentConfig();
				const recallMaxChars = currentCfg.recallMaxChars;
				const maxResults = Math.min(MAX_PROVIDER_SEARCH_RESULTS, Math.max(1, Math.floor(request.maxResults ?? DEFAULT_PROVIDER_SEARCH_RESULTS)));
				const minScore = request.minScore ?? DEFAULT_PROVIDER_MIN_SCORE;
				const recallOperation = startMemoryRecall({
					timeoutMs: PROVIDER_SEARCH_TIMEOUT_MS,
					embed: (timeoutMs) => deps.embeddings.embed(agentId, normalizeRecallQuery(query, recallMaxChars), currentCfg.embedding, timeoutMs()),
					beforeSearch: assertReadAllowed,
					search: (vector, timeoutMs) => deps.db.search(agentId, vector, maxResults + PROVIDER_SEARCH_OVERFETCH_EXTRA, minScore, {
						timeoutMs,
						beforeRead: assertReadAllowed
					})
				});
				let recall;
				try {
					recall = await recallOperation.result;
				} catch (error) {
					if (!(error instanceof MemoryRecallEmbeddingError)) throw error;
					const message = formatErrorMessage(error.originalError);
					deps.logger.warn?.(`memory-lancedb: memory search embedding failed: ${message}`);
					if (deps.isRecallTimeoutError(error.originalError)) deps.recordRecallCooldown(agentId, message);
					throw new Error(`memory-lancedb: memory search embedding failed: ${message}`, { cause: error });
				}
				if (recall.status === "timeout") {
					const message = `memory search timed out after ${Math.round(PROVIDER_SEARCH_TIMEOUT_MS / 1e3)}s`;
					if (recallOperation.phase === "embedding") deps.recordRecallCooldown(agentId, message);
					throw new Error(`memory-lancedb: ${message}`);
				}
				assertCurrent();
				return {
					hits: cleanMemorySearchResults(recall.value).slice(0, maxResults).map(({ entry, score }) => {
						const ref = reference(entry.id);
						return {
							reference: ref,
							excerpt: truncateUtf16Safe(entry.text, recallMaxChars),
							score,
							source: "memory",
							citations: [{
								label: `memory-lancedb:${entry.id}`,
								reference: ref
							}]
						};
					}),
					coverage: "complete"
				};
			},
			async get(request) {
				assertReadAllowed();
				const { id, revision } = request.reference;
				if (revision !== void 0 || !UUID_PATTERN.test(id)) return { status: "not_found" };
				const rows = await deps.db.query(agentId, {
					columns: ["id", "text"],
					filter: {
						column: "id",
						operator: "=",
						value: id
					},
					limit: 1,
					beforeRead: assertReadAllowed
				});
				assertCurrent();
				const text = rows[0]?.text;
				if (typeof text !== "string") return { status: "not_found" };
				const ref = reference(id);
				return {
					status: "ok",
					reference: ref,
					citations: [{
						label: `memory-lancedb:${id}`,
						reference: ref
					}],
					...sliceLines(text, request.from, request.lines)
				};
			},
			async health() {
				assertCurrent();
				const { embedding, autoCapture, autoRecall } = deps.resolveCurrentConfig();
				const details = {
					backend: "lancedb",
					embedding: {
						provider: embedding.provider,
						model: embedding.model,
						...embedding.dimensions === void 0 ? {} : { dimensions: embedding.dimensions }
					},
					autoCapture,
					autoRecall
				};
				let memories;
				try {
					memories = await deps.countMemories(agentId);
				} catch (error) {
					assertCurrent();
					deps.logger.warn?.(`memory-lancedb: health could not read the memory store: ${formatErrorMessage(error)}`);
					return {
						status: "unavailable",
						message: "The LanceDB memory store could not be read. Check the Gateway log.",
						details
					};
				}
				assertCurrent();
				if (!readDenial) details.memories = memories;
				const cooldown = deps.readRecallCooldown(agentId);
				const failure = deps.lastEmbeddingFailure(agentId);
				if (cooldown || failure) return {
					status: "degraded",
					message: "The last memory embedding request failed. Check the Gateway log. If credential resolution failed, run openclaw secrets reload, then retry memory search.",
					details: failure ? {
						...details,
						embeddingFailedAtMs: failure.atMs
					} : details
				};
				return {
					status: "ready",
					details
				};
			},
			async close() {}
		} };
	} };
}
export { createLanceDbMemoryProviderRuntime as n, createEmbeddingHealthTracker as t };
