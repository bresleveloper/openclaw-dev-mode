import { r as defaultRuntime } from "./runtime-BazLsT0s.mjs";
import { p as shortenHomePath } from "./utils-gjJ-tD2q.mjs";
import { r as theme } from "./theme-DzaUZY4q.mjs";
import { r as formatCliJsonFailure } from "./failure-output-CpIKhMiV.mjs";
import "./memory-core-host-runtime-cli-BAHpg7tN.mjs";
//#region extensions/memory-core/src/cli-search-output.ts
function renderMemorySearch(result, json) {
	if ("status" in result) {
		if (result.status === "disabled") {
			defaultRuntime.log("Memory search disabled.");
			if (json) defaultRuntime.writeJson(result);
		} else {
			const message = `memory search failed (${result.agentId}): ${result.error}`;
			defaultRuntime.error(message);
			process.exitCode = 1;
			if (json) defaultRuntime.writeJson({
				...formatCliJsonFailure(message),
				agentId: result.agentId
			});
		}
		return;
	}
	if (json) {
		defaultRuntime.writeJson(result);
		return;
	}
	if (result.warning) defaultRuntime.error([result.warning, result.action].filter(Boolean).join(" "));
	if (result.results.length === 0) {
		defaultRuntime.log("No matches.");
		return;
	}
	const lines = [];
	for (const hit of result.results) lines.push(`${theme.success(hit.score.toFixed(3))} ${theme.accent(`${shortenHomePath(hit.path)}:${hit.startLine}-${hit.endLine}`)}`, theme.muted(hit.snippet), "");
	defaultRuntime.log(lines.join("\n").trim());
}
//#endregion
export { renderMemorySearch as t };
