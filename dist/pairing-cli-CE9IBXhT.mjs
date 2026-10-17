import { o as normalizeLowercaseStringOrEmpty, p as normalizeStringifiedOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { r as defaultRuntime } from "./runtime-DlO3PTAd.mjs";
import { t as formatCliCommand } from "./command-format-DwEdrDKL.mjs";
import { r as theme } from "./theme-DzaUZY4q.mjs";
import { t as normalizeAnyChannelId } from "./registry-normalize-BvpWSO2L.mjs";
import { r as getRuntimeConfig } from "./io.runtime-BSum32pK.mjs";
import "./config-9720xhC5.mjs";
import { t as GATEWAY_SERVER_CAPS } from "./server-capabilities-BTjjxElt.mjs";
import "./plugins-Z9_SzFi0.mjs";
import { d as notifyPairingApproved, u as listPairingChannels } from "./pairing-store-sqlite-Bo6V-Kb1.mjs";
import { o as listChannelPairingRequests, r as approveChannelPairingCode } from "./pairing-store-DEvhBgUm.mjs";
import { n as renderTable, t as getTerminalTableWidth } from "./table-CvWMfO8o.mjs";
import { t as resolvePairingIdLabel } from "./pairing-labels-DwhbR9mn.mjs";
import { t as formatDocsHelp } from "./help-format-xds_bDSp.mjs";
import { t as runWithLocalStateOwner } from "./local-state-owner-BvdPXRCn.mjs";
import { t as bootstrapCommandOwnerFromPairing } from "./command-owner-GroxPx5K.mjs";
//#region src/cli/pairing-cli.ts
/** Parse channel, allowing extension channels not in core registry. */
function parseChannel(raw, channels) {
	const value = normalizeLowercaseStringOrEmpty(normalizeStringifiedOptionalString(raw) ?? "");
	if (!value) throw new Error(`Missing channel. Use ${formatCliCommand("openclaw pairing list --channel <channel>")}.`);
	const normalized = normalizeAnyChannelId(value);
	if (normalized) {
		if (!channels.includes(normalized)) throw new Error(`Channel "${normalized}" does not support pairing. Supported pairing channels: ${channels.join(", ") || "none"}.`);
		return normalized;
	}
	if (/^[a-z][a-z0-9_-]{0,63}$/.test(value)) return value;
	throw new Error(`Invalid channel "${value}". Use lowercase letters, numbers, "_" or "-", for example "telegram".`);
}
function resolveAccountId(raw) {
	const accountId = normalizeStringifiedOptionalString(raw);
	if (raw !== void 0 && !accountId) throw new Error("--account must not be blank");
	return accountId;
}
function registerPairingCli(program) {
	const channels = listPairingChannels();
	const channelHint = channels.length > 0 ? channels.join(", ") : "none configured";
	const pairing = program.command("pairing").description("Secure DM pairing (approve inbound requests)").addHelpText("after", () => formatDocsHelp("/cli/pairing"));
	pairing.command("list").description("List pending pairing requests").option("--channel <channel>", `Channel (${channelHint})`).option("--account <accountId>", "Account id (for multi-account channels)").argument("[channel]", `Channel (${channelHint})`).option("--json", "Print JSON", false).action(async (channelArg, opts) => {
		const channelRaw = opts.channel ?? channelArg ?? (channels.length === 1 ? channels[0] : "");
		if (!channelRaw) {
			if (channels.length === 0) throw new Error(`No chat DM pairing channels are configured. To approve a TUI or device request, use ${formatCliCommand("openclaw devices approve")} instead.`);
			throw new Error(`Channel required (expected one of: ${channelHint}).`);
		}
		const channel = parseChannel(channelRaw, channels);
		if (opts.channel && channelArg) {
			const positionalChannel = parseChannel(channelArg, channels);
			if (channel !== positionalChannel) throw new Error(`Conflicting pairing channels: "${channel}" and "${positionalChannel}". Pass the channel either positionally or with --channel.`);
		}
		const accountId = resolveAccountId(opts.account);
		const requests = await runWithLocalStateOwner({
			method: "channels.pairing.list",
			params: {
				channel,
				format: "cli",
				...accountId ? { accountId } : {}
			},
			target: `${channel} pairing requests`,
			requiredCapabilities: [GATEWAY_SERVER_CAPS.CHANNELS_PAIRING_LIST_OWNER],
			runLocal: async ({ env, assertCurrent }) => await listChannelPairingRequests(channel, env, accountId, assertCurrent)
		});
		if (opts.json) {
			defaultRuntime.writeJson({
				channel,
				requests
			});
			return;
		}
		if (requests.length === 0) {
			defaultRuntime.log(theme.muted(`No pending ${channel} pairing requests.`));
			return;
		}
		const idLabel = resolvePairingIdLabel(channel);
		const tableWidth = getTerminalTableWidth();
		defaultRuntime.log(`${theme.heading("Pairing requests")} ${theme.muted(`(${requests.length})`)}`);
		defaultRuntime.log(renderTable({
			width: tableWidth,
			columns: [
				{
					key: "Code",
					header: "Code",
					minWidth: 10
				},
				{
					key: "ID",
					header: idLabel,
					minWidth: 12,
					flex: true
				},
				{
					key: "Meta",
					header: "Meta",
					minWidth: 8,
					flex: true
				},
				{
					key: "Requested",
					header: "Requested",
					minWidth: 12
				}
			],
			rows: requests.map((r) => ({
				Code: r.code,
				ID: r.meta?.senderId ?? r.id,
				Meta: r.meta ? JSON.stringify(r.meta) : "",
				Requested: r.createdAt
			}))
		}).trimEnd());
	});
	pairing.command("approve").description("Approve a pairing code and allow that sender").option("--channel <channel>", `Channel (${channelHint})`).option("--account <accountId>", "Account id (for multi-account channels)").argument("<codeOrChannel>", "Pairing code (or channel when using 2 args)").argument("[code]", "Pairing code (when channel is passed as the 1st arg)").option("--notify", "Notify the requester on the same channel", false).action(async (codeOrChannel, code, opts) => {
		const defaultChannel = channels.length === 1 ? channels[0] : "";
		const usingExplicitChannel = Boolean(opts.channel);
		const hasPositionalCode = code != null;
		const channelRaw = usingExplicitChannel ? opts.channel : hasPositionalCode ? codeOrChannel : defaultChannel;
		const resolvedCode = usingExplicitChannel ? codeOrChannel : hasPositionalCode ? code : codeOrChannel;
		if (!channelRaw || !resolvedCode) throw new Error(`Usage: ${formatCliCommand("openclaw pairing approve <channel> <code>")} (or: ${formatCliCommand("openclaw pairing approve --channel <channel> <code>")})`);
		if (opts.channel && code != null) throw new Error(`Too many arguments. Use: ${formatCliCommand("openclaw pairing approve --channel <channel> <code>")}`);
		const channel = parseChannel(channelRaw, channels);
		const accountId = resolveAccountId(opts.account);
		const params = {
			channel,
			code: String(resolvedCode),
			...accountId ? { accountId } : {}
		};
		const approved = await runWithLocalStateOwner({
			method: "channels.pairing.approve",
			params,
			target: `${channel} pairing request`,
			recoveryCommand: `openclaw pairing list --channel ${channel}`,
			requiredCapabilities: [GATEWAY_SERVER_CAPS.CHANNELS_PAIRING_APPROVE_OWNER],
			runLocal: async ({ env, assertCurrent }) => await approveChannelPairingCode({
				...params,
				env,
				assertCurrent
			})
		});
		if (!approved) throw new Error(`No pending pairing request found for code "${String(resolvedCode)}". Run ${formatCliCommand(`openclaw pairing list --channel ${channel}`)} to list pending requests.`);
		defaultRuntime.log(`${theme.success("Approved")} ${theme.muted(channel)} sender ${theme.command(approved.entry.meta?.senderId ?? approved.id)}.`);
		const ownerBootstrap = await bootstrapCommandOwnerFromPairing({
			channel,
			id: approved.id
		});
		if (ownerBootstrap.status === "configured" && ownerBootstrap.ownerEntry) defaultRuntime.log(`${theme.success("Command owner configured")} ${theme.command(ownerBootstrap.ownerEntry)} ${theme.muted("(commands.ownerAllowFrom was empty).")}`);
		if (!opts.notify) return;
		const approvedAccountId = accountId || normalizeStringifiedOptionalString(approved.entry?.meta?.accountId);
		try {
			await notifyPairingApproved({
				channelId: channel,
				id: approved.id,
				cfg: getRuntimeConfig(),
				...approvedAccountId ? { accountId: approvedAccountId } : {},
				...approved.entry.meta ? { meta: approved.entry.meta } : {}
			});
		} catch (err) {
			defaultRuntime.log(theme.warn(`Failed to notify requester: ${String(err)}`));
		}
	});
}
//#endregion
export { registerPairingCli };
