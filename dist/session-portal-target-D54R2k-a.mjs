//#region src/gateway/worker-environments/session-portal-target.ts
/** Captures a dedicated machine target; authorization remains with the session caller. */
function captureSessionPortalTarget(environments, identity, environmentId) {
	const attachment = environments.captureSessionAttachment(identity);
	const { binding } = attachment;
	const signal = environments.getDedicatedNodeLeaseSignal(binding.environmentId);
	if (environmentId !== void 0 && binding.environmentId !== environmentId || !signal || signal.aborted) throw new Error("Session previews require an attached dedicated cloud worker; shared or unclassified machines cannot expose ports");
	const assertCurrent = () => {
		signal.throwIfAborted();
		attachment.assertCurrent();
		if (environments.getDedicatedNodeLeaseSignal(binding.environmentId) !== signal) throw new Error("Session preview machine ownership changed");
	};
	assertCurrent();
	return {
		binding,
		signal,
		assertCurrent,
		touch: () => attachment.touch()
	};
}
//#endregion
export { captureSessionPortalTarget as t };
