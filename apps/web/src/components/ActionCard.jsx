import { Link } from "react-router-dom";

/**
 * Dark-themed dashboard action card.
 * If `to` is "#" (placeholder), rendered as a non-interactive div.
 */
export default function ActionCard({ icon, title, description, to, badge, children }) {
    const isPlaceholder = !to || to === "#";

    const inner = (
        <>
            <div className="text-2xl flex-shrink-0 mt-0.5">{icon}</div>
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-white text-sm">{title}</h3>
                    {badge > 0 && (
                        <span className="bg-amber-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                            {badge}
                        </span>
                    )}
                </div>
                <p className="text-slate-400 text-xs leading-relaxed">{description}</p>
                {children}
            </div>
            {isPlaceholder && (
                <span className="flex-shrink-0 text-xs text-slate-600 font-medium self-start mt-0.5">soon</span>
            )}
        </>
    );

    const base = "bg-slate-900 border border-slate-800 rounded-2xl p-5 flex gap-4 items-start transition-all duration-200";

    if (isPlaceholder) {
        return (
            <div className={`${base} opacity-40 cursor-default`} title={`${title} — coming soon`}>
                {inner}
            </div>
        );
    }

    return (
        <Link to={to} className={`${base} hover:border-blue-500/30 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-900/10`}>
            {inner}
        </Link>
    );
}
