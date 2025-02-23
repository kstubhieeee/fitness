import { create } from 'zustand';

export const useauthstore = create((set) => ({
    authuser: localStorage.getItem('username'),
    isLoggingIn: false,
    login: async (formData) => {
        set({ isLoggingIn: true });
        try {
            const response = await fetch("http://localhost:5000/api/users/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('username', data.username);
                set({ authuser: data.username });
            }

            return data;
        } catch (error) {
            console.error("Error:", error);
            throw error;
        } finally {
            set({ isLoggingIn: false });
        }
    },
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('userType');
        localStorage.removeItem('userId');
        set({ authuser: null });
    }
}));