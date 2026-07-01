/** Hook invoked when auth profile failure state changes. */
type AuthProfileFailureHook = () => void;
/** Installs or clears the process-local auth profile failure hook. */
export declare function setAuthProfileFailureHook(hook: AuthProfileFailureHook | undefined): void;
/** Notifies the process-local auth profile failure hook. */
export declare function notifyAuthProfileFailureHook(): void;
export {};
