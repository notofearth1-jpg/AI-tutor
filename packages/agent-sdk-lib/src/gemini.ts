import { GoogleGenerativeAI, GenerativeModel } from "@google/generative-ai";
import { withRetry } from "./retry";

export class GeminiClient {
  private genAI: GoogleGenerativeAI;
  private flashModel: GenerativeModel;
  private proModel: GenerativeModel;

  constructor(apiKey: string, flashModelId = "gemini-2.0-flash", proModelId = "gemini-pro-latest") {
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.flashModel = this.genAI.getGenerativeModel({ model: flashModelId });
    this.proModel = this.genAI.getGenerativeModel({ model: proModelId });
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
