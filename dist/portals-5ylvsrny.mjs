import "./operator-scopes-D-CL26h0.mjs";
import { t as ErrorCodes } from "./gateway-error-details-D85F07e9.mjs";
import { dr as validatePortalCloseParams, fr as validatePortalListParams, pr as validatePortalOpenParams } from "./src-BRUl7oDv.mjs";
import { f as errorShape } from "./error-codes-DvB36bCj.mjs";
import { n as defineValidatedGatewayMethod } from "./validation-CFv_zneu.mjs";
import { n as resolveSessionEnvironmentCaller } from "./environments.session-DZ2z4LOC.mjs";
//#region src/gateway/server-methods/portals.ts
function requirePortalService(context, respond) {
	const service = context.portalService;
	if (!service) respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "portals unavailable"));
	return service;
}
function redactPortalSummary(summary) {
	const { tokenQuery: _tokenQuery, url: _url, ...redacted } = summary;
	return redacted;
}
function attachedPortalOwner(options, environmentId) {
	const { context } = options;
	const environments = context.workerEnvironmentService;
	if (!environments) throw new Error("Conversation environments are unavailable");
	const caller = resolveSessionEnvironmentCaller(options);
	const binding = environments.findSessionAttachment(caller.identity);
	if (!binding || binding.environmentId !== environmentId) throw new Error("Portal environment is not attached to this conversation");
	const assertCurrent = () => {
		caller.assertCurrent();
		environments.assertSessionAttachment(binding);
	};
	assertCurrent();
	return {
		binding,
		environments,
		assertCurrent
	};
}
const portalHandlers = {
	"portal.list": defineValidatedGatewayMethod("portal.list", validatePortalListParams, (options) => {
		const { params, respond, context, client } = options;
		const service = requirePortalService(context, respond);
		if (!service) return;
		const scopes = Array.isArray(client?.connect?.scopes) ? client.connect.scopes : [];
		let portals;
		try {
			const owner = params.environmentId ? attachedPortalOwner(options, params.environmentId) : void 0;
			portals = owner ? service.listWorkerPortals(owner.binding.environmentId, owner.binding.ownerEpoch) : service.list();
		} catch (error) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, String(error)));
			return;
		}
		respond(true, { portals: scopes.includes("operator.write") || scopes.includes("operator.admin") ? portals : portals.map(redactPortalSummary) }, void 0);
	}),
	"portal.open": defineValidatedGatewayMethod("portal.open", validatePortalOpenParams, async (options) => {
		const { params: request, respond, context } = options;
		const service = requirePortalService(context, respond);
		if (!service) return;
		try {
			const owner = request.environmentId ? attachedPortalOwner(options, request.environmentId) : void 0;
			await owner?.environments.touchSessionAttachment(owner.binding);
			owner?.assertCurrent();
			const connection = owner ? await owner.environments.openNodePortal({
				environmentId: owner.binding.environmentId,
				ownerEpoch: owner.binding.ownerEpoch,
				remotePort: request.port
			}) : void 0;
			try {
				owner?.assertCurrent();
			} catch (error) {
				await connection?.close();
				throw error;
			}
			const opened = await service.open({
				targetPort: request.port,
				...owner && connection ? {
					target: {
						kind: "worker",
						environmentId: owner.binding.environmentId,
						ownerEpoch: owner.binding.ownerEpoch,
						remotePort: request.port,
						connect: async () => {
							owner.environments.assertSessionAttachment(owner.binding);
							const stream = await connection.connect();
							try {
								await owner.environments.touchSessionAttachment(owner.binding);
								owner.assertCurrent();
								return stream;
							} catch (error) {
								stream.destroy();
								throw error;
							}
						}
					},
					assertCurrent: owner.assertCurrent,
					onClose: connection.close
				} : {},
				...request.title !== void 0 ? { title: request.title } : {},
				...request.description !== void 0 ? { description: request.description } : {},
				...request.path !== void 0 ? { path: request.path } : {}
			});
			owner?.assertCurrent();
			context.broadcast("portal.changed", { portals: service.list().map(redactPortalSummary) }, { dropIfSlow: true });
			respond(true, opened, void 0);
		} catch (error) {
			respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, error instanceof Error ? error.message : String(error)));
		}
	}),
	"portal.close": defineValidatedGatewayMethod("portal.close", validatePortalCloseParams, async (options) => {
		const { params, respond, context } = options;
		const service = requirePortalService(context, respond);
		if (!service) return;
		try {
			const owner = params.environmentId ? attachedPortalOwner(options, params.environmentId) : void 0;
			if (owner && !service.listWorkerPortals(owner.binding.environmentId, owner.binding.ownerEpoch).some((portal) => portal.id === params.id)) throw new Error("Portal does not belong to the attached environment");
			if (owner) await service.close(params.id, owner.assertCurrent);
			else await service.close(params.id);
			owner?.assertCurrent();
			context.broadcast("portal.changed", { portals: service.list().map(redactPortalSummary) }, { dropIfSlow: true });
			respond(true, { closed: true }, void 0);
		} catch (error) {
			respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, error instanceof Error ? error.message : String(error)));
		}
	})
};
//#endregion
export { portalHandlers };
