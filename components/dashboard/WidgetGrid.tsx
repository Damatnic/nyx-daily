'use client';

import { useState, useEffect } from 'react';
import {
  DndContext, closestCenter, DragEndEvent,
  PointerSensor, TouchSensor, useSensor, useSensors, KeyboardSensor,
} from '@dnd-kit/core';
import {
  SortableContext, sortableKeyboardCoordinates,
  rectSortingStrategy, arrayMove,
} from '@dnd-kit/sortable';
import { RotateCcw, Eye } from 'lucide-react';

import WidgetShell, { WidgetSize } from './WidgetShell';
import type { DailyBriefing } from '@/lib/types';
import type { BriefingPreview } from '@/lib/data';

import BriefingCarousel   from '@/components/briefing/BriefingCarousel';
import NewsSection        from '@/components/briefing/NewsSection';
import GithubTrending     from '@/components/briefing/GithubTrending';
import RedditHot          from '@/components/briefing/RedditHot';
import HackerNewsCard     from '@/components/briefing/HackerNewsCard';
import PersonalGitHubCard from '@/components/briefing/PersonalGitHubCard';
import ProductHunt        from '@/components/briefing/ProductHunt';
import HiddenGemsSection  from '@/components/briefing/HiddenGemsSection';
import AppOfTheDay        from '@/components/briefing/AppOfTheDay';
import DailyWisdomCard    from '@/components/briefing/DailyWisdomCard';
import YouTubeSection     from '@/components/briefing/YouTubeSection';
import ReleasesToday      from '@/components/briefing/ReleasesToday';
import WorkoutTracker     from '@/components/briefing/WorkoutTracker';
import BreathworkCard     from '@/components/briefing/BreathworkCard';
import WellnessCard       from '@/components/briefing/WellnessCard';
import HighlightsPanel    from '@/components/briefing/HighlightsPanel';
import TrendingStack      from '@/components/briefing/TrendingStack';
import ArchiveStrip       from '@/components/briefing/ArchiveStrip';
import MetaBar            from '@/components/briefing/MetaBar';

// ── Types ──────────────────────────────────────────────────────────────────
const STORAGE_KEY = 'nyx-widget-layout-v9';

interface WidgetConfig { id: string; size: WidgetSize; collapsed: boolean; visible: boolean }

const SIZE_COL: Record<WidgetSize, string> = {
  full:  'col-span-12',
  half:  'col-span-12 lg:col-span-6',
  third: 'col-span-12 lg:col-span-4',
};

// ── Widget catalogue ───────────────────────────────────────────────────────
// Every card is its own entry. Pair halves consecutively so CSS grid
// auto-placement puts them side-by-side on lg screens.
//
// Default layout:
//   Row 1  carousel         [full]
//   Row 2  news             [full]
//   Row 3  github   [half]  |  reddit         [half]
//   Row 4  hackernews[half] |  personal_github [half]
//   Row 5  producthunt[half]|  hidden_gems     [half]
//   Row 6  app_of_day[half] |  daily_wisdom    [half]
//   Row 7  youtube  [half]  |  releases        [half]
//   Row 8  workout  [half]  |  breathwork      [half]
//   Row 9  archive         [full]
//
const DEFAULT_LAYOUT: WidgetConfig[] = [
  // ── ACT ZONE ─────────────────────────────────────────────────────────────
  // Expanded by default — orient + act on your day immediately
  { id: 'carousel',        size: 'full', collapsed: false, visible: true },
  { id: 'wellness',        size: 'half', collapsed: false, visible: true },
  { id: 'trending_stack',  size: 'half', collapsed: false, visible: true },
  // Legacy single widgets kept for backward compat (hidden by default)
  { id: 'workout',         size: 'half', collapsed: false, visible: false },
  { id: 'breathwork',      size: 'half', collapsed: false, visible: false },

  // ── READ ZONE ────────────────────────────────────────────────────────────
  // Core news + dev feeds — scan, don't drown
  { id: 'news',            size: 'full', collapsed: false, visible: true },
  { id: 'github',          size: 'half', collapsed: false, visible: true },
  { id: 'hackernews',      size: 'half', collapsed: false, visible: true },
  { id: 'personal_github', size: 'full', collapsed: false, visible: true },

  // ── DISCOVERY ZONE ───────────────────────────────────────────────────────
  // Collapsed by default — expand when you have time to browse
  { id: 'reddit',          size: 'half', collapsed: true,  visible: true },
  { id: 'producthunt',     size: 'half', collapsed: true,  visible: true },
  { id: 'hidden_gems',     size: 'half', collapsed: true,  visible: true },
  { id: 'app_of_day',      size: 'half', collapsed: true,  visible: true },
  { id: 'daily_wisdom',    size: 'half', collapsed: true,  visible: true },
  { id: 'youtube',         size: 'half', collapsed: true,  visible: true },
  { id: 'releases',        size: 'half', collapsed: true,  visible: true },

  // ── ARCHIVE ──────────────────────────────────────────────────────────────
  { id: 'archive',         size: 'full', collapsed: false, visible: true },
];

