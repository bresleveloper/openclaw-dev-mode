import { n as LogService } from "./logger-xBjiRIp1.mjs";
import { EventType, MatrixError, MatrixEvent } from "matrix-js-sdk/lib/matrix.js";
import { ConnectionError, HTTPError, Method } from "matrix-js-sdk/lib/http-api/index.js";
import { RustCrypto } from "matrix-js-sdk/lib/rust-crypto/rust-crypto.js";
//#region extensions/matrix/src/matrix/sdk/joined-room-encryption.ts
const ROOM_CONCURRENCY = 4;
async function reconcileJoinedRoomEncryption(client, signal, assertCurrent) {
	const crypto = client.getCrypto();
	if (!crypto) return;
	if (!(crypto instanceof RustCrypto)) throw new Error("Matrix room encryption recovery requires the Rust crypto backend");
	const checkActive = () => {
		signal.throwIfAborted();
		assertCurrent();
	};
	checkActive();
	let joinedRooms;
	try {
		({joined_rooms: joinedRooms} = await client.http.authedRequest(Method.Get, "/joined_rooms", void 0, void 0, { abortSignal: signal }));
	} catch (error) {
		checkActive();
		if (error instanceof ConnectionError || error instanceof HTTPError && (error.httpStatus === 408 || error.httpStatus === 429 || (error.httpStatus ?? 0) >= 500)) {
			LogService.warn("MatrixClientLite", "Skipping room encryption recovery: joined-room discovery failed", error);
			return;
		}
		throw error;
	}
	checkActive();
	if (!Array.isArray(joinedRooms) || !joinedRooms.every((room) => typeof room === "string")) throw new Error("Matrix homeserver returned invalid joined rooms");
	const rooms = [...new Set(joinedRooms)];
	let next = 0;
	const worker = async () => {
		while (next < rooms.length) {
			checkActive();
			const roomId = rooms[next++];
			if (!roomId) continue;
			const room = client.getRoom(roomId);
			if (!room || room.getMyMembership() !== "join") continue;
			try {
				let event = room.currentState.getStateEvents(EventType.RoomEncryption, "");
				if (!event) {
					const content = await client.http.authedRequest(Method.Get, `/rooms/${encodeURIComponent(roomId)}/state/m.room.encryption/`, void 0, void 0, { abortSignal: signal });
					checkActive();
					event = new MatrixEvent({
						room_id: roomId,
						type: EventType.RoomEncryption,
						state_key: "",
						content
					});
				}
				checkActive();
				if (client.getRoom(roomId) !== room || room.getMyMembership() !== "join") continue;
				await crypto.onCryptoEvent(room, event);
				checkActive();
				if (client.getRoom(roomId) === room && room.getMyMembership() === "join") room.currentState.setStateEvents([event]);
			} catch (error) {
				checkActive();
				if (error instanceof MatrixError && error.httpStatus === 404 && error.errcode === "M_NOT_FOUND") continue;
				LogService.warn("MatrixClientLite", `Failed to recover encryption for ${roomId}:`, error);
			}
		}
	};
	const results = await Promise.allSettled(Array.from({ length: Math.min(ROOM_CONCURRENCY, rooms.length) }, worker));
	checkActive();
	for (const result of results) if (result.status === "rejected") throw result.reason;
}
//#endregion
export { reconcileJoinedRoomEncryption };
