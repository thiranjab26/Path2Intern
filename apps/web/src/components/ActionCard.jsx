import { Link } from "react-router-dom";

/**
 * A navigable dashboard action card.
 * If `to` is "#" (placeholder / not yet built), renders as a div
 * — so no Link is created and React Router never intercepts the click.
 */
export default function ActionCard({ icon, title, description, to, accent, badge, children }) {
    const isPlaceholder = !to || to === "#";

    const inner = (
        <>
            <div className={`w-11 h-11 rounded-xl ${accent} flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105`}>
                {icon}
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                    <h3 className="font-semibold text-gray-900 text-sm">{title}</h3>
                    {badge > 0 && (
                        <span className="bg-amber-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                            {badge}
                        </span>
                    )}
                </div>
                <p className="text-gray-500 text-xs leading-relaxed">{description}</p>
                {children}
            </div>
            {isPlaceholder && (
                <span className="flex-shrink-0 text-xs text-gray-300 font-medium self-start mt-0.5">soon</span>
            )}
        </>
    );

    const base =
        "group bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex gap-4 items-start transition-all duration-200";

    if (isPlaceholder) {
        return (
            <div className={`${base} opacity-60 cursor-default`} title={`${title} — coming soon`}>
                {inner}
            </div>
        );
    }

    return (
        <Link to={to} className={`${base} hover:shadow-md hover:-translate-y-0.5 relative`}>
            {inner}
        </Link>
    );
}
