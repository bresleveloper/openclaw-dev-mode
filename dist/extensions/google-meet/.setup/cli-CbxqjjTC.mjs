import { a as resolveGoogleMeetTokenFromParams, c as buildGoogleMeetPreflightReport, d as fetchGoogleMeetSpace, f as fetchLatestGoogleMeetConferenceRecord, i as resolveArtifactQueryFromParams, l as createGoogleMeetSpace, m as listGoogleMeetCalendarEvents, n as fetchResolvedGoogleMeetAttendance, o as resolveMeetingFromParams, p as buildGoogleMeetCalendarDayWindow, s as resolveSpaceFromParams, t as fetchResolvedGoogleMeetArtifacts, u as endGoogleMeetActiveConference } from "./plugin-helpers--7X3icub.mjs";
import { i as resolveGoogleMeetGatewayOperationTimeoutMs } from "./config-C-6enWkx.mjs";
import { buildGoogleMeetAuthUrl, exchangeGoogleMeetAuthCode, resolveGoogleMeetAccessToken, waitForGoogleMeetAuthCode } from "./oauth-22Ey-zCb.mjs";
import { n as hasCreateSpaceConfigInput, r as resolveCreateSpaceConfig } from "./create-CG9Pgwsb.mjs";
import { clampTimerTimeoutMs, parseStrictNonNegativeInteger, parseStrictPositiveInteger } from "openclaw/plugin-sdk/number-runtime";
import { callGatewayFromCli, isGatewayClientRequestError, isGatewayTransportError } from "openclaw/plugin-sdk/gateway-runtime";
import { generateHexPkceVerifierChallenge } from "openclaw/plugin-sdk/provider-auth";
import { generateOAuthState } from "openclaw/plugin-sdk/provider-auth-runtime";
import fsp, { stat } from "node:fs/promises";
import path from "node:path";
import JSZip from "jszip";
import { replaceFileAtomic, writeExternalFileWithinRoot } from "openclaw/plugin-sdk/security-runtime";
import { createInterface } from "node:readline/promises";
import { format } from "node:util";
import { formatDurationCompact } from "openclaw/plugin-sdk/time-runtime";
//#region extensions/google-meet/src/cli-command-context.ts
function addGoogleMeetOAuthOptions(command) {
	return command.option("--access-token <token>", "Access token override").option("--refresh-token <token>", "Refresh token override").option("--client-id <id>", "OAuth client id override").option("--client-secret <secret>", "OAuth client secret override").option("--expires-at <ms>", "Cached access token expiry as unix epoch milliseconds");
}
function addGoogleMeetMeetingOption(command) {
	return command.option("--meeting <value>", "Meet URL, meeting code, or spaces/{id}");
}
function addGoogleMeetCalendarOptions(command) {
	return command.option("--today", "Find a Meet link on today's calendar").option("--event <query>", "Find a matching calendar event with a Meet link").option("--calendar <id>", "Calendar id for --today or --event", "primary");
}
function addGoogleMeetArtifactOptions(command) {
	return addGoogleMeetOAuthOptions(addGoogleMeetCalendarOptions(addGoogleMeetMeetingOption(command).option("--conference-record <name>", "Conference record name or id"))).option("--page-size <n>", "Max resources per Meet API page").option("--all-conference-records", "Fetch every conference record for --meeting");
}
//#endregion
//#region extensions/google-meet/src/cli-shared.ts
const GOOGLE_MEET_GATEWAY_DEFAULT_TIMEOUT_MS = 5e3;
const PLAIN_DECIMAL_NUMBER_RE = /^\d+(?:\.\d+)?$/;
function parseGoogleMeetMode(value) {
	if (value === void 0 || value === "agent" || value === "bidi" || value === "transcribe" || value === "realtime") return value;
	throw new Error(`mode must be agent, bidi, transcribe, or realtime; received ${value}`);
}
function parseGoogleMeetTransport(value) {
	if (value === void 0 || value === "chrome" || value === "chrome-node" || value === "twilio") return value;
	throw new Error(`transport must be chrome, chrome-node, or twilio; received ${value}`);
}
function parseGoogleMeetBrowserTransport(value) {
	const transport = parseGoogleMeetTransport(value);
	if (transport === "twilio") throw new Error(`transport must be chrome or chrome-node; received ${value}`);
	return transport;
}
function writeStdoutJson(value) {
	process.stdout.write(`${JSON.stringify(value, null, 2)}\n`);
}
function isGatewayUnavailableForLocalFallback(err, method) {
	if (isGatewayTransportError(err)) return err.kind === "closed" && err.code === void 0;
	return isGatewayClientRequestError(err) && err.message.includes(`unknown method: ${method}`);
}
function writeStdoutLine(...values) {
	process.stdout.write(`${format(...values)}\n`);
}
async function writeCliOutput(options, text) {
	if (options.output?.trim()) {
		const dirMode = (await stat(path.dirname(options.output))).mode & 4095;
		await replaceFileAtomic({
			filePath: options.output,
			content: text.endsWith("\n") ? text : `${text}\n`,
			dirMode,
			mode: 438 & ~process.umask(),
			preserveExistingMode: true,
			tempPrefix: ".google-meet-output",
			syncTempFile: true,
			syncParentDir: true,
			throwOnCleanupError: true
		});
		writeStdoutLine("wrote: %s", options.output);
		return;
	}
	process.stdout.write(text.endsWith("\n") ? text : `${text}\n`);
}
async function promptInput(message) {
	const rl = createInterface({
		input: process.stdin,
		output: process.stderr
	});
	try {
		return await rl.question(message);
	} finally {
		rl.close();
	}
}
function parseOptionalNumber(value) {
	if (!value?.trim()) return;
	const trimmed = value.trim();
	const parsed = PLAIN_DECIMAL_NUMBER_RE.test(trimmed) ? Number(trimmed) : NaN;
	if (!Number.isFinite(parsed)) throw new Error(`Expected a numeric value, received ${value}`);
	return parsed;
}
function writeSetupStatus(status) {
	writeStdoutLine("Google Meet setup: %s", status.ok ? "OK" : "needs attention");
	for (const check of status.checks) writeStdoutLine("[%s] %s: %s", check.ok ? "ok" : "fail", check.id, check.message);
}
function formatBoolean(value) {
	return typeof value === "boolean" ? value ? "yes" : "no" : "unknown";
}
function formatOptional(value) {
	return typeof value === "string" && value.trim() ? value : "n/a";
}
function parsePositiveNumber(value, label) {
	if (value === void 0) return;
	const trimmed = value.trim();
	const parsed = PLAIN_DECIMAL_NUMBER_RE.test(trimmed) ? Number(trimmed) : NaN;
	if (!Number.isFinite(parsed) || parsed <= 0) throw new Error(`${label} must be a positive number`);
	return parsed;
}
function resolveGoogleMeetGatewayTimeoutMs(timeoutMs) {
	return typeof timeoutMs === "number" && Number.isFinite(timeoutMs) ? clampTimerTimeoutMs(Math.ceil(timeoutMs)) ?? 1 : GOOGLE_MEET_GATEWAY_DEFAULT_TIMEOUT_MS;
}
function resolveGoogleMeetOAuthCallbackTimeoutMs(timeoutSec) {
	return clampTimerTimeoutMs((parsePositiveNumber(timeoutSec, "timeout-sec") ?? 300) * 1e3) ?? 3e5;
}
function parsePositiveIntegerOption(value, label) {
	if (value === void 0) return;
	const parsed = parseStrictPositiveInteger(value);
	if (parsed === void 0) throw new Error(`${label} must be a positive integer`);
	return parsed;
}
async function callGoogleMeetGateway(params) {
	try {
		const timeoutMs = resolveGoogleMeetGatewayTimeoutMs(params.timeoutMs);
		return {
			ok: true,
			payload: await params.callGateway(params.method, {
				json: true,
				timeout: String(timeoutMs)
			}, params.payload, { progress: false })
		};
	} catch (err) {
		if (isGatewayUnavailableForLocalFallback(err, params.method)) return {
			ok: false,
			error: err
		};
		throw err;
	}
}
function formatDuration(value) {
	if (value === void 0) return "n/a";
	const roundedMs = Math.max(0, Math.round(value / 1e3) * 1e3);
	return formatDurationCompact(roundedMs, {
		showYears: true,
		spaced: true
	}) ?? "0ms";
}
function writeDoctorStatus(status) {
	if (!status.found) {
		writeStdoutLine("Google Meet session: not found");
		return;
	}
	const sessions = status.session ? [status.session] : status.sessions ?? [];
	if (sessions.length === 0) {
		writeStdoutLine("Google Meet sessions: none");
		return;
	}
	writeStdoutLine("Google Meet sessions: %d", sessions.length);
	for (const session of sessions) {
		const health = session.chrome?.health;
		writeStdoutLine("");
		writeStdoutLine("session: %s", session.id);
		writeStdoutLine("url: %s", session.url);
		writeStdoutLine("state: %s", session.state);
		writeStdoutLine("transport: %s", session.transport);
		writeStdoutLine("mode: %s", session.mode);
		if (session.twilio) {
			writeStdoutLine("twilio dial-in: %s", session.twilio.dialInNumber);
			writeStdoutLine("voice call id: %s", formatOptional(session.twilio.voiceCallId));
			writeStdoutLine("dtmf sent: %s", formatBoolean(session.twilio.dtmfSent));
			writeStdoutLine("intro sent: %s", formatBoolean(session.twilio.introSent));
		}
		if (!session.chrome) continue;
		writeStdoutLine("node: %s", session.chrome?.nodeId ?? "local/none");
		writeStdoutLine("audio bridge: %s", session.chrome?.audioBridge?.type ?? "none");
		const bridgeProvider = session.chrome?.audioBridge?.provider ?? session.realtime.transcriptionProvider ?? session.realtime.provider ?? "n/a";
		writeStdoutLine(session.mode === "agent" ? "transcription provider: %s" : "provider: %s", bridgeProvider);
		if (session.realtime.enabled) writeStdoutLine("talk-back mode: %s", session.realtime.strategy ?? session.mode);
		writeStdoutLine("in call: %s", formatBoolean(health?.inCall));
		writeStdoutLine("lobby waiting: %s", formatBoolean(health?.lobbyWaiting));
		writeStdoutLine("captioning: %s", formatBoolean(health?.captioning));
		writeStdoutLine("transcript lines: %s", health?.transcriptLines ?? 0);
		writeStdoutLine("last caption: %s", formatOptional(health?.lastCaptionAt));
		writeStdoutLine("manual action: %s", formatBoolean(Boolean(health?.manualAction)));
		if (health?.manualAction) {
			writeStdoutLine("manual reason: %s", formatOptional(health.manualAction.reason));
			writeStdoutLine("manual message: %s", formatOptional(health.manualAction.message));
		}
		writeStdoutLine("speech ready: %s", formatBoolean(health?.speechReady));
		if (health?.speechReady === false) {
			writeStdoutLine("speech blocked reason: %s", formatOptional(health.speechBlockedReason));
			writeStdoutLine("speech blocked message: %s", formatOptional(health.speechBlockedMessage));
		}
		writeStdoutLine("provider connected: %s", formatBoolean(health?.providerConnected));
		writeStdoutLine("realtime ready: %s", formatBoolean(health?.realtimeReady));
		writeStdoutLine("audio input active: %s", formatBoolean(health?.audioInputActive));
		writeStdoutLine("audio output active: %s", formatBoolean(health?.audioOutputActive));
		writeStdoutLine("meet output routed: %s", formatBoolean(health?.audioOutputRouted));
		if (health?.audioOutputDeviceLabel || health?.audioOutputRouteError) {
			writeStdoutLine("meet output device: %s", formatOptional(health.audioOutputDeviceLabel));
			writeStdoutLine("meet output route error: %s", formatOptional(health.audioOutputRouteError));
		}
		writeStdoutLine("last input: %s (%s bytes)", formatOptional(health?.lastInputAt), health?.lastInputBytes ?? 0);
		writeStdoutLine("last output: %s (%s bytes)", formatOptional(health?.lastOutputAt), health?.lastOutputBytes ?? 0);
		writeStdoutLine("bridge closed: %s", formatBoolean(health?.bridgeClosed));
		writeStdoutLine("browser url: %s", formatOptional(health?.browserUrl));
		if (health?.lastCaptionText) writeStdoutLine("last caption text: %s%s", health.lastCaptionSpeaker ? `${health.lastCaptionSpeaker}: ` : "", health.lastCaptionText);
		writeStdoutLine("realtime transcript lines: %s", health?.realtimeTranscriptLines ?? 0);
		if (health?.lastRealtimeTranscriptText) writeStdoutLine("last realtime transcript: %s%s", health.lastRealtimeTranscriptRole ? `${health.lastRealtimeTranscriptRole}: ` : "", health.lastRealtimeTranscriptText);
		if (health?.lastRealtimeEventType) {
			const detail = health.lastRealtimeEventDetail ? ` ${health.lastRealtimeEventDetail}` : "";
			writeStdoutLine("last realtime event: %s%s", health.lastRealtimeEventType, detail);
		}
	}
}
function writeRecoverCurrentTabResult(result) {
	writeStdoutLine("Google Meet current tab: %s", result.found ? "found" : "not found");
	writeStdoutLine("transport: %s", result.transport);
	writeStdoutLine("node: %s", result.nodeId ?? "local/none");
	if (result.targetId) writeStdoutLine("target: %s", result.targetId);
	if (result.tab?.url) writeStdoutLine("tab url: %s", result.tab.url);
	writeStdoutLine("message: %s", result.message);
	if (result.browser) writeDoctorStatus({
		found: true,
		session: {
			id: "current-tab",
			url: result.browser.browserUrl ?? result.tab?.url ?? "unknown",
			transport: result.transport,
			mode: "transcribe",
			agentId: "main",
			state: "active",
			createdAt: "",
			updatedAt: "",
			participantIdentity: result.transport === "chrome-node" ? "signed-in Google Chrome profile on a paired node" : "signed-in Google Chrome profile",
			realtime: {
				enabled: false,
				toolPolicy: "safe-read-only"
			},
			chrome: {
				launched: true,
				nodeId: result.nodeId,
				health: result.browser
			},
			notes: []
		}
	});
}
function writeLeaveResult(sessionId, result) {
	if (result.browserLeft === false) {
		writeStdoutLine("left %s, but the browser participant may still be in the call; check session notes", sessionId);
		return;
	}
	writeStdoutLine("left %s", sessionId);
}
//#endregion
//#region extensions/google-meet/src/cli-export.ts
function renderArtifactsSummary(result) {
	const lines = [];
	if (result.input) lines.push(`input: ${result.input}`);
	if (result.space) lines.push(`space: ${result.space.name}`);
	lines.push(`conference records: ${result.conferenceRecords.length}`);
	for (const entry of result.artifacts) {
		lines.push("");
		lines.push(`record: ${entry.conferenceRecord.name}`);
		lines.push(`started: ${formatOptional(entry.conferenceRecord.startTime)}`);
		lines.push(`ended: ${formatOptional(entry.conferenceRecord.endTime)}`);
		lines.push(`participants: ${entry.participants.length}`);
		lines.push(`recordings: ${entry.recordings.length}`);
		lines.push(`transcripts: ${entry.transcripts.length}`);
		lines.push(`transcript entries: ${entry.transcriptEntries.reduce((count, transcript) => count + transcript.entries.length, 0)}`);
		lines.push(`smart notes: ${entry.smartNotes.length}`);
		if (entry.smartNotesError) lines.push(`smart notes warning: ${entry.smartNotesError}`);
		for (const recording of entry.recordings) lines.push(`- recording: ${recording.name}`);
		for (const transcript of entry.transcripts) {
			lines.push(`- transcript: ${transcript.name}`);
			if (transcript.documentTextError) lines.push(`- transcript document body warning: ${transcript.documentTextError}`);
		}
		for (const transcriptEntries of entry.transcriptEntries) if (transcriptEntries.entriesError) lines.push(`- transcript entries warning: ${transcriptEntries.transcript}: ${transcriptEntries.entriesError}`);
		for (const smartNote of entry.smartNotes) {
			lines.push(`- smart note: ${smartNote.name}`);
			if (smartNote.documentTextError) lines.push(`- smart note document body warning: ${smartNote.documentTextError}`);
		}
	}
	return `${lines.join("\n")}\n`;
}
function renderAttendanceSummary(result) {
	const lines = [];
	if (result.input) lines.push(`input: ${result.input}`);
	if (result.space) lines.push(`space: ${result.space.name}`);
	lines.push(`conference records: ${result.conferenceRecords.length}`);
	lines.push(`attendance rows: ${result.attendance.length}`);
	for (const row of result.attendance) {
		const identity = row.displayName || row.user || row.participant;
		lines.push("");
		lines.push(`participant: ${identity}`);
		lines.push(`record: ${row.conferenceRecord}`);
		lines.push(`resource: ${row.participant}`);
		lines.push(`participants merged: ${row.participants?.length ?? 1}`);
		lines.push(`first joined: ${formatOptional(row.firstJoinTime ?? row.earliestStartTime)}`);
		lines.push(`last left: ${formatOptional(row.lastLeaveTime ?? row.latestEndTime)}`);
		lines.push(`duration: ${formatDuration(row.durationMs)}`);
		lines.push(`late: ${row.late ? formatDuration(row.lateByMs) : "no"}`);
		lines.push(`early leave: ${row.earlyLeave ? formatDuration(row.earlyLeaveByMs) : "no"}`);
		lines.push(`sessions: ${row.sessions.length}`);
		for (const session of row.sessions) lines.push(`- ${session.name}: ${formatOptional(session.startTime)} -> ${formatOptional(session.endTime)}`);
	}
	return `${lines.join("\n")}\n`;
}
function writeLatestConferenceRecordSummary(result) {
	writeStdoutLine("input: %s", result.input);
	writeStdoutLine("space: %s", result.space.name);
	if (!result.conferenceRecord) {
		writeStdoutLine("conference record: none");
		return;
	}
	writeStdoutLine("conference record: %s", result.conferenceRecord.name);
	writeStdoutLine("started: %s", formatOptional(result.conferenceRecord.startTime));
	writeStdoutLine("ended: %s", formatOptional(result.conferenceRecord.endTime));
}
function writeCalendarEventsSummary(result) {
	writeStdoutLine("calendar: %s", result.calendarId);
	writeStdoutLine("meet events: %d", result.events.length);
	for (const entry of result.events) {
		writeStdoutLine("");
		writeStdoutLine("%s%s", entry.selected ? "* " : "- ", entry.event.summary ?? "untitled");
		writeStdoutLine("meeting uri: %s", entry.meetingUri);
		writeStdoutLine("starts: %s", formatOptional(entry.event.start?.dateTime ?? entry.event.start?.date));
		writeStdoutLine("ends: %s", formatOptional(entry.event.end?.dateTime ?? entry.event.end?.date));
	}
}
function pushMarkdownLine(lines, text = "") {
	lines.push(text);
}
function formatMarkdownOptional(value) {
	return typeof value === "string" && value.trim() ? value : "n/a";
}
function formatMarkdownIdentity(row) {
	return row.displayName || row.user || row.participant;
}
function participantDisplayName(entry, name) {
	const participant = entry.participants.find((candidate) => candidate.name === name);
	if (!participant) return name;
	return participant.signedinUser?.displayName ?? participant.anonymousUser?.displayName ?? participant.phoneUser?.displayName ?? participant.signedinUser?.user ?? name;
}
function renderArtifactsMarkdown(result) {
	const lines = ["# Google Meet Artifacts"];
	if (result.input) pushMarkdownLine(lines, `Input: ${result.input}`);
	if (result.space) pushMarkdownLine(lines, `Space: ${result.space.name}`);
	pushMarkdownLine(lines);
	pushMarkdownLine(lines, `Conference records: ${result.conferenceRecords.length}`);
	for (const entry of result.artifacts) {
		pushMarkdownLine(lines);
		pushMarkdownLine(lines, `## ${entry.conferenceRecord.name}`);
		pushMarkdownLine(lines, `Started: ${formatMarkdownOptional(entry.conferenceRecord.startTime)}`);
		pushMarkdownLine(lines, `Ended: ${formatMarkdownOptional(entry.conferenceRecord.endTime)}`);
		pushMarkdownLine(lines);
		pushMarkdownLine(lines, `Participants: ${entry.participants.length}`);
		pushMarkdownLine(lines, `Recordings: ${entry.recordings.length}`);
		pushMarkdownLine(lines, `Transcripts: ${entry.transcripts.length}`);
		pushMarkdownLine(lines, `Transcript entries: ${entry.transcriptEntries.reduce((count, transcript) => count + transcript.entries.length, 0)}`);
		pushMarkdownLine(lines, `Smart notes: ${entry.smartNotes.length}`);
		const warnings = collectGoogleMeetArtifactWarnings({
			conferenceRecords: [entry.conferenceRecord],
			artifacts: [entry]
		});
		if (warnings.length > 0) {
			pushMarkdownLine(lines);
			pushMarkdownLine(lines, "### Warnings");
			for (const warning of warnings) pushMarkdownLine(lines, `- ${warning.resource ? `${warning.resource}: ` : ""}${warning.message}`);
		}
		if (entry.recordings.length > 0) {
			pushMarkdownLine(lines);
			pushMarkdownLine(lines, "### Recordings");
			for (const recording of entry.recordings) pushMarkdownLine(lines, `- ${recording.name}`);
		}
		if (entry.transcripts.length > 0) {
			pushMarkdownLine(lines);
			pushMarkdownLine(lines, "### Transcripts");
			for (const transcript of entry.transcripts) {
				pushMarkdownLine(lines, `- ${transcript.name}`);
				if (transcript.documentTextError) pushMarkdownLine(lines, `  - Document body warning: ${transcript.documentTextError}`);
				else if (transcript.documentText) pushMarkdownLine(lines, `  - Document body: ${transcript.documentText.length} chars`);
			}
		}
		for (const transcriptEntries of entry.transcriptEntries) {
			pushMarkdownLine(lines);
			pushMarkdownLine(lines, `### Transcript Entries: ${transcriptEntries.transcript}`);
			if (transcriptEntries.entriesError) {
				pushMarkdownLine(lines, `Warning: ${transcriptEntries.entriesError}`);
				continue;
			}
			if (transcriptEntries.entries.length === 0) {
				pushMarkdownLine(lines, "_No transcript entries._");
				continue;
			}
			for (const transcriptEntry of transcriptEntries.entries) {
				const times = transcriptEntry.startTime || transcriptEntry.endTime ? ` (${formatMarkdownOptional(transcriptEntry.startTime)} -> ${formatMarkdownOptional(transcriptEntry.endTime)})` : "";
				pushMarkdownLine(lines, `- ${transcriptEntry.participant ? `${participantDisplayName(entry, transcriptEntry.participant)}: ` : ""}${transcriptEntry.text ?? ""}${times}`);
			}
		}
		if (entry.smartNotes.length > 0) {
			pushMarkdownLine(lines);
			pushMarkdownLine(lines, "### Smart Notes");
			for (const smartNote of entry.smartNotes) {
				pushMarkdownLine(lines, `- ${smartNote.name}`);
				if (smartNote.documentTextError) pushMarkdownLine(lines, `  - Document body warning: ${smartNote.documentTextError}`);
				else if (smartNote.documentText) pushMarkdownLine(lines, `  - Document body: ${smartNote.documentText.length} chars`);
			}
		}
	}
	return `${lines.join("\n")}\n`;
}
function renderAttendanceMarkdown(result) {
	const lines = ["# Google Meet Attendance"];
	if (result.input) pushMarkdownLine(lines, `Input: ${result.input}`);
	if (result.space) pushMarkdownLine(lines, `Space: ${result.space.name}`);
	pushMarkdownLine(lines);
	pushMarkdownLine(lines, `Conference records: ${result.conferenceRecords.length}`);
	pushMarkdownLine(lines, `Attendance rows: ${result.attendance.length}`);
	for (const row of result.attendance) {
		pushMarkdownLine(lines);
		pushMarkdownLine(lines, `## ${formatMarkdownIdentity(row)}`);
		pushMarkdownLine(lines, `Record: ${row.conferenceRecord}`);
		pushMarkdownLine(lines, `Resource: ${row.participant}`);
		pushMarkdownLine(lines, `Participants merged: ${row.participants?.length ?? 1}`);
		pushMarkdownLine(lines, `First joined: ${formatMarkdownOptional(row.firstJoinTime ?? row.earliestStartTime)}`);
		pushMarkdownLine(lines, `Last left: ${formatMarkdownOptional(row.lastLeaveTime ?? row.latestEndTime)}`);
		pushMarkdownLine(lines, `Duration: ${formatDuration(row.durationMs)}`);
		pushMarkdownLine(lines, `Late: ${row.late ? formatDuration(row.lateByMs) : "no"}`);
		pushMarkdownLine(lines, `Early leave: ${row.earlyLeave ? formatDuration(row.earlyLeaveByMs) : "no"}`);
		pushMarkdownLine(lines, `Sessions: ${row.sessions.length}`);
		for (const session of row.sessions) pushMarkdownLine(lines, `- ${session.name}: ${formatMarkdownOptional(session.startTime)} -> ${formatMarkdownOptional(session.endTime)}`);
	}
	return `${lines.join("\n")}\n`;
}
function neutralizeSpreadsheetFormulaCell(text) {
	return /^[ \t\r\n]*[=+\-@\uFF0B\uFF0D\uFF1D\uFF20]/u.test(text) || /^[\t\r\n]/.test(text) ? `'${text}` : text;
}
function csvCell(value) {
	const safeText = neutralizeSpreadsheetFormulaCell(value === void 0 || value === null ? "" : typeof value === "string" || typeof value === "number" || typeof value === "boolean" ? String(value) : JSON.stringify(value));
	return /[",\r\n]/.test(safeText) ? `"${safeText.replaceAll("\"", "\"\"")}"` : safeText;
}
function renderAttendanceCsv(result) {
	const rows = [[
		"conferenceRecord",
		"displayName",
		"user",
		"participants",
		"firstJoined",
		"lastLeft",
		"durationMs",
		"sessions",
		"late",
		"lateByMs",
		"earlyLeave",
		"earlyLeaveByMs"
	]];
	for (const row of result.attendance) rows.push([
		row.conferenceRecord,
		row.displayName ?? "",
		row.user ?? "",
		(row.participants ?? [row.participant]).join(";"),
		row.firstJoinTime ?? row.earliestStartTime ?? "",
		row.lastLeaveTime ?? row.latestEndTime ?? "",
		row.durationMs ?? "",
		row.sessions.length,
		row.late ?? "",
		row.lateByMs ?? "",
		row.earlyLeave ?? "",
		row.earlyLeaveByMs ?? ""
	]);
	return `${rows.map((row) => row.map(csvCell).join(",")).join("\n")}\n`;
}
function renderTranscriptMarkdown(result) {
	const lines = ["# Google Meet Transcript"];
	if (result.input) pushMarkdownLine(lines, `Input: ${result.input}`);
	for (const entry of result.artifacts) {
		pushMarkdownLine(lines);
		pushMarkdownLine(lines, `## ${entry.conferenceRecord.name}`);
		if (entry.transcriptEntries.length === 0) {
			pushMarkdownLine(lines, "_No transcript entries._");
			continue;
		}
		for (const transcriptEntries of entry.transcriptEntries) {
			pushMarkdownLine(lines);
			pushMarkdownLine(lines, `### ${transcriptEntries.transcript}`);
			if (transcriptEntries.entriesError) {
				pushMarkdownLine(lines, `Warning: ${transcriptEntries.entriesError}`);
				continue;
			}
			for (const transcriptEntry of transcriptEntries.entries) pushMarkdownLine(lines, `- ${transcriptEntry.participant ? participantDisplayName(entry, transcriptEntry.participant) : "unknown"}${transcriptEntry.startTime ? ` [${transcriptEntry.startTime}]` : ""}: ${transcriptEntry.text ?? ""}`);
		}
		const docsTranscripts = entry.transcripts.filter((transcript) => transcript.documentText);
		if (docsTranscripts.length > 0) {
			pushMarkdownLine(lines);
			pushMarkdownLine(lines, "### Transcript Document Bodies");
			for (const transcript of docsTranscripts) {
				pushMarkdownLine(lines);
				pushMarkdownLine(lines, `#### ${transcript.name}`);
				pushMarkdownLine(lines, transcript.documentText?.trim() || "_Empty document body._");
			}
		}
		const smartNotes = entry.smartNotes.filter((smartNote) => smartNote.documentText);
		if (smartNotes.length > 0) {
			pushMarkdownLine(lines);
			pushMarkdownLine(lines, "### Smart Note Document Bodies");
			for (const smartNote of smartNotes) {
				pushMarkdownLine(lines);
				pushMarkdownLine(lines, `#### ${smartNote.name}`);
				pushMarkdownLine(lines, smartNote.documentText?.trim() || "_Empty document body._");
			}
		}
	}
	return `${lines.join("\n")}\n`;
}
function collectGoogleMeetArtifactWarnings(result) {
	const warnings = [];
	for (const entry of result.artifacts) {
		const conferenceRecord = entry.conferenceRecord.name;
		if (entry.smartNotesError) warnings.push({
			type: "smart_notes",
			conferenceRecord,
			message: entry.smartNotesError
		});
		for (const transcriptEntries of entry.transcriptEntries) if (transcriptEntries.entriesError) warnings.push({
			type: "transcript_entries",
			conferenceRecord,
			resource: transcriptEntries.transcript,
			message: transcriptEntries.entriesError
		});
		for (const transcript of entry.transcripts) if (transcript.documentTextError) warnings.push({
			type: "transcript_document_body",
			conferenceRecord,
			resource: transcript.name,
			message: transcript.documentTextError
		});
		for (const smartNote of entry.smartNotes) if (smartNote.documentTextError) warnings.push({
			type: "smart_note_document_body",
			conferenceRecord,
			resource: smartNote.name,
			message: smartNote.documentTextError
		});
	}
	return warnings;
}
function buildGoogleMeetExportManifest(params) {
	const transcriptEntryCount = params.artifacts.artifacts.reduce((count, entry) => count + entry.transcriptEntries.reduce((entryCount, transcript) => entryCount + transcript.entries.length, 0), 0);
	const warnings = collectGoogleMeetArtifactWarnings(params.artifacts);
	return {
		generatedAt: (/* @__PURE__ */ new Date()).toISOString(),
		...params.request ? { request: params.request } : {},
		...params.tokenSource ? { tokenSource: params.tokenSource } : {},
		...params.calendarEvent ? { calendarEvent: params.calendarEvent } : {},
		inputs: {
			...params.artifacts.input ? { artifacts: params.artifacts.input } : {},
			...params.attendance.input ? { attendance: params.attendance.input } : {}
		},
		counts: {
			conferenceRecords: params.artifacts.conferenceRecords.length,
			artifacts: params.artifacts.artifacts.length,
			attendanceRows: params.attendance.attendance.length,
			recordings: params.artifacts.artifacts.reduce((count, entry) => count + entry.recordings.length, 0),
			transcripts: params.artifacts.artifacts.reduce((count, entry) => count + entry.transcripts.length, 0),
			transcriptEntries: transcriptEntryCount,
			smartNotes: params.artifacts.artifacts.reduce((count, entry) => count + entry.smartNotes.length, 0),
			warnings: warnings.length
		},
		conferenceRecords: params.artifacts.conferenceRecords.map((record) => record.name),
		files: params.files,
		...params.zipFile ? { zipFile: params.zipFile } : {},
		warnings
	};
}
function googleMeetExportFileNames() {
	return [
		"summary.md",
		"attendance.csv",
		"transcript.md",
		"artifacts.json",
		"attendance.json",
		"manifest.json"
	];
}
function defaultExportDirectory() {
	return `google-meet-export-${(/* @__PURE__ */ new Date()).toISOString().replace(/[:.]/g, "-")}`;
}
async function publishMeetExportFile(outputPath, content) {
	const absolutePath = path.resolve(outputPath);
	await writeExternalFileWithinRoot({
		rootDir: path.dirname(absolutePath),
		path: path.basename(absolutePath),
		write: async (tempPath) => {
			await fsp.writeFile(tempPath, content);
		}
	});
}
async function writeMeetExportBundle(params) {
	const outputDir = params.outputDir?.trim() || defaultExportDirectory();
	await fsp.mkdir(outputDir, { recursive: true });
	let zipOutputDir = outputDir;
	if (params.zip) {
		const resolvedOutputDir = path.resolve(outputDir);
		if (resolvedOutputDir !== path.parse(resolvedOutputDir).root) zipOutputDir = outputDir.replace(path.sep === "\\" ? /[\\/]+$/ : /\/+$/, "");
	}
	const zipFile = params.zip ? `${zipOutputDir.replace(/\/$/, "")}.zip` : void 0;
	const fileNames = googleMeetExportFileNames();
	const files = [
		{
			name: "summary.md",
			content: `${renderArtifactsMarkdown(params.artifacts)}\n${renderAttendanceMarkdown(params.attendance)}`
		},
		{
			name: "attendance.csv",
			content: renderAttendanceCsv(params.attendance)
		},
		{
			name: "transcript.md",
			content: renderTranscriptMarkdown(params.artifacts)
		},
		{
			name: "artifacts.json",
			content: `${JSON.stringify(params.artifacts, null, 2)}\n`
		},
		{
			name: "attendance.json",
			content: `${JSON.stringify(params.attendance, null, 2)}\n`
		},
		{
			name: "manifest.json",
			content: `${JSON.stringify(buildGoogleMeetExportManifest({
				artifacts: params.artifacts,
				attendance: params.attendance,
				files: fileNames,
				...params.request ? { request: params.request } : {},
				...params.tokenSource ? { tokenSource: params.tokenSource } : {},
				...params.calendarEvent ? { calendarEvent: params.calendarEvent } : {},
				...zipFile ? { zipFile } : {}
			}), null, 2)}\n`
		}
	];
	for (const file of files) await publishMeetExportFile(path.join(outputDir, file.name), file.content);
	const result = {
		outputDir,
		files: files.map((file) => path.join(outputDir, file.name))
	};
	if (zipFile) {
		const zip = new JSZip();
		for (const file of files) zip.file(file.name, file.content);
		await publishMeetExportFile(zipFile, await zip.generateAsync({ type: "nodebuffer" }));
		result.zipFile = zipFile;
	}
	return result;
}
//#endregion
//#region extensions/google-meet/src/cli-artifact-commands.ts
async function resolveCliArtifactQuery(context, options) {
	const { lateAfterMinutes, earlyBeforeMinutes, ...raw } = context.resolveCliArtifactParams(options);
	return {
		...await resolveArtifactQueryFromParams(context.config, raw),
		lateAfterMinutes,
		earlyBeforeMinutes
	};
}
function resolveTokenSource(refreshed) {
	return refreshed ? "refresh-token" : "cached-access-token";
}
function registerGoogleMeetArtifactCommands(context) {
	const params = context;
	const { root } = context;
	addGoogleMeetArtifactOptions(root.command("artifacts").description("List Meet conference records and available participant/artifact metadata")).option("--no-transcript-entries", "Skip structured transcript entry lookup").option("--include-doc-bodies", "Export linked transcript and smart-note Google Docs text").option("--format <format>", "Output format: summary or markdown", "summary").option("--output <path>", "Write output to a file instead of stdout").option("--json", "Print JSON output", false).action(async (options) => {
		const resolved = await resolveCliArtifactQuery(params, options);
		const result = await fetchResolvedGoogleMeetArtifacts(resolved);
		const tokenSource = resolveTokenSource(resolved.token.refreshed);
		let text;
		if (options.json) text = JSON.stringify({
			...result,
			tokenSource
		}, null, 2);
		else if (options.format === "markdown") text = renderArtifactsMarkdown(result);
		else if (!options.format || options.format === "summary") text = `${renderArtifactsSummary(result)}token source: ${tokenSource}\n`;
		else throw new Error("Unsupported format. Expected summary or markdown.");
		await writeCliOutput(options, text);
	});
	addGoogleMeetArtifactOptions(root.command("attendance").description("List Meet participants and participant sessions")).option("--no-merge-duplicates", "Keep duplicate participant resources as separate rows").option("--late-after-minutes <n>", "Mark participants late after this many minutes", "5").option("--early-before-minutes <n>", "Mark early leavers before this many minutes", "5").option("--format <format>", "Output format: summary, markdown, or csv", "summary").option("--output <path>", "Write output to a file instead of stdout").option("--json", "Print JSON output", false).action(async (options) => {
		const resolved = await resolveCliArtifactQuery(params, options);
		const result = await fetchResolvedGoogleMeetAttendance(resolved);
		const tokenSource = resolveTokenSource(resolved.token.refreshed);
		let text;
		if (options.json) text = JSON.stringify({
			...result,
			tokenSource
		}, null, 2);
		else if (options.format === "markdown") text = renderAttendanceMarkdown(result);
		else if (options.format === "csv") text = renderAttendanceCsv(result);
		else if (!options.format || options.format === "summary") text = `${renderAttendanceSummary(result)}token source: ${tokenSource}\n`;
		else throw new Error("Unsupported format. Expected summary, markdown, or csv.");
		await writeCliOutput(options, text);
	});
	addGoogleMeetArtifactOptions(root.command("export").description("Write Meet artifacts, attendance, transcript, and raw JSON into a folder")).option("--no-transcript-entries", "Skip structured transcript entry lookup").option("--include-doc-bodies", "Export linked transcript and smart-note Google Docs text").option("--no-merge-duplicates", "Keep duplicate participant resources as separate rows").option("--late-after-minutes <n>", "Mark participants late after this many minutes", "5").option("--early-before-minutes <n>", "Mark early leavers before this many minutes", "5").option("--output <dir>", "Output directory").option("--zip", "Also write a portable .zip archive").option("--dry-run", "Fetch export data and print the manifest without writing files", false).option("--json", "Print JSON output", false).action(async (options) => {
		const resolved = await resolveCliArtifactQuery(params, options);
		const artifacts = await fetchResolvedGoogleMeetArtifacts(resolved);
		const attendance = await fetchResolvedGoogleMeetAttendance(resolved);
		const request = {
			...resolved.meeting ? { meeting: resolved.meeting } : {},
			...resolved.conferenceRecord ? { conferenceRecord: resolved.conferenceRecord } : {},
			...resolved.calendarEvent?.event.id ? { calendarEventId: resolved.calendarEvent.event.id } : {},
			...resolved.calendarEvent?.event.summary ? { calendarEventSummary: resolved.calendarEvent.event.summary } : {},
			...options.calendar ? { calendarId: options.calendar } : {},
			...resolved.pageSize !== void 0 ? { pageSize: resolved.pageSize } : {},
			includeTranscriptEntries: resolved.includeTranscriptEntries,
			includeDocumentBodies: resolved.includeDocumentBodies,
			allConferenceRecords: resolved.allConferenceRecords,
			mergeDuplicateParticipants: resolved.mergeDuplicateParticipants,
			...resolved.lateAfterMinutes !== void 0 ? { lateAfterMinutes: resolved.lateAfterMinutes } : {},
			...resolved.earlyBeforeMinutes !== void 0 ? { earlyBeforeMinutes: resolved.earlyBeforeMinutes } : {}
		};
		if (options.dryRun) {
			writeStdoutJson({
				dryRun: true,
				manifest: buildGoogleMeetExportManifest({
					artifacts,
					attendance,
					files: googleMeetExportFileNames(),
					request,
					tokenSource: resolveTokenSource(resolved.token.refreshed),
					...resolved.calendarEvent ? { calendarEvent: resolved.calendarEvent } : {}
				}),
				...resolved.calendarEvent ? { calendarEvent: resolved.calendarEvent } : {},
				tokenSource: resolveTokenSource(resolved.token.refreshed)
			});
			return;
		}
		const bundle = await writeMeetExportBundle({
			outputDir: options.output,
			artifacts,
			attendance,
			zip: Boolean(options.zip),
			request,
			tokenSource: resolveTokenSource(resolved.token.refreshed),
			...resolved.calendarEvent ? { calendarEvent: resolved.calendarEvent } : {}
		});
		const payload = {
			...bundle,
			...resolved.calendarEvent ? { calendarEvent: resolved.calendarEvent } : {},
			tokenSource: resolveTokenSource(resolved.token.refreshed)
		};
		if (options.json) {
			writeStdoutJson(payload);
			return;
		}
		writeStdoutLine("export: %s", bundle.outputDir);
		for (const file of bundle.files) writeStdoutLine("- %s", file);
		if (bundle.zipFile) writeStdoutLine("zip: %s", bundle.zipFile);
	});
}
//#endregion
//#region extensions/google-meet/src/cli-doctor.ts
function sanitizeOAuthErrorMessage(error) {
	return (error instanceof Error ? error.message : String(error)).replace(/(access_token["'=:\s]+)[^"',\s&]+/gi, "$1[redacted]").replace(/(refresh_token["'=:\s]+)[^"',\s&]+/gi, "$1[redacted]").replace(/(client_secret["'=:\s]+)[^"',\s&]+/gi, "$1[redacted]");
}
async function buildOAuthDoctorReport(config, options) {
	const clientId = options.clientId?.trim() || config.oauth.clientId;
	const clientSecret = options.clientSecret?.trim() || config.oauth.clientSecret;
	const refreshToken = options.refreshToken?.trim() || config.oauth.refreshToken;
	const accessToken = options.accessToken?.trim() || config.oauth.accessToken;
	const expiresAt = parseOptionalNumber(options.expiresAt) ?? config.oauth.expiresAt;
	const checks = [];
	const hasRefreshConfig = Boolean(clientId && refreshToken);
	if (!hasRefreshConfig && !Boolean(accessToken)) {
		checks.push({
			id: "oauth-config",
			ok: false,
			message: "Missing Google Meet OAuth credentials. Configure oauth.clientId and oauth.refreshToken, or pass --client-id and --refresh-token."
		});
		return {
			ok: false,
			configured: false,
			checks
		};
	}
	checks.push({
		id: "oauth-config",
		ok: true,
		message: hasRefreshConfig ? "Google Meet OAuth refresh credentials are configured" : "Google Meet cached access token is configured"
	});
	let token;
	try {
		token = await resolveGoogleMeetAccessToken({
			clientId,
			clientSecret,
			refreshToken,
			accessToken,
			expiresAt
		});
		checks.push({
			id: "oauth-token",
			ok: true,
			message: token.refreshed ? "Refresh token minted an access token" : "Cached access token is still valid"
		});
	} catch (error) {
		checks.push({
			id: "oauth-token",
			ok: false,
			message: sanitizeOAuthErrorMessage(error)
		});
		return {
			ok: false,
			configured: true,
			checks
		};
	}
	const report = {
		ok: true,
		configured: true,
		tokenSource: token.refreshed ? "refresh-token" : "cached-access-token",
		expiresAt: token.expiresAt,
		checks
	};
	const meeting = options.meeting?.trim();
	if (meeting) try {
		const space = await fetchGoogleMeetSpace({
			accessToken: token.accessToken,
			meeting
		});
		checks.push({
			id: "meet-spaces-get",
			ok: true,
			message: `Resolved ${space.name}`
		});
		report.meetingUri = space.meetingUri;
	} catch (error) {
		checks.push({
			id: "meet-spaces-get",
			ok: false,
			message: sanitizeOAuthErrorMessage(error)
		});
	}
	if (options.createSpace) try {
		const created = await createGoogleMeetSpace({ accessToken: token.accessToken });
		checks.push({
			id: "meet-spaces-create",
			ok: true,
			message: `Created ${created.space.name}`
		});
		report.createdSpace = created.space.name;
		report.meetingUri = created.meetingUri;
	} catch (error) {
		checks.push({
			id: "meet-spaces-create",
			ok: false,
			message: sanitizeOAuthErrorMessage(error)
		});
	}
	report.ok = checks.every((check) => check.ok);
	return report;
}
function writeOAuthDoctorReport(report) {
	writeStdoutLine("Google Meet OAuth: %s", report.ok ? "OK" : "needs attention");
	writeStdoutLine("configured: %s", report.configured ? "yes" : "no");
	if (report.tokenSource) writeStdoutLine("token source: %s", report.tokenSource);
	if (report.meetingUri) writeStdoutLine("meeting uri: %s", report.meetingUri);
	for (const check of report.checks) writeStdoutLine("[%s] %s: %s", check.ok ? "ok" : "fail", check.id, check.message);
}
function registerGoogleMeetDoctorCommand(context) {
	const params = context;
	const { root, callGateway } = context;
	root.command("doctor").description("Show human-readable Meet session/browser/realtime health").argument("[session-id]", "Meet session ID").option("--oauth", "Verify Google Meet OAuth token refresh without printing secrets", false).option("--meeting <value>", "Also verify spaces.get for a Meet URL, code, or spaces/{id}").option("--create-space", "Also verify spaces.create by creating a throwaway Meet space", false).option("--access-token <token>", "Access token override").option("--refresh-token <token>", "Refresh token override").option("--client-id <id>", "OAuth client id override").option("--client-secret <secret>", "OAuth client secret override").option("--expires-at <ms>", "Cached access token expiry as unix epoch milliseconds").option("--json", "Print JSON output", false).action(async (sessionId, options) => {
		if (options.oauth) {
			const report = await buildOAuthDoctorReport(params.config, options);
			if (options.json) {
				writeStdoutJson(report);
				return;
			}
			writeOAuthDoctorReport(report);
			return;
		}
		const delegated = await callGoogleMeetGateway({
			callGateway,
			method: "googlemeet.status",
			payload: { sessionId }
		});
		if (delegated.ok) {
			const status = delegated.payload;
			if (options.json) {
				writeStdoutJson(status);
				return;
			}
			writeDoctorStatus(status);
			return;
		}
		const status = await (await params.ensureRuntime()).status(sessionId);
		if (options.json) {
			writeStdoutJson(status);
			return;
		}
		writeDoctorStatus(status);
	});
}
//#endregion
//#region extensions/google-meet/src/cli-runtime-commands.ts
function registerGoogleMeetProbeCommands(context) {
	const params = context;
	const { root, callGateway, operationTimeoutMs, resolveMeetingInput } = context;
	root.command("join").argument("[url]", "Explicit https://meet.google.com/... URL").option("--transport <transport>", "Transport: chrome, chrome-node, or twilio").option("--mode <mode>", "Mode: agent, bidi, or transcribe").option("--message <text>", "Realtime speech to trigger after join").option("--dial-in-number <phone>", "Meet dial-in number for Twilio transport").option("--pin <pin>", "Meet phone PIN; # is appended if omitted").option("--dtmf-sequence <sequence>", "Explicit Twilio DTMF sequence").action(async (url, options) => {
		const payload = {
			url: resolveMeetingInput(params.config, url),
			transport: parseGoogleMeetTransport(options.transport),
			mode: parseGoogleMeetMode(options.mode),
			message: options.message,
			dialInNumber: options.dialInNumber,
			pin: options.pin,
			dtmfSequence: options.dtmfSequence
		};
		const delegated = await callGoogleMeetGateway({
			callGateway,
			method: "googlemeet.join",
			payload,
			timeoutMs: operationTimeoutMs
		});
		if (delegated.ok) {
			const result = delegated.payload;
			writeStdoutJson(result.session ?? delegated.payload);
			return;
		}
		writeStdoutJson((await (await params.ensureRuntime()).join(payload)).session);
	});
	root.command("test-speech").argument("[url]", "Explicit https://meet.google.com/... URL").option("--transport <transport>", "Transport: chrome, chrome-node, or twilio").option("--mode <mode>", "Mode: agent, bidi, or transcribe").option("--message <text>", "Realtime speech to trigger", "Say exactly: Google Meet speech test complete.").action(async (url, options) => {
		const payload = {
			url: resolveMeetingInput(params.config, url),
			transport: parseGoogleMeetTransport(options.transport),
			mode: parseGoogleMeetMode(options.mode),
			message: options.message
		};
		const delegated = await callGoogleMeetGateway({
			callGateway,
			method: "googlemeet.testSpeech",
			payload,
			timeoutMs: operationTimeoutMs
		});
		if (delegated.ok) {
			writeStdoutJson(delegated.payload);
			return;
		}
		writeStdoutJson(await (await params.ensureRuntime()).testSpeech(payload));
	});
	root.command("test-listen").argument("[url]", "Explicit https://meet.google.com/... URL").option("--transport <transport>", "Transport: chrome or chrome-node").option("--timeout-ms <ms>", "How long to wait for fresh captions/transcript movement").action(async (url, options) => {
		const payload = {
			url: resolveMeetingInput(params.config, url),
			transport: parseGoogleMeetBrowserTransport(options.transport),
			timeoutMs: parsePositiveNumber(options.timeoutMs, "timeout-ms")
		};
		const delegated = await callGoogleMeetGateway({
			callGateway,
			method: "googlemeet.testListen",
			payload,
			timeoutMs: operationTimeoutMs
		});
		if (delegated.ok) {
			writeStdoutJson(delegated.payload);
			return;
		}
		writeStdoutJson(await (await params.ensureRuntime()).testListen(payload));
	});
}
function registerGoogleMeetSessionCommands(context) {
	const params = context;
	const { root, callGateway } = context;
	root.command("status").argument("[session-id]", "Meet session ID").option("--json", "Print JSON output", false).action(async (sessionId) => {
		const delegated = await callGoogleMeetGateway({
			callGateway,
			method: "googlemeet.status",
			payload: { sessionId }
		});
		if (delegated.ok) {
			writeStdoutJson(delegated.payload);
			return;
		}
		writeStdoutJson(await (await params.ensureRuntime()).status(sessionId));
	});
	root.command("transcript").description("Print the bounded caption transcript for a Meet session").argument("<session-id>", "Meet session ID").option("--since <index>", "Resume from the previous response's nextIndex").option("--json", "Print JSON output", false).action(async (sessionId, options) => {
		const sinceIndex = parseStrictNonNegativeInteger(options.since);
		if (options.since !== void 0 && sinceIndex === void 0) throw new Error("--since must be a non-negative safe integer");
		const delegated = await callGoogleMeetGateway({
			callGateway,
			method: "googlemeet.transcript",
			payload: {
				sessionId,
				...sinceIndex === void 0 ? {} : { sinceIndex }
			}
		});
		const result = delegated.ok ? delegated.payload : await (await params.ensureRuntime()).transcript(sessionId, sinceIndex === void 0 ? {} : { sinceIndex });
		if (!result.found) throw new Error("session not found");
		if (options.json) {
			writeStdoutJson(result);
			return;
		}
		if (result.evicted) writeStdoutLine("# transcript evicted from runtime memory");
		else if (result.droppedLines) writeStdoutLine("# %d earlier lines dropped by the transcript cap", result.droppedLines);
		for (const line of result.lines ?? []) writeStdoutLine("%s%s%s", line.at ? `[${line.at}] ` : "", line.speaker ? `${line.speaker}: ` : "", line.text);
		writeStdoutLine("# nextIndex: %d", result.nextIndex ?? 0);
	});
}
function registerGoogleMeetLifecycleCommands(context) {
	const params = context;
	const { root, callGateway } = context;
	root.command("recover-tab").description("Focus and inspect an existing Google Meet tab").argument("[url]", "Optional Meet URL to match").option("--transport <transport>", "Transport to inspect: chrome or chrome-node").option("--json", "Print JSON output", false).action(async (url, options) => {
		const result = await (await params.ensureRuntime()).recoverCurrentTab({
			url,
			transport: parseGoogleMeetBrowserTransport(options.transport)
		});
		if (options.json) {
			writeStdoutJson(result);
			return;
		}
		writeRecoverCurrentTabResult(result);
	});
	root.command("setup").description("Show Google Meet transport setup status").option("--transport <transport>", "Transport to check: chrome, chrome-node, or twilio").option("--mode <mode>", "Mode to check: agent, bidi, or transcribe").option("--json", "Print JSON output", false).action(async (options) => {
		const status = await (await params.ensureRuntime()).setupStatus({
			transport: parseGoogleMeetTransport(options.transport),
			mode: parseGoogleMeetMode(options.mode)
		});
		if (options.json) {
			writeStdoutJson(status);
			if (!status.ok) process.exitCode = 1;
			return;
		}
		writeSetupStatus(status);
		if (!status.ok) process.exitCode = 1;
	});
	root.command("leave").argument("<session-id>", "Meet session ID").action(async (sessionId) => {
		const delegated = await callGoogleMeetGateway({
			callGateway,
			method: "googlemeet.leave",
			payload: { sessionId }
		});
		const result = delegated.ok ? delegated.payload : await (await params.ensureRuntime()).leave(sessionId);
		if (!result.found) throw new Error("session not found");
		writeLeaveResult(sessionId, result);
	});
	root.command("speak").argument("<session-id>", "Meet session ID").argument("[message]", "Realtime instructions to speak now").action(async (sessionId, message) => {
		const delegated = await callGoogleMeetGateway({
			callGateway,
			method: "googlemeet.speak",
			payload: {
				sessionId,
				message
			}
		});
		const result = delegated.ok ? delegated.payload : await (await params.ensureRuntime()).speak(sessionId, message);
		if (!result.found) throw new Error("session not found");
		if (!result.spoken) throw new Error(result.session?.chrome?.health?.speechBlockedMessage ?? "session has no active realtime audio bridge");
		writeStdoutLine("speaking on %s", sessionId);
	});
}
//#endregion
//#region extensions/google-meet/src/cli-space-commands.ts
function writeGoogleMeetCreateOutput(payload, json) {
	if (json) {
		writeStdoutJson(payload);
		return;
	}
	writeStdoutLine("meeting uri: %s", payload.meetingUri);
	if (payload.space?.name) writeStdoutLine("space: %s", payload.space.name);
	if (payload.space?.meetingCode) writeStdoutLine("meeting code: %s", payload.space.meetingCode);
	if (payload.source) writeStdoutLine("source: %s", payload.source);
	if (payload.browser?.nodeId) writeStdoutLine("node: %s", payload.browser.nodeId);
	if (payload.tokenSource) writeStdoutLine("token source: %s", payload.tokenSource);
	const joinedSessionId = payload.joined ? payload.join?.session?.id : void 0;
	writeStdoutLine(joinedSessionId ? "joined: %s" : "joined: no (run `openclaw googlemeet join %s`)", joinedSessionId ?? payload.meetingUri);
}
function registerGoogleMeetCreateCommands(context) {
	const params = context;
	const { root, callGateway, operationTimeoutMs, hasCreateOAuth, resolveMeetingInput, resolveCliParams } = context;
	addGoogleMeetOAuthOptions(root.command("create").description("Create a new Google Meet space and print its meeting URL")).option("--access-type <type>", "Google Meet SpaceConfig accessType for API create: OPEN, TRUSTED, or RESTRICTED").option("--entry-point-access <type>", "Google Meet SpaceConfig entryPointAccess for API create: ALL or CREATOR_APP_ONLY").option("--no-join", "Only create the meeting URL; do not join it").option("--transport <transport>", "Join transport: chrome, chrome-node, or twilio").option("--mode <mode>", "Join mode: agent, bidi, or transcribe").option("--message <text>", "Realtime speech to trigger after join").option("--dial-in-number <phone>", "Meet dial-in number for Twilio transport").option("--pin <pin>", "Meet phone PIN; # is appended if omitted").option("--dtmf-sequence <sequence>", "Explicit Twilio DTMF sequence").option("--json", "Print JSON output", false).action(async (options) => {
		if (options.join !== false) {
			const delegated = await callGoogleMeetGateway({
				callGateway,
				method: "googlemeet.create",
				payload: { ...options },
				timeoutMs: operationTimeoutMs
			});
			if (delegated.ok) {
				const payload = delegated.payload;
				writeGoogleMeetCreateOutput(payload, options.json);
				return;
			}
		}
		if (!hasCreateOAuth(params.config, options)) {
			if (hasCreateSpaceConfigInput(options)) throw new Error("Google Meet access policy options require OAuth/API room creation. Configure Google Meet OAuth or remove --access-type/--entry-point-access.");
			const rt = await params.ensureRuntime();
			const result = await rt.createViaBrowser();
			const join = options.join !== false ? await rt.join({
				url: result.meetingUri,
				transport: parseGoogleMeetTransport(options.transport),
				mode: parseGoogleMeetMode(options.mode),
				message: options.message,
				dialInNumber: options.dialInNumber,
				pin: options.pin,
				dtmfSequence: options.dtmfSequence
			}) : void 0;
			writeGoogleMeetCreateOutput({
				source: result.source,
				meetingUri: result.meetingUri,
				joined: Boolean(join),
				...join ? { join } : {},
				browser: {
					nodeId: result.nodeId,
					targetId: result.targetId,
					browserUrl: result.browserUrl,
					browserTitle: result.browserTitle
				}
			}, options.json);
			return;
		}
		const token = await resolveGoogleMeetTokenFromParams(params.config, resolveCliParams(options));
		const result = await createGoogleMeetSpace({
			accessToken: token.accessToken,
			config: resolveCreateSpaceConfig(options)
		});
		const join = options.join !== false ? await (await params.ensureRuntime()).join({
			url: result.meetingUri,
			transport: parseGoogleMeetTransport(options.transport),
			mode: parseGoogleMeetMode(options.mode),
			message: options.message,
			dialInNumber: options.dialInNumber,
			pin: options.pin,
			dtmfSequence: options.dtmfSequence
		}) : void 0;
		writeGoogleMeetCreateOutput({
			...result,
			tokenSource: token.refreshed ? "refresh-token" : "cached-access-token",
			joined: Boolean(join),
			...join ? { join } : {}
		}, options.json);
	});
	addGoogleMeetOAuthOptions(root.command("end-active-conference").description("End the active conference for a Google Meet space").argument("[meeting]", "Meet URL, meeting code, or spaces/{id}")).option("--json", "Print JSON output", false).action(async (meeting, options) => {
		const token = await resolveGoogleMeetTokenFromParams(params.config, resolveCliParams(options));
		const result = await endGoogleMeetActiveConference({
			accessToken: token.accessToken,
			meeting: resolveMeetingInput(params.config, meeting ?? options.meeting)
		});
		if (options.json) {
			writeStdoutJson({
				...result,
				tokenSource: token.refreshed ? "refresh-token" : "cached-access-token"
			});
			return;
		}
		writeStdoutLine("space: %s", result.space);
		writeStdoutLine("ended: yes");
		writeStdoutLine("token source: %s", token.refreshed ? "refresh-token" : "cached-access-token");
	});
}
function registerGoogleMeetApiCommands(context) {
	const params = context;
	const { root, resolveCliParams, resolveMeetingInput } = context;
	addGoogleMeetOAuthOptions(addGoogleMeetMeetingOption(root.command("resolve-space").description("Resolve a Meet URL, meeting code, or spaces/{id} to its canonical space"))).option("--json", "Print JSON output", false).action(async (options) => {
		const meeting = resolveMeetingInput(params.config, options.meeting);
		const { space, token } = await resolveSpaceFromParams(params.config, {
			...resolveCliParams(options),
			meeting
		});
		if (options.json) {
			writeStdoutJson(space);
			return;
		}
		writeStdoutLine("input: %s", meeting);
		writeStdoutLine("space: %s", space.name);
		if (space.meetingCode) writeStdoutLine("meeting code: %s", space.meetingCode);
		if (space.meetingUri) writeStdoutLine("meeting uri: %s", space.meetingUri);
		writeStdoutLine("active conference: %s", space.activeConference ? "yes" : "no");
		writeStdoutLine("token source: %s", token.refreshed ? "refresh-token" : "cached-access-token");
	});
	addGoogleMeetOAuthOptions(addGoogleMeetMeetingOption(root.command("preflight").description("Validate OAuth + meeting resolution prerequisites for Meet media work"))).option("--json", "Print JSON output", false).action(async (options) => {
		const meeting = resolveMeetingInput(params.config, options.meeting);
		const { space, token } = await resolveSpaceFromParams(params.config, {
			...resolveCliParams(options),
			meeting
		});
		const report = buildGoogleMeetPreflightReport({
			input: meeting,
			space,
			previewAcknowledged: params.config.preview.enrollmentAcknowledged,
			tokenSource: token.refreshed ? "refresh-token" : "cached-access-token"
		});
		if (options.json) {
			writeStdoutJson(report);
			return;
		}
		writeStdoutLine("input: %s", report.input);
		writeStdoutLine("resolved space: %s", report.resolvedSpaceName);
		if (report.meetingCode) writeStdoutLine("meeting code: %s", report.meetingCode);
		if (report.meetingUri) writeStdoutLine("meeting uri: %s", report.meetingUri);
		writeStdoutLine("active conference: %s", report.hasActiveConference ? "yes" : "no");
		writeStdoutLine("preview acknowledged: %s", report.previewAcknowledged ? "yes" : "no");
		writeStdoutLine("token source: %s", report.tokenSource);
		if (report.blockers.length === 0) {
			writeStdoutLine("blockers: none");
			return;
		}
		writeStdoutLine("blockers:");
		for (const blocker of report.blockers) writeStdoutLine("- %s", blocker);
	});
	addGoogleMeetOAuthOptions(addGoogleMeetCalendarOptions(addGoogleMeetMeetingOption(root.command("latest").description("Find the latest Meet conference record for a meeting")))).option("--json", "Print JSON output", false).action(async (options) => {
		const raw = resolveCliParams(options);
		const token = await resolveGoogleMeetTokenFromParams(params.config, raw);
		if (!options.today && !options.event?.trim()) {
			const meeting = options.meeting?.trim() || params.config.defaults.meeting;
			if (!meeting) throw new Error("Meeting input is required. Pass --meeting, --today, --event, or configure defaults.meeting.");
			raw.meeting = meeting;
		}
		const resolved = await resolveMeetingFromParams({
			config: params.config,
			raw,
			accessToken: token.accessToken
		});
		const result = await fetchLatestGoogleMeetConferenceRecord({
			accessToken: token.accessToken,
			meeting: resolved.meeting
		});
		if (options.json) {
			writeStdoutJson({
				...result,
				...resolved.calendarEvent ? { calendarEvent: resolved.calendarEvent } : {},
				tokenSource: token.refreshed ? "refresh-token" : "cached-access-token"
			});
			return;
		}
		if (resolved.calendarEvent) {
			writeStdoutLine("calendar event: %s", resolved.calendarEvent.event.summary ?? "untitled");
			writeStdoutLine("calendar meet: %s", resolved.calendarEvent.meetingUri);
		}
		writeLatestConferenceRecordSummary(result);
		writeStdoutLine("token source: %s", token.refreshed ? "refresh-token" : "cached-access-token");
	});
	root.command("calendar-events").description("Preview Calendar events with Google Meet links").option("--today", "Find Meet links on today's calendar").option("--event <query>", "Find matching calendar events with Meet links").option("--calendar <id>", "Calendar id for lookup", "primary").option("--access-token <token>", "Access token override").option("--refresh-token <token>", "Refresh token override").option("--client-id <id>", "OAuth client id override").option("--client-secret <secret>", "OAuth client secret override").option("--expires-at <ms>", "Cached access token expiry as unix epoch milliseconds").option("--json", "Print JSON output", false).action(async (options) => {
		const token = await resolveGoogleMeetTokenFromParams(params.config, resolveCliParams(options));
		const window = options.today ? buildGoogleMeetCalendarDayWindow() : {};
		const result = await listGoogleMeetCalendarEvents({
			accessToken: token.accessToken,
			calendarId: options.calendar,
			eventQuery: options.event,
			...window
		});
		const payload = {
			...result,
			tokenSource: token.refreshed ? "refresh-token" : "cached-access-token"
		};
		if (options.json) {
			writeStdoutJson(payload);
			return;
		}
		writeCalendarEventsSummary(result);
		writeStdoutLine("token source: %s", token.refreshed ? "refresh-token" : "cached-access-token");
	});
}
//#endregion
//#region extensions/google-meet/src/cli.ts
function resolveMeetingInput(config, value) {
	const meeting = value?.trim() || config.defaults.meeting;
	if (!meeting) throw new Error("Meeting input is required. Pass a URL/meeting code or configure defaults.meeting.");
	return meeting;
}
function hasCalendarLookupOptions(options) {
	return Boolean(options.today || options.event?.trim());
}
function resolveCliParams(options) {
	const { calendar, expiresAt, ...raw } = options;
	return {
		...raw,
		calendarId: calendar,
		expiresAt: parseOptionalNumber(expiresAt)
	};
}
function resolveCliArtifactParams(config, options) {
	const meeting = options.meeting?.trim() || config.defaults.meeting;
	const conferenceRecord = options.conferenceRecord?.trim();
	if (!meeting && !conferenceRecord && !hasCalendarLookupOptions(options)) throw new Error("Meeting input or conference record is required. Pass --meeting, --today, --event, --conference-record, or configure defaults.meeting.");
	return {
		...resolveCliParams(options),
		meeting,
		conferenceRecord,
		pageSize: parsePositiveIntegerOption(options.pageSize, "page-size"),
		includeTranscriptEntries: options.transcriptEntries,
		includeAllConferenceRecords: options.allConferenceRecords,
		includeDocumentBodies: options.includeDocBodies,
		mergeDuplicateParticipants: options.mergeDuplicates,
		lateAfterMinutes: parseOptionalNumber(options.lateAfterMinutes),
		earlyBeforeMinutes: parseOptionalNumber(options.earlyBeforeMinutes)
	};
}
function hasCreateOAuth(config, options) {
	return Boolean(options.accessToken?.trim() || options.refreshToken?.trim() || config.oauth.accessToken || config.oauth.refreshToken);
}
function registerGoogleMeetCli(params) {
	const callGateway = params.callGatewayFromCli ?? callGatewayFromCli;
	const operationTimeoutMs = resolveGoogleMeetGatewayOperationTimeoutMs(params.config);
	const root = params.program.command("googlemeet").description("Google Meet participant utilities").addHelpText("after", () => `\nDocs: https://docs.openclaw.ai/plugins/google-meet\n`);
	root.command("auth").description("Google Meet OAuth helpers").command("login").description("Run a PKCE OAuth flow and print refresh-token JSON to store in plugin config").option("--client-id <id>", "OAuth client id override").option("--client-secret <secret>", "OAuth client secret override").option("--manual", "Use copy/paste callback flow instead of localhost callback").option("--json", "Print the token payload as JSON", false).option("--timeout-sec <n>", "Local callback timeout in seconds", "300").action(async (options) => {
		const clientId = options.clientId?.trim() || params.config.oauth.clientId;
		const clientSecret = options.clientSecret?.trim() || params.config.oauth.clientSecret;
		if (!clientId) throw new Error("Missing Google Meet OAuth client id. Configure oauth.clientId or pass --client-id.");
		const { verifier, challenge } = generateHexPkceVerifierChallenge();
		const state = generateOAuthState();
		const authUrl = buildGoogleMeetAuthUrl({
			clientId,
			challenge,
			state
		});
		const code = await waitForGoogleMeetAuthCode({
			state,
			manual: Boolean(options.manual),
			timeoutMs: resolveGoogleMeetOAuthCallbackTimeoutMs(options.timeoutSec),
			authUrl,
			promptInput,
			writeLine: (message) => writeStdoutLine("%s", message)
		});
		const tokens = await exchangeGoogleMeetAuthCode({
			clientId,
			clientSecret,
			code,
			verifier
		});
		if (!tokens.refreshToken) throw new Error("Google OAuth did not return a refresh token. Re-run the flow with consent and offline access.");
		const payload = {
			oauth: {
				clientId,
				...clientSecret ? { clientSecret } : {},
				refreshToken: tokens.refreshToken,
				accessToken: tokens.accessToken,
				expiresAt: tokens.expiresAt
			},
			scope: tokens.scope,
			tokenType: tokens.tokenType
		};
		if (!options.json) writeStdoutLine("Paste this into plugins.entries.google-meet.config:");
		writeStdoutJson(payload);
	});
	const context = {
		root,
		config: params.config,
		ensureRuntime: params.ensureRuntime,
		callGateway,
		operationTimeoutMs,
		resolveMeetingInput,
		resolveCliParams,
		resolveCliArtifactParams: (options) => resolveCliArtifactParams(params.config, options),
		hasCreateOAuth
	};
	registerGoogleMeetCreateCommands(context);
	registerGoogleMeetProbeCommands(context);
	registerGoogleMeetApiCommands(context);
	registerGoogleMeetArtifactCommands(context);
	registerGoogleMeetSessionCommands(context);
	registerGoogleMeetDoctorCommand(context);
	registerGoogleMeetLifecycleCommands(context);
}
//#endregion
export { buildGoogleMeetExportManifest, googleMeetExportFileNames, registerGoogleMeetCli, writeMeetExportBundle };
