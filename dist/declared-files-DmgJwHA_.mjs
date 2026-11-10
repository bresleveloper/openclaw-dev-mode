import { m as resolveExtraBootstrapPatterns } from "./workspace-bootstrap-policy-wM0DWL3B.mjs";
import { s as loadExtraBootstrapFilesWithDiagnostics } from "./workspace-3xrXOvoY.mjs";
//#region src/hooks/bundled/bootstrap-extra-files/declared-files.ts
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
