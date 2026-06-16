import { useState } from 'react'
import toast from 'react-hot-toast'
import { HiMail, HiPhone, HiLocationMarker } from 'react-icons/hi'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitting(true)
    setTimeout(() => {
      toast.success("Message sent! We'll get back to you within 24 hours.")
      setForm({ name: '', email: '', subject: '', message: '' })
      setSubmitting(false)
    }, 800)
  }

  return (
    <div className="page-wrapper py-12 animate-fade-in">
      <h1 className="font-display text-5xl tracking-widest text-white mb-2">CONTACT US</h1>
      <p className="text-gray-500 mb-12">Have a question? We'd love to hear from you.</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="space-y-6">
          {[
            { Icon: HiMail,          t: 'Email',   d: 'support@sportvaultwear.com' },
            { Icon: HiPhone,         t: 'Phone',   d: '+1 (234) 567-890' },
            { Icon: HiLocationMarker,t: 'Address', d: '123 Stadium Way, Sports City' },
          ].map(({ Icon, t, d }) => (
            <div key={t} className="flex items-start gap-4 bg-[#111] border border-white/5 p-5">
              <Icon size={22} className="text-brand-amber flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs tracking-widest uppercase text-gray-500 mb-1">{t}</p>
                <p className="text-white">{d}</p>
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="lg:col-span-2 bg-[#111] border border-white/5 p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><p className="label">Name</p>
              <input required value={form.name} onChange={(e) => setForm(f => ({...f, name: e.target.value}))} className="input-field" /></div>
            <div><p className="label">Email</p>
              <input type="email" required value={form.email} onChange={(e) => setForm(f => ({...f, email: e.target.value}))} className="input-field" /></div>
          </div>
          <div><p className="label">Subject</p>
            <input required value={form.subject} onChange={(e) => setForm(f => ({...f, subject: e.target.value}))} className="input-field" /></div>
          <div><p className="label">Message</p>
            <textarea required rows={6} value={form.message} onChange={(e) => setForm(f => ({...f, message: e.target.value}))} className="input-field resize-none" /></div>
          <button type="submit" disabled={submitting} className="btn-primary">
            {submitting ? 'Sending...' : 'Send Message'}
          </button>
        </form>
      </div>
    </div>
  )
}
