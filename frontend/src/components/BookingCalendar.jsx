import { useState, useEffect } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { getCabinBookings } from '../services/api'
import { addDays, isWithinInterval, parseISO } from 'date-fns'

export default function BookingCalendar({ cabinId, onDatesSelected, selectedDates }) {
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

  const isDateBooked = (date) => {
    return bookedRanges.some(range =>
      isWithinInterval(date, { start: range.start, end: addDays(range.end, -1) })
    )
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
        <label className="block text-bark-700 font-medium text-sm mb-1">Select Your Dates</label>
        <p className="text-bark-500 text-xs">Minimum 2-night stay required. Highlighted dates are unavailable.</p>
      </div>
      <DatePicker
        selected={startDate}
        onChange={handleChange}
        startDate={startDate}
        endDate={endDate}
        selectsRange
        inline
        minDate={minDate}
        excludeDates={
          bookedRanges.flatMap(range => {
            const dates = []
            let current = new Date(range.start)
            while (current <= range.end) {
              dates.push(new Date(current))
              current.setDate(current.getDate() + 1)
            }
            return dates
          })
        }
        monthsShown={2}
      />
      {startDate && endDate && (
        <div className="mt-3 p-3 bg-cabin-50 border border-cabin-200 rounded text-sm">
          <div className="flex justify-between text-bark-700">
            <span>Check-in:</span>
            <span className="font-medium">{startDate.toLocaleDateString('en-CA', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
          </div>
          <div className="flex justify-between text-bark-700 mt-1">
            <span>Check-out:</span>
            <span className="font-medium">{endDate.toLocaleDateString('en-CA', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
          </div>
          <div className="flex justify-between font-semibold text-cabin-700 mt-2 pt-2 border-t border-cabin-200">
            <span>Duration:</span>
            <span>{Math.round((endDate - startDate) / (1000 * 60 * 60 * 24))} nights</span>
          </div>
        </div>
      )}
    </div>
  )
}
