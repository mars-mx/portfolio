export function PageShell({
  title,
  actions,
  children,
}: {
  title: string
  actions?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
        {actions}
      </div>
      <div className="mt-6 space-y-4 text-muted-foreground leading-relaxed">
        {children}
      </div>
    </article>
  )
}
