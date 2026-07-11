export class JsonParser {
  static parse(content: string) {
    try {
      const cleaned = content
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      return JSON.parse(cleaned);
    } catch (error) {
      throw new Error("Invalid AI JSON Response");
    }
  }
}
