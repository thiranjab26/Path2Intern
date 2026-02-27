import { useEffect, useState } from "react";
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
    DS: { bg: "bg-violet-600", activeBg: "bg-violet-500/10", border: "border-violet-500/30", text: "text-violet-400", btn: "bg-violet-600 hover:bg-violet-700", correctBg: "bg-violet-500/20" },
    SE: { bg: "bg-blue-600", activeBg: "bg-blue-500/10", border: "border-blue-500/30", text: "text-blue-400", btn: "bg-blue-600 hover:bg-blue-700", correctBg: "bg-blue-500/20" },
    QA: { bg: "bg-green-600", activeBg: "bg-green-500/10", border: "border-green-500/30", text: "text-green-400", btn: "bg-green-600 hover:bg-green-700", correctBg: "bg-green-500/20" },
    BA: { bg: "bg-amber-500", activeBg: "bg-amber-500/10", border: "border-amber-500/30", text: "text-amber-400", btn: "bg-amber-500 hover:bg-amber-600", correctBg: "bg-amber-500/20" },
    PM: { bg: "bg-pink-600", activeBg: "bg-pink-500/10", border: "border-pink-500/30", text: "text-pink-400", btn: "bg-pink-600 hover:bg-pink-700", correctBg: "bg-pink-500/20" },
};

