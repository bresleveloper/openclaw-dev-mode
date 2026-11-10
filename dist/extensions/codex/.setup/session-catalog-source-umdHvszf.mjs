import { n as defineCodexBuildState } from "./build-state-L_MglvnW.mjs";
//#region extensions/codex/src/session-catalog-source.ts
const getSources = defineCodexBuildState("openclaw.codexCatalogSources", () => ({
	clients: /* @__PURE__ */ new WeakMap(),
	values: /* @__PURE__ */ new WeakMap()
}));
const getEphemeralObservers = defineCodexBuildState("openclaw.codexCatalogEphemeralObservers", () => /* @__PURE__ */ new WeakMap());
/** A passive lifetime fact; the token never retains its client or a lease. */
function codexCatalogSourceForClient(client) {
	const { clients } = getSources();
	let source = clients.get(client);
	if (!source) {
		source = { closed: false };
		clients.set(client, source);
	}
	return source;
}
function closeCodexCatalogClientSource(client) {
	const { clients } = getSources();
	const source = clients.get(client);
	if (source) {
		source.closed = true;
		getEphemeralObservers().delete(source);
	} else clients.set(client, { closed: true });
}
/** The catalog observer is bound once per physical source and released on closure. */
function observeCodexCatalogEphemeralThreads(source, observer) {
	getEphemeralObservers().set(source, observer);
}
function getCodexCatalogSource(value) {
	return value !== null && typeof value === "object" ? getSources().values.get(value) : void 0;
}
function setCodexCatalogSource(value, source) {
	if (source) getSources().values.set(value, source);
	return value;
}
/** Source attribution survives projection without becoming serialized row data. */
function copyCodexCatalogSource(from, to) {
	return setCodexCatalogSource(to, getCodexCatalogSource(from));
}
/** Stamp the final decoded objects, including any bounded catalog DTO replacement. */
function recordCodexCatalogResponseSource(method, result, source) {
	if (result === null || typeof result !== "object") return;
	if (method === "thread/list" && "data" in result && Array.isArray(result.data)) {
		setCodexCatalogSource(result, source);
		for (const thread of result.data) if (thread !== null && typeof thread === "object") setCodexCatalogSource(thread, source);
	} else if ((method === "thread/read" || method === "thread/start" || method === "thread/fork" || method === "thread/resume") && "thread" in result && result.thread !== null && typeof result.thread === "object") {
		setCodexCatalogSource(result, source);
		setCodexCatalogSource(result.thread, source);
		if ("ephemeral" in result.thread && result.thread.ephemeral === true && "id" in result.thread && typeof result.thread.id === "string") getEphemeralObservers().get(source)?.(result.thread.id);
	}
}
//#endregion
export { observeCodexCatalogEphemeralThreads as a, getCodexCatalogSource as i, codexCatalogSourceForClient as n, recordCodexCatalogResponseSource as o, copyCodexCatalogSource as r, setCodexCatalogSource as s, closeCodexCatalogClientSource as t };
