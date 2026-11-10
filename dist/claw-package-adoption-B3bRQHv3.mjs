import { r as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-BDhKaXgP.mjs";
import { i as runOpenClawStateWorkerOperation } from "./openclaw-state-worker-store-C1iV_8xe.mjs";
//#region src/state/claw-package-adoption.ts
/** Records an explicit non-Claw claim through the canonical package owner. */
async function markClawPackageIndependentlyOwned(artifact, options = {}) {
	try {
		return await runOpenClawStateWorkerOperation(captureOpenClawStateWorkerContext(options), (scope) => scope.execute({
			type: "clawAdoption.package",
			input: {
				artifact,
				nowMs: options.nowMs ?? Date.now()
			}
		}), { existingOnly: true }) ?? 0;
	} catch {
		return 0;
	}
}
//#endregion
export { markClawPackageIndependentlyOwned as t };