export default function QuizPage() {
    const { user } = useAuth();
    const [selectedModule, setSelectedModule] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [quizStarted, setQuizStarted] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [chosen, setChosen] = useState(null);
    const [revealed, setRevealed] = useState(false);
    const [score, setScore] = useState(0);
    const [finished, setFinished] = useState(false);
    const [answers, setAnswers] = useState([]);

    const fetchQuestions = async (code) => {
        setLoading(true); setError("");
        try {
            const res = await api.get(`/api/module/questions/${code}/approved`);
            setQuestions((res.data.questions || []).sort(() => Math.random() - 0.5));
        } catch { setError("Could not load questions for this module."); }
        finally { setLoading(false); }
    };

    const startQuiz = (code) => {
        setSelectedModule(code); setQuizStarted(false); setFinished(false);
        setScore(0); setAnswers([]); setCurrentIndex(0); setChosen(null); setRevealed(false);
        fetchQuestions(code);
    };

    const beginQuiz = () => {
        if (questions.length === 0) return;
        setQuizStarted(true); setCurrentIndex(0); setChosen(null); setRevealed(false); setScore(0); setAnswers([]); setFinished(false);
    };

    const checkAnswer = () => { if (!chosen) return; setRevealed(true); };

    const next = () => {
        const q = questions[currentIndex];
        const isCorrect = chosen === q.correctOption;
        const newAnswers = [...answers, { chosen, correct: q.correctOption, isCorrect }];
        setAnswers(newAnswers);
        if (isCorrect) setScore((s) => s + 1);
        if (currentIndex + 1 >= questions.length) { setFinished(true); }
        else { setCurrentIndex((i) => i + 1); setChosen(null); setRevealed(false); }
    };

    const restart = () => {
        setQuizStarted(false); setFinished(false); setChosen(null); setRevealed(false);
        setScore(0); setAnswers([]); setCurrentIndex(0);
        setQuestions((qs) => [...qs].sort(() => Math.random() - 0.5));
    };

    const c = selectedModule ? MODULE_COLORS[selectedModule] : null;
    const q = quizStarted && !finished ? questions[currentIndex] : null;

    return (
        <div className="min-h-screen bg-[#0a0f1e]">
            {/* Header */}
            <div className="border-b border-slate-800 px-8 py-8">
                <div className="max-w-4xl mx-auto">
                    <span className="bg-blue-500/20 text-blue-400 text-xs font-semibold px-2.5 py-1 rounded-full border border-blue-500/30 uppercase tracking-wider">Quiz Mode</span>
                    <h1 className="text-3xl font-bold text-white mt-2">Take a Quiz</h1>
                    <p className="text-slate-400 mt-1 text-sm">Test your knowledge. Each quiz uses the live question bank for that module.</p>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Module selector */}
                {!selectedModule && (
                    <>
                        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-5">Choose a Module</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {MODULES.map((m) => {
                                const mc = MODULE_COLORS[m.code];
                                return (
                                    <button key={m.code} onClick={() => startQuiz(m.code)}
                                        className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-left group hover:border-slate-700 hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200">
                                        <div className={`w-10 h-10 rounded-xl ${mc.bg} flex items-center justify-center text-white font-bold text-sm mb-3 group-hover:scale-105 transition-transform`}>{m.code}</div>
                                        <h3 className="font-semibold text-white text-sm">{m.label}</h3>
                                        <p className={`text-xs mt-1 ${mc.text}`}>Start quiz →</p>
                                    </button>
                                );
                            })}
                        </div>
                    </>
                )}

                {/* Loading */}
                {selectedModule && loading && <div className="text-center py-20 text-slate-500">Loading questions…</div>}

                {/* Error */}
                {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl px-4 py-3 text-sm mb-4 flex items-center gap-2"><span>⚠</span> {error}</div>}

                {/* No questions */}
                {selectedModule && !loading && !error && questions.length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-slate-500 text-sm mb-4">No approved questions yet for this module.</p>
                        <button onClick={() => setSelectedModule(null)} className="text-blue-400 text-sm hover:text-blue-300 transition-colors">← Choose another module</button>
                    </div>
                )}

                {/* Ready to start */}
                {selectedModule && !loading && !error && questions.length > 0 && !quizStarted && !finished && (
                    <div className={`bg-slate-900 border-2 ${c.border} rounded-2xl p-8 text-center max-w-md mx-auto`}>
                        <div className={`w-16 h-16 ${c.bg} rounded-2xl flex items-center justify-center text-white font-bold text-xl mx-auto mb-4`}>{selectedModule}</div>
                        <h2 className="text-xl font-bold text-white mb-1">{MODULES.find(m => m.code === selectedModule)?.label}</h2>
                        <p className={`text-sm ${c.text} font-medium mb-1`}>{questions.length} questions</p>
                        <p className="text-xs text-slate-500 mb-6">Questions are randomised every time.</p>
                        <div className="flex gap-3 justify-center">
                            <button onClick={beginQuiz} className={`${c.btn} text-white px-6 py-2.5 rounded-xl text-sm font-medium transition-colors shadow-lg`}>Start Quiz</button>
                            <button onClick={() => setSelectedModule(null)} className="border border-slate-600 text-slate-400 px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-slate-800 transition-colors">Back</button>
                        </div>
                    </div>
                )}

                {/* Quiz in progress */}
                {quizStarted && !finished && q && (
                    <div className="max-w-2xl mx-auto">
                        {/* Progress */}
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-sm text-slate-400">Question {currentIndex + 1} of {questions.length}</span>
                            <span className={`text-sm font-semibold ${c.text}`}>Score: {score}</span>
                        </div>
                        <div className="w-full bg-slate-800 rounded-full h-1.5 mb-6">
                            <div className={`${c.bg} h-1.5 rounded-full transition-all duration-300`} style={{ width: `${(currentIndex / questions.length) * 100}%` }} />
                        </div>

                        {/* Question card */}
                        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-4">
                            <p className="text-white font-medium text-base leading-relaxed mb-6">{q.questionText}</p>
                            <div className="space-y-3">
                                {q.options.map((opt) => {
                                    let optClass = "border-slate-700 text-slate-300 hover:border-slate-500 hover:bg-slate-800/50";
                                    if (revealed) {
                                        if (opt.label === q.correctOption) optClass = "border-green-500 bg-green-500/10 text-green-300";
                                        else if (opt.label === chosen && chosen !== q.correctOption) optClass = "border-red-400 bg-red-500/10 text-red-300";
                                    } else if (chosen === opt.label) {
                                        optClass = `border-2 ${c.border} ${c.activeBg} ${c.text}`;
                                    }
                                    return (
                                        <button key={opt.label} disabled={revealed} onClick={() => setChosen(opt.label)}
                                            className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all flex items-center gap-3 border ${optClass} ${revealed ? "cursor-default" : "cursor-pointer"}`}>
                                            <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 ${revealed && opt.label === q.correctOption ? "bg-green-500 text-white" : revealed && opt.label === chosen ? "bg-red-500 text-white" : "bg-slate-700 text-slate-300"}`}>{opt.label}</span>
                                            {opt.text}
                                        </button>
                                    );
                                })}
                            </div>
                            {revealed && q.explanation && (
                                <div className="mt-4 bg-blue-500/10 border border-blue-500/20 rounded-xl px-4 py-3 text-sm text-blue-300">
                                    <span className="font-semibold">Explanation:</span> {q.explanation}
                                </div>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3 justify-end">
                            {!revealed ? (
                                <button disabled={!chosen} onClick={checkAnswer}
                                    className={`${chosen ? `${c.btn} text-white shadow-lg` : "bg-slate-800 text-slate-500 cursor-not-allowed"} px-6 py-2.5 rounded-xl text-sm font-medium transition-colors`}>
                                    Check Answer
                                </button>
                            ) : (
                                <button onClick={next} className={`${c.btn} text-white px-6 py-2.5 rounded-xl text-sm font-medium transition-colors shadow-lg`}>
                                    {currentIndex + 1 < questions.length ? "Next →" : "Finish Quiz"}
                                </button>
                            )}
                        </div>
                    </div>
                )}

                {/* Finished */}
                {finished && (
                    <div className="max-w-md mx-auto text-center">
                        <div className={`bg-slate-900 border-2 ${c.border} rounded-2xl p-8`}>
                            <div className="text-5xl mb-4">{score === questions.length ? "🏆" : score >= questions.length * 0.7 ? "🎉" : score >= questions.length * 0.5 ? "👍" : "📚"}</div>
                            <h2 className="text-2xl font-bold text-white mb-1">Quiz Complete!</h2>
                            <p className={`text-4xl font-bold ${c.text} my-3`}>{score} / {questions.length}</p>
                            <p className="text-sm text-slate-400 mb-6">
                                {score === questions.length ? "Perfect score! 🎯" : score >= questions.length * 0.7 ? "Great job!" : score >= questions.length * 0.5 ? "Keep practising!" : "Review this module and try again."}
                            </p>
                            <div className="flex gap-3 justify-center">
                                <button onClick={restart} className={`${c.btn} text-white px-5 py-2.5 rounded-xl text-sm font-medium shadow-lg`}>Retake Quiz</button>
                                <button onClick={() => setSelectedModule(null)} className="border border-slate-600 text-slate-400 px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-slate-800 transition-colors">Other Module</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
