import { useState } from 'react';
import { offsets } from '../types';

export default function OffsetsPanel() {
  const [expandedDll, setExpandedDll] = useState<string | null>('client.dll');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1500);
  };

  const copyAllOffsets = () => {
    const json = JSON.stringify(
      Object.fromEntries(offsets.map(g => [g.dll, Object.fromEntries(g.offsets.map(o => [o.name, o.value]))])),
      null,
      2
    );
    navigator.clipboard.writeText(json);
    setCopiedKey('all');
    setTimeout(() => setCopiedKey(null), 1500);
  };

  const filteredOffsets = offsets.map(group => ({
    ...group,
    offsets: group.offsets.filter(o =>
      o.name.toLowerCase().includes(searchTerm.toLowerCase())
    ),
  })).filter(g => g.offsets.length > 0);

  return (
    <div className="space-y-4">
      {/* Search & Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">🔍</span>
          <input
            type="text"
            placeholder="Search offsets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#12121a] border border-gray-800/50 rounded-lg pl-10 pr-4 py-2.5 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-orange-500/50"
          />
        </div>
        <button
          onClick={copyAllOffsets}
          className="px-4 py-2.5 bg-orange-500/20 border border-orange-500/30 rounded-lg text-sm text-orange-400 hover:bg-orange-500/30 transition-colors whitespace-nowrap"
        >
          {copiedKey === 'all' ? '✓ Copied!' : '📋 Copy All as JSON'}
        </button>
      </div>

      {/* Offset Groups */}
      <div className="space-y-3">
        {filteredOffsets.map(group => (
          <div key={group.dll} className="bg-[#12121a] border border-gray-800/50 rounded-xl overflow-hidden">
            {/* Group Header */}
            <button
              onClick={() => setExpandedDll(expandedDll === group.dll ? null : group.dll)}
              className="w-full flex items-center justify-between px-5 py-3 hover:bg-white/[0.02] transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-orange-500" />
                <span className="text-sm font-semibold text-white">{group.dll}</span>
                <span className="text-xs text-gray-500 bg-gray-800/50 px-2 py-0.5 rounded-full">
                  {group.offsets.length} offsets
                </span>
              </div>
              <span className={`text-gray-500 transition-transform ${expandedDll === group.dll ? 'rotate-180' : ''}`}>
                ▼
              </span>
            </button>

            {/* Offsets List */}
            {expandedDll === group.dll && (
              <div className="border-t border-gray-800/50">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-gray-800/30">
                  {group.offsets.map(offset => {
                    const key = `${group.dll}.${offset.name}`;
                    return (
                      <button
                        key={offset.name}
                        onClick={() => copyToClipboard(offset.hex, key)}
                        className="flex items-center justify-between px-4 py-2.5 bg-[#12121a] hover:bg-[#1a1a2e] transition-colors group text-left"
                      >
                        <div>
                          <div className="text-xs text-gray-300 font-medium group-hover:text-white transition-colors">
                            {offset.name}
                          </div>
                          <div className="text-[10px] text-gray-600 font-mono mt-0.5">
                            {offset.value.toLocaleString()}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-orange-400/70 font-mono">
                            {offset.hex}
                          </span>
                          <span className="text-[10px] text-gray-600 group-hover:text-orange-400 transition-colors">
                            {copiedKey === key ? '✓' : '📋'}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Key Offsets for ESP */}
      <div className="bg-[#12121a] border border-orange-500/20 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-orange-400 mb-3">🎯 Key Offsets for Player Highlight (Glow ESP)</h3>
        <div className="space-y-2 text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="text-gray-500">1.</span>
            <span className="text-gray-300">Read</span>
            <span className="text-orange-400">dwEntityList</span>
            <span className="text-gray-500">→</span>
            <span className="text-gray-400">Get entity list pointer</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-500">2.</span>
            <span className="text-gray-300">Read</span>
            <span className="text-orange-400">dwLocalPlayerPawn</span>
            <span className="text-gray-500">→</span>
            <span className="text-gray-400">Get local player pawn</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-500">3.</span>
            <span className="text-gray-300">Iterate</span>
            <span className="text-orange-400">dwGameEntitySystem</span>
            <span className="text-gray-500">→</span>
            <span className="text-gray-400">Loop through entities</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-500">4.</span>
            <span className="text-gray-300">Write</span>
            <span className="text-orange-400">m_iGlowTeam / m_glowColor</span>
            <span className="text-gray-500">→</span>
            <span className="text-gray-400">Set glow on enemy pawns</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-500">5.</span>
            <span className="text-gray-300">Alt:</span>
            <span className="text-orange-400">dwGlowManager</span>
            <span className="text-gray-500">→</span>
            <span className="text-gray-400">Direct glow object manipulation</span>
          </div>
        </div>
      </div>
    </div>
  );
}
