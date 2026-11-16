export type ProxyProtocol = 'VLESS' | 'VMess' | 'Trojan' | 'Shadowsocks' | 'SOCKS' | 'HTTP';
export type ParsedProxyProfile = {
  protocol: ProxyProtocol;
  name: string;
  server: string;
  port: number;
  raw: string;
};
export function parseProxyUri(input: string): ParsedProxyProfile;
export function parseConfigInput(input: string): {
  profiles: ParsedProxyProfile[];
  errors: string[];
};
