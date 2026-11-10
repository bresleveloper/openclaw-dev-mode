import { t as runInDetachedAsyncContext } from "./detached-async-context-D04NzekX.mjs";
import { i as pluginInstanceInvocation } from "./plugin-instance-invocation-DjfKDZW8.mjs";
import { c as withPluginRuntimeGatewayContextResolver, g as getGatewayContextResolver } from "./gateway-request-scope-1BXD1G3l.mjs";
import { r as getBoundLegacyPluginSdkResourceHost } from "./legacy-sdk-resource-host-DBY7FuQ8.mjs";
import { l as getPluginRecordRegistry } from "./registry-lifecycle-CjTFYNkp.mjs";
import { n as getPluginRegistryRuntime } from "./registry-runtime-binding-i7RQa2C4.mjs";
import { i as withPluginHttpRouteRegistry } from "./http-registry-eGHR5upq.mjs";
import { r as withPluginServiceScheduler } from "./service-scheduler-binding-BGIyG3K0.mjs";
import { n as runOutsideOperatorToolGatewayAuthority } from "./operator-tool-gateway-authority-CgsnCzzP.mjs";
import { t as createScheduledGatewayRunner } from "./scheduled-run-gateway-context-Cs6rVhRo.mjs";
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
function createPluginServiceScheduler(scheduler, initialRun) {
	let runOwned = initialRun;
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
				if (!parent) runOwned = void 0;
				parent?.delete(control);
				return;
			}
			stopping ??= Promise.all(pending).then(() => {
				if (!parent) runOwned = void 0;
			}).finally(() => parent?.delete(control));
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
