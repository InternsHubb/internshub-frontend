import type { ReactNode } from 'react'

interface SectionHeadingProps {
  id: string
  eyebrow: string
  title: string
  children: ReactNode
}

function SectionHeading({ id, eyebrow, title, children }: SectionHeadingProps) {
  return (
    <div className="flex flex-col items-center gap-3 text-center">
      <p className="text-sm leading-5 font-bold tracking-[0.35px] text-[#5a198f]">{eyebrow}</p>
      <h2 id={id} className="text-[28px] leading-9 font-extrabold text-[#111827] sm:text-4xl sm:leading-10">
        {title}
      </h2>
      <p className="max-w-[710px] pt-1 text-base leading-7 text-[#6b7280] sm:text-lg">{children}</p>
    </div>
  )
}

export default SectionHeading
