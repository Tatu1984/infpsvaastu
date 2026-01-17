"use client"

import { useMemo } from "react"
import { useSession } from "next-auth/react"
import { RBAC, createRBAC, type Permission, type Role } from "@/lib/rbac"

/**
 * React hook for RBAC functionality
 * Provides permission checking, role checking, and admin menu filtering
 */
export function useRBAC() {
  const { data: session, status } = useSession()

  const rbac = useMemo(() => {
    return createRBAC(session?.user?.userType)
  }, [session?.user?.userType])

  const isLoading = status === "loading"
  const isAuthenticated = status === "authenticated"

  return {
    // RBAC instance
    rbac,

    // Session state
    isLoading,
    isAuthenticated,

    // User info
    user: session?.user,
    userType: session?.user?.userType as Role | undefined,

    // Permission checks
    hasPermission: (permission: Permission) => rbac.hasPermission(permission),
    hasAnyPermission: (permissions: Permission[]) => rbac.hasAnyPermission(permissions),
    hasAllPermissions: (permissions: Permission[]) => rbac.hasAllPermissions(permissions),

    // Role checks
    isAdmin: rbac.isAdmin(),
    isBuilder: rbac.isBuilder(),
    isAgent: rbac.isAgent(),
    role: rbac.getRole(),

    // Admin menu
    adminMenu: rbac.getAdminMenu(),

    // Route access
    canAccessRoute: (href: string) => rbac.canAccessRoute(href),

    // All permissions
    permissions: rbac.getPermissions(),
  }
}

/**
 * Higher-order component for permission-based rendering
 */
export function withPermission<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  requiredPermission: Permission
) {
  return function PermissionGate(props: P) {
    const { hasPermission, isLoading } = useRBAC()

    if (isLoading) {
      return null // Or a loading spinner
    }

    if (!hasPermission(requiredPermission)) {
      return null // Or an unauthorized message
    }

    return <WrappedComponent {...props} />
  }
}

/**
 * Component for conditional rendering based on permissions
 */
interface PermissionGateProps {
  permission?: Permission
  permissions?: Permission[]
  requireAll?: boolean
  fallback?: React.ReactNode
  children: React.ReactNode
}

export function PermissionGate({
  permission,
  permissions,
  requireAll = false,
  fallback = null,
  children,
}: PermissionGateProps) {
  const { hasPermission, hasAnyPermission, hasAllPermissions, isLoading } = useRBAC()

  if (isLoading) {
    return null
  }

  let hasAccess = false

  if (permission) {
    hasAccess = hasPermission(permission)
  } else if (permissions) {
    hasAccess = requireAll ? hasAllPermissions(permissions) : hasAnyPermission(permissions)
  }

  return hasAccess ? <>{children}</> : <>{fallback}</>
}

/**
 * Component for role-based rendering
 */
interface RoleGateProps {
  roles: Role[]
  fallback?: React.ReactNode
  children: React.ReactNode
}

export function RoleGate({ roles, fallback = null, children }: RoleGateProps) {
  const { role, isLoading } = useRBAC()

  if (isLoading) {
    return null
  }

  const hasRole = roles.includes(role)

  return hasRole ? <>{children}</> : <>{fallback}</>
}

/**
 * Admin-only rendering
 */
interface AdminOnlyProps {
  fallback?: React.ReactNode
  children: React.ReactNode
}

export function AdminOnly({ fallback = null, children }: AdminOnlyProps) {
  const { isAdmin, isLoading } = useRBAC()

  if (isLoading) {
    return null
  }

  return isAdmin ? <>{children}</> : <>{fallback}</>
}
