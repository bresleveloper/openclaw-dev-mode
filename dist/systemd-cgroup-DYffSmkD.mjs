import { t as hasErrnoCode } from "./errno-FR4CRyya.mjs";
import fs from "node:fs";
import path from "node:path";
//#region src/daemon/systemd-cgroup.ts
function systemdCgroupEventsPath(controlGroup) {
	if (!controlGroup.startsWith("/") || controlGroup === "/" || controlGroup.split("/").slice(1).some((part) => !part || part === ".." || part === ".")) throw new Error("The systemd cgroup cannot be verified.");
	return path.join("/sys/fs/cgroup", controlGroup, "cgroup.events");
}
function isSystemdControlGroupEmpty(controlGroup) {
	const file = systemdCgroupEventsPath(controlGroup);
	try {
		const events = fs.readFileSync(file, "utf8");
		const populated = /^populated ([01])$/mu.exec(events)?.[1];
		if (populated === void 0) throw new Error("The systemd cgroup population is unavailable.");
		return populated === "0";
	} catch (error) {
		if (hasErrnoCode(error, "ENOENT")) return true;
		throw error;
	}
}
//#endregion
export { isSystemdControlGroupEmpty as t };
