// ================================================
// CS2 External Glow ESP - Player Highlight Tool
// Compile: g++ -o esp.exe esp.cpp -luser32 -lpsapi
// Or:      cl /EHsc esp.cpp user32.lib psapi.lib
// Run as Administrator while CS2 is running
// Press INSERT to exit
// ================================================

#include <windows.h>
#include <psapi.h>
#include <tlhelp32.h>
#include <iostream>
#include <cstdint>
#include <cmath>

// ---- OFFSETS ----
namespace off {
    constexpr uintptr_t dwEntityList                    = 0x2716028;
    constexpr uintptr_t dwLocalPlayerPawn               = 0x2561698;
    constexpr uintptr_t dwViewMatrix                    = 0x2567910;
    constexpr uintptr_t dwGlowManager                   = 0x255D560;
    constexpr uintptr_t dwGameEntitySystem              = 0x2716028;
    constexpr uintptr_t dwGameEntitySystem_highestIndex = 0x2120;

    // Schema offsets for CCSPlayerPawn
    constexpr int m_iHealth            = 0x344;
    constexpr int m_iTeamNum           = 0x3E3;
    constexpr int m_lifeState          = 0x847;
    constexpr int m_vecAbsOrigin       = 0xC8;
    constexpr int m_pGameSceneNode     = 0x328;
    constexpr int m_entitySpottedState = 0x2418;
    constexpr int m_spottedByMask      = 0x2438;
}

// =============================================
// CONFIG - EDIT THESE TO CUSTOMIZE YOUR GLOW
// =============================================
namespace cfg {
    constexpr float glowColor[4]  = {1.0f, 0.4f, 0.0f, 0.8f}; // R, G, B, A (orange)
    constexpr bool  skipTeammates = true;
    constexpr float maxDistance    = 500.0f;
}

// ---- MEMORY ----
struct Vec3 { float x, y, z; };

class Mem {
    HANDLE hProc;
public:
    uintptr_t client = 0, engine = 0;

    bool Attach() {
        HWND hwnd = FindWindowA("SDL_app", nullptr);
        if (!hwnd) return false;

        DWORD pid = 0;
        GetWindowThreadProcessId(hwnd, &pid);
        hProc = OpenProcess(PROCESS_ALL_ACCESS, FALSE, pid);
        if (!hProc) return false;

        HANDLE snap = CreateToolhelp32Snapshot(TH32CS_SNAPMODULE | TH32CS_SNAPMODULE32, pid);
        MODULEENTRY32 me;
        me.dwSize = sizeof(me);
        if (Module32First(snap, &me)) {
            do {
                if (!_stricmp(me.szModule, "client.dll"))  client = (uintptr_t)me.modBaseAddr;
                if (!_stricmp(me.szModule, "engine2.dll")) engine = (uintptr_t)me.modBaseAddr;
            } while (Module32Next(snap, &me));
        }
        CloseHandle(snap);
        return client && engine;
    }

    template<typename T>
    T Read(uintptr_t addr) {
        T buf{};
        ReadProcessMemory(hProc, (LPCVOID)addr, &buf, sizeof(T), nullptr);
        return buf;
    }

    template<typename T>
    void Write(uintptr_t addr, const T& val) {
        WriteProcessMemory(hProc, (LPVOID)addr, &val, sizeof(T), nullptr);
    }
};

float Distance(Vec3 a, Vec3 b) {
    float dx = a.x - b.x, dy = a.y - b.y, dz = a.z - b.z;
    return sqrtf(dx*dx + dy*dy + dz*dz);
}

// ---- GLOW ESP ----
void RunGlowESP(Mem& mem) {
    uintptr_t entityList = mem.Read<uintptr_t>(mem.client + off::dwEntityList);
    uintptr_t localPawn  = mem.Read<uintptr_t>(mem.client + off::dwLocalPlayerPawn);
    if (!entityList || !localPawn) return;

    int localTeam = mem.Read<int>(localPawn + off::m_iTeamNum);
    Vec3 localPos = mem.Read<Vec3>(localPawn + off::m_vecAbsOrigin);

    int highest = mem.Read<int>(mem.client + off::dwGameEntitySystem + off::dwGameEntitySystem_highestIndex);
    if (highest <= 0 || highest > 512) highest = 64;

    for (int i = 1; i <= highest; i++) {
        // Entity list: listEntry = entityList + 0x10 + 0x8 * (i >> 9)
        // Entity ptr:  listEntry + 0x78 * (i & 0x1FF)
        uintptr_t listEntry = mem.Read<uintptr_t>(entityList + 0x10 + 0x8 * (i >> 9));
        if (!listEntry) continue;

        uintptr_t pawn = mem.Read<uintptr_t>(listEntry + 0x78 * (i & 0x1FF));
        if (!pawn) continue;

        // Validate: alive player
        int health = mem.Read<int>(pawn + off::m_iHealth);
        if (health <= 0 || health > 100) continue;

        int lifeState = mem.Read<int>(pawn + off::m_lifeState);
        if (lifeState != 0) continue;

        int team = mem.Read<int>(pawn + off::m_iTeamNum);
        if (cfg::skipTeammates && team == localTeam) continue;

        // Distance check
        Vec3 pos = mem.Read<Vec3>(pawn + off::m_vecAbsOrigin);
        if (Distance(localPos, pos) > cfg::maxDistance) continue;

        // ---- APPLY GLOW ----
        // Set spottedByMask so entity glows through walls
        uint32_t mask = mem.Read<uint32_t>(pawn + off::m_entitySpottedState + off::m_spottedByMask);
        mask |= 1; // spotted by local player (bit 0)
        mem.Write<uint32_t>(pawn + off::m_entitySpottedState + off::m_spottedByMask, mask);

        // Write glow color (4 floats: R, G, B, A)
        uintptr_t base = pawn + off::m_entitySpottedState + 0x8;
        mem.Write<float>(base + 0,  cfg::glowColor[0]); // R
        mem.Write<float>(base + 4,  cfg::glowColor[1]); // G
        mem.Write<float>(base + 8,  cfg::glowColor[2]); // B
        mem.Write<float>(base + 12, cfg::glowColor[3]); // A
    }
}

// ---- MAIN ----
int main() {
    SetConsoleTitleA("CS2 External Glow ESP");

    std::cout << "================================\n";
    std::cout << "  CS2 External Glow ESP\n";
    std::cout << "  Highlights enemy players\n";
    std::cout << "================================\n\n";

    Mem mem;
    if (!mem.Attach()) {
        std::cout << "[!] Failed to attach. Make sure CS2 is running.\n";
        std::cout << "[!] Run as Administrator.\n";
        std::cin.get();
        return 1;
    }

    std::cout << "[+] Attached to CS2\n";
    std::cout << "[+] client.dll : 0x" << std::hex << mem.client << std::dec << "\n";
    std::cout << "[+] engine2.dll: 0x" << std::hex << mem.engine  << std::dec << "\n";
    std::cout << "[+] Glow color : R=" << cfg::glowColor[0]
              << " G=" << cfg::glowColor[1]
              << " B=" << cfg::glowColor[2] << "\n";
    std::cout << "[+] Max dist   : " << cfg::maxDistance << " units\n\n";
    std::cout << "[*] Running... Press INSERT to exit\n";

    while (!(GetAsyncKeyState(VK_INSERT) & 1)) {
        RunGlowESP(mem);
        Sleep(16); // ~60 updates/sec
    }

    std::cout << "[-] Exiting.\n";
    return 0;
}
