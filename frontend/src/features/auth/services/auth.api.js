import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL + "/api/auth";

export async function registerUser({ username, email, password }) {
  const response = await axios.post(
    `${API_BASE}/register`,
    { username, email, password },
    { withCredentials: true },
  );
  return response.data.user;
}

export async function loginUser({ email, password }) {
  const response = await axios.post(
    `${API_BASE}/login`,
    { email, password },
    { withCredentials: true },
  );
  return response.data.user;
}

export async function logoutUser() {
  await axios.get(`${API_BASE}/logout`, { withCredentials: true });
}

export async function getMe() {
  try {
    const response = await axios.get(`${API_BASE}/getme`, {
      withCredentials: true,
    });
    return response.data.user ?? null;
  } catch {
    return null;
  }
}
