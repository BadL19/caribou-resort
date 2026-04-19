import { useState, useEffect } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { getCabinBookings } from '../services/api'
import { addDays, isWithinInterval, parseISO } from 'date-fns'
 
const SUMMER_MONTHS = [4, 5, 6, 7, 8] // 0-indexed: May=4, Jun=5, Jul=6, Aug=7, Sep=8
 
export default function BookingCalendar({ cabinId, onDatesSelected, selectedDates, cabinSeason }) {
  const [bookings, setBookings] = useState([])
  const [startDate, setStartDate] = useState(selectedDates?.start || null)
  const [endDate, setEndDate] = useState(selectedDates?.end || null)
 
  useEffect(() => {
    if (cabinId) {
      getCabinBookings(cabinId)
        .then(setBookings)
        .catch(console.error)
    }
  }, [cabinId])
 
  const bookedRanges = bookings.map(b => ({
    start: typeof b.start_date === 'string' ? parseISO(b.start_date) : b.start_date,
    end: typeof b.end_date === 'string' ? parseISO(b.end_date) : b.end_date,
  }))
 
  const isDateDisabled = (date) => {
    // Block booked dates
    const isBooked = bookedRanges.some(range =>
      isWithinInterval(date, { start: range.start, end: addDays(range.end, -1) })
    )
    if (isBooked) return true
 
    // Block non-summer months for summer cabins
    if (cabinSeason === 'summer') {
      return !SUMMER_MONTHS.includes(date.getMonth())
    }
 
    return false
  }
 
  const handleChange = (dates) => {
    const [start, end] = dates
    setStartDate(start)
    setEndDate(end)
    if (start && end) {
      const nights = Math.round((end - start) / (1000 * 60 * 60 * 24))
      onDatesSelected?.({ start, end, nights })
    }
  }
 
  const minDate = new Date()
  minDate.setDate(minDate.getDate() + 1)
 
  return (
    <div className="booking-calendar">
      <div className="mb-3">
        <label className="block text-sand-700 font-medium text-sm mb-1">Select Your Dates</label>
        <p className="text-sand-500 text-xs">
          Minimum 2-night stay required. Highlighted dates are unavailable.
          {cabinSeason === 'summer' && ' This cabin is available May through September only.'}
        </p>
      </div>
      <DatePicker
        selected={startDate}
        onChange={handleChange}
        startDate={startDate}
        endDate={endDate}
        selectsRange
        inline
        minDate={minDate}
        filterDate={date => !isDateDisabled(date)}
        monthsShown={2}
      />
      {startDate && endDate && (
        <div className="mt-3 p-3 bg-sand-50 border border-sand-200 text-sm">
          <div className="flex justify-between text-sand-700">
            <span>Check-in:</span>
            <span className="font-medium">{startDate.toLocaleDateString('en-CA', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
          </div>
          <div className="flex justify-between text-sand-700 mt-1">
            <span>Check-out:</span>
            <span className="font-medium">{endDate.toLocaleDateString('en-CA', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
          </div>
          <div className="flex justify-between font-semibold text-navy-700 mt-2 pt-2 border-t border-sand-200">
            <span>Duration:</span>
            <span>{Math.round((endDate - startDate) / (1000 * 60 * 60 * 24))} nights</span>
          </div>
        </div>
      )}
    </div>
  )
}