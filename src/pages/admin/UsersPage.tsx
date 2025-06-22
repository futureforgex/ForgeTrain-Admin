import React, { useState, useEffect } from 'react';
import { 
  User,
  UserPlus, 
  Filter, 
  Download,
  Mail
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DataTable from '@/components/admin/DataTable/DataTable';
import FormModal from '@/components/admin/FormModal/FormModal';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { generateClient } from 'aws-amplify/api';
import * as queries from '@/graphql/queries';
import * as mutations from '@/graphql/mutations';

interface UserType {
  id: string;
  name: string;
  email: string;
  role: string;
  college: string;
  department?: string;
  year?: number;
  status: string;
  lastLogin?: string;
}

const UsersPage = () => {
  const [currentTab, setCurrentTab] = useState('all');
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  const [users, setUsers] = useState<UserType[]>([]);
  const client = generateClient();

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line
  }, []);

  const fetchUsers = async () => {
    try {
      const { data } = await client.graphql({ query: queries.listUsers, variables: { limit: 1000 } });
      const items = data?.listUsers?.items || [];
      setUsers(items);
    } catch (err) {
      setUsers([]);
    }
  };

  // Filter users based on current tab
  const filteredUsers = users.filter(user => {
    if (currentTab === 'all') return true;
    if (currentTab === 'active') return user.status === 'active';
    if (currentTab === 'inactive') return user.status === 'inactive';
    if (currentTab === 'pending') return user.status === 'pending';
    if (currentTab === 'students') return user.role === 'student';
    if (currentTab === 'mentors') return user.role === 'mentor';
    if (currentTab === 'officers') return user.role === 'officer';
    return true;
  });

  const handleEditUser = (user: UserType) => {
    setCurrentUser(user);
    setIsEditUserModalOpen(true);
  };

  const handleDeleteUser = async (user: UserType) => {
    try {
      await client.graphql({
        query: mutations.deleteUser,
        variables: { input: { id: user.id } },
      });
      fetchUsers();
    } catch (err) {
      // handle error
    }
  };

  const handleSubmitAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as typeof e.target & {
      name: { value: string };
      email: { value: string };
      role: { value: string };
      status: { value: string };
      college: { value: string };
      department: { value: string };
      year: { value: string };
    };
    try {
      await client.graphql({
        query: mutations.createUser,
        variables: {
          input: {
            name: form.name.value,
            email: form.email.value,
            role: form.role.value,
            status: form.status.value,
            college: form.college.value,
            department: form.department.value,
            year: Number(form.year.value),
          },
        },
      });
      setIsAddUserModalOpen(false);
      fetchUsers();
    } catch (err) {
      // handle error
    }
  };

  const handleSubmitEditUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    const form = e.target as typeof e.target & {
      name: { value: string };
      email: { value: string };
      role: { value: string };
      status: { value: string };
      college: { value: string };
      department: { value: string };
      year: { value: string };
    };
    try {
      await client.graphql({
        query: mutations.updateUser,
        variables: {
          input: {
            id: currentUser.id,
            name: form.name.value,
            email: form.email.value,
            role: form.role.value,
            status: form.status.value,
            college: form.college.value,
            department: form.department.value,
            year: Number(form.year.value),
          },
        },
      });
      setIsEditUserModalOpen(false);
      fetchUsers();
    } catch (err) {
      // handle error
    }
  };
  
  const getRoleColor = (role: string) => {
    switch (role) {
      case 'student':
        return 'bg-blue-100 text-blue-800';
      case 'mentor':
        return 'bg-purple-100 text-purple-800';
      case 'officer':
        return 'bg-amber-100 text-amber-800';
      case 'admin':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Define columns for the DataTable
  const columns = [
    {
      id: 'name',
      header: 'Name',
      cell: (user: UserType) => (
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-foreground font-semibold">
            {user.name.charAt(0)}
          </div>
          <div className="flex flex-col">
            <span className="font-medium">{user.name}</span>
            <span className="text-xs text-muted-foreground">{user.email}</span>
          </div>
        </div>
      ),
      sortable: true,
    },
    {
      id: 'role',
      header: 'Role',
      cell: (user: UserType) => (
        <div className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getRoleColor(user.role)}`}>
          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
        </div>
      ),
      sortable: true,
    },
    {
      id: 'college',
      header: 'College',
      cell: (user: UserType) => user.college,
      sortable: true,
    },
    {
      id: 'status',
      header: 'Status',
      cell: (user: UserType) => (
        <div className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(user.status)}`}>
          {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
        </div>
      ),
      sortable: true,
    },
    {
      id: 'lastLogin',
      header: 'Last Login',
      cell: (user: UserType) => (
        user.lastLogin 
          ? new Date(user.lastLogin).toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric', 
              year: 'numeric' 
            })
          : 'Never'
      ),
      sortable: true,
    },
  ];
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1>Users Management</h1>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={() => {
              // In a real app, this would trigger a CSV export
              console.log('Exporting users to CSV');
            }}
          >
            <Download size={16} />
            <span>Export</span>
          </Button>
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={() => {
              // In a real app, this would open a bulk email interface
              console.log('Opening bulk email interface');
            }}
          >
            <Mail size={16} />
            <span>Bulk Email</span>
          </Button>
          <Button 
            className="flex items-center gap-2"
            onClick={() => setIsAddUserModalOpen(true)}
          >
            <UserPlus size={16} />
            <span>Add User</span>
          </Button>
        </div>
      </div>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Users</CardTitle>
          <CardDescription>
            Manage user accounts, roles and permissions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={currentTab} onValueChange={setCurrentTab} className="space-y-4">
            <div className="flex justify-between items-center">
              <TabsList>
                <TabsTrigger value="all">All Users</TabsTrigger>
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="inactive">Inactive</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="students">Students</TabsTrigger>
                <TabsTrigger value="mentors">Mentors</TabsTrigger>
                <TabsTrigger value="officers">Officers</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value={currentTab} className="space-y-4">
              <DataTable
                data={filteredUsers}
                columns={columns}
                searchable
                filterable
                pagination
                bulkActions
                onEdit={handleEditUser}
                onDelete={handleDeleteUser}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      {/* Add User Modal */}
      <FormModal
        title="Add New User"
        description="Create a new user account in the system."
        open={isAddUserModalOpen}
        onOpenChange={setIsAddUserModalOpen}
        onSubmit={handleSubmitAddUser}
        submitText="Create User"
      >
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" placeholder="Enter full name" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="Enter email address" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select defaultValue="student">
              <SelectTrigger id="role">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="student">Student</SelectItem>
                <SelectItem value="mentor">Mentor</SelectItem>
                <SelectItem value="officer">Placement Officer</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select defaultValue="active">
              <SelectTrigger id="status">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2 col-span-2">
            <Label htmlFor="college">College/Institution</Label>
            <Input id="college" placeholder="Enter college or institution name" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="department">Department</Label>
            <Input id="department" placeholder="E.g., Computer Science" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="year">Year</Label>
            <Select>
              <SelectTrigger id="year">
                <SelectValue placeholder="Select year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1st Year</SelectItem>
                <SelectItem value="2">2nd Year</SelectItem>
                <SelectItem value="3">3rd Year</SelectItem>
                <SelectItem value="4">4th Year</SelectItem>
                <SelectItem value="5">5th Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </FormModal>
      
      {/* Edit User Modal */}
      {currentUser && (
        <FormModal
          title={`Edit User: ${currentUser.name}`}
          description="Edit user details and access."
          open={isEditUserModalOpen}
          onOpenChange={setIsEditUserModalOpen}
          onSubmit={handleSubmitEditUser}
          submitText="Save Changes"
        >
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Full Name</Label>
              <Input id="edit-name" defaultValue={currentUser.name} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-email">Email</Label>
              <Input id="edit-email" type="email" defaultValue={currentUser.email} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-role">Role</Label>
              <Select defaultValue={currentUser.role}>
                <SelectTrigger id="edit-role">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="student">Student</SelectItem>
                  <SelectItem value="mentor">Mentor</SelectItem>
                  <SelectItem value="officer">Placement Officer</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-status">Status</Label>
              <Select defaultValue={currentUser.status}>
                <SelectTrigger id="edit-status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 col-span-2">
              <Label htmlFor="edit-college">College/Institution</Label>
              <Input id="edit-college" defaultValue={currentUser.college} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-department">Department</Label>
              <Input id="edit-department" defaultValue={currentUser.department || ''} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-year">Year</Label>
              <Select defaultValue={currentUser.year?.toString() || ''}>
                <SelectTrigger id="edit-year">
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1st Year</SelectItem>
                  <SelectItem value="2">2nd Year</SelectItem>
                  <SelectItem value="3">3rd Year</SelectItem>
                  <SelectItem value="4">4th Year</SelectItem>
                  <SelectItem value="5">5th Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </FormModal>
      )}
    </div>
  );
};

export default UsersPage;
