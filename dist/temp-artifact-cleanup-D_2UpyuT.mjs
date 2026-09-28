import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { t as createSubsystemLogger } from "./subsystem-DleLyu58.mjs";
import { t as runBestEffortCleanup } from "./non-fatal-cleanup-BoCq8AND.mjs";
import fs from "node:fs/promises";
//#region src/infra/temp-artifact-cleanup.ts
const log = createSubsystemLogger("infra:temp-artifacts");
function removeTemporaryArtifacts(directory, owner) {
	return runBestEffortCleanup({
		cleanup: () => fs.rm(directory, {
			recursive: true,
			force: true
		}),
		onError: (error) => log.warn(truncateUtf16Safe(formatErrorMessage(`${owner} cleanup failed; files may remain in ${directory}. After the worker or session stops, check permissions and remove the retained directory: ${formatErrorMessage(error)}`), 1024))
	});
}
//#endregion
export { removeTemporaryArtifacts as t };
