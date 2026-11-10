//#region packages/memory-host-sdk/src/host/embedding-vector.ts
function parseEmbedding(raw) {
	try {
		const parsed = JSON.parse(raw);
		return Array.isArray(parsed) ? parsed : [];
	} catch {
		return [];
	}
}
/** Persistent vectors use IEEE-754 binary64 in little-endian order on every host. */
function encodeMemoryEmbedding(embedding) {
	const bytes = new Uint8Array(embedding.length * 8);
	const view = new DataView(bytes.buffer);
	for (let index = 0; index < embedding.length; index += 1) {
		const coordinate = embedding[index];
		if (typeof coordinate !== "number" || !Number.isFinite(coordinate)) throw new Error("Memory embeddings require finite numeric coordinates");
		view.setFloat64(index * 8, coordinate, true);
	}
	return bytes;
}
/** Invalid derived vectors stay unusable; cache and indexing owners repair them. */
function decodeMemoryEmbedding(bytes) {
	if (bytes.byteLength % 8 !== 0) return [];
	const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
	const embedding = [];
	for (let offset = 0; offset < bytes.byteLength; offset += 8) {
		const coordinate = view.getFloat64(offset, true);
		if (!Number.isFinite(coordinate)) return [];
		embedding.push(coordinate);
	}
	return embedding;
}
//#endregion
export { encodeMemoryEmbedding as n, parseEmbedding as r, decodeMemoryEmbedding as t };
