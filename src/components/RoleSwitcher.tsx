import type { UserRole } from '../types/finance'

interface RoleSwitcherProps {
  role: UserRole
  onChangeRole: (role: UserRole) => void
}

export const RoleSwitcher = ({ role, onChangeRole }: RoleSwitcherProps) => {
  return (
    <label className="role-switcher">
      <span className="control-label">Role</span>
      <select
        value={role}
        onChange={(event) => onChangeRole(event.target.value as UserRole)}
        aria-label="Select user role"
      >
        <option value="viewer">Viewer</option>
        <option value="admin">Admin</option>
      </select>
    </label>
  )
}
