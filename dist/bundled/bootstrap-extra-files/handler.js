import { t as createSubsystemLogger } from "../../subsystem-DleLyu58.mjs";
import { a as isAgentBootstrapEvent } from "../../internal-hooks-B-eMkNRp.mjs";
import { t as loadDeclaredExtraBootstrapFiles } from "../../declared-files-BuPlzy3t.mjs";
//#region src/hooks/bundled/bootstrap-extra-files/handler.ts
const log = createSubsystemLogger("bootstrap-extra-files");
/** Agent-bootstrap hook that appends configured extra files to the session bootstrap set. */
const bootstrapExtraFilesHook = async (event) => {
	if (!isAgentBootstrapEvent(event)) return;
	const context = event.context;
	try {
		const { files: extras, diagnostics } = await loadDeclaredExtraBootstrapFiles({
			config: context.cfg,
			workspaceDir: context.workspaceDir
		});
		if (diagnostics.length > 0) log.debug("skipped extra bootstrap candidates", {
			skipped: diagnostics.length,
			reasons: diagnostics.reduce((counts, item) => {
				counts[item.reason] = (counts[item.reason] ?? 0) + 1;
				return counts;
			}, {})
		});
		if (extras.length === 0) return;
		context.bootstrapFiles = [...context.bootstrapFiles, ...extras];
	} catch (err) {
		log.warn(`failed: ${String(err)}`);
	}
};
//#endregion
export { bootstrapExtraFilesHook as default };
