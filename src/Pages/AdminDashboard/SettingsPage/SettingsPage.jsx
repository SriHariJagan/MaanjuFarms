import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Palette,
  Shield,
  Info,
  Sun,
  Moon,
  Monitor,
  LogOut,
  Check,
  AlertCircle,
  Mail,
  BadgeCheck,
  CalendarDays,
  Lock,
  Fingerprint,
  PanelLeft,
  Table2,
  Activity,
} from "lucide-react";
import { useAuth } from "../../../Store/useContext";
import styles from "./SettingsPage.module.css";

const TABS = [
  { key: "general", label: "General", icon: User },
  { key: "appearance", label: "Appearance", icon: Palette },
  { key: "security", label: "Security", icon: Shield },
  { key: "about", label: "About", icon: Info },
];

const DENSITIES = [
  { key: "comfortable", label: "Comfortable" },
  { key: "compact", label: "Compact" },
];

const RADII = [
  { key: "small", label: "Small" },
  { key: "medium", label: "Medium" },
  { key: "large", label: "Large" },
];

const loadPref = (key, fallback) => {
  try {
    const val = localStorage.getItem(`settings_${key}`);
    return val !== null ? JSON.parse(val) : fallback;
  } catch {
    return fallback;
  }
};

const savePref = (key, value) => {
  localStorage.setItem(`settings_${key}`, JSON.stringify(value));
};

const SelectorGroup = ({ label, options, value, onChange }) => (
  <div className={styles.prefGroup}>
    <span className={styles.prefLabel}>{label}</span>
    <div className={styles.selectorRow}>
      {options.map((opt) => (
        <button
          key={opt.key}
          className={`${styles.selectorBtn} ${value === opt.key ? styles.selectorBtnActive : ""}`}
          onClick={() => onChange(opt.key)}
        >
          {opt.label}
          {value === opt.key && <Check size={12} className={styles.selectorCheck} />}
        </button>
      ))}
    </div>
  </div>
);

const ToggleCard = ({ icon: Icon, label, desc, value, onChange }) => (
  <label className={styles.toggleCard}>
    <div className={styles.toggleCardLeft}>
      <span className={styles.toggleIcon}>
        <Icon size={18} />
      </span>
      <div>
        <span className={styles.toggleLabel}>{label}</span>
        {desc && <span className={styles.toggleDesc}>{desc}</span>}
      </div>
    </div>
    <div className={`${styles.toggle} ${value ? styles.toggleOn : ""}`} onClick={() => onChange(!value)}>
      <div className={styles.toggleKnob} />
    </div>
  </label>
);

const SettingsHeader = () => (
  <motion.div
    className={styles.pageHeader}
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
  >
    <div>
      <h1 className={styles.pageTitle}>Settings</h1>
      <p className={styles.pageSubtitle}>Manage your administrator account and application preferences.</p>
    </div>
  </motion.div>
);

const SettingsTabs = ({ active, onChange }) => (
  <div className={styles.tabs}>
    {TABS.map((tab) => (
      <button
        key={tab.key}
        className={`${styles.tab} ${active === tab.key ? styles.tabActive : ""}`}
        onClick={() => onChange(tab.key)}
      >
        <tab.icon size={16} />
        <span>{tab.label}</span>
      </button>
    ))}
  </div>
);

