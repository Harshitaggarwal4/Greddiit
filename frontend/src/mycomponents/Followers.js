import React from 'react'
import { FollowersDisplay } from './FollowersDisplay'

export const Followers = (props) => {
    return (
        <>
            {
                props.user.followersarray.map((follower) => {
                    return (
                        <FollowersDisplay key={follower} follower={follower} user={props.user} setuser={props.setuser} setnavigatedone={props.setnavigatedone} navigatedone={props.navigatedone} />
                    )
                })}
        </>
    )
}
