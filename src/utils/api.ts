
export const API_BASE_URL = import.meta.env.VITE_API_URL || `${window.location.origin}/api`;

export const api = {
  get: async (endpoint: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No auth token");
      }

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/auth/login";
        throw new Error("Session expired");
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  },

  post: async (endpoint: string, data: any) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No auth token");
      }

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (response.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/auth/login";
        throw new Error("Session expired");
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  },

  put: async (endpoint: string, data: any) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No auth token");
      }

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (response.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/auth/login";
        throw new Error("Session expired");
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  },

  delete: async (endpoint: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No auth token");
      }

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/auth/login";
        throw new Error("Session expired");
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  },
};
