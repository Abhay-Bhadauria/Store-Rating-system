import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import AdminLayout from "@layouts/AdminLayout";

import {adminService} from "@services/admin.service";

import LoadingSpinner from "@components/ui/LoadingSpinner";

export default function AdminUserDetails() {

  const { id } = useParams();

  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

    const loadUser = async () => {

    try {

      setLoading(true);

      setError("");

      const response = await adminService.getUserById(id);

      if (response.success && response.data) {

        setUser(response.data.user);

      }

    } catch (err) {

      console.error(err);

      setError("Unable to load user.");

    } finally {

      setLoading(false);

    }

  };

    useEffect(() => {

    loadUser();

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
    return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto p-6">

        <h1 className="text-3xl font-bold mb-6">
          User Details
        </h1>

        {/* User Information */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">

          <h2 className="text-xl font-semibold mb-4">
            User Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <div>
              <p className="text-gray-500 text-sm">Name</p>
              <p className="font-medium">{user.name}</p>
            </div>

            <div>
              <p className="text-gray-500 text-sm">Email</p>
              <p className="font-medium">{user.email}</p>
            </div>

            <div>
              <p className="text-gray-500 text-sm">Address</p>
              <p className="font-medium">{user.address}</p>
            </div>

            <div>
              <p className="text-gray-500 text-sm">Role</p>
              <span className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm capitalize">
                {user.role.replace("_", " ")}
              </span>
            </div>

            <div>
              <p className="text-gray-500 text-sm">
                Total Ratings Submitted
              </p>
              <p className="font-medium">
                {user.totalRatings}
              </p>
            </div>

          </div>

        </div>

        {/* Owned Store */}
        {user.ownedStore && (

          <div className="bg-white rounded-lg shadow p-6">

            <h2 className="text-xl font-semibold mb-4">
              Owned Store
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              <div>
                <p className="text-gray-500 text-sm">
                  Store Name
                </p>
                <p className="font-medium">
                  {user.ownedStore.name}
                </p>
              </div>

              <div>
                <p className="text-gray-500 text-sm">
                  Store Email
                </p>
                <p className="font-medium">
                  {user.ownedStore.email}
                </p>
              </div>

              <div className="md:col-span-2">
                <p className="text-gray-500 text-sm">
                  Store Address
                </p>
                <p className="font-medium">
                  {user.ownedStore.address}
                </p>
              </div>

            </div>

          </div>

        )}

      </div>
    </AdminLayout>
  );
}