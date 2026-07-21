import { g as resolveOAuthDir } from "../../paths-BMBAvkNf.js";
import { l as normalizeE164 } from "../../utils-CRO4LGEB.js";
import { n as resolvePreferredOpenClawTmpDir } from "../../tmp-openclaw-dir-uPgNO8da.js";
import { n as normalizeAccountId } from "../../account-id-C7N4Rwku.js";
import { i as createActionGate } from "../../common-DWyiui3y.js";
import { s as stringEnum } from "../../typebox-B_TbP7xZ.js";
import "../../temp-path-bur_3WeJ.js";
import { t as detectBinary } from "../../detect-binary-eauRT8r9.js";
import "../../setup-tools-Cw1ncsPX.js";
import "../../account-resolution-CeA8v3-h.js";
import "../../channel-actions-BCdRlnH7.js";
import { n as mulawToPcm } from "../../realtime-voice-gtBa6kh7.js";
import "../../state-paths-Cn4X4Avn.js";
import { a as resolveWhatsAppAccount } from "../../accounts-CTXNcJZ8.js";
import { t as getRegisteredWhatsAppConnectionController } from "../../connection-controller-registry-TSX_udJp.js";
import { o as resolveJidToE164 } from "../../targets-runtime-C-jSLN54.js";
import path from "node:path";
import fs from "node:fs/promises";
import { Type } from "typebox";
//#region extensions/whatsapp/src/agent-tools-call.ts
const MEOWCALLER_COMMAND = "meowcaller";
const SESSION_DATABASE = "wa-voip.db";
const MAX_AUDIO_DURATION_MS = 6e4;
const MIN_CALL_WINDOW_MS = 115e3;
const MAX_CALL_WINDOW_MS = 175e3;
const MAX_MESSAGE_LENGTH = 4e3;
const MAX_COMMAND_OUTPUT_BYTES = 64 * 1024;
const MEOWCALLER_ANSWER_TIMEOUT = "45s";
const MEOWCALLER_MAX_DURATION = "65s";
const activeCallAccounts = /* @__PURE__ */ new Set();
const WhatsAppCallToolSchema = Type.Object({
	action: stringEnum(["status", "call"], { description: "Check MeowCaller setup or call the current WhatsApp requester" }),
	message: Type.Optional(Type.String({
		description: "Spoken message to play after the requester answers (maximum 60 seconds)",
		maxLength: MAX_MESSAGE_LENGTH
	}))
}, { additionalProperties: false });
const defaultDependencies = {
	detectMeowCaller: () => detectBinary(MEOWCALLER_COMMAND),
	resolveStateDir: (accountId) => path.join(resolveOAuthDir(), "whatsapp-calls", normalizeAccountId(accountId))
};
function jsonResult(payload) {
	return {
		content: [{
			type: "text",
			text: JSON.stringify(payload, null, 2)
		}],
		details: payload
	};
}
async function isRegularFile(filePath) {
	try {
		return (await fs.stat(filePath)).isFile();
	} catch {
		return false;
	}
}
function quotePosixShellArg(value) {
	return `'${value.replaceAll("'", `'"'"'`)}'`;
}
function quotePowerShellArg(value) {
	return `'${value.replaceAll("'", "''")}'`;
}
function resolveSetupCommand(stateDir, sessionStorePath, platform = process.platform) {
	if (platform === "win32") return `meowcaller pair --store ${quotePowerShellArg(sessionStorePath)}`;
	const quotedStateDir = quotePosixShellArg(stateDir);
	return `mkdir -p ${quotedStateDir} && chmod 700 ${quotedStateDir} && meowcaller pair --store ${quotePosixShellArg(sessionStorePath)}`;
}
function wrapPcm16MonoInWav(pcm, sampleRate) {
	if (!Number.isInteger(sampleRate) || sampleRate <= 0) throw new Error("TTS returned an invalid sample rate");
	if (pcm.length === 0 || pcm.length % 2 !== 0) throw new Error("TTS returned invalid 16-bit PCM audio");
	const header = Buffer.alloc(44);
	header.write("RIFF", 0, "ascii");
	header.writeUInt32LE(36 + pcm.length, 4);
	header.write("WAVE", 8, "ascii");
	header.write("fmt ", 12, "ascii");
	header.writeUInt32LE(16, 16);
	header.writeUInt16LE(1, 20);
	header.writeUInt16LE(1, 22);
	header.writeUInt32LE(sampleRate, 24);
	header.writeUInt32LE(sampleRate * 2, 28);
	header.writeUInt16LE(2, 32);
	header.writeUInt16LE(16, 34);
	header.write("data", 36, "ascii");
	header.writeUInt32LE(pcm.length, 40);
	return Buffer.concat([header, pcm]);
}
function normalizeTelephonyPcm(audio, outputFormat) {
	const normalizedFormat = outputFormat?.trim().toLowerCase();
	if (normalizedFormat?.startsWith("pcm")) return audio;
	if (normalizedFormat === "ulaw_8000" || normalizedFormat === "raw-8khz-8bit-mono-mulaw") return mulawToPcm(audio);
	throw new Error(`TTS returned unsupported telephony format: ${outputFormat ?? "unknown"}`);
}
function resolveCallWindowMs(pcmBytes, sampleRate) {
	const audioDurationMs = pcmBytes / 2 / sampleRate * 1e3;
	if (audioDurationMs > MAX_AUDIO_DURATION_MS) throw new Error("TTS audio exceeds the 60-second WhatsApp call limit");
	return Math.min(MAX_CALL_WINDOW_MS, Math.ceil(audioDurationMs + MIN_CALL_WINDOW_MS));
}
async function resolveRequesterE164(params) {
	const senderId = params.requesterSenderId.trim();
	if (!senderId.includes("@")) try {
		return normalizeE164(senderId.replace(/^whatsapp:/i, ""));
	} catch {
		return null;
	}
	const account = resolveWhatsAppAccount({
		cfg: params.cfg,
		accountId: params.accountId
	});
	const lidLookup = getRegisteredWhatsAppConnectionController(params.accountId)?.getCurrentSock()?.signalRepository.lidMapping;
	return await resolveJidToE164(senderId, {
		authDir: account.authDir,
		lidLookup
	});
}
async function resolveLinkedWhatsAppSelfE164(params) {
	const controller = getRegisteredWhatsAppConnectionController(params.accountId);
	if (!controller) return null;
	const identity = controller.getSelfIdentity();
	if (!identity) return null;
	if (identity.e164) return normalizeE164(identity.e164);
	const account = resolveWhatsAppAccount({
		cfg: params.cfg,
		accountId: params.accountId
	});
	const lidLookup = controller.getCurrentSock()?.signalRepository.lidMapping;
	return await resolveJidToE164(identity.jid ?? identity.lid, {
		authDir: account.authDir,
		lidLookup
	});
}
function resolveRuntimeConfig(api, context) {
	return context.getRuntimeConfig?.() ?? context.runtimeConfig ?? context.config ?? api.config;
}
function createWhatsAppCallToolWithDependencies(api, context, dependencies) {
	const cfg = resolveRuntimeConfig(api, context);
	const isActionEnabled = createActionGate(cfg.channels?.whatsapp?.actions);
	const requesterSenderId = context.requesterSenderId?.trim();
	if (!isActionEnabled("calls", false) || context.messageChannel !== "whatsapp" || !requesterSenderId) return null;
	const accountId = normalizeAccountId(context.agentAccountId);
	const stateDir = dependencies.resolveStateDir(accountId);
	const sessionStorePath = path.join(stateDir, SESSION_DATABASE);
	return {
		name: "whatsapp_call",
		label: "WhatsApp Call",
		description: "Call the current WhatsApp requester and play a synthesized spoken message. This tool cannot call arbitrary phone numbers.",
		parameters: WhatsAppCallToolSchema,
		async execute(_toolCallId, rawParams, signal) {
			const params = rawParams;
			const binaryFound = await dependencies.detectMeowCaller();
			const sessionStoreFound = await isRegularFile(sessionStorePath);
			if (params.action === "status") return jsonResult({
				binaryFound,
				sessionStoreFound,
				accountId,
				stateDir,
				setupCommand: resolveSetupCommand(stateDir, sessionStorePath),
				setupShell: process.platform === "win32" ? "PowerShell" : "POSIX shell",
				requiredCommand: "meowcaller notify --store <path> --answer-timeout 45s --max-duration 65s <target> <file>",
				note: "MeowCaller uses a separate WhatsApp linked-device session; it cannot reuse OpenClaw's Baileys credentials."
			});
			const message = params.message?.trim();
			if (!message) throw new Error("message required for call action");
			if (message.length > MAX_MESSAGE_LENGTH) throw new Error(`message must be at most ${MAX_MESSAGE_LENGTH} characters`);
			if (!binaryFound) throw new Error("MeowCaller is not installed; run whatsapp_call with action=status");
			if (!sessionStoreFound) throw new Error("MeowCaller has no session store; run whatsapp_call with action=status, then run its setupCommand in an interactive terminal and scan the QR as a linked device");
			const target = await resolveRequesterE164({
				accountId,
				cfg,
				requesterSenderId
			});
			if (!target) throw new Error("Could not resolve the current WhatsApp requester to a phone number");
			if (await resolveLinkedWhatsAppSelfE164({
				accountId,
				cfg
			}) === target) throw new Error("WhatsApp cannot call the linked account itself; use a dedicated OpenClaw WhatsApp number");
			if (activeCallAccounts.has(accountId)) throw new Error("A WhatsApp call is already active for this account");
			activeCallAccounts.add(accountId);
			try {
				const speech = await api.runtime.tts.textToSpeechTelephony({
					text: message,
					cfg
				});
				if (!speech.success || !speech.audioBuffer || !speech.sampleRate) throw new Error(speech.error ?? "TTS synthesis failed");
				const pcm = normalizeTelephonyPcm(speech.audioBuffer, speech.outputFormat);
				const callWindowMs = resolveCallWindowMs(pcm.length, speech.sampleRate);
				const tempDir = await fs.mkdtemp(path.join(resolvePreferredOpenClawTmpDir(), "openclaw-whatsapp-call-"));
				const audioPath = path.join(tempDir, "message.wav");
				try {
					await fs.writeFile(audioPath, wrapPcm16MonoInWav(pcm, speech.sampleRate), { mode: 384 });
					const result = await api.runtime.system.runCommandWithTimeout([
						MEOWCALLER_COMMAND,
						"notify",
						"--store",
						sessionStorePath,
						"--answer-timeout",
						MEOWCALLER_ANSWER_TIMEOUT,
						"--max-duration",
						MEOWCALLER_MAX_DURATION,
						target,
						audioPath
					], {
						cwd: stateDir,
						env: { MEOW_LOG_LEVEL: "warn" },
						timeoutMs: callWindowMs,
						signal,
						killProcessTree: true,
						maxOutputBytes: MAX_COMMAND_OUTPUT_BYTES
					});
					if (result.termination === "signal") throw new Error("WhatsApp call cancelled");
					if (result.termination === "timeout") throw new Error("MeowCaller exceeded the bounded WhatsApp call window");
					if (result.termination !== "exit" || result.code !== 0) throw new Error(`MeowCaller did not complete the call (code ${result.code ?? "unknown"})`);
					return jsonResult({
						completed: true,
						recipient: "current WhatsApp requester",
						callWindowSeconds: Math.ceil(callWindowMs / 1e3),
						ttsProvider: speech.provider,
						note: "MeowCaller completed answer, playback, and hangup for the requester-bound call."
					});
				} finally {
					await fs.rm(tempDir, {
						recursive: true,
						force: true
					});
				}
			} finally {
				activeCallAccounts.delete(accountId);
			}
		}
	};
}
function createWhatsAppCallTool(api, context) {
	return createWhatsAppCallToolWithDependencies(api, context, defaultDependencies);
}
function registerWhatsAppCallTool(api) {
	api.registerTool((context) => createWhatsAppCallTool(api, context), { name: "whatsapp_call" });
}
//#endregion
export { registerWhatsAppCallTool };
