"use client";

import dynamic from 'next/dynamic'
import Loader from '@/components/common/loader'
const Login = dynamic(() => import('@/components/auth/login'), { ssr: false, loading: () => <Loader /> });

const LoginRoute = () => {
  return (
    <Login />
  )
}

export default LoginRoute
