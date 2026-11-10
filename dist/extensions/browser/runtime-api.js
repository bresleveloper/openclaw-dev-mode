import { j as writeExternalFileWithinRoot } from "../../fs-safe-6Z4UiMS4.mjs";
import { i as resolveExistingPathsWithinRoot } from "../../security-runtime-6domDoE8.mjs";
import { t as createBrowserToolDefinition } from "../../browser-tool-description-C4fzwnZx.mjs";
import { i as resolveBrowserConfig } from "../../config-xjgIR3E-.mjs";
import "../../paths-J645nsQI.mjs";
import { x as closePlaywrightBrowserConnection } from "../../pw-tools-core.interactions.navigation-B9IyIsIy.mjs";
import { n as stopBrowserBridgeServer, t as startBrowserBridgeServer } from "../../bridge-server-oi4PHPzX.mjs";
import { i as createBrowserTool, t as browserHandlers } from "../../browser-request-6GApw1ft.mjs";
import { randomBytes } from "node:crypto";
import { chmod, copyFile } from "node:fs/promises";
import path from "node:path";
//#region extensions/browser/src/attached-browser-tool-runtime.ts
/**
* The bridge owns only authenticated Browser HTTP ingress. Chrome remains owned
* by the caller and survives bridge disposal.
*/
const ATTACHED_PROFILE_NAME = "worker";
async function persistAttachedScreenshot(params) {
	const extension = params.type === "jpeg" ? "jpg" : "png";
	const fileName = `screenshot-${randomBytes(8).toString("hex")}.${extension}`;
	return (await writeExternalFileWithinRoot({
		rootDir: params.workspaceDir,
		path: path.join(".artifacts", "cloud-worker-browser", fileName),
		fallbackFileName: fileName,
		write: async (stagedPath) => {
			await copyFile(params.sourcePath, stagedPath);
			await chmod(stagedPath, 384);
		}
	})).path;
}
function normalizeAttachedCdpUrl(raw) {
	const parsed = URL.parse(raw);
	if (!parsed || parsed.protocol !== "http:" || parsed.hostname !== "127.0.0.1" || parsed.username !== "" || parsed.password !== "" || parsed.port === "" || Number(parsed.port) < 1 || parsed.pathname !== "/" || parsed.search !== "" || parsed.hash !== "") throw new Error("Attached Browser CDP URL must be a loopback HTTP URL with an explicit port.");
	return parsed.toString().replace(/\/$/u, "");
}
/** Create a normal Browser agent tool pinned to one raw, attach-only CDP profile. */
async function createAttachedBrowserToolRuntime(params) {
	const cdpUrl = normalizeAttachedCdpUrl(params.cdpUrl);
	const resolved = resolveBrowserConfig({
		enabled: true,
		attachOnly: true,
		cdpUrl,
		defaultProfile: ATTACHED_PROFILE_NAME,
		profiles: { [ATTACHED_PROFILE_NAME]: {
			driver: "openclaw",
			attachOnly: true,
			cdpUrl
		} }
	});
	resolved.profiles = { [ATTACHED_PROFILE_NAME]: {
		driver: "openclaw",
		attachOnly: true,
		cdpUrl
	} };
	resolved.extensionRelayPorts = {};
	resolved.extensionRelayInternalTokens = {};
	const bridge = await startBrowserBridgeServer({
		resolved,
		host: "127.0.0.1",
		port: 0,
		authToken: randomBytes(32).toString("base64url"),
		onEnsureAttachTarget: async () => await params.ensureAttachTarget()
	});
	const dispose = async () => {
		try {
			await stopBrowserBridgeServer(bridge.server);
		} finally {
			await closePlaywrightBrowserConnection({ cdpUrl });
		}
	};
	try {
		return {
			tool: createBrowserTool({
				sandboxBridgeUrl: bridge.baseUrl,
				allowHostControl: false,
				...params.agentSessionKey !== void 0 ? { agentSessionKey: params.agentSessionKey } : {},
				...params.agentDir !== void 0 ? { agentDir: params.agentDir } : {},
				...params.workspaceDir !== void 0 ? { workspaceDir: params.workspaceDir } : {},
				screenshotResultMode: "path",
				persistScreenshot: async ({ sourcePath, type }) => await persistAttachedScreenshot({
					sourcePath,
					workspaceDir: params.workspaceDir,
					type
				})
			}),
			dispose
		};
	} catch (error) {
		await dispose();
		throw error;
	}
}
//#endregion
export { browserHandlers, createAttachedBrowserToolRuntime, createBrowserToolDefinition, resolveExistingPathsWithinRoot };
