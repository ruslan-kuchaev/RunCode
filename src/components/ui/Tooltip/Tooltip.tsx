"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface TooltipProps {
  content: React.ReactNode
  children: React.ReactNode
  side?: "top" | "bottom" | "left" | "right"
  align?: "start" | "center" | "end"
  delayDuration?: number
  className?: string
}

const Tooltip = React.forwardRef<HTMLDivElement, TooltipProps>(
  (
    {
      content,
      children,
      side = "top",
      align = "center",
      delayDuration = 200,
      className,
    },
    ref
  ) => {
    const [isVisible, setIsVisible] = React.useState(false)
    const timeoutRef = React.useRef<NodeJS.Timeout | undefined>(undefined)

    const handleMouseEnter = () => {
      timeoutRef.current = setTimeout(() => {
        setIsVisible(true)
      }, delayDuration)
    }

    const handleMouseLeave = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      setIsVisible(false)
    }

    React.useEffect(() => {
      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
        }
      }
    }, [])

    const getPositionClasses = () => {
      const positions = {
        top: {
          start: "bottom-full left-0 mb-2",
          center: "bottom-full left-1/2 -translate-x-1/2 mb-2",
          end: "bottom-full right-0 mb-2",
        },
        bottom: {
          start: "top-full left-0 mt-2",
          center: "top-full left-1/2 -translate-x-1/2 mt-2",
          end: "top-full right-0 mt-2",
        },
        left: {
          start: "right-full top-0 mr-2",
          center: "right-full top-1/2 -translate-y-1/2 mr-2",
          end: "right-full bottom-0 mr-2",
        },
        right: {
          start: "left-full top-0 ml-2",
          center: "left-full top-1/2 -translate-y-1/2 ml-2",
          end: "left-full bottom-0 ml-2",
        },
      }

      return positions[side][align]
    }

    const getArrowClasses = () => {
      const arrows = {
        top: {
          start: "top-full left-2 border-l-transparent border-r-transparent border-b-transparent",
          center: "top-full left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-b-transparent",
          end: "top-full right-2 border-l-transparent border-r-transparent border-b-transparent",
        },
        bottom: {
          start: "bottom-full left-2 border-l-transparent border-r-transparent border-t-transparent",
          center: "bottom-full left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-t-transparent",
          end: "bottom-full right-2 border-l-transparent border-r-transparent border-t-transparent",
        },
        left: {
          start: "left-full top-2 border-t-transparent border-b-transparent border-r-transparent",
          center: "left-full top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-r-transparent",
          end: "left-full bottom-2 border-t-transparent border-b-transparent border-r-transparent",
        },
        right: {
          start: "right-full top-2 border-t-transparent border-b-transparent border-l-transparent",
          center: "right-full top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-l-transparent",
          end: "right-full bottom-2 border-t-transparent border-b-transparent border-l-transparent",
        },
      }

      return arrows[side][align]
    }

    return (
      <div
        ref={ref}
        className="relative inline-block"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {children}
        {isVisible && (
          <div
            className={cn(
              "absolute z-50 overflow-hidden rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground animate-in fade-in-0 zoom-in-95",
              getPositionClasses(),
              className
            )}
            role="tooltip"
          >
            {content}
            {/* Arrow */}
            <div
              className={cn(
                "absolute h-0 w-0 border-4 border-primary",
                getArrowClasses()
              )}
            />
          </div>
        )}
      </div>
    )
  }
)
Tooltip.displayName = "Tooltip"

const TooltipProvider = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>
}

const TooltipTrigger = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("inline-block", className)} {...props} />
))
TooltipTrigger.displayName = "TooltipTrigger"

const TooltipContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "z-50 overflow-hidden rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground",
      className
    )}
    {...props}
  />
))
TooltipContent.displayName = "TooltipContent"

export { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent }
