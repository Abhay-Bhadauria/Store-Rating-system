import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '@layouts/AdminLayout';
import { adminService } from '@services/admin.service';
import { ROLE_LABELS } from '@constants';
import { toastUtils } from '@utils';
import SearchBar from '@components/ui/SearchBar';
import Table from '@components/ui/Table';
import Pagination from '@components/ui/Pagination';
import LoadingSpinner from '@components/ui/LoadingSpinner';
import ErrorState from '@components/ui/ErrorState';
import EmptyState from '@components/ui/EmptyState';
import Button from '@components/ui/Button';
import ConfirmDialog from '@components/ui/ConfirmDialog';
import AddUserModal from '@components/admin/AddUserModal';
import EditUserModal from '@components/admin/EditUserModal';
import { Users, Plus, Edit, Trash2 } from 'lucide-react';

export default function AdminUsers() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  const fetchUsers = async (page = 1, searchQuery = '') => {
    try {
      setLoading(true);
      setError(null);
      const params = {
        page,
        limit: pagination.limit,
        search: searchQuery,
      };
      const response = await adminService.getUsers(params);
      
      if (response.success && response.data) {
        setUsers(response.data.users || []);
        setPagination({
  page: response.data.pagination.page,
  limit: response.data.pagination.limit,
  total: response.data.pagination.totalItems,
  totalPages: response.data.pagination.totalPages,
});
      } else {
        setError(response.message || 'Failed to fetch users');
      }
    } catch (err) {
      setError(err.message || 'An error occurred while fetching users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(1, search);
  }, [search]);

  const handleSearch = (value) => {
    setSearch(value);
  };

  const handleClearSearch = () => {
    setSearch('');
  };

  const handlePageChange = (page) => {
    fetchUsers(page, search);
  };

  const handleRowClick = (user) => {
    navigate(`/admin/users/${user.id}`);
  };

  const handleAddUserSuccess = () => {
    toastUtils.success('User created successfully');
    fetchUsers(pagination.page, search);
  };

  const handleEditUserSuccess = () => {
    toastUtils.success('User updated successfully');
    fetchUsers(pagination.page, search);
    setIsEditModalOpen(false);
    setSelectedUser(null);
  };

  const handleEditClick = (user, event) => {
    event.stopPropagation();
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (user, event) => {
    event.stopPropagation();
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      setDeleteLoading(true);
      const response = await adminService.deleteUser(selectedUser.id);

      if (response.success) {
        toastUtils.success('User deleted successfully');
        setIsDeleteDialogOpen(false);
        setSelectedUser(null);
        fetchUsers(pagination.page, search);
      } else {
        toastUtils.error(response.message || 'Failed to delete user');
      }
    } catch (error) {
      toastUtils.error(error.message || 'An error occurred while deleting user');
    } finally {
      setDeleteLoading(false);
    }
  };

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { 
      key: 'role', 
      label: 'Role',
      render: (value) => (
        <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
          {ROLE_LABELS[value] || value}
        </span>
      )
    },
    { key: 'address', label: 'Address' },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={(e) => handleEditClick(row, e)}
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={(e) => handleDeleteClick(row, e)}
          >
            <Trash2 className="w-4 h-4 text-red-600" />
          </Button>
        </div>
      ),
    },
  ];

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <ErrorState
          title="Failed to load users"
          message={error}
          onRetry={() => fetchUsers(pagination.page, search)}
        />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Users</h1>
            <p className="text-gray-600">Manage system users</p>
          </div>
          <Button onClick={() => setIsAddModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add User
          </Button>
        </div>

        <SearchBar
          value={search}
          onChange={handleSearch}
          onClear={handleClearSearch}
          placeholder="Search users by name or email..."
        />

        {users.length === 0 ? (
          <EmptyState
            title="No users found"
            description={search ? 'No users match your search criteria.' : 'There are no users in the system yet.'}
            icon={Users}
          />
        ) : (
          <>
            <Table
              columns={columns}
              data={users}
              onRowClick={handleRowClick}
            />

            {pagination.totalPages > 1 && (
              <Pagination
                currentPage={pagination.page}
                totalPages={pagination.totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </>
        )}
      </div>

      <AddUserModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={handleAddUserSuccess}
      />

      <EditUserModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedUser(null);
        }}
        onSuccess={handleEditUserSuccess}
        user={selectedUser}
      />

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setSelectedUser(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete User"
        message={`Are you sure you want to delete ${selectedUser?.name}? This action cannot be undone.`}
        confirmText="Delete"
        loading={deleteLoading}
        variant="danger"
      />
    </AdminLayout>
  );
}
