
import { create } from 'zustand'


export const useauthstore = create((set) => ({


    authuser: null,
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

            set({ authuser: data.username })


            return data
        }
        catch (error) {

            console.error("Error:", error);
        }
    }
}))