import React, { useState,useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import atomDark from 'react-syntax-highlighter/dist/cjs/styles/prism/atom-dark';
import Router from 'next/router';
import {PassageUser}  from '@passageidentity/passage-elements/passage-user'
import { getGuides,addGuide,getCurrentUserCompany,isAdmin, getUserEmail} from '@/utils/supabase';
import { getAuthenticatedUserFromSession } from '@/utils/passage';

const Guides = ({userID,companyName,isAdmin,userEmail}) => {

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
      switch (level) {
        case 1:
          return <h1 className="text-4xl font-bold">{children}</h1>;
        case 2:
          return <h2 className="text-3xl font-bold">{children}</h2>;
        case 3:
          return <h3 className="text-2xl font-bold">{children}</h3>;
        case 4:
          return <h4 className="text-xl font-bold">{children}</h4>;
        case 5:
          return <h5 className="text-lg font-bold">{children}</h5>;
        case 6:
          return <h6 className="text-base font-bold">{children}</h6>;
        default:
          return <h6 className="text-base font-bold">{children}</h6>;
      }
    },
    list({ children }) {
      return <ul className="list-disc list-inside">{children}</ul>;
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

  const [guidesData,setGuidesData] = useState([])
  

  useEffect(() => {
    async function getGuidesFromDatabase() {
      const data = await getGuides(companyName)
      setGuidesData(data)
    }

    getGuidesFromDatabase()
  }, []);

  const handleTitleClick = (title,content) => {
    setSelectedTitle(title);
    setSelectedContent(content);
  };

  const handleAddButtonClick = () => {
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const handleMarkdownSave = async () => {
    
    let newGuide = {
      "title":title,
      "content":content
    }

    if(guidesData===null){
      let guidesArray  = [newGuide]
      setGuidesData(guidesArray)
    }else{
      setGuidesData(guidesData => [...guidesData, newGuide]);
    }
    try{
      await addGuide(companyName,newGuide)
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
        <h1 className="text-xl font-bold">Techical Setup Guides</h1>
      </div>
      <button className="bg-[#27374D] hover:bg-transparent hover:text-[#27374D] hover:border-[#27374D] border text-white rounded-md py-2 px-4 mr-2" onClick={()=>signOut()}>Sign Out</button>
    </div>
  </nav>
  </header>
    <div className="container mx-auto p-4">
      <div className="flex flex-col md:flex-row">
        <div className="w-full md:w-1/4 rounded-lg p-4 shadow-lg bg-[#DDE6ED] flex flex-col items-center">
       {isAdmin &&   <div>
        <button
        className="bg-[#27374D] hover:bg-transparent hover:text-[#27374D] hover:border-[#27374D] border text-white rounded-md py-2 px-4 mt-4 mr-2"
        onClick={handleAddButtonClick}
      >
        Add
      </button>
      </div> }
          <ul className='mt-2'>
            {guidesData && guidesData.map((guide,index) => (
              <li
                key={index}
                className="cursor-pointer hover:underline mb-2"
                onClick={() => handleTitleClick(guide.title,guide.content)}
              >
                {guide.title}
              </li>
            ))}
          </ul>
        </div>
        <div className="w-full md:w-3/4 md:ml-4 rounded-lg p-4 shadow-lg bg-[#DDE6ED] flex flex-col">
          {selectedTitle ? (
            <div>
            <h2 className="text-lg font-semibold mb-2">{selectedTitle}</h2>
            <ReactMarkdown remarkPlugins={[remarkGfm]} 
               components={renderers}
                 >{selectedContent}</ReactMarkdown>
      
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
      <h2 className="text-lg font-semibold mb-2">Add New Guide</h2>
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
        placeholder="Enter guide content..."
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

export default Guides;

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