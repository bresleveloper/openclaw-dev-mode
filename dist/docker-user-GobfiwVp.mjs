import fs from "node:fs/promises";
//#region src/agents/sandbox/docker-user.ts
async function resolveSandboxDockerUser(params) {
	if (params.docker.user?.trim()) return params.docker;
	const backend = params.backend.trim().toLowerCase();
	if (backend !== "docker" && backend !== "podman") return params.docker;
	const stat = params.stat ?? ((workspaceDir) => fs.stat(workspaceDir));
	try {
		const workspaceStat = await stat(params.workspaceDir);
		const uid = Number.isInteger(workspaceStat.uid) ? workspaceStat.uid : null;
		const gid = Number.isInteger(workspaceStat.gid) ? workspaceStat.gid : null;
		if (uid === null || gid === null || uid < 0 || gid < 0) return params.docker;
		if (backend === "podman" && (uid === 0 || gid === 0)) return params.docker;
		return {
			...params.docker,
			user: `${uid}:${gid}`
		};
	} catch {
		return params.docker;
	}
}
//#endregion
export { resolveSandboxDockerUser as t };
