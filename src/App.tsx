import { useState } from 'react';
import OffsetsPanel from './components/OffsetsPanel';
import ConfigPanel from './components/ConfigPanel';
import PreviewPanel from './components/PreviewPanel';
import CodeOutput from './components/CodeOutput';
import Header from './components/Header';
import { ESPConfig, defaultConfig } from './types';

export default function App() {
  const [config, setConfig] = useState<ESPConfig>(defaultConfig);
  const [activeTab, setActiveTab] = useState<'config' | 'offsets' | 'code'>('config');

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-gray-100 font-mono">
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAyKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-50" />
      </div>

      <div className="relative z-10">
        <Header />
        
        {/* Tab Navigation */}
        <div className="max-w-7xl mx-auto px-4 pt-4">
          <div className="flex gap-1 bg-[#12121a] rounded-lg p-1 w-fit border border-gray-800/50">
            <button
              onClick={() => setActiveTab('config')}
              className={`px-5 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === 'config'
                  ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                  : 'text-gray-400 hover:text-gray-200 border border-transparent'
              }`}
            >
              ⚙️ ESP Config
            </button>
            <button
              onClick={() => setActiveTab('offsets')}
              className={`px-5 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === 'offsets'
                  ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                  : 'text-gray-400 hover:text-gray-200 border border-transparent'
              }`}
            >
              📋 Offsets
            </button>
            <button
              onClick={() => setActiveTab('code')}
              className={`px-5 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === 'code'
                  ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                  : 'text-gray-400 hover:text-gray-200 border border-transparent'
              }`}
            >
              💻 Generated Code
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 py-6">
          {activeTab === 'config' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <ConfigPanel config={config} setConfig={setConfig} />
              </div>
              <div>
                <PreviewPanel config={config} />
              </div>
            </div>
          )}
          {activeTab === 'offsets' && <OffsetsPanel />}
          {activeTab === 'code' && <CodeOutput config={config} />}
        </div>
      </div>
    </div>
  );
}
