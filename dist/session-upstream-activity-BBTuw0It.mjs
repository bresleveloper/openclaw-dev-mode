import { f as asSafeIntegerInRange } from "./number-coercion-CkhMiRw8.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import "./string-coerce-runtime-BbIJhy7G.mjs";
import { n as isExternalUserText } from "./session-catalog-DwvpROmn.mjs";
import { i as classifyClaudeCliHistoryMessage, r as classifyClaudeCliHistoryLine } from "./session-catalog-D8nD7pNy.mjs";
import { i as readSessionCatalogJsonlActivity } from "./session-catalog-runtime-BUQ1pFfL.mjs";
import fs from "node:fs/promises";
//#region extensions/anthropic/session-upstream-activity.ts
async function linkContinued(params) {
	const { sessionKey, hostId, threadId } = params;
	try {
		if (hostId === "gateway:local") {
			const record = (await params.listLocalSessions()).find((candidate) => candidate.threadId === threadId);
			const stat = record ? await fs.stat(record.filePath).catch(() => void 0) : void 0;
			return record && stat?.isFile() ? {
				sessionKey,
				upstream: {
					kind: "claude-cli",
					ref: { filePath: record.filePath },
					marker: { offset: stat.size }
				}
			} : { sessionKey };
		}
		if (!hostId.startsWith("node:")) return { sessionKey };
		const newest = (params.history ?? await params.readRemote())[0];
		if (newest && !newest.uuid) return { sessionKey };
		return {
			sessionKey,
			upstream: {
				kind: "claude-cli",
				ref: {
					nodeId: hostId.slice(5),
					threadId
				},
				marker: { uuid: newest?.uuid ?? null }
			}
		};
	} catch {
		return { sessionKey };
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
	return readSessionCatalogJsonlActivity({
		probe,
		filePath,
		offset: markerOffset,
		classifyLine(line, sourceLineNumber) {
			const classification = classifyClaudeCliHistoryLine({
				line,
				cliSessionId: probe.threadId,
				sourceLineNumber
			});
			return classification.humanTurn ? classification : void 0;
		}
	});
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
