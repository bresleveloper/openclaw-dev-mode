import { i as getAgentWorkspaceAccess, t as WorkspaceAccessUnavailableError } from "./workspace-access-BNUXOhfF.mjs";
import "./memory-core-host-engine-storage-Dt5aD7j9.mjs";
import { a as listMemoryFiles } from "./internal-CDL7w83q.mjs";
import "./agent-workspace-runtime-DioN1Z8u.mjs";
import fs from "node:fs/promises";
//#region extensions/memory-core/src/memory-workspace-files.ts
function getMemoryWorkspaceMaintenance(workspaceDir) {
	const access = getAgentWorkspaceAccess(workspaceDir, "memoryFiles");
	if (!access?.memoryFiles) return;
	const files = access.memoryFiles.maintenance;
	if (!files) throw new WorkspaceAccessUnavailableError("Remote Memory maintenance is unavailable");
	return files;
}
async function readWorkspaceFile(workspaceDir, filePath) {
	const files = getMemoryWorkspaceMaintenance(workspaceDir);
	return files ? await files.readFile(filePath) : await fs.readFile(filePath);
}
async function readWorkspaceText(workspaceDir, filePath) {
	return (await readWorkspaceFile(workspaceDir, filePath)).toString("utf8");
}
async function accessWorkspacePath(workspaceDir, filePath) {
	const files = getMemoryWorkspaceMaintenance(workspaceDir);
	if (files) await files.stat(filePath, true);
	else await fs.access(filePath);
}
async function inspectWorkspaceFile(workspaceDir, filePath, followSymlinks = true) {
	const files = getMemoryWorkspaceMaintenance(workspaceDir);
	if (!files) return followSymlinks ? await fs.stat(filePath) : await fs.lstat(filePath);
	const info = await files.stat(filePath, followSymlinks);
	return {
		...info,
		isFile: () => info.isFile,
		isDirectory: () => info.isDirectory,
		isSymbolicLink: () => info.isSymbolicLink
	};
}
async function listWorkspaceDirectory(workspaceDir, directory) {
	const files = getMemoryWorkspaceMaintenance(workspaceDir);
	if (!files) return await fs.readdir(directory, { withFileTypes: true });
	return (await files.listDirectory(directory)).map((entry) => ({
		name: entry.name,
		isFile: () => entry.isFile,
		isDirectory: () => entry.isDirectory,
		isSymbolicLink: () => entry.isSymbolicLink
	}));
}
async function makeWorkspaceDirectory(workspaceDir, directory) {
	const files = getMemoryWorkspaceMaintenance(workspaceDir);
	if (files) await files.mkdir(directory);
	else await fs.mkdir(directory, { recursive: true });
}
async function renameWorkspacePath(workspaceDir, from, to) {
	const files = getMemoryWorkspaceMaintenance(workspaceDir);
	if (files) await files.rename(from, to);
	else await fs.rename(from, to);
}
const listWorkspaceMemoryFiles = async (workspaceDir, ...args) => {
	const access = getAgentWorkspaceAccess(workspaceDir, "memoryFiles");
	if (!access?.memoryFiles) return await listMemoryFiles(workspaceDir, ...args);
	return await access.memoryFiles.listFiles(workspaceDir, ...args);
};
//#endregion
export { listWorkspaceMemoryFiles as a, readWorkspaceText as c, listWorkspaceDirectory as i, renameWorkspacePath as l, getMemoryWorkspaceMaintenance as n, makeWorkspaceDirectory as o, inspectWorkspaceFile as r, readWorkspaceFile as s, accessWorkspacePath as t };
