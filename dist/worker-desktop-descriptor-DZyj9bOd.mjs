//#region src/shared/worker-desktop-descriptor.ts
function isWorkerDesktopString(value) {
	return typeof value === "string" && !value.includes("\0") && Buffer.byteLength(value) <= 4096;
}
function isWorkerDesktopArgs(value) {
	return Array.isArray(value) && value.length <= 32 && value.every(isWorkerDesktopString) && value.reduce((bytes, arg) => bytes + Buffer.byteLength(arg), 0) <= 8192;
}
function isWorkerDesktopUsername(value) {
	return typeof value === "string" && value.length > 0 && value.trim() === value && !/[\0\r\n]/u.test(value) && Buffer.byteLength(value) <= 63;
}
function isWorkerDesktopArdPassword(value) {
	return typeof value === "string" && value.length > 0 && !value.includes("\0") && Buffer.byteLength(value) <= 63;
}
//#endregion
export { isWorkerDesktopUsername as i, isWorkerDesktopArgs as n, isWorkerDesktopString as r, isWorkerDesktopArdPassword as t };
