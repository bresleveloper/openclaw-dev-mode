//#region src/channels/plugins/legacy-state-migration-preview.ts
function buildLegacyMigrationPreview(plan) {
	if (plan.kind === "plugin-state-import") return plan.preview ?? `- ${plan.label}: ${plan.sourcePath}`;
	return `- ${plan.label}: ${plan.sourcePath} → ${plan.targetPath}`;
}
//#endregion
//#region src/plugin-sdk/doctor-migration-plan-adapter.ts
/** Adapts legacy channel migration plans to the canonical plugin doctor contract. */
function definePluginDoctorMigrationFromPlans(params) {
	const resolvePlans = async (input) => {
		const plans = await params.resolvePlans({
			cfg: input.config,
			env: input.env,
			stateDir: input.stateDir,
			oauthDir: input.oauthDir
		}) ?? [];
		const resolvedPlans = [];
		for (const plan of plans) resolvedPlans.push(plan.kind === "plugin-state-import" && !plan.stateDir ? {
			...plan,
			stateDir: input.stateDir
		} : plan);
		return resolvedPlans;
	};
	return {
		id: params.id,
		label: params.label,
		...params.doctorOnly === true ? { doctorOnly: true } : {},
		async detectLegacyState(input) {
			const plans = await resolvePlans(input);
			return plans.length > 0 ? { preview: plans.map((plan) => buildLegacyMigrationPreview(plan)) } : null;
		},
		async migrateLegacyState(input) {
			const plans = await resolvePlans(input);
			const { runLegacyMigrationPlans } = await import("./state-migrations.plugin-state-BHUKRii2.mjs");
			return await runLegacyMigrationPlans(plans);
		}
	};
}
//#endregion
export { buildLegacyMigrationPreview as n, definePluginDoctorMigrationFromPlans as t };
