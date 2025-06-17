import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { X, Plus } from 'lucide-react';

interface QuestionFormProps {
  onClose: () => void;
  onSave: (question: any) => void;
  initialData?: any;
}

export function QuestionForm({ onClose, onSave, initialData }: QuestionFormProps) {
  const [question, setQuestion] = useState({
    type: initialData?.type || 'mcq',
    stem: initialData?.stem || '',
    options: initialData?.options || ['', '', '', ''],
    correctAnswers: initialData?.correctAnswers || [],
    explanation: initialData?.explanation || '',
    mediaUrl: initialData?.mediaUrl || '',
    points: initialData?.points || 1,
    timeLimit: initialData?.timeLimit || 0,
    tags: initialData?.tags || [],
  });

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...question.options];
    newOptions[index] = value;
    setQuestion({ ...question, options: newOptions });
  };

  const handleCorrectAnswerChange = (value: string) => {
    if (question.type === 'mcq') {
      const newCorrectAnswers = question.correctAnswers.includes(value)
        ? question.correctAnswers.filter(a => a !== value)
        : [...question.correctAnswers, value];
      setQuestion({ ...question, correctAnswers: newCorrectAnswers });
    } else {
      setQuestion({ ...question, correctAnswers: [value] });
    }
  };

  const handleAddOption = () => {
    setQuestion({ ...question, options: [...question.options, ''] });
  };

  const handleRemoveOption = (index: number) => {
    const newOptions = question.options.filter((_, i) => i !== index);
    setQuestion({ ...question, options: newOptions });
  };

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const input = e.target as HTMLInputElement;
      const value = input.value.trim();
      if (value && !question.tags.includes(value)) {
        setQuestion({ ...question, tags: [...question.tags, value] });
        input.value = '';
      }
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

        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            {/* Question Type */}
            <div>
              <Label>Question Type</Label>
              <RadioGroup
                value={question.type}
                onValueChange={(value) => setQuestion({ ...question, type: value })}
                className="flex gap-4 mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="mcq" id="mcq" />
                  <Label htmlFor="mcq">Multiple Choice</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="true-false" id="true-false" />
                  <Label htmlFor="true-false">True/False</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="fill-blank" id="fill-blank" />
                  <Label htmlFor="fill-blank">Fill in the Blank</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="matching" id="matching" />
                  <Label htmlFor="matching">Matching</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Question Stem */}
            <div>
              <Label>Question</Label>
              <Textarea
                value={question.stem}
                onChange={(e) => setQuestion({ ...question, stem: e.target.value })}
                placeholder="Enter your question..."
                rows={4}
              />
            </div>

            {/* Options */}
            {question.type === 'mcq' && (
              <div className="space-y-4">
                <Label>Options</Label>
                {question.options.map((option, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={question.correctAnswers.includes(option)}
                      onChange={() => handleCorrectAnswerChange(option)}
                      className="h-4 w-4"
                    />
                    <Input
                      value={option}
                      onChange={(e) => handleOptionChange(index, e.target.value)}
                      placeholder={`Option ${index + 1}`}
                    />
                    {question.options.length > 2 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveOption(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  variant="outline"
                  onClick={handleAddOption}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Option
                </Button>
              </div>
            )}

            {question.type === 'true-false' && (
              <div className="space-y-4">
                <Label>Correct Answer</Label>
                <RadioGroup
                  value={question.correctAnswers[0] || ''}
                  onValueChange={(value) => handleCorrectAnswerChange(value)}
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="true" id="true" />
                    <Label htmlFor="true">True</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="false" id="false" />
                    <Label htmlFor="false">False</Label>
                  </div>
                </RadioGroup>
              </div>
            )}

            {question.type === 'fill-blank' && (
              <div>
                <Label>Correct Answer</Label>
                <Input
                  value={question.correctAnswers[0] || ''}
                  onChange={(e) => handleCorrectAnswerChange(e.target.value)}
                  placeholder="Enter the correct answer..."
                />
              </div>
            )}

            {/* Explanation */}
            <div>
              <Label>Explanation (Optional)</Label>
              <Textarea
                value={question.explanation}
                onChange={(e) => setQuestion({ ...question, explanation: e.target.value })}
                placeholder="Explain the correct answer..."
                rows={3}
              />
            </div>

            {/* Points and Time Limit */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Points</Label>
                <Input
                  type="number"
                  value={question.points}
                  onChange={(e) => setQuestion({ ...question, points: parseInt(e.target.value) })}
                  min={1}
                />
              </div>
              <div>
                <Label>Time Limit (seconds, optional)</Label>
                <Input
                  type="number"
                  value={question.timeLimit}
                  onChange={(e) => setQuestion({ ...question, timeLimit: parseInt(e.target.value) })}
                  min={0}
                />
              </div>
            </div>

            {/* Tags */}
            <div>
              <Label>Tags</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {question.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                    <button
                      className="ml-1"
                      onClick={() => setQuestion({
                        ...question,
                        tags: question.tags.filter(t => t !== tag)
                      })}
                    >
                      ×
                    </button>
                  </Badge>
                ))}
                <Input
                  placeholder="Add tag..."
                  className="w-32"
                  onKeyDown={handleAddTag}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between p-6 border-t">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={() => onSave(question)}>
            Save Question
          </Button>
        </div>
      </div>
    </div>
  );
} 