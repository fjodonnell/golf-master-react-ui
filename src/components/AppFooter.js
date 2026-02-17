import React from 'react'
import { CFooter } from '@coreui/react'

const AppFooter = () => {
  return (
    <CFooter className="px-4 py-3">
      <div className="w-100 d-flex flex-column flex-md-row justify-content-between align-items-center">
        {/* Left Side / Top on Mobile */}
        <div className="mb-2 mb-md-0">
          <span className="small">&copy; {new Date().getFullYear()} Tournament du Sol LLC</span>
        </div>

        {/* Right Side / Bottom on Mobile */}
        <div className="text-muted" style={{ fontSize: '0.75rem' }}>
          <span>Powered by </span>
          <span className="fw-semibold">Albetross Title</span>
        </div>
      </div>
    </CFooter>
  )
}

export default React.memo(AppFooter)