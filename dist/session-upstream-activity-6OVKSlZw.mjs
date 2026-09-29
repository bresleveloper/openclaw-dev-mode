import { f as asSafeIntegerInRange } from "./number-coercion-CLj0HTDM.mjs";
import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import "./string-coerce-runtime-C_MKhRVt.mjs";
import { t as readFileRangeAsync } from "./file-range-Bpo5m0I4.mjs";
import "./file-access-runtime-CWjkXCju.mjs";
import { i as classifyClaudeCliHistoryMessage, o as isExternalUserText, r as classifyClaudeCliHistoryLine } from "./session-catalog-BvzVZkO1.mjs";
import fs from "node:fs/promises";
//#region extensions/anthropic/session-upstream-activity.ts
const MAX_CLAUDE_UPSTREAM_SCAN_BYTES = 1048576;
async function link$1(sessionKey, hostId, threadId, listSessions) {
	if (hostId !== "gateway:local") return { sessionKey };
	try {
		const record = (await listSessions()).find((candidate) => candidate.threadId === threadId);
		const stat = record ? await fs.stat(record.filePath).catch(() => void 0) : void 0;
		return record && stat?.isFile() ? {
			sessionKey,
			upstream: {
				kind: "claude-cli",
				ref: { filePath: record.filePath },
				marker: { offset: stat.size }
			}
		} : { sessionKey };
	} catch {
		return { sessionKey };
	}
}
function linkRemote(sessionKey, nodeId, threadId, markerUuid) {
	return {
		sessionKey,
		upstream: {
			kind: "claude-cli",
			ref: {
				nodeId,
				threadId
			},
			marker: { uuid: markerUuid }
		}
	};
}
async function linkContinued(params) {
	if (params.hostId === "gateway:local") return await link$1(params.sessionKey, params.hostId, params.threadId, params.listLocalSessions);
	if (!params.hostId.startsWith("node:")) return { sessionKey: params.sessionKey };
	try {
		const newest = (params.history ?? await params.readRemote())[0];
		if (newest && !newest.uuid) return { sessionKey: params.sessionKey };
		return linkRemote(params.sessionKey, params.hostId.slice(5), params.threadId, newest?.uuid ?? null);
	} catch {
		return { sessionKey: params.sessionKey };
	}
}
function readFilePath(probe) {
	return isRecord(probe.upstreamRef) && typeof probe.upstreamRef.filePath === "string" ? probe.upstreamRef.filePath : void 0;
}
function readMarkerOffset(probe) {
	if (!isRecord(probe.marker)) return;
	const offset = probe.marker.offset ?? probe.marker.size;
	return asSafeIntegerInRange(offset, { min: 0 });
}
async function checkClaudeSessionUpstreamActivity(probe) {
	if (probe.upstreamKind !== "claude-cli") return;
	const filePath = readFilePath(probe);
	const markerOffset = readMarkerOffset(probe);
	if (!filePath || markerOffset === void 0) return;
	let handle;
	try {
		handle = await fs.open(filePath, "r");
	} catch (error) {
		return isRecord(error) && error.code === "ENOENT" ? {
			kind: "missing",
			sessionKey: probe.sessionKey
		} : void 0;
	}
	try {
		const stat = await handle.stat();
		if (!stat.isFile()) return {
			kind: "missing",
			sessionKey: probe.sessionKey
		};
		if (stat.size <= markerOffset) return;
		const readLength = Math.min(stat.size - markerOffset, MAX_CLAUDE_UPSTREAM_SCAN_BYTES);
		const tail = await readFileRangeAsync(handle, markerOffset, readLength);
		const lastNewline = tail.lastIndexOf(10);
		if (lastNewline < 0) return;
		const completeTail = tail.subarray(0, lastNewline + 1);
		let humanTurns = 0;
		let occurredAt;
		for (const [lineIndex, line] of completeTail.toString("utf8").split(/\r?\n/).entries()) {
			if (!line.trim()) continue;
			const classification = classifyClaudeCliHistoryLine({
				line,
				cliSessionId: probe.threadId,
				sourceLineNumber: lineIndex + 1
			});
			if (!classification.humanTurn || !isExternalUserText(probe, classification.userText)) continue;
			humanTurns += 1;
			occurredAt = Math.max(occurredAt ?? 0, classification.occurredAt ?? stat.mtimeMs);
		}
		const nextOffset = markerOffset + lastNewline + 1;
		return {
			kind: "activity",
			sessionKey: probe.sessionKey,
			humanTurns,
			nextMarker: { offset: nextOffset },
			...humanTurns > 0 ? {
				occurredAt: occurredAt ?? stat.mtimeMs,
				dedupeId: String(nextOffset)
			} : {}
		};
	} finally {
		await handle.close();
	}
}
function readMarkerUuid(probe) {
	if (!isRecord(probe.marker)) return;
	return probe.marker.uuid === null || typeof probe.marker.uuid === "string" ? probe.marker.uuid : void 0;
}
async function checkRemoteClaudeSessionUpstreamActivity(probe, readRemote) {
	if (!isRecord(probe.upstreamRef) || typeof probe.upstreamRef.nodeId !== "string" || probe.hostId !== `node:${probe.upstreamRef.nodeId}`) return;
	const markerUuid = readMarkerUuid(probe);
	if (markerUuid === void 0) return;
	const items = await readRemote(probe);
	const markerIndex = markerUuid === null ? -1 : items.findIndex((item) => item.uuid === markerUuid);
	const newItems = markerIndex < 0 ? items : items.slice(0, markerIndex);
	const newest = newItems[0];
	if (!newest?.uuid) return;
	let humanTurns = 0;
	let occurredAt;
	for (const [itemIndex, item] of newItems.entries()) {
		if (item.type !== "userMessage") continue;
		const classification = classifyClaudeCliHistoryMessage({
			content: item.content ?? item.text,
			timestamp: item.timestamp,
			cliSessionId: probe.threadId,
			sourceLineNumber: itemIndex + 1
		});
		if (!classification.humanTurn || !isExternalUserText(probe, classification.userText)) continue;
		humanTurns += 1;
		occurredAt = Math.max(occurredAt ?? 0, classification.occurredAt ?? Date.now());
	}
	const activityId = newest.uuid;
	return {
		kind: "activity",
		sessionKey: probe.sessionKey,
		humanTurns,
		nextMarker: { uuid: activityId },
		...humanTurns > 0 ? {
			occurredAt: occurredAt ?? Date.now(),
			dedupeId: activityId
		} : {}
	};
}
async function checkClaudeUpstreamActivity(probes, readRemote) {
	const activities = [];
	for (const probe of probes) try {
		const activity = readFilePath(probe) ? await checkClaudeSessionUpstreamActivity(probe) : readRemote ? await checkRemoteClaudeSessionUpstreamActivity(probe, readRemote) : void 0;
		if (activity) activities.push(activity);
	} catch {}
	return activities;
}
//#endregion
export { linkContinued as n, checkClaudeUpstreamActivity as t };
