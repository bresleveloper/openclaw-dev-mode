import { m as resolveExtraBootstrapPatterns } from "./workspace-bootstrap-policy-CPdXB_so.mjs";
import { s as loadExtraBootstrapFilesWithDiagnostics } from "./workspace-C0xiByg0.mjs";
//#region src/hooks/bundled/bootstrap-extra-files/declared-files.ts
/** Loads the extra bootstrap files the hook config declares for a workspace. */
async function loadDeclaredExtraBootstrapFiles(params) {
	const patterns = resolveExtraBootstrapPatterns(params.config);
	if (patterns.length === 0) return {
		files: [],
		diagnostics: []
	};
	return loadExtraBootstrapFilesWithDiagnostics(params.workspaceDir, patterns);
}
//#endregion
export { loadDeclaredExtraBootstrapFiles as t };
