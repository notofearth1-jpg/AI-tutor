import { Injectable } from "@nestjs/common";

@Injectable()
export class SafetyService {
  /**
   * Simple safety filter to screen AI outputs.
   * In a real app, this would use a moderation API.
   */
  async screenOutput(text: string): Promise<string> {
    const toxicWords = ["unsafe_word_1", "unsafe_word_2"];
    let cleaned = text;
    for (const word of toxicWords) {
      cleaned = cleaned.replace(new RegExp(word, "gi"), "***");
    }
    return cleaned;
  }

  async sanitizeInput(text: string): Promise<string> {
    return text.trim().substring(0, 10000); // basic length limit
  }
}
