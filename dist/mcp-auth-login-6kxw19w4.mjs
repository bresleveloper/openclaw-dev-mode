import { a as getPluginRuntimeGatewayRequestScope } from "./gateway-request-scope-BSmCVVpP.mjs";
import { n as operatorMcpOAuthIdentity } from "./mcp-oauth-identity-BAZLWoC_.mjs";
import { pn as validateMcpAuthLoginParams } from "./src-l2dWvEsN.mjs";
import { t as ErrorCodes } from "./gateway-error-details-DIefe7Zy.mjs";
import { f as errorShape } from "./error-codes-Dh56LniQ.mjs";
import { r as createProviderBrowserAuthSession } from "./provider-browser-auth-WgSgTn1j.mjs";
import { f as startMcpOAuthAuthorization, o as completeOAuthCallback, t as cancelMcpOAuthAuthorization } from "./mcp-oauth-BK2ZqNG7.mjs";
import { t as resolveOperatorMcpOAuthConfig } from "./mcp-operator-auth-CB1S0Mkd.mjs";
import { t as assertValidParams } from "./validation-Bu27N0nv.mjs";
import { t as WizardSession } from "./session-B7kDP8zD.mjs";
import { t as rejectExistingSetupWizardSession } from "./system-agent-setup-wizard-0DiUp4zl.mjs";
import { t as startWizardLogin } from "./wizard-login-Cc3IGQAP.mjs";
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
	const config = resolveOperatorMcpOAuthConfig(params.serverName, server);
	const methodRegistry = context.getGatewayMethodRegistry?.();
	const isOperatorOwned = () => {
		const current = context.getRuntimeConfig().mcp?.servers?.[params.serverName];
		return getPluginRuntimeGatewayRequestScope()?.pluginRegistry === methodRegistry?.pluginRegistry && resolveOperatorMcpOAuthConfig(params.serverName, current) !== void 0;
	};
	if (!config || !isOperatorOwned()) {
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
