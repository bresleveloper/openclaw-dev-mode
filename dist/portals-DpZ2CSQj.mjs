import "./operator-scopes-DsrPoRc4.mjs";
import { hr as validatePortalOpenParams, mr as validatePortalListParams, ni as validateSessionPortalListParams, pr as validatePortalCloseParams, ri as validateSessionPortalOpenParams, ti as validateSessionPortalCloseParams } from "./src-l2dWvEsN.mjs";
import { t as ErrorCodes } from "./gateway-error-details-DIefe7Zy.mjs";
import { f as errorShape } from "./error-codes-Dh56LniQ.mjs";
import { t as captureSessionPortalTarget } from "./session-portal-target-D54R2k-a.mjs";
import { r as defineValidatedGatewayMethod } from "./validation-Bu27N0nv.mjs";
import { n as resolveSessionEnvironmentCaller } from "./environments.session-DzsfuyeT.mjs";
import { n as createPortalOperations, r as redactPortalSummary } from "./portal-service-DOivgj0M.mjs";
//#region src/gateway/server-methods/portals.session.ts
function sessionPortalOwner(options, environmentId) {
	const access = options.sessionAccessAuthority;
	const environments = options.context.workerEnvironmentService;
	const service = options.context.portalService;
	if (!access || !environments || !service) throw new Error("Session preview authority or transport is unavailable");
	if (access.sandboxRequired) throw new Error("This conversation requires sandbox isolation; attached machine previews are unavailable");
	const target = captureSessionPortalTarget(environments, {
		...access.target,
		sessionLifecycleRevision: access.target.lifecycleRevision
	}, environmentId);
	const assertInvocationCurrent = () => {
		access.assertCurrent();
		target.assertCurrent();
	};
	assertInvocationCurrent();
	const { binding } = target;
	const resourceOwnerKey = JSON.stringify([
		binding.agentId,
		binding.sessionKey,
		binding.sessionId,
		binding.sessionLifecycleRevision ?? null,
		binding.generation
	]);
	return createPortalOperations(service, {
		...binding,
		resourceOwnerKey,
		assertCurrent: assertInvocationCurrent,
		ownershipError: "Portal does not belong to this conversation's attached environment",
		async prepareTarget(remotePort) {
			await target.touch();
			assertInvocationCurrent();
			const session = access.retainSession();
			try {
				session.assertCurrent();
				const connection = await environments.openNodePortal({
					environmentId: binding.environmentId,
					ownerEpoch: binding.ownerEpoch,
					remotePort
				});
				return {
					assertCurrent: () => session.assertCurrent(),
					ownerSignal: AbortSignal.any([session.signal, target.signal]),
					connect: () => connection.connect(() => {
						session.assertCurrent();
						target.assertCurrent();
					}, target.touch),
					close: async () => {
						try {
							await connection.close();
						} finally {
							session.release();
						}
					}
				};
			} catch (error) {
				session.release();
				throw error;
			}
		}
	}, () => broadcastPortalChange(options.context, service));
}
function sessionPortalError(error) {
	return errorShape(ErrorCodes.INVALID_REQUEST, error instanceof Error ? error.message : "Session preview request failed");
}
function broadcastPortalChange(context, service) {
	context.broadcast("portal.changed", { portals: service.list().map(redactPortalSummary) }, { dropIfSlow: true });
}
const sessionPortalHandlers = {
	"portal.session.list": defineValidatedGatewayMethod("portal.session.list", validateSessionPortalListParams, (options) => {
		const portals = sessionPortalOwner(options, options.params.environmentId);
		options.respond(true, portals.list());
	}, sessionPortalError),
	"portal.session.open": defineValidatedGatewayMethod("portal.session.open", validateSessionPortalOpenParams, async (options) => {
		const portals = sessionPortalOwner(options, options.params.environmentId);
		options.respond(true, await portals.open(options.params));
	}, sessionPortalError),
	"portal.session.close": defineValidatedGatewayMethod("portal.session.close", validateSessionPortalCloseParams, async (options) => {
		const portals = sessionPortalOwner(options, options.params.environmentId);
		options.respond(true, await portals.close(options.params.id));
	}, sessionPortalError)
};
//#endregion
//#region src/gateway/server-methods/portals.ts
function requirePortalService(context, respond) {
	const service = context.portalService;
	if (!service) respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "portals unavailable"));
	return service;
}
function portalOperations(options, service, environmentId) {
	if (!environmentId) return createPortalOperations(service);
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
	return createPortalOperations(service, {
		...binding,
		assertCurrent,
		ownershipError: "Portal does not belong to the attached environment",
		async prepareTarget(remotePort) {
			await environments.touchSessionAttachment(binding);
			assertCurrent();
			const connection = await environments.openNodePortal({
				environmentId: binding.environmentId,
				ownerEpoch: binding.ownerEpoch,
				remotePort
			});
			return {
				...connection,
				connect: () => connection.connect(() => environments.assertSessionAttachment(binding), () => environments.touchSessionAttachment(binding))
			};
		}
	});
}
async function mutatePortal(options, environmentId, mutate) {
	const service = requirePortalService(options.context, options.respond);
	if (!service) return;
	try {
		const result = await mutate(portalOperations(options, service, environmentId));
		broadcastPortalChange(options.context, service);
		options.respond(true, result, void 0);
	} catch (error) {
		options.respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, error instanceof Error ? error.message : String(error)));
	}
}
const portalHandlers = {
	...sessionPortalHandlers,
	"portal.list": defineValidatedGatewayMethod("portal.list", validatePortalListParams, (options) => {
		const { params, respond, context, client } = options;
		const service = requirePortalService(context, respond);
		if (!service) return;
		const scopes = Array.isArray(client?.connect?.scopes) ? client.connect.scopes : [];
		let portals;
		try {
			portals = portalOperations(options, service, params.environmentId).list().portals;
		} catch (error) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, String(error)));
			return;
		}
		respond(true, { portals: scopes.includes("operator.write") || scopes.includes("operator.admin") ? portals : portals.map(redactPortalSummary) }, void 0);
	}),
	"portal.open": defineValidatedGatewayMethod("portal.open", validatePortalOpenParams, (options) => mutatePortal(options, options.params.environmentId, (portals) => portals.open(options.params))),
	"portal.close": defineValidatedGatewayMethod("portal.close", validatePortalCloseParams, (options) => mutatePortal(options, options.params.environmentId, (portals) => portals.close(options.params.id)))
};
//#endregion
export { portalHandlers };
