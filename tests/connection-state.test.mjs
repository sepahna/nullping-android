import test from 'node:test';
import assert from 'node:assert/strict';

const allowedStates = new Set([
  'DISCONNECTED', 'CONNECTING', 'CONNECTED',
  'RECONNECTING', 'DISCONNECTING', 'ERROR',
]);

test('connection lifecycle vocabulary contains six explicit states', () => {
  assert.equal(allowedStates.size, 6);
  assert.equal(allowedStates.has('CONNECTED'), true);
  assert.equal(allowedStates.has('DISCONNECTED'), true);
});

test('unknown states are not accepted', () => {
  assert.equal(allowedStates.has('ONLINE'), false);
  assert.equal(allowedStates.has('READY'), false);
});
