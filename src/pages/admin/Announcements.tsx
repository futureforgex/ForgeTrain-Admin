import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const STATUS = ["Draft", "Scheduled", "Live", "Paused", "Archived"];
const CHANNELS = ["Email", "In-App Banner", "Push Notification", "SMS"];
const AUDIENCES = ["All Users", "Specific Batches", "Drive Registrants"];
const mockAnnouncements = [
  {
    id: "1",
    title: "Platform Maintenance",
    audience: "All Users",
    channel: "Email",
    status: "Scheduled",
    date: "2024-06-01T10:00:00Z",
  },
  // ...more
];

export default function Announcements() {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [tab, setTab] = useState("content");
  const [filter, setFilter] = useState({ status: "All", audience: "All", channel: "All", date: "" });

  // Form state for Add/Edit
  const [form, setForm] = useState({
    title: "",
    body: "",
    summary: "",
    attachments: [],
    audienceType: "All Users",
    filters: [],
    exclude: [],
    sendNow: true,
    schedule: null as Date | null,
    expiry: null as Date | null,
    channels: [] as string[],
    emailTemplate: "",
    bannerStyle: "",
    pushText: "",
    smsText: "",
    resendRule: "No re-send",
  });

  // Filtering logic (mock)
  const announcements = mockAnnouncements.filter(a =>
    (filter.status === "All" || a.status === filter.status) &&
    (filter.audience === "All" || a.audience === filter.audience) &&
    (filter.channel === "All" || a.channel === filter.channel)
  );

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Announcements</h1>
        <Button className="bg-blue-600 text-white" onClick={() => { setShowForm(true); setEditing(null); }}>+ New Announcement</Button>
      </div>
      {/* Filters */}
      <div className="flex gap-4 mb-4">
        <Select value={filter.status} onValueChange={v => setFilter(f => ({ ...f, status: v }))}>
          <SelectTrigger className="w-40"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All</SelectItem>
            {STATUS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={filter.audience} onValueChange={v => setFilter(f => ({ ...f, audience: v }))}>
          <SelectTrigger className="w-40"><SelectValue placeholder="Audience" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All</SelectItem>
            {AUDIENCES.map(a => <SelectItem key={a} value={a}>{a}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={filter.channel} onValueChange={v => setFilter(f => ({ ...f, channel: v }))}>
          <SelectTrigger className="w-40"><SelectValue placeholder="Channel" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All</SelectItem>
            {CHANNELS.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
        <Input type="date" className="w-40" value={filter.date} onChange={e => setFilter(f => ({ ...f, date: e.target.value }))} />
      </div>
      {/* Table */}
      <div className="bg-white rounded-lg shadow border overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 text-left font-semibold">ID</th>
              <th className="p-3 text-left font-semibold">Title</th>
              <th className="p-3 text-left font-semibold">Audience</th>
              <th className="p-3 text-left font-semibold">Channel</th>
              <th className="p-3 text-left font-semibold">Status</th>
              <th className="p-3 text-left font-semibold">Date</th>
              <th className="p-3 text-left font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {announcements.map(a => (
              <tr key={a.id} className="border-t hover:bg-gray-50">
                <td className="p-3 font-mono">{a.id}</td>
                <td className="p-3">{a.title}</td>
                <td className="p-3">{a.audience}</td>
                <td className="p-3">{a.channel}</td>
                <td className="p-3">{a.status}</td>
                <td className="p-3">{new Date(a.date).toLocaleString()}</td>
                <td className="p-3 flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => { setEditing(a); setShowForm(true); }}>Edit</Button>
                  <Button size="sm" variant="outline">Publish</Button>
                  <Button size="sm" variant="outline">Pause</Button>
                  <Button size="sm" variant="destructive">Delete</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* Pagination (mock) */}
        <div className="flex items-center justify-between p-4 border-t bg-gray-50">
          <div className="flex gap-2 items-center">
            <Button size="sm" variant="outline">&lt;&lt; Prev</Button>
            <span>Page 1 of 1</span>
            <Button size="sm" variant="outline">Next &gt;&gt;</Button>
          </div>
        </div>
      </div>

      {/* Slide-Over Form */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40">
          <div className="bg-white w-full max-w-2xl h-full shadow-xl flex flex-col animate-slideInRight relative">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold">{editing ? "Edit Announcement" : "Create New Announcement"}</h2>
              <Button variant="ghost" size="icon" aria-label="Close" onClick={() => setShowForm(false)}>×</Button>
            </div>
            <Tabs value={tab} onValueChange={setTab} className="flex-1 flex flex-col">
              <TabsList>
                <TabsTrigger value="content">Content</TabsTrigger>
                <TabsTrigger value="audience">Audience & Schedule</TabsTrigger>
                <TabsTrigger value="channels">Channels & Templates</TabsTrigger>
              </TabsList>
              <div className="flex-1 overflow-y-auto p-6">
                {/* Content Tab */}
                {tab === "content" && (
                  <div className="space-y-4">
                    <div>
                      <label className="font-medium">Title <span className="text-red-500">*</span></label>
                      <Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required />
                    </div>
                    <div>
                      <label className="font-medium">Body</label>
                      <textarea className="w-full border rounded p-2 min-h-[120px]" value={form.body} onChange={e => setForm(f => ({ ...f, body: e.target.value }))} />
                    </div>
                    <div>
                      <label className="font-medium">Summary / Teaser</label>
                      <Input value={form.summary} maxLength={100} onChange={e => setForm(f => ({ ...f, summary: e.target.value }))} />
                    </div>
                    <div>
                      <label className="font-medium">Attachments</label>
                      <Input type="file" multiple />
                    </div>
                    <div>
                      <Button variant="outline">View as User</Button>
                    </div>
                  </div>
                )}
                {/* Audience & Schedule Tab */}
                {tab === "audience" && (
                  <div className="space-y-4">
                    <div>
                      <label className="font-medium">Audience Type</label>
                      <Select value={form.audienceType} onValueChange={v => setForm(f => ({ ...f, audienceType: v }))}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="All Users">All Users</SelectItem>
                          <SelectItem value="By Role">By Role</SelectItem>
                          <SelectItem value="Custom">Custom</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="font-medium">Filters</label>
                      {/* Multi-select chips for branch, year, drives */}
                    </div>
                    <div>
                      <label className="font-medium">Exclude Lists</label>
                      {/* Multi-select for exclude */}
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch checked={form.sendNow} onCheckedChange={v => setForm(f => ({ ...f, sendNow: v }))} />
                      <span>Send Immediately</span>
                    </div>
                    {!form.sendNow && (
                      <div>
                        <label className="font-medium">Schedule Date/Time</label>
                        <DatePicker
                          selected={form.schedule}
                          onChange={date => setForm(f => ({ ...f, schedule: date }))}
                          showTimeSelect
                          dateFormat="Pp"
                          className="w-full"
                        />
                      </div>
                    )}
                    <div>
                      <label className="font-medium">Expiry Date</label>
                      <DatePicker
                        selected={form.expiry}
                        onChange={date => setForm(f => ({ ...f, expiry: date }))}
                        dateFormat="Pp"
                        className="w-full"
                        isClearable
                      />
                    </div>
                  </div>
                )}
                {/* Channels & Templates Tab */}
                {tab === "channels" && (
                  <div className="space-y-4">
                    <div>
                      <label className="font-medium">Channels</label>
                      <div className="flex gap-2 flex-wrap">
                        {CHANNELS.map(ch => (
                          <Button
                            key={ch}
                            variant={form.channels.includes(ch) ? "default" : "outline"}
                            onClick={() =>
                              setForm(f => ({
                                ...f,
                                channels: f.channels.includes(ch)
                                  ? f.channels.filter(c => c !== ch)
                                  : [...f.channels, ch],
                              }))
                            }
                          >
                            {ch}
                          </Button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="font-medium">Email Template</label>
                      <Input value={form.emailTemplate} onChange={e => setForm(f => ({ ...f, emailTemplate: e.target.value }))} />
                    </div>
                    <div>
                      <label className="font-medium">Banner Style</label>
                      <Input value={form.bannerStyle} onChange={e => setForm(f => ({ ...f, bannerStyle: e.target.value }))} />
                    </div>
                    <div>
                      <label className="font-medium">Push Notification</label>
                      <Input value={form.pushText} maxLength={150} onChange={e => setForm(f => ({ ...f, pushText: e.target.value }))} />
                    </div>
                    <div>
                      <label className="font-medium">SMS Content</label>
                      <textarea className="w-full border rounded p-2 min-h-[60px]" maxLength={160} value={form.smsText} onChange={e => setForm(f => ({ ...f, smsText: e.target.value }))} />
                    </div>
                    <div>
                      <label className="font-medium">Re-send Rules</label>
                      <Select value={form.resendRule} onValueChange={v => setForm(f => ({ ...f, resendRule: v }))}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="No re-send">No re-send</SelectItem>
                          <SelectItem value="Daily Reminder">Daily Reminder</SelectItem>
                          <SelectItem value="Until Acknowledged">Until Acknowledged</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}
              </div>
              {/* Footer Buttons */}
              <div className="flex justify-end gap-2 p-6 border-t">
                <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
                <Button variant="outline">Save as Draft</Button>
                <Button className="bg-blue-600 text-white">{editing ? "Update" : "Publish / Schedule"}</Button>
              </div>
            </Tabs>
          </div>
        </div>
      )}
    </div>
  );
}
