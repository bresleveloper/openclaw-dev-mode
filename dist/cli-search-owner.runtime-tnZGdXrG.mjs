import { t as runWithLocalStateOwner } from "./local-state-owner-B_m2_iCc.mjs";
import "./cli-state-owner-CBu2WDHQ.mjs";
import { t as renderMemorySearch } from "./cli-search-output-BBjUpQe9.mjs";
//#region extensions/memory-core/src/cli-search-owner.runtime.ts
async function runMemorySearchWithOwner(query, opts, hostOptions) {
	const result = await runWithLocalStateOwner({
		method: "memory.search.owner",
		params: {
			query,
			...opts.agent !== void 0 ? { agentId: opts.agent } : {},
			...opts.maxResults !== void 0 ? { maxResults: opts.maxResults } : {},
			...opts.minScore !== void 0 ? { minScore: opts.minScore } : {}
		},
		target: "memory search",
		runLocal: async () => {
			const { runMemorySearch } = await import("./cli.runtime.js");
			await runMemorySearch(query, opts, hostOptions);
		}
	});
	if (result) renderMemorySearch(result, opts.json);
}
//#endregion
export { runMemorySearchWithOwner };
