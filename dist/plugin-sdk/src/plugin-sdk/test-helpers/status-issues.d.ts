/** Verifies that an open-DM policy issue is reported as a config issue. */
export declare function expectOpenDmPolicyConfigIssue<TAccount>(params: {
    collectIssues: (accounts: TAccount[]) => Array<{
        kind?: string;
    }>;
    account: TAccount;
}): void;
