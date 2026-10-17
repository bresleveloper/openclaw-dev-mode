import { a as isPidAlive, i as getProcessStartTime } from "./pid-alive-CPS_shDt.mjs";
import { d as runServiceInspectionGuard, f as withServiceInspectionBudget } from "./service-update-authority-CoX8GMUL.mjs";
import { i as ServiceOwnershipRefusalError, o as findServiceOwnershipRefusal } from "./service-inspection-error-Bsltcpi4.mjs";
import { a as resolveSystemdUserTransport, f as openSystemdPrivatePeer, u as openSystemdBroker } from "./systemd-user-transport-vKPIfcG5.mjs";
import { c as resolveSystemdServiceName } from "./systemd-service-files-D_ieSNFm.mjs";
import path from "node:path";
//#region src/daemon/systemd-peer.ts
/** Admit only the private peer belonging to the originally selected broker manager. */
const MANAGER = "org.freedesktop.systemd1";
const BUS = "org.freedesktop.DBus";
const unavailable = () => /* @__PURE__ */ new Error("Original systemd manager binding is unavailable or changed.");
function isLocalUnixAddress(address) {
	try {
		return address.split(";").every((entry) => {
			if (!entry.startsWith("unix:")) return false;
			const fields = /* @__PURE__ */ new Map();
			for (const item of entry.slice(5).split(",")) {
				const split = item.indexOf("=");
				if (split < 1) return false;
				const key = item.slice(0, split);
				const value = decodeURIComponent(item.slice(split + 1));
				if (![
					"path",
					"abstract",
					"guid"
				].includes(key) || fields.has(key) || !value || value.includes("\0")) return false;
				fields.set(key, value);
			}
			const pathname = fields.get("path"), abstract = fields.get("abstract"), guid = fields.get("guid");
			return Boolean((pathname ? path.isAbsolute(pathname) && !abstract : abstract) && (!guid || /^[a-f0-9]{32}$/i.test(guid)));
		});
	} catch {
		return false;
	}
}
async function admitSystemdServiceReadBinding(env, deadline, selectedUnitName) {
	return await withServiceInspectionBudget(async () => {
		const route = {
			...process.env,
			...env
		};
		const uid = process.geteuid?.();
		if (process.platform !== "linux" || uid === void 0 || uid === 0 || route.SUDO_USER) return;
		const unit = selectedUnitName ?? `${resolveSystemdServiceName(env)}.service`;
		let broker;
		const query = async (method, name, signature) => {
			if (!broker) throw unavailable();
			const tuple = (await broker.query([
				"call",
				BUS,
				"/org/freedesktop/DBus",
				BUS,
				method,
				"s",
				name
			], [signature], deadline))?.[0];
			if (!Array.isArray(tuple) || tuple.length !== 1) throw unavailable();
			return tuple[0];
		};
		let peer;
		try {
			const transport = await resolveSystemdUserTransport(route, deadline, void 0, "admission");
			if (!transport || transport.kind === "private" || transport.kind === "machine" || !path.isAbsolute(transport.runtimeDir) || !isLocalUnixAddress(transport.address)) return;
			broker = await openSystemdBroker(transport.address, deadline);
			const destination = await query("GetNameOwner", MANAGER, "s");
			if (typeof destination !== "string" || !/^:[0-9]+\.[0-9]+$/.test(destination)) throw unavailable();
			const managerUid = await query("GetConnectionUnixUser", destination, "u");
			if (typeof managerUid !== "number" || !Number.isInteger(managerUid) || managerUid < 0 || managerUid >= 4294967295) throw unavailable();
			if (managerUid !== uid) throw new ServiceOwnershipRefusalError("systemd-manager-changed");
			const pid = await query("GetConnectionUnixProcessID", destination, "u");
			if (typeof pid !== "number" || !Number.isInteger(pid) || pid <= 0 || !isPidAlive(pid)) throw unavailable();
			const startTime = getProcessStartTime(pid);
			if (startTime === null) throw unavailable();
			const socket = path.join(transport.runtimeDir, "systemd/private");
			const address = `unix:path=${encodeURIComponent(socket).replaceAll("%2F", "/")}`;
			peer = await openSystemdPrivatePeer(address, {
				uid,
				pid,
				startTime
			}, deadline);
			const currentDestination = await query("GetNameOwner", MANAGER, "s");
			if (typeof currentDestination !== "string" || !/^:[0-9]+\.[0-9]+$/.test(currentDestination)) throw unavailable();
			if (currentDestination !== destination) throw new ServiceOwnershipRefusalError("systemd-manager-changed");
			const currentPid = await query("GetConnectionUnixProcessID", destination, "u");
			if (typeof currentPid !== "number" || !Number.isInteger(currentPid) || currentPid <= 0) throw unavailable();
			if (currentPid !== pid) throw new ServiceOwnershipRefusalError("systemd-manager-changed");
			peer.verify();
			const retained = peer;
			let unitPath;
			return {
				unit,
				managerUid: uid,
				destination,
				verify: retained.verify,
				close: retained.close,
				async query(args, signatures, until, inspection) {
					retained.verify();
					if (args[1] !== destination) {
						if (typeof args[1] === "string" && /^:[0-9]+\.[0-9]+$/.test(args[1])) throw new ServiceOwnershipRefusalError("systemd-manager-changed");
						throw unavailable();
					}
					if (args[0] === "call") {
						const method = args[4] ?? "";
						const managerRead = [
							"GetUnit",
							"GetUnitFileState",
							"GetUnitProcesses"
						].includes(method);
						const ownedLoad = method === "LoadUnit" && inspection?.managerUid === uid;
						if (method === "LoadUnit" && inspection && inspection.managerUid !== uid) throw new ServiceOwnershipRefusalError("systemd-manager-changed");
						if (managerRead || ownedLoad) {
							if (args[2] !== "/org/freedesktop/systemd1" || args[3] !== `${MANAGER}.Manager` || args[5] !== "s" || typeof args[6] !== "string") throw unavailable();
							if (args[6] !== unit) throw new ServiceOwnershipRefusalError("systemd-unit-changed");
						} else if (method !== "GetProcesses" || args[3] !== `${MANAGER}.Service` || !unitPath || args[2] !== unitPath || args.length !== 5) throw unavailable();
						if (ownedLoad) runServiceInspectionGuard(inspection.assertCurrent);
					} else if (args[0] !== "get-property" || !unitPath || args[2] !== unitPath || ![`${MANAGER}.Unit`, `${MANAGER}.Service`].includes(args[3] ?? "")) throw unavailable();
					const assertCurrent = args[4] === "LoadUnit" ? inspection?.assertCurrent : inspection?.assertReadCurrent ?? inspection?.assertCurrent;
					const values = await retained.query(args, signatures, until, assertCurrent);
					if (args[0] === "call" && ["GetUnit", "LoadUnit"].includes(args[4] ?? "") && values) {
						const [value] = values;
						if (!Array.isArray(value) || value.length !== 1 || typeof value[0] !== "string" || !/^\/org\/freedesktop\/systemd1\/unit\/[A-Za-z0-9_]+$/.test(value[0])) throw unavailable();
						if (unitPath && value[0] !== unitPath) throw new ServiceOwnershipRefusalError("systemd-unit-changed");
						unitPath = value[0];
					}
					return values;
				}
			};
		} catch (error) {
			await peer?.close();
			const refusal = findServiceOwnershipRefusal(error);
			if (refusal) throw refusal;
			return;
		} finally {
			await broker?.close();
		}
	});
}
//#endregion
export { admitSystemdServiceReadBinding as t };
