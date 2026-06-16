import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAdminProducts, createProduct, updateProduct, deleteProduct } from '../../store/slices/adminSlice'
import AdminLayout from '../../components/admin/AdminLayout'
import Spinner from '../../components/common/Spinner'
import { HiPlus, HiPencil, HiTrash, HiX } from 'react-icons/hi'
import { getImageUrl } from '../../utils/getImageUrl'

const emptyForm = {
  name: '', category: 'jersey', team: '', league: 'Premier League', price: '', originalPrice: '',
  sport: 'football', brand: '', sizes: 'S,M,L,XL,XXL', badge: '', description: '',
  featured: false, countInStock: '100',
}

const productTypes = [
  { value: 'jersey',    label: 'Jersey' },
  { value: 'sneakers',  label: 'Sneakers' },
  { value: 'tracksuit', label: 'Tracksuit / Hoodie' },
  { value: 'accessory', label: 'Accessory' },
]

const leaguesBySport = {
  football: ['Premier League','La Liga','Serie A','Bundesliga','Champions League','International'],
  basketball: ['NBA'],
  'american-football': ['NFL'],
  lifestyle: ['Other'],
}

export default function AdminProducts() {
  const dispatch = useDispatch()
  const { products, loading } = useSelector((s) => s.admin)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing]     = useState(null)
  const [form, setForm]           = useState(emptyForm)
  const [imageFile, setImageFile] = useState(null)

  useEffect(() => { dispatch(fetchAdminProducts()) }, [dispatch])

  const openCreate = () => { setEditing(null); setForm(emptyForm); setImageFile(null); setShowModal(true) }
  const openEdit = (p) => {
    setEditing(p)
    setForm({
      name: p.name, category: p.category || 'jersey', team: p.team, league: p.league, price: p.price, originalPrice: p.originalPrice || '',
      sport: p.sport, brand: p.brand || '', sizes: (p.sizes || []).join(','), badge: p.badge || '',
      description: p.description || '', featured: p.featured || false, countInStock: p.countInStock || 100,
    })
    setImageFile(null)
    setShowModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const fd = new FormData()
    Object.entries(form).forEach(([k, v]) => {
      if (k === 'sizes') fd.append(k, v.split(',').map(s => s.trim()).join(','))
      else fd.append(k, v)
    })
    if (imageFile) fd.append('image', imageFile)

    let result
    if (editing) result = await dispatch(updateProduct({ id: editing._id, formData: fd }))
    else         result = await dispatch(createProduct(fd))

    // Only close the modal if the request actually succeeded
    if (result.meta.requestStatus === 'fulfilled') {
      setShowModal(false)
    }
  }

  const handleDelete = (id) => {
    if (window.confirm('Delete this product permanently?')) dispatch(deleteProduct(id))
  }

  return (
    <AdminLayout title="PRODUCTS">
      <div className="flex justify-end mb-4">
        <button onClick={openCreate} className="btn-primary flex items-center gap-2 text-sm px-5 py-2.5">
          <HiPlus size={16} /> Add Product
        </button>
      </div>

      {loading ? <Spinner size="lg" /> : (
        <div className="bg-[#111] border border-white/5 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#1a1a1a] text-left text-[10px] tracking-widest uppercase text-gray-500">
                <th className="px-4 py-3">Image</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">League</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Stock</th>
                <th className="px-4 py-3">Badge</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p._id} className="border-t border-white/5 hover:bg-white/[0.02]">
                  <td className="px-4 py-3">
                    <img src={p.images?.[0] ? getImageUrl(p.images[0]) : 'https://placehold.co/48x48/111/F5A623?text=I'} alt="" className="w-10 h-12 object-cover" />
                  </td>
                  <td className="px-4 py-3 text-white font-medium">{p.name}</td>
                  <td className="px-4 py-3 text-gray-400 capitalize">{p.category || 'jersey'}</td>
                  <td className="px-4 py-3 text-brand-amber">{p.league}</td>
                  <td className="px-4 py-3 text-white">${p.price.toFixed(2)}</td>
                  <td className="px-4 py-3 text-gray-400">{p.countInStock}</td>
                  <td className="px-4 py-3">{p.badge ? <span className="text-[10px] font-bold tracking-widest uppercase bg-brand-amber/15 text-brand-amber px-2 py-1">{p.badge}</span> : '—'}</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => openEdit(p)} className="text-gray-400 hover:text-brand-amber mr-3"><HiPencil size={16} /></button>
                    <button onClick={() => handleDelete(p._id)} className="text-gray-400 hover:text-red-400"><HiTrash size={16} /></button>
                  </td>
                </tr>
              ))}
              {products.length === 0 && <tr><td colSpan={8} className="px-4 py-12 text-center text-gray-500">No products yet.</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
          <div className="bg-[#111] border border-white/10 w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-2xl tracking-widest text-white">{editing ? 'EDIT PRODUCT' : 'ADD PRODUCT'}</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-white"><HiX size={20} /></button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><p className="label">Product Name</p>
                  <input required value={form.name} onChange={(e) => setForm(f => ({...f, name: e.target.value}))} className="input-field" /></div>
                <div><p className="label">Team / Brand</p>
                  <input required value={form.team} onChange={(e) => setForm(f => ({...f, team: e.target.value}))} className="input-field" /></div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div><p className="label">Product Type</p>
                  <select value={form.category} onChange={(e) => {
                    const category = e.target.value
                    setForm(f => {
                      if (category === 'jersey') {
                        return { ...f, category, sport: 'football', league: leaguesBySport.football[0] }
                      }
                      return { ...f, category, sport: 'lifestyle', league: 'Other' }
                    })
                  }} className="input-field">
                    {productTypes.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                </div>

                {form.category === 'jersey' ? (
                  <>
                    <div><p className="label">Sport</p>
                      <select value={form.sport} onChange={(e) => {
                        const sport = e.target.value
                        setForm(f => ({ ...f, sport, league: leaguesBySport[sport][0] }))
                      }} className="input-field">
                        <option value="football">Football</option>
                        <option value="basketball">Basketball</option>
                        <option value="american-football">American Football</option>
                      </select>
                    </div>
                    <div><p className="label">League</p>
                      <select value={form.league} onChange={(e) => setForm(f => ({...f, league: e.target.value}))} className="input-field">
                        {leaguesBySport[form.sport].map(l => <option key={l} value={l}>{l}</option>)}
                      </select>
                    </div>
                  </>
                ) : (
                  <div className="col-span-2 flex items-end">
                    <p className="text-xs text-gray-500 pb-2.5">
                      Sport &amp; league aren't used for {productTypes.find(t => t.value === form.category)?.label.toLowerCase()} — these will be categorized under "Lifestyle / Other".
                    </p>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div><p className="label">Price ($)</p>
                  <input type="number" step="0.01" required value={form.price} onChange={(e) => setForm(f => ({...f, price: e.target.value}))} className="input-field" /></div>
                <div><p className="label">Original Price ($)</p>
                  <input type="number" step="0.01" value={form.originalPrice} onChange={(e) => setForm(f => ({...f, originalPrice: e.target.value}))} className="input-field" placeholder="Optional" /></div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div><p className="label">Brand</p>
                  <input value={form.brand} onChange={(e) => setForm(f => ({...f, brand: e.target.value}))} className="input-field" placeholder="Nike, Adidas, New Era..." /></div>
                <div><p className="label">Badge</p>
                  <select value={form.badge} onChange={(e) => setForm(f => ({...f, badge: e.target.value}))} className="input-field">
                    <option value="">None</option>
                    <option value="new">New</option>
                    <option value="hot">Hot</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div><p className="label">Sizes (comma separated)</p>
                  <input value={form.sizes} onChange={(e) => setForm(f => ({...f, sizes: e.target.value}))} className="input-field"
                    placeholder={form.category === 'sneakers' ? 'e.g. 7,8,9,10,11,12' : form.category === 'accessory' ? 'e.g. One Size' : 'e.g. S,M,L,XL,XXL'} /></div>
                <div><p className="label">Stock Count</p>
                  <input type="number" value={form.countInStock} onChange={(e) => setForm(f => ({...f, countInStock: e.target.value}))} className="input-field" /></div>
              </div>

              <div><p className="label">Description</p>
                <textarea rows={3} value={form.description} onChange={(e) => setForm(f => ({...f, description: e.target.value}))} className="input-field resize-none" /></div>

              <div><p className="label">Product Image</p>
                <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} className="input-field" />
                {editing?.images?.[0] && !imageFile && <p className="text-xs text-gray-500 mt-1">Current: {editing.images[0]}</p>}
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.featured} onChange={(e) => setForm(f => ({...f, featured: e.target.checked}))} className="w-4 h-4 accent-brand-amber" />
                <span className="text-sm text-gray-300">Show on homepage (Featured)</span>
              </label>

              <div className="flex gap-3 pt-2">
                <button type="submit" className="btn-primary flex-1">{editing ? 'Save Changes' : 'Create Product'}</button>
                <button type="button" onClick={() => setShowModal(false)} className="btn-outline flex-1">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
