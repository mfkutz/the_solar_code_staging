import React, { useState, useContext } from 'react';
import { useAuth } from '@/auth/AuthProvider.jsx';
import { useI18n } from '@/i18n/I18nProvider.jsx';
import { api } from '@/lib/api.js';
import { DashCtx } from './DashCtx.js';
import CountrySelect from '@/components/CountrySelect.jsx';
import DashboardIcon from '@/components/dashboard/DashboardIcon.jsx';

export default function AjustesSection() {
  const { user, updateUser } = useAuth();
  const { toast } = useContext(DashCtx);
  const { t } = useI18n();
  const s  = t('dashboard.ajustes');
  const sb = t('dashboard.sidebar');

  const [name, setName]       = useState(user?.name || '');
  const [country, setCountry] = useState(user?.country || '');

  const prevUserRef = React.useRef(user);
  if (prevUserRef.current !== user) {
    prevUserRef.current = user;
    if (!country && user?.country) setCountry(user.country);
    if (!name && user?.name)       setName(user.name);
  }
  const [savingProfile, setSavingProfile] = useState(false);

  const bdParts = user?.birthdate ? user.birthdate.split('-') : ['', '', ''];
  const [bd, setBd] = useState({
    y: bdParts[0] || '',
    m: bdParts[1] ? String(parseInt(bdParts[1], 10)) : '',
    d: bdParts[2] ? String(parseInt(bdParts[2], 10)) : '',
  });
  const [savingBd, setSavingBd] = useState(false);

  const [pwd, setPwd]           = useState({ current: '', next: '', confirm: '' });
  const [savingPwd, setSavingPwd] = useState(false);
  const [pwdError, setPwdError]   = useState('');

  const saveProfile = async () => {
    setSavingProfile(true);
    try {
      const data = await api.patch('/auth/profile', {
        name: name.trim() || undefined,
        country: country || undefined,
      });
      updateUser({ name: data.user.name, country: data.user.country });
      toast(s.toastProfileSaved, 'check');
    } catch (e) {
      toast(e?.message || s.toastError, 'alert');
    } finally {
      setSavingProfile(false);
    }
  };

  const bdChanged = (() => {
    if (!user?.birthdate) return !!(bd.y && bd.m && bd.d);
    const [oy, om, od] = user.birthdate.split('-');
    return bd.y !== oy
      || bd.m !== String(parseInt(om, 10))
      || bd.d !== String(parseInt(od, 10));
  })();

  const saveBirthdate = async () => {
    const { y, m, d } = bd;
    if (!y || !m || !d) return;
    const birthdate = `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    setSavingBd(true);
    try {
      const data = await api.patch('/auth/profile', { birthdate });
      updateUser({ birthdate: data.user.birthdate });
      toast(s.toastBdSaved, 'spark');
    } catch (e) {
      toast(e?.message || s.toastError, 'alert');
    } finally {
      setSavingBd(false);
    }
  };

  const savePassword = async () => {
    if (pwd.next.length < 8) { setPwdError(s.pwdMinError); return; }
    if (pwd.next !== pwd.confirm) { setPwdError(s.pwdMatchError); return; }
    setPwdError('');
    setSavingPwd(true);
    try {
      await api.post('/auth/change-password', { currentPassword: pwd.current, newPassword: pwd.next });
      setPwd({ current: '', next: '', confirm: '' });
      toast(s.toastPwdSaved, 'check');
    } catch (e) {
      setPwdError(e?.message || s.toastPwdError);
    } finally {
      setSavingPwd(false);
    }
  };

  const days  = Array.from({ length: 31 }, (_, i) => i + 1);
  const years = Array.from({ length: new Date().getFullYear() - 1929 }, (_, i) => new Date().getFullYear() - i);

  return (
    <div className="db-section">
      <div className="db-page-head">
        <div className="db-eyebrow">{s.eyebrow}</div>
        <h1>{sb.nav['ajustes']}</h1>
        <p className="db-sub">{s.subtitle}</p>
      </div>

      <div className="db-stack">

        {/* Personal data */}
        <div className="db-card" style={{ padding: '28px 30px' }}>
          <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, marginBottom: 22, color: 'var(--db-cream)' }}>
            {s.personalTitle}
          </h3>
          <div className="db-stack" style={{ gap: 16, marginBottom: 22 }}>
            <div className="db-field">
              <label>{s.nameLabel}</label>
              <input
                className="db-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={s.namePh}
                autoComplete="name"
              />
            </div>
            <div className="db-field">
              <label>{s.countryLabel}</label>
              <CountrySelect value={country} onChange={setCountry} />
            </div>
          </div>
          <button className="db-btn db-btn-ghost" disabled={savingProfile} onClick={saveProfile}>
            <DashboardIcon name="check" style={{ width: 16, height: 16 }} />
            {savingProfile ? s.savingBtn : s.saveBtn}
          </button>
        </div>

        {/* Birthdate */}
        <div className="db-card" style={{ padding: '28px 30px' }}>
          <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, marginBottom: 8, color: 'var(--db-cream)' }}>
            {s.bdTitle}
          </h3>
          <p style={{ fontSize: 13.5, color: 'var(--db-muted)', marginBottom: 20, lineHeight: 1.55 }}>
            {s.bdWarning}
          </p>
          <div className="db-field" style={{ marginBottom: 22 }}>
            <label>{s.bdLabel}</label>
            <div className="db-date-row">
              <select className="db-select" value={bd.d} onChange={(e) => setBd((p) => ({ ...p, d: e.target.value }))}>
                <option value="">{s.dayPh}</option>
                {days.map((d) => <option key={d} value={String(d)}>{d}</option>)}
              </select>
              <select className="db-select" value={bd.m} onChange={(e) => setBd((p) => ({ ...p, m: e.target.value }))}>
                <option value="">{s.monthPh}</option>
                {s.months.map((n, i) => <option key={i} value={String(i + 1)}>{n}</option>)}
              </select>
              <select className="db-select" value={bd.y} onChange={(e) => setBd((p) => ({ ...p, y: e.target.value }))}>
                <option value="">{s.yearPh}</option>
                {years.map((y) => <option key={y} value={String(y)}>{y}</option>)}
              </select>
            </div>
          </div>
          <button
            className="db-btn db-btn-ghost"
            disabled={savingBd || !bdChanged || !bd.y || !bd.m || !bd.d}
            onClick={saveBirthdate}
          >
            <DashboardIcon name="spark" style={{ width: 16, height: 16 }} />
            {savingBd ? s.updatingBtn : s.updateBtn}
          </button>
        </div>

        {/* Password */}
        <div className="db-card" style={{ padding: '28px 30px' }}>
          <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, marginBottom: 22, color: 'var(--db-cream)' }}>
            {s.pwdTitle}
          </h3>
          <div className="db-stack" style={{ gap: 16, marginBottom: 22 }}>
            <div className="db-field">
              <label>{s.pwdCurrent}</label>
              <input
                className="db-input"
                type="password"
                value={pwd.current}
                onChange={(e) => setPwd((p) => ({ ...p, current: e.target.value }))}
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </div>
            <div className="db-field">
              <label>{s.pwdNew}</label>
              <input
                className="db-input"
                type="password"
                value={pwd.next}
                onChange={(e) => setPwd((p) => ({ ...p, next: e.target.value }))}
                placeholder={s.pwdNewPh}
                autoComplete="new-password"
              />
            </div>
            <div className="db-field">
              <label>{s.pwdConfirm}</label>
              <input
                className="db-input"
                type="password"
                value={pwd.confirm}
                onChange={(e) => setPwd((p) => ({ ...p, confirm: e.target.value }))}
                placeholder={s.pwdConfirmPh}
                autoComplete="new-password"
              />
            </div>
            {pwdError && (
              <p style={{ fontSize: 13.5, color: 'hsl(0 70% 65%)', marginTop: -4 }}>{pwdError}</p>
            )}
          </div>
          <button
            className="db-btn db-btn-ghost"
            disabled={savingPwd || !pwd.current || !pwd.next || !pwd.confirm}
            onClick={savePassword}
          >
            <DashboardIcon name="lock" style={{ width: 16, height: 16 }} />
            {savingPwd ? s.pwdChangingBtn : s.pwdChangeBtn}
          </button>
        </div>

      </div>
    </div>
  );
}
