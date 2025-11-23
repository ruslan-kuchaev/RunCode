"use client"

import * as React from "react"
import { useEffect, useRef, useState } from "react"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { ROUTES } from "@/constants/routes"
import { Navigation } from "./Navigation"
import { UserMenu } from "./UserMenu"

export interface HeaderProps {
  className?: string
}

export const Header = React.forwardRef<HTMLElement, HeaderProps>(
  ({ className }, ref) => {
    const headerRef = useRef<HTMLElement>(null)
    const [isScrolled, setIsScrolled] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [isVisible, setIsVisible] = useState(true)
    const lastScrollY = useRef(0)

    // Handle scroll behavior
    useEffect(() => {
      const handleScroll = () => {
        const currentScrollY = window.scrollY

        // Update scrolled state for styling
        setIsScrolled(currentScrollY > 20)

        // Hide/show header based on scroll direction
        if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
          setIsVisible(false)
        } else {
          setIsVisible(true)
        }

        lastScrollY.current = currentScrollY
      }

      let ticking = false
      const throttledScroll = () => {
        if (!ticking) {
          requestAnimationFrame(() => {
            handleScroll()
            ticking = false
          })
          ticking = true
        }
      }

      window.addEventListener("scroll", throttledScroll, { passive: true })
      return () => window.removeEventListener("scroll", throttledScroll)
    }, [])

    // GSAP animation for header visibility
    useGSAP(
      () => {
        if (!headerRef.current) return

        gsap.to(headerRef.current, {
          y: isVisible ? 0 : -100,
          duration: 0.3,
          ease: "power2.out",
        })
      },
      { dependencies: [isVisible] }
    )

    // Close mobile menu on escape
    useEffect(() => {
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === "Escape" && isMobileMenuOpen) {
          setIsMobileMenuOpen(false)
        }
      }

      document.addEventListener("keydown", handleEscape)
      return () => document.removeEventListener("keydown", handleEscape)
    }, [isMobileMenuOpen])

    // Prevent body scroll when mobile menu is open
    useEffect(() => {
      if (isMobileMenuOpen) {
        document.body.style.overflow = "hidden"
      } else {
        document.body.style.overflow = ""
      }

      return () => {
        document.body.style.overflow = ""
      }
    }, [isMobileMenuOpen])

    return (
      <>
        <header
          ref={headerRef}
          className={cn(
            "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
            isScrolled
              ? "bg-background/80 backdrop-blur-lg border-b border-border shadow-sm"
              : "bg-transparent",
            className
          )}
        >
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <Link
                href={ROUTES.HOME}
                className="flex items-center gap-2 text-xl font-bold text-foreground hover:opacity-80 transition-opacity"
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-sm">
                    RC
                  </span>
                </div>
                <span className="hidden sm:inline">RunCode</span>
              </Link>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center gap-8">
                <Navigation />
              </div>

              {/* Desktop User Menu */}
              <div className="hidden md:block">
                <UserMenu />
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-accent transition-colors"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </header>

        {/* Mobile Menu Drawer */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-40 md:hidden">
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-background/80 backdrop-blur-sm"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Menu Content */}
            <div className="absolute top-16 left-0 right-0 bg-background border-b border-border shadow-lg animate-in slide-in-from-top-4 duration-300">
              <div className="container mx-auto px-4 py-6 space-y-6">
                <Navigation
                  isMobile
                  onNavigate={() => setIsMobileMenuOpen(false)}
                />
                <div className="pt-4 border-t border-border">
                  <UserMenu
                    isMobile
                    onAction={() => setIsMobileMenuOpen(false)}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    )
  }
)

Header.displayName = "Header"
