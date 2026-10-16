import "./src-D1BHGNTj.mjs";
//#region src/infra/abort-signal.ts
function isAbortError(error) {
	if (!error || typeof error !== "object") return false;
	try {
		if (("name" in error ? String(error.name) : "") === "AbortError") return true;
		return ("message" in error && typeof error.message === "string" ? error.message : "") === "This operation was aborted";
	} catch {
		return false;
	}
}
/** Resolves when the signal aborts, or immediately when no wait is needed. */
async function waitForAbortSignal(signal) {
	if (!signal || signal.aborted) return;
	await new Promise((resolve) => {
		signal.addEventListener("abort", () => resolve(), { once: true });
	});
}
//#endregion
export { waitForAbortSignal as n, isAbortError as t };
