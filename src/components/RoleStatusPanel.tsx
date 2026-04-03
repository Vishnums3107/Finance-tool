import type { UserRole } from '../types/finance'

interface RoleStatusPanelProps {
  role: UserRole
}

export const RoleStatusPanel = ({ role }: RoleStatusPanelProps) => {
  const canManageTransactions = role === 'admin'

  return (
    <section className="panel reveal delay-3 role-status-panel">
      <div className="panel-heading">
        <h2>Basic Role-Based UI</h2>
        <p>Switch role to simulate frontend permissions for demonstration.</p>
      </div>

      <article className="role-capability-card">
        <p className={`role-status ${canManageTransactions ? 'role-admin' : 'role-viewer'}`}>
          Current mode: {canManageTransactions ? 'Admin' : 'Viewer'}
        </p>

        <ul className="permission-list" aria-label="Role permissions">
          <li className="allowed">Can view dashboard and transactions</li>
          <li className={canManageTransactions ? 'allowed' : 'blocked'}>
            Can add transactions
          </li>
          <li className={canManageTransactions ? 'allowed' : 'blocked'}>
            Can edit existing transactions
          </li>
        </ul>

        {!canManageTransactions && (
          <p className="role-note">
            Viewer mode is read-only. Switch to Admin to add or edit records.
          </p>
        )}
      </article>
    </section>
  )
}
