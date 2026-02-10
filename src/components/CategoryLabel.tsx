interface CategoryLabelProps {
    category: 'good' | 'bad' | 'ugly';
    size?: 'sm' | 'md';
}

const CATEGORY_CONFIG = {
    good: { label: 'GOOD', subtitle: 'Hope' },
    bad: { label: 'BAD', subtitle: 'Failure' },
    ugly: { label: 'UGLY', subtitle: 'Fallout' },
} as const;

export default function CategoryLabel({ category, size = 'md' }: CategoryLabelProps) {
    const config = CATEGORY_CONFIG[category];
    const isSmall = size === 'sm';

    return (
        <span
            className={`inline-flex items-baseline gap-1.5 font-display uppercase tracking-wider ${isSmall ? 'text-xs px-2 py-0.5' : 'text-sm px-3 py-1'
                }`}
            style={{ border: '2px solid black' }}
        >
            <span className="font-bold">{config.label}</span>
            <span className={`font-body normal-case ${isSmall ? 'text-[10px]' : 'text-xs'} text-muted-foreground`}>
                {config.subtitle}
            </span>
        </span>
    );
}
