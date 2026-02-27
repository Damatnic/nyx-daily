'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  DndContext, closestCenter, DragEndEvent,
  PointerSensor, TouchSensor, useSensor, useSensors,
  KeyboardSensor,
} from '@dnd-kit/core';
import {
  SortableContext, sortableKeyboardCoordinates,
  rectSortingStrategy, arrayMove,
} from '@dnd-kit/sortable';
import { RotateCcw } from 'lucide-react';

import WidgetShell, { WidgetSize } from './WidgetShell';
import type { DailyBriefing, SchoolDeadline } from '@/lib/types';
import type { BriefingPreview } from '@/lib/data';

// ── Sub-components ─────────────────────────────────────────────────────────
import BriefingCarousel from '@/components/briefing/BriefingCarousel';
import NewsSection from '@/components/briefing/NewsSection';
import GithubTrending from '@/components/briefing/GithubTrending';
import RedditHot from '@/components/briefing/RedditHot';
import HackerNewsCard from '@/components/briefing/HackerNewsCard';
import PersonalGitHubCard from '@/components/briefing/PersonalGitHubCard';
import ProductHunt from '@/components/briefing/ProductHunt';
import HiddenGemsSection from '@/components/briefing/HiddenGemsSection';
import AppOfTheDay from '@/components/briefing/AppOfTheDay';
import DailyWisdomCard from '@/components/briefing/DailyWisdomCard';
import YouTubeSection from '@/components/briefing/YouTubeSection';
import ReleasesToday from '@/components/briefing/ReleasesToday';
import WorkoutTracker from '@/components/briefing/WorkoutTracker';
import BreathworkCard from '@/components/briefing/BreathworkCard';
import ArchiveStrip from '@/components/briefing/ArchiveStrip';
import MetaBar from '@/components/briefing/MetaBar';

// ── Layout types ───────────────────────────────────────────────────────────
// Bump version to force-reset any saved layout when defaults change
const STORAGE_KEY = 'nyx-widget-layout-v3';

interface WidgetConfig {
  id: string;
  size: WidgetSize;
  collapsed: boolean;
}

//
// ── NYX'S OPINIONATED DEFAULT LAYOUT ──────────────────────────────────────
//
// Row 1: AI Brief        [full]   — most important, summarizes the entire day
// Row 2: News            [full]   — featured story + tabs need full width
// Row 3: Dev    [half] | Discovery [half]  — interesting finds, same tier
// Row 4: Watch  [third] | Releases [third] | Wellness [third]  — leisure/checklist row
// Row 5: Past Briefings  [full]   — archive, always last
//
// Order MUST keep half+half consecutive and third+third+third consecutive so
// CSS grid auto-placement fills rows correctly.
//
const DEFAULT_LAYOUT: WidgetConfig[] = [
  { id: 'carousel',   size: 'full',  collapsed: false },
  { id: 'news',       size: 'full',  collapsed: false },
  { id: 'dev',        size: 'half',  collapsed: false },
  { id: 'discovery',  size: 'half',  collapsed: false },
  { id: 'watch',      size: 'third', collapsed: false },
  { id: 'releases',   size: 'third', collapsed: false },
  { id: 'wellness',   size: 'third', collapsed: false },
  { id: 'archive',    size: 'full',  collapsed: false },
];

const WIDGET_META: Record<string, { label: string; accent: string }> = {
  carousel:  { label: 'AI Brief',       accent: 'violet' },
  news:      { label: 'News',           accent: 'blue' },
  dev:       { label: 'Dev',            accent: 'cyan' },
  discovery: { label: 'Discovery',      accent: 'amber' },
  wellness:  { label: 'Wellness',       accent: 'emerald' },
  watch:     { label: 'Watch',          accent: 'violet2' },
  releases:  { label: 'Release Radar',  accent: 'rose' },
  archive:   { label: 'Past Briefings', accent: 'slate' },
};

const SIZE_COL: Record<WidgetSize, string> = {
  full:  'col-span-12',
  half:  'col-span-12 lg:col-span-6',
  third: 'col-span-12 lg:col-span-4',
};

