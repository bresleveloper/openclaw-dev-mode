import { f as toStringifiedError } from "../../error-coercion-BwMr25F8.mjs";
import { n as serveWorkerTasks } from "../../worker-task-server-sMsYUF1K.mjs";
import "../../error-runtime-ikopZs5O.mjs";
import "../../worker-task-server-T-g3Ibxb.mjs";
import { t as extractPdfContent } from "../../document-extractor.runtime-CsXtrTKH.mjs";
//#region extensions/document-extract/document-extractor.worker.ts
serveWorkerTasks(async (input, _progress, control) => {
	const request = input;
	const imageErrors = [];
	try {
		return {
			status: "ok",
			result: await extractPdfContent({
				...request,
				onImageExtractionError: (error) => imageErrors.push(toStringifiedError(error))
			}, control),
			imageErrors
		};
	} catch (error) {
		return {
			status: "failed",
			error: toStringifiedError(error),
			imageErrors
		};
	}
});
//#endregion
export {};
