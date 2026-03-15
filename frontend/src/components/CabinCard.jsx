import { Link } from 'react-router-dom'
 
export default function CabinCard({ cabin }) {
  const image = cabin.images?.[0] || '/images/cabins/honeymoon-cabin/main.jpg'
 
  return (
    <article className="group bg-white border border-sand-200 overflow-hidden flex flex-col">
      <div className="relative overflow-hidden bg-sand-100" style={{ aspectRatio: '4/3' }}>
        <img
          src={image}
          alt={cabin.name}
          className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
        />
        <div className="absolute bottom-0 inset-x-0 h-20 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute bottom-3 right-3 bg-white text-navy-900 text-xs font-semibold px-2.5 py-1">
          ${cabin.price_per_night}<span className="font-normal text-sand-500">/night</span>
        </div>
      </div>
 
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-lg font-semibold text-sand-900 mb-1.5 leading-snug" style={{ fontFamily: 'DM Serif Display, serif' }}>
          {cabin.name}
        </h3>
        <p className="text-sand-500 text-sm leading-relaxed mb-4 flex-grow">
          {cabin.short_description || cabin.description?.slice(0, 100) + '…'}
        </p>
 
        <div className="flex flex-wrap gap-1.5 mb-4">
          {(cabin.amenities || []).slice(0, 3).map((a, i) => (
            <span key={i} className="text-[11px] text-sand-600 bg-sand-50 border border-sand-200 px-2 py-0.5">
              {a}
            </span>
          ))}
        </div>
 
        <div className="flex gap-2 pt-3 border-t border-sand-100">
          <Link to={`/cabins/${cabin.id}`}
            className="flex-1 text-center text-[13px] font-medium text-navy-700 border border-navy-200 py-2 hover:border-navy-600 transition-colors">
            Details
          </Link>
          <Link to={`/book/${cabin.id}`}
            className="flex-1 text-center text-[13px] font-medium bg-navy-800 text-white py-2 hover:bg-navy-700 transition-colors">
            Book
          </Link>
        </div>
      </div>
    </article>
  )
}