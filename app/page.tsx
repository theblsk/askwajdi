"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Moon, Sun, ExternalLink, Code, Database, Zap, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { useScrollAnimation } from "@/hooks/useScrollAnimation"
import { fadeInUp, scaleIn, slideInFromBottom } from "@/lib/animations"
import { FloatingParticles } from "@/components/floating-particles"
import Image from "next/image"

interface AnimatedElementProps {
  children: React.ReactNode
  animation?: any
  delay?: number
  className?: string
}

function AnimatedElement({ children, animation = fadeInUp, delay = 0, className = "" }: AnimatedElementProps) {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 })

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${className}`}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible
          ? `translateY(0px) translateX(0px) scale(1)`
          : `translateY(${animation.initial.y || 0}px) translateX(${animation.initial.x || 0}px) scale(${animation.initial.scale || 1})`,
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  )
}

export default function HomePage() {
  const [darkMode, setDarkMode] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    question: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  // Initialize theme based on system preference
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    setDarkMode(mediaQuery.matches)

    const handleChange = (e: MediaQueryListEvent) => {
      setDarkMode(e.matches)
    }

    mediaQuery.addEventListener("change", handleChange)
    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [])

  // Apply theme to document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [darkMode])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.email) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    if (!formData.question.trim()) {
      newErrors.question = "Question is required"
    } else if (formData.question.trim().length < 10) {
      newErrors.question = "Question must be at least 10 characters long"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })
    
      if (response.ok) {
        toast({
          title: "Question submitted!",
          description: "Thanks for your question. Wajdi will get back to you soon.",
        })
        setFormData({ name: "", email: "", question: "" })
        setErrors({})
      } else {
        throw new Error("Failed to submit question")
      }
    } catch (error) {
      console.error("Error submitting question:", error)
      toast({
        title: "Error",
        description: "Failed to submit your question. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const expertiseAreas = [
    {
      icon: <Code className="w-5 h-5" />,
      title: "Scalable Systems",
      description: "Building robust architectures that grow with your needs",
    },
    {
      icon: <Database className="w-5 h-5" />,
      title: "Distributed Architecture",
      description: "Designing systems that handle complexity at scale",
    },
    {
      icon: <Zap className="w-5 h-5" />,
      title: "Performance Optimization",
      description: "Making applications faster and more efficient",
    },
    {
      icon: <Users className="w-5 h-5" />,
      title: "System Design",
      description: "Creating solutions for real-world problems",
    },
  ]

  return (
    <div
      className={`min-h-screen transition-all duration-500 relative ${
        darkMode
          ? "bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white"
          : "bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-900"
      }`}
    >
      {/* Floating Particles Background */}
      <FloatingParticles darkMode={darkMode} />

      {/* Floating Theme Toggle */}
      <div className="fixed top-6 right-6 z-50">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setDarkMode(!darkMode)}
          className={`rounded-full backdrop-blur-sm transition-all duration-300 hover:scale-110 ${
            darkMode
              ? "bg-white/10 hover:bg-white/20 border border-white/20"
              : "bg-black/5 hover:bg-black/10 border border-black/10"
          }`}
        >
          {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12 max-w-6xl relative z-10">
        {/* Hero Section */}
        <div className="text-center mb-16 space-y-8">
          {/* Brand */}
          <AnimatedElement animation={fadeInUp} delay={0}>
            <div className="space-y-4">
              <h1
                className={`text-5xl md:text-7xl font-bold tracking-tight ${
                  darkMode
                    ? "bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent"
                    : "bg-gradient-to-r from-gray-900 via-blue-600 to-gray-900 bg-clip-text text-transparent"
                }`}
              >
                Ask Wajdi 
              </h1>
              <p className={`text-xl md:text-2xl font-light ${darkMode ? "text-white/70" : "text-gray-600"}`}>
                Software Engineering Expertise
              </p>
            </div>
          </AnimatedElement>

          {/* Profile Section */}
          <div className="flex flex-col items-center space-y-6">
            <AnimatedElement animation={scaleIn} delay={200}>
              <div className="relative">
                <div
                  className={`absolute inset-0 rounded-full blur-xl ${
                    darkMode ? "bg-blue-500/20" : "bg-blue-500/10"
                  } animate-pulse-glow`}
                ></div>
                <Image
                  src="/images/wajdi-profile.jpg"
                  alt="Wajdi Ballout"
                  width={120}
                  height={120}
                  className={`relative w-24 h-24 md:w-30 md:h-30 rounded-full object-cover border-4 transition-all duration-300 hover:scale-105 ${
                    darkMode ? "border-blue-400/50" : "border-blue-500/30"
                  }`}
                  priority
                />
              </div>
            </AnimatedElement>

            <AnimatedElement animation={fadeInUp} delay={400}>
              <div className="text-center space-y-2">
                <h2 className="text-2xl md:text-3xl font-semibold">Wajdi Ballout</h2>
                <p className={`text-lg ${darkMode ? "text-blue-300" : "text-blue-600"} font-medium`}>
                  Software Engineer
                </p>
                <p
                  className={`max-w-2xl mx-auto text-base md:text-lg leading-relaxed ${
                    darkMode ? "text-white/80" : "text-gray-700"
                  }`}
                >
                  Passionate about building scalable systems that solve real-world problems. I specialize in distributed
                  architectures, performance optimization, and creating robust solutions that handle growth.
                </p>
              </div>
            </AnimatedElement>
          </div>
        </div>

        {/* Expertise Grid */}
        <AnimatedElement animation={fadeInUp} delay={0}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {expertiseAreas.map((area, index) => (
              <AnimatedElement key={area.title} animation={fadeInUp} delay={index * 100} className="h-full">
                <div
                  className={`group p-6 rounded-2xl transition-all duration-300 hover:scale-105 hover:-translate-y-1 h-full backdrop-blur-sm ${
                    darkMode
                      ? "bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20"
                      : "bg-white/80 hover:bg-white border border-gray-200/50 hover:border-gray-300 shadow-sm hover:shadow-lg"
                  }`}
                >
                  <div
                    className={`inline-flex p-3 rounded-xl mb-4 transition-colors ${
                      darkMode
                        ? "bg-blue-500/20 text-blue-300 group-hover:bg-blue-500/30"
                        : "bg-blue-50 text-blue-600 group-hover:bg-blue-100"
                    }`}
                  >
                    {area.icon}
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{area.title}</h3>
                  <p className={`text-sm leading-relaxed ${darkMode ? "text-white/70" : "text-gray-600"}`}>
                    {area.description}
                  </p>
                </div>
              </AnimatedElement>
            ))}
          </div>
        </AnimatedElement>

        {/* Question Form */}
        <AnimatedElement animation={slideInFromBottom} delay={0}>
          <div className="max-w-2xl mx-auto">
            <div
              className={`p-8 md:p-10 rounded-3xl backdrop-blur-sm transition-all duration-300 ${
                darkMode
                  ? "bg-white/5 border border-white/10 shadow-2xl"
                  : "bg-white/90 border border-gray-200/50 shadow-xl"
              }`}
            >
              <AnimatedElement animation={fadeInUp} delay={200}>
                <div className="text-center mb-8">
                  <h3 className="text-2xl md:text-3xl font-bold mb-3">Ask Your Question</h3>
                  <p className={`text-base ${darkMode ? "text-white/70" : "text-gray-600"}`}>
                    Have questions about software engineering, system architecture, or building scalable solutions?
                  </p>
                </div>
              </AnimatedElement>

              <AnimatedElement animation={fadeInUp} delay={400}>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Input
                        type="text"
                        placeholder="Your name (optional)"
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        className={`h-12 rounded-xl border-2 transition-all duration-200 backdrop-blur-sm ${
                          darkMode
                            ? "bg-white/5 border-white/20 focus:border-blue-400 focus:bg-white/10 placeholder:text-white/50"
                            : "bg-white/80 border-gray-200 focus:border-blue-500 focus:bg-white placeholder:text-gray-500"
                        }`}
                      />
                    </div>

                    <div className="space-y-2">
                      <Input
                        type="email"
                        placeholder="Your email address *"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        className={`h-12 rounded-xl border-2 transition-all duration-200 backdrop-blur-sm ${
                          errors.email
                            ? "border-red-500 focus:border-red-500"
                            : darkMode
                              ? "bg-white/5 border-white/20 focus:border-blue-400 focus:bg-white/10 placeholder:text-white/50"
                              : "bg-white/80 border-gray-200 focus:border-blue-500 focus:bg-white placeholder:text-gray-500"
                        }`}
                      />
                      {errors.email && <p className="text-red-500 text-sm ml-1">{errors.email}</p>}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Textarea
                      placeholder="What's your question? *"
                      value={formData.question}
                      onChange={(e) => handleInputChange("question", e.target.value)}
                      rows={5}
                      className={`rounded-xl border-2 transition-all duration-200 resize-none backdrop-blur-sm ${
                        errors.question
                          ? "border-red-500 focus:border-red-500"
                          : darkMode
                            ? "bg-white/5 border-white/20 focus:border-blue-400 focus:bg-white/10 placeholder:text-white/50"
                            : "bg-white/80 border-gray-200 focus:border-blue-500 focus:bg-white placeholder:text-gray-500"
                      }`}
                    />
                    {errors.question && <p className="text-red-500 text-sm ml-1">{errors.question}</p>}
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full h-14 text-lg font-semibold rounded-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] ${
                      darkMode
                        ? "bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 shadow-lg shadow-blue-500/25"
                        : "bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 shadow-lg shadow-blue-500/25"
                    } text-white disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Submitting...</span>
                      </div>
                    ) : (
                      "Submit Question"
                    )}
                  </Button>
                </form>
              </AnimatedElement>
            </div>
          </div>
        </AnimatedElement>

        {/* Footer */}
        <AnimatedElement animation={fadeInUp} delay={0}>
          <div className="text-center mt-16 space-y-6">
            <div className="flex justify-center space-x-8">
              <a
                href="https://linkedin.com/in/wajdiballout"
                target="_blank"
                rel="noopener noreferrer"
                className={`group flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-300 hover:scale-105 ${
                  darkMode
                    ? "text-white/70 hover:text-white hover:bg-white/10"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                <span className="font-medium">LinkedIn</span>
                <ExternalLink className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </a>
              <a
                href="https://blsk.dev"
                target="_blank"
                rel="noopener noreferrer"
                className={`group flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-300 hover:scale-105 ${
                  darkMode
                    ? "text-white/70 hover:text-white hover:bg-white/10"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                <span className="font-medium">blsk.dev</span>
                <ExternalLink className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </a>
            </div>

            <p className={`text-sm ${darkMode ? "text-white/50" : "text-gray-500"}`}>
              © 2025 askwajdi.com • Built with passion for great software
            </p>
          </div>
        </AnimatedElement>
      </div>
    </div>
  )
}
