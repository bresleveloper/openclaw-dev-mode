import { o as __exportAll } from "./doctor-contract-api-CGS80vmV.mjs";
import { n as signalRpcRequest, t as signalCheck } from "./client-adapter-c_O1ouxZ.mjs";
import { t as detectSignalTransport } from "./transport-detection-CQSEftdN.mjs";
import { normalizeOptionalString, normalizeTrimmedStringList } from "openclaw/plugin-sdk/string-coerce-runtime";
import { runChannelProbe } from "openclaw/plugin-sdk/text-utility-runtime";
import { formatErrorMessage } from "openclaw/plugin-sdk/error-runtime";
//#region extensions/signal/src/probe.ts
var probe_exports = /* @__PURE__ */ __exportAll({
	probeSignal: () => probeSignal,
	probeSignalAccount: () => probeSignalAccount
});
function parseSignalVersion(value) {
	const directVersion = normalizeOptionalString(value);
	if (directVersion) return directVersion;
	if (typeof value === "object" && value !== null) {
		const { version, versions } = value;
		const normalizedVersion = normalizeOptionalString(version);
		if (normalizedVersion) return normalizedVersion;
		return normalizeTrimmedStringList(versions).join(", ") || null;
	}
	return null;
}
async function probeSignalTransport(baseUrl, timeoutMs, options, account) {
	return await runChannelProbe(void 0, async () => {
		const result = {
			ok: false,
			status: null,
			error: null,
			version: null
		};
		let transportKind;
		try {
			transportKind = await resolveProbeTransportKind(baseUrl, timeoutMs, options);
		} catch (error) {
			return {
				...result,
				error: formatErrorMessage(error)
			};
		}
		const check = await signalCheck(baseUrl, timeoutMs, {
			transportKind,
			...account && transportKind === "container" ? { account } : {}
		});
		if (!check.ok) return {
			...result,
			status: check.status ?? null,
			error: check.error ?? "unreachable"
		};
		try {
			result.version = parseSignalVersion(await signalRpcRequest("version", void 0, {
				baseUrl,
				timeoutMs,
				transportKind
			}));
		} catch (error) {
			result.error = formatErrorMessage(error);
		}
		return {
			...result,
			ok: result.error === null,
			status: check.status ?? null
		};
	});
}
async function probeSignal(baseUrl, timeoutMs, options = {}) {
	return await probeSignalTransport(baseUrl, timeoutMs, options);
}
async function probeSignalAccount(params) {
	return await probeSignalTransport(params.baseUrl, params.timeoutMs, { transportKind: params.transportKind }, params.account);
}
async function resolveProbeTransportKind(baseUrl, timeoutMs, options) {
	if (options.transportKind) return options.transportKind;
	if (options.apiMode === "container") return "container";
	if (options.apiMode === "auto") return (await detectSignalTransport({
		url: baseUrl,
		timeoutMs
	})).kind;
	return "external-native";
}
//#endregion
export { probe_exports as n, probeSignal as t };
