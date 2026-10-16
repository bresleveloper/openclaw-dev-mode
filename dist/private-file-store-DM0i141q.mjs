import { n as tightenPrivateDirRootSync } from "./private-dir-mode-CfIQtph_.mjs";
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
//#endregion
export { privateFileStoreSync as n, privateFileStore as t };
