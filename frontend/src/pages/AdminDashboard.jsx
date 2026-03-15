import { useEffect, useState } from 'react'
import { getAdminBookings, deleteBooking, getCabins, createAirbnbBooking } from '../services/api'

export default function AdminDashboard() {
  const [bookings, setBookings] = useState([])
  const [cabins, setCabins] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [showAirbnbForm, setShowAirbnbForm] = useState(false)
  const [airbnbForm, setAirbnbForm] = useState({ cabin_id: '', start_date: '', end_date: '', guest_name: 'Airbnb Guest' })
  const [airbnbError, setAirbnbError] = useState('')
  const [airbnbSuccess, setAirbnbSuccess] = useState('')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [b, c] = await Promise.all([getAdminBookings(), getCabins()])
      setBookings(b)
      setCabins(c)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this booking?')) return
    try {
      await deleteBooking(id)
      setBookings(b => b.filter(x => x.id !== id))
    } catch (err) {
      alert('Failed to delete booking')
    }
  }

  const handleAirbnb = async (e) => {
    e.preventDefault()
    setAirbnbError('')
    setAirbnbSuccess('')
    try {
      await createAirbnbBooking({ ...airbnbForm, cabin_id: parseInt(airbnbForm.cabin_id) })
      setAirbnbSuccess('Airbnb booking added!')
      setAirbnbForm({ cabin_id: '', start_date: '', end_date: '', guest_name: 'Airbnb Guest' })
      loadData()
    } catch (err) {
      setAirbnbError(err.response?.data?.detail || 'Failed to add Airbnb booking')
    }
  }

  const filtered = filter === 'all' ? bookings : bookings.filter(b => b.source === filter)

  const cabinName = (id) => cabins.find(c => c.id === id)?.name || `Cabin ${id}`

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cabin-600" />
    </div>
  )

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-bark-800" style={{ fontFamily: 'Playfair Display, serif' }}>
            Admin Dashboard
          </h1>
          <p className="text-bark-500 mt-1">Manage all reservations</p>
        </div>
        <button
          onClick={() => setShowAirbnbForm(!showAirbnbForm)}
          className="bg-orange-500 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-orange-600 transition-colors text-sm"
        >
          + Add Airbnb Booking
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Bookings', value: bookings.length, color: 'bg-cabin-50 border-cabin-200' },
          { label: 'Website Bookings', value: bookings.filter(b => b.source === 'website').length, color: 'bg-green-50 border-green-200' },
          { label: 'Airbnb Bookings', value: bookings.filter(b => b.source === 'airbnb').length, color: 'bg-orange-50 border-orange-200' },
          { label: 'Active Cabins', value: cabins.length, color: 'bg-blue-50 border-blue-200' },
        ].map((stat, i) => (
          <div key={i} className={`border rounded-xl p-5 ${stat.color}`}>
            <div className="text-2xl font-bold text-bark-800" style={{ fontFamily: 'Playfair Display, serif' }}>{stat.value}</div>
            <div className="text-sm text-bark-500 mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Airbnb Form */}
      {showAirbnbForm && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-6 mb-8">
          <h3 className="font-bold text-bark-800 mb-4">Add Airbnb Blocked Dates</h3>
          <form onSubmit={handleAirbnb} className="grid grid-cols-2 md:grid-cols-5 gap-3 items-end">
            <div>
              <label className="block text-xs font-medium text-bark-600 mb-1">Cabin</label>
              <select
                value={airbnbForm.cabin_id}
                onChange={e => setAirbnbForm(f => ({ ...f, cabin_id: e.target.value }))}
                required
                className="w-full border border-cabin-200 rounded px-3 py-2 text-sm"
              >
                <option value="">Select...</option>
                {cabins.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-bark-600 mb-1">Guest Name</label>
              <input
                value={airbnbForm.guest_name}
                onChange={e => setAirbnbForm(f => ({ ...f, guest_name: e.target.value }))}
                className="w-full border border-cabin-200 rounded px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-bark-600 mb-1">Check-in</label>
              <input type="date" value={airbnbForm.start_date} onChange={e => setAirbnbForm(f => ({ ...f, start_date: e.target.value }))} required
                className="w-full border border-cabin-200 rounded px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium text-bark-600 mb-1">Check-out</label>
              <input type="date" value={airbnbForm.end_date} onChange={e => setAirbnbForm(f => ({ ...f, end_date: e.target.value }))} required
                className="w-full border border-cabin-200 rounded px-3 py-2 text-sm" />
            </div>
            <button type="submit" className="bg-orange-500 text-white px-4 py-2 rounded text-sm font-medium hover:bg-orange-600">
              Block Dates
            </button>
          </form>
          {airbnbError && <p className="text-red-600 text-sm mt-2">{airbnbError}</p>}
          {airbnbSuccess && <p className="text-green-600 text-sm mt-2">{airbnbSuccess}</p>}
        </div>
      )}

      {/* Filter */}
      <div className="flex gap-3 mb-6">
        {['all', 'website', 'airbnb'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize transition-all ${
              filter === f ? 'bg-bark-800 text-white' : 'bg-white border border-cabin-200 text-bark-600 hover:border-cabin-400'
            }`}
          >
            {f === 'all' ? 'All' : f === 'website' ? '🌐 Website' : '🏠 Airbnb'}
          </button>
        ))}
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-xl border border-cabin-100 shadow-sm overflow-hidden">
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-bark-400">
            <div className="text-4xl mb-3">📋</div>
            <p>No bookings found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-bark-50 border-b border-cabin-100">
                <tr>
                  {['#', 'Cabin', 'Guest', 'Email', 'Dates', 'Nights', 'Total', 'Source', 'Booked', ''].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-bark-500 uppercase tracking-wide">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-cabin-50">
                {filtered.map(b => {
                  const nights = Math.round((new Date(b.end_date) - new Date(b.start_date)) / 86400000)
                  return (
                    <tr key={b.id} className="hover:bg-cabin-25">
                      <td className="px-4 py-3 text-bark-400">{b.id}</td>
                      <td className="px-4 py-3 font-medium text-bark-700">{cabinName(b.cabin_id)}</td>
                      <td className="px-4 py-3 text-bark-700">{b.guest_name}</td>
                      <td className="px-4 py-3 text-bark-500 max-w-xs truncate">{b.email}</td>
                      <td className="px-4 py-3 text-bark-600 whitespace-nowrap">
                        {b.start_date} → {b.end_date}
                      </td>
                      <td className="px-4 py-3 text-bark-600">{nights}</td>
                      <td className="px-4 py-3 font-medium text-bark-700">
                        {b.total_price ? `$${b.total_price.toFixed(0)}` : '—'}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                          b.source === 'website' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                        }`}>
                          {b.source}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-bark-400 text-xs">
                        {new Date(b.created_at).toLocaleDateString('en-CA')}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleDelete(b.id)}
                          className="text-red-400 hover:text-red-600 transition-colors text-xs px-2 py-1 rounded hover:bg-red-50"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
