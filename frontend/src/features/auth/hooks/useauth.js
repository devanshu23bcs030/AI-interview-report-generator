import { useContext } from "react";
import { AuthContext } from "../auth.context";
import { registerUser, loginUser, logoutUser } from "../services/auth.api";

export const useAuth = () => {
  const context = useContext(AuthContext);
  const { user, setUser, loading, setLoading } = context;

  const handlelogin = async (email, password) => {
    setLoading(true);
    try {
      const data = await loginUser({ email, password });
      setUser(data);
      return { success: true };
    } catch (error) {
      const message =
        error.response?.data?.error ||
        error.message ||
        "Login failed";
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (username, email, password) => {
    setLoading(true);
    try {
      const data = await registerUser({ username, email, password });
      setUser(data);
      return { success: true };
    } catch (error) {
      const message =
        error.response?.data?.error ||
        error.message ||
        "Registration failed";
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logoutUser();
    } catch {
      // Still clear local session if the server call fails
    } finally {
      setUser(null);
      setLoading(false);
    }
  };

  return { user, loading, handlelogin, handleRegister, handleLogout };
};
