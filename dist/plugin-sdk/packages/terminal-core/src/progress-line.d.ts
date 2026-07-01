/** Register the stream that currently owns an inline progress line. */
export declare function registerActiveProgressLine(stream: NodeJS.WriteStream): void;
/** Clear the active progress line when it is attached to a TTY stream. */
export declare function clearActiveProgressLine(): void;
/** Unregister the active progress line, optionally only for a matching stream. */
export declare function unregisterActiveProgressLine(stream?: NodeJS.WriteStream): void;
