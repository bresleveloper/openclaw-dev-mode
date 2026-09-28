import { g as assertCodexModelListResponse } from "./client-Cs08OXVQ.mjs";
import { normalizeOptionalString, uniqueStrings } from "openclaw/plugin-sdk/string-coerce-runtime";
//#region extensions/codex/src/app-server/models.ts
/**
* Lists and normalizes models exposed by the Codex app-server `model/list`
* endpoint, including pagination and shared-client lease handling.
*/
/** Lists one Codex app-server model page using the configured auth/client options. */
async function listCodexAppServerModels(options = {}) {
	return await withCodexAppServerModelRequest(options, async (request) => requestModelListPage(request, options));
}
/** Walks Codex app-server model pages until exhaustion or the max-page guard. */
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
	const timeoutMs = options.timeoutMs ?? 2500;
	const useSharedClient = options.sharedClient !== false;
	const { createIsolatedCodexAppServerClient, getLeasedSharedCodexAppServerClient, releaseLeasedSharedCodexAppServerClient } = await import("./shared-client-DA4VR4Eb.mjs").then((n) => n.y);
	const { requestCodexAppServerClientJson } = await import("./request-D2L0zMrq.mjs").then((n) => n.a);
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
/** Parses a raw Codex app-server model/list response into OpenClaw's normalized shape. */
function readModelListResult(value) {
	const response = assertCodexModelListResponse(value);
	const models = response.data.map((entry) => readCodexModel(entry));
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
	return {
		id,
		model,
		...normalizeOptionalString(value.displayName) ? { displayName: normalizeOptionalString(value.displayName) } : {},
		...normalizeOptionalString(value.description) ? { description: normalizeOptionalString(value.description) } : {},
		hidden: value.hidden,
		isDefault: value.isDefault,
		inputModalities: value.inputModalities,
		supportedReasoningEfforts: readReasoningEfforts(value.supportedReasoningEfforts),
		...normalizeOptionalString(value.defaultReasoningEffort) ? { defaultReasoningEffort: normalizeOptionalString(value.defaultReasoningEffort) } : {},
		...value.multiAgentVersion !== void 0 ? { multiAgentVersion: value.multiAgentVersion } : {}
	};
}
function readReasoningEfforts(value) {
	const efforts = value.map((entry) => normalizeOptionalString(entry.reasoningEffort)).filter((entry) => entry !== void 0);
	return uniqueStrings(efforts);
}
function normalizeMaxPages(value) {
	return typeof value === "number" && Number.isFinite(value) && value > 0 ? Math.floor(value) : 20;
}
//#endregion
export { listCodexAppServerModels as n, readModelListResult as r, listAllCodexAppServerModels as t };
