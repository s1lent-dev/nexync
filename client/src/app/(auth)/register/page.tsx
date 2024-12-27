"use client"

import dynamic from 'next/dynamic'
import Loader from '@/components/common/loader'
const Register = dynamic(() => import('@/components/auth/register'), { ssr: false, loading: () => <Loader /> });

const RegisterRoute = () => {
  return (
      <Register />
  )
}

export default RegisterRoute
