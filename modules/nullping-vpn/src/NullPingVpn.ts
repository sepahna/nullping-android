import { requireNativeModule } from 'expo-modules-core';

export type VpnConnectionStatus =
  | 'DISCONNECTED'
  | 'CONNECTING'
  | 'CONNECTED'
  | 'RECONNECTING'
  | 'DISCONNECTING'
  | 'ERROR';

export type VpnCapabilities = {
  platform: 'android';
  vpnPermissionSupported: boolean;
  vpnServiceImplemented: boolean;
  xrayCoreIntegrated: boolean;
};

type NativeNullPingVpn = {
  getStatus(): Promise<string>;
  getCapabilities(): Promise<VpnCapabilities>;
  startVpn(config: string): Promise<string>;
  stopVpn(): Promise<string>;
  measureDelay(url: string): Promise<number>;
};

const nativeModule = requireNativeModule<NativeNullPingVpn>('NullPingVpn');
const knownStatuses = new Set<VpnConnectionStatus>([
  'DISCONNECTED',
  'CONNECTING',
  'CONNECTED',
  'RECONNECTING',
  'DISCONNECTING',
  'ERROR',
]);

/** Returns a validated status from the native bridge. */
export async function getVpnStatus(): Promise<VpnConnectionStatus> {
  const status = await nativeModule.getStatus();
  if (!knownStatuses.has(status as VpnConnectionStatus)) {
    throw new Error(`Unknown VPN status returned by native module: ${status}`);
  }
  return status as VpnConnectionStatus;
}

/** Describes implemented native features; false values are intentional until shipped. */
export function getVpnCapabilities(): Promise<VpnCapabilities> {
  return nativeModule.getCapabilities();
}

/** Starts the Android VPN service with a validated proxy URI. */
export async function startVpn(config: string): Promise<VpnConnectionStatus> {
  const status = await nativeModule.startVpn(config);
  if (!knownStatuses.has(status as VpnConnectionStatus)) {
    throw new Error(`Unknown VPN status returned by native module: ${status}`);
  }
  return status as VpnConnectionStatus;
}

/** Requests the Android VPN service to stop. */
export async function stopVpn(): Promise<VpnConnectionStatus> {
  const status = await nativeModule.stopVpn();
  if (!knownStatuses.has(status as VpnConnectionStatus)) {
    throw new Error(`Unknown VPN status returned by native module: ${status}`);
  }
  return status as VpnConnectionStatus;
}

/** Measures HTTP reachability through the running Xray outbound. */
export function measureVpnDelay(url = 'https://www.gstatic.com/generate_204'): Promise<number> {
  return nativeModule.measureDelay(url);
}
