import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
// import MarkdownEditor from "@/components/ui/MarkdownEditor"; // Temporarily removed
import DatePicker from "react-datepicker"; // Or your preferred picker
import "react-datepicker/dist/react-datepicker.css";
import { DndContext, useDraggable, useDroppable } from "@dnd-kit/core"; // For drag-to-reorder

const TRACKS = ["Syntax", "DSA", "Projects", "Aptitude"];
const VISIBILITY = ["Public", "Unlisted", "Private"];
const ROLES = ["Admin", "Placement Officer", "Mentor"];
const RESET_FREQ = ["None", "Daily", "Weekly", "Monthly"];

export default function LeaderboardAdmin() {
  const [tab, setTab] = useState("general");
  const [form, setForm] = useState({
    name: "",
    description: "",
    collegeScope: "All Colleges",
    colleges: [] as string[],
    tracks: [] as string[],
    visibility: "Public",
    scoring: [{ activity: "", points: 0 }],
    multipliers: [{ condition: "", multiplier: 1 }],
    penalties: [{ condition: "", penalty: 0 }],
    start: null as Date | null,
    end: null as Date | null,
    resetFreq: "None",
    resetTime: "",
    announcement: "",
    allowedRoles: [] as string[],
    emailAlerts: false,
    alertRecipients: [] as string[],
  });

  // ...handlers for drag, inline edit, etc.

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Leaderboard Setup</h1>
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="scoring">Scoring Rules</TabsTrigger>
          <TabsTrigger value="schedule">Schedule & Reset</TabsTrigger>
          <TabsTrigger value="access">Access & Notifications</TabsTrigger>
        </TabsList>

        {/* General Tab */}
        <TabsContent value="general">
          <div className="space-y-4">
            <div>
              <label className="font-medium">Name <span className="text-red-500">*</span></label>
              <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
            </div>
            <div>
              <label className="font-medium">Description</label>
              <textarea
                className="w-full border rounded p-2 min-h-[80px]"
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                placeholder="Enter description (Markdown supported)"
              />
            </div>
            <div>
              <label className="font-medium">College Scope</label>
              <Select value={form.collegeScope} onValueChange={v => setForm(f => ({ ...f, collegeScope: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="All Colleges">All Colleges</SelectItem>
                  <SelectItem value="Specific">Specific</SelectItem>
                </SelectContent>
              </Select>
              {form.collegeScope === "Specific" && (
                <div>
                  {/* Multi-select for colleges */}
                  {/* Implement as needed */}
                </div>
              )}
            </div>
            <div>
              <label className="font-medium">Tracks Included</label>
              <div className="flex gap-2 flex-wrap">
                {TRACKS.map(track => (
                  <Button
                    key={track}
                    variant={form.tracks.includes(track) ? "default" : "outline"}
                    onClick={() =>
                      setForm(f => ({
                        ...f,
                        tracks: f.tracks.includes(track)
                          ? f.tracks.filter(t => t !== track)
                          : [...f.tracks, track],
                      }))
                    }
                  >
                    {track}
                  </Button>
                ))}
              </div>
            </div>
            <div>
              <label className="font-medium">Visibility</label>
              <Select value={form.visibility} onValueChange={v => setForm(f => ({ ...f, visibility: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {VISIBILITY.map(v => (
                    <SelectItem key={v} value={v}>{v}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </TabsContent>

        {/* Scoring Rules Tab */}
        <TabsContent value="scoring">
          {/* Table for activities, multipliers, penalties with drag-to-reorder and inline editing */}
          {/* Use a table component with editable cells and drag handles */}
          {/* ... */}
        </TabsContent>

        {/* Schedule & Reset Tab */}
        <TabsContent value="schedule">
          <div className="space-y-4">
            <div>
              <label className="font-medium">Start Date/Time <span className="text-red-500">*</span></label>
              <DatePicker
                selected={form.start}
                onChange={date => setForm(f => ({ ...f, start: date }))}
                showTimeSelect
                dateFormat="Pp"
                className="w-full"
              />
            </div>
            <div>
              <label className="font-medium">End Date/Time</label>
              <DatePicker
                selected={form.end}
                onChange={date => setForm(f => ({ ...f, end: date }))}
                showTimeSelect
                dateFormat="Pp"
                className="w-full"
                isClearable
              />
            </div>
            <div>
              <label className="font-medium">Reset Frequency</label>
              <Select value={form.resetFreq} onValueChange={v => setForm(f => ({ ...f, resetFreq: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {RESET_FREQ.map(f => (
                    <SelectItem key={f} value={f}>{f}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="font-medium">Reset Time</label>
              <Input
                type="time"
                value={form.resetTime}
                onChange={e => setForm(f => ({ ...f, resetTime: e.target.value }))}
              />
            </div>
            <div>
              <label className="font-medium">Announcement</label>
              <textarea
                className="w-full border rounded p-2 min-h-[80px]"
                value={form.announcement}
                onChange={e => setForm(f => ({ ...f, announcement: e.target.value }))}
                placeholder="Enter announcement (Markdown supported)"
              />
            </div>
          </div>
        </TabsContent>

        {/* Access & Notifications Tab */}
        <TabsContent value="access">
          <div className="space-y-4">
            <div>
              <label className="font-medium">Allowed Roles</label>
              {/* Multi-select for roles */}
              {/* ... */}
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={form.emailAlerts} onCheckedChange={val => setForm(f => ({ ...f, emailAlerts: val }))} />
              <span>Email Alerts</span>
            </div>
            <div>
              <label className="font-medium">Alert Recipients</label>
              {/* Multi-select for emails/groups */}
              {/* ... */}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Save/Publish Buttons */}
      <div className="flex justify-end gap-2 mt-8">
        <Button variant="outline">Save as Draft</Button>
        <Button className="bg-blue-600 text-white">Publish Leaderboard</Button>
      </div>
    </div>
  );
}