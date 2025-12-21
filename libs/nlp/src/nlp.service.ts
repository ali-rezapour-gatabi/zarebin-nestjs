import { Injectable, InternalServerErrorException } from '@nestjs/common';
import axios from 'axios';
import { decode } from '@toon-format/toon';

import { buildAnalysisPrompt, buildMessagePrompt, buildPrompt } from './nlp.prompt';

export enum PromptType {
  MESSAGE = 'MESSAGE',
  EXPERT = 'EXPERT',
  ANALYSIS = 'ANALYSIS',
}

interface KeywordResult {
  keywords: string[];
}

@Injectable()
export class NlpService {
  private readonly apiUrl = 'https://api.piapi.ai/v1/chat/completions';
  private readonly model = 'gpt-4o';

  async analyzeText(data: any, type: PromptType): Promise<string | KeywordResult> {
    let prompt = '';
    let expectsJson = true;

    switch (type) {
      case PromptType.MESSAGE:
        prompt = buildMessagePrompt(data);
        break;

      case PromptType.EXPERT:
        prompt = buildPrompt(data);
        break;

      case PromptType.ANALYSIS:
        prompt = buildAnalysisPrompt(data);
        expectsJson = false;
        break;
    }

    try {
      const raw = await this.callLLM(prompt);

      if (!expectsJson) {
        return raw;
      }

      const keywords = this.safeParseKeywords(raw);
      return { keywords };
    } catch (error: any) {
      throw new InternalServerErrorException(`NLP service failed: ${error.message}`);
    }
  }

  private async callLLM(prompt: string): Promise<string> {
    const response = await axios.post(
      this.apiUrl,
      {
        model: this.model,
        temperature: 0,
        messages: [
          {
            role: 'system',
            content: 'You are a professional assistant. ' + 'If JSON is requested, respond ONLY with valid JSON.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.AI_API_KEY}`,
        },
      },
    );

    return response.data.choices[0].message.content.trim();
  }

  private safeParseKeywords(raw: string): string[] {
    const cleaned = raw
      .replace(/```[a-z]*|```/gi, '')
      .replace(/[“”]/g, '"')
      .trim();

    try {
      const parsed = JSON.parse(cleaned);
      if (Array.isArray(parsed?.keywords)) {
        return parsed.keywords;
      }
    } catch {}
    try {
      const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        if (Array.isArray(parsed?.keywords)) {
          return parsed.keywords;
        }
      }
    } catch {}

    try {
      const decoded = decode(cleaned);
      if (Array.isArray(decoded)) {
        return decoded.map((d: any) => d.word).filter((w: any) => typeof w === 'string');
      }
    } catch {}

    const arrayMatch = cleaned.match(/\[(.*?)\]/);
    if (arrayMatch) {
      return arrayMatch[1]
        .split(',')
        .map((k) => k.replace(/["']/g, '').trim())
        .filter(Boolean);
    }

    return [];
  }
}
