import { getAuthenticatedUserFromSession } from '@/utils/passage'
import { useEffect } from 'react'
import Router from 'next/router';
import PassageLogin from '@/components/login'
import Image from 'next/image'
import coverImage from '../assests/cover.png'

export default function Home({isAuthorized}) {

  
  
    return(
      <div className="mx-auto  p-4 flex flex-col justify-center items-center w-full max-h-screen bg-[#526D82]">
        <h1 className='text-white italic text-4xl font-bold mt-5'>Welcome to</h1>
        <h1 className='text-white italic text-4xl font-bold'>Workpedia</h1>
        <div className='grid grid-cols-2 gap-4 mt-8 justify-center items-center p-1'>
        <Image
      src={coverImage}
      alt="Cover Image"
      width={1280}
      height={960}
    />
    <div className='rounded-lg shadow-md bg-white flex flex-col justify-center items-center w-[95%] h-[90%]'>
        <PassageLogin/>
        </div>
        </div>
        
      </div>
    ) 
}

export const getServerSideProps = async (context) => {
  const loginProps = await getAuthenticatedUserFromSession(context.req, context.res)
    return {
      props: {
        isAuthorized: loginProps.isAuthorized?? false,
        userID: loginProps.userID?? ''
      },
    }
}