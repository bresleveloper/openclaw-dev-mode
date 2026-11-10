import { r as createRuntimeConfigReader } from "../../runtime-snapshot-BBYDJbw9.mjs";
import "../../runtime-config-snapshot-kTPhBdOK.mjs";
import { a as resolveXAccountKey, i as resolveXAccount, n as listXRuntimeAccountIds, t as listXAccountIds } from "../../accounts-n2C-ky3w.mjs";
import { i as openXAllowlist, n as mergeXAllowlist, r as normalizeXUserId } from "../../allowlist-Bk-oAvxJ.mjs";
import { a as XBudgetExceededError, o as openXSpend, t as getXApi } from "../../client-D9-Q5PGR.mjs";
import { t as getXGuestStatus } from "../../guests-BkgYxxnV.mjs";
import { n as getXGitHubStatus } from "../../verified-github-BdaHOdSe.mjs";
//#region extensions/x/src/admin.ts
var XAdminError = class extends Error {
	constructor(code, message) {
		super(message);
		this.code = code;
	}
};
function assertAdmin(request) {
	request.signal?.throwIfAborted();
	request.client?.connectionSignal?.throwIfAborted();
	if (!request.client?.connect.scopes?.includes("operator.admin") || request.hasCurrentClientAuthority?.() === false) throw new XAdminError("FORBIDDEN", "X replies management requires an active administrator.");
	request.sessionMutationAuthorization?.assertCurrent();
	request.sessionAccessAuthority?.assertCurrent();
	request.sessionMutationCommitGuard?.();
}
function hasXAccount(cfg, accountId) {
	return listXAccountIds(cfg).includes(accountId) || resolveXAccountKey(cfg, accountId) !== void 0;
}
function callerIdentity(request) {
	const client = request.client;
	if (!client) throw new XAdminError("FORBIDDEN", "An authenticated administrator is required.");
	const identity = client.authenticatedUserId || client.connect.device?.id || client.connId;
	if (!identity) throw new XAdminError("FORBIDDEN", "The administrator identity is unavailable.");
	return identity;
}
function registerXAllowlistMethods(api) {
	let allowlist;
	const getAllowlist = () => allowlist ??= openXAllowlist(api.runtime);
	const accountFor = (request, cfg = request.context.getRuntimeConfig()) => {
		const raw = request.params.accountId;
		if (raw !== void 0 && (typeof raw !== "string" || !raw.trim())) throw new XAdminError("INVALID_REQUEST", "accountId must be a nonempty string.");
		const account = resolveXAccount(cfg, raw);
		if (!hasXAccount(cfg, account.accountId)) throw new XAdminError("INVALID_REQUEST", "The X account is not configured.");
		return {
			cfg,
			account
		};
	};
	const snapshot = async (request, cfg = request.context.getRuntimeConfig(), selectedAccountId) => {
		const account = selectedAccountId ? resolveXAccount(cfg, selectedAccountId) : accountFor(request, cfg).account;
		const readConfig = createRuntimeConfigReader(cfg);
		const [entries, guests, spend, verifiedFromGitHub] = await Promise.all([
			getAllowlist().list(account.accountId),
			getXGuestStatus(api.runtime, account, cfg),
			openXSpend(api.runtime, account.accountId, () => resolveXAccount(readConfig(), account.accountId).costLimits).status(),
			getXGitHubStatus(api.runtime, account)
		]);
		assertAdmin(request);
		return {
			accountId: account.accountId,
			accounts: listXRuntimeAccountIds(cfg).map((accountId) => ({
				accountId,
				username: resolveXAccount(cfg, accountId).username
			})),
			entries: mergeXAllowlist(account.config.allowFrom ?? [], entries),
			guests,
			spend,
			verifiedFromGitHub
		};
	};
	const handlers = {
		"x.allowlist.list": snapshot,
		async "x.guests.set"(request) {
			const enabled = request.params.enabled;
			if (typeof enabled !== "boolean") throw new XAdminError("INVALID_REQUEST", "enabled must be a boolean.");
			const { account } = accountFor(request);
			const { mutateConfigFile } = await import("../../plugin-sdk/config-mutation.js");
			const committed = await mutateConfigFile({
				afterWrite: { mode: "auto" },
				writeOptions: { assertCurrent: () => assertAdmin(request) },
				mutate: (draft) => {
					assertAdmin(request);
					const channel = draft.channels?.x;
					if (!channel || !hasXAccount(draft, account.accountId)) throw new XAdminError("INVALID_REQUEST", "The X account is no longer configured.");
					const key = resolveXAccountKey(draft, account.accountId);
					const target = (key === void 0 ? void 0 : channel.accounts?.[key]) ?? channel;
					target.guests = {
						...target.guests,
						enabled
					};
				}
			});
			return await snapshot(request, committed.nextConfig, account.accountId);
		},
		async "x.allowlist.add"(request) {
			const raw = request.params.username;
			const username = typeof raw === "string" ? raw.trim().replace(/^@/, "") : "";
			if (!/^[A-Za-z0-9_]{1,15}$/.test(username)) throw new XAdminError("INVALID_REQUEST", "username must be an X handle, with or without @.");
			const { cfg, account } = accountFor(request);
			const client = await getXApi(account.accountId, cfg);
			assertAdmin(request);
			const user = await client.getUserByUsername(username, request.signal);
			assertAdmin(request);
			await getAllowlist().put(account.accountId, {
				userId: user.id,
				username: user.username,
				name: user.name ?? user.username,
				addedBy: callerIdentity(request),
				addedAt: Date.now()
			}, () => assertAdmin(request));
			return await snapshot(request);
		},
		async "x.allowlist.remove"(request) {
			const userId = typeof request.params.userId === "string" ? normalizeXUserId(request.params.userId) : void 0;
			if (!userId) throw new XAdminError("INVALID_REQUEST", "userId must be a numeric X user ID.");
			const { account } = accountFor(request);
			await getAllowlist().remove(account.accountId, userId, () => assertAdmin(request));
			return await snapshot(request);
		}
	};
	for (const [method, handler] of Object.entries(handlers)) api.registerGatewayMethod(method, async (request) => {
		try {
			assertAdmin(request);
			request.respond(true, await handler(request));
		} catch (error) {
			if (error instanceof XAdminError) request.respond(false, void 0, {
				code: error.code,
				message: error.message
			});
			else if (error instanceof XBudgetExceededError) request.respond(false, void 0, {
				code: "UNAVAILABLE",
				message: error.message
			});
			else {
				api.logger.error(`X replies operation failed (${method}): ${error instanceof Error ? error.message : String(error)}`);
				request.respond(false, void 0, {
					code: "UNAVAILABLE",
					message: "X replies operation failed. Check the Gateway logs and try again."
				});
			}
		}
	}, { scope: "operator.admin" });
}
//#endregion
export { registerXAllowlistMethods };
