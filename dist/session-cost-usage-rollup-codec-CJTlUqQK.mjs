import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { n as sha256Hex } from "./node-crypto-BG4u3UnX.mjs";
import "./crypto-digest-y6oZN-_F.mjs";
import { t as resolveZstdCodec } from "./zstd-codec-C-vEb3Qf.mjs";
const USAGE_COST_ROLLUP_FORMAT_VERSION = 1;
const USAGE_COST_ROLLUP_SCOPE = "session-cost-usage-rollup-v3";
const zstd = resolveZstdCodec();
function encodeUsageCostRollup(entry) {
	const json = JSON.stringify(entry.rollup);
	const raw = Buffer.from(json, "utf8");
	const compressed = raw.byteLength >= 1024 ? zstd?.compress(raw, 1) : void 0;
	const useCompressed = compressed !== void 0 && compressed.byteLength < raw.byteLength;
	const bytes = useCompressed ? compressed : raw;
	const envelope = {
		version: entry.version,
		pricingFingerprint: entry.pricingFingerprint,
		checkpoint: entry.checkpoint,
		scannedAt: entry.scannedAt,
		parsedRecords: entry.parsedRecords,
		countedRecords: entry.countedRecords,
		format: USAGE_COST_ROLLUP_FORMAT_VERSION,
		body: {
			encoding: useCompressed ? "zstd" : "identity",
			bytes: raw.byteLength,
			storedBytes: bytes.byteLength,
			utf16Length: json.length,
			sha256: sha256Hex(raw)
		}
	};
	return {
		valueJson: JSON.stringify(envelope),
		blob: Uint8Array.from(bytes)
	};
}
function decodeUsageCostRollupEnvelope(valueJson, pricingFingerprint) {
	try {
		const record = JSON.parse(valueJson);
		if (!isRecord(record)) return;
		if (record.version !== 6 || record.format !== USAGE_COST_ROLLUP_FORMAT_VERSION || typeof record.pricingFingerprint !== "string" || pricingFingerprint !== void 0 && record.pricingFingerprint !== pricingFingerprint || !isRecord(record.checkpoint) || record.checkpoint.kind !== "jsonl" && record.checkpoint.kind !== "sqlite" || typeof record.scannedAt !== "number" || typeof record.parsedRecords !== "number" || typeof record.countedRecords !== "number" || !isRecord(record.body) || record.body.encoding !== "identity" && record.body.encoding !== "zstd" || typeof record.body.bytes !== "number" || !Number.isSafeInteger(record.body.bytes) || record.body.bytes <= 0 || typeof record.body.storedBytes !== "number" || !Number.isSafeInteger(record.body.storedBytes) || record.body.storedBytes <= 0 || typeof record.body.utf16Length !== "number" || !Number.isSafeInteger(record.body.utf16Length) || record.body.utf16Length <= 0 || typeof record.body.sha256 !== "string" || !/^[0-9a-f]{64}$/.test(record.body.sha256)) return;
		return record;
	} catch {
		return;
	}
}
function decodeUsageCostRollup(valueJson, pricingFingerprint, blob) {
	const envelope = decodeUsageCostRollupEnvelope(valueJson, pricingFingerprint);
	if (!envelope || !blob || blob.byteLength !== envelope.body.storedBytes) return;
	try {
		const raw = envelope.body.encoding === "zstd" ? zstd?.decompress(blob, envelope.body.bytes) : Buffer.from(blob.buffer, blob.byteOffset, blob.byteLength);
		if (!raw || raw.byteLength !== envelope.body.bytes || sha256Hex(raw) !== envelope.body.sha256) return;
		const json = raw.toString("utf8");
		if (json.length !== envelope.body.utf16Length) return;
		const rollup = JSON.parse(json);
		if (!isRecord(rollup) || !isRecord(rollup.buckets) || !isRecord(rollup.untimestamped)) return;
		const { format: _format, body: _body, ...metadata } = envelope;
		return {
			...metadata,
			rollup
		};
	} catch {
		return;
	}
}
function isUsageCostRollupFresh(params) {
	const { checkpoint } = params;
	if (!checkpoint || checkpoint.kind !== params.file.kind) return false;
	if (checkpoint.kind === "jsonl") return checkpoint.observedSize === params.file.size && checkpoint.observedMtimeMs === params.file.mtimeMs && checkpoint.device === params.file.device && checkpoint.inode === params.file.inode;
	return checkpoint.size === params.file.size && checkpoint.mtimeMs === params.file.mtimeMs && checkpoint.eventCount === params.file.eventCount && checkpoint.maxSeq === params.file.maxSeq;
}
function canUseUsageCostRollupForPartial(params) {
	const checkpoint = params.checkpoint;
	if (!checkpoint || checkpoint.kind !== params.file.kind) return false;
	if (checkpoint.kind === "jsonl") return checkpoint.parsedOffset <= params.file.size && checkpoint.device === params.file.device && checkpoint.inode === params.file.inode;
	return checkpoint.maxSeq <= (params.file.maxSeq ?? 0);
}
//#endregion
export { encodeUsageCostRollup as a, decodeUsageCostRollupEnvelope as i, canUseUsageCostRollupForPartial as n, isUsageCostRollupFresh as o, decodeUsageCostRollup as r, USAGE_COST_ROLLUP_SCOPE as t };
