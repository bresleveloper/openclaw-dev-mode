import { i as normalizeTlsFingerprint } from "./client-address-utils-BDJ8WbNc.mjs";
import { request } from "node:http";
import { request as request$1 } from "node:https";
import { TLSSocket } from "node:tls";
//#region src/gateway/local-http-probe.ts
const GATEWAY_HTTP_PROBE_MAX_RESPONSE_CHARS = 1024;
function normalizeGatewayHttpProbeHost(host) {
	return host === "0.0.0.0" || host === "::" ? "127.0.0.1" : host;
}
async function requestGatewayLocalHttpProbe(params) {
	params.signal?.throwIfAborted();
	if (params.timeoutMs <= 0) return null;
	const response = await new Promise((resolve) => {
		let settled = false;
		const finish = (result) => {
			if (settled) return;
			settled = true;
			clearTimeout(deadline);
			resolve(result);
		};
		const pins = params.tlsFingerprints?.map(normalizeTlsFingerprint);
		const req = (pins ? request$1 : request)({
			hostname: normalizeGatewayHttpProbeHost(params.host),
			port: params.port,
			path: params.pathname,
			method: "GET",
			timeout: params.timeoutMs,
			...params.signal ? { signal: params.signal } : {},
			...pins ? {
				rejectUnauthorized: false,
				agent: false
			} : {}
		}, (res) => {
			let tlsFingerprint;
			if (pins) {
				tlsFingerprint = res.socket instanceof TLSSocket ? normalizeTlsFingerprint(res.socket.getPeerCertificate().fingerprint256 ?? "") : "";
				if (!tlsFingerprint || !pins.includes(tlsFingerprint)) {
					res.resume();
					finish(null);
					return;
				}
			}
			let body = "";
			res.setEncoding("utf8");
			res.on("data", (chunk) => {
				if (body.length + chunk.length > GATEWAY_HTTP_PROBE_MAX_RESPONSE_CHARS) {
					res.destroy();
					finish(null);
					return;
				}
				body += chunk;
			});
			res.once("end", () => {
				finish({
					statusCode: res.statusCode ?? 0,
					body,
					...tlsFingerprint ? { tlsFingerprint } : {}
				});
			});
			res.once("error", () => {
				finish(null);
			});
		});
		const deadline = setTimeout(() => {
			req.destroy();
			finish(null);
		}, params.timeoutMs);
		req.once("timeout", () => {
			req.destroy();
			finish(null);
		});
		req.once("error", () => {
			finish(null);
		});
		req.end();
	});
	params.signal?.throwIfAborted();
	return response;
}
function createConfiguredGatewayLocalProbe(config) {
	const tlsConfig = config.gateway?.tls;
	let configured;
	let inspection;
	let verified;
	const inspectCertificate = () => inspection ??= import("./gateway-DxcK1klv.mjs").then(async ({ inspectGatewayTlsCertificate }) => {
		const certificate = await inspectGatewayTlsCertificate(tlsConfig);
		if (!certificate.ok) return;
		const fingerprint = certificate.value.fingerprintSha256;
		if (configured?.fingerprint !== fingerprint) configured = {
			fingerprint,
			generation: (configured?.generation ?? 0) + 1
		};
		return configured;
	}).catch(() => void 0).finally(() => {
		inspection = void 0;
	});
	const requestHttp = async (params) => {
		params.signal?.throwIfAborted();
		const endpoint = `${normalizeGatewayHttpProbeHost(params.host)}:${params.port}`;
		const previous = verified;
		let candidate;
		let tlsFingerprints;
		if (tlsConfig?.enabled === true) {
			candidate = await inspectCertificate();
			params.signal?.throwIfAborted();
			tlsFingerprints = [...candidate ? [candidate.fingerprint] : [], ...previous?.endpoint === endpoint ? [previous.fingerprint] : []];
			if (tlsFingerprints.length === 0) return null;
		}
		const result = await requestGatewayLocalHttpProbe({
			...params,
			tlsFingerprints
		});
		const accepted = result?.tlsFingerprint === candidate?.fingerprint ? candidate : previous;
		if (result?.tlsFingerprint && accepted && (verified?.endpoint !== endpoint || accepted.generation >= verified.generation)) verified = {
			...accepted,
			endpoint
		};
		return result;
	};
	return {
		requestHttp,
		async resolveWebSocketTarget(port, signal) {
			signal?.throwIfAborted();
			if (tlsConfig?.enabled !== true) return { url: `ws://127.0.0.1:${port}` };
			const response = await requestHttp({
				host: "127.0.0.1",
				port,
				pathname: "/healthz",
				timeoutMs: 3e3,
				signal
			});
			return response?.tlsFingerprint ? {
				url: `wss://127.0.0.1:${port}`,
				tlsFingerprint: response.tlsFingerprint
			} : null;
		}
	};
}
//#endregion
export { normalizeGatewayHttpProbeHost as n, requestGatewayLocalHttpProbe as r, createConfiguredGatewayLocalProbe as t };
