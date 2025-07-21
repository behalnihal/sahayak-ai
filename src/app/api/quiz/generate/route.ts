import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { QUIZ_PROMPT } from "@/lib/prompts";
import { auth } from "@clerk/nextjs/server";
import { decrementUserTokens } from "@/lib/actions/user.actions";

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface Quiz {
  questions: QuizQuestion[];
  topic: string;
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    // Decrement tokens, throw if none left
    const tokens = await decrementUserTokens(userId);
    if (tokens === undefined) {
      return NextResponse.json({ error: "No tokens left" }, { status: 429 });
    }

    const { topic } = await req.json();

    if (!topic) {
      return NextResponse.json({ error: "Topic is required" }, { status: 400 });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = QUIZ_PROMPT(topic);

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Try to parse the JSON response
    let quizData;
    try {
      // Extract JSON from the response (in case there's extra text)
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        quizData = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No JSON found in response");
      }
    } catch (parseError) {
      console.error("Failed to parse quiz JSON:", parseError);
      // Fallback: create a simple quiz structure
      quizData = {
        questions: [
          {
            question: `What is the main concept of ${topic}?`,
            options: [
              "A fundamental principle",
              "A complex theory",
              "A simple idea",
              "An advanced concept",
            ],
            correctAnswer: 0,
            explanation: "This is a basic question about the topic.",
          },
          {
            question: `Which of the following best describes ${topic}?`,
            options: [
              "A process",
              "A tool",
              "A methodology",
              "All of the above",
            ],
            correctAnswer: 3,
            explanation: "The topic can be described in multiple ways.",
          },
        ],
      };
    }

    const quiz: Quiz = {
      questions: quizData.questions || [],
      topic: topic,
    };

    return NextResponse.json({ quiz, tokens });
  } catch (error: unknown) {
    console.error("Quiz generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate quiz" },
      { status: 500 }
    );
  }
}
