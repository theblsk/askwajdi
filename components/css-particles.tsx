"use client"

import { useEffect, useState } from "react"

interface CSSParticlesProps {
  darkMode: boolean
}

interface ParticleData {
  id: number
  left: number
  animationDelay: number
  animationDuration: number
  size: number
  opacity: number
}

export function CSSParticles({ darkMode }: CSSParticlesProps) {
  const [particles, setParticles] = useState<ParticleData[]>([])

  useEffect(() => {
    const generateParticles = () => {
      const particleCount = 30
      const newParticles: ParticleData[] = []

      for (let i = 0; i < particleCount; i++) {
        newParticles.push({
          id: i,
          left: Math.random() * 100,
          animationDelay: Math.random() * 20,
          animationDuration: 15 + Math.random() * 10,
          size: 2 + Math.random() * 4,
          opacity: 0.1 + Math.random() * 0.4,
        })
      }

      setParticles(newParticles)
    }

    generateParticles()
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className={`absolute rounded-full animate-float ${darkMode ? "bg-blue-400/20" : "bg-blue-500/15"}`}
          style={{
            left: `${particle.left}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            opacity: particle.opacity,
            animationDelay: `${particle.animationDelay}s`,
            animationDuration: `${particle.animationDuration}s`,
            filter: "blur(0.5px)",
          }}
        />
      ))}

      <style jsx>{`
        @keyframes float {
          0% {
            transform: translateY(100vh) translateX(0px) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(-100px) translateX(100px) rotate(360deg);
            opacity: 0;
          }
        }
        .animate-float {
          animation: float linear infinite;
        }
      `}</style>
    </div>
  )
}
