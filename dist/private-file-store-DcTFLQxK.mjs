import "./fs-safe-defaults-D3xd3zKO.mjs";
import { n as tightenPrivateDirRootSync } from "./private-dir-mode-CfIQtph_.mjs";
import { fileStore, fileStoreSync } from "@openclaw/fs-safe/store";
//#region src/infra/private-file-store.ts
const PRIVATE_STORE_DIR_MODE = 448;
function tightenPrivateStoreRoot(rootDir) {
	tightenPrivateDirRootSync(rootDir, PRIVATE_STORE_DIR_MODE);
}
/** Create an async private file store rooted at `rootDir`. */
function privateFileStore(rootDir) {
	tightenPrivateStoreRoot(rootDir);
	return fileStore({
		rootDir,
		private: true
	});
}
/** Create a sync private file store rooted at `rootDir`. */
function privateFileStoreSync(rootDir) {
	tightenPrivateStoreRoot(rootDir);
	return fileStoreSync({
		rootDir,
		private: true
	});
}
//#endregion
export { privateFileStoreSync as n, privateFileStore as t };
