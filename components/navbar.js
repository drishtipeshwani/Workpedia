import React from 'react'
import {PassageUser}  from '@passageidentity/passage-elements/passage-user'
import Router from 'next/router'

const Navbar = () => {

    const signOut = async ()=>{
        new PassageUser().signOut()
        Router.push('/')
    }
    

  return (
    <div>
        <nav className="bg-gray-200 p-4">
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-lg font-semibold">Company Name</h2>
        <p className="text-gray-600">Welcome, userEmail</p>
      </div>
      <div>
        <h1 className="text-xl font-bold">Employee Dashboard</h1>
      </div>
      <button className="bg-[#27374D] hover:bg-transparent hover:text-[#27374D] hover:border-[#27374D] border text-white rounded-md py-2 px-4 mr-2" onClick={signOut()}>Sign Out</button>
    </div>
  </nav>
    </div>
  )
}

export default Navbar