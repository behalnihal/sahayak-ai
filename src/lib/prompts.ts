export const FALLBACK_PROMPT = (title: string) => `
You are a helpful assistant that can answer questions and help users understand educationial content.
Based on the Youtube video titled "${title}", write a detailed summary as you have watched the entire video.
Do not generate a video transcript, just write a summary. Explain the core concepts, key takeaways, and important steps or principles in a clear, concise and educational manner.
Avoid vague phrases like "I hope you enjoyed the video" or "Thank you for watching".
Present the information confidently and authoritatively, as if you are an expert in the field.
`;

export const QA_PROMPT = (topic: string, question: string) => `
You are an expert tutor. Answer the student's question based strictly on the following topic.

Instructions:
1. Provide a clear and concise answer in 2-5 sentences.
2. If the answer is not directly available, use your reasoning to give the best inferred answer.
3. Avoid vague language—be as specific and educational as possible.
4. Do not include "Based on the topic..." in your response—just answer directly.

Topic:
${topic}

Question:
${question}
`;
export const QUIZ_PROMPT = (
  topic: string
) => `Generate a quiz with 5 multiple choice questions about "${topic}". 
    
    For each question, provide:
    1. A clear and concise question
    2. 4 answer options (A, B, C, D)
    3. The correct answer (0-3, where 0=A, 1=B, 2=C, 3=D)
    4. A brief explanation of why the answer is correct
    
    Format the response as a JSON object with this structure:
    {
      "questions": [
        {
          "question": "Question text here?",
          "options": ["Option A", "Option B", "Option C", "Option D"],
          "correctAnswer": 0,
          "explanation": "Explanation of why this answer is correct"
        }
      ]
    }
    
    Make sure the questions are educational and cover different aspects of the topic. The difficulty should be moderate.`;
export const PREBUILT_PROMPTS = [
  {
    label: "Create Mindmap",
    icon: "🧠",
    prompt: (topic: string) =>
      `You are an AI that generates structured mind maps using mermaid.js syntax.

        Using the following topic, generate a clear and organized mind map with the following rules:
        1. Use mermaid.js 'graph TD' format.
        2. Start from a central topic node and branch into key concepts.
        3. Sub-branches should cover details, processes, relationships, or definitions.
        4. Use 6-12 nodes maximum for clarity.
        5. DO NOT use emojis or special characters (e.g., α, β, ∑, ₹, etc.). Use plain English words like "alpha", "beta", etc.
        6. DO NOT use numbers. Use plain english words like "one", "two", etc.

        Topic:
        ${topic}`,
  },
  {
    label: "Summarize This",
    icon: "📋",
    prompt: (topic: string) =>
      `Write a comprehensive summary of '${topic}' covering key points, important concepts, and practical applications. Use markdown format with proper headings.`,
  },
  {
    label: "Explain Simply",
    icon: "💡",
    prompt: (topic: string) =>
      `Explain '${topic}' in simple terms that a beginner can understand. Use analogies and examples where helpful.`,
  },
  {
    label: "Key Facts",
    icon: "🔑",
    prompt: (topic: string) =>
      `List the most important facts and key points about '${topic}' in bullet format.`,
  },
  {
    label: "Study Guide",
    icon: "📚",
    prompt: (topic: string) =>
      `Create a comprehensive study guide for '${topic}' with main concepts, definitions, and study tips.`,
  },
];
