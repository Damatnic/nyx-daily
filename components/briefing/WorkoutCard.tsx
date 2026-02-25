import { WorkoutExercise } from '@/lib/types';
import SectionHeader from '@/components/ui/SectionHeader';
import { Dumbbell } from 'lucide-react';

interface WorkoutCardProps {
  workout: {
    name: string;
    exercises: WorkoutExercise[];
  };
}

export default function WorkoutCard({ workout }: WorkoutCardProps) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-[#0d0d1a] p-5">
      <SectionHeader title="Workout" />

      <div className="flex items-center gap-2 mb-4">
        <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
          <Dumbbell size={14} className="text-[#10b981]" />
        </div>
        <span className="text-sm font-semibold text-slate-200">{workout.name}</span>
        <span className="text-xs text-slate-500 ml-auto">{workout.exercises.length} exercises</span>
      </div>

      <div className="flex flex-col gap-2">
        {workout.exercises.map((ex, i) => (
          <div
            key={i}
            className="flex items-start gap-3 p-3 rounded-lg bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.04] transition-all duration-200"
          >
            <span className="text-xs text-slate-600 font-mono mt-0.5 w-4 shrink-0">{i + 1}</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm text-slate-200 font-medium">{ex.name}</span>
                <span className="text-xs font-mono text-[#10b981] shrink-0">{ex.reps}</span>
              </div>
              {ex.note && (
                <p className="text-xs text-slate-500 mt-0.5">{ex.note}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
