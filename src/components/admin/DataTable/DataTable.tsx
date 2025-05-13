
import React, { useState } from 'react';
import { 
  ArrowDown, 
  ArrowUp, 
  ChevronLeft, 
  ChevronRight, 
  Filter, 
  MoreHorizontal, 
  Search,
  Trash,
  Edit,
  Download
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';

interface DataTableProps<T> {
  data: T[];
  columns: {
    id: string;
    header: string;
    cell: (item: T) => React.ReactNode;
    sortable?: boolean;
  }[];
  searchable?: boolean;
  filterable?: boolean;
  pagination?: boolean;
  bulkActions?: boolean;
  onSearch?: (query: string) => void;
  onSort?: (column: string, direction: 'asc' | 'desc') => void;
  onRowClick?: (item: T) => void;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  className?: string;
}

function DataTable<T extends { id: string | number }>({
  data,
  columns,
  searchable = true,
  filterable = true,
  pagination = true,
  bulkActions = true,
  onSearch,
  onSort,
  onRowClick,
  onEdit,
  onDelete,
  className,
}: DataTableProps<T>) {
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRows, setSelectedRows] = useState<Set<string | number>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  
  const handleSort = (columnId: string) => {
    const isAsc = sortColumn === columnId && sortDirection === 'asc';
    const direction = isAsc ? 'desc' : 'asc';
    
    setSortColumn(columnId);
    setSortDirection(direction);
    
    if (onSort) {
      onSort(columnId, direction);
    }
  };
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (onSearch) {
      onSearch(query);
    }
  };
  
  const handleSelectAll = () => {
    if (selectedRows.size === data.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(data.map(item => item.id)));
    }
  };
  
  const handleSelectRow = (id: string | number) => {
    const newSelection = new Set(selectedRows);
    
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    
    setSelectedRows(newSelection);
  };
  
  // Pagination logic
  const totalPages = Math.ceil(data.length / rowsPerPage);
  const paginatedData = pagination
    ? data.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)
    : data;
  
  return (
    <div className={cn("space-y-4", className)}>
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          {searchable && (
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search..."
                className="pl-8 md:w-64 w-full"
                value={searchQuery}
                onChange={handleSearch}
              />
            </div>
          )}
          
          {filterable && (
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Filter size={16} />
              <span>Filter</span>
            </Button>
          )}
        </div>
        
        {/* Bulk actions */}
        {bulkActions && selectedRows.size > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {selectedRows.size} selected
            </span>
            <Button size="sm" variant="outline" className="flex items-center gap-1">
              <Download size={16} />
              <span>Export</span>
            </Button>
            <Button size="sm" variant="outline" className="flex items-center gap-1 text-admin-danger">
              <Trash size={16} />
              <span>Delete</span>
            </Button>
          </div>
        )}
      </div>
      
      {/* Table */}
      <div className="rounded-md border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              {bulkActions && (
                <TableHead className="w-12">
                  <Checkbox 
                    checked={selectedRows.size === data.length && data.length > 0} 
                    indeterminate={selectedRows.size > 0 && selectedRows.size < data.length}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
              )}
              
              {columns.map((column) => (
                <TableHead 
                  key={column.id}
                  className={cn(
                    column.sortable ? "cursor-pointer select-none" : "",
                  )}
                  onClick={() => column.sortable && handleSort(column.id)}
                >
                  <div className="flex items-center gap-1">
                    {column.header}
                    {column.sortable && sortColumn === column.id && (
                      <span>
                        {sortDirection === 'asc' ? (
                          <ArrowUp size={16} className="text-primary" />
                        ) : (
                          <ArrowDown size={16} className="text-primary" />
                        )}
                      </span>
                    )}
                  </div>
                </TableHead>
              ))}
              
              <TableHead className="w-16">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (bulkActions ? 2 : 1)}
                  className="text-center h-24 text-muted-foreground"
                >
                  No results found
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((row) => (
                <TableRow 
                  key={row.id} 
                  className={cn(
                    onRowClick ? "cursor-pointer hover:bg-muted/50" : "",
                    selectedRows.has(row.id) ? "bg-primary/5" : ""
                  )}
                  onClick={() => onRowClick && onRowClick(row)}
                >
                  {bulkActions && (
                    <TableCell onClick={(e) => e.stopPropagation()} className="w-12">
                      <Checkbox 
                        checked={selectedRows.has(row.id)} 
                        onCheckedChange={() => handleSelectRow(row.id)}
                      />
                    </TableCell>
                  )}
                  
                  {columns.map((column) => (
                    <TableCell key={column.id}>
                      {column.cell(row)}
                    </TableCell>
                  ))}
                  
                  <TableCell onClick={(e) => e.stopPropagation()} className="w-16">
                    <div className="flex items-center justify-end gap-2">
                      {onEdit && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onEdit(row)}
                          className="h-8 w-8"
                        >
                          <Edit size={16} />
                          <span className="sr-only">Edit</span>
                        </Button>
                      )}
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <MoreHorizontal size={16} />
                            <span className="sr-only">More</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => onEdit && onEdit(row)}>
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => onDelete && onDelete(row)}
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      {/* Pagination */}
      {pagination && data.length > 0 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {((currentPage - 1) * rowsPerPage) + 1} to {Math.min(currentPage * rowsPerPage, data.length)} of {data.length} entries
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft size={16} />
              <span className="sr-only">Previous</span>
            </Button>
            
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNum = i + 1;
              return (
                <Button
                  key={pageNum}
                  variant={pageNum === currentPage ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(pageNum)}
                >
                  {pageNum}
                </Button>
              );
            })}
            
            {totalPages > 5 && <span className="px-2">...</span>}
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight size={16} />
              <span className="sr-only">Next</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default DataTable;
