/**
 * Role-Based Access Control (RBAC) Module
 * Defines roles, permissions, and access control utilities for infpsvaastu
 */

// User roles in the system
export const ROLES = {
  ADMIN: 'ADMIN',
  BUILDER: 'BUILDER',
  AGENT: 'AGENT',
  INDIVIDUAL: 'INDIVIDUAL',
} as const

export type Role = keyof typeof ROLES

// Permission categories
export const PERMISSION_CATEGORIES = {
  USERS: 'users',
  PROPERTIES: 'properties',
  PROJECTS: 'projects',
  INQUIRIES: 'inquiries',
  MEMBERSHIPS: 'memberships',
  CONTENT: 'content',
  SETTINGS: 'settings',
  ANALYTICS: 'analytics',
  TRANSACTIONS: 'transactions',
} as const

// Individual permissions
export const PERMISSIONS = {
  // User Management
  'users:read': 'View user list and details',
  'users:create': 'Create new users',
  'users:update': 'Update user information',
  'users:delete': 'Delete users',
  'users:manage_roles': 'Change user roles',
  'users:verify': 'Verify users',
  'users:suspend': 'Suspend user accounts',

  // Property Management
  'properties:read': 'View all properties',
  'properties:create': 'Create new properties',
  'properties:update': 'Update any property',
  'properties:delete': 'Delete any property',
  'properties:approve': 'Approve/reject properties',
  'properties:feature': 'Feature/unfeature properties',
  'properties:own': 'Manage own properties only',

  // Project Management
  'projects:read': 'View all projects',
  'projects:create': 'Create new projects',
  'projects:update': 'Update any project',
  'projects:delete': 'Delete any project',
  'projects:approve': 'Approve/reject projects',
  'projects:feature': 'Feature/unfeature projects',
  'projects:own': 'Manage own projects only',

  // Inquiry Management
  'inquiries:read': 'View all inquiries',
  'inquiries:respond': 'Respond to inquiries',
  'inquiries:delete': 'Delete inquiries',
  'inquiries:own': 'View own inquiries only',

  // Membership Management
  'memberships:read': 'View membership data',
  'memberships:create': 'Create memberships',
  'memberships:update': 'Update memberships',
  'memberships:delete': 'Delete memberships',
  'memberships:plans': 'Manage membership plans',
  'memberships:requests': 'Handle membership requests',

  // Content Management
  'content:news': 'Manage news articles',
  'content:faq': 'Manage FAQ',
  'content:pages': 'Manage CMS pages',
  'content:banners': 'Manage banners',
  'content:ads': 'Manage advertisements',
  'content:testimonials': 'Manage testimonials',
  'content:events': 'Manage events',

  // Settings Management
  'settings:site': 'Manage site settings',
  'settings:cities': 'Manage cities and localities',
  'settings:amenities': 'Manage amenities',
  'settings:categories': 'Manage categories',
  'settings:bank': 'Manage bank details',
  'settings:google_ads': 'Manage Google Ads',

  // Analytics
  'analytics:view': 'View analytics dashboard',
  'analytics:export': 'Export analytics data',
  'analytics:detailed': 'View detailed analytics',

  // Transactions
  'transactions:read': 'View transactions',
  'transactions:refund': 'Process refunds',
  'transactions:reports': 'Generate transaction reports',
} as const

export type Permission = keyof typeof PERMISSIONS

// Role-Permission mapping
export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  ADMIN: [
    // Full access to everything
    'users:read', 'users:create', 'users:update', 'users:delete', 'users:manage_roles', 'users:verify', 'users:suspend',
    'properties:read', 'properties:create', 'properties:update', 'properties:delete', 'properties:approve', 'properties:feature', 'properties:own',
    'projects:read', 'projects:create', 'projects:update', 'projects:delete', 'projects:approve', 'projects:feature', 'projects:own',
    'inquiries:read', 'inquiries:respond', 'inquiries:delete', 'inquiries:own',
    'memberships:read', 'memberships:create', 'memberships:update', 'memberships:delete', 'memberships:plans', 'memberships:requests',
    'content:news', 'content:faq', 'content:pages', 'content:banners', 'content:ads', 'content:testimonials', 'content:events',
    'settings:site', 'settings:cities', 'settings:amenities', 'settings:categories', 'settings:bank', 'settings:google_ads',
    'analytics:view', 'analytics:export', 'analytics:detailed',
    'transactions:read', 'transactions:refund', 'transactions:reports',
  ],
  BUILDER: [
    'properties:read', 'properties:create', 'properties:update', 'properties:own',
    'projects:read', 'projects:create', 'projects:update', 'projects:own',
    'inquiries:own', 'inquiries:respond',
    'analytics:view',
    'memberships:read',
  ],
  AGENT: [
    'properties:read', 'properties:create', 'properties:update', 'properties:own',
    'inquiries:own', 'inquiries:respond',
    'analytics:view',
    'memberships:read',
  ],
  INDIVIDUAL: [
    'properties:create', 'properties:own',
    'inquiries:own',
    'memberships:read',
  ],
}