const WIDGET_META: Record<string, { label: string; accent: string }> = {
  carousel:        { label: 'AI Brief',        accent: 'violet'  },
  news:            { label: 'News',            accent: 'blue'    },
  github:          { label: 'GitHub Trending', accent: 'cyan'    },
  reddit:          { label: 'Reddit',          accent: 'slate'   },
  hackernews:      { label: 'Hacker News',     accent: 'amber'   },
  personal_github: { label: 'My Activity',     accent: 'cyan'    },
  producthunt:     { label: 'Product Hunt',    accent: 'amber'   },
  hidden_gems:     { label: 'Hidden Gems',     accent: 'emerald' },
  app_of_day:      { label: 'App of the Day',  accent: 'violet'  },
  daily_wisdom:    { label: 'Daily Wisdom',    accent: 'rose'    },
  youtube:         { label: 'Watch',           accent: 'rose'    },
  releases:        { label: 'Release Radar',   accent: 'rose'    },
  wellness:        { label: 'Wellness',        accent: 'cyan'    },
  trending_stack:  { label: 'Trending',        accent: 'orange'  },
  highlights:      { label: 'Today',           accent: 'violet'  },
  workout:         { label: 'Workout',         accent: 'emerald' },
  breathwork:      { label: 'Breathwork',      accent: 'emerald' },
  archive:         { label: 'Past Briefings',  accent: 'slate'   },
};

// ── Helpers ────────────────────────────────────────────────────────────────
function loadLayout(): WidgetConfig[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return DEFAULT_LAYOUT;
    const parsed: WidgetConfig[] = JSON.parse(saved);
    // Migrate: fill in visible:true for any old entries that lack it
    const migrated = parsed.map(w => ({ ...w, visible: w.visible ?? true }));
    const savedIds = new Set(migrated.map(w => w.id));
    const merged = [...migrated];
    for (const d of DEFAULT_LAYOUT) {
      if (!savedIds.has(d.id)) merged.push(d);
    }
    return merged;
  } catch { return DEFAULT_LAYOUT; }
}

function saveLayout(layout: WidgetConfig[]) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(layout)); } catch {}
}

// ── Props ──────────────────────────────────────────────────────────────────
interface Props {
  briefing: DailyBriefing;
  streak: number;
  headlineCount: number;
  recentPreviews: BriefingPreview[];
  breathworkFallback: string;
}

