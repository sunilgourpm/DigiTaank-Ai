import { GoogleGenAI } from "@google/genai";
import { Quotation, NegotiationSuggestion } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function generateProposal(quotation: Quotation): Promise<string> {
  const model = "gemini-3-flash-preview";
  const prompt = `
    Generate a professional business proposal based on this quotation:
    Client: ${quotation.client.name} (${quotation.client.businessName})
    Business Type: ${quotation.client.businessType}
    Services: ${quotation.services.map(s => s.name).join(", ")}
    Total Cost: ₹${quotation.finalPrice}
    Timeline: ${quotation.timeline}

    The proposal should include:
    1. Executive Summary
    2. Detailed Service Descriptions
    3. Execution Plan
    4. Deliverables
    5. Benefits of working with DigiTaank
    6. Maintenance & Support

    Format the output in Markdown.
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: [{ parts: [{ text: prompt }] }],
    });
    return response.text || "Failed to generate proposal.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Error generating proposal text.";
  }
}

export async function negotiatePrice(quotation: Quotation, clientBudget: number): Promise<NegotiationSuggestion> {
  const model = "gemini-3-flash-preview";
  const prompt = `
    As an AI Sales Assistant for DigiTaank, suggest a negotiation strategy.
    Current Quotation Total: ₹${quotation.totalPrice}
    Client Budget: ₹${clientBudget}
    Services Selected: ${quotation.services.map(s => s.name).join(", ")}

    Suggest:
    1. A revised price that is closer to the budget but maintains profitability.
    2. Reasoning for the suggestion.
    3. Suggested changes (e.g., removing a service, reducing scope, or offering a one-time discount).

    Return the response in JSON format:
    {
      "revisedPrice": number,
      "reasoning": "string",
      "suggestedChanges": "string"
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: [{ parts: [{ text: prompt }] }],
      config: { responseMimeType: "application/json" }
    });
    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Gemini Error:", error);
    return {
      revisedPrice: clientBudget,
      reasoning: "Failed to get AI suggestion.",
      suggestedChanges: "Manual adjustment recommended."
    };
  }
}
