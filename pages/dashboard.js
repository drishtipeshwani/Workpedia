import React,{useEffect,useState} from 'react'
import Link from 'next/link';
import { getAuthenticatedUserFromSession } from '@/utils/passage';
import { checkUserIdExists } from '@/utils/supabase';
import Router from 'next/router';
import Image from 'next/image'
import dashboardImage from '../assests/dashboard.png'
import Loadingsnipper from '@/components/loadingsnipper';

export default function Dashboard ({isAuthorized,userExists}) {

  const [loading,setLoading] = useState(true)

  useEffect(() => {
    // Simulate an asynchronous task
    setTimeout(() => {
      setLoading(false);
    }, 5000); // Adjust the duration as needed
  }, []);

   // I only want to come to dashboard if I am the user the first time
   useEffect(() => {
    if(!isAuthorized){
      Router.push('/');
    }
    // If User Exists I have to navigate to home page
    if(userExists){
        Router.push('/home');
      }
  })
  
  return (
    <div className="mx-auto p-4 flex flex-col justify-center items-center w-full max-h-screen bg-[#526D82]">
       {loading ? (
        <Loadingsnipper/>
      ) : (
        <div className='mx-auto p-4 flex flex-col justify-center items-center w-full max-h-screen bg-[#526D82]'>
          <h1 className='text-white italic text-4xl font-bold mt-5'>Welcome to Workpedia</h1>
      <div className='grid grid-cols-2 gap-4 mt-6 justify-center items-center p-9'>
        <Image
      src={dashboardImage}
      alt="Dashboard Image"
      width={1280}
      height={960}
    />
      <div className="grid grid-rows-2 gap-4 justify-center items-center">
    <Link href="/registercompany">
    <div className="rounded-lg shadow-md bg-white flex flex-col justify-center items-center p-8 font-bold text-[#27374D] text-xl w-96">
      <h1>Register a New </h1>
      <h1>Company as an </h1>
      <h1>Administrator</h1>
    </div>
    </Link>
    <Link href="/employeelogin">
    <div className="rounded-lg shadow-md bg-white flex flex-col justify-center items-center p-8 text-xl font-bold text-[#27374D]">
      <h1>Existing Company</h1>
      <h1>Employee</h1>
      <h1>Login</h1>
    </div>
    </Link>
    </div>
    </div>
        </div>
      )}
      
      </div>
  )
}

export const getServerSideProps = async (context) => {
    const loginProps = await getAuthenticatedUserFromSession(context.req, context.res)
    if(loginProps.isAuthorized){
        const userExists = await checkUserIdExists(loginProps.userID)
        return {
            props:{
                isAuthorized:loginProps.isAuthorized??false,
                userExists:userExists??false
            }
        }
    }
    
}