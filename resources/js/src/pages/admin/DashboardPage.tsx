import { useState, type ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Loader2,
  AlertCircle,
  RefreshCw,
  MessageSquare,
  MessagesSquare,
  LayoutTemplate,
  Inbox,
  RotateCcw,
  Plus,
  Flame,
} from 'lucide-react';
import { AppLayout } from '../../components/Layout/AppLayout';
import { useAuthStore } from '../../store/auth.store';
import { dashboardApi, type DashboardStats, type DashboardWeeklyActivity } from '../../api/dashboard.api';
import './dashboard.css';

// ─────────────────────────────────────────────────────────────────────────────
// Mini Calendar
// ─────────────────────────────────────────────────────────────────────────────

const DAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

function getStartOfWeek(d: Date) {
  const date = new Date(d);
  const day = date.getDay();
  const diff = (day + 6) % 7; // Monday = 0
  date.setDate(date.getDate() - diff);
  date.setHours(0, 0, 0, 0);
  return date;
}

function formatWeekRange(start: Date, end: Date) {
  const startMonth = MONTH_NAMES[start.getMonth()].slice(0, 3);
  const endMonth = MONTH_NAMES[end.getMonth()].slice(0, 3);
  const startYear = start.getFullYear();
  const endYear = end.getFullYear();

  if (startYear !== endYear) {
    return `${startMonth} ${start.getDate()}, ${startYear} – ${endMonth} ${end.getDate()}, ${endYear}`;
  }
  if (start.getMonth() !== end.getMonth()) {
    return `${startMonth} ${start.getDate()} – ${endMonth} ${end.getDate()}, ${startYear}`;
  }
  return `${startMonth} ${start.getDate()} – ${end.getDate()}, ${startYear}`;
}

