import { c as normalizeOptionalLowercaseString, l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { a as asOptionalRecord } from "./record-coerce-TIsquoVR.mjs";
import { o as resolveChannelDmPolicy } from "./dm-access-_PDn4zky.mjs";
import { L as validateChannelsPairingApproveParams, R as validateChannelsPairingDismissParams, z as validateChannelsPairingListParams } from "./src-l2dWvEsN.mjs";
import { t as ErrorCodes } from "./gateway-error-details-DIefe7Zy.mjs";
import { f as errorShape } from "./error-codes-Dh56LniQ.mjs";
import { r as listChannelPlugins } from "./registry-DOE8N7Jo.mjs";
import "./plugins-Z9_SzFi0.mjs";
import { r as hasConfiguredCommandOwners } from "./doctor-command-owner-ZwiTw8zO.mjs";
import { d as notifyPairingApproved } from "./pairing-store-sqlite-Bo6V-Kb1.mjs";
import { a as dismissChannelPairingRequest, i as approveChannelPairingRequest, o as listChannelPairingRequests, r as approveChannelPairingCode, t as CHANNEL_PAIRING_PENDING_TTL_MS, u as resolveChannelPairingRequestId } from "./pairing-store-DEvhBgUm.mjs";
import { n as resolveChannelAccount } from "./account-resolution-DCHDXWZ0.mjs";
import { t as bootstrapCommandOwnerFromPairing } from "./command-owner-GroxPx5K.mjs";
import { t as formatForLog } from "./ws-log-Cxv8Uaao.mjs";
import { n as defineValidatedGatewayHandler } from "./validation-Bu27N0nv.mjs";
import { n as respondUnavailableOnThrow, t as respondUnavailable } from "./response-BKwLtoRW.mjs";
import { t as captureLocalStateMutationGuard } from "./local-state-owner-CdeTOsDa.mjs";
//#region src/gateway/server-methods/channel-pairing.ts
var InvalidPairingTargetError = class extends Error {};
function resolvePairingPolicy(params) {
	const securityPolicy = params.plugin.security?.resolveDmPolicy?.({
		cfg: params.cfg,
		accountId: params.accountId,
		account: params.account
	})?.policy;
	if (securityPolicy) return securityPolicy;
	const account = asOptionalRecord(params.account);
	return resolveChannelDmPolicy({
		account,
		parent: asOptionalRecord(account?.config),
		defaultPolicy: "pairing"
	});
}
function resolvePairingAccountLabel(plugin, account, cfg) {
	const described = plugin.config.describeAccount?.(account, cfg);
	return normalizeOptionalString(described?.name) ?? normalizeOptionalString(asOptionalRecord(account)?.name);
}
async function listPairingAccounts(params) {
	const requestedChannel = normalizeOptionalLowercaseString(params.channel);
	const requestedAccount = normalizeOptionalLowercaseString(params.accountId);
	const pairingPlugins = listChannelPlugins().filter((plugin) => plugin.pairing);
	if (requestedChannel && !pairingPlugins.some((plugin) => plugin.id === requestedChannel)) throw new InvalidPairingTargetError(`unknown pairing channel: ${params.channel}`);
	const accounts = [];
	for (const plugin of pairingPlugins) {
		if (requestedChannel && plugin.id !== requestedChannel) continue;
		for (const accountId of plugin.config.listAccountIds(params.cfg)) {
			if (requestedAccount && accountId.toLowerCase() !== requestedAccount) continue;
			const account = await resolveChannelAccount({
				plugin,
				cfg: params.cfg,
				accountId
			});
			if (!(plugin.config.isConfigured ? await plugin.config.isConfigured(account, params.cfg) : asOptionalRecord(account)?.configured !== false) || resolvePairingPolicy({
				plugin,
				cfg: params.cfg,
				accountId,
				account
			}) !== "pairing") continue;
			const accountLabel = resolvePairingAccountLabel(plugin, account, params.cfg);
			accounts.push({
				plugin,
				accountId,
				...accountLabel ? { accountLabel } : {}
			});
		}
	}
	return accounts;
}
async function resolvePairingAccount(params) {
	const accounts = await listPairingAccounts(params);
	return accounts.length === 1 ? accounts[0] ?? null : null;
}
function publicAccount(account) {
	const adapter = account.plugin.pairing;
	if (!adapter) throw new Error(`Channel ${account.plugin.id} does not support pairing`);
	return {
		channel: account.plugin.id,
		channelLabel: account.plugin.meta.label,
		accountId: account.accountId,
		...account.accountLabel ? { accountLabel: account.accountLabel } : {},
		notifySupported: Boolean(adapter.notifyApproval)
	};
}
function publicRequest(params) {
	const adapter = params.account.plugin.pairing;
	if (!adapter) throw new Error(`Channel ${params.account.plugin.id} does not support pairing`);
	const metadata = params.request.meta ? Object.fromEntries(Object.entries(params.request.meta).filter(([key, value]) => key !== "accountId" && key !== "senderId" && value)) : void 0;
	const createdAtMs = Date.parse(params.request.createdAt);
	const senderId = params.request.meta?.senderId ?? params.request.id;
	return {
		requestId: resolveChannelPairingRequestId(params.account.plugin.id, params.request),
		channel: params.account.plugin.id,
		channelLabel: params.account.plugin.meta.label,
		accountId: params.account.accountId,
		...params.account.accountLabel ? { accountLabel: params.account.accountLabel } : {},
		senderId,
		senderLabel: adapter.idLabel,
		...metadata && Object.keys(metadata).length > 0 ? { metadata } : {},
		createdAt: params.request.createdAt,
		lastSeenAt: params.request.lastSeenAt,
		expiresAt: new Date(createdAtMs + CHANNEL_PAIRING_PENDING_TTL_MS).toISOString(),
		notifySupported: Boolean(adapter.notifyApproval)
	};
}
function invalidPairingAccount(respond, channel, accountId) {
	respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `channel account does not use DM pairing: ${channel}:${accountId}`));
}
function respondPairingFailure(respond, error) {
	respond(false, void 0, errorShape(error instanceof InvalidPairingTargetError ? ErrorCodes.INVALID_REQUEST : ErrorCodes.UNAVAILABLE, formatForLog(error)));
}
function capturePairingCliGuard(expectedOwnerId, opts) {
	if (!opts.client?.connect.scopes?.includes("operator.admin")) {
		opts.respond(false, void 0, errorShape(ErrorCodes.FORBIDDEN, "missing scope: operator.admin", { details: { mutationAccepted: false } }));
		return null;
	}
	try {
		return captureLocalStateMutationGuard(expectedOwnerId, opts);
	} catch (error) {
		opts.respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, formatForLog(error), {
			details: {
				reason: "STATE_OWNER_CHANGED",
				mutationAccepted: false
			},
			retryable: false
		}));
		return null;
	}
}
const channelPairingHandlers = {
	"channels.pairing.list": defineValidatedGatewayHandler("channels.pairing.list", validateChannelsPairingListParams, async (opts) => {
		const { params, respond, context } = opts;
		if ("format" in params) {
			const assertCurrent = capturePairingCliGuard(params.expectedOwnerId, opts);
			if (!assertCurrent) return;
			await respondUnavailableOnThrow(respond, async () => {
				const requests = await listChannelPairingRequests(params.channel, process.env, params.accountId, assertCurrent);
				respond(true, requests, void 0);
			});
			return;
		}
		try {
			const cfg = context.getRuntimeConfig();
			const accounts = await listPairingAccounts({
				cfg,
				...params.channel ? { channel: params.channel } : {},
				...params.accountId ? { accountId: params.accountId } : {}
			});
			const requests = [];
			for (const account of accounts) {
				const pending = await listChannelPairingRequests(account.plugin.id, process.env, account.accountId);
				requests.push(...pending.map((request) => publicRequest({
					account,
					request
				})));
			}
			respond(true, {
				accounts: accounts.map(publicAccount),
				requests,
				commandOwnerConfigured: hasConfiguredCommandOwners(cfg),
				limits: {
					pendingPerAccount: 3,
					ttlMs: CHANNEL_PAIRING_PENDING_TTL_MS
				}
			}, void 0);
		} catch (error) {
			respondPairingFailure(respond, error);
		}
	}),
	"channels.pairing.approve": defineValidatedGatewayHandler("channels.pairing.approve", validateChannelsPairingApproveParams, async (opts) => {
		const { params, respond, context } = opts;
		if ("code" in params) {
			const assertCurrent = capturePairingCliGuard(params.expectedOwnerId, opts);
			if (!assertCurrent) return;
			await respondUnavailableOnThrow(respond, async () => {
				const approved = await approveChannelPairingCode({
					channel: params.channel,
					code: params.code,
					accountId: params.accountId,
					assertCurrent
				});
				respond(true, approved, void 0);
			});
			return;
		}
		let cfg;
		let account;
		try {
			cfg = context.getRuntimeConfig();
			account = await resolvePairingAccount({
				cfg,
				channel: params.channel,
				accountId: params.accountId
			});
		} catch (error) {
			respondPairingFailure(respond, error);
			return;
		}
		if (!account?.plugin.pairing) {
			invalidPairingAccount(respond, params.channel, params.accountId);
			return;
		}
		try {
			const approved = await approveChannelPairingRequest({
				channel: account.plugin.id,
				accountId: account.accountId,
				requestId: params.requestId,
				pairingAdapter: account.plugin.pairing
			});
			if (!approved) {
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "pending DM access request no longer exists"));
				return;
			}
			let commandOwnerBootstrap = "not-requested";
			if (params.bootstrapCommandOwner === true) try {
				commandOwnerBootstrap = (await bootstrapCommandOwnerFromPairing({
					channel: account.plugin.id,
					id: approved.id
				})).status;
			} catch (error) {
				context.logGateway.warn(`DM pairing command-owner bootstrap failed channel=${account.plugin.id} account=${account.accountId}: ${formatForLog(error)}`);
				commandOwnerBootstrap = "unavailable";
			}
			let notification = "not-requested";
			if (params.notify === true) {
				if (!account.plugin.pairing.notifyApproval) notification = "unsupported";
				else try {
					await notifyPairingApproved({
						channelId: account.plugin.id,
						accountId: account.accountId,
						id: approved.id,
						cfg,
						pairingAdapter: account.plugin.pairing,
						...approved.entry.meta ? { meta: approved.entry.meta } : {}
					});
					notification = "sent";
				} catch (error) {
					context.logGateway.warn(`DM pairing approval notification failed channel=${account.plugin.id} account=${account.accountId}: ${formatForLog(error)}`);
					notification = "failed";
				}
			}
			respond(true, {
				requestId: params.requestId,
				senderId: approved.entry.meta?.senderId ?? approved.id,
				notification,
				commandOwnerBootstrap
			}, void 0);
		} catch (error) {
			respondUnavailable(respond, error);
		}
	}),
	"channels.pairing.dismiss": defineValidatedGatewayHandler("channels.pairing.dismiss", validateChannelsPairingDismissParams, async ({ params, respond, context }) => {
		let account;
		try {
			account = await resolvePairingAccount({
				cfg: context.getRuntimeConfig(),
				channel: params.channel,
				accountId: params.accountId
			});
		} catch (error) {
			respondPairingFailure(respond, error);
			return;
		}
		if (!account) {
			invalidPairingAccount(respond, params.channel, params.accountId);
			return;
		}
		await respondUnavailableOnThrow(respond, async () => {
			const dismissed = await dismissChannelPairingRequest({
				channel: account.plugin.id,
				accountId: account.accountId,
				requestId: params.requestId
			});
			if (!dismissed) {
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "pending DM access request no longer exists"));
				return;
			}
			respond(true, {
				requestId: params.requestId,
				senderId: dismissed.entry.meta?.senderId ?? dismissed.id
			}, void 0);
		});
	})
};
//#endregion
export { channelPairingHandlers };
