import { n as getWindowsInstallRoots } from "./windows-install-roots-Qi4d52Il.mjs";
import { t as resolveSystemBin } from "./resolve-system-bin-DzBc-jWt.mjs";
import path from "node:path";
//#region src/infra/ssh-client.ts
function resolveSshClient() {
	if (process.platform !== "win32") return resolveSystemBin("ssh", { trust: "strict" });
	const { systemRoot } = getWindowsInstallRoots();
	const openSshDir = path.win32.join(systemRoot, "System32", "OpenSSH");
	return resolveSystemBin("ssh", {
		trust: "strict",
		extraDirs: [openSshDir]
	});
}
//#endregion
export { resolveSshClient as t };
