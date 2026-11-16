import { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  TextInput,
  Text,
  View,
} from 'react-native';

type Tab = 'home' | 'servers' | 'activity' | 'settings';

type Server = {
  id: string;
  flag: string;
  city: string;
  country: string;
  region: string;
  latency: string;
  load: string;
};

const colors = {
  background: '#070B12',
  surface: '#0D1520',
  card: '#111D2A',
  cardSoft: '#142332',
  border: '#243548',
  text: '#F3F7FC',
  muted: '#91A2B7',
  dim: '#5F7188',
  green: '#57E6B1',
  greenDark: '#12382F',
  blue: '#75B8FF',
  orange: '#F2B76B',
};

const servers: Server[] = [
  { id: 'de-fra', flag: '🇩🇪', city: 'فرانکفورت', country: 'آلمان', region: 'اروپا', latency: '—', load: 'نامشخص' },
  { id: 'nl-ams', flag: '🇳🇱', city: 'آمستردام', country: 'هلند', region: 'اروپا', latency: '—', load: 'نامشخص' },
  { id: 'tr-ist', flag: '🇹🇷', city: 'استانبول', country: 'ترکیه', region: 'آسیا', latency: '—', load: 'نامشخص' },
  { id: 'fi-hel', flag: '🇫🇮', city: 'هلسینکی', country: 'فنلاند', region: 'اروپا', latency: '—', load: 'نامشخص' },
];

export default function App() {
  const [tab, setTab] = useState<Tab>('home');
  const [selectedServer, setSelectedServer] = useState('de-fra');

  const selected = servers.find((server) => server.id === selectedServer) ?? servers[0]!;

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="light-content" />
      <View style={styles.topBar}>
        <View style={styles.brandGroup}>
          <View style={styles.logo}><Text style={styles.logoText}>N</Text></View>
          <View>
            <Text style={styles.brand}>NULL PING</Text>
            <Text style={styles.brandCaption}>PRIVATE NETWORK</Text>
          </View>
        </View>
        <View style={styles.topActions}>
          <View style={styles.environment}><View style={styles.environmentDot} /><Text style={styles.environmentText}>نسخه آزمایشی</Text></View>
          <View style={styles.avatar}><Text style={styles.avatarText}>M</Text></View>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {tab === 'home' && <HomeScreen selected={selected} onBrowse={() => setTab('servers')} />}
        {tab === 'servers' && (
          <ServersScreen
            selectedServer={selectedServer}
            onSelect={setSelectedServer}
          />
        )}
        {tab === 'activity' && <ActivityScreen />}
        {tab === 'settings' && <SettingsScreen />}
      </ScrollView>

      <View style={styles.bottomBar}>
        <NavItem icon="⌂" label="خانه" active={tab === 'home'} onPress={() => setTab('home')} />
        <NavItem icon="◎" label="سرورها" active={tab === 'servers'} onPress={() => setTab('servers')} />
        <NavItem icon="↗" label="گزارش‌ها" active={tab === 'activity'} onPress={() => setTab('activity')} />
        <NavItem icon="⚙" label="تنظیمات" active={tab === 'settings'} onPress={() => setTab('settings')} />
      </View>
    </View>
  );
}

