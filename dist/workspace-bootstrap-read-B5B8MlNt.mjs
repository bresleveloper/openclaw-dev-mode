import { s as readFileDescriptorBounded } from "./boundary-file-read-CCth2Hwg.mjs";
//#region src/agents/workspace-bootstrap-read.ts
const MAX_WORKSPACE_BOOTSTRAP_FILE_BYTES = 2097152;
async function readWorkspaceBootstrapFile(fd) {
	return (await readFileDescriptorBounded(fd, MAX_WORKSPACE_BOOTSTRAP_FILE_BYTES)).toString("utf-8");
}
//#endregion
export { readWorkspaceBootstrapFile as n, MAX_WORKSPACE_BOOTSTRAP_FILE_BYTES as t };
