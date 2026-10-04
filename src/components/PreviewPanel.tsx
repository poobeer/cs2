import { ESPConfig } from '../types';

interface Props {
  config: ESPConfig;
}

export default function PreviewPanel({ config }: Props) {
  return (
    <div className="bg-[#12121a] border border-gray-800/50 rounded-xl p-5 sticky top-4">
      <h3 className="text-sm font-semibold text-white mb-1">👁 Live Preview</h3>
      <p className="text-xs text-gray-500 mb-4">Visual representation of your ESP config</p>
      
      {/* Preview Canvas */}
      <div className="relative w-full aspect-[4/3] bg-[#1a1a2e] rounded-lg overflow-hidden border border-gray-700/30">
        {/* Fake game background */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#2a2a3e] to-[#0a0a15]" />
        <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-[#1a1a2e] to-transparent" />
        
        {/* Fake floor grid */}
        <div className="absolute bottom-0 left-0 right-0 h-1/2" style={{
          background: 'linear-gradient(transparent 0%, rgba(50,50,80,0.3) 100%)',
          backgroundImage: 'repeating-linear-gradient(90deg, rgba(100,100,150,0.1) 0px, transparent 1px, transparent 40px), repeating-linear-gradient(0deg, rgba(100,100,150,0.1) 0px, transparent 1px, transparent 40px)'
        }} />

        {/* Player silhouette */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          {/* Player body */}
          <div className="relative">
            {/* Head */}
            <div className="w-6 h-6 rounded-full bg-gray-600 mx-auto border border-gray-500" />
            {/* Body */}
            <div className="w-10 h-16 bg-gray-600 mx-auto mt-1 rounded-sm border border-gray-500" />
            {/* Legs */}
            <div className="flex justify-center gap-1 mt-0.5">
              <div className="w-4 h-12 bg-gray-600 rounded-sm border border-gray-500" />
              <div className="w-4 h-12 bg-gray-600 rounded-sm border border-gray-500" />
            </div>

            {/* Glow Effect */}
            {config.glowEnabled && (
              <div
                className="absolute inset-0 rounded-full blur-xl -z-10 scale-150"
                style={{
                  backgroundColor: config.glowColor,
                  opacity: config.glowAlpha,
                  filter: `blur(${config.glowRadius * 8}px)`,
                }}
              />
            )}

            {/* Box ESP */}
            {config.boxEnabled && (
              <BoxOverlay type={config.boxType} color={config.boxColor} />
            )}

            {/* Health Bar */}
            {config.healthBarEnabled && (
              <div className="absolute -left-4 top-0 bottom-0 w-1.5 bg-gray-800 rounded-full overflow-hidden">
                <div className="absolute bottom-0 w-full bg-gradient-to-t from-green-500 to-green-400 rounded-full" style={{ height: '72%' }} />
              </div>
            )}

            {/* Name Tag */}
            {config.nameTagEnabled && (
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap">
                <span className="text-[10px] text-white bg-black/60 px-1.5 py-0.5 rounded font-mono">
                  Enemy_Player
                </span>
              </div>
            )}

            {/* Weapon Tag */}
            {config.weaponTagEnabled && (
              <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 whitespace-nowrap">
                <span className="text-[9px] text-gray-300 bg-black/50 px-1.5 py-0.5 rounded font-mono">
                  AK-47
                </span>
              </div>
            )}

            {/* Distance */}
            {config.distanceEnabled && (
              <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 whitespace-nowrap">
                <span className="text-[9px] text-yellow-400 font-mono">
                  42m
                </span>
              </div>
            )}

            {/* Skeleton */}
            {config.skeletonEnabled && (
              <svg className="absolute inset-0 -m-4 pointer-events-none" style={{ width: 'calc(100% + 32px)', height: 'calc(100% + 32px)' }}>
                <line x1="50%" y1="12%" x2="50%" y2="45%" stroke={config.skeletonColor} strokeWidth="1.5" opacity="0.8" />
                <line x1="35%" y1="25%" x2="65%" y2="25%" stroke={config.skeletonColor} strokeWidth="1.5" opacity="0.8" />
                <line x1="35%" y1="25%" x2="30%" y2="45%" stroke={config.skeletonColor} strokeWidth="1.5" opacity="0.8" />
                <line x1="65%" y1="25%" x2="70%" y2="45%" stroke={config.skeletonColor} strokeWidth="1.5" opacity="0.8" />
                <line x1="45%" y1="55%" x2="40%" y2="85%" stroke={config.skeletonColor} strokeWidth="1.5" opacity="0.8" />
                <line x1="55%" y1="55%" x2="60%" y2="85%" stroke={config.skeletonColor} strokeWidth="1.5" opacity="0.8" />
              </svg>
            )}
          </div>
        </div>

        {/* Crosshair */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
          <div className="w-5 h-0.5 bg-green-400/70 absolute -translate-x-1/2" />
          <div className="w-0.5 h-5 bg-green-400/70 absolute -translate-y-1/2" />
        </div>

        {/* HUD overlay */}
        <div className="absolute top-2 left-2 text-[9px] text-gray-400 font-mono space-y-0.5">
          <div>FPS: 144</div>
          <div>Ping: 23ms</div>
        </div>
        <div className="absolute top-2 right-2 text-[9px] text-orange-400 font-mono">
          ESP ON
        </div>
      </div>

      {/* Config Summary */}
      <div className="mt-4 space-y-2">
        <h4 className="text-xs font-medium text-gray-400 uppercase tracking-wider">Active Modules</h4>
        <div className="flex flex-wrap gap-1.5">
          {config.glowEnabled && <Badge color="orange">Glow</Badge>}
          {config.boxEnabled && <Badge color="green">Box ({config.boxType})</Badge>}
          {config.skeletonEnabled && <Badge color="white">Skeleton</Badge>}
          {config.healthBarEnabled && <Badge color="green">HP Bar</Badge>}
          {config.nameTagEnabled && <Badge color="blue">Name</Badge>}
          {config.weaponTagEnabled && <Badge color="purple">Weapon</Badge>}
          {config.distanceEnabled && <Badge color="yellow">Distance</Badge>}
          {config.teamCheck && <Badge color="gray">Team Check</Badge>}
          {config.visibleOnly && <Badge color="red">Vis Only</Badge>}
        </div>
      </div>
    </div>
  );
}

function BoxOverlay({ type, color }: { type: string; color: string }) {
  const style = { borderColor: color };

  if (type === '2d') {
    return (
      <div className="absolute -inset-3 border-2 rounded-sm pointer-events-none" style={style} />
    );
  }
  if (type === '3d') {
    return (
      <div className="absolute -inset-4 pointer-events-none">
        <div className="absolute inset-0 border-2 rounded-sm" style={style} />
        <div className="absolute inset-0 border-2 rounded-sm translate-x-1 translate-y-1 opacity-50" style={style} />
      </div>
    );
  }
  // Corner
  return (
    <div className="absolute -inset-3 pointer-events-none">
      {/* Top-left */}
      <div className="absolute top-0 left-0 w-3 h-0.5" style={{ backgroundColor: color }} />
      <div className="absolute top-0 left-0 w-0.5 h-3" style={{ backgroundColor: color }} />
      {/* Top-right */}
      <div className="absolute top-0 right-0 w-3 h-0.5" style={{ backgroundColor: color }} />
      <div className="absolute top-0 right-0 w-0.5 h-3" style={{ backgroundColor: color }} />
      {/* Bottom-left */}
      <div className="absolute bottom-0 left-0 w-3 h-0.5" style={{ backgroundColor: color }} />
      <div className="absolute bottom-0 left-0 w-0.5 h-3" style={{ backgroundColor: color }} />
      {/* Bottom-right */}
      <div className="absolute bottom-0 right-0 w-3 h-0.5" style={{ backgroundColor: color }} />
      <div className="absolute bottom-0 right-0 w-0.5 h-3" style={{ backgroundColor: color }} />
    </div>
  );
}

function Badge({ children, color }: { children: React.ReactNode; color: string }) {
  const colors: Record<string, string> = {
    orange: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    green: 'bg-green-500/20 text-green-400 border-green-500/30',
    white: 'bg-gray-500/20 text-gray-300 border-gray-500/30',
    blue: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    purple: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    yellow: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    gray: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
    red: 'bg-red-500/20 text-red-400 border-red-500/30',
  };
  return (
    <span className={`text-[10px] px-2 py-0.5 rounded-full border ${colors[color] || colors.gray}`}>
      {children}
    </span>
  );
}
