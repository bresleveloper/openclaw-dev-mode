//#region src/infra/fs-watch-errors.ts
function getFileWatchCapacityCode(error) {
	if (typeof error !== "object" || error === null || !("syscall" in error) || error.syscall !== "watch" || !("code" in error)) return;
	const code = error.code;
	return code === "EMFILE" || code === "ENFILE" || code === "ENOSPC" ? code : void 0;
}
//#endregion
export { getFileWatchCapacityCode as t };
