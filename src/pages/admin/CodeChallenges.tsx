import React, { useEffect, useState } from 'react';
import { firestore } from '@/lib/firebase';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Eye } from 'lucide-react';
import { AddCodeChallengePanel } from '@/components/admin/AddCodeChallengePanel';

interface Challenge {
  id: string;
  title: string;
  slug: string;
  difficulty: string;
  tags: string[];
  track?: string;
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
        // Fetch subcollections
        const [testCasesSnap, hintsSnap, editorialStepsSnap] = await Promise.all([
          getDocs(collection(firestore, 'challenges', challenge.slug, 'testCases')),
          getDocs(collection(firestore, 'challenges', challenge.slug, 'hints')),
          getDocs(collection(firestore, 'challenges', challenge.slug, 'editorialSteps')),
        ]);
        setEditInitialData({
          ...challenge,
          testCases: testCasesSnap.docs.map(doc => doc.data()),
          hints: hintsSnap.docs.map(doc => doc.data()),
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
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-lg w-full">
            <h2 className="text-lg font-semibold mb-4">{selectedChallenge.title}</h2>
            <div className="mb-2 text-sm text-gray-600">Slug: {selectedChallenge.slug}</div>
            <div className="mb-2"><Badge variant="secondary">{selectedChallenge.difficulty}</Badge></div>
            <div className="mb-2 flex flex-wrap gap-2">
              {selectedChallenge.tags && selectedChallenge.tags.map(tag => (
                <Badge key={tag} variant="outline" className="text-xs border-gray-300 bg-gray-100 text-gray-600">{tag}</Badge>
              ))}
            </div>
            {selectedChallenge.track && <div className="mb-2"><Badge variant="secondary">{selectedChallenge.track}</Badge></div>}
            <Button onClick={() => setViewId(null)} className="mt-4">Close</Button>
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