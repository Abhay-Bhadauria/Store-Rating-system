import { useEffect, useState } from "react";
import OwnerLayout from "@layouts/OwnerLayout";
import { Store, Star, Mail, MapPin } from "lucide-react";
import { storeOwnerService } from "@services/storeOwner.service";
import LoadingSpinner from "@components/ui/LoadingSpinner";
import ErrorState from "@components/ui/ErrorState";

export default function OwnerDashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await storeOwnerService.getDashboard();

      if (response.success) {
        setDashboard(response.data);
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError(err.message || "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

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
          title="Failed to load dashboard"
          message={error}
          onRetry={fetchDashboard}
        />
      </OwnerLayout>
    );
  }

  const store = dashboard?.store;

  return (
    <OwnerLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Store Owner Dashboard
          </h1>
          <p className="text-gray-600">
            Overview of your store's performance
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Average Rating
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {dashboard.averageRating}
                </p>
              </div>

              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Star className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Ratings
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {dashboard.totalRatings}
                </p>
              </div>

              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Store className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Store Details */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            Store Details
          </h2>

          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <Store className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Store Name</p>
                <p className="font-medium">{store.name}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{store.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Address</p>
                <p className="font-medium">{store.address}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </OwnerLayout>
  );
}