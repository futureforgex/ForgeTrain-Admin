import { useState } from 'react';
import { CourseModule, ModuleComponent } from '../lib/types';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { Plus, Edit, Trash2, Lock, CheckCircle, PlayCircle } from 'lucide-react';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

const initialModule: CourseModule = {
  id: '1',
  title: 'Python Lists and Loops',
  description: 'Learn how to work with lists and loops in Python through a tutorial, quizzes, coding challenges, and a capstone project.',
  learningObjectives: [
    'Understand list creation, manipulation, and iteration',
    'Apply loops to process lists',
    'Build a functional to-do list application'
  ],
  estimatedTime: '4-6 hours',
  components: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export default function LearningResources() {
  const [module, setModule] = useState<CourseModule>(initialModule);
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  // Fetch components from Firebase
  const fetchComponents = async () => {
    try {
      const componentsRef = collection(db, 'moduleComponents');
      const snapshot = await getDocs(componentsRef);
      const components: ModuleComponent[] = [];
      
      snapshot.forEach((doc) => {
        components.push({ id: doc.id, ...doc.data() } as ModuleComponent);
      });

      // Sort components by order
      components.sort((a, b) => a.order - b.order);
      
      setModule(prev => ({
        ...prev,
        components
      }));

      // Calculate progress
      const completedCount = components.filter(c => c.isCompleted).length;
      setProgress((completedCount / components.length) * 100);
    } catch (error) {
      console.error('Error fetching components:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Update component completion status
  const updateComponentStatus = async (componentId: string, isCompleted: boolean) => {
    try {
      const componentRef = doc(db, 'moduleComponents', componentId);
      await updateDoc(componentRef, { isCompleted });
      
      // Update local state
      setModule(prev => ({
        ...prev,
        components: prev.components.map(c => 
          c.id === componentId ? { ...c, isCompleted } : c
        )
      }));

      // Recalculate progress
      const completedCount = module.components.filter(c => c.isCompleted).length;
      setProgress((completedCount / module.components.length) * 100);
    } catch (error) {
      console.error('Error updating component status:', error);
    }
  };

  // Check if a component should be locked
  const isComponentLocked = (component: ModuleComponent) => {
    if (component.order === 1) return false;
    const previousComponent = module.components.find(c => c.order === component.order - 1);
    return !previousComponent?.isCompleted;
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{module.title}</h1>
        <p className="text-gray-600 mb-4">{module.description}</p>
        
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2">Learning Objectives</h2>
          <ul className="list-disc list-inside space-y-1">
            {module.learningObjectives.map((objective, index) => (
              <li key={index} className="text-gray-700">{objective}</li>
            ))}
          </ul>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Module Progress</span>
            <span className="text-sm text-gray-600">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </div>

      <div className="space-y-4">
        {module.components.map((component) => {
          const isLocked = isComponentLocked(component);
          
          return (
            <Card key={component.id} className={isLocked ? 'opacity-60' : ''}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {component.isCompleted ? (
                      <CheckCircle className="h-6 w-6 text-green-500" />
                    ) : isLocked ? (
                      <Lock className="h-6 w-6 text-gray-400" />
                    ) : (
                      <PlayCircle className="h-6 w-6 text-blue-500" />
                    )}
                    <div>
                      <CardTitle>{component.title}</CardTitle>
                      <CardDescription>{component.description}</CardDescription>
                    </div>
                  </div>
                  <Badge variant="secondary">
                    {component.content[component.type]?.duration}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div className="space-y-1">
                    <p className="text-sm text-gray-600">
                      {component.type === 'tutorial' && 'Complete the tutorial to unlock the quiz'}
                      {component.type === 'quiz' && 'Pass the quiz to unlock code challenges'}
                      {component.type === 'code-challenge' && 'Complete the challenges to unlock the project'}
                      {component.type === 'project' && 'Build the final project to complete the module'}
                    </p>
                  </div>
                  <Button
                    variant={component.isCompleted ? "outline" : "default"}
                    disabled={isLocked}
                    onClick={() => updateComponentStatus(component.id, !component.isCompleted)}
                  >
                    {component.isCompleted ? 'Mark as Incomplete' : 'Mark as Complete'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
} 