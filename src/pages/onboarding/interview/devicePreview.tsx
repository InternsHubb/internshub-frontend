import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { VideoOff } from 'lucide-react';
import { MUTED_TEXT } from './parts';
import type { DeviceOption } from './useDeviceCheck';

// Live previews for the Device Check and question screens. They only display the local stream;
// nothing is captured or sent.

type CameraPreviewProps = { stream: MediaStream | null; label?: string };

export function CameraPreview({ stream, label }: CameraPreviewProps) {
  const { t } = useTranslation();
  const video = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const element = video.current;
    if (!element) return;
    element.srcObject = stream;
    return () => {
      element.srcObject = null;
    };
  }, [stream]);

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-[12px] bg-[#1f1a24]">
      {stream ? (
        // Mirrored so the candidate's movements read naturally.
        <video ref={video} autoPlay muted playsInline className="h-full w-full -scale-x-100 object-cover" />
      ) : (
        <div className="flex h-full flex-col items-center justify-center gap-2 px-6 text-center text-[#c9bfd0]">
          <VideoOff aria-hidden="true" size={28} />
          <p className="text-xs leading-[18px]">{t('onboarding.interview.deviceCheck.previewOff')}</p>
        </div>
      )}
      {label && (
        <span className="absolute start-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-[#1f1a24]/80 px-2.5 py-1 text-[11px] font-semibold text-white">
          <span aria-hidden="true" className={`h-1.5 w-1.5 rounded-full ${stream ? 'bg-[#22c55e]' : 'bg-[#9a939e]'}`} />
          {label}
        </span>
      )}
    </div>
  );
}

const METER_SEGMENTS = 14;

export function MicMeter({ level }: { level: number }) {
  const lit = Math.round(level * METER_SEGMENTS);
  return (
    <div aria-hidden="true" className="flex gap-1">
      {Array.from({ length: METER_SEGMENTS }, (_, index) => (
        <span
          key={index}
          className={`h-1.5 flex-1 rounded-full transition-colors ${index < lit ? 'bg-[#16a34a]' : 'bg-[#e9dfee]'}`}
        />
      ))}
    </div>
  );
}

type DeviceSelectProps = {
  label: string;
  devices: DeviceOption[];
  value: string;
  disabled?: boolean;
  onChange: (deviceId: string) => void;
};

export function DeviceSelect({ label, devices, value, disabled, onChange }: DeviceSelectProps) {
  const { t } = useTranslation();
  const hasDevices = devices.length > 0;
  return (
    <label className="block min-w-0">
      <span className="sr-only">{label}</span>
      <select
        value={hasDevices ? value : ''}
        disabled={disabled || !hasDevices}
        onChange={(event) => onChange(event.target.value)}
        className={`h-10 w-full min-w-0 truncate rounded-[8px] border border-[#cfc3d6] bg-white px-3 text-sm text-[#1f1a24] focus:outline-none focus-visible:ring-4 focus-visible:ring-[#e5d4f2] disabled:cursor-not-allowed disabled:bg-[#f7f3f9] ${hasDevices ? '' : MUTED_TEXT}`}
      >
        {!hasDevices && <option value="">{t('onboarding.interview.deviceCheck.noDevices')}</option>}
        {devices.map((device, index) => (
          <option key={device.deviceId} value={device.deviceId}>
            {device.label || t('onboarding.interview.deviceCheck.deviceFallback', { number: index + 1 })}
          </option>
        ))}
      </select>
    </label>
  );
}
