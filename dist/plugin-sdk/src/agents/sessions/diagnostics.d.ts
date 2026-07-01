/**
 * Session resource diagnostic types.
 *
 * Describes collisions and warnings discovered while loading extensions, skills, prompts, and themes.
 */
export interface ResourceCollision {
    resourceType: "extension" | "skill" | "prompt" | "theme";
    name: string;
    winnerPath: string;
    loserPath: string;
    winnerSource?: string;
    loserSource?: string;
}
export interface ResourceDiagnostic {
    type: "warning" | "error" | "collision";
    message: string;
    path?: string;
    collision?: ResourceCollision;
}
