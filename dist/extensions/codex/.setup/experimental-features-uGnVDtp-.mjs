//#region extensions/codex/src/app-server/experimental-features.ts
async function readCodexExperimentalFeature(request, featureName, threadId) {
	let cursor;
	const visited = /* @__PURE__ */ new Set();
	do {
		const response = await request({
			...threadId ? { threadId } : {},
			...cursor ? { cursor } : {},
			limit: 100
		});
		const feature = response.data.find((entry) => entry.name === featureName);
		if (feature) return feature.enabled;
		cursor = response.nextCursor ?? void 0;
		if (cursor && visited.has(cursor)) return;
		if (cursor) visited.add(cursor);
	} while (cursor);
}
//#endregion
export { readCodexExperimentalFeature as t };
