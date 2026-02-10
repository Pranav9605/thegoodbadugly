type Segment = "good" | "bad" | "ugly";

interface SegmentControlProps {
  active: Segment;
  onChange: (segment: Segment) => void;
}

const segments: { key: Segment; label: string }[] = [
  { key: "bad", label: "the bad" },
  { key: "good", label: "THE GOOD" },
  { key: "ugly", label: "the ugly" },
];

const SegmentControl = ({ active, onChange }: SegmentControlProps) => {
  return (
    <div className="flex justify-center py-6">
      <div className="segment-control">
        {segments.map((seg) => (
          <button
            key={seg.key}
            onClick={() => onChange(seg.key)}
            className={`segment-item ${active === seg.key ? "segment-item-active" : ""}`}
          >
            {seg.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SegmentControl;