function HomeScreen({ selected, onBrowse }: { selected: Server; onBrowse: () => void }) {
  return (
    <>
      <View style={styles.welcome}>
        <View>
          <Text style={styles.eyebrow}>NULL PING / DASHBOARD</Text>
          <Text style={styles.pageTitle}>اتصال امن،{ '\n' }بدون پیچیدگی.</Text>
        </View>
        <View style={styles.liveBadge}><View style={styles.liveDot} /><Text style={styles.liveText}>آفلاین</Text></View>
      </View>

      <View style={styles.heroCard}>
        <View style={styles.heroTop}>
          <Text style={styles.cardEyebrow}>وضعیت تونل</Text>
          <View style={styles.disconnectedPill}><View style={styles.disconnectedDot} /><Text style={styles.disconnectedText}>قطع شده</Text></View>
        </View>
        <View style={styles.signalVisual}>
          <View style={styles.signalRingOuter}>
            <View style={styles.signalRingMiddle}>
              <View style={styles.signalRingInner}>
                <Text style={styles.signalMark}>N</Text>
              </View>
            </View>
          </View>
          <View style={styles.signalOrbitDot} />
        </View>
        <Text style={styles.heroTitle}>آماده‌ی اتصال</Text>
        <Text style={styles.heroDescription}>برای فعال شدن اتصال، ابتدا موتور VPN و مجوز اندروید باید راه‌اندازی شوند.</Text>
        <View style={styles.disabledButton}>
          <Text style={styles.disabledButtonText}>اتصال در نسخه بعد فعال می‌شود</Text>
          <Text style={styles.lockIcon}>⌑</Text>
        </View>
        <Text style={styles.honestNote}>این نسخه هنوز تونل VPN ایجاد نمی‌کند.</Text>
      </View>

      <SectionHeading title="سرور انتخاب‌شده" action="تغییر سرور" onAction={onBrowse} />
      <Pressable style={styles.selectedServer} onPress={onBrowse}>
        <View style={styles.serverFlag}><Text style={styles.flagText}>{selected.flag}</Text></View>
        <View style={styles.serverMain}>
          <Text style={styles.serverCity}>{selected.city}</Text>
          <Text style={styles.serverCountry}>{selected.country} · {selected.region}</Text>
        </View>
        <View style={styles.serverMetric}>
          <Text style={styles.metricNumber}>{selected.latency}</Text>
          <Text style={styles.metricCaption}>پینگ</Text>
        </View>
        <Text style={styles.chevron}>‹</Text>
      </Pressable>

      <SectionHeading title="آمار شبکه" subtitle="پس از اتصال نمایش داده می‌شود" />
      <View style={styles.statsRow}>
        <StatCard icon="↓" label="دریافت" value="—" unit="Mbps" />
        <StatCard icon="↑" label="ارسال" value="—" unit="Mbps" />
        <StatCard icon="◷" label="پایداری" value="—" unit="%" />
      </View>

      <View style={styles.infoBanner}>
        <Text style={styles.infoIcon}>✦</Text>
        <View style={styles.infoCopy}>
          <Text style={styles.infoTitle}>شفافیت در اطلاعات</Text>
          <Text style={styles.infoText}>هیچ سرعت، پینگ یا وضعیت سروری به‌صورت ساختگی نمایش داده نمی‌شود.</Text>
        </View>
      </View>
    </>
  );
}

