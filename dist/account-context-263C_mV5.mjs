import { t as asBoolean } from "./boolean-BEb0Fdt8.mjs";
import { r as asNullableRecord } from "./record-coerce-TIsquoVR.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { n as resolveChannelAccount } from "./account-resolution-DCHDXWZ0.mjs";
import { r as hasConfiguredUnavailableCredentialStatus } from "./account-snapshot-fields-e1ulxwox.mjs";
import { a as resolveChannelAccountConfigured, o as resolveChannelAccountEnabled } from "./account-summary-CegAey_r.mjs";
import { t as inspectChannelAccount } from "./account-inspection-tN6nrtAL.mjs";
//#region src/gateway/health/account-context.ts
const PUBLIC_IMESSAGE_FULL_DISK_ACCESS_ERROR = "imsg cannot access ~/Library/Messages/chat.db. Grant Full Disk Access to the Gateway/launcher process and restart Gateway.";
function buildNonSensitiveProbeFailure(channelId, probe) {
	const record = asNullableRecord(probe);
	if (channelId !== "imessage" || !record || record.ok !== false) return;
	if (typeof record.error !== "string") return;
	const error = record.error.trim().replaceAll(/\/Users\/[^/\s]+\/Library\/Messages\/chat\.db/g, "~/Library/Messages/chat.db");
	if (!/\bimsg\b/i.test(error) || !error.includes("~/Library/Messages/chat.db") || !/\bFull Disk Access\b/i.test(error)) return;
	return {
		ok: false,
		error: PUBLIC_IMESSAGE_FULL_DISK_ACCESS_ERROR
	};
}
async function resolveHealthAccountContext(params) {
	const diagnostics = [];
	let inspectedAccount;
	try {
		inspectedAccount = await inspectChannelAccount(params);
	} catch (error) {
		diagnostics.push(`${params.plugin.id}:${params.accountId}: failed to inspect account (${formatErrorMessage(error)}).`);
	}
	const inspected = asNullableRecord(inspectedAccount);
	const inspectedEnabled = asBoolean(inspected?.enabled);
	const inspectedConfigured = asBoolean(inspected?.configured);
	let account;
	if (inspectedEnabled !== false && !hasConfiguredUnavailableCredentialStatus(inspectedAccount)) try {
		account = await resolveChannelAccount(params);
	} catch (error) {
		diagnostics.push(`${params.plugin.id}:${params.accountId}: failed to resolve account (${formatErrorMessage(error)}).`);
	}
	if (account === null || account === void 0) return {
		probeAccount: void 0,
		inspectedAccount,
		enabled: inspectedEnabled ?? false,
		configured: inspectedConfigured,
		diagnostics
	};
	let enabled = asBoolean(asNullableRecord(account)?.enabled) ?? true;
	try {
		enabled = resolveChannelAccountEnabled({
			plugin: params.plugin,
			account,
			cfg: params.cfg
		});
	} catch (error) {
		diagnostics.push(`${params.plugin.id}:${params.accountId}: failed to evaluate enabled state (${formatErrorMessage(error)}).`);
	}
	let configured = asBoolean(asNullableRecord(account)?.configured) ?? true;
	try {
		configured = await resolveChannelAccountConfigured({
			plugin: params.plugin,
			account,
			cfg: params.cfg,
			readAccountConfiguredField: true
		});
	} catch (error) {
		diagnostics.push(`${params.plugin.id}:${params.accountId}: failed to evaluate configured state (${formatErrorMessage(error)}).`);
	}
	return {
		probeAccount: account,
		inspectedAccount,
		enabled,
		configured,
		diagnostics
	};
}
//#endregion
export { resolveHealthAccountContext as n, buildNonSensitiveProbeFailure as t };
