import { a as resolveGlobalSingleton } from "./global-singleton-0m-JziJW.mjs";
import "./global-singleton-yHEs_vfD.mjs";
import { n as createOpenAIQuicksilverBrowserSessionBroker } from "./realtime-quicksilver-session-Dz0UfMuL.mjs";
//#region extensions/openai/realtime-quicksilver-session-owner.ts
const OPENAI_QUICKSILVER_SESSION_OWNER_KEY = Symbol.for("openclaw.openai.quicksilverBrowserSessionOwner.v1");
function resolveBrokerOwner() {
	return resolveGlobalSingleton(OPENAI_QUICKSILVER_SESSION_OWNER_KEY, () => ({ retiring: /* @__PURE__ */ new Set() }));
}
function acquireOpenAIQuicksilverBrowserSessionBroker(params, context) {
	const owner = resolveBrokerOwner();
	if (owner.current) {
		owner.current.params.getConfig = params.getConfig;
		owner.current.params.logger = params.logger;
		return owner.current.session;
	}
	const mutableParams = {
		...params,
		onCleanupComplete: () => {
			owner.retiring.delete(session);
		}
	};
	const session = createOpenAIQuicksilverBrowserSessionBroker(mutableParams, context);
	owner.current = {
		params: mutableParams,
		session
	};
	return session;
}
async function releaseOpenAIQuicksilverBrowserSessionBroker(session) {
	const owner = resolveBrokerOwner();
	if (owner.current?.session === session) {
		owner.current = void 0;
		owner.retiring.add(session);
	}
	const failures = (await Promise.allSettled(Array.from(owner.retiring, (retiring) => retiring.cleanup()))).flatMap((result) => result.status === "rejected" ? [result.reason] : []);
	if (failures.length > 0) throw new AggregateError(failures, "OpenAI realtime broker cleanup remains incomplete");
}
//#endregion
export { releaseOpenAIQuicksilverBrowserSessionBroker as n, acquireOpenAIQuicksilverBrowserSessionBroker as t };
