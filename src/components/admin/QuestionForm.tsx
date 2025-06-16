import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Plus, Trash2, GripVertical } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

interface QuestionFormProps {
  onClose: () => void;
  onSave: (question: any) => void;
  initialData?: any;
}

export function QuestionForm({ onClose, onSave, initialData }: QuestionFormProps) {
  const [question, setQuestion] = useState({
    type: 'mcq',
    stem: '',
    options: [''],
    correctAnswers: [],
    explanation: '',
    points: 1,
    timeLimit: 0,
    tags: [],
    matchingPairs: [
      { id: '1', left: '', right: '' },
      { id: '2', left: '', right: '' },
      { id: '3', left: '', right: '' }
    ],
    shufflePairs: true,
    ...initialData
  });

  const handleAddMatchingPair = () => {
    setQuestion(q => ({
      ...q,
      matchingPairs: [
        ...q.matchingPairs,
        { id: Date.now().toString(), left: '', right: '' }
      ]
    }));
  };

  const handleRemoveMatchingPair = (id: string) => {
    setQuestion(q => ({
      ...q,
      matchingPairs: q.matchingPairs.filter(pair => pair.id !== id)
    }));
  };

  const handleUpdateMatchingPair = (id: string, field: 'left' | 'right', value: string) => {
    setQuestion(q => ({
      ...q,
      matchingPairs: q.matchingPairs.map(pair =>
        pair.id === id ? { ...pair, [field]: value } : pair
      )
    }));
  };

  const renderMatchingQuestionForm = () => (
    <div className="space-y-4">
      <div>
        <Label>Question Text</Label>
        <Textarea
          value={question.stem}
          onChange={e => setQuestion(q => ({ ...q, stem: e.target.value }))}
          placeholder="Enter the matching question text..."
          rows={3}
        />
      </div>

      <div className="flex items-center justify-between">
        <Label>Matching Pairs</Label>
        <div className="flex items-center gap-2">
          <Label htmlFor="shufflePairs" className="text-sm">Shuffle Pairs</Label>
          <Switch
            id="shufflePairs"
            checked={question.shufflePairs}
            onCheckedChange={checked => setQuestion(q => ({ ...q, shufflePairs: checked }))}
          />
        </div>
      </div>

      <ScrollArea className="h-[300px] pr-4">
        <div className="space-y-3">
          {question.matchingPairs.map((pair, index) => (
            <div key={pair.id} className="flex items-start gap-3 p-4 border rounded-lg bg-gray-50">
              <div className="flex items-center gap-2 pt-1">
                <GripVertical className="h-5 w-5 text-gray-400 cursor-move" />
                <div className="text-sm font-medium text-gray-500">{index + 1}</div>
              </div>
              <div className="flex-1 grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-sm">Left Item</Label>
                  <Input
                    value={pair.left}
                    onChange={e => handleUpdateMatchingPair(pair.id, 'left', e.target.value)}
                    placeholder="Enter left item..."
                  />
                </div>
                <div>
                  <Label className="text-sm">Right Item</Label>
                  <Input
                    value={pair.right}
                    onChange={e => handleUpdateMatchingPair(pair.id, 'right', e.target.value)}
                    placeholder="Enter right item..."
                  />
                </div>
              </div>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() => handleRemoveMatchingPair(pair.id)}
                className="pt-1"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </ScrollArea>

      <Button
        type="button"
        variant="outline"
        onClick={handleAddMatchingPair}
        className="w-full"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Matching Pair
      </Button>

      <div>
        <Label>Points</Label>
        <Input
          type="number"
          min="1"
          value={question.points}
          onChange={e => setQuestion(q => ({ ...q, points: parseInt(e.target.value) || 1 }))}
          className="w-32"
        />
      </div>

      <div>
        <Label>Explanation (Optional)</Label>
        <Textarea
          value={question.explanation}
          onChange={e => setQuestion(q => ({ ...q, explanation: e.target.value }))}
          placeholder="Explain the correct matches..."
          rows={3}
        />
      </div>
    </div>
  );

  const renderQuestionForm = () => {
    switch (question.type) {
      case 'matching':
        return renderMatchingQuestionForm();
      // ... other question type forms ...
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">
            {initialData ? 'Edit Question' : 'Add Question'}
          </h2>
          <Button variant="ghost" onClick={onClose}>×</Button>
        </div>

        <div className="p-6 flex-1 overflow-y-auto">
          <div className="space-y-6">
            <div>
              <Label>Question Type</Label>
              <Select
                value={question.type}
                onValueChange={type => setQuestion(q => ({ ...q, type }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mcq">Multiple Choice</SelectItem>
                  <SelectItem value="true-false">True/False</SelectItem>
                  <SelectItem value="fill-blank">Fill in the Blank</SelectItem>
                  <SelectItem value="matching">Matching</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {renderQuestionForm()}
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 p-6 border-t">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={() => onSave(question)}>Save Question</Button>
        </div>
      </div>
    </div>
  );
} 