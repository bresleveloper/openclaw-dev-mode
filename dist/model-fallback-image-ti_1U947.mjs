import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { n as assertOperatorModelAllowed, t as assertAdmittedRunOperatorAuthority } from "./admitted-run-context-QJnFIxUZ.mjs";
import { t as resolveImageFallbackCandidates } from "./model-fallback-candidates-COPIBIvt.mjs";
import { f as runFallbackAttempt, m as throwFallbackFailureSummary } from "./model-fallback-attempt-CgxC59Zt.mjs";
//#region src/agents/model-fallback-image.ts
/** Resolve one canonical candidate set for preparation and image/PDF execution. */
function resolveAllowedImageFallbackCandidates(params) {
	const authority = params.operatorAuthority;
	if (authority) {
		assertAdmittedRunOperatorAuthority(authority);
		authority.assertCurrent();
	}
	const candidates = resolveImageFallbackCandidates(params);
	if (params.modelOverride?.trim()) assertOperatorModelAllowed(authority, candidates.find((candidate) => candidate.routeOrigin === "requested"));
	const policy = authority?.modelPolicy;
	if (!policy) return candidates;
	const allowed = candidates.filter((candidate) => policy.allows(candidate));
	assertOperatorModelAllowed(authority, allowed[0]);
	return allowed;
}
async function runWithImageModelFallback(params) {
	const candidates = resolveAllowedImageFallbackCandidates(params);
	if (candidates.length === 0) throw new Error("No image model configured. Set agents.defaults.imageModel.primary or agents.defaults.imageModel.fallbacks.");
	const attempts = [];
	let lastError;
	for (const [i, candidate] of candidates.entries()) {
		assertOperatorModelAllowed(params.operatorAuthority, candidate);
		const attemptRun = await runFallbackAttempt({
			run: params.run,
			...candidate,
			attempts,
			attempt: i + 1,
			total: candidates.length,
			abortSignal: params.abortSignal
		}).catch((error) => {
			params.operatorAuthority?.assertCurrent();
			params.abortSignal?.throwIfAborted();
			throw error;
		});
		assertOperatorModelAllowed(params.operatorAuthority, candidate);
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
export { runWithImageModelFallback as n, resolveAllowedImageFallbackCandidates as t };
