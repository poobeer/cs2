import { ESPConfig } from '../types';

interface Props {
  config: ESPConfig;
  setConfig: (config: ESPConfig) => void;
}

export default function ConfigPanel({ config, setConfig }: Props) {
  const update = (key: keyof ESPConfig, value: any) => {
    setConfig({ ...config, [key]: value });
  };

  return (
    <div className="space-y-4">
      {/* Glow Settings */}
      <Section title="🔆 Glow ESP" description="Highlight player models with a colored glow effect">
        <Toggle label="Enable Glow" checked={config.glowEnabled} onChange={(v) => update('glowEnabled', v)} />
        <div className="grid grid-cols-2 gap-4">
          <ColorPicker label="Glow Color" value={config.glowColor} onChange={(v) => update('glowColor', v)} />
          <Slider label="Glow Alpha" value={config.glowAlpha} min={0} max={1} step={0.05} onChange={(v) => update('glowAlpha', v)} />
        </div>
        <Slider label="Glow Style (0-3)" value={config.glowRadius} min={0} max={3} step={1} onChange={(v) => update('glowRadius', v)} />
      </Section>

      {/* Box ESP */}
      <Section title="📦 Box ESP" description="Draw bounding boxes around enemy players">
        <Toggle label="Enable Box" checked={config.boxEnabled} onChange={(v) => update('boxEnabled', v)} />
        <div className="grid grid-cols-2 gap-4">
          <ColorPicker label="Box Color" value={config.boxColor} onChange={(v) => update('boxColor', v)} />
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Box Type</label>
            <select
              value={config.boxType}
              onChange={(e) => update('boxType', e.target.value)}
              className="w-full bg-[#1a1a2e] border border-gray-700/50 rounded-md px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-orange-500/50"
            >
              <option value="2d">2D Full Box</option>
              <option value="3d">3D Box</option>
              <option value="corner">Corner Box</option>
            </select>
          </div>
        </div>
      </Section>

      {/* Skeleton */}
      <Section title="🦴 Skeleton ESP" description="Render bone structure overlay on players">
        <Toggle label="Enable Skeleton" checked={config.skeletonEnabled} onChange={(v) => update('skeletonEnabled', v)} />
        <ColorPicker label="Skeleton Color" value={config.skeletonColor} onChange={(v) => update('skeletonColor', v)} />
      </Section>

      {/* Info Tags */}
      <Section title="🏷️ Info Tags" description="Display additional player information">
        <div className="grid grid-cols-2 gap-3">
          <Toggle label="Health Bar" checked={config.healthBarEnabled} onChange={(v) => update('healthBarEnabled', v)} />
          <Toggle label="Name Tag" checked={config.nameTagEnabled} onChange={(v) => update('nameTagEnabled', v)} />
          <Toggle label="Weapon Tag" checked={config.weaponTagEnabled} onChange={(v) => update('weaponTagEnabled', v)} />
          <Toggle label="Distance" checked={config.distanceEnabled} onChange={(v) => update('distanceEnabled', v)} />
        </div>
      </Section>

      {/* Filters */}
      <Section title="🎯 Filters & Limits" description="Control which players are highlighted">
        <Toggle label="Team Check (skip teammates)" checked={config.teamCheck} onChange={(v) => update('teamCheck', v)} />
        <Toggle label="Visible Only (through walls off)" checked={config.visibleOnly} onChange={(v) => update('visibleOnly', v)} />
        <Slider label="Max Distance (units)" value={config.maxDistance} min={100} max={2000} step={50} onChange={(v) => update('maxDistance', v)} />
        <Slider label="Smoothing Factor" value={config.smoothFactor} min={1} max={20} step={1} onChange={(v) => update('smoothFactor', v)} />
      </Section>
    </div>
  );
}

function Section({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <div className="bg-[#12121a] border border-gray-800/50 rounded-xl p-5">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-white">{title}</h3>
        <p className="text-xs text-gray-500 mt-0.5">{description}</p>
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center justify-between cursor-pointer group">
      <span className="text-sm text-gray-300 group-hover:text-white transition-colors">{label}</span>
      <div className="relative">
        <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="sr-only peer" />
        <div className="w-9 h-5 bg-gray-700 rounded-full peer-checked:bg-orange-500/80 transition-colors" />
        <div className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-4" />
      </div>
    </label>
  );
}

function ColorPicker({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="text-xs text-gray-400 mb-1 block">{label}</label>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-8 h-8 rounded-md border border-gray-700 cursor-pointer bg-transparent"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 bg-[#1a1a2e] border border-gray-700/50 rounded-md px-3 py-1.5 text-sm text-gray-200 font-mono focus:outline-none focus:border-orange-500/50"
        />
      </div>
    </div>
  );
}

function Slider({ label, value, min, max, step, onChange }: { label: string; value: number; min: number; max: number; step: number; onChange: (v: number) => void }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <label className="text-xs text-gray-400">{label}</label>
        <span className="text-xs text-orange-400 font-mono">{value}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1.5 bg-gray-700 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-orange-500 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer"
      />
    </div>
  );
}
