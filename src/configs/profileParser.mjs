const MAX_INPUT_LENGTH = 1024 * 1024;

function decodeBase64Utf8(value) {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/').replace(/\s/g, '');
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=');
  const binary = atob(padded);
  const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

function safeDecodeBase64(value) {
  try {
    return decodeBase64Utf8(value);
  } catch {
    return null;
  }
}

function decodeSubscriptionBody(value) {
  const trimmed = value.trim();
  if (!trimmed) return '';
  if (/^(?:vless|vmess|trojan|ss|socks|http):\/\//im.test(trimmed)) return trimmed;
  const decoded = safeDecodeBase64(trimmed);
  if (decoded && /(?:vless|vmess|trojan|ss|socks|http):\/\//i.test(decoded)) return decoded;
  return trimmed;
}

function decodeVmess(uri) {
  const payload = uri.slice('vmess://'.length).split(/[?#]/, 1)[0];
  const jsonText = safeDecodeBase64(payload);
  if (!jsonText) throw new Error('لینک VMess معتبر نیست یا Base64 آن قابل‌خواندن نیست.');
  let config;
  try {
    config = JSON.parse(jsonText);
  } catch {
    throw new Error('ساختار اطلاعات VMess معتبر نیست.');
  }
  const server = String(config.add ?? config.address ?? '').trim();
  const port = Number(config.port);
  const id = String(config.id ?? '').trim();
  if (!server || !Number.isInteger(port) || port < 1 || port > 65535 || !id) {
    throw new Error('اطلاعات ضروری VMess (آدرس، پورت یا شناسه) ناقص است.');
  }
  return {
    protocol: 'VMess',
    name: String(config.ps ?? config.remarks ?? server).trim() || server,
    server,
    port,
    raw: uri,
  };
}

function decodeShadowsocks(uri) {
  const withoutScheme = uri.slice('ss://'.length);
  const [mainPart, fragment = ''] = withoutScheme.split('#', 2);
  let authority = mainPart.split(/[/?]/, 1)[0] ?? '';
  if (!authority.includes('@')) {
    const decoded = safeDecodeBase64(authority);
    if (decoded) authority = decoded;
  }
  const at = authority.lastIndexOf('@');
  if (at < 0) throw new Error('فرمت لینک Shadowsocks پشتیبانی نمی‌شود.');
  const endpoint = authority.slice(at + 1);
  const match = endpoint.match(/^\[?([a-zA-Z0-9.:_-]+)\]?:([0-9]{1,5})$/);
  if (!match) throw new Error('آدرس یا پورت Shadowsocks معتبر نیست.');
  const port = Number(match[2]);
  if (port < 1 || port > 65535) throw new Error('پورت Shadowsocks خارج از محدوده است.');
  return {
    protocol: 'Shadowsocks',
    name: fragment ? decodeURIComponent(fragment) : match[1],
    server: match[1],
    port,
    raw: uri,
  };
}

export function parseProxyUri(input) {
  const uri = input.trim();
  if (!uri || uri.length > 16384) throw new Error('لینک خالی یا بیش از حد طولانی است.');
  const scheme = uri.slice(0, uri.indexOf('://')).toLowerCase();
  if (scheme === 'vmess') return decodeVmess(uri);
  if (scheme === 'ss') return decodeShadowsocks(uri);
  if (!['vless', 'trojan', 'socks', 'http'].includes(scheme)) {
    throw new Error('این نوع لینک هنوز پشتیبانی نمی‌شود.');
  }
  let parsed;
  try {
    parsed = new URL(uri);
  } catch {
    throw new Error('ساختار لینک سرور معتبر نیست.');
  }
  const server = parsed.hostname.replace(/^\[|\]$/g, '');
  const port = Number(parsed.port);
  if (!server || !Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error('آدرس سرور یا پورت در لینک ناقص است.');
  }
  const protocol = scheme === 'vless' ? 'VLESS' : scheme === 'trojan' ? 'Trojan' : scheme.toUpperCase();
  const name = parsed.hash ? decodeURIComponent(parsed.hash.slice(1)) : server;
  return { protocol, name: name || server, server, port, raw: uri };
}

export function parseConfigInput(input) {
  if (typeof input !== 'string' || input.length > MAX_INPUT_LENGTH) {
    throw new Error('متن ورودی خالی یا بیش از حد بزرگ است.');
  }
  const body = decodeSubscriptionBody(input);
  const lines = body.split(/[\r\n]+/).map((line) => line.trim()).filter(Boolean);
  const results = [];
  const errors = [];
  for (const line of lines) {
    if (!/^(vless|vmess|trojan|ss|socks|http):\/\//i.test(line)) continue;
    try {
      results.push(parseProxyUri(line));
    } catch (error) {
      errors.push(error instanceof Error ? error.message : 'خطای ناشناخته در خواندن کانفیگ');
    }
  }
  const unique = new Map();
  for (const item of results) unique.set(item.raw, item);
  return { profiles: [...unique.values()], errors };
}
