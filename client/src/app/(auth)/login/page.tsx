import dynamic from 'next/dynamic'
import { Suspense } from 'react'
const Login = dynamic(() => import('@/components/auth/login'), { suspense: true });
const Loader = dynamic(() => import('@/components/common/loader'), { suspense: true });

const LoginRoute = () => {
  return (
    <Suspense fallback={<Loader />}>
    <Login />
    </Suspense>
  )
}

export default LoginRoute
