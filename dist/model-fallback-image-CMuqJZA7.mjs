import { c as normalizeOptionalLowercaseString } from "./string-coerce-CIXf7egm.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { t as resolveImageFallbackCandidates } from "./model-fallback-candidates-BSWa_fLA.mjs";
import { f as runFallbackAttempt, m as throwFallbackFailureSummary } from "./model-fallback-attempt-Dz9Ct0BI.mjs";
import { t as formatHumanList } from "./human-list-Beo_KoiT.mjs";
//#region src/shared/enum-option.ts
function createEnumOptionParser(ErrorType = Error) {
	return (raw, allowed, label) => {
		const normalized = normalizeOptionalLowercaseString(raw);
		if (!normalized) return;
		const value = allowed.find((entry) => entry.toLowerCase() === normalized);
		if (value === void 0) throw new ErrorType(`${label} must be one of ${formatHumanList(allowed)}`);
		return value;
	};
}
//#endregion
//#region src/agents/model-fallback-image.ts
async function runWithImageModelFallback(params) {
	const candidates = resolveImageFallbackCandidates({
		cfg: params.cfg,
		modelOverride: params.modelOverride,
		manifestPlugins: params.manifestPlugins
	});
	if (candidates.length === 0) throw new Error("No image model configured. Set agents.defaults.imageModel.primary or agents.defaults.imageModel.fallbacks.");
	const attempts = [];
	let lastError;
	for (const [i, candidate] of candidates.entries()) {
		const attemptRun = await runFallbackAttempt({
			run: params.run,
			...candidate,
			attempts,
			attempt: i + 1,
			total: candidates.length,
			abortSignal: params.abortSignal
		}).catch((error) => {
			params.abortSignal?.throwIfAborted();
			throw error;
		});
		if ("success" in attemptRun) return attemptRun.success;
		const err = attemptRun.error;
		lastError = err;
		attempts.push({
			provider: candidate.provider,
			model: candidate.model,
			error: formatErrorMessage(err)
		});
		await params.onError?.({
			provider: candidate.provider,
			model: candidate.model,
			error: err,
			attempt: i + 1,
			total: candidates.length
		});
	}
	return throwFallbackFailureSummary({
		attempts,
		candidates,
		lastError,
		label: "image models",
		formatAttempt: (attempt) => `${attempt.provider}/${attempt.model}: ${attempt.error}`,
		cfg: params.cfg
	});
}
//#endregion
export { createEnumOptionParser as n, runWithImageModelFallback as t };
