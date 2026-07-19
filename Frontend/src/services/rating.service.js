import API from "./api";
import { API_ENDPOINTS } from "../constants/api";

const submitRating = async (data) => {
  const response = await API.post(
    API_ENDPOINTS.SUBMIT_RATING,
    data
  );

  return response.data;
};

const updateRating = async (id, data) => {
  const endpoint = API_ENDPOINTS.UPDATE_RATING.replace(
    ":id",
    id
  );

  const response = await API.patch(endpoint, data);

  return response.data;
};

const getMyRatings = async () => {
  const response = await API.get("/ratings/my");
  return response.data;
};

export default {
  submitRating,
  updateRating,
  getMyRatings,
};