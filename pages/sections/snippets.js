import React, { useState,useEffect } from 'react';
import {PassageUser}  from '@passageidentity/passage-elements/passage-user'
import Router from 'next/router';
import { getSnippets,addSnippet,getCurrentUserCompany,isAdmin, getUserEmail} from '@/utils/supabase';
import { getAuthenticatedUserFromSession } from '@/utils/passage';

const Snippets = ({userID,companyName,isAdmin,userEmail}) => {

  const [selectedTitle, setSelectedTitle] = useState(null);
  const [selectedLanguage,setSelectedLanguage] = useState('')
  const [selectedCode, setSelectedCode] = useState('');

  const [modalOpen, setModalOpen] = useState(false);

  const [title,setTitle] = useState('')
  const [language,setLanguage] = useState('')
  const [code,setCode] = useState('')

  const [snippetsData,setSnippetsData] = useState([])
  

  useEffect(() => {

    async function getSnippetsFromDatabase() {
      const data = await getSnippets(companyName)
      setSnippetsData(data)
    }

    getSnippetsFromDatabase()
  }, []);

  const handleTitleClick = (title,language,code) => {
    setSelectedTitle(title);
    setSelectedLanguage(language);
    setSelectedCode(code)
  };

  const handleAddButtonClick = () => {
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const handleSnippetSave = async () => {
    // Handle saving the markdown content (e.g., send to server, update state, etc.)
    console.log(code)
    let newSnippet = {
      "title":title,
      "language":language,
      "code":code
    }

    if(snippetsData===null){
      let snippetsArray  = [newSnippet]
      setSnippetsData(snippetsArray)
    }else{
      setSnippetsData(snippetsData => [...snippetsData, newSnippet]);
    }
    try{
      await addSnippet(companyName,newSnippet)
    }catch(error){
      console.log(error)
    }

    setCode('')
    setTitle('');
    setLanguage('')
    setModalOpen(false);
  };

  const signOut = async ()=>{
    new PassageUser().signOut()
    Router.push('/')
}

  return (
    <div className=" bg-[#526D82] min-h-screen">
        <header>
        <nav className="bg-gray-200 p-4">
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-lg font-semibold">{companyName}</h2>
        <p className="text-gray-600">{userEmail}</p>
      </div>
      <div>
        <h1 className="text-xl font-bold">Helpful Code Snippets</h1>
      </div>
      <button className="bg-[#27374D] hover:bg-transparent hover:text-[#27374D] hover:border-[#27374D] border text-white rounded-md py-2 px-4 mr-2" onClick={()=>signOut()}>Sign Out</button>
    </div>
  </nav>
  </header>
    <div className="container mx-auto p-4">
      <div className="flex flex-col md:flex-row">
        <div className="w-full md:w-1/4 rounded-lg p-4 shadow-lg bg-white flex items-center flex-col">
       {isAdmin &&   <div>
        <button
        className="bg-[#27374D] hover:bg-transparent hover:text-[#27374D] hover:border-[#27374D] border text-white rounded-md py-2 px-4 mt-4 mr-2"
        onClick={handleAddButtonClick}
      >
        Add
      </button>
      </div> }
          <ul className='mt-2'>
            {snippetsData &&snippetsData.map((snippet,index) => (
              <li
                key={index}
                className="cursor-pointer hover:underline mb-2"
                onClick={() => handleTitleClick(snippet.title,snippet.language,snippet.code)}
              >
                {snippet.title}
              </li>
            ))}
          </ul>
        </div>
        <div className="w-full md:w-3/4 md:ml-4 rounded-lg p-4 shadow-lg bg-white flex flex-col">
          {selectedTitle ? (
            <div className="bg-gray-800 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg text-white font-semibold">{selectedTitle}</h2>
              <p className="text-gray-400 text-sm">{selectedLanguage}</p>
            </div>
            <div className="bg-gray-900 rounded-lg p-4">
              <pre className="text-white text-sm"><code>{selectedCode}</code></pre>
            </div>
          </div>
          ) : (
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg text-black font-semibold">Select a title to display its content...</h2>
            </div>
          )}
        </div>
      </div>
      {modalOpen && (
        <div>
        <div className="modal-overlay fixed inset-0 bg-black bg-opacity-50"></div>
  <div className="fixed inset-0 flex items-center justify-center z-50">
    <div className="bg-white p-4 rounded-lg w-3/4 shadow-lg h-5/6">
      <h2 className="text-lg font-semibold mb-2">Add New Code Snippet</h2>
      <input
        type="text"
        className="w-full bg-gray-200 p-2 rounded mb-2"
        placeholder="Enter title..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        type="text"
        className="w-full bg-gray-200 p-2 rounded mb-2"
        placeholder="Enter programming language name..."
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
      />
      <textarea
        type="text"
        className="w-full bg-gray-200 p-2 rounded mb-2 resize-y overflow-auto h-2/4"
        placeholder="Enter code..."
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />
      <button
        className="bg-[#27374D] hover:bg-transparent hover:text-[#27374D] hover:border-[#27374D] border text-white rounded-md py-2 px-4 mt-4 mr-2"
        onClick={handleSnippetSave}
      >
        Save
      </button>
      <button
        className="bg-red-500 hover:bg-transparent hover:text-red-500 hover:border-red-500 border rounded-md text-white py-2 px-4 mt-2"
        onClick={handleModalClose}
      >
        Cancel
      </button>
    </div>
  </div>
  </div>
)}
    </div>
    </div>
  );
};

export default Snippets;

export const getServerSideProps = async (context) => {
  
  const loginProps = await getAuthenticatedUserFromSession(context.req, context.res)

  const companyName = await getCurrentUserCompany(loginProps.userID)
  
  const isadmin = await isAdmin(companyName,loginProps.userID)

  const userEmail = await getUserEmail(loginProps.userID)
  return {
      props: {
        userID:loginProps.userID??'',
        companyName:companyName??'',
        isAdmin:isadmin??'',
        userEmail:userEmail??''
      },
    }
  
}
