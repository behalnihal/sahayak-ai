"use client";

import { useState, useEffect, useCallback, useRef } from "react";
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
  Clock,
  Target,
  BarChart3,
  Percent,
  CircleDot,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { DashboardShell, Surface } from "@/components/dashboard/DashboardShell";

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
  incorrectAnswers: number;
  timeTaken: number;
  answers: number[];
  grade: string;
  avgSecondsPerQuestion: number;
}

function getGrade(score: number) {
  if (score >= 90) return { label: "A", message: "Excellent mastery" };
  if (score >= 80) return { label: "B", message: "Strong understanding" };
  if (score >= 70) return { label: "C", message: "Good progress" };
  if (score >= 60) return { label: "D", message: "Needs more review" };
  return { label: "F", message: "Keep practicing" };
}

function formatDuration(seconds: number) {
  const s = Math.max(0, Math.round(seconds));
  const m = Math.floor(s / 60);
  const rem = s % 60;
  if (m <= 0) return `${rem}s`;
  return `${m}m ${rem}s`;
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
  const [error, setError] = useState<string | null>(null);

  const [topicName, setTopicName] = useState("Loading...");
  const [topicLoading, setTopicLoading] = useState(true);

  // Use ref so finishQuiz always has a valid start even if state is stale
  const startTimeRef = useRef<number | null>(null);

  const goBackToChat = () => {
    router.push(`/dashboard/chat/${topicId}`);
  };

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
      } catch (err) {
        console.error("Error fetching topic:", err);
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
    setQuizResult(null);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setUserAnswers([]);

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
      startTimeRef.current = Date.now();
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

  const handleAnswerSelect = (answerIndex: number) => {
    // Start timer on first interaction if missing
    if (startTimeRef.current === null) {
      startTimeRef.current = Date.now();
    }
    setSelectedAnswer(answerIndex);
  };

  const finishQuiz = (answers: number[]) => {
    if (!quiz) return;

    const started = startTimeRef.current ?? Date.now();
    const timeTaken = (Date.now() - started) / 1000;

    let correctCount = 0;
    quiz.questions.forEach((question, index) => {
      if (answers[index] === question.correctAnswer) {
        correctCount++;
      }
    });

    const total = quiz.questions.length;
    const score = Math.round((correctCount / total) * 100);
    const incorrectAnswers = total - correctCount;

    setQuizResult({
      score,
      totalQuestions: total,
      correctAnswers: correctCount,
      incorrectAnswers,
      timeTaken,
      answers,
      grade: getGrade(score).label,
      avgSecondsPerQuestion: timeTaken / total,
    });
  };

  const handleNextQuestion = () => {
    if (selectedAnswer === null || !quiz) return;

    const newAnswers = [...userAnswers];
    newAnswers[currentQuestion] = selectedAnswer;
    setUserAnswers(newAnswers);

    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
    } else {
      finishQuiz(newAnswers);
    }
  };

  const retakeQuiz = () => {
    setQuizResult(null);
    setCurrentQuestion(0);
    setUserAnswers([]);
    setSelectedAnswer(null);
    startTimeRef.current = Date.now();
  };

  if (loading || generating) {
    return (
      <DashboardShell size="md">
        <div className="flex h-64 flex-col items-center justify-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            {generating
              ? `Generating quiz for ${topicName}…`
              : "Loading quiz…"}
          </p>
        </div>
      </DashboardShell>
    );
  }

  if (error) {
    return (
      <DashboardShell size="md">
        <div className="flex flex-col items-center py-16 text-center">
          <XCircle className="mb-4 h-12 w-12 text-destructive" />
          <h2 className="mb-2 text-xl font-semibold">Error</h2>
          <p className="mb-4 text-sm text-muted-foreground">{error}</p>
          <div className="flex gap-2">
            <Button variant="outline" onClick={goBackToChat}>
              Back to chat
            </Button>
            <Button onClick={generateQuiz}>Try again</Button>
          </div>
        </div>
      </DashboardShell>
    );
  }

  if (!quiz) {
    return (
      <DashboardShell size="md">
        <div className="flex flex-col items-center py-16 text-center">
          <h2 className="mb-2 text-xl font-semibold">No quiz available</h2>
          <p className="mb-4 text-sm text-muted-foreground">
            Failed to load quiz for {topicName}
          </p>
          <Button onClick={generateQuiz}>Generate quiz</Button>
        </div>
      </DashboardShell>
    );
  }

  // ── Results / analytics ──────────────────────────────────────────
  if (quizResult) {
    const gradeInfo = getGrade(quizResult.score);
    const accuracy =
      quizResult.totalQuestions > 0
        ? Math.round(
            (quizResult.correctAnswers / quizResult.totalQuestions) * 100
          )
        : 0;

    return (
      <DashboardShell size="lg">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <Button variant="outline" size="sm" onClick={goBackToChat}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to chat
          </Button>
          <p className="text-sm text-muted-foreground">
            Results · {topicName}
          </p>
        </div>

        {/* Hero score card */}
        <Card className="mb-6 border-border/60 text-center shadow-sm">
          <CardHeader className="pb-2">
            <div className="mb-3 flex justify-center">
              {quizResult.score >= 80 ? (
                <Trophy className="h-14 w-14 text-yellow-500" />
              ) : quizResult.score >= 60 ? (
                <CheckCircle className="h-14 w-14 text-emerald-500" />
              ) : (
                <XCircle className="h-14 w-14 text-red-500" />
              )}
            </div>
            <CardTitle className="text-2xl">Quiz complete</CardTitle>
            <p className="text-sm text-muted-foreground">{gradeInfo.message}</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="text-5xl font-bold tracking-tight text-primary">
                {quizResult.score}%
              </div>
              <div className="mt-1 text-sm text-muted-foreground">
                Grade {gradeInfo.label}
              </div>
            </div>

            <div className="mx-auto max-w-md">
              <div className="mb-1.5 flex justify-between text-xs text-muted-foreground">
                <span>Accuracy</span>
                <span>{accuracy}%</span>
              </div>
              <Progress value={accuracy} className="h-2.5" />
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <Surface className="px-3 py-3 text-left">
                <div className="mb-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Target className="h-3.5 w-3.5" />
                  Correct
                </div>
                <p className="text-xl font-semibold tabular-nums text-emerald-500">
                  {quizResult.correctAnswers}
                </p>
              </Surface>
              <Surface className="px-3 py-3 text-left">
                <div className="mb-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <XCircle className="h-3.5 w-3.5" />
                  Incorrect
                </div>
                <p className="text-xl font-semibold tabular-nums text-red-500">
                  {quizResult.incorrectAnswers}
                </p>
              </Surface>
              <Surface className="px-3 py-3 text-left">
                <div className="mb-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Clock className="h-3.5 w-3.5" />
                  Time
                </div>
                <p className="text-xl font-semibold tabular-nums">
                  {formatDuration(quizResult.timeTaken)}
                </p>
              </Surface>
              <Surface className="px-3 py-3 text-left">
                <div className="mb-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Percent className="h-3.5 w-3.5" />
                  Avg / Q
                </div>
                <p className="text-xl font-semibold tabular-nums">
                  {formatDuration(quizResult.avgSecondsPerQuestion)}
                </p>
              </Surface>
            </div>

            <div className="flex flex-wrap justify-center gap-2">
              <Button onClick={retakeQuiz} className="gap-2">
                <RefreshCw className="h-4 w-4" />
                Retake quiz
              </Button>
              <Button variant="outline" onClick={generateQuiz} className="gap-2">
                <BarChart3 className="h-4 w-4" />
                New questions
              </Button>
              <Button variant="secondary" onClick={goBackToChat}>
                Back to chat
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Per-question review */}
        <div className="mb-3 flex items-center gap-2">
          <CircleDot className="h-4 w-4 text-muted-foreground" />
          <h2 className="text-lg font-semibold tracking-tight">
            Question review
          </h2>
        </div>
        <div className="space-y-3">
          {quiz.questions.map((q, index) => {
            const userAnswer = quizResult.answers[index];
            const isCorrect = userAnswer === q.correctAnswer;
            const answered =
              typeof userAnswer === "number" && !Number.isNaN(userAnswer);

            return (
              <Surface key={index} className="overflow-hidden p-0">
                <div
                  className={cn(
                    "flex items-start gap-3 border-l-4 px-4 py-4",
                    isCorrect
                      ? "border-l-emerald-500"
                      : "border-l-red-500"
                  )}
                >
                  <div
                    className={cn(
                      "mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
                      isCorrect
                        ? "bg-emerald-500/15 text-emerald-500"
                        : "bg-red-500/15 text-red-500"
                    )}
                  >
                    {index + 1}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <p className="font-medium leading-snug">{q.question}</p>
                      {isCorrect ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-500">
                          <CheckCircle className="h-3 w-3" />
                          Correct
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-red-500/10 px-2 py-0.5 text-[11px] font-medium text-red-500">
                          <XCircle className="h-3 w-3" />
                          Incorrect
                        </span>
                      )}
                    </div>

                    <div className="space-y-1.5 text-sm">
                      {answered && (
                        <p
                          className={cn(
                            isCorrect
                              ? "text-emerald-600 dark:text-emerald-400"
                              : "text-red-600 dark:text-red-400"
                          )}
                        >
                          <span className="text-muted-foreground">
                            Your answer:{" "}
                          </span>
                          {String.fromCharCode(65 + userAnswer)}.{" "}
                          {q.options[userAnswer]}
                        </p>
                      )}
                      {!isCorrect && (
                        <p className="text-emerald-600 dark:text-emerald-400">
                          <span className="text-muted-foreground">
                            Correct answer:{" "}
                          </span>
                          {String.fromCharCode(65 + q.correctAnswer)}.{" "}
                          {q.options[q.correctAnswer]}
                        </p>
                      )}
                      <p className="text-muted-foreground">
                        <span className="font-medium text-foreground/80">
                          Why:{" "}
                        </span>
                        {q.explanation}
                      </p>
                    </div>
                  </div>
                </div>
              </Surface>
            );
          })}
        </div>
      </DashboardShell>
    );
  }

  // ── Active quiz ──────────────────────────────────────────────────
  const currentQ = quiz.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100;
  const isLast = currentQuestion === quiz.questions.length - 1;

  return (
    <DashboardShell size="lg">
      <div className="mb-6 flex items-center justify-between gap-3">
        <Button variant="outline" size="sm" onClick={goBackToChat}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to chat
        </Button>
        <div className="text-sm text-muted-foreground">
          Question {currentQuestion + 1} of {quiz.questions.length}
        </div>
      </div>

      <div className="mb-2">
        <div className="mb-1.5 flex justify-between text-xs text-muted-foreground">
          <span>{topicName}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <Card className="mt-4 border-border/60 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg leading-snug">
            {currentQ.question}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {currentQ.options.map((option, index) => (
            <Button
              key={index}
              variant={selectedAnswer === index ? "default" : "outline"}
              className={cn(
                "h-auto w-full justify-start whitespace-normal p-4 text-left",
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
            <div className="mt-4 rounded-lg bg-muted p-4">
              <div className="mb-2 flex items-center gap-2">
                {selectedAnswer === currentQ.correctAnswer ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-500" />
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

          <div className="mt-6 flex justify-end">
            <Button
              onClick={handleNextQuestion}
              disabled={selectedAnswer === null}
              className="gap-2"
            >
              {isLast ? (
                <>
                  <BarChart3 className="h-4 w-4" />
                  Finish quiz
                </>
              ) : (
                "Next question"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </DashboardShell>
  );
}
