import { r as asNullableRecord } from "./record-coerce-DItp3I4t.mjs";
import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import { d as normalizeStringEntries, y as uniqueStrings } from "./string-normalization-_gRhJUDw.mjs";
import { t as AgentSelectionRequiredError } from "./agent-scope-config-IQKOEtZ4.mjs";
import { T as parseSessionDeliveryRoute, d as resolveLinkedDirectPeerId } from "./session-key-CBvmC8zz.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { n as canonicalizeMainSessionAlias } from "./main-session-De-bcoks.mjs";
import { a as parseAccessGroupAllowFromEntry } from "./allow-from-Dq2DvsNl.mjs";
import { n as readChannelIngressStoreAllowFromForDmPolicy } from "./store-allow-from-CInyZmjP.mjs";
import { i as listExactDirectMessageBindingPeerIds, o as resolveAgentRoute } from "./resolve-route-zfKT6ZcU.mjs";
import { i as resolveChannelDefaultAccountId } from "./helpers-t_ym8v5h.mjs";
import { n as hasConfiguredUnavailableCredentialStatus, r as hasResolvedCredentialValue } from "./account-snapshot-fields-DpvG7B4L.mjs";
import { n as isDangerousNameMatchingEnabled } from "./dangerous-name-matching-CthX7x2f.mjs";
import { t as inspectReadOnlyChannelAccount } from "./read-only-account-inspect-44l_sOq6.mjs";
//#region src/channels/message-access/dm-allow-state.ts
/** Merges configured and persisted allowFrom entries for channel security audit. */
async function resolveDmAllowAuditState(params) {
	const configAllowFrom = normalizeStringEntries(Array.isArray(params.allowFrom) ? params.allowFrom : void 0);
	const hasWildcard = configAllowFrom.includes("*");
	const storeAllowFrom = await readChannelIngressStoreAllowFromForDmPolicy({
		provider: params.provider,
		accountId: params.accountId,
		dmPolicy: params.dmPolicy,
		readStore: params.readStore
	});
	const normalizeEntry = params.normalizeEntry ?? ((value) => value);
	const normalizedCfg = normalizeStringEntries(configAllowFrom.filter((value) => value !== "*").map((value) => normalizeEntry(value)));
	const normalizedStore = normalizeStringEntries(storeAllowFrom.map((value) => normalizeEntry(value)));
	return {
		hasWildcard,
		admittedPrincipals: Array.from(/* @__PURE__ */ new Set([...normalizedCfg, ...normalizedStore]))
	};
}
//#endregion
//#region src/security/audit-channel.ts
function dedupeFindings(findings) {
	const seen = /* @__PURE__ */ new Set();
	const out = [];
	for (const finding of findings) {
		const key = [
			finding.checkId,
			finding.severity,
			finding.title,
			finding.detail ?? "",
			finding.remediation ?? ""
		].join("\n");
		if (seen.has(key)) continue;
		seen.add(key);
		out.push(finding);
	}
	return out;
}
function hasExplicitProviderAccountConfig(cfg, provider, accountId) {
	const channel = cfg.channels?.[provider];
	if (!channel || typeof channel !== "object") return false;
	const accounts = channel.accounts;
	if (!accounts || typeof accounts !== "object") return false;
	return Object.hasOwn(accounts, accountId);
}
function formatChannelAccountNote(params) {
	return params.orderedAccountIds.length > 1 || params.hasExplicitAccountPath ? ` (account: ${params.accountId})` : "";
}
/** Collect channel-specific security findings across active channel plugins/accounts. */
async function collectChannelSecurityFindingsCore(params) {
	const findings = [];
	const principalRoutes = [];
	const sourceConfig = params.sourceConfig ?? params.cfg;
	const includeAuditOnly = params.mode !== "doctor";
	const recordPrincipal = (plugin, route, sessionKey, logicalPrincipalKey, indexNamespaces = false) => {
		const canonicalKey = canonicalizeMainSessionAlias({
			cfg: params.cfg,
			agentId: route.agentId,
			sessionKey
		});
		const principal = {
			accountKey: `${plugin.id}-${route.accountId}`,
			logicalPrincipalKey,
			bucketKey: `${route.agentId}\0${canonicalKey}`
		};
		principalRoutes.push(principal);
		if (!indexNamespaces) return;
		const parsed = parseSessionDeliveryRoute(canonicalKey);
		const directChannel = parsed?.peerKind === "direct" || parsed?.peerKind === "dm" ? parsed.channel : void 0;
		if (directChannel || sessionKey === route.sessionKey && route.dmScope === "per-peer") principalRoutes.push({
			...principal,
			bucketKey: `${route.agentId}\0symbolic:dm:peer`
		});
		if (directChannel) principalRoutes.push({
			...principal,
			bucketKey: `${route.agentId}\0symbolic:dm:channel:${directChannel}`
		});
	};
	const inspectChannelAccount = async (plugin, cfg, accountId) => {
		if (plugin.config.inspectAccount) return await plugin.config.inspectAccount(cfg, accountId);
		return await inspectReadOnlyChannelAccount({
			channelId: plugin.id,
			cfg,
			accountId
		});
	};
	const resolveChannelAuditAccount = async (plugin, accountId) => {
		const diagnostics = [];
		const sourceInspectedAccount = await inspectChannelAccount(plugin, sourceConfig, accountId);
		const resolvedInspectedAccount = await inspectChannelAccount(plugin, params.cfg, accountId);
		const sourceInspection = sourceInspectedAccount;
		const resolvedInspection = resolvedInspectedAccount;
		let resolvedAccount = resolvedInspectedAccount;
		if (!resolvedAccount) try {
			resolvedAccount = plugin.config.resolveAccount(params.cfg, accountId);
		} catch (error) {
			diagnostics.push(`${plugin.id}:${accountId}: failed to resolve account (${formatErrorMessage(error)}).`);
		}
		if (!resolvedAccount && sourceInspectedAccount) resolvedAccount = sourceInspectedAccount;
		if (!resolvedAccount) return {
			account: {},
			enabled: false,
			configured: false,
			diagnostics
		};
		const useSourceUnavailableAccount = Boolean(sourceInspectedAccount && hasConfiguredUnavailableCredentialStatus(sourceInspectedAccount) && (!hasResolvedCredentialValue(resolvedAccount) || sourceInspection?.configured === true && resolvedInspection?.configured === false));
		const account = useSourceUnavailableAccount ? sourceInspectedAccount : resolvedAccount;
		const selectedInspection = useSourceUnavailableAccount ? sourceInspection : resolvedInspection;
		const accountRecord = asNullableRecord(account);
		let enabled = typeof selectedInspection?.enabled === "boolean" ? selectedInspection.enabled : typeof accountRecord?.enabled === "boolean" ? accountRecord.enabled : true;
		if (typeof selectedInspection?.enabled !== "boolean" && typeof accountRecord?.enabled !== "boolean" && plugin.config.isEnabled) try {
			enabled = plugin.config.isEnabled(account, params.cfg);
		} catch (error) {
			enabled = false;
			diagnostics.push(`${plugin.id}:${accountId}: failed to evaluate enabled state (${formatErrorMessage(error)}).`);
		}
		let configured = typeof selectedInspection?.configured === "boolean" ? selectedInspection.configured : typeof accountRecord?.configured === "boolean" ? accountRecord.configured : true;
		if (typeof selectedInspection?.configured !== "boolean" && typeof accountRecord?.configured !== "boolean" && plugin.config.isConfigured) try {
			configured = await plugin.config.isConfigured(account, params.cfg);
		} catch (error) {
			configured = false;
			diagnostics.push(`${plugin.id}:${accountId}: failed to evaluate configured state (${formatErrorMessage(error)}).`);
		}
		return {
			account,
			enabled,
			configured,
			diagnostics
		};
	};
	const warnDmPolicy = async (input) => {
		const policyPath = input.policyPath ?? `${input.allowFromPath}policy`;
		const auditState = await resolveDmAllowAuditState({
			provider: input.provider,
			accountId: input.accountId,
			allowFrom: input.allowFrom,
			dmPolicy: input.dmPolicy,
			normalizeEntry: input.normalizeEntry
		});
		const { hasWildcard } = auditState;
		if (input.dmPolicy === "open") {
			const allowFromKey = `${input.allowFromPath}allowFrom`;
			findings.push({
				checkId: `channels.${input.provider}.dm.open`,
				severity: "critical",
				title: `${input.label} DMs are open`,
				detail: `${policyPath}="open" allows anyone to DM the bot.`,
				remediation: `Use pairing/allowlist; if you really need open DMs, ensure ${allowFromKey} includes "*".`
			});
			if (!hasWildcard) findings.push({
				checkId: `channels.${input.provider}.dm.open_invalid`,
				severity: "warn",
				title: `${input.label} DM config looks inconsistent`,
				detail: `"open" requires ${allowFromKey} to include "*".`
			});
		}
		if (input.dmPolicy === "disabled") {
			findings.push({
				checkId: `channels.${input.provider}.dm.disabled`,
				severity: "info",
				title: `${input.label} DMs are disabled`,
				detail: `${policyPath}="disabled" ignores inbound DMs.`
			});
			return auditState;
		}
		if (input.dmPolicy !== "open" && auditState.admittedPrincipals.length === 0) findings.push({
			checkId: `channels.${input.provider}.dm.locked`,
			severity: "info",
			title: `${input.label} DMs are locked`,
			detail: `${policyPath}="${input.dmPolicy}" has no admitted senders; unknown senders are blocked or receive a pairing code.`,
			remediation: input.approveHint
		});
		return auditState;
	};
	for (const plugin of params.plugins) {
		if (!plugin.security) continue;
		const accountIds = plugin.config.listAccountIds(sourceConfig);
		const defaultAccountId = resolveChannelDefaultAccountId({
			plugin,
			cfg: sourceConfig,
			accountIds
		});
		const orderedAccountIds = uniqueStrings([defaultAccountId, ...accountIds]);
		for (const accountId of orderedAccountIds) {
			const hasExplicitAccountPath = hasExplicitProviderAccountConfig(sourceConfig, plugin.id, accountId);
			const { account, enabled, configured, diagnostics } = await resolveChannelAuditAccount(plugin, accountId);
			for (const diagnostic of diagnostics) findings.push({
				checkId: `channels.${plugin.id}.account.read_only_resolution`,
				severity: "warn",
				title: `[secrets] ${plugin.meta.label ?? plugin.id} account could not be fully resolved`,
				detail: diagnostic,
				remediation: "Ensure referenced secrets are available in this shell or run with a running gateway snapshot so security audit can inspect the full channel configuration."
			});
			if (!enabled) continue;
			if (!configured) continue;
			const accountNote = formatChannelAccountNote({
				orderedAccountIds,
				hasExplicitAccountPath,
				accountId
			});
			const accountConfig = account?.config;
			const dmPolicy = plugin.security.resolveDmPolicy?.({
				cfg: params.cfg,
				accountId,
				account
			});
			const nameMatchingEnabled = isDangerousNameMatchingEnabled(accountConfig);
			const configuredEntries = (dmPolicy?.allowFrom ?? []).map(String).filter((raw) => raw.trim() !== "*");
			const mutableEntries = configuredEntries.filter((raw) => parseAccessGroupAllowFromEntry(raw) === null && dmPolicy?.classifyEntryAuthentication?.(raw) === "mutable").length;
			if (includeAuditOnly && nameMatchingEnabled) findings.push({
				checkId: `channels.${plugin.id}.allowFrom.dangerous_name_matching_enabled`,
				severity: "info",
				title: `${plugin.meta.label ?? plugin.id} dangerous name matching is enabled${accountNote}`,
				detail: "dangerouslyAllowNameMatching=true enables mutable aliases (changeable/shared labels, weak even when honestly set) for sender authorization. Exact, stable identifiers with unproven ownership are a separate weak class; ingress diagnostics distinguish mutable_identifier_disabled from identifier_authentication_too_weak." + (dmPolicy?.classifyEntryAuthentication ? ` ${mutableEntries} of ${configuredEntries.length} allowFrom entries depend on mutable matching and would stop authorizing if dangerouslyAllowNameMatching is disabled.` : ""),
				remediation: "Prefer stable sender IDs in allowlists, then disable dangerouslyAllowNameMatching."
			});
			if (!nameMatchingEnabled && mutableEntries > 0 && dmPolicy) findings.push({
				checkId: `channels.${plugin.id}.allowFrom.mutable_entries_inert`,
				severity: "warn",
				title: `${plugin.meta.label ?? plugin.id} mutable allowFrom entries are inert${accountNote}`,
				detail: `${mutableEntries} of ${configuredEntries.length} entries in ${dmPolicy.allowFromPath}allowFrom only match mutable identifiers (display names/tags/aliases) and can never authorize a sender under the current policy, so they are silently inert.`,
				remediation: "Replace them with stable sender IDs; enabling dangerouslyAllowNameMatching is a discouraged break-glass alternative."
			});
			if (dmPolicy) {
				const auditState = await warnDmPolicy({
					label: `${plugin.meta.label ?? plugin.id}${accountNote}`,
					provider: plugin.id,
					accountId,
					dmPolicy: dmPolicy.policy,
					allowFrom: dmPolicy.allowFrom,
					policyPath: dmPolicy.policyPath,
					allowFromPath: dmPolicy.allowFromPath,
					approveHint: dmPolicy.approveHint,
					normalizeEntry: dmPolicy.normalizeEntry
				});
				if (dmPolicy.policy !== "disabled") {
					const dmRouting = plugin.security.dmRouting;
					const admittedPrincipals = uniqueStrings([...auditState.admittedPrincipals, ...auditState.hasWildcard ? listExactDirectMessageBindingPeerIds({
						cfg: params.cfg,
						channel: plugin.id,
						accountId
					}) : []]);
					for (const principalId of [...admittedPrincipals, ...auditState.hasWildcard ? [void 0] : []]) {
						const principalContext = {
							cfg: params.cfg,
							accountId,
							account,
							...principalId === void 0 ? {} : { principalId }
						};
						const channelDmScope = dmRouting?.resolveDmScope?.(principalContext);
						let route;
						try {
							route = resolveAgentRoute({
								cfg: params.cfg,
								channel: plugin.id,
								accountId,
								peer: {
									kind: "direct",
									id: principalId ?? ""
								},
								dmScope: channelDmScope
							});
						} catch (error) {
							if (!(error instanceof AgentSelectionRequiredError)) throw error;
							findings.push({
								checkId: `channels.${plugin.id}.routing.owner_missing.${accountId}`,
								severity: "warn",
								title: `${plugin.meta.label ?? plugin.id}${accountNote} routing has no explicit owner`,
								detail: error.message,
								remediation: error.hint
							});
							continue;
						}
						const result = dmRouting?.resolveDmRoute?.({
							...principalContext,
							route
						});
						if (principalId !== void 0) {
							const sessionKey = result && "sessionKey" in result ? result.sessionKey : route.sessionKey;
							const linkedIdentity = resolveLinkedDirectPeerId({
								identityLinks: params.cfg.session?.identityLinks,
								channel: plugin.id,
								peerId: principalId
							});
							recordPrincipal(plugin, route, sessionKey, linkedIdentity ? `linked:${normalizeLowercaseStringOrEmpty(linkedIdentity)}` : `direct:${plugin.id}:${route.accountId}:${normalizeLowercaseStringOrEmpty(principalId)}`, true);
							continue;
						}
						const customRoute = dmRouting?.resolveDmRoute;
						if (customRoute && !result) findings.push({
							checkId: `channels.${plugin.id}.dm.wildcard_routing_unverified.${route.accountId}`,
							severity: "warn",
							title: `${plugin.meta.label ?? plugin.id}${accountNote} wildcard DM isolation is unverified`,
							detail: "dmRouting.resolveDmRoute returned no unknown-principal policy; isolation for arbitrary senders cannot be established."
						});
						const useCoreRoute = !customRoute || Boolean(result && "kind" in result && result.kind === "core");
						const sessionKey = result && "sessionKey" in result ? result.sessionKey : useCoreRoute && route.dmScope === "main" ? route.sessionKey : void 0;
						if (sessionKey) for (const suffix of ["1", "2"]) recordPrincipal(plugin, route, sessionKey, `wildcard:shared:${plugin.id}-${route.accountId}:${suffix}`);
						else if (useCoreRoute && (route.dmScope === "per-channel-peer" || route.dmScope === "per-peer")) {
							const namespaces = route.dmScope === "per-peer" ? ["peer"] : [`channel:${plugin.id}`, "peer"];
							for (const namespace of namespaces) principalRoutes.push({
								accountKey: `${plugin.id}-${route.accountId}`,
								logicalPrincipalKey: `wildcard:${route.dmScope}:${plugin.id}-${route.accountId}`,
								bucketKey: `${route.agentId}\0symbolic:dm:${namespace}`
							});
						}
					}
				}
			}
			if (plugin.security.collectWarnings) {
				const warnings = await plugin.security.collectWarnings({
					cfg: params.cfg,
					accountId,
					account
				});
				for (const warning of warnings ?? []) {
					if (typeof warning !== "string") {
						findings.push(warning);
						continue;
					}
					const trimmed = warning.trim();
					if (!trimmed) continue;
					findings.push({
						checkId: `channels.${plugin.id}.warning.${findings.length + 1}`,
						severity: "warn",
						title: `${plugin.meta.label ?? plugin.id} security warning`,
						detail: trimmed.replace(/^-\s*/, "")
					});
				}
			}
			if (includeAuditOnly && plugin.security.collectAuditFindings) {
				const auditFindings = await plugin.security.collectAuditFindings({
					cfg: params.cfg,
					sourceConfig,
					accountId,
					account,
					orderedAccountIds,
					hasExplicitAccountPath
				});
				for (const finding of auditFindings ?? []) findings.push(finding);
			}
		}
	}
	const routesByBucket = /* @__PURE__ */ new Map();
	for (const route of principalRoutes) {
		const routes = routesByBucket.get(route.bucketKey) ?? [];
		routes.push(route);
		routesByBucket.set(route.bucketKey, routes);
	}
	const groupedRoutes = [...routesByBucket.entries()].filter(([, routes]) => new Set(routes.map((route) => route.logicalPrincipalKey)).size > 1);
	const broadWildcardAgents = new Set(groupedRoutes.filter(([bucketKey, routes]) => bucketKey.endsWith("\0symbolic:dm:peer") && routes.some((route) => route.logicalPrincipalKey.startsWith("wildcard:per-peer:"))).map(([bucketKey]) => bucketKey.split("\0", 1)[0]));
	const collisions = groupedRoutes.filter(([bucketKey, routes]) => {
		if (!bucketKey.includes("\0symbolic:")) return true;
		const agentId = bucketKey.split("\0", 1)[0];
		if (bucketKey.endsWith("\0symbolic:dm:peer")) return routes.some((route) => route.logicalPrincipalKey.startsWith("wildcard:per-peer:"));
		return !broadWildcardAgents.has(agentId) && routes.some((route) => route.logicalPrincipalKey.startsWith("wildcard:per-channel-peer:"));
	}).toSorted(([left], [right]) => left.localeCompare(right));
	for (const [collisionIndex, [bucketKey, routes]] of collisions.entries()) {
		const accountKeys = uniqueStrings(routes.map((route) => route.accountKey)).toSorted();
		const symbolic = bucketKey.includes("\0symbolic:");
		findings.push({
			checkId: `channels.dm.session_collision.${accountKeys.join("_")}.${collisionIndex + 1}`,
			severity: "warn",
			title: symbolic ? "DM principals may share a session" : "DM principals share a session",
			detail: `Collision topology ${collisionIndex + 1}: ${new Set(routes.map((route) => route.logicalPrincipalKey)).size} distinct admitted DM principals from ${accountKeys.join(", ")} ${symbolic ? "can resolve" : "resolve"} to the same session bucket owned by agent "${bucketKey.split("\0", 1)[0]}"` + (params.cfg.session?.scope === "global" ? " under session.scope=\"global\"." : ".") + " This can leak context across users.",
			remediation: "Set the effective DM route to an account-safe isolated scope; update the matching binding or session.dmScope as applicable."
		});
	}
	return dedupeFindings(findings);
}
//#endregion
export { collectChannelSecurityFindingsCore as t };
