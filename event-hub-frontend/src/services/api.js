import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:8080/api',
});

export const getAllEvents = () => {
  return apiClient.get('/events');
};

// --- ADD THIS NEW FUNCTION ---
export const getEventById = (eventId) => {
  return apiClient.get(`/events/${eventId}`);
};