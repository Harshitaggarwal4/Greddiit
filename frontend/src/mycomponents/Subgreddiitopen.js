import React from 'react'
import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import './Subgreddiitopen.css'

export const Subsopen = (props) => {
    const navigate = useNavigate();

    const [isloading, setisloading] = useState(1);
    const [subgreddiit, setsubgreddiit] = useState({});
    const [posts, setposts] = useState([]);
    const [content, contentchange] = useState("");
    const [contentflag, contentflagchange] = useState(false);
    const [commentcontent, commentcontentchange] = useState("");
    const [concern, concernchange] = useState("");
    const [commentcontentflag, commentcontentflagchange] = useState(false);
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

    const handleOnChangecontent = (fun, val) => { fun(val); contentflagchange(val !== ""); };
    const handleOnChangecommentcontent = (fun, val) => { fun(val); commentcontentflagchange(val !== ""); };
    const handleOnChangeconcern = (fun, val) => { fun(val); concernflagchange(val !== ""); };

    async function oncreatepost() {
        document.getElementById("closemodalplease").click();
        setisloading(0);
        var cont = content.split(" ");
        var flag = 0;
        var content1 = "";
        for (var i = 0; i < cont.length; i++) {
            for (var j = 0; j < subgreddiit.banned.length; j++) {
                if (subgreddiit.banned[j].toLowerCase() === cont[i].toLowerCase()) {
                    flag = 1;
                    cont[i] = "*";
                }
            }
            content1 = content1 + cont[i] + " ";
        }
        const myTodo = {
            subgreddiit_id: subgreddiit._id,
            content: content1,
            posted_by: props.user.username,
            upvotes: [],
            downvotes: []
        }
        await fetch("http://localhost:5000/posts/add", {
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
        subgreddiit.number_of_posts++;
        await fetch(`http://localhost:5000/subgreddiit/update/${subgreddiit._id}`, {
            method: "POST",
            body: JSON.stringify(subgreddiit),
            headers: {
                'Content-Type': 'application/json',
                "Authorization": "This is Harshit!!" + localStorage.getItem("jwt")
            },
        });
        setisloading(1);
        if (flag === 1) {
            alert("You are using banned words!");
        }
        props.setnavigatedone(props.navigatedone + 1);
        navigate("/" + props.user.username + "/subgreddiit/open");
    }

    async function onaddcomment(post) {
        document.getElementById("closemodalplease2").click();
        setisloading(0);
        const myTodo = {
            post_id: post._id,
            subgreddiit_id: subgreddiit._id,
            content: commentcontent,
            comment_by: props.user.username
        }
        await fetch("http://localhost:5000/comments/add", {
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
        navigate("/" + props.user.username + "/subgreddiit/open");
    }

    async function find() {
        setisloading(0);
        var response = await fetch(`http://localhost:5000/subgreddiit/open/${props.oppenedsubgreddiit1}`, {
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
        if (record.followersarray.indexOf(props.user.username) === -1) {
            setisloading(1);
            props.setnavigatedone(props.navigatedone + 1);
            navigate("/" + props.user.username + "/subgreddiits");
        }
        setsubgreddiit(record);

        response = await fetch(`http://localhost:5000/posts/${record._id}`, {
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

        for (var i = 0; i < record.length; i++) {
            response = await fetch(`http://localhost:5000/comments/${record[i]._id}`, {
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
            const record1 = await response.json();
            record[i].comments = record1;
            var ii = record[i].upvotes.indexOf(props.user.username);
            var iii = record[i].downvotes.indexOf(props.user.username);
            if (ii > -1) {
                record[i].voting = 1;
            }
            else if (iii > -1) {
                record[i].voting = 2;
            }
            else {
                record[i].voting = 0;
            }
        }
        setposts(record);

        setisloading(1);
    }
    useEffect(() => { find() }, []);

    async function upvote(post) {
        setisloading(0);
        var myTodo;
        if (post.voting === 2) {
            var ii = post.downvotes.indexOf(props.user.username);
            post.downvotes.splice(ii, 1);
            post.upvotes.push(props.user.username);
        }
        else {
            post.upvotes.push(props.user.username);
        }
        myTodo = {
            subgreddiit_id: post.subgreddiit_id,
            content: post.content,
            posted_by: post.posted_by,
            upvotes: post.upvotes,
            downvotes: post.downvotes
        }
        await fetch(`http://localhost:5000/posts/update/${post._id}`, {
            method: "POST",
            body: JSON.stringify(myTodo),
            headers: {
                'Content-Type': 'application/json',
                "Authorization": "This is Harshit!!" + localStorage.getItem("jwt")
            },
        });
        setisloading(1);
        props.setnavigatedone(props.navigatedone + 1);
        navigate("/" + props.user.username + "/subgreddiit/open");
    }

    async function downvote(post) {
        setisloading(0);
        var myTodo;
        if (post.voting === 1) {
            var ii = post.upvotes.indexOf(props.user.username);
            post.upvotes.splice(ii, 1);
            post.downvotes.push(props.user.username);
        }
        else {
            post.downvotes.push(props.user.username);
        }
        myTodo = {
            subgreddiit_id: post.subgreddiit_id,
            content: post.content,
            posted_by: post.posted_by,
            upvotes: post.upvotes,
            downvotes: post.downvotes
        }
        await fetch(`http://localhost:5000/posts/update/${post._id}`, {
            method: "POST",
            body: JSON.stringify(myTodo),
            headers: {
                'Content-Type': 'application/json',
                "Authorization": "This is Harshit!!" + localStorage.getItem("jwt")
            },
        });
        setisloading(1);
        props.setnavigatedone(props.navigatedone + 1);
        navigate("/" + props.user.username + "/subgreddiit/open");
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
        navigate("/" + props.user.username + "/subgreddiit/open");
    }

    async function report(post) {
        setisloading(0);
        var time = new Date();
        var myTodo = {
            subgreddiit_id: subgreddiit._id,
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
        navigate("/" + props.user.username + "/subgreddiit/open");
    }

    async function save(post) {
        setisloading(0);
        const response = await fetch(`http://localhost:5000/saves/${props.user.username}/${post._id}`, {
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
        if (record.length !== 0) {
            setisloading(1);
            return;
        }
        const myTodo = {
            subgreddiit_id: subgreddiit._id,
            post_id: post._id,
            username: props.user.username
        }
        await fetch("http://localhost:5000/saves/add", {
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
        navigate("/" + props.user.username + "/subgreddiit/open");
    }

    return (
        <>
            {isloading === 0 ? <>Loading</> : <>
                <div id="subgreddiitimg">
                    <img width="400" src={subgreddiit.url} />
                </div>
                <br></br>
                <h1>Name: {subgreddiit.name}</h1>
                <h1>Description: {subgreddiit.description}</h1>
                <br></br><br></br>
                <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
                    Create Post
                </button>
                <div className="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">Create Post</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <div className="input-group mb-3">
                                    <input type="text" className="form-control" placeholder="content" aria-label="Recipient's username" aria-describedby="basic-addon2" onChange={(e) => { handleOnChangecontent(contentchange, e.target.value) }} />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" id="closemodalplease">Close</button>
                                <button type="button" className="btn btn-primary" onClick={oncreatepost} disabled={(!contentflag)}>Save changes</button>
                            </div>
                        </div>
                    </div>
                </div>
                <br></br><br></br><br></br>
                {
                    posts.map((post) => {
                        return (
                            <div key={post._id}>
                                <br></br>
                                <h1>Posted By: {post.posted_by}</h1>
                                <h1>Content: {post.content}</h1>
                                <h1>Upvotes: {post.upvotes.length}</h1>
                                <h1>Downvotes: {post.downvotes.length}</h1>
                                <h1>Comments:</h1>
                                {
                                    post.comments.map((comment) => {
                                        return (
                                            <div key={comment._id}>
                                                <h1>
                                                    Commented By: {comment.comment_by}<br></br>Content: {comment.content}
                                                </h1>
                                                <br></br>
                                            </div>
                                        )
                                    })
                                }
                                <br></br>
                                {post.voting === 0 ? <>
                                    <button id="submit" type="button" className="btn btn-sm btn-primary" onClick={() => upvote(post)}>Upvote</button>
                                    <br></br><br></br>
                                    <button id="submit" type="button" className="btn btn-sm btn-primary" onClick={() => downvote(post)}>Downvote</button>
                                    <br></br><br></br>
                                </> : <>
                                    {post.voting === 1 ? <>
                                        <button id="submit" type="button" className="btn btn-sm btn-primary" onClick={() => downvote(post)}>Downvote</button>
                                        <br></br><br></br>
                                    </> : <>
                                        <button id="submit" type="button" className="btn btn-sm btn-primary" onClick={() => upvote(post)}>Upvote</button>
                                        <br></br><br></br>
                                    </>}
                                </>}
                                <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal1">
                                    Add Comment
                                </button>
                                <div className="modal fade" id="exampleModal1" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                    <div className="modal-dialog">
                                        <div className="modal-content">
                                            <div className="modal-header">
                                                <h5 className="modal-title" id="exampleModalLabel">Add Comment</h5>
                                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                            </div>
                                            <div className="modal-body">
                                                <div className="input-group mb-3">
                                                    <input type="text" className="form-control" placeholder="content" aria-label="Recipient's username" aria-describedby="basic-addon2" onChange={(e) => { handleOnChangecommentcontent(commentcontentchange, e.target.value) }} />
                                                </div>
                                            </div>
                                            <div className="modal-footer">
                                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" id="closemodalplease2">Close</button>
                                                <button type="button" className="btn btn-primary" onClick={() => onaddcomment(post)} disabled={(!commentcontentflag)}>Save changes</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <br></br><br></br>
                                <button id="submit" type="button" className="btn btn-sm btn-primary" onClick={() => follow(post)} disabled={(props.user.username === post.posted_by)} >Follow</button>
                                <br></br><br></br>
                                <button id="submit" type="button" className="btn btn-sm btn-primary" onClick={() => changereportflag(post)}>Report</button>
                                <br></br><br></br>
                                {reportflag === false ? <></> : <>
                                    <div className="input-group mb-3">
                                        <input type="text" className="form-control" placeholder="content" aria-label="Recipient's username" aria-describedby="basic-addon2" onChange={(e) => { handleOnChangeconcern(concernchange, e.target.value) }} />
                                    </div>
                                    <button id="submit" type="button" className="btn btn-sm btn-primary" onClick={() => report(post)} disabled={!concernflag}>Submit</button><br></br><br></br>
                                </>}
                                <button id="submit" type="button" className="btn btn-sm btn-primary" onClick={() => save(post)}>Save</button>
                                <br></br><br></br>
                                <button id="submit" type="button" className="btn btn-sm btn-primary" onClick={() => {
                                    localStorage.setItem("chatwith", post.posted_by);
                                    props.setnavigatedone(props.navigatedone + 1);
                                    navigate("/" + props.user.username + "/chat");
                                }}>Start Chat</button>
                                <br></br><br></br><br></br>
                            </div>
                        )
                    })
                }
                <br></br><br></br><br></br><br></br>
            </>}
        </>
    )
}
