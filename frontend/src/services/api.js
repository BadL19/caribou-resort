import axios from 'axios'


// v2
const api = axios.create({
  baseURL: 'https://caribou-resort.onrender.com',
  headers: {
    'Content-Type': 'application/json',
  },
})

export const getCabins = () => api.get('/cabins').then(r => r.data)
export const getCabin = (id) => api.get(`/cabins/${id}`).then(r => r.data)
export const getCabinBookings = (id) => api.get(`/cabins/${id}/bookings`).then(r => r.data)
export const checkAvailability = (id, startDate, endDate) =>
  api.get(`/cabins/${id}/availability`, {
    params: { start_date: startDate, end_date: endDate }
  }).then(r => r.data)

export const createBooking = (data) => api.post('/bookings', data).then(r => r.data)

// Stripe
export const createPaymentIntent = (data) =>
  api.post('/payments/create-payment-intent', data).then(r => r.data)

export const getAdminBookings = () => api.get('/admin/bookings').then(r => r.data)
export const createAirbnbBooking = (data) => api.post('/admin/airbnb-booking', data).then(r => r.data)
export const deleteBooking = (id) => api.delete(`/admin/bookings/${id}`).then(r => r.data)

export default api
