/** Strip terminal control sequences from a potentially multi-line doctor note. */
export declare function sanitizeDoctorNote(note: string): string;
/** Emit grouped doctor change, info, and warning notes with sanitized content. */
export declare function emitDoctorNotes(params: {
    note: (message: string, title?: string) => void;
    changeNotes?: string[];
    infoNotes?: string[];
    warningNotes?: string[];
}): void;
