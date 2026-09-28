import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { i as isWorkerDesktopUsername, n as isWorkerDesktopArgs, r as isWorkerDesktopString } from "./worker-desktop-descriptor-DZyj9bOd.mjs";
import { t as hasExactOwnKeys } from "./protocol-record-sxcNOJSy.mjs";
import path from "node:path";
//#region src/gateway/worker-environments/desktop-endpoint.ts
const MAX_WORKER_DESKTOP_APPS = 8;
function isAbsoluteDesktopPath(value) {
	return isWorkerDesktopString(value) && (path.posix.isAbsolute(value) || path.win32.isAbsolute(value));
}
function normalizeWorkerDesktopEndpoint(value) {
	if (!isRecord(value) || value.protocol !== "rfb") throw new Error("Worker environment desktop protocol must be \"rfb\"");
	if (!hasExactOwnKeys(value, ["protocol", "port"], [
		"passwordFilePath",
		"username",
		"apps",
		"allowsResize"
	])) throw new Error("Worker environment desktop endpoint contains unknown fields");
	if (typeof value.port !== "number" || !Number.isSafeInteger(value.port) || value.port < 1 || value.port > 65535) throw new Error("Worker environment desktop port must be an integer from 1 through 65535");
	const passwordFilePath = value.passwordFilePath;
	if (passwordFilePath !== void 0 && !isAbsoluteDesktopPath(passwordFilePath)) throw new Error("Worker environment desktop password file path must be absolute");
	if (value.allowsResize !== void 0 && typeof value.allowsResize !== "boolean") throw new Error("Worker environment desktop allowsResize must be a boolean");
	if (value.username !== void 0 && (!isWorkerDesktopUsername(value.username) || !passwordFilePath)) throw new Error("Worker environment desktop username requires a bounded ARD account and password file");
	if (value.apps !== void 0 && !Array.isArray(value.apps)) throw new Error("Worker environment desktop apps must be an array");
	if ((value.apps?.length ?? 0) > MAX_WORKER_DESKTOP_APPS) throw new Error(`Worker environment desktop apps cannot exceed ${MAX_WORKER_DESKTOP_APPS}`);
	const seenAppIds = /* @__PURE__ */ new Set();
	const apps = (value.apps ?? []).map((app) => {
		if (!isRecord(app) || app.id !== "browser" && app.id !== "terminal") throw new Error("Worker environment desktop app id must be \"browser\" or \"terminal\"");
		if (seenAppIds.has(app.id)) throw new Error(`Worker environment desktop app id ${app.id} must be unique`);
		seenAppIds.add(app.id);
		if (!isAbsoluteDesktopPath(app.executablePath)) throw new Error("Worker environment desktop app executable path must be absolute");
		if (app.args !== void 0 && !isWorkerDesktopArgs(app.args)) throw new Error("Worker environment desktop app args must be bounded strings");
		let normalized;
		if (app.id === "terminal") {
			if (!hasExactOwnKeys(app, ["id", "executablePath"], ["args"])) throw new Error("Worker environment terminal desktop app contains unknown fields");
			normalized = {
				id: "terminal",
				executablePath: app.executablePath
			};
		} else {
			if (!hasExactOwnKeys(app, [
				"id",
				"executablePath",
				"cdpPort"
			], ["args"])) throw new Error("Worker environment browser desktop app contains unknown fields");
			if (typeof app.cdpPort !== "number" || !Number.isSafeInteger(app.cdpPort) || app.cdpPort < 1 || app.cdpPort > 65535) throw new Error("Worker environment browser CDP port must be an integer from 1 through 65535");
			normalized = {
				id: "browser",
				executablePath: app.executablePath,
				cdpPort: app.cdpPort
			};
		}
		if (app.args !== void 0) normalized.args = [...app.args];
		return normalized;
	});
	return {
		protocol: "rfb",
		port: value.port,
		...passwordFilePath === void 0 ? {} : { passwordFilePath },
		...value.username === void 0 ? {} : { username: value.username },
		...value.allowsResize === void 0 ? {} : { allowsResize: value.allowsResize },
		...value.apps === void 0 ? {} : { apps }
	};
}
//#endregion
export { normalizeWorkerDesktopEndpoint as t };
