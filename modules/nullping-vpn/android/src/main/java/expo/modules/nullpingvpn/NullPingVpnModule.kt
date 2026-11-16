package expo.modules.nullpingvpn

import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class NullPingVpnModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("NullPingVpn")

    AsyncFunction("getStatus") {
      // Native bridge availability is not evidence of an active VPN tunnel.
      "DISCONNECTED"
    }

    AsyncFunction("getCapabilities") {
      mapOf(
        "platform" to "android",
        "vpnPermissionSupported" to false,
        "vpnServiceImplemented" to false,
        "xrayCoreIntegrated" to false,
      )
    }
  }
}
