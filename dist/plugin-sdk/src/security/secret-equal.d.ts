/** Compare two optional UTF-8 secrets without leaking length through timingSafeEqual errors. */
export declare function safeEqualSecret(provided: string | undefined | null, expected: string | undefined | null): boolean;
