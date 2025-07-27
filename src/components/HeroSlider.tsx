import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const slides = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=1200&h=600&fit=crop',
    title: 'Custom T-Shirt Printing',
    subtitle: 'Express yourself with our unique designs',
    cta: 'Shop Now'
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=1200&h=600&fit=crop',
    title: 'Premium Quality Materials',
    subtitle: 'Comfortable cotton that lasts',
    cta: 'Explore Collection'
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=1200&h=600&fit=crop',
    title: 'Limited Edition Designs',
    subtitle: 'Exclusive prints you won\'t find anywhere else',
    cta: 'View Featured'
  }
];

const HeroSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative h-[400px] md:h-[500px] overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-transform duration-500 ease-in-out ${
            index === currentSlide ? 'translate-x-0' : 
            index < currentSlide ? '-translate-x-full' : 'translate-x-full'
          }`}
        >
          <div
            className="w-full h-full bg-cover bg-center bg-no-repeat relative"
            style={{ backgroundImage: `url(${slide.image})` }}
          >
            <div className="absolute inset-0 bg-black bg-opacity-40" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white px-4">
                <h1 className="text-4xl md:text-6xl font-bold mb-4">
                  {slide.title}
                </h1>
                <p className="text-lg md:text-xl mb-6">
                  {slide.subtitle}
                </p>
                <Button size="lg" className="bg-primary hover:bg-primary/90">
                  {slide.cta}
                </Button>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <Button
        variant="outline"
        size="icon"
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 border-white/30 hover:bg-white/30"
        onClick={prevSlide}
      >
        <ChevronLeft className="h-6 w-6 text-white" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 border-white/30 hover:bg-white/30"
        onClick={nextSlide}
      >
        <ChevronRight className="h-6 w-6 text-white" />
      </Button>

      {/* Dots Indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === currentSlide ? 'bg-white' : 'bg-white/50'
            }`}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSlider;