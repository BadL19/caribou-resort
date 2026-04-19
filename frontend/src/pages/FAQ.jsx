import { useState } from 'react'
import { Link } from 'react-router-dom'
 
const faqs = [
  {
    category: 'The Cabins',
    items: [
      {
        q: 'What cabins do you have?',
        a: 'We have four cabins. The Honeymoon Cabin is a cozy open cabin perfect for couples with one bedroom, a kitchen, and its own fire pit, summer only. Cabin 2 is our largest with a loft, full kitchen, and full bathroom available year-round. Cabin 5 has three bedrooms, a full kitchen, and a deck available summer only. Cabin 6 has a loft, two bedrooms, and a kitchen available year-round. All cabins have a private fire pit and BBQ grill.',
      },
      {
        q: 'Do the cabins have running water?',
        a: 'Cabin 2 has a full bathroom with running water. The Honeymoon Cabin, Cabin 5, and Cabin 6 do not have running water but the shared shower house on the property is available to all guests and each cabin has an outhouse on site.',
      },
      {
        q: 'Which cabin is best for couples?',
        a: 'The Honeymoon Cabin is our most private and intimate option. one bedroom, kitchen, and its own fire pit right on the water. It is available summer only. Cabin 2 is also great for couples who want more comfort with a full kitchen and bathroom.',
      },
      {
        q: 'Which cabin is best for families or groups?',
        a: 'Cabin 5 is the best option for families or groups with three separate bedrooms, a full kitchen, and a large deck. It fits up to 6 guests. Cabin 6 also works well for smaller groups with its loft and two bedrooms.',
      },
      {
        q: 'Do all cabins have a BBQ and fire pit?',
        a: 'Yes. Every cabin has its own fire pit and BBQ grill. Firewood is available for $10 per milk crate and propane tanks are available for $30 each.',
      },
      {
        q: 'Which cabins are available year-round?',
        a: 'Cabin 2 and Cabin 6 are available year-round. The Honeymoon Cabin and Cabin 5 are summer only.',
      },
    ],
  },
  {
    category: 'On the Property',
    items: [
      {
        q: 'Is there a shower available?',
        a: 'Yes. A shared shower house with hot water is on the property and available to all guests.',
      },
      {
        q: 'How does the firewood and propane work?',
        a: 'Firewood is available on site for $10 per milk crate and propane tanks are available for $30 each. Every cabin has a fire pit and BBQ grill included with your stay.',
      },
    ],
  },
  {
    category: 'Booking & Policies',
    items: [
      {
        q: 'What is the minimum stay?',
        a: 'Two nights minimum for all bookings.',
      },
      {
        q: 'What are check-in and check-out times?',
        a: 'Check-in at 3:00 PM, check-out at 11:00 AM. Contact us if you need something different and we will do what we can.',
      },
      {
        q: 'What is the payment policy?',
        a: 'Full payment is required upfront at the time of booking to secure your dates.',
      },
      {
        q: 'What is the cancellation policy?',
        a: 'Full refund for cancellations 14 or more days before check-in. 50% refund within 7 to 14 days. No refund within 7 days. Contact us directly if you have an emergency.',
      },
      {
        q: 'Is there a damage policy?',
        a: 'A damage fee will be charged to the card on file if there is any damage to the cabin or property during your stay.',
      },
    ],
  },
  {
    category: 'Pets & Rules',
    items: [
      {
        q: 'Are pets allowed?',
        a: 'Pets are welcome. Keep them on a leash in common areas and clean up after them. Let us know when you book.',
      },
      {
        q: 'Is smoking allowed?',
        a: 'No smoking inside any cabin. Smoking outside is fine.',
      },
      {
        q: 'Where are you located?',
        a: '239 Carter Side Rd, Desbarats, Ontario. About 1 hour east of Sault Ste. Marie and 3 hours from Sudbury.',
      },
    ],
  },
]
 
function Item({ item }) {
  const [open, setOpen] = useState(false)
  return (
    <div className={`border-b border-sand-100 last:border-0 ${open ? 'bg-sand-50' : 'bg-white'} transition-colors`}>
      <button className="w-full text-left py-5 px-5 flex justify-between items-start gap-4" onClick={() => setOpen(o => !o)}>
        <span className="font-medium text-sand-800 text-[14px] leading-snug">{item.q}</span>
        <svg className={`w-4 h-4 text-navy-400 shrink-0 mt-0.5 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && <p className="px-5 pb-5 text-sand-500 text-[14px] leading-relaxed">{item.a}</p>}
    </div>
  )
}
 
export default function FAQ() {
  return (
    <div className="bg-sand-50 min-h-screen">
 
      <div className="bg-navy-950 pt-14 pb-12 px-5 sm:px-8">
        <div className="max-w-7xl mx-auto">
          <span className="label text-navy-400 mb-4">Questions</span>
          <h1 className="text-5xl text-white" style={{ fontFamily: 'DM Serif Display, serif' }}>FAQ</h1>
          <p className="text-navy-300 mt-3 text-sm max-w-lg">Everything you need to know before booking.</p>
        </div>
      </div>
 
      <div className="max-w-2xl mx-auto px-5 sm:px-8 py-16">
        {faqs.map((cat, i) => (
          <div key={i} className="mb-10">
            <h2 className="text-lg text-sand-800 mb-3 font-semibold" style={{ fontFamily: 'DM Serif Display, serif' }}>
              {cat.category}
            </h2>
            <div className="border border-sand-200">
              {cat.items.map((item, j) => <Item key={j} item={item} />)}
            </div>
          </div>
        ))}
 
        <div className="mt-12 bg-navy-900 p-8 text-center">
          <h3 className="text-xl text-white mb-2" style={{ fontFamily: 'DM Serif Display, serif' }}>
            Still have a question?
          </h3>
          <p className="text-navy-400 text-sm mb-6">We usually reply within a few hours.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="https://mail.google.com/mail/?view=cm&to=cariboulogcabinresort@gmail.com&su=Cabin Inquiry" target="_blank" rel="noreferrer" className="btn-rust text-sm px-6">Email Us</a>
            <Link to="/cabins" className="border border-navy-600 text-navy-300 hover:text-white hover:border-white text-sm px-6 py-3 transition-colors">
              Browse Cabins
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}