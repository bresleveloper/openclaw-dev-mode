import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
//#region src/commands/telemetry-exporter-summary.ts
const SIGNALS = [
	"traces",
	"metrics",
	"logs"
];
const STATUSES = [
	"started",
	"failure",
	"recovered",
	"dropped"
];
const SAFE_EXPORTER_CODE = /^[A-Za-z0-9_-]{1,120}$/u;
const REASON_LABELS = {
	unsupported_protocol: "unsupported protocol",
	start_failed: "start failed",
	export_failed: "export failed",
	handler_failed: "handler failed",
	emit_failed: "emit failed",
	queue_full: "queue full",
	shutdown_failed: "shutdown failed"
};
function oneOf(value, choices) {
	return typeof value === "string" && choices.includes(value);
}
function parseExporterHealthRecord(value) {
	if (!isRecord(value) || value.type !== "telemetry.exporter" || typeof value.source !== "string" || !SAFE_EXPORTER_CODE.test(value.source) || !oneOf(value.target, SIGNALS) || !oneOf(value.outcome, STATUSES)) return;
	const seq = typeof value.seq === "number" && Number.isFinite(value.seq) ? value.seq : 0;
	const transport = typeof value.transport === "string" && SAFE_EXPORTER_CODE.test(value.transport) ? value.transport : void 0;
	const reason = typeof value.reason === "string" && (value.reason === "configured" || value.reason === "default_endpoint" || Object.hasOwn(REASON_LABELS, value.reason)) ? value.reason : void 0;
	const ownership = value.mode === "configured" || value.mode === "default_endpoint" ? value.mode : void 0;
	return {
		seq,
		source: value.source,
		signal: value.target,
		status: value.outcome,
		...transport ? { transport } : {},
		...reason ? { reason } : {},
		...ownership ? { ownership } : {}
	};
}
function formatTransport(record) {
	switch (record.transport) {
		case "otlp-http-protobuf": return record.ownership === "default_endpoint" || record.reason === "default_endpoint" ? "OTLP/HTTP protobuf (dependency default endpoint)" : record.ownership === "configured" || record.reason === "configured" ? "OTLP/HTTP protobuf (explicit endpoint)" : "OTLP/HTTP protobuf";
		case "stdout": return "stdout";
		case "external-sdk": return "external SDK ownership";
		default: return record.transport ?? "exporter";
	}
}
function formatReason(record) {
	if (record.status === "started") return;
	if (record.status === "recovered" && record.reason === "export_failed") return "after export failure";
	if (record.status === "recovered" && record.reason === "emit_failed") return "after emit failure";
	return record.reason && Object.hasOwn(REASON_LABELS, record.reason) ? REASON_LABELS[record.reason] : void 0;
}
/** Builds the redacted exporter-health text shared by Doctor and status --all. */
function formatTelemetryExporterSummary(snapshot) {
	if (!isRecord(snapshot) || !Array.isArray(snapshot.events)) return null;
	const latest = /* @__PURE__ */ new Map();
	for (const value of snapshot.events) {
		const record = parseExporterHealthRecord(value);
		if (!record) continue;
		const key = `${record.source}\u0000${record.signal}\u0000${record.transport ?? "unknown"}`;
		const previous = latest.get(key);
		if (!previous || record.seq >= previous.seq) latest.set(key, record);
	}
	const records = [...latest.values()].toSorted((left, right) => {
		const sourceOrder = left.source.localeCompare(right.source);
		if (sourceOrder !== 0) return sourceOrder;
		const signalOrder = SIGNALS.indexOf(left.signal) - SIGNALS.indexOf(right.signal);
		if (signalOrder !== 0) return signalOrder;
		return (left.transport ?? "").localeCompare(right.transport ?? "");
	});
	if (records.length === 0) return null;
	return {
		title: "Telemetry exporters",
		status: records.some((record) => record.status === "failure" || record.status === "dropped") ? "warn" : "ok",
		lines: records.map((record) => {
			const status = record.status === "failure" ? "failed" : record.status;
			const line = `${record.source} · ${record.signal} · ${status} · ${formatTransport(record)}`;
			const reason = formatReason(record);
			return reason ? `${line} · ${reason}` : line;
		})
	};
}
//#endregion
export { formatTelemetryExporterSummary as t };
