import React, { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import Navbar from "../components/Navbar";
import AfterNavBanner from "../components/AfterNavBanner";
import Hero from "../components/Hero";
import BlogGrid from "../components/BlogGrid";
import Footer from "../components/Footer";
import ScrollToTop from "../components/ScrollToTop";

// Animated Counter Component
const AnimatedCounter = ({ end, duration = 2, suffix = "", prefix = "" }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;

    let startTime;
    let animationFrame;

    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = (currentTime - startTime) / (duration * 1000);

      if (progress < 1) {
        setCount(Math.floor(end * progress));
        animationFrame = requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [isInView, end, duration]);

  return (
    <span
      ref={ref}
      className="font-bold text-5xl bg-gradient-to-r from-gold-accent via-newari-red to-gold-accent bg-clip-text text-transparent"
    >
      {prefix}
      {count.toLocaleString()}
      {suffix}
    </span>
  );
};

// Stats Section Component
const StatsSection = () => {
  const stats = [
    { number: 500, suffix: "+", label: "Community Members", icon: "👥" },
    { number: 25, suffix: "+", label: "Cultural Events", icon: "🎉" },
    { number: 10, suffix: "+", label: "Years Serving", icon: "⏳" },
    { number: 100, suffix: "%", label: "Cultural Dedication", icon: "❤️" },
  ];

  return (
    <section className="relative py-20 px-4 overflow-hidden">
      {/* Mandala Background */}
      <div className="absolute inset-0 mandala-pattern opacity-5"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="heading-lg mb-6 relative inline-block">
            Our Impact
            <div className="absolute -top-3 -left-3 w-8 h-8 border-t-2 border-l-2 border-gold-accent"></div>
            <div className="absolute -bottom-3 -right-3 w-8 h-8 border-b-2 border-r-2 border-newari-red"></div>
          </h2>
          <div className="pagoda-divider w-48 mx-auto"></div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className="card-premium temple-corner text-center group hover:scale-105 transition-transform duration-300"
            >
              <div className="relative">
                {/* Mandala Overlay */}
                <div className="absolute inset-0 mandala-pattern opacity-5 group-hover:opacity-10 transition-opacity"></div>

                <div className="relative z-10 space-y-4 py-8">
                  {/* Icon with gradient */}
                  <div className="text-6xl mb-4 inline-block p-4 rounded-full bg-gradient-to-br from-gold-accent to-newari-red shadow-lg shadow-gold-accent/20 group-hover:shadow-xl group-hover:shadow-newari-red/30 transition-all">
                    {stat.icon}
                  </div>

                  <AnimatedCounter end={stat.number} suffix={stat.suffix} />

                  <p className="text-xl text-paragraph-text font-medium">
                    {stat.label}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Testimonials Section Component
const TestimonialsSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const testimonials = [
    {
      quote:
        "Lyaymha America Guthi has been instrumental in keeping our Newari traditions alive for our children. The cultural events are amazing!",
      author: "Sunita Shrestha",
      role: "Community Member",
      location: "Boston, MA",
    },
    {
      quote:
        "The team's dedication to preserving our heritage is truly inspiring. Every event feels like home.",
      author: "Rajesh Maharjan",
      role: "Event Volunteer",
      location: "New York, NY",
    },
    {
      quote:
        "My kids love participating in the cultural activities. It's wonderful to see them connect with their roots.",
      author: "Anita Dangol",
      role: "Parent",
      location: "California",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  return (
    <section className="relative py-20 px-4 overflow-hidden">
      {/* Mandala Background */}
      <div className="absolute inset-0 mandala-pattern opacity-5"></div>

      <div className="max-w-5xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="heading-lg mb-6 relative inline-block">
            Community Voices
            <div className="absolute -top-3 -left-3 w-8 h-8 border-t-2 border-l-2 border-gold-accent"></div>
            <div className="absolute -bottom-3 -right-3 w-8 h-8 border-b-2 border-r-2 border-newari-red"></div>
          </h2>
          <div className="pagoda-divider w-48 mx-auto"></div>
        </motion.div>

        <div className="relative min-h-[300px]">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0 }}
              animate={{
                opacity: currentIndex === index ? 1 : 0,
                x: currentIndex === index ? 0 : currentIndex > index ? -50 : 50,
              }}
              transition={{ duration: 0.5 }}
              className={`${
                currentIndex === index ? "relative" : "absolute inset-0"
              } card-premium temple-corner`}
            >
              <div className="relative">
                {/* Mandala Overlay */}
                <div className="absolute inset-0 mandala-pattern opacity-5"></div>

                <div className="relative z-10 p-8 md:p-12">
                  {/* Quote Icon */}
                  <div className="text-gold-accent text-6xl mb-6">"</div>

                  <p className="text-xl md:text-2xl text-primary-text mb-8 italic leading-relaxed">
                    {testimonial.quote}
                  </p>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gold-accent font-bold text-xl">
                        {testimonial.author}
                      </p>
                      <p className="text-paragraph-text">{testimonial.role}</p>
                      <p className="text-sm text-gray-400">
                        {testimonial.location}
                      </p>
                    </div>

                    {/* Decorative Corner */}
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gold-accent to-newari-red opacity-20"></div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Carousel Indicators */}
        <div className="flex justify-center space-x-3 mt-8">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                currentIndex === index
                  ? "bg-gold-accent w-8"
                  : "bg-gray-600 hover:bg-newari-red"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

// Premium CTA Banner Component
const CTABanner = () => {
  return (
    <section className="relative py-20 px-4 overflow-hidden">
      {/* Animated Mandala Background */}
      <motion.div
        className="absolute inset-0 mandala-pattern opacity-10"
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
      ></motion.div>

      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="card-premium temple-corner text-center"
        >
          <div className="relative p-12">
            {/* Decorative Corners */}
            <div className="absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2 border-gold-accent"></div>
            <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-gold-accent"></div>
            <div className="absolute bottom-4 left-4 w-12 h-12 border-b-2 border-l-2 border-newari-red"></div>
            <div className="absolute bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 border-newari-red"></div>

            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-gold-accent via-newari-red to-gold-accent bg-clip-text text-transparent">
              Join Our Cultural Journey
            </h2>

            <div className="pagoda-divider w-48 mx-auto mb-6"></div>

            <p className="text-xl text-paragraph-text mb-10 max-w-2xl mx-auto">
              Be part of preserving and celebrating Newari heritage in America.
              Connect with your roots, make lasting friendships, and create
              memories.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.a
                href="/contact"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-primary text-lg px-8 py-4 bg-gradient-to-r from-gold-accent to-newari-red hover:from-newari-red hover:to-gold-accent transition-all duration-300 shadow-lg shadow-gold-accent/30 hover:shadow-xl hover:shadow-newari-red/40"
              >
                Get Involved
              </motion.a>

              <motion.a
                href="/culture-and-tradition"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-secondary text-lg px-8 py-4 border-2 border-gold-accent text-gold-accent hover:bg-gold-accent hover:text-charcoal-black transition-all duration-300"
              >
                Learn More
              </motion.a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const Home = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      {/* StatsSection temporarily removed per request */}
      {/* <StatsSection /> */}
      <BlogGrid limit={6} />
      <TestimonialsSection />
      <CTABanner />
      {/* AfterNavBanner placed before Footer */}
      <AfterNavBanner />
      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default Home;
