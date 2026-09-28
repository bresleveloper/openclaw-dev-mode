import { r as racePromiseWithAbortSignal } from "./abort-signal-Z3A36sLL.mjs";
import "./worker-admission-BB3C4gz4.mjs";
import { g as NODE_WORKER_BUNDLE_INSTALL_COMMAND } from "./node-commands-BLhGKTZa.mjs";
import { n as workerBootstrapOperationTimeoutMs } from "./bootstrap-DH_A9h5r.mjs";
import { o as parseNodeWorkerBundleInstallResult } from "./node-bundle-install-protocol-BJDQfJm4.mjs";
import { o as verifyWorkerAdmissionHandshake } from "./admission-BzZXJ5YD.mjs";
//#region src/gateway/worker-environments/node-worker-bundle-installer.ts
function createGatewayNodeWorkerBundleInstaller(options) {
	return async (params) => {
		params.signal?.throwIfAborted();
		const transport = options.getTransport();
		if (!transport) throw new Error("Device worker node transport is unavailable");
		const node = await racePromiseWithAbortSignal(transport.getCurrentNode(params.deviceId), params.signal);
		params.signal?.throwIfAborted();
		if (!node) throw new Error("Device worker node is not connected with the installer dialect");
		const { artifact } = params;
		const isAuthorized = () => {
			params.assertCurrent?.();
			return !params.signal?.aborted && options.getTransport() === transport && transport.isCurrent(node);
		};
		if (!isAuthorized()) throw new Error("Device worker installation connection is no longer current");
		const bundlePrewarm = params.prewarm && (node.workerHost.bundlePrewarm ?? 0) >= 1 ? 1 : void 0;
		const prepared = options.transfer.prepare({
			node,
			gatewayNamespace: options.gatewayNamespace,
			artifact,
			...bundlePrewarm ? { bundlePrewarm } : {},
			isAuthorized,
			signal: params.signal
		});
		try {
			const result = await transport.invoke({
				node,
				command: NODE_WORKER_BUNDLE_INSTALL_COMMAND,
				params: prepared.input,
				timeoutMs: workerBootstrapOperationTimeoutMs(artifact),
				idempotencyKey: `${options.gatewayNamespace}:${artifact.bundleHash}`,
				isDispatchAuthorized: isAuthorized,
				...params.signal ? { signal: params.signal } : {}
			});
			if (!isAuthorized()) throw new Error("Device worker installation connection is no longer current");
			if (!result.ok) throw new Error(result.error?.message ? `Device worker bundle installation failed: ${result.error.message}` : "Device worker bundle installation failed");
			let payload = result.payload;
			if (result.payloadJSON) try {
				payload = JSON.parse(result.payloadJSON);
			} catch {
				payload = void 0;
			}
			const receipt = parseNodeWorkerBundleInstallResult(payload);
			if (!receipt || !verifyWorkerAdmissionHandshake(receipt, artifact)) throw new Error("Device worker bundle installer returned a mismatched build receipt");
			return receipt;
		} finally {
			options.transfer.revoke(prepared.token);
		}
	};
}
//#endregion
export { createGatewayNodeWorkerBundleInstaller };
