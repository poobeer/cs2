# ================================================
# CS2 External Glow ESP - Player Highlight Tool
# No extra packages needed (uses ctypes only)
# Run as Administrator while CS2 is running
# Press INSERT to exit
# ================================================

import ctypes
import ctypes.wintypes as wt
import time
import sys
import struct

# ---- OFFSETS (client.dll) ----
OFF = {
    'dwEntityList':                    0x2716028,
    'dwLocalPlayerPawn':               0x2561698,
    'dwViewMatrix':                    0x2567910,
    'dwGlowManager':                   0x255D560,
    'dwGameEntitySystem':              0x2716028,
    'dwGameEntitySystem_highestIndex': 0x2120,
}

# ---- SCHEMA OFFSETS (CCSPlayerPawn) ----
SCHEMA = {
    'm_iHealth':            0x344,
    'm_iTeamNum':           0x3E3,
    'm_lifeState':          0x847,
    'm_vecAbsOrigin':       0xC8,
    'm_pGameSceneNode':     0x328,
    'm_entitySpottedState': 0x2418,
    'm_spottedByMask':      0x2438,
}

# =============================================
# CONFIG - EDIT THESE TO CUSTOMIZE YOUR GLOW
# =============================================
GLOW_COLOR = (1.0, 0.4, 0.0, 0.8)  # R, G, B, A  (orange)
SKIP_TEAMMATES = True
MAX_DISTANCE = 500.0  # game units


# ---- MEMORY READER ----
class Mem:
    def __init__(self):
        self.hProc = None
        self.client = 0
        self.engine = 0

    def attach(self):
        hwnd = ctypes.windll.user32.FindWindowA(b"SDL_app", None)
        if not hwnd:
            return False

        pid = wt.DWORD()
        ctypes.windll.user32.GetWindowThreadProcessId(hwnd, ctypes.byref(pid))

        self.hProc = ctypes.windll.kernel32.OpenProcess(
            0x1F0FFF, False, pid.value
        )
        if not self.hProc:
            return False

        # Get module bases
        TH32CS_SNAPMODULE = 0x00000008
        snap = ctypes.windll.kernel32.CreateToolhelp32Snapshot(TH32CS_SNAPMODULE, pid.value)

        class MODULEENTRY32(ctypes.Structure):
            _fields_ = [
                ("dwSize", wt.DWORD),
                ("th32ModuleID", wt.DWORD),
                ("th32ProcessID", wt.DWORD),
                ("GlblcntUsage", ctypes.c_ulong),
                ("ProccntUsage", ctypes.c_ulong),
                ("modBaseAddr", ctypes.POINTER(ctypes.c_byte)),
                ("modBaseSize", wt.DWORD),
                ("hModule", wt.HMODULE),
                ("szModule", ctypes.c_char * 256),
                ("szExePath", ctypes.c_char * 260),
            ]

        me = MODULEENTRY32()
        me.dwSize = ctypes.sizeof(MODULEENTRY32)

        if ctypes.windll.kernel32.Module32First(snap, ctypes.byref(me)):
            while True:
                name = me.szModule.decode('utf-8', errors='ignore').lower()
                if name == 'client.dll':
                    self.client = ctypes.cast(me.modBaseAddr, ctypes.c_void_p).value
                elif name == 'engine2.dll':
                    self.engine = ctypes.cast(me.modBaseAddr, ctypes.c_void_p).value
                if not ctypes.windll.kernel32.Module32Next(snap, ctypes.byref(me)):
                    break

        ctypes.windll.kernel32.CloseHandle(snap)
        return bool(self.client and self.engine)

    def read(self, addr, size=8):
        buf = ctypes.create_string_buffer(size)
        bytes_read = ctypes.c_size_t()
        ctypes.windll.kernel32.ReadProcessMemory(
            self.hProc, ctypes.c_void_p(addr), buf, size, ctypes.byref(bytes_read)
        )
        return buf.raw

    def read_int(self, addr):
        return struct.unpack('<i', self.read(addr, 4))[0]

    def read_uint(self, addr):
        return struct.unpack('<I', self.read(addr, 4))[0]

    def read_float(self, addr):
        return struct.unpack('<f', self.read(addr, 4))[0]

    def read_ptr(self, addr):
        return struct.unpack('<Q', self.read(addr, 8))[0]

    def read_vec3(self, addr):
        raw = self.read(addr, 12)
        return struct.unpack('<fff', raw)

    def write(self, addr, data):
        buf = ctypes.create_string_buffer(data)
        size = len(data)
        bytes_written = ctypes.c_size_t()
        ctypes.windll.kernel32.WriteProcessMemory(
            self.hProc, ctypes.c_void_p(addr), buf, size, ctypes.byref(bytes_written)
        )

    def write_float(self, addr, value):
        self.write(addr, struct.pack('<f', value))

    def write_uint(self, addr, value):
        self.write(addr, struct.pack('<I', value))


