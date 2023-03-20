import React from 'react'
import { FollowingDisplay } from './FollowingDisplay'

export const Following = (props) => {
    return (
        <>
            {
                props.user.followingarray.map((following) => {
                    return (
                        <FollowingDisplay key={following} following={following} user={props.user} setuser={props.setuser} setnavigatedone={props.setnavigatedone} navigatedone={props.navigatedone} />
                    )
                })}
        </>
    )
}
