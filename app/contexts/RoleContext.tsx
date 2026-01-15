'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

type Role = 'receiver' | 'manager'

interface RoleContextType {
  role: Role
  setRole: (role: Role) => void
  isManager: boolean
  isReceiver: boolean
  // Permission helpers
  canCreateProducts: boolean
  canEditProducts: boolean
  canDeleteProducts: boolean
  canApproveProducts: boolean // Manager makes final decision ONLY
  canCreateReceivingSession: boolean
  canEditExpectedQuantities: boolean
  canFinalizeReceiving: boolean
  canViewInventory: boolean
}

const RoleContext = createContext<RoleContextType | undefined>(undefined)

export function RoleProvider({ children }: { children: ReactNode }) {
  const [role, setRoleState] = useState<Role>('receiver')

  // Load role from localStorage on mount
  useEffect(() => {
    const savedRole = localStorage.getItem('userRole') as Role | null
    if (savedRole === 'receiver' || savedRole === 'manager') {
      setRoleState(savedRole)
    }
  }, [])

  // Save role to localStorage when it changes
  const setRole = (newRole: Role) => {
    setRoleState(newRole)
    localStorage.setItem('userRole', newRole)
  }

  const isManager = role === 'manager'
  const isReceiver = role === 'receiver'

  return (
    <RoleContext.Provider
      value={{
        role,
        setRole,
        isManager,
        isReceiver,
        // Permissions: Receivers can create/edit/delete, but Managers approve
        canCreateProducts: true, // Both can create
        canEditProducts: true, // Both can edit
        canDeleteProducts: true, // Both can delete
        canApproveProducts: isManager, // Only managers can approve
        canCreateReceivingSession: isManager,
        canEditExpectedQuantities: isManager,
        canFinalizeReceiving: isManager,
        canViewInventory: true, // Both roles can view
      }}
    >
      {children}
    </RoleContext.Provider>
  )
}

export function useRole() {
  const context = useContext(RoleContext)
  if (context === undefined) {
    throw new Error('useRole must be used within a RoleProvider')
  }
  return context
}
