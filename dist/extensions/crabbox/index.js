import { d as asPositiveSafeInteger } from "../../number-coercion-CLj0HTDM.mjs";
import { t as coerceErrorMessage } from "../../error-coercion-C787aVxk.mjs";
import { c as isRecord } from "../../record-coerce-DItp3I4t.mjs";
import { l as normalizeOptionalString } from "../../string-coerce-CIXf7egm.mjs";
import { n as sliceUtf16Safe, r as truncateUtf16Safe } from "../../utf16-slice-D_ngcYKd.mjs";
import { n as resolveCrabboxBinary } from "../../crabbox-binary-BMI8aWfR.mjs";
import { _ as redactSensitiveText, b as redactToolPayloadText } from "../../redact-B5EGyLvV.mjs";
import { n as resolvePreferredOpenClawTmpDir } from "../../tmp-openclaw-dir-BSb3HetY.mjs";
import { i as runCommandWithTimeout } from "../../exec-shcN2-sN.mjs";
import { t as truncateUtf8Prefix } from "../../utf8-truncate-_hf7tp13.mjs";
import { t as WorkerProviderError } from "../../capability-provider.types-BsBg4rOj.mjs";
import "../../error-runtime-Bf1fYXFh.mjs";
import { t as jsonResult } from "../../tool-results-BCM3fdVS.mjs";
import { d as readPositiveIntegerParam, h as readToolStringParam } from "../../common-XfKigJno.mjs";
import "../../string-coerce-runtime-C_MKhRVt.mjs";
import "../../text-utility-runtime-D7I29NA0.mjs";
import { t as SandboxRuntimeRetiredError } from "../../provisioning-error-uEcyhdqf.mjs";
import { d as createRemoteShellSandboxSession, p as createRemoteShellSandboxBackend } from "../../ssh-backend-CH-P-9Ox.mjs";
import { a as getSandboxBackendWorkdirResolver, o as registerSandboxBackend } from "../../backend-CGPDIYBL.mjs";
import { t as definePluginEntry } from "../../plugin-entry-BOulgRcx.mjs";
import "../../sandbox-CpUDPSno.mjs";
import "../../process-runtime-BF3dUvYO.mjs";
import "../../temp-path-PENdksor.mjs";
import "../../logging-core-PsFqpLw0.mjs";
import "../../param-readers-BfezLD6d.mjs";
import { n as ensureManagedCrabboxBinary } from "../../crabbox-managed-binary-B98pQW90.mjs";
import { A as resolveCrabboxProvisionBaseTimeoutMs, C as CRABBOX_WARMUP_TIMEOUT_MS, D as countCrabboxProvisionSetupPhases, E as WARM_IMAGE_NATIVE_WAIT_TIMEOUT_MS, M as resolveCrabboxReadyPollIntervalMs, N as resolveCrabboxWarmImageCaptureTimeoutMs, O as resolveCrabboxCheckpointCaptureTimeoutMs, S as CRABBOX_STOP_TIMEOUT_MS, T as WARM_IMAGE_COMMAND_TIMEOUT_MS, _ as CRABBOX_LIFECYCLE_TIMEOUT_MS, a as buildCrabboxAllocationArgs, b as CRABBOX_NODE_ENROLLMENT_TIMEOUT_MS, c as operationSlug, d as resolveCrabboxProvisionProfile, f as resolveCrabboxWarmImageProfile, g as CRABBOX_DESKTOP_WARMUP_TIMEOUT_MS, h as CRABBOX_COMMAND_SETTLEMENT_TIMEOUT_MS, i as assertCrabboxLeaseId, j as resolveCrabboxProvisionCallTimeoutMs, k as resolveCrabboxLifecycleTimeoutMs, l as parseCrabboxOperatingSystem, m as resolveOpenClawRoot, n as CRABBOX_OS_LABELS, o as listCrabboxMachineOptions, p as resolveCrabboxWarmImageProfileKey, r as CRABBOX_WORKER_PROVIDER_ID, s as operationLeaseId, t as CRABBOX_ENROLLABLE_TARGETS, u as parseCrabboxProfile, v as CRABBOX_MACHINE_CATALOG_TIMEOUT_MS, w as WARM_IMAGE_COMMAND_ROUND_TRIP_TIMEOUT_MS, x as CRABBOX_SETUP_TIMEOUT_MS, y as CRABBOX_NODE_ENROLLMENT_DIAGNOSTIC_TIMEOUT_MS } from "../../crabbox-worker-profile-JlLsFEvg.mjs";
import "../../crabbox-worker-warm-image-records-CKlhPK62.mjs";
import { _ as withoutCrabboxWarmImageOperation, a as crabboxWarmImageCaptureStatus, c as isCrabboxWarmImageHeld, d as openCrabboxWarmImageStore, f as projectCrabboxWarmImage, g as withCrabboxWarmImageGeneration, h as withCrabboxWarmImageDisplayFacts, i as clearCrabboxWarmImageCapture, m as sameCrabboxWarmImageGeneration, n as CrabboxWarmImageRequestError, o as crabboxWarmImageRecoveryHint, r as assertCrabboxWarmImageMigrationReady, s as isCrabboxWarmImageCaptureUncertain, t as CRABBOX_WARM_IMAGE_WAIT_HINT } from "../../crabbox-worker-warm-image-store-mBNWdk8P.mjs";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { isDeepStrictEqual } from "node:util";
import { join } from "node:path";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { setTimeout as setTimeout$1 } from "node:timers/promises";
import { createHash, randomBytes, randomUUID } from "node:crypto";
//#region extensions/crabbox/src/crabbox-sandbox-lease.ts
const CRABBOX_SANDBOX_LEASE_ID_PATTERN = /^cbx_[a-f0-9]{12}$/u;
/** The sandbox registry persists this generation before Crabbox provisioning starts. */
function mintCrabboxSandboxLeaseId() {
	return `cbx_${randomBytes(6).toString("hex")}`;
}
//#endregion
//#region extensions/crabbox/src/crabbox-sandbox-backend.ts
const CRABBOX_SANDBOX_BACKEND_ID = "crabbox";
const CRABBOX_SANDBOX_SLUG = "openclaw-sandbox";
const READY_STATES = /* @__PURE__ */ new Set([
	"started",
	"running",
	"ready"
]);
function configLabel(config) {
	return `${config.provider ?? "configured"}/${config.class ?? "default"}`;
}
function createClient(dependencies) {
	return {
		binary: resolveCrabboxBinary({
			explicit: dependencies.pluginConfig.binary,
			openclawRoot: dependencies.openclawRoot
		}),
		pluginConfig: dependencies.pluginConfig,
		runCommand: dependencies.runCommand ?? runCommandWithTimeout
	};
}
async function runCrabbox(client, action, args, cwd, timeoutMs) {
	let result;
	try {
		result = await client.runCommand([client.binary, ...args], {
			...cwd ? { cwd } : {},
			killProcessTree: true,
			maxOutputBytes: 65536,
			timeoutMs
		});
	} catch (error) {
		throw new Error(`Crabbox sandbox ${action} could not start: ${error instanceof Error ? error.message : String(error)}`, { cause: error });
	}
	if (result.code !== 0) {
		const detail = action === "warmup" ? `exit ${String(result.code)}` : result.stderr.trim() || result.stdout.trim() || `exit ${String(result.code)}`;
		throw new Error(`Crabbox sandbox ${action} failed: ${detail}`);
	}
	return result;
}
async function requireExecSupport(client, cwd) {
	client.execSupport ??= runCrabbox(client, "exec capability", [
		"exec",
		"--check",
		...client.pluginConfig.provider ? ["--provider", client.pluginConfig.provider] : []
	], cwd, 1e4).then((result) => {
		const capability = JSON.parse(result.stdout);
		if (!isRecord(capability) || capability.execution !== true || capability.currentRepoStop !== true) throw new Error("The configured provider lacks repository-owned execution or cleanup.");
	}).catch((error) => {
		client.execSupport = void 0;
		throw new Error("Crabbox sandbox requires a build with claim-owned `crabbox exec` and repository-scoped cleanup for the configured provider. Upgrade Crabbox or select a supported provider before provisioning.", { cause: error });
	});
	await client.execSupport;
}
async function inspectLease(client, leaseId, cwd) {
	const result = await runCrabbox(client, "inspect", [
		"inspect",
		"--id",
		leaseId,
		"--json"
	], cwd, 6e4);
	let parsed;
	try {
		parsed = JSON.parse(result.stdout);
	} catch {
		throw new Error(`Crabbox sandbox inspect returned invalid JSON for ${leaseId}`);
	}
	if (!isRecord(parsed) || parsed.id !== leaseId) throw new Error(`Crabbox sandbox inspect did not return the requested lease ${leaseId}`);
	const state = typeof parsed.state === "string" ? parsed.state : "";
	return {
		state,
		ready: parsed.ready === true || READY_STATES.has(state)
	};
}
async function ensureLease(client, leaseId, cwd) {
	await requireExecSupport(client, cwd);
	const config = client.pluginConfig;
	await runCrabbox(client, "warmup", [
		"warmup",
		...config.provider ? ["--provider", config.provider] : [],
		...config.class ? ["--class", config.class] : [],
		"--lease-id",
		leaseId,
		"--slug",
		CRABBOX_SANDBOX_SLUG,
		"--keep",
		...config.ttl ? ["--ttl", config.ttl] : [],
		...config.idleTimeout ? ["--idle-timeout", config.idleTimeout] : []
	], cwd, 6e5);
	const lease = await inspectLease(client, leaseId, cwd);
	if (!lease.ready) throw new Error(`Crabbox lease ${leaseId} is not ready (state=${lease.state || "unknown"})`);
}
async function stopLease(client, leaseId, cwd) {
	await runCrabbox(client, "stop", [
		"stop",
		"--current-repo",
		"--id",
		leaseId
	], cwd, 3e5);
}
function createCrabboxSandboxBackendFactory(dependencies) {
	const client = createClient(dependencies);
	return async (params) => {
		if ((params.cfg.docker.binds?.length ?? 0) > 0) throw new Error("Crabbox sandbox backend does not support sandbox.docker.binds.");
		const { runtimeId, assertRuntimeCurrent, workspaceDir } = params;
		if (!CRABBOX_SANDBOX_LEASE_ID_PATTERN.test(runtimeId)) throw new Error("Crabbox sandbox requires a fixed lease runtime ID.");
		assertRuntimeCurrent();
		await requireExecSupport(client, workspaceDir);
		assertRuntimeCurrent();
		try {
			await ensureLease(client, runtimeId, workspaceDir);
		} catch (error) {
			if ((await inspectLease(client, runtimeId, workspaceDir).catch(() => void 0))?.state === "released") throw new SandboxRuntimeRetiredError(runtimeId);
			throw error;
		}
		assertRuntimeCurrent();
		return createRemoteShellSandboxBackend(params, {
			backendId: CRABBOX_SANDBOX_BACKEND_ID,
			runtimeId,
			configLabel: configLabel(client.pluginConfig),
			configLabelKind: "Lease",
			createSession: async () => createRemoteShellSandboxSession({
				assertCurrent: assertRuntimeCurrent,
				buildCommand: ({ remoteCommand, tty }) => ({
					argv: [
						client.binary,
						"exec",
						"--id",
						runtimeId,
						...tty ? ["--pty"] : [],
						"--",
						"/bin/sh",
						"-c",
						remoteCommand
					],
					env: process.env,
					cwd: workspaceDir
				})
			})
		});
	};
}
function createCrabboxSandboxBackendManager(dependencies) {
	const client = createClient(dependencies);
	const label = configLabel(client.pluginConfig);
	return {
		async describeRuntime({ entry }) {
			if (!CRABBOX_SANDBOX_LEASE_ID_PATTERN.test(entry.containerName)) return {
				running: false,
				configLabelMatch: false
			};
			try {
				return {
					running: (await inspectLease(client, entry.containerName, entry.workspaceDir)).ready,
					actualConfigLabel: entry.image,
					configLabelMatch: entry.image === label
				};
			} catch {
				return {
					running: false,
					actualConfigLabel: entry.image,
					configLabelMatch: false
				};
			}
		},
		async removeRuntime({ entry }) {
			if (!CRABBOX_SANDBOX_LEASE_ID_PATTERN.test(entry.containerName)) throw new Error(`Crabbox sandbox runtime ${entry.containerName} is not a fixed lease id`);
			try {
				await stopLease(client, entry.containerName, entry.workspaceDir);
			} catch (error) {
				if (entry.runtimeState !== "removing-pending" || !entry.workspaceDir) throw error;
				await ensureLease(client, entry.containerName, entry.workspaceDir);
				await stopLease(client, entry.containerName, entry.workspaceDir);
			}
		}
	};
}
function resolveCrabboxSandboxWorkdir(params) {
	const resolver = getSandboxBackendWorkdirResolver("ssh");
	if (!resolver) throw new Error("Crabbox sandbox backend requires the shared remote workspace layout");
	return resolver({
		...params,
		cfg: {
			...params.cfg,
			backend: "ssh"
		}
	});
}
//#endregion
//#region extensions/crabbox/src/crabbox-sandbox-config.ts
const DURATION_PATTERN = /^\d+(?:ms|s|m|h)$/u;
const STRING_FIELDS = [
	"provider",
	"class",
	"binary"
];
const DURATION_FIELDS = ["ttl", "idleTimeout"];
const KNOWN_FIELDS = /* @__PURE__ */ new Set([...STRING_FIELDS, ...DURATION_FIELDS]);
/** Returns undefined when no sandbox block is configured; the backend then stays unregistered. */
function resolveCrabboxSandboxConfig(pluginConfig) {
	const raw = pluginConfig?.sandbox;
	if (raw === void 0) return;
	if (!isRecord(raw)) throw new Error("Crabbox sandbox must be an object.");
	for (const key of Object.keys(raw)) if (!KNOWN_FIELDS.has(key)) throw new Error(`Crabbox sandbox.${key} is not a supported option.`);
	const resolved = {};
	for (const key of STRING_FIELDS) {
		const value = raw[key];
		if (value === void 0) continue;
		const trimmed = typeof value === "string" ? value.trim() : "";
		if (!trimmed) throw new Error(`Crabbox sandbox.${key} must be a non-empty string.`);
		resolved[key] = trimmed;
	}
	for (const key of DURATION_FIELDS) {
		const value = raw[key];
		if (value === void 0) continue;
		const trimmed = typeof value === "string" ? value.trim() : "";
		if (!DURATION_PATTERN.test(trimmed)) throw new Error(`Crabbox sandbox.${key} must be a duration such as 90m, 2h, or 30s.`);
		resolved[key] = trimmed;
	}
	return resolved;
}
//#endregion
//#region extensions/crabbox/src/crabbox-tool.ts
const CRABBOX_TOOL_PARAMETERS = {
	type: "object",
	additionalProperties: false,
	required: ["action"],
	properties: {
		action: {
			type: "string",
			enum: [
				"profiles",
				"create",
				"status",
				"exec",
				"process_status",
				"process_stop",
				"stop"
			]
		},
		profileId: {
			type: "string",
			description: "create: configured Crabbox profile; optional when only one is configured."
		},
		environmentId: {
			type: "string",
			description: "Target attached to this conversation. Omit to use its current attachment."
		},
		os: {
			type: "string",
			description: "create: an operating system advertised by the profile."
		},
		machineClass: {
			type: "string",
			description: "create: a machine class advertised by the profile."
		},
		presentation: {
			type: "string",
			enum: ["desktop", "portal"],
			description: "create: for open-and-show requests, open the native Desktop or web Portal sidebar immediately with provisioning progress. Omit when no viewer was requested."
		},
		argv: {
			type: "array",
			items: { type: "string" },
			minItems: 1,
			maxItems: 128,
			description: "exec: executable and arguments, run in the remote workspace. Use a shell explicitly for shell syntax."
		},
		input: {
			type: "string",
			description: "exec: bounded standard input for the command."
		},
		timeoutMs: {
			type: "integer",
			minimum: 1,
			maximum: 6e5,
			description: "exec: foreground command timeout."
		},
		background: {
			type: "boolean",
			description: "exec: start an owned app/server that survives this turn. Returns processId."
		},
		processId: {
			type: "string",
			description: "process_status/process_stop: identifier returned by background exec."
		}
	}
};
function operationId(sessionId, toolCallId) {
	return createHash("sha256").update(JSON.stringify([sessionId, toolCallId])).digest("hex");
}
function createCrabboxTool({ context, gateway }) {
	const config = () => context.getRuntimeConfig?.() ?? context.runtimeConfig ?? context.config;
	const profiles = () => Object.entries(config()?.cloudWorkers?.profiles ?? {}).filter(([, profile]) => profile.provider === "crabbox");
	if (context.sandboxed || !context.sessionKey || !context.sessionId || profiles().length === 0) return null;
	const sessionId = context.sessionId;
	return {
		name: "crabbox",
		label: "Crabbox",
		description: "Create and use a temporary Crabbox attached to this conversation while keeping the agent and its main workspace in place. profiles lists configured machines and desktop capability; create reuses the current attachment. For open-and-show requests, pass presentation=desktop for native apps or portal for web apps to open the sidebar during provisioning. exec runs commands there, with background=true for persistent apps and servers. Inspect/stop owned processes or stop the entire box. Desktop-enabled profiles support native app viewing and computer use. Read the crabbox-apps skill for the complete workflow.",
		parameters: CRABBOX_TOOL_PARAMETERS,
		resultContentSource: "network",
		async execute(toolCallId, rawArgs, signal) {
			signal?.throwIfAborted();
			const params = rawArgs;
			const action = readToolStringParam(params, "action", { required: true });
			const environmentId = readToolStringParam(params, "environmentId");
			const target = environmentId ? { environmentId } : {};
			if (action === "profiles") {
				const catalog = await gateway.request("environments.list", { projection: "profiles" });
				const configured = new Map(profiles());
				const machineProfiles = [];
				for (const profile of catalog.profiles ?? []) if (profile.providerId === "crabbox") machineProfiles.push({
					...profile,
					desktop: configured.get(profile.id)?.settings?.desktop === true
				});
				return jsonResult({ profiles: machineProfiles });
			}
			if (action === "create") {
				const available = profiles();
				const profileId = readToolStringParam(params, "profileId") ?? (available.length === 1 ? available[0]?.[0] : void 0);
				if (!profileId || !available.some(([id]) => id === profileId)) throw new Error("Choose a configured Crabbox profile using action=profiles, then pass its profileId to create.");
				const os = readToolStringParam(params, "os");
				const machineClass = readToolStringParam(params, "machineClass");
				const presentation = readToolStringParam(params, "presentation");
				if (presentation !== void 0 && presentation !== "desktop" && presentation !== "portal") throw new Error("presentation must be desktop or portal");
				return jsonResult(await gateway.request("environments.session.create", {
					profileId,
					idempotencyKey: operationId(sessionId, toolCallId),
					...os ? { os } : {},
					...machineClass ? { machineClass } : {},
					...presentation ? { presentation } : {}
				}, {
					timeoutMs: 12e5,
					scopes: ["operator.admin"]
				}));
			}
			if (action === "status" || action === "stop") return jsonResult(await gateway.request(action === "status" ? "environments.session.status" : "environments.session.destroy", target, {
				timeoutMs: action === "stop" ? 6e5 : 3e4,
				scopes: [action === "stop" ? "operator.admin" : "operator.read"]
			}));
			if (action === "exec") {
				const argv = params.argv;
				if (!Array.isArray(argv) || argv.length === 0 || !argv.every((arg) => typeof arg === "string")) throw new Error("argv must be a non-empty array of strings");
				const input = readToolStringParam(params, "input", {
					trim: false,
					allowEmpty: true
				});
				const timeoutMs = readPositiveIntegerParam(params, "timeoutMs", { max: 6e5 });
				if (params.background !== void 0 && typeof params.background !== "boolean") throw new Error("background must be a boolean");
				const processId = params.background === true ? `app-${operationId(sessionId, toolCallId)}` : void 0;
				try {
					return jsonResult(await gateway.request("environments.session.exec", {
						...target,
						action: params.background === true ? "start" : "run",
						argv,
						...input === void 0 ? {} : { input },
						...timeoutMs === void 0 ? {} : { timeoutMs },
						...processId ? { processId } : {}
					}, {
						timeoutMs: 18e5 + (timeoutMs ?? 12e4) + 15e3,
						scopes: ["operator.admin"]
					}));
				} catch (error) {
					if (!processId) throw error;
					throw new Error(`${error instanceof Error ? error.message : String(error)}\nBackground processId: ${processId}. Check process_status for this ID before retrying; a failed response does not prove that the app failed to start.`, { cause: error });
				}
			}
			if (action === "process_status" || action === "process_stop") return jsonResult(await gateway.request("environments.session.exec", {
				...target,
				action: action === "process_status" ? "status" : "stop",
				processId: readToolStringParam(params, "processId", { required: true })
			}, {
				timeoutMs: 6e4,
				scopes: ["operator.admin"]
			}));
			throw new Error(`Unknown Crabbox action: ${action}`);
		}
	};
}
//#endregion
//#region extensions/crabbox/src/crabbox-worker-command-error.ts
const MAX_COMMAND_DETAIL_CHARS = 512;
function crabboxCommandDetail(result) {
	const raw = [result.stdout, result.stderr].filter(Boolean).join("\n").trim();
	if (!raw) return "";
	const compressed = redactSensitiveText(raw).replace(/\s+/gu, " ");
	return compressed.length <= MAX_COMMAND_DETAIL_CHARS ? `: ${compressed}` : `: ... ${sliceUtf16Safe(compressed, -508)}`;
}
function crabboxCommandError(action, result) {
	if (result.termination !== "exit") return /* @__PURE__ */ new Error(`Crabbox ${action} did not exit normally (${result.termination})${crabboxCommandDetail(result)}`);
	const exitCode = result.code === null ? "unknown" : String(result.code);
	return /* @__PURE__ */ new Error(`Crabbox ${action} failed with exit code ${exitCode}${crabboxCommandDetail(result)}`);
}
//#endregion
//#region extensions/crabbox/src/crabbox-worker-command.ts
const MAX_OUTPUT_BYTES = 65536;
async function runCrabboxCommand(params) {
	params.signal?.throwIfAborted();
	let result;
	try {
		result = await params.runCommand([params.binary, ...params.args], {
			timeoutMs: params.timeoutMs,
			maxOutputBytes: MAX_OUTPUT_BYTES,
			killProcessTree: true,
			...params.env === void 0 ? {} : { env: params.env },
			...params.input === void 0 ? {} : { input: params.input },
			...params.signal ? { signal: params.signal } : {}
		});
	} catch {
		params.signal?.throwIfAborted();
		throw new Error(`Crabbox ${params.action} could not start`);
	}
	params.signal?.throwIfAborted();
	return result;
}
function isUnrecognizedLease(result, identifier) {
	const output = `${result.stderr}\n${result.stdout}`;
	if (!output.includes(identifier) || /\b(?:access\s+denied|authentication|authorization|credentials?|forbidden|permission|token|unauthorized)\b/iu.test(output)) return false;
	return result.code === 4 && /\b(?:was\s+)?not found\b/iu.test(output) || result.code === 4 && /\bno longer exists\b/iu.test(output) || result.code === 4 && /\b(?:points to|is bound to) (?:a )?missing (?:instance|sandbox)\b/iu.test(output) || result.code === 4 && /\bdisappeared before release\b/iu.test(output) || result.code === 4 && /\bunknown blacksmith testbox(?:\s|:)/iu.test(output) || result.code === 4 && /\bis not claimed by Crabbox\b/iu.test(output) || result.code === 4 && /\bwandb sandbox "[^"\r\n]+" has no matching local ownership claim\b/iu.test(output) || result.code === 5 && /\bcoder workspace "[^"\r\n]+" not found\b/iu.test(output) || /\bcoordinator GET \S*\/v1\/leases\/\S+:\s*http 404\b/iu.test(output) || result.code === 4 && /\bunknown lease(?:\s|:)/iu.test(output);
}
async function stopCrabboxLease(params) {
	const result = await runCrabboxCommand({
		action: "stop",
		args: [
			"stop",
			"--provider",
			params.provider,
			"--id",
			params.id
		],
		binary: params.binary,
		runCommand: params.runCommand,
		timeoutMs: CRABBOX_STOP_TIMEOUT_MS
	});
	if (result.termination === "exit" && result.code === 0) return;
	throw crabboxCommandError("stop", result);
}
//#endregion
//#region extensions/crabbox/src/crabbox-worker-heartbeat.ts
function providerDoesNotSupportHeartbeat(result) {
	const output = `${result.stderr}\n${result.stdout}`;
	if (result.termination === "exit" && result.code === 2 && /\bprovider=\S+ does not support lease heartbeat\b/iu.test(output)) return true;
	return false;
}
function createCrabboxHeartbeatManager(dependencies) {
	const entries = /* @__PURE__ */ new Map();
	let disposed = false;
	const isCurrent = (entry) => !disposed && entries.get(entry.id) === entry && !entry.controller.signal.aborted;
	const warn = (entry, message) => dependencies.warn(`${message}; cloud worker machines may be reaped after ${entry.idleTimeout} of coordinator-idle time`);
	const schedule = (entry, delayMs = entry.heartbeatIntervalMs) => {
		if (!isCurrent(entry)) return;
		entry.timer = setTimeout(() => {
			entry.pending = heartbeat(entry);
		}, delayMs);
		entry.timer.unref?.();
	};
	const heartbeat = async (entry) => {
		if (!isCurrent(entry)) return;
		let result;
		const startedAt = Date.now();
		try {
			result = await dependencies.run(entry, entry.controller.signal);
		} catch (error) {
			if (isCurrent(entry) && !entry.failureWarned) {
				entry.failureWarned = true;
				warn(entry, error instanceof Error ? error.message : "Crabbox heartbeat failed");
			}
			schedule(entry);
			return;
		}
		if (!isCurrent(entry)) return;
		if (result.termination === "exit" && result.code === 0) {
			entry.failureWarned = false;
			schedule(entry);
			return;
		}
		if (providerDoesNotSupportHeartbeat(result)) {
			warn(entry, `Crabbox provider ${entry.provider} does not support heartbeat for worker lease ${entry.id}`);
			return;
		}
		if (!entry.failureWarned) {
			entry.failureWarned = true;
			const message = crabboxCommandError("heartbeat", result).message;
			warn(entry, message.replace("(timeout)", `(timeout after ${Date.now() - startedAt} ms)`));
		}
		schedule(entry);
	};
	const stop = async (leaseId) => {
		const entry = entries.get(leaseId);
		if (!entry) return;
		entry.controller.abort();
		clearTimeout(entry.timer);
		try {
			await entry.pending;
		} finally {
			if (entries.get(leaseId) === entry) entries.delete(leaseId);
		}
	};
	return {
		start(context) {
			if (disposed || entries.has(context.id)) return;
			const entry = {
				...context,
				failureWarned: false,
				controller: new AbortController()
			};
			entries.set(context.id, entry);
			schedule(entry, 0);
		},
		stop,
		async dispose() {
			disposed = true;
			await Promise.all([...entries.keys()].map(stop));
		}
	};
}
//#endregion
//#region extensions/crabbox/src/crabbox-worker-machine-options.ts
function parseCrabboxMachineShapes(stdout) {
	const parsed = JSON.parse(stdout);
	if (!Array.isArray(parsed)) throw new Error("Crabbox providers returned invalid JSON");
	return new Map(parsed.flatMap((entry) => {
		if (!isRecord(entry)) return [];
		const provider = normalizeOptionalString(entry.provider)?.toLowerCase();
		if (!provider) return [];
		const targets = Array.isArray(entry.targets) ? entry.targets : [];
		const operatingSystems = CRABBOX_ENROLLABLE_TARGETS.filter((os) => targets.includes(os));
		const profiles = isRecord(entry.classCatalog) && entry.classCatalog.disposition === "mapped" && Array.isArray(entry.classCatalog.profiles) ? entry.classCatalog.profiles.filter(isRecord) : [];
		return [[provider, {
			operatingSystems,
			machines: operatingSystems.flatMap((os) => {
				const [target, windowsMode] = os.split("/");
				const matching = profiles.filter((raw) => raw.target === target && (windowsMode === void 0 || raw.windowsMode === windowsMode));
				const amd64 = matching.some((raw) => raw.architecture === "amd64");
				return matching.flatMap((raw) => {
					if (amd64 && raw.architecture !== "amd64" || !isRecord(raw.primary)) return [];
					const machineClass = normalizeOptionalString(raw.class);
					if (!machineClass) return [];
					const cpu = asPositiveSafeInteger(raw.primary.vcpu);
					const memory = raw.primary.memory;
					const memoryGb = isRecord(memory) && (memory.unit === "GB" || memory.unit === "GiB") ? asPositiveSafeInteger(memory.value) : void 0;
					return [{
						class: machineClass,
						os,
						...cpu ? { cpu } : {},
						...memoryGb ? { memoryGb } : {}
					}];
				});
			})
		}]];
	}));
}
function createCrabboxMachineOptionsResolver(dependencies) {
	const machineShapesByBinary = /* @__PURE__ */ new Map();
	const loadMachineShapes = async (binary) => {
		const result = await dependencies.runCommand([
			binary,
			"providers",
			"--json"
		], {
			maxOutputBytes: 1048576,
			killProcessTree: true,
			timeoutMs: CRABBOX_MACHINE_CATALOG_TIMEOUT_MS
		});
		if (result.termination !== "exit" || result.code !== 0) throw new Error(`Crabbox providers command failed (${result.termination}, code ${result.code})`);
		return parseCrabboxMachineShapes(result.stdout);
	};
	const resolveCatalog = async (profile) => {
		const parsed = parseCrabboxProfile(profile);
		const binary = await dependencies.resolveBinary(parsed.binary);
		let shapes = machineShapesByBinary.get(binary);
		if (!shapes) {
			shapes = loadMachineShapes(binary).catch((error) => {
				machineShapesByBinary.delete(binary);
				dependencies.warn(`Crabbox machine shapes unavailable: ${error instanceof Error ? error.message : String(error)}`);
				return /* @__PURE__ */ new Map();
			});
			machineShapesByBinary.set(binary, shapes);
		}
		return {
			parsed,
			catalog: (await shapes).get(parsed.provider)
		};
	};
	return {
		async listMachineOptions(profile) {
			const { parsed, catalog } = await resolveCatalog(profile);
			return listCrabboxMachineOptions(parsed.class, catalog?.machines);
		},
		async listOperatingSystems(profile) {
			const { parsed, catalog } = await resolveCatalog(profile);
			return (catalog?.operatingSystems ?? []).map((id) => {
				const label = CRABBOX_OS_LABELS[id];
				return id === parsed.target ? {
					id,
					label,
					default: true
				} : {
					id,
					label
				};
			});
		}
	};
}
//#endregion
//#region extensions/crabbox/src/crabbox-worker-script.ts
/** Crabbox executes script-stdin with the target's native shell. */
function wrapCrabboxNodeScript(script, target = "linux", delimiter = "CRABBOX_NODE_SCRIPT") {
	if (target !== "windows/normal") return `set -eu\nnode <<'${delimiter}'\n${script}\n${delimiter}`;
	return `$ErrorActionPreference = 'Stop'
$node = Get-Command node -CommandType Application -ErrorAction SilentlyContinue
if (-not $node) { throw 'Cloud worker requires Node.js on PATH; update the Crabbox Windows bootstrap image and reprovision the worker' }
$scriptPath = Join-Path $env:TEMP ('openclaw-' + [Guid]::NewGuid().ToString('N') + '.cjs')
try {
  $source = [Text.Encoding]::UTF8.GetString([Convert]::FromBase64String('${Buffer.from(script).toString("base64")}'))
  [IO.File]::WriteAllText($scriptPath, $source, [Text.UTF8Encoding]::new($false))
  & $node.Source $scriptPath
  $code = $LASTEXITCODE
} finally {
  Remove-Item -LiteralPath $scriptPath -Force -ErrorAction SilentlyContinue
}
exit $code`;
}
//#endregion
//#region extensions/crabbox/src/crabbox-worker-node-enrollment-diagnostics.ts
const MAX_NODE_ENROLLMENT_EVIDENCE_BYTES = 2048;
async function collectCrabboxNodeEnrollmentEvidence(params) {
	let label = "box evidence";
	let detail;
	try {
		const result = await runCrabboxCommand({
			action: "enrollment diagnostics",
			args: params.args,
			binary: params.binary,
			input: wrapCrabboxNodeScript(`const fs = require("node:fs");
const path = require("node:path");
const state = path.join(require("node:os").homedir(), ".openclaw", ${JSON.stringify(`cloud-workers/${params.id}`)});
let runtime = "absent";
let alive = false;
let tail = "absent";
try { runtime = fs.readlinkSync(path.join(state, "runtime")); } catch {}
try {
  const text = fs.readFileSync(path.join(state, "node.pid"), "utf8").trim();
  if (/^[1-9][0-9]*$/.test(text)) { process.kill(Number(text), 0); alive = true; }
} catch {}
try {
  const fd = fs.openSync(path.join(state, "node.log"), "r");
  try {
    const size = fs.fstatSync(fd).size;
    const bom = Buffer.alloc(2);
    fs.readSync(fd, bom, 0, 2, 0);
    // Windows PowerShell 5.1 redirects to UTF-16LE, POSIX Node writes UTF-8.
    const utf16 = bom[0] === 0xff && bom[1] === 0xfe;
    const start = Math.max(0, size - 2000);
    const buffer = Buffer.alloc(Math.min(2000, size));
    const bytes = fs.readSync(fd, buffer, 0, buffer.length, utf16 ? start - start % 2 : start);
    tail = buffer.subarray(0, bytes).toString(utf16 ? "utf16le" : "utf8");
  } finally { fs.closeSync(fd); }
} catch {}
process.stdout.write("node-runtime=" + runtime + " node-pid=" + (alive ? "alive" : "dead-or-absent") + " node.log tail: " + tail);`, params.target),
			runCommand: params.runCommand,
			...params.signal ? { signal: params.signal } : {},
			timeoutMs: CRABBOX_NODE_ENROLLMENT_DIAGNOSTIC_TIMEOUT_MS
		});
		if (result.termination !== "exit" || result.code !== 0) throw crabboxCommandError("enrollment diagnostics", result);
		detail = result.stdout.trim();
		if (!detail) throw new Error("diagnostic command returned no output");
	} catch (error) {
		label = "box evidence unavailable";
		detail = error instanceof Error ? error.message : "diagnostic command failed";
	}
	const prefix = `${label}: `;
	const safeDetail = redactToolPayloadText(detail).replace(/\s+/gu, " ").trim();
	return `${prefix}${truncateUtf8Prefix(safeDetail, MAX_NODE_ENROLLMENT_EVIDENCE_BYTES - prefix.length)}`;
}
//#endregion
//#region extensions/crabbox/src/crabbox-worker-desktop-macos.ts
const CRABBOX_MACOS_APP_PATH = "/Applications/OpenClawCloudWorker.app";
const CRABBOX_MACOS_HOST_VERSION = 1;
const MACOS_DESKTOP_ROOT = "/var/db/crabbox/openclaw-workers";
const MACOS_CDP_PORT = 9222;
function quote$1(value) {
	return `'${value.replaceAll("'", "'\\''")}'`;
}
function crabboxMacosDesktopDirectory(leaseId) {
	assertCrabboxLeaseId(leaseId);
	return `${MACOS_DESKTOP_ROOT}/${leaseId}`;
}
function desktopRoot(leaseId, sshUser) {
	if (typeof sshUser !== "string" || !/^[A-Za-z0-9_][A-Za-z0-9._-]{0,62}$/u.test(sshUser)) throw new Error("Crabbox macOS desktop requires its inspected SSH account username");
	return crabboxMacosDesktopDirectory(leaseId);
}
function requireGuiAccount(sshUser) {
	return `worker_user=$(/usr/bin/id -un)
worker_uid=$(/usr/bin/id -u)
[ "$worker_user" = ${quote$1(sshUser)} ] && [ "$worker_uid" -ne 0 ] || { echo 'Cloud desktop must run as its inspected macOS account' >&2; exit 1; }
[ "$(/usr/bin/stat -f '%u' /dev/console)" = "$worker_uid" ] || { echo 'Sign in to the worker macOS account before dispatching a desktop session' >&2; exit 1; }
/bin/launchctl print "gui/$worker_uid" >/dev/null 2>&1 || { echo 'The worker macOS GUI session is unavailable; sign in before dispatch' >&2; exit 1; }`;
}
/** SSH needs root to adopt another audit session; GUI commands still run as the lease account. */
function createCrabboxMacosGuiLaunchScript() {
	return `set -euo pipefail
worker_uid=$(/usr/bin/id -u)
worker_user=$(/usr/bin/id -un)
[ "$worker_uid" -ne 0 ] && [ "$(/usr/bin/stat -f '%u' /dev/console)" = "$worker_uid" ] || { echo 'The worker account no longer owns the macOS desktop' >&2; exit 1; }
worker_home=$(/usr/bin/dscl . -read "/Users/$worker_user" NFSHomeDirectory | sed 's/^NFSHomeDirectory: //')
worker_tmp=$(/usr/bin/getconf DARWIN_USER_TEMP_DIR)
case "$worker_home:$worker_tmp" in /*:/*) ;; *) echo 'The worker account home or temporary directory is unavailable' >&2; exit 1 ;; esac
exec /usr/bin/sudo -n -- /bin/launchctl asuser "$worker_uid" /usr/bin/sudo -n -u "#$worker_uid" -- /usr/bin/env -i HOME="$worker_home" USER="$worker_user" LOGNAME="$worker_user" PATH="$PATH" TMPDIR="$worker_tmp" LC_ALL=C /bin/sh -c 'cd -- "$1"; shift; exec "$@"' openclaw-gui "$PWD" "$@"`;
}
function browserLauncher$2(root, sshUser) {
	return `#!/bin/bash
set -euo pipefail
[ "$#" -eq 0 ] || { echo 'Cloud browser launcher does not accept arguments' >&2; exit 64; }
${requireGuiAccount(sshUser)}
exec /bin/bash -c ${quote$1(createCrabboxMacosGuiLaunchScript())} openclaw-gui /usr/bin/lockf -k -t 25 ${quote$1(`${root}/browser-profile/.launch.lock`)} /bin/bash <<'CRABBOX_BROWSER_LOCKED'
set -euo pipefail
profile=${quote$1(`${root}/browser-profile`)}
browser='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
[ -x "$browser" ] || { echo 'Install Google Chrome in the macOS worker image' >&2; exit 1; }
cdp_url=http://127.0.0.1:${MACOS_CDP_PORT}/json/version
owned_browser() {
  [ -f "$profile/browser.pid" ] || return 1
  browser_pid=$(cat "$profile/browser.pid")
  case "$browser_pid" in ''|*[!0-9]*) return 1 ;; esac
  [ "$(/bin/ps -p "$browser_pid" -o uid= | tr -d ' ')" = "$(/usr/bin/id -u)" ] || return 1
  browser_command=$(/bin/ps -ww -p "$browser_pid" -o command=) || return 1
  case "$browser_command" in "$browser "*) ;; *) return 1 ;; esac
  case "$browser_command" in *"--user-data-dir=$profile "*) ;; *) return 1 ;; esac
}
cdp_ready() { /usr/bin/curl --fail --silent --max-time 1 "$cdp_url" >/dev/null; }
owned_cdp() {
  owned_browser || return 1
  /usr/sbin/lsof -nP -a -p "$browser_pid" -iTCP:${MACOS_CDP_PORT} -sTCP:LISTEN -Fn | grep -Fx 'n127.0.0.1:${MACOS_CDP_PORT}' >/dev/null
}
if cdp_ready; then
  owned_cdp || { echo 'CDP port belongs to another browser; reprovision the desktop worker' >&2; exit 1; }
  exit 0
fi
if ! owned_browser; then
  /usr/bin/nohup "$browser" "--user-data-dir=$profile" --remote-debugging-address=127.0.0.1 --remote-debugging-port=${MACOS_CDP_PORT} --no-first-run --no-default-browser-check about:blank >>"$profile/launch.log" 2>&1 </dev/null &
  printf '%s\\n' "$!" >"$profile/browser.pid"
fi
for ((attempt=0; attempt<40; attempt++)); do
  if cdp_ready; then owned_cdp && exit 0; fi
  sleep 0.5
done
echo 'Cloud browser CDP did not become ready within 20 seconds' >&2
exit 1
CRABBOX_BROWSER_LOCKED`;
}
function terminalLauncher$1(sshUser) {
	return `#!/bin/bash
set -euo pipefail
[ "$#" -eq 0 ] || { echo 'Cloud terminal launcher does not accept arguments' >&2; exit 64; }
${requireGuiAccount(sshUser)}
exec /bin/bash -c ${quote$1(createCrabboxMacosGuiLaunchScript())} openclaw-gui /usr/bin/open -a /System/Applications/Utilities/Terminal.app`;
}
function createCrabboxMacosDesktopSetup(leaseId, wallpaperBase64, sshUser) {
	const root = desktopRoot(leaseId, sshUser);
	if (!/^[A-Za-z0-9+/]+={0,2}$/u.test(wallpaperBase64)) throw new Error("Crabbox macOS desktop wallpaper must be base64");
	return `set +x
set -euo pipefail
umask 077
${requireGuiAccount(sshUser)}
app=${quote$1(CRABBOX_MACOS_APP_PATH)}
plist="$app/Contents/Info.plist"
[ -x "$app/Contents/MacOS/OpenClaw" ] && [ -x "$app/Contents/Resources/cua-driver" ] || { echo 'Install the signed OpenClaw Cloud Worker app with its bundled CUA driver in the worker image' >&2; exit 1; }
/usr/bin/codesign --verify --deep --strict "$app" || { echo 'The macOS worker app signature is invalid; replace the image app' >&2; exit 1; }
signature=$(/usr/bin/codesign -dv --verbose=4 "$app" 2>&1)
printf '%s\\n' "$signature" | grep -q '^Authority=Developer ID Application:' || { echo 'The macOS worker app needs a Developer ID Application signature' >&2; exit 1; }
printf '%s\\n' "$signature" | grep -Eq '^TeamIdentifier=[A-Z0-9]{10}$' || { echo 'The macOS worker app signing team is missing' >&2; exit 1; }
[ "$(/usr/libexec/PlistBuddy -c 'Print :CFBundleExecutable' "$plist")" = OpenClaw ] || { echo 'The worker app executable identity is invalid' >&2; exit 1; }
bundle_id=$(/usr/libexec/PlistBuddy -c 'Print :CFBundleIdentifier' "$plist")
[ "$bundle_id" = ai.openclaw.cloud-worker ] || { echo 'The desktop requires the separate OpenClaw Cloud Worker app identity' >&2; exit 1; }
[ "$(/usr/libexec/PlistBuddy -c 'Print :OpenClawCloudWorkerHostVersion' "$plist")" = ${CRABBOX_MACOS_HOST_VERSION} ] || { echo 'Update the signed OpenClaw Cloud Worker app in the worker image for cloud desktop support' >&2; exit 1; }
worker_group=$(/usr/bin/id -gn)
worker_root=${quote$1(root)}
sudo -n -- /usr/bin/install -d -o root -g wheel -m 0755 ${quote$1(MACOS_DESKTOP_ROOT)}
sudo -n -- /usr/bin/install -d -o "$worker_user" -g "$worker_group" -m 0700 "$worker_root"
[ ! -L "$worker_root" ] && [ "$(/usr/bin/stat -f '%u' "$worker_root")" = "$worker_uid" ] || { echo 'The cloud desktop directory is not owned by its worker account' >&2; exit 1; }
setup_dir=$(mktemp -d "$worker_root/.setup.XXXXXX")
trap 'rm -rf -- "$setup_dir"' EXIT
sudo -n -- /bin/cat /var/db/crabbox/vnc.password >"$setup_dir/vnc.password"
[ -s "$setup_dir/vnc.password" ] || { echo 'The managed macOS desktop credential is missing' >&2; exit 1; }
chmod 0600 "$setup_dir/vnc.password"
mv -f "$setup_dir/vnc.password" "$worker_root/vnc.password"
cat >"$setup_dir/browser" <<'CRABBOX_BROWSER_LAUNCHER'
${browserLauncher$2(root, sshUser)}
CRABBOX_BROWSER_LAUNCHER
cat >"$setup_dir/terminal" <<'CRABBOX_TERMINAL_LAUNCHER'
${terminalLauncher$1(sshUser)}
CRABBOX_TERMINAL_LAUNCHER
chmod 0700 "$setup_dir/browser" "$setup_dir/terminal"
mv -f "$setup_dir/browser" "$worker_root/browser"
mv -f "$setup_dir/terminal" "$worker_root/terminal"
mkdir -p "$worker_root/browser-profile"
chmod 0700 "$worker_root/browser-profile"
printf '%s' ${quote$1(wallpaperBase64)} | /usr/bin/base64 -D >"$setup_dir/wallpaper.png"
mv -f "$setup_dir/wallpaper.png" "$worker_root/wallpaper.png"
"$worker_root/browser"`;
}
function createCrabboxMacosDesktopEndpoint(leaseId, sshUser) {
	const root = desktopRoot(leaseId, sshUser);
	return {
		protocol: "rfb",
		port: 5900,
		allowsResize: false,
		username: sshUser,
		passwordFilePath: `${root}/vnc.password`,
		apps: [{
			id: "browser",
			executablePath: `${root}/browser`,
			cdpPort: MACOS_CDP_PORT
		}, {
			id: "terminal",
			executablePath: `${root}/terminal`
		}]
	};
}
//#endregion
//#region extensions/crabbox/src/crabbox-worker-desktop-windows.ts
const WINDOWS_POWERSHELL = String.raw`C:\Windows\System32\WindowsPowerShell\v1.0\powershell.exe`;
const WINDOWS_DESKTOP_ROOT = String.raw`C:\ProgramData\OpenClaw\cloud-workers`;
const WINDOWS_CDP_PORT = 9222;
function quote(value) {
	return `'${value.replaceAll("'", "''")}'`;
}
function desktopDirectory(leaseId) {
	return `${WINDOWS_DESKTOP_ROOT}\\${leaseId}\\desktop`;
}
const sessionIdentity = String.raw`
if (-not ('OpenClawActiveSession' -as [type])) {
  Add-Type @'
using System;
using System.ComponentModel;
using System.Runtime.InteropServices;
public static class OpenClawActiveSession {
  [StructLayout(LayoutKind.Sequential)] struct Session { public int id; public IntPtr name; public int state; }
  [DllImport("wtsapi32.dll", SetLastError=true)] static extern bool WTSEnumerateSessions(IntPtr server, int reserved, int version, out IntPtr sessions, out int count);
  [DllImport("wtsapi32.dll")] static extern void WTSFreeMemory(IntPtr memory);
  [DllImport("kernel32.dll")] static extern uint WTSGetActiveConsoleSessionId();
  [DllImport("wtsapi32.dll", CharSet=CharSet.Unicode, SetLastError=true)] static extern bool WTSQuerySessionInformation(IntPtr server, int session, int kind, out IntPtr value, out int bytes);
  static string Read(int session, int kind) {
    IntPtr value; int bytes;
    if (!WTSQuerySessionInformation(IntPtr.Zero, session, kind, out value, out bytes)) throw new Win32Exception(Marshal.GetLastWin32Error());
    try { return Marshal.PtrToStringUni(value); } finally { WTSFreeMemory(value); }
  }
  public static string UserSid(int session) { return new System.Security.Principal.NTAccount(Read(session, 7), Read(session, 5)).Translate(typeof(System.Security.Principal.SecurityIdentifier)).Value; }
  public static int Get() {
    IntPtr sessions; int count;
    if (!WTSEnumerateSessions(IntPtr.Zero, 0, 1, out sessions, out count)) throw new Win32Exception(Marshal.GetLastWin32Error());
    int fallback = -1; uint console = WTSGetActiveConsoleSessionId();
    try {
      int size = Marshal.SizeOf(typeof(Session));
      for (int index = 0; index < count; index++) {
        Session session = (Session)Marshal.PtrToStructure(IntPtr.Add(sessions, index * size), typeof(Session));
        if (session.state != 0) continue;
        if (session.id == (int)console) return session.id;
        if (fallback < 0) fallback = session.id;
      }
    } finally { WTSFreeMemory(sessions); }
    return fallback;
  }
}
'@
}
$consoleSession = [OpenClawActiveSession]::Get()
if ($consoleSession -le 0) { throw 'Cloud worker requires an active interactive Windows session; reprovision the desktop worker' }
$userSid = [Security.Principal.WindowsIdentity]::GetCurrent().User.Value
if ($userSid -ne [OpenClawActiveSession]::UserSid($consoleSession)) { throw 'Cloud worker active Windows account changed; reprovision the desktop worker' }
`;
function interactiveScript(script, preparation = "") {
	const inner = `param([string]$ResultPath)
$ErrorActionPreference = 'Stop'
$expectedSid = '__CRABBOX_EXPECTED_SID__'
$expectedSession = __CRABBOX_EXPECTED_SESSION__
$cancelPath = $ResultPath + '.cancel'
function Assert-LaunchCurrent {
  if (Test-Path -LiteralPath $cancelPath) { throw 'Cloud desktop launch was cancelled' }
  ${sessionIdentity}
  if ($userSid -ne $expectedSid -or $consoleSession -ne $expectedSession -or [Diagnostics.Process]::GetCurrentProcess().SessionId -ne $expectedSession) { throw 'Cloud desktop active account or session changed; reprovision the worker' }
}
function Write-LaunchResult($value) {
  $temporary = $ResultPath + '.tmp'
  [IO.File]::WriteAllText($temporary, ($value | ConvertTo-Json -Compress), [Text.UTF8Encoding]::new($false))
  Move-Item -LiteralPath $temporary -Destination $ResultPath
}
try {
  Assert-LaunchCurrent
  ${script}
} catch {
  Write-LaunchResult @{ error = $_.Exception.Message }
  exit 1
}`;
	return `$ErrorActionPreference = 'Stop'
${sessionIdentity}
$service = Get-Service -Name CrabboxDesktopLauncher -ErrorAction Stop
if ($service.Status -ne 'Running') { throw 'CrabboxDesktopLauncher is not running; reprovision the Windows desktop worker' }
$base = 'C:\\ProgramData\\crabbox'
$identity = 'desktop-launch-' + [Guid]::NewGuid().ToString('N')
$scriptPath = Join-Path $base ($identity + '.ps1')
$resultPath = Join-Path $base ($identity + '.result')
$cancelPath = $resultPath + '.cancel'
$request = Join-Path (Join-Path $base 'desktop-launch-requests') ($identity + '.request')
$requestTemporary = $request + '.tmp'
$source = ${quote(inner)}
${preparation}
$source = $source.Replace('__CRABBOX_EXPECTED_SID__', $userSid).Replace('__CRABBOX_EXPECTED_SESSION__', [string]$consoleSession)
$settled = $false
try {
  [IO.File]::WriteAllText($scriptPath, $source, [Text.UTF8Encoding]::new($false))
  [IO.File]::WriteAllLines($requestTemporary, @($scriptPath, $resultPath), [Text.UTF8Encoding]::new($false))
  Move-Item -LiteralPath $requestTemporary -Destination $request
  $deadline = [DateTime]::UtcNow.AddSeconds(45)
  while (-not (Test-Path -LiteralPath $resultPath) -and [DateTime]::UtcNow -lt $deadline) { Start-Sleep -Milliseconds 100 }
  if (-not (Test-Path -LiteralPath $resultPath)) {
    [IO.File]::WriteAllText($cancelPath, 'cancelled')
    Remove-Item -LiteralPath $request -Force -ErrorAction SilentlyContinue
    $deadline = [DateTime]::UtcNow.AddSeconds(10)
    while (-not (Test-Path -LiteralPath $resultPath) -and [DateTime]::UtcNow -lt $deadline) { Start-Sleep -Milliseconds 100 }
    if (-not (Test-Path -LiteralPath $resultPath)) { throw 'Cloud desktop launch outcome could not be confirmed; release and reprovision the worker' }
  }
  $raw = [IO.File]::ReadAllText($resultPath).Trim()
  $settled = $true
  if ($raw.StartsWith('CRABBOX_DESKTOP_ERROR message=')) { throw [Text.Encoding]::UTF8.GetString([Convert]::FromBase64String($raw.Substring('CRABBOX_DESKTOP_ERROR message='.Length))) }
  $result = $raw | ConvertFrom-Json
  if ($result.error) { throw $result.error }
  if (Test-Path -LiteralPath $cancelPath) {
    if ($result.pid) {
      $current = Get-CimInstance Win32_Process -Filter ('ProcessId=' + $result.pid)
      if ($current -and $current.CreationDate.ToUniversalTime().ToString('o') -eq $result.startTime) { Stop-Process -Id $result.pid -Force }
    }
    throw 'Cloud desktop launch was cancelled; release and reprovision the worker'
  }
  Write-Output $raw
} finally {
  Remove-Item -LiteralPath $requestTemporary -Force -ErrorAction SilentlyContinue
  Remove-Item -LiteralPath $request -Force -ErrorAction SilentlyContinue
  if ($settled) { @($scriptPath, $resultPath, $cancelPath) | ForEach-Object { Remove-Item -LiteralPath $_ -Force -ErrorAction SilentlyContinue } }
}`;
}
const vncIdentity = String.raw`
$vncExecutable = 'C:\Program Files\TightVNC\tvnserver.exe'
function Assert-VncProcess($process, [string]$argument, [int]$session, [string]$sid) {
  $command = '^"?' + [regex]::Escape($vncExecutable) + '"?\s+' + [regex]::Escape($argument) + '[ \t]*$'
  if (-not $process -or -not $process.CreationDate -or $process.ExecutablePath -ine $vncExecutable -or $process.CommandLine -notmatch $command -or $process.SessionId -ne $session -or (Invoke-CimMethod -InputObject $process -MethodName GetOwnerSid -OperationTimeoutSec 5).Sid -ne $sid) { throw 'Cloud desktop VNC process identity changed; reprovision the worker' }
}
function Get-WorkerVnc([string]$sid, [int]$session) {
  $listeners = @(Get-NetTCPConnection -LocalPort 5900 -State Listen -ErrorAction SilentlyContinue)
  if (-not $listeners.Count) { return $null }
  $owners = @($listeners.OwningProcess | Sort-Object -Unique)
  if ($owners.Count -ne 1 -or @($listeners | Where-Object { $_.LocalAddress -ne '127.0.0.1' }).Count) { throw 'Cloud desktop VNC requires one worker-owned loopback listener' }
  $process = Get-CimInstance Win32_Process -Filter ('ProcessId=' + $owners[0]) -OperationTimeoutSec 5
  Assert-VncProcess $process '-run' $session $sid
  return $process
}
`;
const prepareVnc = `${vncIdentity}
if (-not (Test-Path -LiteralPath $vncExecutable -PathType Leaf)) { throw 'Crabbox TightVNC is unavailable; reprovision the Windows desktop worker' }
$serviceKey = Get-Item -LiteralPath 'HKLM:\\Software\\TightVNC\\Server'
if (Test-Path -LiteralPath 'HKLM:\\Software\\TightVNC\\Server\\ServiceOnly') { throw 'The Windows image forbids TightVNC application mode; prepare an image that permits interactive VNC' }
$vncSettings = @{ UseVncAuthentication = 1; UseControlAuthentication = 1; RfbPort = 5900; AcceptRfbConnections = 1; AllowLoopback = 1; LoopbackOnly = 1; AcceptHttpConnections = 0; UseD3D = 0; UseMirrorDriver = 0; RemoveWallpaper = 0 }
$credentials = @{}
foreach ($name in @('Password', 'ControlPassword')) {
  $value = $serviceKey.GetValue($name)
  if ($serviceKey.GetValueKind($name) -ne 'Binary' -or $value.Length -ne 8) { throw 'Crabbox VNC credentials are unavailable; reprovision the worker' }
  $credentials[$name] = $value
}
foreach ($name in @('UseVncAuthentication', 'UseControlAuthentication')) {
  if ($serviceKey.GetValueKind($name) -ne 'DWord' -or $serviceKey.GetValue($name) -ne 1) { throw 'Crabbox VNC authentication is not enabled; reprovision the worker' }
}
$vncService = Get-Service -Name tvnserver
$serviceCommand = (Get-ItemProperty -LiteralPath 'HKLM:\\SYSTEM\\CurrentControlSet\\Services\\tvnserver').ImagePath
if ($serviceCommand -notmatch ('^"?' + [regex]::Escape($vncExecutable) + '"?\\s+-service$')) { throw 'Crabbox VNC service executable changed; reprovision the worker' }
if ($vncService.Status -eq 'Running') {
  if (-not ('OpenClawVncService' -as [type])) {
    Add-Type @'
using System;
using System.ComponentModel;
using System.Runtime.InteropServices;
public static class OpenClawVncService {
  [StructLayout(LayoutKind.Sequential)] struct Status { public uint type, state, accepted, error, specificError, checkpoint, waitHint, pid, flags; }
  [DllImport("advapi32.dll", SetLastError=true)] static extern bool QueryServiceStatusEx(IntPtr service, int level, out Status status, int size, out int needed);
  public static uint ProcessId(IntPtr service) { Status status; int needed; if (!QueryServiceStatusEx(service, 0, out status, Marshal.SizeOf(typeof(Status)), out needed)) throw new Win32Exception(Marshal.GetLastWin32Error()); return status.pid; }
}
'@
  }
  $servicePid = [OpenClawVncService]::ProcessId($vncService.ServiceHandle.DangerousGetHandle())
  $serviceProcess = Get-CimInstance Win32_Process -Filter ('ProcessId=' + $servicePid) -OperationTimeoutSec 5
  Assert-VncProcess $serviceProcess '-service' 0 'S-1-5-18'
  $serviceBirth = $serviceProcess.CreationDate
  $listeners = @(Get-NetTCPConnection -LocalPort 5900 -State Listen -ErrorAction SilentlyContinue)
  if (@($listeners | Where-Object { $_.OwningProcess -ne $servicePid }).Count) { throw 'Cloud desktop VNC port belongs to another process' }
  $serviceProcess = Get-CimInstance Win32_Process -Filter ('ProcessId=' + $servicePid) -OperationTimeoutSec 5
  Assert-VncProcess $serviceProcess '-service' 0 'S-1-5-18'
  if ($serviceProcess.CreationDate -ne $serviceBirth -or [OpenClawVncService]::ProcessId($vncService.ServiceHandle.DangerousGetHandle()) -ne $servicePid -or [OpenClawActiveSession]::Get() -ne $consoleSession -or [OpenClawActiveSession]::UserSid($consoleSession) -ne $userSid) { throw 'Cloud desktop changed before VNC service handover' }
  $vncService.Stop()
  $vncService.WaitForStatus([ServiceProcess.ServiceControllerStatus]::Stopped, [TimeSpan]::FromSeconds(15))
} elseif ($vncService.Status -ne 'Stopped') { throw 'Crabbox VNC service is transitioning; reprovision the worker' }
$existingVnc = Get-WorkerVnc $userSid $consoleSession
if ([OpenClawActiveSession]::Get() -ne $consoleSession -or [OpenClawActiveSession]::UserSid($consoleSession) -ne $userSid) { throw 'Cloud desktop changed before VNC configuration' }
Set-Service -Name tvnserver -StartupType Disabled
$userKeyPath = 'Registry::HKEY_USERS\\' + $userSid + '\\Software\\TightVNC\\Server'
if (-not $existingVnc) {
  if (Test-Path -LiteralPath $userKeyPath) { Remove-Item -LiteralPath $userKeyPath -Recurse -Force }
  New-Item -Path $userKeyPath -Force | Out-Null
  foreach ($name in $vncSettings.Keys) { New-ItemProperty -LiteralPath $userKeyPath -Name $name -PropertyType DWord -Value $vncSettings[$name] -Force | Out-Null }
  foreach ($name in $credentials.Keys) { New-ItemProperty -LiteralPath $userKeyPath -Name $name -PropertyType Binary -Value $credentials[$name] -Force | Out-Null }
}
$userKey = Get-Item -LiteralPath $userKeyPath
foreach ($name in $vncSettings.Keys) {
  if ($userKey.GetValueKind($name) -ne 'DWord' -or $userKey.GetValue($name) -ne $vncSettings[$name]) { throw 'Cloud desktop VNC settings changed; reprovision the worker' }
}
foreach ($name in $credentials.Keys) {
  if ($userKey.GetValueKind($name) -ne 'Binary' -or [Convert]::ToBase64String($userKey.GetValue($name)) -cne [Convert]::ToBase64String($credentials[$name])) { throw 'Cloud desktop VNC credentials changed; reprovision the worker' }
}
# ConvertFrom-Json coerces ISO timestamps to DateTime; decimal text preserves exact birth ticks.
$expectedVnc = if ($existingVnc) { @{ pid = [int]$existingVnc.ProcessId; birthTicks = [string]$existingVnc.CreationDate.ToUniversalTime().Ticks } } else { $null }
$source = $source.Replace('__CRABBOX_VNC_IDENTITY__', (ConvertTo-Json -InputObject $expectedVnc -Compress))
`;
function browserLauncher$1(leaseId) {
	return `$ErrorActionPreference = 'Stop'
if ($args.Count) { throw 'OpenClaw worker browser does not accept arguments' }
$profile = ${quote(`${desktopDirectory(leaseId)}\\browser-profile`)}
$browser = '__CRABBOX_BROWSER_EXECUTABLE__'
New-Item -ItemType Directory -Force -Path $profile | Out-Null
$lock = $null
$lockDeadline = [DateTime]::UtcNow.AddSeconds(25)
while (-not $lock) {
  try { $lock = [IO.File]::Open((Join-Path $profile 'launch.lock'), [IO.FileMode]::OpenOrCreate, [IO.FileAccess]::ReadWrite, [IO.FileShare]::None) }
  catch [IO.IOException] { if ([DateTime]::UtcNow -ge $lockDeadline) { throw }; Start-Sleep -Milliseconds 100 }
}
try {
  $endpoint = 'http://127.0.0.1:${WINDOWS_CDP_PORT}/json/version'
  $caller = Get-CimInstance Win32_Process -Filter ('ProcessId=' + $PID)
  $callerSid = [string](Invoke-CimMethod -InputObject $caller -MethodName GetOwnerSid).Sid
  if ($caller.SessionId -le 0 -or -not $callerSid.StartsWith('S-1-')) { throw 'Cloud browser requires its interactive Windows account and session' }
  $profileValue = [regex]::Escape($profile)
  $profilePattern = '(?:^|\\s)(?:"--user-data-dir=' + $profileValue + '"|--user-data-dir="' + $profileValue + '"'
  if ($profile -notmatch '\\s') { $profilePattern += '|--user-data-dir=' + $profileValue }
  $profilePattern += ')(?=\\s|$)'
  function Get-OwnedBrowserListener {
    $listeners = @(Get-NetTCPConnection -LocalPort ${WINDOWS_CDP_PORT} -State Listen -ErrorAction SilentlyContinue)
    if (-not $listeners.Count) { return $false }
    $owners = @($listeners.OwningProcess | Sort-Object -Unique)
    if ($owners.Count -ne 1 -or @($listeners | Where-Object { $_.LocalAddress -ne '127.0.0.1' }).Count) { throw 'Cloud browser CDP must have one worker-owned loopback listener' }
    $owner = Get-CimInstance Win32_Process -Filter ('ProcessId=' + $owners[0])
    $ownerSid = [string](Invoke-CimMethod -InputObject $owner -MethodName GetOwnerSid).Sid
    if (-not $owner.ExecutablePath -or -not [string]::Equals([IO.Path]::GetFullPath($owner.ExecutablePath), [IO.Path]::GetFullPath($browser), [StringComparison]::OrdinalIgnoreCase) -or $owner.SessionId -ne $caller.SessionId -or $ownerSid -ne $callerSid -or $owner.CommandLine -notmatch $profilePattern -or $owner.CommandLine -notmatch '(?:^|\\s)"?--remote-debugging-port=${WINDOWS_CDP_PORT}"?(?=\\s|$)') { throw 'CDP port belongs to another browser, profile, or Windows session; reprovision the desktop worker' }
    return $true
  }
  if (-not (Get-OwnedBrowserListener)) {
    Start-Process -FilePath $browser -ArgumentList @('--no-first-run', '--no-default-browser-check', '--disable-default-apps', '--hide-crash-restore-bubble', ('--user-data-dir="' + $profile + '"'), '--remote-debugging-address=127.0.0.1', '--remote-debugging-port=${WINDOWS_CDP_PORT}', 'about:blank') | Out-Null
  }
  $deadline = [DateTime]::UtcNow.AddSeconds(20)
  while ([DateTime]::UtcNow -lt $deadline) {
    if (Get-OwnedBrowserListener) {
      try { Invoke-RestMethod -Uri $endpoint -TimeoutSec 1 | Out-Null; $ready = $true } catch { $ready = $false }
      if ($ready -and (Get-OwnedBrowserListener)) { exit 0 }
    }
    Start-Sleep -Milliseconds 200
  }
  throw 'Browser CDP did not become ready on 127.0.0.1:${WINDOWS_CDP_PORT} within 20 seconds'
} finally { $lock.Dispose() }`;
}
function createCrabboxWindowsDesktopSetup(leaseId, wallpaperBase64) {
	const directory = desktopDirectory(leaseId);
	const browser = browserLauncher$1(leaseId);
	const terminal = `$ErrorActionPreference = 'Stop'
if ($args.Count) { throw 'OpenClaw worker terminal does not accept arguments' }
$child = Start-Process -FilePath ${quote(WINDOWS_POWERSHELL)} -ArgumentList '-NoLogo -NoProfile -NoExit' -WindowStyle Normal -PassThru
Start-Sleep -Milliseconds 200
if ($child.HasExited) { throw 'Cloud worker terminal exited before becoming ready' }`;
	return interactiveScript(`$directory = ${quote(directory)}
  New-Item -ItemType Directory -Force -Path $directory | Out-Null
  icacls.exe $directory /inheritance:r /grant ('*' + $expectedSid + ':(OI)(CI)F') /grant '*S-1-5-18:(OI)(CI)F' /grant '*S-1-5-32-544:(OI)(CI)F' | Out-Null
  if ($LASTEXITCODE -ne 0) { throw 'Cloud desktop launcher directory permissions could not be secured' }
  $browserPaths = @()
  foreach ($name in @('chrome.exe', 'msedge.exe')) {
    $command = Get-Command -Name $name -CommandType Application -ErrorAction SilentlyContinue
    if ($command) { $browserPaths += $command.Source }
  }
  $programDirectories = @($env:ProgramFiles, \${env:ProgramFiles(x86)}) | Where-Object { $_ } | Select-Object -Unique
  foreach ($relative in @('Google\\Chrome\\Application\\chrome.exe', 'Microsoft\\Edge\\Application\\msedge.exe')) {
    foreach ($root in $programDirectories) { $browserPaths += Join-Path $root $relative }
  }
  $browserExecutable = $browserPaths | Where-Object { Test-Path -LiteralPath $_ -PathType Leaf } | Select-Object -First 1
  if (-not $browserExecutable -or -not [IO.Path]::IsPathRooted($browserExecutable)) { throw 'Crabbox desktop browser is unavailable; reprovision the worker with browser support' }
  [IO.File]::WriteAllText((Join-Path $directory 'browser.ps1'), ${quote(browser)}.Replace('__CRABBOX_BROWSER_EXECUTABLE__', $browserExecutable.Replace("'", "''")), [Text.UTF8Encoding]::new($false))
  [IO.File]::WriteAllText((Join-Path $directory 'terminal.ps1'), ${quote(terminal)}, [Text.UTF8Encoding]::new($false))
  $wallpaper = Join-Path $directory 'wallpaper.png'
  [IO.File]::WriteAllBytes($wallpaper, [Convert]::FromBase64String(${quote(wallpaperBase64)}))
  if (-not ('OpenClawWallpaper' -as [type])) { Add-Type 'using System; using System.Runtime.InteropServices; public static class OpenClawWallpaper { [DllImport("user32.dll", CharSet=CharSet.Unicode, SetLastError=true)] public static extern bool SystemParametersInfo(uint action, uint parameter, string value, uint flags); }' }
  Assert-LaunchCurrent
  if (-not [OpenClawWallpaper]::SystemParametersInfo(20, 0, $wallpaper, 3)) { throw 'Cloud worker wallpaper could not be applied' }
  ${vncIdentity}
  $startedVnc = $null
  try {
    Assert-LaunchCurrent
    $expectedVnc = ConvertFrom-Json '__CRABBOX_VNC_IDENTITY__'
    $vnc = Get-WorkerVnc $expectedSid $expectedSession
    if ($expectedVnc) {
      if (-not $vnc -or $vnc.ProcessId -ne $expectedVnc.pid -or [string]$vnc.CreationDate.ToUniversalTime().Ticks -ne $expectedVnc.birthTicks) { throw 'Cloud desktop VNC changed during setup handover; reprovision the worker' }
    } elseif ($vnc) { throw 'Cloud desktop VNC appeared during setup handover; reprovision the worker' }
    if (-not $vnc) {
      Assert-LaunchCurrent
      $startedVnc = Start-Process -FilePath $vncExecutable -ArgumentList '-run' -PassThru
      $vnc = Get-CimInstance Win32_Process -Filter ('ProcessId=' + $startedVnc.Id) -OperationTimeoutSec 5
      Assert-VncProcess $vnc '-run' $expectedSession $expectedSid
    }
    $vncBirth = $vnc.CreationDate
    $deadline = [DateTime]::UtcNow.AddSeconds(15)
    do {
      Assert-LaunchCurrent
      $listener = Get-WorkerVnc $expectedSid $expectedSession
      if ($listener) {
        if ($listener.ProcessId -ne $vnc.ProcessId -or $listener.CreationDate -ne $vncBirth) { throw 'Cloud desktop VNC changed before becoming ready' }
        if ((Get-Service -Name tvnserver).Status -ne 'Stopped') { throw 'Crabbox VNC service resumed during desktop setup' }
        Assert-LaunchCurrent
        $result = @{ status = 'ready' }
        if ($startedVnc) { $result.pid = [int]$vnc.ProcessId; $result.startTime = $vncBirth.ToUniversalTime().ToString('o') }
        Write-LaunchResult $result
        break
      }
      if ($startedVnc -and $startedVnc.HasExited) { throw 'Cloud desktop VNC exited before becoming ready' }
      if ([DateTime]::UtcNow -ge $deadline) { throw 'Cloud desktop VNC did not listen on 127.0.0.1:5900 within 15 seconds' }
      Start-Sleep -Milliseconds 100
    } while ($true)
  } catch {
    if ($startedVnc -and -not $startedVnc.HasExited) { $startedVnc.Kill() }
    throw
  } finally { if ($startedVnc) { $startedVnc.Dispose() } }`, prepareVnc);
}
function createCrabboxWindowsDesktopEndpoint(leaseId) {
	const directory = desktopDirectory(leaseId);
	const args = (name) => [
		"-NoLogo",
		"-NoProfile",
		"-NonInteractive",
		"-ExecutionPolicy",
		"Bypass",
		"-File",
		`${directory}\\${name}.ps1`
	];
	return {
		protocol: "rfb",
		port: 5900,
		allowsResize: false,
		passwordFilePath: String.raw`C:\ProgramData\crabbox\vnc.password`,
		apps: [{
			id: "browser",
			executablePath: WINDOWS_POWERSHELL,
			args: args("browser"),
			cdpPort: WINDOWS_CDP_PORT
		}, {
			id: "terminal",
			executablePath: WINDOWS_POWERSHELL,
			args: args("terminal")
		}]
	};
}
function createCrabboxWindowsDesktopNodeLauncher() {
	const launch = interactiveScript(`$options = ConvertFrom-Json ([Text.Encoding]::UTF8.GetString([Convert]::FromBase64String('__CRABBOX_NODE_OPTIONS__')))
  $nodeScript = $PSCommandPath + '.cjs'
  try {
    [IO.File]::WriteAllText($nodeScript, [Text.Encoding]::UTF8.GetString([Convert]::FromBase64String('__CRABBOX_NODE_SOURCE__')), [Text.UTF8Encoding]::new($false))
    $env:OPENCLAW_STATE_DIR = $options.stateDir
    Assert-LaunchCurrent
    $nodeResult = & $options.nodePath $nodeScript $cancelPath $expectedSession $expectedSid
    if ($LASTEXITCODE -ne 0) { throw 'Cloud worker interactive node launcher failed' }
    Write-LaunchResult ($nodeResult | ConvertFrom-Json)
  } finally { Remove-Item -LiteralPath $nodeScript -Force -ErrorAction SilentlyContinue }`);
	const nodeSource = String.raw`const fs = require("node:fs");
const { spawn, spawnSync } = require("node:child_process");
const options = __CRABBOX_OPTIONS__;
const [, , cancelPath, expectedSession, expectedSid] = process.argv;
if (fs.existsSync(cancelPath)) throw new Error("Cloud desktop launch was cancelled");
const log = fs.openSync(options.logPath, "a");
const child = spawn(options.nodePath, options.nodeArgs, { cwd: options.cwd, env: { ...process.env, OPENCLAW_STATE_DIR: options.stateDir }, detached: true, windowsHide: true, stdio: ["ignore", log, log] });
child.once("error", error => { fs.closeSync(log); console.error(error.message); process.exitCode = 1; });
child.once("spawn", () => {
  fs.closeSync(log);
  try {
    const script = "$ErrorActionPreference = 'Stop'; $node = Get-CimInstance Win32_Process -Filter 'ProcessId=" + child.pid + "'; if (-not $node) { throw 'Node process is unavailable' }; @{ pid = [int]$node.ProcessId; startTime = $node.CreationDate.ToUniversalTime().ToString('o'); sessionId = [int]$node.SessionId; userSid = [string](Invoke-CimMethod -InputObject $node -MethodName GetOwnerSid).Sid; executablePath = $node.ExecutablePath } | ConvertTo-Json -Compress";
    const probe = spawnSync(process.env.SystemRoot + "\\System32\\WindowsPowerShell\\v1.0\\powershell.exe", ["-NoLogo", "-NoProfile", "-NonInteractive", "-EncodedCommand", Buffer.from(script, "utf16le").toString("base64")], { encoding: "utf8", windowsHide: true, timeout: 10000 });
    if (probe.error || probe.status !== 0) throw new Error(probe.stderr?.trim() || "Cloud worker interactive node identity is unavailable");
    const identity = JSON.parse(probe.stdout.trim());
    if (identity.pid !== child.pid || identity.sessionId !== Number(expectedSession) || identity.userSid !== expectedSid || !identity.startTime || fs.realpathSync(identity.executablePath) !== fs.realpathSync(options.nodePath)) throw new Error("Cloud worker interactive node identity changed");
    if (fs.existsSync(cancelPath)) throw new Error("Cloud desktop launch was cancelled");
    delete identity.executablePath;
    process.stdout.write(JSON.stringify(identity));
    child.unref();
  } catch (error) { child.kill(); console.error(error.message); process.exitCode = 1; }
});`;
	return `function runWindowsDesktopPowerShell(script) {
  const fs = require("node:fs");
  const path = require("node:path");
  const directory = fs.mkdtempSync(path.join(require("node:os").tmpdir(), "openclaw-desktop-"));
  try {
    const scriptPath = path.join(directory, "launch.ps1");
    fs.writeFileSync(scriptPath, script, "utf8");
    const result = require("node:child_process").spawnSync(${JSON.stringify(WINDOWS_POWERSHELL)}, ["-NoLogo", "-NoProfile", "-NonInteractive", "-ExecutionPolicy", "Bypass", "-File", scriptPath], { encoding: "utf8", windowsHide: true, timeout: 95000, maxBuffer: 1024 * 1024 });
    if (result.error || result.status !== 0) throw new Error(result.error?.message || result.stderr?.trim() || "Cloud worker Windows desktop launch failed");
    return JSON.parse(result.stdout.trim());
  } finally { fs.rmSync(directory, { recursive: true, force: true }); }
}
function readWindowsDesktopSessionIdentity() {
  const result = runWindowsDesktopPowerShell(${JSON.stringify(`$ErrorActionPreference = 'Stop'
${sessionIdentity}
@{ sessionId = [int]$consoleSession; userSid = $userSid } | ConvertTo-Json -Compress`)});
  if (!Number.isSafeInteger(result.sessionId) || result.sessionId < 1 || typeof result.userSid !== "string" || !/^S-1-/.test(result.userSid)) throw new Error("Cloud worker interactive session identity is invalid");
  return result;
}
async function launchWindowsDesktopNode(options) {
  const source = ${JSON.stringify(nodeSource)}.replace("__CRABBOX_OPTIONS__", () => JSON.stringify(options));
  const result = runWindowsDesktopPowerShell(${JSON.stringify(launch)}.replace("__CRABBOX_NODE_OPTIONS__", Buffer.from(JSON.stringify(options)).toString("base64")).replace("__CRABBOX_NODE_SOURCE__", Buffer.from(source).toString("base64")));
  if (!Number.isSafeInteger(result.pid) || result.pid < 1 || !Number.isSafeInteger(result.sessionId) || result.sessionId < 1 || typeof result.startTime !== "string" || !result.startTime || typeof result.userSid !== "string" || !/^S-1-/.test(result.userSid)) throw new Error("Cloud worker interactive node identity is invalid");
  return result;
}`;
}
//#endregion
//#region extensions/crabbox/src/crabbox-worker-desktop-setup.ts
const CRABBOX_WORKER_BROWSER_PATH = "/usr/local/bin/openclaw-worker-browser";
const CRABBOX_WORKER_TERMINAL_PATH = "/usr/local/bin/openclaw-worker-terminal";
const CRABBOX_WORKER_BROWSER_CDP_PORT = 9222;
function xfceDesktopEnvironment() {
	return [
		"[ -r /var/lib/crabbox/desktop.env ] || { echo \"Crabbox desktop environment is unavailable\" >&2; exit 1; }",
		"grep -Fx 'CRABBOX_DESKTOP_ENV=xfce' /var/lib/crabbox/desktop.env >/dev/null || { echo \"Crabbox desktop environment is not XFCE\" >&2; exit 1; }",
		"grep -Fx 'DISPLAY=:99' /var/lib/crabbox/desktop.env >/dev/null || { echo \"Crabbox XFCE display is not :99\" >&2; exit 1; }",
		"export DISPLAY=:99"
	];
}
function createCrabboxXfceSessionEnvironment() {
	return [
		...xfceDesktopEnvironment(),
		"worker_uid=$(id -u)",
		"read_xfce_process_environment() {",
		"  local process_pid=\"$1\"",
		"  exec 8<\"/proc/$process_pid/environ\" || return 1",
		"  process_display=",
		"  process_dbus=",
		"  process_runtime_dir=",
		"  while IFS= read -r -d '' process_variable; do",
		"    case \"$process_variable\" in",
		"      DISPLAY=*) process_display=\"${process_variable#*=}\" ;;",
		"      DBUS_SESSION_BUS_ADDRESS=*) process_dbus=\"${process_variable#*=}\" ;;",
		"      XDG_RUNTIME_DIR=*) process_runtime_dir=\"${process_variable#*=}\" ;;",
		"    esac",
		"  done <&8",
		"  exec 8<&-",
		"}",
		"# XFCE owns the D-Bus session; the image's original renderer may have been launched outside it.",
		"mapfile -t session_pids < <(pgrep -u \"$worker_uid\" -x xfce4-session || true)",
		"[ \"${#session_pids[@]}\" -eq 1 ] || { echo \"Expected exactly one worker-owned XFCE session; restart crabbox-desktop.service and retry\" >&2; exit 1; }",
		"session_pid=\"${session_pids[0]}\"",
		"read_xfce_process_environment \"$session_pid\" || { echo \"XFCE session changed while it was inspected; restart crabbox-desktop.service and retry\" >&2; exit 1; }",
		"[ \"$process_display\" = \":99\" ] || { echo \"XFCE session does not use DISPLAY=:99; restart crabbox-desktop.service and retry\" >&2; exit 1; }",
		"DBUS_SESSION_BUS_ADDRESS=\"$process_dbus\"",
		"unset XDG_RUNTIME_DIR",
		"XDG_RUNTIME_DIR=\"$process_runtime_dir\"",
		"[ -n \"$DBUS_SESSION_BUS_ADDRESS\" ] || { echo \"XFCE session is missing its D-Bus binding; restart crabbox-desktop.service and retry\" >&2; exit 1; }",
		"case \"$XDG_RUNTIME_DIR\" in \"\"|/*) ;; *) echo \"XFCE session has an invalid XDG_RUNTIME_DIR\" >&2; exit 1 ;; esac",
		"export DBUS_SESSION_BUS_ADDRESS",
		"[ -z \"$XDG_RUNTIME_DIR\" ] || export XDG_RUNTIME_DIR"
	];
}
function browserLauncher(leaseId) {
	return [
		"#!/bin/bash",
		"set -euo pipefail",
		"[ \"$#\" -eq 0 ] || { echo \"openclaw-worker-browser does not accept arguments\" >&2; exit 64; }",
		...xfceDesktopEnvironment(),
		"[ -x /usr/local/bin/crabbox-browser ] || { echo \"Crabbox browser is unavailable\" >&2; exit 1; }",
		"worker_home=$(getent passwd \"$(id -u)\" | cut -d: -f6)",
		"case \"$worker_home\" in /*) ;; *) echo \"Crabbox worker home is invalid\" >&2; exit 1 ;; esac",
		"export HOME=\"$worker_home\"",
		`export CRABBOX_BROWSER_PROFILE="$worker_home/.cache/openclaw/worker-browser/${leaseId}"`,
		"mkdir -p \"$CRABBOX_BROWSER_PROFILE\"",
		"chmod 700 \"$CRABBOX_BROWSER_PROFILE\"",
		"exec 9>\"$CRABBOX_BROWSER_PROFILE/.openclaw-launch.lock\"",
		"flock -x 9",
		`cdp_url=http://127.0.0.1:${CRABBOX_WORKER_BROWSER_CDP_PORT}/json/version`,
		"if curl --fail --silent --show-error --max-time 1 \"$cdp_url\" >/dev/null; then",
		"  exit 0",
		"fi",
		"launch_log=\"$CRABBOX_BROWSER_PROFILE/launch.log\"",
		": >\"$launch_log\"",
		`nohup /usr/local/bin/crabbox-browser --remote-debugging-address=127.0.0.1 --remote-debugging-port=${CRABBOX_WORKER_BROWSER_CDP_PORT} about:blank >>"$launch_log" 2>&1 </dev/null 9>&- &`,
		"for _attempt in $(seq 1 40); do",
		"  if curl --fail --silent --show-error --max-time 1 \"$cdp_url\" >/dev/null; then",
		"    exit 0",
		"  fi",
		"  sleep 0.5",
		"done",
		`echo "Browser CDP did not become ready on 127.0.0.1:${CRABBOX_WORKER_BROWSER_CDP_PORT} within 20 seconds" >&2`,
		"exit 1"
	];
}
function terminalLauncher() {
	return [
		"#!/bin/bash",
		"set -euo pipefail",
		"[ \"$#\" -eq 0 ] || { echo \"openclaw-worker-terminal does not accept arguments\" >&2; exit 64; }",
		...xfceDesktopEnvironment(),
		"nohup /usr/bin/xfce4-terminal >/dev/null 2>&1 </dev/null &",
		"terminal_pid=$!",
		"sleep 0.2",
		"if kill -0 \"$terminal_pid\" 2>/dev/null; then",
		"  exit 0",
		"fi",
		"wait \"$terminal_pid\""
	];
}
function heredoc(target, marker, contents) {
	return [
		`cat >"$setup_dir/${target}" <<'${marker}'`,
		...contents,
		marker
	];
}
function createCrabboxWorkerDesktopSetup(leaseId, wallpaperBase64, target, sshUser) {
	switch (target) {
		case "linux": break;
		case "windows/normal": return createCrabboxWindowsDesktopSetup(leaseId, wallpaperBase64);
		case "macos": return createCrabboxMacosDesktopSetup(leaseId, wallpaperBase64, requireDesktopUser(sshUser));
		case "windows/wsl2": throw new Error("Crabbox desktop requires native Windows");
	}
	return createCrabboxLinuxDesktopSetup(leaseId, wallpaperBase64);
}
function requireDesktopUser(value) {
	if (!value || value === "<token>") throw new Error("Crabbox macOS desktop inspection must identify the worker account");
	return value;
}
function createCrabboxLinuxDesktopSetup(leaseId, wallpaperBase64) {
	return [
		"set -euo pipefail",
		...createCrabboxXfceSessionEnvironment(),
		"worker_user=$(id -un)",
		"worker_group=$(id -gn)",
		"worker_home=$(getent passwd \"$worker_uid\" | cut -d: -f6)",
		"case \"$worker_home\" in /*) ;; *) echo \"Crabbox worker home is invalid\" >&2; exit 1 ;; esac",
		"as_root() { if [ \"$worker_uid\" -eq 0 ]; then \"$@\"; else sudo -n -- \"$@\"; fi; }",
		"for required_command in xfconf-query xfdesktop xrandr awk cmp curl flock getent pgrep pkill python3; do command -v \"$required_command\" >/dev/null 2>&1 || { echo \"Required Crabbox desktop command is unavailable: $required_command\" >&2; exit 1; }; done",
		"bind_xfdesktop_renderer() {",
		"  mapfile -t renderer_pids < <(pgrep -u \"$worker_uid\" -x xfdesktop || true)",
		"  [ \"${#renderer_pids[@]}\" -eq 1 ] || return 1",
		"  renderer_pid=\"${renderer_pids[0]}\"",
		"  read_xfce_process_environment \"$renderer_pid\" || return 1",
		"  [ \"$process_display\" = \"$DISPLAY\" ] && [ \"$process_dbus\" = \"$DBUS_SESSION_BUS_ADDRESS\" ]",
		"}",
		"setup_dir=$(mktemp -d)",
		"trap 'rm -rf -- \"$setup_dir\"' EXIT",
		...heredoc("browser", "WORKER_BROWSER_LAUNCHER_EOF", browserLauncher(leaseId)),
		...heredoc("terminal", "WORKER_TERMINAL_LAUNCHER_EOF", terminalLauncher()),
		`python3 -c 'import base64,pathlib,sys;pathlib.Path(sys.argv[1]).write_bytes(base64.b64decode(sys.stdin.buffer.read().strip(),validate=True))' "$setup_dir/wallpaper.png" <<'WORKER_WALLPAPER_B64_EOF'`,
		wallpaperBase64,
		"WORKER_WALLPAPER_B64_EOF",
		`as_root install -o root -g root -m 0755 "$setup_dir/browser" ${CRABBOX_WORKER_BROWSER_PATH}`,
		`as_root install -o root -g root -m 0755 "$setup_dir/terminal" ${CRABBOX_WORKER_TERMINAL_PATH}`,
		"as_root install -d -o \"$worker_user\" -g \"$worker_group\" -m 0755 \"$worker_home/.cache\" \"$worker_home/.cache/openclaw\" \"$worker_home/.cache/openclaw/worker-browser\"",
		`as_root install -d -o "$worker_user" -g "$worker_group" -m 0700 "$worker_home/.cache/openclaw/worker-browser/${leaseId}"`,
		"as_root install -d -o \"$worker_user\" -g \"$worker_group\" -m 0755 \"$worker_home/.local\" \"$worker_home/.local/share\" \"$worker_home/.local/share/backgrounds\"",
		"wallpaper_path=\"$worker_home/.local/share/backgrounds/openclaw-worker.png\"",
		"# XFCE caches wallpaper bytes across reloads. Reuse only unchanged assets on the authoritative bus.",
		"wallpaper_matches=false",
		"cmp -s \"$setup_dir/wallpaper.png\" \"$wallpaper_path\" && wallpaper_matches=true",
		"as_root install -o \"$worker_user\" -g \"$worker_group\" -m 0644 \"$setup_dir/wallpaper.png\" \"$wallpaper_path\"",
		"if [ \"$wallpaper_matches\" != true ] || ! bind_xfdesktop_renderer; then",
		"  pkill -TERM -u \"$worker_uid\" -x xfdesktop || true",
		"  for _attempt in $(seq 1 20); do pgrep -u \"$worker_uid\" -x xfdesktop >/dev/null || break; sleep 0.1; done",
		"  pkill -KILL -u \"$worker_uid\" -x xfdesktop || true",
		"  nohup xfdesktop >\"$worker_home/.cache/openclaw/xfdesktop.log\" 2>&1 </dev/null &",
		"  for _attempt in $(seq 1 40); do bind_xfdesktop_renderer && break; sleep 0.1; done",
		"fi",
		"bind_xfdesktop_renderer || { echo \"XFCE desktop renderer did not converge on the worker session\" >&2; exit 1; }",
		"mapfile -t backdrop_roots < <(",
		"  {",
		"    xfconf-query -c xfce4-desktop -l | sed -n 's#\\(/backdrop/[^/]*/[^/]*/workspace[^/]*\\)/.*#\\1#p'",
		"    while read -r monitor; do for workspace in 0 1 2 3; do printf \"/backdrop/screen0/monitor%s/workspace%s\\n\" \"$monitor\" \"$workspace\"; done; done < <(xrandr --listmonitors | awk 'NR > 1 { print $NF }')",
		"  } | sort -u",
		")",
		"[ \"${#backdrop_roots[@]}\" -gt 0 ] || { echo \"XFCE did not advertise any desktop backdrops\" >&2; exit 1; }",
		"for backdrop in \"${backdrop_roots[@]}\"; do",
		"  xfconf-query -c xfce4-desktop -p \"$backdrop/last-image\" -s \"$wallpaper_path\" || xfconf-query -c xfce4-desktop -p \"$backdrop/last-image\" -n -t string -s \"$wallpaper_path\"",
		"  xfconf-query -c xfce4-desktop -p \"$backdrop/image-style\" -s 5 || xfconf-query -c xfce4-desktop -p \"$backdrop/image-style\" -n -t int -s 5",
		"done",
		"renderer_pid_before_reload=\"$renderer_pid\"",
		"xfdesktop --reload",
		"bind_xfdesktop_renderer || { echo \"XFCE desktop renderer lost its worker session during reload\" >&2; exit 1; }",
		"[ \"$renderer_pid\" = \"$renderer_pid_before_reload\" ] || { echo \"XFCE desktop renderer changed during reload; restart crabbox-desktop.service and retry\" >&2; exit 1; }"
	].join("\n");
}
function createCrabboxWorkerDesktopEndpoint(leaseId, target, sshUser) {
	switch (target) {
		case "windows/normal": return createCrabboxWindowsDesktopEndpoint(leaseId);
		case "macos": return createCrabboxMacosDesktopEndpoint(leaseId, requireDesktopUser(sshUser));
		case "windows/wsl2": throw new Error("Crabbox desktop requires native Windows");
	}
	return {
		protocol: "rfb",
		port: 5900,
		passwordFilePath: "/var/lib/crabbox/vnc.password",
		apps: [{
			id: "browser",
			executablePath: CRABBOX_WORKER_BROWSER_PATH,
			cdpPort: CRABBOX_WORKER_BROWSER_CDP_PORT
		}, {
			id: "terminal",
			executablePath: CRABBOX_WORKER_TERMINAL_PATH
		}]
	};
}
//#endregion
//#region extensions/crabbox/src/crabbox-worker-node-process.ts
/** The enrollment script and native desktop host share one process receipt contract. */
function createCrabboxNodeProcessRuntime(desktopTarget, leaseId) {
	return `const desktopTarget = ${JSON.stringify(desktopTarget)};
${desktopTarget === "windows/normal" ? createCrabboxWindowsDesktopNodeLauncher() : ""}
  const probeProcess = (binary, args, timeout = process.platform === "win32" ? 10000 : 2000) => {
    const result = spawnSync(binary, args, { env: nodeEnv, encoding: "utf8", windowsHide: true, timeout, killSignal: "SIGKILL", maxBuffer: 1024 * 1024 });
    return result.status === 0 && !result.error ? result.stdout.trim() : null;
  };
  const processStartTime = (pid) => probeProcess("ps", ["-o", "lstart=", "-p", String(pid)])?.replace(/\\s+/g, " ");
  const processCwdMatches = (pid) => {
    const args = ["-a", "-p", String(pid), "-d", "cwd", "-Fn"];
    const output = probeProcess("lsof", args) ?? probeProcess("/usr/sbin/lsof", args);
    const cwd = output?.split("\\n").filter((line) => line.startsWith("n"));
    return cwd?.length === 1 && fs.realpathSync(cwd[0].slice(1)) === runtimeDir;
  };
  const macosHostPath = ${JSON.stringify(`${CRABBOX_MACOS_APP_PATH}/Contents/MacOS/OpenClaw`)};
  const macosDesktopDirectory = ${JSON.stringify(desktopTarget === "macos" ? crabboxMacosDesktopDirectory(leaseId) : void 0)};
  const macosGuiLaunchScript = ${JSON.stringify(desktopTarget === "macos" ? createCrabboxMacosGuiLaunchScript() : void 0)};
  const macosHostArgs = (enrollmentMode) => ["--cloud-worker-host", "--node-executable", process.execPath, "--runtime-dir", runtimeDir, "--state-dir", stateDir, "--desktop-dir", macosDesktopDirectory, "--lease-id", leaseId, "--display-name", displayName, "--enrollment-mode", enrollmentMode];
  const inspectMacosHost = (launch, nodePid) => {
    if (!launch || !Number.isSafeInteger(launch.hostPid) || launch.hostPid < 1 || typeof launch.hostStartTime !== "string" || !launch.hostStartTime) return null;
    let actual;
    try { actual = JSON.parse(probeProcess(macosHostPath, ["--cloud-worker-inspect-process", String(launch.hostPid), ...(nodePid === undefined ? [] : [String(nodePid)])], 10000) ?? "null"); }
    catch { return null; }
    if (actual?.state === "gone" && Object.keys(actual).length === 1) return actual;
    return actual?.state === "active" && actual.host ? actual : null;
  };
  const macosRuntimeDirectory = () => {
    const stat = fs.statSync(runtimeDir, { bigint: true });
    return { device: BigInt.asUintN(32, stat.dev).toString(), inode: stat.ino.toString() };
  };
  const macosCwdMatches = (actual, expected) => actual?.device === expected.device && actual?.inode === expected.inode;
  const macosHostMatches = (launch, host, directory) => {
    if (!host || host.pid !== launch.hostPid || host.startTime !== launch.hostStartTime || host.uid !== process.getuid() || !macosCwdMatches(host.cwd, directory) || !Array.isArray(host.arguments)) return false;
    return ["connect", "resume"].some((value) => {
      const expected = [macosHostPath, ...macosHostArgs(value)];
      return expected.length === host.arguments.length && expected.every((argument, index) => argument === host.arguments[index]);
    });
  };
  const verifyMacosHost = (launch) => {
    const actual = inspectMacosHost(launch);
    return actual?.state === "active" && macosHostMatches(launch, actual.host, macosRuntimeDirectory());
  };
  const verifyMacosNode = (launch, pid) => {
    if (launch.pid !== pid || launch.runtimeDir !== runtimeDir || launch.stateDir !== stateDir || launch.cli !== cli) return false;
    const actual = inspectMacosHost(launch, pid);
    const directory = macosRuntimeDirectory();
    const node = actual?.node;
    if (actual?.state !== "active" || !macosHostMatches(launch, actual.host, directory) || !node || node.pid !== pid || node.startTime !== launch.startTime || node.uid !== process.getuid() || node.parentPid !== launch.hostPid || !macosCwdMatches(node.cwd, directory) || !Array.isArray(node.arguments) || fs.realpathSync(node.executablePath) !== fs.realpathSync(process.execPath)) return false;
    return ["openclaw", "openclaw-connect", "openclaw-node"].includes(node.arguments[0]) || (node.arguments.length >= 2 && fs.realpathSync(node.arguments[0]) === fs.realpathSync(process.execPath) && node.arguments[1] === cli);
  };
  const verifyDarwinNode = (launch, pid) => {
    const startTime = processStartTime(pid);
    const command = probeProcess("ps", ["-ww", "-o", "command=", "-p", String(pid)]);
    const invocation = process.execPath + " " + cli;
    const nodeInvocation = command !== null && (["openclaw", "openclaw-connect", "openclaw-node"].includes(command) || command === invocation || command.startsWith(invocation + " "));
    return launch.pid === pid && Boolean(startTime) && launch.startTime === startTime && launch.runtimeDir === runtimeDir && launch.stateDir === stateDir && launch.cli === cli && nodeInvocation && processCwdMatches(pid);
  };
  const windowsProcesses = (filter) => {
    const desktopFields = desktopTarget === "windows/normal" ? "; sessionId = $_.SessionId; userSid = [string](Invoke-CimMethod -InputObject $_ -MethodName GetOwnerSid).Sid" : "";
    const output = probeProcess("powershell.exe", ["-NoProfile", "-NonInteractive", "-Command", "$ErrorActionPreference = 'Stop'; @(Get-CimInstance Win32_Process -Filter '" + filter + "' | ForEach-Object { @{ pid = $_.ProcessId; startTime = $_.CreationDate.ToUniversalTime().ToString('o'); executablePath = $_.ExecutablePath; commandLine = $_.CommandLine" + desktopFields + " } }) | ConvertTo-Json -Compress"]);
    if (!output) return [];
    const parsed = JSON.parse(output);
    return Array.isArray(parsed) ? parsed : [parsed];
  };
  const isWindowsNode = (entry) => {
    if (!entry || !Number.isSafeInteger(entry.pid) || entry.pid < 1 || typeof entry.startTime !== "string" || !entry.startTime || typeof entry.executablePath !== "string" || typeof entry.commandLine !== "string") return false;
    // Our invocation has exactly executable + CLI before its options. Windows paths
    // cannot contain quotes; accept quoted or unquoted path tokens in those positions.
    // CIM retains this command line even when Node changes the console title.
    const invocation = entry.commandLine.match(/^(?:"([^"]+)"|([^\\s"]+))\\s+(?:"([^"]+)"|([^\\s"]+))(?:\\s|$)/);
    return invocation !== null && (invocation[3] ?? invocation[4]) === cli && fs.realpathSync(invocation[1] ?? invocation[2]) === fs.realpathSync(process.execPath) && fs.realpathSync(entry.executablePath) === fs.realpathSync(process.execPath);
  };
  const reuseNodeProcess = () => {
  const hasPid = mode && fs.existsSync(pidFile);
  if (mode && !hasPid) {
    // The runtime pointer precedes detached launch; a lost PID cannot prove no process survived.
    for (const previous of [runtimeLink, launchFile]) {
      try {
        const entry = fs.lstatSync(previous);
        if (previous === runtimeLink && !entry.isSymbolicLink()) throw new Error("Cloud worker runtime pointer is occupied");
        throw new Error("Cloud worker node launch is incomplete; release and reprovision the worker");
      } catch (error) { if (error.code !== "ENOENT") throw error; }
    }
  }
  if (hasPid) {
    const pidText = fs.readFileSync(pidFile, "utf8").trim();
    if (!/^[1-9][0-9]*$/.test(pidText)) throw new Error("Cloud worker node PID is invalid; release and reprovision the worker");
    const pid = Number(pidText);
    let alive = true;
    try { process.kill(pid, 0); } catch (error) { if (error.code !== "ESRCH") throw error; alive = false; }
    if (alive) {
      let verified = false;
      if (process.platform === "linux") {
        const args = fs.readFileSync(path.join("/proc", pidText, "cmdline"), "utf8").split("\\0");
        const env = fs.readFileSync(path.join("/proc", pidText, "environ"), "utf8").split("\\0");
        // OpenClaw changes process.title; the immutable install cwd survives that argv rewrite.
        const title = args[0];
        const nodeInvocation = args[1] === cli || ["openclaw", "openclaw-connect", "openclaw-node"].includes(title);
        verified = nodeInvocation && fs.realpathSync(path.join("/proc", pidText, "cwd")) === runtimeDir && env.includes("OPENCLAW_STATE_DIR=" + stateDir);
      } else if (process.platform === "win32") {
        try {
          const launch = JSON.parse(fs.readFileSync(launchFile, "utf8"));
          const entries = windowsProcesses("ProcessId=" + pidText);
          const entry = entries.length === 1 ? entries[0] : undefined;
          // Windows exposes no cheap cwd probe. Bind launch-owned cwd/state to the
          // actual node.exe creation time and independently inspect its executable/argv.
          verified = isWindowsNode(entry) && entry.pid === pid && launch.pid === pid && launch.startTime === entry.startTime && launch.runtimeDir === runtimeDir && launch.stateDir === stateDir && launch.cli === cli;
          if (verified && desktopTarget === "windows/normal") {
            const session = readWindowsDesktopSessionIdentity();
            verified = entry.sessionId > 0 && entry.sessionId === session.sessionId && entry.userSid === session.userSid && launch.sessionId === session.sessionId && launch.userSid === session.userSid;
          }
        } catch { verified = false; }
      } else {
        try {
          // Darwin loses ps-visible environment when process.title changes. Bind the launch
          // facts to this live process's start time, then independently verify argv and cwd.
          const launch = JSON.parse(fs.readFileSync(launchFile, "utf8"));
          verified = desktopTarget === "macos" ? verifyMacosNode(launch, pid) : verifyDarwinNode(launch, pid);
        } catch { /* Missing launch or process identity must never authorize replay. */ }
      }
      if (!verified) {
        throw new Error("Cloud worker node is running a different bootstrap artifact or invocation; release and reprovision the worker");
      }
      return true;
    }
    if (desktopTarget === "macos") {
      const launch = JSON.parse(fs.readFileSync(launchFile, "utf8"));
      if (inspectMacosHost(launch)?.state !== "gone") throw new Error("Cloud worker desktop host is still running or could not be verified; release and reprovision the worker");
    }
    fs.unlinkSync(pidFile);
  }
  return false;
  };
  const launchNodeProcess = async () => {
  const args = mode === "connect" ? ["connect", "--target-file", setupFile] : ["node", "run"];
  setPhase("node launch");
  const logPath = path.join(stateDir, "node.log");
  const log = process.platform === "win32" ? undefined : fs.openSync(logPath, "a", 0o600);
  let child;
  let pid;
  let parentPid;
  let startTime;
  let desktopIdentity;
  try {
    const nodeArgs = [cli, ...args, "--ephemeral", "--display-name", displayName];
    if (desktopTarget === "macos") {
      // LaunchServices makes the signed host its own TCC responsibility owner.
      // open is only a waiter; the host's inspected receipt identifies the actual processes.
      child = spawn("/bin/bash", ["-c", macosGuiLaunchScript, "openclaw-gui", "/usr/bin/open", "-n", "-g", "-W", "-a", ${JSON.stringify(CRABBOX_MACOS_APP_PATH)}, "--stdin", "/dev/null", "--stdout", logPath, "--stderr", logPath, "--args", ...macosHostArgs(mode)], { cwd: runtimeDir, env: nodeEnv, detached: true, stdio: ["ignore", log, log] });
      await once(child, "spawn");
      const deadline = Date.now() + 90000;
      while (Date.now() < deadline) {
        if (fs.existsSync(pidFile)) {
          const launch = JSON.parse(fs.readFileSync(launchFile, "utf8"));
          const actualPid = Number(fs.readFileSync(pidFile, "utf8").trim());
          if (!verifyMacosNode(launch, actualPid)) throw new Error("Cloud worker native desktop host published a mismatched process receipt; release and reprovision the worker");
          child.unref();
          return;
        }
        if ((child.exitCode !== null && child.exitCode !== undefined) || child.signalCode) throw new Error("Cloud worker native desktop host exited before enrollment; inspect node.log and reprovision the worker");
        await new Promise((resolve) => setTimeout(resolve, 250));
      }
      throw new Error("Cloud worker native desktop host did not become ready; inspect node.log and reprovision the worker");
    } else if (desktopTarget === "windows/normal") {
      desktopIdentity = await launchWindowsDesktopNode({ nodePath: process.execPath, nodeArgs, cwd: runtimeDir, stateDir, logPath });
      ({ pid, startTime } = desktopIdentity);
    } else if (process.platform === "win32") {
      const quote = (value) => "'" + value.replaceAll("'", "''") + "'";
      // The managed launcher owns OpenSSH job breakaway. Its hidden PowerShell child
      // owns logging because detached processes must not inherit SSH stdio handles.
      const launchScript = "$env:OPENCLAW_STATE_DIR = " + quote(stateDir) + "; & " + [process.execPath, ...nodeArgs].map(quote).join(" ") + " *>> " + quote(logPath) + "; exit $LASTEXITCODE";
      const argumentList = "-NoLogo -NoProfile -NonInteractive -EncodedCommand " + Buffer.from(launchScript, "utf16le").toString("base64");
      const launched = probeProcess("powershell.exe", ["-NoProfile", "-NonInteractive", "-ExecutionPolicy", "Bypass", "-File", launcher, "-FilePath", "powershell.exe", "-ArgumentList", argumentList, "-WorkingDirectory", runtimeDir]);
      if (!/^[1-9][0-9]*$/.test(launched || "")) throw new Error("Cloud worker managed Windows launcher failed; release and reprovision the worker");
      parentPid = Number(launched);
      const deadline = Date.now() + 30000;
      while (!pid && Date.now() < deadline) {
        const entries = windowsProcesses("ParentProcessId=" + parentPid).filter(isWindowsNode);
        if (entries.length > 1) throw new Error("Cloud worker node invocation is ambiguous; release and reprovision the worker");
        if (entries.length === 1) { pid = entries[0].pid; startTime = entries[0].startTime; }
        else await new Promise((resolve) => setTimeout(resolve, 250));
      }
      if (!pid) throw new Error("Cloud worker node start time is unavailable; release and reprovision the worker");
    } else {
      child = spawn(process.execPath, nodeArgs, { cwd: runtimeDir, env: nodeEnv, detached: true, windowsHide: true, stdio: ["ignore", log, log] });
      await once(child, "spawn");
      pid = child.pid;
      if (process.platform !== "linux") startTime = processStartTime(pid);
    }
      if (process.platform !== "linux") {
        if (!startTime) throw new Error("Cloud worker node start time is unavailable; release and reprovision the worker");
        const temporary = launchFile + "." + crypto.randomUUID();
        try {
          fs.writeFileSync(temporary, JSON.stringify({ pid, startTime, runtimeDir, stateDir, cli, ...(desktopIdentity ? { sessionId: desktopIdentity.sessionId, userSid: desktopIdentity.userSid } : {}) }), { mode: 0o600, flag: "wx" });
          fs.renameSync(temporary, launchFile);
        } finally { fs.rmSync(temporary, { force: true }); }
      }
      fs.writeFileSync(pidFile, String(pid) + "\\n", { mode: 0o600 });
    child?.unref();
  } catch (error) {
    if (desktopTarget === "macos") {
      let confirmedStopped = !child?.pid;
      try {
        let launch;
        try {
          const receipt = JSON.parse(fs.readFileSync(launchFile, "utf8"));
          if (verifyMacosHost(receipt)) launch = receipt;
        } catch { /* A host can fail before publishing its Node receipt. */ }
        if (launch && verifyMacosHost(launch)) {
          process.kill(launch.hostPid, "SIGTERM");
          const deadline = Date.now() + 15000;
          while (Date.now() < deadline) {
            const current = inspectMacosHost(launch);
            if (current?.state === "gone" || (current?.state === "active" && current.host.pid === launch.hostPid && current.host.startTime !== launch.hostStartTime)) { confirmedStopped = true; break; }
            await new Promise((resolve) => setTimeout(resolve, 250));
          }
        }
      } catch { /* The provider's lease teardown owns an unconfirmed host launch. */ }
      child?.unref();
      if (!confirmedStopped) error.message += "; native desktop host shutdown could not be confirmed; lease teardown is required";
    } else if (desktopIdentity) {
      const entries = windowsProcesses("ProcessId=" + pid);
      if (entries.length === 1 && isWindowsNode(entries[0]) && entries[0].startTime === startTime) spawnSync("taskkill.exe", ["/PID", String(pid), "/T", "/F"], { env: nodeEnv, windowsHide: true, stdio: "ignore", timeout: 10000 });
    } else if (parentPid) spawnSync("taskkill.exe", ["/PID", String(parentPid), "/T", "/F"], { env: nodeEnv, windowsHide: true, stdio: "ignore", timeout: 10000 });
    else if (pid) process.kill(-pid, "SIGTERM");
    throw error;
  } finally { if (log !== undefined) fs.closeSync(log); }
  };
`;
}
//#endregion
//#region extensions/crabbox/src/crabbox-worker-node-enrollment.ts
const CLOUD_SETUP_CODE_ENV = "CRABBOX_WORKER_SETUP_CODE";
const CLOUD_BOOTSTRAP_TOKEN_ENV = "CRABBOX_WORKER_BOOTSTRAP_TOKEN";
function createCrabboxNodeEnrollmentSetup(params) {
	return createCrabboxNodeSetup({
		...params,
		nodeBootstrap: params.enrollment.nodeBootstrap
	});
}
function createCrabboxNodeRuntimeSetup(params) {
	return createCrabboxNodeSetup(params);
}
function createCrabboxNodeSetup(params) {
	const { enrollment, leaseId } = params;
	const { token, ...nodeBootstrap } = params.nodeBootstrap;
	const workerBundle = params.workerBundle ? (({ token: _token, ...artifact }) => artifact)(params.workerBundle) : void 0;
	const desktopTarget = params.desktop ? params.target ?? "linux" : void 0;
	const desktopEnvironment = desktopTarget === "linux" ? [
		"set -eu",
		...createCrabboxXfceSessionEnvironment(),
		`exec "$1" -e 'process.stdout.write(JSON.stringify({DISPLAY:process.env.DISPLAY,DBUS_SESSION_BUS_ADDRESS:process.env.DBUS_SESSION_BUS_ADDRESS,XDG_RUNTIME_DIR:process.env.XDG_RUNTIME_DIR}))'`
	].join("\n") : null;
	return {
		command: wrapCrabboxNodeScript(`const fs = require("node:fs");
const fsp = fs.promises;
const path = require("node:path");
const os = require("node:os");
const crypto = require("node:crypto");
const http = require("node:http");
const https = require("node:https");
const { spawn, spawnSync } = require("node:child_process");
const { once } = require("node:events");
const bootstrap = ${JSON.stringify(nodeBootstrap)};
const workerBundle = ${JSON.stringify(workerBundle)};
const leaseId = ${JSON.stringify(leaseId)};
const displayName = ${JSON.stringify(enrollment?.displayName)};
const mode = ${JSON.stringify(enrollment?.mode)};
const desktopEnvironment = ${JSON.stringify(desktopEnvironment)};
const desktopSetup = ${JSON.stringify(params.desktopSetup)};
const credentials = process.env.${CLOUD_BOOTSTRAP_TOKEN_ENV};
const setupCode = process.env.${CLOUD_SETUP_CODE_ENV};
delete process.env.${CLOUD_BOOTSTRAP_TOKEN_ENV};
delete process.env.${CLOUD_SETUP_CODE_ENV};
if (process.platform !== "win32") process.umask(0o077);
let phase;
const setPhase = (next) => {
  if (phase === next) return;
  phase = next;
  console.error("CRABBOX_PHASE:openclaw-bootstrap-" + next.toLowerCase().replaceAll(" ", "-"));
};
setPhase("preparation");
(async () => {
  let tokens;
  try { tokens = JSON.parse(credentials || "{}"); }
  catch { throw new Error("Cloud worker bootstrap credential format is invalid"); }
  const home = fs.realpathSync(os.homedir());
  const stateDir = path.join(home, ".openclaw", "cloud-workers", leaseId);
  const runtimeRoot = path.join(home, ".openclaw-worker", "node-runtimes");
  const runtimeDir = path.join(runtimeRoot, bootstrap.sha256);
  const cli = path.join(runtimeDir, "node_modules", "openclaw", "openclaw.mjs");
  const pidFile = path.join(stateDir, "node.pid");
  const launchFile = path.join(stateDir, "node-launch.json");
  const setupFile = path.join(stateDir, "setup-code");
  const runtimeLink = path.join(stateDir, "runtime");
  const nodeEnv = { ...process.env, ...(mode ? { OPENCLAW_STATE_DIR: stateDir } : {}) };
  const finishDesktopSetup = () => {
    if (!desktopSetup) return;
    setPhase("desktop setup");
    // The wallpaper can exceed the OS argument limit; stream the owned script over stdin.
    if (process.platform === "win32") {
      runWindowsDesktopPowerShell(desktopSetup);
      return;
    }
    const result = spawnSync("bash", ["-s"], { input: desktopSetup, env: nodeEnv, stdio: ["pipe", "inherit", "inherit"], timeout: ${CRABBOX_SETUP_TIMEOUT_MS}, killSignal: "SIGKILL" });
    if (result.error) throw result.error;
    if (result.status !== 0) throw new Error("Cloud worker desktop setup failed" + (result.signal ? " (" + result.signal + ")" : " with exit code " + result.status));
  };
  const directoryOptions = process.platform === "win32" ? {} : { mode: 0o700 };
  const launcher = path.join(process.env.ProgramFiles || "C:\\\\Program Files", "Crabbox", "bin", "Start-CrabboxDetachedProcess.ps1");
  if (process.platform === "win32" && mode && !${JSON.stringify(desktopTarget === "windows/normal")} && !fs.existsSync(launcher)) {
    throw new Error("Cloud worker requires " + launcher + "; update the Crabbox Windows bootstrap image and reprovision the worker");
  }
  if (desktopEnvironment) {
    // Inspect XFCE only after stripping forwarded credentials from every child environment.
    const desktop = spawnSync("bash", ["-c", desktopEnvironment, "bash", process.execPath], { env: nodeEnv, encoding: "utf8", timeout: 60000 });
    if (desktop.status !== 0) throw new Error(desktop.stderr?.trim() || "Cloud worker XFCE session is unavailable");
    delete nodeEnv.XDG_RUNTIME_DIR;
    Object.assign(nodeEnv, JSON.parse(desktop.stdout));
  }
  if (mode) {
    fs.mkdirSync(stateDir, { recursive: true, ...directoryOptions });
    if (process.platform !== "win32") fs.chmodSync(stateDir, 0o700);
  }
  ${createCrabboxNodeProcessRuntime(desktopTarget, leaseId)}
  if (desktopTarget === "macos") finishDesktopSetup();
  if (reuseNodeProcess()) {
    if (desktopTarget !== "macos") finishDesktopSetup();
    setPhase("complete");
    return;
  }
  const verifyRuntime = (root) => {
    setPhase("runtime verification");
    if (!fs.lstatSync(root).isDirectory() || fs.realpathSync(root) !== root) throw new Error("Cloud worker bootstrap runtime path is unsafe");
    const packageRoot = path.join(root, "node_modules", "openclaw");
    const manifest = JSON.parse(fs.readFileSync(path.join(packageRoot, "package.json"), "utf8"));
    if (manifest.name !== "openclaw" || manifest.version !== bootstrap.openclawVersion) throw new Error("Cloud worker bootstrap package identity does not match the Gateway");
    const probe = spawnSync(process.execPath, [path.join(packageRoot, "openclaw.mjs"), "--version"], { env: nodeEnv, encoding: "utf8", timeout: 60000 });
    const version = probe.stdout?.trim();
    const expected = "OpenClaw " + bootstrap.openclawVersion;
    if (probe.status !== 0 || (version !== expected && !version?.startsWith(expected + " "))) throw new Error("Cloud worker bootstrap CLI could not verify its Gateway version");
  };
  const verifyArchive = async (source, artifact, output) => {
    const hash = crypto.createHash("sha256");
    let bytes = 0;
    for await (const chunk of source) {
      bytes += chunk.byteLength;
      if (bytes > artifact.bytes) throw new Error("Cloud worker bootstrap archive exceeds its declared size");
      hash.update(chunk);
      if (output) await output.writeFile(chunk);
    }
    if (bytes !== artifact.bytes || hash.digest("hex") !== artifact.sha256) throw new Error("Cloud worker bootstrap archive failed integrity verification");
  };
  const downloadArchive = async (artifact, token, archive, reportPhase = setPhase) => {
    reportPhase("download connection");
    if (!token) throw new Error("Cloud worker bootstrap download authority is unavailable");
    const url = new URL(artifact.url);
    if (!["http:", "https:"].includes(url.protocol) || url.username || url.password || url.search || url.hash || (artifact.tlsFingerprint && url.protocol !== "https:")) throw new Error("Cloud worker bootstrap artifact transport is invalid");
    const normalizePin = (value) => value.trim().replace(/^sha256:/i, "").replaceAll(":", "").toLowerCase();
    const pin = artifact.tlsFingerprint ? normalizePin(artifact.tlsFingerprint) : undefined;
    if (pin && !/^[a-f0-9]{64}$/.test(pin)) throw new Error("Cloud worker bootstrap TLS fingerprint is invalid");
    const transport = url.protocol === "https:" ? https : http;
    const request = transport.request(url, {
      agent: false, headers: { authorization: "Bearer " + token }, signal: AbortSignal.timeout(600000),
      ...(pin ? { rejectUnauthorized: false, session: Buffer.alloc(0) } : {}),
    });
    // Observe transport progress without changing when the pinned request may send credentials.
    request.once("socket", (socket) => {
      socket.once("connect", () => { reportPhase(url.protocol === "https:" ? "download TLS" : "download HTTP response"); });
      socket.once("secureConnect", () => { if (!pin) reportPhase("download HTTP response"); });
    });
    const pendingResponse = once(request, "response").then(([response]) => response);
    // Pinned private certificates authenticate the socket before any bearer bytes leave.
    void (async () => {
      if (pin) {
        const [socket] = await once(request, "socket");
        await once(socket, "secureConnect");
        if (normalizePin(socket.getPeerCertificate().fingerprint256 ?? "") !== pin) throw new Error("Cloud worker bootstrap TLS fingerprint mismatch");
        reportPhase("download HTTP response");
      }
      request.end();
    })().catch((error) => request.destroy(error));
    const response = await pendingResponse;
    try {
      if (response.statusCode !== 200) throw new Error("Cloud worker bootstrap download failed with HTTP " + response.statusCode);
      if (response.headers["content-length"] !== undefined && Number(response.headers["content-length"]) !== artifact.bytes) throw new Error("Cloud worker bootstrap archive length does not match the Gateway");
      reportPhase("download body");
      const output = await fsp.open(archive, "wx", 0o600);
      try { await verifyArchive(response, artifact, output); }
      finally { await output.close(); }
    } finally { response.destroy(); }
  };
  const workerArchivePath = (root) => {
    const relative = workerBundle.packageRelativePath;
    const parts = relative.split("/");
    if (parts.length !== 2 || !/^[a-z][a-z-]*$/.test(parts[0]) || parts[1] !== workerBundle.sha256 + ".tgz" || !/^[a-f0-9]{64}$/.test(workerBundle.sha256)) throw new Error("Cloud worker archive package path is invalid");
    return path.join(root, "node_modules", "openclaw", ...parts);
  };
  const verifyWorkerArchive = async (root) => {
    setPhase("worker archive verification");
    const archive = workerArchivePath(root);
    let handle;
    // A non-regular artifact (including a FIFO) must reject without blocking preparation.
    try { handle = await fsp.open(archive, fs.constants.O_RDONLY | fs.constants.O_NOFOLLOW | fs.constants.O_NONBLOCK); }
    catch (error) { if (error.code === "ENOENT") return false; throw error; }
    try {
      const stat = await handle.stat();
      if (!stat.isFile() || stat.nlink !== 1 || stat.size !== workerBundle.bytes || fs.realpathSync(archive) !== archive) throw new Error("Cloud worker prepared archive path or length is unsafe");
      const source = handle.createReadStream({ autoClose: false });
      try { await verifyArchive(source, workerBundle); }
      finally { source.destroy(); }
    } finally { await handle.close(); }
    return true;
  };
  const publishWorkerArchive = (root, downloaded) => {
    if (!workerBundle) return;
    setPhase("worker archive publication");
    const archive = workerArchivePath(root);
    const directory = path.dirname(archive);
    fs.mkdirSync(directory, { recursive: true, ...directoryOptions });
    if (fs.realpathSync(directory) !== directory || !fs.lstatSync(directory).isDirectory()) throw new Error("Cloud worker prepared archive directory is unsafe");
    if (downloaded) fs.renameSync(downloaded, archive);
    // This package owns one immutable source archive; ordinary node installs never write here.
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      if (entry.name !== path.basename(archive) && /^[a-f0-9]{64}\\.tgz$/.test(entry.name)) {
        if (!entry.isFile() || entry.isSymbolicLink()) throw new Error("Cloud worker prepared archive directory contains an unsafe artifact");
        fs.unlinkSync(path.join(directory, entry.name));
      }
    }
  };
  fs.mkdirSync(runtimeRoot, { recursive: true, ...directoryOptions });
  const existingRuntime = fs.existsSync(runtimeDir);
  if (existingRuntime) verifyRuntime(runtimeDir);
  if (existingRuntime && (!workerBundle || await verifyWorkerArchive(runtimeDir))) {
    publishWorkerArchive(runtimeDir);
  } else {
  const stage = fs.mkdtempSync(path.join(runtimeRoot, "node-bootstrap-"));
  try {
    const archive = path.join(stage, "openclaw.tgz");
    if (!existingRuntime) await downloadArchive(bootstrap, tokens.nodeBootstrap, archive);
    const downloadedWorker = workerBundle ? path.join(stage, "worker.tgz") : undefined;
    const installDir = existingRuntime ? runtimeDir : path.join(stage, "runtime");
    const overlap = downloadedWorker && !existingRuntime;
    if (overlap) setPhase("installation and worker download");
    let workerPhase;
    const preparation = await Promise.allSettled([
      downloadedWorker ? downloadArchive(workerBundle, tokens.workerBundle, downloadedWorker, overlap ? (next) => { workerPhase = next; } : setPhase).catch((error) => {
        if (!overlap) throw error;
        throw new Error("Cloud worker archive " + workerPhase + " failed" + (error.code ? " (" + error.code + ")" : "") + ": " + error.message, { cause: error });
      }) : undefined,
      (async () => {
      if (existingRuntime) return;
      if (!overlap) setPhase("installation");
      fs.mkdirSync(installDir, directoryOptions);
      // npm 12 requires a project policy even when ignore-scripts is false.
      // Trust only the verified artifact; dependency script policy stays unchanged.
      fs.writeFileSync(path.join(installDir, "package.json"), JSON.stringify({ private: true, allowScripts: { ["file:" + archive]: true } }), { mode: 0o600 });
      const logPath = path.join(stage, "install.log");
      const log = fs.openSync(logPath, "w", 0o600);
      let installed;
      try {
        const npmCli = path.join(path.dirname(process.execPath), "node_modules", "npm", "bin", "npm-cli.js");
        if (process.platform === "win32" && !fs.existsSync(npmCli)) throw new Error("Cloud worker requires npm beside node.exe; update the Crabbox Windows bootstrap image and reprovision the worker");
        installed = await new Promise((resolve) => {
          const child = spawn(process.platform === "win32" ? process.execPath : "npm", [...(process.platform === "win32" ? [npmCli] : []), "install", "--prefix", installDir, "--omit=dev", "--no-save", "--package-lock=false", "--no-audit", "--no-fund", "--ignore-scripts=false", archive], { cwd: stage, env: nodeEnv, windowsHide: true, stdio: ["ignore", log, log], timeout: 600000 });
          let error;
          child.once("error", (cause) => { error = cause; });
          child.once("close", (status, signal) => resolve({ status, signal, error }));
        });
      } finally { fs.closeSync(log); }
      if (installed.status !== 0 || installed.error) {
        const tail = fs.readFileSync(logPath, "utf8").slice(-2048);
        throw new Error("Cloud worker bootstrap package installation failed (" + (installed.error?.message || installed.signal || "exit code " + installed.status) + "): " + tail);
      }
      })(),
    ]);
    // Both the download and npm must stop writing before publication or staging cleanup.
    for (const result of preparation) if (result.status === "rejected") throw result.reason;
    if (!existingRuntime) verifyRuntime(installDir);
    publishWorkerArchive(installDir, downloadedWorker);
    // Archive publication completes before a fresh runtime becomes reusable or capture can begin.
    if (!existingRuntime) fs.renameSync(installDir, runtimeDir);
  } finally { fs.rmSync(stage, { recursive: true, force: true }); }
  }
  // A project snapshot contains only verified runtime bytes, never enrollment state.
  if (!mode) {
    setPhase("complete");
    return;
  }
  setPhase("activation");
  try {
    if (!fs.lstatSync(runtimeLink).isSymbolicLink()) throw new Error("Cloud worker runtime pointer is occupied");
    fs.unlinkSync(runtimeLink);
  } catch (error) { if (error.code !== "ENOENT") throw error; }
  setPhase("plugin activation");
  const pluginIds = [...new Set([...bootstrap.enabledPluginIds, ...${JSON.stringify(params.desktop ? ["cua-computer"] : [])}])];
  if (pluginIds.length > 0) {
    // One CLI process retains the combined per-plugin time and output allowances.
    const enabled = spawnSync(process.execPath, [cli, "plugins", "enable", ...pluginIds], { env: nodeEnv, encoding: "utf8", timeout: 60000 * pluginIds.length, maxBuffer: 1024 * 1024 * pluginIds.length });
    if (enabled.status !== 0) throw new Error("Cloud worker bootstrap could not enable plugins " + pluginIds.join(", "));
  }
  // Publishing this pointer earlier makes fresh state look like a legacy installation.
  fs.symlinkSync(runtimeDir, runtimeLink, process.platform === "win32" ? "junction" : "dir");
  if (mode === "connect") {
    if (!setupCode) throw new Error("Cloud worker enrollment credential is unavailable");
    fs.writeFileSync(setupFile, setupCode + "\\n", { mode: 0o600 });
  }
  await launchNodeProcess();
  if (desktopTarget !== "macos") finishDesktopSetup();
  setPhase("complete");
})().catch((error) => { console.error("Cloud worker node bootstrap " + phase + " failed" + (error.code ? " (" + error.code + ")" : "") + ": " + error.message); process.exitCode = 1; });
`.trimEnd(), params.target, "CRABBOX_NODE_ENROLLMENT_SCRIPT"),
		forwardedEnv: {
			[CLOUD_BOOTSTRAP_TOKEN_ENV]: JSON.stringify({
				nodeBootstrap: token,
				workerBundle: params.workerBundle?.token
			}),
			...enrollment?.mode === "connect" ? { [CLOUD_SETUP_CODE_ENV]: enrollment.setupCode } : {}
		}
	};
}
//#endregion
//#region extensions/crabbox/src/crabbox-worker-preflight.ts
async function loadCrabboxConfigShow(params) {
	const result = await runCrabboxCommand({
		action: "config show",
		args: [
			"config",
			"show",
			"--json"
		],
		binary: params.binary,
		runCommand: params.runCommand,
		signal: params.signal,
		timeoutMs: CRABBOX_LIFECYCLE_TIMEOUT_MS
	});
	if (result.termination !== "exit" || result.code !== 0) throw crabboxCommandError("config show", result);
	try {
		return JSON.parse(result.stdout);
	} catch {
		throw new Error("Crabbox config show returned invalid JSON");
	}
}
async function assertAwsWorkerHasNoInstanceProfile(params) {
	const config = await loadCrabboxConfigShow(params);
	const instanceProfile = isRecord(config) && isRecord(config.aws) ? config.aws.instanceProfile : void 0;
	if (typeof instanceProfile !== "string") throw new WorkerProviderError("Crabbox config show returned an invalid AWS instance profile");
	if (normalizeOptionalString(instanceProfile)) throw new WorkerProviderError("Crabbox AWS instance profile must be empty for cloud workers");
}
async function assertHetznerDesktopHasManagedCoordinator(params) {
	const config = await loadCrabboxConfigShow(params);
	const view = isRecord(config) ? config : void 0;
	if (normalizeOptionalString(view?.coordinator) && view?.brokerMode === "managed") return;
	throw new Error("Crabbox Hetzner desktop profiles require a managed coordinator");
}
//#endregion
//#region extensions/crabbox/src/crabbox-worker-project.ts
/** Core owns Git contents; this adapter owns only the existing lease's transport. */
async function prepareCrabboxProjectFiles(params) {
	const run = async (args, signal, createScript) => {
		params.project.assertCurrent();
		const timeoutMs = params.timeoutMs();
		const result = await runCrabboxCommand({
			action: "project preparation",
			args,
			binary: params.binary,
			runCommand: params.runCommand,
			signal: params.signal ? AbortSignal.any([signal, params.signal]) : signal,
			input: createScript?.(timeoutMs),
			timeoutMs
		});
		params.project.assertCurrent();
		if (result.termination !== "exit" || result.code !== 0) throw crabboxCommandError("project preparation", result);
		return result.stdout;
	};
	if (params.inspectPrepared) {
		if (!params.project.inspectPreparedWorkspace) throw new Error("Enrolled project cannot verify its completed workspace");
		await params.project.inspectPreparedWorkspace({ runScript: (input, signal) => run(params.runArgs, signal, () => input) });
		return;
	}
	return await params.project.prepare({
		runScript: (input, signal) => run(params.runArgs, signal, () => input),
		runScriptWithBudget: (createScript, signal) => run(params.runArgs, signal, createScript),
		upload: async (localPath, remotePath, signal) => {
			await run([
				"cp",
				"--provider",
				params.provider,
				"--id",
				params.id,
				localPath,
				`SANDBOX:${remotePath}`
			], signal);
		}
	});
}
//#endregion
//#region extensions/crabbox/src/crabbox-worker-env-profile.ts
async function withCrabboxWorkerEnvProfile(values, run) {
	const entries = Object.entries(values ?? {});
	const names = entries.map(([name]) => name);
	let directory;
	try {
		let profilePath;
		if (entries.length > 0) {
			const profile = entries.map(([name, value]) => {
				if ([
					"\0",
					"\r",
					"\n",
					"`",
					"$("
				].some((unsafe) => value.includes(unsafe))) throw new WorkerProviderError(`Crabbox setup environment value cannot be represented safely: ${name}`);
				return `${name}="${value.replaceAll("\\", "\\\\").replaceAll("\"", "\\\"")}"`;
			}).join("\n");
			directory = await mkdtemp(join(resolvePreferredOpenClawTmpDir(), "openclaw-crabbox-env-"));
			profilePath = join(directory, "setup.env");
			await writeFile(profilePath, `${profile}\n`, {
				mode: 384,
				flag: "wx"
			});
		}
		return await run(names, profilePath, {
			...Object.fromEntries(names.map((name) => [name, void 0])),
			CRABBOX_ENV_ALLOW: ","
		});
	} finally {
		if (directory) await rm(directory, {
			force: true,
			recursive: true
		});
	}
}
//#endregion
//#region extensions/crabbox/src/crabbox-worker-inspect.ts
function parseInspectJson(stdout) {
	let value;
	try {
		const parsed = JSON.parse(stdout);
		if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error("inspect output is not an object");
		value = parsed;
	} catch {
		throw new Error("Crabbox inspect returned invalid JSON");
	}
	const id = normalizeOptionalString(value.id);
	const state = normalizeOptionalString(value.state)?.toLowerCase();
	if (!id || !/^\S{1,128}$/u.test(id) || !state) throw new Error("Crabbox inspect returned an invalid lease identity or state");
	if (value.ready !== void 0 && typeof value.ready !== "boolean") throw new Error("Crabbox inspect returned an invalid ready state");
	if (value.sshUser !== void 0 && typeof value.sshUser !== "string") throw new Error("Crabbox inspect returned an invalid SSH user");
	const sshUser = normalizeOptionalString(value.sshUser);
	if (value.tailscale !== void 0 && (value.tailscale === null || typeof value.tailscale !== "object" || Array.isArray(value.tailscale))) throw new Error("Crabbox inspect returned invalid Tailscale state");
	const tailscaleEnabled = value.tailscale !== void 0;
	let awsInstanceProfileAttached;
	if (value.providerMetadata !== void 0) {
		if (value.providerMetadata === null || typeof value.providerMetadata !== "object" || Array.isArray(value.providerMetadata)) throw new Error("Crabbox inspect returned invalid provider metadata");
		const attached = value.providerMetadata["instanceProfileAttached"];
		if (attached !== void 0 && typeof attached !== "boolean") throw new Error("Crabbox inspect returned invalid AWS instance profile metadata");
		awsInstanceProfileAttached = attached;
	}
	const failureError = normalizeOptionalString(value.failureError);
	return {
		id,
		state,
		tailscaleEnabled,
		...failureError ? { failureError: truncateUtf16Safe(redactSensitiveText(failureError).replace(/\s+/gu, " "), 512) } : {},
		...awsInstanceProfileAttached !== void 0 ? { awsInstanceProfileAttached } : {},
		...typeof value.ready === "boolean" ? { ready: value.ready } : {},
		...sshUser && sshUser !== "<token>" ? { sshUser } : {}
	};
}
//#endregion
//#region extensions/crabbox/src/crabbox-worker-provision-commands.ts
/** Allocation retains host and project authority independently of cancellation or cleanup. */
function createCrabboxProvisionAuthority(options) {
	const assertHostCurrent = options?.assertCurrent;
	if (!assertHostCurrent) throw new WorkerProviderError("Crabbox provisioning requires current Gateway allocation authority");
	const signal = options?.signal;
	const project = options?.project;
	const assertCurrent = () => {
		signal?.throwIfAborted();
		assertHostCurrent();
		project?.assertCurrent();
	};
	assertCurrent();
	return {
		signal,
		assertCurrent
	};
}
const NON_RUNNABLE_STATES = /* @__PURE__ */ new Set([
	"archived",
	"deleted",
	"deleting",
	"destroyed",
	"expired",
	"failed",
	"missing",
	"released",
	"stopped",
	"stopped_with_code",
	"terminated"
]);
async function inspectWithContext(params) {
	const action = params.waitForReady ? "status" : "inspect";
	const result = await runCrabboxCommand({
		action,
		args: [
			action,
			"--provider",
			params.context.provider,
			"--network",
			"public",
			"--id",
			params.id,
			...params.waitForReady ? [
				"--wait",
				"--wait-timeout",
				"4m"
			] : [],
			"--json"
		],
		binary: params.context.binary,
		runCommand: params.runCommand,
		signal: params.signal,
		timeoutMs: params.timeoutMs ?? resolveCrabboxLifecycleTimeoutMs(params.context.provider)
	});
	if (result.termination === "exit" && result.code === 0) {
		let inspect;
		try {
			inspect = parseInspectJson(result.stdout);
		} catch (error) {
			throw new WorkerProviderError(error instanceof Error ? error.message : "Crabbox inspect returned invalid output");
		}
		if (params.expectedLeaseId && inspect.id !== params.expectedLeaseId) throw new WorkerProviderError("Crabbox inspect returned a different lease id");
		return {
			status: "found",
			inspect
		};
	}
	if (result.termination === "exit" && isUnrecognizedLease(result, params.id)) return { status: "unknown" };
	throw crabboxCommandError(action, result);
}
function remainingProvisionTimeout(deadline, maximum) {
	const remaining = deadline - Date.now();
	if (remaining <= 0) throw new Error("Crabbox provision exceeded its provider deadline");
	return Math.min(maximum, remaining);
}
const isNonRunnableState = (state) => NON_RUNNABLE_STATES.has(state.toLowerCase());
async function runProvisionWarmup(params) {
	const result = await runCrabboxCommand({
		...params,
		action: "warmup",
		args: ["warmup", ...buildCrabboxAllocationArgs(params.profile, params.id, params.slug)],
		timeoutMs: params.timeoutMs()
	});
	if (result.termination === "exit" && result.code === 0) return;
	const error = crabboxCommandError("warmup", result);
	if (result.termination === "exit" && result.code !== null) try {
		const observed = await inspectWithContext({
			context: params,
			id: params.id,
			expectedLeaseId: params.id,
			runCommand: params.runCommand,
			signal: params.signal,
			timeoutMs: Math.min(params.timeoutMs(), resolveCrabboxLifecycleTimeoutMs(params.provider))
		});
		if (observed.status === "found" && isNonRunnableState(observed.inspect.state) && observed.inspect.failureError) error.message += `; lease failure: ${observed.inspect.failureError}`;
	} catch {
		params.signal?.throwIfAborted();
	}
	throw error;
}
function leaseRunArgs(context, forwardedEnvNames = [], envProfilePath) {
	return [
		"run",
		"--provider",
		context.provider,
		"--network",
		"public",
		"--tailscale=false",
		"--id",
		context.id,
		"--keep=true",
		"--no-sync",
		...forwardedEnvNames.flatMap((name) => ["--allow-env", name]),
		...envProfilePath ? ["--env-from-profile", envProfilePath] : [],
		"--script-stdin"
	];
}
function assertProvisionSecurityPolicy(params) {
	if (params.inspect.tailscaleEnabled) throw new WorkerProviderError("Crabbox cloud worker lease must not have Tailscale enabled");
	const attached = params.inspect.awsInstanceProfileAttached;
	const pending = !params.inspect.ready && !isNonRunnableState(params.inspect.state);
	if (params.provider === "aws" && attached !== false && (attached || !pending)) throw new WorkerProviderError("Crabbox AWS inspect must attest that no instance profile is attached");
}
async function waitForProvisionReady(params) {
	let inspect = params.inspect;
	const inspectAgain = async () => {
		params.signal?.throwIfAborted();
		const replay = await inspectWithContext({
			context: {
				binary: params.binary,
				provider: params.provider
			},
			expectedLeaseId: inspect.id,
			id: inspect.id,
			runCommand: params.runCommand,
			signal: params.signal,
			timeoutMs: remainingProvisionTimeout(params.deadline, resolveCrabboxLifecycleTimeoutMs(params.provider)),
			waitForReady: params.provider === "machine0"
		});
		if (replay.status === "unknown") throw new Error("Crabbox operation lease disappeared while waiting for SSH readiness");
		params.signal?.throwIfAborted();
		return replay.inspect;
	};
	try {
		inspect = params.refresh ? await inspectAgain() : params.inspect;
		params.signal?.throwIfAborted();
		assertProvisionSecurityPolicy({
			inspect,
			provider: params.provider
		});
		while (inspect.ready !== true && !isNonRunnableState(inspect.state)) {
			params.signal?.throwIfAborted();
			const remaining = remainingProvisionTimeout(params.deadline, CRABBOX_LIFECYCLE_TIMEOUT_MS);
			await params.sleep(Math.min(resolveCrabboxReadyPollIntervalMs(params.provider), remaining), params.signal);
			params.signal?.throwIfAborted();
			inspect = await inspectAgain();
			assertProvisionSecurityPolicy({
				inspect,
				provider: params.provider
			});
		}
		if (isNonRunnableState(inspect.state)) throw new WorkerProviderError(`Crabbox operation lease entered a terminal state while waiting for SSH${inspect.failureError ? `: ${inspect.failureError}` : ""}`);
		return inspect;
	} catch (error) {
		params.signal?.throwIfAborted();
		if (error instanceof WorkerProviderError) return await failProvisionAfterCleanup({
			...params,
			id: inspect.id
		}, error);
		throw error;
	}
}
async function runProvisionSetup(params) {
	try {
		const result = await withCrabboxWorkerEnvProfile(params.forwardedEnv, (names, profilePath, childEnv) => runCrabboxCommand({
			action: params.phase,
			args: leaseRunArgs({
				...params,
				id: params.inspect.id
			}, names, profilePath),
			binary: params.binary,
			env: childEnv,
			input: params.setup,
			runCommand: params.runCommand,
			signal: params.signal,
			timeoutMs: remainingProvisionTimeout(params.deadline, params.timeoutMs ?? 9e5)
		}));
		if (result.termination !== "exit" || result.code !== 0) throw crabboxCommandError(params.phase, result);
	} catch (error) {
		params.signal?.throwIfAborted();
		return await failProvisionAfterCleanup({
			...params,
			id: params.inspect.id
		}, error);
	}
	params.signal?.throwIfAborted();
}
async function runProvisionSetupAndWaitReady(params) {
	await runProvisionSetup(params);
	return await waitForProvisionReady({
		...params,
		refresh: true
	});
}
async function prepareProvisionDesktop(params) {
	if (!params.profile.desktop) return;
	let desktop;
	try {
		const { id, sshUser } = params.inspect;
		desktop = {
			setup: createCrabboxWorkerDesktopSetup(id, params.wallpaperBase64, params.profile.target, sshUser),
			endpoint: createCrabboxWorkerDesktopEndpoint(id, params.profile.target, sshUser)
		};
	} catch (error) {
		params.signal?.throwIfAborted();
		return await failProvisionAfterCleanup({
			...params,
			id: params.inspect.id
		}, error);
	}
	if (params.prepareBeforeEnrollment) await runProvisionSetup({
		...params,
		phase: "desktop setup",
		setup: desktop.setup
	});
	return desktop;
}
async function failProvisionAfterCleanup(params, provisionError) {
	try {
		await params.stopLease(params);
	} catch (cleanupError) {
		throw WorkerProviderError.cleanupIndeterminate(params.id, provisionError, cleanupError);
	}
	throw WorkerProviderError.cleanupComplete(params.id, provisionError);
}
//#endregion
//#region extensions/crabbox/src/crabbox-worker-snapshot-actions.ts
async function resolveCrabboxCheckpointBinaries(params) {
	const { profiles, signal, resolveBinary, warn } = params;
	signal.throwIfAborted();
	const resolutions = await Promise.allSettled(profiles.map((profile) => resolveBinary(parseCrabboxProfile(profile).binary, signal)));
	signal.throwIfAborted();
	const binaries = [];
	const failures = [];
	for (const resolution of resolutions) if (resolution.status === "fulfilled") binaries.push(resolution.value);
	else {
		failures.push(resolution.reason);
		warn(`Crabbox maintenance binary unavailable: ${coerceErrorMessage(resolution.reason)}`);
	}
	if (failures.length > 0 && binaries.length === 0) throw new AggregateError(failures, "Crabbox maintenance has no supported executable");
	return [...new Set(binaries)].toSorted();
}
function createCrabboxSnapshotActions(dependencies) {
	const { manager, signal, resolveBinaries } = dependencies;
	const operations = /* @__PURE__ */ new Set();
	const track = async (run) => {
		signal.throwIfAborted();
		const operation = Promise.resolve().then(() => {
			signal.throwIfAborted();
			return run();
		});
		operations.add(operation);
		try {
			return await operation;
		} finally {
			operations.delete(operation);
		}
	};
	return {
		images: {
			pin: (checkpointId, pinned) => track(() => manager.pin(checkpointId, pinned, () => signal.throwIfAborted())),
			rollback: (checkpointId) => track(() => manager.rollback(checkpointId, () => signal.throwIfAborted())),
			delete: (checkpointId, profiles) => track(async () => {
				const binaries = await resolveBinaries(profiles, signal);
				signal.throwIfAborted();
				return manager.delete({
					binaries,
					signal,
					assertCurrent: () => signal.throwIfAborted()
				}, checkpointId);
			})
		},
		async settle() {
			await Promise.allSettled(operations);
		}
	};
}
//#endregion
//#region extensions/crabbox/src/crabbox-worker-wallpaper.ts
const WORKER_WALLPAPER_WIDTH = 1024;
const WORKER_WALLPAPER_HEIGHT = 576;
const PNG_SIGNATURE = Buffer.from([
	137,
	80,
	78,
	71,
	13,
	10,
	26,
	10
]);
function loadCrabboxWorkerWallpaperBase64(wallpaperPath) {
	let wallpaper;
	try {
		wallpaper = fs.readFileSync(wallpaperPath);
	} catch (cause) {
		throw new Error(`Crabbox worker wallpaper could not be read: ${wallpaperPath}`, { cause });
	}
	if (wallpaper.length < 33 || !wallpaper.subarray(0, PNG_SIGNATURE.length).equals(PNG_SIGNATURE) || wallpaper.readUInt32BE(8) !== 13 || wallpaper.toString("ascii", 12, 16) !== "IHDR") throw new Error(`Crabbox worker wallpaper is not a PNG: ${wallpaperPath}`);
	const width = wallpaper.readUInt32BE(16);
	const height = wallpaper.readUInt32BE(20);
	if (width !== WORKER_WALLPAPER_WIDTH || height !== WORKER_WALLPAPER_HEIGHT) throw new Error(`Crabbox worker wallpaper must be ${WORKER_WALLPAPER_WIDTH}x${WORKER_WALLPAPER_HEIGHT}; got ${width}x${height}: ${wallpaperPath}`);
	return wallpaper.toString("base64");
}
//#endregion
//#region extensions/crabbox/src/crabbox-worker-warm-image-checkpoint.ts
const CHECKPOINT_ID_PATTERN = /^chk_[A-Za-z0-9][A-Za-z0-9_-]{0,127}$/u;
var CrabboxCheckpointCreateError = class CrabboxCheckpointCreateError extends Error {
	static wasNotSubmitted(error, context) {
		return error instanceof CrabboxCheckpointCreateError && error.notSubmitted?.provider === context.provider && error.notSubmitted.leaseId === context.id;
	}
	constructor(result) {
		super(crabboxCommandError("checkpoint create", result).message);
		if (result.termination !== "exit" || result.code === null || result.code === 0 || result.killed || result.signal !== null || result.cleanup !== void 0 && result.cleanup !== "normal" || result.outputLimitExceeded || result.outputErrorStream || result.stdoutTruncatedBytes || result.stderrTruncatedBytes || result.stdout.length > 4096) return;
		try {
			const record = parseCheckpointJson(result.stdout, "create");
			if (Object.keys(record).length === 6 && record.schema === "crabbox.checkpoint.create.failure.v1" && record.outcome === "not_submitted" && record.localReservation === "removed" && typeof record.provider === "string" && typeof record.leaseId === "string" && typeof record.checkpointId === "string" && CHECKPOINT_ID_PATTERN.test(record.checkpointId)) this.notSubmitted = {
				provider: record.provider,
				leaseId: record.leaseId
			};
		} catch {}
	}
};
function parseCheckpointJson(stdout, action) {
	let parsed;
	try {
		parsed = JSON.parse(stdout);
	} catch {
		throw new Error(`Crabbox checkpoint ${action} returned invalid JSON`);
	}
	if (!isRecord(parsed)) throw new Error(`Crabbox checkpoint ${action} returned an invalid record`);
	return parsed;
}
function parseCreatedCheckpoint(stdout, leaseId) {
	const record = parseCheckpointJson(stdout, "create");
	const checkpointId = normalizeOptionalString(record.id);
	const kind = normalizeOptionalString(record.kind);
	const nativeState = isRecord(record.native) ? normalizeOptionalString(record.native.state) : void 0;
	if (!checkpointId || !CHECKPOINT_ID_PATTERN.test(checkpointId) || !kind || record.leaseId !== leaseId || !nativeState) throw new Error("Crabbox checkpoint create returned an invalid native checkpoint");
	return {
		checkpointId,
		kind,
		state: "available"
	};
}
function parseForkedCheckpoint(stdout, expected) {
	const fork = parseCheckpointJson(stdout, "fork");
	if (fork.checkpointId !== expected.checkpointId || fork.leaseId !== expected.leaseId || fork.provider !== expected.provider || fork.slug !== expected.slug || !normalizeOptionalString(fork.workdir)) throw new Error("Crabbox checkpoint fork returned an invalid lease identity");
}
function parseCheckpointAvailability(stdout) {
	const record = parseCheckpointJson(stdout, "inspect");
	if (!normalizeOptionalString(record.localState) || !normalizeOptionalString(record.nextAction)) throw new Error("Crabbox checkpoint inspect returned an invalid verification record");
	if (record.providerState === void 0 || record.providerState === "missing") return "missing";
	if (typeof record.providerState !== "string") throw new Error("Crabbox checkpoint inspect returned an invalid provider state");
	return record.providerState === "available" || record.nextAction === "fork_or_delete" || record.nextAction === "fork_restore_or_delete" ? "available" : "pending";
}
function createCheckpointCommands(runCommand) {
	const assertCurrent = (context) => {
		context.assertCurrent?.();
		context.signal?.throwIfAborted();
	};
	const checkpointCommand = async (context, action, args, timeoutMs = WARM_IMAGE_COMMAND_TIMEOUT_MS, input) => {
		assertCurrent(context);
		const result = await runCrabboxCommand({
			action: action === "scrub" ? action : `checkpoint ${action}`,
			args,
			binary: context.binary,
			runCommand,
			timeoutMs,
			...context.signal ? { signal: context.signal } : {},
			...input === void 0 ? {} : { input }
		});
		if (result.termination !== "exit" || result.code !== 0) {
			if (action === "create") throw new CrabboxCheckpointCreateError(result);
			throw crabboxCommandError(action === "scrub" ? action : `checkpoint ${action}`, result);
		}
		return result.stdout;
	};
	const deleteCheckpoint = async (context, checkpointId, remainingMs) => {
		const binaries = "binary" in context ? [context.binary] : context.binaries;
		if (binaries.length === 0) return false;
		for (const [index, binary] of binaries.entries()) {
			assertCurrent(context);
			const timeoutMs = remainingMs();
			if (timeoutMs <= 0) return false;
			const stdout = await checkpointCommand({
				...context,
				binary
			}, "delete", [
				"checkpoint",
				"delete",
				checkpointId
			], timeoutMs);
			if (index === binaries.length - 1 || !stdout.split("\n").some((line) => line.trim() === `checkpoint absent id=${checkpointId}`)) return true;
		}
		return false;
	};
	return {
		checkpointCommand,
		deleteCheckpoint
	};
}
//#endregion
//#region extensions/crabbox/src/crabbox-worker-warm-image-scrub.ts
const SCRUB_WORKER_STATE = `set -eu
worker_root="$HOME/.openclaw/cloud-workers"
node <<'CRABBOX_SCRUB_NODE_SCRIPT'
const fs = require("node:fs");
const path = require("node:path");
const os = require("node:os");
const root = path.join(os.homedir(), ".openclaw", "cloud-workers");
const runtimeRoot = path.join(os.homedir(), ".openclaw-worker", "node-runtimes") + path.sep;
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
(async () => {
  if (!fs.existsSync(root)) return;
  for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const stateDir = path.join(root, entry.name);
    const pidFile = path.join(stateDir, "node.pid");
    if (!fs.existsSync(pidFile)) continue;
    const pidText = fs.readFileSync(pidFile, "utf8").trim();
    if (!/^[1-9][0-9]*$/.test(pidText)) throw new Error("Cannot scrub a worker with an invalid node PID");
    const pid = Number(pidText);
    const owned = () => {
      let stat;
      try { stat = fs.readFileSync(path.join("/proc", pidText, "stat"), "utf8"); }
      catch (error) { if (error.code === "ENOENT") return false; throw error; }
      const fields = stat.slice(stat.lastIndexOf(")") + 2).split(" ");
      if (fields[0] === "Z") return false;
      const runtime = fs.realpathSync(path.join(stateDir, "runtime"));
      const cwd = fs.realpathSync(path.join("/proc", pidText, "cwd"));
      const env = fs.readFileSync(path.join("/proc", pidText, "environ"), "utf8").split("\\0");
      if (!runtime.startsWith(runtimeRoot) || cwd !== runtime || Number(fields[2]) !== pid || !env.includes("OPENCLAW_STATE_DIR=" + stateDir)) throw new Error("Cannot scrub a worker whose live node ownership does not match");
      return true;
    };
    if (!owned()) continue;
    process.kill(-pid, "SIGTERM");
    await delay(1000);
    if (owned()) process.kill(-pid, "SIGKILL");
    for (let attempt = 0; attempt < 50 && owned(); attempt++) await delay(20);
    if (owned()) throw new Error("Cloud worker node did not exit before image capture");
  }
})().catch((error) => { console.error(error.message); process.exitCode = 1; });
CRABBOX_SCRUB_NODE_SCRIPT
rm -rf "$worker_root"
rm -rf "$HOME/.openclaw-worker/workspaces"
# Crabbox's forwarded-env cleanup only warns on failure; native images include its workdir.
# Replace the shell for this final command so deleting its uploaded script cannot interrupt cleanup.
exec rm -rf -- .crabbox/env .crabbox/scripts
`;
//#endregion
//#region extensions/crabbox/src/crabbox-worker-warm-image-capture.ts
function createCrabboxWarmImageCapture(dependencies) {
	const { openStore, lookupLease, assertCurrent, warnOnce, collectImages, verifyImage, held, deleteImage, retireImage, checkpointCommand } = dependencies;
	return async function capture(context, prepareSource) {
		assertCurrent(context);
		const captureId = randomUUID();
		const owner = await lookupLease(context.id);
		const key = owner?.key;
		let claimed = false;
		let creating = false;
		let preparing = false;
		let captured = false;
		let captureError;
		const attemptCapture = async () => {
			try {
				await collectImages(context, "teardown");
				if (!owner || !key || !owner.runtimeIdentity || owner.demandAtMs === null || (owner.projectKey ? owner.phase !== "prepared" : owner.phase !== "enrolled")) return;
				if ((owner.os ?? "linux") !== context.profile.target || key !== resolveCrabboxWarmImageProfileKey({
					...context.profile,
					class: owner.machineClass
				}, owner.projectKey)) throw new Error("Crabbox capture profile does not match its recorded allocation.");
				let existing = await openStore().lookup(key);
				if (existing.operation) return;
				if (existing.image?.pinned && existing.previous?.pinned) {
					warnOnce("capture paused", "The current and previous snapshots are pinned; unpin one before publishing another generation.");
					return;
				}
				if (existing.image) {
					const runtimeMatches = isDeepStrictEqual(existing.image.runtimeIdentity, owner.runtimeIdentity);
					if ((!runtimeMatches || context.projectCaptureRequired || existing.image.preparationKey !== owner.preparationKey || existing.image.cacheKey !== owner.cacheKey) && (owner.choice.kind !== "checkpoint" || owner.choice.checkpointId !== existing.image.checkpointId) && !(owner.choice.kind === "cold" && sameCrabboxWarmImageGeneration(owner.publicationBase, existing.image))) return;
					const state = context.forkedCheckpointId === existing.image.checkpointId ? "available" : await verifyImage(context, existing.image.checkpointId);
					if (state === "missing" && !existing.image.pinned && !held(existing, existing.image.checkpointId)) {
						await deleteImage(context, key, existing);
						existing = await openStore().lookup(key);
						if (existing.image || existing.operation) return;
					} else if (state !== "missing" && (existing.image.pinned || Date.now() - existing.image.createdAtMs < dependencies.policy.refreshAfterMs) && runtimeMatches && existing.image.preparationKey === owner.preparationKey && existing.image.cacheKey === owner.cacheKey && !context.projectCaptureRequired && (!owner.projectKey || existing.image.baseCommit === owner.baseCommit)) return;
				}
				const now = Date.now();
				assertCurrent(context);
				claimed = await openStore().update(key, (current) => {
					assertCurrent(context);
					if (!current || JSON.stringify(current) !== JSON.stringify(existing) || current.allocations[context.id]?.phase !== owner.phase) return;
					return {
						...current,
						operation: {
							type: "capture",
							id: captureId,
							startedAtMs: now,
							leaseId: context.id,
							provider: context.provider,
							phase: "scrubbing"
						}
					};
				});
				if (!claimed) return;
				assertCurrent(context);
				preparing = true;
				await prepareSource?.();
				preparing = false;
				await checkpointCommand(context, "scrub", dependencies.runArgs(context), WARM_IMAGE_COMMAND_ROUND_TRIP_TIMEOUT_MS, SCRUB_WORKER_STATE);
				assertCurrent(context);
				creating = await openStore().update(key, (current) => {
					assertCurrent(context);
					return current?.operation?.type === "capture" && current.operation.id === captureId && current.allocations[context.id]?.phase === owner.phase && current.allocations[context.id]?.machineClass === owner.machineClass && current.allocations[context.id]?.os === owner.os && current.allocations[context.id]?.preparationKey === owner.preparationKey && current.allocations[context.id]?.cacheKey === owner.cacheKey && current.allocations[context.id]?.purpose === owner.purpose ? {
						...current,
						operation: {
							...current.operation,
							phase: "creating"
						}
					} : void 0;
				});
				if (!creating) {
					await clearCrabboxWarmImageCapture(openStore(), key, captureId);
					return;
				}
				const created = parseCreatedCheckpoint(await checkpointCommand(context, "create", [
					"checkpoint",
					"create",
					"--provider",
					context.provider,
					"--id",
					context.id,
					"--mode",
					"native",
					"--wait",
					"--wait-timeout",
					`${WARM_IMAGE_NATIVE_WAIT_TIMEOUT_MS}ms`,
					"--json",
					...context.provider === "daytona" ? ["--no-reboot=false"] : [],
					...context.provider === "machine0" ? ["--strategy", "image"] : []
				], resolveCrabboxCheckpointCaptureTimeoutMs(context.provider)), context.id);
				captured = true;
				if (!await openStore().update(key, (current) => {
					if (current?.operation?.type !== "capture" || current.operation.id !== captureId) return;
					const next = withoutCrabboxWarmImageOperation(current);
					const predecessor = current.image;
					let retiredCheckpointId;
					if (predecessor && predecessor.checkpointId !== created.checkpointId) {
						if (current.previous?.pinned) retiredCheckpointId = predecessor.checkpointId;
						else if (predecessor.pinned || dependencies.policy.keepPrevious === 1) {
							next.previous = predecessor;
							retiredCheckpointId = current.previous?.checkpointId;
						} else retiredCheckpointId = predecessor.checkpointId;
					}
					const allocation = current.allocations[context.id];
					if (allocation && allocation.phase === owner.phase && allocation.machineClass === owner.machineClass && allocation.os === owner.os && allocation.preparationKey === owner.preparationKey && allocation.cacheKey === owner.cacheKey && allocation.purpose === owner.purpose && allocation.demandAtMs === owner.demandAtMs) next.allocations = {
						...next.allocations,
						[context.id]: {
							...allocation,
							imageGeneration: {
								checkpointId: created.checkpointId,
								createdAtMs: now
							}
						}
					};
					return {
						...next,
						image: {
							...created,
							createdAtMs: now,
							preparationKey: owner.preparationKey,
							cacheKey: owner.cacheKey,
							purpose: owner.purpose,
							lastDemandAtMs: owner.purpose === "session" ? null : owner.demandAtMs,
							runtimeIdentity: structuredClone(owner.runtimeIdentity),
							...owner.baseCommit ? { baseCommit: owner.baseCommit } : {}
						},
						...retiredCheckpointId ? { operation: {
							type: "retire",
							checkpointId: retiredCheckpointId
						} } : {}
					};
				})) {
					warnOnce("capture ownership changed", `Checkpoint ${created.checkpointId} returned after recovery of ${captureId}; reconcile it in the Crabbox catalog before resuming captures.`);
					return;
				}
				creating = false;
				claimed = false;
				const replacement = await openStore().lookup(key);
				if (replacement) await retireImage(context, key, replacement);
			} catch (error) {
				captureError = coerceErrorMessage(error);
				const notSubmitted = creating && CrabboxCheckpointCreateError.wasNotSubmitted(error, context);
				let recoveryRequired = creating;
				if (claimed && key) try {
					if (creating && !notSubmitted) await openStore().update(key, (current) => current?.operation?.type === "capture" && current.operation.id === captureId ? {
						...current,
						operation: {
							...current.operation,
							phase: "uncertain"
						}
					} : void 0);
					else {
						await clearCrabboxWarmImageCapture(openStore(), key, captureId);
						recoveryRequired = false;
					}
				} catch {}
				if (preparing || notSubmitted && owner?.projectKey) throw error;
				warnOnce("capture", recoveryRequired ? `${captureError}. ${crabboxWarmImageRecoveryHint(captureId)}` : error);
			}
		};
		await attemptCapture();
		const operation = key && owner?.projectKey ? (await openStore().lookup(key))?.operation : void 0;
		if (operation?.type === "capture" && operation.leaseId === context.id) throw new Error(`${captureError ? `${captureError}. ` : ""}Crabbox project image capture is unresolved. ${crabboxWarmImageRecoveryHint(operation.id)}`);
		assertCurrent(context);
		return captured;
	};
}
//#endregion
//#region extensions/crabbox/src/crabbox-worker-warm-image-policy.ts
function duration(value, key, fallback, minimumMs) {
	const raw = value === void 0 ? fallback : value;
	if (typeof raw !== "string" || !/^[1-9][0-9]{0,7}[mhd](?![\s\S])/u.test(raw)) throw new Error(`Crabbox warmImages.${key} must use 1–8 whole digits followed by m, h, or d.`);
	const unitMs = raw.endsWith("d") ? 864e5 : raw.endsWith("h") ? 36e5 : 6e4;
	const milliseconds = Number(raw.slice(0, -1)) * unitMs;
	if (milliseconds < minimumMs) throw new Error(`Crabbox warmImages.${key} must be at least ${minimumMs / 36e5}h.`);
	return milliseconds;
}
function resolveCrabboxWarmImagePolicy(pluginConfig) {
	const raw = pluginConfig?.warmImages;
	if (raw !== void 0 && !isRecord(raw)) throw new Error("Crabbox warmImages must be an object.");
	const config = raw ?? {};
	const keepPrevious = config.keepPrevious === void 0 ? 0 : config.keepPrevious;
	if (keepPrevious !== 0 && keepPrevious !== 1) throw new Error("Crabbox warmImages.keepPrevious must be 0 or 1.");
	return {
		refreshAfterMs: duration(config.refreshAfter, "refreshAfter", "24h", 36e5),
		retainUnusedMs: duration(config.retainUnused, "retainUnused", "14d", 864e5),
		keepPrevious
	};
}
//#endregion
//#region extensions/crabbox/src/crabbox-worker-warm-image.ts
function createCrabboxWarmImageManager(dependencies) {
	const policy = dependencies.policy ?? resolveCrabboxWarmImagePolicy();
	let store;
	const warned = /* @__PURE__ */ new Set();
	const openStore = () => store ??= openCrabboxWarmImageStore(dependencies.state);
	const assertCurrent = (context) => {
		context.assertCurrent?.();
		context.signal?.throwIfAborted();
	};
	const warnOnce = (action, error, failed = true) => {
		const message = `Crabbox warm image ${action}${failed ? " failed" : ""}: ${coerceErrorMessage(error)}`;
		if (!warned.has(message)) {
			if (warned.size >= 128) warned.clear();
			warned.add(message);
			dependencies.warn(message);
		}
	};
	const { checkpointCommand, deleteCheckpoint } = createCheckpointCommands(dependencies.runCommand);
	const imageExpired = (image) => !image.pinned && (image.lastDemandAtMs === null || Date.now() - image.lastDemandAtMs >= policy.retainUnusedMs);
	const retiringCurrent = (record) => record.operation?.type === "retire" && record.operation.checkpointId === record.image?.checkpointId;
	const deleteEmptyProfile = (key) => openStore().deleteIf(key, (record) => !record.image && !record.previous && !record.operation && Object.keys(record.allocations).length === 0);
	const lookupLease = (id) => openStore().lookupLease(id);
	const retireImage = async (context, key, record, remainingMs = () => WARM_IMAGE_COMMAND_TIMEOUT_MS) => {
		const operation = record.operation;
		const pinned = (current) => [current.image, current.previous].some((image) => operation?.type === "retire" && image?.checkpointId === operation.checkpointId && image.pinned);
		if (operation?.type !== "retire" || isCrabboxWarmImageHeld(record, operation.checkpointId) || pinned(record)) return;
		const matches = (current) => current?.operation?.type === "retire" && current.operation.checkpointId === operation.checkpointId && sameCrabboxWarmImageGeneration(current.image, record.image) && sameCrabboxWarmImageGeneration(current.previous, record.previous) && !pinned(current) && !isCrabboxWarmImageHeld(current, operation.checkpointId);
		if (!matches(await openStore().lookup(key))) return;
		try {
			if (!await deleteCheckpoint(context, operation.checkpointId, remainingMs)) return;
		} catch (error) {
			assertCurrent(context);
			if (matches(await openStore().lookup(key))) warnOnce(`checkpoint retirement (${operation.checkpointId} deletion obligation retained; retry during periodic maintenance or next warm-image-enabled worker teardown; inspect with openclaw crabbox warm-images)`, error);
			return;
		}
		await openStore().update(key, (current) => {
			assertCurrent(context);
			if (!current || !matches(current)) return;
			const next = withoutCrabboxWarmImageOperation(current);
			if (next.image?.checkpointId === operation.checkpointId) delete next.image;
			if (next.previous?.checkpointId === operation.checkpointId) delete next.previous;
			return next;
		});
		await deleteEmptyProfile(key);
	};
	const deleteImage = async (context, key, record, remainingMs = () => WARM_IMAGE_COMMAND_TIMEOUT_MS, checkpointId = record.image?.checkpointId) => {
		const image = [record.image, record.previous].find((candidate) => candidate?.checkpointId === checkpointId);
		if (!image || !checkpointId || image.pinned || record.operation || isCrabboxWarmImageHeld(record, checkpointId)) return;
		assertCurrent(context);
		const retiring = {
			...record,
			operation: {
				type: "retire",
				checkpointId
			}
		};
		if (await openStore().update(key, (current) => {
			assertCurrent(context);
			return JSON.stringify(current) === JSON.stringify(record) ? retiring : void 0;
		})) await retireImage(context, key, retiring, remainingMs);
	};
	const collectImages = async (context, phase) => {
		const deadline = Date.now() + WARM_IMAGE_COMMAND_TIMEOUT_MS;
		for (const { key, value } of await openStore().entries()) {
			assertCurrent(context);
			const capture = crabboxWarmImageCaptureStatus(key, value);
			if (capture) {
				if (isCrabboxWarmImageCaptureUncertain(capture)) warnOnce("capture paused", crabboxWarmImageRecoveryHint(capture.selector));
				else if (capture.stale) warnOnce(`capture ${capture.selector} still pending`, CRABBOX_WARM_IMAGE_WAIT_HINT, false);
				continue;
			}
			if (value.operation && phase === "allocation") continue;
			const remaining = () => deadline - Date.now();
			if (remaining() <= 0) break;
			await retireImage(context, key, value, remaining);
			let current = await openStore().lookup(key);
			if (current?.previous && !current.operation && !current.previous.pinned && (policy.keepPrevious === 0 || imageExpired(current.previous)) && remaining() > 0) {
				await deleteImage(context, key, current, remaining, current.previous.checkpointId);
				current = await openStore().lookup(key);
			}
			if (current?.image && sameCrabboxWarmImageGeneration(current.image, value.image) && !current.operation && imageExpired(current.image) && remaining() > 0) await deleteImage(context, key, current, remaining);
		}
	};
	const makeRoom = async (context) => {
		const deadline = Date.now() + WARM_IMAGE_COMMAND_TIMEOUT_MS;
		const entries = await openStore().entries();
		if (entries.length < 128) return;
		const candidates = entries.filter(({ value }) => !value.operation && Object.keys(value.allocations).length === 0).toSorted((a, b) => (a.value.image?.lastDemandAtMs ?? 0) - (b.value.image?.lastDemandAtMs ?? 0));
		for (const generation of ["previous", "image"]) for (const { key } of candidates) {
			if (await openStore().count() < 128) return;
			const remaining = () => deadline - Date.now();
			if (remaining() <= 0) break;
			const current = await openStore().lookup(key);
			const image = current?.[generation];
			if (current && image && (generation === "previous" || !current.previous)) await deleteImage(context, key, current, remaining, image.checkpointId);
			else if (generation === "image") await deleteEmptyProfile(key);
		}
		if (await openStore().count() >= 128) throw new Error("Crabbox warm-image profile capacity is full; stop outstanding workers or resolve cleanup with openclaw crabbox warm-images before retrying.");
	};
	const verifyImage = async (context, checkpointId) => {
		return parseCheckpointAvailability(await checkpointCommand(context, "inspect", [
			"checkpoint",
			"inspect",
			checkpointId,
			"--verify",
			"--json"
		]));
	};
	const selectAllocation = async (context, profile) => {
		if (!context.nodeRuntimeIdentity) throw new Error("Crabbox warm-image allocation requires a prepared node runtime identity");
		const preparationKey = context.preparation?.key ?? null;
		const cacheKey = context.preparation?.cacheKey ?? null;
		const purpose = context.preparation?.purpose ?? null;
		if (context.preparation && (!context.projectKey || profile.target !== "linux" || !/^[a-f0-9]{64}$/u.test(context.preparation.key) || !/^[a-f0-9]{64}$/u.test(context.preparation.cacheKey) || purpose !== "session" && purpose !== "reserve" || !Number.isSafeInteger(context.preparation.demandAtMs) || context.preparation.demandAtMs < 0)) throw new Error("Crabbox project preparation identity is invalid.");
		const key = resolveCrabboxWarmImageProfileKey(profile, context.projectKey);
		const displayFacts = {
			profileId: context.profileId,
			backend: profile.provider,
			machineClass: profile.class,
			os: profile.target,
			projectLabel: context.projectLabel,
			projectRoot: context.projectRoot
		};
		const replay = await lookupLease(context.id);
		if (replay) {
			if (replay.key !== key || replay.machineClass !== profile.class || (replay.os ?? "linux") !== profile.target || replay.preparationKey !== preparationKey || replay.cacheKey !== cacheKey || replay.purpose !== purpose || context.preparation && replay.demandAtMs !== context.preparation.demandAtMs) throw new Error("Crabbox provision retry changed its recorded profile or project identity.");
			if (!isDeepStrictEqual(replay.runtimeIdentity, context.nodeRuntimeIdentity)) throw new Error("Crabbox provision retry changed or lacks its recorded node runtime identity; stop the worker before reprovisioning");
			assertCurrent(context);
			if (!await openStore().update(key, (record) => {
				assertCurrent(context);
				const allocation = record?.allocations[context.id];
				return record && allocation && isDeepStrictEqual({
					key,
					projectKey: record.projectKey,
					...allocation
				}, replay) ? withCrabboxWarmImageDisplayFacts(record, displayFacts) : void 0;
			})) throw new Error("Crabbox allocation changed before provisioning completed; retry the worker operation.");
			return replay;
		}
		await collectImages(context, "allocation");
		const observed = await openStore().lookup(key);
		let available = Boolean(observed?.image && observed.image.lastDemandAtMs !== null && (cacheKey !== null ? observed.image.cacheKey === cacheKey : observed.image.preparationKey === null && observed.image.cacheKey === null) && !retiringCurrent(observed));
		if (available && observed?.image?.state === "pending") try {
			const state = await verifyImage(context, observed.image.checkpointId);
			available = state === "available";
			if (state === "missing") await deleteImage(context, key, observed);
		} catch (error) {
			assertCurrent(context);
			available = false;
			warnOnce("verification", error);
		}
		if (!await openStore().lookup(key)) await makeRoom(context);
		assertCurrent(context);
		return openStore().recordAllocation({
			key,
			id: context.id,
			projectKey: context.projectKey,
			displayFacts,
			assertCurrent: () => assertCurrent(context),
			availableImage: available ? observed?.image : void 0,
			allocation: {
				machineClass: profile.class,
				os: profile.target,
				phase: "pending",
				runtimeIdentity: structuredClone(context.nodeRuntimeIdentity),
				preparationKey,
				cacheKey,
				purpose,
				demandAtMs: context.preparation?.demandAtMs ?? Date.now()
			}
		});
	};
	const checkpointEntry = async (checkpointId) => {
		const entry = (await openStore().entries()).find(({ value }) => value.image?.checkpointId === checkpointId || value.previous?.checkpointId === checkpointId || value.operation?.type === "retire" && value.operation.checkpointId === checkpointId);
		if (!entry) throw new CrabboxWarmImageRequestError("Unknown snapshot checkpoint.");
		return entry;
	};
	const updateCheckpoint = async (checkpointId, change, assertOwnerCurrent) => {
		const { key } = await checkpointEntry(checkpointId);
		let rejection;
		let accepted;
		if (!await openStore().update(key, (record) => {
			assertOwnerCurrent?.();
			rejection = void 0;
			accepted = void 0;
			if (!record) {
				rejection = "Snapshot changed; refresh the list and retry.";
				return;
			}
			const next = change(record);
			if (typeof next === "string") {
				rejection = next;
				return;
			}
			accepted = next;
			return next;
		}) || !accepted || rejection) throw new CrabboxWarmImageRequestError(rejection ?? "Snapshot changed; refresh and retry.");
		return projectCrabboxWarmImage(key, accepted);
	};
	return {
		pin(checkpointId, pinned, assertOwnerCurrent) {
			return updateCheckpoint(checkpointId, (record) => {
				if (record.operation) return "Wait for the profile's capture or retirement to finish before changing a pin.";
				const field = record.image?.checkpointId === checkpointId ? "image" : "previous";
				const image = record[field];
				if (image?.checkpointId !== checkpointId) return "Unknown snapshot checkpoint.";
				const updated = { ...image };
				if (pinned) updated.pinned ??= { atMs: Date.now() };
				else delete updated.pinned;
				return {
					...record,
					[field]: updated
				};
			}, assertOwnerCurrent);
		},
		rollback(checkpointId, assertOwnerCurrent) {
			return updateCheckpoint(checkpointId, (record) => {
				if (record.operation) return "Wait for the profile's capture or retirement to finish before rolling back.";
				if (record.previous?.checkpointId !== checkpointId) return "Rollback requires a previous snapshot checkpoint.";
				const next = {
					...record,
					image: record.previous
				};
				delete next.previous;
				if (record.image) {
					if (policy.keepPrevious === 1 || record.image.pinned) next.previous = record.image;
					else next.operation = {
						type: "retire",
						checkpointId: record.image.checkpointId
					};
				}
				return next;
			}, assertOwnerCurrent);
		},
		async delete(context, checkpointId) {
			assertCurrent(context);
			const { key, value } = await checkpointEntry(checkpointId);
			if (value.operation?.type === "capture") throw new CrabboxWarmImageRequestError("A snapshot cannot be deleted while its profile is capturing.");
			if (isCrabboxWarmImageHeld(value, checkpointId)) throw new CrabboxWarmImageRequestError("Stop outstanding allocations before deleting this snapshot.");
			if ([value.image, value.previous].some((image) => image?.checkpointId === checkpointId && image.pinned)) throw new CrabboxWarmImageRequestError("Unpin this snapshot before deleting it.");
			if (value.operation) {
				if (value.operation.checkpointId !== checkpointId) throw new CrabboxWarmImageRequestError("Wait for the profile's current retirement to finish.");
				await retireImage(context, key, value);
			} else await deleteImage(context, key, value, void 0, checkpointId);
			assertCurrent(context);
			const current = await openStore().lookup(key);
			if (current?.operation?.type === "retire" && current.operation.checkpointId === checkpointId) return { status: "retiring" };
			if (current?.image?.checkpointId === checkpointId || current?.previous?.checkpointId === checkpointId) throw new CrabboxWarmImageRequestError("Snapshot changed; refresh the list and retry deletion.");
			return { status: "deleted" };
		},
		maintain: async (context) => {
			assertCurrent(context);
			await assertCrabboxWarmImageMigrationReady(dependencies.state);
			await collectImages({
				...context,
				binaries: [...new Set(context.binaries)].toSorted()
			}, "teardown");
		},
		lookupLease,
		markPrepared: (id, baseCommit, assertOwnerCurrent) => openStore().markPrepared(id, baseCommit, assertOwnerCurrent),
		markEnrolled: (id, assertOwnerCurrent) => openStore().markEnrolled(id, assertOwnerCurrent),
		notePreparedDemand: (id, preparation) => openStore().notePreparedDemand(id, preparation),
		async release(context) {
			const owner = await lookupLease(context.id);
			if (!owner) return;
			await openStore().update(owner.key, (record) => {
				if (!record?.allocations[context.id]) return;
				const allocations = { ...record.allocations };
				delete allocations[context.id];
				return {
					...record,
					allocations
				};
			});
			const deadline = Date.now() + WARM_IMAGE_COMMAND_TIMEOUT_MS;
			const remaining = () => deadline - Date.now();
			const current = await openStore().lookup(owner.key);
			if (current) await retireImage(context, owner.key, current, remaining);
			const released = await openStore().lookup(owner.key);
			if (released?.image?.lastDemandAtMs === null) await deleteImage(context, owner.key, released, remaining);
			await deleteEmptyProfile(owner.key);
		},
		capture: createCrabboxWarmImageCapture({
			policy,
			openStore,
			lookupLease,
			assertCurrent,
			warnOnce,
			collectImages,
			verifyImage,
			held: isCrabboxWarmImageHeld,
			deleteImage,
			retireImage,
			checkpointCommand,
			runArgs: dependencies.runArgs
		}),
		async allocate(context) {
			assertCurrent(context);
			if (!context.profile.warmImage) {
				const replay = await lookupLease(context.id);
				if (replay && ((replay.os ?? "linux") !== context.profile.target || replay.machineClass !== context.profile.class)) throw new Error("Crabbox provision retry changed its recorded operating system or machine class.");
			}
			if (context.profile.warmImage) {
				await assertCrabboxWarmImageMigrationReady(dependencies.state);
				const owner = await selectAllocation(context, context.profile);
				if (owner.choice.kind === "checkpoint") {
					const checkpointId = owner.choice.checkpointId;
					parseForkedCheckpoint(await checkpointCommand(context, "fork", [
						"checkpoint",
						"fork",
						checkpointId,
						...buildCrabboxAllocationArgs(context.profile, context.id, context.slug),
						"--json"
					], context.timeoutMs()), {
						checkpointId,
						leaseId: context.id,
						provider: context.provider,
						slug: context.slug
					});
					await openStore().update(owner.key, (current) => {
						assertCurrent(context);
						return withCrabboxWarmImageGeneration(current, owner.imageGeneration, (image) => ({
							...image,
							state: "available",
							lastDemandAtMs: owner.purpose === "session" || owner.demandAtMs === null ? image.lastDemandAtMs : Math.max(image.lastDemandAtMs ?? 0, owner.demandAtMs)
						}));
					});
					return owner.choice;
				}
			}
			assertCurrent(context);
			await runProvisionWarmup({
				...context,
				runCommand: dependencies.runCommand
			});
			return { kind: "cold" };
		}
	};
}
//#endregion
//#region extensions/crabbox/src/crabbox-worker-provider.ts
const CRABBOX_PROJECT_PREPARATION_TIMEOUT_MS = 4 * CRABBOX_SETUP_TIMEOUT_MS + CRABBOX_NODE_ENROLLMENT_TIMEOUT_MS;
function createCrabboxWorkerProvider(dependencies) {
	const wallpaperBase64 = loadCrabboxWorkerWallpaperBase64(dependencies.wallpaperPath);
	const runCommand = dependencies.runCommand ?? runCommandWithTimeout;
	const warn = dependencies.warn ?? (() => {});
	const sleep = dependencies.sleep ?? ((milliseconds, signal) => setTimeout$1(milliseconds, void 0, { signal }));
	const openclawRoot = dependencies.openclawRoot ?? process.cwd();
	const heartbeats = createCrabboxHeartbeatManager({
		run: (context, signal) => runCrabboxCommand({
			action: "heartbeat",
			args: [
				"heartbeat",
				"--provider",
				context.provider,
				"--id",
				context.id,
				"--idle-timeout",
				context.idleTimeout,
				"--json"
			],
			binary: context.binary,
			runCommand,
			signal,
			timeoutMs: context.heartbeatTimeoutMs
		}),
		warn
	});
	const binaries = /* @__PURE__ */ new Map();
	let defaultCandidate;
	const resolveBinary = async (explicit, signal) => {
		signal?.throwIfAborted();
		const candidate = explicit ?? (defaultCandidate ??= resolveCrabboxBinary({
			isExecutable: dependencies.isExecutable,
			openclawRoot,
			pathEnv: dependencies.pathEnv ?? process.env.PATH,
			platform: dependencies.platform
		}));
		const existing = binaries.get(candidate);
		if (existing) return existing;
		const { binary } = await ensureManagedCrabboxBinary({
			binary: candidate,
			runCommand,
			signal
		});
		binaries.set(candidate, binary);
		return binary;
	};
	const machineOptions = createCrabboxMachineOptionsResolver({
		resolveBinary,
		runCommand,
		warn
	});
	const warmImages = createCrabboxWarmImageManager({
		state: dependencies.state,
		runCommand,
		runArgs: leaseRunArgs,
		warn,
		policy: dependencies.warmImagePolicy
	});
	const maintenanceAbort = new AbortController();
	let maintenanceInFlight;
	const resolveMaintenanceBinaries = (profiles, signal) => resolveCrabboxCheckpointBinaries({
		profiles,
		signal,
		resolveBinary,
		warn
	});
	const snapshots = createCrabboxSnapshotActions({
		manager: warmImages,
		signal: maintenanceAbort.signal,
		resolveBinaries: resolveMaintenanceBinaries
	});
	const stopLease = async (context) => {
		await heartbeats.stop(context.id);
		await stopCrabboxLease({
			...context,
			runCommand
		});
		await warmImages.release(context);
	};
	const resolveLeaseContext = async (lease) => {
		const profile = parseCrabboxProfile(lease.profile);
		assertCrabboxLeaseId(lease.leaseId);
		return {
			context: {
				binary: await resolveBinary(profile.binary),
				heartbeatIntervalMs: profile.heartbeatIntervalMs,
				heartbeatTimeoutMs: profile.heartbeatTimeoutMs,
				id: lease.leaseId,
				idleTimeout: profile.idleTimeout,
				provider: profile.provider
			},
			profile
		};
	};
	const resolveAllocation = async (_profile, operationId) => ({
		leaseId: operationLeaseId(operationId),
		sharedHost: false
	});
	const prepareProvision = async (profile, operationId, options) => {
		const { signal, assertCurrent } = createCrabboxProvisionAuthority(options);
		const executionMode = options?.executionMode;
		if (executionMode !== void 0 && executionMode !== "worker-turn" && executionMode !== "remote-exec") throw new WorkerProviderError("Crabbox execution mode is unsupported");
		const { profile: parsed, forwardedEnv } = resolveCrabboxProvisionProfile(profile, options?.machineClass, options?.os);
		const nodeRuntimeIdentity = options?.nodeRuntimeIdentity;
		if (parsed.warmImage && !nodeRuntimeIdentity) throw new WorkerProviderError("Crabbox warm images require a prepared node runtime identity");
		const warmupTimeoutMs = parsed.desktop ? CRABBOX_DESKTOP_WARMUP_TIMEOUT_MS : CRABBOX_WARMUP_TIMEOUT_MS;
		const project = parsed.warmImage ? options?.project : void 0;
		if (options?.project?.preparation && (!project || parsed.setupEnv?.length)) throw new WorkerProviderError("Crabbox prepared workers require warm images and immutable setup inputs without setupEnv");
		const preparationSignal = signal && project ? AbortSignal.any([signal, project.signal]) : signal ?? project?.signal;
		const allocation = await resolveAllocation(profile, operationId);
		signal?.throwIfAborted();
		const binary = await resolveBinary(parsed.binary, preparationSignal);
		preparationSignal?.throwIfAborted();
		const deadline = Date.now() + resolveCrabboxProvisionBaseTimeoutMs(parsed);
		const setupDeadline = deadline + countCrabboxProvisionSetupPhases(parsed) * CRABBOX_SETUP_TIMEOUT_MS + CRABBOX_NODE_ENROLLMENT_TIMEOUT_MS + (project ? CRABBOX_PROJECT_PREPARATION_TIMEOUT_MS + resolveCrabboxWarmImageCaptureTimeoutMs(parsed.provider) : 0);
		const context = {
			binary,
			provider: parsed.provider
		};
		const leaseId = allocation.leaseId;
		if (parsed.desktop && parsed.provider === "hetzner") await assertHetznerDesktopHasManagedCoordinator({
			binary,
			runCommand,
			signal
		});
		if (parsed.provider === "aws") await assertAwsWorkerHasNoInstanceProfile({
			binary,
			runCommand,
			signal
		});
		return async () => {
			assertCurrent();
			const priorAllocation = project?.preparation && await warmImages.lookupLease(leaseId);
			const preparedReplay = priorAllocation && priorAllocation.phase !== "enrolled";
			const allocationChoice = await warmImages.allocate({
				...context,
				id: leaseId,
				profile: parsed,
				profileId: options?.profileId,
				nodeRuntimeIdentity,
				...project ? {
					projectKey: project.key,
					projectLabel: project.label,
					projectRoot: project.root
				} : {},
				...project?.preparation ? { preparation: project.preparation } : {},
				assertCurrent,
				signal: preparationSignal,
				slug: operationSlug(operationId),
				timeoutMs: () => remainingProvisionTimeout(deadline, warmupTimeoutMs)
			});
			let inspected;
			try {
				inspected = await inspectWithContext({
					context,
					expectedLeaseId: leaseId,
					id: leaseId,
					runCommand,
					timeoutMs: remainingProvisionTimeout(deadline, resolveCrabboxLifecycleTimeoutMs(parsed.provider)),
					waitForReady: parsed.provider === "machine0",
					signal: preparationSignal
				});
				signal?.throwIfAborted();
			} catch (error) {
				signal?.throwIfAborted();
				if (error instanceof WorkerProviderError) return await failProvisionAfterCleanup({
					...context,
					id: leaseId,
					stopLease
				}, error);
				throw error;
			}
			if (inspected.status === "unknown") throw new Error("Crabbox warmup lease was not found during inspection");
			const inspectedParams = {
				...context,
				deadline,
				inspect: inspected.inspect,
				profile: parsed,
				runCommand,
				stopLease,
				signal: preparationSignal
			};
			if (isNonRunnableState(inspected.inspect.state)) return await failProvisionAfterCleanup({
				...inspectedParams,
				id: leaseId
			}, new WorkerProviderError(`Crabbox warmup lease entered a terminal state${inspected.inspect.failureError ? `: ${inspected.inspect.failureError}` : ""}`));
			inspectedParams.inspect = await waitForProvisionReady({
				...inspectedParams,
				sleep
			});
			inspectedParams.deadline = setupDeadline;
			if (parsed.setup && !(project?.preparation && allocationChoice.kind === "checkpoint")) inspectedParams.inspect = await runProvisionSetupAndWaitReady({
				...inspectedParams,
				phase: "profile setup",
				setup: parsed.setup,
				forwardedEnv,
				sleep
			});
			const desktop = await prepareProvisionDesktop({
				...inspectedParams,
				wallpaperBase64,
				prepareBeforeEnrollment: Boolean(project)
			});
			if (project?.preparation && (await warmImages.lookupLease(leaseId))?.phase === "enrolled") try {
				await prepareCrabboxProjectFiles({
					...context,
					id: leaseId,
					project,
					inspectPrepared: true,
					runArgs: leaseRunArgs({
						...context,
						id: leaseId
					}),
					runCommand,
					signal: preparationSignal,
					timeoutMs: () => remainingProvisionTimeout(setupDeadline, CRABBOX_SETUP_TIMEOUT_MS)
				});
			} catch (error) {
				preparationSignal?.throwIfAborted();
				return await failProvisionAfterCleanup({
					...context,
					id: leaseId,
					stopLease
				}, error);
			}
			if (project && (await warmImages.lookupLease(leaseId))?.phase !== "enrolled") {
				let preparationFailed = false;
				let captured;
				try {
					const preparedProject = await prepareCrabboxProjectFiles({
						...context,
						id: leaseId,
						project,
						runArgs: leaseRunArgs({
							...context,
							id: leaseId
						}),
						runCommand,
						signal: preparationSignal,
						timeoutMs: () => remainingProvisionTimeout(setupDeadline, CRABBOX_SETUP_TIMEOUT_MS)
					});
					assertCurrent();
					await warmImages.markPrepared(leaseId, project.baseCommit, () => {
						preparationSignal?.throwIfAborted();
						assertCurrent();
					});
					captured = await warmImages.capture({
						...context,
						id: leaseId,
						profile: parsed,
						signal: preparationSignal,
						assertCurrent,
						projectCaptureRequired: preparedProject?.captureRequired || preparedReplay ? true : void 0,
						...allocationChoice.kind === "checkpoint" ? { forkedCheckpointId: allocationChoice.checkpointId } : {}
					}, async () => {
						if (!options?.prepareNodeRuntime) throw new Error("Crabbox project snapshots require node runtime preparation");
						const runtime = await options.prepareNodeRuntime();
						signal?.throwIfAborted();
						assertCurrent();
						const setup = createCrabboxNodeRuntimeSetup({
							nodeBootstrap: runtime.nodeBootstrap,
							workerBundle: runtime.workerBundle,
							leaseId
						});
						try {
							await runProvisionSetup({
								...inspectedParams,
								phase: "node runtime preparation",
								setup: setup.command,
								forwardedEnv: setup.forwardedEnv,
								timeoutMs: CRABBOX_NODE_ENROLLMENT_TIMEOUT_MS,
								signal: runtime.signal && preparationSignal ? AbortSignal.any([preparationSignal, runtime.signal]) : preparationSignal ?? runtime.signal
							});
						} catch (error) {
							preparationFailed = true;
							throw error;
						}
					});
				} catch (error) {
					signal?.throwIfAborted();
					assertCurrent();
					if (preparationFailed) throw error;
					return await failProvisionAfterCleanup({
						...context,
						id: leaseId,
						stopLease
					}, error);
				}
				if (captured) inspectedParams.inspect = await waitForProvisionReady({
					...inspectedParams,
					refresh: true,
					sleep
				});
			}
			signal?.throwIfAborted();
			const beginNodeEnrollment = options?.beginNodeEnrollment;
			if (!beginNodeEnrollment) return await failProvisionAfterCleanup({
				...inspectedParams,
				id: leaseId
			}, /* @__PURE__ */ new Error("Crabbox worker node enrollment is unavailable"));
			let enrollment;
			try {
				enrollment = await beginNodeEnrollment();
				signal?.throwIfAborted();
			} catch (error) {
				signal?.throwIfAborted();
				if (error instanceof Error && error.name === "AbortError") throw error;
				return await failProvisionAfterCleanup({
					...inspectedParams,
					id: leaseId
				}, error);
			}
			const nodeEnrollmentSetup = createCrabboxNodeEnrollmentSetup({
				enrollment,
				desktop: parsed.desktop,
				desktopSetup: project ? void 0 : desktop?.setup,
				target: parsed.target,
				leaseId
			});
			const enrollmentSignal = preparationSignal && enrollment.signal ? AbortSignal.any([preparationSignal, enrollment.signal]) : preparationSignal ?? enrollment.signal;
			await runProvisionSetup({
				...inspectedParams,
				phase: "node enrollment setup",
				signal: enrollmentSignal,
				setup: nodeEnrollmentSetup.command,
				timeoutMs: CRABBOX_NODE_ENROLLMENT_TIMEOUT_MS + (desktop && !project ? CRABBOX_SETUP_TIMEOUT_MS : 0),
				...nodeEnrollmentSetup.forwardedEnv ? { forwardedEnv: nodeEnrollmentSetup.forwardedEnv } : {}
			});
			let deviceId;
			try {
				deviceId = await enrollment.waitForDeviceId();
				signal?.throwIfAborted();
			} catch (error) {
				signal?.throwIfAborted();
				if (enrollment.signal?.aborted) throw error;
				const leaseContext = {
					...inspectedParams,
					id: leaseId
				};
				const evidence = await collectCrabboxNodeEnrollmentEvidence({
					...leaseContext,
					target: parsed.target,
					args: leaseRunArgs(leaseContext),
					...enrollmentSignal ? { signal: enrollmentSignal } : {}
				});
				signal?.throwIfAborted();
				enrollment.signal?.throwIfAborted();
				const message = error instanceof Error ? error.message : "Worker node enrollment failed";
				return await failProvisionAfterCleanup(leaseContext, new Error(`${message}; ${evidence}`, { cause: error }));
			}
			if (parsed.warmImage) {
				await warmImages.markEnrolled(leaseId, () => {
					signal?.throwIfAborted();
					enrollment.signal?.throwIfAborted();
				});
				signal?.throwIfAborted();
				enrollment.signal?.throwIfAborted();
			}
			heartbeats.start({
				binary,
				heartbeatIntervalMs: parsed.heartbeatIntervalMs,
				heartbeatTimeoutMs: parsed.heartbeatTimeoutMs,
				id: leaseId,
				idleTimeout: parsed.idleTimeout,
				provider: parsed.provider
			});
			return {
				...allocation,
				node: { deviceId },
				...desktop ? { desktop: desktop.endpoint } : {}
			};
		};
	};
	return {
		id: CRABBOX_WORKER_PROVIDER_ID,
		resolveDisplayId: (profile) => parseCrabboxProfile(profile).provider,
		allowsDesktopResize: true,
		async dispose() {
			maintenanceAbort.abort();
			await Promise.all([
				heartbeats.dispose(),
				maintenanceInFlight?.catch(() => {}),
				snapshots.settle()
			]);
		},
		images: snapshots.images,
		maintain(context) {
			context.assertCurrent();
			maintenanceAbort.signal.throwIfAborted();
			return maintenanceInFlight ??= Promise.resolve().then(async () => {
				const signal = AbortSignal.any([context.signal, maintenanceAbort.signal]);
				const assertCurrent = () => {
					signal.throwIfAborted();
					context.assertCurrent();
				};
				assertCurrent();
				const resolvedBinaries = await resolveMaintenanceBinaries(context.profiles, signal);
				assertCurrent();
				await warmImages.maintain({
					binaries: resolvedBinaries,
					signal,
					assertCurrent
				});
			}).finally(() => {
				maintenanceInFlight = void 0;
			});
		},
		...machineOptions,
		supportedExecutionModes: ["worker-turn", "remote-exec"],
		provisionBeforeInstallation: true,
		requiresNodeEnrollment: true,
		supportsProjectPreparation(profile, machineClass, os) {
			const parsed = parseCrabboxProfile(profile);
			return resolveCrabboxWarmImageProfile(parsed, machineClass ?? parsed.class, os === void 0 ? parsed.target : parseCrabboxOperatingSystem(os)).warmImage;
		},
		resolvePreparedIdleTimeoutMs(profile) {
			const parsed = parseCrabboxProfile(profile);
			return parsed.warmImage === false || parsed.target !== "linux" || parsed.setupEnv?.length ? void 0 : parsed.idleTimeoutMs;
		},
		resolvePreparationTarget(profile, machineClass, os) {
			const parsed = parseCrabboxProfile(profile);
			const effective = resolveCrabboxWarmImageProfile(parsed, machineClass ?? parsed.class, os === void 0 ? parsed.target : parseCrabboxOperatingSystem(os));
			return effective.warmImage && effective.class && !effective.setupEnv?.length ? {
				machineClass: effective.class,
				platform: effective.target
			} : void 0;
		},
		notePreparedDemand: async (lease, preparation) => await warmImages.notePreparedDemand(lease.leaseId, preparation),
		resolveAllocation,
		resolveProvisionTimeoutMs(profile) {
			const parsed = parseCrabboxProfile(profile);
			return resolveCrabboxProvisionCallTimeoutMs(parsed) + (parsed.warmImage === false ? 0 : CRABBOX_PROJECT_PREPARATION_TIMEOUT_MS + resolveCrabboxWarmImageCaptureTimeoutMs(parsed.provider));
		},
		resolveDestroyTimeoutMs(profile) {
			const parsed = parseCrabboxProfile(profile);
			return CRABBOX_STOP_TIMEOUT_MS + 2 * CRABBOX_COMMAND_SETTLEMENT_TIMEOUT_MS + (parsed.warmImage === false ? 0 : resolveCrabboxWarmImageCaptureTimeoutMs(parsed.provider));
		},
		prepareProvision,
		async provision(...args) {
			return await (await prepareProvision(...args))();
		},
		async inspect(lease) {
			const { context } = await resolveLeaseContext(lease);
			const inspected = await inspectWithContext({
				context,
				expectedLeaseId: context.id,
				id: context.id,
				runCommand
			});
			if (inspected.status === "unknown" || isNonRunnableState(inspected.inspect.state)) {
				await heartbeats.stop(context.id);
				return { status: "unknown" };
			}
			heartbeats.start(context);
			return { status: "active" };
		},
		async destroy(lease) {
			assertCrabboxLeaseId(lease.leaseId);
			await heartbeats.stop(lease.leaseId);
			const { context, profile } = await resolveLeaseContext(lease);
			let captureError;
			try {
				const allocation = await warmImages.lookupLease(context.id);
				const captureProfile = resolveCrabboxWarmImageProfile(profile, allocation?.machineClass ?? profile.class, allocation ? allocation.os ?? "linux" : profile.target);
				if (captureProfile.warmImage) await warmImages.capture({
					...context,
					profile: captureProfile
				});
			} catch (error) {
				captureError = error;
			}
			await stopLease(context);
			if (captureError) warn(`Crabbox warm image capture failed during teardown: ${coerceErrorMessage(captureError)}`);
		}
	};
}
//#endregion
//#region extensions/crabbox/index.ts
const workerWallpaperPath = fileURLToPath(new URL("./assets/openclaw-worker-wallpaper.png", import.meta.url));
var crabbox_default = definePluginEntry({
	id: "crabbox",
	name: "Crabbox Worker Provider",
	description: "Cloud worker provider and lease-backed sandbox backend for the Crabbox CLI",
	register(api) {
		api.registerTool((context) => createCrabboxTool({
			context,
			gateway: api.runtime.gateway
		}), { name: "crabbox" });
		api.registerToolMetadata({
			toolName: "crabbox",
			displayName: "Crabbox",
			description: "Run and present apps on a temporary machine attached to this conversation.",
			risk: "high",
			tags: ["cloud", "desktop"]
		});
		api.registerCli(async ({ program }) => {
			const { registerCrabboxWarmImageCommands } = await import("../../crabbox-worker-warm-image-cli-CBPvViXF.mjs");
			registerCrabboxWarmImageCommands(program, api.runtime.state);
		}, { descriptors: [{
			name: "crabbox",
			description: "Inspect and recover Crabbox warm images",
			hasSubcommands: true
		}] });
		api.registerGatewayMethod("crabbox.images.list", async (request) => {
			const { listCrabboxImages } = await import("../../crabbox-gateway-methods-Da7WZwN5.mjs");
			await listCrabboxImages(api, request);
		}, { scope: "operator.admin" });
		api.registerGatewayMethod("crabbox.images.recover", async (request) => {
			const { recoverCrabboxImage } = await import("../../crabbox-gateway-methods-Da7WZwN5.mjs");
			await recoverCrabboxImage(api.runtime.state, request);
		}, { scope: "operator.admin" });
		const provider = createCrabboxWorkerProvider({
			state: api.runtime.state,
			openclawRoot: resolveOpenClawRoot(api.rootDir),
			wallpaperPath: workerWallpaperPath,
			warn: (message) => api.logger.warn(message),
			warmImagePolicy: resolveCrabboxWarmImagePolicy(api.pluginConfig)
		});
		for (const action of [
			"pin",
			"delete",
			"rollback"
		]) api.registerGatewayMethod(`crabbox.images.${action}`, async (request) => {
			const { mutateCrabboxImage } = await import("../../crabbox-gateway-methods-Da7WZwN5.mjs");
			await mutateCrabboxImage(api, provider.images, action, request);
		}, { scope: "operator.admin" });
		api.registerWorkerProvider(provider);
		const sandboxConfig = resolveCrabboxSandboxConfig(api.pluginConfig);
		if (sandboxConfig && api.registrationMode === "full") {
			const backendDependencies = {
				openclawRoot: resolveOpenClawRoot(api.rootDir),
				pluginConfig: sandboxConfig
			};
			const unregister = registerSandboxBackend(CRABBOX_SANDBOX_BACKEND_ID, {
				factory: createCrabboxSandboxBackendFactory(backendDependencies),
				reserveRuntimeId: mintCrabboxSandboxLeaseId,
				manager: createCrabboxSandboxBackendManager(backendDependencies),
				resolveWorkdir: resolveCrabboxSandboxWorkdir
			});
			api.lifecycle.registerRuntimeLifecycle({
				id: "crabbox-sandbox-cleanup",
				cleanup: ({ reason, sessionKey, runId }) => {
					if (sessionKey !== void 0 || runId !== void 0) return;
					if (reason === "disable" || reason === "restart") unregister();
				}
			});
		}
		api.registerService({
			id: "crabbox-worker-cleanup",
			start() {},
			stop() {
				return provider.dispose();
			}
		});
	}
});
//#endregion
export { crabbox_default as default };
