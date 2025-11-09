export default function DashboardHeader() {
  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="px-6 py-4 max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/60 rounded-xl flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-lg">$</span>
          </div>
          <h1 className="text-xl font-bold text-foreground">Ledger</h1>
        </div>

        <div className="flex items-center gap-4">
          <button className="text-muted-foreground hover:text-foreground transition-colors">Settings</button>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-300 to-slate-400 dark:from-slate-600 dark:to-slate-700"></div>
        </div>
      </div>
    </header>
  )
}
