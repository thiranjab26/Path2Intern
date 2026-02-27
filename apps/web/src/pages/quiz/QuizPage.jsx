import { useEffect, useState, useRef } from "react";
import { api } from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";

const MODULES = [
    { code: "DS", label: "Data Science" },
    { code: "SE", label: "Software Engineering" },
    { code: "QA", label: "Quality Assurance" },
    { code: "BA", label: "Business Analysis" },
    { code: "PM", label: "Project Management" },
];

const MODULE_COLORS = {
    DS: { bg: "bg-violet-600", light: "bg-violet-50", border: "border-violet-200", text: "text-violet-700", btn: "bg-violet-600 hover:bg-violet-700" },
    SE: { bg: "bg-blue-600", light: "bg-blue-50", border: "border-blue-200", text: "text-blue-700", btn: "bg-blue-600 hover:bg-blue-700" },
    QA: { bg: "bg-green-600", light: "bg-green-50", border: "border-green-200", text: "text-green-700", btn: "bg-green-600 hover:bg-green-700" },
    BA: { bg: "bg-amber-500", light: "bg-amber-50", border: "border-amber-200", text: "text-amber-700", btn: "bg-amber-500 hover:bg-amber-600" },
    PM: { bg: "bg-pink-600", light: "bg-pink-50", border: "border-pink-200", text: "text-pink-700", btn: "bg-pink-600 hover:bg-pink-700" },
};

