import { i as resolveGlobalSingleton } from "./global-singleton-Dc_stLtU.mjs";
import { AsyncLocalStorage } from "node:async_hooks";
//#region src/agents/session-placement-skill-resources.ts
const resources = resolveGlobalSingleton(Symbol.for("openclaw.sessionSkillResources"), () => new AsyncLocalStorage());
function withSessionSkillResources(context, run) {
	return resources.run(context, run);
}
function resolveSessionSkillResourceSnapshot(source) {
	const context = resources.getStore();
	if (!context) return source;
	context.assertCurrent();
	if (source !== context.source && source !== context.snapshot) throw new Error("Skill resources belong to a different prepared turn.");
	return context.snapshot;
}
function resolveSessionSkillResourceMounts() {
	const context = resources.getStore();
	context?.assertCurrent();
	return context?.mounts;
}
//#endregion
export { resolveSessionSkillResourceSnapshot as n, withSessionSkillResources as r, resolveSessionSkillResourceMounts as t };
