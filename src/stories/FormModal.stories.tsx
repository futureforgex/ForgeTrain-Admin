
// This is a sample file showing how the components would be documented in Storybook
// Note: Storybook is not actually installed in this project

import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import FormModal from '../components/admin/FormModal/FormModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';

const FormModalTemplate = (args) => {
  const [open, setOpen] = useState(false);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted');
    setTimeout(() => {
      setOpen(false);
    }, 1000);
  };
  
  return (
    <div>
      <Button onClick={() => setOpen(true)}>Open Modal</Button>
      <FormModal
        {...args}
        open={open}
        onOpenChange={setOpen}
        onSubmit={handleSubmit}
      >
        {args.children}
      </FormModal>
    </div>
  );
};

const meta = {
  title: 'Admin/FormModal',
  component: FormModalTemplate,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof FormModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Form Modal',
    description: 'This is a sample form modal.',
    submitText: 'Submit',
    cancelText: 'Cancel',
    isSubmitting: false,
    isDisabled: false,
    children: (
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" placeholder="Enter your name" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="Enter your email" />
        </div>
      </div>
    ),
  },
};

export const WithFooterContent: Story = {
  args: {
    title: 'Form Modal with Footer Content',
    description: 'This modal includes additional content in the footer.',
    submitText: 'Submit',
    cancelText: 'Cancel',
    isSubmitting: false,
    isDisabled: false,
    footerContent: (
      <p className="text-xs text-muted-foreground">
        All fields are required.
      </p>
    ),
    children: (
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" placeholder="Enter your name" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="Enter your email" />
        </div>
      </div>
    ),
  },
};

export const ComplexForm: Story = {
  args: {
    title: 'Add New User',
    description: 'Create a new user account in the system.',
    submitText: 'Create User',
    cancelText: 'Cancel',
    size: 'lg',
    isSubmitting: false,
    isDisabled: false,
    children: (
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
    ),
  },
};

export const LoadingState: Story = {
  args: {
    title: 'Form Modal Loading State',
    description: 'This modal shows a loading state when submitting.',
    submitText: 'Submit',
    cancelText: 'Cancel',
    isSubmitting: true,
    isDisabled: false,
    children: (
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" placeholder="Enter your name" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="Enter your email" />
        </div>
      </div>
    ),
  },
};

export const DisabledState: Story = {
  args: {
    title: 'Form Modal Disabled State',
    description: 'This modal shows a disabled state.',
    submitText: 'Submit',
    cancelText: 'Cancel',
    isSubmitting: false,
    isDisabled: true,
    children: (
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" placeholder="Enter your name" disabled />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="Enter your email" disabled />
        </div>
      </div>
    ),
  },
};
