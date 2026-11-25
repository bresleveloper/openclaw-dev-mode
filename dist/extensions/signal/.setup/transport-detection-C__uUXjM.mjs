import { o as __exportAll } from "./doctor-contract-api-TiY2vogm.mjs";
import { s as normalizeSignalTransportUrl } from "./legacy-transport-CwEWEhge.mjs";
// extensions/signal/src/transport-detection.ts
var transport_detection_exports = /* @__PURE__ */ __exportAll({ detectSignalTransport: () => detectSignalTransport });
const DEFAULT_PROBE_TIMEOUT_MS = 1e4;
async function detectSignalTransport(params) {
	const url = normalizeSignalTransportUrl(params.url);
	const timeoutMs = params.timeoutMs ?? DEFAULT_PROBE_TIMEOUT_MS;
	const probes = params.probeNative && params.probeContainer ? void 0 : await import("./transport-probes.runtime-C301SU74.mjs");
	const probeNative = params.probeNative ?? probes?.nativeCheck;
	const probeContainer = params.probeContainer ?? probes?.containerCheck;
	if (!probeNative || !probeContainer) throw new Error("Signal transport checks are unavailable");
	const [native, container] = await Promise.all([probeNative(url, timeoutMs).catch(() => ({ ok: false })), probeContainer(url, timeoutMs, params.account).catch(() => ({ ok: false }))]);
	if (native.ok) return {
		kind: "external-native",
		url
	};
	if (container.ok) return {
		kind: "container",
		url
	};
	throw new Error(`Signal transport not reachable at ${url}`);
}
export { transport_detection_exports as n, detectSignalTransport as t };
