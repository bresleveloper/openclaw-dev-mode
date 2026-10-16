import { c as normalizeOptionalLowercaseString, l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty, p as normalizeStringifiedOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { s as hasFlag, w as isNodesMachineOutput } from "./argv-D_Nxd_3s.mjs";
import { t as resolveCliArgvInvocation } from "./argv-invocation-CV_-dmd8.mjs";
import "./src-CdRlGRnW.mjs";
import { n as formatByteSize } from "./format-C1IjPxxo.mjs";
import { c as isRecord, o as asRecord } from "./record-coerce-TIsquoVR.mjs";
import { r as defaultRuntime } from "./runtime-DlO3PTAd.mjs";
import { n as sanitizeTerminalText } from "./safe-text-SY_CvCi3.mjs";
import { f as shortenHomeInString, p as shortenHomePath } from "./utils-DgZn2dLu.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { t as formatCliCommand } from "./command-format-DwEdrDKL.mjs";
import { r as theme } from "./theme-DzaUZY4q.mjs";
import { t as parseDurationMs } from "./parse-duration-C4JaJvt9.mjs";
import { t as formatDocsLink } from "./links-4Bgsoz0M.mjs";
import { a as withConsoleLogsRoutedToStderrForJson } from "./json-output-mode-DhC0xNZP.mjs";
import { n as formatTimeAgo } from "./format-relative-Bcp7RoO9.mjs";
import { n as parsePairingList, t as parseNodeList } from "./node-list-parse-Ro4PZqnC.mjs";
import { t as resolveNodePairApprovalScopes } from "./node-pairing-authz-UuidBiYT.mjs";
import { a as cameraTempPath, c as resolveCameraClipTarget, d as writeCameraClipPayloadToFile, f as writeCameraPayloadToFile, l as resolveCameraSnapTargets, n as screenRecordTempPath, o as parseCameraClipPayload, s as parseCameraSnapPayload, t as parseScreenRecordPayload, u as writeBase64ToFile } from "./nodes-screen-DxEbxyjM.mjs";
import { r as isNodeHostStats } from "./node-host-stats-B8fF3nyX.mjs";
import { n as renderTable, t as getTerminalTableWidth } from "./table-CvWMfO8o.mjs";
import { n as formatHelpExamples } from "./help-format-xds_bDSp.mjs";
import { a as nodesCallOpts, c as resolveCliNode, i as callNodesGatewayCli, l as resolveCliNodeId, n as callNodeDiagnosticsGatewayCli, o as parseOptionalNodeFiniteNumber, r as callNodePairApprovalGatewayCli, s as parseOptionalNodeInteger, t as buildNodeInvokeParams, u as resolveNodeDiagnosticsId } from "./rpc-BeESxF9C.mjs";
import { n as getNodesTheme, r as runNodesCommand, t as formatConnectionFlagReminder } from "./cli-utils-xYWWHi8O.mjs";
import { n as setCommandJsonMode } from "./json-mode-e6DlzpSi.mjs";
import { t as formatPairingApproveCommand } from "./pairing-command-format-CRKyqT6F.mjs";
import { t as formatVersionLabel } from "./version-format-B-C6AzAF.mjs";
import { Option } from "commander";
//#region src/cli/nodes-cli/register.camera.ts
const parseFacing = (value) => {
	const v = normalizeLowercaseStringOrEmpty(value);
	if (v === "front" || v === "back") return v;
	throw new Error(`invalid facing: ${value} (expected front|back)`);
};
function registerNodesCameraCommands(nodes) {
	const camera = nodes.command("camera").description("Capture camera media from a paired node");
	nodesCallOpts(camera.command("list").description("List available cameras on a node").requiredOption("--node <idOrNameOrIp>", "Node id, name, or IP").action(async (opts) => {
		await runNodesCommand("camera list", async () => {
			const nodeId = await resolveCliNodeId(opts, opts.node ?? "");
			const raw = await callNodesGatewayCli("node.invoke", opts, buildNodeInvokeParams({
				nodeId,
				command: "camera.list",
				params: {}
			}));
			const payload = asRecord(asRecord(raw).payload);
			const devices = Array.isArray(payload.devices) ? payload.devices.filter(isRecord) : [];
			if (opts.json) {
				defaultRuntime.writeJson(devices);
				return;
			}
			if (devices.length === 0) {
				const { muted } = getNodesTheme();
				defaultRuntime.log(muted("No cameras reported."));
				return;
			}
			const { heading, muted } = getNodesTheme();
			const tableWidth = getTerminalTableWidth();
			const rows = devices.map((device) => ({
				Name: typeof device.name === "string" ? device.name : "Unknown Camera",
				Position: typeof device.position === "string" ? device.position : muted("unspecified"),
				ID: typeof device.id === "string" ? device.id : ""
			}));
			defaultRuntime.log(heading("Cameras"));
			defaultRuntime.log(renderTable({
				width: tableWidth,
				columns: [
					{
						key: "Name",
						header: "Name",
						minWidth: 14,
						flex: true
					},
					{
						key: "Position",
						header: "Position",
						minWidth: 10
					},
					{
						key: "ID",
						header: "ID",
						minWidth: 10,
						flex: true
					}
				],
				rows
			}).trimEnd());
		});
	}), { timeoutMs: 6e4 });
	nodesCallOpts(camera.command("snap").description("Capture a photo from a node camera (prints the saved path)").requiredOption("--node <idOrNameOrIp>", "Node id, name, or IP").option("--facing <front|back|both>", "Camera facing").option("--device-id <id>", "Camera device id (from nodes camera list)").option("--max-width <px>", "Max width in px (optional)").option("--quality <0-1>", "JPEG quality (optional; platform-specific default)").option("--delay-ms <ms>", "Delay before capture in ms (optional; platform-specific default)").option("--invoke-timeout <ms>", "Node invoke timeout in ms (default 20000)", "20000").action(async (opts) => {
		await runNodesCommand("camera snap", async () => {
			const facing = normalizeLowercaseStringOrEmpty(opts.facing) || void 0;
			if (facing !== void 0 && facing !== "both" && facing !== "front" && facing !== "back") throw new Error(`invalid facing: ${String(opts.facing)} (expected front|back|both)`);
			const maxWidth = parseOptionalNodeInteger(opts.maxWidth, "--max-width");
			const quality = parseOptionalNodeFiniteNumber(opts.quality, "--quality", {
				minInclusive: 0,
				maxInclusive: 1
			});
			const delayMs = parseOptionalNodeInteger(opts.delayMs, "--delay-ms", "non-negative");
			const deviceId = normalizeOptionalString(opts.deviceId);
			const timeoutMs = parseOptionalNodeInteger(opts.invokeTimeout, "--invoke-timeout");
			const node = await resolveCliNode(opts, normalizeOptionalString(opts.node) ?? "");
			const nodeId = node.nodeId;
			if (deviceId && facing === "both" && node.platform?.toLowerCase() !== "linux") throw new Error("facing=both is not allowed when --device-id is set");
			const targets = resolveCameraSnapTargets({
				facing,
				platform: node.platform,
				deviceId
			});
			const captures = [];
			for (const target of targets) {
				const invokeParams = buildNodeInvokeParams({
					nodeId,
					command: "camera.snap",
					params: {
						...target.requestFacing ? { facing: target.requestFacing } : {},
						maxWidth,
						quality,
						format: "jpg",
						delayMs,
						deviceId: deviceId || void 0
					},
					timeoutMs
				});
				const raw = await callNodesGatewayCli("node.invoke", opts, invokeParams);
				const payload = parseCameraSnapPayload(asRecord(raw).payload, { expectedHost: node.remoteIp });
				captures.push({
					facing: target.artifactFacing,
					payload,
					filePath: cameraTempPath({
						kind: "snap",
						facing: target.artifactFacing,
						ext: payload.format === "jpeg" ? "jpg" : payload.format
					})
				});
			}
			const results = [];
			for (const { facing: artifactFacing, payload, filePath } of captures) {
				await writeCameraPayloadToFile({
					filePath,
					payload,
					expectedHost: node.remoteIp,
					invalidPayloadMessage: "invalid camera.snap payload"
				});
				results.push({
					facing: artifactFacing,
					path: filePath,
					width: payload.width,
					height: payload.height
				});
			}
			if (opts.json) {
				defaultRuntime.writeJson({ files: results });
				return;
			}
			defaultRuntime.log(results.map((r) => shortenHomePath(r.path)).join("\n"));
		});
	}), { timeoutMs: 6e4 });
	nodesCallOpts(camera.command("clip").description("Capture a short video clip from a node camera (prints the saved path)").requiredOption("--node <idOrNameOrIp>", "Node id, name, or IP").option("--facing <front|back>", "Camera facing", "front").option("--device-id <id>", "Camera device id (from nodes camera list)").option("--duration <ms|10s|1m>", "Duration (default 3000ms; supports ms/s/m, e.g. 10s)", "3000").option("--no-audio", "Disable audio capture").option("--invoke-timeout <ms>", "Node invoke timeout in ms (default 90000)", "90000").action(async (opts) => {
		await runNodesCommand("camera clip", async () => {
			const facing = parseFacing(opts.facing ?? "front");
			const durationMs = parseDurationMs(opts.duration ?? "3000");
			const includeAudio = opts.audio !== false;
			const timeoutMs = parseOptionalNodeInteger(opts.invokeTimeout, "--invoke-timeout");
			const deviceId = normalizeOptionalString(opts.deviceId);
			const node = await resolveCliNode(opts, normalizeOptionalString(opts.node) ?? "");
			const nodeId = node.nodeId;
			const target = resolveCameraClipTarget({
				facing,
				platform: node.platform
			});
			const invokeParams = buildNodeInvokeParams({
				nodeId,
				command: "camera.clip",
				params: {
					facing: target.requestFacing,
					durationMs,
					includeAudio,
					format: "mp4",
					deviceId: deviceId || void 0
				},
				timeoutMs
			});
			const raw = await callNodesGatewayCli("node.invoke", opts, invokeParams);
			const payload = parseCameraClipPayload(asRecord(raw).payload);
			const filePath = await writeCameraClipPayloadToFile({
				payload,
				facing: target.artifactFacing,
				expectedHost: node.remoteIp
			});
			if (opts.json) {
				defaultRuntime.writeJson({ file: {
					facing: target.artifactFacing,
					path: filePath,
					durationMs: payload.durationMs,
					hasAudio: payload.hasAudio
				} });
				return;
			}
			defaultRuntime.log(shortenHomePath(filePath));
		});
	}), { timeoutMs: 9e4 });
}
//#endregion
//#region src/cli/nodes-cli/register.invoke.ts
const BLOCKED_NODE_INVOKE_COMMANDS = /* @__PURE__ */ new Set(["system.run", "system.run.prepare"]);
function parseNodeInvokeParams(value = "{}") {
	try {
		return JSON.parse(value);
	} catch {
		throw new Error("--params must be valid JSON.");
	}
}
function registerNodesInvokeCommands(nodes) {
	nodesCallOpts(nodes.command("invoke").description("Invoke a command on a paired node").requiredOption("--node <idOrNameOrIp>", "Node id, name, or IP").requiredOption("--command <command>", "Command (e.g. canvas.navigate)").option("--params <json>", "JSON object string for params", "{}").option("--invoke-timeout <ms>", "Node invoke timeout in ms (default 15000)", "15000").option("--idempotency-key <key>", "Idempotency key (optional)").action(async (opts) => {
		await runNodesCommand("invoke", async () => {
			const nodeQuery = normalizeOptionalString(opts.node) ?? "";
			const command = normalizeOptionalString(opts.command) ?? "";
			if (!nodeQuery || !command) throw new Error("--node and --command required");
			if (BLOCKED_NODE_INVOKE_COMMANDS.has(normalizeLowercaseStringOrEmpty(command))) throw new Error(`command "${command}" is reserved for shell execution; use the exec tool with host=node instead`);
			const params = parseNodeInvokeParams(opts.params);
			const timeoutMs = parseOptionalNodeInteger(opts.invokeTimeout, "--invoke-timeout");
			if (opts.idempotencyKey === "") throw new Error("--idempotency-key must not be empty.");
			const nodeId = await resolveCliNodeId(opts, nodeQuery);
			const invokeParams = buildNodeInvokeParams({
				nodeId,
				command,
				params,
				idempotencyKey: opts.idempotencyKey,
				timeoutMs
			});
			const result = await callNodesGatewayCli("node.invoke", opts, invokeParams);
			defaultRuntime.writeJson(result);
		});
	}), { timeoutMs: 3e4 });
}
//#endregion
//#region src/cli/nodes-cli/register.location.ts
function registerNodesLocationCommands(nodes) {
	const location = nodes.command("location").description("Fetch location from a paired node");
	nodesCallOpts(location.command("get").description("Fetch the current location from a node").requiredOption("--node <idOrNameOrIp>", "Node id, name, or IP").option("--max-age <ms>", "Use cached location newer than this (ms)").option("--accuracy <coarse|balanced|precise>", "Desired accuracy (default: balanced/precise depending on node setting)").option("--location-timeout <ms>", "Location fix timeout (ms)", "10000").option("--invoke-timeout <ms>", "Node invoke timeout in ms (default 20000)", "20000").action(async (opts) => {
		await runNodesCommand("location get", async () => {
			const desiredAccuracyRaw = normalizeOptionalLowercaseString(opts.accuracy);
			const desiredAccuracy = desiredAccuracyRaw === "coarse" || desiredAccuracyRaw === "balanced" || desiredAccuracyRaw === "precise" ? desiredAccuracyRaw : void 0;
			if (opts.accuracy !== void 0 && desiredAccuracy === void 0) throw new Error("invalid --accuracy (use coarse|balanced|precise)");
			const maxAgeMs = parseOptionalNodeInteger(opts.maxAge, "--max-age", "non-negative");
			const timeoutMs = parseOptionalNodeInteger(opts.locationTimeout, "--location-timeout");
			const invokeTimeoutMs = parseOptionalNodeInteger(opts.invokeTimeout, "--invoke-timeout");
			const nodeId = await resolveCliNodeId(opts, opts.node ?? "");
			const invokeParams = buildNodeInvokeParams({
				nodeId,
				command: "location.get",
				params: {
					maxAgeMs,
					desiredAccuracy,
					timeoutMs
				},
				timeoutMs: invokeTimeoutMs
			});
			const raw = await callNodesGatewayCli("node.invoke", opts, invokeParams);
			const payload = asRecord(asRecord(raw).payload);
			if (opts.json) {
				defaultRuntime.writeJson(payload);
				return;
			}
			const lat = payload.lat;
			const lon = payload.lon;
			const acc = payload.accuracyMeters;
			if (typeof lat === "number" && typeof lon === "number") {
				const accText = typeof acc === "number" ? ` ±${acc.toFixed(1)}m` : "";
				defaultRuntime.log(`${lat},${lon}${accText}`);
				return;
			}
			defaultRuntime.writeJson(payload, 0);
		});
	}), { timeoutMs: 3e4 });
}
//#endregion
//#region src/cli/nodes-cli/register.notify.ts
function registerNodesNotifyCommand(nodes) {
	nodesCallOpts(nodes.command("notify").description("Send a local notification on a node").requiredOption("--node <idOrNameOrIp>", "Node id, name, or IP").option("--title <text>", "Notification title").option("--body <text>", "Notification body").option("--sound <name>", "Notification sound").addOption(new Option("--priority <passive|active|timeSensitive>", "Notification priority").choices([
		"passive",
		"active",
		"timeSensitive"
	])).addOption(new Option("--delivery <system|overlay|auto>", "Delivery mode").choices([
		"system",
		"overlay",
		"auto"
	]).default("system")).option("--invoke-timeout <ms>", "Node invoke timeout in ms (default 15000)", "15000").action(async (opts) => {
		await runNodesCommand("notify", async () => {
			const title = normalizeOptionalString(opts.title) ?? "";
			const body = normalizeOptionalString(opts.body) ?? "";
			if (!title && !body) throw new Error("missing --title or --body");
			const invokeTimeout = parseOptionalNodeInteger(opts.invokeTimeout, "--invoke-timeout");
			const nodeId = await resolveCliNodeId(opts, normalizeOptionalString(opts.node) ?? "");
			const invokeParams = buildNodeInvokeParams({
				nodeId,
				command: "system.notify",
				params: {
					title,
					body,
					sound: opts.sound,
					priority: opts.priority,
					delivery: opts.delivery
				},
				idempotencyKey: opts.idempotencyKey,
				timeoutMs: invokeTimeout
			});
			const result = await callNodesGatewayCli("node.invoke", opts, invokeParams);
			if (opts.json) {
				defaultRuntime.writeJson(result);
				return;
			}
			const { ok } = getNodesTheme();
			defaultRuntime.log(ok("notify ok"));
		});
	}));
}
//#endregion
//#region src/cli/nodes-cli/pairing-render.ts
/** Render pending pairing requests with sanitized labels and relative request age. */
function renderPendingPairingRequestsTable(params) {
	const { pending, now, tableWidth, theme } = params;
	const rows = pending.map((r) => {
		return {
			Request: sanitizeTerminalText(r.requestId),
			Node: sanitizeTerminalText(r.displayName?.trim() || r.nodeId),
			IP: sanitizeTerminalText(r.remoteIp ?? ""),
			Requested: typeof r.ts === "number" ? formatTimeAgo(Math.max(0, now - r.ts)) : theme.muted("unknown")
		};
	});
	return {
		heading: theme.heading("Pending"),
		table: renderTable({
			width: tableWidth,
			columns: [
				{
					key: "Request",
					header: "Request",
					minWidth: 8
				},
				{
					key: "Node",
					header: "Node",
					minWidth: 14,
					flex: true
				},
				{
					key: "IP",
					header: "IP",
					minWidth: 10
				},
				{
					key: "Requested",
					header: "Requested",
					minWidth: 12
				}
			],
			rows
		}).trimEnd()
	};
}
//#endregion
//#region src/cli/nodes-cli/register.pairing.ts
const DEFAULT_NODE_PAIR_APPROVE_SCOPES = ["operator.pairing"];
const NODE_PAIR_APPROVE_SCOPE_SET = /* @__PURE__ */ new Set([
	"operator.pairing",
	"operator.write",
	"operator.admin"
]);
function normalizeNodePairApproveScopes(scopes) {
	const normalized = new Set(DEFAULT_NODE_PAIR_APPROVE_SCOPES);
	if (!Array.isArray(scopes)) return [...normalized];
	for (const scope of scopes) {
		if (typeof scope !== "string") continue;
		if (!NODE_PAIR_APPROVE_SCOPE_SET.has(scope)) continue;
		normalized.add(scope);
	}
	return [...normalized];
}
async function resolveApproveScopesForRequest(opts, requestId) {
	let pending;
	try {
		const result = await callNodePairApprovalGatewayCli("node.pair.list", opts, {}, { scopes: DEFAULT_NODE_PAIR_APPROVE_SCOPES });
		pending = parsePairingList(result).pending;
	} catch {
		return { scopes: [...DEFAULT_NODE_PAIR_APPROVE_SCOPES] };
	}
	const pendingRequestIds = pending.map((request) => request.requestId).filter((id) => typeof id === "string" && id.length > 0);
	const request = pending.find((candidate) => candidate.requestId === requestId);
	if (!request) throw new Error(buildUnknownNodePairRequestIdMessage(requestId, opts, pendingRequestIds));
	const declaredScopes = normalizeNodePairApproveScopes(request.requiredApproveScopes);
	if (declaredScopes.length > DEFAULT_NODE_PAIR_APPROVE_SCOPES.length) return { scopes: declaredScopes };
	return { scopes: resolveNodePairApprovalScopes(request.commands) };
}
function isUnknownNodePairRequestIdError(error) {
	const requestError = error;
	return requestError instanceof Error && requestError.name === "GatewayClientRequestError" && requestError.gatewayCode === "INVALID_REQUEST" && requestError.message === "unknown requestId";
}
function buildUnknownNodePairRequestIdMessage(requestId, opts, pendingRequestIds) {
	const lines = [`Unknown node pairing requestId: ${requestId}`];
	if (pendingRequestIds !== void 0) {
		if (pendingRequestIds.length > 0) lines.push(`Pending requestIds: ${pendingRequestIds.join(", ")}`);
		else lines.push("No pending node pairing requests are currently visible.");
	}
	lines.push(`Run ${formatCliCommand("openclaw nodes pending")} to inspect current requests.`);
	const connectionReminder = formatConnectionFlagReminder(opts);
	if (connectionReminder) lines.push(connectionReminder);
	return lines.join("\n");
}
function rethrowUnknownNodePairRequestId(error, requestId, opts) {
	if (!isUnknownNodePairRequestIdError(error)) throw error;
	error.name = "Error";
	error.message = buildUnknownNodePairRequestIdMessage(requestId, opts);
	throw error;
}
function registerNodesPairingCommands(nodes) {
	nodesCallOpts(nodes.command("pending").description("List pending pairing requests").action(async (opts) => {
		await runNodesCommand("pending", async () => {
			const result = await callNodesGatewayCli("node.pair.list", opts, {});
			const { pending } = parsePairingList(result);
			if (opts.json) {
				defaultRuntime.writeJson(pending);
				return;
			}
			if (pending.length === 0) {
				const { muted } = getNodesTheme();
				defaultRuntime.log(muted("No pending pairing requests."));
				return;
			}
			const { heading, muted } = getNodesTheme();
			const tableWidth = getTerminalTableWidth();
			const rendered = renderPendingPairingRequestsTable({
				pending,
				now: Date.now(),
				tableWidth,
				theme: {
					heading,
					muted
				}
			});
			defaultRuntime.log(rendered.heading);
			defaultRuntime.log(rendered.table);
		});
	}));
	for (const [action, description] of [["approve", "Approve a pending pairing request"], ["reject", "Reject a pending pairing request"]]) nodesCallOpts(nodes.command(action).description(description).argument("<requestId>", "Pending request id").action(async (requestId, opts) => {
		await runNodesCommand(action, async () => {
			const approval = action === "approve" ? await resolveApproveScopesForRequest(opts, requestId) : void 0;
			let result;
			try {
				result = approval ? await callNodePairApprovalGatewayCli("node.pair.approve", opts, { requestId }, approval) : await callNodesGatewayCli("node.pair.reject", opts, { requestId });
			} catch (error) {
				rethrowUnknownNodePairRequestId(error, requestId, opts);
			}
			defaultRuntime.writeJson(result);
		});
	}));
	nodesCallOpts(nodes.command("remove").description("Remove a paired node entry").requiredOption("--node <idOrNameOrIp>", "Node id, name, or IP").action(async (opts) => {
		await runNodesCommand("remove", async () => {
			const nodeId = await resolveCliNodeId(opts, normalizeOptionalString(opts.node) ?? "");
			const result = await callNodesGatewayCli("node.pair.remove", opts, { nodeId });
			if (opts.json) {
				defaultRuntime.writeJson(result);
				return;
			}
			const { warn } = getNodesTheme();
			defaultRuntime.log(warn(`Removed paired node ${nodeId}`));
		});
	}));
	nodesCallOpts(nodes.command("rename").description("Rename a paired node (display name override)").requiredOption("--node <idOrNameOrIp>", "Node id, name, or IP").requiredOption("--name <displayName>", "New display name").action(async (opts) => {
		await runNodesCommand("rename", async () => {
			const name = normalizeOptionalString(opts.name) ?? "";
			if (!name) throw new Error(`--name must not be empty. Run ${formatCliCommand("openclaw nodes list")} to see paired nodes, then rerun with --name <displayName>.`);
			const nodeId = await resolveCliNodeId(opts, normalizeOptionalString(opts.node) ?? "");
			const result = await callNodesGatewayCli("node.rename", opts, {
				nodeId,
				displayName: name
			});
			if (opts.json) {
				defaultRuntime.writeJson(result);
				return;
			}
			const { ok } = getNodesTheme();
			defaultRuntime.log(ok(`node rename ok: ${nodeId} -> ${name}`));
		});
	}));
}
//#endregion
//#region src/cli/nodes-cli/register.push.ts
/** Register the node push-test command. */
function registerNodesPushCommand(nodes) {
	nodesCallOpts(nodes.command("push").description("Send an APNs test push to an iOS node").requiredOption("--node <idOrNameOrIp>", "Node id, name, or IP").option("--title <text>", "Push title", "OpenClaw").option("--body <text>", "Push body").option("--environment <sandbox|production>", "Override APNs environment").action(async (opts) => {
		await runNodesCommand("push", async () => {
			const environment = normalizeOptionalLowercaseString(opts.environment);
			if (opts.environment !== void 0 && environment !== "sandbox" && environment !== "production") throw new Error("invalid --environment (use sandbox|production)");
			const nodeId = await resolveCliNodeId(opts, normalizeOptionalString(opts.node) ?? "");
			const title = normalizeOptionalString(opts.title) || "OpenClaw";
			const body = normalizeOptionalString(opts.body) || `Push test for node ${nodeId}`;
			const result = await callNodesGatewayCli("push.test", opts, {
				nodeId,
				title,
				body,
				...environment ? { environment } : {}
			});
			const parsed = asRecord(result);
			const ok = parsed.ok === true;
			const status = typeof parsed.status === "number" ? parsed.status : 0;
			const reason = normalizeOptionalString(parsed.reason);
			const env = normalizeOptionalString(parsed.environment) ?? "unknown";
			if (opts.json) defaultRuntime.writeJson(result);
			else {
				const { ok: okLabel, error: errorLabel } = getNodesTheme();
				const label = ok ? okLabel : errorLabel;
				defaultRuntime.log(label(`push.test status=${status} ok=${ok} env=${env}`));
				if (reason) defaultRuntime.log(`reason: ${reason}`);
			}
			if (!ok) process.exitCode = 1;
		});
	}), { timeoutMs: 25e3 });
}
//#endregion
//#region src/cli/nodes-cli/register.screen.ts
function registerNodesScreenCommands(nodes) {
	const screen = nodes.command("screen").description("Capture screen recordings from a paired node");
	nodesCallOpts(screen.command("record").description("Capture a short screen recording from a node (prints the saved path)").requiredOption("--node <idOrNameOrIp>", "Node id, name, or IP").option("--screen <index>", "Screen index (0 = primary)", "0").option("--duration <ms|10s>", "Clip duration (ms or 10s)", "10000").option("--fps <fps>", "Frames per second", "10").option("--no-audio", "Disable microphone audio capture").option("--out <path>", "Output path").option("--invoke-timeout <ms>", "Node invoke timeout in ms (default 120000)", "120000").action(async (opts) => {
		await runNodesCommand("screen record", async () => {
			const durationMs = parseDurationMs(opts.duration ?? "");
			const screenIndex = parseOptionalNodeInteger(opts.screen ?? "0", "--screen", "non-negative");
			const fps = parseOptionalNodeFiniteNumber(opts.fps ?? "10", "--fps", { minExclusive: 0 });
			const timeoutMs = parseOptionalNodeInteger(opts.invokeTimeout, "--invoke-timeout");
			const nodeId = await resolveCliNodeId(opts, opts.node ?? "");
			const invokeParams = buildNodeInvokeParams({
				nodeId,
				command: "screen.record",
				params: {
					durationMs,
					screenIndex,
					fps,
					format: "mp4",
					includeAudio: opts.audio !== false
				},
				timeoutMs
			});
			const raw = await callNodesGatewayCli("node.invoke", opts, invokeParams);
			const parsed = parseScreenRecordPayload(asRecord(raw).payload);
			const filePath = opts.out ?? screenRecordTempPath({ ext: parsed.format || "mp4" });
			const written = await writeBase64ToFile(filePath, parsed.base64);
			if (opts.json) {
				defaultRuntime.writeJson({ file: {
					path: written.path,
					durationMs: parsed.durationMs,
					fps: parsed.fps,
					screenIndex: parsed.screenIndex,
					hasAudio: parsed.hasAudio
				} });
				return;
			}
			defaultRuntime.log(shortenHomePath(written.path));
		});
	}), { timeoutMs: 18e4 });
}
//#endregion
//#region src/cli/nodes-cli/format.ts
/** Format node permission maps as a stable `[permission=yes|no]` label. */
function formatPermissions(raw) {
	if (!raw || typeof raw !== "object" || Array.isArray(raw)) return null;
	const entries = Object.entries(raw).map(([key, value]) => [normalizeStringifiedOptionalString(key) ?? "", value === true]).filter(([key]) => key.length > 0).toSorted((a, b) => a[0].localeCompare(b[0]));
	if (entries.length === 0) return null;
	return `[${entries.map(([key, granted]) => `${key}=${granted ? "yes" : "no"}`).join(", ")}]`;
}
//#endregion
//#region src/cli/nodes-cli/register.status.ts
function formatNodeStatsBytes(bytes) {
	return formatByteSize(bytes, {
		style: "legacy-binary",
		maxUnit: "tera",
		separator: " ",
		fractionDigits: (value, unit) => value < 10 && unit !== "byte" ? 1 : 0
	});
}
function formatNodeHostStats(stats, connected, now) {
	if (!isNodeHostStats(stats)) return null;
	const totalMemory = formatNodeStatsBytes(stats.memoryTotalBytes);
	const usedMemory = formatNodeStatsBytes(stats.memoryTotalBytes - stats.memoryFreeBytes);
	const memoryUnit = totalMemory.slice(totalMemory.lastIndexOf(" "));
	const usedLabel = usedMemory.endsWith(memoryUnit) ? usedMemory.slice(0, -memoryUnit.length) : usedMemory;
	const summary = [
		stats.loadAverage ? `load ${stats.loadAverage[0].toFixed(1)}/${stats.cpuCount}` : null,
		`mem ${usedLabel}/${totalMemory}`,
		stats.diskAvailableBytes !== void 0 ? `disk ${formatNodeStatsBytes(stats.diskAvailableBytes)} free` : null
	].filter(Boolean).join(" · ");
	return connected ? summary : `${summary} (last known ${formatTimeAgo(Math.max(0, now - stats.updatedAtMs))})`;
}
function formatNodeVersions(node) {
	let core = normalizeOptionalString(node.coreVersion);
	let ui = normalizeOptionalString(node.uiVersion);
	if (!core && !ui) {
		const legacy = node.version?.trim();
		if (!legacy) return null;
		const platform = normalizeOptionalLowercaseString(node.platform);
		if (platform === "darwin" || platform === "linux" || platform === "win32" || platform === "windows") core = legacy;
		else ui = legacy;
	}
	return [core && `core ${formatVersionLabel(core)}`, ui && `ui ${formatVersionLabel(ui)}`].filter(Boolean).join(" · ") || null;
}
function isWindowsNodePlatform(platform) {
	const normalized = normalizeOptionalLowercaseString(platform) ?? "";
	return normalized === "win32" || normalized === "windows";
}
function formatPathEnv(raw, platform) {
	const trimmed = normalizeOptionalString(raw);
	if (!trimmed) return null;
	const delimiter = isWindowsNodePlatform(platform) ? ";" : ":";
	const parts = trimmed.split(delimiter).filter(Boolean);
	const display = parts.length <= 3 ? trimmed : `${parts.slice(0, 2).join(delimiter)}${delimiter}…${delimiter}${parts.slice(-1)[0]}`;
	return shortenHomeInString(display);
}
function formatClientLabel(node) {
	return [node.clientId?.trim(), node.clientMode?.trim()].filter(Boolean).join("/") || null;
}
function formatNodeTerminalLabel(node) {
	return sanitizeTerminalText(node.displayName?.trim() || node.nodeId);
}
function sortedNodeStrings(value) {
	return Array.isArray(value) ? value.map(String).filter(Boolean).toSorted() : null;
}
function formatNodeTimeAgo(now, timestamp) {
	return typeof timestamp === "number" && Number.isFinite(timestamp) ? formatTimeAgo(Math.max(0, now - timestamp)) : null;
}
function formatNodeApprovalState(raw) {
	return raw === "approved" || raw === "pending-approval" || raw === "pending-reapproval" || raw === "unapproved" ? raw : null;
}
function formatApprovalStateLabel(state) {
	if (state === "pending-approval") return "approval pending";
	if (state === "pending-reapproval") return "reapproval pending";
	return state;
}
function isPendingApprovalState(state) {
	return state === "pending-approval" || state === "pending-reapproval";
}
function parseSinceMs(raw, label) {
	if (raw === void 0) return;
	try {
		return parseDurationMs(raw);
	} catch (err) {
		throw new Error(`${label}: ${formatErrorMessage(err)}`, { cause: err });
	}
}
function matchesNodeConnectionFilter(node, connectedOnly, sinceMs, now) {
	if (connectedOnly && !node.connected) return false;
	const lastConnectedAtMs = node.lastConnectedAtMs ?? node.connectedAtMs;
	return sinceMs === void 0 || typeof lastConnectedAtMs === "number" && now - lastConnectedAtMs <= sinceMs;
}
function mergePairedNodeWithEffectiveNode(paired, effective) {
	return {
		...paired,
		...effective,
		createdAtMs: paired?.createdAtMs,
		lastConnectedAtMs: effective.lastConnectedAtMs ?? paired?.lastConnectedAtMs ?? effective.connectedAtMs,
		displayName: effective.displayName ?? paired?.displayName,
		platform: effective.platform ?? paired?.platform,
		version: effective.version ?? paired?.version,
		coreVersion: effective.coreVersion ?? paired?.coreVersion,
		uiVersion: effective.uiVersion ?? paired?.uiVersion,
		remoteIp: effective.remoteIp ?? paired?.remoteIp,
		permissions: effective.permissions ?? paired?.permissions,
		approvedAtMs: effective.approvedAtMs ?? paired?.approvedAtMs
	};
}
function mergePairedNodesWithEffectiveNodes(paired, effectiveNodes) {
	if (effectiveNodes === null) return paired;
	const pairedById = new Map(paired.map((node) => [node.nodeId, node]));
	const seen = /* @__PURE__ */ new Set();
	const rows = [];
	for (const effective of effectiveNodes) {
		const pairedNode = pairedById.get(effective.nodeId);
		if (!pairedNode && effective.paired !== true) continue;
		seen.add(effective.nodeId);
		rows.push(mergePairedNodeWithEffectiveNode(pairedNode, effective));
	}
	for (const node of paired) if (!seen.has(node.nodeId)) rows.push(node);
	return rows;
}
async function tryReadNodeList(opts) {
	try {
		return parseNodeList(await callNodeDiagnosticsGatewayCli("node.list", opts, {}));
	} catch (error) {
		defaultRuntime.error(getNodesTheme().muted(`live node view unavailable (${formatErrorMessage(error)}); showing paired-only data`));
		return null;
	}
}
function registerNodesStatusCommands(nodes) {
	nodesCallOpts(nodes.command("status").description("List known nodes with connection status and capabilities").option("--connected", "Only show connected nodes").option("--last-connected <duration>", "Only show nodes connected within duration (e.g. 24h)").action(async (opts) => {
		await runNodesCommand("status", async () => {
			const connectedOnly = Boolean(opts.connected);
			const sinceMs = parseSinceMs(opts.lastConnected, "Invalid --last-connected");
			const result = await callNodeDiagnosticsGatewayCli("node.list", opts, {});
			const obj = typeof result === "object" && result !== null ? result : {};
			const { ok, warn, muted } = getNodesTheme();
			const tableWidth = getTerminalTableWidth();
			const now = Date.now();
			const nodesLocal = parseNodeList(result);
			const filtered = nodesLocal.filter((node) => matchesNodeConnectionFilter(node, connectedOnly, sinceMs, now));
			if (opts.json) {
				const ts = typeof obj.ts === "number" ? obj.ts : Date.now();
				defaultRuntime.writeJson({
					...obj,
					ts,
					nodes: filtered
				});
				return;
			}
			const pairedCount = filtered.filter((n) => Boolean(n.paired)).length;
			const connectedCount = filtered.filter((n) => Boolean(n.connected)).length;
			const filteredLabel = filtered.length !== nodesLocal.length ? ` (of ${nodesLocal.length})` : "";
			defaultRuntime.log(`Known: ${filtered.length}${filteredLabel} · Paired: ${pairedCount} · Connected: ${connectedCount}`);
			if (filtered.length === 0) return;
			const rows = filtered.map((n) => {
				const perms = formatPermissions(n.permissions);
				const versions = formatNodeVersions(n);
				const pathEnv = formatPathEnv(n.pathEnv, n.platform);
				const client = formatClientLabel(n);
				const lastActive = formatNodeTimeAgo(now, n.lastActiveAtMs);
				const detailParts = [
					client ? `client: ${client}` : null,
					n.deviceFamily ? `device: ${n.deviceFamily}` : null,
					n.modelIdentifier ? `hw: ${n.modelIdentifier}` : null,
					perms ? `perms: ${perms}` : null,
					versions,
					formatNodeHostStats(n.hostStats, Boolean(n.connected), now),
					pathEnv ? `path: ${pathEnv}` : null,
					lastActive ? `input: ${lastActive}${n.active ? " (active)" : ""}` : null
				].filter(Boolean).map((part) => sanitizeTerminalText(String(part)));
				const caps = sortedNodeStrings(n.caps);
				const paired = n.paired ? ok("paired") : warn("unpaired");
				const connected = n.connected ? ok("connected") : muted("disconnected");
				const approvalState = formatNodeApprovalState(n.approvalState);
				const approval = approvalState === "approved" ? ok("approved") : isPendingApprovalState(approvalState) ? warn(formatApprovalStateLabel(approvalState)) : approvalState === "unapproved" ? warn("unapproved") : null;
				const since = typeof n.connectedAtMs === "number" ? ` (${formatTimeAgo(Math.max(0, now - n.connectedAtMs))})` : "";
				return {
					Node: formatNodeTerminalLabel(n),
					ID: sanitizeTerminalText(n.nodeId),
					IP: sanitizeTerminalText(n.remoteIp ?? ""),
					Detail: detailParts.join(" · "),
					Status: `${paired} · ${connected}${since}${approval ? ` · ${approval}` : ""}`,
					Caps: caps ? sanitizeTerminalText(caps.join(", ")) : "?"
				};
			});
			defaultRuntime.log(renderTable({
				width: tableWidth,
				columns: [
					{
						key: "Node",
						header: "Node",
						minWidth: 14,
						flex: true
					},
					{
						key: "ID",
						header: "ID",
						minWidth: 10
					},
					{
						key: "IP",
						header: "IP",
						minWidth: 10
					},
					{
						key: "Detail",
						header: "Detail",
						minWidth: 18,
						flex: true
					},
					{
						key: "Status",
						header: "Status",
						minWidth: 18
					},
					{
						key: "Caps",
						header: "Caps",
						minWidth: 12,
						flex: true
					}
				],
				rows
			}).trimEnd());
			for (const node of filtered) {
				const approvalState = formatNodeApprovalState(node.approvalState);
				const requestId = normalizeOptionalString(node.pendingRequestId);
				if (isPendingApprovalState(approvalState) && requestId) {
					const approveCommand = formatPairingApproveCommand("nodes", requestId, { timeout: opts.timeout });
					const action = approvalState === "pending-reapproval" ? "Reapproval" : "Approval";
					defaultRuntime.log(warn(`${action} pending for ${formatNodeTerminalLabel(node)}. Run ${sanitizeTerminalText(approveCommand)}`));
					const connectionReminder = formatConnectionFlagReminder(opts);
					if (connectionReminder) defaultRuntime.log(warn(connectionReminder));
				}
			}
		});
	}));
	nodesCallOpts(nodes.command("describe").description("Describe a node (capabilities + supported invoke commands)").requiredOption("--node <idOrNameOrIp>", "Node id, name, or IP").action(async (opts) => {
		await runNodesCommand("describe", async () => {
			const nodeId = await resolveNodeDiagnosticsId(opts, opts.node ?? "");
			const result = await callNodeDiagnosticsGatewayCli("node.describe", opts, { nodeId });
			if (opts.json) {
				defaultRuntime.writeJson(result);
				return;
			}
			const obj = typeof result === "object" && result !== null ? result : {};
			const displayName = typeof obj.displayName === "string" ? obj.displayName : nodeId;
			const connected = Boolean(obj.connected);
			const paired = Boolean(obj.paired);
			const caps = sortedNodeStrings(obj.caps);
			const commands = sortedNodeStrings(obj.commands) ?? [];
			const perms = formatPermissions(obj.permissions);
			const approvalState = formatNodeApprovalState(obj.approvalState);
			const pendingRequestId = normalizeOptionalString(obj.pendingRequestId);
			const pendingCaps = sortedNodeStrings(obj.pendingDeclaredCaps);
			const pendingCommands = sortedNodeStrings(obj.pendingDeclaredCommands) ?? [];
			const pendingPerms = formatPermissions(obj.pendingDeclaredPermissions);
			const approveCommand = isPendingApprovalState(approvalState) && pendingRequestId ? formatPairingApproveCommand("nodes", pendingRequestId, { timeout: opts.timeout }) : null;
			const connectionReminder = approveCommand ? formatConnectionFlagReminder(opts) : null;
			const family = typeof obj.deviceFamily === "string" ? obj.deviceFamily : null;
			const model = typeof obj.modelIdentifier === "string" ? obj.modelIdentifier : null;
			const client = formatClientLabel(obj);
			const ip = typeof obj.remoteIp === "string" ? obj.remoteIp : null;
			const pathEnv = typeof obj.pathEnv === "string" ? obj.pathEnv : null;
			const versions = formatNodeVersions(obj);
			const lastActive = formatNodeTimeAgo(Date.now(), obj.lastActiveAtMs);
			const stats = formatNodeHostStats(obj.hostStats, connected, Date.now());
			const { heading, ok, warn, muted } = getNodesTheme();
			const status = `${paired ? ok("paired") : warn("unpaired")} · ${connected ? ok("connected") : muted("disconnected")}`;
			const tableWidth = getTerminalTableWidth();
			const rows = [{
				Field: "ID",
				Value: sanitizeTerminalText(nodeId)
			}];
			const addDetail = (field, value) => {
				if (value) rows.push({
					Field: field,
					Value: sanitizeTerminalText(value)
				});
			};
			addDetail("Name", displayName);
			addDetail("Client", client);
			addDetail("IP", ip);
			addDetail("Device", family);
			addDetail("Model", model);
			addDetail("Perms", perms);
			addDetail("Version", versions);
			addDetail("Stats", stats);
			addDetail("PATH", pathEnv);
			addDetail("Last input", lastActive ? `${lastActive}${obj.active === true ? " (active node)" : ""}` : null);
			rows.push({
				Field: "Status",
				Value: status
			});
			addDetail("Approval", approvalState ? formatApprovalStateLabel(approvalState) : null);
			addDetail("Pending request", pendingRequestId ?? null);
			if (pendingCaps) rows.push({
				Field: "Pending caps",
				Value: sanitizeTerminalText(pendingCaps.join(", "))
			});
			addDetail("Pending perms", pendingPerms);
			addDetail(approvalState === "pending-reapproval" ? "Reapprove" : "Approve", approveCommand);
			addDetail("Connection reminder", approveCommand && connectionReminder);
			rows.push({
				Field: "Caps",
				Value: caps ? sanitizeTerminalText(caps.join(", ")) : "?"
			});
			defaultRuntime.log(heading("Node"));
			defaultRuntime.log(renderTable({
				width: tableWidth,
				columns: [{
					key: "Field",
					header: "Field",
					minWidth: 8
				}, {
					key: "Value",
					header: "Value",
					minWidth: 24,
					flex: true
				}],
				rows
			}).trimEnd());
			defaultRuntime.log("");
			defaultRuntime.log(heading("Commands"));
			if (commands.length === 0) defaultRuntime.log(muted("- (none effective)"));
			else for (const c of commands) defaultRuntime.log(`- ${sanitizeTerminalText(c)}`);
			if (pendingCommands.length > 0) {
				defaultRuntime.log("");
				defaultRuntime.log(heading("Pending commands"));
				for (const command of pendingCommands) defaultRuntime.log(`- ${sanitizeTerminalText(command)}`);
			}
		});
	}));
	nodesCallOpts(nodes.command("list").description("List pending and paired nodes").option("--connected", "Only show connected nodes").option("--last-connected <duration>", "Only show nodes connected within duration (e.g. 24h)").action(async (opts) => {
		await runNodesCommand("list", async () => {
			const connectedOnly = Boolean(opts.connected);
			const sinceMs = parseSinceMs(opts.lastConnected, "Invalid --last-connected");
			const result = await callNodesGatewayCli("node.pair.list", opts, {});
			const { pending, paired } = parsePairingList(result);
			const { heading, muted } = getNodesTheme();
			const tableWidth = getTerminalTableWidth();
			const now = Date.now();
			const hasFilters = connectedOnly || sinceMs !== void 0;
			const effectivePairedRows = mergePairedNodesWithEffectiveNodes(paired, hasFilters ? parseNodeList(await callNodeDiagnosticsGatewayCli("node.list", opts, {})) : await tryReadNodeList(opts));
			const filteredPaired = effectivePairedRows.filter((node) => matchesNodeConnectionFilter(node, connectedOnly, sinceMs, now));
			const filteredLabel = hasFilters && filteredPaired.length !== effectivePairedRows.length ? ` (of ${effectivePairedRows.length})` : "";
			if (opts.json) {
				defaultRuntime.writeJson({
					pending,
					paired: filteredPaired.map((row) => {
						const { token: _token, ...rest } = row;
						return rest;
					})
				});
				return;
			}
			defaultRuntime.log(`Pending: ${pending.length} · Paired: ${filteredPaired.length}${filteredLabel}`);
			if (pending.length > 0) {
				const rendered = renderPendingPairingRequestsTable({
					pending,
					now,
					tableWidth,
					theme: {
						heading,
						muted
					}
				});
				defaultRuntime.log("");
				defaultRuntime.log(rendered.heading);
				defaultRuntime.log(rendered.table);
			}
			if (filteredPaired.length > 0) {
				const pairedTableRows = filteredPaired.map((n) => ({
					Node: formatNodeTerminalLabel(n),
					Id: sanitizeTerminalText(n.nodeId),
					IP: sanitizeTerminalText(n.remoteIp ?? ""),
					LastConnect: formatNodeTimeAgo(now, n.lastConnectedAtMs ?? n.connectedAtMs) ?? muted("unknown")
				}));
				defaultRuntime.log("");
				defaultRuntime.log(heading("Paired"));
				defaultRuntime.log(renderTable({
					width: tableWidth,
					columns: [
						{
							key: "Node",
							header: "Node",
							minWidth: 14,
							flex: true
						},
						{
							key: "Id",
							header: "ID",
							minWidth: 10
						},
						{
							key: "IP",
							header: "IP",
							minWidth: 10
						},
						{
							key: "LastConnect",
							header: "Last Connect",
							minWidth: 14
						}
					],
					rows: pairedTableRows
				}).trimEnd());
			}
		});
	}));
}
//#endregion
//#region src/cli/nodes-cli/register.ts
/** Register the `nodes` command group and lazy plugin-provided node commands. */
async function registerNodesCli(program, argv = process.argv) {
	const nodes = program.command("nodes").description("Manage gateway-owned nodes (pairing, status, invoke, and media)").addHelpText("after", () => `\n${theme.heading("Examples:")}\n${formatHelpExamples([
		["openclaw nodes status", "List known nodes with live status."],
		["openclaw nodes pending", "Show pending node pairing requests."],
		["openclaw nodes remove --node <id|name|ip>", "Remove a stale paired node entry."],
		["openclaw nodes invoke --node <id> --command system.which --params '{\"bins\":[\"uname\"]}'", "Invoke a node command directly."],
		["openclaw nodes camera snap --node <id>", "Capture a photo from a node camera."]
	])}\n\n${theme.muted("Docs:")} ${formatDocsLink("/cli/nodes", "docs.openclaw.ai/cli/nodes")}\n`);
	registerNodesStatusCommands(nodes);
	registerNodesPairingCommands(nodes);
	registerNodesInvokeCommands(nodes);
	registerNodesNotifyCommand(nodes);
	registerNodesPushCommand(nodes);
	registerNodesCameraCommands(nodes);
	registerNodesScreenCommands(nodes);
	registerNodesLocationCommands(nodes);
	setCommandJsonMode(nodes, "output", ({ argv: commandArgv }) => isNodesMachineOutput(commandArgv));
	if (!shouldRegisterNodesPluginCommands(nodes, argv)) return;
	const { registerPluginCliCommandsFromValidatedConfig } = await import("./cli-BKVLPEnW.mjs");
	const helpArgv = [...argv];
	const invocation = resolveCliArgvInvocation(helpArgv);
	const parentHelp = invocation.commandPath.length === 1 && invocation.commandPath[0] === "nodes" && (hasFlag(helpArgv, "--help") || hasFlag(helpArgv, "-h"));
	await withConsoleLogsRoutedToStderrForJson(argv, async () => await registerPluginCliCommandsFromValidatedConfig(program, void 0, void 0, {
		mode: parentHelp ? "metadata" : "lazy",
		primary: "nodes"
	}));
}
/** Plugin node subcommands are only resolved when the invocation is not a built-in nodes command. */
function shouldRegisterNodesPluginCommands(nodes, argv) {
	const { commandPath } = resolveCliArgvInvocation([...argv]);
	if (commandPath[0] === "completion") return false;
	if (commandPath[0] !== "nodes") return true;
	const requestedSubcommand = commandPath[1];
	if (!requestedSubcommand) return true;
	return !new Set(nodes.commands.map((command) => command.name())).has(requestedSubcommand);
}
//#endregion
export { registerNodesCli };
