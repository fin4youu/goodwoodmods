import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { courseModules } from '../data/course';
import { db } from '../firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { CheckCircle2, XCircle, AlertTriangle, Lightbulb } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Course() {
  const { profile, refreshProfile } = useAuth();
  const [currentModuleIndex, setCurrentModuleIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setCurrentModuleIndex(profile.currentModule || 0);
    }
  }, [profile]);

  if (!profile) return null;

  const currentModule = courseModules[currentModuleIndex];
  const isFinalTest = currentModuleIndex === courseModules.length - 1;

  const handleAnswer = (questionId: string, answer: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const calculateScore = () => {
    let correct = 0;
    currentModule.questions.forEach(q => {
      const userAnswer = answers[q.id]?.toLowerCase().trim();
      const correctAnswer = q.correctAnswer.toLowerCase().trim();
      
      if (q.type === 'multiple-choice') {
        if (userAnswer === correctAnswer) correct++;
      } else {
        if (userAnswer === correctAnswer) correct++;
      }
    });
    return Math.round((correct / currentModule.questions.length) * 100);
  };

  const handleSubmit = async () => {
    const currentScore = calculateScore();
    setScore(currentScore);
    setShowResults(true);

    if (isFinalTest) {
      setSaving(true);
      const passed = currentScore === 100; // Final test is strict
      
      await updateDoc(doc(db, 'users', profile.uid), {
        status: passed ? 'passed' : 'failed',
        testScore: currentScore,
        currentModule: passed ? currentModuleIndex + 1 : currentModuleIndex
      });
      
      await refreshProfile();
      setSaving(false);
    }
  };

  const handleNextModule = async () => {
    setSaving(true);
    await updateDoc(doc(db, 'users', profile.uid), {
      currentModule: currentModuleIndex + 1,
      status: 'in-progress'
    });
    await refreshProfile();
    setCurrentModuleIndex(prev => prev + 1);
    setAnswers({});
    setShowResults(false);
    setSaving(false);
  };

  const handleRetry = () => {
    setAnswers({});
    setShowResults(false);
  };

  if (profile.status === 'passed') {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center py-20"
      >
        <CheckCircle2 className="w-24 h-24 text-green-500 mx-auto mb-6" />
        <h1 className="text-4xl font-bold text-[#004225] mb-4">Course Completed</h1>
        <p className="text-xl text-gray-600">You have successfully passed all modules.</p>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-4xl mx-auto space-y-8"
    >
      <div className="flex items-center justify-between border-b border-gray-200 pb-4">
        <h1 className="text-3xl font-bold text-[#004225]">{currentModule.title}</h1>
        <div className="text-sm font-semibold text-gray-500 uppercase tracking-widest">
          Module {currentModuleIndex + 1} of {courseModules.length}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!showResults ? (
          <motion.div 
            key="questions"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="bg-white border-none shadow-md">
              <CardContent className="p-8 prose prose-green max-w-none">
                <div className="whitespace-pre-wrap text-gray-800 text-lg leading-relaxed font-serif">
                  {currentModule.content}
                </div>
              </CardContent>
            </Card>

            <div className="space-y-6 mt-12">
              <h2 className="text-2xl font-bold text-[#004225] border-b border-gray-200 pb-2">Questions</h2>
              {currentModule.questions.map((q, i) => (
                <motion.div 
                  key={q.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card className="border border-gray-200 hover:border-[#004225]/30 transition-colors">
                    <CardHeader className="bg-gray-50 border-b border-gray-100 pb-3">
                      <div className="flex items-start justify-between gap-4">
                        <CardTitle className="text-lg font-medium text-gray-900 leading-snug">
                          {i + 1}. {q.text}
                        </CardTitle>
                        {q.hint && (
                          <div className="group relative flex items-center shrink-0 mt-1">
                            <Lightbulb className="w-5 h-5 text-gray-400 hover:text-yellow-500 transition-colors cursor-help" />
                            <div className="absolute right-8 top-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none bg-white border border-gray-200 text-xs text-gray-600 p-3 rounded shadow-lg w-64 z-10">
                              <div className="font-semibold text-yellow-600 mb-1">Hint</div>
                              {q.hint}
                            </div>
                          </div>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="p-6">
                      {q.type === 'multiple-choice' ? (
                        <div className="space-y-3">
                          {q.options?.map((opt, j) => {
                            const letter = opt.charAt(0).toLowerCase();
                            const isSelected = answers[q.id] === letter;
                            return (
                              <label 
                                key={j} 
                                className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all ${isSelected ? 'bg-[#004225]/10 border-[#004225] shadow-sm' : 'hover:bg-gray-50 border-gray-200 hover:border-gray-300'}`}
                              >
                                <input 
                                  type="radio" 
                                  name={q.id} 
                                  value={letter}
                                  checked={isSelected}
                                  onChange={() => handleAnswer(q.id, letter)}
                                  className="w-4 h-4 text-[#004225] focus:ring-[#004225]"
                                />
                                <span className="ml-3 text-gray-700">{opt}</span>
                              </label>
                            );
                          })}
                        </div>
                      ) : (
                        <Input 
                          type="text" 
                          placeholder="Type your answer here..."
                          value={answers[q.id] || ''}
                          onChange={(e) => handleAnswer(q.id, e.target.value)}
                          className="max-w-md transition-all focus:scale-[1.01]"
                        />
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            <div className="flex justify-end pt-6">
              <Button 
                size="lg" 
                onClick={handleSubmit}
                disabled={Object.keys(answers).length !== currentModule.questions.length || saving}
                className="bg-[#D4AF37] hover:bg-[#b8962e] text-[#004225] font-bold px-12 transition-transform active:scale-95"
              >
                Submit Answers
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="results"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <Card className="text-center p-12 border-none shadow-xl">
              {isFinalTest ? (
                score === 100 ? (
                  <div className="space-y-6">
                    <CheckCircle2 className="w-24 h-24 text-green-500 mx-auto" />
                    <h2 className="text-4xl font-bold text-green-700">Perfect Score!</h2>
                    <p className="text-xl text-gray-600">You scored 100% on the final test.</p>
                    <Button onClick={() => window.location.href = '/'} size="lg" className="mt-8 transition-transform active:scale-95">
                      Return to Dashboard
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <XCircle className="w-24 h-24 text-red-500 mx-auto" />
                    <h2 className="text-4xl font-bold text-red-700">Test Failed</h2>
                    <p className="text-xl text-gray-600">You scored {score}%. The final test requires 100% to pass.</p>
                    <Button onClick={handleRetry} size="lg" variant="outline" className="mt-8 border-red-500 text-red-600 hover:bg-red-50 transition-transform active:scale-95">
                      Try Again
                    </Button>
                  </div>
                )
              ) : (
                <div className="space-y-6">
                  <CheckCircle2 className="w-24 h-24 text-[#004225] mx-auto" />
                  <h2 className="text-4xl font-bold text-[#004225]">Module Complete!</h2>
                  <p className="text-xl text-gray-600">You scored {score}% on this module.</p>
                  <Button onClick={handleNextModule} size="lg" disabled={saving} className="mt-8 bg-[#D4AF37] hover:bg-[#b8962e] text-[#004225] font-bold transition-transform active:scale-95">
                    {saving ? 'Saving...' : 'Continue to Next Module'}
                  </Button>
                </div>
              )}
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
