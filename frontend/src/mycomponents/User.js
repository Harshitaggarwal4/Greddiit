import React from 'react'
import { Link } from 'react-router-dom'
import { useState } from 'react';
import { useNavigate } from "react-router-dom";

export const User = (props) => {
    const navigate = useNavigate();

    const [editprofile, seteditprofile] = useState(false);
    const [isloading, setisloading] = useState(1);

    const [firstname, firstnamechange] = useState(props.currentuser.firstname);
    const [lastname, lastnamechange] = useState(props.currentuser.lastname);
    const [username, usernamechange] = useState(props.currentuser.username);
    const [email, emailchange] = useState(props.currentuser.email);
    const [age, agechange] = useState(props.currentuser.age);
    const [contact, contactchange] = useState(props.currentuser.contact);
    const [password, passwordchange] = useState(props.currentuser.password);
    const [emailflag, emailflagchange] = useState(true);
    const [ageflag, ageflagchange] = useState(true);
    const [contactflag, contactflagchange] = useState(true);

    const handleOnChangeFirstname = (fun, val) => { fun(val); if (val === "") { firstnamechange(props.user.firstname); } };
    const handleOnChangeLastname = (fun, val) => { fun(val); if (val === "") { lastnamechange(props.user.lastname); } };
    const handleOnChangeUsername = (fun, val) => { fun(val); if (val === "") { usernamechange(props.user.username); } };
    const handleOnChangeEmail = (fun, val) => {
        fun(val);
        if (val === "") { emailchange(props.user.email); emailflagchange(true); }
        else {
            var flag1 = 0, flag2 = 0;
            for (var i = 0; i < val.length; i++) {
                if (val[i] === "@") {
                    flag1 = 1;
                }
                if (flag1 === 1 && val[i] === ".") {
                    flag2 = 1;
                }
            }
            if (flag2 === 1) {
                emailflagchange(true);
            }
            else {
                emailflagchange(false);
            }
        }
    };
    const handleOnChangeAge = (fun, val) => {
        fun(val); if (val === "") {
            agechange(props.user.age);
            ageflagchange(true);
        }
        else {
            var flag1 = 0;
            for (var i = 0; i < val.length; i++) {
                if (val[i] === "0" || val[i] === "1" || val[i] === "2" || val[i] === "3" || val[i] === "4" || val[i] === "5" || val[i] === "6" || val[i] === "7" || val[i] === "8" || val[i] === "9") {
                    flag1 = 0;
                }
                else {
                    flag1 = 1;
                }
            }
            if (flag1 === 1) {
                ageflagchange(false);
            }
            else {
                ageflagchange(true);
            }
        }
    };
    const handleOnChangeContact = (fun, val) => {
        fun(val); if (val === "") {
            contactchange(props.user.contact);
            contactflagchange(true);
        }
        else {
            var flag1 = 0;
            for (var i = 0; i < val.length; i++) {
                if (val[i] === "0" || val[i] === "1" || val[i] === "2" || val[i] === "3" || val[i] === "4" || val[i] === "5" || val[i] === "6" || val[i] === "7" || val[i] === "8" || val[i] === "9") {
                    flag1 = 0;
                }
                else {
                    flag1 = 1;
                }
            }
            if (flag1 === 1) {
                contactflagchange(false);
            }
            else {
                contactflagchange(true);
            }
        }
    };
    const handleOnChangePassword = (fun, val) => { fun(val); if (val === "") { passwordchange(props.user.password); } };

    const editable = () => {
        if (editprofile === true) {
            seteditprofile(false);
        }
        else {
            seteditprofile(true);
        }
    }

    async function onsubmit(e) {
        e.preventDefault();
        setisloading(0);
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
        const record = await response.json();
        if (props.user.username != username && record) {
            setisloading(1);
            alert("A user with this username already exists!");
            return;
        }
        const myTodo = {
            firstname: firstname,
            lastname: lastname,
            username: username,
            email: email,
            age: age,
            contact: contact,
            password: password,
            following: props.currentuser.following,
            followers: props.currentuser.followers,
            followingarray: props.currentuser.followingarray,
            followersarray: props.currentuser.followersarray
        }
        props.setloginedinuser(myTodo);
        await fetch(`http://localhost:5000/user/update/${props.user.username}`, {
            method: "POST",
            body: JSON.stringify(myTodo),
            headers: {
                'Content-Type': 'application/json',
                "Authorization": "This is Harshit!!" + localStorage.getItem("jwt")
            },
        });
        setisloading(1);
        props.setnavigatedone(props.navigatedone + 1);
        navigate("/" + username);
    }
    return (
        <>{isloading == 0 ? <>Loading</> : <>{props.user.username === props.currentuser.username ?
            <>
                <h1>First Name: {props.currentuser.firstname}</h1>
                <h1>Last name: {props.currentuser.lastname}</h1>
                <h1>Username: {props.currentuser.username}</h1>
                <h1>Email: {props.currentuser.email}</h1>
                <h1>Age: {props.currentuser.age}</h1>
                <h1>Contact: {props.currentuser.contact}</h1>
                <h1>Number of followers: {props.currentuser.followers}</h1>
                <Link to={"/" + props.currentuser.username + "/followers"}>Followers List</Link>
                <h1>Number of following: {props.currentuser.following}</h1>
                <Link to={"/" + props.currentuser.username + "/following"}>Following List</Link>
                <br></br><br></br>
                <button id="submit" type="button" className="btn btn-sm btn-primary" onClick={editable}>Edit profile!</button>
                <br></br><br></br>
                {editprofile === false ? <></> :
                    <div className="ms-3 me-3">
                        <div className="input-group mb-3 mt-3">
                            <span className="input-group-text">First and last name</span>
                            <input type="text" aria-label="First name" className="form-control" onChange={(e) => { handleOnChangeFirstname(firstnamechange, e.target.value) }} />
                            <input type="text" aria-label="Last name" className="form-control" onChange={(e) => { handleOnChangeLastname(lastnamechange, e.target.value) }} />
                        </div>

                        <div className="input-group mb-3">
                            <span className="input-group-text" id="basic-addon1">@</span>
                            <input type="text" className="form-control" placeholder="Username" aria-label="Username" aria-describedby="basic-addon1" onChange={(e) => { handleOnChangeUsername(usernamechange, e.target.value) }} />
                        </div>

                        <div className="input-group mb-3">
                            <input type="email" className="form-control" placeholder="Email ID" aria-label="Recipient's username" aria-describedby="basic-addon2" onChange={(e) => { handleOnChangeEmail(emailchange, e.target.value) }} />
                        </div>

                        <div className="input-group mb-3">
                            <input type="text" className="form-control" placeholder="Age" aria-label="Recipient's username" aria-describedby="basic-addon2" onChange={(e) => { handleOnChangeAge(agechange, e.target.value) }} />
                        </div>

                        <div className="input-group mb-3">
                            <input type="text" className="form-control" placeholder="Contact Number" aria-label="Recipient's username" aria-describedby="basic-addon2" onChange={(e) => { handleOnChangeContact(contactchange, e.target.value) }} />
                        </div>

                        <div className="input-group mb-3">
                            <input type="password" className="form-control" placeholder="Password" aria-label="Recipient's username" aria-describedby="basic-addon2" onChange={(e) => { handleOnChangePassword(passwordchange, e.target.value) }} />
                        </div>

                        <button id="submit" type="button" className="btn btn-sm btn-primary" onClick={onsubmit} disabled={(!emailflag) || (!ageflag) || (!contactflag)}>Submit</button>
                        <br></br><br></br><br></br><br></br>
                    </div>
                }
            </> :
            <>
                <h1>First Name: {props.currentuser.firstname}</h1>
                <h1>Last name: {props.currentuser.lastname}</h1>
                <h1>Username: {props.currentuser.username}</h1>
                <h1>Number of followers: {props.currentuser.followers}</h1>
                <h1>Number of following: {props.currentuser.following}</h1>
            </>
        }</>}
        </>
    )
}
