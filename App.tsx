import { StatusBar, StyleSheet, Text, View } from 'react-native';

const palette = {
  bg: '#070B12',
  panel: '#101824',
  border: '#26364A',
  text: '#F4F7FB',
  muted: '#8B9AAF',
  accent: '#57E6B1',
};

export default function App() {
  return (
    <View style={styles.screen}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <View style={styles.logo}><Text style={styles.logoText}>N</Text></View>
        <View>
          <Text style={styles.brand}>NULL PING</Text>
          <Text style={styles.tagline}>SECURE NETWORK</Text>
        </View>
        <Text style={styles.version}>BETA 0.1</Text>
      </View>

      <View style={styles.intro}>
        <Text style={styles.eyebrow}>PRIVATE CONNECTION</Text>
        <Text style={styles.title}>اتصال، با کنترل کامل</Text>
        <Text style={styles.subtitle}>وضعیت شبکه و اتصال خود را در یک نگاه مدیریت کنید.</Text>
      </View>

      <View style={styles.connectionCard}>
        <View style={styles.row}>
          <Text style={styles.muted}>وضعیت اتصال</Text>
          <View style={styles.status}><View style={styles.statusDot} /><Text style={styles.statusText}>قطع شده</Text></View>
        </View>
        <View style={styles.orbitOuter}>
          <View style={styles.orbitInner}>
            <View style={styles.core}><Text style={styles.coreText}>N</Text></View>
          </View>
        </View>
        <Text style={styles.connectionTitle}>هنوز متصل نیستید</Text>
        <Text style={styles.mutedCenter}>موتور اتصال در مرحله بعدی توسعه راه‌اندازی می‌شود.</Text>
        <View style={styles.note}><Text style={styles.noteText}>نسخه پایه رابط کاربری — بدون تونل فعال</Text></View>
      </View>

      <View style={[styles.row, { marginTop: 26, marginBottom: 12 }]}>
        <Text style={styles.sectionTitle}>شبکه شما</Text>
        <Text style={styles.mutedSmall}>اطلاعات واقعی پس از اتصال</Text>
      </View>
      <View style={styles.metrics}>
        <Metric label="سرعت دریافت" unit="Mbps" />
        <Metric label="سرعت ارسال" unit="Mbps" />
        <Metric label="تأخیر شبکه" unit="ms" />
      </View>
      <View style={styles.footer}><Text style={styles.footerText}>NULL PING</Text><Text style={styles.footerDot}> • </Text><Text style={styles.footerText}>اتصال مطمئن، شفاف و قابل‌اندازه‌گیری</Text></View>
    </View>
  );
}

function Metric({ label, unit }: { label: string; unit: string }) {
  return (
    <View style={styles.metric}>
      <Text style={styles.metricLabel}>{label}</Text>
      <View style={styles.metricValueRow}><Text style={styles.metricValue}>—</Text><Text style={styles.metricUnit}>{unit}</Text></View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: palette.bg, paddingHorizontal: 22, paddingTop: 54, paddingBottom: 22 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 38 },
  logo: { width: 42, height: 42, borderRadius: 14, backgroundColor: palette.accent, alignItems: 'center', justifyContent: 'center', marginRight: 11 },
  logoText: { color: '#06130F', fontSize: 24, fontWeight: '900' },
  brand: { color: palette.text, fontSize: 14, fontWeight: '900', letterSpacing: 2 },
  tagline: { color: palette.muted, fontSize: 8, letterSpacing: 2, marginTop: 3 },
  version: { color: palette.muted, fontSize: 9, marginLeft: 'auto', borderWidth: 1, borderColor: palette.border, borderRadius: 20, paddingHorizontal: 10, paddingVertical: 6 },
  intro: { alignItems: 'flex-end', marginBottom: 22 },
  eyebrow: { color: palette.accent, fontSize: 9, fontWeight: '800', letterSpacing: 2 },
  title: { color: palette.text, fontSize: 25, fontWeight: '800', marginTop: 10, textAlign: 'right' },
  subtitle: { color: palette.muted, fontSize: 12, marginTop: 8, textAlign: 'right', lineHeight: 21 },
  connectionCard: { backgroundColor: palette.panel, borderRadius: 25, borderWidth: 1, borderColor: palette.border, padding: 19, alignItems: 'center' },
  row: { width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  muted: { color: palette.muted, fontSize: 11 },
  status: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#2B2027', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 6 },
  statusDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#F28A9B', marginRight: 6 },
  statusText: { color: '#F4A4B0', fontSize: 10, fontWeight: '700' },
  orbitOuter: { width: 142, height: 142, borderRadius: 71, borderWidth: 1, borderColor: '#29473F', backgroundColor: '#0D211E', alignItems: 'center', justifyContent: 'center', marginTop: 25, marginBottom: 17 },
  orbitInner: { width: 112, height: 112, borderRadius: 56, borderWidth: 1, borderColor: '#31594D', alignItems: 'center', justifyContent: 'center' },
  core: { width: 76, height: 76, borderRadius: 38, backgroundColor: '#173D36', borderWidth: 1, borderColor: '#4EAE8E', alignItems: 'center', justifyContent: 'center' },
  coreText: { color: palette.accent, fontSize: 36, fontWeight: '900' },
  connectionTitle: { color: palette.text, fontSize: 17, fontWeight: '800' },
  mutedCenter: { color: palette.muted, fontSize: 10, marginTop: 7, textAlign: 'center' },
  note: { width: '100%', borderTopWidth: 1, borderTopColor: palette.border, marginTop: 18, paddingTop: 13, alignItems: 'center' },
  noteText: { color: palette.muted, fontSize: 10 },
  sectionTitle: { color: palette.text, fontSize: 13, fontWeight: '800' },
  mutedSmall: { color: palette.muted, fontSize: 9 },
  metrics: { flexDirection: 'row', gap: 9 },
  metric: { flex: 1, backgroundColor: palette.panel, borderWidth: 1, borderColor: palette.border, borderRadius: 16, padding: 12, minHeight: 76 },
  metricLabel: { color: palette.muted, fontSize: 9, textAlign: 'right' },
  metricValueRow: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'flex-end', marginTop: 10 },
  metricValue: { color: palette.text, fontSize: 19, fontWeight: '800' },
  metricUnit: { color: palette.muted, fontSize: 8, marginLeft: 4 },
  footer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 'auto', paddingTop: 18 },
  footerText: { color: '#647489', fontSize: 9 },
  footerDot: { color: palette.accent },
});
