/** Describes one image through the configured media runtime. */
export declare const describeImageWithModel: (params: import("./types.ts").ImageDescriptionRequest) => Promise<import("./types.ts").ImageDescriptionResult>;
/** Describes multiple images through the configured media runtime. */
export declare const describeImagesWithModel: (params: import("./types.ts").ImagesDescriptionRequest) => Promise<import("./types.ts").ImagesDescriptionResult>;
/** Describes one image after applying the runtime payload transform. */
export declare const describeImageWithModelPayloadTransform: (params: import("./types.ts").ImageDescriptionRequest, onPayload: ((payload: unknown, model: import("@openclaw/llm-core").Model) => import("@openclaw/llm-core").MaybePromise<unknown>) | undefined) => Promise<import("./types.ts").ImageDescriptionResult>;
/** Describes multiple images after applying the runtime payload transform. */
export declare const describeImagesWithModelPayloadTransform: (params: import("./types.ts").ImagesDescriptionRequest, onPayload: ((payload: unknown, model: import("@openclaw/llm-core").Model) => import("@openclaw/llm-core").MaybePromise<unknown>) | undefined) => Promise<import("./types.ts").ImagesDescriptionResult>;
