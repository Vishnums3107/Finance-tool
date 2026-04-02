interface ActionStatusBannerProps {
  message: string
  tone: 'info' | 'success' | 'error'
}

export const ActionStatusBanner = ({
  message,
  tone,
}: ActionStatusBannerProps) => {
  return (
    <p className={`action-status action-status-${tone}`} role="status" aria-live="polite">
      {message}
    </p>
  )
}
