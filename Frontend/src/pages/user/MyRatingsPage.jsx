import { useEffect, useState } from "react";

import UserLayout from "@layouts/UserLayout";

import ratingService from "@services/rating.service";

import LoadingSpinner from "@components/ui/LoadingSpinner";
import Button from "@components/ui/Button";
import Modal from "@components/ui/Modal";

export default function MyRatingsPage() {

  const [ratings, setRatings] = useState([]);

  const [loading, setLoading] = useState(true);

  const [selectedRating, setSelectedRating] = useState(5);

  const [selectedItem, setSelectedItem] = useState(null);

  const [modalOpen, setModalOpen] = useState(false);

  const [submitting, setSubmitting] = useState(false);

    const loadRatings = async () => {

    try {

      setLoading(true);

      const response = await ratingService.getMyRatings();

      if (response.success && response.data) {

        setRatings(response.data.ratings);

      }

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);

    }

  };

    useEffect(() => {

    loadRatings();

  }, []);

    const openModal = (item) => {

    setSelectedItem(item);

    setSelectedRating(item.rating);

    setModalOpen(true);

  };

  const closeModal = () => {

    setModalOpen(false);

    setSelectedItem(null);

  };

    const submitRating = async () => {

    try {

      setSubmitting(true);

      await ratingService.submitRating({

        store_id: selectedItem.store.id,

        rating: selectedRating,

      });

      closeModal();

      await loadRatings();

    } catch (error) {

      console.error(error);

      alert(

        error.response?.data?.message ||

        "Failed to update rating."

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

    return (
    <UserLayout>
      <div className="max-w-6xl mx-auto px-4 py-8">

        <h1 className="text-3xl font-bold mb-8">
          My Ratings
        </h1>

        {ratings.length === 0 ? (

          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-500">
              You haven't rated any stores yet.
            </p>
          </div>

        ) : (

          <div className="grid gap-6">

            {ratings.map((item) => (

              <div
                key={item.id}
                className="bg-white rounded-xl shadow-md p-6 flex flex-col md:flex-row md:justify-between md:items-center"
              >

                <div>

                  <h2 className="text-xl font-semibold">
                    {item.store.name}
                  </h2>

                  <p className="text-gray-600 mt-2">
                    {item.store.email}
                  </p>

                  <p className="text-gray-600 mt-1">
                    {item.store.address}
                  </p>

                </div>

                <div className="mt-6 md:mt-0 text-center">

                  <p className="text-gray-500 text-sm">
                    Your Rating
                  </p>

                  <p className="text-4xl font-bold mt-2">
                    {item.rating}
                  </p>

                  <Button
                    className="mt-4"
                    onClick={() => openModal(item)}
                  >
                    Update Rating
                  </Button>

                </div>

              </div>

            ))}

          </div>

        )}

        <Modal
          isOpen={modalOpen}
          onClose={closeModal}
          title="Update Rating"
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
                loading={submitting}
                onClick={submitRating}
              >
                Submit
              </Button>

            </div>

          </div>

        </Modal>

      </div>
    </UserLayout>
  );
}