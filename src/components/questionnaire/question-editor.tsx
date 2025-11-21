"use client";

import React, { useState } from "react";
import { Plus, Trash2, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Question, QuestionOption } from "@/lib/types/questionnaire";

interface QuestionEditorProps {
  question: Question;
  onUpdate: (updates: Partial<Question>) => void;
}

export function QuestionEditor({ question, onUpdate }: QuestionEditorProps) {
  const [newOption, setNewOption] = useState("");

  const addOption = () => {
    if (!newOption.trim()) return;
    
    const option: QuestionOption = {
      id: `option-${Date.now()}`,
      label: newOption.trim(),
      value: newOption.trim().toLowerCase().replace(/\s+/g, '-'),
    };

    onUpdate({
      options: [...(question.options || []), option],
    });
    
    setNewOption("");
  };

  const updateOption = (optionId: string, updates: Partial<QuestionOption>) => {
    const updatedOptions = question.options?.map(option =>
      option.id === optionId ? { ...option, ...updates } : option
    ) || [];

    onUpdate({ options: updatedOptions });
  };

  const deleteOption = (optionId: string) => {
    const updatedOptions = question.options?.filter(option => option.id !== optionId) || [];
    onUpdate({ options: updatedOptions });
  };

  const hasOptions = ['radio', 'checkbox', 'select'].includes(question.type);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Question Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Question Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Question Title</Label>
            <Input
              id="title"
              value={question.title}
              onChange={(e) => onUpdate({ title: e.target.value })}
              placeholder="Enter question title"
            />
          </div>

          {/* Question Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              value={question.description || ""}
              onChange={(e) => onUpdate({ description: e.target.value })}
              placeholder="Enter question description"
              rows={3}
            />
          </div>

          {/* Required Toggle */}
          <div className="flex items-center space-x-2">
            <Switch
              id="required"
              checked={question.required}
              onCheckedChange={(checked) => onUpdate({ required: checked })}
            />
            <Label htmlFor="required">Required question</Label>
          </div>

          {/* Placeholder for text inputs */}
          {['text', 'textarea', 'email'].includes(question.type) && (
            <div className="space-y-2">
              <Label htmlFor="placeholder">Placeholder Text</Label>
              <Input
                id="placeholder"
                value={question.placeholder || ""}
                onChange={(e) => onUpdate({ placeholder: e.target.value })}
                placeholder="Enter placeholder text"
              />
            </div>
          )}

          {/* Number input settings */}
          {question.type === 'number' && (
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="min">Minimum Value</Label>
                <Input
                  id="min"
                  type="number"
                  value={question.min || ""}
                  onChange={(e) => onUpdate({ min: e.target.value ? Number(e.target.value) : undefined })}
                  placeholder="Min"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="max">Maximum Value</Label>
                <Input
                  id="max"
                  type="number"
                  value={question.max || ""}
                  onChange={(e) => onUpdate({ max: e.target.value ? Number(e.target.value) : undefined })}
                  placeholder="Max"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="step">Step</Label>
                <Input
                  id="step"
                  type="number"
                  value={question.step || ""}
                  onChange={(e) => onUpdate({ step: e.target.value ? Number(e.target.value) : undefined })}
                  placeholder="Step"
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Options Editor */}
      {hasOptions && (
        <Card>
          <CardHeader>
            <CardTitle>Answer Options</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Existing Options */}
            {question.options?.map((option, index) => (
              <div key={option.id} className="flex items-center gap-2">
                <GripVertical className="h-4 w-4 text-gray-400" />
                <Input
                  value={option.label}
                  onChange={(e) => updateOption(option.id, { label: e.target.value })}
                  placeholder={`Option ${index + 1}`}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteOption(option.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}

            {/* Add New Option */}
            <div className="flex items-center gap-2">
              <Input
                value={newOption}
                onChange={(e) => setNewOption(e.target.value)}
                placeholder="Add new option"
                onKeyPress={(e) => e.key === 'Enter' && addOption()}
              />
              <Button onClick={addOption} disabled={!newOption.trim()}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {(!question.options || question.options.length === 0) && (
              <p className="text-sm text-gray-500 text-center py-4">
                No options added yet. Add at least one option for this question type.
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Validation Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Validation Rules</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {['text', 'textarea'].includes(question.type) && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="minLength">Minimum Length</Label>
                <Input
                  id="minLength"
                  type="number"
                  value={question.validation?.minLength || ""}
                  onChange={(e) => onUpdate({
                    validation: {
                      ...question.validation,
                      minLength: e.target.value ? Number(e.target.value) : undefined,
                    }
                  })}
                  placeholder="Min length"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxLength">Maximum Length</Label>
                <Input
                  id="maxLength"
                  type="number"
                  value={question.validation?.maxLength || ""}
                  onChange={(e) => onUpdate({
                    validation: {
                      ...question.validation,
                      maxLength: e.target.value ? Number(e.target.value) : undefined,
                    }
                  })}
                  placeholder="Max length"
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="pattern">Pattern (Regex)</Label>
            <Input
              id="pattern"
              value={question.validation?.pattern || ""}
              onChange={(e) => onUpdate({
                validation: {
                  ...question.validation,
                  pattern: e.target.value || undefined,
                }
              })}
              placeholder="Enter regex pattern"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="customMessage">Custom Error Message</Label>
            <Input
              id="customMessage"
              value={question.validation?.customMessage || ""}
              onChange={(e) => onUpdate({
                validation: {
                  ...question.validation,
                  customMessage: e.target.value || undefined,
                }
              })}
              placeholder="Enter custom validation message"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
