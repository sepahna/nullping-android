package expo.modules.nullpingvpn

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.content.Intent
import android.net.VpnService
import android.os.Build
import android.os.ParcelFileDescriptor
import androidx.core.app.NotificationCompat
import go.Seq
import libv2ray.CoreCallbackHandler
import libv2ray.CoreController
import libv2ray.Libv2ray

class NullPingVpnService : VpnService() {
  private var vpnInterface: ParcelFileDescriptor? = null
  private var core: CoreController? = null

  override fun onCreate() {
    super.onCreate()
    createNotificationChannel()
  }

  override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
    if (intent?.action == ACTION_STOP) {
      stopTunnel()
      stopSelf()
      return START_NOT_STICKY
    }
    val config = intent?.getStringExtra(VpnPermissionActivity.EXTRA_CONFIG)
    if (config.isNullOrBlank()) {
      updateStatus("ERROR")
      stopSelf()
      return START_NOT_STICKY
    }
    updateStatus("CONNECTING")
    startForeground(NOTIFICATION_ID, buildNotification("در حال برقراری اتصال"))
    Thread({ startTunnel(config) }, "NullPing-Xray-Start").start()
    return START_NOT_STICKY
  }

  private fun startTunnel(config: String) {
    try {
      val builder = Builder()
        .setSession("Null Ping")
        .setMtu(1500)
        .addAddress("10.88.0.1", 30)
        .addAddress("fd00:88::1", 126)
        .addRoute("0.0.0.0", 0)
        .addRoute("::", 0)
        .addDnsServer("1.1.1.1")
        .addDnsServer("1.0.0.1")
      runCatching { builder.addDisallowedApplication(packageName) }
      vpnInterface = builder.establish() ?: error("Android did not establish the VPN interface")

      Seq.setContext(applicationContext)
      Libv2ray.initCoreEnv(filesDir.absolutePath, "nullping-xray")
      val callback = object : CoreCallbackHandler {
        override fun startup(): Long = 0
        override fun shutdown(): Long = 0
        override fun onEmitStatus(level: Long, message: String?): Long = 0
      }
      core = Libv2ray.newCoreController(callback)
      core?.startLoop(config, vpnInterface!!.fd)
      activeController = core
      if (core?.isRunning != true) error("Xray core did not enter running state")
      updateStatus("CONNECTED")
      updateNotification("اتصال برقرار است")
    } catch (error: Throwable) {
      updateStatus("ERROR")
      updateNotification("خطا در اتصال: ${error.message ?: "نامشخص"}")
      runCatching { core?.stopLoop() }
      core = null
      activeController = null
      runCatching { vpnInterface?.close() }
      vpnInterface = null
      stopSelf()
    }
  }

  private fun stopTunnel() {
    updateStatus("DISCONNECTING")
    runCatching { core?.stopLoop() }
    core = null
    activeController = null
    runCatching { vpnInterface?.close() }
    vpnInterface = null
    updateStatus("DISCONNECTED")
    stopForeground(STOP_FOREGROUND_REMOVE)
  }

  override fun onRevoke() {
    stopTunnel()
    stopSelf()
    super.onRevoke()
  }

  override fun onDestroy() {
    if (core != null || vpnInterface != null) stopTunnel()
    super.onDestroy()
  }

  private fun createNotificationChannel() {
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
      val channel = NotificationChannel(CHANNEL_ID, "Null Ping VPN", NotificationManager.IMPORTANCE_LOW)
      getSystemService(NotificationManager::class.java).createNotificationChannel(channel)
    }
  }

  private fun buildNotification(content: String): Notification =
    NotificationCompat.Builder(this, CHANNEL_ID)
      .setSmallIcon(android.R.drawable.stat_sys_upload_done)
      .setContentTitle("Null Ping")
      .setContentText(content)
      .setOngoing(true)
      .setOnlyAlertOnce(true)
      .build()

  private fun updateNotification(content: String) {
    getSystemService(NotificationManager::class.java).notify(NOTIFICATION_ID, buildNotification(content))
  }

  companion object {
    const val ACTION_STOP = "expo.modules.nullpingvpn.STOP"
    private const val CHANNEL_ID = "nullping-vpn"
    private const val NOTIFICATION_ID = 7812

    @Volatile private var connectionStatus = "DISCONNECTED"
    @Volatile private var activeController: CoreController? = null

    fun currentStatus(): String = connectionStatus

    fun measureDelay(url: String): Long {
      val controller = activeController ?: throw IllegalStateException("VPN core is not running")
      return controller.measureDelay(url)
    }
    fun updateStatus(value: String) { connectionStatus = value }
  }
}
