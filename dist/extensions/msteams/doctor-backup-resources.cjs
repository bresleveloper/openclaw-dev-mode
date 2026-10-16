Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const require_rolldown_runtime = require("./.setup/rolldown-runtime-BloeesfJ.cjs");
let node_path = require("node:path");
node_path = require_rolldown_runtime.__toESM(node_path, 1);
//#region extensions/msteams/doctor-backup-resources.ts
function stateFileArchiveDirectory(filePath) {
	return `${filePath}.archives`;
}
function stateFileBackupResources(stateDir, filename) {
	const filePath = node_path.default.join(stateDir, filename);
	return [{
		path: filePath,
		kind: "file"
	}, {
		path: stateFileArchiveDirectory(filePath),
		kind: "directory"
	}];
}
//#endregion
exports.stateFileArchiveDirectory = stateFileArchiveDirectory;
exports.stateFileBackupResources = stateFileBackupResources;
