import React from 'react'
import Chat from './components/chat/Chat.jsx'
import List from './components/list/List.jsx'
import Detail from './components/detail/Detail.jsx'
import style from './style.module.css'


function page() {
  return (
    <div className={style.body}>
      <div className={style.container}>
        <List/>
        <Detail/>
        <Chat/>
      </div>
    </div>
  )
}

export default page
