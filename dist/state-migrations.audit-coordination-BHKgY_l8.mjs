import { t as withOpenClawStateLease } from "./openclaw-state-lease-B69mLcu_.mjs";
//#region src/infra/state-migrations.audit-coordination.ts
const LEGACY_AUDIT_COORDINATION_SCOPE = "migration.legacy-audit";
const LEGACY_AUDIT_COORDINATION_KEY = "filesystem-sqlite-boundary";
function withLegacyAuditMigrationLease(stateDir, run) {
	return withOpenClawStateLease({
		scope: LEGACY_AUDIT_COORDINATION_SCOPE,
		key: LEGACY_AUDIT_COORDINATION_KEY,
		database: {
			scope: "shared",
			options: { env: {
				...process.env,
				OPENCLAW_STATE_DIR: stateDir
			} }
		},
		leaseMs: 6e4,
		waitMs: 5e3,
		leaseLabel: "legacy audit migration lease",
		operationLabel: "migration.legacy-audit.lease"
	}, async () => await run());
}
//#endregion
export { withLegacyAuditMigrationLease as t };
