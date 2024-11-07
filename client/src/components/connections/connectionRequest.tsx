import React from 'react'
import { ArrowLeft } from 'lucide-react'
import SingleRequest from './singleRequest'
import { useDispatch, useSelector } from "react-redux";
import { setNavigation } from '@/context/reducers/navigation';
import { useGetConnectionRequests } from '@/utils/api';
import { RootState } from '@/context/store';

const ConnectionRequest = () => {

  const connectionRequests = useSelector((state: RootState) => state.connection.connectionRequests);
  const { getConnectionRequests } = useGetConnectionRequests();
  const dispatch = useDispatch();

  const handleRequestAction = () => {
    getConnectionRequests();
  }

  return (
    <section className="flex flex-col p-4 w-full gap-6 h-full flex-grow overflow-y-scroll custom-scrollbar scrollbar-thin">
      <div className="flex flex-row gap-8">
        <ArrowLeft width={25} className="text-primary cursor-pointer" onClick={() => dispatch(setNavigation("connections"))}/>
        <h4 className="font-sfpro text-font_dark text-xl font-thin">
          Connection Requests
        </h4>
      </div>
      <div className="flex-grow overflow-y-scroll custom-scrollbar scrollbar-thin pr-2 space-y-2">
        {connectionRequests.length === 0 ? (
          <h4 className="font-sfpro text-font_dark text-lg font-thin text-center">
            No connection requests
          </h4>
        ) : (
          connectionRequests.map((user) => <SingleRequest key={user.userId} user={user} handleRequestAction={handleRequestAction}/>)
        )}
      </div>
    </section>
  )
}

export default ConnectionRequest
