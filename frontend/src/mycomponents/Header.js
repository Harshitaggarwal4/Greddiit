import React from 'react'
import './header.css';
import { useNavigate } from "react-router-dom";

export const Header = (props) => {
    const navigate = useNavigate();
    const gotohome = () => {
        props.setnavigatedone(props.navigatedone + 1)
        navigate("/");
    }
    const gotomysubgr = () => {
        props.setnavigatedone(props.navigatedone + 1)
        navigate("/" + props.user.username + "/mysubgreddiits");
    }
    const gotosubgr = () => {
        props.setnavigatedone(props.navigatedone + 1)
        navigate("/" + props.user.username + "/subgreddiits");
    }
    const gotosaved = () => {
        props.setnavigatedone(props.navigatedone + 1)
        navigate("/" + props.user.username + "/saved");
    }
    const logout = () => {
        props.logout(false);
        props.setincorrectpass(false);
        props.setnavigatedone(props.navigatedone + 1)
        navigate("/");
    }
    return (
        <>
            <div className="headerr">
                <nav className="navbar navbar-expand-lg navbar-light bg-light">
                    <div className="container-fluid">
                        <button onClick={gotohome} className="navbar-brand border-0">Greddiit</button>
                        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        <div className="collapse navbar-collapse" id="navbarSupportedContent">
                            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                                <li className="nav-item">
                                    <button onClick={gotohome} className="nav-link active border-0" aria-current="page">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-house-fill" viewBox="0 0 16 16">
                                            <path d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L8 2.207l6.646 6.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.707 1.5Z" />
                                            <path d="m8 3.293 6 6V13.5a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 13.5V9.293l6-6Z" />
                                        </svg>
                                        Home</button>
                                </li>
                                <li className="nav-item">
                                    <button onClick={gotomysubgr} className="nav-link active border-0" aria-current="page">My Sub Greddiits</button>
                                </li>
                                <li className="nav-item">
                                    <button onClick={gotosubgr} className="nav-link active border-0" aria-current="page">Sub Greddiits</button>
                                </li>
                                <li className="nav-item">
                                    <button onClick={gotosaved} className="nav-link active border-0" aria-current="page">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-bookmark-check-fill" viewBox="0 0 16 16">
                                            <path fillRule="evenodd" d="M2 15.5V2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.74.439L8 13.069l-5.26 2.87A.5.5 0 0 1 2 15.5zm8.854-9.646a.5.5 0 0 0-.708-.708L7.5 7.793 6.354 6.646a.5.5 0 1 0-.708.708l1.5 1.5a.5.5 0 0 0 .708 0l3-3z" />
                                        </svg>
                                        Saved Posts</button>
                                </li>
                            </ul>
                            {props.logedin ? <>
                                <form className="d-flex header">
                                    <button className="btn btn-outline-success" type="submit" onClick={logout}>Log Out</button>
                                </form>
                            </> : <p></p>}
                        </div>
                    </div>
                </nav>
            </div>
        </>
    )
}