package expo.modules.nullpingvpn

import android.net.Uri
import android.util.Base64
import org.json.JSONArray
import org.json.JSONObject
import java.nio.charset.StandardCharsets

internal object XrayConfigBuilder {
  fun fromUri(rawValue: String): String {
    val raw = rawValue.trim()
    require(raw.isNotEmpty() && raw.length <= 16_384) { "Invalid or oversized proxy URI" }
    val scheme = raw.substringBefore("://", "").lowercase()
    val uri = Uri.parse(raw)

    val (protocol, settings, transport) = when (scheme) {
      "vless" -> buildVless(uri)
      "vmess" -> buildVmess(raw)
      "trojan" -> buildTrojan(uri)
      "ss" -> buildShadowsocks(raw)
      "socks" -> buildSimpleProxy(uri, "socks")
      "http" -> buildSimpleProxy(uri, "http")
      else -> throw IllegalArgumentException("Unsupported proxy scheme: $scheme")
    }

    val outbound = JSONObject()
      .put("tag", "proxy")
      .put("protocol", protocol)
      .put("settings", settings)
    if (transport != null) outbound.put("streamSettings", transport)

    val inbounds = JSONArray().put(
      JSONObject()
        .put("tag", "tun")
        .put("port", 0)
        .put("protocol", "tun")
        .put("settings", JSONObject()
          .put("name", "nullping0")
          .put("mtu", 1500))
        .put("sniffing", JSONObject()
          .put("enabled", true)
          .put("destOverride", JSONArray().put("http").put("tls").put("quic")))
    )

    val outbounds = JSONArray()
      .put(outbound)
      .put(JSONObject().put("tag", "direct").put("protocol", "freedom"))
      .put(JSONObject().put("tag", "block").put("protocol", "blackhole"))

    return JSONObject()
      .put("log", JSONObject().put("loglevel", "warning"))
      .put("inbounds", inbounds)
      .put("outbounds", outbounds)
      .put("routing", JSONObject().put("domainStrategy", "AsIs").put("rules", JSONArray()))
      .put("dns", JSONObject().put("servers", JSONArray().put("1.1.1.1").put("1.0.0.1")))
      .toString()
  }

  private fun buildVless(uri: Uri): Triple<String, JSONObject, JSONObject> {
    val server = uri.host ?: throw IllegalArgumentException("VLESS host is missing")
    val port = uri.port
    require(port in 1..65_535) { "VLESS port is invalid" }
    val id = uri.userInfo?.substringBefore(':')?.takeIf { it.isNotBlank() }
      ?: throw IllegalArgumentException("VLESS UUID is missing")
    val user = JSONObject().put("id", id).put("encryption", uri.getQueryParameter("encryption") ?: "none")
    uri.getQueryParameter("flow")?.takeIf { it.isNotBlank() }?.let { user.put("flow", it) }
    val settings = JSONObject().put("vnext", JSONArray().put(
      JSONObject().put("address", server).put("port", port).put("users", JSONArray().put(user))
    ))
    return Triple("vless", settings, buildStreamSettings(uri))
  }

  private fun buildVmess(raw: String): Triple<String, JSONObject, JSONObject> {
    val encoded = raw.removePrefix("vmess://").substringBefore('#').substringBefore('?')
    val json = JSONObject(decodeBase64(encoded))
    val server = json.optString("add")
    val port = json.optInt("port")
    val id = json.optString("id")
    require(server.isNotBlank() && port in 1..65_535 && id.isNotBlank()) { "VMess profile is incomplete" }
    val user = JSONObject()
      .put("id", id)
      .put("alterId", json.optInt("aid", 0))
      .put("security", json.optString("scy").ifBlank { "auto" })
    val settings = JSONObject().put("vnext", JSONArray().put(
      JSONObject().put("address", server).put("port", port).put("users", JSONArray().put(user))
    ))
    val query = Uri.parse("https://nullping.invalid/?type=${json.optString("net")}&security=${if (json.optString("tls") == "tls") "tls" else "none"}&sni=${Uri.encode(json.optString("sni"))}&fp=${Uri.encode(json.optString("fp"))}&host=${Uri.encode(json.optString("host"))}&path=${Uri.encode(json.optString("path"))}")
    val stream = buildStreamSettings(query, json.optString("net").ifBlank { "tcp" })
    return Triple("vmess", settings, stream)
  }

  private fun buildTrojan(uri: Uri): Triple<String, JSONObject, JSONObject> {
    val server = uri.host ?: throw IllegalArgumentException("Trojan host is missing")
    val port = uri.port
    require(port in 1..65_535) { "Trojan port is invalid" }
    val password = uri.userInfo?.takeIf { it.isNotBlank() }
      ?: throw IllegalArgumentException("Trojan password is missing")
    val settings = JSONObject().put("servers", JSONArray().put(
      JSONObject().put("address", server).put("port", port).put("password", password)
    ))
    return Triple("trojan", settings, buildStreamSettings(uri))
  }

