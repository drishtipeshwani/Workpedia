import React ,{useState,useEffect} from 'react'
import { getCompaniesList,addUser,getUniqueCode,checkUserIdExists } from '@/utils/supabase';
import { getAuthenticatedUserFromSession } from '@/utils/passage';
import Router from 'next/router';
import Image from 'next/image'
import loginImage from '../assests/login.png'
import { PassageUser } from '@passageidentity/passage-elements/passage-user';

const EmployeeLogin = ({userID}) => {
  
  const [companiesList,setCompaniesList] = useState([])
  const [companyName,setCompanyName] = useState('')
  const [uniqueCode,setUniqueCode] = useState(null)
  const [isVerified,setIsVerified] = useState(false)
  const [userEmail,setUserEmail] = useState('')
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
      setUserEmail(userEmail)
    }
    getUserEmail()
  }, []);

  useEffect(() => {
    async function fetchCompaniesList() {
      const list = await getCompaniesList()
      setCompaniesList(list)
    }

    fetchCompaniesList();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {

      // Add the given user to the company after verifying the unique code
      const companyCode = await getUniqueCode(companyName)
      console.log(companyCode)
      console.log(uniqueCode)
      if(companyCode === uniqueCode){
      await addUser(companyName, userID,userEmail,authToken);
      Router.push('/home')
      setIsVerified(true)
      console.log('corret')
      }else{
        console.log('Incorret')
      }
    } catch (error) {
      console.error('Error registering company:', error);
    }
  };

  return (
    <div className="mx-auto p-4 flex flex-col justify-center items-center w-full max-h-screen bg-[#526D82]">
    <h1 className='text-white italic text-4xl font-bold mt-5'>Employee Login</h1>
    <div className='grid grid-cols-2 gap-4 mt-6 justify-center items-center p-9'>
    <Image
      src={loginImage}
      alt="Employee Login Image"
      width={1280}
      height={960}
    />
    <form onSubmit={handleSubmit} className="max-w-md mx-auto rounded-lg shadow-md bg-white flex flex-col justify-center items-center p-8 w-full">
    <div className="mb-4">
      <label htmlFor="companyCode" className="block mb-2 font-medium text-gray-700">
        Employee Verification Code
      </label>
      <input
        type="text"
        id="companyCode"
        value={uniqueCode}
        onChange={(e) => setUniqueCode(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#27374D]"
        required
      />
    </div>
    <div className="mb-4">
      <label htmlFor="companyName" className="block mb-2 font-medium text-gray-700">
        Company Name
      </label>
      <select
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-[#27374D]"
            id="companyName"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
          >
            <option value="">Select a company</option>
            {companiesList.map((company, index) => (
              <option key={index} value={company}>
                {company}
              </option>
            ))}
          </select>
    </div>
    <button
      type="submit"
      className="bg-[#27374D] hover:bg-transparent hover:text-[#27374D] hover:border-[#27374D] border text-white rounded-md py-2 px-4 mt-4 mr-2 w-full"
      onClick={(e)=>handleSubmit(e)}
    >
      Login
    </button>
    {uniqueCode && !isVerified && <div>Incorret Verification Code</div>}
  </form>
  </div>
  </div>
  )
}

export default EmployeeLogin

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