import type { DescribeImageFileParams, DescribeImageFileWithModelParams, DescribeVideoFileParams, ExtractStructuredWithModelParams, RunMediaUnderstandingFileParams, RunMediaUnderstandingFileResult, TranscribeAudioFileParams } from "./runtime-types.js";
export type { DescribeImageFileParams, DescribeImageFileWithModelParams, DescribeVideoFileParams, ExtractStructuredWithModelParams, RunMediaUnderstandingFileParams, RunMediaUnderstandingFileResult, TranscribeAudioFileParams, } from "./runtime-types.js";
/** Runs media understanding for one local file or remote URL and returns the first matching output. */
export declare function runMediaUnderstandingFile(params: RunMediaUnderstandingFileParams): Promise<RunMediaUnderstandingFileResult>;
/** Describes one image file or URL through the configured image-understanding pipeline. */
export declare function describeImageFile(params: DescribeImageFileParams): Promise<RunMediaUnderstandingFileResult>;
/** Describes one image with an explicit provider/model, bypassing configured media model selection. */
export declare function describeImageFileWithModel(params: DescribeImageFileWithModelParams): Promise<import("./types.ts").ImageDescriptionResult>;
/** Runs provider-backed structured extraction for multimodal text/image input. */
export declare function extractStructuredWithModel(params: ExtractStructuredWithModelParams): Promise<import("./types.ts").StructuredExtractionResult>;
/** Describes one video file or URL through the configured video-understanding pipeline. */
export declare function describeVideoFile(params: DescribeVideoFileParams): Promise<RunMediaUnderstandingFileResult>;
/** Transcribes one audio file or URL through the configured audio-understanding pipeline. */
export declare function transcribeAudioFile(params: TranscribeAudioFileParams): Promise<RunMediaUnderstandingFileResult>;
