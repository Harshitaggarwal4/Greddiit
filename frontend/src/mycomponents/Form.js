import React, { useState } from 'react'
import './form.css'
import { useNavigate } from "react-router-dom";


export const Form = ({ register, setlogined, setallowregistration, setloginedinuser, setnavigatedone, navigatedone }) => {
    const navigate = useNavigate();
    const [isloading, setisloading] = useState(1);

    const [firstname, firstnamechange] = useState("");
    const [firstnameflag, firstnameflagchange] = useState(false);
    const [lastname, lastnamechange] = useState("");
    const [lastnameflag, lastnameflagchange] = useState(false);
    const [username, usernamechange] = useState("");
    const [usernameflag, usernameflagchange] = useState(false);
    const [email, emailchange] = useState("");
    const [emailflag, emailflagchange] = useState(false);
    const [age, agechange] = useState("");
    const [ageflag, ageflagchange] = useState(false);
    const [contact, contactchange] = useState("");
    const [contactflag, contactflagchange] = useState(false);
    const [password, passwordchange] = useState("");
    const [passwordflag, passwordflagchange] = useState(false);

    const handleOnChangeFirstname = (fun, val) => { fun(val); firstnameflagchange(val !== ""); };
    const handleOnChangeLastname = (fun, val) => { fun(val); lastnameflagchange(val !== ""); };
    const handleOnChangeUsername = (fun, val) => { fun(val); usernameflagchange(val !== ""); };
    const handleOnChangeEmail = (fun, val) => {
        fun(val);
        if (val !== "") {
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
        else {
            emailflagchange(false);
        }
    };
    const handleOnChangeAge = (fun, val) => {
        fun(val);
        if (val !== "") {
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
        else {
            ageflagchange(false);
        }
    };
    const handleOnChangeContact = (fun, val) => {
        fun(val); if (val !== "") {
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
        else {
            contactflagchange(false);
        }
    };
    const handleOnChangePassword = (fun, val) => { fun(val); passwordflagchange(val !== ""); };


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
        if (record) {
            setisloading(1);
            alert("A user with this username already exists!");
            return;
        }
        setlogined(true);
        const myTodo = {
            firstname: firstname,
            lastname: lastname,
            username: username,
            email: email,
            age: age,
            contact: contact,
            password: password,
            following: 0,
            followers: 0,
            followingarray: [],
            followersarray: []
        }
        setloginedinuser(myTodo);
        const res = await fetch("http://localhost:5000/user/add", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "This is Harshit!!" + localStorage.getItem("jwt")
            },
            body: JSON.stringify(myTodo),
        })
            .catch(error => {
                window.alert(error);
                return;
            });
        var rec = await res.json();
        localStorage.setItem("jwt", rec.token);
        setisloading(1);
        setnavigatedone(navigatedone + 1);
        navigate("/" + username);
    }


    return (
        <>
            {isloading == 0 ? <>Loading</> : <>
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
                        <input type="email" pattern="[^ @]*@[^ @]*" className="form-control" placeholder="Email ID" aria-label="email" aria-describedby="basic-addon2" onChange={(e) => { handleOnChangeEmail(emailchange, e.target.value) }} />
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

                    <button id="submit" type="button" className="btn btn-sm btn-primary" onClick={onsubmit} disabled={(!firstnameflag) || (!lastnameflag) || (!usernameflag) || (!emailflag) || (!ageflag) || (!contactflag) || (!passwordflag)}>Submit</button>
                    <br></br><br></br>

                    <button type="button" className="btn btn-sm btn-primary" onClick={() => setallowregistration(false)}>Already a user? Login here</button>
                </div>
            </>}
        </>
    )
}
