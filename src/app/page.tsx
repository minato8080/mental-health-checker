"use client";

import { useState, useEffect } from "react";
import React from "react";

import { motion, AnimatePresence } from "framer-motion";
import { Check, Trash2, PlusCircle, Heart } from "lucide-react";

import type { Question } from "@/types/types";

import { ConfirmDialog } from "@/components/ConfirmDialog";
import { HealthPointSelector } from "@/components/health-point-selector";
import { ThemeProvider } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

/**
 * カスタムチェックボックスコンポーネント
 * @param props - Checkboxコンポーネントのプロパティ
 * @returns カスタムスタイルが適用されたCheckboxコンポーネント
 */
const CustomCheckbox = React.forwardRef<
  React.ElementRef<typeof Checkbox>,
  React.ComponentPropsWithoutRef<typeof Checkbox>
>(({ className, ...props }, ref) => (
  <Checkbox
    ref={ref}
    className={cn(
      "w-6 h-6 border-2 border-pink-500 rounded-full", // チェックボックスの基本スタイル
      "data-[state=checked]:bg-pink-500 data-[state=checked]:text-white", // チェックされた状態のスタイル
      className // 外部から渡されたクラス名を追加
    )}
    {...props} // その他のプロパティを渡す
  />
));
CustomCheckbox.displayName = "CustomCheckbox"; // コンポーネントの表示名を設定

// デフォルトの質問リストを定義
const defaultQuestions: Pick<Question, "text" | "weight">[] = [
  { text: "今日、日の光を浴びましたか？", weight: 3 },
  { text: "今日、学校に行きましたか？", weight: 3 },
  { text: "今日、勉強または作業をしましたか？", weight: 2 },
  { text: "今日、メッセージの確認/返信をしましたか？", weight: 1 },
  { text: "今日、家事をしましたか？", weight: 2 },
  { text: "今日、自炊をしましたか？", weight: 2 },
  { text: "今日、メイクまたは髪セットをしましたか？", weight: 2 },
  { text: "今日、お風呂に入りましたか？", weight: 2 },
  { text: "今日、ストレッチや筋トレをしましたか？", weight: 2 },
];

/**
 * 心の健康チェッカーコンポーネント
 * @returns 心の健康チェッカーのUIを含むReactコンポーネント
 */