// ── Props ──────────────────────────────────────────────────────────────────
interface Props {
  briefing: DailyBriefing;
  streak: number;
  headlineCount: number;
  recentPreviews: BriefingPreview[];
  breathworkFallback: string;
}

// ── Helpers ────────────────────────────────────────────────────────────────
function loadLayout(): WidgetConfig[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return DEFAULT_LAYOUT;
    const parsed: WidgetConfig[] = JSON.parse(saved);
    // Merge: keep saved order/sizes, add any new widgets from defaults
    const savedIds = new Set(parsed.map(w => w.id));
    const merged = [...parsed];
    for (const d of DEFAULT_LAYOUT) {
      if (!savedIds.has(d.id)) merged.push(d);
    }
    return merged;
  } catch { return DEFAULT_LAYOUT; }
}

function saveLayout(layout: WidgetConfig[]) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(layout)); } catch {}
}

// ── Main ───────────────────────────────────────────────────────────────────
export default function WidgetGrid({ briefing, streak, headlineCount, recentPreviews, breathworkFallback }: Props) {
  const [layout, setLayout] = useState<WidgetConfig[]>(DEFAULT_LAYOUT);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setLayout(loadLayout());
    setMounted(true);
  }, []);

  // Persist on change (after mount)
  useEffect(() => {
    if (mounted) saveLayout(layout);
  }, [layout, mounted]);

  // ── DnD sensors ───────────────────────────────────────────────────────
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor,   { activationConstraint: { delay: 200, tolerance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    setLayout(prev => {
      const oldIdx = prev.findIndex(w => w.id === active.id);
      const newIdx = prev.findIndex(w => w.id === over.id);
      return arrayMove(prev, oldIdx, newIdx);
    });
  };

  const setSize = (id: string, size: WidgetSize) =>
    setLayout(prev => prev.map(w => w.id === id ? { ...w, size } : w));

  const toggleCollapse = (id: string) =>
    setLayout(prev => prev.map(w => w.id === id ? { ...w, collapsed: !w.collapsed } : w));

  const resetLayout = () => {
    setLayout(DEFAULT_LAYOUT);
    try { localStorage.removeItem(STORAGE_KEY); } catch {}
  };

  // ── Widget content ─────────────────────────────────────────────────────
  const { news } = briefing;
  const hasDev    = !!(briefing.github_trending?.length || briefing.reddit_hot?.length || briefing.hacker_news?.length || briefing.personal_github?.repos?.length);
  const hasDisc   = !!(briefing.product_hunt?.length || briefing.hidden_gems?.length || briefing.app_of_the_day || briefing.health_tip);
  const hasWatch  = !!briefing.youtube_picks?.length;
  const hasRel    = !!(briefing.releases_today && Object.values(briefing.releases_today).some(a => a.length > 0));
  const hasWell   = !!(briefing.workout?.exercises?.length || briefing.breathwork_session);

  const widgetContent: Record<string, React.ReactNode> = {
    carousel: (
      <div className="flex flex-col gap-4">
        <BriefingCarousel
          tldr={briefing.tldr}
          word={briefing.word_of_the_day}
          facts={briefing.facts_of_the_day}
          onThisDay={briefing.on_this_day}
          apod={briefing.apod}
        />
        <MetaBar briefing={briefing} streak={streak} headlineCount={headlineCount} />
      </div>
    ),

    news: <NewsSection news={briefing.news} />,

    dev: (
      <div className="flex flex-col gap-4">
        {(briefing.github_trending?.length || briefing.reddit_hot?.length) && (
          <div className={`grid gap-4 items-start ${briefing.github_trending?.length && briefing.reddit_hot?.length ? 'md:grid-cols-2' : ''}`}>
            {!!briefing.github_trending?.length && <GithubTrending repos={briefing.github_trending} />}
            {!!briefing.reddit_hot?.length && <RedditHot posts={briefing.reddit_hot} />}
          </div>
        )}
        {(briefing.hacker_news?.length || briefing.personal_github?.repos?.length) && (
          <div className={`grid gap-4 items-start ${briefing.hacker_news?.length && briefing.personal_github?.repos?.length ? 'md:grid-cols-2' : ''}`}>
            {!!briefing.hacker_news?.length && <HackerNewsCard items={briefing.hacker_news} />}
            {(briefing.personal_github?.repos?.length || briefing.personal_github?.prs?.length) && <PersonalGitHubCard data={briefing.personal_github} />}
          </div>
        )}
      </div>
    ),

    discovery: (
      <div className="flex flex-col gap-4">
        {(briefing.product_hunt?.length || briefing.hidden_gems?.length) && (
          <div className={`grid gap-4 items-start ${briefing.product_hunt?.length && briefing.hidden_gems?.length ? 'md:grid-cols-2' : ''}`}>
            {!!briefing.product_hunt?.length && <ProductHunt posts={briefing.product_hunt} />}
            {!!briefing.hidden_gems?.length && <HiddenGemsSection gems={briefing.hidden_gems} />}
          </div>
        )}
        {(briefing.app_of_the_day || briefing.health_tip) && (
          <div className={`grid gap-4 items-start ${briefing.app_of_the_day && briefing.health_tip ? 'md:grid-cols-2' : ''}`}>
            {briefing.app_of_the_day && <AppOfTheDay app={briefing.app_of_the_day} />}
            {(briefing.health_tip || briefing.life_hack || briefing.money_tip) && (
              <DailyWisdomCard health_tip={briefing.health_tip} life_hack={briefing.life_hack} money_tip={briefing.money_tip} />
            )}
          </div>
        )}
      </div>
    ),

    watch: <YouTubeSection videos={briefing.youtube_picks ?? []} />,

    releases: briefing.releases_today ? <ReleasesToday releases={briefing.releases_today} /> : null,

    wellness: (
      <div className={`grid gap-4 items-start ${briefing.workout?.exercises?.length && briefing.breathwork_session ? 'md:grid-cols-2' : ''}`}>
        {!!briefing.workout?.exercises?.length && <WorkoutTracker workout={briefing.workout} date={briefing.date} />}
        {briefing.breathwork_session && <BreathworkCard session={briefing.breathwork_session} fallbackText={breathworkFallback} />}
      </div>
    ),

    archive: <ArchiveStrip previews={recentPreviews} />,
  };

  // Filter to only widgets that have data
  const activeWidgets = layout.filter(w => {
    if (w.id === 'dev')       return hasDev;
    if (w.id === 'discovery') return hasDisc;
    if (w.id === 'watch')     return hasWatch;
    if (w.id === 'releases')  return hasRel;
    if (w.id === 'wellness')  return hasWell;
    if (w.id === 'archive')   return recentPreviews.length > 0;
    if (w.id === 'carousel')  return !!(briefing.tldr?.summary || briefing.word_of_the_day || briefing.on_this_day?.length || briefing.apod);
    if (w.id === 'news')      return !!news;
    return true;
  });

  const ids = activeWidgets.map(w => w.id);

  return (
    <div className="flex flex-col gap-2">
      {/* Reset button */}
      {mounted && (
        <div className="flex justify-end">
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
          <div className="grid grid-cols-12 gap-x-5 gap-y-6 items-start">
            {activeWidgets.map(w => {
              const meta = WIDGET_META[w.id] ?? { label: w.id, accent: 'slate' };
              const content = widgetContent[w.id];
              if (!content) return null;

              return (
                <div key={w.id} className={`${SIZE_COL[w.size]} min-w-0`}>
                  <WidgetShell
                    id={w.id}
                    label={meta.label}
                    accent={meta.accent}
                    size={w.size}
                    collapsed={w.collapsed}
                    onSizeChange={setSize}
                    onCollapseToggle={toggleCollapse}
                  >
                    {content}
                  </WidgetShell>
                </div>
              );
            })}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
