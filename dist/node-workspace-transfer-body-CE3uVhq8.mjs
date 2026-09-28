//#region src/worker/node-workspace-transfer-body.ts
async function* boundedWorkspaceTransferChunks(body, maxBytes) {
	let total = 0;
	for await (const value of body) {
		const chunk = Buffer.isBuffer(value) ? value : Buffer.from(value);
		total += chunk.byteLength;
		if (total > maxBytes) throw new Error("workspace transfer response exceeded its byte limit");
		yield chunk;
	}
}
async function readWorkspaceTransferBody(body, maxBytes) {
	const chunks = [];
	for await (const chunk of boundedWorkspaceTransferChunks(body, maxBytes)) chunks.push(chunk);
	return Buffer.concat(chunks);
}
//#endregion
export { readWorkspaceTransferBody as n, boundedWorkspaceTransferChunks as t };
