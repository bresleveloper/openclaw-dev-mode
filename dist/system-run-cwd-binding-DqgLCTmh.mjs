import { d as sameFileIdentity } from "./fs-safe-advanced-CJC-NYf3.mjs";
import { b as resolveExecWrapperTrustPlan } from "./exec-command-resolution-D9KnwdvB.mjs";
import { m as hasMutableSymlinkPathComponentSync } from "./system-run-approval-binding-BDEolZhR.mjs";
import { n as EXEC_AUTO_REVIEW_DISPATCH_IDENTITY_WARNING } from "./exec-auto-review-e88UhcnB.mjs";
import fs from "node:fs";
import path from "node:path";
//#region src/infra/exec-auto-approval-eligibility.ts
/** Original-text review requires proof of every dispatch, not just its policy projection. */
function resolveUnpinnedAutoApprovalEligibility(params) {
	const ineligible = {
		eligible: false,
		reason: EXEC_AUTO_REVIEW_DISPATCH_IDENTITY_WARNING
	};
	if (!params.authorizationPlan?.ok || !params.binding) return ineligible;
	const candidates = params.authorizationPlan.groups.flatMap((group) => group.candidates);
	if (candidates.length === 0) return ineligible;
	for (const candidate of candidates) {
		if (candidate.transport.kind !== "direct") return ineligible;
		const segment = candidate.sourceSegment;
		const trustPlan = resolveExecWrapperTrustPlan(segment.sourceArgv ?? segment.argv, void 0, params.platform);
		if (segment.resolution?.policyBlocked || !trustPlan.dispatchChain) return ineligible;
		if (![...trustPlan.dispatchChain.slice(0, -1).map((argv) => argv.slice(0, 1)), segment.argv].every((argv) => params.binding?.operands.some((operand) => operand.executable === true && operand.snapshot.argvIndex === 0 && operand.argv.length === argv.length && operand.argv.every((token, index) => token === argv[index])))) return ineligible;
	}
	return { eligible: true };
}
//#endregion
//#region src/infra/system-run-cwd-binding.ts
/** Captures and revalidates the directory identity used by exec authorization. */
const APPROVAL_CWD_DRIFT_DENIED_MESSAGE = "SYSTEM_RUN_DENIED: approval cwd changed before execution";
function captureApprovedCwdSnapshotSync(cwd) {
	const requestedCwd = path.resolve(cwd);
	let cwdLstat;
	let cwdStat;
	let cwdReal;
	let cwdRealStat;
	try {
		cwdLstat = fs.lstatSync(requestedCwd);
		cwdStat = fs.statSync(requestedCwd);
		cwdReal = fs.realpathSync(requestedCwd);
		cwdRealStat = fs.statSync(cwdReal);
	} catch {
		return {
			ok: false,
			message: "SYSTEM_RUN_DENIED: approval requires an existing canonical cwd"
		};
	}
	if (!cwdStat.isDirectory()) return {
		ok: false,
		message: "SYSTEM_RUN_DENIED: approval requires cwd to be a directory"
	};
	if (hasMutableSymlinkPathComponentSync(requestedCwd) || cwdLstat.isSymbolicLink()) return {
		ok: false,
		message: "SYSTEM_RUN_DENIED: approval requires canonical cwd (no symlink path components)"
	};
	if (!sameFileIdentity(cwdStat, cwdLstat) || !sameFileIdentity(cwdStat, cwdRealStat) || !sameFileIdentity(cwdLstat, cwdRealStat)) return {
		ok: false,
		message: "SYSTEM_RUN_DENIED: approval cwd identity mismatch"
	};
	return {
		ok: true,
		snapshot: {
			cwd: cwdReal,
			stat: cwdStat
		}
	};
}
/** Rechecks the exact directory object immediately before process launch. */
function revalidateApprovedCwdSnapshot(snapshot) {
	const current = captureApprovedCwdSnapshotSync(snapshot.cwd);
	return current.ok && sameFileIdentity(snapshot.stat, current.snapshot.stat);
}
//#endregion
export { resolveUnpinnedAutoApprovalEligibility as i, captureApprovedCwdSnapshotSync as n, revalidateApprovedCwdSnapshot as r, APPROVAL_CWD_DRIFT_DENIED_MESSAGE as t };
