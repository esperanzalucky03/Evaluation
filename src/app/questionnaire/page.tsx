"use client";

import React, { useState } from "react";
import { Save, Download, Eye, Settings, Plus, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { QuestionnaireBuilder } from "@/components/questionnaire/questionnaire-builder";
import { QuestionnairePreview } from "@/components/questionnaire/questionnaire-preview";
import { Questionnaire } from "@/lib/types/questionnaire";
import { generateSlugFromTitle, generateSlug, isValidSlug } from "@/lib/utils/slug";

export default function QuestionnairePage() {
  const [questionnaire, setQuestionnaire] = useState<Questionnaire>({
    id: `questionnaire-${Date.now()}`,
    slug: generateSlugFromTitle("New Questionnaire"),
    title: "New Questionnaire",
    description: "",
    questions: [],
    settings: {
      allowAnonymous: true,
      showProgress: true,
      randomizeQuestions: false,
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  const [activeTab, setActiveTab] = useState("builder");
  const [slugError, setSlugError] = useState<string>("");

  const updateQuestionnaire = (updates: Partial<Questionnaire>) => {
    setQuestionnaire(prev => ({
      ...prev,
      ...updates,
      updatedAt: new Date(),
    }));
  };

  const handleTitleChange = (title: string) => {
    updateQuestionnaire({ title });
    const newSlug = generateSlugFromTitle(title);
    updateQuestionnaire({ slug: newSlug });
  };

  const handleSlugChange = (slug: string) => {
    const cleanSlug = generateSlug(slug);

    if (!isValidSlug(cleanSlug)) {
      setSlugError("Slug must be 3-50 characters, contain only lowercase letters, numbers, and hyphens");
    } else {
      setSlugError("");
    }

    updateQuestionnaire({ slug: cleanSlug });
  };

  const generateSlugFromCurrentTitle = () => {
    const newSlug = generateSlugFromTitle(questionnaire.title);
    updateQuestionnaire({ slug: newSlug });
    setSlugError("");
  };

  const copyQuestionnaireUrl = () => {
    const url = `${window.location.origin}/questionnaire/${questionnaire.slug}`;
    navigator.clipboard.writeText(url).then(() => {
      alert("Questionnaire URL copied to clipboard!");
    }).catch(() => {
      alert("Failed to copy URL to clipboard");
    });
  };

  const saveQuestionnaire = () => {
    console.log("Saving questionnaire:", questionnaire);
    alert("Questionnaire saved successfully!");
  };

  const exportQuestionnaire = () => {
    const dataStr = JSON.stringify(questionnaire, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

    const exportFileDefaultName = `${questionnaire.title.replace(/\s+/g, '_')}.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const importQuestionnaire = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target?.result as string);
        setQuestionnaire(imported);
        alert("Questionnaire imported successfully!");
      } catch (error) {
        alert("Error importing questionnaire. Please check the file format.");
      }
    };
    reader.readAsText(file);
  };

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              {/* Header Actions */}
              <div className="px-4 lg:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <h1 className="text-2xl font-bold text-gray-900">Questionnaire Builder</h1>
                    <div className="flex items-center gap-2">
                      <input
                        type="file"
                        accept=".json"
                        onChange={importQuestionnaire}
                        className="hidden"
                        id="import-file"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => document.getElementById('import-file')?.click()}
                      >
                        Import
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={exportQuestionnaire}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Export
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={saveQuestionnaire}
                      >
                        <Save className="h-4 w-4 mr-2" />
                        Save
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                        disabled={!questionnaire.slug || slugError !== ""}
                      >
                        <a href={`/questionnaire/${questionnaire.slug}`} target="_blank" rel="noopener noreferrer">
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </a>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={copyQuestionnaireUrl}
                        disabled={!questionnaire.slug || slugError !== ""}
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Copy URL
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-4 lg:px-6">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                  {/* Settings Panel */}
                  <div className="lg:col-span-1">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Settings className="h-5 w-5" />
                          Questionnaire Settings
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="title">Title</Label>
                          <Input
                            id="title"
                            value={questionnaire.title}
                            onChange={(e) => handleTitleChange(e.target.value)}
                            placeholder="Enter questionnaire title"
                          />
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="slug">Slug</Label>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={generateSlugFromCurrentTitle}
                              className="text-xs"
                            >
                              Generate
                            </Button>
                          </div>
                          <div className="space-y-1">
                            <Input
                              id="slug"
                              value={questionnaire.slug}
                              onChange={(e) => handleSlugChange(e.target.value)}
                              placeholder="questionnaire-slug"
                              className={slugError ? "border-red-500" : ""}
                            />
                            {slugError && (
                              <p className="text-sm text-red-500">{slugError}</p>
                            )}
                            <p className="text-xs text-gray-500">
                              URL: /questionnaire/{questionnaire.slug}
                            </p>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="description">Description</Label>
                          <Textarea
                            id="description"
                            value={questionnaire.description || ""}
                            onChange={(e) => updateQuestionnaire({ description: e.target.value })}
                            placeholder="Enter questionnaire description"
                            rows={3}
                          />
                        </div>

                        <Separator />

                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="allowAnonymous">Allow Anonymous</Label>
                            <Switch
                              id="allowAnonymous"
                              checked={questionnaire.settings.allowAnonymous}
                              onCheckedChange={(checked) =>
                                updateQuestionnaire({
                                  settings: { ...questionnaire.settings, allowAnonymous: checked as boolean }
                                })
                              }
                            />
                          </div>

                          <div className="flex items-center justify-between">
                            <Label htmlFor="showProgress">Show Progress</Label>
                            <Switch
                              id="showProgress"
                              checked={questionnaire.settings.showProgress}
                              onCheckedChange={(checked) =>
                                updateQuestionnaire({
                                  settings: { ...questionnaire.settings, showProgress: checked as boolean }
                                })
                              }
                            />
                          </div>

                          <div className="flex items-center justify-between">
                            <Label htmlFor="randomizeQuestions">Randomize Questions</Label>
                            <Switch
                              id="randomizeQuestions"
                              checked={questionnaire.settings.randomizeQuestions}
                              onCheckedChange={(checked) =>
                                updateQuestionnaire({
                                  settings: { ...questionnaire.settings, randomizeQuestions: checked as boolean }
                                })
                              }
                            />
                          </div>
                        </div>

                        <Separator />

                        <div className="space-y-2">
                          <Label htmlFor="timeLimit">Time Limit (minutes)</Label>
                          <Input
                            id="timeLimit"
                            type="number"
                            value={questionnaire.settings.timeLimit ?? ""}
                            onChange={(e) =>
                              updateQuestionnaire({
                                settings: {
                                  ...questionnaire.settings,
                                  timeLimit: e.target.value ? Number(e.target.value) : undefined
                                }
                              })
                            }
                            placeholder="No limit"
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Main Content */}
                  <div className="lg:col-span-3">
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="builder" className="flex items-center gap-2">
                          <Settings className="h-4 w-4" />
                          Builder
                        </TabsTrigger>
                        <TabsTrigger value="preview" className="flex items-center gap-2">
                          <Eye className="h-4 w-4" />
                          Preview
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value="builder" className="h-full">
                        <Card className="h-[calc(100vh-200px)]">
                          <CardContent className="p-0 h-full">
                            <QuestionnaireBuilder
                              questionnaire={questionnaire}
                              onUpdate={updateQuestionnaire}
                            />
                          </CardContent>
                        </Card>
                      </TabsContent>

                      <TabsContent value="preview" className="h-full">
                        <Card className="h-[calc(100vh-200px)] overflow-auto">
                          <CardContent className="p-0">
                            <QuestionnairePreview questionnaire={questionnaire} />
                          </CardContent>
                        </Card>
                      </TabsContent>
                    </Tabs>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
