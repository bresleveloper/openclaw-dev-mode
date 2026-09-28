import net from "node:net";
import { Duplex } from "node:stream";
//#region src/gateway/desktop/rfb-probe.ts
const RFB_BANNER_BYTES = 12;
const RFB_37_MINOR = 7;
const RFB_37_BANNER = Buffer.from("RFB 003.007\n", "ascii");
const RFB_38_BANNER = Buffer.from("RFB 003.008\n", "ascii");
/** Parses the fixed-width RFB ProtocolVersion banner without socket state. */
function parseRfbVersionBanner(buffer) {
	const banner = buffer.subarray(0, RFB_BANNER_BYTES).toString("ascii");
	if (buffer.length < RFB_BANNER_BYTES) return {
		kind: "not-rfb",
		banner
	};
	const match = /^RFB 003\.(\d{3})\n$/u.exec(banner);
	if (!match) return {
		kind: "not-rfb",
		banner
	};
	const minor = Number.parseInt(match[1] ?? "", 10);
	return {
		kind: "rfb",
		minor,
		reply: minor > RFB_37_MINOR ? RFB_38_BANNER : minor === RFB_37_MINOR ? RFB_37_BANNER : Buffer.from("RFB 003.003\n", "ascii")
	};
}
/** Parses the post-version RFB security offer from a standalone buffer. */
function parseRfbSecurityTypes(buffer, protocolMinor) {
	if (protocolMinor < RFB_37_MINOR) {
		if (buffer.length < 4) return {
			kind: "incomplete",
			requiredBytes: 4
		};
		const securityType = buffer.readUInt32BE(0);
		return {
			kind: "complete",
			securityTypes: securityType === 0 ? [] : [securityType]
		};
	}
	if (buffer.length < 1) return {
		kind: "incomplete",
		requiredBytes: 1
	};
	const count = buffer.readUInt8(0);
	if (count > 0) {
		const requiredBytes = 1 + count;
		return buffer.length < requiredBytes ? {
			kind: "incomplete",
			requiredBytes
		} : {
			kind: "complete",
			securityTypes: [...buffer.subarray(1, requiredBytes)]
		};
	}
	return {
		kind: "complete",
		securityTypes: []
	};
}
var SocketEndedError = class extends Error {
	constructor(buffered) {
		super("RFB server closed the handshake early");
		this.buffered = buffered;
	}
};
var SocketTimeoutError = class extends Error {};
function createSocketReader(socket) {
	let failure;
	const waiters = /* @__PURE__ */ new Set();
	const wake = () => {
		for (const waiter of waiters) waiter();
		waiters.clear();
	};
	const onEnd = () => {
		failure ??= new SocketEndedError(socket.read() ?? Buffer.alloc(0));
		wake();
	};
	const onError = (error) => {
		failure = error;
		wake();
	};
	socket.on("readable", wake);
	socket.once("end", onEnd);
	socket.once("close", onEnd);
	socket.once("error", onError);
	return {
		async readExactly(length) {
			for (;;) {
				const value = socket.read(length);
				if (value) {
					if (value.length !== length) throw new SocketEndedError(value);
					return value;
				}
				if (failure) throw failure;
				await new Promise((resolve) => {
					waiters.add(resolve);
				});
			}
		},
		detach() {
			socket.pause();
			socket.off("readable", wake);
			socket.off("end", onEnd);
			socket.off("close", onEnd);
			socket.off("error", onError);
		}
	};
}
/** Replays the inspected prefix while keeping authentication on the same TCP connection. */
var ConnectedRfbStream = class extends Duplex {
	constructor(socket, versionReply) {
		super({ allowHalfOpen: false });
		this.socket = socket;
		this.versionReply = versionReply;
		this.version = Buffer.alloc(0);
		this.on("error", () => void 0);
		socket.on("data", (chunk) => {
			if (!this.push(chunk)) socket.pause();
		});
		socket.once("end", () => {
			this.push(null);
			this.end();
		});
		socket.once("close", () => {
			if (!socket.readableEnded) this.destroy(/* @__PURE__ */ new Error("RFB peer closed before ending the stream"));
		});
		socket.once("error", (error) => this.destroy(error));
	}
	_read() {
		this.socket.resume();
	}
	_write(chunk, _encoding, callback) {
		let remaining = chunk;
		if (this.version.length < RFB_BANNER_BYTES) {
			const consumed = Math.min(RFB_BANNER_BYTES - this.version.length, chunk.length);
			this.version = Buffer.concat([this.version, chunk.subarray(0, consumed)]);
			remaining = chunk.subarray(consumed);
			if (this.version.length === RFB_BANNER_BYTES && !this.version.equals(this.versionReply)) {
				callback(/* @__PURE__ */ new Error("RFB client changed the inspected protocol version"));
				return;
			}
		}
		if (remaining.length) this.socket.write(remaining, callback);
		else callback();
	}
	_final(callback) {
		this.socket.end(callback);
	}
	_destroy(error, callback) {
		this.socket.destroy();
		callback(error);
	}
};
/** Inspects an RFB offer and retains that connection for its authenticated stream. */
async function connectRfbServer(params) {
	params.signal?.throwIfAborted();
	const socket = net.createConnection({
		port: params.port,
		host: params.host,
		allowHalfOpen: true
	});
	const deadline = setTimeout(() => {
		socket.destroy(new SocketTimeoutError("RFB handshake timed out"));
	}, params.timeoutMs);
	deadline.unref();
	const reader = createSocketReader(socket);
	let retained = false;
	const onAbort = () => socket.destroy(params.signal?.reason instanceof Error ? params.signal.reason : /* @__PURE__ */ new Error("RFB connection aborted"));
	params.signal?.addEventListener("abort", onAbort, { once: true });
	socket.once("close", () => params.signal?.removeEventListener("abort", onAbort));
	try {
		await new Promise((resolve, reject) => {
			socket.once("connect", resolve);
			socket.once("error", reject);
		});
		let bannerBytes;
		try {
			bannerBytes = await reader.readExactly(RFB_BANNER_BYTES);
		} catch (error) {
			params.signal?.throwIfAborted();
			if (error instanceof SocketEndedError) return {
				kind: "not-rfb",
				banner: error.buffered.toString("ascii")
			};
			throw error;
		}
		const version = parseRfbVersionBanner(bannerBytes);
		if (version.kind === "not-rfb") return version;
		socket.write(version.reply);
		const prefixBytes = version.minor < RFB_37_MINOR ? 4 : 1;
		let securityBuffer = await reader.readExactly(prefixBytes);
		let parsed = parseRfbSecurityTypes(securityBuffer, version.minor);
		while (parsed.kind === "incomplete") {
			securityBuffer = Buffer.concat([securityBuffer, await reader.readExactly(parsed.requiredBytes - securityBuffer.length)]);
			parsed = parseRfbSecurityTypes(securityBuffer, version.minor);
		}
		params.signal?.throwIfAborted();
		reader.detach();
		const stream = new ConnectedRfbStream(socket, version.reply);
		socket.unshift(Buffer.concat([bannerBytes, securityBuffer]));
		retained = true;
		return {
			kind: "rfb",
			securityTypes: parsed.securityTypes,
			stream
		};
	} catch (error) {
		params.signal?.throwIfAborted();
		if (error instanceof SocketTimeoutError) return { kind: "timeout" };
		return { kind: "unreachable" };
	} finally {
		clearTimeout(deadline);
		if (!retained) {
			reader.detach();
			socket.destroy();
		}
	}
}
/** Status-only inspection; streaming callers retain the connected result instead. */
async function probeRfbServer(params) {
	const result = await connectRfbServer(params);
	if (result.kind !== "rfb") return result;
	result.stream.destroy();
	return {
		kind: "rfb",
		securityTypes: result.securityTypes
	};
}
/** Maps standard RFB security numbers into the credential UX supported by OpenClaw. */
function classifyRfbSecurity(securityTypes) {
	for (const securityType of securityTypes) {
		if (securityType === 1) return "none";
		if (securityType === 2) return "vnc-password";
		if (securityType === 30) return "ard-account";
		if ([
			6,
			16,
			19,
			22,
			113
		].includes(securityType)) return "unsupported";
	}
	return "unsupported";
}
//#endregion
export { probeRfbServer as i, connectRfbServer as n, parseRfbVersionBanner as r, classifyRfbSecurity as t };
