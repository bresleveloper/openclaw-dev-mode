import { c as loadGoogleMeetCliModule, p as resolveMeetingInput } from "./plugin-registration-B3LXKV4R.mjs";
import { t as googleApiError } from "./google-api-errors-BDYXfKRa.mjs";
import { t as normalizeMeetUrl } from "./meet-url-BP2Jlvjs.mjs";
import { normalizeOptionalString, uniqueStrings } from "openclaw/plugin-sdk/string-coerce-runtime";
import { formatErrorMessage } from "openclaw/plugin-sdk/error-runtime";
import { createLazyRuntimeModule } from "openclaw/plugin-sdk/lazy-runtime";
import { parseDateStringTimestampMs } from "openclaw/plugin-sdk/number-runtime";
import { readPositiveIntegerParam } from "openclaw/plugin-sdk/channel-actions";
import { readProviderJsonResponse, readProviderTextResponse } from "openclaw/plugin-sdk/provider-http";
import { fetchWithSsrFGuard } from "openclaw/plugin-sdk/ssrf-runtime";
//#region \0rolldown/runtime.js
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
//#endregion
//#region extensions/google-meet/src/calendar.ts
const GOOGLE_CALENDAR_API_BASE_URL = "https://www.googleapis.com/calendar/v3";
const GOOGLE_CALENDAR_API_HOST = "www.googleapis.com";
const GOOGLE_CALENDAR_EVENTS_SCOPE = "https://www.googleapis.com/auth/calendar.events.readonly";
const GOOGLE_CALENDAR_REQUEST_TIMEOUT_MS = 3e4;
function appendQuery$2(url, query) {
	const parsed = new URL(url);
	for (const [key, value] of Object.entries(query)) if (value !== void 0) parsed.searchParams.set(key, String(value));
	return parsed.toString();
}
function normalizeGoogleMeetCalendarUri(value) {
	if (!value?.trim()) return;
	try {
		const url = new URL(value);
		if (url.protocol !== "http:" && url.protocol !== "https:") return;
		if (url.hostname.toLowerCase() !== "meet.google.com" || url.port || url.username || url.password) return;
		url.protocol = "https:";
		return normalizeMeetUrl(url.toString());
	} catch {
		return;
	}
}
function extractGoogleMeetUriFromText(value) {
	const matches = value?.matchAll(/https:\/\/meet\.google\.com\/[a-z0-9-]+/gi);
	for (const match of matches ?? []) {
		const uri = normalizeGoogleMeetCalendarUri(match[0]);
		if (uri) return uri;
	}
}
function findFirstGoogleMeetCalendarUri(entryPoints, predicate = () => true) {
	for (const entry of entryPoints) {
		if (!predicate(entry)) continue;
		const uri = normalizeGoogleMeetCalendarUri(entry.uri);
		if (uri) return uri;
	}
}
function extractGoogleMeetUriFromCalendarEvent(event) {
	const hangoutLink = normalizeGoogleMeetCalendarUri(event.hangoutLink);
	if (hangoutLink) return hangoutLink;
	const entryPoints = event.conferenceData?.entryPoints ?? [];
	const videoEntryUri = findFirstGoogleMeetCalendarUri(entryPoints, (entry) => entry.entryPointType === "video");
	if (videoEntryUri) return videoEntryUri;
	const meetEntryUri = findFirstGoogleMeetCalendarUri(entryPoints);
	if (meetEntryUri) return meetEntryUri;
	return extractGoogleMeetUriFromText(event.location) ?? extractGoogleMeetUriFromText(event.description);
}
function buildGoogleMeetCalendarDayWindow(now = /* @__PURE__ */ new Date()) {
	const start = new Date(now);
	start.setHours(0, 0, 0, 0);
	const end = new Date(start);
	end.setDate(start.getDate() + 1);
	return {
		timeMin: start.toISOString(),
		timeMax: end.toISOString()
	};
}
function parseCalendarEventTime(value) {
	const raw = value?.dateTime ?? value?.date;
	if (!raw) return;
	const parsed = Date.parse(raw);
	return Number.isFinite(parsed) ? parsed : void 0;
}
function rankCalendarEvent(event, nowMs) {
	const startMs = parseCalendarEventTime(event.start) ?? Number.POSITIVE_INFINITY;
	const endMs = parseCalendarEventTime(event.end) ?? startMs;
	if (startMs <= nowMs && endMs >= nowMs) return 0;
	if (startMs > nowMs) return startMs - nowMs;
	return nowMs - startMs + 2592e6;
}
function chooseBestMeetCalendarEvent(events, now) {
	const nowMs = now.getTime();
	let selected;
	let selectedRank = Number.POSITIVE_INFINITY;
	for (const event of events) {
		if (event.status === "cancelled" || !extractGoogleMeetUriFromCalendarEvent(event)) continue;
		const rank = rankCalendarEvent(event, nowMs);
		if (!selected || rank < selectedRank) {
			selected = event;
			selectedRank = rank;
		}
	}
	return selected;
}
async function fetchGoogleCalendarEvents(params) {
	const calendarId = params.calendarId?.trim() || "primary";
	const now = params.now ?? /* @__PURE__ */ new Date();
	const defaultTimeMax = new Date(now);
	defaultTimeMax.setDate(defaultTimeMax.getDate() + 7);
	const { response, release } = await fetchWithSsrFGuard({
		url: appendQuery$2(`${GOOGLE_CALENDAR_API_BASE_URL}/calendars/${encodeURIComponent(calendarId)}/events`, {
			maxResults: params.maxResults ?? 50,
			orderBy: "startTime",
			q: params.eventQuery?.trim() || void 0,
			showDeleted: false,
			singleEvents: true,
			timeMin: params.timeMin ?? now.toISOString(),
			timeMax: params.timeMax ?? defaultTimeMax.toISOString()
		}),
		init: { headers: {
			Authorization: `Bearer ${params.accessToken}`,
			Accept: "application/json"
		} },
		policy: { allowedHostnames: [GOOGLE_CALENDAR_API_HOST] },
		auditContext: "google-meet.calendar.events.list",
		timeoutMs: GOOGLE_CALENDAR_REQUEST_TIMEOUT_MS
	});
	try {
		if (!response.ok) throw await googleApiError({
			response,
			prefix: "Google Calendar events.list",
			scopes: [GOOGLE_CALENDAR_EVENTS_SCOPE]
		});
		const payload = await readProviderJsonResponse(response, "Google Calendar events.list");
		if (payload.items !== void 0 && !Array.isArray(payload.items)) throw new Error("Google Calendar events.list response had non-array items");
		return {
			calendarId,
			events: payload.items ?? [],
			now
		};
	} finally {
		await release();
	}
}
async function listGoogleMeetCalendarEvents(params) {
	const { calendarId, events, now } = await fetchGoogleCalendarEvents(params);
	const best = chooseBestMeetCalendarEvent(events, now);
	return {
		calendarId,
		events: events.map((event) => {
			const meetingUri = extractGoogleMeetUriFromCalendarEvent(event);
			return meetingUri ? {
				event,
				meetingUri,
				selected: event === best
			} : void 0;
		}).filter((event) => Boolean(event))
	};
}
async function findGoogleMeetCalendarEvent(params) {
	const result = await listGoogleMeetCalendarEvents(params);
	const selected = result.events.find((event) => event.selected) ?? result.events[0];
	if (!selected) throw new Error("No Google Calendar event with a Google Meet link matched the query");
	return {
		calendarId: result.calendarId,
		event: selected.event,
		meetingUri: selected.meetingUri
	};
}
//#endregion
//#region extensions/google-meet/src/drive.ts
const GOOGLE_DRIVE_API_BASE_URL = "https://www.googleapis.com/drive/v3";
const GOOGLE_DRIVE_API_HOST = "www.googleapis.com";
const GOOGLE_DRIVE_MEET_SCOPE = "https://www.googleapis.com/auth/drive.meet.readonly";
const GOOGLE_DRIVE_REQUEST_TIMEOUT_MS = 3e4;
const TEXT_PLAIN_MIME = "text/plain";
function appendQuery$1(url, query) {
	const parsed = new URL(url);
	for (const [key, value] of Object.entries(query)) if (value !== void 0) parsed.searchParams.set(key, value);
	return parsed.toString();
}
function extractGoogleDriveDocumentId(value) {
	if (typeof value !== "string") return;
	const trimmed = value.trim();
	if (!trimmed) return;
	if (/^https?:\/\//i.test(trimmed)) try {
		return new URL(trimmed).pathname.match(/\/document\/d\/([^/]+)/)?.[1];
	} catch {
		return;
	}
	return trimmed.split("/").filter(Boolean).at(-1);
}
async function exportGoogleDriveDocumentText(params) {
	const { response, release } = await fetchWithSsrFGuard({
		url: appendQuery$1(`${GOOGLE_DRIVE_API_BASE_URL}/files/${encodeURIComponent(params.documentId)}/export`, { mimeType: TEXT_PLAIN_MIME }),
		init: { headers: {
			Authorization: `Bearer ${params.accessToken}`,
			Accept: TEXT_PLAIN_MIME
		} },
		policy: { allowedHostnames: [GOOGLE_DRIVE_API_HOST] },
		auditContext: "google-meet.drive.files.export",
		timeoutMs: GOOGLE_DRIVE_REQUEST_TIMEOUT_MS
	});
	try {
		if (!response.ok) throw await googleApiError({
			response,
			prefix: "Google Drive files.export",
			scopes: [GOOGLE_DRIVE_MEET_SCOPE]
		});
		return await readProviderTextResponse(response, "Google Drive files.export");
	} finally {
		await release();
	}
}
//#endregion
//#region extensions/google-meet/src/meet-api.ts
const GOOGLE_MEET_API_BASE_URL = `https://meet.googleapis.com/v2`;
const GOOGLE_MEET_URL_HOST = "meet.google.com";
const GOOGLE_MEET_API_HOST = "meet.googleapis.com";
const GOOGLE_MEET_REQUEST_TIMEOUT_MS = 3e4;
const GOOGLE_MEET_MEDIA_SCOPE = "https://www.googleapis.com/auth/meetings.conference.media.readonly";
const GOOGLE_MEET_SPACE_SCOPE = "https://www.googleapis.com/auth/meetings.space.readonly";
const GOOGLE_MEET_SPACE_CREATED_SCOPE = "https://www.googleapis.com/auth/meetings.space.created";
const GOOGLE_MEET_SPACE_SETTINGS_SCOPE = "https://www.googleapis.com/auth/meetings.space.settings";
function normalizeGoogleMeetSpaceName(input) {
	const trimmed = input.trim();
	if (!trimmed) throw new Error("Meeting input is required");
	if (trimmed.startsWith("spaces/")) {
		const suffix = trimmed.slice(7).trim();
		if (!suffix) throw new Error("spaces/ input must include a meeting code or space id");
		return `spaces/${suffix}`;
	}
	if (/^https?:\/\//i.test(trimmed)) {
		const url = new URL(trimmed);
		if (url.hostname !== GOOGLE_MEET_URL_HOST) throw new Error(`Expected a ${GOOGLE_MEET_URL_HOST} URL, received ${url.hostname}`);
		const firstSegment = url.pathname.split("/").map((segment) => segment.trim()).find(Boolean);
		if (!firstSegment) throw new Error("Google Meet URL did not include a meeting code");
		return `spaces/${firstSegment}`;
	}
	return `spaces/${trimmed}`;
}
function encodeSpaceNameForPath(name) {
	return name.split("/").map(encodeURIComponent).join("/");
}
function encodeResourceNameForPath(name) {
	const trimmed = name.trim();
	if (!trimmed) throw new Error("Google Meet resource name is required");
	return trimmed.split("/").map(encodeURIComponent).join("/");
}
function normalizeConferenceRecordName(input) {
	const trimmed = input.trim();
	if (!trimmed) throw new Error("Conference record is required");
	return trimmed.startsWith("conferenceRecords/") ? trimmed : `conferenceRecords/${trimmed}`;
}
function appendQuery(url, query) {
	if (!query) return url;
	const parsed = new URL(url);
	for (const [key, value] of Object.entries(query)) if (value !== void 0) parsed.searchParams.set(key, String(value));
	return parsed.toString();
}
function assertResourceArray(value, key, context) {
	if (value === void 0) return [];
	if (!Array.isArray(value)) throw new Error(`Google Meet ${context} response had non-array ${key}`);
	const resources = value;
	for (const resource of resources) if (!resource.name?.trim()) throw new Error(`Google Meet ${context} response included a resource without name`);
	return resources;
}
async function requestGoogleMeetApi(params) {
	return await fetchWithSsrFGuard({
		url: appendQuery(`${GOOGLE_MEET_API_BASE_URL}/${params.path}`, params.query),
		init: {
			method: params.method,
			headers: {
				Authorization: `Bearer ${params.accessToken}`,
				Accept: "application/json",
				...params.body === void 0 ? {} : { "Content-Type": "application/json" }
			},
			body: params.body
		},
		policy: { allowedHostnames: [GOOGLE_MEET_API_HOST] },
		auditContext: params.auditContext,
		timeoutMs: GOOGLE_MEET_REQUEST_TIMEOUT_MS
	});
}
async function fetchGoogleMeetJson(params) {
	const { response, release } = await requestGoogleMeetApi({
		accessToken: params.accessToken,
		path: params.path,
		query: params.query,
		auditContext: params.auditContext
	});
	try {
		if (!response.ok) throw await googleApiError({
			response,
			prefix: params.errorPrefix,
			scopes: [GOOGLE_MEET_MEDIA_SCOPE]
		});
		return await readProviderJsonResponse(response, params.errorPrefix);
	} finally {
		await release();
	}
}
async function listGoogleMeetCollection(params) {
	const items = [];
	let pageToken;
	do {
		const payload = await fetchGoogleMeetJson({
			accessToken: params.accessToken,
			path: params.path,
			query: {
				...params.query,
				pageToken
			},
			auditContext: params.auditContext,
			errorPrefix: params.errorPrefix
		});
		const pageItems = assertResourceArray(payload[params.collectionKey], params.collectionKey, params.errorPrefix);
		const remaining = typeof params.maxItems === "number" ? Math.max(params.maxItems - items.length, 0) : void 0;
		items.push(...remaining === void 0 ? pageItems : pageItems.slice(0, remaining));
		if (typeof params.maxItems === "number" && items.length >= params.maxItems) break;
		pageToken = typeof payload.nextPageToken === "string" ? payload.nextPageToken : void 0;
	} while (pageToken);
	return items;
}
async function fetchGoogleMeetSpace(params) {
	const name = normalizeGoogleMeetSpaceName(params.meeting);
	const { response, release } = await requestGoogleMeetApi({
		accessToken: params.accessToken,
		path: encodeSpaceNameForPath(name),
		auditContext: "google-meet.spaces.get"
	});
	try {
		if (!response.ok) throw await googleApiError({
			response,
			prefix: "Google Meet spaces.get",
			scopes: [GOOGLE_MEET_SPACE_SCOPE]
		});
		const payload = await readProviderJsonResponse(response, "Google Meet spaces.get");
		if (!payload.name?.trim()) throw new Error("Google Meet spaces.get response was missing name");
		return payload;
	} finally {
		await release();
	}
}
async function createGoogleMeetSpace(params) {
	const body = params.config && Object.keys(params.config).length > 0 ? JSON.stringify({ config: params.config }) : "{}";
	const { response, release } = await requestGoogleMeetApi({
		accessToken: params.accessToken,
		path: "spaces",
		method: "POST",
		body,
		auditContext: "google-meet.spaces.create"
	});
	try {
		if (!response.ok) throw await googleApiError({
			response,
			prefix: "Google Meet spaces.create",
			scopes: params.config && Object.keys(params.config).length > 0 ? [GOOGLE_MEET_SPACE_CREATED_SCOPE, GOOGLE_MEET_SPACE_SETTINGS_SCOPE] : [GOOGLE_MEET_SPACE_CREATED_SCOPE]
		});
		const payload = await readProviderJsonResponse(response, "Google Meet spaces.create");
		if (!payload.name?.trim()) throw new Error("Google Meet spaces.create response was missing name");
		const meetingUri = payload.meetingUri?.trim();
		if (!meetingUri) throw new Error("Google Meet spaces.create response was missing meetingUri");
		return {
			space: payload,
			meetingUri
		};
	} finally {
		await release();
	}
}
async function endGoogleMeetActiveConference(params) {
	const space = (await fetchGoogleMeetSpace({
		accessToken: params.accessToken,
		meeting: params.meeting
	})).name;
	const { response, release } = await requestGoogleMeetApi({
		accessToken: params.accessToken,
		path: `${encodeSpaceNameForPath(space)}:endActiveConference`,
		method: "POST",
		body: "{}",
		auditContext: "google-meet.spaces.endActiveConference"
	});
	try {
		if (!response.ok) throw await googleApiError({
			response,
			prefix: "Google Meet spaces.endActiveConference",
			scopes: [GOOGLE_MEET_SPACE_CREATED_SCOPE]
		});
		return {
			space,
			ended: true
		};
	} finally {
		await release();
	}
}
async function fetchGoogleMeetConferenceRecord(params) {
	const name = normalizeConferenceRecordName(params.conferenceRecord);
	const payload = await fetchGoogleMeetJson({
		accessToken: params.accessToken,
		path: encodeResourceNameForPath(name),
		auditContext: "google-meet.conferenceRecords.get",
		errorPrefix: "Google Meet conferenceRecords.get"
	});
	if (!payload.name?.trim()) throw new Error("Google Meet conferenceRecords.get response was missing name");
	return payload;
}
async function listGoogleMeetConferenceRecords(params) {
	const filter = params.meeting ? `space.name = "${normalizeGoogleMeetSpaceName(params.meeting)}"` : void 0;
	return listGoogleMeetCollection({
		accessToken: params.accessToken,
		path: "conferenceRecords",
		collectionKey: "conferenceRecords",
		query: {
			pageSize: params.pageSize,
			filter
		},
		maxItems: params.maxItems,
		auditContext: "google-meet.conferenceRecords.list",
		errorPrefix: "Google Meet conferenceRecords.list"
	});
}
async function fetchLatestGoogleMeetConferenceRecord(params) {
	const space = await fetchGoogleMeetSpace({
		accessToken: params.accessToken,
		meeting: params.meeting
	});
	const [conferenceRecord] = await listGoogleMeetConferenceRecords({
		accessToken: params.accessToken,
		meeting: space.name,
		pageSize: 1,
		maxItems: 1
	});
	return {
		input: params.meeting,
		space,
		...conferenceRecord ? { conferenceRecord } : {}
	};
}
async function listGoogleMeetParticipants(params) {
	const parent = normalizeConferenceRecordName(params.conferenceRecord);
	return listGoogleMeetCollection({
		accessToken: params.accessToken,
		path: `${encodeResourceNameForPath(parent)}/participants`,
		collectionKey: "participants",
		query: { pageSize: params.pageSize },
		auditContext: "google-meet.conferenceRecords.participants.list",
		errorPrefix: "Google Meet conferenceRecords.participants.list"
	});
}
async function listGoogleMeetParticipantSessions(params) {
	return listGoogleMeetCollection({
		accessToken: params.accessToken,
		path: `${encodeResourceNameForPath(params.participant)}/participantSessions`,
		collectionKey: "participantSessions",
		query: { pageSize: params.pageSize },
		auditContext: "google-meet.conferenceRecords.participants.participantSessions.list",
		errorPrefix: "Google Meet conferenceRecords.participants.participantSessions.list"
	});
}
async function listGoogleMeetRecordings(params) {
	const parent = normalizeConferenceRecordName(params.conferenceRecord);
	return listGoogleMeetCollection({
		accessToken: params.accessToken,
		path: `${encodeResourceNameForPath(parent)}/recordings`,
		collectionKey: "recordings",
		query: { pageSize: params.pageSize },
		auditContext: "google-meet.conferenceRecords.recordings.list",
		errorPrefix: "Google Meet conferenceRecords.recordings.list"
	});
}
async function listGoogleMeetTranscripts(params) {
	const parent = normalizeConferenceRecordName(params.conferenceRecord);
	return listGoogleMeetCollection({
		accessToken: params.accessToken,
		path: `${encodeResourceNameForPath(parent)}/transcripts`,
		collectionKey: "transcripts",
		query: { pageSize: params.pageSize },
		auditContext: "google-meet.conferenceRecords.transcripts.list",
		errorPrefix: "Google Meet conferenceRecords.transcripts.list"
	});
}
async function listGoogleMeetTranscriptEntries(params) {
	return listGoogleMeetCollection({
		accessToken: params.accessToken,
		path: `${encodeResourceNameForPath(params.transcript)}/entries`,
		collectionKey: "transcriptEntries",
		query: { pageSize: params.pageSize },
		auditContext: "google-meet.conferenceRecords.transcripts.entries.list",
		errorPrefix: "Google Meet conferenceRecords.transcripts.entries.list"
	});
}
async function listGoogleMeetSmartNotes(params) {
	const parent = normalizeConferenceRecordName(params.conferenceRecord);
	return listGoogleMeetCollection({
		accessToken: params.accessToken,
		path: `${encodeResourceNameForPath(parent)}/smartNotes`,
		collectionKey: "smartNotes",
		query: { pageSize: params.pageSize },
		auditContext: "google-meet.conferenceRecords.smartNotes.list",
		errorPrefix: "Google Meet conferenceRecords.smartNotes.list"
	});
}
async function resolveConferenceRecordQuery(params) {
	if (params.conferenceRecord?.trim()) {
		const conferenceRecord = await fetchGoogleMeetConferenceRecord({
			accessToken: params.accessToken,
			conferenceRecord: params.conferenceRecord
		});
		return {
			input: params.conferenceRecord.trim(),
			conferenceRecords: [conferenceRecord]
		};
	}
	if (!params.meeting?.trim()) throw new Error("Meeting input or conference record is required");
	const space = await fetchGoogleMeetSpace({
		accessToken: params.accessToken,
		meeting: params.meeting
	});
	const conferenceRecords = await listGoogleMeetConferenceRecords({
		accessToken: params.accessToken,
		meeting: space.name,
		pageSize: params.allConferenceRecords ? params.pageSize : 1,
		maxItems: params.allConferenceRecords ? void 0 : 1
	});
	return {
		input: params.meeting,
		space,
		conferenceRecords
	};
}
//#endregion
//#region extensions/google-meet/src/meet.ts
function getParticipantDisplayName(participant) {
	return participant.signedinUser?.displayName ?? participant.anonymousUser?.displayName ?? participant.phoneUser?.displayName;
}
function getParticipantUser(participant) {
	return participant.signedinUser?.user;
}
function getDocsDestinationDocumentId(destination) {
	return extractGoogleDriveDocumentId(destination?.document) ?? extractGoogleDriveDocumentId(destination?.documentId) ?? extractGoogleDriveDocumentId(destination?.file);
}
async function attachDocumentText(params) {
	const documentId = getDocsDestinationDocumentId(params.resource.docsDestination);
	if (!documentId) return params.resource;
	try {
		return {
			...params.resource,
			documentText: await exportGoogleDriveDocumentText({
				accessToken: params.accessToken,
				documentId
			})
		};
	} catch (error) {
		return {
			...params.resource,
			documentTextError: formatErrorMessage(error)
		};
	}
}
function isoFromMs(value) {
	return typeof value === "number" && Number.isFinite(value) ? new Date(value).toISOString() : void 0;
}
function minTimestamp(values) {
	const parsed = values.map(parseDateStringTimestampMs).filter((value) => typeof value === "number");
	return parsed.length > 0 ? isoFromMs(Math.min(...parsed)) : void 0;
}
function maxTimestamp(values) {
	const parsed = values.map(parseDateStringTimestampMs).filter((value) => typeof value === "number");
	return parsed.length > 0 ? isoFromMs(Math.max(...parsed)) : void 0;
}
function sumSessionDurationMs(sessions, fallbackStart, fallbackEnd) {
	const sessionTotal = sessions.reduce((total, session) => {
		const startMs = parseDateStringTimestampMs(session.startTime);
		const endMs = parseDateStringTimestampMs(session.endTime);
		return startMs !== void 0 && endMs !== void 0 && endMs > startMs ? total + (endMs - startMs) : total;
	}, 0);
	if (sessionTotal > 0) return sessionTotal;
	const startMs = parseDateStringTimestampMs(fallbackStart);
	const endMs = parseDateStringTimestampMs(fallbackEnd);
	return startMs !== void 0 && endMs !== void 0 && endMs > startMs ? endMs - startMs : void 0;
}
function attendanceMergeKey(row) {
	return (row.user ?? row.displayName ?? row.participant).trim().toLocaleLowerCase();
}
function sortSessions(sessions) {
	return sessions.toSorted((left, right) => (parseDateStringTimestampMs(left.startTime) ?? 0) - (parseDateStringTimestampMs(right.startTime) ?? 0));
}
function decorateAttendanceRow(row, conferenceRecord, params) {
	const sessions = sortSessions(row.sessions);
	const firstJoinTime = minTimestamp([row.earliestStartTime, ...sessions.map((session) => session.startTime)]);
	const lastLeaveTime = maxTimestamp([row.latestEndTime, ...sessions.map((session) => session.endTime)]);
	const durationMs = sumSessionDurationMs(sessions, firstJoinTime, lastLeaveTime);
	const conferenceStartMs = parseDateStringTimestampMs(conferenceRecord.startTime);
	const conferenceEndMs = parseDateStringTimestampMs(conferenceRecord.endTime);
	const firstJoinMs = parseDateStringTimestampMs(firstJoinTime);
	const lastLeaveMs = parseDateStringTimestampMs(lastLeaveTime);
	const lateGraceMs = (params.lateAfterMinutes ?? 5) * 6e4;
	const earlyGraceMs = (params.earlyBeforeMinutes ?? 5) * 6e4;
	const lateByMs = conferenceStartMs !== void 0 && firstJoinMs !== void 0 ? Math.max(firstJoinMs - conferenceStartMs, 0) : void 0;
	const earlyLeaveByMs = conferenceEndMs !== void 0 && lastLeaveMs !== void 0 ? Math.max(conferenceEndMs - lastLeaveMs, 0) : void 0;
	const decorated = {
		...row,
		sessions,
		participants: row.participants ?? [row.participant]
	};
	decorated.earliestStartTime = firstJoinTime ?? row.earliestStartTime;
	decorated.latestEndTime = lastLeaveTime ?? row.latestEndTime;
	if (firstJoinTime) decorated.firstJoinTime = firstJoinTime;
	if (lastLeaveTime) decorated.lastLeaveTime = lastLeaveTime;
	if (durationMs !== void 0) decorated.durationMs = durationMs;
	if (lateByMs !== void 0) {
		decorated.late = lateByMs > lateGraceMs;
		if (decorated.late) decorated.lateByMs = lateByMs;
	}
	if (earlyLeaveByMs !== void 0) {
		decorated.earlyLeave = earlyLeaveByMs > earlyGraceMs;
		if (decorated.earlyLeave) decorated.earlyLeaveByMs = earlyLeaveByMs;
	}
	return decorated;
}
function mergeAttendanceRows(rows, conferenceRecord, params) {
	if (params.mergeDuplicateParticipants === false) return rows.map((row) => decorateAttendanceRow(row, conferenceRecord, params));
	const grouped = /* @__PURE__ */ new Map();
	for (const row of rows) {
		const key = attendanceMergeKey(row);
		const existing = grouped.get(key);
		if (!existing) {
			grouped.set(key, {
				...row,
				participants: [row.participant]
			});
			continue;
		}
		existing.participants = uniqueStrings([...existing.participants ?? [existing.participant], row.participant]);
		existing.sessions.push(...row.sessions);
		existing.displayName ??= row.displayName;
		existing.user ??= row.user;
		existing.earliestStartTime = minTimestamp([existing.earliestStartTime, row.earliestStartTime]);
		existing.latestEndTime = maxTimestamp([existing.latestEndTime, row.latestEndTime]);
	}
	return [...grouped.values()].map((row) => decorateAttendanceRow(row, conferenceRecord, params));
}
async function fetchGoogleMeetArtifacts(params) {
	const resolved = await resolveConferenceRecordQuery(params);
	const artifacts = await Promise.all(resolved.conferenceRecords.map(async (conferenceRecord) => {
		const [participants, recordings, transcripts, smartNotesResult] = await Promise.all([
			listGoogleMeetParticipants({
				accessToken: params.accessToken,
				conferenceRecord: conferenceRecord.name,
				pageSize: params.pageSize
			}),
			listGoogleMeetRecordings({
				accessToken: params.accessToken,
				conferenceRecord: conferenceRecord.name,
				pageSize: params.pageSize
			}),
			listGoogleMeetTranscripts({
				accessToken: params.accessToken,
				conferenceRecord: conferenceRecord.name,
				pageSize: params.pageSize
			}),
			listGoogleMeetSmartNotes({
				accessToken: params.accessToken,
				conferenceRecord: conferenceRecord.name,
				pageSize: params.pageSize
			}).then((smartNotes) => ({ smartNotes })).catch((error) => ({
				smartNotes: [],
				smartNotesError: formatErrorMessage(error)
			}))
		]);
		const transcriptEntries = params.includeTranscriptEntries === false ? [] : await Promise.all(transcripts.map(async (transcript) => {
			try {
				return {
					transcript: transcript.name,
					entries: await listGoogleMeetTranscriptEntries({
						accessToken: params.accessToken,
						transcript: transcript.name,
						pageSize: params.pageSize
					})
				};
			} catch (error) {
				return {
					transcript: transcript.name,
					entries: [],
					entriesError: formatErrorMessage(error)
				};
			}
		}));
		return {
			conferenceRecord,
			participants,
			recordings,
			transcripts: params.includeDocumentBodies === true ? await Promise.all(transcripts.map((transcript) => attachDocumentText({
				accessToken: params.accessToken,
				resource: transcript
			}))) : transcripts,
			transcriptEntries,
			smartNotes: params.includeDocumentBodies === true ? await Promise.all(smartNotesResult.smartNotes.map((smartNote) => attachDocumentText({
				accessToken: params.accessToken,
				resource: smartNote
			}))) : smartNotesResult.smartNotes,
			...smartNotesResult.smartNotesError ? { smartNotesError: smartNotesResult.smartNotesError } : {}
		};
	}));
	return {
		input: resolved.input,
		space: resolved.space,
		conferenceRecords: resolved.conferenceRecords,
		artifacts
	};
}
async function fetchGoogleMeetAttendance(params) {
	const resolved = await resolveConferenceRecordQuery(params);
	const nestedRows = await Promise.all(resolved.conferenceRecords.map(async (conferenceRecord) => {
		const participants = await listGoogleMeetParticipants({
			accessToken: params.accessToken,
			conferenceRecord: conferenceRecord.name,
			pageSize: params.pageSize
		});
		return mergeAttendanceRows(await Promise.all(participants.map(async (participant) => ({
			conferenceRecord: conferenceRecord.name,
			participant: participant.name,
			displayName: getParticipantDisplayName(participant),
			user: getParticipantUser(participant),
			earliestStartTime: participant.earliestStartTime,
			latestEndTime: participant.latestEndTime,
			sessions: await listGoogleMeetParticipantSessions({
				accessToken: params.accessToken,
				participant: participant.name,
				pageSize: params.pageSize
			})
		}))), conferenceRecord, params);
	}));
	return {
		input: resolved.input,
		space: resolved.space,
		conferenceRecords: resolved.conferenceRecords,
		attendance: nestedRows.flat()
	};
}
function buildGoogleMeetPreflightReport(params) {
	const blockers = [];
	if (!params.previewAcknowledged) blockers.push("Set preview.enrollmentAcknowledged=true after confirming your Cloud project, OAuth principal, and meeting participants are enrolled in the Google Workspace Developer Preview Program.");
	return {
		input: params.input,
		resolvedSpaceName: params.space.name,
		meetingCode: params.space.meetingCode,
		meetingUri: params.space.meetingUri,
		hasActiveConference: Boolean(params.space.activeConference),
		previewAcknowledged: params.previewAcknowledged,
		tokenSource: params.tokenSource,
		blockers
	};
}
//#endregion
//#region extensions/google-meet/src/plugin-helpers.ts
var plugin_helpers_exports = /* @__PURE__ */ __exportAll({
	buildGoogleMeetCalendarDayWindow: () => buildGoogleMeetCalendarDayWindow,
	buildGoogleMeetPreflightReport: () => buildGoogleMeetPreflightReport,
	createAndJoinMeetFromParams: () => createAndJoinMeetFromParams,
	createMeetFromParams: () => createMeetFromParams,
	endGoogleMeetActiveConference: () => endGoogleMeetActiveConference,
	exportGoogleMeetBundleFromParams: () => exportGoogleMeetBundleFromParams,
	fetchLatestGoogleMeetConferenceRecord: () => fetchLatestGoogleMeetConferenceRecord,
	fetchResolvedGoogleMeetArtifacts: () => fetchResolvedGoogleMeetArtifacts,
	fetchResolvedGoogleMeetAttendance: () => fetchResolvedGoogleMeetAttendance,
	listGoogleMeetCalendarEvents: () => listGoogleMeetCalendarEvents,
	resolveArtifactQueryFromParams: () => resolveArtifactQueryFromParams,
	resolveGoogleMeetTokenFromParams: () => resolveGoogleMeetTokenFromParams,
	resolveMeetingFromParams: () => resolveMeetingFromParams,
	resolveSpaceFromParams: () => resolveSpaceFromParams
});
const loadGoogleMeetCreateModule = createLazyRuntimeModule(() => import("./create-CG9Pgwsb.mjs").then((n) => n.t));
async function createMeetFromParams(params) {
	return (await loadGoogleMeetCreateModule()).createMeetFromParams(params);
}
async function createAndJoinMeetFromParams(params) {
	return (await loadGoogleMeetCreateModule()).createAndJoinMeetFromParams(params);
}
async function resolveGoogleMeetTokenFromParams(config, raw) {
	const { resolveGoogleMeetAccessToken } = await import("./oauth-22Ey-zCb.mjs");
	return resolveGoogleMeetAccessToken({
		clientId: normalizeOptionalString(raw.clientId) ?? config.oauth.clientId,
		clientSecret: normalizeOptionalString(raw.clientSecret) ?? config.oauth.clientSecret,
		refreshToken: normalizeOptionalString(raw.refreshToken) ?? config.oauth.refreshToken,
		accessToken: normalizeOptionalString(raw.accessToken) ?? config.oauth.accessToken,
		expiresAt: typeof raw.expiresAt === "number" ? raw.expiresAt : config.oauth.expiresAt
	});
}
function wantsCalendarLookup(raw) {
	return raw.today === true || Boolean(normalizeOptionalString(raw.event));
}
async function resolveMeetingFromParams(params) {
	if (wantsCalendarLookup(params.raw)) {
		const window = params.raw.today === true ? buildGoogleMeetCalendarDayWindow() : {};
		const calendarEvent = await findGoogleMeetCalendarEvent({
			accessToken: params.accessToken,
			calendarId: normalizeOptionalString(params.raw.calendarId),
			eventQuery: normalizeOptionalString(params.raw.event),
			...window
		});
		return {
			meeting: calendarEvent.meetingUri,
			calendarEvent
		};
	}
	return { meeting: resolveMeetingInput(params.config, params.raw.meeting) };
}
async function resolveSpaceFromParams(config, raw) {
	const token = await resolveGoogleMeetTokenFromParams(config, raw);
	const { meeting, calendarEvent } = await resolveMeetingFromParams({
		config,
		raw,
		accessToken: token.accessToken
	});
	return {
		meeting,
		token,
		space: await fetchGoogleMeetSpace({
			accessToken: token.accessToken,
			meeting
		}),
		calendarEvent
	};
}
async function resolveArtifactQueryFromParams(config, raw) {
	const meeting = normalizeOptionalString(raw.meeting) ?? config.defaults.meeting;
	const conferenceRecord = normalizeOptionalString(raw.conferenceRecord);
	const token = await resolveGoogleMeetTokenFromParams(config, raw);
	const resolvedMeeting = conferenceRecord ? { meeting } : wantsCalendarLookup(raw) ? await resolveMeetingFromParams({
		config,
		raw,
		accessToken: token.accessToken
	}) : { meeting };
	if (!resolvedMeeting.meeting && !conferenceRecord) throw new Error("Meeting input, calendar lookup, or conferenceRecord required");
	return {
		token,
		meeting: resolvedMeeting.meeting,
		calendarEvent: resolvedMeeting.calendarEvent,
		conferenceRecord,
		pageSize: readPositiveIntegerParam(raw, "pageSize"),
		includeTranscriptEntries: raw.includeTranscriptEntries !== false,
		includeDocumentBodies: raw.includeDocumentBodies === true,
		allConferenceRecords: raw.includeAllConferenceRecords === true,
		mergeDuplicateParticipants: raw.mergeDuplicateParticipants !== false,
		lateAfterMinutes: readPositiveIntegerParam(raw, "lateAfterMinutes"),
		earlyBeforeMinutes: readPositiveIntegerParam(raw, "earlyBeforeMinutes")
	};
}
function fetchResolvedGoogleMeetArtifacts(query) {
	return fetchGoogleMeetArtifacts({
		accessToken: query.token.accessToken,
		meeting: query.meeting,
		conferenceRecord: query.conferenceRecord,
		pageSize: query.pageSize,
		includeTranscriptEntries: query.includeTranscriptEntries,
		includeDocumentBodies: query.includeDocumentBodies,
		allConferenceRecords: query.allConferenceRecords
	});
}
function fetchResolvedGoogleMeetAttendance(query) {
	return fetchGoogleMeetAttendance({
		accessToken: query.token.accessToken,
		meeting: query.meeting,
		conferenceRecord: query.conferenceRecord,
		pageSize: query.pageSize,
		allConferenceRecords: query.allConferenceRecords,
		mergeDuplicateParticipants: query.mergeDuplicateParticipants,
		lateAfterMinutes: query.lateAfterMinutes,
		earlyBeforeMinutes: query.earlyBeforeMinutes
	});
}
async function exportGoogleMeetBundleFromParams(config, raw) {
	const resolved = await resolveArtifactQueryFromParams(config, raw);
	const [artifacts, attendance] = await Promise.all([fetchResolvedGoogleMeetArtifacts(resolved), fetchResolvedGoogleMeetAttendance(resolved)]);
	const { buildGoogleMeetExportManifest, googleMeetExportFileNames, writeMeetExportBundle } = await loadGoogleMeetCliModule();
	const calendarId = normalizeOptionalString(raw.calendarId);
	const request = {
		...resolved.meeting ? { meeting: resolved.meeting } : {},
		...resolved.conferenceRecord ? { conferenceRecord: resolved.conferenceRecord } : {},
		...resolved.calendarEvent?.event.id ? { calendarEventId: resolved.calendarEvent.event.id } : {},
		...resolved.calendarEvent?.event.summary ? { calendarEventSummary: resolved.calendarEvent.event.summary } : {},
		...calendarId ? { calendarId } : {},
		...resolved.pageSize !== void 0 ? { pageSize: resolved.pageSize } : {},
		includeTranscriptEntries: resolved.includeTranscriptEntries,
		includeDocumentBodies: resolved.includeDocumentBodies,
		allConferenceRecords: resolved.allConferenceRecords,
		mergeDuplicateParticipants: resolved.mergeDuplicateParticipants,
		...resolved.lateAfterMinutes !== void 0 ? { lateAfterMinutes: resolved.lateAfterMinutes } : {},
		...resolved.earlyBeforeMinutes !== void 0 ? { earlyBeforeMinutes: resolved.earlyBeforeMinutes } : {}
	};
	const tokenSource = resolved.token.refreshed ? "refresh-token" : "cached-access-token";
	if (raw.dryRun === true) return {
		dryRun: true,
		manifest: buildGoogleMeetExportManifest({
			artifacts,
			attendance,
			files: googleMeetExportFileNames(),
			request,
			tokenSource,
			...resolved.calendarEvent ? { calendarEvent: resolved.calendarEvent } : {}
		}),
		...resolved.calendarEvent ? { calendarEvent: resolved.calendarEvent } : {},
		tokenSource
	};
	const outputDir = normalizeOptionalString(raw.outputDir) ?? normalizeOptionalString(raw.output);
	return {
		...await writeMeetExportBundle({
			...outputDir ? { outputDir } : {},
			artifacts,
			attendance,
			zip: raw.zip === true,
			request,
			tokenSource,
			...resolved.calendarEvent ? { calendarEvent: resolved.calendarEvent } : {}
		}),
		...resolved.calendarEvent ? { calendarEvent: resolved.calendarEvent } : {},
		tokenSource
	};
}
//#endregion
export { resolveGoogleMeetTokenFromParams as a, buildGoogleMeetPreflightReport as c, fetchGoogleMeetSpace as d, fetchLatestGoogleMeetConferenceRecord as f, __exportAll as h, resolveArtifactQueryFromParams as i, createGoogleMeetSpace as l, listGoogleMeetCalendarEvents as m, fetchResolvedGoogleMeetAttendance as n, resolveMeetingFromParams as o, buildGoogleMeetCalendarDayWindow as p, plugin_helpers_exports as r, resolveSpaceFromParams as s, fetchResolvedGoogleMeetArtifacts as t, endGoogleMeetActiveConference as u };
