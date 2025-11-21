"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { QuestionnairePreview } from "@/components/questionnaire/questionnaire-preview";
import { Questionnaire } from "@/lib/types/questionnaire";

interface QuestionnaireViewPageProps {
  params: {
    slug: string;
  };
}

export default function QuestionnaireViewPage({ params }: QuestionnaireViewPageProps) {
  const [questionnaire, setQuestionnaire] = useState<Questionnaire | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    // In a real app, this would fetch the questionnaire by slug from your API
    // For now, we'll simulate loading
    const loadQuestionnaire = async () => {
      try {
        setLoading(true);
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock questionnaire data - in real app, fetch by slug
        const mockQuestionnaire: Questionnaire = {
          id: `questionnaire-${params.slug}`,
          slug: params.slug,
          title: "Sample Questionnaire",
          description: "This is a sample questionnaire loaded by slug",
          questions: [
            {
              id: "q1",
              type: "text",
              title: "What is your name?",
              required: true,
            },
            {
              id: "q2",
              type: "radio",
              title: "How would you rate our service?",
              required: true,
              options: [
                { id: "opt1", label: "Excellent", value: "excellent" },
                { id: "opt2", label: "Good", value: "good" },
                { id: "opt3", label: "Average", value: "average" },
                { id: "opt4", label: "Poor", value: "poor" },
              ],
            },
          ],
          settings: {
            allowAnonymous: true,
            showProgress: true,
            randomizeQuestions: false,
          },
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        
        setQuestionnaire(mockQuestionnaire);
      } catch (err) {
        setError("Failed to load questionnaire");
      } finally {
        setLoading(false);
      }
    };

    loadQuestionnaire();
  }, [params.slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p>Loading questionnaire...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !questionnaire) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-semibold text-red-600 mb-2">Error</h2>
            <p className="text-gray-600 mb-4">
              {error || "Questionnaire not found"}
            </p>
            <Button asChild>
              <a href="/questionnaire">Create New Questionnaire</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{questionnaire.title}</h1>
              {questionnaire.description && (
                <p className="text-gray-600 mt-1">{questionnaire.description}</p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">Slug: {questionnaire.slug}</Badge>
              <Button variant="outline" asChild>
                <a href="/questionnaire">Edit Questionnaire</a>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Questionnaire Content */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <QuestionnairePreview questionnaire={questionnaire} />
      </div>
    </div>
  );
}

