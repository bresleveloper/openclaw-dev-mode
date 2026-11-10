//#region src/config/io.types.ts
const configWriteCommittedSnapshot = Symbol("configWriteCommittedSnapshot");
const configWritePostCommitRollback = Symbol("configWritePostCommitRollback");
var ConfigRuntimeRefreshError = class extends Error {
	constructor(message, options) {
		super(message, options);
		this.name = "ConfigRuntimeRefreshError";
	}
};
//#endregion
export { configWriteCommittedSnapshot as n, configWritePostCommitRollback as r, ConfigRuntimeRefreshError as t };
