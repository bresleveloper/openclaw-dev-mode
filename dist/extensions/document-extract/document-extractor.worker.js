import { n as serveWorkerTasks } from "../../worker-task-server-CwtaNZgU.mjs";
import "../../worker-task-server-WYdiFYES.mjs";
import { t as extractPdfContent } from "../../document-extractor.runtime-hjhp_pN3.mjs";
//#region extensions/document-extract/document-extractor.worker.ts
serveWorkerTasks(async (input, _progress, control) => {
	const request = input;
	const imageErrors = [];
	try {
		return {
			status: "ok",
			result: await extractPdfContent({
				...request,
				onImageExtractionError: (error) => imageErrors.push(error instanceof Error ? error : new Error(String(error)))
			}, control),
			imageErrors
		};
	} catch (error) {
		return {
			status: "failed",
			error: error instanceof Error ? error : new Error(String(error)),
			imageErrors
		};
	}
});
//#endregion
export {};
