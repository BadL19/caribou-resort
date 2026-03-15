import { useEffect, useState } from 'react'
import CabinCard from '../components/CabinCard'
import { getCabins } from '../services/api'
 
export default function Cabins() {
  const [cabins, setCabins] = useState([])
  const [loading, setLoading] = useState(true)
 
  useEffect(() => {
    getCabins().then(d => { setCabins(d); setLoading(false) }).catch(() => setLoading(false))
  }, [])
 
  return (
    <div className="bg-sand-50 min-h-screen">
 
      {/* Header */}
      <div className="bg-navy-950 pt-14 pb-12 px-5 sm:px-8">
        <div className="max-w-7xl mx-auto">
          <span className="label text-navy-400 mb-4">Desbarats, Ontario</span>
          <h1 className="text-5xl text-white" style={{ fontFamily: 'DM Serif Display, serif' }}>
            Our Cabins
          </h1>
          <p className="text-navy-300 mt-3 text-base max-w-lg">
            Three cabins on Caribou Lake. Pick what fits.
          </p>
        </div>
      </div>
 
      {/* Info bar */}
      <div className="bg-white border-b border-sand-200">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-3 flex flex-wrap gap-x-8 gap-y-1 text-[13px] text-sand-500">
          <span>2-night minimum stay</span>
          <span>All cabins have a fire pit and BBQ</span>
          <span>Shared shower house on property</span>
          <span>Firewood $10 per milk crate</span>
        </div>
      </div>
 
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-14">
        {loading ? (
          <div className="flex justify-center py-24">
            <div className="w-8 h-8 border-2 border-navy-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {cabins.map(cabin => <CabinCard key={cabin.id} cabin={cabin} />)}
          </div>
        )}
      </div>
    </div>
  )
}