import { describe, it, expect } from "vitest";

const NOTION_API_KEY = process.env.NOTION_API_KEY;
const CRM_DATABASE_ID = "e38f1d62-bd62-4c27-9f1f-a3af32695115";

describe("Notion CRM Integration", () => {
  it("should have NOTION_API_KEY configured", () => {
    expect(NOTION_API_KEY).toBeTruthy();
    expect(NOTION_API_KEY).not.toBe("undefined");
  });

  it("should be able to query the Notion CRM database", async () => {
    if (!NOTION_API_KEY) {
      console.warn("Skipping: NOTION_API_KEY not set");
      return;
    }

    const response = await fetch(
      `https://api.notion.com/v1/databases/${CRM_DATABASE_ID}/query`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${NOTION_API_KEY}`,
          "Notion-Version": "2022-06-28",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ page_size: 1 }),
      }
    );

    expect(response.status).toBe(200);
    const data = await response.json() as { results: unknown[] };
    expect(Array.isArray(data.results)).toBe(true);
    console.log(`Notion CRM accessible. Records returned: ${data.results.length}`);
  }, 15000);
});
