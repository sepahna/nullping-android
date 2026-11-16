package expo.modules.nullpingvpn

import android.app.Activity
import android.content.Intent
import android.net.VpnService
import android.os.Build
import android.os.Bundle
import androidx.core.content.ContextCompat

class VpnPermissionActivity : Activity() {
  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    val permissionIntent = VpnService.prepare(this)
    if (permissionIntent == null) {
      startTunnelService()
    } else {
      @Suppress("DEPRECATION")
      startActivityForResult(permissionIntent, REQUEST_VPN_PERMISSION)
    }
  }

  @Deprecated("Deprecated by Android; retained for compatibility with VpnService.prepare flow")
  override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
    super.onActivityResult(requestCode, resultCode, data)
    if (requestCode == REQUEST_VPN_PERMISSION && resultCode == RESULT_OK) {
      startTunnelService()
    } else {
      NullPingVpnService.updateStatus("DISCONNECTED")
      finish()
    }
  }

  private fun startTunnelService() {
    val config = intent.getStringExtra(EXTRA_CONFIG)
    if (config.isNullOrBlank()) {
      NullPingVpnService.updateStatus("ERROR")
      finish()
      return
    }
    val serviceIntent = Intent(this, NullPingVpnService::class.java)
      .setAction(NullPingVpnService.ACTION_START)
      .putExtra(EXTRA_CONFIG, config)
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
      ContextCompat.startForegroundService(this, serviceIntent)
    } else {
      startService(serviceIntent)
    }
    finish()
  }

  companion object {
    const val EXTRA_CONFIG = "expo.modules.nullpingvpn.CONFIG"
    private const val REQUEST_VPN_PERMISSION = 701
  }
}
