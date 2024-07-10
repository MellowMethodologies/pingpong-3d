import React from 'react'
import style from './List.module.css'
import UserInfo from './UserInfo/UserInfo'
import ChatList from './ChatList/ChatList'

const List = () => {
  return (
    <div className={style.List}>
      <UserInfo />
      <ChatList />
    </div>
  )
}

export default List
