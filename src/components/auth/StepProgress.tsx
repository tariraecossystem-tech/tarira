import React from 'react';
import { Check } from 'lucide-react';

interface StepProgressProps {
  currentStep: number; // 1, 2, 3...
  steps: string[];     // ['Perfil', 'Dados', 'Subscrição']
  className?: string;
}

export default function StepProgress({ currentStep, steps, className = '' }: StepProgressProps) {
  const total = steps.length;
  const current = Math.min(Math.max(currentStep, 1), total);
  const percent = Math.round((current / total) * 100);
  const isLast = current === total;

  return (
    <div className={`bg-white/95 backdrop-blur-xs border border-slate-200/90 rounded-xl shadow-xs p-3 sm:p-4 ${className}`}>
      <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider mb-1.5">
        <span className="text-slate-500 font-sans">Passo {current} de {total}</span>
        <span className={isLast ? 'text-emerald-700 font-bold' : 'text-[#0B254B] font-bold'}>{percent}%</span>
      </div>

      <div
        className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percent}
        aria-label={`Progresso do registo: Passo ${current} de ${total}`}
      >
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${
            isLast ? 'bg-emerald-500' : 'bg-[#0B254B]'
          }`}
          style={{ width: `${percent}%` }}
        />
      </div>

      <ol className="mt-2.5 grid gap-1" style={{ gridTemplateColumns: `repeat(${total}, minmax(0, 1fr))` }}>
        {steps.map((label, i) => {
          const n = i + 1;
          const done = n < current || (isLast && n === current);
          const active = n === current && !isLast;
          return (
            <li
              key={label}
              className={`flex items-center gap-1.5 text-xs sm:text-xs font-medium ${
                i === 0 ? 'justify-start' : i === total - 1 ? 'justify-end' : 'justify-center'
              } ${done ? 'text-emerald-700' : active ? 'text-[#0B254B] font-semibold' : 'text-slate-400'}`}
            >
              <span
                className={`w-4.5 h-4.5 shrink-0 rounded-full flex items-center justify-center text-xs font-bold border transition-colors ${
                  done
                    ? 'bg-emerald-500 border-emerald-500 text-white'
                    : active
                    ? 'bg-[#0B254B] border-[#0B254B] text-white shadow-2xs'
                    : 'bg-white border-slate-200 text-slate-400'
                }`}
              >
                {done ? <Check className="w-2.5 h-2.5" strokeWidth={3} /> : n}
              </span>
              <span className="truncate">{label}</span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