export default function MentalHealthChecker() {
  // 質問の状態を管理するためのuseStateフック
  const [questions, setQuestions] = useState<Question[]>(
    defaultQuestions.map((q, index) => ({
      id: index + 1, // 各質問に一意のIDを付与
      text: q.text,
      weight: q.weight,
      answer: null, // 初期状態では回答はnull
    }))
  );

  // 編集モード用の質問リストを管理
  const [editedQuestions, setEditedQuestions] = useState<Question[]>(questions);

  // スコア、編集モード、全質問回答済み、結果表示の状態を管理
  const [score, setScore] = useState<number | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [allQuestionsAnswered, setAllQuestionsAnswered] = useState(false);
  const [showResult, setShowResult] = useState(false);

  // 質問が全て回答されたかどうかをチェックするuseEffectフック
  useEffect(() => {
    setAllQuestionsAnswered(questions.every((q) => q.answer !== null));
  }, [questions]);

  // 回答が変更されたときのハンドラ
  const handleAnswerChange = (id: number, value: "yes" | "no" | "na") => {
    setQuestions(
      questions.map((q) => (q.id === id ? { ...q, answer: value } : q))
    );
  };

  // 質問の編集を行うハンドラ
  const handleEditQuestion = (
    id: number,
    field: keyof Question,
    value: string | number
  ) => {
    setEditedQuestions(
      editedQuestions.map((q) =>
        q.id === id
          ? { ...q, [field]: field === "weight" ? Number(value) : value }
          : q
      )
    );
  };

  // 質問を削除するハンドラ
  const handleDeleteQuestion = (id: number) => {
    setQuestions(questions.filter((q) => q.id !== id));
    setEditedQuestions(editedQuestions.filter((q) => q.id !== id));
  };

  // 新しい質問を追加するハンドラ
  const handleAddQuestion = () => {
    const newQuestion: Question = {
      id: Math.max(...questions.map((q) => q.id)) + 1, // 新しいIDを生成
      text: "新しい質問",
      weight: 1,
      answer: null,
    };
    setQuestions([...questions, newQuestion]);
    setEditedQuestions([...editedQuestions, newQuestion]);
  };

  // スコアを計算する関数
  const calculateScore = () => {
    const answeredQuestions = questions.filter(
      (q) => q.answer === "yes" || q.answer === "no"
    );
    if (answeredQuestions.length === 0) return 0;

    const totalScore = answeredQuestions.reduce((acc, q) => {
      return acc + (q.answer === "yes" ? q.weight : 0);
    }, 0);
    const maxScore = answeredQuestions.reduce((acc, q) => acc + q.weight, 0);
    return (totalScore / maxScore) * 5;
  };

  // 診断を行うハンドラ
  const handleDiagnose = () => {
    setScore(calculateScore());
    setShowResult(true);
  };

  // 編集モードを切り替えるハンドラ
  const toggleEditMode = () => {
    if (isEditMode) {
      setQuestions(editedQuestions);
    } else {
      setEditedQuestions(questions);
    }
    setIsEditMode(!isEditMode);
  };

  // コンポーネントのUIをレンダリング
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <div className="min-h-screen bg-gradient-to-r from-green-100 to-blue-100 flex items-center justify-center">
        <Card className="w-full h-screen max-w-4xl mx-auto bg-card/80 backdrop-blur-sm shadow-xl rounded-none flex flex-col bg-white">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-3xl font-bold text-center bg-gradient-to-r from-pink-500 to-purple-500 text-transparent bg-clip-text">
              心の健康チェッカー
            </CardTitle>
            <Button
              onClick={toggleEditMode}
              variant="outline"
              className={`${
                isEditMode
                  ? "bg-pink-200 hover:bg-pink-300"
                  : "bg-gray-200 hover:bg-gray-300"
              } text-gray-800`}
            >
              {isEditMode ? "保存" : "編集モード"}
            </Button>
          </CardHeader>
          <CardContent className="flex-grow overflow-hidden">
            <ScrollArea className="h-full pr-4">
              {(isEditMode ? editedQuestions : questions).map((question) => (
                <motion.div
                  key={question.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mb-6 p-4 bg-card rounded-lg shadow-sm border border-border"
                >
                  {isEditMode ? (
                    <div className="space-y-4">
                      <Input
                        value={question.text}
                        onChange={(e) =>
                          handleEditQuestion(
                            question.id,
                            "text",
                            e.target.value
                          )
                        }
                        className="w-full text-lg"
                      />
                      <div className="flex items-center">
                        <span className="mr-2 text-sm font-medium text-gray-700">
                          健康ポイント：
                        </span>
                        <HealthPointSelector
                          value={question.weight}
                          onChange={(value) =>
                            handleEditQuestion(question.id, "weight", value)
                          }
                        />
                        <ConfirmDialog title="質問を削除しますか？" ok="はい" cancel="いいえ">
                          <Button
                            onClick={() => handleDeleteQuestion(question.id)}
                            className="w-18 h-6 ml-auto bg-gray-300 hover:bg-gray-400 text-gray-800"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            削除
                          </Button>
                        </ConfirmDialog>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex justify-between items-start mb-2">
                        <p className="text-xl font-medium text-gray-700">
                          {question.text}
                        </p>
                      </div>
                      <div className="flex space-x-4 mb-2">
                        {["yes", "no", "na"].map((value) => (
                          <div key={value} className="flex items-center">
                            <CustomCheckbox
                              id={`${question.id}-${value}`}
                              checked={question.answer === value}
                              onCheckedChange={() =>
                                handleAnswerChange(
                                  question.id,
                                  value as "yes" | "no" | "na"
                                )
                              }
                            />
                            <label
                              htmlFor={`${question.id}-${value}`}
                              className="ml-2 text-sm font-medium text-muted-foreground"
                            >
                              {value === "yes"
                                ? "はい"
                                : value === "no"
                                ? "いいえ"
                                : "対象外"}
                            </label>
                          </div>
                        ))}
                      </div>
                      <div className="flex items-center">
                        <span className="text-sm text-gray-500 mr-2">
                          健康ポイント：
                        </span>
                        {Array(5)
                          .fill(0)
                          .map((_, i) => (
                            <Heart
                              key={i}
                              className={`w-5 h-5 ${
                                i < question.weight
                                  ? "text-pink-500 fill-pink-500"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                      </div>
                    </>
                  )}
                </motion.div>
              ))}
            </ScrollArea>
          </CardContent>
          <div className="sticky bottom-0 bg-white/80 backdrop-blur-sm p-6 border-t">
            {isEditMode ? (
              <Button
                onClick={handleAddQuestion}
                className="w-full bg-pink-500 hover:bg-pink-600 text-white"
              >
                <PlusCircle className="w-4 h-4 mr-2" />
                質問を追加
              </Button>
            ) : (
              <Button
                onClick={handleDiagnose}
                className="w-full bg-pink-500 hover:bg-pink-600 text-white"
                disabled={!allQuestionsAnswered}
              >
                <Check className="w-4 h-4 mr-2" />
                診断する
              </Button>
            )}
          </div>
        </Card>
      </div>
      <AnimatePresence>
        {showResult && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white p-8 rounded-lg shadow-xl"
            >
              <h2 className="text-2xl font-bold mb-4">診断結果</h2>
              <p className="text-xl mb-4">
                あなたの心の健康スコア: {score?.toFixed(1)}/5.0
              </p>
              <Button
                onClick={() => setShowResult(false)}
                className="bg-pink-500 hover:bg-pink-600 text-white"
              >
                閉じる
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </ThemeProvider>
  );
}
