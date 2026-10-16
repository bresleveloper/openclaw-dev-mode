import { Et as _enum, Jn as string, Lt as boolean, Yt as discriminatedUnion, qn as strictObject, xn as literal } from "./schemas-BOYIvvln.mjs";
//#region src/infra/update-recovery.ts
const updateRecoverySchema = discriminatedUnion("serviceRestartSafe", [strictObject({
	serviceRestartSafe: literal(true),
	packageRollbackVerified: literal(true).optional(),
	version: string().trim().min(1),
	buildId: string().trim().min(1).max(96).optional(),
	service: _enum(["healthy", "failed"]).optional(),
	reason: string().trim().min(1).optional()
}), strictObject({
	serviceRestartSafe: literal(false),
	packageRollbackVerified: boolean().optional(),
	reason: _enum([
		"source-rollback-failed",
		"state-migration-started",
		"manager-unavailable",
		"deps-install-failed",
		"build-failed",
		"rollback-checkout-dirty",
		"runtime-verification-failed"
	])
})]);
//#endregion
export { updateRecoverySchema as t };
