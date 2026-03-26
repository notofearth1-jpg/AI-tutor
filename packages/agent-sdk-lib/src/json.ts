export function parseMarkdownJson<T>(content: string): T {
  // Try to find JSON block in markdown
  const jsonRegex = /```(?:json)?\s*([\s\S]*?)\s*```/i;
  const match = content.match(jsonRegex);

  let rawJson = match ? match[1] : content;

  // Clean common AI artifacts
  rawJson = rawJson.trim()
    .replace(/^```json/, "")
    .replace(/```$/, "")
    .trim();

  try {
    return JSON.parse(rawJson) as T;
  } catch (err) {
    console.error("Failed to parse AI JSON response:", rawJson);
    throw new Error("AI responded with invalid JSON format.");
  }
}
