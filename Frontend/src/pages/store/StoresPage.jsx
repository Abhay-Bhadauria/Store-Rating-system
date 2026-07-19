import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import UserLayout from "@layouts/UserLayout";

import SearchBar from "@components/ui/SearchBar";
import Pagination from "@components/ui/Pagination";
import EmptyState from "@components/ui/EmptyState";
import LoadingSpinner from "@components/ui/LoadingSpinner";

import RatingStars from "@components/common/RatingStars";

import storeService from "@services/store.service";

import Modal from "@components/ui/Modal";
import Button from "@components/ui/Button";

import ratingService from "@services/rating.service";

export default function StoresPage() {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchName, setSearchName] = useState("");
  const [searchAddress, setSearchAddress] = useState("");

  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    totalItems: 0,
  });

  const [modalOpen, setModalOpen] = useState(false);

const [selectedStore, setSelectedStore] = useState(null);

const [selectedRating, setSelectedRating] = useState(5);

const [submitting, setSubmitting] = useState(false);

  const loadStores = async (page = 1) => {
    try {
      setLoading(true);
      setError("");


      const response = await storeService.getStores({
  page,
  name: searchName,
  address: searchAddress,
});

console.log(response);

if (response.success && response.data) {

  setStores(response.data.stores || []);

  setPagination(
    response.data.pagination || {
      page: 1,
      totalPages: 1,
      totalItems: 0,
    }
  );

} else {

  setStores([]);

}
    } catch (err) {
      console.error(err);
      setError("Unable to fetch stores.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStores(1);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadStores(1);
    }, 400);

    return () => clearTimeout(timer);
  }, [searchName, searchAddress]);

  const changePage = (page) => {
    loadStores(page);
  };

  const openRatingModal = (store) => {
    

  setSelectedStore(store);

  setSelectedRating(store.userRating || 5);

  setModalOpen(true);
  

};

const closeRatingModal = () => {

  setModalOpen(false);

  setSelectedStore(null);

};


const submitRating = async () => {
  if (!selectedStore) return;

  try {
    setSubmitting(true);

    await ratingService.submitRating({
      store_id: selectedStore.id,
      rating: selectedRating,
    });

    closeRatingModal();

    loadStores(pagination.page);
  } catch (error) {
    console.error(error);
    alert(error.response?.data?.message || "Failed to submit rating");
  } finally {
    setSubmitting(false);
  }
};

  return (
    <UserLayout>
      <div className="space-y-6">

        <div>
          <h1 className="text-3xl font-bold">
            Browse Stores
          </h1>

          <p className="text-gray-500 mt-1">
            Search stores and rate your experience.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">

          <SearchBar
            value={searchName}
            onChange={setSearchName}
            onClear={() => setSearchName("")}
            placeholder="Search by store name..."
          />

          <SearchBar
            value={searchAddress}
            onChange={setSearchAddress}
            onClear={() => setSearchAddress("")}
            placeholder="Search by address..."
          />

        </div>

        {loading && (
          <div className="py-16">
            <LoadingSpinner size="lg" />
          </div>
        )}

        {!loading && error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600">
            {error}
          </div>
        )}

        {!loading && !error && stores.length === 0 && (
          <EmptyState
            title="No Stores Found"
            description="Try changing your search."
          />
        )}

        {!loading && !error && stores.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

              {stores.map((store) => (

                <div
                  key={store.id}
                  className="bg-white rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition-all duration-200"
                >

                  <div className="p-6">

                    <h2 className="text-xl font-semibold text-gray-900">
                      {store.name}
                    </h2>

                    <p className="text-sm text-gray-500 mt-1">
                      {store.email}
                    </p>

                    <div className="mt-4">

                      <p className="text-sm font-medium text-gray-700">
                        Address
                      </p>

                      <p className="text-gray-600">
                        {store.address}
                      </p>

                    </div>

                    <div className="mt-6 space-y-3">

                      <div className="flex justify-between items-center">

                        <span>Average Rating</span>

                        <RatingStars
                          rating={store.averageRating}
                        />

                      </div>

                      <div className="flex justify-between">

                        <span>Total Ratings</span>

                        <span>{store.totalRatings}</span>

                      </div>

                      <div className="flex justify-between">

                        <span>Your Rating</span>

                        <span
                          className={
                            store.userRating
                              ? "font-semibold text-green-600"
                              : "font-semibold text-gray-400"
                          }
                        >
                          {store.userRating ?? "Not Rated"}
                        </span>

                      </div>

                    </div>

                  </div>

                  <div className="px-6 py-4 bg-gray-50 border-t flex justify-between">

                    <Link
                      to={`/stores/${store.id}`}
                      className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                    >
                      View Details
                    </Link>

                   <div className="flex items-center gap-2">
  <span
    className={`px-3 py-2 rounded-lg text-sm font-medium ${
      store.userRating
        ? "bg-green-100 text-green-700"
        : "bg-yellow-100 text-yellow-700"
    }`}
  >
    {store.userRating ? "Rated" : "Not Rated"}
  </span>

  <Button
    variant="primary"
    size="sm"
    onClick={() => openRatingModal(store)}
  >
    {store.userRating ? "Update Rating" : "Rate Store"}
  </Button>
</div>

                  </div>

                </div>

              ))}

            </div>

            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              onPageChange={changePage}
              className="mt-8"
            />
          </>
        )}

      </div>

      <Modal
  isOpen={modalOpen}
  onClose={closeRatingModal}
  title={selectedStore ? `Rate ${selectedStore.name}` : "Rate Store"}
>
  <div className="space-y-6">
    <div className="flex justify-center gap-3">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => setSelectedRating(star)}
          className={`text-4xl ${
            star <= selectedRating
              ? "text-yellow-500"
              : "text-gray-300"
          }`}
        >
          ★
        </button>
      ))}
    </div>

    <div className="flex justify-end gap-3">
      <Button variant="outline" onClick={closeRatingModal}>
        Cancel
      </Button>

      <Button loading={submitting} onClick={submitRating}>
        {selectedStore?.userRating ? "Update Rating" : "Submit Rating"}
      </Button>
    </div>
  </div>
</Modal>
    </UserLayout>
  );
}