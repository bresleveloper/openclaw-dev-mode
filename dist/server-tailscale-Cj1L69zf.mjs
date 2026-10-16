import { o as racePromiseWithAbortSignal } from "./src-D1BHGNTj.mjs";
import "./abort-signal-QqAmLWTl.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { a as resolveTailscalePublishedHost } from "./tailscale-status-BA6JQcBe.mjs";
import { a as getTailnetHostnameAfterServe, c as TailscaleServeDisabledError, i as getTailnetHostname, o as hasTailscaleFunnelRouteForPort, t as claimTailscaleRoute } from "./tailscale-CHbn3zco.mjs";
import { n as prepareTailscalePublishedOrigin } from "./tailscale-published-origin-BvNdSLZR.mjs";
//#region src/gateway/server-tailscale.ts
async function startGatewayTailscaleExposure(params) {
	if (params.tailscaleMode === "off") return null;
	if (!params.backend) throw new Error("Managed Tailscale ingress failed to start");
	const backendTarget = params.backend.port;
	const effectiveMode = params.tailscaleMode;
	let clearPublishedOrigin;
	if (params.tailscaleMode === "serve" && params.preserveFunnel === true) {
		let preservedFunnel;
		try {
			preservedFunnel = await hasTailscaleFunnelRouteForPort(params.port);
		} catch (error) {
			params.logTailscale.warn(`serve not changed because external Funnel status could not be inspected: ${formatErrorMessage(error)}`);
			throw error;
		}
		if (preservedFunnel) {
			params.logTailscale.warn(`external Tailscale Funnel for port ${params.port} remains active only for plugin-authenticated webhook routes; Gateway-authenticated routes reject its unattributable ingress. First configure a durable gateway password (gateway.auth.password or OPENCLAW_GATEWAY_PASSWORD) and set gateway.auth.mode=password, then run \`openclaw config set gateway.tailscale.mode funnel\` and \`openclaw config unset gateway.tailscale.preserveFunnel\`; see https://docs.openclaw.ai/gateway/tailscale#public-internet-funnel-%2B-shared-password`);
			return null;
		}
	}
	let claim;
	try {
		claim = await claimTailscaleRoute(params.tailscaleMode, backendTarget, params.port, params.logTailscale.info, params.signal);
		const hostname = (params.tailscaleMode === "serve" ? getTailnetHostnameAfterServe() : getTailnetHostname()).catch(() => null);
		const host = await racePromiseWithAbortSignal(hostname, params.signal, (signal) => signal.reason);
		params.signal?.throwIfAborted();
		if (!claim.isActive()) throw new Error(`Managed Tailscale ${params.tailscaleMode} claim exited during startup`);
		if (host) {
			const uiPath = params.controlUiBasePath ? `${params.controlUiBasePath}/` : "/";
			const publicHost = resolveTailscalePublishedHost({
				tailscaleMode: effectiveMode,
				tailnetHost: host
			});
			if (publicHost) {
				clearPublishedOrigin = prepareTailscalePublishedOrigin({
					origin: `https://${publicHost}`,
					mode: effectiveMode
				});
				params.logTailscale.info(`${params.tailscaleMode} enabled: https://${publicHost}${uiPath} (WS via wss://${publicHost})`);
			} else params.logTailscale.info(`${params.tailscaleMode} enabled`);
		} else params.logTailscale.info(`${params.tailscaleMode} enabled`);
	} catch (err) {
		clearPublishedOrigin?.();
		try {
			await claim?.stop();
		} catch (cleanupError) {
			throw new AggregateError([err, cleanupError], "Tailscale exposure startup and cleanup failed", { cause: cleanupError });
		}
		params.signal?.throwIfAborted();
		if (params.tailscaleMode === "serve" && err instanceof TailscaleServeDisabledError) {
			params.logTailscale.warn("Tailscale Serve is not enabled on this tailnet. The authenticated local Gateway remains available on loopback; remote access is unavailable. Restore the intended tailnet Serve policy and restart the Gateway.");
			return null;
		}
		params.logTailscale.warn(`${params.tailscaleMode} failed: ${formatErrorMessage(err)}`);
		throw err;
	}
	let stopping = false;
	claim.exited.then(() => {
		if (stopping) return;
		clearPublishedOrigin?.();
		params.logTailscale.warn(`${params.tailscaleMode} route claim exited; managed Tailscale ingress is unavailable until the Gateway restarts`);
	});
	return async () => {
		stopping = true;
		clearPublishedOrigin?.();
		await claim.stop();
	};
}
//#endregion
export { startGatewayTailscaleExposure };
