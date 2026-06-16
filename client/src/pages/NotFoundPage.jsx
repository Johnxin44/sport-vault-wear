import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center page-wrapper animate-fade-in">
      <h1 className="font-display text-[10rem] leading-none text-brand-amber">404</h1>
      <h2 className="font-display text-3xl tracking-widest text-white mb-4">PAGE NOT FOUND</h2>
      <p className="text-gray-500 mb-8">The page you're looking for doesn't exist or has been moved.</p>
      <Link to="/" className="btn-primary">Back to Home</Link>
    </div>
  )
}
