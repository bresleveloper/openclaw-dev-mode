import { t as captureRuntimeConfigAsyncReader } from "./io.runtime-BN-rPaec.mjs";
import { i as resolveControlUiSessionUrl } from "./control-ui-link-base-CQdQgsxo.mjs";
import { t as sendMessage } from "./message-3GtA8b6Y.mjs";
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
