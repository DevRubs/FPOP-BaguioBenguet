export default function AdminPageHeader({ title, description, children }) {
  return (
    <header className="mb-4 md:mb-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold text-white">{title}</h1>
          {description ? (
            <p className="mt-1 text-slate-400">{description}</p>
          ) : null}
        </div>
        {children ? (
          <div className="flex shrink-0 items-center gap-2">{children}</div>
        ) : null}
      </div>
    </header>
  )
}


