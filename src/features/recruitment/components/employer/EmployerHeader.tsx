import { Bell, Moon, Search } from 'lucide-react';

export default function EmployerHeader() {
  return (
    <header className="sticky top-0 z-20 flex h-[76px] items-center justify-between bg-transparent px-5 sm:px-8">
      {/* شريط البحث */}
      <div className="hidden items-center gap-3 rounded-full bg-white/80 px-4 py-2.5 shadow-sm border border-slate-200/60 backdrop-blur-md md:flex md:w-[360px]">
        <Search size={17} className="text-slate-400" />
        <input
          aria-label="Search"
          placeholder="Search by name, role, or skill..."
          className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400 text-slate-700"
        />
      </div>

      {/* عناصر أقصى اليمين (الإشعارات، الدارك مود، واسم المستخدم) */}
      <div className="ml-auto flex items-center gap-3">
        {/* زر الإشعارات */}
        <button
          type="button"
          aria-label="Notifications"
          className="relative flex size-10 items-center justify-center rounded-full bg-white text-slate-600 shadow-sm border border-slate-200/60 hover:bg-slate-50 transition"
        >
          <Bell size={18} />
          <span className="absolute right-2.5 top-2.5 size-2 rounded-full bg-purple-600 ring-2 ring-white" />
        </button>

        {/* زر تفعيل الوضع الداكن */}
        <button
          type="button"
          className="flex items-center gap-2 rounded-full bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-sm border border-slate-200/60 hover:bg-slate-50 transition"
        >
          <Moon size={15} className="text-slate-600" />
          <span>Dark</span>
        </button>

        {/* ملف المستخدم الشخصي */}
        <div className="flex items-center gap-3 pl-2">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-purple-400 to-purple-700 text-xs font-bold text-white shadow-md">
            SM
          </div>
          <div className="hidden text-left sm:block">
            <span className="block text-sm font-semibold text-slate-900">
              Sarah Mahmoud
            </span>
            <span className="block text-[11px] text-slate-500">
              HR · NovaTech
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}