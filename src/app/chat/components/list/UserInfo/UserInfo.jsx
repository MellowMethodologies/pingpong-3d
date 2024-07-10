import React from 'react'
import style from './UserInfo.module.css'
import Image from 'next/image'

export function Avatar({id, alt}) {
  return (
    <Image src={`/avatars/${id}.jpeg`} alt={alt} width="50" height="50"/>
  )
}


function UserInfo() {
  return (
    <div className={style.userinfo}>
      <div className={style.user}>
        <div className={style.icons}>
            <Avatar className={style.avatars} id="1" alt="player name"/>
            <h2 className="name"> JohnDoe</h2>
        </div>
      </div>
    </div>
  )
}

export default UserInfo
