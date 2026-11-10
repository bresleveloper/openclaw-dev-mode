import { a as asOptionalRecord } from "./record-coerce-TIsquoVR.mjs";
function parseCompactionDetails(value) {
	const details = asOptionalRecord(value);
	if (!details || !Array.isArray(details.readFiles) || !details.readFiles.every((file) => typeof file === "string") || !Array.isArray(details.modifiedFiles) || !details.modifiedFiles.every((file) => typeof file === "string")) return;
	const request = details.latestUnresolvedUserRequest;
	const latestUnresolvedUserRequest = typeof request === "string" && request.length <= 800 ? request : void 0;
	return {
		readFiles: details.readFiles,
		modifiedFiles: details.modifiedFiles,
		...latestUnresolvedUserRequest ? { latestUnresolvedUserRequest } : {},
		...details.qualityDegraded === true ? { qualityDegraded: true } : {}
	};
}
//#endregion
export { parseCompactionDetails as t };
