export default function Modal({ open, title, children, onClose }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-lg rounded-lg border border-slate-800 bg-slate-900">
        <div className="flex items-center justify-between border-b border-slate-800 p-3">
          <h3 className="font-semibold">{title}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white">✕</button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  )
}


