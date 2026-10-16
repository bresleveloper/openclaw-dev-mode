import { d as assertCodexModelListResponse } from "./client-BM1XpAkE.mjs";
import { normalizeOptionalString, normalizeUniqueTrimmedStringList } from "openclaw/plugin-sdk/string-coerce-runtime";
//#region extensions/codex/src/app-server/models.ts
const DEFAULT_MODEL_DISCOVERY_TIMEOUT_MS = 1e4;
async function listCodexAppServerModels(options = {}) {
	return await withCodexAppServerModelRequest(options, async (request) => requestModelListPage(request, options));
}
async function listAllCodexAppServerModels(options = {}) {
	const maxPages = normalizeMaxPages(options.maxPages);
	return await withCodexAppServerModelRequest(options, async (request) => {
		const models = [];
		let cursor = options.cursor;
		let nextCursor;
		for (let page = 0; page < maxPages; page += 1) {
			const result = await requestModelListPage(request, {
				...options,
				cursor
			});
			models.push(...result.models);
			nextCursor = result.nextCursor;
			if (!nextCursor) return { models };
			cursor = nextCursor;
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
	const useSharedClient = options.sharedClient !== false;
	const { createIsolatedCodexAppServerClient, getLeasedSharedCodexAppServerClient, releaseLeasedSharedCodexAppServerClient } = await import("./shared-client-r9NcV_GJ.mjs").then((n) => n.v);
	const { requestCodexAppServerClientJson } = await import("./request-CB7T766a.mjs").then((n) => n.i);
	const client = await (useSharedClient ? getLeasedSharedCodexAppServerClient : createIsolatedCodexAppServerClient)({
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
		if (useSharedClient) releaseLeasedSharedCodexAppServerClient(client);
		else await client.closeAndWait();
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
	const nextCursor = response.nextCursor ?? void 0;
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
		isDefault: value.isDefault,
		inputModalities: value.inputModalities,
		serviceTiers: normalizeUniqueTrimmedStringList((value.serviceTiers ?? []).map((tier) => tier.id)),
		supportedReasoningEfforts: normalizeUniqueTrimmedStringList(value.supportedReasoningEfforts.map((entry) => entry.reasoningEffort)),
		...defaultReasoningEffort ? { defaultReasoningEffort } : {},
		...value.multiAgentVersion !== void 0 ? { multiAgentVersion: value.multiAgentVersion } : {}
	};
}
function normalizeMaxPages(value) {
	return typeof value === "number" && Number.isFinite(value) && value > 0 ? Math.floor(value) : 20;
}
//#endregion
export { readModelListResult as i, listAllCodexAppServerModels as n, listCodexAppServerModels as r, DEFAULT_MODEL_DISCOVERY_TIMEOUT_MS as t };
