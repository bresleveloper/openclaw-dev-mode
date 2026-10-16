import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "../../string-coerce-1VuiLaaR.mjs";
import { r as createLazyRuntimeModule } from "../../lazy-runtime-CJrzFzqU.mjs";
import "../../string-coerce-runtime-50qKeWeL.mjs";
import { t as definePluginEntry } from "../../plugin-entry-2l_2QeB2.mjs";
import path from "node:path";
import { rm } from "node:fs/promises";
import os from "node:os";
import { isIP } from "node:net";
//#region extensions/device-pair/index.ts
const loadDevicePairApiModule = createLazyRuntimeModule(() => import("./api.js"));
const loadNotifyModule = createLazyRuntimeModule(() => import("./notify.js"));
const loadPairCommandApproveModule = createLazyRuntimeModule(() => import("./pair-command-approve.js"));
const loadPairCommandAuthModule = createLazyRuntimeModule(() => import("./pair-command-auth.js"));
function formatDurationMinutes(expiresAtMs) {
	const msRemaining = Math.max(0, expiresAtMs - Date.now());
	const minutes = Math.max(1, Math.ceil(msRemaining / 6e4));
	return `${minutes} minute${minutes === 1 ? "" : "s"}`;
}
const QR_SUPPORTED_CHANNELS = /* @__PURE__ */ new Set([
	"telegram",
	"discord",
	"slack",
	"signal",
	"imessage",
	"whatsapp"
]);
function describeSecureMobilePairingFix(source) {
	return "Tailscale and public mobile pairing require a secure gateway URL (wss://) or Tailscale Serve/Funnel." + (source ? ` Resolved source: ${source}.` : "") + " Fix: use a private LAN address, prefer gateway.tailscale.mode=serve, or set gateway.remote.url / plugins.entries.device-pair.config.publicUrl to a wss:// URL. ws:// setup codes are only valid for localhost/loopback, private LAN addresses, .local hosts, or the Android emulator.";
}
function normalizeHostForIpCheck(host) {
	let normalized = normalizeLowercaseStringOrEmpty(host);
	if (normalized.startsWith("[") && normalized.endsWith("]")) normalized = normalized.slice(1, -1);
	if (normalized.endsWith(".")) normalized = normalized.slice(0, -1);
	const zoneIndex = normalized.indexOf("%");
	if (zoneIndex >= 0) normalized = normalized.slice(0, zoneIndex);
	return normalized;
}
function isLoopbackHost(host) {
	const normalized = normalizeHostForIpCheck(host);
	if (!normalized) return false;
	if (normalized === "localhost") return true;
	const octets = parseIPv4Octets(normalized);
	if (octets) return octets[0] === 127;
	return normalized === "::1" || normalized === "0:0:0:0:0:0:0:1";
}
function parseIPv4Octets(address) {
	const parts = address.split(".");
	if (parts.length !== 4) return null;
	if (parts.some((part) => !/^\d+$/.test(part))) return null;
	const octets = parts.map((part) => Number.parseInt(part, 10));
	if (octets.some((value) => !Number.isFinite(value) || value < 0 || value > 255)) return null;
	return octets;
}
function isPrivateIPv4(address) {
	const octets = parseIPv4Octets(address);
	if (!octets) return false;
	const [a, b] = octets;
	if (a === 10) return true;
	if (a === 172 && b >= 16 && b <= 31) return true;
	if (a === 192 && b === 168) return true;
	return false;
}
function isPrivateLanIPv6(address) {
	if (isIP(address) !== 6) return false;
	const firstHextet = address.split(":", 1)[0] ?? "";
	if (!/^[0-9a-f]{4}$/.test(firstHextet)) return false;
	const value = Number.parseInt(firstHextet, 16);
	return (value & 65024) === 64512 || (value & 65472) === 65152;
}
function isPrivateLanCleartextHost(host) {
	const normalized = normalizeHostForIpCheck(host);
	if (normalized.endsWith(".local")) return true;
	if (isPrivateIPv4(normalized) || isPrivateLanIPv6(normalized)) return true;
	const octets = parseIPv4Octets(normalized);
	if (!octets) return false;
	return octets[0] === 169 && octets[1] === 254;
}
function isMobilePairingCleartextAllowedHost(host) {
	const normalized = normalizeHostForIpCheck(host);
	return isLoopbackHost(normalized) || normalized === "10.0.2.2" || isPrivateLanCleartextHost(normalized);
}
function validateMobilePairingUrl(url, source) {
	const parsed = URL.parse(url);
	if (!parsed) return "Resolved mobile pairing URL is invalid.";
	const protocol = parsed.protocol === "https:" ? "wss:" : parsed.protocol === "http:" ? "ws:" : parsed.protocol;
	if (protocol === "wss:") return null;
	if (protocol !== "ws:" || isMobilePairingCleartextAllowedHost(parsed.hostname)) return null;
	return describeSecureMobilePairingFix(source);
}
function isFullAccessMobilePairingUrl(url) {
	const parsed = URL.parse(url);
	return parsed?.protocol === "wss:" || parsed?.protocol === "ws:" && isLoopbackHost(parsed.hostname);
}
async function resolveMobilePairingGatewayUrl(api) {
	const { resolvePairingGatewayUrl, runPluginCommandWithTimeout } = await loadDevicePairApiModule();
	const pluginCfg = api.pluginConfig ?? {};
	const result = await resolvePairingGatewayUrl(api.config, {
		env: process.env,
		publicUrl: pluginCfg.publicUrl,
		urlPathMode: "origin-only",
		networkInterfaces: os.networkInterfaces,
		runCommandWithTimeout: (argv, opts) => runPluginCommandWithTimeout({
			argv,
			timeoutMs: opts.timeoutMs
		})
	});
	if (!result.url) return result;
	const mobilePairingUrlError = validateMobilePairingUrl(result.url, result.source);
	if (mobilePairingUrlError) return { error: mobilePairingUrlError };
	return result;
}
function encodeSetupCode(payload) {
	return Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
}
function buildPairingFlowLines(stepTwo) {
	return [
		"1) Open the iOS app → Settings → Gateway",
		`2) ${stepTwo}`,
		"3) Back here, run /pair approve",
		"4) If this code leaks or you are done, run /pair cleanup"
	];
}
function buildSecurityNoticeLines(params) {
	const cleanupCommand = params.markdown ? "`/pair cleanup`" : "/pair cleanup";
	const securityPrefix = params.markdown ? "- " : "";
	const importantLine = params.markdown ? `**Important:** Run ${cleanupCommand} after pairing finishes.` : `IMPORTANT: After pairing finishes, run ${cleanupCommand}.`;
	return [
		`${securityPrefix}Security: single-use bootstrap token`,
		`${securityPrefix}Expires: ${formatDurationMinutes(params.expiresAtMs)}`,
		"",
		importantLine,
		`If this ${params.kind} leaks, run ${cleanupCommand} immediately.`
	];
}
function buildQrFollowUpLines(autoNotifyArmed) {
	return autoNotifyArmed ? [
		"After scanning, wait here for the pairing request ping.",
		"I’ll auto-ping here when the pairing request arrives, then auto-disable.",
		"If the ping does not arrive, run `/pair approve latest` manually."
	] : ["After scanning, run `/pair approve` to complete pairing."];
}
function formatSetupReply(payload, authLabel) {
	const setupCode = encodeSetupCode(payload);
	return [
		"Pairing setup code generated.",
		"",
		...buildPairingFlowLines("Paste the setup code below and tap Connect"),
		"",
		"Setup code:",
		setupCode,
		"",
		`Gateway: ${payload.url}`,
		`Auth: ${authLabel}`,
		...buildAccessLines(payload),
		...buildSecurityNoticeLines({
			kind: "setup code",
			expiresAtMs: payload.expiresAtMs
		})
	].join("\n");
}
function formatSetupInstructions(expiresAtMs) {
	return [
		"Pairing setup code generated.",
		"",
		...buildPairingFlowLines("Paste the setup code from my next message and tap Connect"),
		"",
		...buildSecurityNoticeLines({
			kind: "setup code",
			expiresAtMs
		})
	].join("\n");
}
function buildQrInfoLines(params) {
	const prefix = params.markdown ? "- " : "";
	return [
		`${prefix}Gateway: ${params.payload.url}`,
		`${prefix}Auth: ${params.authLabel}`,
		...buildAccessLines(params.payload, params.markdown),
		...buildSecurityNoticeLines({
			kind: "QR code",
			expiresAtMs: params.payload.expiresAtMs,
			markdown: params.markdown
		}),
		"",
		...buildQrFollowUpLines(params.autoNotifyArmed),
		"",
		"If your camera still won’t lock on, run `/pair` for a pasteable setup code."
	];
}
function resolveQrReplyTarget(ctx) {
	if (ctx.channel === "discord") {
		const senderId = normalizeOptionalString(ctx.senderId) ?? "";
		if (senderId) return senderId.startsWith("user:") || senderId.startsWith("channel:") ? senderId : `user:${senderId}`;
	}
	return normalizeOptionalString(ctx.senderId) || normalizeOptionalString(ctx.from) || normalizeOptionalString(ctx.to) || "";
}
function buildAccessLines(payload, markdown = false) {
	const prefix = markdown ? "- " : "";
	return [`${prefix}Access: ${payload.access}`, ...payload.accessDowngraded ? [`${prefix}Plaintext ws:// was limited for safety. Use wss:// or Tailscale Serve, then generate a new code for full access.`] : []];
}
async function issueSetupPayload(params) {
	const assertCurrent = params.assertCurrent;
	const { issueDeviceBootstrapToken, PAIRING_SETUP_BOOTSTRAP_PROFILE } = await loadDevicePairApiModule();
	const hasPlaintextRoute = !isFullAccessMobilePairingUrl(params.url);
	const fullAccess = params.allowFullAccess && !hasPlaintextRoute;
	const accessDowngraded = params.allowFullAccess && hasPlaintextRoute;
	const issuedBootstrap = await issueDeviceBootstrapToken({
		...assertCurrent ? { assertCurrent } : {},
		profile: fullAccess ? {
			roles: [...PAIRING_SETUP_BOOTSTRAP_PROFILE.roles],
			scopes: ["operator.admin", ...PAIRING_SETUP_BOOTSTRAP_PROFILE.scopes],
			purpose: "mobile-full"
		} : PAIRING_SETUP_BOOTSTRAP_PROFILE
	});
	return {
		url: params.url,
		bootstrapToken: issuedBootstrap.token,
		expiresAtMs: issuedBootstrap.expiresAtMs,
		access: fullAccess ? "full" : "limited",
		...accessDowngraded ? { accessDowngraded: true } : {}
	};
}
async function sendQrPngToSupportedChannel(params) {
	const mediaLocalRoots = [path.dirname(params.qrFilePath)];
	const accountId = normalizeOptionalString(params.ctx.accountId) || void 0;
	const send = (await params.api.runtime.channel.outbound.loadAdapter(params.ctx.channel))?.sendMedia;
	if (!send) return false;
	await send({
		cfg: params.api.config,
		to: params.target,
		text: params.caption,
		...params.ctx.channel === "whatsapp" ? { verbose: false } : {},
		mediaUrl: params.qrFilePath,
		mediaLocalRoots,
		...params.ctx.messageThreadId != null && (params.ctx.channel === "telegram" || params.ctx.channel === "slack") ? { threadId: params.ctx.channel === "slack" ? String(params.ctx.messageThreadId) : params.ctx.messageThreadId } : {},
		...accountId ? { accountId } : {}
	});
	return true;
}
var device_pair_default = definePluginEntry({
	id: "device-pair",
	name: "Device Pair",
	description: "QR/bootstrap pairing helpers for OpenClaw devices",
	register(api) {
		api.registerService({
			id: "device-pair-notifier",
			apiVersion: 2,
			start: async ({ scheduler }) => {
				const { startPairingNotifier } = await loadNotifyModule();
				startPairingNotifier(api, scheduler);
			}
		});
		api.registerCommand({
			name: "pair",
			description: "Generate setup codes and approve device pairing requests.",
			acceptsArgs: true,
			clientPresentation: {
				when: "no-arguments",
				action: { kind: "device-pairing" }
			},
			requiredScopes: ["operator.pairing"],
			handler: async (ctx) => {
				const assertAdmittedOwner = ctx.assertOwnerCurrent;
				const tokens = (normalizeOptionalString(ctx.args) ?? "").split(/\s+/).filter(Boolean);
				const action = normalizeLowercaseStringOrEmpty(tokens[0]);
				const gatewayClientScopes = Array.isArray(ctx.gatewayClientScopes) ? ctx.gatewayClientScopes : void 0;
				const { resolveAuthLabel, resolvePairingCommandAuthState } = await loadPairCommandAuthModule();
				const authState = resolvePairingCommandAuthState({
					channel: ctx.channel,
					gatewayClientScopes,
					senderIsOwner: ctx.senderIsOwner
				});
				const assertOwnerCurrent = authState.isInternalGatewayCaller ? void 0 : assertAdmittedOwner;
				api.logger.info?.(`device-pair: /pair invoked channel=${ctx.channel} sender=${ctx.senderId ?? "unknown"} action=${action || "new"}`);
				if (authState.isMissingPairingPrivilege) return { text: "⚠️ This command requires operator.pairing." };
				assertOwnerCurrent?.();
				if (action === "status" || action === "pending") {
					const [{ listDevicePairing }, { formatPendingRequests }] = await Promise.all([loadDevicePairApiModule(), loadNotifyModule()]);
					const list = await listDevicePairing();
					assertOwnerCurrent?.();
					return { text: formatPendingRequests(list.pending) };
				}
				if (action === "notify") {
					const notifyAction = normalizeLowercaseStringOrEmpty(tokens[1]) || "status";
					const { handleNotifyCommand } = await loadNotifyModule();
					return await handleNotifyCommand({
						api,
						ctx: {
							...ctx,
							assertOwnerCurrent
						},
						action: notifyAction
					});
				}
				if (action === "approve") {
					const [{ listDevicePairing }, { approvePendingPairingRequest, selectPendingApprovalRequest }] = await Promise.all([loadDevicePairApiModule(), loadPairCommandApproveModule()]);
					const selected = selectPendingApprovalRequest({
						pending: (await listDevicePairing()).pending,
						requested: normalizeOptionalString(tokens[1])
					});
					if (selected.reply) return selected.reply;
					const pending = selected.pending;
					if (!pending) return { text: "Pairing request not found." };
					return await approvePendingPairingRequest({
						requestId: pending.requestId,
						callerScopes: authState.approvalCallerScopes,
						assertCurrent: assertOwnerCurrent
					});
				}
				if (action === "cleanup" || action === "clear" || action === "revoke") {
					const { clearDeviceBootstrapTokens } = await loadDevicePairApiModule();
					const cleared = await clearDeviceBootstrapTokens({ assertCurrent: assertOwnerCurrent });
					return { text: cleared.removed > 0 ? `Invalidated ${cleared.removed} unused setup code${cleared.removed === 1 ? "" : "s"}.` : "No unused setup codes were active." };
				}
				if (authState.isMissingSetupHandoffPrivilege) return { text: "⚠️ Setup code handoff includes Talk secrets and requires operator.talk.secrets." };
				const authLabelResult = resolveAuthLabel(api.config);
				if (authLabelResult.error) return { text: `Error: ${authLabelResult.error}` };
				const urlResult = await resolveMobilePairingGatewayUrl(api);
				if (!urlResult.url) return { text: `Error: ${urlResult.error ?? "Gateway URL unavailable."}` };
				const authLabel = authLabelResult.label ?? "auth";
				if (action === "qr") {
					const channel = ctx.channel;
					const target = resolveQrReplyTarget(ctx);
					let autoNotifyArmed = false;
					if (channel === "telegram" && target) try {
						const { armPairNotifyOnce } = await loadNotifyModule();
						autoNotifyArmed = await armPairNotifyOnce({
							api,
							ctx: {
								...ctx,
								assertOwnerCurrent
							}
						});
					} catch (err) {
						api.logger.warn?.(`device-pair: failed to arm one-shot pairing notify (${err?.message ?? err})`);
					}
					let payload = await issueSetupPayload({
						url: urlResult.url,
						allowFullAccess: authState.canIssueFullAccessSetup,
						assertCurrent: assertOwnerCurrent
					});
					let setupCode = encodeSetupCode(payload);
					const infoLines = buildQrInfoLines({
						payload,
						authLabel,
						autoNotifyArmed
					});
					if (target && QR_SUPPORTED_CHANNELS.has(channel)) {
						let qrFilePath;
						try {
							const { resolvePreferredOpenClawTmpDir, writeQrPngTempFile } = await loadDevicePairApiModule();
							qrFilePath = (await writeQrPngTempFile(setupCode, {
								tmpRoot: resolvePreferredOpenClawTmpDir(),
								dirPrefix: "device-pair-qr-",
								fileName: "pair-qr.png"
							})).filePath;
							if (await sendQrPngToSupportedChannel({
								api,
								ctx,
								target,
								caption: [
									"Scan this QR code with the OpenClaw iOS app:",
									"",
									...infoLines
								].join("\n"),
								qrFilePath
							})) return { text: `QR code sent above.\nExpires: ${formatDurationMinutes(payload.expiresAtMs)}\nIMPORTANT: Run /pair cleanup after pairing finishes.` };
						} catch (err) {
							const { revokeDeviceBootstrapToken } = await loadDevicePairApiModule();
							api.logger.warn?.(`device-pair: QR image send failed channel=${channel}, falling back (${err?.message ?? err})`);
							await revokeDeviceBootstrapToken({ token: payload.bootstrapToken }).catch(() => {});
							payload = await issueSetupPayload({
								url: urlResult.url,
								allowFullAccess: authState.canIssueFullAccessSetup,
								assertCurrent: assertOwnerCurrent
							});
							setupCode = encodeSetupCode(payload);
						} finally {
							if (qrFilePath) await rm(path.dirname(qrFilePath), {
								recursive: true,
								force: true
							}).catch(() => {});
						}
					}
					api.logger.info?.(`device-pair: QR fallback channel=${channel} target=${target}`);
					if (channel === "webchat") {
						try {
							const { renderQrPngDataUrl } = await loadDevicePairApiModule();
							await renderQrPngDataUrl(setupCode);
						} catch (err) {
							const { revokeDeviceBootstrapToken } = await loadDevicePairApiModule();
							api.logger.warn?.(`device-pair: webchat QR render failed, falling back (${err?.message ?? err})`);
							await revokeDeviceBootstrapToken({ token: payload.bootstrapToken }).catch(() => {});
							payload = await issueSetupPayload({
								url: urlResult.url,
								allowFullAccess: authState.canIssueFullAccessSetup,
								assertCurrent: assertOwnerCurrent
							});
							return { text: "QR image delivery is not available on this channel right now, so I generated a pasteable setup code instead.\n\n" + formatSetupReply(payload, authLabel) };
						}
						return {
							text: [
								"Scan this QR code with the OpenClaw iOS app:",
								"",
								buildQrInfoLines({
									payload,
									authLabel,
									autoNotifyArmed,
									markdown: true
								}).join("\n")
							].join("\n"),
							channelData: { openclawPairingQr: {
								setupCode,
								expiresAtMs: payload.expiresAtMs
							} },
							sensitiveMedia: true
						};
					}
					return { text: "QR image delivery is not available on this channel, so I generated a pasteable setup code instead.\n\n" + formatSetupReply(payload, authLabel) };
				}
				const channel = ctx.channel;
				const target = normalizeOptionalString(ctx.senderId) || normalizeOptionalString(ctx.from) || normalizeOptionalString(ctx.to) || "";
				const payload = await issueSetupPayload({
					url: urlResult.url,
					allowFullAccess: authState.canIssueFullAccessSetup,
					assertCurrent: assertOwnerCurrent
				});
				if (channel === "telegram" && target) try {
					const runtimeKeys = Object.keys(api.runtime ?? {});
					const channelKeys = Object.keys(api.runtime?.channel ?? {});
					api.logger.debug?.(`device-pair: runtime keys=${runtimeKeys.join(",") || "none"} channel keys=${channelKeys.join(",") || "none"}`);
					const send = (await api.runtime.channel.outbound.loadAdapter("telegram"))?.sendText;
					if (!send) throw new Error(`telegram runtime unavailable (runtime keys: ${runtimeKeys.join(",")}; channel keys: ${channelKeys.join(",")})`);
					await send({
						cfg: api.config,
						to: target,
						text: formatSetupInstructions(payload.expiresAtMs),
						...ctx.messageThreadId != null ? { threadId: ctx.messageThreadId } : {},
						...ctx.accountId ? { accountId: ctx.accountId } : {}
					});
					api.logger.info?.(`device-pair: telegram split send ok target=${target} account=${ctx.accountId ?? "none"} thread=${ctx.messageThreadId ?? "none"}`);
					return { text: encodeSetupCode(payload) };
				} catch (err) {
					api.logger.warn?.(`device-pair: telegram split send failed, falling back to single message (${err?.message ?? err})`);
				}
				return { text: formatSetupReply(payload, authLabel) };
			}
		});
	}
});
//#endregion
export { device_pair_default as default };
