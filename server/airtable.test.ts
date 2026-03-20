import { describe, expect, it } from "vitest";

describe("Airtable API Key Validation", () => {
  it("AIRTABLE_API_KEY is set and has correct format", () => {
    const key = process.env.AIRTABLE_API_KEY;
    expect(key).toBeDefined();
    expect(key).not.toBe("");
    expect(typeof key).toBe("string");
    expect(key!.length).toBeGreaterThan(10);
  });

  it("Airtable API key can read from AI Accountant Reports table", { timeout: 15000 }, async () => {
    const key = process.env.AIRTABLE_API_KEY;
    if (!key) {
      throw new Error("AIRTABLE_API_KEY is not set");
    }

    const BASE_ID = "appo1o8n17v0uHt5x";
    const TABLE_NAME = "AI%20Accountant%20Reports";

    const response = await fetch(
      `https://api.airtable.com/v0/${BASE_ID}/${TABLE_NAME}?maxRecords=1`,
      {
        headers: {
          Authorization: `Bearer ${key}`,
        },
      }
    );

    expect(response.status).toBe(200);
    const data = await response.json() as { records: unknown[] };
    expect(data.records).toBeDefined();
    expect(Array.isArray(data.records)).toBe(true);
    console.log(`Airtable connection verified. Records in table: ${data.records.length}`);
  });

  it("Airtable API key can write a test record and then delete it", { timeout: 15000 }, async () => {
    const key = process.env.AIRTABLE_API_KEY;
    if (!key) {
      throw new Error("AIRTABLE_API_KEY is not set");
    }

    const BASE_ID = "appo1o8n17v0uHt5x";
    const TABLE_NAME = "AI%20Accountant%20Reports";

    // Create a test record
    const createResponse = await fetch(
      `https://api.airtable.com/v0/${BASE_ID}/${TABLE_NAME}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${key}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fields: {
            "Salon Name": "TEST RECORD - DELETE ME",
            Email: "test@test.com",
            "Analysis Date": new Date().toISOString().split("T")[0],
          },
        }),
      }
    );

    expect(createResponse.status).toBe(200);
    const created = await createResponse.json() as { id: string };
    expect(created.id).toBeDefined();
    console.log(`Test record created: ${created.id}`);

    // Clean up: delete the test record
    const deleteResponse = await fetch(
      `https://api.airtable.com/v0/${BASE_ID}/${TABLE_NAME}/${created.id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${key}`,
        },
      }
    );

    expect(deleteResponse.status).toBe(200);
    console.log("Test record deleted successfully");
  });
});
