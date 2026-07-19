import { useEffect, useState } from "react";
import OwnerLayout from "@layouts/OwnerLayout";
import { storeOwnerService } from "@services/storeOwner.service";
import Table from "@components/ui/Table";
import Pagination from "@components/ui/Pagination";
import LoadingSpinner from "@components/ui/LoadingSpinner";
import ErrorState from "@components/ui/ErrorState";
import EmptyState from "@components/ui/EmptyState";

import { Users, Star } from "lucide-react";

export default function OwnerRaters() {
  const [raters, setRaters] = useState([]);
  const [store, setStore] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  const fetchRaters = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);

      const response = await storeOwnerService.getStoreRaters({
        page,
        limit: pagination.limit,
        
      });

      if (response.success && response.data) {
        setStore(response.data.store);

        setRaters(response.data.raters || []);

        setPagination({
          page: response.data.pagination.page,
          limit: response.data.pagination.limit,
          total: response.data.pagination.totalItems,
          totalPages: response.data.pagination.totalPages,
        });
      } else {
        setError(response.message || "Failed to load raters");
      }
    } catch (err) {
      setError(err.message || "Failed to load raters");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRaters();
  },[]);

  const handlePageChange = (page) => {
    fetchRaters(page);
  };

  const columns = [
    {
      key: "name",
      label: "Name",
      render: (_, row) => row.user.name,
    },
    {
      key: "email",
      label: "Email",
      render: (_, row) => row.user.email,
    },
    {
      key: "address",
      label: "Address",
      render: (_, row) => row.user.address,
    },
    {
      key: "rating",
      label: "Rating",
      render: (value) => (
        <div className="flex items-center gap-1">
          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
          {value}
        </div>
      ),
    },
  ];

  if (loading) {
    return (
      <OwnerLayout>
        <div className="flex justify-center py-16">
          <LoadingSpinner size="lg" />
        </div>
      </OwnerLayout>
    );
  }

  if (error) {
    return (
      <OwnerLayout>
        <ErrorState
          title="Failed to load raters"
          message={error}
          onRetry={() => fetchRaters()}
        />
      </OwnerLayout>
    );
  }

  return (
    <OwnerLayout>
      <div className="space-y-6">

        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Store Raters
          </h1>

          <p className="text-gray-600">
            Users who rated <span className="font-semibold">{store?.name}</span>
          </p>
        </div>

        

        {raters.length === 0 ? (
          <EmptyState
            title="No Ratings"
            description="No users have rated your store yet."
            icon={Users}
          />
        ) : (
          <>
            <Table
              columns={columns}
              data={raters}
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
    </OwnerLayout>
  );
}