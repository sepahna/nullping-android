import test from 'node:test';
import assert from 'node:assert/strict';
import { parseConfigInput, parseProxyUri } from '../src/configs/profileParser.mjs';

test('parses VLESS URI', () => {
  const item = parseProxyUri('vless://123e4567-e89b-12d3-a456-426614174000@example.com:443?encryption=none#Frankfurt');
  assert.equal(item.protocol, 'VLESS');
  assert.equal(item.server, 'example.com');
  assert.equal(item.port, 443);
  assert.equal(item.name, 'Frankfurt');
});

test('parses Trojan URI', () => {
  const item = parseProxyUri('trojan://secret@example.org:8443#NL');
  assert.equal(item.protocol, 'Trojan');
  assert.equal(item.port, 8443);
});

test('parses VMess base64 JSON', () => {
  const payload = btoa(JSON.stringify({ v: '2', ps: 'VMess DE', add: 'de.example.net', port: '2053', id: 'uuid' }));
  const item = parseProxyUri(`vmess://${payload}`);
  assert.equal(item.protocol, 'VMess');
  assert.equal(item.server, 'de.example.net');
  assert.equal(item.port, 2053);
});

test('parses subscription body containing multiple links and removes duplicates', () => {
  const line = 'vless://uuid@one.example:443#one';
  const parsed = parseConfigInput(`${line}\n${line}\ntrojan://pw@two.example:443#two`);
  assert.equal(parsed.profiles.length, 2);
});

test('decodes base64 subscription payload', () => {
  const content = 'vless://uuid@node.example:443#node';
  const parsed = parseConfigInput(btoa(content));
  assert.equal(parsed.profiles.length, 1);
  assert.equal(parsed.profiles[0].server, 'node.example');
});

test('rejects unsupported URI schemes', () => {
  assert.throws(() => parseProxyUri('wireguard://example.com:51820'), /پشتیبانی/);
});
