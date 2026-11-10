import { Ci as validateSessionPortalCloseParams, Mr as validatePortalCloseParams, Ng as errorShape, Nr as validatePortalListParams, Pr as validatePortalOpenParams, Ti as validateSessionPortalOpenParams, wi as validateSessionPortalListParams } from "./src-pLJQA6J5.mjs";
import "./operator-scopes-BO7_XQCg.mjs";
import { t as ErrorCodes } from "./gateway-error-details-Cl-eEOTQ.mjs";
import { n as createPortalOperations, r as redactPortalSummary } from "./portal-service-3Aa4OnnY.mjs";
import { r as defineValidatedGatewayMethod } from "./validation--xIH1Pj-.mjs";
import { t as captureSessionPortalTarget } from "./session-portal-target-D54R2k-a.mjs";
import { n as resolveSessionEnvironmentCaller } from "./environments.session-FdMlzGDh.mjs";
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
async function portalOperations(options, service, environmentId) {
	if (!environmentId) return {
		operations: createPortalOperations(service),
		release() {}
	};
	const { context } = options;
	const environments = context.workerEnvironmentService;
	if (!environments) throw new Error("Conversation environments are unavailable");
	const caller = await resolveSessionEnvironmentCaller(options);
	try {
		const binding = environments.findSessionAttachment(caller.identity);
		if (!binding || binding.environmentId !== environmentId) throw new Error("Portal environment is not attached to this conversation");
		const assertCurrent = () => {
			caller.assertCurrent();
			environments.assertSessionAttachment(binding);
		};
		assertCurrent();
		return {
			release: caller.release,
			operations: createPortalOperations(service, {
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
			})
		};
	} catch (error) {
		caller.release();
		throw error;
	}
}
async function mutatePortal(options, environmentId, mutate) {
	const service = requirePortalService(options.context, options.respond);
	if (!service) return;
	let scope;
	try {
		scope = await portalOperations(options, service, environmentId);
		const result = await mutate(scope.operations);
		broadcastPortalChange(options.context, service);
		options.respond(true, result, void 0);
	} catch (error) {
		options.respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, error instanceof Error ? error.message : String(error)));
	} finally {
		scope?.release();
	}
}
const portalHandlers = {
	...sessionPortalHandlers,
	"portal.list": defineValidatedGatewayMethod("portal.list", validatePortalListParams, async (options) => {
		const { params, respond, context, client } = options;
		const service = requirePortalService(context, respond);
		if (!service) return;
		const scopes = client?.connect.scopes ?? [];
		let portals;
		try {
			const scope = await portalOperations(options, service, params.environmentId);
			try {
				portals = scope.operations.list().portals;
			} finally {
				scope.release();
			}
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