function ServersScreen({ selectedServer, onSelect }: { selectedServer: string; onSelect: (id: string) => void }) {
  const [query, setQuery] = useState('');
  const [region, setRegion] = useState<'همه' | 'اروپا' | 'آسیا'>('همه');
  const filteredServers = servers.filter((server) => {
    const matchesQuery = `${server.city} ${server.country}`.toLowerCase().includes(query.trim().toLowerCase());
    const matchesRegion = region === 'همه' || server.region === region;
    return matchesQuery && matchesRegion;
  });

  return (
    <>
      <View style={styles.pageHeader}>
        <Text style={styles.eyebrow}>LOCATIONS / 01</Text>
        <Text style={styles.pageTitle}>انتخاب موقعیت</Text>
        <Text style={styles.pageDescription}>موقعیت دلخواه را انتخاب کن. اطلاعات این فهرست فعلاً نمونه‌ی رابط کاربری است.</Text>
      </View>
      <View style={styles.searchPlaceholder}>
        <Text style={styles.searchIcon}>⌕</Text>
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="جست‌وجوی کشور یا شهر"
          placeholderTextColor={colors.dim}
          style={styles.searchInput}
          textAlign="right"
          returnKeyType="search"
        />
        {query.length > 0 ? (
          <Pressable onPress={() => setQuery('')}><Text style={styles.clearSearch}>×</Text></Pressable>
        ) : <Text style={styles.searchShortcut}>⌕</Text>}
      </View>
      <View style={styles.filterRow}>
        {(['همه', 'اروپا', 'آسیا'] as const).map((item) => (
          <Pressable
            key={item}
            onPress={() => setRegion(item)}
            style={[styles.filterChip, region === item && styles.filterChipActive]}
            accessibilityRole="button"
            accessibilityState={{ selected: region === item }}
          >
            <Text style={[styles.filterChipText, region === item && styles.filterChipTextActive]}>{item}</Text>
          </Pressable>
        ))}
        <Text style={styles.resultCount}>{filteredServers.length} موقعیت</Text>
      </View>
      <View style={styles.mapPlaceholder}>
        <View style={styles.mapGrid} />
        <View style={styles.mapOrb}><View style={styles.mapOrbInner}><Text style={styles.mapGlobe}>◎</Text></View></View>
        <View style={styles.mapPinOne}><Text>🇩🇪</Text></View>
        <View style={styles.mapPinTwo}><Text>🇳🇱</Text></View>
        <View style={styles.mapPinThree}><Text>🇹🇷</Text></View>
        <Text style={styles.mapCaption}>نمای نقشه تعاملی در مرحله بعد اضافه می‌شود</Text>
      </View>
      <SectionHeading title="موقعیت‌های پیشنهادی" subtitle="نمونه‌های نمایشی · بدون سرور فعال" />
      {filteredServers.map((server) => {
        const isSelected = server.id === selectedServer;
        return (
          <Pressable key={server.id} style={[styles.locationCard, isSelected && styles.locationCardSelected]} onPress={() => onSelect(server.id)}>
            <View style={styles.serverFlag}><Text style={styles.flagText}>{server.flag}</Text></View>
            <View style={styles.serverMain}>
              <Text style={styles.serverCity}>{server.city}</Text>
              <Text style={styles.serverCountry}>{server.country} · {server.region}</Text>
            </View>
            <View style={styles.serverMetric}>
              <Text style={styles.metricNumber}>{server.latency}</Text>
              <Text style={styles.metricCaption}>پینگ</Text>
            </View>
            <View style={[styles.radioOuter, isSelected && styles.radioOuterActive]}>{isSelected && <View style={styles.radioInner} />}</View>
          </Pressable>
        );
      })}
      {filteredServers.length === 0 ? (
        <View style={styles.noticeCard}><Text style={styles.noticeText}>موقعیتی با این نام پیدا نشد.</Text></View>
      ) : null}
      <View style={styles.noticeCard}>
        <Text style={styles.noticeTitle}>انتخاب سرور به معنی اتصال نیست</Text>
        <Text style={styles.noticeText}>تا زمان اتصال به API و دریافت فهرست واقعی سرورها، این گزینه‌ها صرفاً برای بررسی تجربه کاربری هستند.</Text>
      </View>
    </>
  );
}

function ActivityScreen() {
  return (
    <>
      <View style={styles.pageHeader}>
        <Text style={styles.eyebrow}>NETWORK / INSIGHTS</Text>
        <Text style={styles.pageTitle}>گزارش فعالیت</Text>
        <Text style={styles.pageDescription}>نمایی از وضعیت و عملکرد اتصال شما.</Text>
      </View>
      <View style={styles.emptyChart}>
        <View style={styles.chartBars}>
          {[34, 58, 43, 76, 48, 64, 38, 86, 52, 69, 42, 60].map((height, index) => (
            <View key={index} style={[styles.chartBar, { height }]} />
          ))}
        </View>
        <Text style={styles.emptyChartTitle}>هنوز داده‌ای ثبت نشده</Text>
        <Text style={styles.emptyChartText}>نمودار پس از راه‌اندازی تونل و دریافت آمار واقعی فعال خواهد شد.</Text>
      </View>
      <View style={styles.summaryGrid}>
        <SummaryItem label="حجم دانلود" value="—" />
        <SummaryItem label="حجم آپلود" value="—" />
        <SummaryItem label="مدت اتصال" value="—" />
        <SummaryItem label="میانگین پینگ" value="—" />
      </View>
      <View style={styles.noticeCard}>
        <Text style={styles.noticeTitle}>حریم خصوصی</Text>
        <Text style={styles.noticeText}>در این نسخه هیچ تاریخچه یا ترافیک شبکه‌ای جمع‌آوری نمی‌شود.</Text>
      </View>
    </>
  );
}

