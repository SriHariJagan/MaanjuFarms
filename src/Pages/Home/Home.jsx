import React from 'react'
import Hero from './HeroSection/HeroSection'
import OurCategories from './OurCategories/OurCategories'
import BestSellers from './Bestsellers/Bestsellers'
import PuritySection from './PuritySection/PuritySection'
import Testimonials from './Testimonials/Testimonials'

const Home = () => {
  return (
    <div>
        <Hero />
        <OurCategories />
        <BestSellers />
        <PuritySection />
        <Testimonials />
    </div>
  )
}

export default Home