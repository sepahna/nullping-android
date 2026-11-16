import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { parseConfigInput, type ParsedProxyProfile } from './profileParser.mjs';

const INDEX_KEY = 'nullping.profile-index.v1';
const PROFILE_KEY = (id: string) => `nullping.profile.${id}`;
const SUBSCRIPTION_KEY = (id: string) => `nullping.subscription.${id}`;
const MAX_SUBSCRIPTION_BYTES = 1024 * 1024;

export type SavedProfile = ParsedProxyProfile & {
  id: string;
  source: 'manual' | 'subscription';
  subscriptionId?: string;
  addedAt: number;
};

export type SavedSubscription = {
  id: string;
  name: string;
  addedAt: number;
  lastUpdated?: number;
  profileCount: number;
};

type ProfileMeta = Omit<SavedProfile, 'raw'>;
type ProfileIndex = { profiles: SavedProfile[]; subscriptions: SavedSubscription[] };

async function readIndex(): Promise<ProfileIndex> {
  const raw = await AsyncStorage.getItem(INDEX_KEY);
  if (!raw) return { profiles: [], subscriptions: [] };
  try {
    const parsed = JSON.parse(raw) as { profiles?: ProfileMeta[]; subscriptions?: SavedSubscription[] };
    const metadata = Array.isArray(parsed.profiles) ? parsed.profiles : [];
    const profiles = await Promise.all(metadata.map(async (profile) => ({
      ...profile,
      raw: await SecureStore.getItemAsync(PROFILE_KEY(profile.id)) ?? '',
    })));
    return {
      profiles: profiles.filter((profile) => profile.raw.length > 0),
      subscriptions: Array.isArray(parsed.subscriptions) ? parsed.subscriptions : [],
    };
  } catch {
    return { profiles: [], subscriptions: [] };
  }
}

async function writeIndex(index: ProfileIndex) {
  const profiles: ProfileMeta[] = index.profiles.map(({ raw: _secret, ...metadata }) => metadata);
  await AsyncStorage.setItem(INDEX_KEY, JSON.stringify({ profiles, subscriptions: index.subscriptions }));
}

function makeId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
}

function validateSubscriptionUrl(value: string) {
  let url: URL;
  try { url = new URL(value.trim()); } catch { throw new Error('آدرس اشتراک معتبر نیست.'); }
  if (!['https:', 'http:'].includes(url.protocol) || !url.hostname) {
    throw new Error('فقط لینک اشتراک HTTP یا HTTPS پذیرفته می‌شود.');
  }
  return url.toString();
}

async function downloadSubscription(url: string) {
  const response = await fetch(url, {
    headers: { Accept: 'text/plain, */*', 'User-Agent': 'NullPing-Android/0.2' },
  });
  if (!response.ok) throw new Error(`دریافت اشتراک ناموفق بود (HTTP ${response.status}).`);
  const text = await response.text();
  if (new TextEncoder().encode(text).length > MAX_SUBSCRIPTION_BYTES) {
    throw new Error('حجم پاسخ اشتراک بیشتر از یک مگابایت است.');
  }
  return text;
}

async function saveProfiles(index: ProfileIndex, profiles: SavedProfile[]) {
  for (const profile of profiles) {
    await SecureStore.setItemAsync(PROFILE_KEY(profile.id), profile.raw);
  }
  await writeIndex({ ...index, profiles: [...profiles, ...index.profiles] });
}

export async function listProfiles(): Promise<{ profiles: SavedProfile[]; subscriptions: SavedSubscription[] }> {
  const index = await readIndex();
  return index;
}

export async function getProfileRaw(id: string): Promise<string | null> {
  return SecureStore.getItemAsync(PROFILE_KEY(id));
}

export async function addManualConfig(input: string) {
  const parsed = parseConfigInput(input);
  if (parsed.profiles.length === 0) {
    throw new Error(parsed.errors[0] ?? 'هیچ لینک کانفیگ قابل‌شناسایی پیدا نشد.');
  }
  const index = await readIndex();
  const existing = new Set(index.profiles.map((profile) => profile.raw));
  const fresh = parsed.profiles.filter((profile) => !existing.has(profile.raw));
  if (!fresh.length) throw new Error('این کانفیگ‌ها قبلاً اضافه شده‌اند.');
  const saved = fresh.map((profile) => ({
    ...profile, id: makeId(), source: 'manual' as const, addedAt: Date.now(),
  }));
  await saveProfiles(index, saved);
  return { added: saved.length, skipped: parsed.profiles.length - fresh.length, errors: parsed.errors };
}

