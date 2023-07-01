import React ,{useState,useEffect, use} from 'react'
import { addCompany,addUser,checkUserIdExists } from '@/utils/supabase';
import { getAuthenticatedUserFromSession } from '@/utils/passage';
import Router from 'next/router';
import Image from 'next/image'
import registerImage from '../assests/register.png'
import {PassageUser}  from '@passageidentity/passage-elements/passage-user'

const Registercompany = ({userID}) => {
 
  const [companyName, setCompanyName] = useState('');
  const [companyUrl, setCompanyUrl] = useState('');
  const [adminEmail,setAdminEmail] = useState('');
  const [token,setToken] = useState('')
  const [path,setPath] = useState('')
  const [authToken,setAuthToken] = useState('')

  useEffect(() => {
    const getUserEmail = async() => {
      let userEmail = (await new PassageUser().userInfo()).email;
      let authToken = new PassageUser().getAuthToken()
      authToken.then((response)=>{
        setAuthToken(response)
      }).catch(error=>{
        console.log(error)
      })
      setAdminEmail(userEmail)
    }
    getUserEmail()
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Call addCompany function to register the company
      await addCompany(companyName, companyUrl,userID,adminEmail,token,path);

      // After adding the company I want to register the current user on the website also 
      await addUser(companyName, userID,adminEmail,authToken);

      Router.push('/home')

    } catch (error) {
      console.error('Error registering company:', error);
    }
  };

  return (
    <div className="mx-auto p-4 flex flex-col justify-center items-center w-full h-screen bg-[#526D82]">
    <h1 className='text-white italic text-4xl font-bold mt-5'>Company Registration</h1>
    <div className='grid grid-cols-2 gap-4 mt-4 justify-center items-center p-3'>
    <Image
      src={registerImage}
      alt="Company Registration Image"
      width={1280}
      height={960}
    />
    <form onSubmit={handleSubmit} className="mx-auto rounded-lg shadow-md bg-white flex flex-col justify-center items-center p-8 w-full">
    <div className="mb-4 w-full">
      <label htmlFor="companyName" className="block mb-2 font-medium text-gray-700">
        Company Name
      </label>
      <input
        type="text"
        id="companyName"
        value={companyName}
        onChange={(e) => setCompanyName(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#27374D]"
        required
      />
    </div>
    <div className="mb-4 w-full">
      <label htmlFor="companyUrl" className="block mb-2 font-medium text-gray-700">
        Company URL
      </label>
      <input
        type="url"
        id="companyUrl"
        value={companyUrl}
        onChange={(e) => setCompanyUrl(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#27374D]"
        required
      />
    </div>
    <div className="mb-4 w-full">
      <label htmlFor="serviceToken" className="block mb-2 font-medium text-gray-700">
       1Password Company Service Token
      </label>
      <input
        type="password"
        id="serviceToken"
        value={token}
        onChange={(e) => setToken(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#27374D]"
        required
      />
    </div>
    <div className="mb-4 w-full">
      <label htmlFor="path" className="block mb-2 font-medium text-gray-700">
       1Password CLI Path
      </label>
      <input
        type="text"
        id="path"
        value={path}
        onChange={(e) => setPath(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#27374D]"
        required
      />
    </div>
    <div className="mb-4 w-full">
      <label htmlFor="adminEmail" className="block mb-2 font-medium text-gray-700">
        Admin Email
      </label>
      <input
        type="email"
        id="adminEmail"
        value={adminEmail}
        className="w-full px-4 py-2 border border-gray-300 rounded bg-gray-100 focus:outline-none"
        readOnly
      />
    </div>

    <button
      type="submit"
      className="bg-[#27374D] hover:bg-transparent hover:text-[#27374D] hover:border-[#27374D] border text-white rounded-md py-2 px-4 mt-4 mr-2 w-full"
      onClick={(e)=>handleSubmit(e)}
    >
      Register
    </button>
  </form>
  </div>
  </div>
  )
}

export default Registercompany

export const getServerSideProps = async (context) => {
  const loginProps = await getAuthenticatedUserFromSession(context.req, context.res)
  if(loginProps.isAuthorized){
      const userExists = await checkUserIdExists(loginProps.userID)
      if(!userExists){
        return {
          props:{
            userID: loginProps.userID
          }
        }
      }
  }
  
}