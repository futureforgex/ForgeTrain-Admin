import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Filter, ChevronLeft, ChevronRight, Plus, Edit2, Trash2, Eye } from "lucide-react";
import { db, storage } from "@/lib/firebase";
import { collection, addDoc, updateDoc, doc, getDocs, deleteDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const INDIAN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal"
] as const;

type Department = { id: string; name: string; level: "UG" | "PG" | "Diploma"; hod: string; status: "Active" | "Archived" };
type College = {
  id: string;
  name: string;
  code: string;
  type: "Engineering" | "Polytechnic" | "Other";
  website: string;
  logo: string;
  address: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    pinCode: string;
  };
  contact: {
    name: string;
    email: string;
    phone: string;
  };
  status: "Active" | "Archived";
  hasDepartments: boolean;
  notes: string;
  departments: Department[];
};

const mockColleges: College[] = [
  {
    id: "1",
    name: "Indian Institute of Technology Bombay",
    code: "IITB",
    type: "Engineering",
    website: "https://www.iitb.ac.in",
    logo: "",
    address: {
      line1: "Powai",
      city: "Mumbai",
      state: "Maharashtra",
      pinCode: "400076"
    },
    contact: {
      name: "Dr. John Doe",
      email: "admin@iitb.ac.in",
      phone: "+91 9876543210"
    },
    status: "Active",
    hasDepartments: true,
    notes: "",
    departments: [
      { id: "cse", name: "Computer Science", level: "UG", hod: "Dr. A. Rao", status: "Active" },
      { id: "ece", name: "Electronics", level: "UG", hod: "Dr. S. Kumar", status: "Active" },
    ],
  },
  {
    id: "2",
    name: "Vishvesvaraya National Institute of Technology",
    code: "VNIT",
    type: "Engineering",
    website: "https://vnit.ac.in",
    logo: "",
    address: {
      line1: "South Ambazari Road",
      city: "Nagpur",
      state: "Maharashtra",
      pinCode: "440010"
    },
    contact: {
      name: "Dr. Jane Smith",
      email: "admin@vnit.ac.in",
      phone: "+91 9876543211"
    },
    status: "Active",
    hasDepartments: true,
    notes: "",
    departments: [
      { id: "mech", name: "Mechanical", level: "UG", hod: "Dr. P. Singh", status: "Active" },
      { id: "chem", name: "Chemical", level: "UG", hod: "Dr. R. Gupta", status: "Active" },
    ],
  },
];

const DEPARTMENT_LEVELS = ["UG", "PG", "Diploma"] as const;
const DEPARTMENT_STATUSES = ["Active", "Archived"] as const;

