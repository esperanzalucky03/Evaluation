"use client";
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Trash2, Copy, Settings } from "lucide-react";

interface EntityBuilderProps {
  title: string;
  entities: string[];
  onUpdate: (entities: string[]) => void;
}

export function EntityBuilder({ title, entities, onUpdate }: EntityBuilderProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [input, setInput] = useState("");

  const addEntity = () => {
    if (input.trim()) {
      onUpdate([...entities, input.trim()]);
      setInput("");
    }
  };

  const deleteEntity = (index: number) => {
    const updated = entities.filter((_, i) => i !== index);
    onUpdate(updated);
    if (selectedIndex === index) setSelectedIndex(null);
  };

  const duplicateEntity = (index: number) => {
    const updated = [...entities];
    updated.splice(index + 1, 0, `${entities[index]} (Copy)`);
    onUpdate(updated);
  };

  return (
    <div className="flex h-full">
      {/* Entities List */}
      <div className="w-1/3 border-r bg-gray-50/50 p-4">
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">{title}</h3>
          <div className="flex gap-2 mb-2">
            <Input
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder={`Add ${title.toLowerCase()}`}
              className="flex-1"
            />
            <Button onClick={addEntity} variant="outline">Add</Button>
          </div>
        </div>
        <Separator className="my-4" />
        <div className="space-y-2">
          {entities.map((entity, idx) => (
            <Card
              key={idx}
              className={`cursor-pointer ${selectedIndex === idx ? "border-blue-500" : ""}`}
              onClick={() => setSelectedIndex(idx)}
            >
              <CardContent className="p-3 flex items-center gap-2">
                <span className="text-sm font-medium flex-1">{entity}</span>
                <Button variant="ghost" size="icon" onClick={() => duplicateEntity(idx)}>
                  <Copy className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => deleteEntity(idx)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      {/* Entity Editor */}
      <div className="flex-1 p-4">
        {selectedIndex !== null ? (
          <Card>
            <CardHeader>
              <CardTitle>Edit {title}</CardTitle>
            </CardHeader>
            <CardContent>
              <Input
                value={entities[selectedIndex]}
                onChange={e => {
                  const updated = [...entities];
                  updated[selectedIndex] = e.target.value;
                  onUpdate(updated);
                }}
              />
            </CardContent>
          </Card>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            <div className="text-center">
              <Settings className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium mb-2">No {title} Selected</h3>
              <p className="text-sm">Select an item from the list to edit its properties</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}