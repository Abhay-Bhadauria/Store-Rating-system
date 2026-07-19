import UserLayout from "@layouts/UserLayout";

export default function ProfilePage() {
  return (
    <UserLayout>
      <div className="bg-white rounded-lg shadow p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Profile
        </h1>

        <p className="text-gray-600">
          User profile management is not part of this assignment.
        </p>

        <p className="mt-3 text-gray-600">
          You can use the sidebar to browse stores, submit ratings, update ratings,
          and view your ratings.
        </p>
      </div>
    </UserLayout>
  );
}