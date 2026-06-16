export default function EmptyState({ icon, title, message, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      {icon && <div className="text-5xl text-brand-amber mb-4">{icon}</div>}
      <h3 className="font-display text-2xl tracking-widest text-white mb-2">{title}</h3>
      <p className="text-sm text-gray-500 mb-6 max-w-xs">{message}</p>
      {action}
    </div>
  )
}
