import { i as isPidAlive, r as getProcessStartTime } from "./pid-alive-dd7OR8F6.mjs";
import { i as ServiceOwnershipRefusalError, o as assertServiceInspectionFallbackAllowed } from "./service-inspection-error-ozNMOrIE.mjs";
import { a as readSystemdUnitObjectPath, i as readSystemdBusOwner, n as isSystemdManagerUid, r as readSystemdBusCall } from "./systemd-bus-query-BO5_Arr9.mjs";
import { d as runServiceInspectionGuard, f as withServiceInspectionBudget } from "./service-update-authority-Ddw1lcTH.mjs";
import { a as resolveSystemdUserTransport, c as openSystemdPrivatePeer, o as openSystemdBroker } from "./systemd-user-transport-ChnCBaMi.mjs";
import { c as resolveSystemdServiceName } from "./systemd-service-files-C3V-PDoO.mjs";
import path from "node:path";
//#region src/daemon/systemd-peer.ts
/** Admit only the private peer belonging to the originally selected broker manager. */
const MANAGER = "org.freedesktop.systemd1";
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
		const brokerQuery = (args, signatures) => {
			if (!broker) throw unavailable();
			return broker.query(args, signatures, deadline);
		};
		const query = async (method, name, signature) => readSystemdBusCall(brokerQuery, method, ["s", name], signature, unavailable);
		let peer;
		try {
			const transport = await resolveSystemdUserTransport(route, deadline, void 0, "admission");
			if (!transport || transport.kind === "private" || transport.kind === "machine" || !path.isAbsolute(transport.runtimeDir) || !isLocalUnixAddress(transport.address)) return;
			broker = await openSystemdBroker(transport.address, deadline);
			const destination = await readSystemdBusOwner(brokerQuery, unavailable);
			const managerUid = await query("GetConnectionUnixUser", destination, "u");
			if (!isSystemdManagerUid(managerUid)) throw unavailable();
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
			if (await readSystemdBusOwner(brokerQuery, unavailable) !== destination) throw new ServiceOwnershipRefusalError("systemd-manager-changed");
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
						const observedPath = readSystemdUnitObjectPath(value, unavailable);
						if (unitPath && observedPath !== unitPath) throw new ServiceOwnershipRefusalError("systemd-unit-changed");
						unitPath = observedPath;
					}
					return values;
				}
			};
		} catch (error) {
			await peer?.close();
			assertServiceInspectionFallbackAllowed(error);
			return;
		} finally {
			await broker?.close();
		}
	});
}
//#endregion
export { admitSystemdServiceReadBinding as t };
