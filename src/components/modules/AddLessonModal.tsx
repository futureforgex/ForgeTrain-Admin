import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Search, Video, FileText, Code, Target, HelpCircle, AlertCircle } from "lucide-react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface Resource {
  id: string;
  title: string;
  type: 'video' | 'text' | 'code' | 'project' | 'quiz';
  description?: string;
  duration?: number;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  tags?: string[];
  url?: string;
  content?: string;
}

interface ResourceGroup {
  label: string;
  type: Resource['type'];
  icon: React.ReactNode;
  items: Resource[];
}

interface AddLessonModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (resource: Resource, type: Resource['type']) => void;
  moduleId?: string;
}

const RESOURCE_TYPES: ResourceGroup[] = [
    {
      label: "Text Tutorials",
    type: "text",
    icon: <FileText className="h-5 w-5" />,
    items: []
    },
    {
      label: "Video Tutorials",
    type: "video",
    icon: <Video className="h-5 w-5" />,
    items: []
  },
  {
    label: "Code Exercises",
    type: "code",
    icon: <Code className="h-5 w-5" />,
    items: []
    },
  {
    label: "Projects",
    type: "project",
    icon: <Target className="h-5 w-5" />,
    items: []
  },
  {
    label: "Quizzes",
    type: "quiz",
    icon: <HelpCircle className="h-5 w-5" />,
    items: []
  }
];

export function AddLessonModal({ open, onClose, onSelect, moduleId }: AddLessonModalProps) {
  const [resources, setResources] = useState<ResourceGroup[]>(RESOURCE_TYPES);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<Resource['type']>("text");

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    setError(null);
    fetchResources();
  }, [open, moduleId]);

  const fetchResources = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch from each collection
      const [tutorialsSnap, videoTutorialsSnap, projectTasksSnap, challengesSnap, quizzesSnap] = await Promise.all([
        getDocs(collection(db, "tutorials")),
        getDocs(collection(db, "videoTutorials")),
        getDocs(collection(db, "projectTasks")),
        getDocs(collection(db, "challenges")),
        getDocs(collection(db, "quizzes")),
      ]);

      // Map each collection to Resource[]
      const tutorials = tutorialsSnap.docs.map(doc => ({
        id: doc.id,
        title: doc.data().title,
        type: "text" as Resource['type'],
        description: doc.data().description,
        tags: doc.data().tags || [],
        // ...other fields as needed
      }));

      const videoTutorials = videoTutorialsSnap.docs.map(doc => ({
        id: doc.id,
        title: doc.data().title,
        type: "video" as Resource['type'],
        description: doc.data().description,
        tags: doc.data().tags || [],
        // ...other fields as needed
      }));

      const projects = projectTasksSnap.docs.map(doc => ({
        id: doc.id,
        title: doc.data().title,
        type: "project" as Resource['type'],
        description: doc.data().description,
        tags: doc.data().tags || [],
        // ...other fields as needed
      }));

      const codeChallenges = challengesSnap.docs.map(doc => ({
        id: doc.id,
        title: doc.data().slug,
        type: "code" as Resource['type'],
        description: doc.data().description,
        tags: doc.data().editorTags || [],
        // ...other fields as needed
      }));

      const quizzes = quizzesSnap.docs.map(doc => ({
        id: doc.id,
        title: doc.data().title,
        type: "quiz" as Resource['type'],
        description: doc.data().description,
        tags: doc.data().tags || [],
        // ...other fields as needed
      }));

      // Combine all resources
      const allResources = [
        ...tutorials,
        ...videoTutorials,
        ...projects,
        ...codeChallenges,
        ...quizzes,
      ];

      // Group by type for your UI
      const groupedResources = RESOURCE_TYPES.map(group => ({
        ...group,
        items: allResources.filter(resource => resource.type === group.type)
      }));

      setResources(groupedResources);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to fetch resources. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const filteredResources = resources.map(group => ({
    ...group,
    items: group.items.filter((item: Resource) =>
      (item.title && item.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.tags && item.tags.some(tag => tag && tag.toLowerCase().includes(searchQuery.toLowerCase())))
    )
  }));

  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogTitle>Add Learning Resource</DialogTitle>
        <DialogDescription>
          Select a learning resource to add to your module. You can search and filter resources by type.
        </DialogDescription>
        
        <div className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <Input
              placeholder="Search resources..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as Resource['type'])}>
            <TabsList className="grid grid-cols-5">
              {resources.map(group => (
                <TabsTrigger key={group.type} value={group.type} className="flex items-center gap-2">
                  {group.icon}
                  {group.label}
                </TabsTrigger>
              ))}
            </TabsList>

        {loading ? (
              <div className="py-8 text-center text-gray-500">Loading resources...</div>
            ) : error ? (
              <div className="py-8 text-center">
                <Button variant="outline" onClick={fetchResources}>
                  Retry
                </Button>
              </div>
        ) : (
          resources.map(group => (
                <TabsContent key={group.type} value={group.type} className="mt-4">
                  {filteredResources.find(r => r.type === group.type)?.items.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      No {group.label.toLowerCase()} found
                    </div>
                  ) : (
                    <div className="grid gap-4">
                      {filteredResources
                        .find(r => r.type === group.type)
                        ?.items.map(item => (
                          <div
                            key={item.id}
                            className="flex items-start justify-between p-4 border rounded-lg hover:bg-gray-50"
                          >
                            <div className="space-y-1">
                              <h4 className="font-medium">{item.title}</h4>
                              {item.description && (
                                <p className="text-sm text-gray-500">{item.description}</p>
                              )}
                              <div className="flex flex-wrap gap-2">
                                {item.difficulty && (
                                  <Badge variant="outline">{item.difficulty}</Badge>
                                )}
                                {item.duration && (
                                  <Badge variant="outline">{item.duration} min</Badge>
                                )}
                                {item.tags?.map(tag => (
                                  <Badge key={tag} variant="secondary">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            <Button
                              size="sm"
                              onClick={() => onSelect(item, group.type)}
                            >
                      Add
                    </Button>
                          </div>
                ))}
            </div>
                  )}
                </TabsContent>
          ))
        )}
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}
