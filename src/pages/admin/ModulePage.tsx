import { useState, useEffect } from 'react';
import { Search, Plus, MoreVertical, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ModuleList } from '@/components/modules/ModuleList';
import { ModuleEditor } from '@/components/modules/ModuleEditor';
import { ModuleFilters } from '@/components/modules/ModuleFilters';
import { AddLessonModal } from '@/components/modules/AddLessonModal';
import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

const ModulePage = () => {
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [selectedModule, setSelectedModule] = useState(null);
  const [viewMode, setViewMode] = useState<'table' | 'card'>('table');
  const [addLessonOpen, setAddLessonOpen] = useState(false);
  const [lessons, setLessons] = useState([]);
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchModules = async () => {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, "modules"));
      const modulesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setModules(modulesData);
      setLoading(false);
    };
    fetchModules();
  }, []);

  const handleAddModule = () => {
    setSelectedModule(null);
    setIsEditorOpen(true);
  };

  const handleEditModule = (module) => {
    setSelectedModule(module);
    setIsEditorOpen(true);
  };

  const handleAddLesson = (resource, type) => {
    setLessons([
      ...lessons,
      {
        id: resource.id,
        title: resource.title || resource.name,
        type,
        status: 'draft',
        resourceRef: resource, // store the full resource or a reference
      }
    ]);
    setAddLessonOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Modules</h1>
            <nav className="text-xs sm:text-sm text-gray-500 mt-1">
              <a href="/admin" className="hover:text-gray-700">Dashboard</a>
              <span className="mx-2">/</span>
              <span>Modules</span>
            </nav>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full sm:w-auto">
            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <Input
                placeholder="Search modules..."
                className="pl-10 w-full sm:w-64"
              />
            </div>
            <Button onClick={handleAddModule} className="w-full sm:w-auto">
              <Plus className="mr-2" size={20} />
              Add New Module
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full sm:w-auto">
                  <MoreVertical className="mr-2" size={20} />
                  Bulk Actions
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

        {/* Filters Section */}
        <div className="mb-6">
          <ModuleFilters />
        </div>

        {/* Main Content */}
        {loading && <div className="text-center py-8 text-gray-500">Loading modules...</div>}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 xl:gap-8 relative">
          <div className="xl:col-span-2">
            <ModuleList
              modules={modules}
              loading={loading}
              onEditModule={handleEditModule}
              onViewModule={() => {}}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
            />
          </div>

          {/* Editor Overlay for mobile, sidebar for desktop */}
          {isEditorOpen && (
            <>
              {/* Overlay background for mobile */}
              <div className="fixed inset-0 bg-black bg-opacity-30 z-40 xl:hidden transition-opacity" onClick={() => setIsEditorOpen(false)} />
              <div className="fixed inset-0 xl:static xl:col-span-1 z-50 flex items-center xl:items-start justify-center xl:justify-end">
                <div className="w-full h-full xl:h-auto xl:w-[32rem] max-w-full bg-white shadow-2xl rounded-none xl:rounded-l-2xl border-l border-gray-200 flex flex-col relative animate-slide-in">
                  {/* Close button for mobile */}
                  <button
                    className="absolute top-4 right-4 xl:hidden z-50 bg-white rounded-full p-2 shadow hover:bg-gray-100"
                    aria-label="Close editor"
                    onClick={() => setIsEditorOpen(false)}
                  >
                    <X className="h-6 w-6" />
                  </button>
                  <ModuleEditor
                    module={selectedModule}
                    onClose={() => setIsEditorOpen(false)}
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ModulePage; 