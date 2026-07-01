type Rgba = {
    r: number;
    g: number;
    b: number;
    a?: number;
};
/** Create a solid-color PNG buffer, preserving alpha only when needed. */
export declare function createSolidPngBuffer(width: number, height: number, color: Rgba): Buffer;
/** Create a deterministic RGB PNG with varied pixel values. */
export declare function createNoisyPngBuffer(width: number, height: number): Buffer;
/** Create a grayscale+alpha PNG for image paths that must handle non-RGB color types. */
export declare function createGrayscaleAlphaPngBuffer(width: number, height: number): Buffer;
/** Return a tiny valid JPEG fixture buffer. */
export declare function createTinyJpegBuffer(): Buffer;
/** Create deterministic RGBA pixels for encoder and media conversion tests. */
export declare function createNoisyRgbaBuffer(width: number, height: number): Buffer;
export {};
