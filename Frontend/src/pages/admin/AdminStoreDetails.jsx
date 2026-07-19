import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import AdminLayout from "@layouts/AdminLayout";
import { adminService } from "@services/admin.service";

import LoadingSpinner from "@components/ui/LoadingSpinner";

export default function AdminStoreDetails() {

  const { id } = useParams();

  const [store, setStore] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

    const loadStore = async () => {

    try {

      setLoading(true);

      setError("");

      const response = await adminService.getStoreById(id);

      if (response.success && response.data) {

        setStore(response.data.store);

      }

    } catch (err) {

      console.error(err);

      setError("Unable to load store.");

    } finally {

      setLoading(false);

    }

  };

    useEffect(() => {

    loadStore();

  }, [id]);

    if (loading) {

    return (

      <AdminLayout>

        <LoadingSpinner
          size="lg"
          className="h-[60vh]"
        />

      </AdminLayout>

    );

  }

    if (error) {

    return (

      <AdminLayout>

        <div className="text-center text-red-600 mt-20">

          {error}

        </div>

      </AdminLayout>

    );

  }

    if (!store) {

    return (

      <AdminLayout>

        <div className="text-center mt-20">

          Store not found.

        </div>

      </AdminLayout>

    );

  }
    return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto p-6 space-y-6">

        <h1 className="text-3xl font-bold">
          Store Details
        </h1>

        {/* Store Information */}
        <div className="bg-white rounded-lg shadow p-6">

          <h2 className="text-xl font-semibold mb-4">
            Store Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <div>
              <p className="text-sm text-gray-500">
                Store Name
              </p>
              <p className="font-medium">
                {store.name}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Email
              </p>
              <p className="font-medium">
                {store.email}
              </p>
            </div>

            <div className="md:col-span-2">
              <p className="text-sm text-gray-500">
                Address
              </p>
              <p className="font-medium">
                {store.address}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Average Rating
              </p>
              <p className="font-medium">
                {store.averageRating ?? "N/A"}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Total Ratings
              </p>
              <p className="font-medium">
                {store.totalRatings}
              </p>
            </div>

          </div>

        </div>

        {/* Owner Information */}
        <div className="bg-white rounded-lg shadow p-6">

          <h2 className="text-xl font-semibold mb-4">
            Owner Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <div>
              <p className="text-sm text-gray-500">
                Owner Name
              </p>
              <p className="font-medium">
                {store.owner?.name}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Owner Email
              </p>
              <p className="font-medium">
                {store.owner?.email}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Role
              </p>
              <p className="font-medium capitalize">
                {store.owner?.role?.replaceAll("_", " ")}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Address
              </p>
              <p className="font-medium">
                {store.owner?.address}
              </p>
            </div>

          </div>

        </div>

        {/* Ratings */}
        <div className="bg-white rounded-lg shadow p-6">

          <h2 className="text-xl font-semibold mb-4">
            Ratings
          </h2>

          {store.ratings && store.ratings.length > 0 ? (

            <div className="overflow-x-auto">

              <table className="min-w-full divide-y divide-gray-200">

                <thead>

                  <tr className="bg-gray-50">

                    <th className="px-4 py-3 text-left text-sm font-semibold">
                      User
                    </th>

                    <th className="px-4 py-3 text-left text-sm font-semibold">
                      Email
                    </th>

                    <th className="px-4 py-3 text-left text-sm font-semibold">
                      Rating
                    </th>

                    <th className="px-4 py-3 text-left text-sm font-semibold">
                      Date
                    </th>

                  </tr>

                </thead>

                <tbody className="divide-y divide-gray-200">

                  {store.ratings.map((rating) => (

                    <tr key={rating.id}>

                      <td className="px-4 py-3">
                        {rating.user?.name}
                      </td>

                      <td className="px-4 py-3">
                        {rating.user?.email}
                      </td>

                      <td className="px-4 py-3">
                        ⭐ {rating.rating}
                      </td>

                      <td className="px-4 py-3">
                        {new Date(
                          rating.created_at
                        ).toLocaleDateString()}
                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          ) : (

            <p className="text-gray-500">
              No ratings available for this store.
            </p>

          )}

        </div>

      </div>
    </AdminLayout>
  );

}