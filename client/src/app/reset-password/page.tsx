import dynamic from 'next/dynamic';
import { Suspense } from 'react'
const ResetPassword = dynamic(() => import('@/components/auth/resetPassword'), { suspense: true });
const Loader = dynamic(() => import('@/components/common/loader'), { suspense: true });

const ResetPasswordRoute = () => {
  return (
    <Suspense fallback={<Loader />}>
      <ResetPassword />
    </Suspense>
  )
}

export default ResetPasswordRoute
