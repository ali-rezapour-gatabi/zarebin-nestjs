import { Injectable, InternalServerErrorException } from '@nestjs/common';
import axios from 'axios';
import { buildPrompt } from './nlp.prompt';

@Injectable()
export class NlpService {
  constructor() {}
  private readonly OLLAMA_URL = process.env.OLLAMA_URL ?? 'http://localhost:11434/api/generate ';
  private readonly MODEL = process.env.OLLAMA_MODEL;

  extractJapanese(text: string) {
    const firstBrace = text.indexOf('{');
    const lastBrace = text.lastIndexOf('}');
    if (firstBrace === -1 || lastBrace === -1) {
      throw new Error('No JSON object found in LLM output');
    }

    const jsonString = text.slice(firstBrace, lastBrace + 1);
    return JSON.parse(jsonString);
  }

  async analyzeText(model: any) {
    const prompt = buildPrompt(model);

    try {
      const response = await axios.post(this.OLLAMA_URL, {
        model: this.MODEL,
        prompt,
        stream: false,
      });

      const rawOutput = response.data.response;

      const parsed = this.extractJapanese(rawOutput);

      return parsed;
    } catch (error) {
      throw new InternalServerErrorException('NLP service failed' + error.message);
    }
  }
}
