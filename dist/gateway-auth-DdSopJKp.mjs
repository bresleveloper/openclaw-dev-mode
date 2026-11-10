import { r as buildCloudflareAccessHeaders } from "./cloudflare-access-bYCXcOS0.mjs";
import { t as gatewayOriginScope } from "./gateway-origin-scope-DQHkraxd.mjs";
import { t as throwNodeHostCleanupErrors } from "./cleanup-errors-eP-PTE_D.mjs";
import { a as loadDeviceAuthTokenReadOnly } from "./device-auth-store-6hLu-kwP.mjs";
import { t as GatewayClient } from "./client-CkNBSciY.mjs";
//#region src/node-host/gateway-candidate-connection.ts
function formatGatewayCandidateUrl(gateway) {
	const host = gateway.host ?? "127.0.0.1";
	const urlHost = host.includes(":") && !(host.startsWith("[") && host.endsWith("]")) ? `[${host}]` : host;
	const port = gateway.port ?? 18789;
	return `${gateway.tls ? "wss" : "ws"}://${urlHost}:${port}${gateway.contextPath ? gateway.contextPath.startsWith("/") ? gateway.contextPath : `/${gateway.contextPath}` : ""}`;
}
function createNodeHostGatewayCandidateConnection(params) {
	if (params.candidates.length === 0) throw new Error("node host gateway candidate list cannot be empty");
	let currentCandidateIndex = 0;
	let stopped = false;
	let stopPromise;
	const candidateClients = [];
	let winnerSelected = params.candidates.length === 1;
	let latestManifest;
	let currentClient = createCandidateClient(currentCandidateIndex);
	function createCandidateClient(candidateIndex) {
		const candidate = params.candidates[candidateIndex];
		if (!candidate) throw new Error(`node host gateway candidate ${candidateIndex} is unavailable`);
		const url = formatGatewayCandidateUrl(candidate);
		const cloudflareAccess = params.cloudflareAccessByCandidate?.get(candidate);
		const candidateClient = new GatewayClient({
			...params.clientOptions,
			url,
			tlsFingerprint: candidate.tlsFingerprint,
			...cloudflareAccess ? { edgeAuthHeaders: buildCloudflareAccessHeaders(cloudflareAccess) } : {},
			onEvent: (event) => {
				if (currentCandidateIndex === candidateIndex) params.onEvent(event);
			},
			onHelloOk: (hello) => {
				if (currentCandidateIndex !== candidateIndex) return;
				if (!winnerSelected) {
					winnerSelected = true;
					params.onWinningCandidate(candidate);
				}
				params.onHelloOk(hello, url, candidate.tlsFingerprint, cloudflareAccess);
			},
			onConnectError: (error) => {
				if (currentCandidateIndex === candidateIndex) params.onConnectError(error);
			},
			onReconnectPaused: (info) => {
				if (currentCandidateIndex === candidateIndex) params.onReconnectPaused(info);
			},
			onClose: (code, reason, info) => {
				if (stopped || currentCandidateIndex !== candidateIndex) return;
				params.onClose(code, reason, info);
				const nextCandidateIndex = candidateIndex + 1;
				if (stopped || winnerSelected || nextCandidateIndex >= params.candidates.length || info?.phase !== "pre-hello" || info.connectRequestSent !== false) return;
				currentCandidateIndex = nextCandidateIndex;
				candidateClient.stop();
				queueMicrotask(() => {
					if (stopped || currentCandidateIndex !== nextCandidateIndex) return;
					currentClient = createCandidateClient(nextCandidateIndex);
					currentClient.start();
				});
			}
		});
		if (latestManifest) candidateClient.updateNodeManifest(latestManifest);
		candidateClients.push(candidateClient);
		return candidateClient;
	}
	return {
		start() {
			if (!stopped) currentClient.start();
		},
		stop() {
			stopped = true;
			stopPromise ??= Promise.resolve().then(async () => {
				const failures = (await Promise.allSettled(candidateClients.map((client) => client.stopAndWait()))).flatMap((result) => result.status === "rejected" ? [result.reason] : []);
				throwNodeHostCleanupErrors(failures, "node host gateway cleanup failed");
			});
			return stopPromise;
		},
		request(...requestArgs) {
			return currentClient.request(...requestArgs);
		},
		updateNodeManifest(manifest) {
			latestManifest = manifest;
			currentClient.updateNodeManifest(manifest);
		}
	};
}
//#endregion
//#region src/node-host/gateway-auth.ts
async function canReuseNodeHostDeviceToken(params) {
	const savedGatewayScope = params.savedGateway ? gatewayOriginScope(formatGatewayCandidateUrl(params.savedGateway)) : void 0;
	return Boolean(savedGatewayScope && params.gatewayCandidates.every((candidate) => gatewayOriginScope(formatGatewayCandidateUrl(candidate)) === savedGatewayScope) && (await loadDeviceAuthTokenReadOnly({
		deviceId: params.deviceId,
		role: "node",
		env: params.env ?? process.env
	}))?.token);
}
//#endregion
export { createNodeHostGatewayCandidateConnection as n, formatGatewayCandidateUrl as r, canReuseNodeHostDeviceToken as t };
