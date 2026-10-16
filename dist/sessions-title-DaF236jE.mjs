import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { _a as validateSessionsTitlePrepareParams } from "./src-l2dWvEsN.mjs";
import { t as ErrorCodes } from "./gateway-error-details-DIefe7Zy.mjs";
import { f as errorShape } from "./error-codes-Dh56LniQ.mjs";
import { n as authorizeGatewaySessionCreation } from "./operator-role-policy-BqPaarjx.mjs";
import { n as captureGatewayOperatorRunAuthority } from "./operator-run-authority-BPRn5nuX.mjs";
import { t as SessionMutationAuthorizationChangedError } from "./session-mutation-authorization-error-CCz8QGWh.mjs";
import { a as readGatewayRequestMutationAuthority } from "./session-mutation-guards-CxCbIrod.mjs";
import { o as prepareDashboardSessionTitle } from "./dashboard-session-title-DnKo2TYK.mjs";
import { n as defineValidatedGatewayHandler } from "./validation-Bu27N0nv.mjs";
import { t as resolveAgentIdOrRespondError } from "./agent-id-shared-D1br86TX.mjs";
import { t as ModelAccountConnectAuthorityError } from "./model-account-connect-wfMmajkJ.mjs";
import { n as preparePersonalModelSelection } from "./users-model-account-access-CNkupmnu.mjs";
import { t as resolveRegisteredCatalogCreateTarget } from "./session-catalog-N5p2Px6m.mjs";
import { n as prepareSessionCreateModelSelection } from "./session-create-service-BHdjsLZI.mjs";
//#region src/gateway/server-methods/sessions-title.ts
const sessionTitleHandlers = { "sessions.title.prepare": defineValidatedGatewayHandler("sessions.title.prepare", validateSessionsTitlePrepareParams, async (options) => {
	const { params, respond, context, client, signal, hasCurrentClientAuthority } = options;
	const requestAuthority = readGatewayRequestMutationAuthority(options);
	const request = { ...params };
	const getCurrentConfig = context.getRuntimeConfig;
	const cfg = getCurrentConfig();
	const agent = resolveAgentIdOrRespondError({
		rawAgentId: request.agentId,
		respond,
		cfg,
		normalize: normalizeOptionalString
	});
	if (!agent) return;
	const creationError = authorizeGatewaySessionCreation({
		cfg,
		client,
		agentId: agent.agentId
	});
	if (creationError) {
		respond(false, void 0, creationError);
		return;
	}
	if (request.model && request.catalogId) {
		respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "sessions.title.prepare catalogId cannot include model"));
		return;
	}
	if (request.incognito || !request.message.trim() || request.message.trim().startsWith("/")) {
		respond(true, { title: null });
		return;
	}
	const catalog = request.catalogId ? resolveRegisteredCatalogCreateTarget(request.catalogId, agent.agentId, cfg) : void 0;
	if (catalog && !catalog.ok) {
		respond(true, { title: null });
		return;
	}
	let capturedOperator;
	try {
		const personalSelection = await preparePersonalModelSelection({
			client,
			context,
			signal
		}, request.model);
		const assertCallerCurrent = () => {
			personalSelection?.assertCurrent();
			requestAuthority.assertCurrent();
			const currentCreationError = authorizeGatewaySessionCreation({
				cfg: getCurrentConfig(),
				client,
				agentId: agent.agentId
			});
			if (currentCreationError) throw new SessionMutationAuthorizationChangedError(currentCreationError);
		};
		capturedOperator = await captureGatewayOperatorRunAuthority({
			client,
			context,
			hasCurrentClientAuthority,
			invocationAuthority: {
				assertCurrent: assertCallerCurrent,
				signal
			}
		});
		assertCallerCurrent();
		const selection = prepareSessionCreateModelSelection({
			cfg,
			agentId: agent.agentId,
			input: catalog?.target ?? request.model,
			operatorAuthority: capturedOperator?.authority
		});
		if (!selection.ok) {
			respond(false, void 0, selection.error);
			return;
		}
		const entry = selection.selection;
		if (!entry) {
			respond(true, { title: null });
			return;
		}
		const assertCurrent = () => {
			assertCallerCurrent();
			const error = selection.validate?.();
			if (error) throw new SessionMutationAuthorizationChangedError(error);
			capturedOperator?.authority.assertCurrent();
		};
		const title = await prepareDashboardSessionTitle({
			cfg,
			agentId: agent.agentId,
			entry,
			userMessage: request.message,
			abortSignal: signal,
			assertCurrent,
			operatorAuthority: capturedOperator?.authority
		});
		assertCurrent();
		respond(true, { title });
	} catch (error) {
		const failure = error instanceof ModelAccountConnectAuthorityError ? errorShape(ErrorCodes.FORBIDDEN, error.message) : error instanceof SessionMutationAuthorizationChangedError ? error.error : void 0;
		if (!failure) throw error;
		respond(false, void 0, failure);
	} finally {
		capturedOperator?.release();
	}
}) };
//#endregion
export { sessionTitleHandlers };
