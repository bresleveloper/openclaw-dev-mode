import { a as inspectFaceTimeNativePackage, c as uninstallFaceTimeDriver, i as inspectFaceTimeArtifacts, l as resolveFaceTimeConfig, o as inspectFaceTimeDriver, t as runFaceTimeSetup, u as validateFaceTimeConfig } from "./.setup/setup-DUgC9yE7.mjs";
import { formatErrorMessage } from "openclaw/plugin-sdk/error-runtime";
import { ErrorCodes, errorShape } from "openclaw/plugin-sdk/gateway-runtime";
import { definePluginEntry } from "openclaw/plugin-sdk/plugin-entry";
import { asRecord, normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
import { stringEnum } from "openclaw/plugin-sdk/channel-actions";
import { jsonResult } from "openclaw/plugin-sdk/tool-results";
import { Type } from "typebox";
//#region extensions/facetime/src/runtime-lifecycle.ts
async function stopRetainedRuntime(current, clearIfCurrent) {
	if (!current) return;
	let runtime;
	try {
		runtime = await current;
	} catch (error) {
		clearIfCurrent(current);
		throw error;
	}
	await runtime.stop();
	clearIfCurrent(current);
}
//#endregion
//#region extensions/facetime/src/static-status.ts
async function inspectFaceTimeStaticStatus(params) {
	const [artifacts, driver] = await Promise.all([inspectFaceTimeArtifacts({}), inspectFaceTimeDriver(params).then((status) => ({ status }), (error) => ({ error: formatErrorMessage(error) }))]);
	return {
		enabled: params.config.enabled,
		activation: "inactive",
		configValid: params.configErrors.length === 0,
		configErrors: params.configErrors,
		artifacts,
		driverStatus: "status" in driver ? driver.status : void 0,
		driverError: "error" in driver ? driver.error : void 0,
		note: "Static inspection only; helper, carrier, model media, and remote audibility were not activated or tested."
	};
}
//#endregion
//#region extensions/facetime/src/tool.ts
const FaceTimeCallToolSchema = Type.Object({
	action: stringEnum([
		"get_status",
		"check_readiness",
		"initiate_call",
		"end_call"
	]),
	handle: Type.Optional(Type.String({
		description: "Authorized owner FaceTime email or phone number",
		maxLength: 256
	})),
	mode: Type.Optional(stringEnum(["audio", "video"])),
	callUUID: Type.Optional(Type.String({ description: "Current call identity. Omit to end the current call." }))
}, { additionalProperties: false });
function resolveFaceTimeToolApproval(input) {
	const raw = asRecord(input);
	if (raw.action !== "initiate_call") return;
	const handle = normalizeOptionalString(raw.handle);
	if (!handle) return;
	return { requireApproval: {
		title: "Place FaceTime call",
		description: `Place a ${raw.mode === "video" ? "video" : "audio"} FaceTime call to ${handle}.`,
		severity: "warning",
		allowedDecisions: ["allow-once", "deny"],
		timeoutMs: 12e4
	} };
}
function summarizeStatus(status) {
	return {
		stageMeaning: "Internal carrier/model/native stages only; remote audibility is not measured.",
		enabled: status.enabled,
		helperConnected: status.helperConnected,
		helperProtocol: status.helperProtocol,
		helperTargets: status.helperTargets.map((target) => ({
			target: target.target,
			connected: target.connected,
			stale: target.stale,
			retryScheduled: target.retryScheduled
		})),
		driverInstallPending: status.driverInstallPending,
		driverInstall: status.driverInstall,
		processOutputSuppressed: status.processOutputSuppressed,
		outboundCallPending: status.outboundCallPending,
		calls: status.calls.map((call) => ({
			callUUID: call.callUUID,
			phase: call.phase,
			carrierMode: call.carrierMode,
			modelMediaMode: call.modelMediaMode,
			handle: call.handle,
			realtimeActive: call.realtimeActive,
			audioReady: call.audioReady,
			processInputVerified: call.audioTransport?.processInputVerified === true,
			processOutputSuppressed: call.audioTransport?.processOutputSuppressed === true,
			lastRoutingError: call.lastRoutingError,
			carrierHangupPending: call.carrierHangupPending
		}))
	};
}
function createFaceTimeCallTool(params) {
	return {
		name: "facetime_call",
		label: "FaceTime Call",
		description: "Inspect FaceTime stages and manage calls for configured owner handles on this Mac.",
		parameters: FaceTimeCallToolSchema,
		async execute(_toolCallId, input) {
			const raw = asRecord(input);
			const action = normalizeOptionalString(raw.action);
			try {
				switch (action) {
					case "get_status": return jsonResult({
						ok: true,
						action,
						status: await params.getStatus().then((status) => "calls" in status ? summarizeStatus(status) : status)
					});
					case "check_readiness": {
						const readiness = await params.getStatus();
						return jsonResult({
							ok: "calls" in readiness ? true : readiness.configValid,
							action,
							status: "calls" in readiness ? summarizeStatus(readiness) : readiness,
							note: "Reports internal static/runtime stages only; it does not prove remote audibility."
						});
					}
					case "initiate_call": {
						const runtime = await params.ensureRuntime();
						const handle = normalizeOptionalString(raw.handle);
						if (!handle) throw new Error("handle is required");
						const status = await runtime.status();
						if (!status.helperConnected) throw new Error("FaceTime helper is not connected");
						if (status.driverInstallPending) throw new Error("FaceTime audio driver installation is pending");
						if (status.calls.length > 0 || status.outboundCallPending) throw new Error("another FaceTime call is active or pending");
						const mode = raw.mode === "audio" || raw.mode === "video" ? raw.mode : void 0;
						const { helper: _helper, ...publicResult } = await runtime.dial({
							handle,
							mode
						});
						return jsonResult({
							ok: true,
							action,
							...publicResult
						});
					}
					case "end_call": {
						const result = await (await params.ensureRuntime()).hangup({ callUUID: normalizeOptionalString(raw.callUUID) });
						return jsonResult({
							ok: true,
							action,
							...result
						});
					}
					default: throw new Error("action must be get_status, check_readiness, initiate_call, or end_call");
				}
			} catch (error) {
				return jsonResult({
					ok: false,
					action,
					error: formatErrorMessage(error)
				});
			}
		}
	};
}
//#endregion
//#region extensions/facetime/index.ts
const faceTimePlugin = definePluginEntry({
	id: "facetime",
	name: "FaceTime",
	description: "Experimental private FaceTime realtime voice carrier for OpenClaw agents",
	configSchema: { parse(value) {
		return resolveFaceTimeConfig(value);
	} },
	register(api) {
		const config = resolveFaceTimeConfig(api.pluginConfig);
		const validation = validateFaceTimeConfig(config);
		const pluginRoot = api.rootDir ?? api.resolvePath(".");
		let runtimePromise;
		let uninstalling = false;
		const ensureRuntime = async () => {
			if (uninstalling) throw new Error("facetime native uninstall is in progress");
			if (!config.enabled) throw new Error("facetime disabled in plugin config");
			if (!validation.valid) throw new Error(validation.errors.join("; "));
			runtimePromise ??= import("./runtime-api.js").then(({ createFaceTimeRuntime }) => createFaceTimeRuntime({
				config,
				fullConfig: api.config,
				runtime: api.runtime,
				logger: api.logger,
				pluginRoot
			})).catch((error) => {
				runtimePromise = void 0;
				throw error;
			});
			return await runtimePromise;
		};
		const getStatus = async () => {
			const current = runtimePromise;
			if (current) try {
				return await (await current).status();
			} catch {}
			return await inspectFaceTimeStaticStatus({
				config,
				configErrors: validation.errors,
				pluginRoot,
				runCommandWithTimeout: api.runtime.system.runCommandWithTimeout
			});
		};
		api.registerTool(() => createFaceTimeCallTool({
			ensureRuntime,
			getStatus
		}), { name: "facetime_call" });
		api.on("before_tool_call", (event) => {
			if (event.toolName !== "facetime_call") return;
			return resolveFaceTimeToolApproval(event.params);
		});
		api.registerService({
			id: "facetime-runtime",
			async start() {
				if (!config.enabled || !validation.valid) return;
				try {
					await ensureRuntime();
				} catch (error) {
					api.logger.warn(`[facetime] startup skipped: ${formatErrorMessage(error)}`);
				}
			},
			async stop() {
				await stopRetainedRuntime(runtimePromise, (stopped) => {
					if (runtimePromise === stopped) runtimePromise = void 0;
				});
			}
		});
		const registerGateway = (name, scope, handler) => {
			api.registerGatewayMethod(name, async (options) => {
				try {
					options.respond(true, await handler(options));
				} catch (error) {
					options.respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, formatErrorMessage(error)));
				}
			}, { scope });
		};
		registerGateway("facetime.status", "operator.read", getStatus);
		registerGateway("facetime.setup", "operator.admin", async () => {
			const nativePackageReady = await inspectFaceTimeNativePackage();
			if (!nativePackageReady) return await runFaceTimeSetup({
				config,
				nativePackageReady,
				pluginRoot,
				runCommandWithTimeout: api.runtime.system.runCommandWithTimeout
			});
			let runtime;
			try {
				runtime = await ensureRuntime();
			} catch (runtimeError) {
				return await runFaceTimeSetup({
					config,
					nativePackageReady: await inspectFaceTimeNativePackage(),
					pluginRoot,
					runCommandWithTimeout: api.runtime.system.runCommandWithTimeout,
					runtimeError: formatErrorMessage(runtimeError)
				});
			}
			return await runtime.setup();
		});
		registerGateway("facetime.driverStatus", "operator.read", async () => ({ status: await inspectFaceTimeDriver({
			pluginRoot,
			runCommandWithTimeout: api.runtime.system.runCommandWithTimeout
		}) }));
		const installDriver = async () => ({
			ok: true,
			...await (await ensureRuntime()).installDriver()
		});
		for (const name of ["facetime.installDriver", "facetime.updateDriver"]) registerGateway(name, "operator.admin", installDriver);
		registerGateway("facetime.uninstall", "operator.admin", async () => {
			if (uninstalling) throw new Error("facetime native uninstall is already in progress");
			uninstalling = true;
			try {
				const current = runtimePromise;
				if (current) await stopRetainedRuntime(current, (stopped) => {
					if (runtimePromise === stopped) runtimePromise = void 0;
				});
				await uninstallFaceTimeDriver({
					pluginRoot,
					runCommandWithTimeout: api.runtime.system.runCommandWithTimeout
				});
				return {
					ok: true,
					guidance: "Quit and reopen FaceTime and Phone before re-enabling this plugin."
				};
			} finally {
				uninstalling = false;
			}
		});
		registerGateway("facetime.preflight", "operator.admin", async () => await (await ensureRuntime()).preflight());
		registerGateway("facetime.dial", "operator.write", async ({ params }) => {
			const record = params && typeof params === "object" ? params : {};
			const handle = "handle" in record ? record.handle : void 0;
			const mode = "mode" in record ? record.mode : void 0;
			return {
				ok: true,
				...await (await ensureRuntime()).dial({
					handle,
					mode
				})
			};
		});
		registerGateway("facetime.hangup", "operator.write", async ({ params }) => {
			const callUUID = params && typeof params === "object" && "callUUID" in params ? params.callUUID : void 0;
			return {
				ok: true,
				...await (await ensureRuntime()).hangup({ callUUID })
			};
		});
	}
});
//#endregion
export { faceTimePlugin as default };
