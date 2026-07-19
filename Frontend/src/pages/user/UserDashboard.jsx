import UserLayout from "@layouts/UserLayout";
import { Store, Star, Search } from "lucide-react";

export default function UserDashboard() {
  return (
    <UserLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome to the Store Rating System
          </h1>
          <p className="mt-2 text-gray-600">
            Browse stores, submit ratings, update your ratings, and manage all
            your reviews from one place.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6 border">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <Search className="w-6 h-6 text-blue-600" />
            </div>

            <h2 className="text-lg font-semibold text-gray-900">
              Browse Stores
            </h2>

            <p className="mt-2 text-sm text-gray-600">
              Explore all available stores, search by name or address, and view
              their ratings.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
              <Star className="w-6 h-6 text-yellow-600" />
            </div>

            <h2 className="text-lg font-semibold text-gray-900">
              Rate Stores
            </h2>

            <p className="mt-2 text-sm text-gray-600">
              Submit a new rating or update your previous rating for any store.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <Store className="w-6 h-6 text-green-600" />
            </div>

            <h2 className="text-lg font-semibold text-gray-900">
              My Ratings
            </h2>

            <p className="mt-2 text-sm text-gray-600">
              View all the ratings you have submitted and keep them up to date.
            </p>
          </div>
        </div>

        {/* Information */}
        <div className="bg-white rounded-lg shadow p-6 border">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Getting Started
          </h2>

          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            <li>Open the <strong>Stores</strong> page from the sidebar.</li>
            <li>Search for a store by name or address.</li>
            <li>Open the store details page.</li>
            <li>Submit or update your rating.</li>
            <li>Visit <strong>My Ratings</strong> to review your submissions.</li>
          </ol>
        </div>
      </div>
    </UserLayout>
  );
}