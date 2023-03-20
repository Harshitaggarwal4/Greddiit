import React from 'react'
import './followersDisplay.css'
import { useState } from 'react';
import { useNavigate } from "react-router-dom";

export const FollowersDisplay = ({ follower, user, setuser, setnavigatedone, navigatedone }) => {
    const navigate = useNavigate();

    const [isloading, setisloading] = useState(1);
    async function remove() {
        var index;
        for (index = 0; index < user.followersarray.length; index++) {
            if (user.followersarray[index] === follower) {
                break;
            }
        }
        var username = user.followersarray[index];
        user.followersarray.splice(index, 1);
        user.followers = user.followers - 1;
        setisloading(0);
        await fetch(`http://localhost:5000/user/update/${user.username}`, {
            method: "POST",
            body: JSON.stringify(user),
            headers: {
                'Content-Type': 'application/json',
                "Authorization": "This is Harshit!!" + localStorage.getItem("jwt")
            },
        });
        const response = await fetch(`http://localhost:5000/user/${username}`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": "This is Harshit!!" + localStorage.getItem("jwt")
            }
        });
        if (!response.ok) {
            const message = `An error has occurred: ${response.statusText}`;
            window.alert(message);
            return;
        }
        var userr = await response.json();

        index = userr.followingarray.indexOf(user.username);
        if (index > -1) {
            userr.followingarray.splice(index, 1);
        }
        userr.following = userr.following - 1;
        await fetch(`http://localhost:5000/user/update/${userr.username}`, {
            method: "POST",
            body: JSON.stringify(userr),
            headers: {
                'Content-Type': 'application/json',
                "Authorization": "This is Harshit!!" + localStorage.getItem("jwt")
            },
        });

        setisloading(1);
        setuser(user);
        setnavigatedone(navigatedone + 1);
        navigate("/" + user.username + "/followers");
    }
    return (
        <>
            {isloading === 0 ? <>Loading</> : <><h4 id="name">{follower}</h4>
                <button id="button" type="button" className="btn btn-sm btn-primary" onClick={remove}>Remove</button>
                <br></br><br></br><br></br><br></br></>}
        </>
    )
}
