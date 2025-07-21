"use client";
import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  CheckCircle,
  XCircle,
  Loader2,
  Trophy,
  RefreshCw,
  ArrowLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";

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

interface QuizResult {
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  timeTaken: number;
  answers: number[];
}

export default function QuizPage() {
  const { topic: topicId } = useParams();
  const router = useRouter();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [topicName, setTopicName] = useState("Loading...");
  const [topicLoading, setTopicLoading] = useState(true);

  const handleFinishQuiz = () => {
    router.push(`/dashboard/chat/${topicId}?quiz=true`);
  };

  // Fetch topic data
  useEffect(() => {
    const fetchTopic = async () => {
      try {
        const response = await fetch(`/api/topics/${topicId}`);
        if (response.ok) {
          const data = await response.json();
          setTopicName(data.topic.title);
        } else {
          setTopicName("Unknown Topic");
        }
      } catch (error) {
        console.error("Error fetching topic:", error);
        setTopicName("Unknown Topic");
      } finally {
        setTopicLoading(false);
      }
    };

    if (topicId) {
      fetchTopic();
    }
  }, [topicId]);

  const generateQuiz = useCallback(async () => {
    setGenerating(true);
    setError(null);

    try {
      const response = await fetch("/api/quiz/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: topicName }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate quiz");
      }

      const data = await response.json();
      setQuiz(data.quiz);
      setLoading(false);
      setGenerating(false);
    } catch {
      setError("Failed to generate quiz. Please try again.");
      setGenerating(false);
      setLoading(false);
    }
  }, [topicName]);

  useEffect(() => {
    if (!topicLoading && topicName !== "Loading...") {
      generateQuiz();
    }
  }, [topicName, topicLoading, generateQuiz]);

  const startQuiz = () => {
    setStartTime(new Date());
    setCurrentQuestion(0);
    setUserAnswers([]);
    setQuizResult(null);
  };

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
  };

  const handleNextQuestion = () => {
    if (selectedAnswer === null) return;

    const newAnswers = [...userAnswers];
    newAnswers[currentQuestion] = selectedAnswer;
    setUserAnswers(newAnswers);

    if (currentQuestion < (quiz?.questions.length || 0) - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
    } else {
      // Quiz completed
      finishQuiz(newAnswers);
    }
  };

  const finishQuiz = (answers: number[]) => {
    if (!quiz || !startTime) return;

    const endTime = new Date();
    const timeTaken = (endTime.getTime() - startTime.getTime()) / 1000; // seconds

    let correctCount = 0;
    quiz.questions.forEach((question, index) => {
      if (answers[index] === question.correctAnswer) {
        correctCount++;
      }
    });

    const result: QuizResult = {
      score: Math.round((correctCount / quiz.questions.length) * 100),
      totalQuestions: quiz.questions.length,
      correctAnswers: correctCount,
      timeTaken,
      answers,
    };

    setQuizResult(result);
    // TODO: Save result to database
  };

  const retakeQuiz = () => {
    setQuizResult(null);
    setCurrentQuestion(0);
    setUserAnswers([]);
    setSelectedAnswer(null);
    startQuiz();
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin mb-4" />
        <p className="text-muted-foreground">Loading quiz...</p>
      </div>
    );
  }

  if (generating) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin mb-4" />
        <p className="text-muted-foreground">
          Generating quiz for {topicName}...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-center">
          <XCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Error</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={generateQuiz}>Try Again</Button>
        </div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">No Quiz Available</h2>
          <p className="text-muted-foreground mb-4">
            Failed to load quiz for {topicName}
          </p>
          <Button onClick={generateQuiz}>Generate Quiz</Button>
        </div>
      </div>
    );
  }

  if (quizResult) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" onClick={handleFinishQuiz}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Chat
          </Button>
        </div>

        <Card className="text-center">
          <CardHeader>
            <div className="flex justify-center mb-4">
              {quizResult.score >= 80 ? (
                <Trophy className="w-16 h-16 text-yellow-500" />
              ) : quizResult.score >= 60 ? (
                <CheckCircle className="w-16 h-16 text-green-500" />
              ) : (
                <XCircle className="w-16 h-16 text-red-500" />
              )}
            </div>
            <CardTitle className="text-2xl">Quiz Complete!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-4xl font-bold text-primary">
              {quizResult.score}%
            </div>
            <div className="text-muted-foreground">
              {quizResult.correctAnswers} out of {quizResult.totalQuestions}{" "}
              correct
            </div>
            <div className="text-sm text-muted-foreground">
              Time taken: {Math.round(quizResult.timeTaken)} seconds
            </div>

            <div className="flex gap-2 justify-center mt-6">
              <Button onClick={retakeQuiz} className="gap-2">
                <RefreshCw className="w-4 h-4" />
                Retake Quiz
              </Button>
              <Button variant="outline" onClick={handleFinishQuiz}>
                Back to Chat
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentQ = quiz.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100;

  return (
    <div className="max-w-4xl mx-auto px-4 py-20">
      <div className="flex items-center justify-between mb-6">
        <Button variant="outline" onClick={handleFinishQuiz}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Chat
        </Button>
        <div className="text-sm text-muted-foreground">
          Question {currentQuestion + 1} of {quiz.questions.length}
        </div>
      </div>

      <div className="mb-4">
        <Progress value={progress} className="h-2" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{currentQ.question}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {currentQ.options.map((option, index) => (
            <Button
              key={index}
              variant={selectedAnswer === index ? "default" : "outline"}
              className={cn(
                "w-full justify-start text-left h-auto p-4",
                selectedAnswer === index && "bg-primary text-primary-foreground"
              )}
              onClick={() => handleAnswerSelect(index)}
            >
              <span className="mr-3 font-medium">
                {String.fromCharCode(65 + index)}.
              </span>
              {option}
            </Button>
          ))}

          {selectedAnswer !== null && (
            <div className="mt-4 p-4 bg-muted rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                {selectedAnswer === currentQ.correctAnswer ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-500" />
                )}
                <span className="font-medium">
                  {selectedAnswer === currentQ.correctAnswer
                    ? "Correct!"
                    : "Incorrect"}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                {currentQ.explanation}
              </p>
            </div>
          )}

          <div className="flex justify-end mt-6">
            <Button
              onClick={handleNextQuestion}
              disabled={selectedAnswer === null}
              className="gap-2"
            >
              {currentQuestion === quiz.questions.length - 1
                ? "Finish Quiz"
                : "Next Question"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
