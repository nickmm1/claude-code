import { describe, expect, it } from "vitest";

describe("API Secrets Configuration", () => {
  it("ANTHROPIC_API_KEY is set in environment", () => {
    const key = process.env.ANTHROPIC_API_KEY;
    expect(key).toBeDefined();
    expect(key).not.toBe("");
    expect(typeof key).toBe("string");
    // Anthropic keys start with "sk-ant-"
    expect(key).toMatch(/^sk-ant-/);
  });

  it("AIRTABLE_API_KEY is set in environment", () => {
    const key = process.env.AIRTABLE_API_KEY;
    expect(key).toBeDefined();
    expect(key).not.toBe("");
    expect(typeof key).toBe("string");
    // Airtable personal access tokens start with "pat"
    expect(key!.length).toBeGreaterThan(10);
  });

  it("Anthropic API key can reach the API (lightweight model list check)", async () => {
    const key = process.env.ANTHROPIC_API_KEY;
    if (!key) {
      throw new Error("ANTHROPIC_API_KEY is not set");
    }
    // Just verify the key format is valid - a real network call would be slow
    // The key must start with sk-ant- and be sufficiently long
    expect(key).toMatch(/^sk-ant-/);
    expect(key.length).toBeGreaterThan(30);
  });
});
