import { g as __exportAll } from "./plugin-helpers-D1OyyzEZ.mjs";
import { clampTimerTimeoutMs, parseStrictPositiveInteger } from "openclaw/plugin-sdk/number-runtime";
import fsp, { stat } from "node:fs/promises";
import path from "node:path";
import JSZip from "jszip";
import { replaceFileAtomic, writeExternalFileWithinRoot } from "openclaw/plugin-sdk/security-runtime";
import { createInterface } from "node:readline/promises";
import { format } from "node:util";
import { isGatewayClientRequestError, isGatewayTransportError } from "openclaw/plugin-sdk/gateway-runtime";
import { formatDurationCompact } from "openclaw/plugin-sdk/time-runtime";
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
function resolveCliJoinRequest(url, options) {
	return {
		url,
		transport: parseGoogleMeetTransport(options.transport),
		mode: parseGoogleMeetMode(options.mode),
		message: options.message,
		dialInNumber: options.dialInNumber,
		pin: options.pin,
		dtmfSequence: options.dtmfSequence
	};
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
var cli_export_exports = /* @__PURE__ */ __exportAll({
	buildGoogleMeetExportManifest: () => buildGoogleMeetExportManifest,
	exportGoogleMeetBundle: () => exportGoogleMeetBundle,
	googleMeetExportFileNames: () => googleMeetExportFileNames,
	renderArtifacts: () => renderArtifacts,
	renderAttendance: () => renderAttendance,
	renderAttendanceCsv: () => renderAttendanceCsv,
	writeCalendarEventsSummary: () => writeCalendarEventsSummary,
	writeLatestConferenceRecordSummary: () => writeLatestConferenceRecordSummary,
	writeMeetExportBundle: () => writeMeetExportBundle
});
function appendArtifactSummary(lines, entry) {
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
function renderAttendance(result, format) {
	const markdown = format === "markdown";
	const lines = markdown ? ["# Google Meet Attendance"] : [];
	const field = (label, value) => {
		lines.push(`${markdown ? label : label.toLowerCase()}: ${value}`);
	};
	if (result.input) field("Input", result.input);
	if (result.space) field("Space", result.space.name);
	if (markdown) lines.push("");
	field("Conference records", result.conferenceRecords.length);
	field("Attendance rows", result.attendance.length);
	for (const row of result.attendance) {
		const identity = row.displayName || row.user || row.participant;
		lines.push("", markdown ? `## ${identity}` : `participant: ${identity}`);
		field("Record", row.conferenceRecord);
		field("Resource", row.participant);
		field("Participants merged", row.participants?.length ?? 1);
		field("First joined", formatOptional(row.firstJoinTime ?? row.earliestStartTime));
		field("Last left", formatOptional(row.lastLeaveTime ?? row.latestEndTime));
		field("Duration", formatDuration(row.durationMs));
		field("Late", row.late ? formatDuration(row.lateByMs) : "no");
		field("Early leave", row.earlyLeave ? formatDuration(row.earlyLeaveByMs) : "no");
		field("Sessions", row.sessions.length);
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
function participantDisplayName(entry, name) {
	const participant = entry.participants.find((candidate) => candidate.name === name);
	if (!participant) return name;
	return participant.signedinUser?.displayName ?? participant.anonymousUser?.displayName ?? participant.phoneUser?.displayName ?? participant.signedinUser?.user ?? name;
}
function appendArtifactDocuments(lines, title, documents) {
	if (documents.length === 0) return;
	lines.push("", `### ${title}`);
	for (const document of documents) {
		lines.push(`- ${document.name}`);
		if (document.documentTextError) lines.push(`  - Document body warning: ${document.documentTextError}`);
		else if (document.documentText) lines.push(`  - Document body: ${document.documentText.length} chars`);
	}
}
function renderArtifacts(result, format) {
	const markdown = format === "markdown";
	const lines = markdown ? ["# Google Meet Artifacts"] : [];
	const field = (label, value) => {
		lines.push(`${markdown ? label : label.toLowerCase()}: ${value}`);
	};
	if (result.input) field("Input", result.input);
	if (result.space) field("Space", result.space.name);
	if (markdown) lines.push("");
	field("Conference records", result.conferenceRecords.length);
	for (const entry of result.artifacts) {
		lines.push("", `${markdown ? "##" : "record:"} ${entry.conferenceRecord.name}`);
		field("Started", formatOptional(entry.conferenceRecord.startTime));
		field("Ended", formatOptional(entry.conferenceRecord.endTime));
		if (markdown) lines.push("");
		field("Participants", entry.participants.length);
		field("Recordings", entry.recordings.length);
		field("Transcripts", entry.transcripts.length);
		field("Transcript entries", entry.transcriptEntries.reduce((count, transcript) => count + transcript.entries.length, 0));
		field("Smart notes", entry.smartNotes.length);
		if (!markdown) {
			appendArtifactSummary(lines, entry);
			continue;
		}
		const warnings = collectGoogleMeetArtifactWarnings({
			conferenceRecords: [entry.conferenceRecord],
			artifacts: [entry]
		});
		if (warnings.length > 0) {
			lines.push("");
			lines.push("### Warnings");
			for (const warning of warnings) {
				const resource = warning.resource ? `${warning.resource}: ` : "";
				lines.push(`- ${resource}${warning.message}`);
			}
		}
		if (entry.recordings.length > 0) {
			lines.push("");
			lines.push("### Recordings");
			for (const recording of entry.recordings) lines.push(`- ${recording.name}`);
		}
		appendArtifactDocuments(lines, "Transcripts", entry.transcripts);
		for (const transcriptEntries of entry.transcriptEntries) {
			lines.push("");
			lines.push(`### Transcript Entries: ${transcriptEntries.transcript}`);
			if (transcriptEntries.entriesError) {
				lines.push(`Warning: ${transcriptEntries.entriesError}`);
				continue;
			}
			if (transcriptEntries.entries.length === 0) {
				lines.push("_No transcript entries._");
				continue;
			}
			for (const transcriptEntry of transcriptEntries.entries) {
				const times = transcriptEntry.startTime || transcriptEntry.endTime ? ` (${formatOptional(transcriptEntry.startTime)} -> ${formatOptional(transcriptEntry.endTime)})` : "";
				const speaker = transcriptEntry.participant ? `${participantDisplayName(entry, transcriptEntry.participant)}: ` : "";
				lines.push(`- ${speaker}${transcriptEntry.text ?? ""}${times}`);
			}
		}
		appendArtifactDocuments(lines, "Smart Notes", entry.smartNotes);
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
	if (result.input) lines.push(`Input: ${result.input}`);
	for (const entry of result.artifacts) {
		lines.push("");
		lines.push(`## ${entry.conferenceRecord.name}`);
		if (entry.transcriptEntries.length === 0) {
			lines.push("_No transcript entries._");
			continue;
		}
		for (const transcriptEntries of entry.transcriptEntries) {
			lines.push("");
			lines.push(`### ${transcriptEntries.transcript}`);
			if (transcriptEntries.entriesError) {
				lines.push(`Warning: ${transcriptEntries.entriesError}`);
				continue;
			}
			for (const transcriptEntry of transcriptEntries.entries) {
				const speaker = transcriptEntry.participant ? participantDisplayName(entry, transcriptEntry.participant) : "unknown";
				const time = transcriptEntry.startTime ? ` [${transcriptEntry.startTime}]` : "";
				lines.push(`- ${speaker}${time}: ${transcriptEntry.text ?? ""}`);
			}
		}
		for (const [title, documents] of [["Transcript Document Bodies", entry.transcripts], ["Smart Note Document Bodies", entry.smartNotes]]) {
			const bodies = documents.filter((document) => document.documentText);
			if (bodies.length > 0) {
				lines.push("", `### ${title}`);
				for (const document of bodies) {
					lines.push("", `#### ${document.name}`);
					lines.push(document.documentText?.trim() || "_Empty document body._");
				}
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
		for (const [type, documents] of [["transcript_document_body", entry.transcripts], ["smart_note_document_body", entry.smartNotes]]) for (const document of documents) if (document.documentTextError) warnings.push({
			type,
			conferenceRecord,
			resource: document.name,
			message: document.documentTextError
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
			content: `${renderArtifacts(params.artifacts, "markdown")}\n${renderAttendance(params.attendance, "markdown")}`
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
async function exportGoogleMeetBundle(params) {
	const metadata = {
		...params.calendarEvent ? { calendarEvent: params.calendarEvent } : {},
		tokenSource: params.tokenSource
	};
	if (params.dryRun) return {
		dryRun: true,
		manifest: buildGoogleMeetExportManifest({
			artifacts: params.artifacts,
			attendance: params.attendance,
			files: googleMeetExportFileNames(),
			request: params.request,
			...metadata
		}),
		...metadata
	};
	return {
		...await writeMeetExportBundle(params),
		...metadata
	};
}
//#endregion
export { writeStdoutJson as C, writeSetupStatus as S, resolveGoogleMeetOAuthCallbackTimeoutMs as _, renderAttendanceCsv as a, writeLeaveResult as b, callGoogleMeetGateway as c, parseGoogleMeetTransport as d, parseOptionalNumber as f, resolveCliJoinRequest as g, promptInput as h, renderAttendance as i, parseGoogleMeetBrowserTransport as l, parsePositiveNumber as m, exportGoogleMeetBundle as n, writeCalendarEventsSummary as o, parsePositiveIntegerOption as p, renderArtifacts as r, writeLatestConferenceRecordSummary as s, cli_export_exports as t, parseGoogleMeetMode as u, writeCliOutput as v, writeStdoutLine as w, writeRecoverCurrentTabResult as x, writeDoctorStatus as y };
