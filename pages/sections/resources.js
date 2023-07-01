import React, { useState,useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import atomDark from 'react-syntax-highlighter/dist/cjs/styles/prism/atom-dark';
import Router from 'next/router';
import {PassageUser}  from '@passageidentity/passage-elements/passage-user'
import { getResources,addResource,getCurrentUserCompany,isAdmin, getUserEmail} from '@/utils/supabase';
import { getAuthenticatedUserFromSession } from '@/utils/passage';

const Resources = ({userID,companyName,isAdmin,userEmail}) => {

  const renderers = {
    code({ node, inline, className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || '');
      return !inline && match ? (
        <SyntaxHighlighter
          children={String(children).replace(/\n$/, '')}
          style={atomDark}
          language={match[1]}
          PreTag="div"
          {...props}
        />
      ) : (
        <code className={className} {...props}>
          {children}
        </code>
      );
    },
    heading({ level, children }) {
      const HeadingTag = `h${level}`;
      return <HeadingTag className={`text-${9 - level}xl font-bold my-4`}>{children}</HeadingTag>;
    },
    list({ children }) {
      return <ul className="list-disc list-inside ml-6">{children}</ul>;
    },
    listItem({ children }) {
      return <li className="my-2">{children}</li>;
    },
  };


  const [selectedTitle, setSelectedTitle] = useState(null);
  const [selectedContent, setSelectedContent] = useState('');

  const [modalOpen, setModalOpen] = useState(false);

  const [title,setTitle] = useState('')
  const [content,setContent] = useState('')

  const [resourcesData,setResourcesData] = useState([])
  

  useEffect(() => {
    async function getResourcesFromDatabase() {
      const data = await getResources(companyName)
      setResourcesData(data)
    }

    getResourcesFromDatabase()
  }, []);

  const handleTitleClick = (title,content) => {
    setSelectedTitle(title);
    console.log(content)
    setSelectedContent(content)
  };

  const handleAddButtonClick = () => {
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const handleMarkdownSave = async () => {
    
    let newResource = {
      "title":title,
      "content":content
    }

    if(resourcesData===null){
      let resourcesArray  = [newResource]
      setResourcesData(resourcesArray)
    }else{
      setResourcesData(resourcesData => [...resourcesData, newResource]);
    }
    try{
      await addResource(companyName,newResource)
    }catch(error){
      console.log(error)
    }

    setContent('');
    setTitle('');
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
        <h1 className="text-xl font-bold">Helpful Learning Resources</h1>
      </div>
      <button className="bg-[#27374D] hover:bg-transparent hover:text-[#27374D] hover:border-[#27374D] border text-white rounded-md py-2 px-4 mr-2" onClick={()=>signOut()}>Sign Out</button>
    </div>
  </nav>
  </header>
    <div className="container mx-auto p-4">
      <div className="flex flex-col md:flex-row">
        <div className="w-full md:w-1/4 rounded-lg p-4 shadow-lg bg-[#DDE6ED] flex items-center flex-col">
        {isAdmin &&  <div>
        <button
        className="bg-[#27374D] hover:bg-transparent hover:text-[#27374D] hover:border-[#27374D] border text-white rounded-md py-2 px-4 mt-4 mr-2"
        onClick={handleAddButtonClick}
      >
        Add
      </button> 
      </div> }
          <ul className='mt-2'>
            {resourcesData && resourcesData.map((resource,index) => (
              <li
                key={index}
                className="cursor-pointer hover:underline mb-2"
                onClick={() => handleTitleClick(resource.title,resource.content)}
              >
                {resource.title}
              </li>
            ))}
          </ul>
        </div>
        <div className="w-full md:w-3/4 md:ml-4 rounded-lg p-4 shadow-lg bg-[#DDE6ED] flex flex-col">
          {selectedTitle ? (
            <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg text-black font-semibold">{selectedTitle}</h2>
            </div>
            <div>
            <ReactMarkdown 
                components={renderers}
                 >{selectedContent}</ReactMarkdown></div>
      
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
      <h2 className="text-lg font-semibold mb-2">Add New Resource</h2>
      <input
        type="text"
        className="w-full bg-gray-200 p-2 rounded mb-2"
        placeholder="Enter title..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        type="text"
        className="w-full bg-gray-200 p-2 rounded mb-2 resize-y overflow-auto h-4/6"
        placeholder="Enter resource content..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <button
        className="bg-[#27374D] hover:bg-transparent hover:text-[#27374D] hover:border-[#27374D] border text-white rounded-md py-2 px-4 mt-4 mr-2"
        onClick={handleMarkdownSave}
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

export default Resources;

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
