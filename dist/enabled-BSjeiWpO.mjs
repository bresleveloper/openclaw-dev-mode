//#region src/gateway/terminal/enabled.ts
function isTerminalConfigEnabled(config) {
	return config?.gateway?.terminal?.enabled !== false;
}
//#endregion
export { isTerminalConfigEnabled as t };
