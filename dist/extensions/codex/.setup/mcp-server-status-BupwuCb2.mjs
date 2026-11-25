// extensions/codex/src/app-server/mcp-server-status.ts
async function* readCodexMcpServerStatusPages(readPage, errors) {
	const seenCursors = /* @__PURE__ */ new Set();
	let cursor;
	for (let page = 0; page < 100; page += 1) {
		const response = await readPage(cursor);
		yield response.data;
		if (!response.nextCursor) return;
		cursor = response.nextCursor;
		if (seenCursors.has(cursor)) throw new Error(errors.repeatedCursor);
		seenCursors.add(cursor);
	}
	throw new Error(errors.pageLimit);
}
async function findCodexMcpServerStatus(readPage, name, errors) {
	for await (const statuses of readCodexMcpServerStatusPages(readPage, errors)) {
		const found = statuses.find((status) => status.name === name);
		if (found) return found;
	}
}
async function listCodexMcpServerStatuses(readPage, errors) {
	const statuses = [];
	for await (const page of readCodexMcpServerStatusPages(readPage, errors)) statuses.push(...page);
	return statuses;
}
export { listCodexMcpServerStatuses as n, findCodexMcpServerStatus as t };
