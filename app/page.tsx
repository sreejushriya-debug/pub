import Hero from '@/components/Hero'
import Stats from '@/components/Stats'
import Offerings from '@/components/Offerings'
import CourseSignup from '@/components/CourseSignup'
import NumbersDontLie from '@/components/NumbersDontLie'
import CoursePromo from '@/components/CoursePromo'

export default function Home() {
  return (
    <>
      <Hero />
      <Stats />
      <Offerings />
      <CourseSignup />
      <NumbersDontLie />
      <CoursePromo />
    </>
  )
}
