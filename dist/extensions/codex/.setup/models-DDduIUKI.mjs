import { u as assertCodexModelListResponse } from "./client-C7W0Bk1P.mjs";
import { createLazyRuntimeModule } from "openclaw/plugin-sdk/lazy-runtime";
import { normalizeOptionalString, normalizeUniqueTrimmedStringList } from "openclaw/plugin-sdk/string-coerce-runtime";
import { floorPositiveFiniteNumber } from "openclaw/plugin-sdk/number-runtime";
// extensions/codex/src/app-server/models.ts
const loadSharedClient = createLazyRuntimeModule(() => import("./shared-client-DhJ31S_8.mjs").then((n) => n.g));
const loadRequest = createLazyRuntimeModule(() => import("./request-DaqFEDj8.mjs").then((n) => n.i));
const DEFAULT_MODEL_DISCOVERY_TIMEOUT_MS = 1e4;
async function listCodexAppServerModels(options = {}) {
	return await withCodexAppServerModelRequest(options, async (request) => requestModelListPage(request, options));
}
async function listAllCodexAppServerModels(options = {}) {
	const maxPages = floorPositiveFiniteNumber(options.maxPages) ?? 20;
	return await withCodexAppServerModelRequest(options, async (request) => {
		const models = [];
		let nextCursor;
		for (let page = 0; page < maxPages; page += 1) {
			const result = await requestModelListPage(request, {
				...options,
				cursor: page === 0 ? options.cursor : nextCursor
			});
			models.push(...result.models);
			nextCursor = result.nextCursor;
			if (!nextCursor) return { models };
		}
		return {
			models,
			nextCursor,
			truncated: true
		};
	});
}
async function withCodexAppServerModelRequest(options, run) {
	if (options.request) return await run(options.request);
	const timeoutMs = options.timeoutMs ?? 1e4;
	const { getLeasedSharedCodexAppServerClient, releaseLeasedSharedCodexAppServerClient } = await loadSharedClient();
	const { requestCodexAppServerClientJson } = await loadRequest();
	const client = await getLeasedSharedCodexAppServerClient({
		startOptions: options.startOptions,
		timeoutMs,
		authProfileId: options.authProfileId,
		authRequirement: options.authRequirement,
		agentDir: options.agentDir,
		config: options.config
	});
	try {
		return await run((request) => requestCodexAppServerClientJson({
			...request,
			client,
			timeoutMs,
			config: options.config
		}));
	} finally {
		releaseLeasedSharedCodexAppServerClient(client);
	}
}
async function requestModelListPage(request, options) {
	return readModelListResult(await request({
		method: "model/list",
		requestParams: {
			limit: options.limit ?? null,
			cursor: options.cursor ?? null,
			includeHidden: options.includeHidden ?? null
		}
	}));
}
function readModelListResult(value) {
	const response = assertCodexModelListResponse(value);
	const models = response.data.map(readCodexModel);
	const nextCursor = response.nextCursor;
	return {
		models,
		...nextCursor ? { nextCursor } : {}
	};
}
function readCodexModel(value) {
	const id = normalizeOptionalString(value.id);
	const model = normalizeOptionalString(value.model);
	if (!id || !model) throw new Error("Invalid Codex app-server model/list response: model id and name must be non-empty strings");
	const displayName = normalizeOptionalString(value.displayName);
	const description = normalizeOptionalString(value.description);
	const defaultReasoningEffort = normalizeOptionalString(value.defaultReasoningEffort);
	return {
		id,
		model,
		...displayName ? { displayName } : {},
		...description ? { description } : {},
		hidden: value.hidden,
		...value.availableAccessPrograms ? { availableAccessPrograms: { cyber: value.availableAccessPrograms.cyber.map((program) => program === "daybreakBlue" ? "daybreak_blue" : program === "daybreakRed" ? "daybreak_red" : "standard") } } : {},
		isDefault: value.isDefault,
		inputModalities: value.inputModalities ?? ["text", "image"],
		serviceTiers: normalizeUniqueTrimmedStringList((value.serviceTiers ?? []).map((tier) => tier.id)),
		supportedReasoningEfforts: normalizeUniqueTrimmedStringList(value.supportedReasoningEfforts.map((entry) => entry.reasoningEffort)),
		...defaultReasoningEffort ? { defaultReasoningEffort } : {},
		...value.multiAgentVersion !== void 0 ? { multiAgentVersion: value.multiAgentVersion } : {}
	};
}
export { readModelListResult as i, listAllCodexAppServerModels as n, listCodexAppServerModels as r, DEFAULT_MODEL_DISCOVERY_TIMEOUT_MS as t };
