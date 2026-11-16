import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator, Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View,
} from 'react-native';
import {
  addManualConfig, addSubscription, listProfiles, refreshSubscription,
  getSelectedProfile, removeProfile, removeSubscription, selectProfile, type SavedProfile, type SavedSubscription,
} from './profileStore';

const c = {
  bg: '#070B12', panel: '#0D1520', card: '#111D2A', border: '#243548',
  text: '#F3F7FC', muted: '#91A2B7', dim: '#5F7188', green: '#57E6B1',
  blue: '#75B8FF', red: '#FF8585',
};

type ImportMode = 'config' | 'subscription';

export default function ProfilesScreen({ onSelectProfile }: { onSelectProfile?: () => void }) {
  const [profiles, setProfiles] = useState<SavedProfile[]>([]);
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null);
  const [subscriptions, setSubscriptions] = useState<SavedSubscription[]>([]);
  const [mode, setMode] = useState<ImportMode>('config');
  const [modalOpen, setModalOpen] = useState(false);
  const [value, setValue] = useState('');
  const [busy, setBusy] = useState(false);
  const [refreshingId, setRefreshingId] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const reload = useCallback(async () => {
    const [result, selected] = await Promise.all([listProfiles(), getSelectedProfile()]);
    setProfiles(result.profiles);
    setSubscriptions(result.subscriptions);
    setSelectedProfileId(selected?.id ?? null);
  }, []);

  useEffect(() => { void reload(); }, [reload]);

  const openImport = (nextMode: ImportMode) => {
    setMode(nextMode);
    setValue('');
    setError('');
    setMessage('');
    setModalOpen(true);
  };

  const submit = async () => {
    setBusy(true); setError(''); setMessage('');
    try {
      if (mode === 'config') {
        const result = await addManualConfig(value);
        setMessage(`${result.added} کانفیگ اضافه شد.${result.skipped ? ` ${result.skipped} مورد تکراری بود.` : ''}`);
      } else {
        const result = await addSubscription(value);
        setMessage(`اشتراک دریافت شد؛ ${result.added} کانفیگ اضافه شد.`);
      }
      await reload();
      setValue('');
      setModalOpen(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'عملیات انجام نشد.');
    } finally {
      setBusy(false);
    }
  };

  const refresh = async (id: string) => {
    setRefreshingId(id); setError(''); setMessage('');
    try {
      const result = await refreshSubscription(id);
      setMessage(`اشتراک به‌روزرسانی شد؛ ${result.added} جدید، ${result.removed} حذف‌شده.`);
      await reload();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'به‌روزرسانی انجام نشد.');
    } finally {
      setRefreshingId(null);
    }
  };

  const chooseProfile = async (profile: SavedProfile) => {
    await selectProfile(profile.id);
    setSelectedProfileId(profile.id);
    setMessage(`«${profile.name}» برای اتصال انتخاب شد.`);
    onSelectProfile?.();
  };

  const removeOne = async (profile: SavedProfile) => {
    await removeProfile(profile.id);
    await reload();
  };

  const removeSub = async (sub: SavedSubscription) => {
    await removeSubscription(sub.id);
    await reload();
  };

  return (
    <View style={styles.root}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.eyebrow}>PROFILES / CONFIGURATION</Text>
        <Text style={styles.title}>کانفیگ‌های من</Text>
        <Text style={styles.subtitle}>لینک تکی یا آدرس اشتراک را وارد کن. اطلاعات هر کانفیگ روی دستگاه ذخیره می‌شود.</Text>

        <View style={styles.actions}>
          <Pressable style={styles.primaryButton} onPress={() => openImport('config')}>
            <Text style={styles.primaryText}>＋ افزودن کانفیگ</Text>
          </Pressable>
          <Pressable style={styles.secondaryButton} onPress={() => openImport('subscription')}>
            <Text style={styles.secondaryText}>↻ افزودن اشتراک</Text>
          </Pressable>
        </View>

        {!!message && <Text style={styles.success}>{message}</Text>}
        {!!error && <Text style={styles.error}>{error}</Text>}

        <View style={styles.sectionHead}>
          <Text style={styles.sectionTitle}>اشتراک‌ها</Text>
          <Text style={styles.count}>{subscriptions.length}</Text>
        </View>
        {subscriptions.length === 0 ? (
          <View style={styles.empty}><Text style={styles.emptyTitle}>هنوز اشتراکی اضافه نشده</Text><Text style={styles.emptyText}>با افزودن لینک Subscription، کانفیگ‌ها به‌صورت گروهی وارد می‌شوند.</Text></View>
        ) : subscriptions.map((sub) => (
          <View key={sub.id} style={styles.subscriptionCard}>
            <View style={styles.cardTop}>
              <View style={styles.subscriptionIcon}><Text style={styles.subscriptionIconText}>↻</Text></View>
              <View style={styles.flex}>
                <Text style={styles.profileName}>{sub.name}</Text>
                <Text style={styles.meta}>{sub.profileCount} کانفیگ · {sub.lastUpdated ? new Date(sub.lastUpdated).toLocaleString() : 'هنوز به‌روزرسانی نشده'}</Text>
              </View>
              {refreshingId === sub.id ? <ActivityIndicator color={c.green} /> : (
                <Pressable onPress={() => void refresh(sub.id)} style={styles.smallAction}><Text style={styles.smallActionText}>به‌روزرسانی</Text></Pressable>
              )}
            </View>
            <Pressable onPress={() => void removeSub(sub)}><Text style={styles.deleteText}>حذف اشتراک و کانفیگ‌های آن</Text></Pressable>
          </View>
        ))}

        <View style={styles.sectionHead}>
          <Text style={styles.sectionTitle}>سرورها</Text>
          <Text style={styles.count}>{profiles.length}</Text>
        </View>
        {profiles.length === 0 ? (
          <View style={styles.empty}><Text style={styles.emptyTitle}>لیست سرورها خالی است</Text><Text style={styles.emptyText}>برای شروع، یک لینک VLESS یا VMess یا آدرس اشتراک وارد کن.</Text></View>
        ) : profiles.map((profile) => (
          <View key={profile.id} style={styles.profileCard}>
            <View style={styles.profileTop}>
              <View style={styles.protocolBadge}><Text style={styles.protocolText}>{profile.protocol}</Text></View>
              <View style={styles.flex}>
                <Text style={styles.profileName} numberOfLines={1}>{profile.name}</Text>
                <Text style={styles.meta} numberOfLines={1}>{profile.server}:{profile.port}</Text>
              </View>
              <Pressable onPress={() => void removeOne(profile)}><Text style={styles.remove}>×</Text></Pressable>
            </View>
            <Text style={styles.source}>{profile.source === 'subscription' ? 'دریافت‌شده از اشتراک' : 'افزوده‌شده به‌صورت دستی'}</Text>
            <Pressable onPress={() => void chooseProfile(profile)} style={[styles.chooseButton, selectedProfileId === profile.id && styles.chooseButtonActive]}>
              <Text style={[styles.chooseText, selectedProfileId === profile.id && styles.chooseTextActive]}>{selectedProfileId === profile.id ? '✓ انتخاب‌شده برای اتصال' : 'انتخاب برای اتصال'}</Text>
            </Pressable>
          </View>
        ))}
        <View style={styles.footnote}><Text style={styles.footnoteText}>در این مرحله ورود و نگهداری کانفیگ و دریافت اشتراک فعال است. اتصال تونل تا تکمیل ادغام موتور Xray و سرویس VPN اندروید فعال نخواهد شد.</Text></View>
      </ScrollView>

      <Modal visible={modalOpen} animationType="slide" transparent onRequestClose={() => setModalOpen(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modal}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>{mode === 'config' ? 'افزودن کانفیگ' : 'افزودن اشتراک'}</Text>
            <Text style={styles.modalHint}>{mode === 'config' ? 'لینک VLESS، VMess، Trojan یا Shadowsocks را جای‌گذاری کن. چند لینک را می‌توانی در خط‌های جدا وارد کنی.' : 'لینک Subscription را وارد کن؛ برنامه محتوای آن را دریافت و کانفیگ‌های قابل‌شناسایی را استخراج می‌کند.'}</Text>
            <TextInput
              value={value}
              onChangeText={setValue}
              placeholder={mode === 'config' ? 'vless://… یا vmess://…' : 'https://example.com/subscription'}
              placeholderTextColor={c.dim}
              style={styles.input}
              multiline={mode === 'config'}
              autoCapitalize="none"
              autoCorrect={false}
              textAlign="left"
              textAlignVertical="top"
            />
            {!!error && <Text style={styles.error}>{error}</Text>}
            <View style={styles.modalActions}>
              <Pressable style={styles.cancelButton} onPress={() => setModalOpen(false)} disabled={busy}><Text style={styles.cancelText}>انصراف</Text></Pressable>
              <Pressable style={[styles.primaryButton, styles.submitButton, busy && styles.disabled]} onPress={() => void submit()} disabled={busy || !value.trim()}>
                {busy ? <ActivityIndicator color="#06120F" /> : <Text style={styles.primaryText}>دریافت و ذخیره</Text>}
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: c.bg },
  content: { padding: 20, paddingBottom: 36 },
  eyebrow: { color: c.green, fontSize: 10, letterSpacing: 2, fontWeight: '800', textAlign: 'right', marginTop: 8 },
  title: { color: c.text, fontSize: 27, fontWeight: '800', textAlign: 'right', marginTop: 8 },
  subtitle: { color: c.muted, fontSize: 13, lineHeight: 23, textAlign: 'right', marginTop: 8, marginBottom: 20 },
  actions: { flexDirection: 'row-reverse', gap: 10, marginBottom: 18 },
  primaryButton: { flex: 1, minHeight: 48, borderRadius: 14, backgroundColor: c.green, alignItems: 'center', justifyContent: 'center' },
  primaryText: { color: '#06120F', fontSize: 13, fontWeight: '800' },
  secondaryButton: { flex: 1, minHeight: 48, borderRadius: 14, borderWidth: 1, borderColor: c.border, backgroundColor: c.panel, alignItems: 'center', justifyContent: 'center' },
  secondaryText: { color: c.text, fontSize: 13, fontWeight: '700' },
  success: { color: c.green, textAlign: 'right', lineHeight: 22, marginBottom: 12 },
  error: { color: c.red, textAlign: 'right', lineHeight: 22, marginBottom: 12 },
  sectionHead: { flexDirection: 'row-reverse', alignItems: 'center', gap: 8, marginTop: 18, marginBottom: 10 },
  sectionTitle: { color: c.text, fontSize: 17, fontWeight: '800' },
  count: { color: c.green, fontSize: 12, fontWeight: '800', backgroundColor: '#12382F', paddingHorizontal: 9, paddingVertical: 4, borderRadius: 20 },
  empty: { borderRadius: 16, padding: 18, borderWidth: 1, borderColor: c.border, backgroundColor: c.panel, alignItems: 'center' },
  emptyTitle: { color: c.text, fontWeight: '700', fontSize: 14 },
  emptyText: { color: c.muted, fontSize: 12, textAlign: 'center', lineHeight: 21, marginTop: 6 },
  subscriptionCard: { backgroundColor: c.panel, borderColor: c.border, borderWidth: 1, borderRadius: 16, padding: 14, marginBottom: 9 },
  cardTop: { flexDirection: 'row-reverse', alignItems: 'center', gap: 10 },
  subscriptionIcon: { width: 38, height: 38, borderRadius: 12, backgroundColor: '#15372F', alignItems: 'center', justifyContent: 'center' },
  subscriptionIconText: { color: c.green, fontSize: 20, fontWeight: '800' },
  flex: { flex: 1 },
  profileName: { color: c.text, fontSize: 14, fontWeight: '700', textAlign: 'right' },
  meta: { color: c.muted, fontSize: 10, textAlign: 'right', marginTop: 4 },
  smallAction: { backgroundColor: '#12382F', paddingHorizontal: 10, paddingVertical: 8, borderRadius: 9 },
  smallActionText: { color: c.green, fontSize: 10, fontWeight: '700' },
  deleteText: { color: c.red, fontSize: 11, textAlign: 'right', marginTop: 12 },
  profileCard: { backgroundColor: c.panel, borderColor: c.border, borderWidth: 1, borderRadius: 15, padding: 14, marginBottom: 8 },
  profileTop: { flexDirection: 'row-reverse', alignItems: 'center', gap: 10 },
  protocolBadge: { paddingHorizontal: 9, paddingVertical: 6, backgroundColor: '#172A40', borderRadius: 8 },
  protocolText: { color: c.blue, fontSize: 10, fontWeight: '800' },
  remove: { color: c.red, fontSize: 25, paddingHorizontal: 4 },
  source: { color: c.dim, textAlign: 'right', fontSize: 10, marginTop: 10 },
  chooseButton: { marginTop: 12, paddingVertical: 10, borderRadius: 10, alignItems: 'center', borderWidth: 1, borderColor: c.border, backgroundColor: c.card },
  chooseButtonActive: { borderColor: '#398D70', backgroundColor: '#123128' },
  chooseText: { color: c.muted, fontSize: 11, fontWeight: '700' },
  chooseTextActive: { color: c.green },
  footnote: { backgroundColor: '#111C29', borderRadius: 13, padding: 13, marginTop: 18, borderWidth: 1, borderColor: c.border },
  footnoteText: { color: c.muted, textAlign: 'right', fontSize: 11, lineHeight: 20 },
  modalBackdrop: { flex: 1, justifyContent: 'flex-end', backgroundColor: '#000A' },
  modal: { backgroundColor: c.panel, padding: 20, paddingBottom: 28, borderTopLeftRadius: 24, borderTopRightRadius: 24, borderColor: c.border, borderWidth: 1 },
  modalHandle: { width: 42, height: 4, borderRadius: 4, backgroundColor: c.dim, alignSelf: 'center', marginBottom: 18 },
  modalTitle: { color: c.text, fontSize: 20, fontWeight: '800', textAlign: 'right' },
  modalHint: { color: c.muted, fontSize: 12, lineHeight: 22, textAlign: 'right', marginTop: 8, marginBottom: 14 },
  input: { minHeight: 118, maxHeight: 220, borderRadius: 13, borderWidth: 1, borderColor: c.border, backgroundColor: c.bg, padding: 14, color: c.text, fontSize: 12, textAlignVertical: 'top' },
  modalActions: { flexDirection: 'row-reverse', gap: 10, marginTop: 16 },
  cancelButton: { minHeight: 48, minWidth: 90, borderRadius: 13, borderWidth: 1, borderColor: c.border, alignItems: 'center', justifyContent: 'center' },
  cancelText: { color: c.muted, fontWeight: '700' },
  submitButton: { flex: 1 },
  disabled: { opacity: 0.5 },
});
