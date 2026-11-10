import { n as resolveOpenClawPackageRoot } from "./openclaw-root-CPodxfi3.mjs";
import { t as quoteCliArg } from "./quote-cli-arg-BEt71TUh.mjs";
import { t as VERSION } from "./version-jg_14gWz.mjs";
import { r as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-BDhKaXgP.mjs";
import { a as channelToNpmTag, l as resolveEffectiveUpdateChannel } from "./update-channels-l0GQCX9n.mjs";
import { Ng as errorShape, Qt as validateDevicePairSetupStatusParams, Zt as validateDevicePairSetupCodeParams } from "./src-pLJQA6J5.mjs";
import { s as isLoopbackHost } from "./net-CjQwRK-V.mjs";
import { t as ErrorCodes } from "./gateway-error-details-Cl-eEOTQ.mjs";
import { i as runCommandWithTimeout } from "./exec-Bf6uhUA7.mjs";
import { a as NODE_PAIRING_SETUP_BOOTSTRAP_PROFILE, o as PAIRING_SETUP_BOOTSTRAP_PROFILE, s as VOICE_NODE_PAIRING_SETUP_BOOTSTRAP_PROFILE } from "./device-bootstrap-profile-DQKf7Vz1.mjs";
import { n as respondUnavailableOnThrow } from "./response-ajmyFl3V.mjs";
import { t as assertValidParams } from "./validation--xIH1Pj-.mjs";
import { t as fetchNpmPackageTargetStatus } from "./update-check-package-target-B_9onsoT.mjs";
import { c as resolveUpdateInstallKind } from "./update-check-hpRujh0z.mjs";
import { a as readGatewayRequestMutationAuthority } from "./session-mutation-guards-ClTdEKsf.mjs";
import { n as renderQrPngDataUrl } from "./qr-image-qJPF43DW.mjs";
import { l as readDevicePairSetupCompletion } from "./device-bootstrap-FJ4oQdcl.mjs";
import { o as resolvePairingSetupFromConfig, r as encodePairingSetupCode } from "./setup-code-CNtEQo_X.mjs";
import { n as registerDevicePairingJoinCode } from "./device-pairing-join-code-BwhNbyft.mjs";
import { n as currentUpdateCheckLifecycle } from "./update-check-lifecycle-Di8qaxGD.mjs";
//#region src/gateway/server-methods/device-pair-setup.ts
const MAX_QR_DATA_URL_LENGTH = 16384;
function resolveDevicePairingJoinBaseUrl(payload) {
	for (const candidate of payload.urls ?? [payload.url]) {
		const parsed = new URL(candidate);
		if (parsed.protocol === "wss:" || parsed.protocol === "ws:" && isLoopbackHost(parsed.hostname)) {
			parsed.protocol = parsed.protocol === "wss:" ? "https:" : "http:";
			return parsed;
		}
	}
	throw new Error("Join URLs require a TLS gateway endpoint, except for loopback. Use the setup code directly for plaintext LAN pairing.");
}
async function resolveJoinPackage() {
	const status = currentUpdateCheckLifecycle().installStatus?.status ?? { installKind: await resolveUpdateInstallKind(await resolveOpenClawPackageRoot({
		moduleUrl: import.meta.url,
		argv1: process.argv[1]
	}), { timeoutMs: 1e3 }).catch(() => "unknown") };
	const versionNote = "The machine needs a matching Gateway build; the exact npm release could not be confirmed.";
	if (status.installKind === "package" || status.installKind === "host") {
		if ((await fetchNpmPackageTargetStatus({
			target: VERSION,
			timeoutMs: 1e3
		})).version === VERSION) return { packageSpec: `openclaw@${VERSION}` };
	}
	const channel = resolveEffectiveUpdateChannel({
		currentVersion: VERSION,
		...status
	}).channel;
	const tag = channelToNpmTag(channel);
	return {
		packageSpec: (await fetchNpmPackageTargetStatus({
			target: tag,
			timeoutMs: 1e3
		})).version ? `openclaw@${tag}` : "openclaw",
		versionNote
	};
}
const devicePairSetupHandlers = {
	"device.pair.setupCode": async (options) => {
		const { params, respond, context } = options;
		if (!assertValidParams(params, validateDevicePairSetupCodeParams, "device.pair.setupCode", respond)) return;
		await respondUnavailableOnThrow(respond, async () => {
			if (params.joinUrl === true && params.bootstrapProfile !== void 0 && params.bootstrapProfile !== "node") {
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "Join URLs require bootstrapProfile=node."));
				return;
			}
			const config = context.getRuntimeConfig();
			const joinContext = params.joinUrl === true ? captureOpenClawStateWorkerContext() : void 0;
			const authority = readGatewayRequestMutationAuthority(options);
			const assertJoinCurrent = joinContext ? () => {
				joinContext.admission.assertCurrent();
				authority.assertCurrent();
				if (context.getRuntimeConfig() !== config) throw new Error("Device pairing setup configuration changed.");
			} : void 0;
			assertJoinCurrent?.();
			const requestPublicUrl = params.publicUrl;
			const resolved = await resolvePairingSetupFromConfig(config, {
				env: process.env,
				publicUrl: requestPublicUrl,
				preferRemoteUrl: params.preferRemoteUrl === true,
				useLocalGateway: config.gateway?.mode === "remote" && params.preferRemoteUrl !== true,
				localTlsFingerprint: context.gatewayTlsFingerprint,
				...params.joinUrl === true || params.bootstrapProfile ? { bootstrapProfile: params.joinUrl === true || params.bootstrapProfile === "node" ? NODE_PAIRING_SETUP_BOOTSTRAP_PROFILE : params.bootstrapProfile === "voice-node" ? VOICE_NODE_PAIRING_SETUP_BOOTSTRAP_PROFILE : PAIRING_SETUP_BOOTSTRAP_PROFILE } : {},
				runCommandWithTimeout: async (argv, runOpts) => await runCommandWithTimeout(argv, { timeoutMs: runOpts.timeoutMs })
			});
			assertJoinCurrent?.();
			if (!resolved.ok) {
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, resolved.error));
				return;
			}
			const setupCode = encodePairingSetupCode(resolved.payload);
			let joinUrl;
			let joinCommands;
			if (params.joinUrl === true) {
				const parsedJoinUrl = resolveDevicePairingJoinBaseUrl(resolved.payload);
				const { packageSpec, versionNote } = await resolveJoinPackage();
				assertJoinCurrent?.();
				const shortcode = await registerDevicePairingJoinCode({
					payload: resolved.payload,
					expiresAtMs: resolved.expiresAtMs,
					context: joinContext,
					assertCurrent: assertJoinCurrent
				});
				parsedJoinUrl.pathname = `${parsedJoinUrl.pathname.replace(/\/+$/u, "")}/j/${shortcode}`;
				parsedJoinUrl.search = "";
				parsedJoinUrl.hash = "";
				joinUrl = parsedJoinUrl.toString();
				const target = quoteCliArg(joinUrl);
				const serviceCommand = `npx -y ${packageSpec} connect ${target} --service`;
				joinCommands = {
					command: `${serviceCommand} --session-host`,
					serviceCommand,
					installedCommand: `openclaw connect ${target} --service --session-host`,
					...versionNote ? { versionNote } : {}
				};
			}
			const renderedQr = params.includeQr !== false ? await renderQrPngDataUrl(setupCode).catch(() => void 0) : void 0;
			const qrDataUrl = renderedQr && renderedQr.length <= MAX_QR_DATA_URL_LENGTH ? renderedQr : void 0;
			assertJoinCurrent?.();
			respond(true, {
				setupId: resolved.setupId,
				expiresAtMs: resolved.expiresAtMs,
				setupCode,
				...joinUrl ? {
					joinUrl,
					...joinCommands
				} : {},
				...qrDataUrl ? { qrDataUrl } : {},
				gatewayUrl: resolved.payload.url,
				...resolved.payload.urls ? { gatewayUrls: resolved.payload.urls } : {},
				auth: resolved.authLabel,
				urlSource: requestPublicUrl ? "request.publicUrl" : resolved.urlSource,
				access: resolved.access,
				...resolved.accessDowngraded ? { accessDowngraded: true } : {}
			}, void 0);
		});
	},
	"device.pair.setupStatus": async ({ params, respond }) => {
		if (!assertValidParams(params, validateDevicePairSetupStatusParams, "device.pair.setupStatus", respond)) return;
		await respondUnavailableOnThrow(respond, async () => {
			const completion = await readDevicePairSetupCompletion({ setupId: params.setupId });
			let result = {};
			if (completion) {
				const payload = {
					setupId: completion.setupId,
					deviceId: completion.deviceId,
					...completion.deviceName ? { deviceName: completion.deviceName } : {},
					access: completion.access,
					ts: completion.completedAtMs
				};
				result = completion.deliveryState === "confirmed" ? { completion: payload } : { deliveryUncertain: payload };
			}
			respond(true, result, void 0);
		});
	}
};
//#endregion
export { devicePairSetupHandlers };
