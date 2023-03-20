import React from 'react'
import { useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom";


export const Saves = (props) => {
    const navigate = useNavigate();

    const [isloading, setisloading] = useState(1);
    const [posts, setposts] = useState([]);

    const [concern, concernchange] = useState("");
    const [concernflag, concernflagchange] = useState(false);
    const [reportflag, setreportflag] = useState(false);

    const changereportflag = () => {
        if (reportflag === true) {
            setreportflag(false);
        }
        else {
            setreportflag(true);
        }
    }

    const handleOnChangeconcern = (fun, val) => { fun(val); concernflagchange(val !== ""); };

    useEffect(() => { find() }, []);

    async function find() {
        setisloading(0);
        var response = await fetch(`http://localhost:5000/saves/${props.user.username}`, {
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
        var record1 = [];
        for (var i = 0; i < record.length; i++) {
            response = await fetch(`http://localhost:5000/posts/find/${record[i].post_id}`, {
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
            var record2 = await response.json();
            record1.push(record2);
        }
        console.log(record1);
        setposts(record1);
        setisloading(1);
    }

    async function unsave(post) {
        setisloading(0);
        await fetch(`http://localhost:5000/saves/delete/${post._id}/${props.user.username}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "This is Harshit!!" + localStorage.getItem("jwt")
            }
        });
        setisloading(1);
        props.setnavigatedone(props.navigatedone + 1);
        navigate("/" + props.user.username + "/saved");
    }

    async function follow(post) {
        setisloading(0);
        var index = props.user.followingarray.indexOf(post.posted_by);
        if (index > -1) {
            setisloading(1);
            return;
        }
        props.user.following++;
        props.user.followingarray.push(post.posted_by);
        const response = await fetch(`http://localhost:5000/user/${post.posted_by}`, {
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
        record.followers++;
        record.followersarray.push(props.user.username);
        await fetch(`http://localhost:5000/user/update/${props.user.username}`, {
            method: "POST",
            body: JSON.stringify(props.user),
            headers: {
                'Content-Type': 'application/json',
                "Authorization": "This is Harshit!!" + localStorage.getItem("jwt")
            },
        });
        await fetch(`http://localhost:5000/user/update/${record.username}`, {
            method: "POST",
            body: JSON.stringify(record),
            headers: {
                'Content-Type': 'application/json',
                "Authorization": "This is Harshit!!" + localStorage.getItem("jwt")
            },
        });
        setisloading(1);
        props.setnavigatedone(props.navigatedone + 1);
        navigate("/" + props.user.username + "/saved");
    }

    async function report(post) {
        setisloading(0);
        var time = new Date();
        var myTodo = {
            subgreddiit_id: post.subgreddiit_id,
            post_id: post._id,
            reported_by: props.user.username,
            who_reported: post.posted_by,
            concern: concern,
            post_text: post.content,
            creation_time: time,
            is_ignored: false,
            is_blocked: false
        }
        await fetch("http://localhost:5000/reports/add", {
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
        setisloading(1);
        props.setnavigatedone(props.navigatedone + 1);
        navigate("/" + props.user.username + "/saved");
    }

    return (
        <>
            {isloading === 0 ? <>Loading</> : <>
                {
                    posts.map((post) => {
                        return (
                            <div key={post._id}>
                                <br></br>
                                <h1>Posted By: {post.posted_by}</h1>
                                <h1>Content: {post.content}</h1>
                                <h1>Upvotes: {post.upvotes.length}</h1>
                                <h1>Downvotes: {post.downvotes.length}</h1>
                                <br></br>
                                <button id="submit" type="button" className="btn btn-sm btn-primary" onClick={() => follow(post)} disabled={(props.user.username === post.posted_by)} >Follow</button>
                                <br></br><br></br>
                                <button id="submit" type="button" className="btn btn-sm btn-primary" onClick={() => changereportflag(post)}>Report</button>
                                <br></br><br></br>
                                {reportflag === false ? <></> : <>
                                    <div className="input-group mb-3">
                                        <input type="text" className="form-control" placeholder="content" aria-label="Recipient's username" aria-describedby="basic-addon2" onChange={(e) => { handleOnChangeconcern(concernchange, e.target.value) }} />
                                    </div>
                                    <button id="submit" type="button" className="btn btn-sm btn-primary" onClick={() => report(post)} disabled={!concernflag}>Submit</button>
                                    <br></br><br></br>
                                </>}
                                <button id="submit" type="button" className="btn btn-sm btn-primary" onClick={() => unsave(post)}>Unsave</button>
                                <br></br><br></br><br></br>
                            </div>
                        )
                    })}
            </>}
        </>
    )
}