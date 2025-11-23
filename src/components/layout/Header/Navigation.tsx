"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { ROUTES } from "@/constants/routes"
import { Dropdown, DropdownItem, DropdownSeparator } from "@/components/ui/Dropdown/Dropdown"

export interface NavigationProps {
  className?: string
  isMobile?: boolean
  onNavigate?: () => void
}

interface NavItem {
  label: string
  href: string
  id: string
}

interface NavItemWithDropdown extends NavItem {
  dropdown?: NavItem[]
}

export const Navigation = React.forwardRef<HTMLElement, NavigationProps>(
  ({ className, isMobile = false, onNavigate }, ref) => {
    const pathname = usePathname()

    const navItems: NavItemWithDropdown[] = [
      {
        label: "Задачи",
        href: ROUTES.TASKS,
        id: "tasks",
      },
      {
        label: "Рейтинг",
        href: ROUTES.RATING,
        id: "rating",
      },
      {
        label: "Профиль",
        href: ROUTES.PROFILE,
        id: "profile",
      },
    ]

    const isActive = (href: string) => {
      if (href === ROUTES.HOME) {
        return pathname === href
      }
      return pathname.startsWith(href)
    }

    const handleNavigate = () => {
      if (onNavigate) {
        onNavigate()
      }
    }

    if (isMobile) {
      return (
        <nav ref={ref} className={cn("flex flex-col space-y-2", className)}>
          {navItems.map((item) => {
            const active = isActive(item.href)

            if (item.dropdown) {
              return (
                <div key={item.id} className="space-y-2">
                  <div
                    className={cn(
                      "flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                      active
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent"
                    )}
                  >
                    <span>{item.label}</span>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                  <div className="pl-4 space-y-1">
                    {item.dropdown.map((dropdownItem) => (
                      <Link
                        key={dropdownItem.id}
                        href={dropdownItem.href}
                        onClick={handleNavigate}
                        className={cn(
                          "block px-4 py-2 rounded-lg text-sm transition-colors",
                          isActive(dropdownItem.href)
                            ? "bg-accent text-accent-foreground"
                            : "text-muted-foreground hover:text-foreground hover:bg-accent"
                        )}
                      >
                        {dropdownItem.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )
            }

            return (
              <Link
                key={item.id}
                href={item.href}
                onClick={handleNavigate}
                className={cn(
                  "px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                  active
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                )}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>
      )
    }

    return (
      <nav ref={ref} className={cn("flex items-center gap-1", className)}>
        {navItems.map((item) => {
          const active = isActive(item.href)

          if (item.dropdown) {
            return (
              <Dropdown
                key={item.id}
                trigger={
                  <div
                    className={cn(
                      "flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer",
                      active
                        ? "text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent"
                    )}
                  >
                    {item.label}
                    <ChevronDown className="w-4 h-4" />
                  </div>
                }
                align="start"
              >
                {item.dropdown.map((dropdownItem, index) => (
                  <React.Fragment key={dropdownItem.id}>
                    {index > 0 && <DropdownSeparator />}
                    <Link href={dropdownItem.href} onClick={handleNavigate}>
                      <DropdownItem>{dropdownItem.label}</DropdownItem>
                    </Link>
                  </React.Fragment>
                ))}
              </Dropdown>
            )
          }

          return (
            <Link
              key={item.id}
              href={item.href}
              onClick={handleNavigate}
              className={cn(
                "relative px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                active
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              )}
            >
              {item.label}
              {active && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />
              )}
            </Link>
          )
        })}
      </nav>
    )
  }
)

Navigation.displayName = "Navigation"
