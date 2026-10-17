import { m as normalizeUniqueSingleOrTrimmedStringList } from "./string-normalization-CECOqf64.mjs";
import { n as sanitizeTerminalText } from "./safe-text-SY_CvCi3.mjs";
import { r as resolveStateDir } from "./state-dir-BHJORNly.mjs";
import "./paths-DGIwWbpu.mjs";
import { t as formatCliCommand } from "./command-format-DwEdrDKL.mjs";
import { t as quoteCliArg } from "./quote-cli-arg-BEt71TUh.mjs";
import { a as roleScopesAllow } from "./operator-scope-compat-Ci6GBcmU.mjs";
import { n as loadDeviceIdentityIfPresent } from "./device-identity-KmxGQO-v.mjs";
import { t as note } from "./note-Byxgt4MB.mjs";
import { n as normalizeDeviceAuthScopes } from "./device-auth-DIR2dK9a.mjs";
import { o as loadDeviceAuthTokens } from "./device-auth-store-BEiXAvyd.mjs";
import { r as listApprovedPairedDeviceRoles } from "./device-pairing-identity-f0QUXRJo.mjs";
import { a as listDevicePairingReadOnly } from "./device-pairing-Drmq_Czv.mjs";
import { r as summarizeDeviceTokens } from "./device-pairing-token-utils-BIebfL9d.mjs";
import "./device-pairing-tokens-BD-uMVyw.mjs";
//#region src/commands/doctor-device-pairing.ts
const DEVICE_PAIRING_CHECK_ID = "core/doctor/device-pairing";
function normalizeGatewayPairedDevice(device) {
	return {
		...device,
		tokenSummaries: device.tokens ?? []
	};
}
function normalizeLocalPairedDevice(device) {
	return {
		...device,
		tokenSummaries: summarizeDeviceTokens(device.tokens) ?? []
	};
}
async function loadDoctorPairingSnapshot(params) {
	if (params.healthOk) try {
		const { bindAgentToolGatewayRequest } = await import("./in-process-gateway-CxG76lQB.mjs");
		const payload = await bindAgentToolGatewayRequest({ hostedOnly: true })({
			method: "device.pair.list",
			timeoutMs: 5e3,
			config: params.cfg
		});
		return {
			pending: payload.pending,
			paired: payload.paired.map((device) => normalizeGatewayPairedDevice(device))
		};
	} catch {}
	if (params.cfg.gateway?.mode === "remote") return null;
	const local = await listDevicePairingReadOnly();
	return {
		pending: local.pending,
		paired: local.paired.map((device) => normalizeLocalPairedDevice(device))
	};
}
function resolveApprovedScopes(device) {
	return normalizeDeviceAuthScopes(device.approvedScopes ?? device.scopes);
}
function formatValues(values) {
	return values.length > 0 ? values.join(", ") : "none";
}
function formatCliArgs(args) {
	return formatCliCommand(args.map(quoteCliArg).join(" "));
}
function describeDevice(params) {
	const label = sanitizeTerminalText(params.displayName?.trim() || "") || sanitizeTerminalText(params.clientId?.trim() || "");
	return label ? `${label} (${params.deviceId})` : params.deviceId;
}
function findTokenSummary(device, role) {
	const normalizedRole = role.trim();
	return device.tokenSummaries.find((entry) => entry.role === normalizedRole && !entry.revokedAtMs);
}
function collectPendingPairingFindings(snapshot) {
	const pairedByDeviceId = new Map(snapshot.paired.map((device) => [device.deviceId, device]));
	return snapshot.pending.map((pending) => {
		const paired = pairedByDeviceId.get(pending.deviceId);
		const deviceLabel = describeDevice(pending);
		const approveCommand = formatCliArgs([
			"openclaw",
			"devices",
			"approve",
			pending.requestId
		]);
		const inspectCommand = formatCliArgs([
			"openclaw",
			"devices",
			"list"
		]);
		const fixHint = `Review with ${inspectCommand}, then approve with ${approveCommand}.`;
		const finding = {
			checkId: DEVICE_PAIRING_CHECK_ID,
			severity: "warning",
			path: "devices.pending",
			target: `${pending.deviceId}:${pending.requestId}`,
			fixHint
		};
		if (!paired) return {
			...finding,
			requirement: "first-time",
			message: `Pending device pairing request ${pending.requestId} for ${deviceLabel}. ${fixHint}`
		};
		if (paired.publicKey !== pending.publicKey) {
			const repairHint = `Remove the stale record with ${formatCliArgs([
				"openclaw",
				"devices",
				"remove",
				pending.deviceId
			])}, then rerun ${inspectCommand} and approve with ${approveCommand}.`;
			return {
				...finding,
				requirement: "public-key-repair",
				message: `Pending device repair ${pending.requestId} for ${deviceLabel}: the current device identity no longer matches the approved pairing record. This commonly loops on pairing-required for an already paired device. ${repairHint}`,
				fixHint: repairHint
			};
		}
		const requestedRoles = normalizeUniqueSingleOrTrimmedStringList([pending.roles, pending.role].flat());
		const approvedRoles = listApprovedPairedDeviceRoles(paired);
		if (requestedRoles.some((role) => !approvedRoles.includes(role))) return {
			...finding,
			requirement: "role-upgrade",
			message: `Pending role upgrade ${pending.requestId} for ${deviceLabel}: approved roles [${formatValues(approvedRoles)}], requested roles [${formatValues(requestedRoles)}]. ${fixHint}`
		};
		const approvedScopes = resolveApprovedScopes(paired);
		const requestedScopes = normalizeDeviceAuthScopes(pending.scopes);
		if (requestedRoles.some((role) => !roleScopesAllow({
			role,
			requestedScopes: requestedScopes.filter((scope) => role === "operator" ? scope.startsWith("operator.") : !scope.startsWith("operator.")),
			allowedScopes: approvedScopes
		}))) return {
			...finding,
			requirement: "scope-upgrade",
			message: `Pending scope upgrade ${pending.requestId} for ${deviceLabel}: approved scopes [${formatValues(approvedScopes)}], requested scopes [${formatValues(requestedScopes)}]. ${fixHint}`
		};
		return {
			...finding,
			requirement: "repair",
			message: `Pending device repair ${pending.requestId} for ${deviceLabel}: the device is already paired, but a new approval is still required before the requested auth can be used. ${fixHint}`
		};
	});
}
function collectPairedRecordFindings(snapshot) {
	const findings = [];
	for (const device of snapshot.paired) {
		const deviceLabel = describeDevice(device);
		const finding = {
			checkId: DEVICE_PAIRING_CHECK_ID,
			severity: "warning",
			path: "devices.paired",
			target: device.deviceId
		};
		const approvedRoles = listApprovedPairedDeviceRoles(device);
		const approvedScopes = resolveApprovedScopes(device);
		if (approvedRoles.includes("operator") && approvedScopes.length === 0) findings.push({
			...finding,
			requirement: "missing-operator-scope-baseline",
			message: `Paired device ${deviceLabel} is missing its approved operator scope baseline. Scope upgrades can get stuck in pairing-required until the device repairs or is re-approved.`
		});
		for (const role of approvedRoles) {
			const token = findTokenSummary(device, role);
			const rotateCommand = formatCliArgs([
				"openclaw",
				"devices",
				"rotate",
				"--device",
				device.deviceId,
				"--role",
				role
			]);
			if (!token) {
				findings.push({
					...finding,
					target: role ? `${device.deviceId}:${role}` : device.deviceId,
					requirement: "missing-active-role-token",
					message: `Paired device ${deviceLabel} has no active ${role} device token even though the role is approved. This commonly ends in pairing-required or device-token-mismatch. Rotate a fresh token with ${rotateCommand}.`,
					fixHint: `Rotate a fresh token with ${rotateCommand}.`
				});
				continue;
			}
			if (token.scopes.length > 0 && !roleScopesAllow({
				role,
				requestedScopes: token.scopes,
				allowedScopes: approvedScopes
			})) {
				const recoveryCommand = role === "node" ? `${rotateCommand} --no-scopes` : rotateCommand;
				findings.push({
					...finding,
					target: role ? `${device.deviceId}:${role}` : device.deviceId,
					requirement: "token-outside-approved-scope",
					message: `Paired device ${deviceLabel} has a ${role} token outside the approved scope baseline [${formatValues(approvedScopes)}]. Rotate it with ${recoveryCommand}.`,
					fixHint: `Rotate it with ${recoveryCommand}.`
				});
			}
		}
	}
	return findings;
}
function readLocalIdentity(env = process.env) {
	try {
		return loadDeviceIdentityIfPresent({ env });
	} catch {
		return null;
	}
}
async function collectLocalDeviceAuthFindings(snapshot) {
	const identity = readLocalIdentity();
	if (!identity) return [];
	const localTokens = await loadDeviceAuthTokens({
		deviceId: identity.deviceId,
		env: process.env
	}).catch(() => []);
	const paired = snapshot.paired.find((device) => device.deviceId === identity.deviceId);
	if (!paired) return [];
	const deviceLabel = describeDevice(paired);
	const findings = [];
	const approvedRoles = new Set(listApprovedPairedDeviceRoles(paired));
	for (const entry of localTokens) {
		const role = entry.role.trim();
		if (!role) continue;
		const finding = {
			checkId: DEVICE_PAIRING_CHECK_ID,
			severity: "warning",
			path: "identity.device-auth",
			target: `${paired.deviceId}:${role}`
		};
		const pairedToken = findTokenSummary(paired, role);
		if (!pairedToken) {
			if (approvedRoles.has(role)) continue;
			findings.push({
				...finding,
				requirement: "local-role-no-longer-approved",
				message: `Local cached ${role} device auth for ${deviceLabel} no longer has a matching active gateway token, and that role is no longer approved for this device. Reconnect with shared gateway auth to refresh local auth, or remove the stale cached ${role} auth entry.`,
				fixHint: `Reconnect with shared gateway auth to refresh local auth, or remove the stale cached ${role} auth entry.`
			});
			continue;
		}
		const rotateCommand = formatCliArgs([
			"openclaw",
			"devices",
			"rotate",
			"--device",
			paired.deviceId,
			"--role",
			role
		]);
		const gatewayIssuedAtMs = pairedToken.rotatedAtMs ?? pairedToken.createdAtMs;
		if (entry.updatedAtMs < gatewayIssuedAtMs) {
			findings.push({
				...finding,
				requirement: "local-token-stale",
				message: `Local cached ${role} device token for ${deviceLabel} predates the gateway rotation. This is a stale device-token pattern and can fail with device token mismatch. Reconnect with shared gateway auth to refresh it, or rotate again with ${rotateCommand}.`,
				fixHint: `Reconnect with shared gateway auth to refresh it, or rotate again with ${rotateCommand}.`
			});
			continue;
		}
		const cachedScopes = normalizeDeviceAuthScopes(entry.scopes);
		const pairedScopes = normalizeDeviceAuthScopes(pairedToken.scopes);
		if (cachedScopes.join("\n") !== pairedScopes.join("\n")) findings.push({
			...finding,
			requirement: "local-scopes-mismatch",
			message: `Local cached ${role} device scopes for ${deviceLabel} differ from the gateway record. Cached scopes [${formatValues(cachedScopes)}], gateway scopes [${formatValues(pairedScopes)}]. Reconnect with shared gateway auth to refresh it, or rotate with ${rotateCommand}.`,
			fixHint: `Reconnect with shared gateway auth to refresh it, or rotate with ${rotateCommand}.`
		});
	}
	return findings;
}
async function collectLegacyPairingStoreFindings(cfg) {
	if (cfg.gateway?.mode === "remote") return [];
	const { listLegacyPairingStoreFiles } = await import("./pairing-files-G84EfDJu.mjs");
	return (await listLegacyPairingStoreFiles()).map((filePath) => ({
		checkId: DEVICE_PAIRING_CHECK_ID,
		severity: "warning",
		message: `Legacy pairing store ${filePath} has not been imported into SQLite. Stop the Gateway and run openclaw doctor --fix. Unreadable sources remain in place for repair.`,
		path: "devices.legacy-store",
		requirement: "pairing-store-legacy-file",
		fixHint: "Stop the Gateway and run openclaw doctor --fix to import and archive the legacy pairing stores."
	}));
}
async function collectDevicePairingHealthFindings(params) {
	const legacyStoreFindings = await collectLegacyPairingStoreFindings(params.cfg);
	const { detectLegacyDeviceAuth } = await import("./state-migrations.device-auth-Bn-Ey7_8.mjs");
	const deviceAuth = detectLegacyDeviceAuth({ stateDir: resolveStateDir(params.env) });
	if (deviceAuth.sourcePresent) {
		const fixHint = `Stop the Gateway and run ${formatCliCommand("openclaw doctor --fix", params.env)} to finish migration or cleanup.`;
		legacyStoreFindings.push({
			checkId: DEVICE_PAIRING_CHECK_ID,
			severity: "warning",
			message: `Legacy device auth store ${sanitizeTerminalText(deviceAuth.sourcePath)} is still present, so doctor cannot inspect locally cached device tokens. ${fixHint}`,
			path: "identity.device-auth",
			requirement: "device-auth-store-legacy-file",
			fixHint
		});
	}
	const snapshot = await loadDoctorPairingSnapshot({
		cfg: params.cfg,
		healthOk: params.healthOk ?? false
	});
	if (!snapshot) return legacyStoreFindings;
	return [
		...legacyStoreFindings,
		...collectPendingPairingFindings(snapshot),
		...collectPairedRecordFindings(snapshot),
		...await collectLocalDeviceAuthFindings(snapshot)
	];
}
/** Render the same local migration and pairing findings as structured Doctor output. */
async function noteDevicePairingHealth(params) {
	const findings = await collectDevicePairingHealthFindings(params);
	if (findings.length === 0) return;
	note(findings.map((finding) => `- ${finding.message}`).join("\n"), "Device pairing");
}
//#endregion
export { collectDevicePairingHealthFindings, noteDevicePairingHealth };
