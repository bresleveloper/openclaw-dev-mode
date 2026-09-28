import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { t as boundedJsonUtf8Bytes } from "./json-utf8-bytes-fm9i4b7G.mjs";
import { a as sanitizeDiagnosticProfileFrame, i as captureDiagnosticProfile, r as assertProfile } from "./diagnostic-profile-BvqSg8ak.mjs";
//#region src/logging/diagnostic-heap-profile.ts
function boundProfile(profile, packageRoot, metadata) {
	assertProfile(Boolean(profile?.head) && isRecord(profile) && Array.isArray(profile.samples));
	const samples = profile.samples;
	const rows = /* @__PURE__ */ new Map();
	const pending = [{ source: profile.head }];
	let redactedNodeCount = 0;
	for (const { source, parent } of pending) {
		assertProfile(isRecord(source) && typeof source.id === "number" && Number.isSafeInteger(source.id) && source.id > 0 && !rows.has(source.id) && Number.isSafeInteger(source.selfSize) && source.selfSize >= 0 && Array.isArray(source.children));
		const { callFrame, redacted } = sanitizeDiagnosticProfileFrame(source.callFrame, packageRoot);
		redactedNodeCount += Number(redacted);
		const node = {
			id: source.id,
			callFrame,
			selfSize: source.selfSize,
			children: []
		};
		const row = {
			node,
			parent,
			stack: [callFrame, ...parent?.stack.slice(0, 7) ?? []],
			selfBytes: node.selfSize,
			totalBytes: node.selfSize,
			count: 0
		};
		rows.set(node.id, row);
		parent?.node.children.push(node);
		for (const child of source.children) pending.push({
			source: child,
			parent: row
		});
	}
	const safeSamples = [];
	let unattributedSampleCount = 0;
	let unattributedSampleBytes = 0;
	for (const sample of samples) {
		assertProfile(isRecord(sample) && typeof sample.nodeId === "number" && Number.isSafeInteger(sample.nodeId) && sample.nodeId > 0 && typeof sample.size === "number" && Number.isSafeInteger(sample.size) && sample.size >= 0 && typeof sample.ordinal === "number" && Number.isSafeInteger(sample.ordinal) && sample.ordinal >= 0);
		const row = rows.get(sample.nodeId);
		if (!row) {
			unattributedSampleCount++;
			unattributedSampleBytes += sample.size;
			assertProfile(Number.isSafeInteger(unattributedSampleBytes));
			continue;
		}
		row.count++;
		safeSamples.push({
			size: sample.size,
			nodeId: sample.nodeId,
			ordinal: sample.ordinal
		});
	}
	const ordered = [...rows.values()];
	for (const row of ordered.toReversed()) if (row.parent) {
		row.parent.totalBytes += row.totalBytes;
		assertProfile(Number.isSafeInteger(row.parent.totalBytes));
	}
	const head = ordered[0]?.node;
	assertProfile(head !== void 0);
	const common = {
		...metadata,
		redactedNodeCount,
		unattributedSampleCount,
		unattributedSampleBytes
	};
	const raw = {
		...common,
		truncated: unattributedSampleCount > 0,
		profile: {
			head,
			samples: safeSamples
		}
	};
	if (boundedJsonUtf8Bytes(raw, 1048576).complete) return raw;
	const groups = /* @__PURE__ */ new Map();
	for (const { stack, selfBytes, totalBytes, count } of ordered) {
		if (totalBytes === 0) continue;
		const key = JSON.stringify(stack);
		const group = groups.get(key);
		if (group) {
			group.selfBytes += selfBytes;
			group.totalBytes += totalBytes;
			group.count += count;
		} else groups.set(key, {
			stack,
			selfBytes,
			totalBytes,
			count
		});
	}
	const result = {
		...common,
		truncated: true,
		summary: []
	};
	let bytes = Buffer.byteLength(JSON.stringify(result));
	for (const row of [...groups.values()].toSorted((a, b) => b.totalBytes - a.totalBytes || b.selfBytes - a.selfBytes)) {
		const extra = Buffer.byteLength(JSON.stringify(row)) + Number(result.summary.length > 0);
		if (bytes + extra > 1048576) break;
		result.summary.push(row);
		bytes += extra;
	}
	return result;
}
/** Samples allocations in the main isolate without a snapshot or disk output. */
function captureDiagnosticHeapProfile(options) {
	const durationMs = Math.min(3e4, Math.max(1, options.durationMs ?? 5e3));
	const samplingIntervalBytes = Math.max(4096, options.samplingIntervalBytes ?? 32768);
	return captureDiagnosticProfile({
		signal: options.signal,
		hasAuthority: options.hasAuthority,
		durationMs,
		setup: (session) => session.post("HeapProfiler.enable"),
		start: (session) => session.post("HeapProfiler.startSampling", { samplingInterval: samplingIntervalBytes }),
		stop: (session) => session.post("HeapProfiler.stopSampling"),
		disable: (session) => session.post("HeapProfiler.disable"),
		sanitize: (profile, packageRoot, measurement) => boundProfile(profile, packageRoot, {
			durationMs: measurement.durationMs,
			samplingIntervalBytes,
			heapUsedBefore: measurement.before.heapUsed,
			heapUsedAfter: measurement.after.heapUsed,
			rssBefore: measurement.before.rss,
			rssAfter: measurement.after.rss
		})
	});
}
//#endregion
export { captureDiagnosticHeapProfile };
