//#region extensions/file-transfer/src/shared/child-output.ts
function consumeChildOutput(stream, handlers) {
	stream.on("data", handlers.onData);
	stream.on("error", handlers.onError);
}
//#endregion
export { consumeChildOutput as t };
