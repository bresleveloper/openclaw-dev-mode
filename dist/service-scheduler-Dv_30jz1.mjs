import { a as runInDetachedAsyncContext } from "./async-work-scope-BYeX3gh6.mjs";
import { i as pluginInstanceInvocation } from "./plugin-instance-invocation-CH4zOUb4.mjs";
import { a as getGatewayContextResolver } from "./gateway-context-binding-VqB7gkMe.mjs";
import { s as withPluginRuntimeGatewayContextResolver } from "./gateway-request-scope-BSmCVVpP.mjs";
import { l as getPluginRecordRegistry } from "./registry-lifecycle-Dekhrk9Y.mjs";
import { r as getBoundLegacyPluginSdkResourceHost } from "./legacy-sdk-resource-host-DC4n8Jcn.mjs";
import { n as getPluginRegistryRuntime } from "./registry-runtime-binding-i7RQa2C4.mjs";
import { r as withPluginServiceScheduler } from "./service-scheduler-binding-CXvCAS6L.mjs";
import { n as runOutsideOperatorToolGatewayAuthority } from "./operator-tool-gateway-authority-CgsnCzzP.mjs";
import { t as createScheduledGatewayRunner } from "./scheduled-run-gateway-context-CxI8WTGy.mjs";
import { i as withPluginHttpRouteRegistry } from "./http-registry-CF8q0nT-.mjs";
import { randomUUID } from "node:crypto";
//#region src/plugins/capability-lease.ts
function createPluginRuntimeCapabilityLease(owner) {
	let active = true;
	const cleanups = /* @__PURE__ */ new Set();
	const assertActive = (capability) => {
		if (!active) throw new Error(`${owner} ${capability} is no longer active`);
	};
	const retain = (cleanup) => {
		if (!active) {
			cleanup();
			assertActive("capability lease");
		}
		const release = () => {
			if (cleanups.delete(release)) cleanup();
		};
		cleanups.add(release);
		return release;
	};
	return {
		isActive: () => active,
		assertActive,
		retain,
		revoke: () => {
			if (!active) return;
			active = false;
			for (const cleanup of cleanups) cleanup();
		}
	};
}
//#endregion
//#region src/plugins/service-scheduler-context.ts
function createPluginServiceSchedulerRunner(owner) {
	const runtime = getPluginRegistryRuntime(owner.registry);
	const resolveGatewayContext = runtime ? getGatewayContextResolver(runtime) : void 0;
	const resourceHost = resolveGatewayContext ? void 0 : withPluginRuntimeGatewayContextResolver(void 0, getBoundLegacyPluginSdkResourceHost, { inheritRequestScope: false });
	const runScheduled = createScheduledGatewayRunner(resolveGatewayContext);
	return (work) => runOutsideOperatorToolGatewayAuthority(() => runScheduled(async () => pluginInstanceInvocation.exit(() => {
		const registry = owner.record ? getPluginRecordRegistry(owner.registry, owner.record) : owner.registry;
		const run = () => withPluginHttpRouteRegistry(registry, work, owner.lease);
		const invoke = () => owner.instance ? owner.instance.runInRegistry(registry, run, { joinDisposal: false }) : run();
		return withPluginRuntimeGatewayContextResolver(resolveGatewayContext, () => {
			resourceHost?.assertOpen();
			return resourceHost ? resourceHost.run(invoke) : invoke();
		}, { inheritRequestScope: false });
	})));
}
//#endregion
//#region src/plugins/service-scheduler.ts
function createPluginServiceScheduler(scheduler, runOwned) {
	const createScope = (parent) => {
		const owner = scheduler.scope();
		const prefix = `plugin-service:${randomUUID()}:`;
		const children = /* @__PURE__ */ new Set();
		let stopping;
		const assertOpen = () => {
			if (owner.signal.aborted) throw new Error("Plugin service scheduler is closed");
		};
		const beginClose = () => {
			owner.beginClose();
			for (const child of children) child.scheduler.beginClose();
		};
		const close = () => {
			const pending = [owner.close(), ...Array.from(children, (child) => child.close())].filter((completion) => completion !== void 0);
			if (pending.length === 0) {
				parent?.delete(control);
				return;
			}
			stopping ??= Promise.all(pending).then(() => void 0).finally(() => parent?.delete(control));
			return stopping;
		};
		const scope = {
			version: 1,
			signal: owner.signal,
			now: owner.now,
			schedule: (params) => {
				assertOpen();
				const schedule = () => owner.schedule({
					...params,
					id: `${prefix}${params.id}`,
					run: () => withPluginServiceScheduler(scope, () => runOwned ? runOwned(params.run) : params.run())
				});
				return runOwned ? runInDetachedAsyncContext(schedule) : schedule();
			},
			scope: () => {
				assertOpen();
				const child = createScope(children);
				children.add(child);
				return child.scheduler;
			},
			beginClose,
			stop: () => stopping ??= Promise.resolve(close())
		};
		const control = {
			scheduler: scope,
			close
		};
		return control;
	};
	return createScope();
}
//#endregion
export { createPluginServiceSchedulerRunner as n, createPluginRuntimeCapabilityLease as r, createPluginServiceScheduler as t };
