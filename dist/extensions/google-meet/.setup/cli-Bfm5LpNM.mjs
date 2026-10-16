import { a as resolveArtifactQueryFromParams, c as resolveSpaceFromParams, d as endGoogleMeetActiveConference, f as fetchGoogleMeetSpace, h as listGoogleMeetCalendarEvents, l as buildGoogleMeetPreflightReport, m as buildGoogleMeetCalendarDayWindow, n as fetchResolvedGoogleMeetArtifacts, o as resolveGoogleMeetTokenFromParams, p as fetchLatestGoogleMeetConferenceRecord, r as fetchResolvedGoogleMeetAttendance, s as resolveMeetingFromParams, t as buildGoogleMeetExportRequest, u as createGoogleMeetSpace } from "./plugin-helpers-D1OyyzEZ.mjs";
import { i as resolveGoogleMeetGatewayOperationTimeoutMs } from "./config-BXGAMntj.mjs";
import { C as writeStdoutJson, S as writeSetupStatus, _ as resolveGoogleMeetOAuthCallbackTimeoutMs, a as renderAttendanceCsv, b as writeLeaveResult, c as callGoogleMeetGateway, d as parseGoogleMeetTransport, f as parseOptionalNumber, g as resolveCliJoinRequest, h as promptInput, i as renderAttendance, l as parseGoogleMeetBrowserTransport, m as parsePositiveNumber, n as exportGoogleMeetBundle, o as writeCalendarEventsSummary, p as parsePositiveIntegerOption, r as renderArtifacts, s as writeLatestConferenceRecordSummary, u as parseGoogleMeetMode, v as writeCliOutput, w as writeStdoutLine, x as writeRecoverCurrentTabResult, y as writeDoctorStatus } from "./cli-export-BOebaVFW.mjs";
import { buildGoogleMeetAuthUrl, exchangeGoogleMeetAuthCode, resolveGoogleMeetAccessToken, waitForGoogleMeetAuthCode } from "./oauth-XgdPFWEJ.mjs";
import { n as hasCreateSpaceConfigInput, r as resolveCreateSpaceConfig } from "./create-DyYbmN11.mjs";
import { parseStrictNonNegativeInteger } from "openclaw/plugin-sdk/number-runtime";
import { callGatewayFromCli } from "openclaw/plugin-sdk/gateway-runtime";
import { generateHexPkceVerifierChallenge } from "openclaw/plugin-sdk/provider-auth";
import { generateOAuthState } from "openclaw/plugin-sdk/provider-auth-runtime";
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
async function callGoogleMeetRuntime(context, method, payload, local, timeoutMs) {
	const delegated = await callGoogleMeetGateway({
		callGateway: context.callGateway,
		method,
		payload,
		timeoutMs
	});
	return delegated.ok ? delegated.payload : local(await context.ensureRuntime());
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
	const { root } = context;
	addGoogleMeetArtifactOptions(root.command("artifacts").description("List Meet conference records and available participant/artifact metadata")).option("--no-transcript-entries", "Skip structured transcript entry lookup").option("--include-doc-bodies", "Export linked transcript and smart-note Google Docs text").option("--format <format>", "Output format: summary or markdown", "summary").option("--output <path>", "Write output to a file instead of stdout").option("--json", "Print JSON output", false).action(async (options) => {
		const resolved = await resolveCliArtifactQuery(context, options);
		const result = await fetchResolvedGoogleMeetArtifacts(resolved);
		const tokenSource = resolveTokenSource(resolved.token.refreshed);
		let text;
		if (options.json) text = JSON.stringify({
			...result,
			tokenSource
		}, null, 2);
		else if (options.format === "markdown") text = renderArtifacts(result, "markdown");
		else if (!options.format || options.format === "summary") text = `${renderArtifacts(result, "summary")}token source: ${tokenSource}\n`;
		else throw new Error("Unsupported format. Expected summary or markdown.");
		await writeCliOutput(options, text);
	});
	addGoogleMeetArtifactOptions(root.command("attendance").description("List Meet participants and participant sessions")).option("--no-merge-duplicates", "Keep duplicate participant resources as separate rows").option("--late-after-minutes <n>", "Mark participants late after this many minutes", "5").option("--early-before-minutes <n>", "Mark early leavers before this many minutes", "5").option("--format <format>", "Output format: summary, markdown, or csv", "summary").option("--output <path>", "Write output to a file instead of stdout").option("--json", "Print JSON output", false).action(async (options) => {
		const resolved = await resolveCliArtifactQuery(context, options);
		const result = await fetchResolvedGoogleMeetAttendance(resolved);
		const tokenSource = resolveTokenSource(resolved.token.refreshed);
		let text;
		if (options.json) text = JSON.stringify({
			...result,
			tokenSource
		}, null, 2);
		else if (options.format === "markdown") text = renderAttendance(result, "markdown");
		else if (options.format === "csv") text = renderAttendanceCsv(result);
		else if (!options.format || options.format === "summary") text = `${renderAttendance(result, "summary")}token source: ${tokenSource}\n`;
		else throw new Error("Unsupported format. Expected summary, markdown, or csv.");
		await writeCliOutput(options, text);
	});
	addGoogleMeetArtifactOptions(root.command("export").description("Write Meet artifacts, attendance, transcript, and raw JSON into a folder")).option("--no-transcript-entries", "Skip structured transcript entry lookup").option("--include-doc-bodies", "Export linked transcript and smart-note Google Docs text").option("--no-merge-duplicates", "Keep duplicate participant resources as separate rows").option("--late-after-minutes <n>", "Mark participants late after this many minutes", "5").option("--early-before-minutes <n>", "Mark early leavers before this many minutes", "5").option("--output <dir>", "Output directory").option("--zip", "Also write a portable .zip archive").option("--dry-run", "Fetch export data and print the manifest without writing files", false).option("--json", "Print JSON output", false).action(async (options) => {
		const resolved = await resolveCliArtifactQuery(context, options);
		const artifacts = await fetchResolvedGoogleMeetArtifacts(resolved);
		const attendance = await fetchResolvedGoogleMeetAttendance(resolved);
		const payload = await exportGoogleMeetBundle({
			outputDir: options.output,
			artifacts,
			attendance,
			zip: Boolean(options.zip),
			dryRun: options.dryRun,
			request: buildGoogleMeetExportRequest(resolved, options.calendar),
			tokenSource: resolveTokenSource(resolved.token.refreshed),
			calendarEvent: resolved.calendarEvent
		});
		if (options.json || "dryRun" in payload) {
			writeStdoutJson(payload);
			return;
		}
		writeStdoutLine("export: %s", payload.outputDir);
		for (const file of payload.files) writeStdoutLine("- %s", file);
		if (payload.zipFile) writeStdoutLine("zip: %s", payload.zipFile);
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
	const { root } = context;
	addGoogleMeetOAuthOptions(root.command("doctor").description("Show human-readable Meet session/browser/realtime health").argument("[session-id]", "Meet session ID").option("--oauth", "Verify Google Meet OAuth token refresh without printing secrets", false).option("--meeting <value>", "Also verify spaces.get for a Meet URL, code, or spaces/{id}").option("--create-space", "Also verify spaces.create by creating a throwaway Meet space", false)).option("--json", "Print JSON output", false).action(async (sessionId, options) => {
		if (options.oauth) {
			const report = await buildOAuthDoctorReport(context.config, options);
			if (options.json) {
				writeStdoutJson(report);
				return;
			}
			writeOAuthDoctorReport(report);
			return;
		}
		const status = await callGoogleMeetRuntime(context, "googlemeet.status", { sessionId }, (rt) => rt.status(sessionId));
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
	const { root, callGateway, operationTimeoutMs, resolveMeetingInput } = context;
	root.command("join").argument("[url]", "Explicit https://meet.google.com/... URL").option("--transport <transport>", "Transport: chrome, chrome-node, or twilio").option("--mode <mode>", "Mode: agent, bidi, or transcribe").option("--message <text>", "Realtime speech to trigger after join").option("--dial-in-number <phone>", "Meet dial-in number for Twilio transport").option("--pin <pin>", "Meet phone PIN; # is appended if omitted").option("--dtmf-sequence <sequence>", "Explicit Twilio DTMF sequence").action(async (url, options) => {
		const payload = resolveCliJoinRequest(resolveMeetingInput(context.config, url), options);
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
		const result = await (await context.ensureRuntime()).join(payload);
		writeStdoutJson(result.session);
	});
	root.command("test-speech").argument("[url]", "Explicit https://meet.google.com/... URL").option("--transport <transport>", "Transport: chrome, chrome-node, or twilio").option("--mode <mode>", "Mode: agent, bidi, or transcribe").option("--message <text>", "Realtime speech to trigger", "Say exactly: Google Meet speech test complete.").action(async (url, options) => {
		const payload = {
			url: resolveMeetingInput(context.config, url),
			transport: parseGoogleMeetTransport(options.transport),
			mode: parseGoogleMeetMode(options.mode),
			message: options.message
		};
		writeStdoutJson(await callGoogleMeetRuntime(context, "googlemeet.testSpeech", payload, (rt) => rt.testSpeech(payload), operationTimeoutMs));
	});
	root.command("test-listen").argument("[url]", "Explicit https://meet.google.com/... URL").option("--transport <transport>", "Transport: chrome or chrome-node").option("--timeout-ms <ms>", "How long to wait for fresh captions/transcript movement").action(async (url, options) => {
		const payload = {
			url: resolveMeetingInput(context.config, url),
			transport: parseGoogleMeetBrowserTransport(options.transport),
			timeoutMs: parsePositiveNumber(options.timeoutMs, "timeout-ms")
		};
		writeStdoutJson(await callGoogleMeetRuntime(context, "googlemeet.testListen", payload, (rt) => rt.testListen(payload), operationTimeoutMs));
	});
}
function registerGoogleMeetSessionCommands(context) {
	const { root } = context;
	root.command("status").argument("[session-id]", "Meet session ID").option("--json", "Print JSON output", false).action(async (sessionId) => {
		writeStdoutJson(await callGoogleMeetRuntime(context, "googlemeet.status", { sessionId }, (rt) => rt.status(sessionId)));
	});
	root.command("transcript").description("Print the bounded caption transcript for a Meet session").argument("<session-id>", "Meet session ID").option("--since <index>", "Resume from the previous response's nextIndex").option("--json", "Print JSON output", false).action(async (sessionId, options) => {
		const sinceIndex = parseStrictNonNegativeInteger(options.since);
		if (options.since !== void 0 && sinceIndex === void 0) throw new Error("--since must be a non-negative safe integer");
		const result = await callGoogleMeetRuntime(context, "googlemeet.transcript", {
			sessionId,
			...sinceIndex === void 0 ? {} : { sinceIndex }
		}, (rt) => rt.transcript(sessionId, sinceIndex === void 0 ? {} : { sinceIndex }));
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
	const { root } = context;
	root.command("recover-tab").description("Focus and inspect an existing Google Meet tab").argument("[url]", "Optional Meet URL to match").option("--transport <transport>", "Transport to inspect: chrome or chrome-node").option("--json", "Print JSON output", false).action(async (url, options) => {
		const result = await (await context.ensureRuntime()).recoverCurrentTab({
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
		const status = await (await context.ensureRuntime()).setupStatus({
			transport: parseGoogleMeetTransport(options.transport),
			mode: parseGoogleMeetMode(options.mode)
		});
		if (options.json) writeStdoutJson(status);
		else writeSetupStatus(status);
		if (!status.ok) process.exitCode = 1;
	});
	root.command("leave").argument("<session-id>", "Meet session ID").action(async (sessionId) => {
		const result = await callGoogleMeetRuntime(context, "googlemeet.leave", { sessionId }, (rt) => rt.leave(sessionId));
		if (!result.found) throw new Error("session not found");
		writeLeaveResult(sessionId, result);
	});
	root.command("speak").argument("<session-id>", "Meet session ID").argument("[message]", "Realtime instructions to speak now").action(async (sessionId, message) => {
		const result = await callGoogleMeetRuntime(context, "googlemeet.speak", {
			sessionId,
			message
		}, (rt) => rt.speak(sessionId, message));
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
		if (!hasCreateOAuth(context.config, options)) {
			if (hasCreateSpaceConfigInput(options)) throw new Error("Google Meet access policy options require OAuth/API room creation. Configure Google Meet OAuth or remove --access-type/--entry-point-access.");
			const rt = await context.ensureRuntime();
			const result = await rt.createViaBrowser();
			const join = options.join !== false ? await rt.join(resolveCliJoinRequest(result.meetingUri, options)) : void 0;
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
		const token = await resolveGoogleMeetTokenFromParams(context.config, resolveCliParams(options));
		const result = await createGoogleMeetSpace({
			accessToken: token.accessToken,
			config: resolveCreateSpaceConfig(options)
		});
		const join = options.join !== false ? await (await context.ensureRuntime()).join(resolveCliJoinRequest(result.meetingUri, options)) : void 0;
		writeGoogleMeetCreateOutput({
			...result,
			tokenSource: token.refreshed ? "refresh-token" : "cached-access-token",
			joined: Boolean(join),
			...join ? { join } : {}
		}, options.json);
	});
	addGoogleMeetOAuthOptions(root.command("end-active-conference").description("End the active conference for a Google Meet space").argument("[meeting]", "Meet URL, meeting code, or spaces/{id}")).option("--json", "Print JSON output", false).action(async (meeting, options) => {
		const token = await resolveGoogleMeetTokenFromParams(context.config, resolveCliParams(options));
		const result = await endGoogleMeetActiveConference({
			accessToken: token.accessToken,
			meeting: resolveMeetingInput(context.config, meeting ?? options.meeting)
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
	const { root, resolveCliParams, resolveMeetingInput } = context;
	addGoogleMeetOAuthOptions(addGoogleMeetMeetingOption(root.command("resolve-space").description("Resolve a Meet URL, meeting code, or spaces/{id} to its canonical space"))).option("--json", "Print JSON output", false).action(async (options) => {
		const meeting = resolveMeetingInput(context.config, options.meeting);
		const { space, token } = await resolveSpaceFromParams(context.config, {
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
		const meeting = resolveMeetingInput(context.config, options.meeting);
		const { space, token } = await resolveSpaceFromParams(context.config, {
			...resolveCliParams(options),
			meeting
		});
		const report = buildGoogleMeetPreflightReport({
			input: meeting,
			space,
			previewAcknowledged: context.config.preview.enrollmentAcknowledged,
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
		const token = await resolveGoogleMeetTokenFromParams(context.config, raw);
		if (!options.today && !options.event?.trim()) {
			const meeting = options.meeting?.trim() || context.config.defaults.meeting;
			if (!meeting) throw new Error("Meeting input is required. Pass --meeting, --today, --event, or configure defaults.meeting.");
			raw.meeting = meeting;
		}
		const resolved = await resolveMeetingFromParams({
			config: context.config,
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
	addGoogleMeetOAuthOptions(root.command("calendar-events").description("Preview Calendar events with Google Meet links").option("--today", "Find Meet links on today's calendar").option("--event <query>", "Find matching calendar events with Meet links").option("--calendar <id>", "Calendar id for lookup", "primary")).option("--json", "Print JSON output", false).action(async (options) => {
		const token = await resolveGoogleMeetTokenFromParams(context.config, resolveCliParams(options));
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
export { registerGoogleMeetCli };