def distance(a, b):
    return ((a[0]-b[0])**2 + (a[1]-b[1])**2 + (a[2]-b[2])**2) ** 0.5


def run_glow_esp(mem):
    entity_list = mem.read_ptr(mem.client + OFF['dwEntityList'])
    local_pawn  = mem.read_ptr(mem.client + OFF['dwLocalPlayerPawn'])
    if not entity_list or not local_pawn:
        return

    local_team = mem.read_int(local_pawn + SCHEMA['m_iTeamNum'])
    local_pos  = mem.read_vec3(local_pawn + SCHEMA['m_vecAbsOrigin'])

    highest = mem.read_int(mem.client + OFF['dwGameEntitySystem'] + OFF['dwGameEntitySystem_highestIndex'])
    if highest <= 0 or highest > 512:
        highest = 64

    for i in range(1, highest + 1):
        list_entry = mem.read_ptr(entity_list + 0x10 + 0x8 * (i >> 9))
        if not list_entry:
            continue

        pawn = mem.read_ptr(list_entry + 0x78 * (i & 0x1FF))
        if not pawn:
            continue

        # Validate: alive player
        health = mem.read_int(pawn + SCHEMA['m_iHealth'])
        if health <= 0 or health > 100:
            continue

        life_state = mem.read_int(pawn + SCHEMA['m_lifeState'])
        if life_state != 0:
            continue

        team = mem.read_int(pawn + SCHEMA['m_iTeamNum'])
        if SKIP_TEAMMATES and team == local_team:
            continue

        # Distance check
        pos = mem.read_vec3(pawn + SCHEMA['m_vecAbsOrigin'])
        if distance(local_pos, pos) > MAX_DISTANCE:
            continue

        # ---- APPLY GLOW ----
        # Set spottedByMask so entity glows through walls
        mask = mem.read_uint(pawn + SCHEMA['m_entitySpottedState'] + SCHEMA['m_spottedByMask'])
        mask |= 1  # spotted by local player
        mem.write_uint(pawn + SCHEMA['m_entitySpottedState'] + SCHEMA['m_spottedByMask'], mask)

        # Write glow color (4 floats: R, G, B, A)
        base = pawn + SCHEMA['m_entitySpottedState'] + 0x8
        mem.write_float(base + 0,  GLOW_COLOR[0])  # R
        mem.write_float(base + 4,  GLOW_COLOR[1])  # G
        mem.write_float(base + 8,  GLOW_COLOR[2])  # B
        mem.write_float(base + 12, GLOW_COLOR[3])  # A


def main():
    print("================================")
    print("  CS2 External Glow ESP")
    print("  Highlights enemy players")
    print("================================")
    print()

    mem = Mem()
    if not mem.attach():
        print("[!] Failed to attach to CS2.")
        print("[!] Make sure CS2 is running and run as Administrator.")
        input("Press Enter to exit...")
        sys.exit(1)

    print(f"[+] Attached to CS2")
    print(f"[+] client.dll  : 0x{mem.client:X}")
    print(f"[+] engine2.dll : 0x{mem.engine:X}")
    print(f"[+] Glow color  : R={GLOW_COLOR[0]} G={GLOW_COLOR[1]} B={GLOW_COLOR[2]}")
    print(f"[+] Max distance: {MAX_DISTANCE} units")
    print()
    print("[*] Running... Press INSERT key to exit")

    try:
        while True:
            if ctypes.windll.user32.GetAsyncKeyState(0x2D) & 1:
                break
            run_glow_esp(mem)
            time.sleep(0.016)  # ~60 updates/sec
    except KeyboardInterrupt:
        pass

    print("[-] Exiting.")


if __name__ == '__main__':
    main()