export async function addSubscription(inputUrl: string) {
  const url = validateSubscriptionUrl(inputUrl);
  const content = await downloadSubscription(url);
  const parsed = parseConfigInput(content);
  if (!parsed.profiles.length) {
    throw new Error(parsed.errors[0] ?? 'پاسخ اشتراک، لینک قابل‌پشتیبانی ندارد. لینک‌های VLESS/VMess/Trojan/SS یا خروجی Base64 لازم است.');
  }
  const index = await readIndex();
  const id = makeId();
  const existing = new Set(index.profiles.map((profile) => profile.raw));
  const fresh = parsed.profiles.filter((profile) => !existing.has(profile.raw));
  if (!fresh.length) throw new Error('تمام کانفیگ‌های این اشتراک قبلاً وارد شده‌اند.');
  const saved = fresh.map((profile) => ({
    ...profile, id: makeId(), source: 'subscription' as const, subscriptionId: id, addedAt: Date.now(),
  }));
  const subscription: SavedSubscription = {
    id, name: new URL(url).hostname, addedAt: Date.now(), lastUpdated: Date.now(), profileCount: saved.length,
  };
  await SecureStore.setItemAsync(SUBSCRIPTION_KEY(id), url);
  await saveProfiles(index, saved);
  const latest = await readIndex();
  await writeIndex({ ...latest, subscriptions: [subscription, ...latest.subscriptions] });
  return { added: saved.length, errors: parsed.errors };
}

export async function removeProfile(id: string) {
  const index = await readIndex();
  const profile = index.profiles.find((item) => item.id === id);
  if (!profile) return;
  await SecureStore.deleteItemAsync(PROFILE_KEY(id));
  await writeIndex({ ...index, profiles: index.profiles.filter((item) => item.id !== id) });
}

export async function removeSubscription(id: string) {
  const index = await readIndex();
  const owned = index.profiles.filter((item) => item.subscriptionId === id);
  await Promise.all(owned.map((item) => SecureStore.deleteItemAsync(PROFILE_KEY(item.id))));
  await SecureStore.deleteItemAsync(SUBSCRIPTION_KEY(id));
  await writeIndex({
    profiles: index.profiles.filter((item) => item.subscriptionId !== id),
    subscriptions: index.subscriptions.filter((item) => item.id !== id),
  });
}

export async function refreshSubscription(id: string) {
  const url = await SecureStore.getItemAsync(SUBSCRIPTION_KEY(id));
  if (!url) throw new Error('آدرس این اشتراک در حافظه امن پیدا نشد.');
  const content = await downloadSubscription(url);
  const parsed = parseConfigInput(content);
  if (!parsed.profiles.length) throw new Error('در پاسخ جدید، کانفیگ قابل‌پشتیبانی پیدا نشد.');
  const index = await readIndex();
  const previous = index.profiles.filter((item) => item.subscriptionId === id);
  const previousRaw = new Set(previous.map((item) => item.raw));
  const nextRaw = new Set(parsed.profiles.map((item) => item.raw));
  const keep = previous.filter((item) => nextRaw.has(item.raw));
  const additions = parsed.profiles.filter((item) => !previousRaw.has(item.raw)).map((profile) => ({
    ...profile, id: makeId(), source: 'subscription' as const, subscriptionId: id, addedAt: Date.now(),
  }));
  const removed = previous.filter((item) => !nextRaw.has(item.raw));
  await Promise.all(removed.map((item) => SecureStore.deleteItemAsync(PROFILE_KEY(item.id))));
  await Promise.all(additions.map((item) => SecureStore.setItemAsync(PROFILE_KEY(item.id), item.raw)));
  const subscriptions = index.subscriptions.map((item) => item.id === id
    ? { ...item, lastUpdated: Date.now(), profileCount: keep.length + additions.length }
    : item);
  await writeIndex({
    profiles: [...keep, ...additions, ...index.profiles.filter((item) => item.subscriptionId !== id)],
    subscriptions,
  });
  return { added: additions.length, removed: removed.length, total: keep.length + additions.length };
}
