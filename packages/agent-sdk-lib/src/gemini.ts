import { GoogleGenerativeAI, GenerativeModel } from "@google/generative-ai";
import { withRetry } from "./retry";

export class GeminiClient {
  private genAI: GoogleGenerativeAI;
  private flashModel: GenerativeModel;
  private proModel: GenerativeModel;

  constructor(apiKey: string) {
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.flashModel = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    this.proModel = this.genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
  }

  async generateText(
    prompt: string,
    usePro = false,
    systemPrompt?: string
  ): Promise<{ text: string; usage: any }> {
    const model = usePro ? this.proModel : this.flashModel;

    const result = await withRetry(() =>
      model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        systemInstruction: systemPrompt ? { role: "system", parts: [{ text: systemPrompt }] } : undefined
      })
    );

    const response = await result.response;
    return {
      text: response.text(),
      usage: response.usageMetadata
    };
  }
}
