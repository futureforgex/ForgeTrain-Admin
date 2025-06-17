import React, { useEffect, useState } from 'react';
import { firestore } from '@/lib/firebase';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Eye, X } from 'lucide-react';
import { AddCodeChallengePanel } from '@/components/admin/AddCodeChallengePanel';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MarkdownPreview } from '@/components/ui/markdown-preview';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface Challenge {
  id: string;
  title: string;
  slug: string;
  difficulty: string;
  tags: string[];
  track?: string;
  description?: string;
  xp_points?: number;
  time_limit_ms?: number;
  memory_limit_mb?: number;
  input_constraints?: string;
  examples?: Array<{ input: string; output: string; explanation: string }>;
  hints?: string[];
  algorithm_overview?: string;
  step_by_step_solution?: Array<{ step_number: number; explanation: string; pseudocode: string }>;
  full_editorial?: string;
  discussion_enabled?: boolean;
  submissions_count?: number;
  accepted_count?: number;
  acceptance_rate?: number;
  company_tags?: string[];
  premium_only?: boolean;
  created_at?: any;
  updated_at?: any;
  version?: number;
}

export default function CodeChallenges() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  // Modal states
  const [editId, setEditId] = useState<string | null>(null);
  const [viewId, setViewId] = useState<string | null>(null);
  const [isAddPanelOpen, setIsAddPanelOpen] = useState(false);
  const [editInitialData, setEditInitialData] = useState<any>(null);

  const fetchChallenges = async () => {
    setLoading(true);
    setError(null);
    try {
      const snap = await getDocs(collection(firestore, 'challenges'));
      setChallenges(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Challenge)));
    } catch (err) {
      setError('Failed to load challenges');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChallenges();
  }, []);

  useEffect(() => {
    const fetchEditData = async () => {
      if (editId) {
        const challenge = challenges.find(c => c.id === editId);
        if (!challenge) return;
        // Fetch subcollections (remove hints)
        const [testCasesSnap, editorialStepsSnap] = await Promise.all([
          getDocs(collection(firestore, 'challenges', challenge.slug, 'testCases')),
          getDocs(collection(firestore, 'challenges', challenge.slug, 'editorialSteps')),
        ]);
        setEditInitialData({
          ...challenge,
          testCases: testCasesSnap.docs.map(doc => doc.data()),
          // Use hints from main doc only
          // hints: challenge.hints,
          editorialSteps: editorialStepsSnap.docs.map(doc => doc.data()),
        });
      } else {
        setEditInitialData(null);
      }
    };
    fetchEditData();
    // eslint-disable-next-line
  }, [editId]);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await deleteDoc(doc(firestore, 'challenges', id));
      setChallenges(challenges.filter(c => c.id !== id));
    } catch (err) {
      setError('Failed to delete challenge');
    } finally {
      setDeletingId(null);
    }
  };

  // Placeholder for edit and view data
  const selectedChallenge = challenges.find(c => c.id === viewId || c.id === editId);

  // Add this new function to format timestamps
  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'N/A';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleString();
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Code Challenges</h1>
        <Button onClick={() => setIsAddPanelOpen(true)}>
          + Add Code Challenge
        </Button>
      </div>
      {loading && <div className="text-center py-8">Loading...</div>}
      {error && <div className="text-center text-red-500 py-8">{error}</div>}
      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {challenges.length === 0 ? (
            <div className="col-span-full text-center text-gray-500">No code challenges found.</div>
          ) : (
            challenges.map(challenge => (
              <div key={challenge.id} className="bg-white rounded-xl shadow p-5 flex flex-col gap-2 border border-gray-100">
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold text-lg line-clamp-2">{challenge.title}</h2>
                  <div className="flex gap-2">
                    <Button size="icon" variant="ghost" onClick={() => setViewId(challenge.id)}><Eye className="h-4 w-4" /></Button>
                    <Button size="icon" variant="ghost" onClick={() => setEditId(challenge.id)}><Edit className="h-4 w-4" /></Button>
                    <Button size="icon" variant="ghost" onClick={() => handleDelete(challenge.id)} disabled={deletingId === challenge.id}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mb-1">
                  <Badge variant="secondary" className="capitalize">{challenge.difficulty}</Badge>
                  {challenge.tags && challenge.tags.map(tag => (
                    <Badge key={tag} variant="outline" className="text-xs border-gray-300 bg-gray-100 text-gray-600">{tag}</Badge>
                  ))}
                  {challenge.track && <Badge variant="secondary">{challenge.track}</Badge>}
                </div>
                <div className="text-xs text-gray-500">Slug: {challenge.slug}</div>
              </div>
            ))
          )}
        </div>
      )}
      {/* Add Code Challenge Panel */}
      {isAddPanelOpen && (
        <AddCodeChallengePanel onClose={() => { setIsAddPanelOpen(false); fetchChallenges(); }} />
      )}
      {/* View Modal */}
      {viewId && selectedChallenge && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold">{selectedChallenge.title}</h2>
              <Button variant="ghost" size="icon" onClick={() => setViewId(null)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <ScrollArea className="flex-1 p-6 max-h-[70vh]">
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="mb-4">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="examples">Examples</TabsTrigger>
                  <TabsTrigger value="solution">Solution</TabsTrigger>
                  <TabsTrigger value="analytics">Analytics</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-medium mb-2">Basic Info</h3>
                      <div className="space-y-2">
                        <div>
                          <span className="text-sm text-gray-500">Slug:</span>
                          <div className="font-mono text-sm">{selectedChallenge.slug}</div>
                        </div>
                        <div>
                          <span className="text-sm text-gray-500">Difficulty:</span>
                          <Badge variant="secondary" className="ml-2 capitalize">{selectedChallenge.difficulty}</Badge>
                        </div>
                        <div>
                          <span className="text-sm text-gray-500">XP Points:</span>
                          <span className="ml-2">{selectedChallenge.xp_points || 0}</span>
                        </div>
                        <div>
                          <span className="text-sm text-gray-500">Premium Only:</span>
                          <span className="ml-2">{selectedChallenge.premium_only ? 'Yes' : 'No'}</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-medium mb-2">Tags</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedChallenge.tags?.map(tag => (
                          <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                        ))}
                        {selectedChallenge.company_tags?.map(tag => (
                          <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium mb-2">Description</h3>
                    <div className="prose max-w-none">
                      <MarkdownPreview content={selectedChallenge.description || 'No description provided.'} />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="details" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-medium mb-2">Constraints</h3>
                      <div className="space-y-2">
                        <div>
                          <span className="text-sm text-gray-500">Time Limit:</span>
                          <span className="ml-2">{selectedChallenge.time_limit_ms || 0}ms</span>
                        </div>
                        <div>
                          <span className="text-sm text-gray-500">Memory Limit:</span>
                          <span className="ml-2">{selectedChallenge.memory_limit_mb || 0}MB</span>
                        </div>
                        <div>
                          <span className="text-sm text-gray-500">Input Constraints:</span>
                          <div className="mt-1 prose max-w-none">
                            <MarkdownPreview content={selectedChallenge.input_constraints || 'None specified'} />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-medium mb-2">Hints</h3>
                      <div className="space-y-2">
                        {selectedChallenge.hints?.length ? (
                          selectedChallenge.hints.map((hint, idx) => (
                            <div key={idx} className="p-3 bg-gray-50 rounded text-sm">
                              <div className="font-medium mb-1">Hint {idx + 1}:</div>
                              <MarkdownPreview content={hint} />
                            </div>
                          ))
                        ) : (
                          <div className="text-gray-500">No hints provided</div>
                        )}
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="examples" className="space-y-4">
                  {selectedChallenge.examples?.length ? (
                    selectedChallenge.examples.map((example, idx) => (
                      <div key={idx} className="border rounded-lg p-4">
                        <h3 className="font-medium mb-2">Example {idx + 1}</h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <span className="text-sm text-gray-500">Input:</span>
                            <SyntaxHighlighter
                              language="text"
                              style={vscDarkPlus}
                              className="mt-1 rounded-md"
                              customStyle={{ margin: 0 }}
                            >
                              {example.input}
                            </SyntaxHighlighter>
                          </div>
                          <div>
                            <span className="text-sm text-gray-500">Output:</span>
                            <SyntaxHighlighter
                              language="text"
                              style={vscDarkPlus}
                              className="mt-1 rounded-md"
                              customStyle={{ margin: 0 }}
                            >
                              {example.output}
                            </SyntaxHighlighter>
                          </div>
                        </div>
                        {example.explanation && (
                          <div className="mt-2">
                            <span className="text-sm text-gray-500">Explanation:</span>
                            <div className="mt-1 prose max-w-none">
                              <MarkdownPreview content={example.explanation} />
                            </div>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-gray-500">No examples provided</div>
                  )}
                </TabsContent>

                <TabsContent value="solution" className="space-y-4">
                  {selectedChallenge.algorithm_overview && (
                    <div>
                      <h3 className="font-medium mb-2">Algorithm Overview</h3>
                      <div className="prose max-w-none">
                        <MarkdownPreview content={selectedChallenge.algorithm_overview} />
                      </div>
                    </div>
                  )}
                  
                  {selectedChallenge.step_by_step_solution?.length ? (
                    <div>
                      <h3 className="font-medium mb-2">Step-by-Step Solution</h3>
                      <div className="space-y-4">
                        {selectedChallenge.step_by_step_solution.map((step, idx) => (
                          <div key={idx} className="border rounded-lg p-4">
                            <h4 className="font-medium mb-2">Step {step.step_number}</h4>
                            <div className="space-y-2">
                              <div>
                                <span className="text-sm text-gray-500">Explanation:</span>
                                <div className="mt-1 prose max-w-none">
                                  <MarkdownPreview content={step.explanation} />
                                </div>
                              </div>
                              {step.pseudocode && (
                                <div>
                                  <span className="text-sm text-gray-500">Pseudocode:</span>
                                  <SyntaxHighlighter
                                    language="python"
                                    style={vscDarkPlus}
                                    className="mt-1 rounded-md"
                                    customStyle={{ margin: 0 }}
                                  >
                                    {step.pseudocode}
                                  </SyntaxHighlighter>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-gray-500">No step-by-step solution provided</div>
                  )}

                  {selectedChallenge.full_editorial && (
                    <div>
                      <h3 className="font-medium mb-2">Full Editorial</h3>
                      <div className="prose max-w-none">
                        <MarkdownPreview content={selectedChallenge.full_editorial} />
                      </div>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="analytics" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-medium mb-2">Submission Stats</h3>
                      <div className="space-y-2">
                        <div>
                          <span className="text-sm text-gray-500">Total Submissions:</span>
                          <span className="ml-2">{selectedChallenge.submissions_count || 0}</span>
                        </div>
                        <div>
                          <span className="text-sm text-gray-500">Accepted Submissions:</span>
                          <span className="ml-2">{selectedChallenge.accepted_count || 0}</span>
                        </div>
                        <div>
                          <span className="text-sm text-gray-500">Acceptance Rate:</span>
                          <span className="ml-2">{selectedChallenge.acceptance_rate || 0}%</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-medium mb-2">Metadata</h3>
                      <div className="space-y-2">
                        <div>
                          <span className="text-sm text-gray-500">Created:</span>
                          <span className="ml-2">{formatDate(selectedChallenge.created_at)}</span>
                        </div>
                        <div>
                          <span className="text-sm text-gray-500">Last Updated:</span>
                          <span className="ml-2">{formatDate(selectedChallenge.updated_at)}</span>
                        </div>
                        <div>
                          <span className="text-sm text-gray-500">Version:</span>
                          <span className="ml-2">{selectedChallenge.version || 1}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </ScrollArea>
          </div>
        </div>
      )}
      {/* Edit Modal */}
      {editId && editInitialData && (
        <AddCodeChallengePanel initialData={editInitialData} onClose={() => { setEditId(null); fetchChallenges(); }} />
      )}
    </div>
  );
} 