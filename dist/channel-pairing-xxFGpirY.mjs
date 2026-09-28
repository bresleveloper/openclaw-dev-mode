import "./session-key-CBvmC8zz.mjs";
import { n as normalizeAccountId } from "./account-id-B1bfbA5J.mjs";
import { t as getGlobalHookRunner } from "./hook-runner-global-tOGjxVvH.mjs";
import { t as buildPairingReply } from "./pairing-messages-CO6Q9dkJ.mjs";
import "./pairing-store-Cvj6ctV_.mjs";
//#region src/pairing/pairing-challenge.ts
async function runPairingRequestedHook(params) {
	const hookRunner = getGlobalHookRunner();
	if (!hookRunner?.hasHooks("channel_pairing_requested")) return;
	await hookRunner.runChannelPairingRequested({
		channel: params.channel,
		accountId: params.accountId,
		senderId: params.senderId,
		code: params.code,
		metadata: params.meta
	}, {
		channelId: params.channel,
		accountId: params.accountId,
		senderId: params.senderId
	});
}
/**
* Shared pairing challenge issuance for DM pairing policy pathways.
* Ensures every channel follows the same create-if-missing + reply flow.
*/
async function issuePairingChallenge(params) {
	const { code, created } = await params.upsertPairingRequest({
		id: params.senderId,
		meta: params.meta
	});
	if (!created) return { created: false };
	params.onCreated?.({ code });
	const accountId = params.accountId ? normalizeAccountId(params.accountId) : void 0;
	runPairingRequestedHook({
		channel: params.channel,
		accountId,
		senderId: params.senderId,
		code,
		meta: params.meta
	}).catch(() => void 0);
	const replyText = params.buildReplyText?.({
		code,
		senderIdLine: params.senderIdLine
	}) ?? buildPairingReply({
		channel: params.channel,
		idLine: params.senderIdLine,
		code
	});
	try {
		await params.sendPairingReply(replyText);
	} catch (err) {
		params.onReplyError?.(err);
	}
	return {
		created: true,
		code
	};
}
//#endregion
//#region src/plugin-sdk/pairing-access.ts
/** Scope pairing store operations to one channel/account pair for plugin-facing helpers. */
function createScopedPairingAccess(params) {
	const resolvedAccountId = normalizeAccountId(params.accountId);
	return {
		/** Normalized account id used by every channel-scoped pairing store operation. */
		accountId: resolvedAccountId,
		/** Read allow-list entries for the scoped channel/account pair. */
		readAllowFromStore: () => params.core.channel.pairing.readAllowFromStore({
			channel: params.channel,
			accountId: resolvedAccountId
		}),
		/** Delete one approval after the owning channel durably consumes it. */
		removeAllowFromStoreEntry: (entry) => params.core.channel.pairing.removeAllowFromStoreEntry({
			channel: params.channel,
			accountId: resolvedAccountId,
			entry
		}),
		/** Read another channel/account allow-list for DM policy cross-checks. */
		readStoreForDmPolicy: (provider, accountId) => params.core.channel.pairing.readAllowFromStore({
			channel: provider,
			accountId: normalizeAccountId(accountId)
		}),
		/** Upsert a pairing request with the scoped channel/account injected. */
		upsertPairingRequest: (input) => params.core.channel.pairing.upsertPairingRequest({
			...input,
			channel: params.channel,
			accountId: resolvedAccountId
		})
	};
}
//#endregion
//#region src/channels/plugins/pairing-adapters.ts
/**
* Creates an allowlist normalizer that strips a channel-specific target prefix.
*/
function createPairingPrefixStripper(prefixRe, map = (entry) => entry) {
	return (entry) => map(entry.trim().replace(prefixRe, "").trim());
}
/**
* Creates a pairing notifier that logs a formatted approval message.
*/
function createLoggedPairingApprovalNotifier(format, log = console.log) {
	return async (params) => {
		log(typeof format === "function" ? format(params) : format);
	};
}
/**
* Creates a text-message pairing adapter with optional allowlist normalization.
*/
function createTextPairingAdapter(params) {
	return {
		idLabel: params.idLabel,
		normalizeAllowEntry: params.normalizeAllowEntry,
		notifyApproval: async (ctx) => {
			await params.notify({
				...ctx,
				message: params.message
			});
		}
	};
}
//#endregion
//#region src/plugin-sdk/channel-pairing.ts
/** Pre-bind the channel id and storage sink for pairing challenges. */
function createChannelPairingChallengeIssuer(params) {
	return (challenge) => issuePairingChallenge({
		...challenge,
		channel: params.channel,
		accountId: params.accountId,
		upsertPairingRequest: params.upsertPairingRequest
	});
}
/** Build the full scoped pairing controller used by channel runtime code. */
function createChannelPairingController(params) {
	const access = createScopedPairingAccess(params);
	return {
		...access,
		issueChallenge: createChannelPairingChallengeIssuer({
			channel: params.channel,
			accountId: access.accountId,
			upsertPairingRequest: access.upsertPairingRequest
		})
	};
}
//#endregion
export { createTextPairingAdapter as a, createPairingPrefixStripper as i, createChannelPairingController as n, createLoggedPairingApprovalNotifier as r, createChannelPairingChallengeIssuer as t };
