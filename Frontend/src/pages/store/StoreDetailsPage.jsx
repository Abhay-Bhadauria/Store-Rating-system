import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import UserLayout from "@layouts/UserLayout";

import storeService from "@services/store.service";
import ratingService from "@services/rating.service";

import LoadingSpinner from "@components/ui/LoadingSpinner";
import Button from "@components/ui/Button";
import Modal from "@components/ui/Modal";


export default function StoreDetailsPage() {
  const { id } = useParams();

  const [store, setStore] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [modalOpen, setModalOpen] = useState(false);

  const [selectedRating, setSelectedRating] = useState(5);

  const [submitting, setSubmitting] = useState(false);

    const loadStore = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await storeService.getStoreById(id);

      if (response.success && response.data) {
        setStore(response.data.store);

        setSelectedRating(
          response.data.store.userRating || 5
        );
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


    const openModal = () => {
    setSelectedRating(store.userRating || 5);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };


    const submitRating = async () => {
    try {
      setSubmitting(true);

      await ratingService.submitRating({
        store_id: store.id,
        rating: selectedRating,
      });

      closeModal();

      await loadStore();

    } catch (err) {
      console.error(err);

      alert(
        err.response?.data?.message ||
        "Failed to submit rating."
      );

    } finally {
      setSubmitting(false);
    }
  };

    if (loading) {
    return (
      <UserLayout>
        <LoadingSpinner
          size="lg"
          className="h-[60vh]"
        />
      </UserLayout>
    );
  }

    if (error) {
    return (
      <UserLayout>
        <div className="text-center text-red-600 mt-20">
          {error}
        </div>
      </UserLayout>
    );
  }

    return (
    <UserLayout>
      <div className="max-w-4xl mx-auto px-4 py-8">

        <div className="bg-white rounded-xl shadow-md p-8">

          <div className="flex items-start justify-between">

            <div>

              <h1 className="text-3xl font-bold">
                {store.name}
              </h1>

              <p className="text-gray-600 mt-2">
                {store.email}
              </p>

              <p className="text-gray-600 mt-1">
                {store.address}
              </p>

            </div>

            <Button
              variant="primary"
              onClick={openModal}
            >
              {store.userRating
                ? "Update Rating"
                : "Rate Store"}
            </Button>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">

            <div className="border rounded-lg p-6 text-center">

              <h2 className="text-gray-500 text-sm">
                Average Rating
              </h2>

              <p className="text-4xl font-bold mt-3">

                {store.averageRating ?? "N/A"}

              </p>

            </div>

            <div className="border rounded-lg p-6 text-center">

              <h2 className="text-gray-500 text-sm">
                Total Ratings
              </h2>

              <p className="text-4xl font-bold mt-3">

                {store.totalRatings}

              </p>

            </div>

            <div className="border rounded-lg p-6 text-center">

              <h2 className="text-gray-500 text-sm">
                Your Rating
              </h2>

              <p className="text-4xl font-bold mt-3">

                {store.userRating ?? "Not Rated"}

              </p>

            </div>

          </div>

        </div>

      </div>

      <Modal
  isOpen={modalOpen}
  onClose={closeModal}
  title={
    store?.userRating
      ? "Update Rating"
      : "Rate Store"
  }
>
  <div className="space-y-6">

    <div className="flex justify-center gap-2">

      {[1, 2, 3, 4, 5].map((star) => (

        <button
          key={star}
          type="button"
          onClick={() => setSelectedRating(star)}
          className="text-4xl transition hover:scale-110"
        >
          {star <= selectedRating ? "⭐" : "☆"}
        </button>

      ))}

    </div>

    <p className="text-center text-gray-600">
      Selected Rating:
      <span className="font-semibold ml-2">
        {selectedRating}/5
      </span>
    </p>

    <div className="flex justify-end gap-3">

      <Button
        variant="secondary"
        onClick={closeModal}
      >
        Cancel
      </Button>

      <Button
        variant="primary"
        loading={submitting}
        onClick={submitRating}
      >
        Submit
      </Button>

    </div>

  </div>
</Modal>

    </UserLayout>
  );
}
