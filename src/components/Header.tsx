export default function Header() {
  return (
    <header className="border-b border-gray-800/50 bg-[#0d0d15]/80 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-lg shadow-orange-500/20">
            <span className="text-lg">👁</span>
          </div>
          <div>
            <h1 className="text-lg font-bold text-white tracking-tight">
              CS2 External <span className="text-orange-400">ESP</span> Configurator
            </h1>
            <p className="text-xs text-gray-500">Player Highlight Tool • External Read/Write</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs text-green-400 font-medium">Offsets Updated</span>
          </div>
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-800/50 border border-gray-700/50">
            <span className="text-xs text-gray-400">v2.1.0</span>
          </div>
        </div>
      </div>
    </header>
  );
}
