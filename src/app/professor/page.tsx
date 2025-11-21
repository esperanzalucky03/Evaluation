"use client";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Trash2, Copy, Settings, GripVertical } from "lucide-react";

interface Professor {
  id: string;
  name: string;
}

export default function ProfessorPage() {
  const [professors, setProfessors] = useState<Professor[]>([]);
  const [selectedProfessorId, setSelectedProfessorId] = useState<string | null>(null);
  const [input, setInput] = useState("");

  const addProfessor = () => {
    if (input.trim()) {
      const newProfessor: Professor = {
        id: `professor-${Date.now()}`,
        name: input.trim(),
      };
      setProfessors([...professors, newProfessor]);
      setInput("");
      setSelectedProfessorId(newProfessor.id);
    }
  };

  const updateProfessor = (id: string, name: string) => {
    setProfessors(professors.map(p => p.id === id ? { ...p, name } : p));
  };

  const deleteProfessor = (id: string) => {
    setProfessors(professors.filter(p => p.id !== id));
    if (selectedProfessorId === id) setSelectedProfessorId(null);
  };

  const duplicateProfessor = (id: string) => {
    const prof = professors.find(p => p.id === id);
    if (!prof) return;
    const dup: Professor = { ...prof, id: `professor-${Date.now()}`, name: `${prof.name} (Copy)` };
    setProfessors([...professors, dup]);
  };

  const selectedProfessor = professors.find(p => p.id === selectedProfessorId);

  return (
    <div className="flex h-full">
      {/* Professors List */}
      <div className="w-1/3 border-r bg-gray-50/50 p-4">
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Professors</h3>
          <div className="flex gap-2 mb-2">
            <Input
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Add professor name"
              className="flex-1"
            />
            <Button onClick={addProfessor} variant="outline">Add</Button>
          </div>
        </div>
        <Separator className="my-4" />
        <div className="space-y-2">
          {professors.map((professor) => (
            <Card
              key={professor.id}
              className={`cursor-pointer ${selectedProfessorId === professor.id ? "border-blue-500" : ""}`}
              onClick={() => setSelectedProfessorId(professor.id)}
            >
              <CardContent className="p-3 flex items-center gap-2">
                <GripVertical className="h-4 w-4 text-gray-400" />
                <span className="text-sm font-medium flex-1">{professor.name}</span>
                <Badge variant="secondary" className="text-xs">Professor</Badge>
                <Button variant="ghost" size="icon" onClick={e => { e.stopPropagation(); duplicateProfessor(professor.id); }}>
                  <Copy className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={e => { e.stopPropagation(); deleteProfessor(professor.id); }}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      {/* Professor Editor */}
      <div className="flex-1 p-4">
        {selectedProfessor ? (
          <Card>
            <CardContent>
              <Input
                value={selectedProfessor.name}
                onChange={e => updateProfessor(selectedProfessor.id, e.target.value)}
                placeholder="Edit professor name"
              />
            </CardContent>
          </Card>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            <div className="text-center">
              <Settings className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium mb-2">No Professor Selected</h3>
              <p className="text-sm">Select a professor from the list to edit their name</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}