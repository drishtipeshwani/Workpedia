import { useEffect,useState } from 'react';
import Router from 'next/router';
import { getAuthenticatedUserFromSession } from '@/utils/passage'
import Link from 'next/link';
import {PassageUser}  from '@passageidentity/passage-elements/passage-user'
import { getAuthToken, getCurrentUserCompany, getUniqueCompanyCode, getUserEmail,isAdmin } from '@/utils/supabase';
import Image from 'next/image'
import homePageImage from '../assests/home.png'

export default function Home({isAuthorized, userID,companyName,userEmail,authToken,companyCode,isAdmin}) {

    useEffect(() => {
      if(!isAuthorized){
        Router.push('/');
      }
    })

    const signOut = async ()=>{
      console.log(authToken)
      new PassageUser(authToken).signOut()
    Router.push('/')
  }
    
    return (
      <div className=" bg-[#526D82] h-screen">
     <header>
     <nav className="bg-gray-200 p-4">
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-lg font-semibold">{companyName}</h2>
        <p className="text-gray-600">{userEmail}</p>
      </div>
      <div>
        <h1 className="text-xl font-bold">Employee Dashboard</h1>
      </div>
      <div>
      <button className="bg-[#27374D] hover:bg-transparent hover:text-[#27374D] hover:border-[#27374D] border text-white rounded-md py-2 px-4 mr-2" onClick={()=>signOut()}>Sign Out</button>
      </div>
    </div>
  </nav>
  </header>
  <div className="flex flex-col justify-center items-center mt-3">
  <div className='grid grid-cols-2 gap-2 justify-center items-center'>
        <Image
      src={homePageImage}
      alt="Home Page Image"
      height={960}
      width={1280}
    />
    <div className="flex flex-col">
      {isAdmin &&
    <div className="max-w-md mx-auto rounded-lg shadow-md bg-white flex flex-col justify-center items-center p-2 font-bold text-[#27374D] text-md w-full">
      <span>Employee Verification Code</span>
      <span>{companyCode}</span>
      </div>}
    <div className="grid grid-rows-2 grid-cols-2 gap-4 mt-4 mr-4">
    <div className="max-w-md mx-auto rounded-lg shadow-md bg-white flex flex-col justify-center items-center p-6 font-bold text-[#27374D] text-lg w-full" onClick={()=>{Router.push('/sections/guides')}}>
      <span>Techical Setup</span>
      <span>Guides</span>
      </div>
    <div className="max-w-md mx-auto rounded-lg shadow-md bg-white flex flex-col justify-center items-center p-6 font-bold text-[#27374D] text-lg w-full" onClick={()=>{Router.push('/sections/docs')}}>
      <span>Project</span>
      <span>Credentials</span>
      </div>
    <div className="max-w-md mx-auto rounded-lg shadow-md bg-white flex flex-col justify-center items-center p-6 font-bold text-[#27374D] text-lg w-full" onClick={()=>{Router.push('/sections/resources')}}>
      <span>Helpful Learning</span>
      <span>Resources</span>
      </div>
    <div className="max-w-md mx-auto rounded-lg shadow-md bg-white flex flex-col justify-center items-center p-6 font-bold text-[#27374D] text-lg w-full" onClick={()=>{Router.push('/sections/snippets')}}>
      <span>Go To </span>
      <span>Code Snippets</span>
      </div>
    </div>
    </div>
    </div> 
</div>
</div>

    )
  }

export const getServerSideProps = async (context) => {
  
    const loginProps = await getAuthenticatedUserFromSession(context.req, context.res)

    const companyName = await getCurrentUserCompany(loginProps.userID)

    const userEmail = await getUserEmail(loginProps.userID)
    const authToken = await getAuthToken(loginProps.userID)

    const companyCode = await getUniqueCompanyCode(companyName)
    const isadmin = await isAdmin(companyName,loginProps.userID)
    
    return {
        props: {
          isAuthorized:loginProps.isAuthorized??'',
          userID:loginProps.userID??'',
          companyName:companyName??'',
          userEmail:userEmail??'',
          authToken:authToken??'',
          companyCode:companyCode??'',
          isAdmin:isadmin??''
        },
      }
    
}
