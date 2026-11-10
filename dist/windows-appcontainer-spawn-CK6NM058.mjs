import { createRequire } from "node:module";
//#region src/infra/windows-appcontainer-spawn.ts
var AppContainerSpawnUnsupportedError = class extends Error {
	constructor(uvVersion) {
		super(`AppContainer: libuv ${uvVersion} cannot create child pipes; 1.53.0+ required. Run OpenClaw outside the AppContainer or use a Node build with libuv >= 1.53.0.`);
		this.code = "APPCONTAINER_SPAWN_UNSUPPORTED";
		this.name = "AppContainerSpawnUnsupportedError";
	}
};
let checked = false;
let unsupported;
/** libuv before 1.53 loops forever creating child pipes in an AppContainer. */
function assertAppContainerSpawnSupported(stdio) {
	if (process.platform !== "win32") return;
	if (stdio === "ignore" || stdio === "inherit" || Array.isArray(stdio) && stdio.length >= 3 && stdio.every((entry) => entry !== void 0 && entry !== null && entry !== "pipe" && entry !== "overlapped" && entry !== "ipc" && !(typeof entry === "number" && entry < 0))) return;
	if (!checked) {
		checked = true;
		try {
			const { readCurrentAppContainerSid } = createRequire(import.meta.url)("@openclaw/proc-safe/windows-token");
			const sid = readCurrentAppContainerSid();
			const uv = process.versions.uv;
			const major = Number(uv.split(".")[0]);
			const minor = Number(uv.split(".")[1]);
			if (sid !== null && (major < 1 || major === 1 && minor < 53)) unsupported = new AppContainerSpawnUnsupportedError(uv);
		} catch (error) {
			import("./subsystem-BZ11qwdq.mjs").then(({ createSubsystemLogger }) => {
				createSubsystemLogger("process").debug("AppContainer token probe failed; allowing spawn", { error: String(error) });
			}).catch(() => {});
		}
	}
	if (unsupported) throw unsupported;
}
//#endregion
export { assertAppContainerSpawnSupported as n, AppContainerSpawnUnsupportedError as t };
