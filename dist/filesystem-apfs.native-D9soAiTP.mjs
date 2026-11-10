import { t as nativeWorktreeFilesystem } from "./filesystem-native-DBf2aPxS.mjs";
//#region src/agents/worktrees/filesystem-apfs.native.ts
const apfsFilesystem = { async readDirectoryAcl(directory, options) {
	const acl = await nativeWorktreeFilesystem.readAcl(directory, options);
	return acl.kind === "unknown" ? void 0 : acl.kind === "none" ? "none" : acl.inheritsToFiles || acl.inheritsToDirectories ? "inheritable" : "non-inheritable";
} };
//#endregion
export { apfsFilesystem };
