import { n as markPrivateDirectoryCreationRefused } from "./private-directory-creation-DNydTBRE.mjs";
import path from "node:path";
import { createDirectorySync, createFileSync } from "@openclaw/fs-safe/advanced";
import { FsSafeError } from "@openclaw/fs-safe/errors";
//#region src/infra/windows-private-directory.ts
function createPrivateWindowsDirectory(directoryPath) {
	let attempted = false;
	try {
		createDirectorySync(path.resolve(directoryPath), {
			private: true,
			assertBeforeMutation() {
				attempted = true;
			}
		});
	} catch (error) {
		if (!attempted || error instanceof FsSafeError && error.code === "already-exists") throw markPrivateDirectoryCreationRefused(error);
		throw error;
	}
}
function createPrivateWindowsFile(filePath) {
	return createFileSync(path.resolve(filePath), { private: true });
}
//#endregion
export { createPrivateWindowsFile as n, createPrivateWindowsDirectory as t };
