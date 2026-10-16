import { Jn as string, Lt as boolean, Nt as array, Pn as number, Un as record, or as union, qn as strictObject, xn as literal } from "./schemas-BOYIvvln.mjs";
import { r as LoggingLevelSchema } from "./zod-schema.root-support-B_04-6fB.mjs";
//#region src/config/zod-schema.logging.ts
const MetricNamePrefixSchema = string().max(128).regex(/^(?:[A-Za-z][A-Za-z0-9_./-]*)?$/);
const DiagnosticsConfigSchema = strictObject({
	enabled: boolean().optional(),
	/** Optional ad-hoc diagnostics flags (e.g. "telegram.http"). */
	flags: array(string()).optional(),
	otel: strictObject({
		enabled: boolean().optional(),
		endpoint: string().optional(),
		tracesEndpoint: string().optional(),
		metricsEndpoint: string().optional(),
		logsEndpoint: string().optional(),
		protocol: literal("http/protobuf").optional(),
		headers: record(string(), string()).optional(),
		serviceName: string().optional(),
		/** Replacement prefix for OpenClaw-owned metric names. Empty removes the prefix; defaults to "openclaw.". */
		metricNamePrefix: MetricNamePrefixSchema.optional(),
		traces: boolean().optional(),
		metrics: boolean().optional(),
		logs: boolean().optional(),
		/** Log export sink: OTLP by default, stdout JSONL, or both. */
		logsExporter: union([
			literal("otlp"),
			literal("stdout"),
			literal("both")
		]).optional(),
		/** Trace sample rate (0.0 - 1.0). */
		sampleRate: number().min(0).max(1).optional(),
		/** Metric export interval (ms). */
		flushIntervalMs: number().int().nonnegative().optional(),
		/** Opt in to raw non-system message/tool content in OTEL span attributes. */
		captureContent: boolean().optional()
	}).optional(),
	cacheTrace: strictObject({ 
	/** Write prompt-cache trace artifacts for debugging deterministic cache input. */
enabled: boolean().optional() }).optional()
}).optional();
const LoggingConfigSchema = strictObject({
	level: LoggingLevelSchema.optional(),
	file: string().optional(),
	/** Maximum size of a single log file in bytes before rotation. Default: 100 MB. */
	maxFileBytes: number().int().positive().optional(),
	consoleLevel: LoggingLevelSchema.optional(),
	consoleStyle: union([literal("pretty"), literal("json")]).optional(),
	/** Regex patterns used to redact sensitive tokens from logs and transcripts. */
	redactPatterns: array(string()).optional(),
	/** Metadata-only agent activity audit ledger settings. */
	audit: strictObject({
		/**
		* Record metadata-only run, tool, and enabled message lifecycle events into
		* the shared state database. Content is never stored. Default: true. This is
		* applied live; disabling stops new collection while accepted writes drain and retained
		* records stay readable until they expire.
		*/
		enabled: boolean().optional(),
		/**
		* Retain bounded execution-identity attribution for exact-run inspection.
		* Default: false. Requires the audit ledger and applies to newly admitted runs.
		*/
		executionIdentity: boolean().optional(),
		/**
		* Record content-free message lifecycle metadata. `direct` records only
		* known direct conversations; `all` also records group, channel, and
		* unknown conversation kinds. Default: `off`.
		*/
		messages: union([
			literal("off"),
			literal("direct"),
			literal("all")
		]).optional()
	}).optional()
}).optional();
//#endregion
export { LoggingConfigSchema as n, DiagnosticsConfigSchema as t };