const GeneralSettings = ({ user }) => {
  const createdDate = user?.createdAt || user?.created || user?.created_at;

  return (
    <motion.div
      className={styles.tabContent}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className={styles.profileCard}>
        <div className={styles.profileAvatar}>
          <span>{user?.name ? user.name.charAt(0).toUpperCase() : "A"}</span>
        </div>
        <div className={styles.profileInfo}>
          <h2 className={styles.profileName}>{user?.name || "Admin"}</h2>
          <div className={styles.profileMeta}>
            <span className={styles.profileEmail}>
              <Mail size={13} />
              {user?.email || "—"}
            </span>
            <span className={styles.profileRole}>
              <BadgeCheck size={13} />
              {user?.role || "admin"}
            </span>
          </div>
          {createdDate && (
            <span className={styles.profileDate}>
              <CalendarDays size={13} />
              Joined {new Date(createdDate).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
            </span>
          )}
        </div>
      </div>

      <div className={styles.sectionCard}>
        <div className={styles.sectionHeader}>
          <h3 className={styles.sectionTitle}>Profile Information</h3>
          <p className={styles.sectionSub}>Your account details are managed on the server.</p>
        </div>
        <div className={styles.infoGrid}>
          <div className={styles.infoItem}>
            <label>Full Name</label>
            <p>{user?.name || "—"}</p>
          </div>
          <div className={styles.infoItem}>
            <label>Email Address</label>
            <p>{user?.email || "—"}</p>
          </div>
          <div className={styles.infoItem}>
            <label>Role</label>
            <p className={styles.capitalize}>{user?.role || "—"}</p>
          </div>
          <div className={styles.infoItem}>
            <label>Account ID</label>
            <p className={styles.mono}>{user?._id || "—"}</p>
          </div>
        </div>
        <div className={styles.disabledNote}>
          <AlertCircle size={14} />
          <span>Profile editing is not available. Contact the developer to enable it.</span>
        </div>
      </div>
    </motion.div>
  );
};

const AppearanceSettings = () => {
  const [theme, setTheme] = useState(() => loadPref("theme", "light"));
  const [sidebar, setSidebar] = useState(() => loadPref("sidebar", "expanded"));
  const [density, setDensity] = useState(() => loadPref("density", "comfortable"));
  const [radius, setRadius] = useState(() => loadPref("radius", "medium"));
  const [animations, setAnimations] = useState(() => loadPref("animations", true));
  const [saved, setSaved] = useState(false);

  const persist = useCallback((key, val) => {
    savePref(key, val);
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  }, []);

  return (
    <motion.div
      className={styles.tabContent}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className={styles.sectionCard}>
        <div className={styles.sectionHeader}>
          <h3 className={styles.sectionTitle}>Theme</h3>
          <p className={styles.sectionSub}>Choose your preferred appearance.</p>
        </div>
        <SelectorGroup
          label="Color Scheme"
          options={[
            { key: "light", label: "Light", icon: Sun },
            { key: "dark", label: "Dark", icon: Moon },
            { key: "system", label: "System", icon: Monitor },
          ]}
          value={theme}
          onChange={(v) => { setTheme(v); persist("theme", v); }}
        />
        <SelectorGroup
          label="Card Radius"
          options={RADII}
          value={radius}
          onChange={(v) => { setRadius(v); persist("radius", v); }}
        />
      </div>

      <div className={styles.sectionCard}>
        <div className={styles.sectionHeader}>
          <h3 className={styles.sectionTitle}>Layout</h3>
          <p className={styles.sectionSub}>Customize the dashboard layout.</p>
        </div>
        <SelectorGroup
          label="Sidebar"
          options={[
            { key: "expanded", label: "Expanded", icon: PanelLeft },
            { key: "collapsed", label: "Collapsed", icon: PanelLeft },
          ]}
          value={sidebar}
          onChange={(v) => { setSidebar(v); persist("sidebar", v); }}
        />
        <SelectorGroup
          label="Table Density"
          options={DENSITIES}
          value={density}
          onChange={(v) => { setDensity(v); persist("density", v); }}
        />
      </div>

      <div className={styles.sectionCard}>
        <div className={styles.sectionHeader}>
          <h3 className={styles.sectionTitle}>Preferences</h3>
          <p className={styles.sectionSub}>Toggle additional dashboard features.</p>
        </div>
        <ToggleCard icon={Sun} label="Dark Mode" desc="Switch between light and dark themes." value={theme === "dark"} onChange={(v) => { setTheme(v ? "dark" : "light"); persist("theme", v ? "dark" : "light"); }} />
        <ToggleCard icon={PanelLeft} label="Sidebar Collapse" desc="Minimize the sidebar for more space." value={sidebar === "collapsed"} onChange={(v) => { setSidebar(v ? "collapsed" : "expanded"); persist("sidebar", v ? "collapsed" : "expanded"); }} />
        <ToggleCard icon={Activity} label="Enable Animations" desc="Show animated transitions throughout the dashboard." value={animations} onChange={(v) => { setAnimations(v); persist("animations", v); }} />
        <ToggleCard icon={Table2} label="Compact Tables" desc="Use compact table row heights." value={density === "compact"} onChange={(v) => { setDensity(v ? "compact" : "comfortable"); persist("density", v ? "compact" : "comfortable"); }} />
      </div>

      <AnimatePresence>
        {saved && (
          <motion.div className={styles.savedBadge} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <Check size={14} />
            Preferences saved
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const SecuritySettings = ({ user, onLogout }) => {
  return (
    <motion.div
      className={styles.tabContent}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className={styles.sectionCard}>
        <div className={styles.sectionHeader}>
          <h3 className={styles.sectionTitle}>Current Session</h3>
          <p className={styles.sectionSub}>Details about your active session.</p>
        </div>
        <div className={styles.infoGrid}>
          <div className={styles.infoItem}>
            <label>Logged In As</label>
            <p>{user?.name || "—"}</p>
          </div>
          <div className={styles.infoItem}>
            <label>Role</label>
            <p className={styles.capitalize}>{user?.role || "—"}</p>
          </div>
          <div className={styles.infoItem}>
            <label>Authentication</label>
            <p>JWT Token</p>
          </div>
          <div className={styles.infoItem}>
            <label>Token Status</label>
            <p className={styles.statusActive}>
              <span className={styles.statusDot} />
              Active
            </p>
          </div>
        </div>
      </div>

      <div className={styles.sectionCard}>
        <div className={styles.sectionHeader}>
          <h3 className={styles.sectionTitle}>Change Password</h3>
          <p className={styles.sectionSub}>Update your account password.</p>
        </div>
        <div className={styles.disabledNote}>
          <Lock size={14} />
          <span>Password change is not available via the current API. TODO: Implement PUT /api/auth/password endpoint.</span>
        </div>
      </div>

      <div className={styles.sectionCard}>
        <div className={styles.sectionHeader}>
          <h3 className={styles.sectionTitle}>Sessions</h3>
          <p className={styles.sectionSub}>Manage active sessions.</p>
        </div>
        <div className={styles.disabledNote}>
          <Fingerprint size={14} />
          <span>Session management is not available. TODO: Implement session tracking on the backend.</span>
        </div>
      </div>

      <motion.button
        className={styles.logoutBtn}
        onClick={onLogout}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
      >
        <LogOut size={16} />
        <span>Logout</span>
      </motion.button>
    </motion.div>
  );
};

const AboutSettings = () => {
  const [gitInfo, setGitInfo] = useState(null);

  useEffect(() => {
    const fetchGit = async () => {
      try {
        const res = await fetch("/__git_info.json");
        if (res.ok) {
          const data = await res.json();
          setGitInfo(data);
        }
      } catch {
        /* silent */
      }
    };
    fetchGit();
  }, []);

  const info = [
    { label: "Application", value: "Maanju Farms Admin" },
    { label: "Version", value: "1.0.0" },
    { label: "Frontend", value: "React 19 + Vite 8" },
    { label: "Styling", value: "CSS Modules + Tailwind CSS 3" },
    { label: "State", value: "React Context API" },
    { label: "Charts", value: "Recharts" },
    { label: "Animations", value: "Framer Motion 12" },
    { label: "Icons", value: "Lucide React" },
    { label: "HTTP Client", value: "Axios" },
    { label: "Payments", value: "Razorpay" },
    { label: "Backend", value: "Node.js / Express" },
    { label: "Database", value: "MongoDB" },
    { label: "Environment", value: import.meta.env.MODE || "production" },
  ];

  if (gitInfo?.commit) {
    info.push({ label: "Git Commit", value: gitInfo.commit.slice(0, 8) });
  }

  return (
    <motion.div
      className={styles.tabContent}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className={styles.sectionCard}>
        <div className={styles.sectionHeader}>
          <h3 className={styles.sectionTitle}>Application Information</h3>
          <p className={styles.sectionSub}>Technical details about this dashboard.</p>
        </div>
        <div className={styles.aboutGrid}>
          {info.map((item) => (
            <div key={item.label} className={styles.aboutItem}>
              <span className={styles.aboutLabel}>{item.label}</span>
              <span className={styles.aboutValue}>{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.sectionCard}>
        <div className={styles.sectionHeader}>
          <h3 className={styles.sectionTitle}>Developer</h3>
          <p className={styles.sectionSub}>Built with care for Maanju Farms.</p>
        </div>
        <div className={styles.aboutGrid}>
          <div className={styles.aboutItem}>
            <span className={styles.aboutLabel}>Framework</span>
            <span className={styles.aboutValue}>React 19 + Vite 8</span>
          </div>
          <div className={styles.aboutItem}>
            <span className={styles.aboutLabel}>Repository</span>
            <span className={styles.aboutValue}>Git — see commit history</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const SettingsPage = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("general");

  return (
    <motion.div
      className={styles.settingsPage}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <SettingsHeader />
      <SettingsTabs active={activeTab} onChange={setActiveTab} />
      <div className={styles.tabPanel}>
        {activeTab === "general" && <GeneralSettings user={user} />}
        {activeTab === "appearance" && <AppearanceSettings />}
        {activeTab === "security" && <SecuritySettings user={user} onLogout={logout} />}
        {activeTab === "about" && <AboutSettings />}
      </div>
    </motion.div>
  );
};

export default SettingsPage;
