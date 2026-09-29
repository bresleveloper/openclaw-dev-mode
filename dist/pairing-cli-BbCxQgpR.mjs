import { o as normalizeLowercaseStringOrEmpty, p as normalizeStringifiedOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { r as defaultRuntime } from "./runtime-BC29JSZp.mjs";
import { t as formatCliCommand } from "./command-format-DRYc0E-8.mjs";
import { r as theme } from "./theme-DzaUZY4q.mjs";
import { r as getRuntimeConfig } from "./io.runtime-BN-rPaec.mjs";
import "./config-Ciq2mxdN.mjs";
import { t as formatDocsLink } from "./links-B3qXeqz-.mjs";
import { i as normalizeChannelId } from "./registry-D3wOWFDo.mjs";
import "./plugins-BEpDh--e.mjs";
import { d as listPairingChannels, f as notifyPairingApproved } from "./pairing-store-sqlite-CHi0Cj47.mjs";
import { o as listChannelPairingRequests, r as approveChannelPairingCode } from "./pairing-store-Cvj6ctV_.mjs";
import { n as renderTable, t as getTerminalTableWidth } from "./table-BRdXcJHh.mjs";
import { t as resolvePairingIdLabel } from "./pairing-labels-C5yUjxoo.mjs";
import { t as bootstrapCommandOwnerFromPairing } from "./command-owner-B7Oj0u0z.mjs";
//#region src/cli/pairing-cli.ts
/** Parse channel, allowing extension channels not in core registry. */
function parseChannel(raw, channels) {
	const value = normalizeLowercaseStringOrEmpty(normalizeStringifiedOptionalString(raw) ?? "");
	if (!value) throw new Error(`Missing channel. Use ${formatCliCommand("openclaw pairing list --channel <channel>")}.`);
	const normalized = normalizeChannelId(value);
	if (normalized) {
		if (!channels.includes(normalized)) throw new Error(`Channel "${normalized}" does not support pairing. Supported pairing channels: ${channels.join(", ") || "none"}.`);
		return normalized;
	}
	if (/^[a-z][a-z0-9_-]{0,63}$/.test(value)) return value;
	throw new Error(`Invalid channel "${value}". Use lowercase letters, numbers, "_" or "-", for example "telegram".`);
}
async function notifyApproved(channel, id, accountId, meta) {
	const cfg = getRuntimeConfig();
	await notifyPairingApproved({
		channelId: channel,
		id,
		cfg,
		...accountId ? { accountId } : {},
		...meta ? { meta } : {}
	});
}
function resolveAccountId(raw) {
	const accountId = normalizeStringifiedOptionalString(raw);
	if (raw !== void 0 && !accountId) throw new Error("--account must not be blank");
	return accountId;
}
function registerPairingCli(program) {
	const channels = listPairingChannels();
	const channelHint = channels.length > 0 ? channels.join(", ") : "none configured";
	const pairing = program.command("pairing").description("Secure DM pairing (approve inbound requests)").addHelpText("after", () => `\n${theme.muted("Docs:")} ${formatDocsLink("/cli/pairing", "docs.openclaw.ai/cli/pairing")}\n`);
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
		const requests = accountId ? await listChannelPairingRequests(channel, process.env, accountId) : await listChannelPairingRequests(channel);
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
		const approved = accountId ? await approveChannelPairingCode({
			channel,
			code: String(resolvedCode),
			accountId
		}) : await approveChannelPairingCode({
			channel,
			code: String(resolvedCode)
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
		await notifyApproved(channel, approved.id, approvedAccountId, approved.entry.meta).catch((err) => {
			defaultRuntime.log(theme.warn(`Failed to notify requester: ${String(err)}`));
		});
	});
}
//#endregion
export { registerPairingCli };