function MiniCalendar() {
  const today = new Date();
  const [startOfWeek, setStartOfWeek] = useState(() => getStartOfWeek(today));

  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(startOfWeek);
    d.setDate(startOfWeek.getDate() + i);
    return d;
  });

  const endOfWeek = weekDays[6];

  const prevWeek = () => {
    const next = new Date(startOfWeek);
    next.setDate(startOfWeek.getDate() - 7);
    setStartOfWeek(next);
  };

  const nextWeek = () => {
    const next = new Date(startOfWeek);
    next.setDate(startOfWeek.getDate() + 7);
    setStartOfWeek(next);
  };

  const isToday = (d: Date) =>
    d.getDate() === today.getDate() &&
    d.getMonth() === today.getMonth() &&
    d.getFullYear() === today.getFullYear();

  return (
    <>
      <div className="dash-cal-nav">
        <button onClick={prevWeek} aria-label="Previous week">&#8249;</button>
        <span>{formatWeekRange(startOfWeek, endOfWeek)}</span>
        <button onClick={nextWeek} aria-label="Next week">&#8250;</button>
      </div>

      <div className="dash-cal-grid">
        {DAY_NAMES.map(d => (
          <span key={d} className="dash-cal-day-name">{d}</span>
        ))}
        {weekDays.map((d) => (
          <span
            key={d.toISOString()}
            className={`dash-cal-day${isToday(d) ? ' today' : ''}`}
          >
            {d.getDate()}
          </span>
        ))}
      </div>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Bar Chart (weekly activity)
// ─────────────────────────────────────────────────────────────────────────────

interface WeeklyBarChartProps {
  data: DashboardWeeklyActivity[];
  totalFormMessages: number;
  totalUserMessages: number;
}

function WeeklyBarChart({ data, totalFormMessages, totalUserMessages }: WeeklyBarChartProps) {
  const maxFm = Math.max(...data.map(d => d.form_messages), 1);
  const maxUm = Math.max(...data.map(d => d.user_messages), 1);
  const maxAll = Math.max(maxFm, maxUm, 1);

  // Show only the last day's bars prominently (like the design)
  // const last = data[data.length - 1];

  return (
    <>
      <div className="dash-stat-num">
        {(totalFormMessages + totalUserMessages).toLocaleString()}
      </div>
      <div className="dash-stat-sub">Total messages this week</div>

      <div className="dash-chart-wrap">
        <div className="dash-bar-group">
          {data.map((d) => {
            const fmH = Math.max((d.form_messages / maxAll) * 100, 4);
            const umH = Math.max((d.user_messages / maxAll) * 100, 4);
            return (
              <div key={d.date} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
                <div
                  className="dash-bar-hatched"
                  style={{ height: `${fmH}%`, width: '100%' }}
                >
                  <div className="dash-bar-label">Forms {d.form_messages}</div>
                </div>
                <div
                  className="dash-bar-solid"
                  style={{ height: `${umH}%`, width: '100%' }}
                  title={`User msgs ${d.user_messages}`}
                />
              </div>
            );
          })}
        </div>
      </div>

      <div className="dash-bar-foot">
        {data.map(d => (
          <span key={d.date}>{d.label}</span>
        ))}
      </div>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Workload Heatmap (weekly_activity → intensity cells)
// ─────────────────────────────────────────────────────────────────────────────

interface WorkloadHeatmapProps {
  data: DashboardWeeklyActivity[];
}

function cellClass(value: number, max: number): string {
  if (value === 0 || max === 0) return 'dash-wl-cell dash-wl-cell--e';
  const ratio = value / max;
  if (ratio < 0.25) return 'dash-wl-cell';
  if (ratio < 0.5) return 'dash-wl-cell dash-wl-cell--m';
  if (ratio < 0.75) return 'dash-wl-cell dash-wl-cell--h';
  return 'dash-wl-cell dash-wl-cell--f';
}

function WorkloadHeatmap({ data }: WorkloadHeatmapProps) {
  const maxFm = Math.max(...data.map(d => d.form_messages), 1);
  const maxUm = Math.max(...data.map(d => d.user_messages), 1);

  return (
    <>
      <div className="dash-wl-legend">
        <div className="dash-wl-dot dash-wl-dot--low"><span /> Low</div>
        <div className="dash-wl-dot dash-wl-dot--medium"><span /> Medium</div>
        <div className="dash-wl-dot dash-wl-dot--high"><span /> High</div>
        <div className="dash-wl-dot dash-wl-dot--full"><span /> Full</div>
      </div>
      <div className="dash-wl-grid-wrap">
        <div className="dash-wl-grid">
          {/* Row: Form Messages */}
          <div className="dash-wl-row-label">Forms</div>
          {data.map(d => (
            <div key={`fm-${d.date}`} className={cellClass(d.form_messages, maxFm)} title={`${d.label}: ${d.form_messages} form msgs`} />
          ))}
          {/* Row: User Messages */}
          <div className="dash-wl-row-label">Chat</div>
          {data.map(d => (
            <div key={`um-${d.date}`} className={cellClass(d.user_messages, maxUm)} title={`${d.label}: ${d.user_messages} chat msgs`} />
          ))}
        </div>
        <div className="dash-wl-col-labels">
          <span />
          {data.map(d => <span key={d.date}>{d.label}</span>)}
        </div>
      </div>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Stat Card (bottom row)
// ─────────────────────────────────────────────────────────────────────────────

interface StatCardProps {
  label: string;
  value: string | number;
  icon: ReactNode;
  trendLabel?: string;
  trendPositive?: boolean;
  trendText?: string;
  href?: string;
}

function DashStatCard({ label, value, icon, trendLabel, trendPositive, trendText, href }: StatCardProps) {
  return (
    <div className="dash-card">
      <div className="dash-card-header">
        <div className="dash-icon-circle">{icon}</div>
        <span className="dash-card-label">{label}</span>
        {href && (
          <a href={href} className="dash-btn-sm">View all</a>
        )}
        <button className="dash-icon-btn" aria-label="Expand">
          <RefreshCw size={12} />
        </button>
      </div>
      <div className="dash-stat-num">{typeof value === 'number' ? value.toLocaleString() : value}</div>
      {trendLabel !== undefined && (
        <div style={{ marginTop: 4 }}>
          <span className={`dash-trend ${trendPositive ? 'dash-trend--pos' : 'dash-trend--neg'}`}>
            {trendPositive ? '+' : ''}{trendLabel}
          </span>
          {trendText && <span className="dash-trend-from">{trendText}</span>}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// DashboardPage
// ─────────────────────────────────────────────────────────────────────────────

function DashboardPage() {
  const user = useAuthStore((s) => s.user);

  const {
    data: res,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => dashboardApi.stats(),
    staleTime: 60_000, // cache for 1 minute
  });

  const stats: DashboardStats | undefined = res?.data?.data;

  // Derive weekly totals for the updates card
  const weeklyFm = stats?.weekly_activity?.reduce((s, d) => s + d.form_messages, 0) ?? 0;
  const weeklyUm = stats?.weekly_activity?.reduce((s, d) => s + d.user_messages, 0) ?? 0;

  // Percentage share labels for bar footer (fallback to 0%)
  const total = weeklyFm + weeklyUm || 1;
  const fmPct = Math.round((weeklyFm / total) * 100);
  const umPct = 100 - fmPct;

  return (
    <div className="dash">
      {/* ── Header ── */}
      <div className="dash-header ">
        <div className="flex gap-4">
          <h1 className="w-full dash-header__title">
            Hi, <span className="dash-header__title-accent">{user?.first_name ?? 'there'}!</span>
          </h1>
          <button
            className="dash-btn-sm"
            onClick={() => refetch()}
            disabled={isFetching}
            title="Refresh"
          >
            <RefreshCw size={10} style={{ display: 'inline', marginRight: 4 }} />
            Refresh
          </button>
        </div>
        <p className="dash-header__sub">Here's what's happening today.</p>
      </div>

      {/* ── Loading ── */}
      {isLoading && (
        <div className="dash-state">
          <Loader2 size={28} className="dash-spin" />
          <span>Loading dashboard…</span>
        </div>
      )}

      {/* ── Error ── */}
      {isError && !isLoading && (
        <div className="dash-state dash-state--error">
          <AlertCircle size={24} />
          <span>Failed to load dashboard stats.</span>
          <button className="dash-btn-sm" onClick={() => refetch()}>
            <RefreshCw size={12} style={{ display: 'inline', marginRight: 4 }} />
            Retry
          </button>
        </div>
      )}

      {/* ── Main content (shown when data is available) ── */}
      {stats && (
        <>
          {/* ══ Main Grid ══════════════════════════════════════════════ */}
          <div className="dash-grid-main">

            {/* Updates / Bar Chart card */}
            <div className="dash-card dash-card--updates">
              <div className="dash-card-header">
                <div className="dash-icon-circle">
                  <MessageSquare size={15} />
                </div>
                <span className="dash-card-label">Weekly Activity</span>
              </div>

              <WeeklyBarChart
                data={stats.weekly_activity}
                totalFormMessages={weeklyFm}
                totalUserMessages={weeklyUm}
              />

              <div className="dash-bar-foot" style={{ marginTop: 12 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span style={{ width: 8, height: 8, background: '#f8b497', borderRadius: 2, display: 'inline-block' }} />
                  Forms {fmPct}%
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span style={{ width: 8, height: 8, background: '#f05a1a', borderRadius: 2, display: 'inline-block' }} />
                  Chat {umPct}%
                </span>
              </div>
            </div>

            {/* Hero card - Popular User Messages */}
            <div className="dash-card--hero">
              <div className="dash-hero-gradient" />
              {/* <div className="dash-hero-orb" /> */}
              <div className="dash-hero-container">
                <div className="dash-hero-header">
                  <div>
                    <div className="dash-hero-badge">
                      <Flame size={12} className="dash-hero-flame-icon" />
                      Trending Prompts
                    </div>
                    <h2 className="dash-hero-title">Popular User Messages</h2>
                  </div>
                  <a href="/admin/user-messages" className="dash-hero-view-all">
                    View all &rarr;
                  </a>
                </div>

                <div className="dash-hero-list">
                  {stats.user_messages.popular && stats.user_messages.popular.length > 0 ? (
                    stats.user_messages.popular.map((item, idx) => {
                      const maxCount = stats.user_messages.popular[0]?.count || 1;
                      const progressPct = Math.max((item.count / maxCount) * 100, 6);
                      return (
                        <div key={item.message} className="dash-hero-item">
                          <span className="dash-hero-rank">#{idx + 1}</span>
                          <div className="dash-hero-item-main">
                            <div className="dash-hero-item-top">
                              <span className="dash-hero-msg-text" title={item.message}>
                                {item.message.slice(0, 50)}
                              </span>
                              <span className="dash-hero-count-pill">
                                {item.count} {item.count === 1 ? 'use' : 'uses'} ({item.percentage}%)
                              </span>
                            </div>
                            <div className="dash-hero-progress-bar">
                              <div
                                className="dash-hero-progress-fill"
                                style={{ width: `${progressPct}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="dash-hero-empty">
                      No popular user messages recorded yet.
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Calendar card */}
            <div className="dash-card dash-card--calendar">
              <MiniCalendar />

              <div className="dash-cal-tasks">
                <div className="dash-cal-task">
                  <h4>Form Messages</h4>
                  <p>
                    {stats.form_messages.unread > 0
                      ? `${stats.form_messages.unread} unread message${stats.form_messages.unread > 1 ? 's' : ''} waiting for a reply.`
                      : 'All messages are read — great work!'}
                  </p>
                  <div className="dash-cal-task-foot">
                    <div className="dash-avatars">
                      <div className="dash-av" style={{ background: '#fde8db', color: '#f05a1a' }}>FM</div>
                    </div>
                    <span className="dash-time-label">
                      <Inbox size={11} /> {stats.form_messages.total} total
                    </span>
                  </div>
                </div>

                <div className="dash-cal-task">
                  <h4>Chat Messages</h4>
                  <p>{stats.user_messages.this_week} new chat messages received this week.</p>
                  <div className="dash-cal-task-foot">
                    <div className="dash-avatars">
                      <div className="dash-av" style={{ background: '#c4d8f8', color: '#1040a0' }}>UM</div>
                    </div>
                    <span className="dash-time-label">
                      <MessagesSquare size={11} /> {stats.user_messages.total} total
                    </span>
                  </div>
                </div>
              </div>

              <a href="/admin/form-messages" className="dash-btn-appt">
                <Plus size={14} />
                View Form Messages
              </a>
            </div>
          </div>
          {/* ══ /Main Grid ══════════════════════════════════════════════ */}

          {/* ══ Bottom Grid ═════════════════════════════════════════════ */}
          <div className="dash-grid-bottom">

            {/* 4 Stat cards in a 2×2 sub-grid */}
            <div className="dash-grid-bottom-left">

              {/* Form Messages stat */}
              <DashStatCard
                label="Form Messages"
                value={stats.form_messages.total}
                icon={<MessageSquare size={15} />}
                trendLabel={stats.form_messages.unread.toString()}
                trendPositive={stats.form_messages.unread === 0}
                trendText="unread"
                href="/admin/form-messages"
              />

              {/* Unread / New messages stat */}
              <DashStatCard
                label="Unread Inbox"
                value={stats.form_messages.unread}
                icon={<Inbox size={15} />}
                trendLabel={stats.form_messages.counts.replied.toString()}
                trendPositive={true}
                trendText="already replied"
                href="/admin/form-messages"
              />

              {/* User / Chat messages stat */}
              <DashStatCard
                label="Chat Messages"
                value={stats.user_messages.total}
                icon={<MessagesSquare size={15} />}
                trendLabel={stats.user_messages.this_week.toString()}
                trendPositive={stats.user_messages.this_week > 0}
                trendText="this week"
                href="/admin/user-messages"
              />

              {/* Content sections stat */}
              <DashStatCard
                label="Content Sections"
                value={stats.content_sections.total}
                icon={<LayoutTemplate size={15} />}
                trendLabel={stats.content_sections.last_updated
                  ? new Date(stats.content_sections.last_updated).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                  : 'Never'}
                trendPositive={!!stats.content_sections.last_updated}
                trendText="last updated"
                href="/admin/content"
              />
            </div>

            {/* Weekly Workload Heatmap */}
            <div className="dash-card dash-card--workload">
              <div className="dash-card-header">
                <div className="dash-icon-circle">
                  <RotateCcw size={15} />
                </div>
                <span className="dash-card-label">Weekly Workload</span>
                <button className="dash-icon-btn" onClick={() => refetch()} disabled={isFetching} title="Refresh">
                  <RefreshCw size={12} />
                </button>
              </div>

              <WorkloadHeatmap data={stats.weekly_activity} />
            </div>
          </div>
          {/* ══ /Bottom Grid ════════════════════════════════════════════ */}
        </>
      )}
    </div>
  );
}

DashboardPage.layout = (page: ReactNode) => <AppLayout>{page}</AppLayout>;

export default DashboardPage;
