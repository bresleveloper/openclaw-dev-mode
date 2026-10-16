import { h as resolveClickClackAccount } from "./setup-surface-DcF_7-VV.mjs";
import { a as createClickClackClient, r as resolveWorkspaceId } from "./resolve-DPtjHQHt.mjs";
import { DEFAULT_ACCOUNT_ID } from "openclaw/plugin-sdk/account-id";
import { formatErrorMessage } from "openclaw/plugin-sdk/error-runtime";
import { hasConfiguredSecretInput } from "openclaw/plugin-sdk/setup";
//#region extensions/clickclack/src/setup-verify.ts
const GATEWAY_RUNNING_MESSAGE = "OpenClaw is running — ClickClack will connect automatically.";
const GATEWAY_NOT_RUNNING_MESSAGE = "Start OpenClaw to connect: openclaw gateway";
const GATEWAY_UNKNOWN_MESSAGE = "If OpenClaw is running it connects automatically; otherwise start it with: openclaw gateway";
function isHttpStatus(error, status) {
	return typeof error === "object" && error !== null && "status" in error && error.status === status;
}
function isWorkspaceNotFound(error) {
	return error instanceof Error && error.message.startsWith("ClickClack workspace not found:");
}
function usesUnavailableImplicitEnvToken(account, tokenOverride) {
	return account.accountId === DEFAULT_ACCOUNT_ID && Boolean(account.baseUrl && account.workspace) && !tokenOverride && !account.token && !hasConfiguredSecretInput(account.config.token) && !account.config.tokenFile?.trim();
}
async function checkClickClackSetupConnection(params) {
	let workspaceInput = "";
	try {
		const account = resolveClickClackAccount({
			cfg: params.cfg,
			accountId: params.accountId
		});
		workspaceInput = account.workspace;
		const token = params.token?.trim() || account.token;
		if (usesUnavailableImplicitEnvToken(account, token)) return { status: "skipped-env-token" };
		if (!account.baseUrl || !account.workspace || !token) return { status: "skipped-unconfigured" };
		const client = createClickClackClient({
			baseUrl: account.apiEndpoint,
			token
		});
		const me = await client.me();
		const workspaceId = await resolveWorkspaceId(client, account.workspace);
		const workspace = (await client.workspaces()).find((candidate) => candidate.id === workspaceId);
		if (!workspace) throw new Error(`ClickClack workspace not found: ${account.workspace}`);
		return {
			status: "connected",
			handle: me.handle,
			workspaceName: workspace.name
		};
	} catch (error) {
		if (isHttpStatus(error, 401)) return { status: "invalid-token" };
		if (isWorkspaceNotFound(error)) return {
			status: "workspace-not-found",
			workspace: workspaceInput
		};
		return {
			status: "failed",
			error: formatErrorMessage(error)
		};
	}
}
function isGatewayNotRunningError(error) {
	if (typeof error === "object" && error !== null && "name" in error && "kind" in error && "code" in error && error.name === "GatewayTransportError" && error.kind === "closed" && error.code === 1006) return true;
	const message = formatErrorMessage(error).toLowerCase();
	return message.includes("econnrefused") || message.includes("connection refused");
}
async function probeClickClackGatewayStatus() {
	try {
		const { callGatewayFromCli } = await import("openclaw/plugin-sdk/gateway-runtime");
		await callGatewayFromCli("health", {
			timeout: "1000",
			json: true
		}, void 0, {
			expectFinal: false,
			progress: false
		});
		return GATEWAY_RUNNING_MESSAGE;
	} catch (error) {
		return isGatewayNotRunningError(error) ? GATEWAY_NOT_RUNNING_MESSAGE : GATEWAY_UNKNOWN_MESSAGE;
	}
}
function formatClickClackConnectionLog(result) {
	switch (result.status) {
		case "connected": return `Connected as @${result.handle} — workspace ${result.workspaceName} resolved.`;
		case "invalid-token": return "ClickClack rejected the bot token (401). Copy a current token and rerun setup.";
		case "workspace-not-found": return `Workspace "${result.workspace}" was not found. Check the id, slug, or name, list available workspaces, and rerun setup.`;
		case "failed": return `Connection check failed: ${result.error}. Setup was saved; fix the connection and rerun setup.`;
		case "skipped-env-token": return "Token comes from CLICKCLACK_BOT_TOKEN; verification skipped.";
		case "skipped-unconfigured": return;
	}
}
async function verifyClickClackAccountAfterSetup(params) {
	try {
		const message = formatClickClackConnectionLog(await checkClickClackSetupConnection({
			cfg: params.cfg,
			accountId: params.accountId
		}));
		if (message) params.runtime.log(message);
	} catch (error) {
		params.runtime.log(`Connection check failed: ${formatErrorMessage(error)}. Setup was saved; fix the connection and rerun setup.`);
	}
	try {
		params.runtime.log(await probeClickClackGatewayStatus());
	} catch {
		params.runtime.log(GATEWAY_UNKNOWN_MESSAGE);
	}
}
//#endregion
export { checkClickClackSetupConnection, verifyClickClackAccountAfterSetup };
