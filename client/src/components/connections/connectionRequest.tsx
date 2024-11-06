import React from 'react'
import { ArrowLeft } from 'lucide-react'
import SingleRequest from './singleRequest'
import { useDispatch } from "react-redux";
import { setNavigation } from '@/context/reducers/navigation';

const ConnectionRequest = () => {
  const dispatch = useDispatch();
  return (
    <section className="flex flex-col p-4 w-full gap-6 h-full flex-grow overflow-y-scroll custom-scrollbar scrollbar-thin">
      <div className="flex flex-row gap-8">
        <ArrowLeft width={25} className="text-primary cursor-pointer" onClick={() => dispatch(setNavigation("connections"))}/>
        <h4 className="font-sfpro text-font_dark text-xl font-thin">
          Connection Requests
        </h4>
      </div>
      <div className="flex-grow overflow-y-scroll custom-scrollbar scrollbar-thin pr-2 space-y-2">
        {[...Array(15)].map((_, index) => (
          <SingleRequest key={index} />
        ))}
      </div>
    </section>
  )
}

export default ConnectionRequest