function SettingsScreen() {
  return (
    <>
      <View style={styles.pageHeader}>
        <Text style={styles.eyebrow}>PREFERENCES / SYSTEM</Text>
        <Text style={styles.pageTitle}>تنظیمات</Text>
        <Text style={styles.pageDescription}>مدیریت تجربه و اطلاعات برنامه.</Text>
      </View>
      <View style={styles.settingsGroup}>
        <SettingRow icon="◐" title="ظاهر برنامه" value="تیره" />
        <SettingRow icon="文" title="زبان" value="فارسی" />
        <SettingRow icon="⌁" title="پروتکل اتصال" value="پس از راه‌اندازی موتور" />
        <SettingRow icon="盾" title="محافظت هنگام قطع VPN" value="در دسترس نیست" />
      </View>
      <View style={styles.settingsGroup}>
        <SettingRow icon="ⓘ" title="نسخه برنامه" value="0.1.0 · Foundation" />
        <SettingRow icon="⌘" title="وب‌سایت" value="nullping" />
      </View>
      <View style={styles.noticeCard}>
        <Text style={styles.noticeTitle}>نسخه توسعه</Text>
        <Text style={styles.noticeText}>این بیلد برای توسعه رابط کاربری است. تنظیمات شبکه و امنیتی هنوز به سرویس بومی اندروید متصل نشده‌اند.</Text>
      </View>
    </>
  );
}

function SectionHeading({ title, subtitle, action, onAction }: { title: string; subtitle?: string; action?: string; onAction?: () => void }) {
  return (
    <View style={styles.sectionHeading}>
      <View>
        <Text style={styles.sectionTitle}>{title}</Text>
        {subtitle ? <Text style={styles.sectionSubtitle}>{subtitle}</Text> : null}
      </View>
      {action && onAction ? <Pressable onPress={onAction}><Text style={styles.sectionAction}>{action}  ‹</Text></Pressable> : null}
    </View>
  );
}

function StatCard({ icon, label, value, unit }: { icon: string; label: string; value: string; unit: string }) {
  return (
    <View style={styles.statCard}>
      <View style={styles.statTop}><Text style={styles.statIcon}>{icon}</Text><Text style={styles.statLabel}>{label}</Text></View>
      <View style={styles.statValueRow}><Text style={styles.statValue}>{value}</Text><Text style={styles.statUnit}>{unit}</Text></View>
    </View>
  );
}

function SummaryItem({ label, value }: { label: string; value: string }) {
  return <View style={styles.summaryItem}><Text style={styles.summaryValue}>{value}</Text><Text style={styles.summaryLabel}>{label}</Text></View>;
}

function SettingRow({ icon, title, value }: { icon: string; title: string; value: string }) {
  return (
    <View style={styles.settingRow}>
      <View style={styles.settingIcon}><Text style={styles.settingIconText}>{icon}</Text></View>
      <View style={styles.settingCopy}><Text style={styles.settingTitle}>{title}</Text><Text style={styles.settingValue}>{value}</Text></View>
      <Text style={styles.chevron}>‹</Text>
    </View>
  );
}

