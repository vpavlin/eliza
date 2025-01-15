export const uploadTemplate = `Respond with a JSON markdown block containing only the extracted values. Use null for any values that cannot be determined.


Example response:
\`\`\`json
{
    "filePath": null,
    "metadata": string
}
\`\`\`

{{recentMessages}}

Given the recent messages, extract the following information about the requested file upload:
- Path to uploaded file
- Additional metadata (e.g. filename)

Respond with a JSON markdown block containing only the extracted values. `;