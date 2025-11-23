"use client"

import * as React from "react"
import { useSession, signOut } from "next-auth/react"
import { User, Settings, LogOut, LogIn } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { ROUTES } from "@/constants/routes"
import { useAuthStore } from "@/store/authStore"
import { Avatar } from "@/components/ui/Avatar/Avatar"
import { Button } from "@/components/ui/Button/Button"
import {
  Dropdown,
  DropdownItem,
  DropdownSeparator,
  DropdownLabel,
} from "@/components/ui/Dropdown/Dropdown"

export interface UserMenuProps {
  className?: string
  isMobile?: boolean
  onAction?: () => void
}

export const UserMenu = React.forwardRef<HTMLDivElement, UserMenuProps>(
  ({ className, isMobile = false, onAction }, ref) => {
    const { data: session, status } = useSession()
    const openAuthModal = useAuthStore((state) => state.openAuthModal)

    const handleAction = () => {
      if (onAction) {
        onAction()
      }
    }

    const handleSignOut = async () => {
      handleAction()
      await signOut({ callbackUrl: ROUTES.HOME })
    }

    const handleOpenAuthModal = (tab: "login" | "register" = "login") => {
      handleAction()
      openAuthModal(tab)
    }

    // Loading state
    if (status === "loading") {
      return (
        <div ref={ref} className={cn("flex items-center", className)}>
          <div className="w-10 h-10 rounded-full bg-muted animate-pulse" />
        </div>
      )
    }

    // Not authenticated - show login button
    if (!session) {
      if (isMobile) {
        return (
          <div ref={ref} className={cn("space-y-2", className)}>
            <Button
              variant="primary"
              className="w-full"
              onClick={() => handleOpenAuthModal("login")}
            >
              <LogIn className="w-4 h-4" />
              Войти
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => handleOpenAuthModal("register")}
            >
              Регистрация
            </Button>
          </div>
        )
      }

      return (
        <div ref={ref} className={cn("flex items-center gap-2", className)}>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleOpenAuthModal("login")}
          >
            Войти
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => handleOpenAuthModal("register")}
          >
            Регистрация
          </Button>
        </div>
      )
    }

    // Authenticated - show user menu
    const user = session.user
    const userName = user?.name || user?.email || "User"
    const userEmail = user?.email

    if (isMobile) {
      return (
        <div ref={ref} className={cn("space-y-2", className)}>
          <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-accent">
            <Avatar
              src={user?.image || undefined}
              alt={userName}
              fallback={userName}
              size="lg"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{userName}</p>
              {userEmail && (
                <p className="text-xs text-muted-foreground truncate">
                  {userEmail}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-1">
            <Link
              href={ROUTES.PROFILE}
              onClick={handleAction}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm hover:bg-accent transition-colors"
            >
              <User className="w-4 h-4" />
              Профиль
            </Link>
            <button
              onClick={handleAction}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm hover:bg-accent transition-colors w-full text-left"
            >
              <Settings className="w-4 h-4" />
              Настройки
            </button>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-destructive hover:bg-destructive/10 transition-colors w-full text-left"
            >
              <LogOut className="w-4 h-4" />
              Выход
            </button>
          </div>
        </div>
      )
    }

    return (
      <div ref={ref} className={cn("flex items-center", className)}>
        <Dropdown
          trigger={
            <div className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-accent transition-colors cursor-pointer">
              <Avatar
                src={user?.image || undefined}
                alt={userName}
                fallback={userName}
                size="sm"
              />
              <span className="text-sm font-medium hidden lg:inline">
                {userName}
              </span>
            </div>
          }
          align="end"
        >
          <DropdownLabel>
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium">{userName}</p>
              {userEmail && (
                <p className="text-xs text-muted-foreground">{userEmail}</p>
              )}
            </div>
          </DropdownLabel>
          <DropdownSeparator />
          <Link href={ROUTES.PROFILE} onClick={handleAction}>
            <DropdownItem>
              <User className="w-4 h-4 mr-2" />
              Профиль
            </DropdownItem>
          </Link>
          <DropdownItem onClick={handleAction}>
            <Settings className="w-4 h-4 mr-2" />
            Настройки
          </DropdownItem>
          <DropdownSeparator />
          <DropdownItem onClick={handleSignOut}>
            <LogOut className="w-4 h-4 mr-2" />
            Выход
          </DropdownItem>
        </Dropdown>
      </div>
    )
  }
)

UserMenu.displayName = "UserMenu"
