export interface Testimonial {
  id: string
  quoteKey: string
  nameKey: string
  roleKey: string
  rating: number
  avatar: string
  company: string
}

export const testimonials: Testimonial[] = [
  {
    id: 'test-1',
    quoteKey: 'testimonials.quote1',
    nameKey: 'testimonials.user1Name',
    roleKey: 'testimonials.user1Role',
    rating: 5,
    avatar: '/images/mentor-nadia.jpg',
    company: 'Shopify',
  },
  {
    id: 'test-2',
    quoteKey: 'testimonials.quote2',
    nameKey: 'testimonials.user2Name',
    roleKey: 'testimonials.user2Role',
    rating: 5,
    avatar: '/images/mentor-ahmed.jpg',
    company: 'Careem',
  },
  {
    id: 'test-3',
    quoteKey: 'testimonials.quote3',
    nameKey: 'testimonials.user3Name',
    roleKey: 'testimonials.user3Role',
    rating: 5,
    avatar: '/images/experience-mentor.jpg',
    company: 'Stripe',
  },
  {
    id: 'test-4',
    quoteKey: 'testimonials.quote4',
    nameKey: 'testimonials.user4Name',
    roleKey: 'testimonials.user4Role',
    rating: 5,
    avatar: '/images/mentor-ahmed.jpg',
    company: 'FinTech Hub',
  },
  {
    id: 'test-5',
    quoteKey: 'testimonials.quote5',
    nameKey: 'testimonials.user5Name',
    roleKey: 'testimonials.user5Role',
    rating: 5,
    avatar: '/images/mentor-nadia.jpg',
    company: 'TechNova',
  },
]
