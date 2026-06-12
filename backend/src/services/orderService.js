import axios from "axios";

const API_URL =
  import.meta.env.VITE_API_URL +
  "/api/orders";

/* =========================
   PLACE ORDER
========================= */

export const createOrder =
  async (orderData, token) => {
    const { data } = await axios.post(
      API_URL,
      orderData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return data;
  };

/* =========================
   MY ORDERS
========================= */

export const getMyOrders =
  async (token) => {
    const { data } = await axios.get(
      `${API_URL}/my-orders`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return data;
  };

/* =========================
   ORDER DETAILS
========================= */

export const getOrderById =
  async (id, token) => {
    const { data } = await axios.get(
      `${API_URL}/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return data;
  };

/* =========================
   ADMIN ALL ORDERS
========================= */

export const getAllOrders =
  async (token) => {
    const { data } = await axios.get(
      `${API_URL}/admin/all`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return data;
  };

/* =========================
   UPDATE STATUS
========================= */

export const updateOrderStatus =
  async (
    id,
    orderStatus,
    token
  ) => {
    const { data } = await axios.put(
      `${API_URL}/admin/${id}`,
      { orderStatus },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return data;
  };

/* =========================
   DELETE ORDER
========================= */

export const deleteOrder =
  async (id, token) => {
    const { data } = await axios.delete(
      `${API_URL}/admin/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return data;
  };