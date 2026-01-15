'use client'

import { useRole } from '../contexts/RoleContext'

interface PermissionBadgeProps {
  requiredRole?: 'manager' | 'receiver'
  children: React.ReactNode
  fallback?: React.ReactNode
}

/**
 * PermissionBadge - Shows content only if user has required role
 * 
 * Usage:
 * <PermissionBadge requiredRole="manager">
 *   <button>Delete</button>
 * </PermissionBadge>
 */
export default function PermissionBadge({ 
  requiredRole = 'manager', 
  children, 
  fallback 
}: PermissionBadgeProps) {
  const { isManager, isReceiver } = useRole()
  
  const hasPermission = requiredRole === 'manager' ? isManager : isReceiver

  if (hasPermission) {
    return <>{children}</>
  }

  return fallback ? <>{fallback}</> : null
}
