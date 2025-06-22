import { GripVertical, Eye, Edit, MoreVertical, LayoutGrid, List, Image as ImageIcon, Archive, Copy, Trash2, Clock, Tag, Book, Video, Code, FileText, CheckSquare, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { serverDate } from "firebase/firestore";
import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';

interface ModuleListProps {
  modules: any[]; // or your Module type
  loading?: boolean;
  onEditModule: (module: any) => void;
  onViewModule: (module: any) => void;
  onCloneModule: (module: any) => void;
  onArchiveModule: (module: any) => void;
  onDeleteModule: (module: any) => void;
  viewMode: 'table' | 'card';
  onViewModeChange: (mode: 'table' | 'card') => void;
}

export function ModuleList({
  modules,
  loading,
  onEditModule,
  onViewModule,
  onCloneModule,
  onArchiveModule,
  onDeleteModule,
  viewMode,
  onViewModeChange,
}: ModuleListProps) {
  const [selectedModule, setSelectedModule] = useState<any>(null);

  const getLessonCounts = (module: any) => {
    const lessons = module.lessons || [];
    return {
      text: lessons.filter((l: any) => l.type === 'text').length,
      video: lessons.filter((l: any) => l.type === 'video').length,
      quiz: lessons.filter((l: any) => l.type === 'quiz').length,
      code: lessons.filter((l: any) => l.type === 'code').length,
      project: lessons.filter((l: any) => l.type === 'project').length,
      total: lessons.length
    };
  };

  const handleAction = (module: any, action: string) => {
    setSelectedModule(module);
    switch (action) {
      case 'edit':
        onEditModule(module);
        break;
      case 'view':
        onViewModule(module);
        break;
      case 'clone':
        onCloneModule(module);
        break;
      case 'archive':
        onArchiveModule(module);
        break;
      case 'delete':
        onDeleteModule(module);
        break;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  );
  }

  if (modules.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[200px] text-gray-500 space-y-2">
        <p className="text-lg">No modules found</p>
        <p className="text-sm">Create your first module to get started</p>
          </div>
  );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-500">
          {modules.length} {modules.length === 1 ? 'module' : 'modules'}
        </div>
        <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
          <Button
            variant={viewMode === 'table' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onViewModeChange('table')}
            className="h-8 px-3"
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'card' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onViewModeChange('card')}
            className="h-8 px-3"
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {viewMode === 'table' ? (
        <div className="rounded-lg border bg-white">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Image</TableHead>
                <TableHead className="w-[30%]">Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Tags</TableHead>
                <TableHead>Lessons</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead className="w-[80px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {modules.map((module) => {
                const lessonCounts = getLessonCounts(module);
                return (
                  <TableRow key={module.id}>
                    <TableCell>
                      {module.thumbnailUrl ? (
                        <img
                          src={module.thumbnailUrl}
                          alt={module.title}
                          className="w-12 h-12 object-cover rounded-md"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center">
                          <ImageIcon className="h-6 w-6 text-gray-400" />
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">{module.title}</span>
                        <span className="text-sm text-gray-500 line-clamp-1">{module.description}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={module.is_archived ? "secondary" : "default"}
                        className={module.is_archived ? "bg-gray-100" : "bg-green-100 text-green-700"}
                      >
                        {module.is_archived ? 'Archived' : module.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {module.tags?.slice(0, 2).map((tag: string) => (
                          <Badge key={tag} variant="outline" className="bg-gray-50">
                            {tag}
                          </Badge>
                        ))}
                        {module.tags?.length > 2 && (
                          <Badge variant="outline" className="bg-gray-50">
                            +{module.tags.length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-sm">
                          <FileText className="h-3 w-3 text-blue-500" />
                          <span>{lessonCounts.text}</span>
                          <Video className="h-3 w-3 text-red-500" />
                          <span>{lessonCounts.video}</span>
                          <CheckSquare className="h-3 w-3 text-green-500" />
                          <span>{lessonCounts.quiz}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Code className="h-3 w-3 text-purple-500" />
                          <span>{lessonCounts.code}</span>
                          <Briefcase className="h-3 w-3 text-orange-500" />
                          <span>{lessonCounts.project}</span>
                          <span className="text-gray-500">({lessonCounts.total} total)</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Clock className="h-3 w-3" />
                        {module.updated_at?.toDate().toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[160px]">
                          <DropdownMenuItem onClick={() => handleAction(module, 'view')}>
                            <Eye className="mr-2 h-4 w-4" />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleAction(module, 'edit')}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleAction(module, 'clone')}>
                            <Copy className="mr-2 h-4 w-4" />
                            Clone
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleAction(module, 'archive')}>
                            <Archive className="mr-2 h-4 w-4" />
                            {module.is_archived ? 'Unarchive' : 'Archive'}
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleAction(module, 'delete')}
                            className="text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {modules.map((module) => {
            const lessonCounts = getLessonCounts(module);
            return (
              <Card key={module.id} className="hover:shadow-md transition-shadow">
                <div className="relative h-40">
                  {module.thumbnailUrl ? (
                    <img
                      src={module.thumbnailUrl}
                      alt={module.title}
                      className="w-full h-full object-cover rounded-t-lg"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100 rounded-t-lg flex items-center justify-center">
                      <ImageIcon className="h-12 w-12 text-gray-400" />
                    </div>
                  )}
                </div>
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg font-medium line-clamp-1">{module.title}</CardTitle>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-[160px]">
                        <DropdownMenuItem onClick={() => handleAction(module, 'view')}>
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleAction(module, 'edit')}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleAction(module, 'clone')}>
                          <Copy className="mr-2 h-4 w-4" />
                          Clone
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleAction(module, 'archive')}>
                          <Archive className="mr-2 h-4 w-4" />
                          {module.is_archived ? 'Unarchive' : 'Archive'}
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleAction(module, 'delete')}
                          className="text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500 line-clamp-2 mb-3">{module.description}</p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <Badge 
                      variant={module.is_archived ? "secondary" : "default"}
                      className={module.is_archived ? "bg-gray-100" : "bg-green-100 text-green-700"}
                    >
                      {module.is_archived ? 'Archived' : module.status}
                    </Badge>
                    {module.tags?.slice(0, 2).map((tag: string) => (
                      <Badge key={tag} variant="outline" className="bg-gray-50">
                        {tag}
                      </Badge>
                    ))}
                    {module.tags?.length > 2 && (
                      <Badge variant="outline" className="bg-gray-50">
                        +{module.tags.length - 2}
                      </Badge>
                    )}
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <FileText className="h-3 w-3 text-blue-500" />
                        <span>{lessonCounts.text}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Video className="h-3 w-3 text-red-500" />
                        <span>{lessonCounts.video}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <CheckSquare className="h-3 w-3 text-green-500" />
                        <span>{lessonCounts.quiz}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Code className="h-3 w-3 text-purple-500" />
                        <span>{lessonCounts.code}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Briefcase className="h-3 w-3 text-orange-500" />
                        <span>{lessonCounts.project}</span>
                      </div>
                      <div className="text-gray-500">
                        {lessonCounts.total} total
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-1 text-sm text-gray-500">
                    <Clock className="h-3 w-3" />
                    {module.updated_at?.toDate().toLocaleDateString()}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
} 