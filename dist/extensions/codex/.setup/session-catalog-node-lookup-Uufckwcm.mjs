import { A as unwrapNodeInvokePayload, n as CODEX_APP_SERVER_THREADS_LIST_COMMAND, o as CatalogParamsError, u as NODE_INVOKE_TIMEOUT_MS, v as parseCatalogPage } from "./session-catalog-parsing-B-qWJh2x.mjs";
import "./session-catalog-limits-DEU36Qlo.mjs";
import { i as withTimeout } from "./timeout-CXOfNoaX.mjs";
//#region extensions/codex/src/session-catalog-node-lookup.ts
async function lookupNodeCodexCatalogRecord(params) {
	const deadline = performance.now() + NODE_INVOKE_TIMEOUT_MS;
	const unverified = () => new CatalogParamsError("Codex session eligibility could not be verified");
	const remaining = () => {
		const timeoutMs = Math.ceil(deadline - performance.now());
		if (timeoutMs <= 0) throw unverified();
		return timeoutMs;
	};
	let cursor;
	let sourceHomeId = params.sourceHomeId;
	let firstPage = true;
	const seenCursors = /* @__PURE__ */ new Set();
	for (;;) {
		const timeoutMs = remaining();
		const raw = await withTimeout(params.runtime.nodes.invoke({
			nodeId: params.nodeId,
			command: CODEX_APP_SERVER_THREADS_LIST_COMMAND,
			params: {
				agentId: params.agentId,
				...sourceHomeId ? { sourceHomeId } : {},
				limit: 100,
				...cursor ? { cursor } : {}
			},
			timeoutMs,
			scopes: ["operator.write"]
		}), timeoutMs, "Codex session eligibility could not be verified", unverified);
		remaining();
		const page = parseCatalogPage(unwrapNodeInvokePayload(raw));
		if ((!firstPage || sourceHomeId !== void 0) && page.sourceHomeId !== sourceHomeId) throw new CatalogParamsError("Codex session source home changed; refresh the catalog and retry");
		sourceHomeId = page.sourceHomeId;
		firstPage = false;
		const record = page.sessions.find((candidate) => candidate.threadId === params.threadId);
		if (record) return {
			kind: "found",
			record,
			sourceHomeId,
			canContinueCodex: page.canContinueCodex
		};
		const nextCursor = page.nextCursor?.trim();
		if (!nextCursor) break;
		if (seenCursors.has(nextCursor)) return { kind: "cursor-cycle" };
		seenCursors.add(nextCursor);
		if (seenCursors.size > 2e4) {
			const oldest = seenCursors.values().next().value;
			if (oldest !== void 0) seenCursors.delete(oldest);
		}
		cursor = nextCursor;
	}
	return { kind: "missing" };
}
//#endregion
export { lookupNodeCodexCatalogRecord as t };