// Admin menu sections based on permissions
export interface AdminMenuSection {
  id: string
  title: string
  icon: string
  requiredPermissions: Permission[]
  items: AdminMenuItem[]
}

export interface AdminMenuItem {
  id: string
  title: string
  href: string
  requiredPermissions: Permission[]
}

export const ADMIN_MENU_SECTIONS: AdminMenuSection[] = [
  {
    id: 'member-management',
    title: 'Member Management',
    icon: 'Users',
    requiredPermissions: ['users:read'],
    items: [
      { id: 'manage-members', title: 'Manage Members', href: '/admin/members', requiredPermissions: ['users:read'] },
      { id: 'add-member', title: 'Add Member', href: '/admin/members/add', requiredPermissions: ['users:create'] },
      { id: 'membership-plans', title: 'Membership Plans', href: '/admin/membership-plans', requiredPermissions: ['memberships:plans'] },
      { id: 'upgrade-requests', title: 'Upgrade Requests', href: '/admin/upgrade-requests', requiredPermissions: ['memberships:requests'] },
    ],
  },
  {
    id: 'listing-management',
    title: 'Listing Management',
    icon: 'Home',
    requiredPermissions: ['properties:read'],
    items: [
      { id: 'manage-listings', title: 'Manage Listings', href: '/admin/properties', requiredPermissions: ['properties:read'] },
      { id: 'add-listing', title: 'Add Listing', href: '/admin/properties/add', requiredPermissions: ['properties:create'] },
      { id: 'pending-approvals', title: 'Pending Approvals', href: '/admin/properties/pending', requiredPermissions: ['properties:approve'] },
      { id: 'property-responses', title: 'Responses', href: '/admin/property-responses', requiredPermissions: ['inquiries:read'] },
    ],
  },
  {
    id: 'project-management',
    title: 'Project Management',
    icon: 'Building',
    requiredPermissions: ['projects:read'],
    items: [
      { id: 'manage-projects', title: 'Manage Projects', href: '/admin/projects', requiredPermissions: ['projects:read'] },
      { id: 'add-project', title: 'Add Project', href: '/admin/projects/add', requiredPermissions: ['projects:create'] },
      { id: 'project-responses', title: 'Project Responses', href: '/admin/project-responses', requiredPermissions: ['inquiries:read'] },
    ],
  },
  {
    id: 'featured',
    title: 'Featured Items',
    icon: 'Star',
    requiredPermissions: ['properties:feature'],
    items: [
      { id: 'featured-properties', title: 'Featured Properties', href: '/admin/featured', requiredPermissions: ['properties:feature'] },
      { id: 'featured-agents', title: 'Featured Agents', href: '/admin/featured/agents', requiredPermissions: ['users:update'] },
      { id: 'featured-builders', title: 'Featured Builders', href: '/admin/featured/builders', requiredPermissions: ['users:update'] },
    ],
  },
  {
    id: 'content',
    title: 'Content Management',
    icon: 'FileText',
    requiredPermissions: ['content:news', 'content:faq', 'content:pages'],
    items: [
      { id: 'news', title: 'News & Articles', href: '/admin/news', requiredPermissions: ['content:news'] },
      { id: 'faq', title: 'FAQ', href: '/admin/faq', requiredPermissions: ['content:faq'] },
      { id: 'pages', title: 'CMS Pages', href: '/admin/pages', requiredPermissions: ['content:pages'] },
      { id: 'testimonials', title: 'Testimonials', href: '/admin/testimonials', requiredPermissions: ['content:testimonials'] },
      { id: 'events', title: 'Events', href: '/admin/events', requiredPermissions: ['content:events'] },
    ],
  },
  {
    id: 'marketing',
    title: 'Marketing',
    icon: 'Megaphone',
    requiredPermissions: ['content:banners', 'content:ads'],
    items: [
      { id: 'banners', title: 'Banners', href: '/admin/banners', requiredPermissions: ['content:banners'] },
      { id: 'ads', title: 'Advertisements', href: '/admin/ads', requiredPermissions: ['content:ads'] },
      { id: 'newsletter', title: 'Newsletter', href: '/admin/newsletter', requiredPermissions: ['content:news'] },
      { id: 'google-ads', title: 'Google Ads', href: '/admin/google-ads', requiredPermissions: ['settings:google_ads'] },
    ],
  },
  {
    id: 'location',
    title: 'Location Settings',
    icon: 'MapPin',
    requiredPermissions: ['settings:cities'],
    items: [
      { id: 'cities', title: 'Cities', href: '/admin/cities', requiredPermissions: ['settings:cities'] },
      { id: 'localities', title: 'Localities', href: '/admin/localities', requiredPermissions: ['settings:cities'] },
    ],
  },
  {
    id: 'settings',
    title: 'System Settings',
    icon: 'Settings',
    requiredPermissions: ['settings:site'],
    items: [
      { id: 'site-settings', title: 'Site Settings', href: '/admin/settings', requiredPermissions: ['settings:site'] },
      { id: 'amenities', title: 'Amenities', href: '/admin/amenities', requiredPermissions: ['settings:amenities'] },
      { id: 'categories', title: 'Categories', href: '/admin/categories', requiredPermissions: ['settings:categories'] },
      { id: 'bank-details', title: 'Bank Details', href: '/admin/bank-details', requiredPermissions: ['settings:bank'] },
      { id: 'default-images', title: 'Default Images', href: '/admin/images', requiredPermissions: ['settings:site'] },
    ],
  },
  {
    id: 'inquiries',
    title: 'Inquiries',
    icon: 'MessageSquare',
    requiredPermissions: ['inquiries:read'],
    items: [
      { id: 'all-inquiries', title: 'All Inquiries', href: '/admin/enquiries', requiredPermissions: ['inquiries:read'] },
      { id: 'contact-messages', title: 'Contact Messages', href: '/admin/contact', requiredPermissions: ['inquiries:read'] },
      { id: 'requirements', title: 'Requirements', href: '/admin/requirements', requiredPermissions: ['inquiries:read'] },
    ],
  },
  {
    id: 'finance',
    title: 'Finance',
    icon: 'DollarSign',
    requiredPermissions: ['transactions:read'],
    items: [
      { id: 'transactions', title: 'Transactions', href: '/admin/transactions', requiredPermissions: ['transactions:read'] },
      { id: 'loans', title: 'Home Loans', href: '/admin/loans', requiredPermissions: ['settings:site'] },
    ],
  },
  {
    id: 'analytics',
    title: 'Analytics',
    icon: 'BarChart',
    requiredPermissions: ['analytics:view'],
    items: [
      { id: 'dashboard', title: 'Dashboard', href: '/admin', requiredPermissions: ['analytics:view'] },
      { id: 'reports', title: 'Reports', href: '/admin/reports', requiredPermissions: ['analytics:detailed'] },
    ],
  },
  {
    id: 'notifications',
    title: 'Notifications',
    icon: 'Bell',
    requiredPermissions: ['settings:site'],
    items: [
      { id: 'reminders', title: 'Reminders', href: '/admin/reminders', requiredPermissions: ['settings:site'] },
      { id: 'alerts', title: 'Alerts', href: '/admin/alerts', requiredPermissions: ['settings:site'] },
    ],
  },
]

