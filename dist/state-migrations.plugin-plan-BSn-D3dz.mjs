//#region src/infra/state-migrations.plugin-plan.ts
function buildPlannedPluginStateMigrationDescriptor(params) {
	const actions = params.inventory.descriptors.filter((descriptor) => descriptor.phase === params.phase && (params.mode === "doctor" || descriptor.doctorOnly !== true));
	const unresolvedPluginIds = params.inventory.unresolvedPluginIds;
	const source = [...actions.map((descriptor) => ({
		kind: "owner",
		id: `plugin:${descriptor.pluginId}:${descriptor.id}`
	})), ...unresolvedPluginIds.map((pluginId) => ({
		kind: "owner",
		id: `plugin:${pluginId}:state-migrations`
	}))];
	return {
		actions,
		source,
		target: [.../* @__PURE__ */ new Set([...actions.map((descriptor) => descriptor.pluginId), ...unresolvedPluginIds])].map((pluginId) => ({
			kind: "owner",
			id: `plugin:${pluginId}:doctor-state`
		})),
		requiredness: source.length > 0 || params.inventory.resolutionFailure ? "conditional" : "not-required",
		...params.inventory.resolutionFailure ? { refusal: params.inventory.resolutionFailure } : unresolvedPluginIds.length > 0 ? { refusal: {
			code: "plugin-planning-deferred",
			message: `Plugin migration identities are not declared for: ${unresolvedPluginIds.join(", ")}.`
		} } : {}
	};
}
/** Freeze one deferred writer's authority from the selected plugin generation. */
function preparePostSessionPluginMigration(params) {
	const { actions, ...descriptor } = buildPlannedPluginStateMigrationDescriptor({
		...params,
		phase: "after-session-repair"
	});
	return {
		step: {
			id: "plugin-doctor-post-session-state",
			phase: "final",
			reversibility: "checkpoint-required",
			...descriptor
		},
		plannedActions: actions.map(({ pluginId, id }) => ({
			pluginId,
			id
		})),
		inventory: params.inventory
	};
}
//#endregion
export { preparePostSessionPluginMigration as n, buildPlannedPluginStateMigrationDescriptor as t };
