import { isInternalDiagnosticEventMetadata, redactSensitiveText } from "./api.js";
import { definePluginEntry } from "openclaw/plugin-sdk/plugin-entry";
import { isDiagnosticsEnabled, normalizeDiagnosticLane, normalizeDiagnosticValue } from "openclaw/plugin-sdk/diagnostic-runtime";
import { asNonNegativeFiniteNumber } from "openclaw/plugin-sdk/number-runtime";
import { getPluginRuntimeGatewayRequestScope } from "openclaw/plugin-sdk/plugin-runtime";
import { truncateUtf16Safe } from "openclaw/plugin-sdk/text-utility-runtime";
import { expectDefined } from "openclaw/plugin-sdk/expect-runtime";
// extensions/diagnostics-prometheus/src/prometheus-format.ts
function sortedLabels(labels) {
	const entries = Object.entries(labels);
	entries.sort(([left], [right]) => left.localeCompare(right));
	return entries;
}
function metricKey(name, labels) {
	return `${name}|${JSON.stringify(sortedLabels(labels))}`;
}
function escapeHelp(value) {
	return value.replace(/\\/g, "\\\\").replace(/\n/g, "\\n");
}
function formatLabelEntry([key, value]) {
	return `${key}="${escapeHelp(value).replace(/"/g, "\\\"")}"`;
}
function formatLabels(labels) {
	const entries = sortedLabels(labels);
	if (entries.length === 0) return "";
	return `{${entries.map(formatLabelEntry).join(",")}}`;
}
function formatPrometheusNumber(value) {
	if (!Number.isFinite(value)) return "0";
	return Number.isInteger(value) ? String(value) : String(Number(value.toPrecision(12)));
}
function seconds(ms) {
	const value = asNonNegativeFiniteNumber(ms);
	return value === void 0 ? void 0 : value / 1e3;
}
// extensions/diagnostics-prometheus/src/prometheus-family-budget.ts
const PROMETHEUS_FAMILY_LIMITS = {
	openclaw_chat_history_requests_total: 128,
	openclaw_chat_history_response_bytes_total: 128,
	openclaw_chat_send_phase_seconds: 128,
	openclaw_child_process_spawn_total: 128,
	openclaw_code_mode_worker_heap_bytes: 128,
	openclaw_code_mode_worker_memory_bytes: 128,
	openclaw_control_ui_document_duration_seconds: 128,
	openclaw_cron_list_requests_total: 128,
	openclaw_diagnostic_async_queue_dropped_total: 128,
	openclaw_diagnostic_async_queue_length: 128,
	openclaw_diff_cache_misses_total: 128,
	openclaw_diff_stage_seconds: 128,
	openclaw_gateway_active_work: 128,
	openclaw_gateway_build_info: 128,
	openclaw_gateway_event_loop_delay_max_seconds: 128,
	openclaw_gateway_event_loop_observed_seconds_total: 128,
	openclaw_gateway_http_cancelled_total: 128,
	openclaw_gateway_main_thread_stall_seconds: 128,
	openclaw_gateway_main_thread_stalls_dropped_total: 128,
	openclaw_gateway_rpc_admission_seconds: 256,
	openclaw_gateway_rpc_client_requests_total: 512,
	openclaw_gateway_rpc_first_response_seconds: 256,
	openclaw_gateway_rpc_handler_heap_delta_bytes: 256,
	openclaw_gateway_rpc_handler_heap_delta_exclusive_total: 256,
	openclaw_gateway_rpc_handler_seconds: 256,
	openclaw_gateway_rpc_outcomes_total: 256,
	openclaw_gateway_rpc_queue_wait_seconds: 256,
	openclaw_gateway_rpc_requests_total: 256,
	openclaw_gateway_rpc_response_bytes: 256,
	openclaw_gateway_rpc_stage_seconds: 256,
	openclaw_gateway_rpc_stage_thread_cpu_seconds: 256,
	openclaw_gateway_ws_event_bytes_total: 256,
	openclaw_gateway_ws_event_frame_bytes: 2048,
	openclaw_gateway_ws_event_wire_bytes_total: 256,
	openclaw_gateway_ws_events_total: 256,
	openclaw_gateway_ws_operator_connections: 128,
	openclaw_gateway_ws_presence_bytes_total: 128,
	openclaw_gateway_ws_presence_frames_total: 128,
	openclaw_gateway_ws_session_event_bytes_total: 256,
	openclaw_gateway_ws_session_event_frames_total: 256,
	openclaw_gc_duration_seconds: 384,
	openclaw_gen_ai_client_token_usage: 128,
	openclaw_harness_run_duration_seconds: 128,
	openclaw_harness_run_total: 128,
	openclaw_heap_old_generation_after_gc_bytes: 128,
	openclaw_heap_old_generation_after_gc_ratio: 128,
	openclaw_heap_size_limit_bytes: 128,
	openclaw_heap_space_bytes: 256,
	openclaw_heap_used_after_major_gc_bytes: 128,
	openclaw_heap_used_after_major_gc_timestamp_seconds: 128,
	openclaw_heap_used_ratio: 128,
	openclaw_liveness_cpu_core_ratio: 128,
	openclaw_liveness_event_loop_delay_max_seconds: 128,
	openclaw_liveness_event_loop_delay_p99_seconds: 128,
	openclaw_liveness_event_loop_utilization_ratio: 128,
	openclaw_liveness_sessions: 128,
	openclaw_liveness_warning_total: 128,
	openclaw_memory_bytes: 128,
	openclaw_memory_pressure_total: 128,
	openclaw_memory_rss_bytes: 128,
	openclaw_message_delivery_duration_seconds: 128,
	openclaw_message_delivery_started_total: 128,
	openclaw_message_delivery_total: 128,
	openclaw_message_dispatch_completed_total: 128,
	openclaw_message_dispatch_duration_seconds: 128,
	openclaw_message_dispatch_started_total: 128,
	openclaw_message_processed_duration_seconds: 128,
	openclaw_message_processed_total: 128,
	openclaw_message_received_total: 128,
	openclaw_model_call_duration_seconds: 128,
	openclaw_model_call_total: 128,
	openclaw_model_cost_usd_total: 128,
	openclaw_model_failover_total: 128,
	openclaw_model_tokens_total: 128,
	openclaw_model_usage_duration_seconds: 128,
	openclaw_models_list_requests_total: 128,
	openclaw_payload_large_bytes: 128,
	openclaw_payload_large_total: 128,
	openclaw_process_anonymous_memory_bytes: 128,
	openclaw_queue_lane_size: 128,
	openclaw_queue_lane_wait_seconds: 128,
	openclaw_run_completed_total: 128,
	openclaw_run_duration_seconds: 128,
	openclaw_secret_egress_requests_total: 128,
	openclaw_session_event_rows_reset_total: 128,
	openclaw_session_event_rows_retained_bytes: 128,
	openclaw_session_event_rows_retained_entries: 128,
	openclaw_session_projection_owners: 128,
	openclaw_session_projection_rows_estimate_truncated: 128,
	openclaw_session_projection_rows_retained_bytes: 128,
	openclaw_session_projection_rows_retained_entries: 128,
	openclaw_session_queue_depth: 128,
	openclaw_session_recovery_age_seconds: 128,
	openclaw_session_recovery_total: 128,
	openclaw_session_row_selection_resets_total: 128,
	openclaw_session_row_partition_cache_total: 128,
	openclaw_session_row_partition_revisions_total: 128,
	openclaw_session_row_selection_rows_total: 128,
	openclaw_session_row_selections_total: 128,
	openclaw_session_state_total: 128,
	openclaw_session_stuck_age_seconds: 128,
	openclaw_session_stuck_total: 128,
	openclaw_session_turn_created_total: 128,
	openclaw_sessions_active: 128,
	openclaw_sessions_list_base_misses_total: 128,
	openclaw_sessions_list_baseline_retirements_total: 128,
	openclaw_sessions_list_requests_total: 128,
	openclaw_sessions_list_response_bytes_total: 128,
	openclaw_sessions_list_retained_bytes: 128,
	openclaw_sessions_list_retained_refs: 128,
	openclaw_sessions_list_retained_views: 128,
	openclaw_skill_used_total: 128,
	openclaw_sqlite_reader_operations_total: 257,
	openclaw_sqlite_reader_read_bytes_total: 257,
	openclaw_talk_audio_bytes: 128,
	openclaw_talk_event_duration_seconds: 128,
	openclaw_talk_event_total: 128,
	openclaw_telemetry_exporter_total: 128,
	openclaw_tool_catalog_tools_total: 128,
	openclaw_tool_catalog_total: 128,
	openclaw_tool_execution_blocked_total: 128,
	openclaw_tool_execution_duration_seconds: 128,
	openclaw_tool_execution_total: 128,
	openclaw_webhook_duration_seconds: 128,
	openclaw_webhook_error_total: 128,
	openclaw_webhook_received_total: 128,
	openclaw_worker_array_buffers_bytes: 128,
	openclaw_worker_count: 128,
	openclaw_worker_external_bytes: 128,
	openclaw_worker_gc_collections_total: 128,
	openclaw_worker_gc_duration_seconds_total: 128,
	openclaw_worker_gc_reclaimed_bytes_total: 128,
	openclaw_worker_heap_sampled_count: 128,
	openclaw_worker_heap_space_used_bytes: 640,
	openclaw_worker_heap_used_bytes: 128,
	openclaw_worker_heap_used_high_water_bytes: 128,
	openclaw_worker_message_payload_bytes_total: 512,
	openclaw_worker_authority_component_sampled_bytes_total: 128,
	openclaw_worker_authority_component_samples_total: 128,
	openclaw_worker_message_unmeasured_total: 128,
	openclaw_worker_messages_total: 128,
	openclaw_worker_queue_depth: 512,
	openclaw_worker_queue_wait_seconds: 512,
	openclaw_worker_request_phase_seconds: 1024,
	openclaw_worker_request_seconds: 512,
	openclaw_worker_retired_total: 128,
	openclaw_worker_started_total: 128,
	openclaw_worker_tasks_completed_total: 128,
	openclaw_worktree_preparation_seconds: 128
};
// extensions/diagnostics-prometheus/src/prometheus-metric-store.ts
function createSeries() {
	return {
		samples: [],
		shapes: /* @__PURE__ */ new Map(),
		sorted: true
	};
}
function sortedSamples(series) {
	if (!series.sorted) {
		series.samples.sort((left, right) => left.key.localeCompare(right.key));
		series.sorted = true;
	}
	return series.samples;
}
const DURATION_BUCKETS_SECONDS = [
	.005,
	.01,
	.025,
	.05,
	.1,
	.25,
	.5,
	1,
	2.5,
	5,
	10,
	30,
	60,
	120,
	300,
	600
];
const AGENT_DURATION_BUCKETS_SECONDS = [
	...DURATION_BUCKETS_SECONDS,
	900,
	1800,
	3600
];
const DROPPED_SERIES_COUNTER_NAME = "openclaw_prometheus_series_dropped_total";
const DROPPED_FAMILY_COUNTER_NAME = "openclaw_prometheus_family_series_dropped_total";
const warnedFamilies = /* @__PURE__ */ new Set();
function createPrometheusMetricStore(onSeriesDropped) {
	const counters = createSeries();
	const gauges = createSeries();
	const histograms = createSeries();
	let droppedSeries = 0;
	let retainedSeries = 0;
	const familyCounts = /* @__PURE__ */ new Map();
	const familyDrops = /* @__PURE__ */ new Map();
	const headers = /* @__PURE__ */ new Map();
	let prefixBuffer = Buffer.alloc(0);
	let prefixOffset = 0;
	const encodePrefix = (text) => {
		const bytes = Buffer.byteLength(text);
		if (bytes > 4096) {
			const prefix = Buffer.allocUnsafeSlow(bytes);
			prefix.write(text);
			return prefix;
		}
		if (prefixOffset + bytes > prefixBuffer.length) {
			prefixBuffer = Buffer.allocUnsafeSlow(4096);
			prefixOffset = 0;
		}
		const start = prefixOffset;
		prefixOffset += prefixBuffer.write(text, prefixOffset);
		return prefixBuffer.subarray(start, prefixOffset);
	};
	let scratch = Buffer.alloc(0);
	const series = (map, name, labels) => {
		let labelCount = 0;
		for (const key in labels) if (Object.hasOwn(labels, key)) labelCount++;
		let shape;
		shapes: for (const candidate of map.shapes.get(name) ?? []) {
			if (candidate.keys.length !== labelCount) continue;
			let node = candidate.root;
			for (const key of candidate.keys) {
				const value = labels[key];
				if (value === void 0 || !Object.prototype.propertyIsEnumerable.call(labels, key)) continue shapes;
				node = node?.values?.get(value);
			}
			shape = candidate;
			if (node?.sample) return node;
			break;
		}
		const count = familyCounts.get(name) ?? 0;
		if (count >= PROMETHEUS_FAMILY_LIMITS[name] || retainedSeries >= 16576) {
			droppedSeries++;
			familyDrops.set(name, (familyDrops.get(name) ?? 0) + 1);
			if (onSeriesDropped && !warnedFamilies.has(name)) {
				warnedFamilies.add(name);
				onSeriesDropped(name);
			}
			return;
		}
		familyCounts.set(name, count + 1);
		retainedSeries++;
		if (!shape) {
			shape = {
				keys: Object.keys(labels).toSorted((left, right) => left.localeCompare(right)),
				root: {}
			};
			const shapes = map.shapes.get(name);
			if (shapes) shapes.push(shape);
			else map.shapes.set(name, [shape]);
		}
		let node = shape.root;
		for (const key of shape.keys) {
			const value = expectDefined(labels[key], "Prometheus label");
			const values = node.values ??= /* @__PURE__ */ new Map();
			let child = values.get(value);
			if (!child) {
				child = {};
				values.set(value, child);
			}
			node = child;
		}
		return node;
	};
	const scalar = (map, name, help, labels, value, mode) => {
		if (value === void 0 || !Number.isFinite(value) || mode !== "set" && value < 0 || mode === "add" && value === 0) return;
		const node = series(map, name, labels);
		if (!node) return;
		if (node.sample) {
			const next = mode === "add" ? node.sample.value + value : mode === "max" ? Math.max(node.sample.value, value) : value;
			if (next !== node.sample.value) {
				node.sample.value = next;
				node.sample.renderedDirty = true;
			}
		} else {
			node.sample = {
				help,
				key: metricKey(name, labels),
				name,
				prefix: encodePrefix(`${name}${formatLabels(labels)} `),
				value,
				renderedDirty: true
			};
			map.samples.push(node.sample);
			map.sorted = false;
		}
	};
	const counter = (name, help, labels, amount = 1) => scalar(counters, name, help, labels, amount, "add");
	const counterValue = (name, help, labels, value) => scalar(counters, name, help, labels, value, "max");
	const gauge = (name, help, labels, value) => scalar(gauges, name, help, labels, value, "set");
	const clearGauges = (name) => {
		headers.delete(name);
		const previousLength = gauges.samples.length;
		gauges.shapes.delete(name);
		gauges.samples = gauges.samples.filter((sample) => sample.name !== name);
		const count = familyCounts.get(name) ?? 0;
		const remaining = count - (previousLength - gauges.samples.length);
		retainedSeries -= count - remaining;
		familyCounts.set(name, remaining);
	};
	const getHistogram = (name, help, labels, buckets = DURATION_BUCKETS_SECONDS) => {
		const node = series(histograms, name, labels);
		if (!node) return;
		let sample = node.sample;
		if (!sample) {
			sample = {
				buckets,
				bucketPrefixes: [...buckets, "+Inf"].map((le) => encodePrefix(`${name}_bucket${formatLabels({
					...labels,
					le: String(le)
				})} `)),
				counts: buckets.map(() => 0),
				count: 0,
				help,
				key: metricKey(name, labels),
				name,
				sumPrefix: encodePrefix(`${name}_sum${formatLabels(labels)} `),
				countPrefix: encodePrefix(`${name}_count${formatLabels(labels)} `),
				sum: 0,
				renderedDirty: true
			};
			node.sample = sample;
			histograms.samples.push(sample);
			histograms.sorted = false;
		}
		return sample;
	};
	const reserveHistogram = (name, help, labels) => {
		getHistogram(name, help, labels);
	};
	const histogram = (name, help, labels, value, buckets = DURATION_BUCKETS_SECONDS) => {
		if (value === void 0 || !Number.isFinite(value)) return;
		const sample = getHistogram(name, help, labels, buckets);
		if (!sample) return;
		sample.count += 1;
		sample.sum += value;
		sample.renderedDirty = true;
		for (let index = 0; index < sample.buckets.length; index += 1) {
			const bucket = sample.buckets[index];
			if (bucket !== void 0 && value <= bucket) {
				sample.counts[index] = (sample.counts[index] ?? 0) + 1;
				break;
			}
		}
	};
	const render = () => {
		let scratchOffset = 0;
		let totalBytes = 0;
		const chunks = [];
		const append = (chunk) => {
			chunks.push(chunk);
			totalBytes += chunk.length;
		};
		const write = (prefix, value) => {
			const number = formatPrometheusNumber(value);
			const required = scratchOffset + prefix.length + number.length + 1;
			if (required > scratch.length) {
				const grown = Buffer.allocUnsafeSlow(Math.max(required, scratch.length * 2));
				grown.set(scratch.subarray(0, scratchOffset));
				scratch = grown;
			}
			scratch.set(prefix, scratchOffset);
			scratchOffset += prefix.length;
			scratchOffset += scratch.write(number, scratchOffset, "ascii");
			scratch[scratchOffset++] = 10;
		};
		const finish = (previous) => {
			const output = previous?.length === scratchOffset ? previous : new Uint8Array(scratchOffset);
			scratch.copy(output, 0, 0, scratchOffset);
			scratchOffset = 0;
			return output;
		};
		const emitted = /* @__PURE__ */ new Set();
		let previousName;
		const header = (name, type, help) => {
			if (previousName === name) return;
			previousName = name;
			if (!emitted.has(name)) {
				emitted.add(name);
				let cached = headers.get(name);
				if (!cached || cached.type !== type || cached.help !== help) {
					cached = {
						type,
						help,
						bytes: encodePrefix(`# HELP ${name} ${escapeHelp(help)}\n# TYPE ${name} ${type}\n`)
					};
					headers.set(name, cached);
				}
				append(cached.bytes);
			}
		};
		for (const [type, map] of [["counter", counters], ["gauge", gauges]]) {
			for (const sample of sortedSamples(map)) {
				header(sample.name, type, sample.help);
				if (!sample.rendered || sample.renderedDirty) {
					write(sample.prefix, sample.value);
					sample.rendered = finish(sample.rendered);
					sample.renderedDirty = false;
				}
				append(sample.rendered);
			}
			if (type === "counter" && droppedSeries > 0) {
				header(DROPPED_SERIES_COUNTER_NAME, type, "New-series observations dropped because an exporter series budget was reached.");
				write(Buffer.from(`${DROPPED_SERIES_COUNTER_NAME} `), droppedSeries);
				append(finish());
				header(DROPPED_FAMILY_COUNTER_NAME, type, "New-series observations dropped by bounded metric family.");
				for (const [family, count] of familyDrops) write(Buffer.from(`${DROPPED_FAMILY_COUNTER_NAME}${formatLabels({ family })} `), count);
				append(finish());
			}
		}
		for (const sample of sortedSamples(histograms)) {
			if (sample.count === 0) continue;
			header(sample.name, "histogram", sample.help);
			if (!sample.rendered || sample.renderedDirty) {
				let cumulative = 0;
				for (let bucketIndex = 0; bucketIndex < sample.counts.length; bucketIndex++) {
					cumulative += sample.counts[bucketIndex];
					write(sample.bucketPrefixes[bucketIndex], cumulative);
				}
				write(sample.bucketPrefixes[sample.counts.length], sample.count);
				write(sample.sumPrefix, sample.sum);
				write(sample.countPrefix, sample.count);
				sample.rendered = finish(sample.rendered);
				sample.renderedDirty = false;
			}
			append(sample.rendered);
		}
		const output = Buffer.from(new ArrayBuffer(totalBytes));
		let offset = 0;
		for (const chunk of chunks) {
			output.set(chunk, offset);
			offset += chunk.length;
		}
		return output;
	};
	const reset = () => {
		for (const map of [
			counters,
			gauges,
			histograms
		]) {
			map.samples.length = 0;
			map.shapes.clear();
		}
		droppedSeries = 0;
		retainedSeries = 0;
		familyCounts.clear();
		familyDrops.clear();
		headers.clear();
		scratch = Buffer.alloc(0);
		prefixBuffer = Buffer.alloc(0);
		prefixOffset = 0;
	};
	return {
		counter,
		counterValue,
		gauge,
		clearGauges,
		histogram,
		reserveHistogram,
		reset,
		render
	};
}
// extensions/diagnostics-prometheus/src/service-gateway-ws.ts
function createGatewayWsMetricsRecorder(store) {
	const labels = { event: "" };
	const frameLabels = {
		event: "",
		le: ""
	};
	const presenceLabels = { mode: "" };
	const sessionLabels = {
		event: "",
		reason: "",
		delivery: ""
	};
	return (event, count, bytes, wireBytes, buckets, bucketLabels, sessionEvent, presenceMode) => {
		labels.event = frameLabels.event = sessionLabels.event = event;
		store.counter("openclaw_gateway_ws_events_total", "Outbound Gateway WebSocket event frames accepted by the sender per socket.", labels, count);
		store.counter("openclaw_gateway_ws_event_bytes_total", "Encoded outbound Gateway WebSocket event bytes before framing or compression per socket.", labels, bytes);
		if (wireBytes !== void 0) store.counter("openclaw_gateway_ws_event_wire_bytes_total", "Outbound Gateway WebSocket payload bytes after compression per socket, excluding framing.", labels, wireBytes);
		if (count > 0) {
			let cumulative = 0;
			for (let i = 0; i < bucketLabels.length; i++) {
				cumulative += buckets[i];
				frameLabels.le = bucketLabels[i];
				(cumulative === 0 ? store.counterValue : store.counter)("openclaw_gateway_ws_event_frame_bytes", "Cumulative counts of accepted raw Gateway event frames by byte-size upper bound.", frameLabels, cumulative);
			}
		}
		if (presenceMode) {
			presenceLabels.mode = presenceMode;
			store.counter("openclaw_gateway_ws_presence_frames_total", "Outbound presence frames accepted by the sender per socket, by delivery mode.", presenceLabels, count);
			store.counter("openclaw_gateway_ws_presence_bytes_total", "Encoded outbound presence bytes before framing or compression per socket, by delivery mode.", presenceLabels, bytes);
		}
		if (sessionEvent) {
			sessionLabels.reason = sessionEvent.reason;
			sessionLabels.delivery = sessionEvent.delivery;
			store.counter("openclaw_gateway_ws_session_event_frames_total", "Outbound session event frames by reason and exact message subscription per socket.", sessionLabels, count);
			store.counter("openclaw_gateway_ws_session_event_bytes_total", "Encoded outbound session event bytes by reason and exact message subscription per socket.", sessionLabels, bytes);
		}
	};
}
function recordGatewayWsConnections(store, operators) {
	store.gauge("openclaw_gateway_ws_operator_connections", "Connected authenticated Gateway operator WebSockets.", {}, operators);
}
// extensions/diagnostics-prometheus/src/service-memory.ts
const WORKER_MEMORY_METRICS = [
	[
		"heapUsed",
		"openclaw_worker_heap_used_bytes",
		"heap usage"
	],
	[
		"external",
		"openclaw_worker_external_bytes",
		"external memory"
	],
	[
		"arrayBuffers",
		"openclaw_worker_array_buffers_bytes",
		"ArrayBuffer memory (included in external)"
	]
];
const HEAP_HEADROOM_METRICS = [
	[
		"limit",
		"openclaw_heap_size_limit_bytes",
		"Smallest live isolate V8 heap limit by thread group."
	],
	[
		"usedRatio",
		"openclaw_heap_used_ratio",
		"Largest live isolate used/limit ratio by thread group."
	],
	[
		"oldBytes",
		"openclaw_heap_old_generation_after_gc_bytes",
		"Largest live isolate old_space plus large_object_space usage at its last observed major GC."
	],
	[
		"oldRatio",
		"openclaw_heap_old_generation_after_gc_ratio",
		"Largest live isolate post-major-GC old-generation/heap-limit ratio by thread group."
	]
];
function collectHeapHeadroom(headroom, used, limit, oldBytes) {
	if (limit === void 0 || limit <= 0) return;
	headroom.limit = Math.min(headroom.limit ?? limit, limit);
	headroom.usedRatio = Math.max(headroom.usedRatio ?? 0, used / limit);
	if (oldBytes !== void 0) {
		headroom.oldBytes = Math.max(headroom.oldBytes ?? 0, oldBytes);
		headroom.oldRatio = Math.max(headroom.oldRatio ?? 0, oldBytes / limit);
	}
}
function recordHeapHeadroom(store, thread, headroom) {
	for (const [field, name, description] of HEAP_HEADROOM_METRICS) store.gauge(name, description, { thread }, headroom[field]);
}
function recordMemorySample(store, memory, byteBuckets) {
	for (const [, name] of HEAP_HEADROOM_METRICS) store.clearGauges(name);
	const mainHeadroom = {};
	collectHeapHeadroom(mainHeadroom, memory.heapUsedBytes, memory.heapSizeLimitBytes, memory.oldGenerationAfterGcBytes);
	recordHeapHeadroom(store, "main", mainHeadroom);
	store.clearGauges("openclaw_process_anonymous_memory_bytes");
	for (const [kind, field] of [["rss", "anonymousRssBytes"], ["swap", "anonymousSwapBytes"]]) store.gauge("openclaw_process_anonymous_memory_bytes", "Latest Linux process anonymous RSS and swap; includes managed heaps and buffers, not allocator totals.", { kind }, asNonNegativeFiniteNumber(memory[field]));
	for (const message of memory.workerMessages ?? []) {
		const labels = {
			kind: message.kind,
			direction: message.direction
		};
		store.counterValue("openclaw_worker_messages_total", "Messages crossing the Gateway main-thread worker boundary.", labels, message.messages);
		for (const [requestClass, bytes] of Object.entries(message.payloadBytesByRequestClass ?? { [message.kind === "sqlite_request" || message.kind === "sqlite_reply" || message.kind === "authority" ? "other" : ""]: message.payloadBytes })) store.counterValue("openclaw_worker_message_payload_bytes_total", "Known worker payload bytes, excluding transport framing and unmeasured object graphs.", requestClass ? {
			...labels,
			request_class: requestClass
		} : labels, bytes);
		store.counterValue("openclaw_worker_message_unmeasured_total", "Worker messages without a known payload size; these do not contribute to payload bytes.", labels, message.unmeasuredMessages);
		for (const [requestClass, components] of Object.entries(message.payloadComponents ?? {})) for (const [component, sample] of Object.entries(components)) {
			const componentLabels = {
				request_class: requestClass,
				component
			};
			store.counterValue("openclaw_worker_authority_component_sampled_bytes_total", "Sampled worker-to-main actor facts bytes; bounded marginal V8 sizes, one in 128 operations on average.", componentLabels, sample.bytes);
			for (const [result, count] of [["measured", sample.samples], ["unmeasured", sample.unmeasured]]) store.counterValue("openclaw_worker_authority_component_samples_total", "Actor authority component samples; failed receipt attribution retains known bytes in receipt_other.", {
				...componentLabels,
				result
			}, count);
		}
	}
	for (const reader of memory.sqliteReaderMetrics ?? []) {
		const labels = { reader_operation: reader.operation };
		store.counterValue("openclaw_sqlite_reader_operations_total", "Measured outer reader operations in direct workers, including failures and retired workers.", labels, reader.count);
		store.counterValue("openclaw_sqlite_reader_read_bytes_total", "Linux physical storage bytes read by outer reader operations, including sub-threshold reads.", labels, reader.readBytes);
	}
	for (const selection of memory.sessionRowSelections?.selections ?? []) {
		const labels = {
			kind: selection.kind,
			task: selection.task
		};
		store.counterValue("openclaw_session_row_selections_total", "Successful resident session-row selections by query shape and enclosing task.", labels, selection.calls);
		store.counterValue("openclaw_session_row_selection_rows_total", "Resident session rows returned by selections, before federation and visibility filtering.", labels, selection.rows);
	}
	if (memory.sessionRowSelections) {
		for (const partition of memory.sessionRowSelections.partitions) for (const outcome of ["hits", "misses"]) store.counterValue("openclaw_session_row_partition_cache_total", "Retained session-list partition lookups by outcome and enclosing selection task.", {
			task: partition.task,
			outcome: outcome === "hits" ? "hit" : "miss"
		}, partition[outcome]);
		for (const revision of memory.sessionRowSelections.partitionRevisions) store.counterValue("openclaw_session_row_partition_revisions_total", "Session-list partition revisions by synchronous internal change scope; excludes initial partitions.", { reason: revision.reason }, revision.changes);
		store.counterValue("openclaw_session_row_selection_resets_total", "Broad session-row selection invalidations, including topology replacement and disposal.", {}, memory.sessionRowSelections.resets);
	}
	for (const worker of memory.workerLifecycle ?? []) {
		store.counterValue("openclaw_worker_started_total", "Worker isolates created by bounded script basename.", { script: worker.script }, worker.started);
		for (const { reason, count } of worker.retired) store.counterValue("openclaw_worker_retired_total", "Worker isolates confirmed exited by owner retirement reason.", {
			script: worker.script,
			reason
		}, count);
	}
	for (const worker of memory.workerTaskMetrics ?? []) {
		const labels = {
			worker_class: worker.workerClass,
			script: worker.script
		};
		if (worker.tasksCompleted !== void 0) store.counterValue("openclaw_worker_tasks_completed_total", "Observed terminal task replies from pool workers, including handled failures.", labels, worker.tasksCompleted);
		store.gauge("openclaw_worker_heap_used_high_water_bytes", "Largest observed worker heap usage, retained across worker retirement.", labels, worker.heapUsedHighWaterBytes);
		for (const gc of worker.gc) {
			const gcLabels = {
				...labels,
				kind: gc.kind
			};
			store.counterValue("openclaw_worker_gc_duration_seconds_total", "Observed worker garbage collection duration, retained across worker retirement.", gcLabels, gc.durationMs / 1e3);
			store.counterValue("openclaw_worker_gc_collections_total", "Observed worker garbage collections, retained across worker retirement.", gcLabels, gc.count);
			store.counterValue("openclaw_worker_gc_reclaimed_bytes_total", "Sum of positive heap usage decreases across observed worker garbage collections.", gcLabels, gc.reclaimedBytes);
		}
	}
	for (const [kind, field] of [
		["rss", "rssBytes"],
		["heap_total", "heapTotalBytes"],
		["heap_used", "heapUsedBytes"],
		["external", "externalBytes"],
		["array_buffers", "arrayBuffersBytes"],
		["worker_heap_total", "workerHeapTotalBytes"],
		["worker_heap_used", "workerHeapUsedBytes"]
	]) store.gauge("openclaw_memory_bytes", "Latest process memory usage by memory kind.", { kind }, asNonNegativeFiniteNumber(memory[field]));
	for (const [name, field] of [["openclaw_worker_count", "workerCount"], ["openclaw_worker_heap_sampled_count", "workerHeapSampledCount"]]) {
		store.clearGauges(name);
		store.gauge(name, "Worker isolate counts.", {}, asNonNegativeFiniteNumber(memory[field]));
	}
	store.clearGauges("openclaw_heap_space_bytes");
	for (const space of memory.heapSpaces ?? []) for (const [stat, field] of [
		["used", "space_used_size"],
		["size", "space_size"],
		["available", "space_available_size"],
		["physical", "physical_space_size"]
	]) store.gauge("openclaw_heap_space_bytes", "Latest main-isolate V8 heap space usage in bytes.", {
		space: space.space_name,
		stat
	}, space[field]);
	const workers = /* @__PURE__ */ new Map();
	store.clearGauges("openclaw_code_mode_worker_heap_bytes");
	store.clearGauges("openclaw_code_mode_worker_memory_bytes");
	for (const worker of memory.workerHeaps ?? []) {
		if (worker.workerSlot !== void 0) {
			for (const [kind, value] of [["used", worker.heapUsed], ["limit", worker.heapSizeLimitBytes]]) store.gauge("openclaw_code_mode_worker_heap_bytes", "Latest live Code Mode isolate heap usage and limit by reusable worker slot.", {
				slot: String(worker.workerSlot),
				kind
			}, value);
			for (const [kind, value] of [["external", worker.external], ["array_buffers", worker.arrayBuffers]]) store.gauge("openclaw_code_mode_worker_memory_bytes", "Latest live Code Mode isolate external and ArrayBuffer memory (included in external) by reusable worker slot.", {
				slot: String(worker.workerSlot),
				kind
			}, value);
		}
		const totals = workers.get(worker.script) ?? {
			count: 0,
			sampled: 0
		};
		totals.count++;
		totals.sampled++;
		collectHeapHeadroom(totals, worker.heapUsed, worker.heapSizeLimitBytes, worker.oldGenerationAfterGcBytes);
		for (const [field] of WORKER_MEMORY_METRICS) {
			const value = worker[field];
			if (value !== void 0) totals[field] = (totals[field] ?? 0) + value;
		}
		for (const space of worker.heapSpaces ?? []) {
			totals.heapSpaces ??= /* @__PURE__ */ new Map();
			totals.heapSpaces.set(space.space_name, (totals.heapSpaces.get(space.space_name) ?? 0) + space.space_used_size);
		}
		workers.set(worker.script, totals);
	}
	for (const worker of memory.workerMemoryMissing ?? []) {
		const totals = workers.get(worker.script) ?? {
			count: 0,
			sampled: 0
		};
		totals.count++;
		workers.set(worker.script, totals);
	}
	for (const [, name] of WORKER_MEMORY_METRICS) store.clearGauges(name);
	store.clearGauges("openclaw_worker_heap_space_used_bytes");
	for (const [script, totals] of workers) {
		recordHeapHeadroom(store, script, totals);
		store.gauge("openclaw_worker_count", "Worker isolate counts.", { script }, totals.count);
		store.gauge("openclaw_worker_heap_sampled_count", "Worker isolate counts.", { script }, totals.sampled);
		for (const [field, name, description] of WORKER_MEMORY_METRICS) store.gauge(name, `Latest live Worker ${description} by bounded script basename.`, { script }, totals[field]);
		for (const [space, bytes] of totals.heapSpaces ?? []) store.gauge("openclaw_worker_heap_space_used_bytes", "Latest live Worker V8 heap space usage by bounded script basename.", {
			script,
			space
		}, bytes);
	}
	store.histogram("openclaw_memory_rss_bytes", "RSS memory sample distribution in bytes.", {}, asNonNegativeFiniteNumber(memory.rssBytes), byteBuckets);
}
// extensions/diagnostics-prometheus/src/service-model-usage.ts
const TOKEN_BUCKETS = [
	1,
	4,
	16,
	64,
	256,
	1024,
	4096,
	16384,
	65536,
	262144,
	1048576
];
function recordModelUsage(store, evt) {
	const labels = {
		agent: normalizeDiagnosticValue(evt.agentId),
		channel: normalizeDiagnosticValue(evt.channel),
		model: normalizeDiagnosticValue(evt.model),
		provider: normalizeDiagnosticValue(evt.provider)
	};
	const usage = evt.usage;
	const recordTokens = (tokenType, value) => {
		const amount = asNonNegativeFiniteNumber(value);
		if (amount === void 0 || amount === 0) return;
		store.counter("openclaw_model_tokens_total", "Model tokens reported by diagnostic usage events.", {
			...labels,
			token_type: tokenType
		}, amount);
		if (tokenType === "input" || tokenType === "output") store.histogram("openclaw_gen_ai_client_token_usage", "GenAI token usage distribution for input and output tokens.", {
			model: labels.model,
			provider: labels.provider,
			token_type: tokenType
		}, amount, TOKEN_BUCKETS);
	};
	recordTokens("input", usage.input);
	recordTokens("output", usage.output);
	recordTokens("cache_read", usage.cacheRead);
	recordTokens("cache_write", usage.cacheWrite);
	recordTokens("prompt", usage.promptTokens);
	recordTokens("total", usage.total);
	store.counter("openclaw_model_cost_usd_total", "Estimated model cost in USD reported by diagnostic usage events.", labels, asNonNegativeFiniteNumber(evt.costUsd) ?? 0);
	store.histogram("openclaw_model_usage_duration_seconds", "Model usage event duration in seconds.", labels, seconds(evt.durationMs));
}
// extensions/diagnostics-prometheus/src/service-operation-timing.ts
const GC_DURATION_NAME = "openclaw_gc_duration_seconds";
const GC_DURATION_HELP = "Elapsed garbage collection duration in seconds by collection kind, callback flags, and isolate role.";
function reserveMainGcHistograms(store) {
	for (const kind of [
		"scavenge",
		"mark_sweep_compact",
		"incremental",
		"weak_processing"
	]) store.reserveHistogram(GC_DURATION_NAME, GC_DURATION_HELP, {
		kind,
		reason: "other",
		thread: "main"
	});
}
const RPC_DURATION_BUCKETS_SECONDS = [
	.005,
	.01,
	.0125,
	.015,
	.02,
	.025,
	.03,
	.04,
	.05,
	.06,
	.08,
	.1,
	.125,
	.15,
	.2,
	.25,
	.3,
	.4,
	.5,
	.6,
	.8,
	1,
	1.25,
	1.5,
	2,
	2.5,
	3,
	4,
	5,
	6,
	8,
	10,
	12.5,
	15,
	20,
	25,
	30,
	60,
	120,
	300,
	600
];
const RESPONSE_BYTE_BUCKETS = Array.from({ length: 17 }, (_, index) => 1024 * 2 ** index);
const MAIN_THREAD_STALL_BUCKETS_SECONDS = [
	.25,
	.5,
	1,
	2.5,
	5,
	10
];
const HEAP_DELTA_BYTE_BUCKETS = [
	...RESPONSE_BYTE_BUCKETS.toReversed().map((bytes) => -bytes),
	0,
	...RESPONSE_BYTE_BUCKETS
];
const CATALOG_LIST_METHOD = "sessions.catalog.list";
const CATALOG_LIST_PHASE_PREFIX = `${CATALOG_LIST_METHOD}.`;
const CATALOG_LIST_PHASES = /* @__PURE__ */ new Set([
	"projection_initial",
	"planning",
	"provider",
	"coalesced",
	"projection_final",
	"delivery"
]);
const CHAT_STARTUP_PHASE = /^chat\.startup\.(session_entry|pending_inputs|history_page|startup_projection|projection_final|session_info)$/;
const DIFF_CACHE_MISS_REASONS = /* @__PURE__ */ new Set([
	"cold",
	"evicted",
	"pending",
	"no-revision",
	"no-revision-environment",
	"no-revision-platform",
	"no-revision-metadata",
	"no-revision-git-installation",
	"no-revision-config",
	"no-revision-reftable",
	"no-revision-alternates",
	"no-revision-symlink",
	"no-revision-nested-repository",
	"no-revision-status",
	"no-revision-unmerged",
	"no-revision-submodule",
	"no-revision-permission",
	"no-revision-missing",
	"no-revision-io",
	"oversized",
	"revision-changed-head",
	"revision-changed-index",
	"revision-changed-untracked-set",
	"revision-changed-worktree-mtime",
	"revision-changed-metadata"
]);
const CHAT_SEND_PHASE = /^chat\.send\.(authority|admission|preparation|attachments|replyContext|authoring|persist|runAdmission|replyInitialization|snapshot|worktree|effects|response|dispatch)$/;
const CONTROL_UI_DOCUMENT_STAGE = /^control-ui\.document\.(auth_grants|identity_avatar|plugin_catalog|git_branch|preferences|render|total)$/;
function recordOperationTimingEvent(store, evt, metadata) {
	switch (evt.type) {
		case "sessions.list.baseline.retired":
			if (metadata.trusted) store.counter("openclaw_sessions_list_baseline_retirements_total", "Session list baseline retirement events by cause, not rows or views retired.", { cause: evt.cause });
			return;
		case "secret.egress":
			store.counter("openclaw_secret_egress_requests_total", "Secret egress proxy requests by outcome and credential substitution.", {
				outcome: evt.outcome,
				substituted: String(evt.substituted)
			});
			return;
		case "tool.catalog": {
			const labels = {
				source: evt.source,
				mode: evt.mode
			};
			store.counter("openclaw_tool_catalog_total", "Tool catalogs prepared.", labels);
			store.counter("openclaw_tool_catalog_tools_total", "Tools cataloged during preparation.", labels, evt.toolCount);
			return;
		}
		case "gateway.http.cancelled":
			store.counter("openclaw_gateway_http_cancelled_total", "Gateway HTTP requests cancelled before completion.", { source: evt.source });
			return;
		case "diagnostic.gc":
			if (evt.kind === "mark_sweep_compact") {
				const labels = { thread: evt.thread ?? "main" };
				store.gauge("openclaw_heap_used_after_major_gc_bytes", "Native used heap after the latest received major collection by isolate role.", labels, evt.heapUsedAfterMajorGcBytes);
				store.gauge("openclaw_heap_used_after_major_gc_timestamp_seconds", "Unix observation time of the latest received native major-GC heap sample.", labels, evt.heapUsedAfterMajorGcTimestampSeconds);
			}
			store.histogram(GC_DURATION_NAME, GC_DURATION_HELP, {
				kind: evt.kind ?? "unknown",
				reason: evt.reason ?? "other",
				thread: evt.thread ?? "main",
				...evt.workerSlot === void 0 ? {} : { slot: String(evt.workerSlot) }
			}, seconds(evt.durationMs));
			return;
		case "gateway.main_thread.stall":
			for (const stall of evt.stalls) store.histogram("openclaw_gateway_main_thread_stall_seconds", "Elapsed main-thread tasks lasting at least 250 milliseconds, by work scope.", { task: normalizeDiagnosticValue(stall.task) }, seconds(stall.durationMs), MAIN_THREAD_STALL_BUCKETS_SECONDS);
			store.counter("openclaw_gateway_main_thread_stalls_dropped_total", "Main-thread stall records dropped because the attribution buffer was full.", {}, evt.dropped);
			return;
		case "gateway.event_loop.sample":
			store.histogram("openclaw_gateway_event_loop_delay_max_seconds", "Maximum event-loop delay per completed Gateway observation window in seconds.", {}, seconds(evt.delayMaxMs));
			store.counter("openclaw_gateway_event_loop_observed_seconds_total", "Elapsed seconds covered by completed Gateway event-loop observation windows.", {}, evt.intervalMs / 1e3);
			return;
		case "diagnostic.phase.completed": {
			if (!metadata.trusted) return;
			const documentStage = CONTROL_UI_DOCUMENT_STAGE.exec(evt.name)?.[1];
			if (documentStage) {
				store.histogram("openclaw_control_ui_document_duration_seconds", "Elapsed Control UI HTML document handler stages in seconds; stages can overlap.", { stage: documentStage }, seconds(evt.durationMs));
				return;
			}
			if (evt.name === "sessions.diff" || evt.name === "checkout.diff") {
				const outcome = evt.details?.outcome;
				if (outcome !== "cache-hit" && outcome !== "cache-miss") return;
				const reason = evt.details?.missReason;
				if (outcome === "cache-miss" && typeof reason === "string" && DIFF_CACHE_MISS_REASONS.has(reason)) store.counter("openclaw_diff_cache_misses_total", "Local diff cache misses by bounded reason; pending reads join an existing load.", {
					method: evt.name,
					reason
				});
				for (const stage of [
					"admission",
					"checkout-resolve",
					"cache-validate",
					"worker-queue",
					"git-wall",
					"encode"
				]) {
					const elapsed = evt.details?.[stage];
					store.histogram("openclaw_diff_stage_seconds", "Elapsed local diff stages; cache validation includes its worker queue and Git wall time.", {
						method: evt.name,
						stage,
						outcome
					}, typeof elapsed === "number" ? seconds(elapsed) : void 0, RPC_DURATION_BUCKETS_SECONDS);
				}
				return;
			}
			if (evt.name === "worktree.preparation") {
				const { kind, template, outcome } = evt.details ?? {};
				if (kind !== "managed" && kind !== "sandbox" || ![
					"warm",
					"cold",
					"unavailable",
					"reused"
				].includes(String(template)) || outcome !== "returned" && outcome !== "threw") return;
				for (const preparationPhase of [
					"total",
					"allocate",
					"checkout",
					"setup",
					"templatePrepare",
					"templateApply",
					"snapshot",
					"synchronizeCanonical",
					"synchronizeProjection",
					"containerStart",
					"workspaceLayout"
				]) {
					const elapsed = preparationPhase === "total" ? evt.durationMs : evt.details?.[preparationPhase];
					store.histogram("openclaw_worktree_preparation_seconds", "Elapsed managed worktree preparation time; nested phases are inclusive.", {
						kind,
						template: String(template),
						outcome,
						phase: preparationPhase
					}, typeof elapsed === "number" ? seconds(elapsed) : void 0);
				}
				return;
			}
			const sendPhase = CHAT_SEND_PHASE.exec(evt.name)?.[1];
			if (sendPhase) {
				const stage = evt.details?.stage;
				if (stage === "request" || stage === "startup" || stage === "steer" || stage === "queued") store.histogram("openclaw_chat_send_phase_seconds", "Elapsed chat.send owner phases before acknowledgement, during startup, or awaiting steering and queued follow-up delivery.", {
					phase: sendPhase,
					stage
				}, seconds(evt.durationMs));
				return;
			}
			const startupPhase = CHAT_STARTUP_PHASE.exec(evt.name)?.[1];
			if (startupPhase) {
				store.histogram("openclaw_gateway_rpc_stage_seconds", "Elapsed time for completed Gateway RPC owner stages.", {
					method: "chat.startup",
					phase: startupPhase
				}, seconds(evt.durationMs));
				return;
			}
			if (!evt.name.startsWith(CATALOG_LIST_PHASE_PREFIX)) return;
			const phase = evt.name.slice(CATALOG_LIST_PHASE_PREFIX.length);
			const duration = seconds(evt.durationMs);
			if (!CATALOG_LIST_PHASES.has(phase) || duration === void 0) return;
			const labels = {
				method: CATALOG_LIST_METHOD,
				phase
			};
			store.histogram("openclaw_gateway_rpc_stage_seconds", "Elapsed time for completed Gateway RPC owner stages.", labels, duration);
			const cpu = evt.details?.threadCpuMs;
			if ((phase === "planning" || phase === "delivery") && typeof cpu === "number") store.histogram("openclaw_gateway_rpc_stage_thread_cpu_seconds", "Current-thread CPU for synchronous Gateway RPC owner stages.", labels, seconds(cpu));
			return;
		}
		case "gateway.rpc": {
			const labels = { method: evt.method };
			if (evt.phase === "received") {
				store.counter("openclaw_gateway_rpc_requests_total", "Authenticated Gateway WebSocket requests received.", labels);
				store.counter("openclaw_gateway_rpc_client_requests_total", "Gateway RPC requests by bounded handshake client kind.", {
					method: evt.method,
					client_kind: evt.clientKind ?? "other"
				});
				if (evt.method === "models.list" && evt.modelsList) {
					const catalog = evt.modelsList;
					store.counter("openclaw_models_list_requests_total", "Model catalog requests by client kind and bounded request shape.", {
						client_kind: catalog.clientKind,
						source: catalog.source,
						view: catalog.view,
						scope: catalog.scope,
						refresh: String(catalog.refresh),
						prepared_only: String(catalog.preparedOnly)
					});
				}
				if (evt.method === "sessions.list" && evt.sessionsList) {
					const sessions = evt.sessionsList;
					store.counter("openclaw_sessions_list_requests_total", "Session list requests by client kind and bounded request shape.", {
						client_kind: sessions.clientKind,
						source: sessions.source,
						caller_source: sessions.callerSource,
						row_mode: sessions.rowMode,
						filter: sessions.filter
					});
				}
				if (evt.method === "cron.list" && evt.cronList) {
					const cron = evt.cronList;
					store.counter("openclaw_cron_list_requests_total", "Cron list requests by client kind and bounded request shape.", {
						client_kind: cron.clientKind,
						source: cron.source,
						scope: cron.scope,
						compact: String(cron.compact),
						page: cron.page
					});
				}
				return;
			}
			if (evt.phase === "response" && (evt.outcome === "ok" || evt.outcome === "error")) {
				if (evt.outcome === "ok" && evt.firstResponse !== false && evt.sessionsList?.baseMissReason) store.counter("openclaw_sessions_list_base_misses_total", "Successful full sidebar responses with a supplied base, by miss reason.", { reason: evt.sessionsList.baseMissReason });
				store.histogram("openclaw_gateway_rpc_response_bytes", "Encoded Gateway RPC response frame size in bytes, including later frames.", labels, evt.responseBytes, RESPONSE_BYTE_BUCKETS);
				if (evt.responseBytes !== void 0 && evt.sessionsList) {
					const sessions = evt.sessionsList;
					store.counter("openclaw_sessions_list_response_bytes_total", "Encoded successful session list response bytes by request shape and row outcome.", {
						client_kind: sessions.clientKind,
						source: sessions.source,
						caller_source: sessions.callerSource,
						row_mode: sessions.rowMode,
						filter: sessions.filter,
						rows_outcome: sessions.rowsOutcome
					}, evt.responseBytes);
				}
				if (evt.chatHistory) {
					const history = evt.chatHistory;
					const historyLabels = {
						client_kind: history.clientKind,
						source: history.source,
						shape: history.shape,
						limit_bucket: history.limitBucket,
						outcome: history.outcome
					};
					if (evt.firstResponse !== false) store.counter("openclaw_chat_history_requests_total", "Successful chat history requests by request shape and response outcome.", historyLabels);
					if (evt.responseBytes !== void 0) store.counter("openclaw_chat_history_response_bytes_total", "Encoded successful chat history response bytes by request shape and response outcome.", historyLabels, evt.responseBytes);
				}
				if (evt.firstResponse === false) return;
			}
			store.counter("openclaw_gateway_rpc_outcomes_total", "Gateway RPC observations by phase and outcome.", {
				phase: evt.phase,
				outcome: evt.outcome
			});
			if (evt.phase === "response" && (evt.outcome === "ok" || evt.outcome === "error")) store.histogram("openclaw_gateway_rpc_first_response_seconds", "Elapsed time until the first Gateway RPC response is sent.", labels, seconds(evt.durationMs), RPC_DURATION_BUCKETS_SECONDS);
			else if (evt.phase === "handler") {
				if (evt.heapDeltaBytes !== void 0) store.counter("openclaw_gateway_rpc_handler_heap_delta_exclusive_total", "Gateway RPC handlers with an exclusive main-thread heap-change sample.", labels);
				store.histogram("openclaw_gateway_rpc_handler_heap_delta_bytes", "Exclusive RPC handler heap change; background work and GC can affect signed samples.", labels, evt.heapDeltaBytes, HEAP_DELTA_BYTE_BUCKETS);
				store.histogram("openclaw_gateway_rpc_handler_seconds", "Gateway RPC handler duration until return or throw.", labels, seconds(evt.durationMs), RPC_DURATION_BUCKETS_SECONDS);
				store.histogram("openclaw_gateway_rpc_admission_seconds", "Elapsed time from Gateway RPC receipt until handler invocation.", labels, seconds(evt.admissionMs), RPC_DURATION_BUCKETS_SECONDS);
			} else if (evt.phase === "dispatch") store.histogram("openclaw_gateway_rpc_queue_wait_seconds", "Gateway operator request start queue wait.", labels, seconds(evt.queueWaitMs), RPC_DURATION_BUCKETS_SECONDS);
		}
	}
}
// extensions/diagnostics-prometheus/src/service-retention.ts
function recordSessionRetention(store, evt) {
	if (evt.type === "sessions.event.rows.reset") {
		store.counter("openclaw_session_event_rows_reset_total", "Retained session-event wire baselines retired by cause.", { cause: evt.cause }, evt.count);
		return;
	}
	if (evt.type === "sessions.projection.retention") {
		store.gauge("openclaw_session_projection_owners", "Live resident session-row projections.", {}, evt.projections);
		store.gauge("openclaw_session_projection_rows_retained_entries", "Resident entries in session-row projection maps.", {}, evt.entries);
		store.gauge("openclaw_session_projection_rows_retained_bytes", "Bounded estimate of data reachable from resident session-row maps; excludes closure and native storage.", {}, evt.estimatedBytes);
		store.gauge("openclaw_session_projection_rows_estimate_truncated", "Projections whose retained-data estimate reached a bound or unsupported value.", {}, evt.truncatedProjections);
		return;
	}
	if (evt.type === "sessions.list.retention") {
		store.gauge("openclaw_sessions_list_retained_views", "Retained session-list views across all publications.", {}, evt.views);
		store.gauge("openclaw_sessions_list_retained_refs", "Row references and selection entries retained by session-list views.", {}, evt.refs);
		store.gauge("openclaw_sessions_list_retained_bytes", "Estimated memory retained by session-list views.", {}, evt.estimatedBytes);
		return;
	}
	store.gauge("openclaw_session_event_rows_retained_entries", "Session-event field-hash vectors retained across all connections.", {}, evt.entries);
	store.gauge("openclaw_session_event_rows_retained_bytes", "Estimated memory retained by session-event field-hash vectors.", {}, evt.estimatedBytes);
}
// extensions/diagnostics-prometheus/src/service-sessions.ts
function recordSessionDiagnosticEvent(store, evt) {
	switch (evt.type) {
		case "session.recovery.requested":
		case "session.recovery.completed": {
			const labels = {
				action: evt.type === "session.recovery.completed" ? normalizeDiagnosticValue(evt.action, "unknown") : evt.allowActiveAbort ? "abort" : "recover",
				active_work_kind: normalizeDiagnosticValue(evt.activeWorkKind, "none"),
				state: evt.state,
				status: evt.type === "session.recovery.completed" ? evt.status : "requested"
			};
			store.counter("openclaw_session_recovery_total", "Session recovery observations by status and action.", labels);
			store.histogram("openclaw_session_recovery_age_seconds", "Age of sessions selected for recovery in seconds.", labels, seconds(evt.ageMs));
			return;
		}
		case "session.state":
			store.counter("openclaw_session_state_total", "Cumulative session state observations since exporter start; not current sessions.", {
				reason: normalizeDiagnosticValue(evt.reason, "none"),
				state: evt.state
			});
			if (evt.queueDepth !== void 0) store.gauge("openclaw_session_queue_depth", "Latest observed session queue depth.", { state: evt.state }, asNonNegativeFiniteNumber(evt.queueDepth));
			return;
		case "session.stuck": {
			const labels = {
				reason: normalizeDiagnosticValue(evt.reason, "none"),
				state: evt.state
			};
			store.counter("openclaw_session_stuck_total", "Stale session bookkeeping observations with no active work.", labels);
			store.histogram("openclaw_session_stuck_age_seconds", "Age of stale session bookkeeping observations in seconds.", labels, seconds(evt.ageMs));
			return;
		}
		case "session.turn.created": store.counter("openclaw_session_turn_created_total", "Agent session turns created.", {
			agent: normalizeDiagnosticValue(evt.agentId),
			channel: normalizeDiagnosticValue(evt.channel),
			trigger: evt.trigger
		});
	}
}
// extensions/diagnostics-prometheus/src/service-worker.ts
const TOTALS_ONLY_BUCKETS = [];
const WORKER_REQUEST_PHASES = [
	[
		"dispatch",
		"dispatched",
		"posted"
	],
	[
		"delivery",
		"posted",
		"received"
	],
	[
		"backend-load",
		"backendLoadStarted",
		"backendLoadFinished"
	],
	[
		"open-grant",
		"openGrantStarted",
		"openGrantFinished"
	],
	[
		"factory",
		"factoryStarted",
		"factoryFinished"
	],
	[
		"input",
		"received",
		"inputReady"
	],
	[
		"prepare",
		"inputReady",
		"executeStarted"
	],
	[
		"execute",
		"executeStarted",
		"executeFinished"
	],
	[
		"result",
		"executeFinished",
		"replied"
	],
	[
		"reply",
		"replied",
		"replyReceived"
	]
];
function createWorkerRequestMetricsRecorder(store) {
	return (kind, requestClass, requestPhase, queueDepth, queueWaitMs, durationMs, timing) => {
		store.gauge("openclaw_worker_queue_depth", "Requests awaiting dispatch across worker owners of this kind.", { kind }, queueDepth);
		const labels = {
			kind,
			request_class: requestClass
		};
		store.histogram("openclaw_worker_queue_wait_seconds", "Elapsed time from worker request enqueue to dispatch.", labels, seconds(queueWaitMs));
		store.histogram("openclaw_worker_request_seconds", "Elapsed time from worker dispatch to reply or failure, including preparation and transport.", labels, seconds(durationMs), TOTALS_ONLY_BUCKETS);
		if (requestPhase !== "completed" || !timing) return;
		for (const [phase, start, end] of WORKER_REQUEST_PHASES) {
			const started = timing[start];
			const finished = timing[end];
			if (started === void 0 || finished === void 0) continue;
			store.histogram("openclaw_worker_request_phase_seconds", "Elapsed time within an observed SQLite worker request phase, including transport.", {
				...labels,
				phase
			}, seconds(finished - started), TOTALS_ONLY_BUCKETS);
		}
	};
}
// extensions/diagnostics-prometheus/src/service.ts
const BYTE_BUCKETS = [
	1024,
	4096,
	16384,
	65536,
	262144,
	1048576,
	4194304,
	16777216,
	67108864,
	268435456,
	1073741824,
	4294967296,
	17179869184
];
const RATIO_BUCKETS = [
	.01,
	.05,
	.1,
	.25,
	.5,
	.75,
	1,
	2,
	4,
	8,
	16
];
function safeErrorMessage(err) {
	const message = err instanceof Error ? err.message ?? err.name : String(err);
	return truncateUtf16Safe(redactSensitiveText(message).replaceAll("\0", " ").replace(/[\r\n\t\u2028\u2029]/gu, " "), 500);
}
function webhookLabels(evt) {
	return {
		channel: normalizeDiagnosticValue(evt.channel),
		webhook: normalizeDiagnosticValue(evt.updateType)
	};
}
function recordDiagnosticEvent(store, evt, metadata) {
	if (!metadata.trusted && !isInternalDiagnosticEventMetadata(metadata)) return;
	switch (evt.type) {
		case "gateway.ws.connections":
			if (metadata.trusted) recordGatewayWsConnections(store, evt.operators);
			return;
		case "sessions.list.retention":
		case "sessions.projection.retention":
		case "sessions.event.retention":
		case "sessions.event.rows.reset":
			if (metadata.trusted) recordSessionRetention(store, evt);
			return;
		case "diagnostic.phase.completed":
		case "secret.egress":
		case "tool.catalog":
		case "gateway.rpc":
		case "sessions.list.baseline.retired":
		case "gateway.http.cancelled":
		case "diagnostic.gc":
		case "gateway.event_loop.sample":
		case "gateway.main_thread.stall":
			recordOperationTimingEvent(store, evt, metadata);
			return;
		case "model.usage":
			recordModelUsage(store, evt);
			return;
		case "run.completed": {
			const labels = {
				...evt.blockedBy ? { blocked_by: normalizeDiagnosticValue(evt.blockedBy) } : {},
				channel: normalizeDiagnosticValue(evt.channel),
				model: normalizeDiagnosticValue(evt.model),
				outcome: normalizeDiagnosticValue(evt.outcome, "unknown"),
				provider: normalizeDiagnosticValue(evt.provider),
				trigger: normalizeDiagnosticValue(evt.trigger)
			};
			store.histogram("openclaw_run_duration_seconds", "Agent run duration in seconds.", labels, seconds(evt.durationMs), AGENT_DURATION_BUCKETS_SECONDS);
			store.counter("openclaw_run_completed_total", "Agent runs completed by outcome.", labels);
			return;
		}
		case "model.call.completed":
		case "model.call.error": {
			const labels = {
				api: normalizeDiagnosticValue(evt.api),
				error_category: evt.type === "model.call.error" ? normalizeDiagnosticValue(evt.errorCategory, "other") : "none",
				model: normalizeDiagnosticValue(evt.model),
				observation_unit: evt.observationUnit === "turn" ? "turn" : "request",
				outcome: evt.type === "model.call.error" ? "error" : "completed",
				provider: normalizeDiagnosticValue(evt.provider),
				transport: normalizeDiagnosticValue(evt.transport)
			};
			store.histogram("openclaw_model_call_duration_seconds", "Model request or synthetic agent-turn duration in seconds.", labels, seconds(evt.durationMs), AGENT_DURATION_BUCKETS_SECONDS);
			store.counter("openclaw_model_call_total", "Model requests or synthetic agent turns completed by outcome.", labels);
			return;
		}
		case "model.failover": {
			const labels = {
				from_model: normalizeDiagnosticValue(evt.fromModel),
				from_provider: normalizeDiagnosticValue(evt.fromProvider),
				lane: normalizeDiagnosticLane(evt.lane),
				reason: normalizeDiagnosticValue(evt.reason, "other"),
				suspended: evt.suspended === void 0 ? "unknown" : String(evt.suspended),
				to_model: normalizeDiagnosticValue(evt.toModel),
				to_provider: normalizeDiagnosticValue(evt.toProvider)
			};
			store.counter("openclaw_model_failover_total", "Model failovers by source, destination, lane, and reason.", labels);
			return;
		}
		case "tool.execution.completed":
		case "tool.execution.error": {
			const labels = {
				error_category: evt.type === "tool.execution.error" ? normalizeDiagnosticValue(evt.errorCategory, "other") : "none",
				outcome: evt.type === "tool.execution.error" ? "error" : "completed",
				params_kind: normalizeDiagnosticValue(evt.paramsSummary?.kind),
				tool: normalizeDiagnosticValue(evt.toolName, "tool"),
				tool_owner: normalizeDiagnosticValue(evt.toolOwner, "none"),
				tool_source: normalizeDiagnosticValue(evt.toolSource, "core")
			};
			store.histogram("openclaw_tool_execution_duration_seconds", "Tool execution duration in seconds.", labels, seconds(evt.durationMs));
			store.counter("openclaw_tool_execution_total", "Tool executions completed by outcome.", labels);
			return;
		}
		case "tool.execution.blocked": {
			const labels = {
				denied_reason: normalizeDiagnosticValue(evt.deniedReason, "other"),
				params_kind: normalizeDiagnosticValue(evt.paramsSummary?.kind),
				tool: normalizeDiagnosticValue(evt.toolName, "tool"),
				tool_owner: normalizeDiagnosticValue(evt.toolOwner, "none"),
				tool_source: normalizeDiagnosticValue(evt.toolSource, "core")
			};
			store.counter("openclaw_tool_execution_blocked_total", "Tool executions blocked by policy or sandbox diagnostics.", labels);
			return;
		}
		case "skill.used": {
			const labels = {
				activation: normalizeDiagnosticValue(evt.activation, "unknown"),
				agent: normalizeDiagnosticValue(evt.agentId),
				skill: normalizeDiagnosticValue(evt.skillName, "skill"),
				source: normalizeDiagnosticValue(evt.skillSource)
			};
			store.counter("openclaw_skill_used_total", "Skills used by agent runs.", labels);
			return;
		}
		case "harness.run.completed":
		case "harness.run.error": {
			const labels = {
				channel: normalizeDiagnosticValue(evt.channel),
				error_category: evt.type === "harness.run.error" ? normalizeDiagnosticValue(evt.errorCategory, "other") : "none",
				harness: normalizeDiagnosticValue(evt.harnessId),
				model: normalizeDiagnosticValue(evt.model),
				outcome: evt.type === "harness.run.error" ? "error" : normalizeDiagnosticValue(evt.outcome),
				phase: evt.type === "harness.run.error" ? normalizeDiagnosticValue(evt.phase) : "none",
				plugin: normalizeDiagnosticValue(evt.pluginId),
				provider: normalizeDiagnosticValue(evt.provider)
			};
			store.histogram("openclaw_harness_run_duration_seconds", "Agent harness run duration in seconds.", labels, seconds(evt.durationMs), AGENT_DURATION_BUCKETS_SECONDS);
			store.counter("openclaw_harness_run_total", "Agent harness runs completed by outcome.", labels);
			return;
		}
		case "message.processed": {
			const labels = {
				channel: normalizeDiagnosticValue(evt.channel),
				outcome: evt.outcome,
				reason: normalizeDiagnosticValue(evt.reason, "none")
			};
			store.counter("openclaw_message_processed_total", "Inbound messages processed by outcome.", labels);
			store.histogram("openclaw_message_processed_duration_seconds", "Inbound message processing duration in seconds.", labels, seconds(evt.durationMs));
			return;
		}
		case "webhook.received":
			store.counter("openclaw_webhook_received_total", "Webhook requests received by channel and update type.", webhookLabels(evt));
			return;
		case "webhook.processed":
			store.histogram("openclaw_webhook_duration_seconds", "Webhook processing duration in seconds.", webhookLabels(evt), seconds(evt.durationMs));
			return;
		case "webhook.error":
			store.counter("openclaw_webhook_error_total", "Webhook processing errors by channel and update type.", webhookLabels(evt));
			return;
		case "message.delivery.started":
			store.counter("openclaw_message_delivery_started_total", "Outbound message delivery attempts started.", {
				channel: normalizeDiagnosticValue(evt.channel),
				delivery_kind: normalizeDiagnosticValue(evt.deliveryKind, "other")
			});
			return;
		case "message.received":
			store.counter("openclaw_message_received_total", "Inbound messages received by channel.", {
				channel: normalizeDiagnosticValue(evt.channel),
				source: normalizeDiagnosticValue(evt.source)
			});
			return;
		case "message.dispatch.started":
			store.counter("openclaw_message_dispatch_started_total", "Inbound message dispatch attempts started by channel.", {
				channel: normalizeDiagnosticValue(evt.channel),
				source: normalizeDiagnosticValue(evt.source)
			});
			return;
		case "message.dispatch.completed": {
			const labels = {
				channel: normalizeDiagnosticValue(evt.channel),
				outcome: evt.outcome,
				reason: normalizeDiagnosticValue(evt.reason, "none"),
				source: normalizeDiagnosticValue(evt.source)
			};
			store.counter("openclaw_message_dispatch_completed_total", "Inbound message dispatch attempts completed by outcome.", labels);
			store.histogram("openclaw_message_dispatch_duration_seconds", "Inbound message dispatch duration in seconds.", labels, seconds(evt.durationMs), AGENT_DURATION_BUCKETS_SECONDS);
			return;
		}
		case "message.delivery.completed":
		case "message.delivery.error": {
			const labels = {
				channel: normalizeDiagnosticValue(evt.channel),
				delivery_kind: normalizeDiagnosticValue(evt.deliveryKind, "other"),
				error_category: evt.type === "message.delivery.error" ? normalizeDiagnosticValue(evt.errorCategory, "other") : "none",
				outcome: evt.type === "message.delivery.error" ? "error" : "completed"
			};
			store.counter("openclaw_message_delivery_total", "Outbound message delivery attempts by outcome.", labels);
			store.histogram("openclaw_message_delivery_duration_seconds", "Outbound message delivery duration in seconds.", labels, seconds(evt.durationMs));
			return;
		}
		case "talk.event": {
			const labels = {
				brain: normalizeDiagnosticValue(evt.brain),
				event_type: normalizeDiagnosticValue(evt.talkEventType),
				mode: normalizeDiagnosticValue(evt.mode),
				provider: normalizeDiagnosticValue(evt.provider),
				transport: normalizeDiagnosticValue(evt.transport)
			};
			store.counter("openclaw_talk_event_total", "Talk events emitted by type.", labels);
			store.histogram("openclaw_talk_event_duration_seconds", "Talk event duration in seconds when reported.", labels, seconds(evt.durationMs));
			store.histogram("openclaw_talk_audio_bytes", "Talk audio frame byte lengths.", labels, asNonNegativeFiniteNumber(evt.byteLength), BYTE_BUCKETS);
			return;
		}
		case "session.recovery.requested":
		case "session.recovery.completed":
			recordSessionDiagnosticEvent(store, evt);
			return;
		case "queue.lane.enqueue":
		case "queue.lane.dequeue": {
			const labels = { lane: normalizeDiagnosticLane(evt.lane) };
			store.gauge("openclaw_queue_lane_size", "Current diagnostic queue lane size.", labels, asNonNegativeFiniteNumber(evt.queueSize));
			if (evt.type === "queue.lane.dequeue") store.histogram("openclaw_queue_lane_wait_seconds", "Queue lane wait time in seconds.", labels, seconds(evt.waitMs));
			return;
		}
		case "session.state":
		case "session.stuck":
		case "session.turn.created":
			recordSessionDiagnosticEvent(store, evt);
			return;
		case "diagnostic.child_process.spawn":
			store.counter("openclaw_child_process_spawn_total", "Successful child launches through the shared spawn and exec owners.", {
				family: normalizeDiagnosticValue(evt.family),
				operation: normalizeDiagnosticValue(evt.operation ?? (evt.family === "git" ? "unknown" : "none"))
			}, asNonNegativeFiniteNumber(evt.count) ?? 0);
			return;
		case "diagnostic.memory.sample":
			recordMemorySample(store, evt.memory, BYTE_BUCKETS);
			return;
		case "diagnostic.memory.pressure":
			store.counter("openclaw_memory_pressure_total", "Memory pressure events by level and reason.", {
				level: evt.level,
				reason: evt.reason
			});
			return;
		case "diagnostic.liveness.warning": {
			const labels = { reason: normalizeDiagnosticValue(evt.reasons.join(":"), "unknown") };
			store.counter("openclaw_liveness_warning_total", "Diagnostic liveness warning events.", labels);
			for (const state of [
				"active",
				"waiting",
				"queued"
			]) store.gauge("openclaw_liveness_sessions", "Latest session counts reported with diagnostic liveness warnings.", { state }, asNonNegativeFiniteNumber(evt[state]));
			store.histogram("openclaw_liveness_event_loop_delay_p99_seconds", "P99 event-loop delay reported by diagnostic liveness warnings in seconds.", labels, seconds(evt.eventLoopDelayP99Ms));
			store.histogram("openclaw_liveness_event_loop_delay_max_seconds", "Maximum event-loop delay reported by diagnostic liveness warnings in seconds.", labels, seconds(evt.eventLoopDelayMaxMs));
			store.histogram("openclaw_liveness_event_loop_utilization_ratio", "Event-loop utilization reported by diagnostic liveness warnings.", labels, asNonNegativeFiniteNumber(evt.eventLoopUtilization), RATIO_BUCKETS);
			store.histogram("openclaw_liveness_cpu_core_ratio", "Whole-process CPU usage in core equivalents, including worker and native threads; can exceed 1.", labels, asNonNegativeFiniteNumber(evt.cpuCoreRatio), RATIO_BUCKETS);
			return;
		}
		case "diagnostic.async_queue.dropped":
			for (const [dropClass, field] of [
				["total", "droppedEvents"],
				["trusted", "droppedTrustedEvents"],
				["untrusted", "droppedUntrustedEvents"],
				["priority", "droppedPriorityEvents"]
			]) {
				if (field !== "droppedEvents" && evt[field] === void 0) continue;
				store.counter("openclaw_diagnostic_async_queue_dropped_total", "Async diagnostic queue drops by dropped event class.", { drop_class: dropClass }, asNonNegativeFiniteNumber(evt[field]));
			}
			store.gauge("openclaw_diagnostic_async_queue_length", "Latest async diagnostic queue length after a drop summary.", {}, asNonNegativeFiniteNumber(evt.queueLength));
			break;
		case "diagnostic.heartbeat": break;
		case "telemetry.exporter":
			store.counter("openclaw_telemetry_exporter_total", "Telemetry exporter lifecycle events.", {
				exporter: normalizeDiagnosticValue(evt.exporter),
				reason: normalizeDiagnosticValue(evt.reason, "none"),
				signal: evt.signal,
				status: evt.status
			});
			return;
		case "payload.large": {
			const labels = {
				action: evt.action,
				channel: normalizeDiagnosticValue(evt.channel, "none"),
				plugin: normalizeDiagnosticValue(evt.pluginId, "none"),
				reason: normalizeDiagnosticValue(evt.reason, "none"),
				surface: normalizeDiagnosticValue(evt.surface, "unknown")
			};
			store.counter("openclaw_payload_large_total", "Oversized payload diagnostics by surface and action.", labels);
			store.histogram("openclaw_payload_large_bytes", "Oversized payload byte sizes by surface and action.", labels, asNonNegativeFiniteNumber(evt.bytes), BYTE_BUCKETS);
		}
	}
}
const METRICS_READ_SCOPE = "operator.read";
const METRICS_READ_IMPLYING_SCOPES = [
	METRICS_READ_SCOPE,
	"operator.write",
	"operator.admin"
];
function hasMetricsReadScope() {
	const runtimeScopes = getPluginRuntimeGatewayRequestScope()?.client?.connect?.scopes;
	const scopes = Array.isArray(runtimeScopes) ? runtimeScopes : [];
	return METRICS_READ_IMPLYING_SCOPES.some((scope) => scopes.includes(scope));
}
function createMetricsHandler(store) {
	return (req, res) => {
		if (!hasMetricsReadScope()) {
			res.statusCode = 403;
			res.setHeader("Cache-Control", "no-store");
			res.setHeader("Content-Type", "text/plain; charset=utf-8");
			res.end(`missing scope: ${METRICS_READ_SCOPE}`);
			return true;
		}
		if (req.method !== "GET" && req.method !== "HEAD") {
			res.statusCode = 405;
			res.setHeader("Allow", "GET, HEAD");
			res.end("Method Not Allowed");
			return true;
		}
		const body = store.render();
		res.statusCode = 200;
		res.setHeader("Cache-Control", "no-store");
		res.setHeader("Content-Type", "text/plain; version=0.0.4; charset=utf-8");
		res.setHeader("Content-Length", String(body.length));
		res.flushHeaders();
		res.end(req.method === "HEAD" ? void 0 : body, (error) => {
			if (!error) body.buffer.transfer(0);
		});
		return true;
	};
}
function createDiagnosticsPrometheusExporter() {
	let logger;
	const store = createPrometheusMetricStore((family) => {
		logger?.warn(`diagnostics-prometheus: series budget reached for ${family}; new label sets are being dropped. See openclaw_prometheus_family_series_dropped_total.`);
	});
	let subscriptions = [];
	let internalDiagnostics;
	const reportExporterStatus = (update) => {
		try {
			internalDiagnostics?.reportExporterHealth?.(update);
		} catch {}
		const { transport: _transport, ...event } = update;
		internalDiagnostics?.emit({
			type: "telemetry.exporter",
			exporter: "diagnostics-prometheus",
			...event
		});
	};
	return {
		handler: createMetricsHandler(store),
		service: {
			id: "diagnostics-prometheus",
			start(ctx) {
				const subscribe = ctx.internalDiagnostics?.onEvent;
				if (!subscribe) {
					ctx.logger.error("diagnostics-prometheus: internal diagnostics capability unavailable");
					return;
				}
				logger = ctx.logger;
				reserveMainGcHistograms(store);
				const identity = isDiagnosticsEnabled(ctx.config) ? ctx.internalDiagnostics?.getRuntimeIdentity?.() : void 0;
				if (identity) store.gauge("openclaw_gateway_build_info", "Identity of the hosting process and its loaded build; not a health or exporter epoch.", {
					process_instance_id: identity.processInstanceId,
					...identity.buildId ? { build_id: identity.buildId } : {}
				}, 1);
				subscriptions = [
					ctx.internalDiagnostics?.onGatewayWorkMetrics?.((snapshot) => {
						if (!snapshot) {
							store.clearGauges("openclaw_sessions_active");
							store.clearGauges("openclaw_gateway_active_work");
							return;
						}
						for (const state of ["running", "queued"]) store.gauge("openclaw_sessions_active", "Current active sessions in the Gateway session roster by run state.", { state }, snapshot.sessions[state]);
						for (const kind of [
							"agentRuns",
							"chatRuns",
							"queuedTurns"
						]) store.gauge("openclaw_gateway_active_work", "Current Gateway work by owner; categories may overlap.", { kind }, snapshot.work[kind]);
					}),
					ctx.internalDiagnostics?.onGatewayWsMetrics?.(createGatewayWsMetricsRecorder(store)),
					ctx.internalDiagnostics?.onWorkerRequestMetrics?.(createWorkerRequestMetricsRecorder(store)),
					subscribe((event, metadata) => {
						try {
							recordDiagnosticEvent(store, event, metadata);
						} catch (err) {
							ctx.logger.error(`diagnostics-prometheus: event handler failed (${event.type}): ${safeErrorMessage(err)}`);
						}
					}, {
						exclude: [
							"log.record",
							"worker.request",
							"gateway.ws.event"
						],
						includePromptStats: false
					}, { includePrivateData: false })
				];
				internalDiagnostics = ctx.internalDiagnostics;
				reportExporterStatus({
					signal: "metrics",
					transport: "prometheus-scrape",
					status: "started",
					reason: "configured"
				});
			},
			stop() {
				for (const unsubscribe of subscriptions) unsubscribe?.();
				subscriptions = [];
				reportExporterStatus({
					signal: "metrics",
					transport: "prometheus-scrape",
					status: "dropped"
				});
				internalDiagnostics = void 0;
				store.reset();
				logger = void 0;
			}
		}
	};
}
// extensions/diagnostics-prometheus/index.ts
const exporter = createDiagnosticsPrometheusExporter();
var diagnostics_prometheus_default = definePluginEntry({
	id: "diagnostics-prometheus",
	name: "Diagnostics Prometheus",
	description: "Expose OpenClaw diagnostics metrics in Prometheus text format",
	register(api) {
		api.registerService(exporter.service);
		api.registerHttpRoute({
			path: "/api/diagnostics/prometheus",
			auth: "gateway",
			match: "exact",
			gatewayRuntimeScopeSurface: "trusted-operator",
			handler: exporter.handler
		});
	}
});
export { diagnostics_prometheus_default as default };
