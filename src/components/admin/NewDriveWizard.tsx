import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X } from 'lucide-react';
import { Drive, FormState } from '@/types/drive';
import { generateClient } from 'aws-amplify/api';
import { uploadData } from 'aws-amplify/storage';
import * as queries from '@/graphql/queries';
import * as mutations from '@/graphql/mutations';

const COMPANY_OPTIONS = [
  { value: 'Infosys', label: 'Infosys', logo: '🅸' },
  { value: 'TCS', label: 'TCS', logo: '🆃' },
  { value: 'Google', label: 'Google', logo: '🅶' },
];
const BRANCHES = ['CSE', 'ECE', 'IT', 'ME', 'CE'];
const YEARS = ['2nd', '3rd', '4th'];
const BACKLOG_POLICIES = ['None', 'Allowed', '≤2 Backlogs'];
const REMINDERS = ['3 days before', '1 day before', 'On Start'];
const APPROVALS = ['Auto-Publish', 'Require Approval'];
const VISIBILITY = ['Public', 'Unlisted', 'Private'];
const MODULES = [
  { value: 'mod1', label: 'DSA Bootcamp' },
  { value: 'mod2', label: 'Web Dev Project' },
  { value: 'mod3', label: 'AI Internship Prep' },
];

interface NewDriveWizardProps {
  open: boolean;
  onClose: () => void;
  editingDrive?: Drive | null;
}

