import {
    Action,
    HandlerCallback,
    IAgentRuntime,
    Memory,
    State,
    ModelClass,
    Content,
    ActionExample,
    generateObject,
    composeContext,
    elizaLogger,
    generateObjectDeprecated,
} from "@ai16z/eliza";
import { uploadTemplate } from "../templates/upload";
import { Codex } from "@codex-storage/sdk-js";

import { promises as fs } from "fs";

export const codexUpload: Action = {
    name: "CODEX_UPLOAD",
    similes: [
        "UPLOAD_FILE_TO_CODEX",
        "STORE_FILE_IN_CODEX",
        "UPLOAD_TO_CODEX",
        "STORE_TO_CODEX",
        "STORE_IN_CODEX",
        "STORE_ON_CODEX_NETWORK",
        "PUBLISH_TO_CODEX",
        "PUBLICH_FILE_TO_CODEX"
    ],
    description: "Upload data to Codex",
    validate: async (runtime: IAgentRuntime, message: Memory) => {
        const codexRestApi = !!runtime.getSetting("CODEX_REST_API");
        return true || codexRestApi;
    },
    handler: async (
        runtime: IAgentRuntime,
        message: Memory,
        state: State,
        _options: any,
        callback: HandlerCallback
    ) => {
        elizaLogger.log("CODEX_UPLOAD action called");
        if (!state) {
            state = (await runtime.composeState(message)) as State;
        } else {
            state = await runtime.updateRecentMessageState(state);
        }

        // Compose upload context
        const uploadContext = composeContext({
            state,
            template: uploadTemplate,
            templatingEngine: undefined
        });

        elizaLogger.log(JSON.stringify(uploadContext))

        // Generate upload content
        const content = await generateObjectDeprecated({
            runtime,
            context: uploadContext,
            modelClass: ModelClass.LARGE,
        });

        elizaLogger.log(JSON.stringify(content))

        const codexRestApi = runtime.getSetting("CODEX_REST_API");
        if (!codexRestApi) {
            elizaLogger.error("Failed to get Codex REST API")
            if (callback) {
                callback({
                    text: "Failed to get Codex REST API",
                    content: { error: "Failed to get Codex REST API" },
                });
            }
            return false
        }

        console.log(codexRestApi)
        const codex = new Codex(codexRestApi)
        const filename = content.filePath.replace(/^.*[\\/]/, '')
        const data = await fs.readFile(content.filePath)

        fetch(`${codexRestApi}/`)
        //const uploadResult = codex.data.upload(data, undefined, {filename: filename})
        const result = await uploadResult.result

        if (result.error) {
            elizaLogger.error("Failed to upload: ", result.data)
            if (callback) {
                callback({
                    text: "Failed to upload: " + result.data,
                    content: { error: "Failed to upload: " + result.data },
                });
            }
            return false
        }

        if (callback) {
            elizaLogger.log("Successully uploaded to Codex")
            callback({
                text: `Successfully uploaded ${content.filePath} as CID ${result.data}`,
                content: {cid: result.data}
            })
        }

        return true
    },
    examples: [
        [
            {
                user: "{{user1}}",
                content: {
                    text: "upload the data.txt file",
                    action: "CODEX_UPLOAD",
                },
            },
        ],
        [
            {
                user: "{{user1}}",
                content: {
                    text: "can you please upload this video.avi file?",
                    action: "CODEX_UPLOAD",
                },
            },
        ],
        [
            {
                user: "{{user1}}",
                content: {
                    text: "I need to publish this audio.mp3 file",
                    action: "CODEX_UPLOAD",
                },
            },
        ],
    ] as ActionExample[][],
} as Action