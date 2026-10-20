import React, { useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export const TestimonialsSection: React.FC = () => {
  const { t, i18n } = useTranslation()
  const isRtl = i18n.language === 'ar'
  const containerRef = useRef<HTMLDivElement>(null)
  const animFrameRef = useRef<number | null>(null)

  const reviewList = [
    {
      id: 'rev-1',
      name: isRtl ? 'لينا س.' : 'Lina S.',
      role: isRtl ? 'متدربة تسويق' : 'Marketing Intern',
      quote: t('testimonials.quote1'),
      avatar: '/images/testimonial-avatar-lina.png',
    },
    {
      id: 'rev-2',
      name: isRtl ? 'لينا س.' : 'Lina S.',
      role: isRtl ? 'متدربة تسويق' : 'Marketing Intern',
      quote: t('testimonials.quote2'),
      avatar: '/images/testimonial-avatar-lina.png',
    },
    {
      id: 'rev-3',
      name: isRtl ? 'لينا س.' : 'Lina S.',
      role: isRtl ? 'متدربة تسويق' : 'Marketing Intern',
      quote: t('testimonials.quote3'),
      avatar: '/images/testimonial-avatar-lina.png',
    },
    {
      id: 'rev-4',
      name: isRtl ? 'لينا س.' : 'Lina S.',
      role: isRtl ? 'متدربة تسويق' : 'Marketing Intern',
      quote: t('testimonials.quote4'),
      avatar: '/images/testimonial-avatar-lina.png',
    },
    {
      id: 'rev-5',
      name: isRtl ? 'لينا س.' : 'Lina S.',
      role: isRtl ? 'متدربة تسويق' : 'Marketing Intern',
      quote: t('testimonials.quote5'),
      avatar: '/images/testimonial-avatar-lina.png',
    },
    {
      id: 'rev-6',
      name: isRtl ? 'لينا س.' : 'Lina S.',
      role: isRtl ? 'متدربة تسويق' : 'Marketing Intern',
      quote: t('testimonials.quote1'),
      avatar: '/images/testimonial-avatar-lina.png',
    },
    {
      id: 'rev-7',
      name: isRtl ? 'لينا س.' : 'Lina S.',
      role: isRtl ? 'متدربة تسويق' : 'Marketing Intern',
      quote: t('testimonials.quote2'),
      avatar: '/images/testimonial-avatar-lina.png',
    },
    {
      id: 'rev-8',
      name: isRtl ? 'لينا س.' : 'Lina S.',
      role: isRtl ? 'متدربة تسويق' : 'Marketing Intern',
      quote: t('testimonials.quote3'),
      avatar: '/images/testimonial-avatar-lina.png',
    },
  ]

  const stopScroll = () => {
    if (animFrameRef.current !== null) {
      cancelAnimationFrame(animFrameRef.current)
      animFrameRef.current = null
    }
  }

  const startScroll = (dir: 'left' | 'right', speed = 3.5) => {
    stopScroll()
    const step = () => {
      if (containerRef.current) {
        const delta = dir === 'right' ? speed : -speed
        containerRef.current.scrollLeft += delta
      }
      animFrameRef.current = requestAnimationFrame(step)
    }
    animFrameRef.current = requestAnimationFrame(step)
  }

  const scrollByStep = (dir: 'left' | 'right') => {
    if (containerRef.current) {
      const cardWidth = 307 // 291px card + 16px gap
      containerRef.current.scrollBy({
        left: dir === 'right' ? cardWidth : -cardWidth,
        behavior: 'smooth',
      })
    }
  }

  // Handle continuous movement when user hovers on the last comment from the right or the left
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const width = rect.width

    // Rightmost zone (hovering on the last comment from the right)
    if (x > width * 0.78) {
      startScroll('right', 3.5)
    }
    // Leftmost zone (hovering on the last comment from the left)
    else if (x < width * 0.22) {
      startScroll('left', 3.5)
    }
    // Middle area (pause scrolling so user can read)
    else {
      stopScroll()
    }
  }

  const handleMouseLeave = () => {
    stopScroll()
  }

  useEffect(() => {
    return () => stopScroll()
  }, [])

  return (
    <section className="w-full max-w-[1240px] xl:max-w-[1280px] mx-auto px-4 sm:px-6 py-12 lg:py-16 select-none">
      {/* Section Header (Figma node 1002:1885) */}
      <div className="text-start mb-12 sm:mb-16 reveal-on-scroll">
        <h2 className="text-[32px] sm:text-[38px] lg:text-[40px] font-bold text-[#111827] leading-tight mb-4">
          {t('testimonials.title')}
        </h2>
        <p className="text-[18px] sm:text-[22px] lg:text-[24px] text-[#5c5c5c] font-medium leading-[1.5] w-full">
          {t('testimonials.subtitle')}
        </p>
      </div>

      {/* Interactive Carousel Wrapper (Figma node 1002:1888) */}
      <div className="relative w-full group reveal-on-scroll reveal-delay-150">
        {/* Soft edge fade masks */}
        <div className="pointer-events-none absolute inset-y-0 start-0 w-12 sm:w-16 bg-gradient-to-r from-white via-white/80 to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 end-0 w-12 sm:w-16 bg-gradient-to-l from-white via-white/80 to-transparent z-10" />

        {/* Left Navigation Chevron Button */}
        <button
          type="button"
          onClick={() => scrollByStep('left')}
          onMouseEnter={() => startScroll('left', 4)}
          onMouseLeave={stopScroll}
          className="absolute start-2 top-1/2 -translate-y-1/2 z-20 size-10 rounded-full bg-white shadow-[0px_4px_16px_rgba(0,0,0,0.12)] border border-purple-100 flex items-center justify-center text-[#5a198f] hover:bg-[#5a198f] hover:text-white transition-all duration-200 active:scale-95 opacity-80 hover:opacity-100"
          aria-label="Previous comments"
        >
          <ChevronLeft className="size-5" />
        </button>

        {/* Right Navigation Chevron Button */}
        <button
          type="button"
          onClick={() => scrollByStep('right')}
          onMouseEnter={() => startScroll('right', 4)}
          onMouseLeave={stopScroll}
          className="absolute end-2 top-1/2 -translate-y-1/2 z-20 size-10 rounded-full bg-white shadow-[0px_4px_16px_rgba(0,0,0,0.12)] border border-purple-100 flex items-center justify-center text-[#5a198f] hover:bg-[#5a198f] hover:text-white transition-all duration-200 active:scale-95 opacity-80 hover:opacity-100"
          aria-label="Next comments"
        >
          <ChevronRight className="size-5" />
        </button>

        {/* Scrollable Track - hovering on the last comment from right or left triggers motion */}
        <div
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="flex gap-[16px] items-stretch overflow-x-auto scrollbar-none py-4 px-6 select-none cursor-grab active:cursor-grabbing"
          dir="ltr"
        >
          {reviewList.map((item, idx) => (
            <div
              key={`${item.id}-${idx}`}
              onMouseEnter={() => {
                // If this is the first or last in the array, assist directional movement
                if (idx === reviewList.length - 1) startScroll('right', 3.5)
                if (idx === 0) startScroll('left', 3.5)
              }}
              onMouseLeave={stopScroll}
              className="bg-[#f8f7fe] content-stretch flex flex-col justify-between gap-[16px] p-[24px] rounded-[16px] shrink-0 w-[291px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              {/* Star Rating Row (Figma node 1002:1891) */}
              <div className="flex items-center gap-[4px] w-full text-start">
                <img
                  src="/images/testimonial-star-outline.svg"
                  alt=""
                  className="w-[18px] h-[16px] shrink-0"
                />
                <img
                  src="/images/testimonial-star-filled.svg"
                  alt=""
                  className="w-[18px] h-[16px] shrink-0"
                />
                <img
                  src="/images/testimonial-star-filled.svg"
                  alt=""
                  className="w-[18px] h-[16px] shrink-0"
                />
                <img
                  src="/images/testimonial-star-filled.svg"
                  alt=""
                  className="w-[18px] h-[16px] shrink-0"
                />
                <img
                  src="/images/testimonial-star-filled.svg"
                  alt=""
                  className="w-[18px] h-[16px] shrink-0"
                />
              </div>

              {/* Quote Text (Figma node 1002:1907) */}
              <div className="w-full text-start">
                <p className="text-[16px] font-medium text-[#230049]/80 leading-[26px] tracking-[0.0156px]">
                  {item.quote}
                </p>
              </div>

              {/* Author Profile (Figma node 1002:1909) */}
              <div className="flex items-center gap-[12px] pt-[4px] w-full text-start">
                <img
                  src={item.avatar}
                  alt={item.name}
                  className="size-[48px] rounded-full object-cover shrink-0"
                  loading="lazy"
                  width={48}
                  height={48}
                />
                <div className="flex flex-col items-start min-w-0">
                  <h3 className="text-[#5a198f] text-[16px] font-extrabold leading-[24px] tracking-[0.0156px] truncate">
                    {item.name}
                  </h3>
                  <p className="text-[#290049]/60 text-[14px] font-medium leading-[20px] tracking-[0.041px] truncate">
                    {item.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
