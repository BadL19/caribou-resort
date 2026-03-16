import { useState, useEffect } from 'react'
import { useParams, useLocation, Link } from 'react-router-dom'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import BookingCalendar from '../components/BookingCalendar'
import { getCabin, createPaymentIntent } from '../services/api'
 
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '')
 
function StepBar({ step }) {
  const steps = ['Your Details', 'Payment', 'Confirmed']
  return (
    <div className="flex items-center justify-center mb-10">
      {steps.map((label, i) => {
        const num = i + 1
        const active = step === num
        const done = step > num
        return (
          <div key={i} className="flex items-center">
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                done ? 'bg-navy-600 text-white' : active ? 'bg-navy-700 text-white' : 'bg-sand-200 text-sand-400'
              }`}>
                {done
                  ? <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                  : num
                }
              </div>
              <span className={`text-xs mt-1.5 font-medium hidden sm:block ${active ? 'text-navy-700' : 'text-sand-400'}`}>
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className={`w-16 sm:w-24 h-px mx-1 mb-5 ${done ? 'bg-navy-500' : 'bg-sand-200'}`} />
            )}
          </div>
        )
      })}
    </div>
  )
}
 
function PaymentForm({ total, onSuccess }) {
  const stripe = useStripe()
  const elements = useElements()
  const [paying, setPaying] = useState(false)
  const [error, setError] = useState('')
 
  const handlePay = async (e) => {
    e.preventDefault()
    if (!stripe || !elements) return
    setPaying(true)
    setError('')
    const { error: submitErr } = await elements.submit()
    if (submitErr) { setError(submitErr.message); setPaying(false); return }
    const { error: confirmErr, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: 'if_required',
    })
    if (confirmErr) { setError(confirmErr.message); setPaying(false) }
    else if (paymentIntent?.status === 'succeeded') onSuccess(paymentIntent)
    else { setError('Payment did not complete. Please try again.'); setPaying(false) }
  }
 
  return (
    <form onSubmit={handlePay} className="space-y-5">
      <div className="bg-sand-50 border border-sand-200 p-4 text-sm">
        <div className="flex justify-between text-sand-700 font-semibold">
          <span>Total charged today</span>
          <span className="text-navy-700">${total?.toFixed(2)} CAD</span>
        </div>
        <p className="text-sand-400 text-xs mt-1">Full payment required to confirm your booking.</p>
      </div>
 
      <PaymentElement options={{ layout: 'tabs' }} />
 
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm">{error}</div>
      )}
 
      <button
        type="submit"
        disabled={paying || !stripe}
        className="w-full bg-navy-700 hover:bg-navy-800 text-white py-3.5 font-semibold text-sm tracking-wide transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {paying ? (
          <><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>Processing…</>
        ) : (
          <>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Pay ${total?.toFixed(2)} CAD
          </>
        )}
      </button>
      <p className="text-center text-sand-400 text-xs">Secured by Stripe · SSL encrypted</p>
    </form>
  )
}
 
function Summary({ cabin, dates, nights, total }) {
  return (
    <div className="bg-white border border-sand-200 shadow-sm p-5">
      {cabin?.images?.[0] && (
        <img src={cabin.images[0]} alt={cabin.name} className="w-full h-36 object-cover mb-4" />
      )}
      {cabin && (
        <>
          <h3 className="text-sand-800 text-base mb-0.5" style={{ fontFamily: 'DM Serif Display, serif' }}>
            {cabin.name}
          </h3>
          <p className="text-sand-400 text-xs mb-4">Up to {cabin.max_guests} guests</p>
        </>
      )}
 
      {dates && nights >= 2 ? (
        <div className="space-y-2 text-sm border-t border-sand-100 pt-4">
          <div className="flex justify-between text-sand-600">
            <span>Check-in</span>
            <span className="font-medium">{new Date(dates.start).toLocaleDateString('en-CA', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
          </div>
          <div className="flex justify-between text-sand-600">
            <span>Check-out</span>
            <span className="font-medium">{new Date(dates.end).toLocaleDateString('en-CA', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
          </div>
          <div className="flex justify-between text-sand-600">
            <span>${cabin?.price_per_night} x {nights} nights</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <div className="border-t border-sand-100 pt-2 flex justify-between font-bold text-sand-800">
            <span>Total</span>
            <span>${total.toFixed(2)} CAD</span>
          </div>
        </div>
      ) : (
        <p className="text-sand-400 text-sm italic border-t border-sand-100 pt-4">
          Select dates to see your total.
        </p>
      )}
 
      <div className="mt-5 pt-4 border-t border-sand-100 space-y-1.5 text-xs text-sand-400">
        <p>Full payment required at booking</p>
        <p>2-night minimum stay</p>
        <p>Check-in 3:00 PM · Check-out 11:00 AM</p>
      </div>
    </div>
  )
}
 
export default function Booking() {
  const { id } = useParams()
  const location = useLocation()
  const [cabin, setCabin] = useState(location.state?.cabin || null)
  const [dates, setDates] = useState(location.state?.dates || null)
  const [loading, setLoading] = useState(!cabin)
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({ guest_name: '', email: '', phone: '', num_guests: '', notes: '' })
  const [formError, setFormError] = useState('')
  const [intentData, setIntentData] = useState(null)
  const [creatingIntent, setCreatingIntent] = useState(false)
  const [intentError, setIntentError] = useState('')
  const [successData, setSuccessData] = useState(null)
 
  useEffect(() => {
    if (!cabin) getCabin(id).then(d => { setCabin(d); setLoading(false) }).catch(() => setLoading(false))
  }, [id, cabin])
 
  const nights = dates?.nights || 0
  const total = cabin ? cabin.price_per_night * nights : 0
  const fmt = d => (d instanceof Date ? d : new Date(d)).toISOString().split('T')[0]
  const formComplete = dates && nights >= 2 && form.guest_name && form.email && form.phone && form.phone.replace(/\D/g, '').length >= 10 && form.num_guests && parseInt(form.num_guests) >= 1
 
  const handleDetails = async (e) => {
    e.preventDefault()
    setFormError('')
    if (!dates?.start || !dates?.end) { setFormError('Please select your check-in and check-out dates.'); return }
    if (nights < 2) { setFormError('Minimum stay is 2 nights.'); return }
    if (!import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY) {
      setFormError('Stripe is not configured. Add VITE_STRIPE_PUBLISHABLE_KEY to frontend/.env')
      return
    }
    setCreatingIntent(true)
    try {
      const result = await createPaymentIntent({
        cabin_id: parseInt(id),
        guest_name: form.guest_name,
        email: form.email,
        phone: form.phone,
        num_guests: parseInt(form.num_guests),
        notes: form.notes || null,
        start_date: fmt(dates.start),
        end_date: fmt(dates.end),
      })
      setIntentData(result)
      setStep(2)
      window.scrollTo(0, 0)
    } catch (err) {
      setIntentError(err.response?.data?.detail || 'Could not start checkout. Please try again.')
    } finally {
      setCreatingIntent(false)
    }
  }
 
  const handlePaymentSuccess = () => {
    setSuccessData({ form, dates, cabin, total })
    setStep(3)
    window.scrollTo(0, 0)
  }
 
  if (loading) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-9 w-9 border-2 border-navy-600 border-t-transparent" />
    </div>
  )
 
  if (step === 3 && successData) {
    const { form: f, dates: d, cabin: c, total: t } = successData
    return (
      <div className="min-h-screen bg-sand-50 flex items-center justify-center px-4 py-16">
        <div className="bg-white border border-sand-200 shadow-sm p-8 md:p-12 max-w-lg w-full text-center">
          <div className="w-16 h-16 bg-navy-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-navy-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-3xl text-sand-900 mb-2" style={{ fontFamily: 'DM Serif Display, serif' }}>
            Booking Confirmed
          </h2>
          <p className="text-sand-500 text-sm mb-7">
            Thank you, <strong>{f.guest_name}</strong>. A confirmation has been sent to <strong>{f.email}</strong>.
          </p>
          <div className="bg-sand-50 border border-sand-200 p-5 text-sm text-left space-y-2.5 mb-6">
            <div className="flex justify-between"><span className="text-sand-500">Cabin</span><span className="font-medium">{c?.name}</span></div>
            <div className="flex justify-between"><span className="text-sand-500">Check-in</span><span className="font-medium">{new Date(d.start).toLocaleDateString('en-CA', { weekday: 'long', month: 'long', day: 'numeric' })}</span></div>
            <div className="flex justify-between"><span className="text-sand-500">Check-out</span><span className="font-medium">{new Date(d.end).toLocaleDateString('en-CA', { weekday: 'long', month: 'long', day: 'numeric' })}</span></div>
            <div className="flex justify-between"><span className="text-sand-500">Duration</span><span className="font-medium">{d.nights} nights</span></div>
            <div className="border-t border-sand-200 pt-2.5 flex justify-between font-bold">
              <span className="text-sand-500">Total paid</span>
              <span className="text-navy-700">${t.toFixed(2)} CAD</span>
            </div>
          </div>
          <div className="bg-amber-50 border border-amber-200 p-4 text-sm text-amber-800 mb-6 text-left">
            Questions? Call us at (705)257-5434.
          </div>
          <Link to="/" className="btn-dark block w-full text-center py-3">Return to Home</Link>
        </div>
      </div>
    )
  }
 
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <Link to={`/cabins/${id}`} className="text-sand-400 hover:text-navy-600 text-sm transition-colors">
          &larr; Back to {cabin?.name}
        </Link>
        <h1 className="text-3xl text-sand-900 mt-3" style={{ fontFamily: 'DM Serif Display, serif' }}>
          Book Your Stay
        </h1>
        {cabin && (
          <p className="text-sand-400 text-sm mt-1">
            {cabin.name} · <span className="text-navy-600 font-semibold">${cabin.price_per_night}/night</span>
          </p>
        )}
      </div>
 
      <StepBar step={step} />
 
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
 
        {/* Summary — top on mobile, right on desktop */}
        <div className="lg:col-span-2 lg:order-2">
          <div className="lg:sticky lg:top-24">
            <Summary cabin={cabin} dates={dates} nights={nights} total={total} />
          </div>
        </div>
 
        {/* Form — bottom on mobile, left on desktop */}
        <div className="lg:col-span-3 lg:order-1">
 
          {step === 1 && (
            <div className="bg-white border border-sand-200 shadow-sm p-6 md:p-8">
              <h2 className="text-sand-800 text-xl mb-6" style={{ fontFamily: 'DM Serif Display, serif' }}>
                Select Dates & Enter Your Details
              </h2>
              <BookingCalendar cabinId={id} onDatesSelected={setDates} selectedDates={dates} />
              {dates && nights < 2 && <p className="text-red-500 text-sm mt-2">Minimum 2 nights required.</p>}
 
              <hr className="border-sand-100 my-6" />
 
              <form onSubmit={handleDetails} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-sand-600 uppercase tracking-wide mb-1.5">Full Name *</label>
                    <input type="text" value={form.guest_name} required
                      onChange={e => setForm(f => ({ ...f, guest_name: e.target.value }))}
                      placeholder="Jane Smith"
                      className="input-field" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-sand-600 uppercase tracking-wide mb-1.5">Phone *</label>
                    <input type="tel" value={form.phone} required
                      onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                      placeholder="(705) 555-0123"
                      className="input-field" />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-sand-600 uppercase tracking-wide mb-1.5">Email Address *</label>
                    <input type="email" value={form.email} required
                      onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                      placeholder="jane@example.com"
                      className="input-field" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-sand-600 uppercase tracking-wide mb-1.5">Number of Guests *</label>
                    <input type="number" value={form.num_guests} required min={1} max={5}
                      onChange={e => setForm(f => ({ ...f, num_guests: e.target.value }))}
                      placeholder="e.g. 2"
                      className="input-field" />
                    {form.num_guests && parseInt(form.num_guests) > 5 && (
                      <p className="text-red-500 text-xs mt-1">
                        Maximum 5 guests. For larger groups please call us at (705)257-5434.
                      </p>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-sand-600 uppercase tracking-wide mb-1.5">Special Requests</label>
                  <textarea value={form.notes} rows={3}
                    onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                    placeholder="Any special needs or questions…"
                    className="input-field resize-none" />
                </div>
 
                {(formError || intentError) && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm">
                    {formError || intentError}
                  </div>
                )}
 
                <button
                  type="submit"
                  disabled={creatingIntent || !formComplete}
                  className="w-full bg-navy-700 hover:bg-navy-800 text-white py-3.5 font-semibold text-sm tracking-wide transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {creatingIntent
                    ? <><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>Preparing checkout…</>
                    : 'Continue to Payment'}
                </button>
                {!formComplete && (
                  <p className="text-sand-400 text-xs text-center">
                    {form.phone && form.phone.replace(/\D/g, '').length < 10
                      ? 'Please enter a valid phone number.'
                      : form.num_guests && parseInt(form.num_guests) > 5
                      ? 'Maximum 5 guests. Please call (705)257-5434 for larger groups.'
                      : 'Fill in your dates, name, phone, email, and number of guests to continue.'}
                  </p>
                )}
              </form>
            </div>
          )}
 
          {step === 2 && (
            <div className="bg-white border border-sand-200 shadow-sm p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <button onClick={() => setStep(1)} className="text-sand-400 hover:text-navy-600 text-sm transition-colors">
                  &larr; Back
                </button>
                <h2 className="text-sand-800 text-xl" style={{ fontFamily: 'DM Serif Display, serif' }}>
                  Complete Payment
                </h2>
              </div>
 
              {intentData?.client_secret ? (
                <Elements
                  stripe={stripePromise}
                  options={{
                    clientSecret: intentData.client_secret,
                    appearance: {
                      theme: 'stripe',
                      variables: {
                        colorPrimary: '#1e4068',
                        colorBackground: '#ffffff',
                        colorText: '#3a342a',
                        borderRadius: '2px',
                        fontFamily: 'DM Sans, sans-serif',
                      },
                    },
                  }}
                >
                  <PaymentForm
                    total={intentData.total_amount}
                    onSuccess={handlePaymentSuccess}
                  />
                </Elements>
              ) : (
                <div className="bg-amber-50 border border-amber-200 p-6 text-amber-800">
                  <h3 className="font-bold mb-2">Stripe Not Configured</h3>
                  <p className="text-sm mb-3">Add these keys to your <code>.env</code> files:</p>
                  <div className="bg-white p-3 font-mono text-xs text-sand-600 space-y-1 mb-3">
                    <p className="font-semibold text-sand-400">backend/.env</p>
                    <p>STRIPE_SECRET_KEY=sk_test_...</p>
                    <p className="font-semibold text-sand-400 mt-2">frontend/.env</p>
                    <p>VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...</p>
                  </div>
                  <a href="https://dashboard.stripe.com/apikeys" target="_blank" rel="noreferrer"
                    className="text-sm underline hover:text-amber-900">
                    Get your keys at dashboard.stripe.com
                  </a>
                </div>
              )}
            </div>
          )}
 
        </div>
      </div>
    </div>
  )
}
 