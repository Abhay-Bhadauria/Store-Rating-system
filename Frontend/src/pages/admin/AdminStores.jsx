import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '@layouts/AdminLayout';
import { adminService } from '@services/admin.service';
import { formatRating } from '@utils';
import SearchBar from '@components/ui/SearchBar';
import Table from '@components/ui/Table';
import Pagination from '@components/ui/Pagination';
import LoadingSpinner from '@components/ui/LoadingSpinner';
import ErrorState from '@components/ui/ErrorState';
import EmptyState from '@components/ui/EmptyState';
import { Store, Star } from 'lucide-react';

export default function AdminStores() {
  const navigate = useNavigate();
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  const fetchStores = async (page = 1, searchQuery = '') => {
    try {
      setLoading(true);
      setError(null);
      const params = {
        page,
        limit: pagination.limit,
        search: searchQuery,
      };
      const response = await adminService.getStores(params);
      
      if (response.success && response.data) {
        setStores(response.data.stores || []);
        setPagination({
  page: response.data.pagination.page,
  limit: response.data.pagination.limit,
  total: response.data.pagination.totalItems,
  totalPages: response.data.pagination.totalPages,
});

      } else {
        setError(response.message || 'Failed to fetch stores');
      }
    } catch (err) {
      setError(err.message || 'An error occurred while fetching stores');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStores(1, search);
  }, [search]);

  const handleSearch = (value) => {
    setSearch(value);
  };

  const handleClearSearch = () => {
    setSearch('');
  };

  const handlePageChange = (page) => {
    fetchStores(page, search);
  };

  const handleRowClick = (store) => {
    navigate(`/admin/stores/${store.id}`);
  };

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Store Name' },
    { key: 'address', label: 'Address' },
    { 
      key: 'owner', 
      label: 'Owner',
      render: (value) => value?.name || 'N/A'
    },
    { 
      key: 'averageRating', 
      label: 'Rating',
      render: (value) => (
        <div className="flex items-center gap-1">
          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
          <span>{value ? value.toFixed(1) : 'N/A'}</span>
        </div>
      )
    },
    { 
      key: 'totalRatings', 
      label: 'Total Ratings',
      render: (value) => value || 0
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
          title="Failed to load stores"
          message={error}
          onRetry={() => fetchStores(pagination.page, search)}
        />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Stores</h1>
            <p className="text-gray-600">Manage system stores</p>
          </div>
        </div>

        <SearchBar
          value={search}
          onChange={handleSearch}
          onClear={handleClearSearch}
          placeholder="Search stores by name or address..."
        />

        {stores.length === 0 ? (
          <EmptyState
            title="No stores found"
            description={search ? 'No stores match your search criteria.' : 'There are no stores in the system yet.'}
            icon={Store}
          />
        ) : (
          <>
            <Table
              columns={columns}
              data={stores}
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
    </AdminLayout>
  );
}
