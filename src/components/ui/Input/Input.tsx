import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const inputVariants = cva(
  "flex w-full rounded-md border bg-transparent text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "border-input focus-visible:ring-ring",
        error: "border-destructive focus-visible:ring-destructive",
        success: "border-green-500 focus-visible:ring-green-500",
      },
      inputSize: {
        default: "h-9 px-3 py-1",
        sm: "h-8 px-2 py-1 text-xs",
        lg: "h-10 px-4 py-2",
      },
    },
    defaultVariants: {
      variant: "default",
      inputSize: "default",
    },
  }
)

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  error?: string
  helperText?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ 
    className, 
    variant, 
    inputSize, 
    type, 
    leftIcon, 
    rightIcon, 
    error,
    helperText,
    ...props 
  }, ref) => {
    const hasError = !!error
    const effectiveVariant = hasError ? "error" : variant

    if (leftIcon || rightIcon) {
      return (
        <div className="w-full">
          <div className="relative">
            {leftIcon && (
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground [&_svg]:size-4">
                {leftIcon}
              </div>
            )}
            <input
              type={type}
              className={cn(
                inputVariants({ variant: effectiveVariant, inputSize, className }),
                leftIcon && "pl-9",
                rightIcon && "pr-9"
              )}
              ref={ref}
              {...props}
            />
            {rightIcon && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground [&_svg]:size-4">
                {rightIcon}
              </div>
            )}
          </div>
          {(error || helperText) && (
            <p className={cn(
              "mt-1 text-xs",
              hasError ? "text-destructive" : "text-muted-foreground"
            )}>
              {error || helperText}
            </p>
          )}
        </div>
      )
    }

    return (
      <div className="w-full">
        <input
          type={type}
          className={cn(inputVariants({ variant: effectiveVariant, inputSize, className }))}
          ref={ref}
          {...props}
        />
        {(error || helperText) && (
          <p className={cn(
            "mt-1 text-xs",
            hasError ? "text-destructive" : "text-muted-foreground"
          )}>
            {error || helperText}
          </p>
        )}
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input, inputVariants }