  private fun buildShadowsocks(raw: String): Triple<String, JSONObject, JSONObject> {
    val body = raw.removePrefix("ss://").substringBefore('#').substringBefore('?')
    var credentials: String
    var endpoint: String
    if (body.contains('@')) {
      credentials = body.substringBeforeLast('@')
      endpoint = body.substringAfterLast('@')
      credentials = runCatching { decodeBase64(credentials) }.getOrDefault(credentials)
    } else {
      val decoded = decodeBase64(body)
      credentials = decoded.substringBeforeLast('@')
      endpoint = decoded.substringAfterLast('@')
    }
    val separator = credentials.indexOf(':')
    require(separator > 0 && separator < credentials.lastIndex) { "Shadowsocks method or password is missing" }
    val method = credentials.substring(0, separator)
    val password = credentials.substring(separator + 1)
    val endpointUri = Uri.parse("https://$endpoint")
    val server = endpointUri.host ?: throw IllegalArgumentException("Shadowsocks host is missing")
    val port = endpointUri.port
    require(port in 1..65_535) { "Shadowsocks port is invalid" }
    val settings = JSONObject().put("servers", JSONArray().put(
      JSONObject().put("address", server).put("port", port).put("method", method).put("password", password)
    ))
    return Triple("shadowsocks", settings, JSONObject())
  }

  private fun buildSimpleProxy(uri: Uri, protocol: String): Triple<String, JSONObject, JSONObject> {
    val server = uri.host ?: throw IllegalArgumentException("$protocol host is missing")
    val port = uri.port
    require(port in 1..65_535) { "$protocol port is invalid" }
    val users = JSONArray()
    val userInfo = uri.userInfo
    if (!userInfo.isNullOrBlank()) {
      val separator = userInfo.indexOf(':')
      if (separator > 0) {
        users.put(JSONObject().put("user", userInfo.substring(0, separator)).put("pass", userInfo.substring(separator + 1)))
      }
    }
    val serverConfig = JSONObject().put("address", server).put("port", port)
    if (users.length() > 0) serverConfig.put("users", users)
    return Triple(protocol, JSONObject().put("servers", JSONArray().put(serverConfig)), JSONObject())
  }
  private fun buildStreamSettings(uri: Uri, forcedNetwork: String? = null): JSONObject {
    val network = (forcedNetwork ?: uri.getQueryParameter("type") ?: "tcp").lowercase()
    val security = (uri.getQueryParameter("security") ?: "none").lowercase()
    val stream = JSONObject().put("network", network).put("security", security)

    when (network) {
      "ws" -> {
        val headers = JSONObject()
        uri.getQueryParameter("host")?.takeIf { it.isNotBlank() }?.let { headers.put("Host", it) }
        stream.put("wsSettings", JSONObject()
          .put("path", uri.getQueryParameter("path") ?: "/")
          .put("headers", headers))
      }
      "http", "h2" -> stream.put("httpSettings", JSONObject()
        .put("path", uri.getQueryParameter("path") ?: "/")
        .put("host", JSONArray(listOf(uri.getQueryParameter("host") ?: ""))))
      "grpc" -> stream.put("grpcSettings", JSONObject()
        .put("serviceName", uri.getQueryParameter("serviceName") ?: uri.getQueryParameter("service-name") ?: "")
        .put("multiMode", uri.getQueryParameter("mode") == "multi"))
      "httpupgrade" -> stream.put("httpupgradeSettings", JSONObject()
        .put("path", uri.getQueryParameter("path") ?: "/")
        .put("host", uri.getQueryParameter("host") ?: ""))
      "xhttp" -> stream.put("xhttpSettings", JSONObject()
        .put("path", uri.getQueryParameter("path") ?: "/")
        .put("host", uri.getQueryParameter("host") ?: "")
        .put("mode", uri.getQueryParameter("mode") ?: "auto"))
      "tcp" -> {
        val headerType = uri.getQueryParameter("headerType")
        if (!headerType.isNullOrBlank() && headerType != "none") {
          stream.put("tcpSettings", JSONObject().put("header", JSONObject().put("type", headerType)))
        }
      }
    }

    when (security) {
      "tls" -> {
        val tls = JSONObject().put("allowInsecure", uri.getQueryParameter("allowInsecure") == "1")
        uri.getQueryParameter("sni")?.takeIf { it.isNotBlank() }?.let { tls.put("serverName", it) }
        uri.getQueryParameter("fp")?.takeIf { it.isNotBlank() }?.let { tls.put("fingerprint", it) }
        uri.getQueryParameter("alpn")?.takeIf { it.isNotBlank() }?.let {
          tls.put("alpn", JSONArray(it.split(',').map(String::trim)))
        }
        stream.put("tlsSettings", tls)
      }
      "reality" -> {
        val reality = JSONObject().put("show", false)
        uri.getQueryParameter("sni")?.takeIf { it.isNotBlank() }?.let { reality.put("serverName", it) }
        uri.getQueryParameter("fp")?.takeIf { it.isNotBlank() }?.let { reality.put("fingerprint", it) }
        uri.getQueryParameter("pbk")?.takeIf { it.isNotBlank() }?.let { reality.put("publicKey", it) }
        uri.getQueryParameter("sid")?.takeIf { it.isNotBlank() }?.let { reality.put("shortId", it) }
        uri.getQueryParameter("spx")?.takeIf { it.isNotBlank() }?.let { reality.put("spiderX", it) }
        stream.put("realitySettings", reality)
      }
    }
    return stream
  }

  private fun decodeBase64(value: String): String {
    val clean = value.replace('-', '+').replace('_', '/').replace("\\s".toRegex(), "")
    val padded = clean.padEnd(((clean.length + 3) / 4) * 4, '=')
    val bytes = Base64.decode(padded, Base64.DEFAULT)
    return String(bytes, StandardCharsets.UTF_8)
  }
}
