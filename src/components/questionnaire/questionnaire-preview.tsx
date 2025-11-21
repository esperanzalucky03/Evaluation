"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Questionnaire } from "@/lib/types/questionnaire";

interface QuestionnairePreviewProps {
  questionnaire: Questionnaire;
}

export function QuestionnairePreview({ questionnaire }: QuestionnairePreviewProps) {
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [currentStep, setCurrentStep] = useState(0);

  const updateAnswer = (questionId: string, value: any) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const renderQuestion = (question: any) => {
    const questionId = question.id;
    const currentAnswer = answers[questionId];

    const commonProps = {
      id: questionId,
      placeholder: question.placeholder,
      required: question.required,
    };

    switch (question.type) {
      case 'text':
      case 'email':
        return (
          <Input
            {...commonProps}
            type={question.type}
            value={currentAnswer || ''}
            onChange={(e) => updateAnswer(questionId, e.target.value)}
          />
        );

      case 'textarea':
        return (
          <Textarea
            {...commonProps}
            value={currentAnswer || ''}
            onChange={(e) => updateAnswer(questionId, e.target.value)}
            rows={4}
          />
        );

      case 'number':
        return (
          <Input
            {...commonProps}
            type="number"
            min={question.min}
            max={question.max}
            step={question.step}
            value={currentAnswer || ''}
            onChange={(e) => updateAnswer(questionId, e.target.value)}
          />
        );

      case 'date':
        return (
          <Input
            {...commonProps}
            type="date"
            value={currentAnswer || ''}
            onChange={(e) => updateAnswer(questionId, e.target.value)}
          />
        );

      case 'radio':
        return (
          <RadioGroup
            value={currentAnswer || ''}
            onValueChange={(value) => updateAnswer(questionId, value)}
          >
            {question.options?.map((option: any) => (
              <div key={option.id} className="flex items-center space-x-2">
                <RadioGroupItem value={option.value} id={option.id} />
                <Label htmlFor={option.id}>{option.label}</Label>
              </div>
            ))}
          </RadioGroup>
        );

      case 'checkbox':
        return (
          <div className="space-y-2">
            {question.options?.map((option: any) => (
              <div key={option.id} className="flex items-center space-x-2">
                <Checkbox
                  id={option.id}
                  checked={currentAnswer?.includes(option.value) || false}
                  onCheckedChange={(checked) => {
                    const currentValues = currentAnswer || [];
                    if (checked) {
                      updateAnswer(questionId, [...currentValues, option.value]);
                    } else {
                      updateAnswer(questionId, currentValues.filter((v: string) => v !== option.value));
                    }
                  }}
                />
                <Label htmlFor={option.id}>{option.label}</Label>
              </div>
            ))}
          </div>
        );

      case 'select':
        return (
          <Select
            value={currentAnswer || ''}
            onValueChange={(value) => updateAnswer(questionId, value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
              {question.options?.map((option: any) => (
                <SelectItem key={option.id} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case 'rating':
        return (
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((rating) => (
              <Button
                key={rating}
                variant={currentAnswer === rating ? "default" : "outline"}
                size="sm"
                onClick={() => updateAnswer(questionId, rating)}
              >
                ⭐ {rating}
              </Button>
            ))}
          </div>
        );

      default:
        return <div>Unsupported question type</div>;
    }
  };

  const handleSubmit = () => {
    console.log('Questionnaire Answers:', answers);
    // Here you would typically send the answers to your backend
    alert('Questionnaire submitted successfully!');
  };

  const isStepValid = () => {
    const currentQuestion = questionnaire.questions[currentStep];
    if (!currentQuestion?.required) return true;
    
    const answer = answers[currentQuestion.id];
    if (Array.isArray(answer)) return answer.length > 0;
    return answer !== undefined && answer !== null && answer !== '';
  };

  const nextStep = () => {
    if (currentStep < questionnaire.questions.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const progress = ((currentStep + 1) / questionnaire.questions.length) * 100;

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* Header */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl">{questionnaire.title}</CardTitle>
          {questionnaire.description && (
            <p className="text-gray-600">{questionnaire.description}</p>
          )}
        </CardHeader>
      </Card>

      {/* Progress Bar */}
      {questionnaire.settings.showProgress && (
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Question {currentStep + 1} of {questionnaire.questions.length}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Current Question */}
      {questionnaire.questions.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg">
                {questionnaire.questions[currentStep].title}
              </CardTitle>
              {questionnaire.questions[currentStep].required && (
                <Badge variant="destructive">Required</Badge>
              )}
            </div>
            {questionnaire.questions[currentStep].description && (
              <p className="text-gray-600">
                {questionnaire.questions[currentStep].description}
              </p>
            )}
          </CardHeader>
          <CardContent>
            {renderQuestion(questionnaire.questions[currentStep])}
          </CardContent>
        </Card>
      )}

      {/* Navigation */}
      <div className="flex justify-between mt-6">
        <Button
          variant="outline"
          onClick={prevStep}
          disabled={currentStep === 0}
        >
          Previous
        </Button>

        {currentStep === questionnaire.questions.length - 1 ? (
          <Button
            onClick={handleSubmit}
            disabled={!isStepValid()}
          >
            Submit Questionnaire
          </Button>
        ) : (
          <Button
            onClick={nextStep}
            disabled={!isStepValid()}
          >
            Next
          </Button>
        )}
      </div>

      {/* Debug Info (remove in production) */}
      <Card className="mt-6 bg-gray-50">
        <CardHeader>
          <CardTitle className="text-sm">Debug Info</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="text-xs overflow-auto">
            {JSON.stringify(answers, null, 2)}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
}
