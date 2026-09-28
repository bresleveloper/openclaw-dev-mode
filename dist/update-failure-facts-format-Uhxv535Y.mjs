//#region src/infra/update-destination-failure.ts
const UPDATE_DESTINATION_RECOVERY = "Use the destination's owning installation and service account, or correct the npm prefix mismatch before retrying: https://docs.openclaw.ai/install/update-troubleshooting#node-and-global-install-permissions. Do not overwrite another installation.";
/** Paths are normalized before recording; this projection also runs in the browser. */
function formatUpdateDestinationFailure(fact) {
	const paths = [
		["prefix", fact.prefix],
		["package", fact.packageRoot],
		["running install", fact.runningRoot],
		["running prefix", fact.runningPrefix],
		["launcher", fact.launcher],
		["launcher target", fact.launcherTarget]
	];
	return [
		`Warning: npm destination ownership ${fact.ownership}; cause ${fact.cause}; kind ${fact.destinationKind}`,
		...paths.flatMap(([label, value]) => value === null ? [] : [`${label} \`${value}\``]),
		`Next step: ${UPDATE_DESTINATION_RECOVERY}`
	].join("; ");
}
//#endregion
//#region src/infra/update-failure-facts-format.ts
/** Keep the first failing check visible when later recovery failures fill the summary. */
function selectUpdateFailureReportSteps(steps) {
	const recent = steps.slice(-3);
	const firstFact = steps.find((step) => (step.failureFacts?.length ?? 0) > 0);
	return firstFact && !recent.includes(firstFact) ? [firstFact, ...recent.slice(-2)] : recent;
}
/** Render producer-redacted facts in both server and browser reports. */
function formatUpdateFailureFact(fact) {
	const message = fact.destination ? formatUpdateDestinationFailure(fact.destination) : fact.message;
	return `Failing check ${fact.check} (${fact.code})${fact.location ? ` at ${fact.location}` : ""}${fact.pluginId ? `; plugin ${fact.pluginId}` : ""}${fact.affectedKey ? `; key ${fact.affectedKey}` : ""}${message ? `: ${message}` : ""}`;
}
//#endregion
export { selectUpdateFailureReportSteps as n, UPDATE_DESTINATION_RECOVERY as r, formatUpdateFailureFact as t };
