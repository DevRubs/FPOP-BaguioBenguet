export default function AdminPageHeader({ title, description, children }) {
  return (
    <header className="mb-6 md:mb-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900">{title}</h1>
          {description ? (
            <p className="text-lg md:text-xl text-slate-700 font-semibold">{description}</p>
          ) : null}
        </div>
        {children ? (
          <div className="flex shrink-0 items-center gap-2">{children}</div>
        ) : null}
      </div>
    </header>
  )
}


