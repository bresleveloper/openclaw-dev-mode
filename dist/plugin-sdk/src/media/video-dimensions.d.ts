/** Positive video dimensions reported by ffprobe for the first video stream. */
export type VideoDimensions = {
    width: number;
    height: number;
};
/** Parses ffprobe JSON output, accepting only positive integer first-stream dimensions. */
export declare function parseFfprobeVideoDimensions(stdout: string): VideoDimensions | undefined;
/** Probes a video buffer through ffprobe stdin and treats probe failures as unknown dimensions. */
export declare function probeVideoDimensions(buffer: Buffer): Promise<VideoDimensions | undefined>;
