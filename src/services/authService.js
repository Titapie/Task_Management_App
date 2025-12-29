import { api } from "../utils/api";

export const authService = {
  /* ================= LOGIN ================= */
  async login(payload) {
    const res = await api.post("/auth/login", payload);
    return res.data; 
  },

  /* ================= REGISTER ================= */
  async register(payload) {
    const res = await api.post("/auth/register", payload);
    return res.data;
  },

  /* ================= CURRENT USER ================= */
  async me() {
    const res = await api.get("/auth/me");
    return res.data.data;
  },

  /* ================= LOGOUT ================= */
  async logout() {
    await api.post("/auth/logout");
  },

  /* ================= REFRESH (OPTIONAL) ================= */
  async refresh(refreshToken) {
    const res = await api.post("/auth/refresh", { refreshToken });
    return res.data; // backend trả { token }
  },

  /* ================= FORGOT PASSWORD ================= */
  async forgotPassword(payload) {
    const res = await api.post("/auth/forgot-password", payload);
    return res.data;
  },

  /* ================= VERIFY OTP ================= */
  async verifyOTP(payload) {
    const res = await api.post("/auth/verify-otp", payload);
    return res.data;
  },

  /* ================= RESET PASSWORD ================= */
  async resetPassword(data) {
    const res = await api.post("/auth/reset-password", data);
    return res.data;
  },

  /* ================= CHANGE PASSWORD ================= */
  async changePassword(data) {
    const res = await api.post("/auth/change-password", data);
    return res.data;
  },
  /* ================= UPDATE PROFILE ================= */
  async updateProfile(data) {
    const res = await api.patch("/users/profile", data);
    return res.data;
  },
};
