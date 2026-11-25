import { r as resolveGoogleMeetConfig } from "./config-CMTw0Anh.mjs";
import { m as resolveMeetingInput } from "./plugin-registration-DKu55NBZ.mjs";
import { n as requestGoogleApi, t as readGoogleApiErrorDetail } from "./google-api-B5FR9zy2.mjs";
import { t as normalizeMeetUrl } from "./meet-url-DzLdrq0Z.mjs";
import { normalizeOptionalString, readNonBlankString, uniqueStrings } from "openclaw/plugin-sdk/string-coerce-runtime";
import { formatErrorMessage } from "openclaw/plugin-sdk/error-runtime";
import { createLazyRuntimeModule } from "openclaw/plugin-sdk/lazy-runtime";
import { MAX_DATE_TIMESTAMP_MS, parseDateStringTimestampMs, resolveDateTimestampMs, resolveExpiresAtMsFromDurationSeconds, timestampMsToIsoString } from "openclaw/plugin-sdk/number-runtime";
import { readPositiveIntegerParam } from "openclaw/plugin-sdk/channel-actions";
import { readProviderJsonResponse, readProviderTextResponse } from "openclaw/plugin-sdk/provider-http";
import { fetchWithSsrFGuard } from "openclaw/plugin-sdk/ssrf-runtime";
import { isDeepStrictEqual } from "node:util";
import { parseOAuthCallbackInput, waitForLocalOAuthCallback } from "openclaw/plugin-sdk/provider-auth-runtime";
import { createHash, randomUUID } from "node:crypto";
import { createOAuthRefreshError, createOAuthRefreshResponseError, isRecoverableOAuthRefreshFailure, readOAuthRefreshErrorReason } from "openclaw/plugin-sdk/provider-oauth-runtime";
// extensions/google-meet/src/calendar.ts
const GOOGLE_CALENDAR_API_BASE_URL = "https://www.googleapis.com/calendar/v3";
const GOOGLE_CALENDAR_API_HOST = "www.googleapis.com";
const GOOGLE_CALENDAR_EVENTS_SCOPE = "https://www.googleapis.com/auth/calendar.events.readonly";
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
	return findFirstGoogleMeetCalendarUri(entryPoints, (entry) => entry.entryPointType === "video") ?? findFirstGoogleMeetCalendarUri(entryPoints) ?? extractGoogleMeetUriFromText(event.location) ?? extractGoogleMeetUriFromText(event.description);
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
function rankCalendarEvent(event, nowMs) {
	const startMs = parseDateStringTimestampMs(event.start?.dateTime ?? event.start?.date) ?? Number.POSITIVE_INFINITY;
	const endMs = parseDateStringTimestampMs(event.end?.dateTime ?? event.end?.date) ?? startMs;
	if (startMs <= nowMs && endMs >= nowMs) return 0;
	if (startMs > nowMs) return startMs - nowMs;
	return nowMs - startMs + 2592e6;
}
async function fetchGoogleCalendarEvents(params) {
	const calendarId = params.calendarId?.trim() || "primary";
	const now = /* @__PURE__ */ new Date();
	const defaultTimeMax = new Date(now);
	defaultTimeMax.setDate(defaultTimeMax.getDate() + 7);
	const events = [];
	let pageToken;
	do
		pageToken = await requestGoogleApi({
			url: `${GOOGLE_CALENDAR_API_BASE_URL}/calendars/${encodeURIComponent(calendarId)}/events`,
			query: {
				maxResults: 50,
				orderBy: "startTime",
				q: params.eventQuery?.trim() || void 0,
				showDeleted: false,
				singleEvents: true,
				timeMin: params.timeMin ?? now.toISOString(),
				timeMax: params.timeMax ?? defaultTimeMax.toISOString(),
				pageToken
			},
			accessToken: params.accessToken,
			allowedHostname: GOOGLE_CALENDAR_API_HOST,
			auditContext: "google-meet.calendar.events.list",
			prefix: "Google Calendar events.list",
			scopes: [GOOGLE_CALENDAR_EVENTS_SCOPE]
		}, async (response) => {
			const payload = await readProviderJsonResponse(response, "Google Calendar events.list");
			if (payload.items !== void 0 && !Array.isArray(payload.items)) throw new Error("Google Calendar events.list response had non-array items");
			events.push(...payload.items ?? []);
			return payload.nextPageToken;
		});
	while (pageToken);
	return {
		calendarId,
		events,
		now
	};
}
async function listGoogleMeetCalendarEvents(params) {
	const { calendarId, events, now } = await fetchGoogleCalendarEvents(params);
	const meetEvents = [];
	let best;
	let bestRank = Number.POSITIVE_INFINITY;
	for (const event of events) {
		const meetingUri = extractGoogleMeetUriFromCalendarEvent(event);
		if (!meetingUri) continue;
		meetEvents.push({
			event,
			meetingUri,
			selected: false
		});
		if (event.status !== "cancelled") {
			const rank = rankCalendarEvent(event, now.getTime());
			if (!best || rank < bestRank) {
				best = event;
				bestRank = rank;
			}
		}
	}
	for (const entry of meetEvents) entry.selected = entry.event === best;
	return {
		calendarId,
		events: meetEvents
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
// extensions/google-meet/src/meet-api.ts
const GOOGLE_MEET_API_BASE_URL = "https://meet.googleapis.com/v2";
const GOOGLE_MEET_URL_HOST = "meet.google.com";
const GOOGLE_MEET_API_HOST = "meet.googleapis.com";
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
function assertResourceArray(value, key, context) {
	if (value === void 0) return [];
	if (!Array.isArray(value)) throw new Error(`Google Meet ${context} response had non-array ${key}`);
	const resources = value;
	for (const resource of resources) if (!resource.name?.trim()) throw new Error(`Google Meet ${context} response included a resource without name`);
	return resources;
}
function requestGoogleMeetApi(params, read) {
	return requestGoogleApi({
		url: `${GOOGLE_MEET_API_BASE_URL}/${params.path}`,
		query: params.query,
		accessToken: params.accessToken,
		allowedHostname: GOOGLE_MEET_API_HOST,
		auditContext: `google-meet.${params.operation}`,
		prefix: `Google Meet ${params.operation}`,
		scopes: params.scopes ?? [GOOGLE_MEET_MEDIA_SCOPE],
		init: {
			method: params.method,
			body: params.body
		}
	}, read);
}
function fetchGoogleMeetJson(params) {
	return requestGoogleMeetApi(params, (response) => readProviderJsonResponse(response, `Google Meet ${params.operation}`));
}
async function listGoogleMeetCollection(params) {
	const items = [];
	const seenPageTokens = /* @__PURE__ */ new Set();
	let pageToken;
	do {
		const payload = await fetchGoogleMeetJson({
			...params,
			query: {
				...params.query,
				pageToken
			}
		});
		const pageItems = assertResourceArray(payload[params.collectionKey], params.collectionKey, `Google Meet ${params.operation}`);
		const remaining = params.maxItems !== void 0 ? Math.max(params.maxItems - items.length, 0) : void 0;
		items.push(...remaining === void 0 ? pageItems : pageItems.slice(0, remaining));
		if (params.maxItems !== void 0 && items.length >= params.maxItems) break;
		pageToken = typeof payload.nextPageToken === "string" ? payload.nextPageToken : void 0;
		if (pageToken && seenPageTokens.has(pageToken)) throw new Error(`Google Meet ${params.operation} repeated nextPageToken; retry later.`);
		if (pageToken) seenPageTokens.add(pageToken);
	} while (pageToken);
	return items;
}
async function fetchGoogleMeetSpace(params) {
	const name = normalizeGoogleMeetSpaceName(params.meeting);
	const payload = await fetchGoogleMeetJson({
		accessToken: params.accessToken,
		path: encodeResourceNameForPath(name),
		operation: "spaces.get",
		scopes: [GOOGLE_MEET_SPACE_SCOPE]
	});
	if (!payload.name?.trim()) throw new Error("Google Meet spaces.get response was missing name");
	return payload;
}
async function createGoogleMeetSpace(params) {
	const hasConfig = params.config && Object.keys(params.config).length > 0;
	const payload = await fetchGoogleMeetJson({
		accessToken: params.accessToken,
		path: "spaces",
		method: "POST",
		body: hasConfig ? JSON.stringify({ config: params.config }) : "{}",
		operation: "spaces.create",
		scopes: hasConfig ? [GOOGLE_MEET_SPACE_CREATED_SCOPE, GOOGLE_MEET_SPACE_SETTINGS_SCOPE] : [GOOGLE_MEET_SPACE_CREATED_SCOPE]
	});
	if (!payload.name?.trim()) throw new Error("Google Meet spaces.create response was missing name");
	const meetingUri = payload.meetingUri?.trim();
	if (!meetingUri) throw new Error("Google Meet spaces.create response was missing meetingUri");
	return {
		space: payload,
		meetingUri
	};
}
async function endGoogleMeetActiveConference(params) {
	const space = (await fetchGoogleMeetSpace(params)).name;
	await requestGoogleMeetApi({
		accessToken: params.accessToken,
		path: `${encodeResourceNameForPath(space)}:endActiveConference`,
		method: "POST",
		body: "{}",
		operation: "spaces.endActiveConference",
		scopes: [GOOGLE_MEET_SPACE_CREATED_SCOPE]
	}, async () => void 0);
	return {
		space,
		ended: true
	};
}
async function fetchGoogleMeetConferenceRecord(params) {
	const name = normalizeConferenceRecordName(params.conferenceRecord);
	const payload = await fetchGoogleMeetJson({
		accessToken: params.accessToken,
		path: encodeResourceNameForPath(name),
		operation: "conferenceRecords.get"
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
		operation: "conferenceRecords.list"
	});
}
async function fetchLatestGoogleMeetConferenceRecord(params) {
	const space = await fetchGoogleMeetSpace(params);
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
function listGoogleMeetConferenceResources(collection, params) {
	const parent = normalizeConferenceRecordName(params.conferenceRecord);
	return listGoogleMeetCollection({
		accessToken: params.accessToken,
		path: `${encodeResourceNameForPath(parent)}/${collection}`,
		collectionKey: collection,
		query: { pageSize: params.pageSize },
		operation: `conferenceRecords.${collection}.list`
	});
}
async function listGoogleMeetParticipantSessions(params) {
	return listGoogleMeetCollection({
		accessToken: params.accessToken,
		path: `${encodeResourceNameForPath(params.participant)}/participantSessions`,
		collectionKey: "participantSessions",
		query: { pageSize: params.pageSize },
		operation: "conferenceRecords.participants.participantSessions.list"
	});
}
async function listGoogleMeetTranscriptEntries(params) {
	return listGoogleMeetCollection({
		accessToken: params.accessToken,
		path: `${encodeResourceNameForPath(params.transcript)}/entries`,
		collectionKey: "transcriptEntries",
		query: { pageSize: params.pageSize },
		operation: "conferenceRecords.transcripts.entries.list"
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
// extensions/google-meet/src/drive.ts
const GOOGLE_DRIVE_API_BASE_URL = "https://www.googleapis.com/drive/v3";
const GOOGLE_DRIVE_API_HOST = "www.googleapis.com";
const GOOGLE_DRIVE_MEET_SCOPE = "https://www.googleapis.com/auth/drive.meet.readonly";
const TEXT_PLAIN_MIME = "text/plain";
function extractGoogleDriveDocumentId(value) {
	if (typeof value !== "string") return;
	const trimmed = value.trim();
	if (!trimmed) return;
	if (/^https?:\/\//i.test(trimmed)) return URL.parse(trimmed)?.pathname.match(/\/document\/d\/([^/]+)/)?.[1];
	return trimmed.split("/").filter(Boolean).at(-1);
}
async function exportGoogleDriveDocumentText(params) {
	return requestGoogleApi({
		url: `${GOOGLE_DRIVE_API_BASE_URL}/files/${encodeURIComponent(params.documentId)}/export`,
		query: { mimeType: TEXT_PLAIN_MIME },
		accessToken: params.accessToken,
		allowedHostname: GOOGLE_DRIVE_API_HOST,
		auditContext: "google-meet.drive.files.export",
		prefix: "Google Drive files.export",
		scopes: [GOOGLE_DRIVE_MEET_SCOPE],
		accept: TEXT_PLAIN_MIME
	}, (response) => readProviderTextResponse(response, "Google Drive files.export"));
}
// extensions/google-meet/src/meet.ts
async function attachDocumentText(accessToken, resource) {
	const destination = resource.docsDestination;
	const documentId = extractGoogleDriveDocumentId(destination?.document) ?? extractGoogleDriveDocumentId(destination?.documentId) ?? extractGoogleDriveDocumentId(destination?.file);
	if (!documentId) return resource;
	try {
		return {
			...resource,
			documentText: await exportGoogleDriveDocumentText({
				accessToken,
				documentId
			})
		};
	} catch (error) {
		return {
			...resource,
			documentTextError: formatErrorMessage(error)
		};
	}
}
function timestampBound(values, bound) {
	const parsed = values.map(parseDateStringTimestampMs).filter((value) => value !== void 0);
	return parsed.length > 0 ? timestampMsToIsoString(bound(...parsed)) : void 0;
}
function decorateAttendanceRow(row, conferenceRecord, params) {
	const sessions = row.sessions.toSorted((left, right) => (parseDateStringTimestampMs(left.startTime) ?? 0) - (parseDateStringTimestampMs(right.startTime) ?? 0));
	const firstJoinTime = timestampBound([row.earliestStartTime, ...sessions.map((session) => session.startTime)], Math.min);
	const lastLeaveTime = timestampBound([row.latestEndTime, ...sessions.map((session) => session.endTime)], Math.max);
	const conferenceStartMs = parseDateStringTimestampMs(conferenceRecord.startTime);
	const conferenceEndMs = parseDateStringTimestampMs(conferenceRecord.endTime);
	const firstJoinMs = parseDateStringTimestampMs(firstJoinTime);
	const lastLeaveMs = parseDateStringTimestampMs(lastLeaveTime);
	const sessionTotal = sessions.reduce((total, session) => {
		const startMs = parseDateStringTimestampMs(session.startTime);
		const endMs = parseDateStringTimestampMs(session.endTime);
		return startMs !== void 0 && endMs !== void 0 && endMs > startMs ? total + (endMs - startMs) : total;
	}, 0);
	const durationMs = sessionTotal > 0 ? sessionTotal : firstJoinMs !== void 0 && lastLeaveMs !== void 0 && lastLeaveMs > firstJoinMs ? lastLeaveMs - firstJoinMs : void 0;
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
		const key = (row.user ?? row.displayName ?? row.participant).trim().toLocaleLowerCase();
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
		existing.earliestStartTime = timestampBound([existing.earliestStartTime, row.earliestStartTime], Math.min);
		existing.latestEndTime = timestampBound([existing.latestEndTime, row.latestEndTime], Math.max);
	}
	return [...grouped.values()].map((row) => decorateAttendanceRow(row, conferenceRecord, params));
}
async function fetchGoogleMeetArtifacts(params) {
	const resolved = await resolveConferenceRecordQuery(params);
	const artifacts = await Promise.all(resolved.conferenceRecords.map(async (conferenceRecord) => {
		const query = {
			accessToken: params.accessToken,
			conferenceRecord: conferenceRecord.name,
			pageSize: params.pageSize
		};
		const [participants, recordings, transcripts, smartNotesResult] = await Promise.all([
			listGoogleMeetConferenceResources("participants", query),
			listGoogleMeetConferenceResources("recordings", query),
			listGoogleMeetConferenceResources("transcripts", query),
			listGoogleMeetConferenceResources("smartNotes", query).then((smartNotes) => ({ smartNotes })).catch((error) => ({
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
			transcripts: params.includeDocumentBodies === true ? await Promise.all(transcripts.map((transcript) => attachDocumentText(params.accessToken, transcript))) : transcripts,
			transcriptEntries,
			smartNotes: params.includeDocumentBodies === true ? await Promise.all(smartNotesResult.smartNotes.map((smartNote) => attachDocumentText(params.accessToken, smartNote))) : smartNotesResult.smartNotes,
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
		const participants = await listGoogleMeetConferenceResources("participants", {
			accessToken: params.accessToken,
			conferenceRecord: conferenceRecord.name,
			pageSize: params.pageSize
		});
		return mergeAttendanceRows(await Promise.all(participants.map(async (participant) => ({
			conferenceRecord: conferenceRecord.name,
			participant: participant.name,
			displayName: participant.signedinUser?.displayName ?? participant.anonymousUser?.displayName ?? participant.phoneUser?.displayName,
			user: participant.signedinUser?.user,
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
// extensions/google-meet/src/oauth.ts
const GOOGLE_MEET_REDIRECT_URI = "http://localhost:8085/oauth2callback";
const GOOGLE_MEET_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
const GOOGLE_MEET_TOKEN_URL = "https://oauth2.googleapis.com/token";
const GOOGLE_MEET_TOKEN_HOST = "oauth2.googleapis.com";
const GOOGLE_MEET_DEFAULT_TOKEN_LIFETIME_SECONDS = 3600;
const GOOGLE_OAUTH_TOKEN_JSON_MAX_BYTES = 262144;
const GOOGLE_OAUTH_REQUEST_TIMEOUT_MS = 3e4;
const GOOGLE_MEET_SCOPES = [
	"https://www.googleapis.com/auth/meetings.space.created",
	"https://www.googleapis.com/auth/meetings.space.readonly",
	"https://www.googleapis.com/auth/meetings.space.settings",
	"https://www.googleapis.com/auth/meetings.conference.media.readonly",
	"https://www.googleapis.com/auth/calendar.events.readonly",
	"https://www.googleapis.com/auth/drive.meet.readonly"
];
function resolveGoogleMeetTokenExpiresAt(value) {
	const now = resolveDateTimestampMs(Date.now());
	if (typeof value === "number" && Number.isFinite(value) && value <= 0) return now;
	return resolveExpiresAtMsFromDurationSeconds(value, { nowMs: now }) ?? resolveExpiresAtMsFromDurationSeconds(GOOGLE_MEET_DEFAULT_TOKEN_LIFETIME_SECONDS, { nowMs: now }) ?? now;
}
function buildGoogleMeetAuthUrl(params) {
	const search = new URLSearchParams({
		client_id: params.clientId,
		response_type: "code",
		redirect_uri: GOOGLE_MEET_REDIRECT_URI,
		scope: GOOGLE_MEET_SCOPES.join(" "),
		code_challenge: params.challenge,
		code_challenge_method: "S256",
		access_type: "offline",
		prompt: "consent",
		state: params.state
	});
	return `${GOOGLE_MEET_AUTH_URL}?${search.toString()}`;
}
async function executeGoogleTokenRequest(body) {
	const refreshing = body.get("grant_type") === "refresh_token";
	let dispatched = false;
	const { response, release } = await fetchWithSsrFGuard({
		beforeRequest: () => {
			dispatched = true;
		},
		url: GOOGLE_MEET_TOKEN_URL,
		init: {
			method: "POST",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
				Accept: "application/json"
			},
			body
		},
		policy: { allowedHostnames: [GOOGLE_MEET_TOKEN_HOST] },
		auditContext: "google-meet.oauth.token",
		timeoutMs: GOOGLE_OAUTH_REQUEST_TIMEOUT_MS
	}).catch((cause) => {
		if (!refreshing) throw cause;
		throw createOAuthRefreshError("Google Meet OAuth refresh transport failed", dispatched ? {
			version: 1,
			phase: "token-response",
			outcome: "unchanged",
			recovery: {
				kind: "later",
				evidence: "documented-reusable-grant"
			}
		} : {
			version: 1,
			phase: "before-dispatch",
			outcome: "not-attempted",
			recovery: {
				kind: "later",
				evidence: "dispatch-not-started"
			}
		}, { cause });
	});
	try {
		if (!response.ok && !refreshing) {
			const detail = await readGoogleApiErrorDetail(response);
			throw new Error(`Google OAuth token request failed (${response.status}): ${detail}`);
		}
		let payload;
		try {
			payload = await readProviderJsonResponse(response, "Google OAuth token", { maxBytes: GOOGLE_OAUTH_TOKEN_JSON_MAX_BYTES });
		} catch (cause) {
			if (!refreshing) throw cause;
			if (!response.ok) throw createOAuthRefreshResponseError("Google Meet OAuth refresh", response.status, void 0, "documented-reusable-grant");
			throw createOAuthRefreshError(cause instanceof Error && cause.message.startsWith("Google OAuth token:") ? cause.message : "Google Meet OAuth refresh response could not be read", {
				version: 1,
				phase: "token-response",
				outcome: "unchanged",
				recovery: {
					kind: "later",
					evidence: "documented-reusable-grant"
				}
			}, { cause });
		}
		if (refreshing && (!response.ok || readOAuthRefreshErrorReason(payload))) throw createOAuthRefreshResponseError("Google Meet OAuth refresh", response.status, payload, "documented-reusable-grant");
		const accessToken = typeof payload?.access_token === "string" ? payload.access_token.trim() : void 0;
		if (!accessToken) throw createOAuthRefreshError("Google OAuth token response was missing access_token", {
			version: 1,
			phase: "after-token-response",
			outcome: "unknown",
			status: response.status
		});
		if (refreshing && payload.refresh_token !== void 0 && (typeof payload.refresh_token !== "string" || !payload.refresh_token.trim())) throw createOAuthRefreshError("Google Meet OAuth refresh returned an invalid refresh_token", {
			version: 1,
			phase: "after-token-response",
			outcome: "unknown",
			status: response.status
		});
		return {
			accessToken,
			expiresAt: resolveGoogleMeetTokenExpiresAt(payload.expires_in),
			refreshToken: typeof payload.refresh_token === "string" ? payload.refresh_token.trim() || void 0 : void 0,
			scope: typeof payload.scope === "string" ? payload.scope.trim() || void 0 : void 0,
			tokenType: typeof payload.token_type === "string" ? payload.token_type.trim() || void 0 : void 0
		};
	} finally {
		await release();
	}
}
function tokenRequestBody(values) {
	const body = new URLSearchParams();
	for (const [key, value] of Object.entries(values)) if (value?.trim()) body.set(key, value);
	return body;
}
async function exchangeGoogleMeetAuthCode(params) {
	return await executeGoogleTokenRequest(tokenRequestBody({
		client_id: params.clientId,
		client_secret: params.clientSecret,
		code: params.code,
		grant_type: "authorization_code",
		redirect_uri: GOOGLE_MEET_REDIRECT_URI,
		code_verifier: params.verifier
	}));
}
async function refreshGoogleMeetAccessToken(params) {
	return await executeGoogleTokenRequest(tokenRequestBody({
		client_id: params.clientId,
		client_secret: params.clientSecret,
		grant_type: "refresh_token",
		refresh_token: params.refreshToken
	}));
}
function shouldUseCachedGoogleMeetAccessToken(params) {
	const now = Date.now();
	return Boolean(params.accessToken?.trim() && typeof params.expiresAt === "number" && Number.isFinite(params.expiresAt) && params.expiresAt <= MAX_DATE_TIMESTAMP_MS && params.expiresAt > now + 6e4);
}
async function resolveGoogleMeetAccessToken(params) {
	if (params.accessToken && shouldUseCachedGoogleMeetAccessToken(params)) return {
		accessToken: params.accessToken.trim(),
		expiresAt: params.expiresAt,
		refreshed: false
	};
	if (!params.clientId?.trim() || !params.refreshToken?.trim()) throw new Error("Missing Google Meet OAuth credentials. Configure oauth.clientId and oauth.refreshToken, or pass --client-id and --refresh-token.");
	const refreshed = await refreshGoogleMeetAccessToken({
		clientId: params.clientId,
		clientSecret: params.clientSecret,
		refreshToken: params.refreshToken
	});
	if (refreshed.refreshToken && refreshed.refreshToken !== params.refreshToken) throw new Error("Google Meet refresh-token rotation requires a durable credential owner. Use the configured Google Meet plugin route, or reauthorize and save the replacement in the external credential owner.");
	return {
		accessToken: refreshed.accessToken,
		expiresAt: refreshed.expiresAt,
		refreshed: true
	};
}
function isLocalCallbackListenerError(error) {
	if (!(error instanceof Error)) return false;
	return error.message.includes("EADDRINUSE") || error.message.includes("port") || error.message.includes("listen");
}
async function waitForGoogleMeetAuthCode(params) {
	async function readManualGoogleMeetAuthCode() {
		const { state, promptInput } = params;
		const input = await promptInput("Paste the full redirect URL here: ");
		const parsed = parseOAuthCallbackInput(input, {
			missingState: "Missing 'state' parameter. Paste the full redirect URL.",
			invalidInput: "Paste the full redirect URL, not just the code."
		});
		if ("error" in parsed) throw new Error(parsed.error);
		if (parsed.state !== state) throw new Error("OAuth state mismatch - please try again");
		return parsed.code;
	}
	params.writeLine(`Open this URL in your browser:\n\n${params.authUrl}\n`);
	if (params.manual) return await readManualGoogleMeetAuthCode();
	try {
		return (await waitForLocalOAuthCallback({
			expectedState: params.state,
			timeoutMs: params.timeoutMs,
			port: 8085,
			callbackPath: "/oauth2callback",
			redirectUri: GOOGLE_MEET_REDIRECT_URI,
			successTitle: "Google Meet authorization received"
		})).code;
	} catch (error) {
		if (!isLocalCallbackListenerError(error)) throw error;
		params.writeLine("Local callback server failed. Switching to manual mode...");
		return await readManualGoogleMeetAuthCode();
	}
}
// extensions/google-meet/src/oauth-owner.ts
const tasks = /* @__PURE__ */ new WeakMap();
function lineageOf(oauth) {
	const grant = JSON.stringify([
		oauth.clientId,
		oauth.clientSecret,
		oauth.refreshToken,
		oauth.accessToken,
		oauth.expiresAt
	]);
	return createHash("sha256").update(grant).digest("hex");
}
/** Config identifies the grant; this plugin-owned row owns all later rotations. */
async function resolveManagedGoogleMeetAccessToken(oauth, runtime) {
	const lineage = lineageOf(oauth);
	const assertCurrent = () => {
		const entry = runtime.config.current().plugins?.entries?.["google-meet"];
		const current = resolveGoogleMeetConfig(entry?.config);
		if (entry?.enabled === false || !current.enabled) throw new Error("Google Meet is disabled; enable it before using its OAuth grant");
		if (lineageOf(current.oauth) !== lineage) throw new Error("Google Meet OAuth account changed; retry with its current configuration");
	};
	assertCurrent();
	const pending = tasks.get(runtime)?.get(lineage);
	if (pending) return await pending;
	const task = (async () => {
		if (!oauth.clientId || !oauth.refreshToken) {
			const { resolveGoogleMeetAccessToken } = await import("./oauth-De6zszVZ.mjs");
			return await resolveGoogleMeetAccessToken(oauth);
		}
		const store = runtime.state.openKeyedStoreV2({
			namespace: "oauth-credential",
			maxEntries: 1,
			overflowPolicy: "reject-new"
		}, { assertCurrent });
		let observed = await store.observe("current");
		if (observed.value?.lineage !== lineage) {
			const initialized = await store.compareAndApply("current", observed.comparison, {
				operation: "update",
				action: "set",
				value: {
					lineage,
					credential: {
						accessToken: oauth.accessToken,
						refreshToken: oauth.refreshToken,
						expiresAt: oauth.expiresAt
					}
				}
			});
			observed = initialized.status === "conflict" ? initialized.current : await store.observe("current");
		}
		assertCurrent();
		if (!observed.value || observed.value.lineage !== lineage || !("credential" in observed.value)) throw new Error("Google Meet OAuth refresh is pending or its outcome is uncertain; reauthorize the configured grant");
		const credential = observed.value.credential;
		if (credential.accessToken && shouldUseCachedGoogleMeetAccessToken(credential)) return {
			accessToken: credential.accessToken,
			expiresAt: credential.expiresAt,
			refreshed: false
		};
		const claimId = randomUUID();
		const claim = {
			lineage,
			credential,
			claim: claimId
		};
		if ((await store.compareAndApply("current", observed.comparison, {
			operation: "update",
			action: "set",
			value: claim
		})).status !== "applied") throw new Error("Google Meet OAuth grant changed before refresh; retry with the current owner");
		const settle = async (replacement) => {
			const current = await store.observe("current");
			if (!isDeepStrictEqual(current.value, claim)) throw new Error("Google Meet OAuth refresh owner changed before settlement");
			if ((await store.compareAndApply("current", current.comparison, {
				operation: "update",
				action: "set",
				value: {
					lineage,
					credential: replacement
				}
			})).status !== "applied") throw new Error("Google Meet OAuth refresh owner changed before settlement");
			assertCurrent();
		};
		assertCurrent();
		let refreshed;
		try {
			refreshed = await refreshGoogleMeetAccessToken({
				clientId: oauth.clientId,
				clientSecret: oauth.clientSecret,
				refreshToken: credential.refreshToken
			});
		} catch (error) {
			if (isRecoverableOAuthRefreshFailure(error)) await settle(credential);
			else {
				const current = await store.observe("current");
				if (isDeepStrictEqual(current.value, claim)) await store.compareAndApply("current", current.comparison, {
					operation: "update",
					action: "set",
					value: {
						lineage,
						claim: claimId
					}
				});
			}
			throw error;
		}
		await settle({
			accessToken: refreshed.accessToken,
			refreshToken: refreshed.refreshToken ?? credential.refreshToken,
			expiresAt: refreshed.expiresAt
		});
		return {
			accessToken: refreshed.accessToken,
			expiresAt: refreshed.expiresAt,
			refreshed: true
		};
	})();
	let owned = tasks.get(runtime);
	if (!owned) {
		owned = /* @__PURE__ */ new Map();
		tasks.set(runtime, owned);
	}
	owned.set(lineage, task);
	try {
		return await task;
	} finally {
		if (owned.get(lineage) === task) owned.delete(lineage);
	}
}
// extensions/google-meet/src/plugin-helpers.ts
const loadGoogleMeetExportModule = createLazyRuntimeModule(() => import("./cli-export-CtI-2PF5.mjs"));
async function resolveGoogleMeetTokenFromParams(config, raw, runtime) {
	const { resolveGoogleMeetAccessToken } = await import("./oauth-De6zszVZ.mjs");
	const oauth = {
		clientId: normalizeOptionalString(raw.clientId) ?? config.oauth.clientId,
		clientSecret: normalizeOptionalString(raw.clientSecret) ?? config.oauth.clientSecret,
		refreshToken: normalizeOptionalString(raw.refreshToken) ?? config.oauth.refreshToken,
		accessToken: normalizeOptionalString(raw.accessToken) ?? config.oauth.accessToken,
		expiresAt: typeof raw.expiresAt === "number" ? raw.expiresAt : config.oauth.expiresAt
	};
	const configured = isDeepStrictEqual(oauth, config.oauth);
	return runtime && configured ? resolveManagedGoogleMeetAccessToken(config.oauth, runtime) : resolveGoogleMeetAccessToken(oauth);
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
async function resolveSpaceFromParams(config, raw, runtime) {
	const token = await resolveGoogleMeetTokenFromParams(config, raw, runtime);
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
async function resolveArtifactQueryFromParams(config, raw, runtime) {
	const meeting = normalizeOptionalString(raw.meeting) ?? config.defaults.meeting;
	const conferenceRecord = normalizeOptionalString(raw.conferenceRecord);
	const token = await resolveGoogleMeetTokenFromParams(config, raw, runtime);
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
		...query,
		accessToken: query.token.accessToken
	});
}
function fetchResolvedGoogleMeetAttendance(query) {
	return fetchGoogleMeetAttendance({
		...query,
		accessToken: query.token.accessToken
	});
}
function buildGoogleMeetExportRequest(resolved, calendarId) {
	return {
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
}
async function exportGoogleMeetBundleFromParams(config, raw, runtime) {
	const resolved = await resolveArtifactQueryFromParams(config, raw, runtime);
	const [artifacts, attendance] = await Promise.all([fetchResolvedGoogleMeetArtifacts(resolved), fetchResolvedGoogleMeetAttendance(resolved)]);
	const { exportGoogleMeetBundle } = await loadGoogleMeetExportModule();
	return exportGoogleMeetBundle({
		artifacts,
		attendance,
		request: buildGoogleMeetExportRequest(resolved, normalizeOptionalString(raw.calendarId)),
		tokenSource: resolved.token.refreshed ? "refresh-token" : "cached-access-token",
		calendarEvent: resolved.calendarEvent,
		outputDir: readNonBlankString(raw.outputDir) ?? readNonBlankString(raw.output),
		zip: raw.zip === true,
		dryRun: raw.dryRun === true
	});
}
export { shouldUseCachedGoogleMeetAccessToken as a, buildGoogleMeetCalendarDayWindow, buildGoogleMeetExportRequest, buildGoogleMeetPreflightReport, fetchGoogleMeetSpace as c, endGoogleMeetActiveConference, exportGoogleMeetBundleFromParams, fetchLatestGoogleMeetConferenceRecord, fetchResolvedGoogleMeetArtifacts, fetchResolvedGoogleMeetAttendance, resolveGoogleMeetAccessToken as i, listGoogleMeetCalendarEvents, exchangeGoogleMeetAuthCode as n, waitForGoogleMeetAuthCode as o, refreshGoogleMeetAccessToken as r, resolveArtifactQueryFromParams, resolveGoogleMeetTokenFromParams, resolveMeetingFromParams, resolveSpaceFromParams, createGoogleMeetSpace as s, buildGoogleMeetAuthUrl as t };
