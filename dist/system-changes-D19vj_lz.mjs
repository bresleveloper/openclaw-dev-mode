import { y as parseDateStringTimestampMs } from "./number-coercion-CuVhdCBs.mjs";
import { r as consumeRootOptionToken } from "./cli-root-options-DGcy1qRg.mjs";
import { t as createSqliteAuditRecordReader } from "./sqlite-audit-record-store.async-1lh-4o2u.mjs";
import { n as CONFIG_AUDIT_SCOPE } from "./io.audit-BXzMurur.mjs";
import { $a as validateSystemChangesListParams } from "./src-l2dWvEsN.mjs";
import { t as ErrorCodes } from "./gateway-error-details-DIefe7Zy.mjs";
import { f as errorShape } from "./error-codes-Dh56LniQ.mjs";
import { a as readGatewayRequestMutationAuthority } from "./session-mutation-guards-BrASrBY_.mjs";
import { n as SYSTEM_AGENT_AUDIT_SCOPE } from "./audit-FqvDk6WR.mjs";
import { n as defineValidatedGatewayHandler } from "./validation-Bu27N0nv.mjs";
//#region src/gateway/server-methods/system-changes.ts
const DEFAULT_CHANGE_LIMIT = 50;
const MAX_CHANGE_LIMIT = 200;
const CHANGE_SCAN_BATCH_SIZE = 201;
const SYSTEM_CHANGE_MAX_RAW_SCAN_PER_SCOPE = 1e3;
const COLLAPSE_MAX_DELAY_MS = 6e4;
const MAX_PENDING_COLLAPSES = MAX_CHANGE_LIMIT;
function encodeCursor(cursor) {
	return Buffer.from(JSON.stringify(cursor), "utf8").toString("base64url");
}
function decodeCursor(value) {
	let parsed;
	try {
		parsed = JSON.parse(Buffer.from(value, "base64url").toString("utf8"));
	} catch {
		throw new Error("invalid change-history cursor");
	}
	if (!parsed || typeof parsed !== "object" || parsed.version !== 1 || !Number.isSafeInteger(parsed.systemAgentBefore) || !Number.isSafeInteger(parsed.configBefore) || !isValidPendingCollapses(parsed.pendingCollapse)) throw new Error("invalid change-history cursor");
	return parsed;
}
function isValidPendingCollapses(value) {
	return value === void 0 || Array.isArray(value) && value.length <= MAX_PENDING_COLLAPSES && value.every((marker) => marker !== null && typeof marker === "object" && typeof marker.transition === "string" && marker.transition.length <= 512 && Number.isSafeInteger(marker.maxConfigSequence) && Number.isSafeInteger(marker.operationAt));
}
function transitionKey(before, after) {
	if (before === after || before == null && after == null) return;
	return JSON.stringify([before ?? null, after ?? null]);
}
function classifyConfigWriteSource(record) {
	if (record.origin) return record.origin;
	const launcherIndex = record.argv.findIndex((arg) => /(?:^|[/\\])openclaw(?:\.m?js)?$/i.test(arg));
	let command;
	if (launcherIndex >= 0) for (let index = launcherIndex + 1; index < record.argv.length; index += 1) {
		const consumed = consumeRootOptionToken(record.argv, index);
		if (consumed > 0) {
			index += consumed - 1;
			continue;
		}
		if (record.argv[index] === "--") {
			command = record.argv[index + 1];
			break;
		}
		if (!record.argv[index]?.startsWith("-")) {
			command = record.argv[index];
			break;
		}
	}
	if (command === "doctor") return "doctor";
	if (command === "config") return "cli";
	return "unknown";
}
function summarizePaths(prefix, changedPaths) {
	if (!changedPaths || changedPaths.length === 0) return prefix;
	return `${prefix}: ${changedPaths.join(", ")}`;
}
function configWriteSummary(source, changedPaths) {
	return summarizePaths(source === "doctor" ? "Doctor updated configuration" : source === "config-rpc" ? "Settings updated configuration" : source === "plugin-install" ? "Plugin installation updated configuration" : source === "system-agent" ? "OpenClaw updated configuration" : source === "cli" ? "CLI updated configuration" : "Configuration updated", changedPaths);
}
function toSystemAgentCandidate(record) {
	return {
		entry: {
			id: `${SYSTEM_AGENT_AUDIT_SCOPE}:${record.sequence}`,
			at: parseDateStringTimestampMs(record.value.timestamp) ?? record.createdAt,
			kind: "operation",
			source: "system-agent",
			summary: record.value.summary
		},
		transition: transitionKey(record.value.configHashBefore, record.value.configHashAfter),
		recordedAt: record.createdAt,
		position: {
			scope: SYSTEM_AGENT_AUDIT_SCOPE,
			sequence: record.sequence
		}
	};
}
function toConfigCandidate(record) {
	const value = record.value;
	if (value.event === "config.observe") return null;
	if (value.event === "config.external") {
		const changedPaths = value.changedPaths?.length ? value.changedPaths : void 0;
		return {
			entry: {
				id: `${CONFIG_AUDIT_SCOPE}:${record.sequence}`,
				at: parseDateStringTimestampMs(value.ts) ?? record.createdAt,
				kind: "external-edit",
				source: "external",
				summary: summarizePaths("Configuration edited outside OpenClaw", changedPaths),
				...changedPaths ? { changedPaths } : {},
				...!value.valid ? { invalid: true } : {},
				...value.opaqueChange ? { opaqueChange: true } : {}
			},
			transition: transitionKey(value.previousHash, value.nextHash),
			recordedAt: record.createdAt,
			position: {
				scope: CONFIG_AUDIT_SCOPE,
				sequence: record.sequence
			}
		};
	}
	if (value.result !== "rename" && value.result !== "copy-fallback") return null;
	const changedPaths = value.changedPaths?.length ? value.changedPaths : void 0;
	const source = classifyConfigWriteSource(value);
	return {
		entry: {
			id: `${CONFIG_AUDIT_SCOPE}:${record.sequence}`,
			at: parseDateStringTimestampMs(value.ts) ?? record.createdAt,
			kind: "config-write",
			source,
			summary: configWriteSummary(source, changedPaths),
			...changedPaths ? { changedPaths } : {}
		},
		transition: transitionKey(value.previousHash, value.nextHash),
		recordedAt: record.createdAt,
		position: {
			scope: CONFIG_AUDIT_SCOPE,
			sequence: record.sequence
		}
	};
}
async function scanCandidates(params) {
	const entries = [];
	let beforeSequence = params.beforeSequence;
	let exhausted = false;
	let loadedRawEntries = 0;
	while (entries.length < params.target && loadedRawEntries < 1e3) {
		const pageLimit = Math.min(CHANGE_SCAN_BATCH_SIZE, SYSTEM_CHANGE_MAX_RAW_SCAN_PER_SCOPE - loadedRawEntries);
		const page = await params.latest({
			limit: pageLimit,
			beforeSequence
		});
		if (page.length === 0) {
			exhausted = true;
			break;
		}
		loadedRawEntries += page.length;
		let stoppedAt = -1;
		for (let index = 0; index < page.length; index += 1) {
			const entry = page[index];
			beforeSequence = entry.sequence;
			const candidate = params.project(entry);
			if (candidate) {
				entries.push(candidate);
				if (entries.length >= params.target) {
					stoppedAt = index;
					break;
				}
			}
		}
		if (entries.length >= params.target) {
			exhausted = stoppedAt === page.length - 1 && page.length < pageLimit;
			break;
		}
		if (page.length < pageLimit) {
			exhausted = true;
			break;
		}
	}
	return {
		entries,
		exhausted,
		nextBeforeSequence: entries.at(-1)?.position.sequence ?? beforeSequence
	};
}
function planConfigMatches(systemCandidates, configCandidates) {
	const configByTransition = /* @__PURE__ */ new Map();
	for (const candidate of configCandidates) {
		if (!candidate.transition || candidate.entry.kind !== "config-write" || candidate.entry.source !== "system-agent") continue;
		const matches = configByTransition.get(candidate.transition) ?? [];
		matches.push(candidate);
		configByTransition.set(candidate.transition, matches);
	}
	const planned = /* @__PURE__ */ new Map();
	const usedConfig = /* @__PURE__ */ new Set();
	let lastMatchedConfigSequence = Number.POSITIVE_INFINITY;
	for (const operation of systemCandidates) {
		if (!operation.transition) continue;
		const write = configByTransition.get(operation.transition)?.filter((candidate) => {
			const configSequence = candidate.position.sequence;
			return !usedConfig.has(candidate) && configSequence < lastMatchedConfigSequence && isWithinCollapseWindow(operation.entry.at, candidate.entry.at);
		}).toSorted((left, right) => right.recordedAt - left.recordedAt)[0];
		if (!write) continue;
		planned.set(operation, write);
		usedConfig.add(write);
		lastMatchedConfigSequence = write.position.sequence;
	}
	return planned;
}
function compareCandidates(left, right) {
	if (left.recordedAt !== right.recordedAt) return right.recordedAt - left.recordedAt;
	const scopeOrder = right.position.scope.localeCompare(left.position.scope);
	if (scopeOrder !== 0) return scopeOrder;
	return right.position.sequence - left.position.sequence;
}
function isWithinCollapseWindow(operationAt, configAt) {
	const delay = operationAt - configAt;
	return delay >= 0 && delay <= COLLAPSE_MAX_DELAY_MS;
}
function appendPendingCollapse(pending, marker) {
	const next = [...pending, marker];
	return next.length <= MAX_PENDING_COLLAPSES ? next : next.slice(-200);
}
function consumePendingCollapse(pending, candidate) {
	if (candidate.entry.kind !== "config-write" || candidate.entry.source !== "system-agent" || !candidate.transition) return {
		pending: [...pending],
		suppressed: false
	};
	const sequence = candidate.position.sequence;
	let markerIndex = -1;
	let markerSequence = Number.POSITIVE_INFINITY;
	for (let index = 0; index < pending.length; index += 1) {
		const marker = pending[index];
		if (marker.transition === candidate.transition && sequence <= marker.maxConfigSequence && isWithinCollapseWindow(marker.operationAt, candidate.entry.at) && marker.maxConfigSequence < markerSequence) {
			markerIndex = index;
			markerSequence = marker.maxConfigSequence;
		}
	}
	if (markerIndex < 0) return {
		pending: [...pending],
		suppressed: false
	};
	return {
		pending: pending.filter((_, index) => index !== markerIndex),
		suppressed: true
	};
}
function mergeCandidates(params) {
	let systemIndex = 0;
	let configIndex = 0;
	let systemBefore;
	let configBefore;
	let pendingCollapse = [...params.pendingCollapse];
	const entries = [];
	while (true) {
		const system = params.systemCandidates[systemIndex];
		const config = params.configCandidates[configIndex];
		const next = system && config ? compareCandidates(system, config) <= 0 ? system : config : system ?? config;
		if (!next) break;
		if (next === config) {
			const collapse = consumePendingCollapse(pendingCollapse, config);
			pendingCollapse = collapse.pending;
			if (collapse.suppressed) {
				configBefore = config.position.sequence;
				configIndex += 1;
				continue;
			}
		}
		if (entries.length >= params.limit) break;
		entries.push(next);
		if (next === system) {
			systemBefore = system.position.sequence;
			systemIndex += 1;
			if (system.pendingCollapse) pendingCollapse = appendPendingCollapse(pendingCollapse, system.pendingCollapse);
		} else {
			configBefore = config.position.sequence;
			configIndex += 1;
		}
	}
	return {
		entries,
		systemBefore,
		configBefore,
		pendingCollapse,
		hasBufferedEntries: systemIndex < params.systemCandidates.length || configIndex < params.configCandidates.length,
		hasBufferedSystemEntries: systemIndex < params.systemCandidates.length,
		hasBufferedConfigEntries: configIndex < params.configCandidates.length
	};
}
async function initialBefore(latest) {
	const sequence = (await latest({ limit: 1 }))[0]?.sequence;
	return sequence === void 0 ? 0 : sequence + 1;
}
async function listSystemChanges(params, options = {}) {
	const env = options.env ?? process.env;
	const systemStore = options.systemStore ?? createSqliteAuditRecordReader({
		scope: "system-agent-audit",
		env
	});
	const configStore = options.configStore ?? createSqliteAuditRecordReader({
		scope: "config-audit",
		env
	});
	const cursor = params.beforeCursor ? decodeCursor(params.beforeCursor) : {
		version: 1,
		systemAgentBefore: await initialBefore(systemStore.latest),
		configBefore: await initialBefore(configStore.latest)
	};
	const limit = Math.min(MAX_CHANGE_LIMIT, Math.max(1, params.limit ?? DEFAULT_CHANGE_LIMIT));
	const target = limit + 1;
	const systemScan = await scanCandidates({
		beforeSequence: cursor.systemAgentBefore,
		target,
		latest: systemStore.latest,
		project: toSystemAgentCandidate
	});
	const configScan = await scanCandidates({
		beforeSequence: cursor.configBefore,
		target,
		latest: configStore.latest,
		project: toConfigCandidate
	});
	const systemCandidates = systemScan.entries;
	const configCandidates = configScan.entries;
	const plannedMatches = planConfigMatches(systemCandidates, configCandidates);
	const unseenConfigMaxSequence = configScan.exhausted ? void 0 : configScan.nextBeforeSequence - 1;
	for (const operation of systemCandidates) {
		if (!operation.transition) continue;
		const write = plannedMatches.get(operation);
		if (write) {
			operation.pendingCollapse = {
				transition: operation.transition,
				maxConfigSequence: write.position.sequence,
				operationAt: operation.entry.at
			};
			if (write.entry.changedPaths?.length) operation.entry.changedPaths = [...write.entry.changedPaths];
		} else if (unseenConfigMaxSequence !== void 0) operation.pendingCollapse = {
			transition: operation.transition,
			maxConfigSequence: unseenConfigMaxSequence,
			operationAt: operation.entry.at
		};
	}
	const merged = mergeCandidates({
		systemCandidates,
		configCandidates,
		pendingCollapse: cursor.pendingCollapse ?? [],
		limit
	});
	const pendingCollapse = configScan.exhausted && !merged.hasBufferedConfigEntries ? [] : merged.pendingCollapse;
	const next = { ...cursor };
	if (!merged.hasBufferedSystemEntries) next.systemAgentBefore = systemScan.nextBeforeSequence;
	else if (merged.systemBefore !== void 0) next.systemAgentBefore = merged.systemBefore;
	if (!merged.hasBufferedConfigEntries) next.configBefore = configScan.nextBeforeSequence;
	else if (merged.configBefore !== void 0) next.configBefore = merged.configBefore;
	if (pendingCollapse.length > 0) next.pendingCollapse = pendingCollapse;
	else delete next.pendingCollapse;
	const hasMore = merged.hasBufferedEntries || pendingCollapse.length > 0 || !systemScan.exhausted || !configScan.exhausted;
	const scanAdvanced = next.systemAgentBefore !== cursor.systemAgentBefore || next.configBefore !== cursor.configBefore;
	return {
		entries: merged.entries.map((candidate) => candidate.entry),
		...hasMore && (merged.entries.length > 0 || scanAdvanced) ? { nextCursor: encodeCursor(next) } : {}
	};
}
const systemChangesHandlers = { "openclaw.changes.list": defineValidatedGatewayHandler("openclaw.changes.list", validateSystemChangesListParams, async (options) => {
	const { params, respond } = options;
	const authority = readGatewayRequestMutationAuthority(options);
	authority.assertCurrent();
	const result = await listSystemChanges(params);
	authority.assertCurrent();
	respond(true, result);
}, (error) => errorShape(ErrorCodes.INVALID_REQUEST, error instanceof Error ? error.message : "invalid change-history cursor")) };
//#endregion
export { systemChangesHandlers };
