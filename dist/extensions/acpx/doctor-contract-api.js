import { c as normalizeAcpxProcessLeaseFile, d as ACPX_GATEWAY_INSTANCE_KEY, f as ACPX_GATEWAY_INSTANCE_NAMESPACE, h as normalizeAcpxGatewayInstanceRecord, l as openAcpxProcessLeaseStateStore, m as ACPX_LEGACY_PROCESS_LEASE_FILE, p as ACPX_LEGACY_GATEWAY_INSTANCE_FILE, s as normalizeAcpxProcessLease } from "../../process-lease-DiKkFj6F.js";
import path from "node:path";
import fs from "node:fs/promises";
//#region extensions/acpx/doctor-contract-api.ts
function resolveLegacyGatewayInstancePath(stateDir) {
	return path.join(stateDir, ACPX_LEGACY_GATEWAY_INSTANCE_FILE);
}
function resolveLegacyProcessLeasePath(stateDir) {
	return path.join(stateDir, "acpx", ACPX_LEGACY_PROCESS_LEASE_FILE);
}
async function fileExists(filePath) {
	try {
		return (await fs.stat(filePath)).isFile();
	} catch {
		return false;
	}
}
async function readLegacyGatewayInstanceId(filePath) {
	try {
		return (await fs.readFile(filePath, "utf8")).trim() || null;
	} catch {
		return null;
	}
}
async function readLegacyOpenProcessLeases(filePath) {
	try {
		return normalizeAcpxProcessLeaseFile(JSON.parse(await fs.readFile(filePath, "utf8"))).leases.filter((lease) => lease.state === "open" || lease.state === "closing");
	} catch {
		return [];
	}
}
async function archiveLegacySource(params) {
	const archivedPath = `${params.filePath}.migrated`;
	if (await fileExists(archivedPath)) {
		params.warnings.push(`Left migrated ACPX ${params.label} source in place because ${archivedPath} already exists`);
		return;
	}
	try {
		await fs.rename(params.filePath, archivedPath);
		params.changes.push(`Archived ACPX ${params.label} legacy source -> ${archivedPath}`);
	} catch (err) {
		params.warnings.push(`Failed archiving ACPX ${params.label} legacy source: ${String(err)}`);
	}
}
const stateMigrations = [{
	id: "acpx-runtime-state-to-plugin-state",
	label: "ACPX runtime state",
	async detectLegacyState(params) {
		const gatewayInstanceId = await readLegacyGatewayInstanceId(resolveLegacyGatewayInstancePath(params.stateDir));
		const openLeases = await readLegacyOpenProcessLeases(resolveLegacyProcessLeasePath(params.stateDir));
		if (!gatewayInstanceId && openLeases.length === 0) return null;
		const preview = [];
		if (gatewayInstanceId) preview.push(`- ACPX gateway instance id: ${resolveLegacyGatewayInstancePath(params.stateDir)} -> plugin state (${ACPX_GATEWAY_INSTANCE_NAMESPACE})`);
		if (openLeases.length > 0) preview.push(`- ACPX process leases: ${resolveLegacyProcessLeasePath(params.stateDir)} -> plugin state (${openLeases.length} open lease(s))`);
		return { preview };
	},
	async migrateLegacyState(params) {
		const changes = [];
		const warnings = [];
		const gatewayInstancePath = resolveLegacyGatewayInstancePath(params.stateDir);
		const gatewayInstanceId = await readLegacyGatewayInstanceId(gatewayInstancePath);
		const processLeasePath = resolveLegacyProcessLeasePath(params.stateDir);
		const openLeases = await readLegacyOpenProcessLeases(processLeasePath);
		const processLeaseStore = openAcpxProcessLeaseStateStore(params.context.openPluginStateKeyedStore);
		const gatewayStore = params.context.openPluginStateKeyedStore({
			namespace: ACPX_GATEWAY_INSTANCE_NAMESPACE,
			maxEntries: 1
		});
		const existingGateway = normalizeAcpxGatewayInstanceRecord(await gatewayStore.lookup(ACPX_GATEWAY_INSTANCE_KEY));
		const existingLiveLeases = (await processLeaseStore.entries()).map((entry) => normalizeAcpxProcessLease(entry.value)).filter((lease) => lease != null && (lease.state === "open" || lease.state === "closing"));
		const leaseGatewayIds = new Set(openLeases.map((lease) => lease.gatewayInstanceId));
		const onlyLeaseGatewayId = leaseGatewayIds.size === 1 ? [...leaseGatewayIds][0] : null;
		const canAdoptLegacyGateway = existingGateway && gatewayInstanceId && existingGateway.instanceId !== gatewayInstanceId && onlyLeaseGatewayId === gatewayInstanceId && existingLiveLeases.length === 0;
		const canonicalGatewayInstanceId = canAdoptLegacyGateway || !existingGateway ? gatewayInstanceId ?? onlyLeaseGatewayId : existingGateway.instanceId;
		if (openLeases.length > 0 && (!canonicalGatewayInstanceId || [...leaseGatewayIds].some((leaseGatewayId) => leaseGatewayId !== canonicalGatewayInstanceId))) {
			warnings.push("Skipped ACPX process lease migration because legacy leases do not match the canonical gateway instance id; left legacy sources in place for manual cleanup");
			return {
				changes,
				warnings
			};
		}
		if (canAdoptLegacyGateway && canonicalGatewayInstanceId) {
			await gatewayStore.register(ACPX_GATEWAY_INSTANCE_KEY, {
				instanceId: canonicalGatewayInstanceId,
				createdAt: Date.now()
			});
			changes.push("Migrated ACPX gateway instance id -> plugin state");
		} else if (canonicalGatewayInstanceId && !existingGateway) {
			await gatewayStore.register(ACPX_GATEWAY_INSTANCE_KEY, {
				instanceId: canonicalGatewayInstanceId,
				createdAt: Date.now()
			});
			changes.push("Migrated ACPX gateway instance id -> plugin state");
		} else if (gatewayInstanceId && existingGateway?.instanceId !== gatewayInstanceId) warnings.push("Skipped ACPX gateway instance id import because plugin state already differs");
		if (gatewayInstanceId) await archiveLegacySource({
			filePath: gatewayInstancePath,
			label: "gateway-instance-id",
			changes,
			warnings
		});
		if (openLeases.length > 0) {
			let imported = 0;
			let alreadyPresent = 0;
			for (const lease of openLeases) if (await processLeaseStore.registerIfAbsent(lease.leaseId, lease)) imported++;
			else alreadyPresent++;
			changes.push(`Migrated ACPX process leases -> plugin state (${imported} imported, ${alreadyPresent} already present)`);
			await archiveLegacySource({
				filePath: processLeasePath,
				label: "process-leases",
				changes,
				warnings
			});
		}
		return {
			changes,
			warnings
		};
	}
}];
//#endregion
export { stateMigrations };
