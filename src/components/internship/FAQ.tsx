import { Accordion as AccordionPrimitive } from 'radix-ui'
import { useTranslation } from 'react-i18next'
import iconChevronDown from '../../assets/internship/icon-chevron-down.svg'
import SectionHeading from './SectionHeading'
import { FAQ_ITEMS } from './mockData'

const DEFAULT_OPEN_ITEM = FAQ_ITEMS[0]?.id

function FAQ() {
  const { t } = useTranslation()

  return (
    <section aria-labelledby="faq-heading" className="flex flex-col gap-16">
      <SectionHeading
        id="faq-heading"
        eyebrow={t('internshipPage.faq.eyebrow')}
        title={t('internshipPage.faq.title')}
        className="reveal-on-scroll"
      >
        {t('internshipPage.faq.description')}
      </SectionHeading>

      <AccordionPrimitive.Root
        type="single"
        collapsible
        defaultValue={DEFAULT_OPEN_ITEM}
        className="mx-auto flex w-full max-w-[768px] flex-col gap-4 reveal-on-scroll reveal-delay-150"
      >
        {FAQ_ITEMS.map((item) => (
          <AccordionPrimitive.Item
            key={item.id}
            value={item.id}
            className="rounded-2xl bg-white shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-2px_rgba(0,0,0,0.1)]"
          >
            <AccordionPrimitive.Header>
              <AccordionPrimitive.Trigger className="group flex w-full items-center justify-between gap-4 rounded-2xl p-6 text-start text-lg leading-7 font-bold text-[#22023c] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5a198f]">
                {t(`internshipPage.faq.items.${item.id}.question`)}
                <img
                  alt=""
                  src={iconChevronDown}
                  className="my-1 shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180"
                />
              </AccordionPrimitive.Trigger>
            </AccordionPrimitive.Header>
            <AccordionPrimitive.Content className="overflow-hidden px-6 pb-6 text-base leading-[26px] font-medium text-[rgba(35,0,47,0.7)]">
              <p className="-mt-2 max-w-[658px]">{t(`internshipPage.faq.items.${item.id}.answer`)}</p>
            </AccordionPrimitive.Content>
          </AccordionPrimitive.Item>
        ))}
      </AccordionPrimitive.Root>
    </section>
  )
}

export default FAQ
