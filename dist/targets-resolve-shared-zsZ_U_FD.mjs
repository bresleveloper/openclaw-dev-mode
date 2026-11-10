import { t as formatCliCommand } from "./command-format-CYoE8cOC.mjs";
import "./message-channel-constants-B3vfipkP.mjs";
import { a as validateTargetProviderPrefix } from "./channel-target-prefix-D9KEia-0.mjs";
import { i as resolveChannelAllowFrom } from "./account-resolution-akTcFkRf.mjs";
import { o as resolveReservedTargetLiteral } from "./target-normalization-Cz6f81yX.mjs";
import { a as missingTargetError, o as reservedTargetLiteralError } from "./target-errors-MHPko63s.mjs";
import { d as mapAllowFromEntries } from "./channel-config-helpers-iQxjPtMU.mjs";
//#region src/infra/outbound/targets-resolve-shared.ts
/**
* Resolves a target through a channel plugin or the generic fallback path.
*/
async function resolveOutboundTargetWithPlugin(params) {
	if (params.target.channel === "webchat") return {
		ok: false,
		error: /* @__PURE__ */ new Error(`Delivering to WebChat is not supported via \`${formatCliCommand("openclaw agent")}\`; use WhatsApp/Telegram or run with --deliver=false.`)
	};
	const plugin = params.plugin;
	if (!plugin) return;
	const allowFromRaw = params.target.allowFrom ?? (params.target.cfg ? await resolveChannelAllowFrom({
		plugin,
		cfg: params.target.cfg,
		accountId: params.target.accountId ?? void 0
	}) : void 0);
	const allowFrom = allowFromRaw ? mapAllowFromEntries(allowFromRaw) : void 0;
	const effectiveTo = params.target.to?.trim() || (params.target.cfg && plugin.config.resolveDefaultTo ? plugin.config.resolveDefaultTo({
		cfg: params.target.cfg,
		accountId: params.target.accountId ?? void 0
	}) : void 0);
	const targetPrefixError = validateTargetProviderPrefix({
		channel: params.target.channel,
		to: effectiveTo
	});
	if (targetPrefixError) return {
		ok: false,
		error: targetPrefixError
	};
	const hint = plugin.messaging?.targetResolver?.hint;
	if (params.target.mode !== "heartbeat") {
		const reservedLiteral = resolveReservedTargetLiteral({
			raw: effectiveTo,
			plugin
		});
		if (reservedLiteral) return {
			ok: false,
			error: reservedTargetLiteralError(plugin.meta.label ?? params.target.channel, reservedLiteral, hint)
		};
	}
	const resolveTarget = plugin.outbound?.resolveTarget;
	return resolveTarget ? resolveTarget({
		cfg: params.target.cfg,
		to: effectiveTo,
		allowFrom,
		accountId: params.target.accountId ?? void 0,
		mode: params.target.mode ?? "explicit"
	}) : effectiveTo ? {
		ok: true,
		to: effectiveTo
	} : {
		ok: false,
		error: missingTargetError(plugin.meta.label ?? params.target.channel, hint)
	};
}
//#endregion
export { resolveOutboundTargetWithPlugin as t };
