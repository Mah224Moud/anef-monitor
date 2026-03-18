import { useState } from "react";
import { HiMail, HiMailOpen, HiReply } from "react-icons/hi";
import { formatDate } from "../utils/formatDate";

const Notifications = ({ notifications, nonLuCount = 0 }) => {
  const [visibleCount, setVisibleCount] = useState(3);

  if (!notifications || !notifications._items) return null;

  const items = notifications._items;
  const total = notifications._meta?.total || 0;
  
  const displayedItems = items.slice(0, visibleCount);

  return (
    <div className="card fade-in transition-colors" style={{ animationDelay: '0.2s' }}>
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-base font-bold tracking-tight text-slate-900 dark:text-white transition-colors">Notifications</h3>
        <div className="flex items-center gap-2">
          {nonLuCount > 0 && (
            <span className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 text-xs font-semibold px-2.5 py-0.5 rounded-full transition-colors">
              {nonLuCount} non lue{nonLuCount > 1 ? 's' : ''}
            </span>
          )}
          <span className="text-xs text-slate-400 dark:text-slate-500 transition-colors">{total} au total</span>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="py-8 text-center">
          <p className="text-sm text-slate-400 dark:text-slate-500 transition-colors">Aucune notification</p>
        </div>
      ) : (
        <ul className="divide-y divide-slate-100 dark:divide-slate-800 transition-colors">
          {displayedItems.map((item) => (
            <li key={item.id} className="py-4 first:pt-0 last:pb-0">
              <div className="flex items-start gap-3">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${!item.lu ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' : 'bg-slate-100 text-slate-400 dark:bg-slate-800/80 dark:text-slate-500'}`}>
                  {item.lu ? <HiMailOpen className="w-5 h-5" /> : <HiMail className="w-5 h-5" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className={`text-sm font-semibold truncate transition-colors ${!item.lu ? 'text-slate-900 dark:text-slate-200' : 'text-slate-500 dark:text-slate-400'}`}>
                      {item.type_notification}
                    </p>
                    <time className="text-xs text-slate-400 dark:text-slate-500 whitespace-nowrap transition-colors">
                      {formatDate(item._created, true)}
                    </time>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2 leading-relaxed transition-colors">
                    {item.motif_notification}
                  </p>

                  {/* Extra fields from the real API */}
                  <div className="flex items-center gap-3 mt-2">
                    {item.date_lecture && (
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 transition-colors">
                        Lu le {formatDate(item.date_lecture, true)}
                      </span>
                    )}
                    {item.date_reponse && (
                      <span className="text-[10px] text-green-600 dark:text-emerald-400 flex items-center gap-1 transition-colors">
                        <HiReply className="w-3 h-3" />
                        Répondu le {formatDate(item.date_reponse, true)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {visibleCount < items.length && (
        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-center transition-colors">
          <button
            onClick={() => setVisibleCount((prev) => prev + 5)}
            className="text-sm text-blue-600 dark:text-blue-400 font-semibold hover:text-blue-700 dark:hover:text-blue-300 hover:underline transition-all cursor-pointer"
          >
            Voir les anciennes ({items.length - visibleCount} restantes)
          </button>
        </div>
      )}
    </div>
  );
};

export default Notifications;
