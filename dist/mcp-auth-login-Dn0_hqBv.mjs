import { i as getPluginRuntimeGatewayRequestScope } from "./gateway-request-scope-BLBH-Gpf.mjs";
import { t as ErrorCodes } from "./gateway-error-details-D85F07e9.mjs";
import { dn as validateMcpAuthLoginParams } from "./src-BRUl7oDv.mjs";
import { f as errorShape } from "./error-codes-DvB36bCj.mjs";
import { n as resolveMcpTransportConfig } from "./mcp-transport-config-ByV7kR1W.mjs";
import { a as partitionMcpServersByConnectionScope } from "./mcp-connection-resolver-BWfIk8DO.mjs";
import { n as operatorMcpOAuthIdentity } from "./mcp-oauth-identity-BzvKk5cf.mjs";
import { f as startMcpOAuthAuthorization, o as completeOAuthCallback, t as cancelMcpOAuthAuthorization } from "./mcp-oauth-BoX-GO68.mjs";
import { r as createProviderBrowserAuthSession } from "./provider-browser-auth-pWTijt25.mjs";
import { t as assertValidParams } from "./validation-CFv_zneu.mjs";
import { t as WizardSession } from "./session-DiJJJpjA.mjs";
import { t as rejectExistingSetupWizardSession } from "./system-agent-setup-wizard-BrfITc81.mjs";
import { t as startWizardLogin } from "./wizard-login-0_o4fx_4.mjs";
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
	const server = context.getRuntimeConfig().mcp?.servers?.[params.serverName];
	const config = resolveMcpTransportConfig(params.serverName, server, { logWarnings: false });
	const methodRegistry = context.getGatewayMethodRegistry?.();
	const isOperatorOwned = () => {
		const current = context.getRuntimeConfig().mcp?.servers?.[params.serverName];
		return getPluginRuntimeGatewayRequestScope()?.pluginRegistry === methodRegistry?.pluginRegistry && current && Object.hasOwn(partitionMcpServersByConnectionScope({ [params.serverName]: current }).staticServers, params.serverName);
	};
	if (!server || server.enabled === false || config?.kind !== "http" || config.auth !== "oauth" || config.oauth?.authProfileId || !isOperatorOwned()) {
		reject("This connector cannot use operator browser sign-in. Check its existing account settings.");
		return;
	}
	if (!client.browserOrigin) {
		reject("Open Settings on this Gateway to sign in, or use openclaw mcp login in its terminal.");
		return;
	}
	const initialServer = structuredClone(server);
	const identity = operatorMcpOAuthIdentity(params.serverName, config.url);
	const assertCurrent = () => {
		client.connectionSignal?.throwIfAborted();
		if (client.invalidated || !client.connect.scopes?.includes("operator.admin")) throw new Error("Connector sign-in authority is no longer active.");
		if (context.getGatewayMethodRegistry?.() !== methodRegistry || !isDeepStrictEqual(initialServer, context.getRuntimeConfig().mcp?.servers?.[params.serverName]) || !isOperatorOwned()) throw new Error("This connector changed. Close this dialog and review its settings before signing in again.");
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
			} catch {
				throw failure();
			}
		}, { timeoutMs: 6e5 })
	});
} };
//#endregion
export { mcpAuthLoginHandlers };
