import axios from "axios";

export const saveProfile = async (profileData) => {
  try {
    const token = localStorage.getItem("token"); // Assuming JWT is stored in localStorage
    const response = await axios.post(
      "/api/profile/save", // Your backend API endpoint
      profileData,
      {
        headers: {
          Authorization: `Bearer ${token}`, // Attach the token for authentication
        },
      }
    );
    console.log("Profile saved:", response.data);
    return response.data; // Return the API response to the caller
  } catch (error) {
    console.error("Error saving profile:", error.response?.data || error.message);
    throw error; // Rethrow the error to handle it in the calling component
  }
};
