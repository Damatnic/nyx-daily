'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Maximize2, Minus, Plus, ChevronDown } from 'lucide-react';

export type WidgetSize = 'full' | 'half' | 'third';

const SIZE_CYCLE: WidgetSize[] = ['full', 'half', 'third'];

const ACCENT: Record<string, { text: string; dot: string }> = {
  violet:  { text: 'text-violet-400/80',  dot: 'bg-violet-400/70' },
  blue:    { text: 'text-blue-400/80',    dot: 'bg-blue-400/70' },
  cyan:    { text: 'text-cyan-500/70',    dot: 'bg-cyan-500/60' },
  amber:   { text: 'text-amber-500/70',   dot: 'bg-amber-500/60' },
  violet2: { text: 'text-violet-400/80',  dot: 'bg-violet-400/70' },
  rose:    { text: 'text-rose-400/80',    dot: 'bg-rose-400/70' },
  emerald: { text: 'text-emerald-500/70', dot: 'bg-emerald-500/60' },
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
  children: React.ReactNode;
}

export default function WidgetShell({
  id, label, accent = 'slate', size, collapsed,
  onSizeChange, onCollapseToggle, children,
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
    opacity: isDragging ? 0.4 : 1,
    zIndex: isDragging ? 50 : undefined,
  };

  const cycleSize = () => {
    const idx  = SIZE_CYCLE.indexOf(size);
    const next = SIZE_CYCLE[(idx + 1) % SIZE_CYCLE.length];
    onSizeChange(id, next);
  };

  const { text, dot } = ACCENT[accent] ?? ACCENT.slate;

  const sizeLabel: Record<WidgetSize, string> = { full: '⬛', half: '▬', third: '▪' };

  return (
    <div ref={setNodeRef} style={style} className="group/widget relative">
      {/* Section label bar (also collapse toggle) */}
      <div className="flex items-center gap-2 mb-3">
        {/* Drag handle — only registers drag events here */}
        <button
          ref={setActivatorNodeRef}
          {...attributes}
          {...listeners}
          className="flex items-center shrink-0 opacity-0 group-hover/widget:opacity-100 focus:opacity-100
                     transition-opacity duration-150 cursor-grab active:cursor-grabbing
                     text-slate-700 hover:text-slate-400 touch-none p-0.5 -ml-1"
          aria-label="Drag to reorder"
          title="Drag to reorder"
        >
          <GripVertical size={13} />
        </button>

        {/* Label (click = collapse) */}
        <button
          onClick={() => onCollapseToggle(id)}
          className="flex items-center gap-2 flex-1 min-w-0 group/label"
        >
          <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dot}`} />
          <span className={`text-[10px] font-black uppercase tracking-[0.2em] shrink-0 ${text}`}>{label}</span>
          <div className="flex-1 h-px bg-gradient-to-r from-white/[0.07] to-transparent" />
          <ChevronDown
            size={12}
            className={`shrink-0 text-slate-700 group-hover/label:text-slate-500 transition-all duration-200 ${collapsed ? '-rotate-90' : ''}`}
          />
        </button>

        {/* Size toggle */}
        <button
          onClick={cycleSize}
          title={`Size: ${size} → ${SIZE_CYCLE[(SIZE_CYCLE.indexOf(size) + 1) % SIZE_CYCLE.length]}`}
          className="opacity-0 group-hover/widget:opacity-100 focus:opacity-100 transition-opacity
                     text-[10px] text-slate-700 hover:text-slate-400 shrink-0 px-1"
          aria-label="Cycle size"
        >
          {sizeLabel[size]}
        </button>
      </div>

      {/* Content */}
      {!collapsed && children}
    </div>
  );
}
