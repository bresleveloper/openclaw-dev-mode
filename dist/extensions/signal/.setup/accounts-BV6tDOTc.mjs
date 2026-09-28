import { i as normalizeSignalTransportHost, n as buildSignalSocketUrl, o as resolveSignalAccountEntry, r as buildSignalTransportHttpUrl, t as assertSignalSocketTransport } from "./transport-url-CAC0JcuI.mjs";
import { a as isSignalManagedNativeConnectionUrlForBind, i as assignSignalManagedNativePort, n as DEFAULT_SIGNAL_MANAGED_NATIVE_PORT, r as allocateSignalManagedNativePort, s as resolveLocalSignalTransportPort } from "./transport-policy-5VSnj5ma.mjs";
import { normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
import { DEFAULT_ACCOUNT_ID, createAccountListHelpers, normalizeAccountId, resolveMergedAccountConfig } from "openclaw/plugin-sdk/account-resolution";
//#region extensions/signal/src/accounts.ts
const { listAccountIds, resolveDefaultAccountId } = createAccountListHelpers("signal", {
	normalizeAccountId,
	implicitDefaultAccount: { channelKeys: ["account", "transport"] }
});
const listSignalAccountIds = listAccountIds;
const resolveDefaultSignalAccountId = resolveDefaultAccountId;
function resolveSignalAccountConfig(cfg, accountId) {
	const channelConfig = cfg.channels?.signal;
	const { transport: _transport, accounts: _accounts, defaultAccount: _defaultAccount, ...shared } = channelConfig ?? {};
	const merged = resolveMergedAccountConfig({
		channelConfig: accountId === DEFAULT_ACCOUNT_ID ? channelConfig : shared,
		accounts: cfg.channels?.signal?.accounts,
		accountId,
		channelId: "signal",
		nestedObjectKeys: ["aliases"]
	});
	if (accountId === DEFAULT_ACCOUNT_ID && channelConfig?.transport) return {
		...merged,
		transport: channelConfig.transport
	};
	return merged;
}
function isSignalAccountConfigured(config) {
	return Boolean(normalizeOptionalString(config.account) || config.transport);
}
function isSignalAccountEnabled(cfg, config) {
	return cfg.channels?.signal?.enabled !== false && config.enabled !== false;
}
function resolveSignalManagedNativePort(params) {
	if (params.transport?.kind === "managed-native" && params.transport.socketPath !== void 0) {
		assertSignalSocketTransport(params.transport);
		if (isSignalAccountEnabled(params.cfg, params.accountConfig)) for (const accountId of listSignalAccountIds(params.cfg)) {
			if (normalizeAccountId(accountId) === params.accountId) continue;
			const sibling = resolveSignalAccountConfig(params.cfg, accountId);
			if (isSignalAccountEnabled(params.cfg, sibling) && sibling.transport?.kind === "managed-native" && sibling.transport.socketPath === params.transport.socketPath) throw new Error(`Signal managed native accounts "${params.accountId}" and "${accountId}" share transport.socketPath. Assign each account a distinct socket path.`);
		}
		return DEFAULT_SIGNAL_MANAGED_NATIVE_PORT;
	}
	if (!isSignalAccountEnabled(params.cfg, params.accountConfig)) return params.transport?.kind === "managed-native" && params.transport.httpPort !== void 0 ? params.transport.httpPort : DEFAULT_SIGNAL_MANAGED_NATIVE_PORT;
	if (params.transport?.kind === "managed-native" && params.transport.httpPort !== void 0) {
		const explicitPort = params.transport.httpPort;
		if (params.transport.url && !isSignalManagedNativeConnectionUrlForBind(params.transport) && resolveLocalSignalTransportPort(params.transport.url) === explicitPort) throw new Error(`Signal managed native account "${params.accountId}" binds port ${explicitPort}, which conflicts with its local transport endpoint. Assign a distinct transport.httpPort.`);
		for (const accountId of listSignalAccountIds(params.cfg)) {
			if (normalizeAccountId(accountId) === params.accountId) continue;
			const accountConfig = resolveSignalAccountConfig(params.cfg, accountId);
			if (!isSignalAccountConfigured(accountConfig) || !isSignalAccountEnabled(params.cfg, accountConfig)) continue;
			const transport = accountConfig.transport;
			if (transport?.kind === "managed-native" && transport.httpPort === explicitPort) throw new Error(`Signal managed native accounts "${params.accountId}" and "${accountId}" both bind port ${explicitPort}. Assign each account a distinct transport.httpPort.`);
			const independentLocalUrl = transport?.kind === "external-native" || transport?.kind === "container" || transport?.kind === "managed-native" && Boolean(transport.url) && !isSignalManagedNativeConnectionUrlForBind(transport) ? transport.url : void 0;
			if (independentLocalUrl && resolveLocalSignalTransportPort(independentLocalUrl) === explicitPort) throw new Error(`Signal managed native account "${params.accountId}" binds port ${explicitPort}, which conflicts with account "${accountId}" local transport endpoint. Assign a distinct transport.httpPort.`);
		}
		return explicitPort;
	}
	const reservedPorts = /* @__PURE__ */ new Set();
	const implicitManagedAccountIds = [];
	for (const accountId of listSignalAccountIds(params.cfg)) {
		const accountConfig = resolveSignalAccountConfig(params.cfg, accountId);
		if (!isSignalAccountConfigured(accountConfig) || !isSignalAccountEnabled(params.cfg, accountConfig)) continue;
		const transport = accountConfig.transport;
		if (transport?.kind === "external-native" || transport?.kind === "container") {
			const localPort = resolveLocalSignalTransportPort(transport.url);
			if (localPort !== void 0) reservedPorts.add(localPort);
			continue;
		}
		if (transport?.kind === "managed-native") {
			if (transport.socketPath !== void 0) continue;
			if (transport.httpPort !== void 0) reservedPorts.add(transport.httpPort);
			else implicitManagedAccountIds.push(accountId);
			if (transport.url && !isSignalManagedNativeConnectionUrlForBind(transport)) {
				const localConnectionPort = resolveLocalSignalTransportPort(transport.url);
				if (localConnectionPort !== void 0) reservedPorts.add(localConnectionPort);
			}
			continue;
		}
		implicitManagedAccountIds.push(accountId);
	}
	for (const accountId of implicitManagedAccountIds) {
		const port = allocateSignalManagedNativePort({ reservedPorts });
		reservedPorts.add(port);
		if (normalizeAccountId(accountId) === params.accountId) return port;
	}
	return DEFAULT_SIGNAL_MANAGED_NATIVE_PORT;
}
function resolveSignalTransport(transport, managedNativePort = DEFAULT_SIGNAL_MANAGED_NATIVE_PORT) {
	if (transport?.kind === "external-native" || transport?.kind === "container") return {
		kind: transport.kind,
		baseUrl: transport.url.trim()
	};
	if (transport?.kind === "managed-native") assertSignalSocketTransport(transport);
	const managedTransport = transport?.kind === "managed-native" && transport.socketPath === void 0 ? assignSignalManagedNativePort(transport, transport.httpPort ?? managedNativePort) : transport;
	const httpHost = normalizeSignalTransportHost(normalizeOptionalString(managedTransport?.httpHost) ?? "127.0.0.1");
	const httpPort = managedTransport?.httpPort ?? managedNativePort;
	const configPath = normalizeOptionalString(managedTransport?.configPath);
	const connectionUrl = normalizeOptionalString(managedTransport?.url);
	return {
		kind: "managed-native",
		baseUrl: managedTransport?.socketPath !== void 0 ? buildSignalSocketUrl(managedTransport.socketPath) : connectionUrl ?? buildSignalTransportHttpUrl(httpHost, httpPort),
		...managedTransport?.socketPath !== void 0 ? { socketPath: managedTransport.socketPath } : {},
		cliPath: normalizeOptionalString(managedTransport?.cliPath) ?? "signal-cli",
		...configPath ? { configPath } : {},
		httpHost,
		httpPort,
		startupTimeoutMs: managedTransport?.startupTimeoutMs ?? 3e4,
		...managedTransport?.receiveMode ? { receiveMode: managedTransport.receiveMode } : {},
		...typeof managedTransport?.ignoreStories === "boolean" ? { ignoreStories: managedTransport.ignoreStories } : {}
	};
}
function resolveSignalAccount(params) {
	const accountId = normalizeAccountId(params.accountId ?? resolveDefaultSignalAccountId(params.cfg));
	const baseEnabled = params.cfg.channels?.signal?.enabled !== false;
	const merged = resolveSignalAccountConfig(params.cfg, accountId);
	const accountEnabled = merged.enabled !== false;
	const enabled = baseEnabled && accountEnabled;
	const transport = resolveSignalTransport(merged.transport, resolveSignalManagedNativePort({
		cfg: params.cfg,
		accountId,
		accountConfig: merged,
		transport: merged.transport
	}));
	const baseUrl = transport.baseUrl;
	const configured = isSignalAccountConfigured(merged);
	return {
		accountId,
		enabled,
		name: normalizeOptionalString(merged.name),
		baseUrl,
		transport,
		configured,
		config: merged
	};
}
function listEnabledSignalAccounts(cfg) {
	return listSignalAccountIds(cfg).map((accountId) => resolveSignalAccount({
		cfg,
		accountId
	})).filter((account) => account.enabled);
}
function normalizeSignalReplyToMode(value) {
	return value === "off" || value === "first" || value === "all" || value === "batched" ? value : void 0;
}
function resolveSignalReplyToMode(params) {
	const accountId = normalizeAccountId(params.accountId ?? resolveDefaultSignalAccountId(params.cfg));
	const signalConfig = params.cfg.channels?.signal;
	const accountConfig = resolveSignalAccountEntry(signalConfig?.accounts, accountId);
	const chatType = params.chatType === "direct" || params.chatType === "group" ? params.chatType : void 0;
	if (chatType) {
		const accountScoped = normalizeSignalReplyToMode(accountConfig?.replyToModeByChatType?.[chatType]);
		if (accountScoped) return accountScoped;
		const accountDefault = normalizeSignalReplyToMode(accountConfig?.replyToMode);
		if (accountDefault) return accountDefault;
		const channelScoped = normalizeSignalReplyToMode(signalConfig?.replyToModeByChatType?.[chatType]);
		if (channelScoped) return channelScoped;
	}
	return normalizeSignalReplyToMode(accountConfig?.replyToMode) ?? normalizeSignalReplyToMode(signalConfig?.replyToMode) ?? "all";
}
//#endregion
export { resolveSignalAccountConfig as a, resolveSignalAccount as i, listSignalAccountIds as n, resolveSignalReplyToMode as o, resolveDefaultSignalAccountId as r, resolveSignalTransport as s, listEnabledSignalAccounts as t };
