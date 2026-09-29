import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { t as ErrorCodes } from "./gateway-error-details-D85F07e9.mjs";
import { aa as validateSessionsTitlePrepareParams } from "./src-BRUl7oDv.mjs";
import { f as errorShape } from "./error-codes-DvB36bCj.mjs";
import { n as authorizeGatewaySessionCreation } from "./operator-role-policy-BNrKHiJ3.mjs";
import { t as SessionMutationAuthorizationChangedError } from "./session-mutation-authorization-error-CCz8QGWh.mjs";
import { t as assertValidParams } from "./validation-CFv_zneu.mjs";
import { t as ModelAccountConnectAuthorityError } from "./model-account-connect-CMUHZZob.mjs";
import { t as resolveAgentIdOrRespondError } from "./agent-id-shared-DCjK5aia.mjs";
import { n as preparePersonalModelSelection } from "./users-model-account-access-Dq_-oRqC.mjs";
import { o as prepareDashboardSessionTitle } from "./dashboard-session-title-Dfgz25-G.mjs";
import { t as resolveRegisteredCatalogCreateTarget } from "./session-catalog-CSSkB89c.mjs";
import { i as resolveSessionCreateModelSelection } from "./session-create-service-Cq3tAtcK.mjs";
//#region src/gateway/server-methods/sessions-title.ts
const sessionTitleHandlers = { "sessions.title.prepare": async ({ params, respond, context, client, signal }) => {
	if (!assertValidParams(params, validateSessionsTitlePrepareParams, "sessions.title.prepare", respond)) return;
	const cfg = context.getRuntimeConfig();
	const agent = resolveAgentIdOrRespondError({
		rawAgentId: params.agentId,
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
	if (params.model && params.catalogId) {
		respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "sessions.title.prepare catalogId cannot include model"));
		return;
	}
	if (params.incognito || !params.message.trim() || params.message.trim().startsWith("/")) {
		respond(true, { title: null });
		return;
	}
	const catalog = params.catalogId ? resolveRegisteredCatalogCreateTarget(params.catalogId, agent.agentId, cfg) : void 0;
	if (catalog && !catalog.ok) {
		respond(true, { title: null });
		return;
	}
	try {
		const personalSelection = preparePersonalModelSelection({
			client,
			context,
			signal
		}, params.model);
		const assertCurrent = () => {
			personalSelection?.assertCurrent();
			const currentCreationError = authorizeGatewaySessionCreation({
				cfg: context.getRuntimeConfig(),
				client,
				agentId: agent.agentId
			});
			if (currentCreationError) throw new SessionMutationAuthorizationChangedError(currentCreationError);
		};
		const entry = resolveSessionCreateModelSelection(cfg, agent.agentId, catalog?.target ?? params.model);
		if (!entry) {
			respond(true, { title: null });
			return;
		}
		const title = await prepareDashboardSessionTitle({
			cfg,
			agentId: agent.agentId,
			entry,
			userMessage: params.message,
			abortSignal: signal,
			assertCurrent
		});
		assertCurrent();
		respond(true, { title });
	} catch (error) {
		const failure = error instanceof ModelAccountConnectAuthorityError ? errorShape(ErrorCodes.FORBIDDEN, error.message) : error instanceof SessionMutationAuthorizationChangedError ? error.error : void 0;
		if (!failure) throw error;
		respond(false, void 0, failure);
	}
} };
//#endregion
export { sessionTitleHandlers };
