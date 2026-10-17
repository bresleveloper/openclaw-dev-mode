import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { _ as redactSensitiveText } from "./redact-DJ8j6ADa.mjs";
import { b as resolveGatewayPort } from "./paths-DGIwWbpu.mjs";
import { t as VERSION } from "./version-BJGPJZu6.mjs";
import { c as normalizeUpdateChannel, f as resolveUpdateChannelDisplay } from "./update-channels-BquD107I.mjs";
import { i as formatGitInstallLabel } from "./update-check-CWEQyown.mjs";
import "./config-9720xhC5.mjs";
import { r as formatDurationPrecise } from "./format-duration-BIQQYTeV.mjs";
import { r as projectGatewayUrlForDiagnostics } from "./connection-details-BcuL3xPn.mjs";
import "./format-relative-Bcp7RoO9.mjs";
import { n as resolveControlUiLinks } from "./control-ui-links-CvxEAkDu.mjs";
import { a as resolveUpdateAvailability, n as formatUpdateOneLiner } from "./status.update-C-cURGRC.mjs";
//#region src/commands/status-all/format.ts
function resolveStatusUpdateChannelInfo(params) {
	return resolveUpdateChannelDisplay({
		configChannel: normalizeUpdateChannel(params.updateConfigChannel),
		currentVersion: VERSION,
		installKind: params.update.installKind ?? "unknown",
		gitTag: params.update.git?.tag ?? null,
		gitBranch: params.update.git?.branch ?? null
	});
}
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
function buildStatusOverviewSurfaceRows(params) {
	const updateSurface = buildStatusUpdateSurface({
		updateConfigChannel: params.cfg.update?.channel,
		update: params.update
	});
	const decorateOk = params.decorateOk ?? ((value) => value);
	const decorateWarn = params.decorateWarn ?? ((value) => value);
	const gatewaySummary = buildGatewayStatusSummaryParts(params);
	const gatewaySelfValue = formatGatewaySelfSummary(params.gatewaySelf);
	const gatewayValue = params.nodeOnlyGateway?.gatewayValue ?? `${gatewaySummary.modeLabel} · ${gatewaySummary.targetTextWithSource} · ${params.remoteUrlMissing ? decorateWarn(gatewaySummary.reachText) : params.gatewayReachable ? decorateOk(gatewaySummary.reachText) : decorateWarn(gatewaySummary.reachText)}${params.gatewayReachable && !params.remoteUrlMissing && gatewaySummary.authText ? ` · ${gatewaySummary.authText}` : ""}${gatewaySelfValue ? ` · ${gatewaySelfValue}` : ""}`;
	const dashboardUrl = params.advertisedControlUiLinks?.httpUrl ?? resolveStatusDashboardUrl({ cfg: params.cfg });
	const gatewayServiceValue = formatStatusServiceValue(params.gatewayService);
	const nodeServiceValue = formatStatusServiceValue(params.nodeService);
	const tailscaleValue = formatStatusTailscaleValue({
		tailscaleMode: params.tailscaleMode,
		dnsName: params.tailscaleDns,
		httpsUrl: params.tailscaleHttpsUrl,
		includeBackendStateWhenOn: params.includeBackendStateWhenOn,
		includeDnsNameWhenOff: params.includeDnsNameWhenOff,
		decorateOff: params.decorateTailscaleOff,
		decorateWarn: params.decorateTailscaleWarn
	});
	const gatewayAuthWarning = params.gatewayAuthWarningValue !== void 0 ? params.gatewayAuthWarningValue : params.gatewayProbeAuthWarning;
	const gatewaySelfRowValue = gatewaySelfValue ?? params.gatewaySelfFallbackValue;
	const rows = [
		...params.prefixRows ?? [],
		{
			Item: "Dashboard",
			Value: normalizeOptionalString(dashboardUrl) ?? "disabled"
		},
		{
			Item: "Tailscale exposure",
			Value: tailscaleValue
		},
		{
			Item: "Channel",
			Value: updateSurface.channelLabel
		}
	];
	if (updateSurface.gitLabel) rows.push({
		Item: "Git",
		Value: updateSurface.gitLabel
	});
	rows.push({
		Item: "Update",
		Value: params.updateValue ?? updateSurface.updateLine
	}, {
		Item: "Gateway",
		Value: gatewayValue
	});
	if (gatewayAuthWarning) rows.push({
		Item: "Gateway auth warning",
		Value: gatewayAuthWarning
	});
	rows.push(...params.middleRows ?? []);
	if (gatewaySelfRowValue != null) rows.push({
		Item: "Gateway self",
		Value: gatewaySelfRowValue
	});
	rows.push({
		Item: "Gateway service",
		Value: gatewayServiceValue
	}, {
		Item: "Node service",
		Value: nodeServiceValue
	}, {
		Item: "Agents",
		Value: params.agentsValue
	}, ...params.suffixRows ?? []);
	return rows;
}
function formatGatewayAuthUsed(auth) {
	const hasToken = Boolean(auth?.token?.trim());
	const hasPassword = Boolean(auth?.password?.trim());
	if (hasToken && hasPassword) return "token+password";
	if (hasToken) return "token";
	if (hasPassword) return "password";
	return "none";
}
function formatGatewaySelfSummary(gatewaySelf) {
	return gatewaySelf?.host || gatewaySelf?.ip || gatewaySelf?.version || gatewaySelf?.platform ? [
		gatewaySelf.host ? gatewaySelf.host : null,
		gatewaySelf.ip ? `(${gatewaySelf.ip})` : null,
		gatewaySelf.version ? `app ${gatewaySelf.version}` : null,
		gatewaySelf.platform ? gatewaySelf.platform : null
	].filter(Boolean).join(" ") : null;
}
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
