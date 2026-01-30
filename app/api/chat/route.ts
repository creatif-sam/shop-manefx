import { createClient } from '@/lib/supabase/server';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

// Initialize the SDK
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
    const { message } = await req.json();
    const supabase = await createClient();

    console.log("Starting RAG process for message:", message);

    // 1. EMBEDDING: Using the most stable embedding model name
    const embeddingModel = genAI.getGenerativeModel({ model: "embedding-001" });
    const embeddingResult = await embeddingModel.embedContent(message);
    const queryVector = embeddingResult.embedding.values;

    console.log("Vector generated successfully.");

    // 2. RETRIEVAL: Search Supabase
    const { data: chunks, error: rpcError } = await supabase.rpc('match_site_knowledge', {
      query_embedding: queryVector,
      match_threshold: 0.3, // Lowered slightly to be more forgiving
      match_count: 5,
    });

    if (rpcError) {
      console.error("Supabase RPC Error:", rpcError);
      throw rpcError;
    }

    const contextText = chunks?.map((c: any) => c.content).join("\n\n") || "No internal context found.";
    console.log("Context retrieved from database.");

    // 3. GENERATION: Using the stable model name 'gemini-pro' 
    // This is the most compatible string for the GoogleGenerativeAI SDK
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    const prompt = `
      You are the ManeF/x AI Assistant, an expert in beard growth and Kirkland products in Ghana. 
      Use the following context to answer the user. 
      
      RULES:
      - Use ONLY the provided context.
      - If unsure, say you don't know and provide WhatsApp +233535023614.
      - Be professional, bold, and helpful.
      - Mention 24-48 hour delivery in Accra if they ask about shipping.

      CONTEXT:
      ${contextText}
      
      USER QUESTION:
      ${message}
    `;

    console.log("Sending request to Gemini Pro...");
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const responseText = response.text();

    return NextResponse.json({ text: responseText });

  } catch (error: any) {
    // Detailed error logging for your terminal
    console.error("FULL RAG ERROR:", {
      message: error.message,
      status: error.status,
      details: error.errorDetails
    });

    return NextResponse.json({ 
      error: "Brain sync failed. Please contact us on WhatsApp!",
      debug: error.message 
    }, { status: 500 });
  }
}