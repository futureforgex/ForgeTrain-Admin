import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X } from 'lucide-react';
import NewDriveWizard from '@/components/admin/NewDriveWizard';
import { Drive } from '@/types/drive';
import { generateClient } from 'aws-amplify/api';
import * as queries from '@/graphql/queries';
import * as mutations from '@/graphql/mutations';

const statusColors: Record<string, string> = {
  'published': 'bg-green-100 text-green-800',
  'draft': 'bg-yellow-100 text-yellow-800',
  'closed': 'bg-gray-200 text-gray-700',
  'archived': 'bg-gray-300 text-gray-500',
};

function PlacementDrives() {
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState({ company: "all", status: "all", eligibility: "all", date: "" });
  const [page, setPage] = useState(1);
  const [editingDrive, setEditingDrive] = useState<Drive | null>(null);
  const [drives, setDrives] = useState<Drive[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const client = generateClient();

  useEffect(() => {
    fetchDrives();
    // eslint-disable-next-line
  }, [filter]);

  async function fetchDrives() {
    setLoading(true);
    setError(null);
    try {
      // Build filter object for Amplify
      let filterObj: any = {};
      if (filter.company !== 'all') filterObj.company = { eq: filter.company };
      if (filter.status !== 'all') filterObj.status = { eq: filter.status };
      if (filter.eligibility !== 'all') filterObj.branches = { contains: filter.eligibility };
      if (filter.date) filterObj.startDate = { ge: filter.date };
      const { data } = await client.graphql({
        query: queries.listDrives,
        variables: {
          filter: Object.keys(filterObj).length ? filterObj : undefined,
          limit: 1000,
        },
      });
      setDrives(data?.listDrives?.items || []);
    } catch (err) {
      setError('Failed to fetch drives: ' + (err as Error).message);
      console.error('Error fetching drives:', err);
    } finally {
      setLoading(false);
    }
  }

  // Filtered drives (real data)
  const filteredDrives = drives.filter(d =>
    (filter.company === "all" || d.company === filter.company) &&
    (filter.status === "all" || d.status === filter.status)
  );

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" className="text-gray-500">&larr; Dashboard</Button>
          <h1 className="text-2xl font-bold">Placement Drives</h1>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => { setShowForm(true); setEditingDrive(null); }} className="bg-blue-600 text-white">+ New Drive</Button>
          <Button variant="outline">Filter ▽</Button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-4 items-center">
        <div>
          <label className="text-xs text-gray-500">Company</label>
          <Select value={filter.company} onValueChange={v => setFilter(f => ({ ...f, company: v }))}>
            <SelectTrigger className="w-40"><SelectValue placeholder="All Companies" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="Infosys">Infosys</SelectItem>
              <SelectItem value="TCS">TCS</SelectItem>
              <SelectItem value="Google">Google</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-xs text-gray-500">Date Range</label>
          <Input 
            type="date" 
            className="w-40" 
            value={filter.date}
            onChange={e => setFilter(f => ({ ...f, date: e.target.value }))}
          />
        </div>
        <div>
          <label className="text-xs text-gray-500">Status</label>
          <Select value={filter.status} onValueChange={v => setFilter(f => ({ ...f, status: v }))}>
            <SelectTrigger className="w-32"><SelectValue placeholder="All Statuses" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-xs text-gray-500">Eligibility</label>
          <Select value={filter.eligibility} onValueChange={v => setFilter(f => ({ ...f, eligibility: v }))}>
            <SelectTrigger className="w-40"><SelectValue placeholder="All" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="CSE">CSE</SelectItem>
              <SelectItem value="ECE">ECE</SelectItem>
              <SelectItem value="IT">IT</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow border overflow-x-auto">
        {loading ? (
          <div className="p-8 text-center text-gray-500">
            <span className="animate-spin inline-block mr-2 border-2 border-blue-400 border-t-transparent rounded-full w-5 h-5 align-middle"></span>
            Loading drives...
          </div>
        ) : (
          <>
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-3 text-left font-semibold">ID</th>
                  <th className="p-3 text-left font-semibold">Company</th>
                  <th className="p-3 text-left font-semibold">Drive Title</th>
                  <th className="p-3 text-left font-semibold">Date</th>
                  <th className="p-3 text-left font-semibold">Status</th>
                  <th className="p-3 text-left font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredDrives.map(drive => (
                  <tr key={drive.id} className="border-t hover:bg-gray-50">
                    <td className="p-3 font-mono">{drive.id.slice(0, 8)}...</td>
                    <td className="p-3">{drive.company}</td>
                    <td className="p-3">{drive.driveTitle}</td>
                    <td className="p-3">{new Date(drive.startDate).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: '2-digit' })}</td>
                    <td className="p-3">
                      <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${statusColors[drive.status]}`}>
                        {drive.status.charAt(0).toUpperCase() + drive.status.slice(1)}
                      </span>
                    </td>
                    <td className="p-3 flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => { setEditingDrive(drive); setShowForm(true); }}>Edit</Button>
                      {drive.status === 'draft' ? (
                        <Button size="sm" className="bg-green-600 text-white">Publish</Button>
                      ) : (
                        <Button size="sm" className="bg-yellow-500 text-white">Deactivate</Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {/* Pagination */}
            <div className="flex items-center justify-between p-4 border-t bg-gray-50">
              <div className="flex gap-2 items-center">
                <Button size="sm" variant="outline" disabled={page === 1} onClick={() => setPage(p => Math.max(1, p - 1))}>&lt;&lt; Prev</Button>
                <span>Page {page} of {Math.ceil(filteredDrives.length / 10)}</span>
                <Button size="sm" variant="outline" onClick={() => setPage(p => p + 1)}>Next &gt;&gt;</Button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* New Drive Wizard Slide-Over */}
      <NewDriveWizard 
        open={showForm} 
        onClose={() => { 
          setShowForm(false); 
          setEditingDrive(null);
          fetchDrives(); // Refresh the list after closing
        }}
        editingDrive={editingDrive}
      />
    </div>
  );
}

export default PlacementDrives; 