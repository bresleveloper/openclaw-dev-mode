/** Parses AZURE_OPENAI_DEPLOYMENT_MAP-style model=deployment entries. */
export declare function parseAzureDeploymentNameMap(value: string | undefined): Map<string, string>;
/** Resolves the Azure deployment name for a model id, falling back to the model id. */
export declare function resolveAzureDeploymentNameFromMap(params: {
    modelId: string;
    deploymentMap?: string;
}): string;
