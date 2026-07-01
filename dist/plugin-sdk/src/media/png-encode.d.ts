/**
 * Writes one RGBA pixel into a width-strided buffer.
 * Out-of-bounds coordinates are ignored so fixture drawing code can clip shapes cheaply.
 */
export declare function fillPixel(buf: Buffer, x: number, y: number, width: number, r: number, g: number, b: number, a?: number): void;
/** Encodes tightly packed RGB bytes (`width * height * 3`) as a PNG image. */
export declare function encodePngRgb(buffer: Buffer, width: number, height: number): Buffer;
/** Encodes tightly packed RGBA bytes (`width * height * 4`) as a PNG image. */
export declare function encodePngRgba(buffer: Buffer, width: number, height: number): Buffer;
