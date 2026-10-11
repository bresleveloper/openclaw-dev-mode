import { A as writeExternalFileWithinRoot } from "../../fs-safe-BAPek8At.mjs";
import { t as definePluginEntry } from "../../plugin-entry-BOulgRcx.mjs";
import { n as resolveExistingPathsWithinRoot } from "../../security-runtime-ByyEMO4I.mjs";
import { n as redactCdpUrl } from "../../browser-cdp-nPpqdqz_.mjs";
import { f as DEFAULT_OPENCLAW_BROWSER_COLOR, m as DEFAULT_OPENCLAW_BROWSER_PROFILE_NAME, r as DEFAULT_AI_SNAPSHOT_MAX_CHARS, s as DEFAULT_BROWSER_EVALUATE_ENABLED } from "../../constants-DKjTvIBP.mjs";
import { i as resolveBrowserConfig, s as resolveProfile } from "../../config-fMVye_Fl.mjs";
import { t as getBrowserProfileCapabilities } from "../../profile-capabilities-B30ig3n7.mjs";
import { n as installBrowserAuthMiddleware, r as installBrowserCommonMiddleware } from "../../server-middleware-D887snGq.mjs";
import "../../sdk-security-runtime-2gfwJ1JS.mjs";
import { r as DEFAULT_UPLOAD_DIR } from "../../paths-B0Z-_Wjx.mjs";
import { i as readBrowserVersion, n as resolveGoogleChromeExecutableForPlatform, r as parseBrowserMajorVersion } from "../../chrome.executables-Cv2wahLt.mjs";
import { r as stopBrowserRuntime, t as createBrowserRuntimeState } from "../../runtime-lifecycle-DCMsaKfz.mjs";
import { a as trackSessionBrowserTab, n as closeTrackedBrowserTabsForSessions, o as untrackSessionBrowserTab } from "../../session-tab-registry-DaiCgrX0.mjs";
import { n as stopBrowserBridgeServer, t as startBrowserBridgeServer } from "../../bridge-server-E_nOIhYz.mjs";
import { n as resolveBrowserControlAuth, t as ensureBrowserControlAuth } from "../../control-auth-5f148hOr.mjs";
import { t as movePathToTrash } from "../../trash-CAu63IBo.mjs";
import { _ as browserTabs, a as browserDoctor, c as browserOpenTab, d as browserSnapshot, f as browserStart, g as browserTabAction, i as browserDeleteProfile, l as browserProfiles, m as browserStop, o as browserFocusTab, p as browserStatus, r as browserCreateProfile, t as browserCloseTab, u as browserResetProfile } from "../../client-DmUO9wMd.mjs";
import { a as runBrowserProxyCommand, c as browserPdfSave, d as browserArmFileChooser, f as browserNavigate, l as browserAct, n as browserHandlers, o as createBrowserTool, p as browserScreenshotAction, r as handleBrowserGatewayRequest, s as browserConsoleMessages, t as createBrowserPluginService, u as browserArmDialog } from "../../plugin-service-yBMUokkD.mjs";
import { a as resolveRequestedBrowserProfile, i as normalizeBrowserRequestPath, r as isPersistentBrowserProfileMutation, t as registerBrowserRoutes } from "../../routes-BmqU2ILD.mjs";
import { x as closePlaywrightBrowserConnection } from "../../pw-tools-core.interactions.navigation-D7biRzcw.mjs";
import { t as createBrowserRouteContext } from "../../server-context-zGtV-U3z.mjs";
import { r as getBrowserControlState, t as createBrowserControlContext } from "../../browser-control-state-hl_UHxa3.mjs";
import { n as normalizeBrowserFormField, r as normalizeBrowserFormFieldValue } from "../../form-fields-PPIIbhqD.mjs";
import { t as createBrowserRouteDispatcher } from "../../dispatcher-CizRR8Q-.mjs";
import { n as stopBrowserControlService, t as startBrowserControlServiceFromConfig } from "../../control-service-CN3nO4nz.mjs";
import { t as registerBrowserCli } from "../../browser-cli-CqpWEXHa.mjs";
import path from "node:path";
import { chmod, copyFile } from "node:fs/promises";
import { randomBytes } from "node:crypto";
//#region extensions/browser/src/attached-browser-tool-runtime.ts
/**
* Attach-only Browser tool runtime for a caller-owned loopback Chrome process.
*
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
	let parsed;
	try {
		parsed = new URL(raw);
	} catch {
		throw new Error("Attached Browser CDP URL must be a loopback HTTP URL with an explicit port.");
	}
	const port = Number(parsed.port);
	if (parsed.protocol !== "http:" || parsed.hostname !== "127.0.0.1" || parsed.username !== "" || parsed.password !== "" || parsed.port === "" || !Number.isInteger(port) || port < 1 || port > 65535 || parsed.pathname !== "/" || parsed.search !== "" || parsed.hash !== "") throw new Error("Attached Browser CDP URL must be a loopback HTTP URL with an explicit port.");
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
export { DEFAULT_AI_SNAPSHOT_MAX_CHARS, DEFAULT_BROWSER_EVALUATE_ENABLED, DEFAULT_OPENCLAW_BROWSER_COLOR, DEFAULT_OPENCLAW_BROWSER_PROFILE_NAME, DEFAULT_UPLOAD_DIR, browserAct, browserArmDialog, browserArmFileChooser, browserCloseTab, browserConsoleMessages, browserCreateProfile, browserDeleteProfile, browserDoctor, browserFocusTab, browserHandlers, browserNavigate, browserOpenTab, browserPdfSave, browserProfiles, browserResetProfile, browserScreenshotAction, browserSnapshot, browserStart, browserStatus, browserStop, browserTabAction, browserTabs, closeTrackedBrowserTabsForSessions, createAttachedBrowserToolRuntime, createBrowserControlContext, createBrowserPluginService, createBrowserRouteContext, createBrowserRouteDispatcher, createBrowserRuntimeState, createBrowserTool, definePluginEntry, ensureBrowserControlAuth, getBrowserControlState, getBrowserProfileCapabilities, handleBrowserGatewayRequest, installBrowserAuthMiddleware, installBrowserCommonMiddleware, isPersistentBrowserProfileMutation, movePathToTrash, normalizeBrowserFormField, normalizeBrowserFormFieldValue, normalizeBrowserRequestPath, parseBrowserMajorVersion, readBrowserVersion, redactCdpUrl, registerBrowserCli, registerBrowserRoutes, resolveBrowserConfig, resolveBrowserControlAuth, resolveExistingPathsWithinRoot, resolveGoogleChromeExecutableForPlatform, resolveProfile, resolveRequestedBrowserProfile, runBrowserProxyCommand, startBrowserBridgeServer, startBrowserControlServiceFromConfig, stopBrowserBridgeServer, stopBrowserControlService, stopBrowserRuntime, trackSessionBrowserTab, untrackSessionBrowserTab };
