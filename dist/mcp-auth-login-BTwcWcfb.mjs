import { o as getPluginRuntimeGatewayRequestScope } from "./gateway-request-scope-1BXD1G3l.mjs";
import { i as getGatewayPluginMetadataSnapshot } from "./current-plugin-metadata-state-jN_Zk4yK.mjs";
import { Mn as validateMcpAuthLoginParams, Ng as errorShape } from "./src-pLJQA6J5.mjs";
import { t as ErrorCodes } from "./gateway-error-details-Cl-eEOTQ.mjs";
import { t as WizardSession } from "./session-BK80iJWA.mjs";
import { n as ProviderBrowserSignInUnavailableError, r as createProviderBrowserAuthSession } from "./provider-browser-auth-Dq6ILb54.mjs";
import { t as assertValidParams } from "./validation--xIH1Pj-.mjs";
import { n as operatorMcpOAuthIdentity } from "./mcp-oauth-identity-0fgjEqV6.mjs";
import { f as startMcpOAuthAuthorization, o as completeOAuthCallback, t as cancelMcpOAuthAuthorization } from "./mcp-oauth-CmP8pTjC.mjs";
import { n as resolveOperatorMcpOAuthConnection } from "./mcp-auth-status-DRmnzE_5.mjs";
import { r as startWizardLogin, t as rejectExistingSetupWizardSession } from "./system-agent-setup-wizard-QsNyCX4k.mjs";
import { isDeepStrictEqual } from "node:util";
//#region src/gateway/server-methods/mcp-auth-login.ts
const mcpAuthLoginHandlers = { "mcp.authLogin": async ({ params, respond, context, client }) => {
	if (!assertValidParams(params, validateMcpAuthLoginParams, "mcp.authLogin", respond)) return;
	const reject = (message) => respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, message));
	if (!client || !client.connect.scopes?.includes("operator.admin")) {
		reject("Connector sign-in requires an administrator connection.");
		return;
	}
	if (rejectExistingSetupWizardSession({
		sessionId: params.sessionId,
		context,
		respond
	})) return;
	const metadata = getGatewayPluginMetadataSnapshot();
	const resolveConnection = () => resolveOperatorMcpOAuthConnection({
		config: context.getRuntimeConfig(),
		metadata,
		serverName: params.serverName
	});
	const connection = resolveConnection();
	const methodRegistry = context.getGatewayMethodRegistry?.();
	const isOperatorOwned = () => getGatewayPluginMetadataSnapshot() === metadata && getPluginRuntimeGatewayRequestScope()?.pluginRegistry === methodRegistry?.pluginRegistry;
	if (!connection || !isOperatorOwned()) {
		reject("This connector cannot use operator browser sign-in. Check its existing account settings.");
		return;
	}
	if (!client.browserOrigin) {
		reject("Open Settings on this Gateway to sign in, or use openclaw mcp login in its terminal.");
		return;
	}
	const { config } = connection;
	const initialServer = structuredClone(connection.server);
	const identity = operatorMcpOAuthIdentity(params.serverName, config.url);
	const assertCurrent = () => {
		client.connectionSignal?.throwIfAborted();
		if (client.invalidated || !client.connect.scopes?.includes("operator.admin")) throw new Error("Connector sign-in authority is no longer active.");
		if (context.getGatewayMethodRegistry?.() !== methodRegistry || !isDeepStrictEqual(initialServer, resolveConnection()?.server) || !isOperatorOwned()) throw new Error("This connector changed. Close this dialog and review its settings before signing in again.");
	};
	await startWizardLogin({
		client,
		context,
		sessionId: params.sessionId,
		respond,
		assertCurrent,
		createSession: () => new WizardSession(async (prompter, signal, runner) => {
			let attemptState;
			let saved = false;
			const browser = createProviderBrowserAuthSession({
				signal: AbortSignal.any([signal, ...client.connectionSignal ? [client.connectionSignal] : []]),
				browserOrigin: client.browserOrigin,
				openUrl: async (url) => {
					login.assertCurrent();
					await prompter.openUrl?.(url);
					login.assertCurrent();
				}
			});
			const login = {
				signal: browser.signal,
				assertCurrent: () => {
					signal.throwIfAborted();
					assertCurrent();
					browser.assertCurrent();
				},
				onAuthorizationPublished: (state) => {
					attemptState = state;
				},
				beforeTokensSaved: () => runner.lockCancellation(),
				onTokensSaved: () => {
					saved = true;
				}
			};
			const failure = () => /* @__PURE__ */ new Error(saved ? "Authentication saved, but sign-in cleanup did not finish. Close this dialog and check the connector before trying again." : "Sign-in did not finish. Check the connector settings and try again, or run openclaw mcp login with this connector's name in this Gateway's terminal.");
			try {
				try {
					const result = await browser.authorizePrepared({
						timeoutMs: 6e5,
						prepare: async (redirectUrl) => {
							const started = await startMcpOAuthAuthorization(identity, config, {
								redirectUrl,
								login
							});
							return started.status === "authorized" ? { result: "authorized" } : started;
						}
					});
					if (result !== "authorized" && await completeOAuthCallback(identity, config, result, login) !== "authorized") throw failure();
				} finally {
					browser.close();
					if (attemptState) await cancelMcpOAuthAuthorization(identity, attemptState);
				}
			} catch (error) {
				throw error instanceof ProviderBrowserSignInUnavailableError ? error : failure();
			}
		}, { timeoutMs: 6e5 })
	});
} };
//#endregion
export { mcpAuthLoginHandlers };
