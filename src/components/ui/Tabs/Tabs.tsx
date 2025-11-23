"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface TabsProps {
  defaultValue?: string
  value?: string
  onValueChange?: (value: string) => void
  children: React.ReactNode
  className?: string
}

interface TabsContextValue {
  value: string
  onValueChange: (value: string) => void
}

const TabsContext = React.createContext<TabsContextValue | undefined>(undefined)

const useTabsContext = () => {
  const context = React.useContext(TabsContext)
  if (!context) {
    throw new Error("Tabs components must be used within a Tabs component")
  }
  return context
}

const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(
  ({ defaultValue = "", value: controlledValue, onValueChange, children, className }, ref) => {
    const [internalValue, setInternalValue] = React.useState(defaultValue)
    const isControlled = controlledValue !== undefined
    const value = isControlled ? controlledValue : internalValue

    const handleValueChange = React.useCallback(
      (newValue: string) => {
        if (!isControlled) {
          setInternalValue(newValue)
        }
        onValueChange?.(newValue)
      },
      [isControlled, onValueChange]
    )

    return (
      <TabsContext.Provider value={{ value, onValueChange: handleValueChange }}>
        <div ref={ref} className={cn("w-full", className)}>
          {children}
        </div>
      </TabsContext.Provider>
    )
  }
)
Tabs.displayName = "Tabs"

const TabsList = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, _ref) => {
  const [indicatorStyle, setIndicatorStyle] = React.useState<{
    left: number
    width: number
  }>({ left: 0, width: 0 })
  const listRef = React.useRef<HTMLDivElement>(null)
  const { value } = useTabsContext()

  React.useEffect(() => {
    const updateIndicator = () => {
      if (!listRef.current) return
      
      const activeTab = listRef.current.querySelector(
        `[data-value="${value}"]`
      ) as HTMLElement
      
      if (activeTab) {
        const listRect = listRef.current.getBoundingClientRect()
        const tabRect = activeTab.getBoundingClientRect()
        setIndicatorStyle({
          left: tabRect.left - listRect.left,
          width: tabRect.width,
        })
      }
    }

    updateIndicator()
    window.addEventListener("resize", updateIndicator)
    return () => window.removeEventListener("resize", updateIndicator)
  }, [value])

  return (
    <div
      ref={listRef}
      className={cn(
        "relative inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground",
        className
      )}
      {...props}
    >
      {/* Animated indicator */}
      <div
        className="absolute bottom-1 h-7 rounded-md bg-background shadow-sm transition-all duration-200"
        style={{
          left: `${indicatorStyle.left}px`,
          width: `${indicatorStyle.width}px`,
        }}
      />
      {props.children}
    </div>
  )
})
TabsList.displayName = "TabsList"

const TabsTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { value: string }
>(({ className, value: tabValue, ...props }, ref) => {
  const { value, onValueChange } = useTabsContext()
  const isActive = value === tabValue

  return (
    <button
      ref={ref}
      type="button"
      role="tab"
      aria-selected={isActive}
      data-value={tabValue}
      className={cn(
        "relative z-10 inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        isActive && "text-foreground",
        className
      )}
      onClick={() => onValueChange(tabValue)}
      {...props}
    />
  )
})
TabsTrigger.displayName = "TabsTrigger"

const TabsContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { value: string }
>(({ className, value: tabValue, ...props }, ref) => {
  const { value } = useTabsContext()

  if (value !== tabValue) return null

  return (
    <div
      ref={ref}
      role="tabpanel"
      className={cn(
        "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        className
      )}
      {...props}
    />
  )
})
TabsContent.displayName = "TabsContent"

export { Tabs, TabsList, TabsTrigger, TabsContent }
