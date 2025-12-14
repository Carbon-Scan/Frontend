import { Menu } from "lucide-react"

export default function TopBar() {
  return (
    <div className="bg-card border-b border-border/50 shadow-sm sticky top-0 z-40">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
            ♻️
          </div>
          <h1 className="text-lg font-bold text-primary">CarbonScan</h1>
        </div>
        <button className="p-2 hover:bg-secondary rounded-lg transition-colors">
          <Menu className="w-6 h-6 text-foreground" />
        </button>
      </div>
    </div>
  )
}
