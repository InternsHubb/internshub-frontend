import React, { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Play, Sparkles, Users, Award, Volume2, VolumeX } from 'lucide-react'
import videoPosterWebp from '@/assets/video-poster.webp'

interface VideoShowcaseProps {
  /**
   * Path or URL to your video file.
   * Default points to '/images/EdTeck.mp4'.
   */
  videoSrc?: string
  /**
   * Optional poster image to show before the video starts playing.
   */
  posterSrc?: string
}

export const VideoShowcase: React.FC<VideoShowcaseProps> = ({
  videoSrc = '/images/EdTeck.mp4',
  posterSrc = videoPosterWebp,
}) => {
  const { t, i18n } = useTranslation()
  const isRtl = i18n.language === 'ar'
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [hasStarted, setHasStarted] = useState(false)

  const togglePlay = () => {
    if (!videoRef.current) return

    if (isPlaying) {
      videoRef.current.pause()
    } else {
      videoRef.current
        .play()
        .then(() => {
          setIsPlaying(true)
          setHasStarted(true)
        })
        .catch(() => {
          setIsPlaying(false)
        })
    }
  }

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!videoRef.current) return
    videoRef.current.muted = !isMuted
    setIsMuted(!isMuted)
  }

  return (
    <section
      id="about"
      className="w-full max-w-[1240px] xl:max-w-[1280px] mx-auto px-4 sm:px-6 py-16 sm:py-20 select-none scroll-mt-28"
    >
      <span id="about-video" className="sr-only" />
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14 reveal-on-scroll">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-100 text-[#5a198f] text-xs sm:text-sm font-bold tracking-wide mb-4 shadow-xs">
          <Sparkles className="size-3.5 text-[#5a198f]" />
          <span>{t('videoShowcase.badge')}</span>
        </div>

        <h2 className="text-[32px] sm:text-[40px] lg:text-[44px] font-extrabold text-[#111827] leading-tight mb-4 tracking-tight">
          {t('videoShowcase.title')}
        </h2>

        <p className="text-[16px] sm:text-[19px] lg:text-[20px] text-[#5c5c5c] font-medium leading-[1.6]">
          {t('videoShowcase.subtitle')}
        </p>
      </div>

      {/* Video Container Frame */}
      <div className="max-w-[1040px] mx-auto reveal-on-scroll reveal-scale reveal-delay-150">
        <div
          onClick={togglePlay}
          className="group relative w-full aspect-video rounded-3xl sm:rounded-[32px] overflow-hidden bg-gradient-to-br from-[#27043f] via-[#160124] to-[#0a0011] shadow-[0_24px_60px_-15px_rgba(58,4,83,0.3)] border-2 border-purple-200/40 cursor-pointer transition-all duration-300 hover:shadow-[0_30px_70px_-12px_rgba(58,4,83,0.45)]"
        >
          {/* HTML5 Video Element */}
          <video
            ref={videoRef}
            src={videoSrc}
            poster={posterSrc}
            playsInline
            controls={hasStarted}
            preload="metadata"
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onEnded={() => {
              setIsPlaying(false)
              setHasStarted(false)
            }}
            className="w-full h-full object-cover"
          >
            <source src={videoSrc} type="video/mp4" />
            <source src="/images/EdTeck .mp4" type="video/mp4" />
            <source src="/images/EdTeck.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          {/* Video Placeholder / Overlay (Shown before play starts or while paused) */}
          {(!hasStarted || !isPlaying) && (
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/20 flex flex-col items-center justify-center p-6 transition-opacity duration-300 backdrop-blur-[2px]">
              {/* Play Button with Pulsing Glow Ring */}
              <div className="relative flex items-center justify-center mb-4">
                <span className="absolute size-20 sm:size-24 rounded-full bg-purple-500/30 animate-ping pointer-events-none" />
                <button
                  type="button"
                  aria-label={t('videoShowcase.playLabel')}
                  className="relative size-16 sm:size-20 rounded-full bg-[#5a198f] hover:bg-[#701db5] text-white flex items-center justify-center shadow-[0_12px_30px_rgba(90,25,143,0.55)] transition-transform duration-300 group-hover:scale-110 active:scale-95"
                >
                  <Play className={`size-7 sm:size-8 fill-current text-white ${isRtl ? 'rotate-180 translate-x-0.5' : 'translate-x-0.5'}`} />
                </button>
              </div>

              {/* Title & Duration Label */}
              <div className="text-center text-white">
                <p className="text-base sm:text-lg font-bold tracking-wide mb-1 drop-shadow-sm">
                  {t('videoShowcase.playLabel')}
                </p>
                <span className="inline-block px-3 py-0.5 rounded-full bg-white/20 text-white/90 text-xs font-semibold backdrop-blur-sm">
                  {t('videoShowcase.duration')}
                </span>
              </div>

              {/* Bottom bar with branding */}
              <div className="absolute bottom-4 inset-x-6 flex items-center justify-between text-xs text-white/70">
                <span className="font-semibold text-white/90">EdTech</span>
                <span className="hidden sm:inline-block">HD • 1080p</span>
              </div>
            </div>
          )}

          {/* Quick Floating Sound Toggle (Shown during playback) */}
          {hasStarted && isPlaying && (
            <button
              type="button"
              onClick={toggleMute}
              className="absolute top-4 right-4 z-30 size-10 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-md transition-all duration-200"
              aria-label={isMuted ? 'Unmute video' : 'Mute video'}
            >
              {isMuted ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
            </button>
          )}
        </div>

        {/* 3 Value Pillars below Video */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mt-8">
          <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-purple-50/60 border border-purple-100/80 transition-all hover:bg-purple-50 hover:shadow-xs">
            <div className="size-10 rounded-xl bg-[#5a198f]/10 text-[#5a198f] flex items-center justify-center shrink-0">
              <Sparkles className="size-5" />
            </div>
            <p className="text-sm sm:text-[15px] font-bold text-[#111827] leading-snug">
              {t('videoShowcase.feature1')}
            </p>
          </div>

          <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-purple-50/60 border border-purple-100/80 transition-all hover:bg-purple-50 hover:shadow-xs">
            <div className="size-10 rounded-xl bg-[#5a198f]/10 text-[#5a198f] flex items-center justify-center shrink-0">
              <Users className="size-5" />
            </div>
            <p className="text-sm sm:text-[15px] font-bold text-[#111827] leading-snug">
              {t('videoShowcase.feature2')}
            </p>
          </div>

          <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-purple-50/60 border border-purple-100/80 transition-all hover:bg-purple-50 hover:shadow-xs">
            <div className="size-10 rounded-xl bg-[#5a198f]/10 text-[#5a198f] flex items-center justify-center shrink-0">
              <Award className="size-5" />
            </div>
            <p className="text-sm sm:text-[15px] font-bold text-[#111827] leading-snug">
              {t('videoShowcase.feature3')}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default VideoShowcase
