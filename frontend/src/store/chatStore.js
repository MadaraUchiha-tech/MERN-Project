import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { authStore } from "./authStore";

export const chatStore = create((set, get) => ({
  users: [],
  messages: [],
  selectedUser: null,

  getUsers: async () => {
    try {
      const res = await axiosInstance.get("/message/users");
      set({ users: res.data });
      toast.success("Users fetched successfully");
    } catch (error) {
      toast.error("Failed to fetch users.");
    }
  },

  getMessages: async () => {
    const { selectedUser } = get();
    try {
      const res = await axiosInstance.get(
        `/message/getmessages/${selectedUser._id}`
      );
      set({ messages: res.data });
      toast.success("Messages fetched successfully");
    } catch (error) {
      toast.error("Failed to fetch messages.");
    }
  },

  sendMessage: async (data) => {
    const { selectedUser, messages } = get();
    try {
      const res = await axiosInstance.post(
        `/message/sendmessage/${selectedUser._id}`,
        data
      );
      set({ messages: [...messages, res.data] });
      toast.success("Message sent successfully.");
    } catch (error) {
      toast.error("Failed to send message");
    }
  },
  setSelectedUser: (user) => set({ selectedUser: user }),

  listenForNewMessage: () => {
    const socket = authStore.getState().socket;
    socket.on("newMessage", (newMessage) => {
      set({ messages: [...get().messages, newMessage] });
    });
  },

  stopListeningForMessages: () => {
    const socket = authStore.getState().socket;
    socket.off("newMessage");
  },
}));
