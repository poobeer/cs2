import { useState } from 'react';
import { ESPConfig, offsets } from '../types';

interface Props {
  config: ESPConfig;
}

export default function CodeOutput({ config }: Props) {
  const [language, setLanguage] = useState<'cpp' | 'csharp'>('cpp');
  const [copied, setCopied] = useState(false);

  const clientOffsets = Object.fromEntries(
    offsets.find(g => g.dll === 'client.dll')!.offsets.map(o => [o.name, o.hex])
  );
  const engineOffsets = Object.fromEntries(
    offsets.find(g => g.dll === 'engine2.dll')!.offsets.map(o => [o.name, o.hex])
  );

  const code = language === 'cpp' ? generateCPP(config, clientOffsets, engineOffsets) : generateCSharp(config, clientOffsets, engineOffsets);

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white">Generated Source Code</h2>
          <p className="text-xs text-gray-500">External ESP implementation based on your configuration</p>
        </div>
        <div className="flex gap-2">
          <div className="flex bg-[#12121a] rounded-lg border border-gray-800/50 p-0.5">
            <button
              onClick={() => setLanguage('cpp')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                language === 'cpp' ? 'bg-orange-500/20 text-orange-400' : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              C++
            </button>
            <button
              onClick={() => setLanguage('csharp')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                language === 'csharp' ? 'bg-orange-500/20 text-orange-400' : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              C#
            </button>
          </div>
          <button
            onClick={copyCode}
            className="px-4 py-2 bg-orange-500/20 border border-orange-500/30 rounded-lg text-sm text-orange-400 hover:bg-orange-500/30 transition-colors"
          >
            {copied ? '✓ Copied!' : '📋 Copy Code'}
          </button>
        </div>
      </div>

      {/* Code Block */}
      <div className="bg-[#0d0d15] border border-gray-800/50 rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2 bg-[#12121a] border-b border-gray-800/50">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-green-500/80" />
          </div>
          <span className="text-xs text-gray-500 font-mono">
            esp_external.{language === 'cpp' ? 'cpp' : 'cs'}
          </span>
        </div>
        <pre className="p-4 overflow-x-auto text-xs leading-relaxed max-h-[70vh] overflow-y-auto">
          <code className="text-gray-300 font-mono whitespace-pre">{code}</code>
        </pre>
      </div>

      {/* Build Instructions */}
      <div className="bg-[#12121a] border border-gray-800/50 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-white mb-3">📦 Build Instructions</h3>
        <div className="space-y-2 text-xs text-gray-400">
          {language === 'cpp' ? (
            <>
              <p>1. Install Visual Studio 2022 with C++ desktop development workload</p>
              <p>2. Create a new Console Application (x64)</p>
              <p>3. Replace main.cpp with the generated code above</p>
              <p>4. Link against: <code className="text-orange-400">user32.lib</code></p>
              <p>5. Build in Release x64 mode</p>
              <p>6. Run CS2 first, then run this tool as Administrator</p>
            </>
          ) : (
            <>
              <p>1. Install .NET 8 SDK</p>
              <p>2. Create new Console project: <code className="text-orange-400">dotnet new console -n ESPTool</code></p>
              <p>3. Replace Program.cs with the generated code above</p>
              <p>4. Add NuGet: <code className="text-orange-400">dotnet add package Memory</code></p>
              <p>5. Build: <code className="text-orange-400">dotnet publish -c Release -r win-x64</code></p>
              <p>6. Run CS2 first, then run the tool as Administrator</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function hexToRGBA(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r}, ${g}, ${b}, ${Math.round(alpha * 255)}`;
}

function generateCPP(config: ESPConfig, client: Record<string, string>, engine: Record<string, string>): string {
  return `// CS2 External ESP - Player Highlight Tool
// Generated with ESP Configurator
// Compile: cl /EHsc esp_external.cpp user32.lib

#include <windows.h>
#include <iostream>
#include <vector>
#include <cmath>

// ============================================
// OFFSETS (auto-generated from configurator)
// ============================================
namespace offsets {
    // client.dll
    constexpr uintptr_t dwEntityList          = ${client.dwEntityList};
    constexpr uintptr_t dwLocalPlayerPawn     = ${client.dwLocalPlayerPawn};
    constexpr uintptr_t dwViewMatrix          = ${client.dwViewMatrix};
    constexpr uintptr_t dwGlowManager         = ${client.dwGlowManager};
    constexpr uintptr_t dwGameEntitySystem    = ${client.dwGameEntitySystem};
    constexpr uintptr_t dwGameEntitySystem_highestEntityIndex = ${client.dwGameEntitySystem_highestEntityIndex};

    // engine2.dll
    constexpr uintptr_t dwBuildNumber         = ${engine.dwBuildNumber};

    // Entity offsets (schema)
    constexpr uintptr_t m_iHealth             = 0x344;
    constexpr uintptr_t m_iTeamNum            = 0x3E3;
    constexpr uintptr_t m_lifeState           = 0x847;
    constexpr uintptr_t m_pGameSceneNode      = 0x328;
    constexpr uintptr_t m_modelState          = 0x170;
    constexpr uintptr_t m_vecAbsOrigin        = 0xC8;
    constexpr uintptr_t m_glowColorProperty   = 0x200;  // CCollisionProperty + glow offset
    constexpr uintptr_t m_bGlowing            = 0x248;  // Glow property
    constexpr uintptr_t m_entitySpottedState  = 0x2418;
    constexpr uintptr_t m_spottedByMask       = 0x2430;
}

// ============================================
// CONFIG (from configurator)
// ============================================
namespace cfg {
    // Glow Settings
    constexpr bool    glowEnabled    = ${config.glowEnabled};
    constexpr uint8_t glowR          = ${parseInt(config.glowColor.slice(1, 3), 16)};
    constexpr uint8_t glowG          = ${parseInt(config.glowColor.slice(3, 5), 16)};
    constexpr uint8_t glowB          = ${parseInt(config.glowColor.slice(5, 7), 16)};
    constexpr float   glowAlpha      = ${config.glowAlpha}f;
    constexpr int     glowStyle      = ${config.glowRadius};  // 0-3

    // Box ESP
    constexpr bool    boxEnabled     = ${config.boxEnabled};
    constexpr uint8_t boxR           = ${parseInt(config.boxColor.slice(1, 3), 16)};
    constexpr uint8_t boxG           = ${parseInt(config.boxColor.slice(3, 5), 16)};
    constexpr uint8_t boxB           = ${parseInt(config.boxColor.slice(5, 7), 16)};

    // Filters
    constexpr bool    teamCheck      = ${config.teamCheck};
    constexpr bool    visibleOnly    = ${config.visibleOnly};
    constexpr float   maxDistance     = ${config.maxDistance}f;
}

// ============================================
// MEMORY UTILS
// ============================================
class Memory {
    HANDLE hProcess;
    uintptr_t clientBase;
    uintptr_t engineBase;

public:
    bool Init() {
        HWND hwnd = FindWindowA("SDL_app", nullptr);
        if (!hwnd) { std::cout << "[!] CS2 window not found\\n"; return false; }

        DWORD pid;
        GetWindowThreadProcessId(hwnd, &pid);
        hProcess = OpenProcess(PROCESS_ALL_ACCESS, FALSE, pid);
        if (!hProcess) { std::cout << "[!] Failed to open process\\n"; return false; }

        // Get module bases
        clientBase = GetModuleBase(pid, "client.dll");
        engineBase = GetModuleBase(pid, "engine2.dll");

        std::cout << "[+] client.dll @ 0x" << std::hex << clientBase << std::endl;
        std::cout << "[+] engine2.dll @ 0x" << std::hex << engineBase << std::endl;
        return true;
    }

    template<typename T>
    T Read(uintptr_t addr) {
        T buffer;
        ReadProcessMemory(hProcess, (LPCVOID)addr, &buffer, sizeof(T), nullptr);
        return buffer;
    }

    template<typename T>
    void Write(uintptr_t addr, T value) {
        WriteProcessMemory(hProcess, (LPVOID)addr, &value, sizeof(T), nullptr);
    }

    uintptr_t GetClient() { return clientBase; }
    uintptr_t GetEngine() { return engineBase; }

private:
    uintptr_t GetModuleBase(DWORD pid, const char* modName) {
        HANDLE snap = CreateToolhelp32Snapshot(TH32CS_SNAPMODULE, pid);
        MODULEENTRY32 mod;
        mod.dwSize = sizeof(mod);
        if (Module32First(snap, &mod)) {
            do {
                if (!_stricmp(mod.szModule, modName)) {
                    CloseHandle(snap);
                    return (uintptr_t)mod.modBaseAddr;
                }
            } while (Module32Next(snap, &mod));
        }
        CloseHandle(snap);
        return 0;
    }
};

// ============================================
// ESP LOGIC
// ============================================
struct Vec3 { float x, y, z; };

float GetDistance(Vec3 a, Vec3 b) {
    float dx = a.x - b.x, dy = a.y - b.y, dz = a.z - b.z;
    return sqrtf(dx*dx + dy*dy + dz*dz);
}

void ApplyGlowESP(Memory& mem) {
    uintptr_t client = mem.GetClient();

    // Read entity list
    uintptr_t entityList = mem.Read<uintptr_t>(client + offsets::dwEntityList);
    if (!entityList) return;

    // Read local player pawn
    uintptr_t localPawn = mem.Read<uintptr_t>(client + offsets::dwLocalPlayerPawn);
    if (!localPawn) return;

    int localTeam = mem.Read<int>(localPawn + offsets::m_iTeamNum);
    Vec3 localPos = mem.Read<Vec3>(localPawn + offsets::m_vecAbsOrigin);

    // Get highest entity index
    int highestIndex = mem.Read<int>(client + offsets::dwGameEntitySystem + offsets::dwGameEntitySystem_highestEntityIndex);

    // Iterate entities
    for (int i = 1; i < highestIndex && i <= 64; i++) {
        // Entity list structure: list_entry = entityList + (8 * (i & 0x7FFF) + 16) * ...
        uintptr_t listEntry = mem.Read<uintptr_t>(entityList + (0x8 * (i >> 9) + 0x10));
        if (!listEntry) continue;

        uintptr_t entity = mem.Read<uintptr_t>(listEntry + 0x78 * (i & 0x1FF));
        if (!entity) continue;

        // Check if it's a player pawn (CCSPlayerPawn)
        int health = mem.Read<int>(entity + offsets::m_iHealth);
        if (health <= 0 || health > 100) continue;

        // Life state check (0 = alive)
        int lifeState = mem.Read<int>(entity + offsets::m_lifeState);
        if (lifeState != 0) continue;

        int team = mem.Read<int>(entity + offsets::m_iTeamNum);

        // Team filter
        if (cfg::teamCheck && team == localTeam) continue;

        // Distance filter
        Vec3 entityPos = mem.Read<Vec3>(entity + offsets::m_vecAbsOrigin);
        float dist = GetDistance(localPos, entityPos);
        if (dist > cfg::maxDistance) continue;

        // === APPLY GLOW ===
        if (cfg::glowEnabled) {
            // Method 1: Entity glow color property
            mem.Write<uint8_t>(entity + offsets::m_glowColorProperty, cfg::glowR);
            mem.Write<uint8_t>(entity + offsets::m_glowColorProperty + 1, cfg::glowG);
            mem.Write<uint8_t>(entity + offsets::m_glowColorProperty + 2, cfg::glowB);
            mem.Write<float>(entity + offsets::m_glowColorProperty + 4, cfg::glowAlpha);

            // Enable glow
            mem.Write<bool>(entity + offsets::m_bGlowing, true);

            // Spotted state (for glow through walls)
            if (!cfg::visibleOnly) {
                uint32_t spottedMask = mem.Read<uint32_t>(entity + offsets::m_entitySpottedState + offsets::m_spottedByMask);
                spottedMask |= (1 << 0);  // Set bit for local player
                mem.Write<uint32_t>(entity + offsets::m_entitySpottedState + offsets::m_spottedByMask, spottedMask);
            }
        }
    }
}

// ============================================
// MAIN LOOP
// ============================================
int main() {
    SetConsoleTitleA("CS2 External ESP");
    std::cout << "============================\\n";
    std::cout << "  CS2 External ESP Tool\\n";
    std::cout << "============================\\n\\n";

    Memory mem;
    if (!mem.Init()) {
        std::cout << "Press any key to exit...\\n";
        std::cin.get();
        return 1;
    }

    std::cout << "[+] ESP Initialized successfully!\\n";
    std::cout << "[+] Glow: " << (cfg::glowEnabled ? "ON" : "OFF") << "\\n";
    std::cout << "[+] Box: " << (cfg::boxEnabled ? "ON" : "OFF") << "\\n";
    std::cout << "[+] Team Check: " << (cfg::teamCheck ? "ON" : "OFF") << "\\n";
    std::cout << "[+] Max Distance: " << cfg::maxDistance << "\\n\\n";
    std::cout << "[*] Running... Press INSERT to exit\\n";

    while (true) {
        if (GetAsyncKeyState(VK_INSERT) & 1) break;

        ApplyGlowESP(mem);
        Sleep(16); // ~60 FPS update rate
    }

    std::cout << "[-] Exiting...\\n";
    return 0;
}
`;
}

function generateCSharp(config: ESPConfig, client: Record<string, string>, engine: Record<string, string>): string {
  return `// CS2 External ESP - Player Highlight Tool (C#)
// Generated with ESP Configurator
// Requires: Memory.dll NuGet package

using System;
using System.Diagnostics;
using System.Numerics;
using System.Threading;
using Memory;

namespace CS2ExternalESP
{
    // ============================================
    // OFFSETS (auto-generated from configurator)
    // ============================================
    static class Offsets
    {
        // client.dll
        public const ulong dwEntityList          = ${client.dwEntityList};
        public const ulong dwLocalPlayerPawn     = ${client.dwLocalPlayerPawn};
        public const ulong dwViewMatrix          = ${client.dwViewMatrix};
        public const ulong dwGlowManager         = ${client.dwGlowManager};
        public const ulong dwGameEntitySystem    = ${client.dwGameEntitySystem};
        public const ulong dwGameEntitySystem_highestEntityIndex = ${client.dwGameEntitySystem_highestEntityIndex};

        // engine2.dll
        public const ulong dwBuildNumber         = ${engine.dwBuildNumber};

        // Entity schema offsets
        public const int m_iHealth             = 0x344;
        public const int m_iTeamNum            = 0x3E3;
        public const int m_lifeState           = 0x847;
        public const int m_pGameSceneNode      = 0x328;
        public const int m_vecAbsOrigin        = 0xC8;
        public const int m_glowColorProperty   = 0x200;
        public const int m_bGlowing            = 0x248;
        public const int m_entitySpottedState  = 0x2418;
        public const int m_spottedByMask       = 0x2430;
    }

    // ============================================
    // CONFIG (from configurator)
    // ============================================
    static class Config
    {
        // Glow
        public const bool GlowEnabled    = ${config.glowEnabled};
        public const byte GlowR          = ${parseInt(config.glowColor.slice(1, 3), 16)};
        public const byte GlowG          = ${parseInt(config.glowColor.slice(3, 5), 16)};
        public const byte GlowB          = ${parseInt(config.glowColor.slice(5, 7), 16)};
        public const float GlowAlpha     = ${config.glowAlpha}f;
        public const int GlowStyle       = ${config.glowRadius};

        // Box
        public const bool BoxEnabled     = ${config.boxEnabled};

        // Filters
        public const bool TeamCheck      = ${config.teamCheck};
        public const bool VisibleOnly    = ${config.visibleOnly};
        public const float MaxDistance    = ${config.maxDistance}f;
    }

    // ============================================
    // ESP IMPLEMENTATION
    // ============================================
    class ESP
    {
        private Mem _m = new Mem();
        private int _pid;
        private IntPtr _clientBase;
        private IntPtr _engineBase;

        public bool Initialize()
        {
            var procs = Process.GetProcessesByName("cs2");
            if (procs.Length == 0)
            {
                Console.WriteLine("[!] CS2 not running");
                return false;
            }

            _pid = procs[0].Id;
            _m.OpenProcess(_pid);

            _clientBase = (IntPtr)_m.GetModuleAddress("client.dll");
            _engineBase = (IntPtr)_m.GetModuleAddress("engine2.dll");

            Console.WriteLine($"[+] client.dll @ 0x{_clientBase:X}");
            Console.WriteLine($"[+] engine2.dll @ 0x{_engineBase:X}");
            return true;
        }

        public void RunLoop()
        {
            Console.WriteLine("[*] ESP Running... Press END to exit");

            while (!Console.KeyAvailable || Console.ReadKey(true).Key != ConsoleKey.End)
            {
                try
                {
                    ApplyGlow();
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"[!] Error: {ex.Message}");
                }

                Thread.Sleep(16); // ~60 FPS
            }
        }

        private void ApplyGlow()
        {
            if (!Config.GlowEnabled) return;

            ulong client = (ulong)_clientBase;

            // Read entity list
            ulong entityList = _m.ReadMemory<ulong>($"client.dll+0x{Offsets.dwEntityList:X}");
            if (entityList == 0) return;

            // Read local player pawn
            ulong localPawn = _m.ReadMemory<ulong>($"client.dll+0x{Offsets.dwLocalPlayerPawn:X}");
            if (localPawn == 0) return;

            int localTeam = _m.ReadMemory<int>($"0x{localPawn + (ulong)Offsets.m_iTeamNum:X}");
            var localPos = ReadVec3(localPawn + (ulong)Offsets.m_vecAbsOrigin);

            int highestIndex = _m.ReadMemory<int>($"client.dll+0x{Offsets.dwGameEntitySystem + (ulong)Offsets.dwGameEntitySystem_highestEntityIndex:X}");

            for (int i = 1; i < highestIndex && i <= 64; i++)
            {
                // Navigate entity list structure
                ulong listEntry = _m.ReadMemory<ulong>($"0x{entityList + (ulong)(0x8 * (i >> 9) + 0x10):X}");
                if (listEntry == 0) continue;

                ulong entity = _m.ReadMemory<ulong>($"0x{listEntry + (ulong)(0x78 * (i & 0x1FF)):X}");
                if (entity == 0) continue;

                // Validate entity
                int health = _m.ReadMemory<int>($"0x{entity + (ulong)Offsets.m_iHealth:X}");
                if (health <= 0 || health > 100) continue;

                int lifeState = _m.ReadMemory<int>($"0x{entity + (ulong)Offsets.m_lifeState:X}");
                if (lifeState != 0) continue;

                int team = _m.ReadMemory<int>($"0x{entity + (ulong)Offsets.m_iTeamNum:X}");

                // Team filter
                if (Config.TeamCheck && team == localTeam) continue;

                // Distance filter
                var entityPos = ReadVec3(entity + (ulong)Offsets.m_vecAbsOrigin);
                float dist = Vector3.Distance(localPos, entityPos);
                if (dist > Config.MaxDistance) continue;

                // Apply glow color
                _m.WriteMemory($"0x{entity + (ulong)Offsets.m_glowColorProperty:X}", "byte", Config.GlowR.ToString());
                _m.WriteMemory($"0x{entity + (ulong)Offsets.m_glowColorProperty + 1:X}", "byte", Config.GlowG.ToString());
                _m.WriteMemory($"0x{entity + (ulong)Offsets.m_glowColorProperty + 2:X}", "byte", Config.GlowB.ToString());
                _m.WriteMemory($"0x{entity + (ulong)Offsets.m_glowColorProperty + 4:X}", "float", Config.GlowAlpha.ToString());

                // Enable glowing
                _m.WriteMemory($"0x{entity + (ulong)Offsets.m_bGlowing:X}", "byte", "1");

                // Spotted by mask (for wallhack glow)
                if (!Config.VisibleOnly)
                {
                    uint mask = _m.ReadMemory<uint>($"0x{entity + (ulong)Offsets.m_entitySpottedState + (ulong)Offsets.m_spottedByMask:X}");
                    mask |= (1u << 0);
                    _m.WriteMemory($"0x{entity + (ulong)Offsets.m_entitySpottedState + (ulong)Offsets.m_spottedByMask:X}", "int", mask.ToString());
                }
            }
        }

        private Vector3 ReadVec3(ulong addr)
        {
            float x = _m.ReadMemory<float>($"0x{addr:X}");
            float y = _m.ReadMemory<float>($"0x{addr + 4:X}");
            float z = _m.ReadMemory<float>($"0x{addr + 8:X}");
            return new Vector3(x, y, z);
        }
    }

    // ============================================
    // ENTRY POINT
    // ============================================
    class Program
    {
        static void Main(string[] args)
        {
            Console.Title = "CS2 External ESP";
            Console.WriteLine("============================");
            Console.WriteLine("  CS2 External ESP Tool");
            Console.WriteLine("============================\\n");

            var esp = new ESP();
            if (!esp.Initialize())
            {
                Console.WriteLine("Press any key to exit...");
                Console.ReadKey();
                return;
            }

            Console.WriteLine($"[+] Glow: {(Config.GlowEnabled ? "ON" : "OFF")}");
            Console.WriteLine($"[+] Team Check: {(Config.TeamCheck ? "ON" : "OFF")}");
            Console.WriteLine($"[+] Max Distance: {Config.MaxDistance}\\n");

            esp.RunLoop();
        }
    }
}
`;
}
