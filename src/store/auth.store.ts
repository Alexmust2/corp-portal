import { authApi } from '@/api/auth.api';
import { defineStore } from "pinia";

export type AuthStep = 'login' | 'registration' | 'recovery' | 'otp' | 'setPassword'

interface AuthStateProps {
    currentStep: AuthStep;
    phone: string;
}

export const useAuthStore = defineStore('auth', {
    state: (): AuthStateProps => ({
        currentStep: "login",
        phone: '',
    }),

    getters: {
    },

    actions: {
        setCurrentStep(step: AuthStep) {
            this.currentStep = step
        },

        setPhone(phone: string) {
            this.phone = phone
        },
    }
})