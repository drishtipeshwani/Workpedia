import React,{useEffect,useState} from 'react'
import Router from 'next/router';
import {PassageUser}  from '@passageidentity/passage-elements/passage-user'
import { getCurrentUserCompany,getOnePasswordPath,getCompanyServiceToken, getUserEmail} from '@/utils/supabase';
import { getAuthenticatedUserFromSession } from '@/utils/passage';

const docs = ({companyName,path,serviceToken,userEmail}) => {

  const [apiKey,setApiKey] = useState(null)
  const [vault,setVault] = useState('')
  const [item,setItem] = useState('')
 
  const [loading,setLoading] = useState(false)

  const [isHidden, setIsHidden] = useState(true);

  const toggleHidden = () => {
    setIsHidden(!isHidden);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(apiKey)
      .then(() => alert('API key copied to clipboard!'))
      .catch((error) => console.error('Failed to copy API key: ', error))
  };

   const getValue = async (e) => {
    e.preventDefault()
    try{
    const apiUrl = '/api/get-api-keys';
const requestOptions = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ 
    path: path,
    serviceToken:serviceToken,
    vault: vault, 
    item: item, 
  }),
};

setLoading(true)

fetch(apiUrl, requestOptions)
  .then(response => response.json())
  .then(data=>{
    setApiKey(data.credential.trim())
    setLoading(false)
  })
  .catch(error=>console.log(error))
}catch(error){
  console.log(error)
}
  
   }

   const signOut = async ()=>{
    new PassageUser().signOut()
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
        <h1 className="text-xl font-bold">Project Credentials</h1>
      </div>
      <button className="bg-[#27374D] hover:bg-transparent hover:text-[#27374D] hover:border-[#27374D] border text-white rounded-md py-2 px-4 mr-2" onClick={()=>signOut()}>Sign Out</button>
    </div>
  </nav>
  </header>
      <div className='flex justify-center items-center'>
        <div className='w-9/12 rounded-lg p-4 shadow-lg bg-[#DDE6ED] flex flex-col mt-4'>
        <form>
        <div className="mb-4 w-full">
      <label htmlFor="vaultName" className="block mb-2 font-medium text-gray-700">
       1Password Vault
      </label>
      <input
        type="text"
        id="vaultName"
        value={vault}
        onChange={(e) => setVault(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#27374D]"
        required
      />
    </div>
    <div className="mb-4 w-full">
      <label htmlFor="itemName" className="block mb-2 font-medium text-gray-700">
       Project Item/Credential
      </label>
      <input
        type="text"
        id="apiKey"
        value={item}
        onChange={(e) => setItem(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#27374D]"
        required
      />
    </div>
    <div className='flex justify-center'>
    <button className="bg-[#27374D] hover:bg-transparent hover:text-[#27374D] hover:border-[#27374D] border text-white rounded-md py-2 px-4 mr-2" onClick={(e)=>getValue(e)}>Get Value</button>
    </div> 
        </form>
        <div className='mt-4'>
          { !apiKey && loading && 
          <div className="flex justify-center items-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#526D82]"></div>
        </div> }
          {apiKey && !loading && 
            <div className="flex flex-col justify-center">
      <label htmlFor="apiValue" className="block mb-2 font-medium text-gray-700">
       {item}
      </label>
      <div className='relative'>
      <input
        type={isHidden ? 'password' : 'text'}
        id="apiValue"
        value={apiKey}
        className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#27374D]"
        readOnly
      />
      <button
          className="absolute top-2 right-2 text-sm text-gray-700 focus:outline-none"
          onClick={toggleHidden}
        >
          {isHidden ? 'Unhide' : 'Hide'}
        </button>
        <button
          className="absolute top-2 right-14 text-sm text-gray-700 focus:outline-none"
          onClick={copyToClipboard}
        >
          Copy
        </button>
      </div>
    </div>
          }
        </div>
        </div>
      </div>
      </div>
  )
}

export default docs

export const getServerSideProps = async (context) => {
  
  const loginProps = await getAuthenticatedUserFromSession(context.req, context.res)

  const companyName = await getCurrentUserCompany(loginProps.userID)

  const path = await getOnePasswordPath(companyName)
  const serviceToken = await getCompanyServiceToken(companyName)
  const userEmail = await getUserEmail(loginProps.userID)
  return {
      props: {
        companyName:companyName??'',
        path:path??'',
        serviceToken:serviceToken??'',
        userEmail:userEmail??''
      },
    }
  
}