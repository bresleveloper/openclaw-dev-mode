export declare const pluginRegistrationContractCases: {
    alibaba: {
        pluginId: string;
        videoGenerationProviderIds: string[];
        requireGenerateVideo: true;
    };
    anthropic: {
        pluginId: string;
        providerIds: string[];
        mediaUnderstandingProviderIds: string[];
        cliBackendIds: string[];
        requireDescribeImages: true;
    };
    brave: {
        pluginId: string;
        webSearchProviderIds: string[];
    };
    byteplus: {
        pluginId: string;
        providerIds: string[];
        videoGenerationProviderIds: string[];
        requireGenerateVideo: true;
    };
    comfy: {
        pluginId: string;
        providerIds: string[];
        imageGenerationProviderIds: string[];
        musicGenerationProviderIds: string[];
        videoGenerationProviderIds: string[];
        requireGenerateImage: true;
        requireGenerateVideo: true;
    };
    deepgram: {
        pluginId: string;
        mediaUnderstandingProviderIds: string[];
    };
    duckduckgo: {
        pluginId: string;
        webSearchProviderIds: string[];
    };
    elevenlabs: {
        pluginId: string;
        speechProviderIds: string[];
        requireSpeechVoices: true;
    };
    exa: {
        pluginId: string;
        webSearchProviderIds: string[];
    };
    fal: {
        pluginId: string;
        providerIds: string[];
        imageGenerationProviderIds: string[];
        musicGenerationProviderIds: string[];
        videoGenerationProviderIds: string[];
        requireGenerateImage: true;
        requireGenerateVideo: true;
    };
    firecrawl: {
        pluginId: string;
        webFetchProviderIds: string[];
        webSearchProviderIds: string[];
        toolNames: string[];
    };
    google: {
        pluginId: string;
        providerIds: string[];
        webSearchProviderIds: string[];
        realtimeVoiceProviderIds: string[];
        speechProviderIds: string[];
        mediaUnderstandingProviderIds: string[];
        imageGenerationProviderIds: string[];
        videoGenerationProviderIds: string[];
        requireDescribeImages: true;
        requireGenerateImage: true;
        requireGenerateVideo: true;
    };
    gradium: {
        pluginId: string;
        speechProviderIds: string[];
    };
    groq: {
        pluginId: string;
        mediaUnderstandingProviderIds: string[];
    };
    lmstudio: {
        pluginId: string;
        providerIds: string[];
    };
    microsoft: {
        pluginId: string;
        speechProviderIds: string[];
        requireSpeechVoices: true;
    };
    minimax: {
        pluginId: string;
        providerIds: string[];
        speechProviderIds: string[];
        mediaUnderstandingProviderIds: string[];
        imageGenerationProviderIds: string[];
        musicGenerationProviderIds: string[];
        videoGenerationProviderIds: string[];
        webSearchProviderIds: string[];
        requireDescribeImages: true;
        requireGenerateImage: true;
        requireGenerateVideo: true;
    };
    mistral: {
        pluginId: string;
        mediaUnderstandingProviderIds: string[];
    };
    moonshot: {
        pluginId: string;
        providerIds: string[];
        webSearchProviderIds: string[];
        mediaUnderstandingProviderIds: string[];
        requireDescribeImages: true;
        manifestAuthChoice: {
            pluginId: string;
            choiceId: string;
            choiceLabel: string;
            groupId: string;
            groupLabel: string;
            groupHint: string;
        };
    };
    nvidia: {
        pluginId: string;
        providerIds: string[];
        manifestAuthChoice: {
            pluginId: string;
            choiceId: string;
            choiceLabel: string;
            groupId: string;
            groupLabel: string;
            groupHint: string;
        };
    };
    ollama: {
        pluginId: string;
        providerIds: string[];
        webSearchProviderIds: string[];
    };
    openai: {
        pluginId: string;
        providerIds: string[];
        speechProviderIds: string[];
        realtimeTranscriptionProviderIds: string[];
        realtimeVoiceProviderIds: string[];
        mediaUnderstandingProviderIds: string[];
        imageGenerationProviderIds: string[];
        videoGenerationProviderIds: string[];
        requireSpeechVoices: true;
        requireDescribeImages: true;
        requireGenerateImage: true;
        requireGenerateVideo: true;
    };
    "opencode-go": {
        pluginId: string;
        providerIds: string[];
        mediaUnderstandingProviderIds: string[];
        requireDescribeImages: true;
    };
    opencode: {
        pluginId: string;
        providerIds: string[];
        mediaUnderstandingProviderIds: string[];
        requireDescribeImages: true;
    };
    openrouter: {
        pluginId: string;
        providerIds: string[];
        mediaUnderstandingProviderIds: string[];
        imageGenerationProviderIds: string[];
        musicGenerationProviderIds: string[];
        videoGenerationProviderIds: string[];
        requireDescribeImages: true;
        requireGenerateImage: true;
        requireGenerateVideo: true;
    };
    parallel: {
        pluginId: string;
        webSearchProviderIds: string[];
    };
    perplexity: {
        pluginId: string;
        webSearchProviderIds: string[];
    };
    pixverse: {
        pluginId: string;
        videoGenerationProviderIds: string[];
        requireGenerateVideo: true;
    };
    qwen: {
        pluginId: string;
        providerIds: string[];
        mediaUnderstandingProviderIds: string[];
        videoGenerationProviderIds: string[];
        requireDescribeImages: true;
        requireGenerateVideo: true;
    };
    runway: {
        pluginId: string;
        videoGenerationProviderIds: string[];
        requireGenerateVideo: true;
    };
    senseaudio: {
        pluginId: string;
        mediaUnderstandingProviderIds: string[];
    };
    tavily: {
        pluginId: string;
        webSearchProviderIds: string[];
        toolNames: string[];
    };
    together: {
        pluginId: string;
        providerIds: string[];
        videoGenerationProviderIds: string[];
        requireGenerateVideo: true;
    };
    "tts-local-cli": {
        pluginId: string;
        speechProviderIds: string[];
    };
    vydra: {
        pluginId: string;
        providerIds: string[];
        speechProviderIds: string[];
        imageGenerationProviderIds: string[];
        videoGenerationProviderIds: string[];
        requireSpeechVoices: true;
        requireGenerateImage: true;
        requireGenerateVideo: true;
        manifestAuthChoice: {
            pluginId: string;
            choiceId: string;
            choiceLabel: string;
            groupId: string;
            groupLabel: string;
            groupHint: string;
        };
    };
    xai: {
        pluginId: string;
        providerIds: string[];
        webSearchProviderIds: string[];
        realtimeTranscriptionProviderIds: string[];
        mediaUnderstandingProviderIds: string[];
        videoGenerationProviderIds: string[];
        toolNames: string[];
        requireGenerateVideo: true;
    };
    zai: {
        pluginId: string;
        mediaUnderstandingProviderIds: string[];
        requireDescribeImages: true;
    };
};
