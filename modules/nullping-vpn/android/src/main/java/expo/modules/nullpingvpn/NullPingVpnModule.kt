package expo.modules.nullpingvpn

import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class NullPingVpnModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("NullPingVpn")

    AsyncFunction("getStatus") {
      // This only proves the native module is available.
      // It does not mean a VPN tunnel is running.
      "DISCONNECTED"
    }
  }
}
