import "./cjk-chars-D02XG87t.mjs";
import "./utils-gjJ-tD2q.mjs";
import { A as withTimeout } from "./fs-safe-6Z4UiMS4.mjs";
import "./fetch-timeout-AfCp6rSy.mjs";
import "./with-timeout-DPEAkQt5.mjs";
import "./tool-result-limits-tYfGdUlb.mjs";
//#region src/plugin-sdk/text-utility-runtime.ts
/** Run a channel probe with shared timeout, elapsed-time, and error-result handling. */
async function runChannelProbe(timeoutMs, run, onError) {
	const startedAt = Date.now();
	const elapsedMs = () => Date.now() - startedAt;
	const finish = (result) => ({
		...result,
		elapsedMs: result.elapsedMs ?? elapsedMs()
	});
	try {
		return finish(await withTimeout(run({
			startedAt,
			elapsedMs
		}), timeoutMs ?? 0));
	} catch (error) {
		if (!onError) throw error;
		return finish(onError(error));
	}
}
//#endregion
export { runChannelProbe as t };
