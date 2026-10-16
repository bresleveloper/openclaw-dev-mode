import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { g as resolveDefaultAgentId, t as AgentSelectionRequiredError } from "./agent-scope-config-CDYpzA0r.mjs";
import "./session-key-C09ow4h0.mjs";
import { i as listAgentIds } from "./agent-roster-BXD1uMJD.mjs";
import "./agent-scope-CG17uXFn.mjs";
import { t as ErrorCodes } from "./gateway-error-details-DIefe7Zy.mjs";
import { f as errorShape } from "./error-codes-Dh56LniQ.mjs";
import { n as captureGatewayOperatorRunAuthority } from "./operator-run-authority-BPRn5nuX.mjs";
import { n as isSyntheticGatewayCaller } from "./gateway-personal-caller-CPQUGI4q.mjs";
import { a as getActiveMemoryProviderCore } from "./memory-runtime-DvJ6BFOQ.mjs";
//#region src/gateway/server-methods/memory-provider.ts
function requireNonEmptyStringIfPresent(value, name) {
	if (value === void 0) return;
	if (typeof value !== "string" || !value.trim()) throw new TypeError(`${name} must be a non-empty string`);
	return value;
}
function requireNumberIfPresent(value, name, integer = false) {
	if (value === void 0) return;
	if (typeof value !== "number" || !Number.isFinite(value) || integer && (!Number.isInteger(value) || value < 1)) throw new TypeError(`${name} must be a ${integer ? "positive integer" : "finite number"}`);
	return value;
}
function requireSourcesIfPresent(value) {
	if (value === void 0) return;
	if (!Array.isArray(value) || value.length === 0) throw new TypeError("sources must be a non-empty array of memory or sessions");
	return value.map((source) => {
		if (source !== "memory" && source !== "sessions") throw new TypeError("sources must contain only memory or sessions");
		return source;
	});
}
function parseOperation(method, params) {
	if (method === "memory.search") {
		const query = requireNonEmptyStringIfPresent(params.query, "query")?.trim();
		if (!query) throw new TypeError("query must be a non-empty string");
		return {
			kind: "search",
			input: {
				query,
				maxResults: Math.min(50, requireNumberIfPresent(params.maxResults, "maxResults", true) ?? 20),
				minScore: requireNumberIfPresent(params.minScore, "minScore"),
				cursor: requireNonEmptyStringIfPresent(params.cursor, "cursor"),
				sources: requireSourcesIfPresent(params.sources)
			}
		};
	}
	if (method === "memory.get") {
		const record = params.reference;
		if (!isRecord(record)) throw new TypeError("reference must be a provider-scoped memory reference");
		const providerId = requireNonEmptyStringIfPresent(record.providerId, "reference.providerId");
		const id = requireNonEmptyStringIfPresent(record.id, "reference.id");
		if (!providerId || !id) throw new TypeError("reference.providerId and reference.id are required");
		return {
			kind: "get",
			input: {
				reference: {
					providerId,
					id,
					revision: requireNonEmptyStringIfPresent(record.revision, "reference.revision"),
					fragment: requireNonEmptyStringIfPresent(record.fragment, "reference.fragment")
				},
				from: requireNumberIfPresent(params.from, "from", true),
				lines: requireNumberIfPresent(params.lines, "lines", true)
			}
		};
	}
	return { kind: "health" };
}
/**
* A connected operator reads with the scopes the dispatcher already authorized for
* this method, as `memory.search` v1 does. Synthetic, agent-tool, and agent-runtime
* callers act for an admitted run, so they keep that run's captured operator authority.
*/
async function captureMemoryReadAuthority(options, assertRequestCurrent) {
	const { client, context, signal, hasCurrentClientAuthority } = options;
	if (isSyntheticGatewayCaller(client)) {
		const captured = await captureGatewayOperatorRunAuthority({
			client,
			context,
			hasCurrentClientAuthority,
			invocationAuthority: {
				assertCurrent: assertRequestCurrent,
				signal
			}
		});
		if (!captured) throw new Error("Memory provider reads from an agent run require its operator authority");
		return {
			scopes: captured.authority.scopes,
			assertCurrent: () => {
				assertRequestCurrent();
				captured.authority.assertCurrent();
			},
			release: captured.release
		};
	}
	if (client?.connect?.role !== "operator" || !client.connId) throw new Error("Memory provider reads require an authenticated operator connection");
	return {
		scopes: [...client.connect.scopes ?? []],
		assertCurrent: assertRequestCurrent,
		release: () => {}
	};
}
/** Neutral reads deliberately do not use workspace RPCs or Memory Core artifacts. */
async function handleMemoryProviderRequest(options) {
	const { params, req, respond, context, client, signal, hasCurrentClientAuthority } = options;
	const cfg = context.getRuntimeConfig();
	let agentId;
	let operation;
	try {
		operation = parseOperation(req.method, params);
		const requested = requireNonEmptyStringIfPresent(params.agentId, "agentId");
		if (requested !== void 0) {
			agentId = normalizeAgentId(requested);
			if (normalizeAgentId(`${requested}a`) === "a" || !listAgentIds(cfg).includes(agentId)) throw new TypeError("unknown agentId");
		} else agentId = resolveDefaultAgentId(cfg, {
			surface: "memory provider",
			hint: "Pass agentId to select a configured agent."
		});
	} catch (error) {
		if (!(error instanceof TypeError || error instanceof AgentSelectionRequiredError)) throw error;
		respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, error.message));
		return;
	}
	let open = true;
	const assertRequestCurrent = () => {
		signal?.throwIfAborted();
		client?.connectionSignal?.throwIfAborted();
		if (!open || client?.invalidated || hasCurrentClientAuthority?.() === false) throw new Error("Memory request authority is no longer active");
	};
	let captured;
	let provider = null;
	try {
		assertRequestCurrent();
		captured = await captureMemoryReadAuthority(options, assertRequestCurrent);
		const { assertCurrent } = captured;
		assertCurrent();
		const acquired = await getActiveMemoryProviderCore({
			cfg,
			agentId,
			purpose: "cli",
			context: {
				authority: {
					kind: "operator",
					scopes: captured.scopes,
					connId: client?.connId
				},
				assertCurrent,
				signal
			}
		});
		provider = acquired.provider;
		if (!provider) throw new Error(acquired.error ?? "Memory provider unavailable");
		const result = operation.kind === "search" ? await provider.search(operation.input) : operation.kind === "get" ? await provider.get(operation.input) : await provider.health();
		assertCurrent();
		respond(true, {
			version: 2,
			agentId,
			providerId: acquired.providerId,
			...result
		}, void 0);
	} catch (error) {
		respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, formatErrorMessage(error)));
	} finally {
		open = false;
		try {
			await provider?.close();
		} finally {
			captured?.release();
		}
	}
}
const memoryProviderHandlers = {
	"memory.search": handleMemoryProviderRequest,
	"memory.get": handleMemoryProviderRequest,
	"memory.status": handleMemoryProviderRequest
};
//#endregion
export { memoryProviderHandlers };
