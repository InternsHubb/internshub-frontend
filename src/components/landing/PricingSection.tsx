import React from 'react'
import { useTranslation } from 'react-i18next'
import { Layers, Award } from 'lucide-react'

export const PricingSection: React.FC = () => {
  const { t, i18n } = useTranslation()
  const isRtl = i18n.language === 'ar'

  const plans = [
    {
      id: '3m',
      name: t('pricing.plan3mName'),
      price: '3499',
      unit: isRtl ? 'ج.م/شهرياً' : 'EGP/Month',
      icon: Layers,
      features: [
        t('pricing.plan3mFeature1'),
        t('pricing.plan3mFeature2'),
        t('pricing.plan3mFeature3'),
      ],
      btnText: t('pricing.plan3mBtn'),
      isPopular: false,
    },
    {
      id: '6m',
      name: t('pricing.plan6mName'),
      price: '5499',
      unit: isRtl ? 'ج.م/شهرياً' : 'EGP/Month',
      icon: Award,
      features: [
        t('pricing.plan6mFeature1'),
        t('pricing.plan6mFeature2'),
        t('pricing.plan6mFeature3'),
        t('pricing.plan6mFeature4'),
      ],
      btnText: t('pricing.plan6mBtn'),
      isPopular: true,
    },
    {
      id: '12m',
      name: t('pricing.plan12mName'),
      price: '3499',
      unit: isRtl ? 'ج.م/شهرياً' : 'EGP/Month',
      icon: Layers,
      features: [
        t('pricing.plan12mFeature1'),
        t('pricing.plan12mFeature2'),
        t('pricing.plan12mFeature3'),
        t('pricing.plan12mFeature4'),
      ],
      btnText: t('pricing.plan12mBtn'),
      isPopular: false,
    },
  ]

  return (
    <section id="pricing" className="w-full max-w-[1240px] xl:max-w-[1280px] mx-auto px-4 sm:px-6 py-12 lg:py-16 select-none">
      {/* Section Header (Figma node 1002:1728) - second line stays on one line */}
      <div className="text-start mb-12 sm:mb-16">
        <h2 className="text-[32px] sm:text-[38px] lg:text-[40px] font-bold text-[#111827] leading-tight mb-4">
          {t('pricing.title')}
        </h2>
        <p className="text-[18px] sm:text-[22px] lg:text-[24px] text-[#5c5c5c] font-medium leading-[1.5] w-full">
          {t('pricing.subtitle')}
        </p>
      </div>

      {/* 3 Pricing Cards Grid (Figma node 1002:1731) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch pt-4">
        {plans.map((plan) => {
          const Icon = plan.icon

          return (
            <div
              key={plan.id}
              className="group relative bg-white hover:bg-[#fdfbff] border border-[#b2b2b2] hover:border-[#5a198f] hover:border-2 rounded-[50px] px-5 sm:px-6 py-8 sm:py-10 flex flex-col justify-between transition-all duration-300 hover:shadow-[0px_16px_40px_rgba(90,25,143,0.22)] hover:-translate-y-2 h-full"
            >
              {/* Floating MOST POPULAR Badge - appears ONLY on the middle card when hovered */}
              {plan.isPopular && (
                <div className="absolute -top-[14px] left-1/2 -translate-x-1/2 rtl:translate-x-1/2 opacity-0 group-hover:opacity-100 -translate-y-2 group-hover:translate-y-0 transition-all duration-300 pointer-events-none z-20">
                  <span className="bg-[#5a198f] border border-[#c2a3db] px-4 py-1.5 rounded-full text-white text-[12px] font-bold tracking-[0.0586px] uppercase whitespace-nowrap shadow-md inline-block">
                    {t('pricing.popularBadge')}
                  </span>
                </div>
              )}

              <div className="flex flex-col gap-7 w-full text-start">
                {/* Card Header: Icon & Plan Name */}
                <div className="flex items-center gap-3 w-full">
                  <div className="size-[48px] rounded-full bg-[#5a198f] flex items-center justify-center shrink-0 shadow-sm">
                    <Icon className="size-[24px] text-white" />
                  </div>
                  <h3 className="text-[24px] font-semibold text-[#161616] leading-none">
                    {plan.name}
                  </h3>
                </div>

                {/* Price Display */}
                <div className="flex flex-col items-center gap-3 w-full">
                  <div className="text-center w-full">
                    <span className="text-[32px] font-bold text-[#161616] leading-none">
                      {plan.price}
                    </span>
                    <span className="text-[20px] font-medium text-[#161616] leading-none ms-2">
                      {plan.unit}
                    </span>
                  </div>
                  <div className="w-full h-px bg-[#bca4d1]" />
                </div>

                {/* Features List */}
                <ul className="flex flex-col gap-5 w-full">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2.5">
                      <img
                        src="/images/pricing-check-icon.svg"
                        alt=""
                        className="size-[22px] sm:size-[24px] shrink-0"
                      />
                      <span className="text-[16px] sm:text-[18px] font-medium text-[#161616] leading-snug whitespace-nowrap">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Button */}
              <div className="pt-8 w-full mt-auto">
                <a
                  href={`#plan-${plan.id}`}
                  className="w-full h-[56px] rounded-full border border-[#5a198f] text-[#5a198f] group-hover:bg-[#5a198f] group-hover:text-white group-hover:shadow-[0px_10px_15px_-3px_#bfdbfe] transition-all duration-300 font-bold text-[18px] flex items-center justify-center active:scale-98"
                >
                  {plan.btnText}
                </a>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
