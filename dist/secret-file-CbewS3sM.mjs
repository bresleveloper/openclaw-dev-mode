import { s as readSecretFileSync, t as DEFAULT_SECRET_FILE_MAX_BYTES } from "./secret-file-B_nJw6pE.mjs";
//#region src/acp/secret-file.ts
/** Reads an ACP secret file with the shared secret-file size and symlink policy. */
function readSecretFromFile(filePath, label) {
	return readSecretFileSync(filePath, label, {
		maxBytes: DEFAULT_SECRET_FILE_MAX_BYTES,
		rejectSymlink: true
	});
}
//#endregion
export { readSecretFromFile as t };
