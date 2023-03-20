import React from 'react'
import { useState } from 'react'
import { useNavigate } from "react-router-dom";


export const Mysubs = (props) => {
    const navigate = useNavigate();

    const [isloading, setisloading] = useState(1);

    const [name, namechange] = useState("");
    const [nameflag, nameflagchange] = useState(false);
    const [description, descriptionchange] = useState("");
    const [descriptionflag, descriptionflagchange] = useState(false);
    const [tags, tagschange] = useState("");
    const [image, setimage] = useState("");
    const [imageflag, setimageflag] = useState("");
    const [tagsflag, tagsflagchange] = useState(false);
    const [banned, bannedchange] = useState("");
    const [bannedflag, bannedflagchange] = useState(false);

    const handleOnChangename = (fun, val) => { fun(val); nameflagchange(val !== ""); };
    const handleOnChangedescription = (fun, val) => { fun(val); descriptionflagchange(val !== ""); };
    const handleOnChangetags = (fun, val) => { fun(val); tagsflagchange(val !== ""); };
    const handleOnChangebanned = (fun, val) => { fun(val); bannedflagchange(val !== ""); };

    const [makesubgreddiit, setmakesubgreddiit] = useState(false);
    const allowform = () => {
        if (makesubgreddiit === true) {
            setmakesubgreddiit(false);
        }
        else {
            setmakesubgreddiit(true);
        }
    }

    async function onsubmit(e) {
        e.preventDefault();
        setisloading(0);
        var url;
        const data = new FormData()
        data.append("file", image)
        data.append("upload_preset", "greddiit")
        data.append("cloud_name", "dhfhs5wwe")
        await fetch("https://api.cloudinary.com/v1_1/dhfhs5wwe/image/upload", {
            method: "POST",
            body: data
        })
            .then(res => res.json())
            .then(data => {
                url = (data.url);
            })
            .catch(err => {
                console.log(err)
            })
        var tagsarray = tags.split(" ");
        var bannedarray = banned.split(" ");
        var currentdate = new Date();
        const myTodo = {
            name: name,
            description: description,
            tags: tagsarray,
            banned: bannedarray,
            moderator: props.user.username,
            followersarray: [props.user.username],
            number_of_posts: 0,
            creation_date_time: currentdate,
            leaved_users: [],
            blocked_users: [],
            url: url
        }
        await fetch("http://localhost:5000/subgreddiit/add", {
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
        navigate("/" + props.user.username + "/mysubgreddiits");
    }

    async function deletesubgreddiit(subgreddiit) {
        setisloading(0);
        await fetch(`http://localhost:5000/subgreddiit/delete/${subgreddiit._id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "This is Harshit!!" + localStorage.getItem("jwt")
            }
        }
        );
        setisloading(1);
        props.setnavigatedone(props.navigatedone + 1);
        navigate("/" + props.user.username + "/mysubgreddiits");
    }

    const opensubgreddiit = async (subgreddiit) => {
        props.setoppenedsubgreddiit(subgreddiit._id);
        await props.setnavigatedone(props.navigatedone + 1);
        navigate("/" + props.user.username + "/mysubgreddiits/open");
    }

    function upload() {
        setimageflag(true);
        document.getElementById("uploadbtn").disabled = true;
    }

    return (
        <>
            {isloading === 0 ? <>Loading</> : <>
                <br></br>
                <button id="submit" type="button" className="btn btn-sm btn-primary" onClick={allowform}>Make a new SubGreddiit</button>
                {makesubgreddiit === false ? <></> :
                    <>
                        <br></br><br></br>
                        <div className="input-group mb-3">
                            <input type="text" className="form-control" placeholder="Name" aria-label="Recipient's username" aria-describedby="basic-addon2" onChange={(e) => { handleOnChangename(namechange, e.target.value) }} />
                        </div>
                        <div className="input-group mb-3">
                            <input type="text" className="form-control" placeholder="Description" aria-label="Recipient's username" aria-describedby="basic-addon2" onChange={(e) => { handleOnChangedescription(descriptionchange, e.target.value) }} />
                        </div>
                        <div className="input-group mb-3">
                            <input type="text" className="form-control" placeholder="Tags" aria-label="Recipient's username" aria-describedby="basic-addon2" onChange={(e) => { handleOnChangetags(tagschange, e.target.value) }} />
                        </div>
                        <div className="input-group mb-3">
                            <input type="text" className="form-control" placeholder="Banned" aria-label="Recipient's username" aria-describedby="basic-addon2" onChange={(e) => { handleOnChangebanned(bannedchange, e.target.value) }} />
                        </div>
                        <div className="btn">
                            <span>Choose Image </span>
                            <input type="file" accept='image/*' onChange={(e) => setimage(e.target.files[0])} />
                            <button id="uploadbtn" type="button" className="btn btn-sm btn-primary" onClick={upload}>Upload</button>
                        </div>
                        <br></br><br></br>
                        <button id="submit" type="button" className="btn btn-sm btn-primary" onClick={onsubmit} disabled={(!nameflag) || (!descriptionflag) || (!tagsflag) || (!bannedflag) || (!imageflag)}>Submit</button>
                    </>
                }
                {
                    props.subgreddiits.map((subgreddiit) => {
                        return (
                            <div key={subgreddiit.creation_date_time}>
                                <br></br>
                                <h1>Name: {subgreddiit.name}</h1>
                                <h1>Description: {subgreddiit.description}</h1>
                                <h1>Banned Keywords: {
                                    subgreddiit.banned.map((bannedword) => {
                                        return (
                                            <div key={bannedword}>
                                                {bannedword}
                                            </div>
                                        )
                                    })
                                }</h1>
                                <h1>Number of people in the Sub Greddiit: {subgreddiit.followersarray.length}</h1>
                                <h1>Number of posts in the Sub Greddiit: {subgreddiit.number_of_posts}</h1>
                                <button id="submit" type="button" className="btn btn-sm btn-primary" onClick={() => opensubgreddiit(subgreddiit)}>Open</button>
                                <button id="submit" type="button" className="btn btn-sm btn-primary ms-3" onClick={() => deletesubgreddiit(subgreddiit)}>Delete</button>
                                <br></br><br></br><br></br>
                            </div>
                        )
                    })}
            </>}
        </>
    )
}
//Sub Greddiit

// name
// description
// tags
// banned keywords
// moderator
// followersarray
// number of posts
// creation date
// leaved users
// blocked users

// Post

// subgreddiit_id
// content
// posted_by
// upvotes
// downvotes


// requests

// subgreddiit_id
// username
// firstname
// lastname


// report

// subgreddiit_id
// post_id
// reported_by
// who_reported
// concern
// post_text
// creation_time
// is_ignored
// is_bloked


// comments

// post_id
// subgreddiit_id
// content
// comment_by


// saves

// subgreddiit_id
// post_id
// username