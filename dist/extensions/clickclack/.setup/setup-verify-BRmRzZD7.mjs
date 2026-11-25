import { g as resolveClickClackAccountAsync } from "./setup-surface-DSbHN_QA.mjs";
import { a as createClickClackClient, i as ClickClackHttpError, t as findClickClackWorkspace } from "./resolve-qeIY2bou.mjs";
import { DEFAULT_ACCOUNT_ID } from "openclaw/plugin-sdk/account-id";
import { formatErrorMessage } from "openclaw/plugin-sdk/error-runtime";
import { hasConfiguredSecretInput } from "openclaw/plugin-sdk/setup";
// extensions/clickclack/src/setup-verify.ts
const GATEWAY_RUNNING_MESSAGE = "OpenClaw is running — ClickClack will connect automatically.";
const GATEWAY_NOT_RUNNING_MESSAGE = "Start OpenClaw to connect: openclaw gateway";
const GATEWAY_UNKNOWN_MESSAGE = "If OpenClaw is running it connects automatically; otherwise start it with: openclaw gateway";
function usesUnavailableImplicitEnvToken(account, tokenOverride) {
	return account.accountId === DEFAULT_ACCOUNT_ID && Boolean(account.baseUrl && account.workspace) && !tokenOverride && !account.token && !hasConfiguredSecretInput(account.config.token) && !account.config.tokenFile?.trim();
}
async function checkClickClackSetupConnection(params) {
	try {
		const account = await resolveClickClackAccountAsync({
			cfg: params.cfg,
			accountId: params.accountId
		});
		const token = params.token?.trim() || account.token;
		if (usesUnavailableImplicitEnvToken(account, token)) return { status: "skipped-env-token" };
		if (!account.baseUrl || !account.workspace || !token) return { status: "skipped-unconfigured" };
		const client = createClickClackClient({
			baseUrl: account.apiEndpoint,
			token
		});
		const me = await client.me();
		const workspaces = await client.workspaces();
		const workspace = account.workspace.startsWith("wsp_") ? workspaces.find((candidate) => candidate.id === account.workspace) : findClickClackWorkspace(workspaces, account.workspace);
		if (!workspace) return {
			status: "workspace-not-found",
			workspace: account.workspace
		};
		return {
			status: "connected",
			handle: me.handle,
			workspaceName: workspace.name
		};
	} catch (error) {
		if (error instanceof ClickClackHttpError && error.status === 401) return { status: "invalid-token" };
		return {
			status: "failed",
			error: formatErrorMessage(error)
		};
	}
}
async function probeClickClackGatewayStatus() {
	let gateway;
	try {
		gateway = await import("openclaw/plugin-sdk/gateway-runtime");
		await gateway.callGatewayFromCli("health", {
			timeout: "1000",
			json: true
		}, void 0, {
			expectFinal: false,
			progress: false
		});
		return GATEWAY_RUNNING_MESSAGE;
	} catch (error) {
		const message = formatErrorMessage(error).toLowerCase();
		return gateway && gateway.isGatewayTransportError(error) && error.kind === "closed" && error.code === 1006 || message.includes("econnrefused") || message.includes("connection refused") ? GATEWAY_NOT_RUNNING_MESSAGE : GATEWAY_UNKNOWN_MESSAGE;
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
	const message = formatClickClackConnectionLog(await checkClickClackSetupConnection({
		cfg: params.cfg,
		accountId: params.accountId
	}));
	if (message) params.runtime.log(message);
	params.runtime.log(await probeClickClackGatewayStatus());
}
export { checkClickClackSetupConnection, verifyClickClackAccountAfterSetup };
