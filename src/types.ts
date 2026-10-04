export interface ESPConfig {
  glowEnabled: boolean;
  glowColor: string;
  glowAlpha: number;
  glowRadius: number;
  boxEnabled: boolean;
  boxColor: string;
  boxType: '2d' | '3d' | 'corner';
  skeletonEnabled: boolean;
  skeletonColor: string;
  healthBarEnabled: boolean;
  nameTagEnabled: boolean;
  weaponTagEnabled: boolean;
  distanceEnabled: boolean;
  teamCheck: boolean;
  visibleOnly: boolean;
  maxDistance: number;
  smoothFactor: number;
}

export const defaultConfig: ESPConfig = {
  glowEnabled: true,
  glowColor: '#ff6600',
  glowAlpha: 0.8,
  glowRadius: 3,
  boxEnabled: true,
  boxColor: '#00ff00',
  boxType: 'corner',
  skeletonEnabled: false,
  skeletonColor: '#ffffff',
  healthBarEnabled: true,
  nameTagEnabled: true,
  weaponTagEnabled: true,
  distanceEnabled: true,
  teamCheck: true,
  visibleOnly: false,
  maxDistance: 500,
  smoothFactor: 5,
};

export interface OffsetEntry {
  name: string;
  value: number;
  hex: string;
}

export interface OffsetGroup {
  dll: string;
  offsets: OffsetEntry[];
}

export const offsets: OffsetGroup[] = [
  {
    dll: 'client.dll',
    offsets: [
      { name: 'dwCSGOInput', value: 39280992, hex: '0x2577160' },
      { name: 'dwEntityList', value: 40982568, hex: '0x2716028' },
      { name: 'dwGameEntitySystem', value: 40982568, hex: '0x2716028' },
      { name: 'dwGameEntitySystem_highestEntityIndex', value: 8480, hex: '0x2120' },
      { name: 'dwGameRules', value: 39177808, hex: '0x255D550' },
      { name: 'dwGlobalVars', value: 35831448, hex: '0x222C698' },
      { name: 'dwGlowManager', value: 39177824, hex: '0x255D560' },
      { name: 'dwLocalPlayerController', value: 39026696, hex: '0x2539008' },
      { name: 'dwLocalPlayerPawn', value: 39192216, hex: '0x2561698' },
      { name: 'dwPlantedC4', value: 38570192, hex: '0x24C6BD0' },
      { name: 'dwPrediction', value: 39191968, hex: '0x25615A0' },
      { name: 'dwSensitivity', value: 39180696, hex: '0x255E998' },
      { name: 'dwSensitivity_sensitivity', value: 88, hex: '0x58' },
      { name: 'dwViewAngles', value: 39282664, hex: '0x25777E8' },
      { name: 'dwViewMatrix', value: 39217424, hex: '0x2567910' },
      { name: 'dwViewRender', value: 39214368, hex: '0x2566D20' },
      { name: 'dwWeaponC4', value: 38554256, hex: '0x24C2DF0' },
    ],
  },
  {
    dll: 'engine2.dll',
    offsets: [
      { name: 'dwBuildNumber', value: 6410216, hex: '0x61D0E8' },
      { name: 'dwNetworkGameClient', value: 9547712, hex: '0x91B0C0' },
      { name: 'dwNetworkGameClient_clientTickCount', value: 920, hex: '0x398' },
      { name: 'dwNetworkGameClient_deltaTick', value: 588, hex: '0x24C' },
      { name: 'dwNetworkGameClient_isBackgroundMap', value: 2888767, hex: '0x2C143F' },
      { name: 'dwNetworkGameClient_localPlayer', value: 248, hex: '0xF8' },
      { name: 'dwNetworkGameClient_maxClients', value: 576, hex: '0x240' },
      { name: 'dwNetworkGameClient_serverTickCount', value: 588, hex: '0x24C' },
      { name: 'dwNetworkGameClient_signOnState', value: 560, hex: '0x230' },
      { name: 'dwWindowHeight', value: 9564980, hex: '0x91F334' },
      { name: 'dwWindowWidth', value: 9564976, hex: '0x91F330' },
    ],
  },
  {
    dll: 'inputsystem.dll',
    offsets: [
      { name: 'dwInputSystem', value: 289728, hex: '0x46B40' },
    ],
  },
  {
    dll: 'matchmaking.dll',
    offsets: [
      { name: 'dwGameTypes', value: 1773520, hex: '0x1B0FD0' },
    ],
  },
  {
    dll: 'soundsystem.dll',
    offsets: [
      { name: 'dwSoundSystem', value: 5460816, hex: '0x535450' },
      { name: 'dwSoundSystem_engineViewData', value: 108, hex: '0x6C' },
    ],
  },
];
