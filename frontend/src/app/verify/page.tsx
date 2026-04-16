import VeriftyOtp from '@/components/VeriftyOtp'
import React, { Suspense } from 'react'
import Loading from '@/components/Loading'

const VerifyPage = () => {
  return (
    <Suspense fallback={<Loading />}>
        <VeriftyOtp />
    </Suspense>
  )
}

export default VerifyPage