import { t as executeExistingOpenClawStateRead } from "./openclaw-state-db-readonly-CC57AD_q.mjs";
//#region src/claws/provenance-async.ts
async function readClawPackageOwnership(options = {}, includeInstalls = false) {
	const reply = await executeExistingOpenClawStateRead(options, {
		type: "claws.packageOwnership",
		agentId: options.agentId,
		includeInstalls
	}, {
		current: true,
		signal: options.signal
	});
	if (!reply) return {
		install: void 0,
		installs: [],
		packageRefs: [],
		orphanWorkspace: void 0
	};
	if (!reply.ok || reply.type !== "claws.packageOwnership") throw new Error("Unexpected Claw package ownership result");
	const { install, installs, packageRefs, orphanWorkspace } = reply;
	return {
		install,
		installs,
		packageRefs,
		orphanWorkspace
	};
}
//#endregion
export { readClawPackageOwnership as t };
