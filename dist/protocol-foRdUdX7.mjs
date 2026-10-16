//#region src/process/spawn-broker/protocol.ts
var SpawnBrokerError = class extends Error {
	constructor(message, options) {
		super(message, options);
		this.code = "ERR_SPAWN_BROKER_UNAVAILABLE";
		this.name = "SpawnBrokerError";
	}
};
function serializeBrokerError(error) {
	return {
		message: error.message,
		code: error.code,
		errno: error.errno,
		syscall: error.syscall,
		path: error.path
	};
}
//#endregion
export { serializeBrokerError as n, SpawnBrokerError as t };
