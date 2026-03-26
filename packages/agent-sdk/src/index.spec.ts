import { parseMarkdownJson } from "./json";

describe("Agent SDK Utilities", () => {
  describe("parseMarkdownJson", () => {
    it("parses pure JSON strings", () => {
      const input = '{"key": "value"}';
      expect(parseMarkdownJson(input)).toEqual({ key: "value" });
    });

    it("extracts JSON from markdown code blocks", () => {
      const input = 'Here is the result:\n```json\n{"success": true}\n```';
      expect(parseMarkdownJson(input)).toEqual({ success: true });
    });

    it("handles non-json labelled markdown blocks", () => {
      const input = '```\n{"success": true}\n```';
      expect(parseMarkdownJson(input)).toEqual({ success: true });
    });

    it("throws on invalid JSON", () => {
      const input = 'not json';
      expect(() => parseMarkdownJson(input)).toThrow();
    });
  });
});
