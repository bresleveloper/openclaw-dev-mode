import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { i as GATEWAY_CLIENT_NAMES, r as GATEWAY_CLIENT_MODES, t as GATEWAY_CLIENT_CAPS } from "./client-info-C8RatpKO.mjs";
import { t as startGatewayClientWhenEventLoopReady } from "./readiness-kkd804Uc.mjs";
import { r as resolveGatewayClientBootstrap } from "./client-bootstrap-D-pUrrKi.mjs";
import { t as GatewayClient } from "./client-CrrkVIh8.mjs";
import { t as getOperatorApprovalRuntimeToken } from "./operator-approval-runtime-token-DlMjMU2U.mjs";
//#region src/gateway/operator-approvals-client.ts
function shouldSendApprovalRuntimeToken(urlSource) {
	return urlSource === "local loopback" || urlSource === "missing gateway.remote.url (fallback local)";
}
/** Create a Gateway client authorized for operator approval event handling. */
async function createOperatorApprovalsGatewayClient(params) {
	const bootstrap = await resolveGatewayClientBootstrap({
		config: params.config,
		gatewayUrl: params.gatewayUrl,
		env: process.env
	});
	const sendsApprovalRuntimeToken = shouldSendApprovalRuntimeToken(bootstrap.urlSource);
	return new GatewayClient({
		url: bootstrap.url,
		deviceAuthScope: bootstrap.deviceAuthScope,
		...bootstrap.sshTunnel ? { sshTunnel: bootstrap.sshTunnel } : {},
		token: bootstrap.auth.token,
		password: bootstrap.auth.password,
		...sendsApprovalRuntimeToken ? { approvalRuntimeToken: getOperatorApprovalRuntimeToken() } : {},
		preauthHandshakeTimeoutMs: bootstrap.preauthHandshakeTimeoutMs,
		tlsFingerprint: bootstrap.tlsFingerprint,
		clientName: GATEWAY_CLIENT_NAMES.GATEWAY_CLIENT,
		clientDisplayName: params.clientDisplayName,
		mode: GATEWAY_CLIENT_MODES.BACKEND,
		caps: [GATEWAY_CLIENT_CAPS.APPROVALS],
		scopes: ["operator.approvals"],
		deviceIdentity: sendsApprovalRuntimeToken ? null : void 0,
		onEvent: params.onEvent,
		onHelloOk: params.onHelloOk,
		onConnectError: params.onConnectError,
		onReconnectPaused: params.onReconnectPaused,
		onClose: params.onClose
	});
}
/** Run a callback with a started operator-approvals Gateway client and close it after. */
async function withOperatorApprovalsGatewayClient(params, run) {
	const ready = createDeferredCore();
	const gatewayClient = await createOperatorApprovalsGatewayClient({
		config: params.config,
		gatewayUrl: params.gatewayUrl,
		clientDisplayName: params.clientDisplayName,
		onHelloOk: () => {
			ready.resolve();
		},
		onConnectError: (err) => {
			ready.reject(err);
		},
		onClose: (code, reason) => {
			ready.reject(/* @__PURE__ */ new Error(`gateway closed (${code}): ${reason}`));
		}
	});
	try {
		const readiness = await startGatewayClientWhenEventLoopReady(gatewayClient, { clientOptions: {} });
		if (!readiness.ready) throw new Error(readiness.aborted ? "gateway approval client start aborted before readiness" : "gateway readiness unavailable before approval client start");
		await ready.promise;
		return await run(gatewayClient);
	} finally {
		await gatewayClient.stopAndWait().catch(() => {
			gatewayClient.stop();
		});
	}
}
//#endregion
export { withOperatorApprovalsGatewayClient as n, createOperatorApprovalsGatewayClient as t };
