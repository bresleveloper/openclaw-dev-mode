import { d as toStringifiedError } from "../../error-coercion-CvJK4lmH.mjs";
import { n as serveWorkerTasks } from "../../worker-task-server-BC_7U18u.mjs";
import "../../error-runtime-BmospGvZ.mjs";
import "../../worker-task-server-OcaoXQUy.mjs";
import { t as extractPdfContent } from "../../document-extractor.runtime-Dq5edLAy.mjs";
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
