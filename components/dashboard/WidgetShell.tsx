'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, ChevronDown, X } from 'lucide-react';

export type WidgetSize = 'full' | 'half' | 'third';

const SIZE_CYCLE: WidgetSize[] = ['full', 'half', 'third'];
const SIZE_NEXT_LABEL: Record<WidgetSize, string> = {
  full:  '½',
  half:  '⅓',
  third: '■',
};
const SIZE_LABEL: Record<WidgetSize, string> = {
  full:  'full',
  half:  '½',
  third: '⅓',
};

const ACCENT: Record<string, { text: string; dot: string }> = {
  violet:  { text: 'text-violet-400/80',  dot: 'bg-violet-400/70' },
  blue:    { text: 'text-blue-400/80',    dot: 'bg-blue-400/70' },
  cyan:    { text: 'text-cyan-500/70',    dot: 'bg-cyan-500/60' },
  amber:   { text: 'text-amber-500/70',   dot: 'bg-amber-500/60' },
  emerald: { text: 'text-emerald-500/70', dot: 'bg-emerald-500/60' },
  rose:    { text: 'text-rose-400/80',    dot: 'bg-rose-400/70' },
  slate:   { text: 'text-slate-500',      dot: 'bg-slate-600' },
};

interface Props {
  id: string;
  label: string;
  accent?: string;
  size: WidgetSize;
  collapsed: boolean;
  onSizeChange: (id: string, size: WidgetSize) => void;
  onCollapseToggle: (id: string) => void;
  onHide: (id: string) => void;
  children: React.ReactNode;
}

export default function WidgetShell({
  id, label, accent = 'slate', size, collapsed,
  onSizeChange, onCollapseToggle, onHide, children,
}: Props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.35 : 1,
    zIndex: isDragging ? 50 : undefined,
  };

  const cycleSize = () => {
    const idx  = SIZE_CYCLE.indexOf(size);
    const next = SIZE_CYCLE[(idx + 1) % SIZE_CYCLE.length];
    onSizeChange(id, next);
  };

  const { text, dot } = ACCENT[accent] ?? ACCENT.slate;

  return (
    <div ref={setNodeRef} style={style} className="group/widget relative">
      {/* ── Header bar ── */}
      <div className="flex items-center gap-1.5 mb-3 min-w-0">
        {/* Drag handle */}
        <button
          ref={setActivatorNodeRef}
          {...attributes}
          {...listeners}
          className="shrink-0 opacity-0 group-hover/widget:opacity-100 focus:opacity-100
                     transition-opacity duration-150 cursor-grab active:cursor-grabbing
                     text-slate-700 hover:text-slate-400 touch-none p-0.5 -ml-0.5"
          aria-label="Drag to reorder"
        >
          <GripVertical size={12} />
        </button>

        {/* Label (click = collapse) */}
        <button
          onClick={() => onCollapseToggle(id)}
          className="flex items-center gap-2 flex-1 min-w-0 group/label text-left"
        >
          <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dot}`} />
          <span className={`text-[10px] font-black uppercase tracking-[0.2em] shrink-0 ${text}`}>{label}</span>
          <div className="flex-1 h-px bg-gradient-to-r from-white/[0.07] to-transparent min-w-0" />
          <ChevronDown
            size={11}
            className={`shrink-0 text-slate-700 group-hover/label:text-slate-500 transition-transform duration-200 ${collapsed ? '-rotate-90' : ''}`}
          />
        </button>

        {/* Size toggle — shows current size, click = cycle. Title shows next. */}
        <button
          onClick={cycleSize}
          title={`Resize → ${SIZE_NEXT_LABEL[size] === '■' ? 'full' : SIZE_NEXT_LABEL[size]}`}
          className="shrink-0 opacity-0 group-hover/widget:opacity-100 focus:opacity-100
                     transition-opacity duration-150 text-[9px] font-bold text-slate-600
                     hover:text-violet-400 px-1.5 py-0.5 rounded border border-transparent
                     hover:border-violet-500/20 hover:bg-violet-500/5 transition-all"
          aria-label={`Current size: ${SIZE_LABEL[size]}. Click to resize.`}
        >
          {SIZE_LABEL[size]}
        </button>

        {/* Hide button */}
        <button
          onClick={() => onHide(id)}
          title="Hide widget"
          className="shrink-0 opacity-0 group-hover/widget:opacity-100 focus:opacity-100
                     transition-opacity duration-150 text-slate-700 hover:text-red-400 p-0.5"
          aria-label="Hide widget"
        >
          <X size={11} />
        </button>
      </div>

      {/* ── Collapsible content — smooth CSS grid-rows transition ── */}
      <div
        className="grid transition-[grid-template-rows] duration-200 ease-in-out"
        style={{ gridTemplateRows: collapsed ? '0fr' : '1fr' }}
      >
        <div className="overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  );
}
