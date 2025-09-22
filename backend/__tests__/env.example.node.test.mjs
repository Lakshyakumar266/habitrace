/**
 * Test framework: Node's built-in test runner (node:test)
 * Purpose: Validate schema and sample values in backend/.env.example when no other test framework is detected.
 */

import { describe, test } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';

function parseEnv(text) {
  const map = new Map();
  const duplicates = [];
  const lines = text.split('\n');
  for (let i = 0; i < lines.length; i++) {
    let raw = lines[i];
    let line = raw.trim();
    if (!line || line.startsWith('#')) continue;
    if (line.startsWith('export ')) line = line.slice(7).trim();
    const m = line.match(/^([A-Za-z_][A-Za-z0-9_]*) *= *(.*)$/);
    if (!m) continue;
    const key = m[1];
    let value = m[2].trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    } else {
      const hash = value.indexOf('#');
      if (hash >= 0) value = value.slice(0, hash).trim();
    }
    if (map.has(key)) duplicates.push(key);
    map.set(key, value);
  }
  return { env: Object.fromEntries(map), duplicates };
}

describe('backend/.env.example schema', () => {
  const ENV_PATH = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..', '.env.example');
  const content = fs.readFileSync(ENV_PATH, 'utf8');
  const data = parseEnv(content);

  test('file exists and readable', () => {
    assert.ok(fs.existsSync(ENV_PATH));
  });

  test('contains required keys with non-empty values', () => {
    const required = ['DATABASE_URL','DB_NAME','DB_USER','DB_PASSWORD','DB_PORT','PORT','SECRET_KEY'];
    for (const key of required) {
      assert.ok(Object.prototype.hasOwnProperty.call(data.env, key), `missing ${key}`);
      assert.ok(String(data.env[key] ?? '').length > 0, `empty value for ${key}`);
    }
  });

  test('no duplicate keys', () => {
    assert.strictEqual(data.duplicates.length, 0);
  });

  test('DATABASE_URL format and consistency', () => {
    const url = data.env.DATABASE_URL;
    assert.ok(url.startsWith('postgresql://'));
    const re = /^postgresql:\/\/([^:\/]+):([^@]+)@([^:\/]+):(\d{2,5})\/(.+)$/;
    const m = url.match(re);
    assert.ok(m, 'DATABASE_URL failed expected format');
    if (m) {
      const [, user, pass, host, port, name] = m;
      assert.strictEqual(user, data.env.DB_USER);
      assert.strictEqual(pass, data.env.DB_PASSWORD);
      assert.strictEqual(host, 'localhost'); // based on example; adjust if template changes
      assert.strictEqual(port, String(data.env.DB_PORT));
      assert.strictEqual(name, data.env.DB_NAME);
    }
  });

  test('PORT and DB_PORT are within valid range', () => {
    const appPort = Number(data.env.PORT);
    const dbPort = Number(data.env.DB_PORT);
    assert.ok(Number.isInteger(appPort) && appPort >= 0 && appPort <= 65535);
    assert.ok(Number.isInteger(dbPort) && dbPort > 0 && dbPort <= 65535);
  });

  test('SECRET_KEY is a non-empty string', () => {
    assert.strictEqual(typeof data.env.SECRET_KEY, 'string');
    assert.ok(data.env.SECRET_KEY.length > 0);
  });
});