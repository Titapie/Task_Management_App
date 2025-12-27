import { api, tokenStore } from "../utils/api";

export const authService = {
  /* ================= LOGIN ================= */
  async login(payload) {
    const res = await api.post("/auth/login", payload);

    tokenStore.setTokens({
      accessToken: res.data.token,
      refreshToken: res.data.refreshToken,
    });

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
    try {
      await api.post("/auth/logout");
    } finally {
      tokenStore.clear();
    }
  },

  /* ================= REFRESH (manual nếu cần) ================= */
  async refresh() {
    const refreshToken = tokenStore.getRefreshToken();
    const res = await api.post("/auth/refresh", { refreshToken });

    tokenStore.setTokens({ accessToken: res.data.accessToken });
    return res.data;
  },

  /* ================= FORGOT PASSWORD ================= */
  async forgotPassword(email) {
    const res = await api.post("/auth/forgot-password", { Email: email });
    return res.data;
  },

  /* ================= VERIFY OTP ================= */
  async verifyOTP(otp) {
    const res = await api.post("/auth/verify-otp", { otp });
    return res.data;
  },

  /* ================= RESET PASSWORD ================= */
  async resetPassword(data) {
   
    const res = await api.post("/auth/reset-password", data);
    return res.data;
  },

  /* ================= CHANGE PASSWORD ================= */
  async changePassword(data) {
    // { oldPassword, newPassword, confirmPassword }
    const res = await api.post("/auth/change-password", data);
    return res.data;
  },
};
