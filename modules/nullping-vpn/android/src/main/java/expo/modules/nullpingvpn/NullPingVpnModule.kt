package expo.modules.nullpingvpn

import android.content.Intent
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class NullPingVpnModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("NullPingVpn")

    AsyncFunction("getStatus") {
      NullPingVpnService.currentStatus()
    }

    AsyncFunction("getCapabilities") {
      mapOf(
        "platform" to "android",
        "vpnPermissionSupported" to true,
        "vpnServiceImplemented" to true,
        "xrayCoreIntegrated" to true,
      )
    }

    AsyncFunction("startVpn") { rawConfig: String ->
      val context = appContext.currentActivity ?: appContext.applicationContext
      val config = XrayConfigBuilder.fromUri(rawConfig)
      val intent = Intent(context, VpnPermissionActivity::class.java)
        .putExtra(VpnPermissionActivity.EXTRA_CONFIG, config)
      context.startActivity(intent)
      "CONNECTING"
    }

    AsyncFunction("stopVpn") {
      val context = appContext.currentActivity ?: appContext.applicationContext
      val intent = Intent(context, NullPingVpnService::class.java)
        .setAction(NullPingVpnService.ACTION_STOP)
      context.startService(intent)
      "DISCONNECTING"
    }
  }
}
