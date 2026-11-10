import { u as withExistingOpenClawStateDatabaseReadOnly } from "./openclaw-state-db-readonly-DPndG9sn.mjs";
import { a as readDeviceAuthTokensFromDatabase, c as storeOriginDeviceTokenInDatabase, i as readDeviceAuthTokenObservationFromDatabase, n as clearOriginDeviceTokenInDatabase, o as readOriginDeviceTokenObservationFromDatabase, s as storeDeviceAuthTokenInDatabase, t as clearDeviceAuthTokenFromDatabase } from "./device-auth-store.kernel-D5YAzjaz.mjs";
//#region src/infra/device-auth-store.worker.ts
function read(operation) {
	return (input, { open, stateOptions }) => input.readOnly ? withExistingOpenClawStateDatabaseReadOnly(({ db }) => operation(db, input), stateOptions()) ?? {
		entry: null,
		expectedToken: null
	} : operation(open().db, input);
}
function write(operation) {
	return (input, { writeAdmitted }) => writeAdmitted(({ db }) => operation(db, input));
}
const deviceAuthWorkerOperations = {
	"deviceAuth.prepare": (_input) => void 0,
	"deviceAuth.read": read(readDeviceAuthTokenObservationFromDatabase),
	"deviceAuth.readOrigin": read(readOriginDeviceTokenObservationFromDatabase),
	"deviceAuth.list": (input, { open }) => readDeviceAuthTokensFromDatabase(open().db, input),
	"deviceAuth.store": write(storeDeviceAuthTokenInDatabase),
	"deviceAuth.storeOrigin": write(storeOriginDeviceTokenInDatabase),
	"deviceAuth.clear": write(clearDeviceAuthTokenFromDatabase),
	"deviceAuth.clearOrigin": write(clearOriginDeviceTokenInDatabase)
};
//#endregion
export { deviceAuthWorkerOperations };
