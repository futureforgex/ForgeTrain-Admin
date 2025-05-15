import { GripVertical, Eye, Edit, MoreVertical, LayoutGrid, List, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface ModuleListProps {
  modules: any[]; // or your Module type
  loading?: boolean;
  onEditModule: (module: any) => void;
  onViewModule: (module: any) => void;
  viewMode: 'table' | 'card';
  onViewModeChange: (mode: 'table' | 'card') => void;
}

export function ModuleList({ modules, loading, onEditModule, onViewModule, viewMode, onViewModeChange }: ModuleListProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'live':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      case 'archived':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const renderTableView = () => (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="w-10 px-6 py-3"></th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thumbnail</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title & Description</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Track</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lessons</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Edited</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
                {modules.map((module, index) => (
            <tr key={module.id} className="hover:bg-indigo-50 transition-colors cursor-pointer">
                        <td className="px-6 py-4">
                            <GripVertical className="h-5 w-5 text-gray-400" />
              </td>
              <td className="px-6 py-4">
                {module.thumbnailUrl ? (
                  <img
                    src={module.thumbnailUrl}
                    alt="Thumbnail"
                    className="w-12 h-12 object-cover rounded shadow border"
                  />
                ) : (
                  <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center text-gray-400">
                    <ImageIcon />
                          </div>
                )}
                        </td>
                        <td className="px-6 py-4">
                <div className="text-sm font-semibold text-gray-900">{module.title}</div>
                <div className="text-sm text-gray-500">{module.subtitle || module.description}</div>
                        </td>
                        <td className="px-6 py-4">
                          <Badge variant="outline">{module.track}</Badge>
                        </td>
                        <td className="px-6 py-4">
                <Badge className={getStatusColor(module.status)}>{module.status}</Badge>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                {module.lessons ? module.lessons.length : 0} lessons
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                <div>{module.lastEdited || '-'}</div>
                <div className="text-xs">{module.editor || '-'}</div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => onEditModule(module)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onViewModule(module)}>
                                <Eye className="mr-2 h-4 w-4" />
                                Preview
                              </DropdownMenuItem>
                              <DropdownMenuItem>Clone</DropdownMenuItem>
                              <DropdownMenuItem>Archive</DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                ))}
              </tbody>
      </table>
    </div>
  );

  const renderCardView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules.map((module, index) => (
        <div key={module.id} className="bg-white rounded-2xl shadow-lg p-0 hover:shadow-xl transition-shadow border flex flex-col overflow-hidden">
          {module.thumbnailUrl ? (
            <img
              src={module.thumbnailUrl}
              alt="Thumbnail"
              className="w-full h-40 object-cover rounded-t-2xl border-b"
            />
          ) : (
            <div className="w-full h-40 bg-gray-100 flex items-center justify-center text-gray-400 border-b">
              <ImageIcon />
            </div>
          )}
          <div className="p-4 flex-1 flex flex-col">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{module.title}</h3>
                <p className="text-sm text-gray-500 mb-2">{module.subtitle || module.description}</p>
                <div className="flex flex-wrap gap-2 mb-2">
                  <Badge variant="outline">{module.track}</Badge>
                  <Badge className={getStatusColor(module.status)}>{module.status}</Badge>
                </div>
                <div className="text-xs text-gray-400">
                  {module.lessons ? module.lessons.length : 0} lessons
                </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => onEditModule(module)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onViewModule(module)}>
                            <Eye className="mr-2 h-4 w-4" />
                            Preview
                          </DropdownMenuItem>
                          <DropdownMenuItem>Clone</DropdownMenuItem>
                          <DropdownMenuItem>Archive</DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    </div>
                  </div>
            ))}
          </div>
  );

  return (
    <div>
      <div className="flex justify-end mb-4">
        <div className="flex items-center gap-2 bg-white rounded-lg shadow p-1">
          <Button
            variant={viewMode === 'table' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onViewModeChange('table')}
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'card' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onViewModeChange('card')}
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
        </div>
      </div>
      {viewMode === 'table' ? renderTableView() : renderCardView()}
    </div>
  );
} 