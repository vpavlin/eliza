import { Plugin } from "@ai16z/eliza";
import { codexUpload } from "./actions/upload";

export const codexPlugin: Plugin = {
    description: "Codex Plugin for Eliza",
    name: "Codex",
    actions: [codexUpload],
    evaluators: [],
    providers: [],
};