// ── Component ──────────────────────────────────────────────────────────────
export default function WidgetGrid({ briefing, streak, headlineCount, recentPreviews, breathworkFallback }: Props) {
  const [layout, setLayout] = useState<WidgetConfig[]>(DEFAULT_LAYOUT);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setLayout(loadLayout()); setMounted(true); }, []);
  useEffect(() => { if (mounted) saveLayout(layout); }, [layout, mounted]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor,   { activationConstraint: { delay: 200, tolerance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    setLayout(prev => {
      const o = prev.findIndex(w => w.id === active.id);
      const n = prev.findIndex(w => w.id === over.id);
      return arrayMove(prev, o, n);
    });
  };

  const setSize     = (id: string, size: WidgetSize) => setLayout(p => p.map(w => w.id === id ? { ...w, size }                  : w));
  const toggleCol   = (id: string)                   => setLayout(p => p.map(w => w.id === id ? { ...w, collapsed: !w.collapsed } : w));
  const hideWidget  = (id: string)                   => setLayout(p => p.map(w => w.id === id ? { ...w, visible: false }          : w));
  const showWidget  = (id: string)                   => setLayout(p => p.map(w => w.id === id ? { ...w, visible: true }           : w));
  const resetLayout = () => { setLayout(DEFAULT_LAYOUT); try { localStorage.removeItem(STORAGE_KEY); } catch {} };

  // ── Has-data guards ──────────────────────────────────────────────────────
  const hasData: Record<string, boolean> = {
    carousel:        !!(briefing.tldr?.summary || briefing.word_of_the_day || briefing.on_this_day?.length || briefing.apod),
    news:            !!briefing.news,
    github:          !!briefing.github_trending?.length,
    reddit:          !!briefing.reddit_hot?.length,
    hackernews:      !!briefing.hacker_news?.length,
    personal_github: !!(briefing.personal_github?.repos?.length || briefing.personal_github?.prs?.length),
    producthunt:     !!briefing.product_hunt?.length,
    hidden_gems:     !!briefing.hidden_gems?.length,
    app_of_day:      !!briefing.app_of_the_day,
    daily_wisdom:    !!(briefing.health_tip || briefing.life_hack || briefing.money_tip),
    youtube:         !!briefing.youtube_picks?.length,
    releases:        !!(briefing.releases_today && Object.values(briefing.releases_today).some(a => a.length > 0)),
    wellness:        !!(briefing.workout?.exercises?.length || briefing.workout?.is_rest_day || briefing.breathwork),
    trending_stack:  true,
    highlights:      true,
    workout:         !!briefing.workout?.exercises?.length,
    breathwork:      !!briefing.breathwork_session,
    archive:         recentPreviews.length > 0,
  };

  // ── Widget content map ───────────────────────────────────────────────────
  const content: Record<string, React.ReactNode> = {
    carousel: (
      <div className="flex flex-col gap-4">
        <BriefingCarousel
          tldr={briefing.tldr}
          word={briefing.word_of_the_day}
          facts={briefing.facts_of_the_day}
          onThisDay={briefing.on_this_day}
          apod={briefing.apod}
          sourceCount={headlineCount}
        />
        <MetaBar briefing={briefing} streak={streak} headlineCount={headlineCount} />
      </div>
    ),
    news:            <NewsSection        news={briefing.news} />,
    github:          <GithubTrending     repos={briefing.github_trending ?? []} />,
    reddit:          <RedditHot          posts={briefing.reddit_hot ?? []} />,
    hackernews:      <HackerNewsCard     items={briefing.hacker_news ?? []} />,
    personal_github: <PersonalGitHubCard data={briefing.personal_github} />,
    producthunt:     <ProductHunt        posts={briefing.product_hunt ?? []} />,
    hidden_gems:     <HiddenGemsSection  gems={briefing.hidden_gems ?? []} />,
    app_of_day:      <AppOfTheDay        app={briefing.app_of_the_day!} />,
    daily_wisdom:    <DailyWisdomCard    health_tip={briefing.health_tip} life_hack={briefing.life_hack} money_tip={briefing.money_tip} />,
    youtube:         <YouTubeSection     videos={briefing.youtube_picks ?? []} />,
    releases:        briefing.releases_today ? <ReleasesToday releases={briefing.releases_today} /> : null,
    wellness: (
      <WellnessCard
        workout={briefing.workout}
        breathwork={briefing.breathwork ?? undefined}
        date={briefing.date}
      />
    ),
    trending_stack: <TrendingStack briefing={briefing} />,
    highlights: <HighlightsPanel briefing={briefing} streak={streak} />,
    workout:         <WorkoutTracker     workout={briefing.workout!} date={briefing.date} />,
    breathwork:      <BreathworkCard     session={briefing.breathwork_session!} fallbackText={breathworkFallback} />,
    archive:         <ArchiveStrip       previews={recentPreviews} />,
  };

  const active  = layout.filter(w => hasData[w.id] && w.visible !== false);
  const hidden  = layout.filter(w => hasData[w.id] && w.visible === false);
  const ids     = active.map(w => w.id);

  // ── Zone separator logic ────────────────────────────────────────────────
  // Widgets classified as "act" (things you do, not read)
  const ACT_WIDGETS = new Set(['carousel', 'wellness', 'trending_stack', 'highlights', 'workout', 'breathwork']);

  type RenderItem =
    | { type: 'widget'; widget: WidgetConfig }
    | { type: 'separator'; key: string; label: string };

  const renderItems: RenderItem[] = [];
  let prevZone: 'act' | 'browse' | '' = '';
  for (const w of active) {
    const zone: 'act' | 'browse' = ACT_WIDGETS.has(w.id) ? 'act' : 'browse';
    if (prevZone === 'act' && zone === 'browse') {
      renderItems.push({ type: 'separator', key: 'sep-browse', label: 'Discovery' });
    }
    renderItems.push({ type: 'widget', widget: w });
    prevZone = zone;
  }

  return (
    <div className="flex flex-col gap-2">
      {mounted && (
        <div className="flex items-center justify-end gap-3">
          {hidden.length > 0 && (
            <span className="text-[10px] text-slate-600">
              {hidden.length} hidden
            </span>
          )}
          <button
            onClick={resetLayout}
            className="flex items-center gap-1.5 text-[10px] text-slate-700 hover:text-slate-400 transition-colors px-2 py-1"
            title="Reset widget layout to defaults"
          >
            <RotateCcw size={10} />
            reset layout
          </button>
        </div>
      )}

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={ids} strategy={rectSortingStrategy}>
          <div className="grid grid-cols-12 gap-x-5 gap-y-7 items-start">
            {renderItems.map(item => {
              if (item.type === 'separator') {
                return (
                  <div key={item.key} className="col-span-12 flex items-center gap-4 pt-2 pb-1 pointer-events-none select-none">
                    <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.04)' }} />
                    <span className="text-[9px] uppercase tracking-[0.25em] text-slate-700 font-semibold px-1">
                      {item.label}
                    </span>
                    <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.04)' }} />
                  </div>
                );
              }
              const w = item.widget;
              const node = content[w.id];
              if (!node) return null;
              const meta = WIDGET_META[w.id] ?? { label: w.id, accent: 'slate' };
              return (
                <div key={w.id} className={`${SIZE_COL[w.size]} min-w-0`}>
                  <WidgetShell
                    id={w.id}
                    label={meta.label}
                    accent={meta.accent}
                    size={w.size}
                    collapsed={w.collapsed}
                    onSizeChange={setSize}
                    onCollapseToggle={toggleCol}
                    onHide={hideWidget}
                  >
                    {node}
                  </WidgetShell>
                </div>
              );
            })}
          </div>
        </SortableContext>
      </DndContext>

      {/* Hidden widgets restore strip */}
      {mounted && hidden.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2 items-center">
          <span className="text-[9px] uppercase tracking-widest text-slate-700 mr-1">Hidden:</span>
          {hidden.map(w => {
            const meta = WIDGET_META[w.id] ?? { label: w.id, accent: 'slate' };
            return (
              <button
                key={w.id}
                onClick={() => showWidget(w.id)}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-white/[0.07]
                           bg-white/[0.02] text-[10px] text-slate-600 hover:text-slate-300
                           hover:border-white/[0.15] transition-all duration-150"
                title={`Restore ${meta.label}`}
              >
                <Eye size={9} />
                {meta.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
