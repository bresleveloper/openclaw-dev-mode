import { $ as init_openclaw_state_schema_compatibility, $r as init_boundary_path, Ai as init_global_singleton, An as number, Ar as init_promise_like, At as init_sqlite_worker_contract, Bn as init_openclaw_state_db_contract, Br as init_session_store_owner, C as init_openclaw_agent_db_registry, Ct as init_openclaw_agent_db_contract, Di as init_command_format, Dn as discriminatedUnion, E as init_session_dirs, En as _enum, Gi as __toESM, Gn as init_deferred, Gr as init_openclaw_agent_db_paths, Hi as __commonJSMin, Hr as init_tmp_openclaw_dir, I as init_openclaw_state_worker_context, It as init_openclaw_state_db_schema_migration_required, J as init_openclaw_state_schema_publication, Jn as init_sqlite_lifecycle_errors, K as init_openclaw_state_db_maintenance, Kn as init_sqlite_transaction, L as init_openclaw_agent_db_discovery_paths, Ln as init_openclaw_state_db_paths, Lr as init_kysely_sync_cache_state, M as init_directory_durability, Mi as init_record_coerce, Mn as string, Nn as unknown, O as init_backoff, Oi as init_home_dir, Ot as init_sqlite_schema_contract, P as init_openclaw_state_db_readonly, Pi as init_string_coerce, Pn as init_crypto_digest, Pr as init_kysely_sync, Pt as init_openclaw_state_worker_error, Qn as init_subsystem, Qt as init_sqlite_user_version, Ri as init_error_coercion, Rr as init_listeners, Rt as init_workspace_state_identity, Si as init_path_guards, Tn as init_zod, U as init_openclaw_state_db_schema_repair, Ui as __esmMin, V as init_openclaw_state_db_fast_path, Vn as init_openclaw_state_db_async_lifecycle, Vr as init_artifacts, Vt as init_sqlite_readonly_worker, Xn as init_sqlite_error_diagnostics, Xr as init_agent_scope_config, Xt as init_sqlite_wal, Yr as init_errno, Zn as createSubsystemLogger, _ as init_openclaw_agent_db, _n as init_errors, _t as init_openclaw_state_worker_store, an as init_fs_safe, bt as init_config_env_vars, c as generateSecureFraction, ci as init_string_normalization, ct as init_openclaw_state_db_cache, di as init_utf16_slice, dn as init_sqlite_file_generation, dr as init_redact_sensitive_url, ei as init_session_key, er as init_console, f as init_agent_deletion_journal_read, gi as init_src$1, h as init_targets, hi as createRetryRunner, hr as init_ansi, ii as init_paths$1, ir as init_redact, ji as resolveGlobalSingleton, jn as object, jt as init_sqlite_snapshot_source, k as init_openclaw_state_db, kn as literal, l as init_secure_random, lr as init_secret_redaction_registry, mn as init_node_sqlite, n as init_store_readonly, nt as init_openclaw_state_ownership, or as redactToolPayloadText, ot as init_openclaw_state_schema, pi as init_abort_signal, pn as init_file_descriptor, pr as init_signal_exit_barrier, pt as init_openclaw_state_db_schema_version, qt as init_sqlite_schema_header, rn as init_sqlite_readonly_location_cleanup, rr as init_logger$1, rt as init_sqlite_files, tn as init_sqlite_schema_issues, u as init_agent_database_admission, ui as init_utils, un as init_sqlite_integrity, vi as toRetryError, vn as init_runtime_worker_url, vr as init_runtime$1, vt as init_sqlite_worker_store, w as init_openclaw_agent_db_registry_read, wn as init_private_mode, wt as init_sqlite_strict, xn as init_runtime_process_entrypoints, xr as init_src, xt as init_openclaw_quarantine_store, y as init_openclaw_database_verify, yi as init_number_coercion, yr as init_global_state, z as init_session_sqlite_target_paths, zt as init_runtime_process_url } from "./state/openclaw-state-read.worker.js";
import { createRequire } from "node:module";
import "node:path";
import { AsyncLocalStorage } from "node:async_hooks";
import "node:os";
import "node:fs";
import { createAsyncLock } from "@openclaw/fs-safe/advanced";
import "node:crypto";
import "node:zlib";
import chalk, { Chalk } from "chalk";
import "node:fs/promises";
import "node:child_process";
import "node:buffer";
import "node:url";
import "node:v8";
import "node:net";
import "node:net";
import "node:events";
import "node:process";
import "node:string_decoder";
import "@openclaw/ai/diagnostics";
import "node:dns";
import "node:dns/promises";
import "@openclaw/proxyline/dispatcher-brand";
import "@openclaw/proxyline";
import "@openclaw/fs-safe/store";
//#region src/infra/error-graph-internal.ts
var init_error_graph_internal = __esmMin((() => {
	init_error_coercion();
}));
__esmMin((() => {
	init_error_coercion();
	init_record_coerce();
	init_runtime_process_entrypoints();
	init_runtime_worker_url();
	init_subsystem();
	init_openclaw_agent_db();
	init_openclaw_quarantine_store();
	init_openclaw_state_db();
	createSubsystemLogger("state/database-verify");
}));
var init_agent_database_startup = __esmMin((() => {
	init_config_env_vars();
	init_errors();
	init_file_descriptor();
	init_sqlite_file_generation();
	init_sqlite_readonly_worker();
	init_subsystem();
	init_agent_database_admission();
	init_agent_deletion_journal_read();
	init_openclaw_state_db_paths();
	createSubsystemLogger("state/agent-admission");
	new AsyncLocalStorage();
}));
//#endregion
//#region src/infra/native-error-response-schema.ts
var nativeErrorDetailsSchema, nativeErrorResponseSchema;
var init_native_error_response_schema = __esmMin((() => {
	init_zod();
	nativeErrorDetailsSchema = object({
		message: string(),
		code: string().optional(),
		errcode: number().optional()
	});
	nativeErrorResponseSchema = nativeErrorDetailsSchema.extend({
		name: string(),
		cause: nativeErrorDetailsSchema.optional()
	});
}));
var init_native_error_response = __esmMin((() => {}));
var agentSchemaInspectionErrorSchema;
var init_openclaw_agent_schema_inspection_response = __esmMin((() => {
	init_zod();
	init_native_error_response_schema();
	init_native_error_response();
	init_sqlite_error_diagnostics();
	init_openclaw_state_worker_error();
	agentSchemaInspectionErrorSchema = nativeErrorResponseSchema.extend({ stateError: unknown().optional() });
}));
var init_openclaw_agent_schema_inspection_worker = __esmMin((() => {
	init_error_coercion();
	init_zod();
	init_runtime_process_url();
	init_runtime_worker_url();
	init_sqlite_file_generation();
	init_sqlite_readonly_worker();
	init_deferred();
	init_openclaw_agent_schema_inspection_response();
	discriminatedUnion("ok", [object({
		requestId: number().int().safe(),
		ok: literal(false),
		error: agentSchemaInspectionErrorSchema
	}), object({
		requestId: number().int().safe(),
		ok: literal(true),
		inspection: object({
			version: number().int().safe(),
			integrityGateOutcome: _enum(["cached", "healthy"]).optional(),
			writerAppVersion: string().optional(),
			reason: string().optional(),
			failure: agentSchemaInspectionErrorSchema.optional(),
			agentSchemaMeta: object({
				agentId: string().nullable(),
				role: string().nullable(),
				schemaVersion: number().nullable()
			}).nullable().optional()
		}).nullable()
	})]);
})), init_usingCtx = __esmMin((() => {}));
var init_openclaw_database_preflight_agent_scheduler = __esmMin((() => {
	init_sqlite_readonly_worker();
	init_deferred();
	init_openclaw_agent_schema_inspection_worker();
	init_usingCtx();
}));
var init_openclaw_database_preflight_cleanup = __esmMin((() => {
	init_kysely_sync();
	init_sqlite_lifecycle_errors();
	init_sqlite_readonly_location_cleanup();
}));
var init_agent_deletion_discovery = __esmMin((() => {
	init_paths$1();
	init_session_sqlite_target_paths();
	init_errno();
	init_home_dir();
	init_path_guards();
	init_sqlite_files();
	init_session_key();
	init_agent_deletion_journal_read();
	init_openclaw_agent_db_paths();
	init_openclaw_state_db_readonly();
	init_openclaw_state_db_paths();
}));
var init_backup_audit_paths = __esmMin((() => {
	init_errno();
	[
		{
			directory: "logs",
			basename: "config-audit.jsonl"
		},
		{
			directory: "audit",
			basename: "system-agent.jsonl"
		},
		{
			directory: "audit",
			basename: "crestodian.jsonl"
		}
	].map(({ directory, basename }) => {
		const escaped = basename.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&");
		return {
			directory,
			pattern: new RegExp(`^(?:${escaped}|\\.${escaped}\\.doctor-importing(?:\\.(?:[2-9]|[1-9][0-9]+))?|${escaped}\\.migrated(?:\\.(?:[2-9]|[1-9][0-9]+))?\\.raw(?:\\.doctor-scrub-(?:progress|restore|staging))?)$`, "u")
		};
	});
}));
var init_backup_volatile_filter = __esmMin((() => {
	init_backup_audit_paths();
}));
var init_state_migrations_media_persistence_targets = __esmMin((() => {
	init_ansi();
	init_session_dirs();
	init_command_format();
	init_paths$1();
	init_artifacts();
	init_session_key();
	init_agent_deletion_discovery();
	init_agent_deletion_journal_read();
	init_openclaw_agent_db_discovery_paths();
	init_openclaw_agent_db_registry();
	init_openclaw_agent_db_paths();
	init_backup_volatile_filter();
	init_errno();
	init_path_guards();
	init_sqlite_files();
}));
var init_openclaw_database_preflight_targets = __esmMin((() => {
	init_paths$1();
	init_session_sqlite_target_paths();
	init_state_migrations_media_persistence_targets();
	init_session_key();
	init_agent_deletion_discovery();
	init_openclaw_agent_db_paths();
}));
var init_openclaw_database_preflight_messages = __esmMin((() => {
	init_sqlite_user_version();
	init_openclaw_state_db_contract();
}));
var init_openclaw_state_schema_inspection = __esmMin((() => {
	init_sqlite_schema_contract();
	init_sqlite_schema_issues();
	init_openclaw_state_db_maintenance();
	init_openclaw_state_schema_compatibility();
	init_openclaw_state_schema();
}));
__esmMin((() => {
	init_agent_scope_config();
	init_paths$1();
	init_targets();
	init_errors();
	init_node_sqlite();
	init_path_guards();
	init_sqlite_integrity();
	init_sqlite_schema_header();
	init_sqlite_schema_issues();
	init_sqlite_snapshot_source();
	init_sqlite_user_version();
	init_agent_database_admission();
	init_agent_database_startup();
	init_agent_deletion_journal_read();
	init_openclaw_agent_db_contract();
	init_openclaw_agent_db_registry_read();
	init_openclaw_database_preflight_agent_scheduler();
	init_openclaw_database_preflight_cleanup();
	init_openclaw_database_preflight_targets();
	init_openclaw_database_preflight_messages();
	init_openclaw_database_verify();
	init_openclaw_state_db_contract();
	init_openclaw_state_db_fast_path();
	init_openclaw_state_db_maintenance();
	init_openclaw_state_db_schema_migration_required();
	init_openclaw_state_db_schema_repair();
	init_openclaw_state_db_schema_version();
	init_openclaw_state_db_paths();
	init_openclaw_state_ownership();
	init_openclaw_state_schema_inspection();
	init_openclaw_state_schema_publication();
	init_openclaw_state_db();
}));
//#endregion
//#region packages/terminal-core/src/palette.ts
var LOBSTER_PALETTE;
var init_palette = __esmMin((() => {
	LOBSTER_PALETTE = {
		accent: "#FF5A2D",
		accentBright: "#FF7A3D",
		accentDim: "#D14A22",
		info: "#FF8A5B",
		success: "#2FBF71",
		warn: "#FFB020",
		error: "#E23D2D",
		muted: "#8B7F77"
	};
}));
//#endregion
//#region packages/terminal-core/src/theme.ts
var hasForceColor, baseChalk, hex, theme;
var init_theme = __esmMin((() => {
	init_palette();
	hasForceColor = typeof process.env.FORCE_COLOR === "string" && process.env.FORCE_COLOR.trim().length > 0 && process.env.FORCE_COLOR.trim() !== "0";
	baseChalk = process.env.NO_COLOR && !hasForceColor ? new Chalk({ level: 0 }) : chalk;
	hex = (value) => baseChalk.hex(value);
	theme = {
		accent: hex(LOBSTER_PALETTE.accent),
		accentBright: hex(LOBSTER_PALETTE.accentBright),
		accentDim: hex(LOBSTER_PALETTE.accentDim),
		info: hex(LOBSTER_PALETTE.info),
		success: hex(LOBSTER_PALETTE.success),
		warn: hex(LOBSTER_PALETTE.warn),
		error: hex(LOBSTER_PALETTE.error),
		muted: hex(LOBSTER_PALETTE.muted),
		heading: baseChalk.bold.hex(LOBSTER_PALETTE.accent),
		command: hex(LOBSTER_PALETTE.accentBright),
		option: hex(LOBSTER_PALETTE.warn)
	};
}));
var init_globals = __esmMin((() => {
	init_theme();
	init_logger$1();
	theme.success;
	theme.warn;
	theme.info;
	theme.error;
}));
var init_logger = __esmMin((() => {
	init_theme();
	init_global_state();
	init_console();
	init_logger$1();
	init_subsystem();
	init_runtime$1();
}));
var init_constants = __esmMin((() => {}));
var init_content_length = __esmMin((() => {}));
var init_file_name = __esmMin((() => {}));
//#endregion
//#region packages/media-core/src/mime.ts
function buildMimeByExt() {
	const byExt = {};
	for (const [mime, ext] of Object.entries(EXT_BY_MIME)) byExt[ext] ??= mime;
	return byExt;
}
var EXT_BY_MIME;
var init_mime = __esmMin((() => {
	init_file_name();
	EXT_BY_MIME = {
		"image/avif": ".avif",
		"image/heic": ".heic",
		"image/heic-sequence": ".heic",
		"image/heif": ".heif",
		"image/heif-sequence": ".heif",
		"image/bmp": ".bmp",
		"image/jpg": ".jpg",
		"image/jpeg": ".jpg",
		"image/png": ".png",
		"image/svg+xml": ".svg",
		"image/webp": ".webp",
		"image/gif": ".gif",
		"audio/aiff": ".aiff",
		"audio/x-aiff": ".aiff",
		"audio/ogg": ".ogg",
		"audio/mpeg": ".mp3",
		"audio/mp3": ".mp3",
		"audio/wav": ".wav",
		"audio/wave": ".wav",
		"audio/x-wav": ".wav",
		"audio/flac": ".flac",
		"audio/aac": ".aac",
		"audio/amr": ".amr",
		"audio/opus": ".opus",
		"audio/webm": ".webm",
		"audio/x-m4a": ".m4a",
		"audio/m4a": ".m4a",
		"audio/mp4": ".m4a",
		"audio/x-caf": ".caf",
		"video/x-msvideo": ".avi",
		"video/x-m4v": ".m4v",
		"video/mp4": ".mp4",
		"video/x-matroska": ".mkv",
		"video/webm": ".webm",
		"video/x-flv": ".flv",
		"video/x-ms-wmv": ".wmv",
		"video/quicktime": ".mov",
		"application/pdf": ".pdf",
		"application/json": ".json",
		"application/yaml": ".yaml",
		"application/zip": ".zip",
		"application/gzip": ".gz",
		"application/x-tar": ".tar",
		"application/x-7z-compressed": ".7z",
		"application/vnd.rar": ".rar",
		"application/msword": ".doc",
		"application/vnd.ms-excel": ".xls",
		"application/vnd.ms-powerpoint": ".ppt",
		"application/vnd.openxmlformats-officedocument.wordprocessingml.document": ".docx",
		"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": ".xlsx",
		"application/vnd.openxmlformats-officedocument.presentationml.presentation": ".pptx",
		"text/csv": ".csv",
		"text/plain": ".txt",
		"text/markdown": ".md",
		"text/html": ".html",
		"text/xml": ".xml",
		"text/css": ".css",
		"application/xml": ".xml"
	};
	({ ...buildMimeByExt() });
}));
var init_http_response_body_timeout = __esmMin((() => {
	init_error_coercion();
	init_number_coercion();
}));
var init_http_response_body = __esmMin((() => {
	init_src();
	init_utf16_slice();
	init_http_response_body_timeout();
}));
//#endregion
//#region src/infra/http-body.ts
var init_http_body = __esmMin((() => {
	init_number_coercion();
	init_errors();
	init_http_response_body_timeout();
	init_http_response_body();
}));
var init_timeouts = __esmMin((() => {}));
//#endregion
//#region src/utils/timer-delay.ts
var init_timer_delay = __esmMin((() => {
	init_timeouts();
}));
var init_fetch_timeout = __esmMin((() => {
	init_redact_sensitive_url();
	init_utf16_slice();
	init_subsystem();
	init_timer_delay();
	createSubsystemLogger("fetch-timeout");
}));
var init_fetch_headers = __esmMin((() => {}));
//#endregion
//#region node_modules/.pnpm/ipaddr.js@2.5.0/node_modules/ipaddr.js/lib/ipaddr.js
var require_ipaddr = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	(function(root) {
		"use strict";
		const ipv4Part = "(0?\\d+|0x[a-f0-9]+)";
		const ipv4Regexes = {
			fourOctet: new RegExp(`^${ipv4Part}\\.${ipv4Part}\\.${ipv4Part}\\.${ipv4Part}$`, "i"),
			threeOctet: new RegExp(`^${ipv4Part}\\.${ipv4Part}\\.${ipv4Part}$`, "i"),
			twoOctet: new RegExp(`^${ipv4Part}\\.${ipv4Part}$`, "i"),
			longValue: new RegExp(`^${ipv4Part}$`, "i")
		};
		const octalRegex = new RegExp(`^0[0-7]+$`, "i");
		const hexRegex = new RegExp(`^0x[a-f0-9]+$`, "i");
		const zoneIndex = "%[0-9a-z]{1,}";
		const ipv6Part = "(?:[0-9a-f]+::?)+";
		const ipv6Regexes = {
			zoneIndex: new RegExp(zoneIndex, "i"),
			"native": new RegExp(`^(::)?(${ipv6Part})?([0-9a-f]+)?(::)?(${zoneIndex})?$`, "i"),
			deprecatedTransitional: new RegExp(`^(?:::)(${ipv4Part}\\.${ipv4Part}\\.${ipv4Part}\\.${ipv4Part}(${zoneIndex})?)$`, "i"),
			transitional: new RegExp(`^((?:${ipv6Part})|(?:::)(?:${ipv6Part})?)${ipv4Part}\\.${ipv4Part}\\.${ipv4Part}\\.${ipv4Part}(${zoneIndex})?$`, "i")
		};
		function expandIPv6(string, parts) {
			if (string.indexOf("::") !== string.lastIndexOf("::")) return null;
			let colonCount = 0;
			let lastColon = -1;
			let zoneId = (string.match(ipv6Regexes.zoneIndex) || [])[0];
			let replacement, replacementCount;
			if (zoneId) {
				zoneId = zoneId.substring(1);
				string = string.replace(/%.+$/, "");
			}
			while ((lastColon = string.indexOf(":", lastColon + 1)) >= 0) colonCount++;
			if (string.substr(0, 2) === "::") colonCount--;
			if (string.substr(-2, 2) === "::") colonCount--;
			if (colonCount >= parts) return null;
			replacementCount = parts - colonCount;
			replacement = ":";
			while (replacementCount--) replacement += "0:";
			string = string.replace("::", replacement);
			if (string[0] === ":") string = string.slice(1);
			if (string[string.length - 1] === ":") string = string.slice(0, -1);
			parts = (function() {
				const ref = string.split(":");
				const results = [];
				for (let i = 0; i < ref.length; i++) results.push(ref[i].length > 4 ? NaN : parseInt(ref[i], 16));
				return results;
			})();
			return {
				parts,
				zoneId
			};
		}
		function matchCIDR(first, second, partSize, cidrBits) {
			if (first.length !== second.length) throw new Error("ipaddr: cannot match CIDR for objects with different lengths");
			let part = 0;
			let shift;
			while (cidrBits > 0) {
				shift = partSize - cidrBits;
				if (shift < 0) shift = 0;
				if (first[part] >> shift !== second[part] >> shift) return false;
				cidrBits -= partSize;
				part += 1;
			}
			return true;
		}
		function parseIntAuto(string) {
			if (hexRegex.test(string)) return parseInt(string, 16);
			if (string[0] === "0" && !isNaN(parseInt(string[1], 10))) {
				if (octalRegex.test(string)) return parseInt(string, 8);
				throw new Error(`ipaddr: cannot parse ${string} as octal`);
			}
			return parseInt(string, 10);
		}
		function padPart(part, length) {
			while (part.length < length) part = `0${part}`;
			return part;
		}
		const ipaddr = {};
		ipaddr.IPv4 = (function() {
			function IPv4(octets) {
				if (octets.length !== 4) throw new Error("ipaddr: ipv4 octet count should be 4");
				let i, octet;
				for (i = 0; i < octets.length; i++) {
					octet = octets[i];
					if (!(0 <= octet && octet <= 255)) throw new Error("ipaddr: ipv4 octet should fit in 8 bits");
				}
				this.octets = octets;
			}
			IPv4.prototype.SpecialRanges = {
				unspecified: [[new IPv4([
					0,
					0,
					0,
					0
				]), 8]],
				broadcast: [[new IPv4([
					255,
					255,
					255,
					255
				]), 32]],
				multicast: [[new IPv4([
					224,
					0,
					0,
					0
				]), 4]],
				linkLocal: [[new IPv4([
					169,
					254,
					0,
					0
				]), 16]],
				loopback: [[new IPv4([
					127,
					0,
					0,
					0
				]), 8]],
				carrierGradeNat: [[new IPv4([
					100,
					64,
					0,
					0
				]), 10]],
				"private": [
					[new IPv4([
						10,
						0,
						0,
						0
					]), 8],
					[new IPv4([
						172,
						16,
						0,
						0
					]), 12],
					[new IPv4([
						192,
						168,
						0,
						0
					]), 16]
				],
				reserved: [
					[new IPv4([
						192,
						0,
						0,
						0
					]), 24],
					[new IPv4([
						192,
						0,
						2,
						0
					]), 24],
					[new IPv4([
						192,
						88,
						99,
						0
					]), 24],
					[new IPv4([
						198,
						18,
						0,
						0
					]), 15],
					[new IPv4([
						198,
						51,
						100,
						0
					]), 24],
					[new IPv4([
						203,
						0,
						113,
						0
					]), 24],
					[new IPv4([
						240,
						0,
						0,
						0
					]), 4]
				],
				as112: [[new IPv4([
					192,
					175,
					48,
					0
				]), 24], [new IPv4([
					192,
					31,
					196,
					0
				]), 24]],
				amt: [[new IPv4([
					192,
					52,
					193,
					0
				]), 24]]
			};
			IPv4.prototype.kind = function() {
				return "ipv4";
			};
			IPv4.prototype.match = function(other, cidrRange) {
				let ref;
				if (cidrRange === void 0) {
					ref = other;
					other = ref[0];
					cidrRange = ref[1];
				}
				if (other.kind() !== "ipv4") throw new Error("ipaddr: cannot match ipv4 address with non-ipv4 one");
				return matchCIDR(this.octets, other.octets, 8, cidrRange);
			};
			IPv4.prototype.prefixLengthFromSubnetMask = function() {
				let cidr = 0;
				let stop = false;
				const zerotable = {
					0: 8,
					128: 7,
					192: 6,
					224: 5,
					240: 4,
					248: 3,
					252: 2,
					254: 1,
					255: 0
				};
				let i, octet, zeros;
				for (i = 3; i >= 0; i -= 1) {
					octet = this.octets[i];
					if (octet in zerotable) {
						zeros = zerotable[octet];
						if (stop && zeros !== 0) return null;
						if (zeros !== 8) stop = true;
						cidr += zeros;
					} else return null;
				}
				return 32 - cidr;
			};
			IPv4.prototype.range = function() {
				return ipaddr.subnetMatch(this, this.SpecialRanges);
			};
			IPv4.prototype.toByteArray = function() {
				return this.octets.slice(0);
			};
			IPv4.prototype.toIPv4MappedAddress = function() {
				return ipaddr.IPv6.parse(`::ffff:${this.toString()}`);
			};
			IPv4.prototype.toNormalizedString = function() {
				return this.toString();
			};
			IPv4.prototype.toString = function() {
				return this.octets.join(".");
			};
			return IPv4;
		})();
		ipaddr.IPv4.broadcastAddressFromCIDR = function(string) {
			try {
				const cidr = this.parseCIDR(string);
				const ipInterfaceOctets = cidr[0].toByteArray();
				const subnetMaskOctets = this.subnetMaskFromPrefixLength(cidr[1]).toByteArray();
				const octets = [];
				let i = 0;
				while (i < 4) {
					octets.push(parseInt(ipInterfaceOctets[i], 10) | parseInt(subnetMaskOctets[i], 10) ^ 255);
					i++;
				}
				return new this(octets);
			} catch (e) {
				throw new Error("ipaddr: the address does not have IPv4 CIDR format", { cause: e });
			}
		};
		ipaddr.IPv4.isIPv4 = function(string) {
			return this.parser(string) !== null;
		};
		ipaddr.IPv4.isValid = function(string) {
			try {
				new this(this.parser(string));
				return true;
			} catch {
				return false;
			}
		};
		ipaddr.IPv4.isValidCIDR = function(string) {
			try {
				this.parseCIDR(string);
				return true;
			} catch {
				return false;
			}
		};
		ipaddr.IPv4.isValidFourPartDecimal = function(string) {
			if (ipaddr.IPv4.isValid(string) && string.match(/^(0|[1-9]\d*)(\.(0|[1-9]\d*)){3}$/)) return true;
			else return false;
		};
		ipaddr.IPv4.isValidCIDRFourPartDecimal = function(string) {
			const match = string.match(/^(.+)\/(\d+)$/);
			if (!ipaddr.IPv4.isValidCIDR(string) || !match) return false;
			return ipaddr.IPv4.isValidFourPartDecimal(match[1]);
		};
		ipaddr.IPv4.networkAddressFromCIDR = function(string) {
			let cidr, i, ipInterfaceOctets, octets, subnetMaskOctets;
			try {
				cidr = this.parseCIDR(string);
				ipInterfaceOctets = cidr[0].toByteArray();
				subnetMaskOctets = this.subnetMaskFromPrefixLength(cidr[1]).toByteArray();
				octets = [];
				i = 0;
				while (i < 4) {
					octets.push(parseInt(ipInterfaceOctets[i], 10) & parseInt(subnetMaskOctets[i], 10));
					i++;
				}
				return new this(octets);
			} catch (e) {
				throw new Error("ipaddr: the address does not have IPv4 CIDR format", { cause: e });
			}
		};
		ipaddr.IPv4.parse = function(string) {
			const parts = this.parser(string);
			if (parts === null) throw new Error("ipaddr: string is not formatted like an IPv4 Address");
			return new this(parts);
		};
		ipaddr.IPv4.parseCIDR = function(string) {
			let match;
			if (match = string.match(/^(.+)\/(\d+)$/)) {
				const maskLength = parseInt(match[2]);
				if (maskLength >= 0 && maskLength <= 32) {
					const parsed = [this.parse(match[1]), maskLength];
					Object.defineProperty(parsed, "toString", { value: function() {
						return this.join("/");
					} });
					return parsed;
				}
			}
			throw new Error("ipaddr: string is not formatted like an IPv4 CIDR range");
		};
		ipaddr.IPv4.parser = function(string) {
			let match, part, value;
			if (match = string.match(ipv4Regexes.fourOctet)) return (function() {
				const ref = match.slice(1, 6);
				const results = [];
				for (let i = 0; i < ref.length; i++) {
					part = ref[i];
					results.push(parseIntAuto(part));
				}
				return results;
			})();
			else if (match = string.match(ipv4Regexes.longValue)) {
				value = parseIntAuto(match[1]);
				if (value > 4294967295 || value < 0) throw new Error("ipaddr: address outside defined range");
				return (function() {
					const results = [];
					let shift = 0;
					for (; shift <= 24; shift += 8) results.push(value >> shift & 255);
					return results;
				})().reverse();
			} else if (match = string.match(ipv4Regexes.twoOctet)) return (function() {
				const ref = match.slice(1, 4);
				const results = [];
				value = parseIntAuto(ref[1]);
				if (value > 16777215 || value < 0) throw new Error("ipaddr: address outside defined range");
				results.push(parseIntAuto(ref[0]));
				results.push(value >> 16 & 255);
				results.push(value >> 8 & 255);
				results.push(value & 255);
				return results;
			})();
			else if (match = string.match(ipv4Regexes.threeOctet)) return (function() {
				const ref = match.slice(1, 5);
				const results = [];
				value = parseIntAuto(ref[2]);
				if (value > 65535 || value < 0) throw new Error("ipaddr: address outside defined range");
				results.push(parseIntAuto(ref[0]));
				results.push(parseIntAuto(ref[1]));
				results.push(value >> 8 & 255);
				results.push(value & 255);
				return results;
			})();
			else return null;
		};
		ipaddr.IPv4.subnetMaskFromPrefixLength = function(prefix) {
			prefix = parseInt(prefix);
			if (Number.isNaN(prefix) || prefix < 0 || prefix > 32) throw new Error("ipaddr: invalid IPv4 prefix length");
			const octets = [
				0,
				0,
				0,
				0
			];
			let j = 0;
			const filledOctetCount = Math.floor(prefix / 8);
			while (j < filledOctetCount) {
				octets[j] = 255;
				j++;
			}
			if (filledOctetCount < 4) octets[filledOctetCount] = Math.pow(2, prefix % 8) - 1 << 8 - prefix % 8;
			return new this(octets);
		};
		ipaddr.IPv6 = (function() {
			function IPv6(parts, zoneId) {
				let i, part;
				if (parts.length === 16) {
					this.parts = [];
					for (i = 0; i <= 14; i += 2) this.parts.push(parts[i] << 8 | parts[i + 1]);
				} else if (parts.length === 8) this.parts = parts;
				else throw new Error("ipaddr: ipv6 part count should be 8 or 16");
				for (i = 0; i < this.parts.length; i++) {
					part = this.parts[i];
					if (!(0 <= part && part <= 65535)) throw new Error("ipaddr: ipv6 part should fit in 16 bits");
				}
				if (zoneId) this.zoneId = zoneId;
			}
			IPv6.prototype.SpecialRanges = {
				unspecified: [new IPv6([
					0,
					0,
					0,
					0,
					0,
					0,
					0,
					0
				]), 128],
				linkLocal: [new IPv6([
					65152,
					0,
					0,
					0,
					0,
					0,
					0,
					0
				]), 10],
				multicast: [new IPv6([
					65280,
					0,
					0,
					0,
					0,
					0,
					0,
					0
				]), 8],
				loopback: [new IPv6([
					0,
					0,
					0,
					0,
					0,
					0,
					0,
					1
				]), 128],
				uniqueLocal: [new IPv6([
					64512,
					0,
					0,
					0,
					0,
					0,
					0,
					0
				]), 7],
				ipv4Mapped: [new IPv6([
					0,
					0,
					0,
					0,
					0,
					65535,
					0,
					0
				]), 96],
				deprecatedSiteLocal: [new IPv6([
					65216,
					0,
					0,
					0,
					0,
					0,
					0,
					0
				]), 10],
				discard: [new IPv6([
					256,
					0,
					0,
					0,
					0,
					0,
					0,
					0
				]), 64],
				rfc6145: [new IPv6([
					0,
					0,
					0,
					0,
					65535,
					0,
					0,
					0
				]), 96],
				rfc6052: [[new IPv6([
					100,
					65435,
					0,
					0,
					0,
					0,
					0,
					0
				]), 96], [new IPv6([
					100,
					65435,
					1,
					0,
					0,
					0,
					0,
					0
				]), 48]],
				"6to4": [new IPv6([
					8194,
					0,
					0,
					0,
					0,
					0,
					0,
					0
				]), 16],
				teredo: [new IPv6([
					8193,
					0,
					0,
					0,
					0,
					0,
					0,
					0
				]), 32],
				benchmarking: [new IPv6([
					8193,
					2,
					0,
					0,
					0,
					0,
					0,
					0
				]), 48],
				amt: [new IPv6([
					8193,
					3,
					0,
					0,
					0,
					0,
					0,
					0
				]), 32],
				as112v6: [[new IPv6([
					8193,
					4,
					274,
					0,
					0,
					0,
					0,
					0
				]), 48], [new IPv6([
					9760,
					79,
					32768,
					0,
					0,
					0,
					0,
					0
				]), 48]],
				deprecatedOrchid: [new IPv6([
					8193,
					16,
					0,
					0,
					0,
					0,
					0,
					0
				]), 28],
				orchid2: [new IPv6([
					8193,
					32,
					0,
					0,
					0,
					0,
					0,
					0
				]), 28],
				droneRemoteIdProtocolEntityTags: [new IPv6([
					8193,
					48,
					0,
					0,
					0,
					0,
					0,
					0
				]), 28],
				segmentRouting: [new IPv6([
					24320,
					0,
					0,
					0,
					0,
					0,
					0,
					0
				]), 16],
				reserved: [
					[new IPv6([
						8193,
						0,
						0,
						0,
						0,
						0,
						0,
						0
					]), 23],
					[new IPv6([
						8193,
						3512,
						0,
						0,
						0,
						0,
						0,
						0
					]), 32],
					[new IPv6([
						16383,
						0,
						0,
						0,
						0,
						0,
						0,
						0
					]), 20]
				]
			};
			IPv6.prototype.isIPv4MappedAddress = function() {
				return this.range() === "ipv4Mapped";
			};
			IPv6.prototype.kind = function() {
				return "ipv6";
			};
			IPv6.prototype.match = function(other, cidrRange) {
				let ref;
				if (cidrRange === void 0) {
					ref = other;
					other = ref[0];
					cidrRange = ref[1];
				}
				if (other.kind() !== "ipv6") throw new Error("ipaddr: cannot match ipv6 address with non-ipv6 one");
				return matchCIDR(this.parts, other.parts, 16, cidrRange);
			};
			IPv6.prototype.prefixLengthFromSubnetMask = function() {
				let cidr = 0;
				let stop = false;
				const zerotable = {
					0: 16,
					32768: 15,
					49152: 14,
					57344: 13,
					61440: 12,
					63488: 11,
					64512: 10,
					65024: 9,
					65280: 8,
					65408: 7,
					65472: 6,
					65504: 5,
					65520: 4,
					65528: 3,
					65532: 2,
					65534: 1,
					65535: 0
				};
				let part, zeros;
				for (let i = 7; i >= 0; i -= 1) {
					part = this.parts[i];
					if (part in zerotable) {
						zeros = zerotable[part];
						if (stop && zeros !== 0) return null;
						if (zeros !== 16) stop = true;
						cidr += zeros;
					} else return null;
				}
				return 128 - cidr;
			};
			IPv6.prototype.range = function() {
				return ipaddr.subnetMatch(this, this.SpecialRanges);
			};
			IPv6.prototype.toByteArray = function() {
				let part;
				const bytes = [];
				const ref = this.parts;
				for (let i = 0; i < ref.length; i++) {
					part = ref[i];
					bytes.push(part >> 8);
					bytes.push(part & 255);
				}
				return bytes;
			};
			IPv6.prototype.toFixedLengthString = function() {
				const addr = (function() {
					const results = [];
					for (let i = 0; i < this.parts.length; i++) results.push(padPart(this.parts[i].toString(16), 4));
					return results;
				}).call(this).join(":");
				let suffix = "";
				if (this.zoneId) suffix = `%${this.zoneId}`;
				return addr + suffix;
			};
			IPv6.prototype.toIPv4Address = function() {
				if (!this.isIPv4MappedAddress()) throw new Error("ipaddr: trying to convert a generic ipv6 address to ipv4");
				const ref = this.parts.slice(-2);
				const high = ref[0];
				const low = ref[1];
				return new ipaddr.IPv4([
					high >> 8,
					high & 255,
					low >> 8,
					low & 255
				]);
			};
			IPv6.prototype.toNormalizedString = function() {
				const addr = (function() {
					const results = [];
					for (let i = 0; i < this.parts.length; i++) results.push(this.parts[i].toString(16));
					return results;
				}).call(this).join(":");
				let suffix = "";
				if (this.zoneId) suffix = `%${this.zoneId}`;
				return addr + suffix;
			};
			IPv6.prototype.toRFC5952String = function() {
				const regex = /((^|:)(0(:|$)){2,})/g;
				let suffix = "";
				if (this.zoneId) suffix = `%${this.zoneId}`;
				const normalized = this.toNormalizedString();
				const string = normalized.slice(0, normalized.length - suffix.length);
				let bestMatchIndex = 0;
				let bestMatchLength = -1;
				let bestMatchGroups = -1;
				let match;
				while (match = regex.exec(string)) {
					const groups = (match[0].match(/0/g) || []).length;
					if (groups > bestMatchGroups) {
						bestMatchGroups = groups;
						bestMatchIndex = match.index;
						bestMatchLength = match[0].length;
					}
				}
				if (bestMatchLength < 0) return string + suffix;
				return `${string.substring(0, bestMatchIndex)}::${string.substring(bestMatchIndex + bestMatchLength)}${suffix}`;
			};
			IPv6.prototype.toString = function() {
				return this.toRFC5952String();
			};
			return IPv6;
		})();
		ipaddr.IPv6.broadcastAddressFromCIDR = function(string) {
			try {
				const cidr = this.parseCIDR(string);
				const ipInterfaceOctets = cidr[0].toByteArray();
				const subnetMaskOctets = this.subnetMaskFromPrefixLength(cidr[1]).toByteArray();
				const octets = [];
				let i = 0;
				while (i < 16) {
					octets.push(parseInt(ipInterfaceOctets[i], 10) | parseInt(subnetMaskOctets[i], 10) ^ 255);
					i++;
				}
				return new this(octets);
			} catch (e) {
				throw new Error("ipaddr: the address does not have IPv6 CIDR format", { cause: e });
			}
		};
		ipaddr.IPv6.isIPv6 = function(string) {
			return this.parser(string) !== null;
		};
		ipaddr.IPv6.isValid = function(string) {
			if (typeof string === "string" && string.indexOf(":") === -1) return false;
			try {
				const addr = this.parser(string);
				new this(addr.parts, addr.zoneId);
				return true;
			} catch {
				return false;
			}
		};
		ipaddr.IPv6.isValidCIDR = function(string) {
			if (typeof string === "string" && string.indexOf(":") === -1) return false;
			try {
				this.parseCIDR(string);
				return true;
			} catch {
				return false;
			}
		};
		ipaddr.IPv6.networkAddressFromCIDR = function(string) {
			let cidr, i, ipInterfaceOctets, octets, subnetMaskOctets;
			try {
				cidr = this.parseCIDR(string);
				ipInterfaceOctets = cidr[0].toByteArray();
				subnetMaskOctets = this.subnetMaskFromPrefixLength(cidr[1]).toByteArray();
				octets = [];
				i = 0;
				while (i < 16) {
					octets.push(parseInt(ipInterfaceOctets[i], 10) & parseInt(subnetMaskOctets[i], 10));
					i++;
				}
				return new this(octets);
			} catch (e) {
				throw new Error("ipaddr: the address does not have IPv6 CIDR format", { cause: e });
			}
		};
		ipaddr.IPv6.parse = function(string) {
			const addr = this.parser(string);
			if (addr === null) throw new Error("ipaddr: string is not formatted like an IPv6 Address");
			return new this(addr.parts, addr.zoneId);
		};
		ipaddr.IPv6.parseCIDR = function(string) {
			let maskLength, match, parsed;
			if (match = string.match(/^(.+)\/(\d+)$/)) {
				maskLength = parseInt(match[2]);
				if (maskLength >= 0 && maskLength <= 128) {
					parsed = [this.parse(match[1]), maskLength];
					Object.defineProperty(parsed, "toString", { value: function() {
						return this.join("/");
					} });
					return parsed;
				}
			}
			throw new Error("ipaddr: string is not formatted like an IPv6 CIDR range");
		};
		ipaddr.IPv6.parser = function(string) {
			let addr, i, match, octet, octets, zoneId;
			if (match = string.match(ipv6Regexes.deprecatedTransitional)) return this.parser(`::ffff:${match[1]}`);
			if (ipv6Regexes.native.test(string)) return expandIPv6(string, 8);
			if (match = string.match(ipv6Regexes.transitional)) {
				zoneId = match[6] || "";
				addr = match[1];
				if (!match[1].endsWith("::")) addr = addr.slice(0, -1);
				addr = expandIPv6(addr + zoneId, 6);
				if (addr && addr.parts) {
					octets = [
						parseInt(match[2]),
						parseInt(match[3]),
						parseInt(match[4]),
						parseInt(match[5])
					];
					for (i = 0; i < octets.length; i++) {
						octet = octets[i];
						if (!(0 <= octet && octet <= 255)) return null;
					}
					addr.parts.push(octets[0] << 8 | octets[1]);
					addr.parts.push(octets[2] << 8 | octets[3]);
					return {
						parts: addr.parts,
						zoneId: addr.zoneId
					};
				}
			}
			return null;
		};
		ipaddr.IPv6.subnetMaskFromPrefixLength = function(prefix) {
			prefix = parseInt(prefix);
			if (Number.isNaN(prefix) || prefix < 0 || prefix > 128) throw new Error("ipaddr: invalid IPv6 prefix length");
			const octets = [
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0
			];
			let j = 0;
			const filledOctetCount = Math.floor(prefix / 8);
			while (j < filledOctetCount) {
				octets[j] = 255;
				j++;
			}
			if (filledOctetCount < 16) octets[filledOctetCount] = Math.pow(2, prefix % 8) - 1 << 8 - prefix % 8;
			return new this(octets);
		};
		ipaddr.fromByteArray = function(bytes) {
			const length = bytes.length;
			if (length === 4) return new ipaddr.IPv4(bytes);
			else if (length === 16) return new ipaddr.IPv6(bytes);
			else throw new Error("ipaddr: the binary input is neither an IPv6 nor IPv4 address");
		};
		ipaddr.isValid = function(string) {
			return ipaddr.IPv6.isValid(string) || ipaddr.IPv4.isValid(string);
		};
		ipaddr.isValidCIDR = function(string) {
			return ipaddr.IPv6.isValidCIDR(string) || ipaddr.IPv4.isValidCIDR(string);
		};
		ipaddr.parse = function(string) {
			if (ipaddr.IPv6.isValid(string)) return ipaddr.IPv6.parse(string);
			else if (ipaddr.IPv4.isValid(string)) return ipaddr.IPv4.parse(string);
			else throw new Error("ipaddr: the address has neither IPv6 nor IPv4 format");
		};
		ipaddr.parseCIDR = function(string) {
			try {
				return ipaddr.IPv6.parseCIDR(string);
			} catch {
				try {
					return ipaddr.IPv4.parseCIDR(string);
				} catch (e) {
					throw new Error("ipaddr: the address has neither IPv6 nor IPv4 CIDR format", { cause: e });
				}
			}
		};
		ipaddr.process = function(string) {
			const addr = this.parse(string);
			if (addr.kind() === "ipv6" && addr.isIPv4MappedAddress()) return addr.toIPv4Address();
			else return addr;
		};
		ipaddr.subnetMatch = function(address, rangeList, defaultName) {
			let i, rangeName, rangeSubnets, subnet;
			if (defaultName === void 0 || defaultName === null) defaultName = "unicast";
			for (rangeName in rangeList) if (Object.prototype.hasOwnProperty.call(rangeList, rangeName)) {
				rangeSubnets = rangeList[rangeName];
				if (rangeSubnets[0] && !(rangeSubnets[0] instanceof Array)) rangeSubnets = [rangeSubnets];
				for (i = 0; i < rangeSubnets.length; i++) {
					subnet = rangeSubnets[i];
					if (address.kind() === subnet[0].kind() && address.match.apply(address, subnet)) return rangeName;
				}
			}
			return defaultName;
		};
		if (typeof module !== "undefined" && module.exports) module.exports = ipaddr;
		else root.ipaddr = ipaddr;
	})(exports);
})), import_ipaddr;
var init_ip = __esmMin((() => {
	init_string_coerce();
	import_ipaddr = /* @__PURE__ */ __toESM(require_ipaddr(), 1);
	import_ipaddr.default.IPv4.parse("198.18.0.0");
}));
var init_hostname = __esmMin((() => {
	init_string_coerce();
}));
var init_active_proxy_state = __esmMin((() => {}));
var init_proxy_env = __esmMin((() => {
	init_src();
}));
var init_proxy_tls = __esmMin((() => {
	init_string_coerce();
	init_errors();
}));
var init_active_managed_proxy_tls = __esmMin((() => {
	init_proxy_env();
	init_active_proxy_state();
	init_proxy_tls();
}));
var init_managed_proxy_undici = __esmMin((() => {
	init_record_coerce();
	init_active_managed_proxy_tls();
}));
var init_undici_error_diagnostics = __esmMin((() => {
	init_logger();
	init_errors();
})), init_wsl = __esmMin((() => {
	init_string_coerce();
})), init_undici_family_policy = __esmMin((() => {
	init_wsl();
}));
var init_undici_dispatcher_options = __esmMin((() => {
	init_record_coerce();
	init_managed_proxy_undici();
	init_undici_error_diagnostics();
	init_undici_family_policy();
	createRequire(import.meta.url);
	Object.freeze({ allowH2: false });
}));
var init_undici_runtime = __esmMin((() => {
	init_error_coercion();
	init_proxy_env();
	init_undici_dispatcher_options();
	init_undici_error_diagnostics();
}));
var init_ssrf = __esmMin((() => {
	init_ip();
	init_src();
	init_string_normalization();
	init_deferred();
	init_hostname();
	init_undici_runtime();
}));
var init_configured_local_origin_bypass = __esmMin((() => {
	init_ip();
	init_hostname();
	init_active_proxy_state();
	init_ssrf();
}));
var init_fetch_request_authority = __esmMin((() => {
	init_global_singleton();
	resolveGlobalSingleton(Symbol.for("openclaw.guardedFetchRequestAuthority"), () => new AsyncLocalStorage());
}));
var init_guarded_body_stream = __esmMin((() => {
	new FinalizationRegistry((held) => {
		held.finalize().catch(() => void 0);
	});
}));
var init_pinned_dispatcher_pool = __esmMin((() => {
	init_ssrf();
	AsyncLocalStorage.snapshot();
}));
var init_redirect_headers = __esmMin((() => {
	init_fetch_headers();
}));
var init_form_data = __esmMin((() => {}));
var init_runtime_fetch = __esmMin((() => {
	init_fetch_headers();
	init_form_data();
	init_undici_runtime();
}));
var init_undici_global_dispatcher = __esmMin((() => {
	init_proxy_env();
	init_managed_proxy_undici();
	init_undici_runtime();
	Object.freeze({ allowH2: false });
})), init_paths = __esmMin((() => {
	init_paths$1();
}));
var init_env = __esmMin((() => {
	init_paths();
}));
var init_model_provider_header_policy = __esmMin((() => {
	init_string_coerce();
}));
var init_header_redaction = __esmMin((() => {
	init_fetch_headers();
	init_secret_redaction_registry();
	init_model_provider_header_policy();
}));
var init_runtime_deferral = __esmMin((() => {
	new AsyncLocalStorage();
})), init_runtime_cleanup = __esmMin((() => {
	init_signal_exit_barrier();
}));
var init_store_lifecycle = __esmMin((() => {
	init_deferred();
	init_listeners();
}));
var init_store_async = __esmMin((() => {
	init_sqlite_worker_contract();
	init_openclaw_state_db_cache();
	init_openclaw_state_worker_context();
	init_openclaw_state_worker_store();
	init_store_lifecycle();
}));
var init_store_kernel = __esmMin((() => {
	init_string_normalization();
	init_crypto_digest();
	init_kysely_sync_cache_state();
	init_kysely_sync();
	init_private_mode();
	init_sqlite_transaction();
	init_store_readonly();
}));
var init_store_sqlite = __esmMin((() => {
	init_node_sqlite();
	init_private_mode();
	init_sqlite_files();
	init_sqlite_strict();
	init_sqlite_wal();
	init_openclaw_state_db_cache();
	init_openclaw_state_db();
	init_store_lifecycle();
	init_store_kernel();
}));
var init_runtime_owner = __esmMin((() => {
	init_error_graph_internal();
	init_sqlite_worker_contract();
	init_sqlite_worker_store();
	init_secret_redaction_registry();
	init_deferred();
	init_openclaw_state_db_async_lifecycle();
	init_openclaw_state_worker_context();
	init_env();
	init_header_redaction();
	init_runtime_cleanup();
	init_runtime_deferral();
	init_store_lifecycle();
	init_store_async();
	init_store_sqlite();
}));
var init_runtime_fetch_patch = __esmMin((() => {
	init_fetch_headers();
	init_runtime_owner();
}));
var init_runtime_response_body = __esmMin((() => {
	init_http_response_body_timeout();
	init_runtime_owner();
}));
__esmMin((() => {
	init_fetch_headers();
	init_secret_redaction_registry();
	init_deferred();
	init_env();
	init_header_redaction();
	init_runtime_deferral();
	init_runtime_fetch_patch();
	init_runtime_owner();
	init_runtime_response_body();
	init_store_sqlite();
	Buffer.from("[REDACTED BINARY PAYLOAD]", "utf8");
}));
var init_fetch_guard = __esmMin((() => {
	init_promise_like();
	init_logger();
	init_fetch_timeout();
	init_fetch_headers();
	init_http_body();
	init_configured_local_origin_bypass();
	init_fetch_request_authority();
	init_guarded_body_stream();
	init_pinned_dispatcher_pool();
	init_proxy_env();
	init_redirect_headers();
	init_runtime_fetch();
	init_ssrf();
	init_undici_family_policy();
	init_undici_global_dispatcher();
	init_undici_runtime();
}));
//#endregion
//#region src/infra/retry-attempt-errors.ts
function recordRetryAttemptErrors(error, attemptErrors) {
	retryAttemptErrors.set(error, [...attemptErrors]);
}
function getRetryAttemptErrors(err) {
	return err !== null && (typeof err === "object" || typeof err === "function") ? retryAttemptErrors.get(err) : void 0;
}
var retryAttemptErrors;
var init_retry_attempt_errors = __esmMin((() => {
	retryAttemptErrors = /* @__PURE__ */ new WeakMap();
}));
//#endregion
//#region src/infra/retry.ts
function createRetryFailure(rawAttemptErrors) {
	const attemptErrors = rawAttemptErrors.flatMap((err) => getRetryAttemptErrors(err) ?? [err]);
	const failure = toRetryError(attemptErrors.at(-1) ?? /* @__PURE__ */ new Error("Retry failed"), "Non-Error thrown");
	if (attemptErrors.length > 1) recordRetryAttemptErrors(failure, attemptErrors);
	return failure;
}
var init_retry = __esmMin((() => {
	init_src$1();
	init_retry_attempt_errors();
	init_secure_random();
	createRetryRunner({
		random: generateSecureFraction,
		createFailure: createRetryFailure
	});
}));
//#endregion
//#region src/infra/retryable-network-errors.ts
var init_retryable_network_errors = __esmMin((() => {}));
var init_channel_read_authority = __esmMin((() => {
	init_global_singleton();
	resolveGlobalSingleton(Symbol.for("openclaw.channelReadAuthority"), () => new AsyncLocalStorage());
}));
var init_fetch_read_scope = __esmMin((() => {
	init_channel_read_authority();
}));
var init_sibling_temp_file = __esmMin((() => {}));
var init_store_shared = __esmMin((() => {
	init_src();
}));
__esmMin((() => {
	init_directory_durability();
	init_fs_safe();
	init_redact();
	init_channel_read_authority();
	init_global_singleton();
	init_store_shared();
	resolveGlobalSingleton(Symbol.for("openclaw.readMediaExitCleanup"), () => {
		const callbacks = /* @__PURE__ */ new Set();
		process.once("exit", () => {
			for (const cleanup of callbacks) try {
				cleanup();
			} catch (error) {
				console.error(`Channel read output cleanup failed at exit: ${redactToolPayloadText(String(error))}`);
			}
		});
		return callbacks;
	});
}));
__esmMin((() => {
	init_mime();
	init_runtime_fetch();
	init_fetch();
}));
var init_inbound_path_policy = __esmMin((() => {}));
//#endregion
//#region src/config/model-input.ts
var init_model_input = __esmMin((() => {
	init_number_coercion();
}));
//#endregion
//#region src/skills/discovery/agent-filter.ts
var init_agent_filter = __esmMin((() => {
	init_agent_scope_config();
}));
//#endregion
//#region src/agents/agent-scope.ts
var init_agent_scope = __esmMin((() => {
	init_model_input();
	init_session_store_owner();
	init_path_guards();
	init_session_key();
	init_agent_scope_config();
	init_workspace_state_identity();
	init_agent_filter();
}));
//#endregion
//#region src/agents/tool-description-presets.ts
var EXEC_TOOL_DISPLAY_SUMMARY, PROCESS_TOOL_DISPLAY_SUMMARY, CRON_TOOL_DISPLAY_SUMMARY, SESSIONS_LIST_TOOL_DISPLAY_SUMMARY, SESSIONS_HISTORY_TOOL_DISPLAY_SUMMARY, SESSIONS_SEARCH_TOOL_DISPLAY_SUMMARY, SESSIONS_SEND_TOOL_DISPLAY_SUMMARY, SESSIONS_SPAWN_TOOL_DISPLAY_SUMMARY, AGENTS_WAIT_TOOL_DISPLAY_SUMMARY, SESSION_STATUS_TOOL_DISPLAY_SUMMARY, ASK_USER_TOOL_DISPLAY_SUMMARY, SUGGEST_TASK_TOOL_DISPLAY_SUMMARY, DISMISS_TASK_TOOL_DISPLAY_SUMMARY, SKILL_WORKSHOP_TOOL_DISPLAY_SUMMARY;
var init_tool_description_presets = __esmMin((() => {
	EXEC_TOOL_DISPLAY_SUMMARY = "Run shell now.";
	PROCESS_TOOL_DISPLAY_SUMMARY = "Inspect/control exec sessions.";
	CRON_TOOL_DISPLAY_SUMMARY = "Schedule reminders, automations, wake events.";
	SESSIONS_LIST_TOOL_DISPLAY_SUMMARY = "List visible sessions; filters/previews.";
	SESSIONS_HISTORY_TOOL_DISPLAY_SUMMARY = "Read sanitized session history.";
	SESSIONS_SEARCH_TOOL_DISPLAY_SUMMARY = "Search past session transcripts.";
	SESSIONS_SEND_TOOL_DISPLAY_SUMMARY = "Run same-Gateway session/agent.";
	SESSIONS_SPAWN_TOOL_DISPLAY_SUMMARY = "Spawn hidden subagent (ephemeral) or visible work session (durable).";
	AGENTS_WAIT_TOOL_DISPLAY_SUMMARY = "Wait for collector subagents.";
	SESSION_STATUS_TOOL_DISPLAY_SUMMARY = "Show session status/model/usage.";
	ASK_USER_TOOL_DISPLAY_SUMMARY = "Ask the user and wait for an answer.";
	SUGGEST_TASK_TOOL_DISPLAY_SUMMARY = "Suggest follow-up work for operator approval.";
	DISMISS_TASK_TOOL_DISPLAY_SUMMARY = "Withdraw a pending task suggestion.";
	SKILL_WORKSHOP_TOOL_DISPLAY_SUMMARY = "Author reusable skills under the available tool's publication and review policy. Read one complete artifact when it fits the model budget.";
}));
//#endregion
//#region src/agents/tools/automations-tool-name.ts
var AUTOMATIONS_TOOL_NAME;
var init_automations_tool_name = __esmMin((() => {
	AUTOMATIONS_TOOL_NAME = "automations";
}));
//#endregion
//#region src/agents/tool-catalog.ts
function listCoreToolIdsForProfile(profile) {
	return CORE_TOOL_DEFINITIONS.filter((tool) => tool.profiles.includes(profile)).map((tool) => tool.id);
}
function buildCoreToolGroupMap() {
	const sectionToolMap = /* @__PURE__ */ new Map();
	for (const tool of CORE_TOOL_DEFINITIONS) {
		if (tool.includeInSectionGroup === false) continue;
		const groupId = `group:${tool.sectionId}`;
		const list = sectionToolMap.get(groupId) ?? [];
		list.push(tool.id);
		sectionToolMap.set(groupId, list);
	}
	return {
		"group:openclaw": CORE_TOOL_DEFINITIONS.filter((tool) => tool.includeInOpenClawGroup).map((tool) => tool.id),
		...Object.fromEntries(sectionToolMap.entries())
	};
}
var CORE_TOOL_SECTION_ORDER, CORE_TOOL_DEFINITIONS, CORE_TOOL_GROUPS;
var init_tool_catalog = __esmMin((() => {
	init_tool_description_presets();
	init_automations_tool_name();
	CORE_TOOL_SECTION_ORDER = [
		{
			id: "fs",
			label: "Files"
		},
		{
			id: "runtime",
			label: "Runtime"
		},
		{
			id: "web",
			label: "Web"
		},
		{
			id: "memory",
			label: "Memory"
		},
		{
			id: "sessions",
			label: "Sessions"
		},
		{
			id: "ui",
			label: "UI"
		},
		{
			id: "messaging",
			label: "Messaging"
		},
		{
			id: "automation",
			label: "Automation"
		},
		{
			id: "nodes",
			label: "Nodes"
		},
		{
			id: "agents",
			label: "Agents"
		},
		{
			id: "media",
			label: "Media"
		}
	];
	CORE_TOOL_DEFINITIONS = [
		{
			id: "decision_evaluate",
			description: "Evaluate explicit evidence with the agent's decision model",
			sectionId: "agents",
			profiles: ["coding", "messaging"],
			includeInOpenClawGroup: true
		},
		{
			id: "ls",
			executionLocation: "placement",
			description: "List directory entries",
			sectionId: "fs",
			profiles: ["coding"]
		},
		{
			id: "read",
			executionLocation: "placement",
			description: "Read file contents",
			sectionId: "fs",
			profiles: ["coding"]
		},
		{
			id: "write",
			executionLocation: "placement",
			description: "Create or overwrite files",
			sectionId: "fs",
			profiles: ["coding"]
		},
		{
			id: "edit",
			executionLocation: "placement",
			description: "Make precise edits",
			sectionId: "fs",
			profiles: ["coding"]
		},
		{
			id: "apply_patch",
			executionLocation: "placement",
			description: "Patch files",
			sectionId: "fs",
			profiles: ["coding"]
		},
		{
			id: "exec",
			executionLocation: "placement",
			description: EXEC_TOOL_DISPLAY_SUMMARY,
			sectionId: "runtime",
			profiles: ["coding"]
		},
		{
			id: "process",
			executionLocation: "placement",
			description: PROCESS_TOOL_DISPLAY_SUMMARY,
			sectionId: "runtime",
			profiles: ["coding"]
		},
		{
			id: "code_execution",
			description: "Run sandboxed remote analysis",
			sectionId: "runtime",
			profiles: ["coding"],
			includeInOpenClawGroup: true
		},
		{
			id: "secrets",
			description: "Request and manage write-only credentials",
			sectionId: "runtime",
			profiles: ["coding", "messaging"],
			includeInOpenClawGroup: true
		},
		{
			id: "web_search",
			description: "Search the web",
			sectionId: "web",
			profiles: ["coding"],
			includeInOpenClawGroup: true
		},
		{
			id: "web_fetch",
			description: "Fetch web content",
			sectionId: "web",
			profiles: ["coding"],
			includeInOpenClawGroup: true
		},
		{
			id: "x_search",
			description: "Search X posts",
			sectionId: "web",
			profiles: ["coding"],
			includeInOpenClawGroup: true
		},
		{
			id: "memory_search",
			description: "Semantic search",
			sectionId: "memory",
			profiles: ["coding"],
			includeInOpenClawGroup: true
		},
		{
			id: "memory_get",
			description: "Read memory files",
			sectionId: "memory",
			profiles: ["coding"],
			includeInOpenClawGroup: true
		},
		{
			id: "personal_instructions",
			description: "Edit the requesting user’s personal instructions",
			sectionId: "memory",
			profiles: ["coding", "messaging"],
			includeInOpenClawGroup: true
		},
		{
			id: "presence",
			executionLocation: "gateway",
			description: "Online people, connected devices, recent activity, and connection location",
			sectionId: "sessions",
			profiles: [
				"minimal",
				"coding",
				"messaging"
			],
			includeInOpenClawGroup: true
		},
		{
			id: "sessions",
			description: "Session settings: label, pin, archive, groups",
			sectionId: "sessions",
			profiles: ["coding", "messaging"],
			includeInOpenClawGroup: true
		},
		{
			id: "sessions_list",
			description: SESSIONS_LIST_TOOL_DISPLAY_SUMMARY,
			sectionId: "sessions",
			profiles: ["coding", "messaging"],
			includeInOpenClawGroup: true
		},
		{
			id: "sessions_history",
			description: SESSIONS_HISTORY_TOOL_DISPLAY_SUMMARY,
			sectionId: "sessions",
			profiles: ["coding", "messaging"],
			includeInOpenClawGroup: true
		},
		{
			id: "sessions_search",
			description: SESSIONS_SEARCH_TOOL_DISPLAY_SUMMARY,
			sectionId: "sessions",
			profiles: ["coding", "messaging"],
			includeInOpenClawGroup: true
		},
		{
			id: "conversations_list",
			description: "List exact external conversation addresses",
			sectionId: "sessions",
			profiles: ["coding", "messaging"],
			includeInOpenClawGroup: true
		},
		{
			id: "conversations_send",
			description: "Send to an exact external conversation",
			sectionId: "sessions",
			profiles: ["coding", "messaging"],
			includeInOpenClawGroup: true
		},
		{
			id: "conversations_turn",
			description: "Send and wait for a correlated external reply",
			sectionId: "sessions",
			profiles: ["coding", "messaging"],
			includeInOpenClawGroup: true
		},
		{
			id: "sessions_send",
			executionLocation: "gateway",
			description: SESSIONS_SEND_TOOL_DISPLAY_SUMMARY,
			sectionId: "sessions",
			profiles: ["coding", "messaging"],
			includeInOpenClawGroup: true
		},
		{
			id: "sessions_spawn",
			executionLocation: "gateway",
			description: SESSIONS_SPAWN_TOOL_DISPLAY_SUMMARY,
			sectionId: "sessions",
			profiles: ["coding", "messaging"],
			includeInOpenClawGroup: true
		},
		{
			id: "github_identity_status",
			description: "Inspect the effective GitHub identity and credential health",
			sectionId: "sessions",
			profiles: ["coding"],
			includeInOpenClawGroup: true
		},
		{
			id: "github_publish",
			description: "Publish the reconciled session worktree as a draft GitHub pull request",
			sectionId: "sessions",
			profiles: ["coding"],
			includeInOpenClawGroup: true
		},
		{
			id: "agents_wait",
			description: AGENTS_WAIT_TOOL_DISPLAY_SUMMARY,
			sectionId: "sessions",
			profiles: ["coding"],
			includeInOpenClawGroup: true
		},
		{
			id: "sessions_yield",
			description: "End turn to receive sub-agent results",
			sectionId: "sessions",
			profiles: ["coding", "messaging"],
			includeInOpenClawGroup: true
		},
		{
			id: "subagents",
			description: "Background work: subagents, media gen, automation runs. list/cancel.",
			sectionId: "sessions",
			profiles: ["coding", "messaging"],
			includeInOpenClawGroup: true
		},
		{
			id: "session_status",
			description: SESSION_STATUS_TOOL_DISPLAY_SUMMARY,
			sectionId: "sessions",
			profiles: [
				"minimal",
				"coding",
				"messaging"
			],
			includeInOpenClawGroup: true
		},
		{
			id: "suggest_task",
			description: SUGGEST_TASK_TOOL_DISPLAY_SUMMARY,
			sectionId: "sessions",
			profiles: ["coding"],
			includeInOpenClawGroup: true
		},
		{
			id: "dismiss_task",
			description: DISMISS_TASK_TOOL_DISPLAY_SUMMARY,
			sectionId: "sessions",
			profiles: ["coding"],
			includeInOpenClawGroup: true
		},
		{
			id: "browser",
			executionLocation: "placement",
			description: "Control web browser",
			sectionId: "ui",
			profiles: [],
			includeInOpenClawGroup: true
		},
		{
			id: "screen",
			description: "Drive operator web UI",
			sectionId: "ui",
			profiles: ["coding"],
			includeInOpenClawGroup: true
		},
		{
			id: "theme",
			description: "List, select, and create appearance themes",
			sectionId: "ui",
			profiles: ["coding", "messaging"],
			includeInOpenClawGroup: true
		},
		{
			id: "dashboard",
			description: "Read and arrange the session dashboard",
			sectionId: "ui",
			profiles: ["coding"],
			includeInOpenClawGroup: true
		},
		{
			id: "terminal",
			description: "Use shared operator terminals with policy-governed input",
			sectionId: "ui",
			profiles: ["coding"],
			includeInOpenClawGroup: true
		},
		{
			id: "portal",
			executionLocation: "gateway",
			description: "Expose local web apps through the gateway",
			sectionId: "ui",
			profiles: ["coding"],
			includeInOpenClawGroup: true
		},
		{
			id: "canvas",
			description: "Control node Canvas surfaces when the Canvas plugin is enabled",
			sectionId: "ui",
			profiles: []
		},
		{
			id: "show_widget",
			description: "Show an interactive widget on chat or an auto-fitting dashboard",
			sectionId: "ui",
			profiles: [],
			includeInOpenClawGroup: true
		},
		{
			id: "message",
			description: "Send messages",
			sectionId: "messaging",
			profiles: ["messaging"],
			includeInOpenClawGroup: true
		},
		{
			id: "heartbeat_respond",
			description: "Accept heartbeat outcomes for post-turn handling",
			sectionId: "automation",
			profiles: [],
			includeInOpenClawGroup: true
		},
		{
			id: AUTOMATIONS_TOOL_NAME,
			description: CRON_TOOL_DISPLAY_SUMMARY,
			sectionId: "automation",
			profiles: ["coding"],
			includeInOpenClawGroup: true
		},
		{
			id: "gateway",
			description: "Update OpenClaw; read Gateway config/schema when permitted",
			sectionId: "automation",
			profiles: [
				"minimal",
				"coding",
				"messaging"
			],
			includeInOpenClawGroup: true
		},
		{
			id: "plugins",
			description: "Manage and reload plugins",
			sectionId: "automation",
			profiles: ["coding"],
			includeInOpenClawGroup: true
		},
		{
			id: "openclaw",
			description: "Delegate OpenClaw setup and repair",
			sectionId: "automation",
			profiles: [],
			includeInOpenClawGroup: true
		},
		{
			id: "nodes",
			description: "Nodes + devices",
			sectionId: "nodes",
			profiles: [],
			includeInOpenClawGroup: true
		},
		{
			id: "computer",
			executionLocation: "placement",
			description: "Control the Gateway desktop or a paired computer",
			sectionId: "nodes",
			profiles: [],
			includeInOpenClawGroup: true
		},
		{
			id: "mobile_ui",
			description: "Observe and control a paired Android app",
			sectionId: "nodes",
			profiles: [],
			includeInOpenClawGroup: true
		},
		{
			id: "agents_list",
			description: "List agents",
			sectionId: "agents",
			profiles: [],
			includeInOpenClawGroup: true
		},
		{
			id: "get_goal",
			description: "Get current thread goal",
			sectionId: "agents",
			profiles: ["coding"],
			includeInOpenClawGroup: true
		},
		{
			id: "create_goal",
			description: "Create a thread goal",
			sectionId: "agents",
			profiles: ["coding"],
			includeInOpenClawGroup: true
		},
		{
			id: "update_goal",
			description: "Complete or block a thread goal",
			sectionId: "agents",
			profiles: ["coding"],
			includeInOpenClawGroup: true
		},
		{
			id: "progress_card",
			description: "Maintain the session progress card",
			sectionId: "agents",
			profiles: ["coding"],
			includeInOpenClawGroup: true
		},
		{
			id: "ask_user",
			description: ASK_USER_TOOL_DISPLAY_SUMMARY,
			sectionId: "agents",
			profiles: ["coding", "messaging"],
			includeInOpenClawGroup: true
		},
		{
			id: "skill_workshop",
			executionLocation: "gateway",
			description: SKILL_WORKSHOP_TOOL_DISPLAY_SUMMARY,
			sectionId: "agents",
			profiles: ["coding"],
			includeInOpenClawGroup: true
		},
		{
			id: "skills_search",
			description: "Search installed eligible skills",
			sectionId: "agents",
			profiles: ["coding"],
			includeInOpenClawGroup: true
		},
		{
			id: "skills_read",
			description: "Read complete installed skill instructions",
			sectionId: "agents",
			profiles: ["coding"],
			includeInOpenClawGroup: true
		},
		{
			id: "view_image",
			description: "Image understanding",
			sectionId: "media",
			profiles: ["coding"],
			includeInOpenClawGroup: true
		},
		{
			id: "image_generate",
			description: "Image generation",
			sectionId: "media",
			profiles: ["coding"],
			includeInOpenClawGroup: true
		},
		{
			id: "music_generate",
			description: "Music generation",
			sectionId: "media",
			profiles: ["coding"],
			includeInOpenClawGroup: true
		},
		{
			id: "video_generate",
			description: "Video generation",
			sectionId: "media",
			profiles: ["coding"],
			includeInOpenClawGroup: true
		},
		{
			id: "transcripts",
			description: "Inspect and manage meeting transcript captures",
			sectionId: "media",
			profiles: [],
			includeInSectionGroup: false
		},
		{
			id: "tts",
			description: "Text-to-speech conversion",
			sectionId: "media",
			profiles: [],
			includeInOpenClawGroup: true
		},
		{
			id: "pdf",
			description: "PDF reading and extraction",
			sectionId: "media",
			profiles: [],
			includeInOpenClawGroup: true
		}
	];
	new Map(CORE_TOOL_DEFINITIONS.map((tool) => [tool.id, tool]));
	Object.freeze(CORE_TOOL_DEFINITIONS.filter((tool) => tool.executionLocation).map((tool) => tool.id));
	CORE_TOOL_SECTION_ORDER.map(({ id, label }) => ({
		id,
		label,
		tools: CORE_TOOL_DEFINITIONS.filter((tool) => tool.sectionId === id)
	}));
	listCoreToolIdsForProfile("minimal"), [...listCoreToolIdsForProfile("coding")], [...listCoreToolIdsForProfile("messaging")];
	CORE_TOOL_GROUPS = buildCoreToolGroupMap();
}));
var init_tool_policy_shared = __esmMin((() => {
	init_tool_catalog();
	({ ...CORE_TOOL_GROUPS });
}));
//#endregion
//#region src/agents/tool-policy-match.ts
var init_tool_policy_match = __esmMin((() => {
	init_tool_policy_shared();
}));
//#endregion
//#region src/agents/tool-policy.ts
var init_tool_policy = __esmMin((() => {
	init_tool_policy_shared();
}));
//#endregion
//#region src/agents/tool-fs-policy.ts
var init_tool_fs_policy = __esmMin((() => {
	init_agent_scope();
	init_tool_policy_match();
	init_tool_policy();
}));
//#endregion
//#region src/media/local-media-path.ts
var init_local_media_path = __esmMin((() => {
	init_utils();
}));
var init_local_roots = __esmMin((() => {
	init_agent_scope();
	init_tool_fs_policy();
	init_paths$1();
	init_boundary_path();
	init_path_guards();
	init_tmp_openclaw_dir();
	init_utils();
	init_local_media_path();
}));
var init_inbound_media_uri = __esmMin((() => {}));
var init_media_reference = __esmMin((() => {
	init_utils();
	init_inbound_media_uri();
	init_store();
}));
__esmMin((() => {
	init_inbound_path_policy();
	init_globals();
	init_fs_safe();
	init_path_guards();
	init_channel_read_authority();
	init_local_roots();
	init_media_reference();
}));
var init_store = __esmMin((() => {
	init_file_name();
	init_mime();
	init_utf16_slice();
	init_fs_safe();
	init_retry();
	init_sibling_temp_file();
	init_channel_read_authority();
	init_openclaw_state_worker_context();
	init_utils();
	init_store_shared();
	init_usingCtx();
	createAsyncLock();
}));
var init_fetch = __esmMin((() => {
	init_constants();
	init_content_length();
	init_file_name();
	init_mime();
	init_src();
	init_abort_signal();
	init_backoff();
	init_errors();
	init_http_body();
	init_fetch_guard();
	init_retry();
	init_retryable_network_errors();
	init_redact();
	init_channel_read_authority();
	init_fetch_timeout();
	init_fetch_read_scope();
	init_store();
	init_store_shared();
}));
//#endregion
export {};
