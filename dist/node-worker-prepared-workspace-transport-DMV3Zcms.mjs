import { r as racePromiseWithAbortSignal } from "./abort-signal-Z3A36sLL.mjs";
import { O as NODE_WORKER_WORKSPACE_PREPARE_COMMAND } from "./node-commands-BLhGKTZa.mjs";
import { n as parseNodeWorkerPreparedWorkspaceResult } from "./node-workspace-prepared-protocol-CRmpoPKO.mjs";
import { n as readWorkerProjectPreparation } from "./preparation-identity-B9ncl7Bw.mjs";
//#region src/gateway/worker-environments/node-worker-prepared-workspace-transport.ts
/** Register and bind only while the durable owner and paired node still authorize the operation. */
function createNodeWorkerPreparedWorkspaceTransport(options) {
	const invokePreparedWorkspace = async (request) => {
		const { input, signal } = request;
		const assertCurrent = () => {
			signal?.throwIfAborted();
			request.assertCurrent();
		};
		assertCurrent();
		const transport = options.getNodeTransport();
		if (!transport) throw new Error("Prepared workspace node transport is unavailable");
		const node = await racePromiseWithAbortSignal(transport.getCurrentNode(request.deviceId), signal);
		assertCurrent();
		if (!node || !transport.isCurrent(node)) throw new Error("Prepared workspace node protocol is unavailable");
		const timeoutMs = input.action === "register" ? 605e3 : 3e4;
		const result = await transport.invoke({
			node,
			command: NODE_WORKER_WORKSPACE_PREPARE_COMMAND,
			params: input,
			signal,
			timeoutMs,
			idempotencyKey: `${input.environmentId}:${input.preparationKey}:${input.action}`,
			isDispatchAuthorized: () => {
				assertCurrent();
				return transport.isCurrent(node);
			}
		});
		assertCurrent();
		if (!result.ok) throw new Error(`Prepared workspace ${input.action} failed${result.error?.message ? `: ${result.error.message}` : ""}`);
		const payload = result.payloadJSON ? JSON.parse(result.payloadJSON) : result.payload;
		const registered = parseNodeWorkerPreparedWorkspaceResult(payload);
		if (!registered || registered.gatewayNamespace !== input.gatewayNamespace || registered.environmentId !== input.environmentId || registered.preparationKey !== input.preparationKey || registered.cacheKey !== input.cacheKey || input.action === "register" && (registered.workspaceDir !== input.workspaceDir || registered.homeDir !== input.homeDir || registered.sourceManifestRef !== input.sourceManifestRef || registered.preparedManifestRef !== input.preparedManifestRef)) throw new Error("Node did not acknowledge the exact prepared workspace");
		return registered;
	};
	return {
		registerPreparedWorkspace: async ({ record, deviceId, workspace, assertCurrent, signal }) => {
			const enrollment = options.store.get(record.environmentId);
			const assertRegistrationCurrent = () => {
				signal?.throwIfAborted();
				assertCurrent();
				const current = options.store.get(record.environmentId);
				const preparation = current && readWorkerProjectPreparation(current.profileSnapshot.project);
				if (current?.state !== "provisioning" || current.ownerEpoch !== record.ownerEpoch || current.provisionOperationId !== record.provisionOperationId || !enrollment?.nodeSetupId || current.nodeSetupId !== enrollment.nodeSetupId || current.nodeDeviceId !== deviceId || current.attachedSessionIds.length !== 0 || current.destroyRequestedAtMs !== null || preparation?.key !== workspace.preparationKey || preparation.cacheKey !== workspace.cacheKey) throw new Error("Prepared workspace lost its exact provisioning owner");
			};
			await invokePreparedWorkspace({
				deviceId,
				assertCurrent: assertRegistrationCurrent,
				signal,
				input: {
					action: "register",
					gatewayNamespace: options.gatewayNamespace,
					environmentId: record.environmentId,
					...workspace
				}
			});
		},
		bindPreparedWorkspace: async ({ assertCurrent, signal, ...binding }) => {
			const record = options.store.get(binding.environmentId);
			const placement = options.placementStore.get(binding.sessionId);
			const assertBindingCurrent = () => {
				signal?.throwIfAborted();
				assertCurrent();
				const current = options.store.get(binding.environmentId);
				const currentPlacement = options.placementStore.get(binding.sessionId);
				const credential = options.store.getCredential(binding.environmentId);
				const preparation = current && readWorkerProjectPreparation(current.profileSnapshot.project);
				if (!record?.nodeDeviceId || current?.nodeDeviceId !== record.nodeDeviceId || current.state !== "attached" || current.sharedHost !== false || current.ownerEpoch !== binding.ownerEpoch || current.attachedSessionIds.length !== 1 || current.attachedSessionIds[0] !== binding.sessionId || current.destroyRequestedAtMs !== null || credential?.ownerEpoch !== binding.ownerEpoch || credential.sessionId !== binding.sessionId || preparation?.key !== binding.preparationKey || preparation.cacheKey !== binding.cacheKey || !placement || !currentPlacement || currentPlacement.generation !== placement.generation || currentPlacement.sessionKey !== binding.sessionKey || currentPlacement.environmentId !== binding.environmentId || ![
					"syncing",
					"starting",
					"active"
				].includes(currentPlacement.state) || currentPlacement.state === "active" && currentPlacement.activeOwnerEpoch !== binding.ownerEpoch) throw new Error("Prepared workspace lost its exact attached placement owner");
				return record.nodeDeviceId;
			};
			const deviceId = assertBindingCurrent();
			return await invokePreparedWorkspace({
				deviceId,
				assertCurrent: assertBindingCurrent,
				signal,
				input: {
					action: "bind",
					gatewayNamespace: options.gatewayNamespace,
					...binding
				}
			});
		}
	};
}
//#endregion
export { createNodeWorkerPreparedWorkspaceTransport };
