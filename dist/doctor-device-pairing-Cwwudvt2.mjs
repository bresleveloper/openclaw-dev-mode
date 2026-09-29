import { m as normalizeUniqueSingleOrTrimmedStringList } from "./string-normalization-_gRhJUDw.mjs";
import { t as formatCliCommand } from "./command-format-DRYc0E-8.mjs";
import { E as resolveStateDir } from "./paths-DehQwyE0.mjs";
import { n as sanitizeTerminalText } from "./safe-text-CBmKtmbt.mjs";
import { t as quoteCliArg } from "./quote-cli-arg-BEt71TUh.mjs";
import { n as normalizeDeviceAuthScopes } from "./device-auth-C-STNejO.mjs";
import { a as loadDeviceAuthTokens } from "./device-auth-store-DdN7RDpE.mjs";
import { r as loadDeviceIdentityIfPresent } from "./device-identity-B_zMrBd6.mjs";
import { a as roleScopesAllow } from "./operator-scope-compat-Ci6GBcmU.mjs";
import { t as note } from "./note-UlSlsJKw.mjs";
import { r as listApprovedPairedDeviceRoles } from "./device-pairing-identity-BnU9nqx2.mjs";
import { a as listDevicePairingReadOnly } from "./device-pairing-DbLfxuuq.mjs";
import { r as summarizeDeviceTokens } from "./device-pairing-token-utils-DMt1Yqt3.mjs";
import "./device-pairing-tokens-ET3TWOUZ.mjs";
//#region src/commands/doctor-device-pairing.ts
/** Doctor diagnostics for pending, paired, and locally cached device auth state. */
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
		const { bindAgentToolGatewayRequest } = await import("./in-process-gateway-CSMvBDM8.mjs");
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
function formatScopes(scopes) {
	return scopes.length > 0 ? scopes.join(", ") : "none";
}
function formatRoles(roles) {
	return roles.length > 0 ? roles.join(", ") : "none";
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
function hasPendingScopeUpgrade(params) {
	for (const role of params.requestedRoles) {
		if (!params.approvedRoles.includes(role)) continue;
		const requestedForRole = params.pendingScopes.filter((scope) => role === "operator" ? scope.startsWith("operator.") : !scope.startsWith("operator."));
		if (requestedForRole.length === 0) continue;
		if (!roleScopesAllow({
			role,
			requestedScopes: requestedForRole,
			allowedScopes: params.approvedScopes
		})) return true;
	}
	return false;
}
function resolvePendingPairingIssue(pending, paired) {
	const deviceLabel = describeDevice({
		deviceId: pending.deviceId,
		displayName: pending.displayName,
		clientId: pending.clientId
	});
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
	if (!paired) return {
		kind: "first-time",
		pending,
		deviceLabel,
		approveCommand,
		inspectCommand
	};
	if (paired.publicKey !== pending.publicKey) return {
		kind: "public-key-repair",
		pending,
		deviceLabel,
		approveCommand,
		inspectCommand,
		removeCommand: formatCliArgs([
			"openclaw",
			"devices",
			"remove",
			pending.deviceId
		])
	};
	const requestedRoles = normalizeUniqueSingleOrTrimmedStringList([pending.roles, pending.role].flat());
	const approvedRoles = listApprovedPairedDeviceRoles(paired);
	if (requestedRoles.some((role) => !approvedRoles.includes(role))) return {
		kind: "role-upgrade",
		pending,
		deviceLabel,
		approveCommand,
		inspectCommand,
		approvedRoles,
		requestedRoles
	};
	const approvedScopes = resolveApprovedScopes(paired);
	const requestedScopes = normalizeDeviceAuthScopes(pending.scopes);
	if (hasPendingScopeUpgrade({
		requestedRoles,
		pendingScopes: requestedScopes,
		approvedRoles,
		approvedScopes
	})) return {
		kind: "scope-upgrade",
		pending,
		deviceLabel,
		approveCommand,
		inspectCommand,
		approvedScopes,
		requestedScopes
	};
	return {
		kind: "repair",
		pending,
		deviceLabel,
		approveCommand,
		inspectCommand
	};
}
function formatPendingPairingIssue(issue) {
	switch (issue.kind) {
		case "first-time": return `- Pending device pairing request ${issue.pending.requestId} for ${issue.deviceLabel}. Review with ${issue.inspectCommand}, then approve with ${issue.approveCommand}.`;
		case "public-key-repair": return `- Pending device repair ${issue.pending.requestId} for ${issue.deviceLabel}: the current device identity no longer matches the approved pairing record. This commonly loops on pairing-required for an already paired device. Remove the stale record with ${issue.removeCommand}, then rerun ${issue.inspectCommand} and approve with ${issue.approveCommand}.`;
		case "role-upgrade": return `- Pending role upgrade ${issue.pending.requestId} for ${issue.deviceLabel}: approved roles [${formatRoles(issue.approvedRoles)}], requested roles [${formatRoles(issue.requestedRoles)}]. Review with ${issue.inspectCommand}, then approve with ${issue.approveCommand}.`;
		case "scope-upgrade": return `- Pending scope upgrade ${issue.pending.requestId} for ${issue.deviceLabel}: approved scopes [${formatScopes(issue.approvedScopes)}], requested scopes [${formatScopes(issue.requestedScopes)}]. Review with ${issue.inspectCommand}, then approve with ${issue.approveCommand}.`;
		case "repair": return `- Pending device repair ${issue.pending.requestId} for ${issue.deviceLabel}: the device is already paired, but a new approval is still required before the requested auth can be used. Review with ${issue.inspectCommand}, then approve with ${issue.approveCommand}.`;
	}
	throw new Error("Unsupported pending pairing issue");
}
function collectPendingPairingIssues(snapshot) {
	const pairedByDeviceId = new Map(snapshot.paired.map((device) => [device.deviceId, device]));
	return snapshot.pending.map((pending) => resolvePendingPairingIssue(pending, pairedByDeviceId.get(pending.deviceId)));
}
function collectPairedRecordIssues(snapshot) {
	const issues = [];
	for (const device of snapshot.paired) {
		const deviceLabel = describeDevice({
			deviceId: device.deviceId,
			displayName: device.displayName,
			clientId: device.clientId
		});
		const approvedRoles = listApprovedPairedDeviceRoles(device);
		const approvedScopes = resolveApprovedScopes(device);
		if (approvedRoles.includes("operator") && approvedScopes.length === 0) issues.push({
			kind: "missing-operator-scope-baseline",
			deviceId: device.deviceId,
			deviceLabel,
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
				issues.push({
					kind: "missing-active-role-token",
					deviceId: device.deviceId,
					deviceLabel,
					role,
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
				issues.push({
					kind: "token-outside-approved-scope",
					deviceId: device.deviceId,
					deviceLabel,
					role,
					message: `Paired device ${deviceLabel} has a ${role} token outside the approved scope baseline [${formatScopes(approvedScopes)}]. Rotate it with ${recoveryCommand}.`,
					fixHint: `Rotate it with ${recoveryCommand}.`
				});
			}
		}
	}
	return issues;
}
function readLocalIdentity(env = process.env) {
	try {
		return loadDeviceIdentityIfPresent({ env });
	} catch {
		return null;
	}
}
async function readLocalDeviceAuthTokens(deviceId, env = process.env) {
	try {
		return await loadDeviceAuthTokens({
			deviceId,
			env
		});
	} catch {
		return [];
	}
}
async function collectLocalDeviceAuthIssues(snapshot) {
	const identity = readLocalIdentity();
	if (!identity) return [];
	const localTokens = await readLocalDeviceAuthTokens(identity.deviceId);
	const paired = snapshot.paired.find((device) => device.deviceId === identity.deviceId);
	if (!paired) return [];
	const deviceLabel = describeDevice({
		deviceId: paired.deviceId,
		displayName: paired.displayName,
		clientId: paired.clientId
	});
	const issues = [];
	const approvedRoles = new Set(listApprovedPairedDeviceRoles(paired));
	for (const entry of localTokens) {
		const role = entry.role.trim();
		if (!role) continue;
		const pairedToken = findTokenSummary(paired, role);
		if (!pairedToken) {
			if (approvedRoles.has(role)) continue;
			issues.push({
				kind: "local-role-no-longer-approved",
				deviceId: paired.deviceId,
				deviceLabel,
				role,
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
			issues.push({
				kind: "local-token-stale",
				deviceId: paired.deviceId,
				deviceLabel,
				role,
				message: `Local cached ${role} device token for ${deviceLabel} predates the gateway rotation. This is a stale device-token pattern and can fail with device token mismatch. Reconnect with shared gateway auth to refresh it, or rotate again with ${rotateCommand}.`,
				fixHint: `Reconnect with shared gateway auth to refresh it, or rotate again with ${rotateCommand}.`
			});
			continue;
		}
		const cachedScopes = normalizeDeviceAuthScopes(entry.scopes);
		const pairedScopes = normalizeDeviceAuthScopes(pairedToken.scopes);
		if (cachedScopes.join("\n") !== pairedScopes.join("\n")) issues.push({
			kind: "local-scopes-mismatch",
			deviceId: paired.deviceId,
			deviceLabel,
			role,
			message: `Local cached ${role} device scopes for ${deviceLabel} differ from the gateway record. Cached scopes [${formatScopes(cachedScopes)}], gateway scopes [${formatScopes(pairedScopes)}]. Reconnect with shared gateway auth to refresh it, or rotate with ${rotateCommand}.`,
			fixHint: `Reconnect with shared gateway auth to refresh it, or rotate with ${rotateCommand}.`
		});
	}
	return issues;
}
/** Warn about retired pairing stores that still need Doctor repair. */
async function collectLegacyPairingStoreFindings(cfg) {
	if (cfg.gateway?.mode === "remote") return [];
	const { listLegacyPairingStoreFiles } = await import("./pairing-files-YvXPx5Br.mjs");
	return (await listLegacyPairingStoreFiles()).map((filePath) => ({
		checkId: DEVICE_PAIRING_CHECK_ID,
		severity: "warning",
		message: `Legacy pairing store ${filePath} has not been imported into SQLite. Stop the Gateway and run openclaw doctor --fix. Unreadable sources remain in place for repair.`,
		path: "devices.legacy-store",
		requirement: "pairing-store-legacy-file",
		fixHint: "Stop the Gateway and run openclaw doctor --fix to import and archive the legacy pairing stores."
	}));
}
function stripListMarker(message) {
	return message.startsWith("- ") ? message.slice(2) : message;
}
function pendingPairingIssueToHealthFinding(issue) {
	const fixHint = issue.kind === "public-key-repair" ? `Remove the stale record with ${issue.removeCommand}, then rerun ${issue.inspectCommand} and approve with ${issue.approveCommand}.` : `Review with ${issue.inspectCommand}, then approve with ${issue.approveCommand}.`;
	return {
		checkId: DEVICE_PAIRING_CHECK_ID,
		severity: "warning",
		message: stripListMarker(formatPendingPairingIssue(issue)),
		path: "devices.pending",
		target: `${issue.pending.deviceId}:${issue.pending.requestId}`,
		requirement: issue.kind,
		fixHint
	};
}
function pairedRecordIssueToHealthFinding(issue) {
	return {
		checkId: DEVICE_PAIRING_CHECK_ID,
		severity: "warning",
		message: issue.message,
		path: "devices.paired",
		target: issue.role ? `${issue.deviceId}:${issue.role}` : issue.deviceId,
		requirement: issue.kind,
		...issue.fixHint ? { fixHint: issue.fixHint } : {}
	};
}
function localDeviceAuthIssueToHealthFinding(issue) {
	return {
		checkId: DEVICE_PAIRING_CHECK_ID,
		severity: "warning",
		message: issue.message,
		path: "identity.device-auth",
		target: `${issue.deviceId}:${issue.role}`,
		requirement: issue.kind,
		fixHint: issue.fixHint
	};
}
async function collectDevicePairingHealthFindings(params) {
	const legacyStoreFindings = await collectLegacyPairingStoreFindings(params.cfg);
	const { detectLegacyDeviceAuth } = await import("./state-migrations.device-auth-B9wMUdHH.mjs");
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
		...collectPendingPairingIssues(snapshot).map(pendingPairingIssueToHealthFinding),
		...collectPairedRecordIssues(snapshot).map(pairedRecordIssueToHealthFinding),
		...(await collectLocalDeviceAuthIssues(snapshot)).map(localDeviceAuthIssueToHealthFinding)
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