// RBAC utility functions
export class RBAC {
  private userRole: Role
  private permissions: Permission[]

  constructor(userType: string) {
    this.userRole = (userType as Role) || 'INDIVIDUAL'
    this.permissions = ROLE_PERMISSIONS[this.userRole] || []
  }

  /**
   * Check if user has a specific permission
   */
  hasPermission(permission: Permission): boolean {
    return this.permissions.includes(permission)
  }

  /**
   * Check if user has any of the specified permissions
   */
  hasAnyPermission(permissions: Permission[]): boolean {
    return permissions.some(p => this.permissions.includes(p))
  }

  /**
   * Check if user has all specified permissions
   */
  hasAllPermissions(permissions: Permission[]): boolean {
    return permissions.every(p => this.permissions.includes(p))
  }

  /**
   * Get user's role
   */
  getRole(): Role {
    return this.userRole
  }

  /**
   * Check if user is admin
   */
  isAdmin(): boolean {
    return this.userRole === 'ADMIN'
  }

  /**
   * Check if user is builder
   */
  isBuilder(): boolean {
    return this.userRole === 'BUILDER'
  }

  /**
   * Check if user is agent
   */
  isAgent(): boolean {
    return this.userRole === 'AGENT'
  }

  /**
   * Get all permissions for user
   */
  getPermissions(): Permission[] {
    return [...this.permissions]
  }

  /**
   * Get filtered admin menu based on user permissions
   */
  getAdminMenu(): AdminMenuSection[] {
    return ADMIN_MENU_SECTIONS
      .filter(section => this.hasAnyPermission(section.requiredPermissions))
      .map(section => ({
        ...section,
        items: section.items.filter(item => this.hasAnyPermission(item.requiredPermissions)),
      }))
      .filter(section => section.items.length > 0)
  }

  /**
   * Check if user can access a specific admin route
   */
  canAccessRoute(href: string): boolean {
    for (const section of ADMIN_MENU_SECTIONS) {
      for (const item of section.items) {
        if (item.href === href) {
          return this.hasAnyPermission(item.requiredPermissions)
        }
      }
    }
    // Default: admin only
    return this.isAdmin()
  }
}

// Helper function to create RBAC instance
export function createRBAC(userType: string | undefined | null): RBAC {
  return new RBAC(userType || 'INDIVIDUAL')
}

// React hook helper (for use in components)
export function useRBAC(userType: string | undefined | null): RBAC {
  return createRBAC(userType)
}

// API route permission check
export function checkPermission(userType: string | undefined | null, permission: Permission): boolean {
  const rbac = createRBAC(userType)
  return rbac.hasPermission(permission)
}

// Check multiple permissions (any)
export function checkAnyPermission(userType: string | undefined | null, permissions: Permission[]): boolean {
  const rbac = createRBAC(userType)
  return rbac.hasAnyPermission(permissions)
}

// Check multiple permissions (all)
export function checkAllPermissions(userType: string | undefined | null, permissions: Permission[]): boolean {
  const rbac = createRBAC(userType)
  return rbac.hasAllPermissions(permissions)
}
