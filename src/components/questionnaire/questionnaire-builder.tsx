"use client";

import React, { useState } from "react";
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Plus, GripVertical, Trash2, Copy, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Question, QuestionType, Questionnaire } from "@/lib/types/questionnaire";
import { QuestionItem } from "./question-item";
import { QuestionEditor } from "./question-editor";

interface QuestionnaireBuilderProps {
  questionnaire: Questionnaire;
  onUpdate: (questionnaire: Questionnaire) => void;
}

const questionTypes: { value: QuestionType; label: string; icon: string }[] = [
  { value: "text", label: "Short Text", icon: "📝" },
  { value: "textarea", label: "Long Text", icon: "📄" },
  { value: "radio", label: "Single Choice", icon: "🔘" },
  { value: "checkbox", label: "Multiple Choice", icon: "☑️" },
  { value: "select", label: "Dropdown", icon: "📋" },
  { value: "number", label: "Number", icon: "🔢" },
  { value: "email", label: "Email", icon: "📧" },
  { value: "date", label: "Date", icon: "📅" },
  { value: "rating", label: "Rating", icon: "⭐" },
];

export function QuestionnaireBuilder({ questionnaire, onUpdate }: QuestionnaireBuilderProps) {
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(null);
  const [draggedQuestion, setDraggedQuestion] = useState<Question | null>(null);

  const addQuestion = (type: QuestionType) => {
    const newQuestion: Question = {
      id: `question-${Date.now()}`,
      type,
      title: `New ${questionTypes.find(qt => qt.value === type)?.label || 'Question'}`,
      required: false,
      options: type === 'radio' || type === 'checkbox' || type === 'select' ? [
        { id: 'option-1', label: 'Option 1', value: 'option-1' },
        { id: 'option-2', label: 'Option 2', value: 'option-2' }
      ] : undefined,
    };

    const updatedQuestionnaire = {
      ...questionnaire,
      questions: [...questionnaire.questions, newQuestion],
      updatedAt: new Date(),
    };

    onUpdate(updatedQuestionnaire);
    setSelectedQuestionId(newQuestion.id);
  };

  const updateQuestion = (questionId: string, updates: Partial<Question>) => {
    const updatedQuestions = questionnaire.questions.map(q =>
      q.id === questionId ? { ...q, ...updates } : q
    );

    const updatedQuestionnaire = {
      ...questionnaire,
      questions: updatedQuestions,
      updatedAt: new Date(),
    };

    onUpdate(updatedQuestionnaire);
  };

  const deleteQuestion = (questionId: string) => {
    const updatedQuestions = questionnaire.questions.filter(q => q.id !== questionId);
    const updatedQuestionnaire = {
      ...questionnaire,
      questions: updatedQuestions,
      updatedAt: new Date(),
    };

    onUpdate(updatedQuestionnaire);
    
    if (selectedQuestionId === questionId) {
      setSelectedQuestionId(null);
    }
  };

  const duplicateQuestion = (questionId: string) => {
    const questionToDuplicate = questionnaire.questions.find(q => q.id === questionId);
    if (!questionToDuplicate) return;

    const duplicatedQuestion: Question = {
      ...questionToDuplicate,
      id: `question-${Date.now()}`,
      title: `${questionToDuplicate.title} (Copy)`,
    };

    const updatedQuestionnaire = {
      ...questionnaire,
      questions: [...questionnaire.questions, duplicatedQuestion],
      updatedAt: new Date(),
    };

    onUpdate(updatedQuestionnaire);
  };

  const handleDragStart = (event: DragStartEvent) => {
    const question = questionnaire.questions.find(q => q.id === event.active.id);
    setDraggedQuestion(question || null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over || active.id === over.id) {
      setDraggedQuestion(null);
      return;
    }

    const oldIndex = questionnaire.questions.findIndex(q => q.id === active.id);
    const newIndex = questionnaire.questions.findIndex(q => q.id === over.id);

    if (oldIndex !== -1 && newIndex !== -1) {
      const newQuestions = [...questionnaire.questions];
      const [movedQuestion] = newQuestions.splice(oldIndex, 1);
      newQuestions.splice(newIndex, 0, movedQuestion);

      const updatedQuestionnaire = {
        ...questionnaire,
        questions: newQuestions,
        updatedAt: new Date(),
      };

      onUpdate(updatedQuestionnaire);
    }

    setDraggedQuestion(null);
  };

  const selectedQuestion = questionnaire.questions.find(q => q.id === selectedQuestionId);

  return (
    <div className="flex h-full">
      {/* Questions List */}
      <div className="w-1/3 border-r bg-gray-50/50 p-4">
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Questions</h3>
          <div className="grid grid-cols-2 gap-2">
            {questionTypes.map((type) => (
              <Button
                key={type.value}
                variant="outline"
                size="sm"
                onClick={() => addQuestion(type.value)}
                className="h-auto p-2 flex flex-col items-center gap-1"
              >
                <span className="text-lg">{type.icon}</span>
                <span className="text-xs">{type.label}</span>
              </Button>
            ))}
          </div>
        </div>

        <Separator className="my-4" />

        <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
          <SortableContext items={questionnaire.questions.map(q => q.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-2">
              {questionnaire.questions.map((question, index) => (
                <QuestionItem
                  key={question.id}
                  question={question}
                  index={index}
                  isSelected={selectedQuestionId === question.id}
                  onSelect={() => setSelectedQuestionId(question.id)}
                  onDelete={() => deleteQuestion(question.id)}
                  onDuplicate={() => duplicateQuestion(question.id)}
                />
              ))}
            </div>
          </SortableContext>
          <DragOverlay>
            {draggedQuestion ? (
              <Card className="opacity-50">
                <CardContent className="p-3">
                  <div className="flex items-center gap-2">
                    <GripVertical className="h-4 w-4 text-gray-400" />
                    <span className="text-sm font-medium">{draggedQuestion.title}</span>
                    <Badge variant="secondary" className="text-xs">
                      {questionTypes.find(qt => qt.value === draggedQuestion.type)?.label}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>

      {/* Question Editor */}
      <div className="flex-1 p-4">
        {selectedQuestion ? (
          <QuestionEditor
            question={selectedQuestion}
            onUpdate={(updates) => updateQuestion(selectedQuestion.id, updates)}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            <div className="text-center">
              <Settings className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium mb-2">No Question Selected</h3>
              <p className="text-sm">Select a question from the list to edit its properties</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
