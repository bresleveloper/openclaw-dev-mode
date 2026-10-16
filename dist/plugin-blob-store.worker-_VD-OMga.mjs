import { l as runOpenClawStateWriteTransaction } from "./openclaw-state-db-D1jWDzK3.mjs";
import { a as pluginBlobClearInDatabase, c as pluginBlobDeleteInDatabase, d as wrapPluginBlobError, l as pluginBlobRegisterIfAbsentInDatabase, o as pluginBlobDeleteExpiredInDatabase, s as pluginBlobDeleteExpiredKeyInDatabase, t as pluginBlobWorkerOperations, u as pluginBlobRegisterInDatabase } from "./plugin-blob-worker-contract-BFrsKWDF.mjs";
//#region src/plugin-state/plugin-blob-store.worker.ts
function write(type, { open, stateOptions }, apply) {
	const options = stateOptions();
	const description = pluginBlobWorkerOperations[type];
	let opened = false;
	try {
		const database = open();
		opened = true;
		return runOpenClawStateWriteTransaction(({ db }) => apply(db, options.env), {
			...options,
			database
		});
	} catch (error) {
		throw wrapPluginBlobError(error, description.operation, opened ? "PLUGIN_BLOB_WRITE_FAILED" : "PLUGIN_BLOB_OPEN_FAILED", opened ? description.message : "Failed to open plugin blob store.", options.env, options.path);
	}
}
const pluginBlobOperations = {
	"pluginBlob.register": (input, context) => write("pluginBlob.register", context, (db, env) => pluginBlobRegisterInDatabase(db, {
		...input,
		env
	})),
	"pluginBlob.registerIfAbsent": (input, context) => write("pluginBlob.registerIfAbsent", context, (db, env) => pluginBlobRegisterIfAbsentInDatabase(db, {
		...input,
		env
	})),
	"pluginBlob.delete": (input, context) => write("pluginBlob.delete", context, (db) => pluginBlobDeleteInDatabase(db, input)),
	"pluginBlob.deleteExpiredKey": (input, context) => write("pluginBlob.deleteExpiredKey", context, (db, env) => pluginBlobDeleteExpiredKeyInDatabase(db, {
		...input,
		env
	})),
	"pluginBlob.deleteExpired": (input, context) => write("pluginBlob.deleteExpired", context, (db, env) => pluginBlobDeleteExpiredInDatabase(db, {
		...input,
		env
	})),
	"pluginBlob.clear": (input, context) => write("pluginBlob.clear", context, (db) => pluginBlobClearInDatabase(db, input))
};
//#endregion
export { pluginBlobOperations };
