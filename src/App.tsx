export default function App() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-gray-100 font-mono p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">
            CS2 External Glow ESP
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            External player highlight tool. Reads entity list, writes glow color to enemy pawns.
          </p>
        </div>

        {/* Download Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {/* Python */}
          <div className="bg-[#12121a] border border-gray-800/50 rounded-xl p-6 hover:border-orange-500/30 transition-colors">
            <div className="flex items-center gap-3 mb-4">
              <div className="text-3xl">🐍</div>
              <div>
                <h2 className="text-lg font-bold text-white">Python Version</h2>
                <p className="text-xs text-gray-500">No dependencies required</p>
              </div>
            </div>
            <ul className="text-xs text-gray-400 space-y-1 mb-4">
              <li>✓ Uses only ctypes (built-in)</li>
              <li>✓ No pip install needed</li>
              <li>✓ Easy to customize</li>
              <li>✓ ~150 lines of code</li>
            </ul>
            <a
              href="/cs2_glow_esp.py"
              download
              className="block w-full text-center px-4 py-3 bg-orange-500/20 border border-orange-500/30 rounded-lg text-sm text-orange-400 hover:bg-orange-500/30 transition-all"
            >
              ⬇ Download cs2_glow_esp.py
            </a>
          </div>

          {/* C++ */}
          <div className="bg-[#12121a] border border-gray-800/50 rounded-xl p-6 hover:border-orange-500/30 transition-colors">
            <div className="flex items-center gap-3 mb-4">
              <div className="text-3xl">⚡</div>
              <div>
                <h2 className="text-lg font-bold text-white">C++ Version</h2>
                <p className="text-xs text-gray-500">Native performance</p>
              </div>
            </div>
            <ul className="text-xs text-gray-400 space-y-1 mb-4">
              <li>✓ Compiles to standalone .exe</li>
              <li>✓ Minimal overhead</li>
              <li>✓ Uses Win32 API directly</li>
              <li>✓ ~140 lines of code</li>
            </ul>
            <a
              href="/cs2_glow_esp.cpp"
              download
              className="block w-full text-center px-4 py-3 bg-orange-500/20 border border-orange-500/30 rounded-lg text-sm text-orange-400 hover:bg-orange-500/30 transition-all"
            >
              ⬇ Download cs2_glow_esp.cpp
            </a>
          </div>
        </div>

        {/* How to use */}
        <div className="bg-[#12121a] border border-gray-800/50 rounded-xl p-6 mb-6">
          <h2 className="text-lg font-bold text-white mb-4">How to use</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-orange-400 mb-2">Python:</h3>
              <div className="text-xs text-gray-400 space-y-1">
                <p>1. Download <code className="text-orange-400 bg-black/30 px-1.5 py-0.5 rounded">cs2_glow_esp.py</code></p>
                <p>2. Launch CS2</p>
                <p>3. Open Command Prompt <span className="text-white">as Administrator</span></p>
                <p>4. Run: <code className="text-orange-400 bg-black/30 px-1.5 py-0.5 rounded">python cs2_glow_esp.py</code></p>
                <p>5. Press <span className="text-white">INSERT</span> to stop</p>
              </div>
            </div>

            <div className="border-t border-gray-800/50 pt-4">
              <h3 className="text-sm font-semibold text-orange-400 mb-2">C++:</h3>
              <div className="text-xs text-gray-400 space-y-1">
                <p>1. Download <code className="text-orange-400 bg-black/30 px-1.5 py-0.5 rounded">cs2_glow_esp.cpp</code></p>
                <p>2. Compile: <code className="text-orange-400 bg-black/30 px-1.5 py-0.5 rounded">g++ -o esp.exe cs2_glow_esp.cpp -luser32 -lpsapi</code></p>
                <p>3. Or with MSVC: <code className="text-orange-400 bg-black/30 px-1.5 py-0.5 rounded">cl cs2_glow_esp.cpp user32.lib psapi.lib</code></p>
                <p>4. Launch CS2</p>
                <p>5. Run <span className="text-white">esp.exe as Administrator</span></p>
                <p>6. Press <span className="text-white">INSERT</span> to stop</p>
              </div>
            </div>
          </div>
        </div>

        {/* Customize */}
        <div className="bg-[#12121a] border border-orange-500/20 rounded-xl p-6 mb-6">
          <h2 className="text-lg font-bold text-orange-400 mb-3">Customize</h2>
          <p className="text-xs text-gray-400 mb-3">
            Edit the config section at the top of the file to change:
          </p>
          <ul className="text-xs text-gray-400 space-y-2">
            <li className="flex items-start gap-2">
              <code className="text-white bg-black/30 px-1.5 py-0.5 rounded whitespace-nowrap">GLOW_COLOR</code>
              <span>— RGB + Alpha (0.0–1.0). Default: orange (1.0, 0.4, 0.0, 0.8)</span>
            </li>
            <li className="flex items-start gap-2">
              <code className="text-white bg-black/30 px-1.5 py-0.5 rounded whitespace-nowrap">SKIP_TEAMMATES</code>
              <span>— Only highlight enemies (default: true)</span>
            </li>
            <li className="flex items-start gap-2">
              <code className="text-white bg-black/30 px-1.5 py-0.5 rounded whitespace-nowrap">MAX_DISTANCE</code>
              <span>— Ignore players further than this in game units (default: 500)</span>
            </li>
          </ul>
        </div>

        {/* How it works */}
        <div className="bg-[#12121a] border border-gray-800/50 rounded-xl p-6 mb-6">
          <h2 className="text-lg font-bold text-white mb-3">How it works</h2>
          <div className="text-xs text-gray-400 space-y-2">
            <p>1. Attaches to CS2 process and reads <code className="text-orange-400">client.dll</code> base address</p>
            <p>2. Reads <code className="text-orange-400">dwEntityList</code> to get the entity list pointer</p>
            <p>3. Iterates through entities (players) in the list</p>
            <p>4. For each enemy player within range:</p>
            <ul className="ml-4 space-y-1 text-gray-500">
              <li>• Writes to <code className="text-orange-400">m_entitySpottedState + m_spottedByMask</code> to force "spotted" state</li>
              <li>• Writes glow color (R, G, B, A) to the spotted state glow offset</li>
            </ul>
            <p>5. Loops at ~60 FPS until you press INSERT</p>
          </div>
        </div>

        {/* Offsets */}
        <div className="bg-[#12121a] border border-gray-800/50 rounded-xl p-6 mb-6">
          <h2 className="text-lg font-bold text-white mb-3">Offsets used</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs font-mono">
            <div className="flex justify-between">
              <span className="text-gray-500">dwEntityList:</span>
              <span className="text-orange-400">0x2716028</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">dwLocalPlayerPawn:</span>
              <span className="text-orange-400">0x2561698</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">dwViewMatrix:</span>
              <span className="text-orange-400">0x2567910</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">dwGlowManager:</span>
              <span className="text-orange-400">0x255D560</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">dwGameEntitySystem:</span>
              <span className="text-orange-400">0x2716028</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">highestEntityIndex:</span>
              <span className="text-orange-400">0x2120</span>
            </div>
          </div>
        </div>

        {/* Warning */}
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-center">
          <p className="text-xs text-red-400">
            ⚠️ For educational purposes only. Use at your own risk. External cheats can still be detected.
          </p>
        </div>
      </div>
    </div>
  );
}
