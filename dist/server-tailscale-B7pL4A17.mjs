import { d as sleepWithAbort, n as computeBackoff, o as racePromiseWithAbortSignal } from "./src-Bzfi3cQM.mjs";
import "./abort-signal-C9DFO3n5.mjs";
import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import "./backoff-N5Hi0doU.mjs";
import { a as resolveTailscalePublishedHost } from "./tailscale-status-D3CkNS90.mjs";
import { a as getTailnetHostnameAfterServe, c as TailscaleServeDisabledError, i as getTailnetHostname, l as isTailscaleRouteOwnershipConflictError, o as hasTailscaleFunnelRouteForPort, t as claimTailscaleRoute } from "./tailscale-DIe8yR1S.mjs";
import { n as prepareTailscalePublishedOrigin } from "./tailscale-published-origin-BvNdSLZR.mjs";
//#region src/gateway/server-tailscale.ts
const RECLAIM_BACKOFF = {
	initialMs: 1e3,
	maxMs: 6e4,
	factor: 2,
	jitter: .2
};
async function startGatewayTailscaleExposure(params) {
	if (params.tailscaleMode === "off") return null;
	if (!params.backend) throw new Error("Managed Tailscale ingress failed to start");
	const backendTarget = params.backend.port;
	const effectiveMode = params.tailscaleMode;
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
	const claimRoute = async (signal) => {
		let claim;
		let clearPublishedOrigin;
		try {
			claim = await claimTailscaleRoute(effectiveMode, backendTarget, params.port, params.logTailscale.info, signal);
			const hostname = (params.tailscaleMode === "serve" ? getTailnetHostnameAfterServe() : getTailnetHostname()).catch((error) => {
				params.logTailscale.warn(`Could not read the Tailscale hostname; managed portal ingress is unavailable: ${formatErrorMessage(error)}`);
				return null;
			});
			const host = await racePromiseWithAbortSignal(hostname, signal, (aborted) => aborted.reason);
			signal?.throwIfAborted();
			if (!claim.isActive()) throw new Error(`Managed Tailscale ${params.tailscaleMode} claim exited during startup`);
			const publicHost = host && resolveTailscalePublishedHost({
				tailscaleMode: effectiveMode,
				tailnetHost: host
			});
			if (publicHost) clearPublishedOrigin = prepareTailscalePublishedOrigin({
				origin: `https://${publicHost}`,
				mode: effectiveMode
			});
			const uiPath = params.controlUiBasePath ? `${params.controlUiBasePath}/` : "/";
			params.logTailscale.info(publicHost ? `${effectiveMode} enabled: https://${publicHost}${uiPath} (WS via wss://${publicHost})` : `${effectiveMode} enabled`);
			return {
				claim,
				clearPublishedOrigin
			};
		} catch (err) {
			clearPublishedOrigin?.();
			try {
				await claim?.stop();
			} catch (cleanupError) {
				throw new AggregateError([err, cleanupError], "Tailscale exposure startup and cleanup failed", { cause: cleanupError });
			}
			signal?.throwIfAborted();
			throw err;
		}
	};
	let route;
	try {
		route = await claimRoute(params.signal);
	} catch (err) {
		if (params.tailscaleMode === "serve" && err instanceof TailscaleServeDisabledError) {
			params.logTailscale.warn("Tailscale Serve is not enabled on this tailnet. The authenticated local Gateway remains available on loopback; remote access is unavailable. Restore the intended tailnet Serve policy and restart the Gateway.");
			return null;
		}
		params.logTailscale.warn(`${params.tailscaleMode} failed: ${formatErrorMessage(err)}`);
		throw err;
	}
	const recoveryAbort = new AbortController();
	const recoverySignal = recoveryAbort.signal;
	let recoveryFailure;
	const recovery = (async () => {
		while (!recoverySignal.aborted) {
			await racePromiseWithAbortSignal(route.claim.exited, recoverySignal);
			recoverySignal.throwIfAborted();
			route.clearPublishedOrigin?.();
			params.logTailscale.warn(`${effectiveMode} route claim exited; recovering managed Tailscale ingress`);
			for (let attempt = 1;; attempt += 1) {
				await sleepWithAbort(computeBackoff(RECLAIM_BACKOFF, attempt), recoverySignal, { ref: false });
				try {
					route = await claimRoute(recoverySignal);
					break;
				} catch (error) {
					if (recoverySignal.aborted || error instanceof AggregateError || isTailscaleRouteOwnershipConflictError(error)) throw error;
					params.logTailscale.warn(`${effectiveMode} recovery failed; retrying: ${formatErrorMessage(error)}`);
				}
			}
		}
	})().catch((error) => {
		if (error instanceof AggregateError) recoveryFailure = error;
		if (!recoverySignal.aborted || recoveryFailure) params.logTailscale.warn(`${effectiveMode} recovery stopped: ${formatErrorMessage(error)}`);
	});
	return async () => {
		recoveryAbort.abort();
		route.clearPublishedOrigin?.();
		await recovery;
		route.clearPublishedOrigin?.();
		await route.claim.stop();
		if (recoveryFailure) throw recoveryFailure;
	};
}
//#endregion
export { startGatewayTailscaleExposure };