export default function NewDriveWizard({ open, onClose, editingDrive }: NewDriveWizardProps) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormState>({
    company: '',
    driveTitle: '',
    driveType: 'On-Campus',
    description: '',
    startDate: '',
    endDate: '',
    location: '',
    remote: false,
    appLink: '',
    branches: [],
    years: [],
    cgpa: '',
    backlog: '',
    regWindow: '',
    seatCap: '',
    notify: true,
    notifTemplate: '',
    reminders: [],
    approval: 'Auto-Publish',
    visibility: 'Public',
    module: '',
    thumbnailUrl: '',
  });
  const [saving, setSaving] = useState(false);
  const [thumbPreview, setThumbPreview] = useState<string | null>(null);
  const [modules, setModules] = useState<{ value: string, label: string }[]>([]);
  const client = generateClient();

  useEffect(() => {
    if (editingDrive) {
      const { id, status, createdAt, updatedAt, ...driveData } = editingDrive;
      setForm({
        ...driveData,
        thumbnail: undefined,
      });
      if (editingDrive.thumbnailUrl) {
        setThumbPreview(editingDrive.thumbnailUrl);
      }
    } else {
      setForm({
        company: '',
        driveTitle: '',
        driveType: 'On-Campus',
        description: '',
        startDate: '',
        endDate: '',
        location: '',
        remote: false,
        appLink: '',
        branches: [],
        years: [],
        cgpa: '',
        backlog: '',
        regWindow: '',
        seatCap: '',
        notify: true,
        notifTemplate: '',
        reminders: [],
        approval: 'Auto-Publish',
        visibility: 'Public',
        module: '',
        thumbnailUrl: '',
      });
      setThumbPreview(null);
    }
  }, [editingDrive]);

  useEffect(() => {
    if (!open) return;
    async function fetchModules() {
      const { data } = await client.graphql({ query: queries.listModules, variables: { limit: 1000 } });
      setModules(
        data?.listModules?.items?.map((mod: any) => ({
          value: mod.id,
          label: mod.title || mod.id,
        })) || []
      );
    }
    fetchModules();
    // eslint-disable-next-line
  }, [open]);

  function handleThumbnailChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setForm(f => ({ ...f, thumbnail: file }));
      const reader = new FileReader();
      reader.onload = ev => setThumbPreview(ev.target?.result as string);
      reader.readAsDataURL(file);
    } else {
      setForm(f => ({ ...f, thumbnail: undefined }));
      setThumbPreview(null);
    }
  }

  async function uploadThumbnailIfNeeded(): Promise<string> {
    if (!form.thumbnail) return form.thumbnailUrl || '';
    const key = `drive-thumbnails/${Date.now()}_${form.thumbnail.name}`;
    await uploadData({ key, data: form.thumbnail, options: { contentType: form.thumbnail.type } });
    return key;
  }

  async function handleSave(publish: boolean) {
    setSaving(true);
    try {
      let thumbnailUrl = form.thumbnailUrl;
      if (form.thumbnail) {
        const key = await uploadThumbnailIfNeeded();
        thumbnailUrl = key;
      }
      const docData = {
        ...form,
        thumbnailUrl,
        status: publish ? 'published' : 'draft',
        updatedAt: new Date().toISOString(),
      };
      delete (docData as any).thumbnail;
      if (editingDrive) {
        await client.graphql({
          query: mutations.updateDrive,
          variables: { input: { id: editingDrive.id, ...docData } },
        });
      } else {
        await client.graphql({
          query: mutations.createDrive,
          variables: { input: { ...docData, createdAt: new Date().toISOString() } },
        });
      }
      onClose();
    } catch (err) {
      alert('Failed to save: ' + (err as Error).message);
    } finally {
      setSaving(false);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40" tabIndex={-1}>
      <div className="bg-white w-full max-w-xl h-full shadow-xl flex flex-col animate-slideInRight relative">
        {/* Progress Bar */}
        <div className="bg-gray-50 rounded-lg shadow p-6 mb-6 border">
          <div className="mb-6 flex items-center gap-4">
            <div className="flex items-center gap-2">
              {[1,2,3].map(n => (
                <span key={n} className={`h-3 w-3 rounded-full ${step >= n ? 'bg-blue-600' : 'bg-gray-300'}`}></span>
              ))}
            </div>
            <span className="text-sm text-gray-500">Step {step} of 3</span>
          </div>
          {/* ...fields... */}
        </div>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">
            {editingDrive ? 'Edit Placement Drive' : 'Create New Placement Drive'}
          </h2>
          <Button variant="ghost" size="icon" aria-label="Close" onClick={onClose}><X className="h-5 w-5" /></Button>
        </div>
        {/* Steps */}
        <div className="flex-1 overflow-y-auto p-6">
          {step === 1 && (
            <div>
              <div className="mb-6 text-sm text-gray-500">Step 1 of 3: Drive Info</div>
              {/* Company Typeahead */}
              <div className="mb-4">
                <label className="block font-medium mb-1">Company</label>
                <Input list="company-list" value={form.company} onChange={e => setForm(f => ({ ...f, company: e.target.value }))} placeholder="Start typing..." />
                <datalist id="company-list">
                  {COMPANY_OPTIONS.map(opt => <option key={opt.value} value={opt.label} />)}
                </datalist>
              </div>
              <div className="mb-4">
                <label className="block font-medium mb-1">Drive Title</label>
                <Input value={form.driveTitle} onChange={e => setForm(f => ({ ...f, driveTitle: e.target.value }))} placeholder="e.g. TCS Off-Campus 2025" />
              </div>
              <div className="mb-4">
                <label className="block font-medium mb-1">Drive Type</label>
                <div className="flex gap-2">
                  {['On-Campus', 'Off-Campus', 'Internship'].map(type => (
                    <Button key={type} variant={form.driveType === type ? 'default' : 'outline'} onClick={() => setForm(f => ({ ...f, driveType: type }))}>{type}</Button>
                  ))}
                </div>
              </div>
              <div className="mb-4">
                <label className="block font-medium mb-1">Description</label>
                <textarea className="w-full border rounded p-2 min-h-[80px]" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Overview, process, contact info..." />
              </div>
              <div className="flex gap-4 mb-4">
                <div className="flex-1">
                  <label className="block font-medium mb-1">Start Date</label>
                  <Input type="date" value={form.startDate} onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))} />
                </div>
                <div className="flex-1">
                  <label className="block font-medium mb-1">End Date</label>
                  <Input type="date" value={form.endDate} onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))} />
                </div>
              </div>
              <div className="flex gap-4 mb-4 items-center">
                <div className="flex-1">
                  <label className="block font-medium mb-1">Location</label>
                  <Input value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} placeholder="City or location" />
                </div>
                <div className="flex items-center gap-2 mt-6">
                  <input type="checkbox" checked={form.remote} onChange={e => setForm(f => ({ ...f, remote: e.target.checked }))} id="remote" />
                  <label htmlFor="remote" className="text-sm">Remote</label>
                </div>
              </div>
              <div className="mb-4">
                <label className="block font-medium mb-1">Application Link</label>
                <Input type="url" value={form.appLink} onChange={e => setForm(f => ({ ...f, appLink: e.target.value }))} placeholder="https://..." />
              </div>
              <div className="flex justify-end mt-8">
                <Button onClick={() => setStep(2)}>Next →</Button>
              </div>
            </div>
          )}
          {step === 2 && (
            <div>
              <div className="mb-6 text-sm text-gray-500">Step 2 of 3: Eligibility & Capacity</div>
              <div className="mb-4">
                <label className="block font-medium mb-1">Eligible Branches</label>
                <div className="flex flex-wrap gap-2">
                  {BRANCHES.map(branch => (
                    <Button key={branch} variant={form.branches.includes(branch) ? 'default' : 'outline'} onClick={() => setForm(f => ({ ...f, branches: f.branches.includes(branch) ? f.branches.filter(b => b !== branch) : [...f.branches, branch] }))}>{branch}</Button>
                  ))}
                </div>
              </div>
              <div className="mb-4">
                <label className="block font-medium mb-1">Eligible Years</label>
                <div className="flex flex-wrap gap-2">
                  {YEARS.map(year => (
                    <Button key={year} variant={form.years.includes(year) ? 'default' : 'outline'} onClick={() => setForm(f => ({ ...f, years: f.years.includes(year) ? f.years.filter(y => y !== year) : [...f.years, year] }))}>{year}</Button>
                  ))}
                </div>
              </div>
              <div className="flex gap-4 mb-4">
                <div className="flex-1">
                  <label className="block font-medium mb-1">CGPA Cutoff</label>
                  <Input type="number" min={0} max={10} step={0.1} value={form.cgpa} onChange={e => setForm(f => ({ ...f, cgpa: e.target.value }))} placeholder="e.g. 7.0" />
                </div>
                <div className="flex-1">
                  <label className="block font-medium mb-1">Backlog Policy</label>
                  <select className="w-full border rounded p-2" value={form.backlog} onChange={e => setForm(f => ({ ...f, backlog: e.target.value }))}>
                    <option value="">Select</option>
                    {BACKLOG_POLICIES.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex gap-4 mb-4">
                <div className="flex-1">
                  <label className="block font-medium mb-1">Registration Window</label>
                  <Input type="text" value={form.regWindow} onChange={e => setForm(f => ({ ...f, regWindow: e.target.value }))} placeholder="09:00–17:00" />
                </div>
                <div className="flex-1">
                  <label className="block font-medium mb-1">Seat Capacity</label>
                  <Input type="number" min={1} value={form.seatCap} onChange={e => setForm(f => ({ ...f, seatCap: e.target.value }))} placeholder="Max slots" />
                </div>
              </div>
              <div className="flex justify-between mt-8">
                <Button variant="outline" onClick={() => setStep(1)}>← Back</Button>
                <Button onClick={() => setStep(3)}>Next →</Button>
              </div>
            </div>
          )}
          {step === 3 && (
            <div>
              <div className="mb-6 text-sm text-gray-500">Step 3 of 3: Notifications & Publishing</div>
              <div className="mb-4 flex items-center gap-2">
                <input type="checkbox" checked={form.notify} onChange={e => setForm(f => ({ ...f, notify: e.target.checked }))} id="notify" />
                <label htmlFor="notify" className="font-medium">Notify on Publish</label>
              </div>
              <div className="mb-4">
                <label className="block font-medium mb-1">Notification Template</label>
                <textarea className="w-full border rounded p-2 min-h-[60px]" value={form.notifTemplate} onChange={e => setForm(f => ({ ...f, notifTemplate: e.target.value }))} placeholder="e.g. {{company}} drive on {{date}}" />
              </div>
              <div className="mb-4">
                <label className="block font-medium mb-1">Reminder Schedule</label>
                <div className="flex flex-wrap gap-2">
                  {REMINDERS.map(rem => (
                    <label key={rem} className="flex items-center gap-1">
                      <input type="checkbox" checked={form.reminders.includes(rem)} onChange={e => setForm(f => ({ ...f, reminders: f.reminders.includes(rem) ? f.reminders.filter(r => r !== rem) : [...f.reminders, rem] }))} />
                      <span>{rem}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="mb-4">
                <label className="block font-medium mb-1">Approval Workflow</label>
                <select className="w-full border rounded p-2" value={form.approval} onChange={e => setForm(f => ({ ...f, approval: e.target.value }))}>
                  {APPROVALS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
              <div className="mb-4">
                <label className="block font-medium mb-1">Visibility</label>
                <div className="flex gap-2">
                  {VISIBILITY.map(v => (
                    <Button key={v} variant={form.visibility === v ? 'default' : 'outline'} onClick={() => setForm(f => ({ ...f, visibility: v }))}>{v}</Button>
                  ))}
                </div>
              </div>
              <div className="mb-4">
                <label className="block font-medium mb-1">Link to Module</label>
                <div className="relative">
                  <select
                    className="w-full border rounded p-2 pr-8 focus:ring-2 focus:ring-blue-500"
                    value={form.module}
                    onChange={e => setForm(f => ({ ...f, module: e.target.value }))}
                  >
                    <option value="">Select a module</option>
                    {modules.map(m => (
                      <option key={m.value} value={m.value}>{m.label}</option>
                    ))}
                  </select>
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">▼</span>
                </div>
              </div>
              <div className="mb-4">
                <label className="block font-medium mb-1">Thumbnail Image</label>
                <div className="flex items-center gap-4">
                  <label className="flex flex-col items-center justify-center w-32 h-32 border-2 border-dashed rounded cursor-pointer hover:border-blue-400 transition">
                    <span className="text-xs text-gray-500">Click or drag image</span>
                    <input type="file" accept="image/*" className="hidden" onChange={handleThumbnailChange} />
                    {thumbPreview && (
                      <img src={thumbPreview} alt="Thumbnail Preview" className="mt-2 rounded border max-h-24" />
                    )}
                  </label>
                  {thumbPreview && (
                    <Button size="sm" variant="ghost" onClick={() => { setThumbPreview(null); setForm(f => ({ ...f, thumbnail: undefined })); }}>Remove</Button>
                  )}
                </div>
              </div>
              <div className="flex justify-between mt-8 gap-2">
                <Button variant="outline" onClick={() => setStep(2)}>← Back</Button>
                <Button variant="outline" disabled={saving} onClick={() => handleSave(false)}>
                  {saving ? 'Saving...' : 'Save as Draft'}
                </Button>
                <Button className="bg-blue-600 text-white" disabled={saving} onClick={() => handleSave(true)}>
                  {saving ? 'Publishing...' : editingDrive ? 'Update Drive' : 'Publish Drive'}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 