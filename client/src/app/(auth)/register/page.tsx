import dynamic from 'next/dynamic'
import { Suspense } from 'react'
const Register = dynamic(() => import('@/components/auth/register'), { suspense: true });
const Loader = dynamic(() => import('@/components/common/loader'), { suspense: true });

const RegisterRoute = () => {
  return (
    <Suspense fallback={<Loader />}>
      <Register />
    </Suspense>
  )
}

export default RegisterRoute
