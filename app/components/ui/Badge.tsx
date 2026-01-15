'use client'

import { ReactNode } from 'react'

interface BadgeProps {
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'gray'
  children: ReactNode
  className?: string
}

export default function Badge({
  variant = 'primary',
  children,
  className = '',
}: BadgeProps) {
  const variantClasses = {
    primary: 'badge-primary',
    success: 'badge-success',
    warning: 'badge-warning',
    danger: 'badge-danger',
    gray: 'badge-gray',
  }

  return (
    <span className={`badge ${variantClasses[variant]} ${className}`}>
      {children}
    </span>
  )
}
