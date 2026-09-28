import { crc32, deflateSync } from "node:zlib";
//#region src/media/png-encode.ts
/** Keep chunk parts separate so final assembly copies compressed data only once. */
function pngChunkParts(type, data) {
	const header = Buffer.alloc(8);
	header.writeUInt32BE(data.length, 0);
	header.write(type, 4, "ascii");
	const crcBuf = Buffer.alloc(4);
	crcBuf.writeUInt32BE(crc32(data, crc32(header.subarray(4))), 0);
	return [
		header,
		data,
		crcBuf
	];
}
/**
* Writes one RGBA pixel into a width-strided buffer.
* Out-of-bounds coordinates are ignored so fixture drawing code can clip shapes cheaply.
*/
function fillPixel(buf, x, y, width, r, g, b, a = 255) {
	if (x < 0 || y < 0 || x >= width) return;
	const idx = (y * width + x) * 4;
	if (idx < 0 || idx + 3 >= buf.length) return;
	buf[idx] = r;
	buf[idx + 1] = g;
	buf[idx + 2] = b;
	buf[idx + 3] = a;
}
function encodePng(buffer, width, height, channels) {
	const stride = width * channels;
	const raw = Buffer.alloc((stride + 1) * height);
	for (let row = 0; row < height; row += 1) {
		const rawOffset = row * (stride + 1);
		raw[rawOffset] = 0;
		buffer.copy(raw, rawOffset + 1, row * stride, row * stride + stride);
	}
	const compressed = deflateSync(raw);
	const signature = Buffer.from([
		137,
		80,
		78,
		71,
		13,
		10,
		26,
		10
	]);
	const ihdr = Buffer.alloc(13);
	ihdr.writeUInt32BE(width, 0);
	ihdr.writeUInt32BE(height, 4);
	ihdr[8] = 8;
	ihdr[9] = channels === 4 ? 6 : 2;
	ihdr[10] = 0;
	ihdr[11] = 0;
	ihdr[12] = 0;
	return Buffer.concat([
		signature,
		...pngChunkParts("IHDR", ihdr),
		...pngChunkParts("IDAT", compressed),
		...pngChunkParts("IEND", Buffer.alloc(0))
	]);
}
/** Encodes tightly packed RGBA bytes (`width * height * 4`) as a PNG image. */
function encodePngRgba(buffer, width, height) {
	return encodePng(buffer, width, height, 4);
}
//#endregion
export { fillPixel as n, encodePngRgba as t };
