import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { v as resolveGatewayPort } from "./paths-DehQwyE0.mjs";
import { _ as redactSensitiveText } from "./redact-B5EGyLvV.mjs";
import { t as VERSION } from "./version-BkM1aB4w.mjs";
import { c as normalizeUpdateChannel, f as resolveUpdateChannelDisplay } from "./update-channels-BDINqyML.mjs";
import "./config-DryArA1l.mjs";
import { r as projectGatewayUrlForDiagnostics } from "./connection-details-Dr91v3w1.mjs";
import { n as resolveControlUiLinks } from "./control-ui-links-eOymVKB5.mjs";
import { i as formatGitInstallLabel } from "./update-check-CtYi2ZDp.mjs";
import { r as formatDurationPrecise } from "./format-duration-CeDWULoS.mjs";
import "./format-relative-BOUle7M5.mjs";
import { a as resolveUpdateAvailability, n as formatUpdateOneLiner } from "./status.update-BpH5SnQq.mjs";
//#region src/commands/status-all/format.ts
/** Resolves the display update channel from config, install kind, and git metadata. */
function resolveStatusUpdateChannelInfo(params) {
	return resolveUpdateChannelDisplay({
		configChannel: normalizeUpdateChannel(params.updateConfigChannel),
		currentVersion: VERSION,
		installKind: params.update.installKind ?? "unknown",
		gitTag: params.update.git?.tag ?? null,
		gitBranch: params.update.git?.branch ?? null
	});
}
/** Builds the update row fields reused by the overview table and status-all report. */
function buildStatusUpdateSurface(params) {
	const channelInfo = resolveStatusUpdateChannelInfo({
		updateConfigChannel: params.updateConfigChannel,
		update: params.update
	});
	return {
		channelInfo,
		channelLabel: channelInfo.label,
		gitLabel: formatGitInstallLabel(params.update),
		updateLine: formatUpdateOneLiner(params.update).replace(/^Update:\s*/i, ""),
		updateAvailable: resolveUpdateAvailability(params.update).available
	};
}
/** Formats Tailscale exposure in a compact, warning-aware status row value. */
function formatStatusTailscaleValue(params) {
	const decorateOff = params.decorateOff ?? ((value) => value);
	const decorateWarn = params.decorateWarn ?? ((value) => value);
	if (params.tailscaleMode === "off") {
		const suffix = params.includeDnsNameWhenOff ? params.dnsName : null;
		return decorateOff(suffix ? `off · ${suffix}` : "off");
	}
	if (params.dnsName && params.httpsUrl) return [
		params.tailscaleMode,
		params.includeBackendStateWhenOn ? "unknown" : null,
		params.dnsName,
		params.httpsUrl
	].filter(Boolean).join(" · ");
	return decorateWarn([
		params.tailscaleMode,
		params.includeBackendStateWhenOn ? "unknown" : null,
		"magicdns unknown"
	].filter(Boolean).join(" · "));
}
/** Formats launchd/systemd service state into one row-friendly string. */
function formatStatusServiceValue(params) {
	const inspectionDetail = params.loadState?.status === "unknown" ? params.loadState.detail : params.runtime?.status === "unknown" ? params.runtime.detail : void 0;
	const inspectionFailed = params.loadState?.status === "unknown" || Boolean(inspectionDetail);
	if (params.installed === false && !inspectionFailed) return `${params.label} not installed`;
	const installedPrefix = params.managedByOpenClaw ? "installed · " : "";
	const loadedText = inspectionDetail ? `${params.loadedText} (inspection failed: ${redactSensitiveText(inspectionDetail, { mode: "tools" })})` : params.loadedText;
	const runtimeSuffix = params.runtimeShort ? ` · ${params.runtimeShort}` : [params.runtime?.status ? ` · ${params.runtime.status}` : "", params.runtime?.pid ? ` (pid ${params.runtime.pid})` : ""].join("");
	const runtimeText = inspectionFailed ? redactSensitiveText(runtimeSuffix, { mode: "tools" }) : runtimeSuffix;
	const installationWarning = params.installationDrift ? ` · ${params.installationDrift}` : "";
	return `${params.label} ${installedPrefix}${loadedText}${runtimeText}${installationWarning}`;
}
/** Returns the dashboard URL when the Control UI is enabled for the current gateway binding. */
function resolveStatusDashboardUrl(params) {
	if (!(params.cfg.gateway?.controlUi?.enabled ?? true)) return null;
	return resolveControlUiLinks({
		port: resolveGatewayPort(params.cfg),
		bind: params.cfg.gateway?.bind,
		customBindHost: params.cfg.gateway?.customBindHost,
		basePath: params.cfg.gateway?.controlUi?.basePath,
		tlsEnabled: params.cfg.gateway?.tls?.enabled === true
	}).httpUrl;
}
/** Builds the ordered overview rows shared by status command variants. */
function buildStatusOverviewRows(params) {
	const rows = [...params.prefixRows ?? []];
	rows.push({
		Item: "Dashboard",
		Value: params.dashboardValue
	}, {
		Item: "Tailscale exposure",
		Value: params.tailscaleValue
	}, {
		Item: "Channel",
		Value: params.channelLabel
	});
	if (params.gitLabel) rows.push({
		Item: "Git",
		Value: params.gitLabel
	});
	rows.push({
		Item: "Update",
		Value: params.updateValue
	}, {
		Item: "Gateway",
		Value: params.gatewayValue
	});
	if (params.gatewayAuthWarning) rows.push({
		Item: "Gateway auth warning",
		Value: params.gatewayAuthWarning
	});
	rows.push(...params.middleRows ?? []);
	if (params.gatewaySelfValue != null) rows.push({
		Item: "Gateway self",
		Value: params.gatewaySelfValue
	});
	rows.push({
		Item: "Gateway service",
		Value: params.gatewayServiceValue
	}, {
		Item: "Node service",
		Value: params.nodeServiceValue
	}, {
		Item: "Agents",
		Value: params.agentsValue
	});
	rows.push(...params.suffixRows ?? []);
	return rows;
}
/** Builds overview rows directly from raw scan/update/gateway inputs. */
function buildStatusOverviewSurfaceRows(params) {
	const updateSurface = buildStatusUpdateSurface({
		updateConfigChannel: params.cfg.update?.channel,
		update: params.update
	});
	const { dashboardUrl, gatewayValue, gatewaySelfValue, gatewayServiceValue, nodeServiceValue } = buildStatusGatewaySurfaceValues({
		cfg: params.cfg,
		...params.advertisedControlUiLinks ? { advertisedControlUiLinks: params.advertisedControlUiLinks } : {},
		gatewayMode: params.gatewayMode,
		remoteUrlMissing: params.remoteUrlMissing,
		gatewayConnection: params.gatewayConnection,
		gatewayReachable: params.gatewayReachable,
		gatewayProbe: params.gatewayProbe,
		gatewayProbeAuth: params.gatewayProbeAuth,
		gatewaySelf: params.gatewaySelf,
		gatewayService: params.gatewayService,
		nodeService: params.nodeService,
		nodeOnlyGateway: params.nodeOnlyGateway,
		decorateOk: params.decorateOk,
		decorateWarn: params.decorateWarn
	});
	return buildStatusOverviewRows({
		prefixRows: params.prefixRows,
		dashboardValue: normalizeOptionalString(dashboardUrl) ?? "disabled",
		tailscaleValue: formatStatusTailscaleValue({
			tailscaleMode: params.tailscaleMode,
			dnsName: params.tailscaleDns,
			httpsUrl: params.tailscaleHttpsUrl,
			includeBackendStateWhenOn: params.includeBackendStateWhenOn,
			includeDnsNameWhenOff: params.includeDnsNameWhenOff,
			decorateOff: params.decorateTailscaleOff,
			decorateWarn: params.decorateTailscaleWarn
		}),
		channelLabel: updateSurface.channelLabel,
		gitLabel: updateSurface.gitLabel,
		updateValue: params.updateValue ?? updateSurface.updateLine,
		gatewayValue,
		gatewayAuthWarning: params.gatewayAuthWarningValue !== void 0 ? params.gatewayAuthWarningValue : params.gatewayProbeAuthWarning,
		middleRows: params.middleRows,
		gatewaySelfValue: gatewaySelfValue ?? params.gatewaySelfFallbackValue,
		gatewayServiceValue,
		nodeServiceValue,
		agentsValue: params.agentsValue,
		suffixRows: params.suffixRows
	});
}
/** Returns which gateway auth material was actually used for the probe. */
function formatGatewayAuthUsed(auth) {
	const hasToken = Boolean(auth?.token?.trim());
	const hasPassword = Boolean(auth?.password?.trim());
	if (hasToken && hasPassword) return "token+password";
	if (hasToken) return "token";
	if (hasPassword) return "password";
	return "none";
}
/** Formats gateway self metadata returned by the health endpoint. */
function formatGatewaySelfSummary(gatewaySelf) {
	return gatewaySelf?.host || gatewaySelf?.ip || gatewaySelf?.version || gatewaySelf?.platform ? [
		gatewaySelf.host ? gatewaySelf.host : null,
		gatewaySelf.ip ? `(${gatewaySelf.ip})` : null,
		gatewaySelf.version ? `app ${gatewaySelf.version}` : null,
		gatewaySelf.platform ? gatewaySelf.platform : null
	].filter(Boolean).join(" ") : null;
}
/** Builds gateway target, reachability, auth, and mode strings for text status output. */
function buildGatewayStatusSummaryParts(params) {
	const displayUrl = projectGatewayUrlForDiagnostics(params.gatewayConnection.url);
	const targetText = params.remoteUrlMissing ? `fallback ${displayUrl}` : displayUrl;
	return {
		targetText,
		targetTextWithSource: params.gatewayConnection.urlSource ? `${targetText} (${params.gatewayConnection.urlSource})` : targetText,
		reachText: params.remoteUrlMissing ? "misconfigured (remote.url missing)" : params.gatewayProbe?.startupPhase ? `still starting (phase ${params.gatewayProbe.startupPhase})` : params.gatewayReachable ? `reachable ${formatDurationPrecise(params.gatewayProbe?.connectLatencyMs ?? 0)}` : params.gatewayProbe?.error ? `unreachable (${params.gatewayProbe.error})` : "unreachable",
		authText: params.gatewayReachable ? `auth ${formatGatewayAuthUsed(params.gatewayProbeAuth)}` : "",
		modeLabel: `${params.gatewayMode}${params.remoteUrlMissing ? " (remote.url missing)" : ""}`
	};
}
/** Builds gateway/dashboard/service values for overview rows. */
function buildStatusGatewaySurfaceValues(params) {
	const decorateOk = params.decorateOk ?? ((value) => value);
	const decorateWarn = params.decorateWarn ?? ((value) => value);
	const gatewaySummary = buildGatewayStatusSummaryParts(params);
	const gatewaySelfValue = formatGatewaySelfSummary(params.gatewaySelf);
	const gatewayValue = params.nodeOnlyGateway?.gatewayValue ?? `${gatewaySummary.modeLabel} · ${gatewaySummary.targetTextWithSource} · ${params.remoteUrlMissing ? decorateWarn(gatewaySummary.reachText) : params.gatewayReachable ? decorateOk(gatewaySummary.reachText) : decorateWarn(gatewaySummary.reachText)}${params.gatewayReachable && !params.remoteUrlMissing && gatewaySummary.authText ? ` · ${gatewaySummary.authText}` : ""}${gatewaySelfValue ? ` · ${gatewaySelfValue}` : ""}`;
	return {
		dashboardUrl: params.advertisedControlUiLinks?.httpUrl ?? resolveStatusDashboardUrl({ cfg: params.cfg }),
		gatewayValue,
		gatewaySelfValue,
		gatewayServiceValue: formatStatusServiceValue(params.gatewayService),
		nodeServiceValue: formatStatusServiceValue(params.nodeService)
	};
}
/** Builds the stable gateway object used by `openclaw status --json`. */
function buildGatewayStatusJsonPayload(params) {
	return {
		mode: params.gatewayMode,
		url: projectGatewayUrlForDiagnostics(params.gatewayConnection.url),
		urlSource: params.gatewayConnection.urlSource,
		misconfigured: params.remoteUrlMissing,
		reachable: params.gatewayReachable,
		...params.gatewayProbe?.startupPhase ? {
			readiness: "still-starting",
			startupPhase: params.gatewayProbe.startupPhase
		} : {},
		connectLatencyMs: params.gatewayProbe?.connectLatencyMs ?? null,
		self: params.gatewaySelf ?? null,
		error: params.gatewayProbe?.error ?? null,
		authWarning: params.gatewayProbeAuthWarning ?? null
	};
}
/** Redacts common credential shapes before text is printed in status diagnostics. */
function redactStatusSecrets(text) {
	if (!text) return text;
	let out = text;
	out = out.replace(/(\b(?:access[_-]?token|refresh[_-]?token|token|password|secret|api[_-]?key)\b\s*[:=]\s*)("?)([^"\\s]+)("?)/gi, "$1$2***$4");
	out = out.replace(/\bBearer\s+[A-Za-z0-9._-]+\b/g, "Bearer ***");
	out = out.replace(/\bsk-[A-Za-z0-9]{10,}\b/g, "sk-***");
	return out;
}
//#endregion
export { resolveStatusUpdateChannelInfo as a, redactStatusSecrets as i, buildStatusOverviewSurfaceRows as n, buildStatusUpdateSurface as r, buildGatewayStatusJsonPayload as t };
