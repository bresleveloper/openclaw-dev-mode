import { r as tightenPrivateDirRootSync, t as readExistingStateRootMode } from "./private-dir-mode-BBICrnrB.mjs";
import path from "node:path";
import { fileStore, fileStoreSync } from "@openclaw/fs-safe/store";
//#region src/infra/private-file-store.ts
const PRIVATE_STORE_DIR_MODE = 448;
/** Create an async private file store rooted at `rootDir`. */
function privateFileStore(rootDir) {
	tightenPrivateDirRootSync(rootDir, PRIVATE_STORE_DIR_MODE);
	return fileStore({
		rootDir,
		private: true
	});
}
/** Create a sync private file store rooted at `rootDir`. */
function privateFileStoreSync(rootDir) {
	tightenPrivateDirRootSync(rootDir, PRIVATE_STORE_DIR_MODE);
	return fileStoreSync({
		rootDir,
		private: true
	});
}
/** Root-level state files stay private without treating the shared root as a private store. */
function writePrivateTextFileAtomicSync(filePath, content, stateDir) {
	const directory = path.dirname(filePath);
	const dirMode = readExistingStateRootMode(directory, stateDir);
	if (dirMode === void 0 || dirMode === PRIVATE_STORE_DIR_MODE) {
		privateFileStoreSync(directory).writeText(path.basename(filePath), content);
		return;
	}
	fileStoreSync({
		rootDir: directory,
		private: true,
		dirMode
	}).writeText(path.basename(filePath), content);
}
//#endregion
export { privateFileStoreSync as n, writePrivateTextFileAtomicSync as r, privateFileStore as t };
