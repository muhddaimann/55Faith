import { create } from 'zustand';
import {
  BookingItem,
  BookingResponse,
  bookRoom as bookRoomApi,
  getMyBookings as getMyBookingsApi,
  cancelBooking as cancelBookingApi,
  getAllRooms as getAllRoomsApi,
  ErrorResponse,
  CancelBookingResponse,
  Room,
} from '../api/room';

interface RoomState {
  rooms: Room[];
  myBookings: BookingItem[];
  loading: boolean;
  isInitialized: boolean;
  isRoomsInitialized: boolean;
  error: string | null;

  fetchBookings: (force?: boolean) => Promise<void>;
  fetchRooms: (force?: boolean) => Promise<void>;
  createBooking: (
    bookDate: string,
    startTime: string,
    endTime: string,
    room: string,
    tower: string,
    level: string,
    purpose: string,
    PIC: string,
    email: string,
  ) => Promise<BookingResponse | ErrorResponse>;

  cancelBooking: (bookingNumber: string) => Promise<CancelBookingResponse>;

  clear: () => void;
}

export const useRoomStore = create<RoomState>((set, get) => ({
  rooms: [],
  myBookings: [],
  loading: false,
  isInitialized: false,
  isRoomsInitialized: false,
  error: null,

  fetchBookings: async (force = false) => {
    if (get().isInitialized && !force) return;
    
    set({ loading: true, error: null });
    const res = await getMyBookingsApi();
    if ('error' in res) {
      set({ error: res.error, myBookings: [], loading: false });
    } else {
      set({ myBookings: res, isInitialized: true, loading: false });
    }
  },

  fetchRooms: async (force = false) => {
    if (get().isRoomsInitialized && !force) return;
    
    set({ loading: true });
    const res = await getAllRoomsApi();
    if ('error' in res) {
      set({ error: res.error, rooms: [], loading: false });
    } else {
      set({ rooms: res, isRoomsInitialized: true, loading: false });
    }
  },

  createBooking: async (bookDate, startTime, endTime, room, tower, level, purpose, PIC, email) => {
    set({ loading: true, error: null });
    const res = await bookRoomApi(
      bookDate,
      startTime,
      endTime,
      room,
      tower,
      level,
      purpose,
      PIC,
      email,
    );
    if ('error' in res) {
      set({ error: res.error, loading: false });
    } else {
      set({ error: null });
      await get().fetchBookings(true);
    }
    set({ loading: false });
    return res;
  },

  cancelBooking: async (bookingNumber) => {
    set({ loading: true, error: null });
    const res = await cancelBookingApi(bookingNumber);
    if (!res.execute_success) {
      set({ error: 'Failed to cancel booking.', loading: false });
    } else {
      await get().fetchBookings(true);
      set({ error: null });
    }
    set({ loading: false });
    return res;
  },

  clear: () => set({ 
    rooms: [], 
    myBookings: [], 
    loading: false, 
    isInitialized: false, 
    isRoomsInitialized: false, 
    error: null 
  }),
}));
