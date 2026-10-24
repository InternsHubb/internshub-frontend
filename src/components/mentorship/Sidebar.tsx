import React from 'react';
import { NavLink } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';

interface SidebarProps {
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onCloseMobile }) => {
  return (
    <aside
      className="w-[256px] bg-[#3b0454] text-[#ede6f3] flex flex-col h-full shrink-0 relative overflow-hidden select-none rounded-tr-[36px] rounded-br-[36px] shadow-2xl"
      data-node-id="160:9593"
    >
      {/* Decorative Theme Waves matching Figma 160:9594, 160:9595, 160:9596 */}
      <div className="absolute inset-x-0 bottom-0 pointer-events-none overflow-hidden h-[264px] z-0">
        <img
          src="/assets/sidebar/wave-beige.svg"
          alt=""
          className="absolute bottom-0 left-0 w-[256px] h-[263px] object-fill pointer-events-none select-none"
        />
        <img
          src="/assets/sidebar/wave-purple.svg"
          alt=""
          className="absolute bottom-0 left-0 w-[256px] h-[224px] object-fill pointer-events-none select-none"
        />
        <img
          src="/assets/sidebar/wave-orange.svg"
          alt=""
          className="absolute bottom-0 left-0 w-[256px] h-[125px] object-fill pointer-events-none select-none"
        />
      </div>

      {/* Top Header / Logo (Figma 160:9600) */}
      <div className="pt-[22px] pb-[12px] px-[16px] flex items-center z-10 shrink-0">
        <NavLink
          to={ROUTES.home}
          className="flex items-center gap-[8px] text-white font-bold group"
          onClick={onCloseMobile}
        >
          <img
            src="/assets/sidebar/grad-cap.svg"
            alt="Interns HUB"
            className="w-[26.66px] h-[20px] object-contain shrink-0"
          />
          <span className="font-bold text-[18.6px] tracking-tight text-white leading-none">
            Interns HUB
          </span>
        </NavLink>
      </div>

      {/* Navigation List (Figma 160:9607 compact nav) */}
      <nav className="flex-1 px-[8px] space-y-[1px] overflow-y-auto z-10 scrollbar-none min-h-0">
        {/* Internship */}
        <NavLink
          to={ROUTES.internship}
          onClick={onCloseMobile}
          className="w-full h-[38px] rounded-[8px] flex items-center px-[12px] gap-[12px] text-[#ede6f3] hover:text-white hover:bg-white/5 transition-colors text-[14px] font-medium"
        >
          <img
            src="/assets/sidebar/tasks.svg"
            alt=""
            className="w-[17px] h-[17px] shrink-0 object-contain"
          />
          <span className="leading-none">Internship</span>
        </NavLink>

        {/* My Squad */}
        <button
          type="button"
          className="w-full h-[38px] rounded-[8px] flex items-center px-[12px] gap-[12px] text-[#ede6f3] hover:text-white hover:bg-white/5 transition-colors text-[14px] font-medium text-left"
        >
          <img
            src="/assets/sidebar/people.svg"
            alt=""
            className="w-[17px] h-[17px] shrink-0 object-contain"
          />
          <span className="leading-none">My Squad</span>
        </button>

        {/* Courses */}
        <button
          type="button"
          className="w-full h-[38px] rounded-[8px] flex items-center px-[12px] gap-[12px] text-[#ede6f3] hover:text-white hover:bg-white/5 transition-colors text-[14px] font-medium text-left"
        >
          <img
            src="/assets/sidebar/book.svg"
            alt=""
            className="w-[17px] h-[17px] shrink-0 object-contain"
          />
          <span className="leading-none">Courses</span>
        </button>

        {/* Mentorship Header (Figma 160:9620) */}
        <div className="w-full h-[38px] rounded-[8px] flex items-center px-[12px] gap-[12px] text-[#ede6f3] text-[14px] font-medium">
          <img
            src="/assets/sidebar/briefcase.svg"
            alt=""
            className="w-[17px] h-[17px] shrink-0 object-contain"
          />
          <span className="leading-none">Mentorship</span>
        </div>

        {/* Mentorship Sub Tabs (Figma 160:9628 pl-[20px]) */}
        <div className="pl-[20px] flex flex-col gap-[2px] w-full">
          {/* Dashboard */}
          <NavLink
            to={ROUTES.mentorship}
            end
            onClick={onCloseMobile}
            className={({ isActive }) =>
              `w-full h-[34px] px-[12px] rounded-[12px] flex items-center gap-[12px] text-[14px] transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-[#3a0353] to-[#804a8a] text-white font-semibold shadow-sm'
                  : 'text-[#ede6f3] hover:text-white hover:bg-white/5 font-medium'
              }`
            }
          >
            <img
              src="/assets/sidebar/home.svg"
              alt=""
              className="w-[17px] h-[17px] shrink-0 object-contain"
            />
            <span className="leading-none">Dashboard</span>
          </NavLink>

          {/* Eligibility */}
          <button
            type="button"
            className="w-full h-[34px] px-[12px] rounded-[12px] flex items-center gap-[12px] text-[14px] font-medium text-[#ede6f3] hover:text-white hover:bg-white/5 transition-colors text-left"
          >
            <img
              src="/assets/sidebar/star.svg"
              alt=""
              className="w-[17px] h-[17px] shrink-0 object-contain"
            />
            <span className="leading-none">Eligibility</span>
          </button>

          {/* Talent Profile */}
          <button
            type="button"
            className="w-full h-[34px] px-[12px] rounded-[12px] flex items-center gap-[12px] text-[14px] font-medium text-[#ede6f3] hover:text-white hover:bg-white/5 transition-colors text-left"
          >
            <img
              src="/assets/sidebar/user.svg"
              alt=""
              className="w-[17px] h-[17px] shrink-0 object-contain"
            />
            <span className="leading-none">Talent Profile</span>
          </button>

          {/* Opportunities with badge */}
          <button
            type="button"
            className="w-full h-[34px] px-[12px] rounded-[12px] flex items-center justify-between text-[14px] font-medium text-[#ede6f3] hover:text-white hover:bg-white/5 transition-colors text-left"
          >
            <div className="flex items-center gap-[12px]">
              <img
                src="/assets/sidebar/briefcase-sub.svg"
                alt=""
                className="w-[17px] h-[17px] shrink-0 object-contain"
              />
              <span className="leading-none">Opportunities</span>
            </div>
            <span className="bg-white/15 text-white font-semibold text-[10px] px-[6px] py-[2px] rounded-full leading-none">
              4
            </span>
          </button>

          {/* My Applications */}
          <button
            type="button"
            className="w-full h-[34px] px-[12px] rounded-[12px] flex items-center gap-[12px] text-[14px] font-medium text-[#ede6f3] hover:text-white hover:bg-white/5 transition-colors text-left"
          >
            <img
              src="/assets/sidebar/file-text.svg"
              alt=""
              className="w-[17px] h-[17px] shrink-0 object-contain"
            />
            <span className="leading-none">My Applications</span>
          </button>

          {/* Interview with badge */}
          <button
            type="button"
            className="w-full h-[34px] px-[12px] rounded-[12px] flex items-center justify-between text-[14px] font-medium text-[#ede6f3] hover:text-white hover:bg-white/5 transition-colors text-left"
          >
            <div className="flex items-center gap-[12px]">
              <img
                src="/assets/sidebar/calendar.svg"
                alt=""
                className="w-[17px] h-[17px] shrink-0 object-contain"
              />
              <span className="leading-none">Interview</span>
            </div>
            <span className="bg-white/15 text-white font-semibold text-[10px] px-[6px] py-[2px] rounded-full leading-none">
              1
            </span>
          </button>

          {/* Agreement */}
          <button
            type="button"
            className="w-full h-[34px] px-[12px] rounded-[12px] flex items-center gap-[12px] text-[14px] font-medium text-[#ede6f3] hover:text-white hover:bg-white/5 transition-colors text-left"
          >
            <img
              src="/assets/sidebar/clipboard.svg"
              alt=""
              className="w-[17px] h-[17px] shrink-0 object-contain"
            />
            <span className="leading-none">Agreement</span>
          </button>

          {/* Notifications with badge */}
          <button
            type="button"
            className="w-full h-[34px] px-[12px] rounded-[12px] flex items-center justify-between text-[14px] font-medium text-[#ede6f3] hover:text-white hover:bg-white/5 transition-colors text-left"
          >
            <div className="flex items-center gap-[12px]">
              <img
                src="/assets/sidebar/bell.svg"
                alt=""
                className="w-[17px] h-[17px] shrink-0 object-contain"
              />
              <span className="leading-none">Notifications</span>
            </div>
            <span className="bg-white/15 text-white font-semibold text-[10px] px-[6px] py-[2px] rounded-full leading-none">
              2
            </span>
          </button>
        </div>

        {/* Top-level Remaining Items (Figma 160:9694 - 160:9709) */}
        <div className="pt-[2px] space-y-[1px]">
          {/* Sprints */}
          <button
            type="button"
            className="w-full h-[38px] rounded-[8px] flex items-center px-[12px] gap-[12px] text-[#ede6f3] hover:text-white hover:bg-white/5 transition-colors text-[14px] font-medium text-left"
          >
            <img
              src="/assets/sidebar/sprint.svg"
              alt=""
              className="w-[17px] h-[17px] shrink-0 object-contain"
            />
            <span className="leading-none">Sprints</span>
          </button>

          {/* Progress */}
          <button
            type="button"
            className="w-full h-[38px] rounded-[8px] flex items-center px-[12px] gap-[12px] text-[#ede6f3] hover:text-white hover:bg-white/5 transition-colors text-[14px] font-medium text-left"
          >
            <img
              src="/assets/sidebar/in-progress.svg"
              alt=""
              className="w-[17px] h-[17px] shrink-0 object-contain"
            />
            <span className="leading-none">Progress</span>
          </button>

          {/* Chat */}
          <button
            type="button"
            className="w-full h-[38px] rounded-[8px] flex items-center px-[12px] gap-[12px] text-[#ede6f3] hover:text-white hover:bg-white/5 transition-colors text-[14px] font-medium text-left"
          >
            <img
              src="/assets/sidebar/chat.svg"
              alt=""
              className="w-[17px] h-[17px] shrink-0 object-contain"
            />
            <span className="leading-none">Chat</span>
          </button>

          {/* Certificate */}
          <button
            type="button"
            className="w-full h-[38px] rounded-[8px] flex items-center px-[12px] gap-[12px] text-[#ede6f3] hover:text-white hover:bg-white/5 transition-colors text-[14px] font-medium text-left"
          >
            <img
              src="/assets/sidebar/certificate.svg"
              alt=""
              className="w-[17px] h-[17px] shrink-0 object-contain"
            />
            <span className="leading-none">Certificate</span>
          </button>
        </div>
      </nav>

      {/* Bottom Composite Score Card (Figma 160:9717) */}
      <div className="relative z-10 px-[8px] pb-[16px] pt-[6px] mt-auto shrink-0">
        <div
          className="w-[240px] rounded-[20px] p-[16px] border border-white/20 shadow-xl backdrop-blur-md relative"
          style={{
            backgroundImage:
              'linear-gradient(145.13deg, rgba(106, 42, 138, 0.92) 0%, rgba(59, 4, 84, 0.96) 71.43%)',
          }}
          data-node-id="160:9717"
        >
          {/* Header */}
          <div className="flex items-center justify-between h-[18px] mb-[10px]">
            <span className="text-[11px] font-medium text-[rgba(237,230,243,0.85)]">
              Composite Score
            </span>
            <div className="bg-white/15 px-[8px] py-[3px] rounded-full">
              <span className="text-[10px] font-semibold text-white leading-none block">
                Top 15%
              </span>
            </div>
          </div>

          {/* 87% */}
          <div className="text-[28px] font-bold text-white tracking-tight leading-none mb-[12px]">
            87%
          </div>

          {/* Progress Track */}
          <div className="h-[6px] w-full bg-[rgba(255,255,255,0.22)] rounded-full overflow-hidden mb-[10px]">
            <div className="h-full bg-white rounded-full w-[87%]" />
          </div>

          {/* Status */}
          <div className="flex items-center gap-[6px]">
            <img
              src="/assets/sidebar/dot.svg"
              alt=""
              className="w-[6px] h-[6px] shrink-0"
            />
            <span className="text-[11px] font-medium text-[rgba(237,230,243,0.9)]">
              Eligible · Profile visible
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
