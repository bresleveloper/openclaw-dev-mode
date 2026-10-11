import { t as captureRuntimeConfigAsyncReader } from "./io.runtime-CXaC-ufL.mjs";
import { i as resolveControlUiSessionUrl } from "./control-ui-link-base-CQdQgsxo.mjs";
import { t as sendMessage } from "./message-CG6L_1wP.mjs";
//#region src/tasks/task-registry-delivery-runtime.ts
async function prepareTaskControlUiSessionUrl(assertCurrent) {
	const { config } = await captureRuntimeConfigAsyncReader({
		assertCurrent,
		capture: true
	})();
	assertCurrent();
	return (params) => {
		assertCurrent();
		return resolveControlUiSessionUrl(config, {
			...params,
			exactKey: true
		});
	};
}
//#endregion
export { prepareTaskControlUiSessionUrl, sendMessage };
