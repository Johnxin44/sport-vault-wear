export default function Spinner({ size = 'md' }) {
  const s = { sm: 'w-5 h-5', md: 'w-8 h-8', lg: 'w-12 h-12' }[size]
  return (
    <div className="flex items-center justify-center py-12">
      <div className={`${s} border-2 border-white/10 border-t-brand-amber rounded-full animate-spin`}></div>
    </div>
  )
}
