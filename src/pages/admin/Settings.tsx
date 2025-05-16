import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

const SECTIONS = [
  "General",
  "Branding",
  "Authentication & Security",
  "Email & Notifications",
  "Integrations",
  "Roles & Permissions",
];

export default function Settings() {
  const [section, setSection] = useState("General");
  const [dirty, setDirty] = useState(false);

  // Example state for General section
  const [general, setGeneral] = useState({
    platformName: "",
    language: "English",
    timeZone: "IST",
    dateFormat: "DD/MM/YYYY",
    theme: "Light",
    maintenance: false,
    terms: "",
    privacy: "",
  });

  // ...other section states

  // Example: mark as dirty on any change
  function handleGeneralChange(field: string, value: any) {
    setGeneral(g => ({ ...g, [field]: value }));
    setDirty(true);
  }

  return (
    <div className="max-w-6xl mx-auto p-6 flex gap-8">
      {/* Sidebar */}
      <aside className="w-64 min-w-[180px] border-r pr-4 hidden md:block">
        <nav className="flex flex-col gap-2">
          {SECTIONS.map(s => (
            <Button
              key={s}
              variant={section === s ? "default" : "ghost"}
              className="justify-start"
              onClick={() => setSection(s)}
            >
              {s}
            </Button>
          ))}
        </nav>
      </aside>
      {/* Responsive sidebar for mobile */}
      <div className="md:hidden mb-4">
        <Select value={section} onValueChange={setSection}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Section" />
          </SelectTrigger>
          <SelectContent>
            {SECTIONS.map(s => (
              <SelectItem key={s} value={s}>{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {/* Main Panel */}
      <main className="flex-1 relative">
        {/* Sticky Save Button */}
        <div className="sticky top-0 z-10 flex justify-end bg-white py-2 border-b mb-6">
          <Button
            className="bg-blue-600 text-white"
            disabled={!dirty}
            onClick={() => setDirty(false)}
          >
            Save Changes
          </Button>
        </div>
        {/* Section Forms */}
        {section === "General" && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold mb-4">General Settings</h2>
            <div>
              <label className="font-medium">Platform Name</label>
              <Input value={general.platformName} onChange={e => handleGeneralChange("platformName", e.target.value)} />
            </div>
            <div>
              <label className="font-medium">Default Language</label>
              <Select value={general.language} onValueChange={v => handleGeneralChange("language", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="English">English</SelectItem>
                  <SelectItem value="Hindi">Hindi</SelectItem>
                  {/* Add more languages */}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="font-medium">Time Zone</label>
              <Select value={general.timeZone} onValueChange={v => handleGeneralChange("timeZone", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="IST">IST</SelectItem>
                  <SelectItem value="UTC">UTC</SelectItem>
                  {/* Add more time zones */}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="font-medium">Date Format</label>
              <Select value={general.dateFormat} onValueChange={v => handleGeneralChange("dateFormat", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                  <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="font-medium">Default Theme</label>
              <Select value={general.theme} onValueChange={v => handleGeneralChange("theme", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Light">Light</SelectItem>
                  <SelectItem value="Dark">Dark</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={general.maintenance} onCheckedChange={v => handleGeneralChange("maintenance", v)} />
              <span>Maintenance Mode</span>
            </div>
            <div>
              <label className="font-medium">Terms & Conditions Link</label>
              <Input value={general.terms} onChange={e => handleGeneralChange("terms", e.target.value)} />
            </div>
            <div>
              <label className="font-medium">Privacy Policy Link</label>
              <Input value={general.privacy} onChange={e => handleGeneralChange("privacy", e.target.value)} />
            </div>
          </div>
        )}
        {section === "Branding" && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Branding Settings</h2>
            {/* Branding form fields go here */}
          </div>
        )}
        {section === "Authentication & Security" && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Authentication & Security</h2>
            {/* Auth & Security form fields go here */}
          </div>
        )}
        {section === "Email & Notifications" && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Email & Notifications</h2>
            {/* Email & Notifications form fields go here */}
          </div>
        )}
        {section === "Integrations" && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Integrations</h2>
            {/* Integrations form fields go here */}
          </div>
        )}
        {section === "Roles & Permissions" && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Roles & Permissions</h2>
            {/* Roles & Permissions form fields go here */}
          </div>
        )}
      </main>
    </div>
  );
}
