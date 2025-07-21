# Sahayak AI

Sahayak AI is a modern, minimalistic platform designed to help you learn and retain information more effectively. Upload your YouTube videos or PDF notes to generate instant summaries, mind maps, quizzes, and more—powered by AI.

## Features

- Mindmap Generator: Visualize complex topics as interactive mind maps
- MCQ Generator: Create and take quizzes to test your understanding
- Summary Generator: Get concise summaries from your notes or videos
- LLM-powered Chat: Ask questions and get explanations for any topic
- Dashboard: Organize and manage your learning topics
- Prebuilt Prompts: Mindmap, quiz, summary, study guide, and more
- Dark/Light Mode: Theme toggle for comfortable viewing
- Modern UI: Responsive, clean, and accessible design

## Tech Stack

- Next.js, TypeScript, Tailwind CSS
- MongoDB (database)
- Clerk (authentication)
- Google Gemini AI (LLM)
- Mermaid.js (mindmap visualization)

## Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/behalnihal/sahayak-ai.git
   cd sahayak-ai
   ```
2. **Install dependencies**
   ```bash
   npm install
   ```
3. **Configure environment variables**
   - Create a `.env.local` file in the root directory:
     ```env
     NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
     CLERK_SECRET_KEY=your_clerk_secret_key
     SIGNIN_SECRET=your_clerk_webhook_secret
     MONGODB_URI=your_mongodb_connection_string
     GEMINI_API_KEY=your_gemini_api_key
     ```
   - See `SETUP.md` for detailed provider setup instructions.
4. **Run the development server**
   ```bash
   npm run dev
   ```

## Usage

- Sign up or log in with Google/GitHub
- Create a new topic and upload your YouTube video link or PDF notes
- Use the dashboard to access mindmaps, summaries, quizzes, and chat
- Take quizzes and track your progress

## API Endpoints

- `GET /api/topics` - Get user's topics
- `POST /api/topics` - Create new topic
- `GET /api/topics/[id]` - Get specific topic
- `DELETE /api/topics/[id]` - Delete topic
- `POST /api/response` - Generate AI response
- `POST /api/quiz/generate` - Generate quiz
- `POST /api/webhooks` - Clerk webhook handler

## License

GPL-3.0
