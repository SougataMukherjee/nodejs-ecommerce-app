import useAuthStore from "../features/authStore";

const useAuth = () => {
  const {
    user,
    token,
    login,
    logout,
  } = useAuthStore();

  return {
    user,
    token,
    login,
    logout,
    isAuthenticated: !!token,
    isAdmin: user?.role === "admin",
  };
};

export default useAuth;