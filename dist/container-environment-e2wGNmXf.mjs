import fs from "node:fs";
//#region src/infra/container-environment.ts
let containerEnvironmentCache;
function isContainerEnvironment() {
	return containerEnvironmentCache ??= detectContainerEnvironment();
}
function detectContainerEnvironment() {
	if (process.env.FLY_MACHINE_ID?.trim() && process.env.FLY_APP_NAME?.trim()) return true;
	for (const sentinelPath of [
		"/.dockerenv",
		"/run/.containerenv",
		"/var/run/.containerenv"
	]) try {
		fs.accessSync(sentinelPath, fs.constants.F_OK);
		return true;
	} catch {}
	try {
		const cgroup = fs.readFileSync("/proc/1/cgroup", "utf8");
		if (/\/docker\/|cri-containerd-[0-9a-f]|containerd\/[0-9a-f]{64}|\/kubepods[/.]|\blxc\b/.test(cgroup)) return true;
	} catch {}
	return false;
}
//#endregion
export { isContainerEnvironment as t };
