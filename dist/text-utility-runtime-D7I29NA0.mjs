import "./cjk-chars-6ld30jSx.mjs";
import { k as withTimeout } from "./fs-safe-BAPek8At.mjs";
import "./utils-aKqR_F_U.mjs";
import "./fetch-timeout-BOG6Do5a.mjs";
import "./with-timeout-DI2A0gT4.mjs";
import "./tool-result-limits-B-fhY8wF.mjs";
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
