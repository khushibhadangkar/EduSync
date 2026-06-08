"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SAMPLE_TEST } from "@/lib/data";
import { formatTime } from "@/lib/utils";

type TestPhase = "start" | "running" | "finished";

interface TestState {
  phase: TestPhase;
  current: number;
  answers: (number | undefined)[];
  timeLeft: number;
}

export default function TestsTab() {
  const [state, setState] = useState<TestState>({
    phase: "start",
    current: 0,
    answers: [],
    timeLeft: SAMPLE_TEST.duration,
  });
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Timer countdown
  useEffect(() => {
    if (state.phase !== "running") {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }
    timerRef.current = setInterval(() => {
      setState((prev) => {
        if (prev.timeLeft <= 1) {
          clearInterval(timerRef.current!);
          return { ...prev, timeLeft: 0, phase: "finished" };
        }
        return { ...prev, timeLeft: prev.timeLeft - 1 };
      });
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.phase]);

  function startTest() {
    setState({
      phase: "running",
      current: 0,
      answers: [],
      timeLeft: SAMPLE_TEST.duration,
    });
  }

  function selectAnswer(qIdx: number, optIdx: number) {
    setState((prev) => {
      const answers = [...prev.answers];
      answers[qIdx] = optIdx;
      return { ...prev, answers };
    });
  }

  function nextQ() {
    setState((prev) => ({
      ...prev,
      current: Math.min(prev.current + 1, SAMPLE_TEST.questions.length - 1),
    }));
  }

  function prevQ() {
    setState((prev) => ({
      ...prev,
      current: Math.max(prev.current - 1, 0),
    }));
  }

  function submitTest() {
    if (timerRef.current) clearInterval(timerRef.current);
    setState((prev) => ({ ...prev, phase: "finished" }));
  }

  function downloadReport() {
    const lines: string[] = ["Report Card", `Score: ${getScore().correct} / ${SAMPLE_TEST.questions.length} (${getScore().percent}%)`];
    lines.push(`Test: ${SAMPLE_TEST.title}`);
    lines.push(`Teacher: ${SAMPLE_TEST.teacher}`);
    SAMPLE_TEST.questions.forEach((q, i) => {
      const userAns = state.answers[i];
      const isCorrect = userAns === q.answer;
      lines.push(`Q${i + 1}: ${q.q}`);
      lines.push(`  Your answer: ${userAns !== undefined ? q.options[userAns] : "No answer"} ${isCorrect ? "(Correct)" : "(Incorrect)"}`);
      lines.push(`  Correct answer: ${q.options[q.answer]}`);
    });
    const blob = new Blob([lines.join("\n")], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "ReportCard.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  function getScore() {
    const correct = SAMPLE_TEST.questions.filter(
      (q, i) => state.answers[i] === q.answer
    ).length;
    const total = SAMPLE_TEST.questions.length;
    const percent = Math.round((correct / total) * 100);
    const passed = percent >= 40;
    const grade =
      percent >= 90 ? "A" : percent >= 75 ? "B" : percent >= 60 ? "C" : percent >= 40 ? "D" : "F";
    return { correct, total, percent, passed, grade };
  }

  const progress = Math.round(
    ((state.current + 1) / SAMPLE_TEST.questions.length) * 100
  );
  const allAnswered = state.answers.filter((a) => a !== undefined).length === SAMPLE_TEST.questions.length;

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6" style={{ color: "var(--text-base)" }}>
        MCQ Test
      </h1>

      <div
        className="rounded-xl overflow-hidden"
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
        }}
      >
        <AnimatePresence mode="wait">
          {state.phase === "start" && (
            <motion.div
              key="start"
              className="flex items-center justify-center p-8 min-h-[400px]"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.25 }}
            >
              <div
                className="w-full max-w-[480px] rounded-2xl p-12 flex flex-col items-center text-center"
                style={{
                  background: "var(--bg-card)",
                  boxShadow: "0 4px 24px rgba(67,97,238,0.10)",
                }}
              >
                <h2
                  className="text-2xl font-extrabold mb-4"
                  style={{ color: "var(--primary)" }}
                >
                  {SAMPLE_TEST.title}
                </h2>
                <div
                  className="flex items-center gap-2 text-lg font-semibold mb-3"
                  style={{ color: "var(--primary)" }}
                >
                  <i className="fas fa-clock" aria-hidden="true" />
                  {formatTime(SAMPLE_TEST.duration)}
                </div>
                <p className="mb-8 text-sm" style={{ color: "var(--text-muted)" }}>
                  Teacher: <strong>{SAMPLE_TEST.teacher}</strong>
                </p>
                <button
                  className="w-full py-4 rounded-xl text-lg font-bold text-white transition-all hover:opacity-90 hover:-translate-y-0.5"
                  style={{ background: "var(--primary)" }}
                  onClick={startTest}
                >
                  Start Test
                </button>
              </div>
            </motion.div>
          )}

          {state.phase === "running" && (
            <motion.div
              key="running"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              {/* Meta row */}
              <div
                className="flex items-center gap-4 px-6 pt-6 pb-4 border-b flex-wrap"
                style={{ borderColor: "var(--border)" }}
              >
                <span className="font-bold text-sm" style={{ color: "var(--primary)" }}>
                  {SAMPLE_TEST.title}
                </span>
                <div className="flex-1 min-w-[120px]">
                  <div
                    className="h-2 rounded-full overflow-hidden"
                    style={{ background: "var(--bg-muted)" }}
                    role="progressbar"
                    aria-valuenow={progress}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label="Test progress"
                  >
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: "var(--primary)" }}
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </div>
                <div
                  className="flex items-center gap-2 font-semibold text-sm"
                  style={{
                    color: state.timeLeft <= 30 ? "var(--danger)" : "var(--primary)",
                  }}
                  aria-live="polite"
                  aria-label={`Time remaining: ${formatTime(state.timeLeft)}`}
                >
                  <i className="fas fa-clock" aria-hidden="true" />
                  {formatTime(state.timeLeft)}
                </div>
              </div>

              {/* Question */}
              <div className="px-6 py-6">
                <p className="font-semibold text-sm mb-1" style={{ color: "var(--text-muted)" }}>
                  Question {state.current + 1} of {SAMPLE_TEST.questions.length}
                </p>
                <p className="text-base font-medium mb-6" style={{ color: "var(--text-base)" }}>
                  {SAMPLE_TEST.questions[state.current].q}
                </p>

                {/* Options */}
                <div className="flex flex-col gap-3 mb-6" role="radiogroup" aria-label="Answer options">
                  {SAMPLE_TEST.questions[state.current].options.map((opt, j) => {
                    const selected = state.answers[state.current] === j;
                    return (
                      <label
                        key={j}
                        className="flex items-center gap-3 p-3.5 rounded-xl cursor-pointer transition-all"
                        style={{
                          border: selected
                            ? "2px solid var(--primary)"
                            : "1.5px solid var(--border)",
                          background: selected
                            ? "color-mix(in srgb, var(--primary) 8%, transparent)"
                            : "var(--bg-subtle)",
                          boxShadow: selected
                            ? "0 2px 8px rgba(67,97,238,0.1)"
                            : undefined,
                        }}
                      >
                        <input
                          type="radio"
                          name={`q${state.current}`}
                          value={j}
                          checked={selected}
                          onChange={() => selectAnswer(state.current, j)}
                          className="accent-[var(--primary)]"
                          aria-label={`Option ${j + 1}: ${opt}`}
                        />
                        <span style={{ color: "var(--text-base)" }}>{opt}</span>
                      </label>
                    );
                  })}
                </div>

                {/* Navigation */}
                <div className="flex items-center justify-center gap-4 flex-wrap">
                  <button
                    className="px-7 py-3 rounded-lg font-semibold text-white transition-all hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
                    style={{ background: "var(--primary)" }}
                    onClick={prevQ}
                    disabled={state.current === 0}
                    aria-label="Previous question"
                  >
                    Previous
                  </button>
                  <button
                    className="px-7 py-3 rounded-lg font-semibold text-white transition-all hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
                    style={{ background: "var(--primary)" }}
                    onClick={nextQ}
                    disabled={state.current === SAMPLE_TEST.questions.length - 1}
                    aria-label="Next question"
                  >
                    Next
                  </button>
                  <button
                    className="px-7 py-3 rounded-lg font-semibold text-white transition-all hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
                    style={{ background: "var(--danger)" }}
                    onClick={submitTest}
                    disabled={!allAnswered}
                    aria-label="Finish and submit test"
                  >
                    Finish
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {state.phase === "finished" && (
            <motion.div
              key="finished"
              className="flex items-center justify-center p-8 min-h-[400px]"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <ResultCard
                score={getScore()}
                testTitle={SAMPLE_TEST.title}
                timeTaken={SAMPLE_TEST.duration - state.timeLeft}
                onDownload={downloadReport}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

interface ScoreData {
  correct: number;
  total: number;
  percent: number;
  passed: boolean;
  grade: string;
}

function ResultCard({
  score,
  testTitle,
  timeTaken,
  onDownload,
}: {
  score: ScoreData;
  testTitle: string;
  timeTaken: number;
  onDownload: () => void;
}) {
  const radius = 52;
  const circ = 2 * Math.PI * radius;
  const offset = circ * (1 - score.percent / 100);

  return (
    <div
      className="w-full max-w-sm rounded-2xl p-8 flex flex-col items-center text-center"
      style={{
        background: "var(--bg-card)",
        boxShadow: "0 4px 24px rgba(67,97,238,0.1)",
      }}
    >
      {/* Pass / Fail */}
      <div
        className="flex items-center gap-2 text-lg font-bold mb-4"
        style={{ color: score.passed ? "var(--primary)" : "var(--danger)" }}
      >
        <i
          className={`fas fa-${score.passed ? "check-circle" : "times-circle"}`}
          aria-hidden="true"
        />
        {score.passed ? "Test Passed" : "Test Failed"}
      </div>

      {/* SVG Score Ring */}
      <div className="relative w-[110px] h-[110px] mb-4 score-ring-container">
        <svg width="110" height="110" aria-hidden="true">
          <circle
            cx="55"
            cy="55"
            r={radius}
            fill="none"
            stroke="var(--bg-muted)"
            strokeWidth="10"
          />
          <motion.circle
            cx="55"
            cy="55"
            r={radius}
            fill="none"
            stroke="var(--primary)"
            strokeWidth="10"
            strokeDasharray={circ}
            initial={{ strokeDashoffset: circ }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          />
        </svg>
        <div
          className="absolute inset-0 flex items-center justify-center text-2xl font-bold"
          style={{ color: "var(--primary)" }}
          aria-label={`Score: ${score.percent}%`}
        >
          {score.percent}%
        </div>
      </div>

      <div
        className="text-base font-semibold mb-1"
        style={{ color: "var(--primary)" }}
      >
        Grade: {score.grade}
      </div>
      <div className="text-sm mb-1" style={{ color: "var(--text-muted)" }}>
        {testTitle}
      </div>
      <div className="text-sm mb-6" style={{ color: "var(--text-muted)" }}>
        Time Taken: {formatTime(timeTaken)}
      </div>

      <button
        className="w-full py-3 rounded-lg font-semibold text-white transition-all hover:opacity-90"
        style={{ background: "var(--primary)" }}
        onClick={onDownload}
      >
        Download Report Card
      </button>
    </div>
  );
}
