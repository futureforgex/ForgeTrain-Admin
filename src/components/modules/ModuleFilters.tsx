import { useState } from 'react';
import { Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

const TRACKS = [
  { id: 'syntax-bootcamp', label: 'Syntax Bootcamp' },
  { id: 'dsa-roadmap', label: 'DSA Roadmap' },
  { id: 'projects', label: 'Projects' },
];

const STATUSES = [
  { id: 'live', label: 'Live' },
  { id: 'draft', label: 'Draft' },
  { id: 'archived', label: 'Archived' },
];

const COMMON_TAGS = [
  'Arrays',
  'Recursion',
  'Beginner',
  'Advanced',
  'Intermediate',
  'Algorithms',
  'Data Structures',
];

export function ModuleFilters() {
  const [selectedTrack, setSelectedTrack] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [customTag, setCustomTag] = useState('');

  const handleAddTag = (tag: string) => {
    if (tag && !selectedTags.includes(tag)) {
      setSelectedTags([...selectedTags, tag]);
      setCustomTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setSelectedTags(selectedTags.filter(tag => tag !== tagToRemove));
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-6">
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <Filter size={20} className="text-gray-500" />
          <span className="text-sm font-medium">Filters:</span>
        </div>

        <Select value={selectedTrack} onValueChange={setSelectedTrack}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Track" />
          </SelectTrigger>
          <SelectContent>
            {TRACKS.map(track => (
              <SelectItem key={track.id} value={track.id}>
                {track.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Status" />
          </SelectTrigger>
          <SelectContent>
            {STATUSES.map(status => (
              <SelectItem key={status.id} value={status.id}>
                {status.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex items-center gap-2">
          <Input
            placeholder="Add tag..."
            value={customTag}
            onChange={(e) => setCustomTag(e.target.value)}
            className="w-[150px]"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleAddTag(customTag);
              }
            }}
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleAddTag(customTag)}
          >
            Add
          </Button>
        </div>
      </div>

      {/* Selected Tags */}
      <div className="mt-4 flex flex-wrap gap-2">
        {COMMON_TAGS.map(tag => (
          <Badge
            key={tag}
            variant={selectedTags.includes(tag) ? 'default' : 'outline'}
            className="cursor-pointer"
            onClick={() => {
              if (selectedTags.includes(tag)) {
                handleRemoveTag(tag);
              } else {
                handleAddTag(tag);
              }
            }}
          >
            {tag}
          </Badge>
        ))}
      </div>

      {/* Active Filters */}
      {selectedTags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {selectedTags.map(tag => (
            <Badge
              key={tag}
              variant="secondary"
              className="cursor-pointer"
              onClick={() => handleRemoveTag(tag)}
            >
              {tag} ×
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
} 