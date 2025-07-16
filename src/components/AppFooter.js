import React from 'react'
import { CFooter } from '@coreui/react'

const AppFooter = () => {
  return (
    <CFooter className="px-4">
      <div>
        <span className="ms-1">&copy; Congressional Cup 2025</span>
      </div>
      <div className="ms-auto">
        <span className="me-1">Powered by Moku Enterprises</span>
      </div>
    </CFooter>
  )
}

export default React.memo(AppFooter)
