"use client";

import dynamic from 'next/dynamic';
import Loader from '@/components/common/loader';
const ResetPassword = dynamic(() => import('@/components/auth/resetPassword'), { ssr: false, loading: () => <Loader /> });


const ResetPasswordRoute = () => {
  return (
      <ResetPassword />
  )
}

export default ResetPasswordRoute