export default function Colleges() {
  const [colleges, setColleges] = useState<College[]>(mockColleges);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<College | null>(null);
  const [viewing, setViewing] = useState<College | null>(null);
  const [form, setForm] = useState<Partial<College>>({
    name: "",
    code: "",
    type: "Engineering",
    website: "",
    logo: "",
    address: { line1: "", city: "", state: "", pinCode: "" },
    contact: { name: "", email: "", phone: "" },
    status: "Active",
    hasDepartments: true,
    notes: "",
    departments: [],
  });
  const [activeTab, setActiveTab] = useState("general");
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    state: "all",
    city: "all",
    type: "all",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Department form state (for adding new department)
  const [deptForm, setDeptForm] = useState({
    name: "",
    level: "UG",
    hod: "",
    status: "Active"
  });
  const [deptEditIndex, setDeptEditIndex] = useState<number | null>(null);

  // Fetch colleges from Firestore on mount
  useEffect(() => {
    async function fetchColleges() {
      const snapshot = await getDocs(collection(db, "colleges"));
      const data = snapshot.docs.map(docSnap => {
        const d = docSnap.data();
        return {
          id: docSnap.id,
          name: d.name || "",
          code: d.code || "",
          type: d.type || "Engineering",
          website: d.website || "",
          logo: d.logo || "",
          address: {
            line1: d.address?.line1 || "",
            line2: d.address?.line2 || "",
            city: d.address?.city || "",
            state: d.address?.state || "",
            pinCode: d.address?.pinCode || "",
          },
          contact: {
            name: d.contact?.name || "",
            email: d.contact?.email || "",
            phone: d.contact?.phone || "",
          },
          status: d.status || "Active",
          hasDepartments: d.hasDepartments ?? true,
          notes: d.notes || "",
          departments: d.departments || [],
        };
      });
      console.log("Fetched colleges from Firestore:", data);
      setColleges(data.length > 0 ? data : mockColleges);
    }
    fetchColleges();
  }, []);

  // Add this function to handle logo upload
  const handleLogoUpload = async (file: File) => {
    try {
      const storageRef = ref(storage, `college-logos/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      setForm(f => ({ ...f, logo: downloadURL }));
    } catch (error) {
      console.error("Error uploading logo:", error);
      alert("Failed to upload logo. Please try again.");
    }
  };

  // Modify the handleSaveCollege function
  async function handleSaveCollege() {
    try {
      if (editing) {
        // Update in Firestore
        const { id, ...updateData } = form;
        // Remove all undefined fields
        const cleanData = Object.fromEntries(
          Object.entries(updateData).filter(([_, v]) => v !== undefined)
        );
        
        // Update the document
        await updateDoc(doc(db, "colleges", editing.id), cleanData);
        
        // Update local state
        setColleges(cols => 
          cols.map(c => c.id === editing.id ? { ...c, ...cleanData } : c)
        );
        
        alert("College updated successfully!");
      } else {
        // Add to Firestore
        const docRef = await addDoc(collection(db, "colleges"), form);
        setColleges(cols => [
          ...cols,
          { ...form, id: docRef.id } as College,
        ]);
        alert("College added successfully!");
      }
    } catch (e) {
      alert("Error saving college: " + (e as Error).message);
      return;
    }
    
    setShowForm(false);
    setEditing(null);
    setViewing(null);
    setForm({
      name: "",
      code: "",
      type: "Engineering",
      website: "",
      logo: "",
      address: { line1: "", city: "", state: "", pinCode: "" },
      contact: { name: "", email: "", phone: "" },
      status: "Active",
      hasDepartments: true,
      notes: "",
      departments: [],
    });
  }

  // Edit college
  function handleEditCollege(college: College) {
    setEditing(college);
    setViewing(null);
    setForm(college);
    setShowForm(true);
  }

  // View college
  function handleViewCollege(college: College) {
    setViewing(college);
    setEditing(null);
    setForm(college);
    setShowForm(true);
  }

  // Delete college
  async function handleDeleteCollege(id: string) {
    if (window.confirm("Are you sure you want to delete this college? This action cannot be undone.")) {
      try {
        // Delete from Firestore
        await deleteDoc(doc(db, "colleges", id));
        // Update local state
        setColleges(cols => cols.filter(c => c.id !== id));
        alert("College deleted successfully!");
      } catch (error) {
        console.error("Error deleting college:", error);
        alert("Failed to delete college. Please try again.");
      }
    }
  }

  // Archive college
  function handleArchiveCollege(id: string) {
    setColleges(cols =>
      cols.map(c =>
        c.id === id ? { ...c, status: c.status === "Active" ? "Archived" : "Active" } : c
      )
    );
  }

  // Filtered and paginated colleges
  const filteredColleges = colleges.filter(college => {
    const matchesSearch = college.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      college.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilters = (filters.state === "all" || college.address.state === filters.state) &&
      (filters.city === "all" || college.address.city === filters.city) &&
      (filters.type === "all" || college.type === filters.type);
    return matchesSearch && matchesFilters;
  });

  const totalPages = Math.ceil(filteredColleges.length / itemsPerPage);
  const paginatedColleges = filteredColleges.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold">Colleges</h1>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search colleges..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 w-[200px]"
              />
            </div>
            <Select value={filters.state} onValueChange={(value) => setFilters(f => ({ ...f, state: value }))}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="State" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All States</SelectItem>
                {INDIAN_STATES.map(state => (
                  <SelectItem key={state} value={state}>{state}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filters.type} onValueChange={(value) => setFilters(f => ({ ...f, type: value }))}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Engineering">Engineering</SelectItem>
                <SelectItem value="Polytechnic">Polytechnic</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <Button onClick={() => { setShowForm(true); setEditing(null); setViewing(null); setForm({
          name: "",
          code: "",
          type: "Engineering",
          website: "",
          logo: "",
          address: { line1: "", city: "", state: "", pinCode: "" },
          contact: { name: "", email: "", phone: "" },
          status: "Active",
          hasDepartments: true,
          notes: "",
          departments: [],
        }); }}>
          + New College
        </Button>
      </div>

      {/* Colleges Table */}
      <div className="bg-white rounded-lg shadow border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>No.</TableHead>
              <TableHead>College Name</TableHead>
              <TableHead>City</TableHead>
              <TableHead>State</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedColleges.map((college, index) => (
              <TableRow key={college.id}>
                <TableCell>{(currentPage - 1) * itemsPerPage + index + 1}</TableCell>
                <TableCell>{college.name}</TableCell>
                <TableCell>{college.address.city}</TableCell>
                <TableCell>{college.address.state}</TableCell>
                <TableCell>{college.type}</TableCell>
                <TableCell>
                  <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${college.status === "Active" ? "bg-green-100 text-green-800" : "bg-gray-200 text-gray-800"}`}>
                    {college.status}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleEditCollege(college)}>Edit</Button>
                    <Button size="sm" variant="outline" onClick={() => handleViewCollege(college)}>View</Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handleArchiveCollege(college.id)}
                    >
                      {college.status === "Active" ? "Archive" : "Restore"}
                    </Button>
                    <Button 
                      size="sm" 
                      variant="destructive" 
                      onClick={() => handleDeleteCollege(college.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-muted-foreground">
          Page {currentPage} of {totalPages}
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Add/Edit College Slide-Over */}
      <Sheet open={showForm} onOpenChange={(open) => { setShowForm(open); if (!open) { setEditing(null); setViewing(null); } }}>
        <SheetContent className="w-[600px] sm:max-w-[600px] shadow-2xl">
          <SheetHeader>
            <SheetTitle>{viewing ? "View College" : editing ? "Edit College" : "Add New College"}</SheetTitle>
          </SheetHeader>
          <div className="mt-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="general">General Info</TabsTrigger>
                <TabsTrigger value="address">Address & Contact</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
                <TabsTrigger value="departments">Departments</TabsTrigger>
              </TabsList>
              <TabsContent value="general" className="space-y-6 mt-4">
                <div className="mb-2 font-semibold text-lg">General Info</div>
                <div>
                  <Label>College Name</Label>
                  <Input
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="Enter college name"
                    disabled={!!viewing}
                  />
                </div>
                <div>
                  <Label>Short Code</Label>
                  <Input
                    value={form.code}
                    onChange={e => setForm(f => ({ ...f, code: e.target.value }))}
                    placeholder="e.g. IITB"
                    disabled={!!viewing}
                  />
                </div>
                <div>
                  <Label>Type</Label>
                  <Select
                    value={form.type}
                    onValueChange={(value: "Engineering" | "Polytechnic" | "Other") =>
                      setForm(f => ({ ...f, type: value }))
                    }
                    disabled={!!viewing}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Engineering">Engineering</SelectItem>
                      <SelectItem value="Polytechnic">Polytechnic</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Website</Label>
                  <Input
                    value={form.website}
                    onChange={e => setForm(f => ({ ...f, website: e.target.value }))}
                    placeholder="https://"
                    disabled={!!viewing}
                  />
                </div>
                <div>
                  <Label>Logo</Label>
                  <div className="flex items-center gap-4">
                    {form.logo && (
                      <img 
                        src={form.logo} 
                        alt="College logo" 
                        className="w-16 h-16 object-contain border rounded"
                      />
                    )}
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={e => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleLogoUpload(file);
                        }
                      }}
                      disabled={!!viewing}
                    />
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="address" className="space-y-6 mt-4">
                <div className="mb-2 font-semibold text-lg">Address & Contact</div>
                <div>
                  <Label>Address Line 1</Label>
                  <Input
                    value={form.address?.line1}
                    onChange={e => setForm(f => ({ ...f, address: { ...f.address!, line1: e.target.value } }))}
                    disabled={!!viewing}
                  />
                </div>
                <div>
                  <Label>Address Line 2 (Optional)</Label>
                  <Input
                    value={form.address?.line2 || ""}
                    onChange={e => setForm(f => ({ ...f, address: { ...f.address!, line2: e.target.value } }))}
                    disabled={!!viewing}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>City</Label>
                    <Input
                      value={form.address?.city}
                      onChange={e => setForm(f => ({ ...f, address: { ...f.address!, city: e.target.value } }))}
                      disabled={!!viewing}
                    />
                  </div>
                  <div>
                    <Label>State</Label>
                    <Select
                      value={form.address?.state}
                      onValueChange={(value) =>
                        setForm(f => ({ ...f, address: { ...f.address!, state: value } }))
                      }
                      disabled={!!viewing}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                      <SelectContent>
                        {INDIAN_STATES.map(state => (
                          <SelectItem key={state} value={state}>{state}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label>Pin Code</Label>
                  <Input
                    value={form.address?.pinCode}
                    onChange={e => setForm(f => ({ ...f, address: { ...f.address!, pinCode: e.target.value } }))}
                    disabled={!!viewing}
                  />
                </div>
                <div>
                  <Label>Primary Contact</Label>
                  <Input
                    value={form.contact?.name}
                    onChange={e => setForm(f => ({ ...f, contact: { ...f.contact!, name: e.target.value } }))}
                    placeholder="Name"
                    disabled={!!viewing}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Email</Label>
                    <Input
                      value={form.contact?.email}
                      onChange={e => setForm(f => ({ ...f, contact: { ...f.contact!, email: e.target.value } }))}
                      type="email"
                      disabled={!!viewing}
                    />
                  </div>
                  <div>
                    <Label>Phone</Label>
                    <Input
                      value={form.contact?.phone}
                      onChange={e => setForm(f => ({ ...f, contact: { ...f.contact!, phone: e.target.value } }))}
                      disabled={!!viewing}
                    />
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="settings" className="space-y-6 mt-4">
                <div className="mb-2 font-semibold text-lg">Settings</div>
                <div className="flex items-center justify-between">
                  <Label>Status</Label>
                  <Switch
                    checked={form.status === "Active"}
                    onCheckedChange={(checked) =>
                      setForm(f => ({ ...f, status: checked ? "Active" : "Archived" }))
                    }
                    disabled={!!viewing}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Has Departments</Label>
                  <Switch
                    checked={form.hasDepartments}
                    onCheckedChange={(checked) =>
                      setForm(f => ({ ...f, hasDepartments: checked }))
                    }
                    disabled={!!viewing}
                  />
                </div>
                <div>
                  <Label>Notes</Label>
                  <Input
                    value={form.notes}
                    onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                    placeholder="Internal remarks or partner ID"
                    disabled={!!viewing}
                  />
                </div>
              </TabsContent>
              <TabsContent value="departments" className="space-y-4 mt-4">
                <div className="bg-muted/50 rounded-lg shadow p-4">
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-base font-semibold">Departments</Label>
                    {!viewing && (
                      <Button size="sm" className="gap-1" onClick={() => {
                        setDeptForm({ name: "", level: "UG", hod: "", status: "Active" });
                        setDeptEditIndex(null);
                      }}>
                        <Plus className="w-4 h-4 mr-1" /> Add Department
                      </Button>
                    )}
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-sm border rounded-lg">
                      <thead>
                        <tr className="bg-muted">
                          <th className="px-2 py-1 border">Name</th>
                          <th className="px-2 py-1 border">Level</th>
                          <th className="px-2 py-1 border">HOD</th>
                          <th className="px-2 py-1 border">Status</th>
                          {!viewing && <th className="px-2 py-1 border">Actions</th>}
                        </tr>
                      </thead>
                      <tbody>
                        {form.departments && form.departments.length > 0 ? form.departments.map((dept, idx) => (
                          <tr key={dept.id || idx} className={idx % 2 === 0 ? "bg-white hover:bg-muted/30" : "bg-muted/10 hover:bg-muted/30"}>
                            <td className="px-2 py-1 border">{deptEditIndex === idx ? (
                              <Input
                                value={deptForm.name}
                                onChange={e => setDeptForm(f => ({ ...f, name: e.target.value }))}
                                disabled={!!viewing}
                              />
                            ) : dept.name}</td>
                            <td className="px-2 py-1 border">{deptEditIndex === idx ? (
                              <Select
                                value={deptForm.level}
                                onValueChange={value => setDeptForm(f => ({ ...f, level: value as any }))}
                                disabled={!!viewing}
                              >
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                  {DEPARTMENT_LEVELS.map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}
                                </SelectContent>
                              </Select>
                            ) : dept.level}</td>
                            <td className="px-2 py-1 border">{deptEditIndex === idx ? (
                              <Input
                                value={deptForm.hod}
                                onChange={e => setDeptForm(f => ({ ...f, hod: e.target.value }))}
                                disabled={!!viewing}
                              />
                            ) : dept.hod}</td>
                            <td className="px-2 py-1 border">{deptEditIndex === idx ? (
                              <Select
                                value={deptForm.status}
                                onValueChange={value => setDeptForm(f => ({ ...f, status: value as any }))}
                                disabled={!!viewing}
                              >
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                  {DEPARTMENT_STATUSES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                                </SelectContent>
                              </Select>
                            ) : (
                              <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${dept.status === "Active" ? "bg-green-100 text-green-800" : "bg-gray-200 text-gray-800"}`}>{dept.status}</span>
                            )}</td>
                            {!viewing && <td className="px-2 py-1 border">
                              {deptEditIndex === idx ? (
                                <>
                                  <Button size="sm" variant="outline" className="gap-1" onClick={() => {
                                    setForm(f => ({
                                      ...f,
                                      departments: f.departments!.map((d, i) => i === idx ? {
                                        id: d.id,
                                        name: deptForm.name as string,
                                        level: deptForm.level as "UG" | "PG" | "Diploma",
                                        hod: deptForm.hod as string,
                                        status: deptForm.status as "Active" | "Archived"
                                      } : d)
                                    }));
                                    setDeptEditIndex(null);
                                  }} title="Save">
                                    <Plus className="w-4 h-4" />
                                  </Button>
                                  <Button size="sm" variant="ghost" className="gap-1" onClick={() => setDeptEditIndex(null)} title="Cancel">
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </>
                              ) : (
                                <>
                                  <Button size="sm" variant="outline" className="gap-1" onClick={() => {
                                    setDeptForm(dept);
                                    setDeptEditIndex(idx);
                                  }} title="Edit">
                                    <Edit2 className="w-4 h-4" />
                                  </Button>
                                  <Button size="sm" variant="ghost" className="gap-1" onClick={() => {
                                    setForm(f => ({
                                      ...f,
                                      departments: f.departments!.filter((_, i) => i !== idx)
                                    }));
                                  }} title="Delete">
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </>
                              )}
                            </td>}
                          </tr>
                        )) : (
                          <tr><td colSpan={viewing ? 4 : 5} className="text-center py-2">No departments</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                  {/* Add new department form */}
                  {!viewing && deptEditIndex === null && (
                    <form className="flex flex-wrap gap-2 mt-4 items-end" onSubmit={e => {
                      e.preventDefault();
                      setForm(f => ({
                        ...f,
                        departments: [
                          ...(f.departments || []),
                          {
                            id: Date.now().toString(),
                            name: deptForm.name as string,
                            level: deptForm.level as "UG" | "PG" | "Diploma",
                            hod: deptForm.hod as string,
                            status: deptForm.status as "Active" | "Archived"
                          }
                        ]
                      }));
                      setDeptForm({ name: "", level: "UG", hod: "", status: "Active" });
                    }}>
                      <div>
                        <Label>Name</Label>
                        <Input value={deptForm.name} onChange={e => setDeptForm(f => ({ ...f, name: e.target.value }))} required />
                      </div>
                      <div>
                        <Label>Level</Label>
                        <Select value={deptForm.level} onValueChange={value => setDeptForm(f => ({ ...f, level: value as any }))}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {DEPARTMENT_LEVELS.map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>HOD</Label>
                        <Input value={deptForm.hod} onChange={e => setDeptForm(f => ({ ...f, hod: e.target.value }))} required />
                      </div>
                      <div>
                        <Label>Status</Label>
                        <Select value={deptForm.status} onValueChange={value => setDeptForm(f => ({ ...f, status: value as any }))}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {DEPARTMENT_STATUSES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                      <Button type="submit" size="sm" className="h-10 gap-1">
                        <Plus className="w-4 h-4" /> Add
                      </Button>
                    </form>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
          <SheetFooter className="mt-6">
            {viewing ? (
              <Button variant="outline" onClick={() => { setShowForm(false); setViewing(null); }}>Close</Button>
            ) : (
              <>
                <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
                <Button variant="outline">Save as Draft</Button>
                <Button onClick={handleSaveCollege}>
                  {editing ? "Update College" : "Add College"}
                </Button>
              </>
            )}
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
