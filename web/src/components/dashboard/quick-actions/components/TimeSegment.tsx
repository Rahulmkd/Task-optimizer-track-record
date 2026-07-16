interface TimeSegmentProps {
  value: string | number;
  min: number;
  max: number;
  onChange: (value: number) => void;
}

export function TimeSegment({ value, min, max, onChange }: TimeSegmentProps) {
  return (
    <input
      type="number"
      min={min}
      max={max}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      onFocus={(e) => e.target.select()}
      className="
        w-10
        bg-transparent
        text-center
        text-sm
        font-semibold
        tabular-nums
        text-white
        outline-none
        [appearance:textfield]
        [&::-webkit-inner-spin-button]:appearance-none
        [&::-webkit-outer-spin-button]:appearance-none
      "
    />
  );
}
