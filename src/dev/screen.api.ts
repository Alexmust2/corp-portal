import { axiosInstance } from "@/plugins/axios.plugin";

export async function getAllRooms() {
    const response = await axiosInstance.get("/api/screens/rooms");
    return response.data;
}

export async function createRoom(roomData: { name: string }) {
    const response = await axiosInstance.post("/api/screens/rooms", roomData);
    return response.data;
}

export async function getScreens(roomId: string | number) {
    const response = await axiosInstance.get(`/api/screens/rooms/${roomId}/screens`);
    return response.data;
}

export async function createScreen(roomId: string | number, screenData: { name: string }) {
    const response = await axiosInstance.post(`/api/screens/rooms/${roomId}/screens`, screenData);
    return response.data;
}

export async function updateScreen(screenId: string | number, screenData: any) {
    const response = await axiosInstance.put(`/api/screens/${screenId}`, screenData);
    return response.data;
}

export async function deleteScreen(screenId: string | number) {
    const response = await axiosInstance.delete(`/api/screens/${screenId}`);
    return response.data;
}