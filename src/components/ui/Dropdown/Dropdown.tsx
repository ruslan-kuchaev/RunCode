"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface DropdownProps {
  trigger: React.ReactNode
  children: React.ReactNode
  className?: string
  align?: "start" | "center" | "end"
  side?: "top" | "bottom" | "left" | "right"
}

const Dropdown = React.forwardRef<HTMLDivElement, DropdownProps>(
  ({ trigger, children, className, align = "start", side = "bottom" }, ref) => {
    const [isOpen, setIsOpen] = React.useState(false)
    const dropdownRef = React.useRef<HTMLDivElement>(null)

    React.useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
          setIsOpen(false)
        }
      }

      const handleEscape = (event: KeyboardEvent) => {
        if (event.key === "Escape") {
          setIsOpen(false)
        }
      }

      if (isOpen) {
        document.addEventListener("mousedown", handleClickOutside)
        document.addEventListener("keydown", handleEscape)
      }

      return () => {
        document.removeEventListener("mousedown", handleClickOutside)
        document.removeEventListener("keydown", handleEscape)
      }
    }, [isOpen])

    const getAlignmentClass = () => {
      switch (align) {
        case "start":
          return "left-0"
        case "center":
          return "left-1/2 -translate-x-1/2"
        case "end":
          return "right-0"
        default:
          return "left-0"
      }
    }

    const getSideClass = () => {
      switch (side) {
        case "top":
          return "bottom-full mb-2"
        case "bottom":
          return "top-full mt-2"
        case "left":
          return "right-full mr-2"
        case "right":
          return "left-full ml-2"
        default:
          return "top-full mt-2"
      }
    }

    return (
      <div ref={dropdownRef} className="relative inline-block">
        <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
          {trigger}
        </div>
        {isOpen && (
          <div
            ref={ref}
            className={cn(
              "absolute z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95",
              getSideClass(),
              getAlignmentClass(),
              className
            )}
          >
            {children}
          </div>
        )}
      </div>
    )
  }
)
Dropdown.displayName = "Dropdown"

const DropdownItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { disabled?: boolean }
>(({ className, disabled, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
      disabled && "pointer-events-none opacity-50",
      className
    )}
    {...props}
  />
))
DropdownItem.displayName = "DropdownItem"

const DropdownSeparator = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-muted", className)}
    {...props}
  />
))
DropdownSeparator.displayName = "DropdownSeparator"

const DropdownLabel = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("px-2 py-1.5 text-sm font-semibold", className)}
    {...props}
  />
))
DropdownLabel.displayName = "DropdownLabel"

export { Dropdown, DropdownItem, DropdownSeparator, DropdownLabel }
