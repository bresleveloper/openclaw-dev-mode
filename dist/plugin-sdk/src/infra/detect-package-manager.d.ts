type DetectedPackageManager = "pnpm" | "bun" | "npm";
/** Detects the package manager that owns a package root from manifests, locks, and install layout. */
export declare function detectPackageManager(root: string): Promise<DetectedPackageManager | null>;
export {};
