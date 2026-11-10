//#region src/infra/tailscale-backend-stopped-error.ts
const TAILSCALE_BACKEND_STOPPED_REASON = "gateway.tailscale_backend_stopped";
var TailscaleBackendStoppedError = class extends Error {
	constructor() {
		super("Tailscale is stopped. Restore the intended Tailscale connection before restarting the Gateway; managed ingress remains required.");
		this.code = TAILSCALE_BACKEND_STOPPED_REASON;
		this.name = "TailscaleBackendStoppedError";
	}
};
//#endregion
export { TailscaleBackendStoppedError as n, TAILSCALE_BACKEND_STOPPED_REASON as t };