function NavItem({ icon, label, active, onPress }: { icon: string; label: string; active: boolean; onPress: () => void }) {
  return (
    <Pressable style={styles.navItem} onPress={onPress}>
      <Text style={[styles.navIcon, active && styles.navIconActive]}>{icon}</Text>
      <Text style={[styles.navLabel, active && styles.navLabelActive]}>{label}</Text>
      {active && <View style={styles.navIndicator} />}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  topBar: { paddingHorizontal: 21, paddingTop: 17, paddingBottom: 15, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: '#172434' },
  brandGroup: { flexDirection: 'row', alignItems: 'center' },
  logo: { width: 39, height: 39, borderRadius: 13, backgroundColor: colors.green, alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  logoText: { color: '#06140F', fontSize: 23, fontWeight: '900' },
  brand: { color: colors.text, fontSize: 13, fontWeight: '900', letterSpacing: 2 },
  brandCaption: { color: colors.dim, fontSize: 7, letterSpacing: 1.7, marginTop: 3 },
  topActions: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  environment: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#15251F', borderRadius: 18, paddingHorizontal: 9, paddingVertical: 6 },
  environmentDot: { width: 5, height: 5, borderRadius: 3, backgroundColor: colors.green, marginRight: 6 },
  environmentText: { color: '#A9D9C7', fontSize: 9 },
  avatar: { width: 32, height: 32, borderRadius: 11, backgroundColor: '#203348', alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: colors.blue, fontSize: 12, fontWeight: '800' },
  content: { paddingHorizontal: 20, paddingTop: 23, paddingBottom: 30 },
  welcome: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 20 },
  eyebrow: { color: colors.green, fontSize: 8, fontWeight: '800', letterSpacing: 1.8, marginBottom: 8 },
  pageTitle: { color: colors.text, fontSize: 27, lineHeight: 37, fontWeight: '800', textAlign: 'right' },
  pageDescription: { color: colors.muted, fontSize: 11, lineHeight: 20, textAlign: 'right', marginTop: 8 },
  liveBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#261B24', borderRadius: 16, paddingHorizontal: 9, paddingVertical: 6, marginBottom: 5 },
  liveDot: { width: 5, height: 5, borderRadius: 3, backgroundColor: '#F18A9A', marginRight: 6 },
  liveText: { color: '#F3A5B2', fontSize: 9, fontWeight: '700' },
  heroCard: { backgroundColor: colors.surface, borderRadius: 25, borderWidth: 1, borderColor: colors.border, padding: 18, alignItems: 'center', overflow: 'hidden' },
  heroTop: { width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardEyebrow: { color: colors.muted, fontSize: 10 },
  disconnectedPill: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#2B2028', borderRadius: 15, paddingHorizontal: 9, paddingVertical: 6 },
  disconnectedDot: { width: 5, height: 5, borderRadius: 3, backgroundColor: '#F18A9A', marginRight: 6 },
  disconnectedText: { color: '#F2A5B2', fontSize: 9, fontWeight: '700' },
  signalVisual: { width: 164, height: 164, alignItems: 'center', justifyContent: 'center', marginTop: 14, marginBottom: 10 },
  signalRingOuter: { width: 154, height: 154, borderRadius: 77, borderWidth: 1, borderColor: '#24483F', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0B1D1A' },
  signalRingMiddle: { width: 121, height: 121, borderRadius: 61, borderWidth: 1, borderColor: '#2B5549', alignItems: 'center', justifyContent: 'center' },
  signalRingInner: { width: 83, height: 83, borderRadius: 42, borderWidth: 1, borderColor: '#3C826B', backgroundColor: '#15382F', alignItems: 'center', justifyContent: 'center' },
  signalMark: { color: colors.green, fontSize: 39, fontWeight: '900' },
  signalOrbitDot: { position: 'absolute', top: 19, right: 19, width: 10, height: 10, borderRadius: 5, backgroundColor: colors.green, borderWidth: 2, borderColor: colors.surface },
  heroTitle: { color: colors.text, fontSize: 18, fontWeight: '800', marginTop: 3 },
  heroDescription: { color: colors.muted, fontSize: 10, lineHeight: 19, textAlign: 'center', marginTop: 7, paddingHorizontal: 7 },
  disabledButton: { width: '100%', backgroundColor: '#20342F', borderRadius: 14, paddingVertical: 14, paddingHorizontal: 14, marginTop: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, opacity: 0.75 },
  disabledButtonText: { color: '#A9D9C7', fontSize: 11, fontWeight: '800' },
  lockIcon: { color: colors.green, fontSize: 16 },
  honestNote: { color: colors.dim, fontSize: 8, marginTop: 10 },
  sectionHeading: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 25, marginBottom: 11 },
  sectionTitle: { color: colors.text, fontSize: 13, fontWeight: '800', textAlign: 'right' },
  sectionSubtitle: { color: colors.dim, fontSize: 9, textAlign: 'right', marginTop: 4 },
  sectionAction: { color: colors.green, fontSize: 10, fontWeight: '700' },
  selectedServer: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card, borderRadius: 17, borderWidth: 1, borderColor: colors.border, padding: 12 },
  serverFlag: { width: 43, height: 43, borderRadius: 13, backgroundColor: colors.cardSoft, alignItems: 'center', justifyContent: 'center', marginRight: 11 },
  flagText: { fontSize: 23 },
  serverMain: { flex: 1 },
  serverCity: { color: colors.text, fontSize: 12, fontWeight: '800', textAlign: 'right' },
  serverCountry: { color: colors.muted, fontSize: 9, textAlign: 'right', marginTop: 4 },
  serverMetric: { alignItems: 'flex-end', marginRight: 12 },
  metricNumber: { color: colors.orange, fontSize: 13, fontWeight: '800' },
  metricCaption: { color: colors.dim, fontSize: 8, marginTop: 3 },
  chevron: { color: colors.dim, fontSize: 22, marginLeft: 2 },
  statsRow: { flexDirection: 'row', gap: 9 },
  statCard: { flex: 1, backgroundColor: colors.card, borderRadius: 15, borderWidth: 1, borderColor: colors.border, padding: 11 },
  statTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  statIcon: { color: colors.green, fontSize: 13, fontWeight: '800' },
  statLabel: { color: colors.muted, fontSize: 9 },
  statValueRow: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'flex-end', marginTop: 11 },
  statValue: { color: colors.text, fontSize: 20, fontWeight: '800' },
  statUnit: { color: colors.dim, fontSize: 8, marginLeft: 4 },
  infoBanner: { flexDirection: 'row', alignItems: 'flex-start', backgroundColor: '#10231F', borderWidth: 1, borderColor: '#24463D', borderRadius: 15, padding: 13, marginTop: 18 },
  infoIcon: { color: colors.green, fontSize: 17, marginRight: 10 },
  infoCopy: { flex: 1 },
  infoTitle: { color: '#B8EBD9', fontSize: 10, fontWeight: '800', textAlign: 'right' },
  infoText: { color: '#89A99E', fontSize: 9, lineHeight: 17, textAlign: 'right', marginTop: 4 },
  pageHeader: { alignItems: 'flex-end', marginBottom: 19 },
  searchPlaceholder: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1, borderRadius: 13, paddingHorizontal: 13, paddingVertical: 12 },
  searchIcon: { color: colors.muted, fontSize: 19, marginRight: 9 },
  searchInput: { flex: 1, color: colors.text, fontSize: 10, paddingVertical: 0, textAlign: 'right' },
  clearSearch: { color: colors.muted, fontSize: 18, paddingHorizontal: 3 },
  searchShortcut: { color: colors.dim, fontSize: 8, borderWidth: 1, borderColor: colors.border, borderRadius: 5, paddingHorizontal: 5, paddingVertical: 3 },
  filterRow: { flexDirection: 'row', alignItems: 'center', gap: 7, marginTop: 11 },
  filterChip: { borderWidth: 1, borderColor: colors.border, borderRadius: 18, paddingHorizontal: 13, paddingVertical: 7, backgroundColor: colors.card },
  filterChipActive: { borderColor: '#398D70', backgroundColor: '#123128' },
  filterChipText: { color: colors.muted, fontSize: 9 },
  filterChipTextActive: { color: colors.green, fontWeight: '800' },
  resultCount: { color: colors.dim, fontSize: 8, marginLeft: 'auto' },
  mapPlaceholder: { height: 190, borderRadius: 19, backgroundColor: '#0C1B24', borderWidth: 1, borderColor: colors.border, marginTop: 13, overflow: 'hidden', alignItems: 'center', justifyContent: 'center' },
  mapGrid: { ...StyleSheet.absoluteFill, opacity: 0.45, borderWidth: 1, borderColor: '#1D3543' },
  mapOrb: { width: 126, height: 126, borderRadius: 63, borderWidth: 1, borderColor: '#2E5860', backgroundColor: '#102D37', alignItems: 'center', justifyContent: 'center' },
  mapOrbInner: { width: 96, height: 96, borderRadius: 48, borderWidth: 1, borderColor: '#3D6B70', alignItems: 'center', justifyContent: 'center' },
  mapGlobe: { color: '#75B8A8', fontSize: 58 },
  mapPinOne: { position: 'absolute', top: 38, left: '27%', backgroundColor: '#193B35', padding: 5, borderRadius: 10 },
  mapPinTwo: { position: 'absolute', top: 67, right: '24%', backgroundColor: '#193B35', padding: 5, borderRadius: 10 },
  mapPinThree: { position: 'absolute', bottom: 50, left: '34%', backgroundColor: '#193B35', padding: 5, borderRadius: 10 },
  mapCaption: { position: 'absolute', bottom: 11, color: colors.dim, fontSize: 8 },
  locationCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card, borderRadius: 16, borderWidth: 1, borderColor: colors.border, padding: 11, marginBottom: 9 },
  locationCardSelected: { borderColor: '#3D9D7D', backgroundColor: '#10251F' },
  radioOuter: { width: 18, height: 18, borderRadius: 9, borderWidth: 1, borderColor: colors.dim, alignItems: 'center', justifyContent: 'center' },
  radioOuterActive: { borderColor: colors.green },
  radioInner: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.green },
  noticeCard: { backgroundColor: '#171D27', borderWidth: 1, borderColor: '#343B48', borderRadius: 15, padding: 14, marginTop: 14 },
  noticeTitle: { color: colors.text, fontSize: 10, fontWeight: '800', textAlign: 'right' },
  noticeText: { color: colors.muted, fontSize: 9, lineHeight: 18, textAlign: 'right', marginTop: 5 },
  emptyChart: { backgroundColor: colors.card, borderRadius: 19, borderWidth: 1, borderColor: colors.border, padding: 17, alignItems: 'center' },
  chartBars: { height: 110, width: '100%', flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-around', borderBottomWidth: 1, borderColor: colors.border, paddingHorizontal: 8, marginBottom: 18 },
  chartBar: { width: 9, borderRadius: 5, backgroundColor: '#234A40', opacity: 0.55 },
  emptyChartTitle: { color: colors.text, fontSize: 12, fontWeight: '800' },
  emptyChartText: { color: colors.muted, fontSize: 9, lineHeight: 17, textAlign: 'center', marginTop: 6 },
  summaryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 9, marginTop: 13 },
  summaryItem: { width: '48%', backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, borderRadius: 14, padding: 14, alignItems: 'flex-end' },
  summaryValue: { color: colors.text, fontSize: 21, fontWeight: '800' },
  summaryLabel: { color: colors.muted, fontSize: 9, marginTop: 5 },
  settingsGroup: { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, borderRadius: 16, paddingHorizontal: 13, marginBottom: 13 },
  settingRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#1D2B3B' },
  settingIcon: { width: 34, height: 34, borderRadius: 11, backgroundColor: colors.cardSoft, alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  settingIconText: { color: colors.green, fontSize: 15 },
  settingCopy: { flex: 1 },
  settingTitle: { color: colors.text, fontSize: 10, fontWeight: '700', textAlign: 'right' },
  settingValue: { color: colors.muted, fontSize: 8, textAlign: 'right', marginTop: 4 },
  bottomBar: { flexDirection: 'row', backgroundColor: '#0B121C', borderTopWidth: 1, borderTopColor: '#1B2A3A', paddingTop: 9, paddingBottom: 12, paddingHorizontal: 12 },
  navItem: { flex: 1, alignItems: 'center', justifyContent: 'center', minHeight: 47 },
  navIcon: { color: colors.dim, fontSize: 20 },
  navIconActive: { color: colors.green },
  navLabel: { color: colors.dim, fontSize: 8, marginTop: 3 },
  navLabelActive: { color: colors.green, fontWeight: '800' },
  navIndicator: { position: 'absolute', top: -9, width: 18, height: 2, borderRadius: 2, backgroundColor: colors.green },
});
