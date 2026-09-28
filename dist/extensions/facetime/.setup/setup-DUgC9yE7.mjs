import { formatErrorMessage } from "openclaw/plugin-sdk/error-runtime";
import { REALTIME_VOICE_AGENT_CONSULT_TOOL_POLICIES, isRealtimeVoiceAgentConsultToolPolicy } from "openclaw/plugin-sdk/realtime-voice";
import { asRecord, normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
import { resolve } from "node:path";
import { constants } from "node:fs";
import { access, readFile, readdir } from "node:fs/promises";
import { homedir } from "node:os";
//#region extensions/facetime/src/config.ts
const DEFAULT_INSTRUCTIONS = ["You are the realtime voice surface for the configured OpenClaw agent during a private 1:1 FaceTime call.", "Keep replies concise, natural, and useful for a hands-free voice conversation."].join(" ");
function resolveBoolean(value, fallback) {
	return typeof value === "boolean" ? value : fallback;
}
function resolveStringArray(value) {
	if (!Array.isArray(value)) return [];
	return value.map((entry) => normalizeOptionalString(entry)).filter((entry) => Boolean(entry));
}
function resolveRealtimeVoiceAgentConsultToolPolicy(value) {
	if (value === void 0) return "owner";
	const normalized = normalizeOptionalString(value)?.toLowerCase();
	if (!isRealtimeVoiceAgentConsultToolPolicy(normalized)) throw new Error(`realtime.toolPolicy must be one of ${REALTIME_VOICE_AGENT_CONSULT_TOOL_POLICIES.join(", ")}`);
	return normalized;
}
function resolveProviders(value) {
	const raw = asRecord(value);
	const providers = {};
	for (const [key, providerConfig] of Object.entries(raw)) {
		const id = normalizeOptionalString(key);
		if (id) providers[id] = asRecord(providerConfig);
	}
	return providers;
}
function resolveFaceTimeConfig(input) {
	const raw = asRecord(input);
	const realtime = asRecord(raw.realtime);
	if (typeof realtime.instructions === "string" && realtime.instructions.length > 4e3) throw new Error("realtime.instructions must not exceed 4000 characters");
	return {
		enabled: resolveBoolean(raw.enabled, true),
		ownerHandles: resolveStringArray(raw.ownerHandles),
		realtime: {
			provider: normalizeOptionalString(realtime.provider),
			model: normalizeOptionalString(realtime.model),
			voice: normalizeOptionalString(realtime.voice),
			sessionKey: normalizeOptionalString(realtime.sessionKey) ?? "main",
			toolPolicy: resolveRealtimeVoiceAgentConsultToolPolicy(realtime.toolPolicy),
			instructions: normalizeOptionalString(realtime.instructions) ?? DEFAULT_INSTRUCTIONS,
			providers: resolveProviders(realtime.providers)
		}
	};
}
function validateFaceTimeConfig(config) {
	const errors = [];
	if (!config.ownerHandles.length) errors.push("ownerHandles must contain at least one authorized FaceTime handle");
	if (process.platform !== "darwin") errors.push("facetime requires macOS");
	return {
		valid: errors.length === 0,
		errors
	};
}
//#endregion
//#region extensions/facetime/src/driver-setup.ts
function readDriverStatus(output) {
	const status = output.trim();
	if (status === "current" || status === "invalid" || status === "missing" || status === "outdated") return status;
	throw new Error(`Unexpected FaceTime driver status: ${status || "(empty)"}`);
}
async function inspectFaceTimeDriver(params) {
	const script = resolve(params.pluginRoot, "scripts", "install-driver.sh");
	const result = await params.runCommandWithTimeout([
		"/bin/sh",
		script,
		"--status"
	], { timeoutMs: 1e4 });
	if (result.code !== 0) throw new Error(result.stderr || result.stdout || `driver status exited ${result.code}`);
	return readDriverStatus(result.stdout);
}
async function installFaceTimeDriver(params) {
	if (params.callActive) throw new Error("Cannot install the FaceTime audio driver during an active or pending call");
	if (await inspectFaceTimeDriver(params) === "current") return {
		changed: false,
		status: "current"
	};
	const script = resolve(params.pluginRoot, "scripts", "install-driver.sh");
	const result = await params.runCommandWithTimeout([
		"/bin/sh",
		script,
		"--ensure"
	], {
		killProcessTree: true,
		...params.signal ? { signal: params.signal } : {}
	});
	if (result.code !== 0) throw new Error(`FaceTime audio driver installation failed: ${result.stderr || result.stdout || `exit ${result.code}`}`);
	const after = await inspectFaceTimeDriver(params);
	if (after !== "current") throw new Error(`FaceTime audio driver did not become current (status: ${after})`);
	return {
		changed: true,
		status: after
	};
}
async function uninstallFaceTimeDriver(params) {
	const script = resolve(params.pluginRoot, "scripts", "install-driver.sh");
	const result = await params.runCommandWithTimeout([
		"/bin/sh",
		script,
		"--uninstall"
	], {
		killProcessTree: true,
		...params.signal ? { signal: params.signal } : {}
	});
	if (result.code !== 0) throw new Error(`FaceTime uninstall failed: ${result.stderr || result.stdout || `exit ${result.code}`}`);
}
//#endregion
//#region extensions/facetime/src/plugin-paths.ts
const NATIVE_PROTOCOL = "NATIVE_PROTOCOL_VERSION=1";
const NATIVE_DIRS = ["/opt/homebrew/opt/openclaw-facetime/libexec", "/usr/local/opt/openclaw-facetime/libexec"];
const INSTALL_COMMAND = "brew install openclaw/tap/openclaw-facetime";
function resolveHelperDylib() {
	return resolve(homedir(), "Library", "Containers", "com.apple.FaceTime", "Data", "tmp", "FaceTimeHelper.dylib");
}
function resolveHelperIpcKey() {
	return resolve(homedir(), "Library", "Application Support", "OpenClaw", "FaceTime", "helper-ipc-key");
}
function resolveHelperBuildStamp() {
	return resolve(homedir(), "Library", "Application Support", "OpenClaw", "FaceTime", "helper-build.sha256");
}
async function resolveNativeInstall(params) {
	const checkAccess = params.access ?? access;
	const loadFile = params.readFile ?? readFile;
	for (const directory of NATIVE_DIRS) {
		const capture = resolve(directory, "facetime-audio-capture");
		const helper = resolve(directory, "FaceTimeHelper.dylib");
		const buildIdFile = resolve(directory, "FaceTimeHelper.build-id");
		const protocolFile = resolve(directory, "native-protocol.env");
		try {
			await Promise.all([
				checkAccess(capture, constants.X_OK),
				checkAccess(helper, constants.R_OK),
				checkAccess(buildIdFile, constants.R_OK),
				checkAccess(protocolFile, constants.R_OK)
			]);
			const [buildId, protocol] = await Promise.all([loadFile(buildIdFile, "utf8").then((value) => value.trim()), loadFile(protocolFile, "utf8").then((value) => value.trim())]);
			if (!/^[\da-f]{64}$/u.test(buildId) || protocol !== NATIVE_PROTOCOL) continue;
			return {
				buildId,
				capture,
				directory,
				helper
			};
		} catch {}
	}
	throw new Error(`Compatible FaceTime native helpers are not installed. Run: ${INSTALL_COMMAND}`);
}
async function inspectFaceTimeNativePackage(params = {}) {
	return await resolveNativeInstall(params).then(() => true, () => false);
}
async function inspectFaceTimeArtifacts(params) {
	const checkAccess = params.access ?? access;
	const readable = async (file, mode) => {
		try {
			await checkAccess(file, mode);
			return true;
		} catch {
			return false;
		}
	};
	const helperTempDirs = ["com.apple.FaceTime", "com.apple.mobilephone"].map((bundle) => resolve(homedir(), "Library", "Containers", bundle, "Data", "tmp"));
	const countHelpers = async (directory) => {
		try {
			return (await readdir(directory)).filter((name) => name.startsWith("FaceTimeHelper") && name.endsWith(".dylib")).length;
		} catch {
			return 0;
		}
	};
	const [nativeInstall, stagedHelper, helperKey, helperBuildStamp, stagedHelperDylibs, cachedDriver] = await Promise.all([
		inspectFaceTimeNativePackage(params),
		readable(resolveHelperDylib(), constants.R_OK),
		readable(resolveHelperIpcKey(), constants.R_OK),
		readable(resolveHelperBuildStamp(), constants.R_OK),
		Promise.all(helperTempDirs.map(countHelpers)).then((counts) => counts.reduce((total, count) => total + count, 0)),
		readable(resolve(homedir(), "Library", "Caches", "OpenClaw", "FaceTime", "driver", "OpenClawBridge.driver"), constants.R_OK)
	]);
	return {
		nativeInstall,
		stagedHelper,
		helperKey,
		helperBuildStamp,
		stagedHelperDylibs,
		cachedDriver
	};
}
async function ensureCaptureBinary(params = {}) {
	return (await resolveNativeInstall(params)).capture;
}
async function ensureHelperArtifacts(params) {
	const installation = await resolveNativeInstall(params);
	const stageScript = resolve(params.pluginRoot, "scripts", "stage-helper.sh");
	const result = await params.runCommandWithTimeout([
		"/bin/bash",
		stageScript,
		"--if-needed"
	], { timeoutMs: 12e4 });
	if (result.code !== 0) throw new Error(`FaceTime native helper staging failed: ${result.stderr || result.stdout || `exit ${result.code}`}`);
	const checkAccess = params.access ?? access;
	const loadFile = params.readFile ?? readFile;
	const dylib = resolveHelperDylib();
	await checkAccess(dylib, constants.R_OK);
	const ipcKey = (await loadFile(resolveHelperIpcKey(), "utf8")).trim();
	const stagedBuildId = (await loadFile(resolveHelperBuildStamp(), "utf8")).trim();
	if (!/^[\da-f]{64}$/u.test(ipcKey)) throw new Error("FaceTime helper produced an invalid IPC authentication key");
	if (stagedBuildId !== installation.buildId) throw new Error("Staged FaceTime helper does not match the installed native package");
	return {
		buildId: installation.buildId,
		dylib,
		ipcKey
	};
}
//#endregion
//#region extensions/facetime/src/setup.ts
const XCODE_APP = "/Applications/Xcode.app";
const XCODE_CLANG = `${XCODE_APP}/Contents/Developer/Toolchains/XcodeDefault.xctoolchain/usr/bin/clang`;
const XCODE_MACOS_SDK = `${XCODE_APP}/Contents/Developer/Platforms/MacOSX.platform/Developer/SDKs/MacOSX.sdk`;
const NATIVE_PACKAGE_ACTION = {
	id: "install-native-package",
	kind: "command",
	label: "Install or reinstall the FaceTime native package with Homebrew",
	command: "if brew list --versions openclaw-facetime >/dev/null 2>&1; then brew reinstall openclaw/tap/openclaw-facetime; else brew install openclaw/tap/openclaw-facetime; fi"
};
const PRECHECK_ACTIONS = {
	"capture-binary": {
		id: NATIVE_PACKAGE_ACTION.id,
		kind: "command",
		label: NATIVE_PACKAGE_ACTION.label,
		command: NATIVE_PACKAGE_ACTION.command
	},
	"paired-driver-mic": {
		id: "install-driver",
		kind: "gateway",
		label: "Install or update the paired FaceTime audio driver",
		gatewayMethod: "facetime.installDriver"
	},
	"paired-driver-feed": {
		id: "install-driver",
		kind: "gateway",
		label: "Install or update the paired FaceTime audio driver",
		gatewayMethod: "facetime.installDriver"
	},
	"physical-output": {
		id: "select-physical-output",
		kind: "system-settings",
		label: "Select MacBook Speakers or another physical output",
		settingsPath: "System Settings > Sound > Output"
	},
	"process-tap": {
		id: "grant-system-audio",
		kind: "system-settings",
		label: "Allow OpenClaw to capture FaceTime app audio",
		settingsPath: "System Settings > Privacy & Security > Screen & System Audio Recording"
	},
	"realtime-provider": {
		id: "configure-realtime-provider",
		kind: "command",
		label: "Configure authentication for a registered realtime voice provider",
		command: "openclaw configure"
	}
};
function firstLine(value) {
	return typeof value === "string" ? value.trim().split(/\r?\n/u)[0] || void 0 : void 0;
}
function addAction(actions, action) {
	if (!actions.some((candidate) => candidate.id === action.id)) actions.push(action);
}
function addPreflightCheck(checks, actions, check) {
	if (check.id === "call-app-running") return;
	const action = PRECHECK_ACTIONS[check.id];
	if (!check.ok && action) addAction(actions, action);
	checks.push({
		id: check.id,
		label: check.label,
		status: check.ok ? "ready" : check.required ? "action-required" : "recommended",
		required: check.required,
		message: check.message ?? (check.ok ? "ready" : "not ready"),
		...!check.ok && action ? { actionId: action.id } : {}
	});
}
function hasActiveFocusAssertion(raw) {
	const parsed = JSON.parse(raw);
	const visit = (value) => {
		if (Array.isArray(value)) return value.some(visit);
		if (!value || typeof value !== "object") return false;
		const record = asRecord(value);
		if (Array.isArray(record.storeAssertionRecords) && record.storeAssertionRecords.length > 0) return true;
		return Object.values(record).some(visit);
	};
	return visit(parsed);
}
async function checkFocusMode(params) {
	const readAssertions = params.readAssertionsFile ?? (() => readFile(resolve(homedir(), "Library/DoNotDisturb/DB/Assertions.json"), "utf8"));
	try {
		const active = hasActiveFocusAssertion(await readAssertions());
		return {
			id: "focus-mode",
			label: "Focus mode",
			status: active ? "verify-on-call" : "ready",
			required: !active,
			message: active ? "An active Focus is allowed only when it permits the expected caller" : "No active Focus assertion",
			...active ? { actionId: "verify-focus" } : {}
		};
	} catch (error) {
		return {
			id: "focus-mode",
			label: "Focus mode",
			status: "verify-on-call",
			required: false,
			message: `Could not verify Focus state: ${formatErrorMessage(error)}`,
			actionId: "verify-focus"
		};
	}
}
async function checkNotificationsDuringSharing(runCommandWithTimeout) {
	const script = "/usr/bin/defaults export com.apple.ncprefs - 2>/dev/null | /usr/bin/plutil -extract dnd_prefs raw -o - - | /usr/bin/base64 --decode | /usr/bin/plutil -extract dndMirrored raw -o - -";
	try {
		const result = await runCommandWithTimeout([
			"/bin/bash",
			"-c",
			script
		], { timeoutMs: 5e3 });
		const value = firstLine(result.stdout)?.toLowerCase();
		if (result.code === 0 && value === "true") return {
			id: "notifications-while-sharing",
			label: "Notifications while sharing the display",
			status: "ready",
			required: true,
			message: "Notifications are allowed while mirroring or sharing the display"
		};
		return {
			id: "notifications-while-sharing",
			label: "Notifications while sharing the display",
			status: "action-required",
			required: true,
			message: value === "false" ? "Incoming call notifications are suppressed while mirroring or sharing the display" : "Could not verify the notification setting used during display sharing",
			actionId: "allow-sharing-notifications"
		};
	} catch (error) {
		return {
			id: "notifications-while-sharing",
			label: "Notifications while sharing the display",
			status: "action-required",
			required: true,
			message: `Could not verify notification behavior: ${formatErrorMessage(error)}`,
			actionId: "allow-sharing-notifications"
		};
	}
}
async function checkCommand(runCommandWithTimeout, argv, readyMessage) {
	try {
		const result = await runCommandWithTimeout(argv, { timeoutMs: 5e3 });
		return result.code === 0 ? {
			ok: true,
			message: readyMessage(result.stdout ?? "")
		} : {
			ok: false,
			message: firstLine(result.stderr) ?? firstLine(result.stdout) ?? `${argv[0]} exited ${result.code}`
		};
	} catch (error) {
		return {
			ok: false,
			message: formatErrorMessage(error)
		};
	}
}
async function inspectDriver(params) {
	try {
		return { status: await inspectFaceTimeDriver({
			pluginRoot: params.pluginRoot,
			runCommandWithTimeout: params.runCommandWithTimeout
		}) };
	} catch (error) {
		return { error: formatErrorMessage(error) };
	}
}
async function runFaceTimeSetup(params) {
	const checks = [];
	const actions = [];
	const [xcodeCompiler, xcodeSdk] = await Promise.all([checkCommand(params.runCommandWithTimeout, [
		"/bin/test",
		"-x",
		XCODE_CLANG
	], () => XCODE_CLANG), checkCommand(params.runCommandWithTimeout, [
		"/bin/test",
		"-d",
		XCODE_MACOS_SDK
	], () => {
		return XCODE_MACOS_SDK;
	})]);
	const xcodeReady = xcodeCompiler.ok && xcodeSdk.ok;
	checks.push({
		id: "xcode-tools",
		label: "Full Xcode installation",
		status: xcodeReady ? "ready" : "action-required",
		required: true,
		message: xcodeReady ? `Full Xcode compiler and macOS SDK are available at ${XCODE_APP}` : `Full Xcode is required at ${XCODE_APP}; Command Line Tools alone cannot perform protected-app injection or build the local audio driver`,
		...!xcodeReady ? { actionId: "install-xcode-tools" } : {}
	});
	if (!xcodeReady) addAction(actions, {
		id: "install-xcode-tools",
		kind: "command",
		label: "Install full Xcode in /Applications",
		command: "open 'https://apps.apple.com/us/app/xcode/id497799835'"
	});
	const developerSecurity = await checkCommand(params.runCommandWithTimeout, ["/usr/sbin/DevToolsSecurity", "-status"], (stdout) => firstLine(stdout) ?? "Developer tools access enabled");
	const developerSecurityEnabled = developerSecurity.ok && /enabled/iu.test(developerSecurity.message);
	checks.push({
		id: "developer-tools-access",
		label: "Developer tools access",
		status: developerSecurityEnabled ? "ready" : "action-required",
		required: true,
		message: developerSecurityEnabled ? developerSecurity.message : "Developer tools access is disabled; helper injection cannot attach to FaceTime or Phone",
		...!developerSecurityEnabled ? { actionId: "enable-developer-tools" } : {}
	});
	if (!developerSecurityEnabled) addAction(actions, {
		id: "enable-developer-tools",
		kind: "command",
		label: "Enable developer tools access",
		command: "sudo /usr/sbin/DevToolsSecurity -enable"
	});
	const sip = await checkCommand(params.runCommandWithTimeout, ["/usr/bin/csrutil", "status"], (stdout) => stdout.trim());
	const debuggingRestrictionsDisabled = sip.ok && /^[\t ]*(?:System Integrity Protection status:|Debugging Restrictions:)[\t ]*disabled\.?[\t ]*\r?$/imu.test(sip.message);
	const debuggingRestrictionsEnabled = sip.ok && /^[\t ]*(?:System Integrity Protection status:|Debugging Restrictions:)[\t ]*enabled\.?[\t ]*\r?$/imu.test(sip.message);
	const sipActionId = debuggingRestrictionsEnabled ? "disable-sip-debugging" : "verify-sip-status";
	checks.push({
		id: "system-integrity-protection",
		label: "System Integrity Protection debugging restrictions",
		status: debuggingRestrictionsDisabled ? "ready" : "action-required",
		required: true,
		message: debuggingRestrictionsDisabled ? "SIP permits debugger attachment to FaceTime and Phone; a connected helper must still be verified separately" : debuggingRestrictionsEnabled ? "SIP debugging restrictions block LLDB helper injection into protected Apple apps" : "Could not verify SIP debugging restrictions; run csrutil status before changing protection settings",
		...!debuggingRestrictionsDisabled ? { actionId: sipActionId } : {}
	});
	if (!debuggingRestrictionsDisabled && debuggingRestrictionsEnabled) addAction(actions, {
		id: "disable-sip-debugging",
		kind: "recovery",
		label: "Disable SIP debugging restrictions from macOS Recovery, then reboot and rerun setup",
		command: "csrutil enable --without debug",
		settingsPath: "macOS Recovery > Utilities > Terminal"
	});
	else if (!debuggingRestrictionsDisabled) addAction(actions, {
		id: "verify-sip-status",
		kind: "command",
		label: "Verify SIP status, then rerun setup",
		command: "/usr/bin/csrutil status"
	});
	checks.push({
		id: "owner-handles",
		label: "Owner FaceTime handles",
		status: params.config.ownerHandles.length > 0 ? "ready" : "action-required",
		required: true,
		message: params.config.ownerHandles.length > 0 ? `${params.config.ownerHandles.length} owner handle${params.config.ownerHandles.length === 1 ? "" : "s"} configured` : "Configure at least one owner email address or phone number",
		...params.config.ownerHandles.length === 0 ? { actionId: "configure-owner-handles" } : {}
	});
	if (params.config.ownerHandles.length === 0) addAction(actions, {
		id: "configure-owner-handles",
		kind: "command",
		label: "Configure ownerHandles",
		command: "openclaw configure"
	});
	checks.push({
		id: "native-package",
		label: "FaceTime native package",
		status: params.nativePackageReady ? "ready" : "action-required",
		required: true,
		message: params.nativePackageReady ? "Compatible FaceTime capture and helper artifacts are installed" : "Compatible FaceTime native helpers are not installed",
		...!params.nativePackageReady ? { actionId: NATIVE_PACKAGE_ACTION.id } : {}
	});
	if (!params.nativePackageReady) addAction(actions, NATIVE_PACKAGE_ACTION);
	const runtimeStatus = params.nativePackageReady && params.runtimeStatus ? await params.runtimeStatus : void 0;
	checks.push({
		id: "runtime",
		label: "FaceTime plugin runtime",
		status: runtimeStatus ? "ready" : "action-required",
		required: true,
		message: runtimeStatus ? "Runtime activated on the local UID-derived helper endpoint" : params.runtimeError ?? "FaceTime runtime is not running",
		...!runtimeStatus ? { actionId: params.nativePackageReady ? "restart-gateway" : NATIVE_PACKAGE_ACTION.id } : {}
	});
	if (!runtimeStatus && params.nativePackageReady) addAction(actions, {
		id: "restart-gateway",
		kind: "command",
		label: "Stop the stale gateway process, then restart OpenClaw",
		command: "openclaw gateway restart"
	});
	if (runtimeStatus) for (const target of runtimeStatus.helperTargets) {
		const status = target.connected ? "ready" : target.stale ? "action-required" : target.injecting || target.queued || target.retryScheduled ? "repairing" : "action-required";
		checks.push({
			id: `helper-${target.target.toLowerCase()}`,
			label: `${target.target} helper`,
			status,
			required: target.target === "FaceTime" || target.target === "Phone",
			message: target.connected ? "Authenticated helper connected" : target.stale ? `Restart ${target.target} so it can load the current helper` : status === "repairing" && target.lastError ? `Automatic retry scheduled after: ${target.lastError}` : target.lastError ? target.lastError : "OpenClaw is launching the app and injecting the helper",
			...status === "repairing" ? { actionId: "wait-for-helper" } : status === "action-required" ? { actionId: "restart-call-apps" } : {}
		});
		if (status === "repairing") addAction(actions, {
			id: "wait-for-helper",
			kind: "automatic",
			label: "Wait for automatic helper injection to finish"
		});
		else if (status === "action-required") addAction(actions, {
			id: "restart-call-apps",
			kind: "manual-test",
			label: "Quit and reopen FaceTime and Phone, then let OpenClaw reinject the helper"
		});
	}
	const driver = params.nativePackageReady ? await inspectDriver(params) : {};
	const driverReady = driver.status === "current";
	checks.push({
		id: "audio-driver",
		label: "Paired FaceTime audio driver",
		status: driverReady ? "ready" : "action-required",
		required: true,
		message: driverReady ? "OpenClaw-Mic and OpenClaw-Feed driver is current" : !params.nativePackageReady ? "Install the FaceTime native package before setting up the audio driver" : driver.error ? `Could not inspect driver: ${driver.error}` : `Driver status: ${driver.status ?? "unknown"}`,
		...!driverReady ? { actionId: params.nativePackageReady ? "install-driver" : NATIVE_PACKAGE_ACTION.id } : {}
	});
	if (!driverReady && params.nativePackageReady) addAction(actions, {
		id: "install-driver",
		kind: "gateway",
		label: "Install or update the paired FaceTime audio driver",
		gatewayMethod: "facetime.installDriver"
	});
	if (params.preflight) {
		const preflight = await params.preflight;
		for (const check of preflight.checks) {
			if (check.id === "helper-connected" && runtimeStatus?.helperTargets.length) continue;
			addPreflightCheck(checks, actions, check);
		}
	}
	const focus = await checkFocusMode(params);
	checks.push(focus);
	if (focus.status === "verify-on-call") addAction(actions, {
		id: "verify-focus",
		kind: "system-settings",
		label: "Verify Focus is off or allows the expected caller",
		settingsPath: "Control Center > Focus"
	});
	const sharingNotifications = await checkNotificationsDuringSharing(params.runCommandWithTimeout);
	checks.push(sharingNotifications);
	if (sharingNotifications.status === "action-required") addAction(actions, {
		id: "allow-sharing-notifications",
		kind: "system-settings",
		label: "Allow notifications while mirroring or sharing the display",
		settingsPath: "System Settings > Notifications"
	});
	checks.push({
		id: "facetime-sign-in",
		label: "FaceTime account",
		status: "verify-on-call",
		required: false,
		message: "macOS does not expose a supported sign-in readiness API; verify with one outbound call",
		actionId: "live-outbound-test"
	});
	addAction(actions, {
		id: "live-outbound-test",
		kind: "manual-test",
		label: "Place one outbound FaceTime audio call with facetime.dial",
		gatewayMethod: "facetime.dial"
	});
	const internalMediaStage = runtimeStatus?.calls.find((call) => call.audioReady && call.realtimeActive && call.audioTransport?.processInputVerified === true && call.audioTransport.processOutputSuppressed);
	checks.push({
		id: "internal-media-stage",
		label: "Internal call media stage",
		status: internalMediaStage ? "ready" : "verify-on-call",
		required: false,
		message: internalMediaStage ? "Process capture, model session, SoX playback, and local suppression reached the internal media stage; remote audibility is not proven" : "Internal media stages require an active call; remote audibility still needs a separate live check",
		...!internalMediaStage ? { actionId: "live-audio-test" } : {}
	});
	if (!internalMediaStage) addAction(actions, {
		id: "live-audio-test",
		kind: "manual-test",
		label: "Run one inbound and one outbound FaceTime audio call"
	});
	checks.push({
		id: "live-voicemail",
		label: "Live Voicemail call screening",
		status: "recommended",
		required: false,
		message: "If incoming FaceTime Audio rings are intercepted, turn off Live Voicemail on this unattended Mac",
		actionId: "review-live-voicemail"
	});
	addAction(actions, {
		id: "review-live-voicemail",
		kind: "system-settings",
		label: "Review Live Voicemail if inbound audio calls are screened",
		settingsPath: "Phone > Settings > Live Voicemail"
	});
	const requiredReady = checks.every((check) => !check.required || check.status === "ready" || check.status === "repairing");
	const repairsPending = checks.some((check) => check.required && check.status === "repairing");
	return {
		ok: requiredReady && !repairsPending,
		readyForTest: requiredReady && !repairsPending,
		liveCallProofRequired: true,
		checks,
		actions
	};
}
//#endregion
export { inspectFaceTimeNativePackage as a, uninstallFaceTimeDriver as c, inspectFaceTimeArtifacts as i, resolveFaceTimeConfig as l, ensureCaptureBinary as n, inspectFaceTimeDriver as o, ensureHelperArtifacts as r, installFaceTimeDriver as s, runFaceTimeSetup as t, validateFaceTimeConfig as u };
