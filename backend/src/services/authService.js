import axios from "axios";

const API_URL =
  import.meta.env.VITE_API_URL +
  "/api/auth";

/* =========================
   REGISTER
========================= */

export const registerUser = async (
  userData
) => {
  const { data } = await axios.post(
    `${API_URL}/register`,
    userData
  );

  return data;
};

/* =========================
   LOGIN
========================= */

export const loginUser = async (
  userData
) => {
  const { data } = await axios.post(
    `${API_URL}/login`,
    userData
  );

  return data;
};

/* =========================
   GET PROFILE
========================= */

export const getProfile =
  async (token) => {
    const { data } = await axios.get(
      `${API_URL}/profile`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return data;
  };

/* =========================
   UPDATE PROFILE
========================= */

export const updateProfile =
  async (profileData, token) => {
    const { data } = await axios.put(
      `${API_URL}/profile`,
      profileData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return data;
  };