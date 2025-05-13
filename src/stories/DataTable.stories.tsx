
// This is a sample file showing how the components would be documented in Storybook
// Note: Storybook is not actually installed in this project

import type { Meta, StoryObj } from '@storybook/react';
import DataTable from '../components/admin/DataTable/DataTable';
import mockUsers from '../data/mockUsers';

const meta = {
  title: 'Admin/DataTable',
  component: DataTable,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof DataTable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    data: mockUsers,
    columns: [
      {
        id: 'name',
        header: 'Name',
        cell: (user) => user.name,
        sortable: true,
      },
      {
        id: 'email',
        header: 'Email',
        cell: (user) => user.email,
        sortable: true,
      },
      {
        id: 'role',
        header: 'Role',
        cell: (user) => user.role,
        sortable: true,
      },
      {
        id: 'status',
        header: 'Status',
        cell: (user) => user.status,
        sortable: true,
      },
    ],
    searchable: true,
    filterable: true,
    pagination: true,
    bulkActions: true,
  },
};

export const CompactView: Story = {
  args: {
    ...Default.args,
    pagination: false,
    bulkActions: false,
    searchable: false,
    filterable: false,
  },
};

export const WithRowClick: Story = {
  args: {
    ...Default.args,
    onRowClick: (user) => {
      console.log('Row clicked:', user);
      alert(`You clicked on ${user.name}`);
    },
  },
};

export const WithCustomCells: Story = {
  args: {
    data: mockUsers,
    columns: [
      {
        id: 'name',
        header: 'Name',
        cell: (user) => (
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
        cell: (user) => {
          const roleColors = {
            student: 'bg-blue-100 text-blue-800',
            mentor: 'bg-purple-100 text-purple-800',
            officer: 'bg-amber-100 text-amber-800',
            admin: 'bg-red-100 text-red-800',
          };
          
          const roleColor = roleColors[user.role] || 'bg-gray-100 text-gray-800';
          
          return (
            <div className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${roleColor}`}>
              {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
            </div>
          );
        },
        sortable: true,
      },
      {
        id: 'status',
        header: 'Status',
        cell: (user) => {
          const statusColors = {
            active: 'bg-green-100 text-green-800',
            inactive: 'bg-gray-100 text-gray-800',
            pending: 'bg-yellow-100 text-yellow-800',
          };
          
          const statusColor = statusColors[user.status] || 'bg-gray-100 text-gray-800';
          
          return (
            <div className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColor}`}>
              {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
            </div>
          );
        },
        sortable: true,
      },
    ],
    searchable: true,
    filterable: true,
    pagination: true,
    bulkActions: true,
    onEdit: (user) => {
      console.log('Edit user:', user);
      alert(`Editing ${user.name}`);
    },
    onDelete: (user) => {
      console.log('Delete user:', user);
      alert(`Deleting ${user.name}`);
    },
  },
};
