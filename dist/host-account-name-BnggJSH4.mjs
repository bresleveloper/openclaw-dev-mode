import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { n as runExec } from "./exec-Bf6uhUA7.mjs";
import fs from "node:fs/promises";
import os from "node:os";
//#region src/infra/host-account-name.ts
let cachedName;
async function readAccountCommand(command, args) {
	try {
		const { stdout } = await runExec(command, args, {
			timeoutMs: 1e3,
			maxBuffer: 16384,
			logOutput: false
		});
		return stdout;
	} catch {
		return null;
	}
}
async function readHostAccountName() {
	if (process.platform !== "darwin" && process.platform !== "linux") return null;
	const { username } = os.userInfo();
	const normalizeName = (value) => {
		const name = value?.trim();
		return name && name.toLowerCase() !== username.toLowerCase() ? truncateUtf16Safe(name, 256) : null;
	};
	if (process.platform === "darwin") {
		const fullName = normalizeName(await readAccountCommand("/usr/bin/id", ["-F"]));
		if (fullName) return fullName;
		return normalizeName((await readAccountCommand("/usr/bin/dscl", [
			".",
			"-read",
			`/Users/${username}`,
			"RealName"
		]))?.replace(/^RealName:\s*/u, ""));
	}
	const fields = (await readAccountCommand("getent", ["passwd", username]) ?? await fs.readFile("/etc/passwd", "utf8")).split("\n").find((line) => line.split(":", 1)[0] === username)?.split(":");
	return normalizeName(fields?.[4]?.split(",", 1)[0]);
}
/** Best-effort human name for the gateway host account; never seeds a login name. */
function resolveHostAccountName() {
	return cachedName ??= readHostAccountName().catch(() => null);
}
//#endregion
export { resolveHostAccountName as t };
