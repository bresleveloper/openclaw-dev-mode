import { s as asFiniteNumber } from "./number-coercion-CLj0HTDM.mjs";
import { c as isRecord, r as asNullableRecord } from "./record-coerce-DItp3I4t.mjs";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { n as filterStringEntries } from "./string-normalization-_gRhJUDw.mjs";
import "./string-coerce-runtime-C_MKhRVt.mjs";
import { n as getChromeWebSocketEndpoint } from "./chrome-BYoc4jk9.mjs";
import { _ as withCdpSocket, d as redactCdpErrorText } from "./cdp.helpers-DHnECuD4.mjs";
//#region extensions/browser/src/browser/chrome.graphics.ts
function readChromeString(value) {
	return normalizeOptionalString(value) ?? "";
}
function readChromeNumber(value) {
	return asFiniteNumber(value) ?? 0;
}
function readStringRecord(value) {
	const record = asNullableRecord(value);
	if (!record) return {};
	const entries = Object.entries(record).filter((entry) => typeof entry[1] === "string").toSorted(([left], [right]) => left.localeCompare(right));
	return Object.fromEntries(entries);
}
function readSize(value) {
	const size = asNullableRecord(value);
	return {
		width: readChromeNumber(size?.width),
		height: readChromeNumber(size?.height)
	};
}
function readRecordArray(value) {
	return Array.isArray(value) ? value.filter(isRecord) : [];
}
function readDevices(value) {
	return readRecordArray(value).map((device) => ({
		vendorId: readChromeNumber(device.vendorId),
		deviceId: readChromeNumber(device.deviceId),
		vendor: readChromeString(device.vendorString),
		device: readChromeString(device.deviceString),
		driverVendor: readChromeString(device.driverVendor),
		driverVersion: readChromeString(device.driverVersion)
	}));
}
function readVideoDecoding(value) {
	return readRecordArray(value).map((capability) => ({
		profile: readChromeString(capability.profile),
		minResolution: readSize(capability.minResolution),
		maxResolution: readSize(capability.maxResolution)
	}));
}
function readVideoEncoding(value) {
	return readRecordArray(value).map((capability) => ({
		profile: readChromeString(capability.profile),
		maxResolution: readSize(capability.maxResolution),
		maxFramerateNumerator: readChromeNumber(capability.maxFramerateNumerator),
		maxFramerateDenominator: readChromeNumber(capability.maxFramerateDenominator)
	}));
}
function firstAttribute(attributes, names) {
	for (const name of names) {
		const value = readChromeString(attributes[name]);
		if (value) return value;
	}
	return null;
}
function classifyGraphicsAcceleration(params) {
	const deviceText = params.devices.flatMap((device) => [
		device.vendor,
		device.device,
		device.driverVendor
	]).join(" ");
	const description = `${params.renderer ?? ""} ${deviceText}`.toLowerCase();
	if (/(swiftshader|swangle|llvmpipe|softpipe|software rasterizer|swrast|microsoft basic render driver|d3d11-warp|\bdisabled\b)/.test(description)) return "software";
	if (description.trim()) return "hardware";
	return [
		"2d_canvas",
		"gpu_compositing",
		"rasterization",
		"webgl"
	].map((feature) => params.featureStatus[feature]?.toLowerCase() ?? "").some((status) => status.includes("software")) ? "software" : "unknown";
}
function normalizeChromeGraphicsInfo(value, observedAt = Date.now()) {
	const result = asNullableRecord(value);
	const gpu = asNullableRecord(result?.gpu);
	if (!gpu) return {
		status: "unavailable",
		observedAt,
		reason: "SystemInfo.getInfo returned no GPU information"
	};
	const attributes = readStringRecord(gpu.auxAttributes);
	const featureStatus = readStringRecord(gpu.featureStatus);
	const devices = readDevices(gpu.devices);
	const renderer = firstAttribute(attributes, [
		"glRenderer",
		"angleRenderer",
		"webglRenderer"
	]);
	const disabledFeatures = Object.entries(featureStatus).filter(([, status]) => !status.toLowerCase().startsWith("enabled")).map(([feature, status]) => ({
		feature,
		status
	}));
	return {
		status: "available",
		observedAt,
		acceleration: classifyGraphicsAcceleration({
			renderer,
			devices,
			featureStatus
		}),
		renderer,
		vendor: firstAttribute(attributes, [
			"glVendor",
			"angleVendor",
			"webglVendor"
		]),
		version: firstAttribute(attributes, ["glVersion", "angleVersion"]),
		backend: firstAttribute(attributes, ["glImplementationParts", "displayType"]),
		devices,
		featureStatus,
		disabledFeatures,
		driverBugWorkarounds: filterStringEntries(gpu.driverBugWorkarounds),
		videoDecoding: readVideoDecoding(gpu.videoDecoding),
		videoEncoding: readVideoEncoding(gpu.videoEncoding)
	};
}
async function inspectChromeGraphicsDiagnostics(cdpUrl, options = {}) {
	const observedAt = Date.now();
	try {
		const endpoint = await getChromeWebSocketEndpoint(cdpUrl, options.httpTimeoutMs, options.ssrfPolicy);
		if (!endpoint) return {
			status: "unavailable",
			observedAt,
			reason: "browser-level CDP WebSocket was not advertised"
		};
		return normalizeChromeGraphicsInfo(await withCdpSocket(endpoint.url, async (send) => await send("SystemInfo.getInfo"), {
			handshakeTimeoutMs: options.handshakeTimeoutMs,
			commandTimeoutMs: options.commandTimeoutMs,
			handshakeRetries: 0,
			lookup: endpoint.lookup
		}), observedAt);
	} catch (error) {
		return {
			status: "unavailable",
			observedAt,
			reason: redactCdpErrorText(error instanceof Error ? error.message : String(error))
		};
	}
}
async function getCachedChromeGraphicsDiagnostics(running, load) {
	if (running.graphicsDiagnostics) return running.graphicsDiagnostics;
	running.graphicsDiagnosticsPending ??= load();
	try {
		const diagnostics = await running.graphicsDiagnosticsPending;
		if (diagnostics.status === "available") running.graphicsDiagnostics = diagnostics;
		return diagnostics;
	} finally {
		running.graphicsDiagnosticsPending = void 0;
	}
}
function formatBrowserGraphicsSummary(diagnostics) {
	if (diagnostics.status === "unavailable") return `unavailable: ${diagnostics.reason}`;
	const device = diagnostics.devices[0];
	return [
		diagnostics.acceleration,
		diagnostics.renderer ? `renderer ${diagnostics.renderer}` : void 0,
		diagnostics.backend ? `backend ${diagnostics.backend}` : void 0,
		device?.device ? `device ${device.device}` : void 0,
		`video decode ${diagnostics.videoDecoding.length}, encode ${diagnostics.videoEncoding.length}`
	].filter((value) => Boolean(value)).join("; ");
}
//#endregion
export { getCachedChromeGraphicsDiagnostics as n, inspectChromeGraphicsDiagnostics as r, formatBrowserGraphicsSummary as t };
