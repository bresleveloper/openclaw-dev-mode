//#region extensions/openai/realtime-quicksilver-socket.shared.ts
const QUICKSILVER_SOCKET_CONTROL_LIMIT = 128;
const QUICKSILVER_SOCKET_CONTROL_BYTES = 1048576;
const QUICKSILVER_SOCKET_AUDIO_BYTES = 24e4;
const QUICKSILVER_SOCKET_AUDIO_BATCH_BYTES = 9600;
/** Bounded raw-byte tail: unlike PCM queues this must retain odd-length mu-law chunks. */
var QuicksilverSocketAudioQueue = class {
	constructor(limit = QUICKSILVER_SOCKET_AUDIO_BYTES) {
		this.limit = limit;
		this.offset = 0;
		this.bytes = 0;
	}
	get length() {
		return this.bytes;
	}
	append(audio) {
		const count = Math.min(audio.length, this.limit);
		if (!count) return;
		const storage = this.storage ??= Buffer.alloc(this.limit);
		const dropped = Math.max(0, this.bytes + count - this.limit);
		this.offset = (this.offset + dropped) % this.limit;
		this.bytes -= dropped;
		const writeAt = (this.offset + this.bytes) % this.limit;
		const first = Math.min(count, this.limit - writeAt);
		const sourceAt = audio.length - count;
		audio.copy(storage, writeAt, sourceAt, sourceAt + first);
		if (first < count) audio.copy(storage, 0, sourceAt + first);
		this.bytes += count;
	}
	take(limit = this.bytes) {
		const output = Buffer.alloc(Math.min(limit, this.bytes));
		if (output.length && this.storage) {
			const first = Math.min(output.length, this.limit - this.offset);
			this.storage.copy(output, 0, this.offset, this.offset + first);
			if (first < output.length) this.storage.copy(output, first, 0, output.length - first);
			this.offset = (this.offset + output.length) % this.limit;
			this.bytes -= output.length;
		}
		return output;
	}
	clear() {
		this.storage = void 0;
		this.offset = 0;
		this.bytes = 0;
	}
};
//#endregion
export { QuicksilverSocketAudioQueue as a, QUICKSILVER_SOCKET_CONTROL_LIMIT as i, QUICKSILVER_SOCKET_AUDIO_BYTES as n, QUICKSILVER_SOCKET_CONTROL_BYTES as r, QUICKSILVER_SOCKET_AUDIO_BATCH_BYTES as t };