export default function QuizPage() {
    const { user } = useAuth();
    const [selectedModule, setSelectedModule] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Quiz state
    const [quizStarted, setQuizStarted] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [chosen, setChosen] = useState(null);       // null | "A" | "B" | "C" | "D"
    const [revealed, setRevealed] = useState(false);  // answer shown?
    const [score, setScore] = useState(0);
    const [finished, setFinished] = useState(false);
    const [answers, setAnswers] = useState([]);       // [{chosen, correct, isCorrect}]

    const fetchQuestions = async (code) => {
        setLoading(true);
        setError("");
        try {
            const res = await api.get(`/api/module/questions/${code}/approved`);
            const qs = res.data.questions || [];
            // Shuffle
            setQuestions(qs.sort(() => Math.random() - 0.5));
        } catch {
            setError("Could not load questions for this module.");
        } finally {
            setLoading(false);
        }
    };

    const startQuiz = (code) => {
        setSelectedModule(code);
        setQuizStarted(false);
        setFinished(false);
        setScore(0);
        setAnswers([]);
        setCurrentIndex(0);
        setChosen(null);
        setRevealed(false);
        fetchQuestions(code);
    };

    const beginQuiz = () => {
        if (questions.length === 0) return;
        setQuizStarted(true);
        setCurrentIndex(0);
        setChosen(null);
        setRevealed(false);
        setScore(0);
        setAnswers([]);
        setFinished(false);
    };

    const checkAnswer = () => {
        if (!chosen) return;
        setRevealed(true);
    };

    const next = () => {
        const q = questions[currentIndex];
        const isCorrect = chosen === q.correctOption;
        const newAnswers = [...answers, { chosen, correct: q.correctOption, isCorrect }];
        setAnswers(newAnswers);
        if (isCorrect) setScore((s) => s + 1);

        if (currentIndex + 1 >= questions.length) {
            setFinished(true);
        } else {
            setCurrentIndex((i) => i + 1);
            setChosen(null);
            setRevealed(false);
        }
    };

    const restart = () => {
        setQuizStarted(false);
        setFinished(false);
        setChosen(null);
        setRevealed(false);
        setScore(0);
        setAnswers([]);
        setCurrentIndex(0);
        // Re-shuffle
        setQuestions((qs) => [...qs].sort(() => Math.random() - 0.5));
    };

    const c = selectedModule ? MODULE_COLORS[selectedModule] : null;
    const q = quizStarted && !finished ? questions[currentIndex] : null;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-10 shadow-md">
                <div className="max-w-4xl mx-auto">
                    <span className="bg-white/20 text-white text-xs font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider">
                        Quiz Mode
                    </span>
                    <h1 className="text-3xl font-bold text-white mt-2">Take a Quiz</h1>
                    <p className="text-blue-100 mt-1 text-sm">
                        Test your knowledge. Each quiz uses the live question bank for that module.
                    </p>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* Module selector */}
                {!selectedModule && (
                    <>
                        <h2 className="text-base font-semibold text-gray-700 mb-5">Choose a Module</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {MODULES.map((m) => {
                                const mc = MODULE_COLORS[m.code];
                                return (
                                    <button
                                        key={m.code}
                                        onClick={() => startQuiz(m.code)}
                                        className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 p-6 text-left group"
                                    >
                                        <div className={`w-10 h-10 rounded-xl ${mc.bg} flex items-center justify-center text-white font-bold text-sm mb-3 group-hover:scale-105 transition-transform`}>
                                            {m.code}
                                        </div>
                                        <h3 className="font-semibold text-gray-900 text-sm">{m.label}</h3>
                                        <p className="text-xs text-gray-400 mt-1">Start quiz →</p>
                                    </button>
                                );
                            })}
                        </div>
                    </>
                )}

                {/* Loading */}
                {selectedModule && loading && (
                    <div className="text-center py-20 text-gray-500">Loading questions…</div>
                )}

                {/* Error */}
                {error && (
                    <div className="bg-red-50 text-red-700 rounded-xl px-4 py-3 text-sm mb-4 flex items-center gap-2">
                        <span>⚠</span> {error}
                    </div>
                )}

                {/* No questions */}
                {selectedModule && !loading && !error && questions.length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-gray-400 text-sm">No approved questions yet for this module.</p>
                        <button onClick={() => setSelectedModule(null)} className="mt-4 text-blue-600 text-sm hover:underline">← Choose another module</button>
                    </div>
                )}

                {/* Ready to start */}
                {selectedModule && !loading && !error && questions.length > 0 && !quizStarted && !finished && (
                    <div className={`${c.light} ${c.border} border rounded-2xl p-8 text-center max-w-md mx-auto`}>
                        <div className={`w-16 h-16 ${c.bg} rounded-2xl flex items-center justify-center text-white font-bold text-xl mx-auto mb-4`}>
                            {selectedModule}
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 mb-1">{MODULES.find(m => m.code === selectedModule)?.label}</h2>
                        <p className={`text-sm ${c.text} font-medium mb-1`}>{questions.length} questions</p>
                        <p className="text-xs text-gray-400 mb-6">Questions are randomised every time.</p>
                        <div className="flex gap-3 justify-center">
                            <button onClick={beginQuiz} className={`${c.btn} text-white px-6 py-2.5 rounded-xl text-sm font-medium transition-colors`}>
                                Start Quiz
                            </button>
                            <button onClick={() => setSelectedModule(null)} className="border border-gray-200 text-gray-600 px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors">
                                Back
                            </button>
                        </div>
                    </div>
                )}

                {/* Quiz in progress */}
                {quizStarted && !finished && q && (
                    <div className="max-w-2xl mx-auto">
                        {/* Progress */}
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-sm text-gray-500">Question {currentIndex + 1} of {questions.length}</span>
                            <span className={`text-sm font-semibold ${c.text}`}>Score: {score}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5 mb-6">
                            <div className={`${c.bg} h-1.5 rounded-full transition-all duration-300`} style={{ width: `${((currentIndex) / questions.length) * 100}%` }} />
                        </div>

                        {/* Question card */}
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-4">
                            <p className="text-gray-900 font-medium text-base leading-relaxed mb-6">{q.questionText}</p>

                            <div className="space-y-3">
                                {q.options.map((opt) => {
                                    let optClass = "border border-gray-200 text-gray-700 hover:border-gray-400";
                                    if (revealed) {
                                        if (opt.label === q.correctOption) optClass = "border-2 border-green-500 bg-green-50 text-green-800";
                                        else if (opt.label === chosen && chosen !== q.correctOption) optClass = "border-2 border-red-400 bg-red-50 text-red-700";
                                    } else if (chosen === opt.label) {
                                        optClass = `border-2 ${c.border} ${c.light} ${c.text}`;
                                    }
                                    return (
                                        <button
                                            key={opt.label}
                                            disabled={revealed}
                                            onClick={() => setChosen(opt.label)}
                                            className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all flex items-center gap-3 ${optClass} ${revealed ? "cursor-default" : "cursor-pointer"}`}
                                        >
                                            <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 ${revealed && opt.label === q.correctOption ? "bg-green-500 text-white" : revealed && opt.label === chosen ? "bg-red-400 text-white" : "bg-gray-100 text-gray-600"}`}>{opt.label}</span>
                                            {opt.text}
                                        </button>
                                    );
                                })}
                            </div>

                            {revealed && q.explanation && (
                                <div className="mt-4 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 text-sm text-blue-700">
                                    <span className="font-semibold">Explanation:</span> {q.explanation}
                                </div>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3 justify-end">
                            {!revealed ? (
                                <button disabled={!chosen} onClick={checkAnswer} className={`${chosen ? `${c.btn} text-white` : "bg-gray-200 text-gray-400 cursor-not-allowed"} px-6 py-2.5 rounded-xl text-sm font-medium transition-colors`}>
                                    Check Answer
                                </button>
                            ) : (
                                <button onClick={next} className={`${c.btn} text-white px-6 py-2.5 rounded-xl text-sm font-medium transition-colors`}>
                                    {currentIndex + 1 < questions.length ? "Next →" : "Finish Quiz"}
                                </button>
                            )}
                        </div>
                    </div>
                )}

                {/* Finished */}
                {finished && (
                    <div className="max-w-md mx-auto text-center">
                        <div className={`${c.light} ${c.border} border rounded-2xl p-8`}>
                            <div className="text-5xl mb-4">{score === questions.length ? "🏆" : score >= questions.length * 0.7 ? "🎉" : score >= questions.length * 0.5 ? "👍" : "📚"}</div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-1">Quiz Complete!</h2>
                            <p className={`text-4xl font-bold ${c.text} my-3`}>{score} / {questions.length}</p>
                            <p className="text-sm text-gray-500 mb-6">
                                {score === questions.length ? "Perfect score! 🎯" : score >= questions.length * 0.7 ? "Great job!" : score >= questions.length * 0.5 ? "Keep practising!" : "Review this module and try again."}
                            </p>
                            <div className="flex gap-3 justify-center">
                                <button onClick={restart} className={`${c.btn} text-white px-5 py-2.5 rounded-xl text-sm font-medium`}>
                                    Retake Quiz
                                </button>
                                <button onClick={() => setSelectedModule(null)} className="border border-gray-200 text-gray-600 px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors">
                                    Other Module
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
