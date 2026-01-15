'use client'

import { useRole } from '../contexts/RoleContext'

export default function RoleSelector() {
  const { role, setRole } = useRole()

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-gray-600">Role:</span>
      <select
        value={role}
        onChange={(e) => setRole(e.target.value as 'receiver' | 'manager')}
        className="pl-3 pr-8 py-1.5 border border-gray-300 rounded-lg bg-white text-sm font-medium text-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
      >
        <option value="receiver">Receiver</option>
        <option value="manager">Manager</option>
      </select>
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${
          role === 'manager'
            ? 'bg-purple-100 text-purple-800'
            : 'bg-blue-100 text-blue-800'
        }`}
      >
        {role === 'manager' ? '👔 Manager' : '📦 Receiver'}
      </span>
    </div>
  )
}
