import { AsyncLocalStorage } from "node:async_hooks";
//#region src/shared/store-writer-acquisitions.ts
/** Acquire idle writers synchronously without nesting the acquisition stack. */
function runStoreWriterAcquisitions(acquire) {
	let acquiring = false;
	let nextAcquisition;
	function enqueue(index) {
		return new Promise((resolve, reject) => {
			nextAcquisition = AsyncLocalStorage.bind(() => {
				try {
					acquire(index, () => enqueue(index + 1)).then(resolve, reject);
				} catch (error) {
					reject(error);
				}
			});
			if (acquiring) return;
			acquiring = true;
			try {
				while (nextAcquisition) {
					const next = nextAcquisition;
					nextAcquisition = void 0;
					next();
				}
			} finally {
				acquiring = false;
			}
		});
	}
	return enqueue(0);
}
//#endregion
export { runStoreWriterAcquisitions as t };
