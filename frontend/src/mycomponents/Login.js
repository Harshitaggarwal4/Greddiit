import React from 'react'
import { useState } from 'react'
import { Form } from "./Form";
import './login.css';
import { useNavigate } from "react-router-dom";


export const Login = (props) => {
    const navigate = useNavigate();
    const [isloading, setisloading] = useState(1);
    async function onsubmit(e) {
        setisloading(0);
        const response = await fetch(`http://localhost:5000/user/login/${username}/${password}`, {
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
        var record = await response.json();
        localStorage.setItem("jwt", record.token);
        record = record.result;
        if (record) {
            props.setlogined(true);
            props.user(record);
            props.setnavigatedone(props.navigatedone + 1)
            navigate("/");
        }
        setisloading(1);
        e.preventDefault();
        props.setincorrectpass(true);
        props.setnavigatedone(props.navigatedone + 1);
        navigate("/");
    }

    const [username, usernamechange] = useState("");
    const [usernameflag, usernameflagchange] = useState(false);
    const [password, passwordchange] = useState("");
    const [passwordflag, passwordflagchange] = useState(false);


    const [allowregisteration, setallowregisteration] = useState(false);

    const handleOnChangeUsername = (fun, val) => { fun(val); usernameflagchange(val !== ""); };
    const handleOnChangePassword = (fun, val) => { fun(val); passwordflagchange(val !== ""); };

    return (
        <>
            {isloading == 0 ? <>Loading</> : <>
                <div id="loginorregister">
                    {allowregisteration ? <>
                        <Form register={props.addTodo} setlogined={props.setlogined} setallowregistration={setallowregisteration} setloginedinuser={props.user} setnavigatedone={props.setnavigatedone} navigatedone={props.navigatedone} />
                    </> : <>
                        <div className="ms-3 mx-3">
                            <div className="input-group mb-3 mt-3">
                                <span className="input-group-text" id="basic-addon1">@</span>
                                <input value={username} type="text" className="form-control" placeholder="Username" aria-label="Username" aria-describedby="basic-addon1" onChange={(e) => { handleOnChangeUsername(usernamechange, e.target.value) }} />
                            </div>

                            <div className="input-group mb-3">
                                <input value={password} type="password" className="form-control" placeholder="Password" aria-label="Recipient's username" aria-describedby="basic-addon2" onChange={(e) => { handleOnChangePassword(passwordchange, e.target.value) }} />
                            </div>

                            <button onClick={onsubmit} id="loginbtn" type="button" className="btn btn-sm btn-primary" disabled={(!usernameflag) || (!passwordflag)}>Submit</button>
                            <br></br><br></br>
                            {props.incorrectpass ? <p className="text-danger">Please check the username and password.</p> : <p></p>
                            }
                            <button onClick={() => setallowregisteration(true)} id="loginbtn" type="button" className="btn btn-sm btn-primary">Not a user? Register here</button>
                        </div>
                    </>}
                </div></>}
        </>
    )
}
