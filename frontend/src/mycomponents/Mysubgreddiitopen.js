import React from 'react'
import { useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom";
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';


export const Mysubsopen = (props) => {
    const navigate = useNavigate();

    const [isloading, setisloading] = useState(0);
    const [subgreddiit, setsubgreddiit] = useState({});
    const [requests, setrequests] = useState([]);
    const [reports, setreports] = useState([]);
    const [count, setCount] = useState(3);
    const [text, setText] = useState("Block");
    const [intervalId, setIntervalId] = useState(null);

    async function fetchvalues() {
        var response = await fetch(`http://localhost:5000/subgreddiit/open/${props.oppenedsubgreddiit}`, {
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
        setsubgreddiit(record);

        response = await fetch(`http://localhost:5000/requests/${props.oppenedsubgreddiit}`, {
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
        record = await response.json();
        setrequests(record);

        response = await fetch(`http://localhost:5000/reports/${props.oppenedsubgreddiit}`, {
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
        record = await response.json();
        setreports(record);
        setisloading(1);
    }

    useEffect(() => { fetchvalues() }, []);

    async function accept(request) {
        setisloading(0);
        subgreddiit.followersarray.push(request.username);
        const myTodo = {
            name: subgreddiit.name,
            description: subgreddiit.description,
            tags: subgreddiit.tags,
            banned: subgreddiit.banned,
            moderator: subgreddiit.moderator,
            followersarray: subgreddiit.followersarray,
            number_of_posts: subgreddiit.number_of_posts,
            creation_date_time: subgreddiit.creation_date_time,
            leaved_users: subgreddiit.leaved_users,
            blocked_users: subgreddiit.blocked_users,
            url: subgreddiit.url
        }
        await fetch(`http://localhost:5000/subgreddiit/update/${subgreddiit._id}`, {
            method: "POST",
            body: JSON.stringify(myTodo),
            headers: {
                'Content-Type': 'application/json',
                "Authorization": "This is Harshit!!" + localStorage.getItem("jwt")
            },
        });
        await fetch(`http://localhost:5000/requests/delete/${request._id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "This is Harshit!!" + localStorage.getItem("jwt")
            }
        });
        setisloading(1);
        props.setnavigatedone(props.navigatedone + 1);
        navigate("/" + subgreddiit.moderator + "/mysubgreddiits/open");
    }

    async function reject(request) {
        setisloading(0);
        await fetch(`http://localhost:5000/requests/delete/${request._id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "This is Harshit!!" + localStorage.getItem("jwt")
            }
        });
        setisloading(1);
        props.setnavigatedone(props.navigatedone + 1);
        navigate("/" + subgreddiit.moderator + "/mysubgreddiits/open");
    }

    const handleblock = (report) => {
        if (!intervalId) {
            let currentCount = count;
            const id = setInterval(() => {
                currentCount--;
                if (currentCount >= 0) {
                    setText(`Cancel ${currentCount}`);
                }
                if (currentCount === 0) {
                    setTimeout(() => {
                        block(report);
                    }, 1000);
                }
            }, 1000);
            setIntervalId(id);
        } else {
            clearInterval(intervalId);
            setIntervalId(null);
            setCount(3);
            setText("Block");
        }
    }
    async function block(report) {
        setisloading(0);
        var myTodo = {
            subgreddiit_id: report.subgreddiit_id,
            reported_by: report.reported_by,
            who_reported: report.who_reported,
            concern: report.concern,
            post_text: report.post_text,
            creation_time: report.creation_time,
            is_ignored: report.is_ignored,
            is_blocked: true,
            post_id: report.post_id
        }
        await fetch(`http://localhost:5000/reports/block/update/${report._id}`, {
            method: "POST",
            body: JSON.stringify(myTodo),
            headers: {
                'Content-Type': 'application/json',
                "Authorization": "This is Harshit!!" + localStorage.getItem("jwt")
            },
        });
        subgreddiit.blocked_users.push(report.who_reported);
        const index = subgreddiit.followersarray.indexOf(report.who_reported);
        if (index > -1) {
            subgreddiit.followersarray.splice(index, 1);
        }
        myTodo = {
            name: subgreddiit.name,
            description: subgreddiit.description,
            tags: subgreddiit.tags,
            banned: subgreddiit.banned,
            moderator: subgreddiit.moderator,
            followersarray: subgreddiit.followersarray,
            number_of_posts: subgreddiit.number_of_posts,
            creation_date_time: subgreddiit.creation_date_time,
            leaved_users: subgreddiit.leaved_users,
            blocked_users: subgreddiit.blocked_users,
            url: subgreddiit.url
        }
        await fetch(`http://localhost:5000/subgreddiit/update/${subgreddiit._id}`, {
            method: "POST",
            body: JSON.stringify(myTodo),
            headers: {
                'Content-Type': 'application/json',
                "Authorization": "This is Harshit!!" + localStorage.getItem("jwt")
            },
        });
        setisloading(1);
        props.setnavigatedone(props.navigatedone + 1);
        navigate("/" + subgreddiit.moderator + "/mysubgreddiits/open");
    }
    async function delete_post(report) {
        setisloading(0);
        await fetch(`http://localhost:5000/posts/delete/delete/${report.post_id}/${subgreddiit._id}/${report._id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "This is Harshit!!" + localStorage.getItem("jwt")
            }
        });
        setisloading(1);
        props.setnavigatedone(props.navigatedone + 1);
        navigate("/" + subgreddiit.moderator + "/mysubgreddiits/open");
    }
    async function ignore(report) {
        setisloading(0);
        const myTodo = {
            subgreddiit_id: report.subgreddiit_id,
            reported_by: report.reported_by,
            who_reported: report.who_reported,
            concern: report.concern,
            post_text: report.post_text,
            creation_time: report.creation_time,
            is_ignored: true,
            is_blocked: report.is_blocked,
            post_id: report.post_id
        }
        await fetch(`http://localhost:5000/reports/ignore/update/${report._id}`, {
            method: "POST",
            body: JSON.stringify(myTodo),
            headers: {
                'Content-Type': 'application/json',
                "Authorization": "This is Harshit!!" + localStorage.getItem("jwt")
            },
        });
        setisloading(1);
        props.setnavigatedone(props.navigatedone + 1);
        navigate("/" + subgreddiit.moderator + "/mysubgreddiits/open");
    }

    const [Tab_EventKey, Set_Tab_EventKey] = useState("SubGreddiitPostPage_EventKey");

    const handleKeyDown = (event) => {
        if (event.key === '1') {
            Set_Tab_EventKey("SubGreddiitUsers_EventKey");
        } else if (event.key === '2') {
            Set_Tab_EventKey("SubGreddiitJoiningReqPage_EventKey");
        } else if (event.key === '3') {
            Set_Tab_EventKey("SubGreddiitStats_EventKey");
        } else if (event.key === '4') {
            Set_Tab_EventKey("SubGreddiitReportedPage_EventKey");
        }
    }

    return (
        <>
            {isloading === 0 ? <>Loading</> :
                <>
                    {props.oppenedsubgreddiit ? <>
                        <div onKeyDown={handleKeyDown} tabIndex="0">
                            <Tabs
                                defaultActiveKey={Tab_EventKey}
                                id="justify-tab-example"
                                className="mb-3"
                                justify
                                activeKey={Tab_EventKey} onSelect={(k) => Set_Tab_EventKey(k)}
                                onKeyDown={handleKeyDown}
                            >
                                <Tab eventKey="SubGreddiitUsers_EventKey" title="SubGreddiitUsers">
                                    <h1>Users:
                                        {
                                            subgreddiit.followersarray.map((follower) => {
                                                return (
                                                    <div key={follower}>
                                                        {follower}
                                                    </div>
                                                )
                                            })
                                        }
                                    </h1>
                                    <h1>Blocked Users:
                                        {
                                            subgreddiit.blocked_users.map((follower) => {
                                                return (
                                                    <div key={follower}>
                                                        {follower}
                                                    </div>
                                                )
                                            })
                                        }
                                    </h1>
                                </Tab>
                                <Tab eventKey="SubGreddiitJoiningReqPage_EventKey" title="SubGreddiitJoiningReqPage">
                                    {
                                        requests.map((user) => {
                                            return (
                                                <div key={user._id}>
                                                    <h1>First Name: {user.firstname}</h1>
                                                    <h1>Last Name: {user.lastname}</h1>
                                                    <h1>User Name: {user.username}</h1>
                                                    <button id="submit" type="button" className="btn btn-sm btn-primary" onClick={() => accept(user)}>Accept</button>
                                                    <button id="submit" type="button" className="btn btn-sm btn-primary ms-3" onClick={() => reject(user)}>Reject</button>
                                                </div>
                                            )
                                        })
                                    }
                                </Tab>
                                <Tab eventKey="SubGreddiitStats_EventKey" title="SubGreddiitStats">
                                    ....stats
                                </Tab>
                                <Tab eventKey="SubGreddiitReportedPage_EventKey" title="SubGreddiitReortedPage">
                                    {
                                        reports.map((report) => {
                                            return (
                                                <div key={report._id}>
                                                    <h1>Reported By: {report.reported_by}</h1>
                                                    <h1>Person Reported: {report.who_reported}</h1>
                                                    <h1>Concern: {report.concern}</h1>
                                                    <h1>Post Text: {report.post_text}</h1>
                                                    <button id="submit" type="button" className="btn btn-sm btn-primary" onClick={() => handleblock(report)} disabled={(report.is_ignored || report.is_blocked) === true}>{text}</button>
                                                    <button id="submit" type="button" className="btn btn-sm btn-primary ms-3" onClick={() => delete_post(report)} disabled={(report.is_ignored || report.is_blocked) === true}>Delete</button>
                                                    <button id="submit" type="button" className="btn btn-sm btn-primary ms-3" onClick={() => ignore(report)} disabled={(report.is_ignored || report.is_blocked) === true}>Ignore</button>
                                                </div>
                                            )
                                        })
                                    }
                                </Tab>
                            </Tabs>
                        </div>
                    </> : <>Page not available!</>}
                </>
            }
        </>
    )
}