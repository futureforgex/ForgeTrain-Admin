import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  Plus,
  MoreVertical,
  Filter,
  ChevronDown,
  ChevronRight,
  Edit,
  Eye,
  Archive,
  Trash2,
  Copy,
  X,
  Info,
  Clock,
  Lock,
  CheckCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { ModuleForm } from '@/components/admin/ModuleForm';
import { firestore } from '@/lib/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { AddCodeChallengePanel } from '@/components/admin/AddCodeChallengePanel';

interface Module {
  id: string;
  title: string;
  description: string;
  track: 'syntax' | 'dsa' | 'projects';
  status: 'draft' | 'live' | 'archived';
  lessonCount: number;
  lastEdited: string;
  editor: string;
  tags: string[];
  thumbnail?: string;
}

export default function LearningContent() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTrack, setSelectedTrack] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isModuleFormOpen, setIsModuleFormOpen] = useState(false);
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddCodeChallengeOpen, setIsAddCodeChallengeOpen] = useState(false);

  // Fetch modules from Firestore
  const fetchModules = async () => {
    setLoading(true);
    setError(null);
    try {
      const q = query(collection(firestore, 'modules'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const data: Module[] = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Module));
      setModules(data);
    } catch (err) {
      setError('Failed to load modules');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchModules();
  }, []);

  // Refresh list after adding a module
  const handleModuleFormClose = () => {
    setIsModuleFormOpen(false);
    fetchModules();
  };

  // Filter modules based on search, track, status, tags
  const filteredModules = modules.filter((module) => {
    const matchesSearch =
      module.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      module.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTrack = selectedTrack ? module.track === selectedTrack : true;
    const matchesStatus = selectedStatus ? module.status === selectedStatus : true;
    // Tags filter can be implemented as needed
    return matchesSearch && matchesTrack && matchesStatus;
  });

  const handleAddModule = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsModuleFormOpen(true);
  };

  const handleEdit = (module: Module) => {
    setIsModuleFormOpen(true);
  };

  const handlePreview = (module: Module) => {
    // Implement preview logic here
  };

  const handleClone = (module: Module) => {
    // Implement clone logic here
  };

  const handleArchive = (module: Module) => {
    // Implement archive logic here
  };

  const handleDelete = async (moduleId: string) => {
    // Implement delete logic here
    await deleteModuleFromFirestore(moduleId);
    fetchModules();
  };

  const handleAddLesson = (module: Module) => {
    // Implement add lesson logic here
  };

  return (
    <div className="container mx-auto p-6">
      {/* Header & Global Controls */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
            <Link to="/admin/dashboard" className="hover:text-gray-700">
              Dashboard
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-gray-900">Learning Content</span>
          </div>
          <h1 className="text-2xl font-bold">Learning Content</h1>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search modules..."
              className="pl-10 w-64"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button onClick={handleAddModule} type="button">
            <Plus className="h-4 w-4 mr-2" />
            Add New Module
          </Button>
          <Button onClick={() => setIsAddCodeChallengeOpen(true)} type="button" variant="secondary">
            <Plus className="h-4 w-4 mr-2" />
            Add Code Challenge
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                Bulk Actions
                <ChevronDown className="h-4 w-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Publish Selected</DropdownMenuItem>
              <DropdownMenuItem>Unpublish Selected</DropdownMenuItem>
              <DropdownMenuItem>Delete Selected</DropdownMenuItem>
              <DropdownMenuItem>Export Selected</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-4 mb-6">
        <Select value={selectedTrack} onValueChange={setSelectedTrack}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filter by Track" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="syntax">Syntax Bootcamp</SelectItem>
            <SelectItem value="dsa">DSA Roadmap</SelectItem>
            <SelectItem value="projects">Projects</SelectItem>
          </SelectContent>
        </Select>

        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filter by Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="live">Live</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="outline" size="sm">
          <Filter className="h-4 w-4 mr-2" />
          Tags
        </Button>
      </div>

      {/* Add space between filters and grid */}
      <div className="mb-6" />

      {/* Loading/Error States */}
      {loading && <div className="text-center py-8">Loading modules...</div>}
      {error && <div className="text-center text-red-500 py-8">{error}</div>}

      {/* Card area with light background */}
      <div className="rounded-xl bg-gray-50 p-4 md:p-8">
        {/* Module List */}
        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
            {filteredModules.length === 0 ? (
              <div className="col-span-full text-center text-gray-500">No modules found.</div>
            ) : (
              filteredModules.map((module) => (
                <Card
                  key={module.id}
                  className="group p-0 overflow-hidden rounded-2xl shadow-sm border border-gray-200 bg-white transition-transform hover:shadow-lg hover:-translate-y-1 flex flex-col h-full cursor-pointer"
                >
                  {/* Thumbnail */}
                  <div className="flex justify-center items-center bg-gray-100 h-40">
                    {module.thumbnail ? (
                      <img
                        src={module.thumbnail}
                        alt="Thumbnail"
                        className="object-cover w-full h-full max-h-40 transition-transform group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center w-full h-full text-gray-300">
                        <svg width="48" height="48" fill="none" viewBox="0 0 24 24"><rect width="24" height="24" rx="12" fill="#e5e7eb"/><path d="M8 17l2.5-3.5 2.5 3.5h3l-4-6-4 6h3z" fill="#a3a3a3"/></svg>
                        <span className="text-xs">No Image</span>
                      </div>
                    )}
                  </div>
                  {/* Card Content */}
                  <div className="flex-1 flex flex-col p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-lg mb-1 line-clamp-2">{module.title}</h3>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-7 w-7">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem onClick={() => handleEdit(module)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handlePreview(module)}>
                            <Eye className="h-4 w-4 mr-2" />
                            Preview
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleClone(module)}>
                            <Copy className="h-4 w-4 mr-2" />
                            Clone
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleArchive(module)}>
                            <Archive className="h-4 w-4 mr-2" />
                            Archive
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(module.id)}>
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleAddLesson(module)}>
                            <Plus className="h-4 w-4 mr-2" />
                            Add Lesson
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2 min-h-[2.5em]">{module.description}</p>
                    <div className="flex flex-wrap gap-2 mb-3">
                      <Badge variant="secondary" className="rounded-full px-3 py-1 text-xs font-medium bg-indigo-100 text-indigo-700">
                        {module.track}
                      </Badge>
                      <Badge
                        variant={
                          module.status === 'live'
                            ? 'default'
                            : module.status === 'draft'
                            ? 'secondary'
                            : 'destructive'
                        }
                        className="rounded-full px-3 py-1 text-xs font-medium capitalize"
                      >
                        {module.status}
                      </Badge>
                      {/* Show tags as pill badges */}
                      {module.tags && module.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="rounded-full px-3 py-1 text-xs font-medium border-gray-300 bg-gray-100 text-gray-600">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex justify-between items-center text-xs text-gray-500 mt-auto pt-2 border-t border-gray-100">
                      <span>{module.lessonCount || 0} lessons</span>
                      <span>Last edited by {module.editor || 'N/A'}</span>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        )}
      </div>

      {/* Module Form Modal */}
      {isModuleFormOpen && (
        <ModuleForm onClose={handleModuleFormClose} />
      )}

      {/* AddCodeChallengePanel Modal */}
      {isAddCodeChallengeOpen && (
        <AddCodeChallengePanel onClose={() => setIsAddCodeChallengeOpen(false)} />
      )}
    </div>
  );
} 