import { r as getBoundLegacyPluginSdkResourceHost } from "./legacy-sdk-resource-host-DC4n8Jcn.mjs";
import { i as withPluginServiceSchedulerBinding } from "./service-scheduler-binding-CXvCAS6L.mjs";
import { n as createPluginServiceSchedulerRunner, r as createPluginRuntimeCapabilityLease, t as createPluginServiceScheduler } from "./service-scheduler-CI-jC29q.mjs";
//#region src/plugins/cli-service-scheduler.ts
function withPluginCliServiceScheduler(instance, run) {
	const host = getBoundLegacyPluginSdkResourceHost();
	const owner = instance.owner;
	let scheduler;
	return withPluginServiceSchedulerBinding(host && owner ? () => {
		host.assertOpen();
		instance.lifecycle.signal.throwIfAborted();
		if (!instance.hasActiveCall || !instance.acceptingCalls || owner.revoked) throw new Error("Plugin CLI scheduler requires its active plugin invocation");
		if (!scheduler) {
			const lease = createPluginRuntimeCapabilityLease("plugin CLI");
			scheduler = host.run(() => createPluginServiceScheduler(host.scheduler, createPluginServiceSchedulerRunner({
				...owner,
				instance,
				lease
			})).scheduler);
			const scope = scheduler;
			const close = async () => {
				scope.beginClose();
				await scope.stop();
				lease.revoke();
			};
			host.adopt(scope, { release: close });
			instance.lifecycle.onDispose(close);
		}
		return scheduler;
	} : void 0, run);
}
//#endregion
export { withPluginCliServiceScheduler };
