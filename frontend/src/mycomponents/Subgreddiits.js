import React from 'react'
import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import Fuse from 'fuse.js'

export const Subs = (props) => {
    const navigate = useNavigate();

    const [isloading, setisloading] = useState(1);
    const [searching, setsearching] = useState("");
    const [searching1, setsearching1] = useState("");
    const [subgreddiits1, setsubgreddiits1] = useState([]);
    const [subgreddiits2, setsubgreddiits2] = useState([]);
    const [sort, setsort] = useState(0);
    const [filter, setfilter] = useState("");
    const [filter1, setfilter1] = useState("");

    function compare1(a, b) {
        if (a.name < b.name) {
            return -1;
        }
        if (a.name > b.name) {
            return 1;
        }
        return 0;
    }
    function compare2(a, b) {
        if (a.followersarray.length > b.followersarray.length) {
            return -1;
        }
        if (a.followersarray.length < b.followersarray.length) {
            return 1;
        }
        return 0;
    }
    function compare3(a, b) {
        if (a.creation_date_time > b.creation_date_time) {
            return -1;
        }
        if (a.creation_date_time < b.creation_date_time) {
            return 1;
        }
        return 0;
    }

    async function find() {
        setisloading(0);
        var response = await fetch(`http://localhost:5000/subgreddiit`, {
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
        var record1 = [], record2 = [];
        for (var i = 0; i < record.length; i++) {
            var index = record[i].followersarray.indexOf(props.user.username);
            if (index > -1) {
                record1.push(record[i]);
            }
            else {
                record2.push(record[i]);
            }
        }
        const fuse1 = new Fuse(record1, {
            keys: ['name']
        })
        const fuse2 = new Fuse(record2, {
            keys: ['name']
        })
        if (searching !== "") {
            record1 = ((fuse1.search(searching)).map(character => character.item));
        }
        if (searching !== "") {
            record2 = ((fuse2.search(searching)).map(character => character.item));
        }
        var tags = filter.split(" ");
        var spliceindex = [];
        for (var i = 0; i < tags.length; i++) {
            if (tags[i] === "") {
                spliceindex.push(i);
            }
        }
        var c = 0;
        for (var i = 0; i < spliceindex.length; i++) {
            tags.splice(spliceindex[i] - c, 1);
            c++;
        }
        if (tags.length !== 0) {
            spliceindex = [];
            for (var i = 0; i < record1.length; i++) {
                var flag = 0;
                for (var j = 0; j < tags.length; j++) {
                    var index = record1[i].tags.indexOf(tags[j]);
                    if (index === -1) {
                        flag = 1;
                    }
                }
                if (flag === 1) {
                    spliceindex.push(i);
                }
            }
            c = 0;
            for (var i = 0; i < spliceindex.length; i++) {
                record1.splice(i - c, 1);
                c++;
            }
            spliceindex = [];
            for (var i = 0; i < record2.length; i++) {
                var flag = 0;
                for (var j = 0; j < tags.length; j++) {
                    var index = record2[i].tags.indexOf(tags[j]);
                    if (index === -1) {
                        flag = 1;
                    }
                }
                if (flag === 1) {
                    spliceindex.push(i);
                }
            }
            c = 0;
            for (var i = 0; i < spliceindex.length; i++) {
                record2.splice(i - c, 1);
                c++;
            }
        }
        if (sort === 1) {
            record1.sort(compare1);
            record2.sort(compare1);
        }
        else if (sort === 2) {
            record1.sort(compare2);
            record2.sort(compare2);
        }
        else if (sort == 3) {
            record1.sort(compare3);
            record2.sort(compare3);
        }
        setsubgreddiits1(record1);
        setsubgreddiits2(record2);
        setisloading(1);
    }
    useEffect(() => { find() }, [filter, searching, sort]);

    const handleOnChangesearching = (fun, val) => { fun(val); };
    const handleOnChangefilter = (fun, val) => { fun(val); };
    const makeeverythingwork = () => {
        setfilter(filter1);
        setsearching(searching1);
    }

    async function leave(subgreddiit) {
        subgreddiit.leaved_users.push(props.user.username);
        var index = subgreddiit.followersarray.indexOf(props.user.username);
        subgreddiit.followersarray.splice(index, 1);
        setisloading(0);
        await fetch(`http://localhost:5000/subgreddiit/update/${subgreddiit._id}`, {
            method: "POST",
            body: JSON.stringify(subgreddiit),
            headers: {
                'Content-Type': 'application/json',
                "Authorization": "This is Harshit!!" + localStorage.getItem("jwt")
            },
        });
        setisloading(1);
        props.setnavigatedone(props.navigatedone + 1);
        navigate("/" + props.user.username + "/subgreddiits");
    }

    const open = (subgreddiit) => {
        props.setoppenedsubgreddiit1(subgreddiit._id);
        props.setnavigatedone(props.navigatedone + 1);
        navigate("/" + props.user.username + "/subgreddiit/open");
    }

    async function join(subgreddiit) {
        var index = subgreddiit.leaved_users.indexOf(props.user.username);
        if (index > -1) {
            window.alert("You already left the SubGreddiit!");
            return;
        }
        index = subgreddiit.blocked_users.indexOf(props.user.username);
        if (index > -1) {
            window.alert("You banned from the SubGreddiit!");
            return;
        }
        setisloading(0);
        const response = await fetch(`http://localhost:5000/requests/${subgreddiit._id}/${props.user.username}`, {
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
        if (record.length === 0) {
            var myTodo = {
                subgreddiit_id: subgreddiit._id,
                username: props.user.username,
                firstname: props.user.firstname,
                lastname: props.user.lastname
            };
            await fetch("http://localhost:5000/requests/add", {
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
            navigate("/" + props.user.username + "/subgreddiits/");
        }
        else {
            setisloading(1);
            return;
        }
    }

    return (
        <>
            {isloading === 0 ? <>Loading</> :
                <>
                    <div className="input-group mb-3">
                        <input type="text" value={searching1} className="form-control" placeholder="Search" aria-label="email" aria-describedby="basic-addon2" onChange={(e) => { handleOnChangesearching(setsearching1, e.target.value) }} />
                    </div>
                    <div className="input-group mb-3">
                        <input type="text" value={filter1} className="form-control" placeholder="Tags" aria-label="email" aria-describedby="basic-addon2" onChange={(e) => { handleOnChangefilter(setfilter1, e.target.value) }} />
                    </div>
                    <button type="button" className="btn btn-sm btn-primary" onClick={() => makeeverythingwork()}>Apply search and filter</button>
                    <br></br><br></br>
                    <div class="dropdown">
                        <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                            Sort
                        </button>
                        <ul class="dropdown-menu">
                            <li><button class="dropdown-item" type="button" onClick={() => setsort(1)}>Name</button></li>
                            <li><button class="dropdown-item" type="button" onClick={() => setsort(2)}>Followers</button></li>
                            <li><button class="dropdown-item" type="button" onClick={() => setsort(3)}>Creation Date</button></li>
                            <li><button class="dropdown-item" type="button" onClick={() => setsort(0)}>None of the above</button></li>
                        </ul>
                    </div>
                    {
                        subgreddiits1.map((subgreddiit) => {
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
                                    <br></br>
                                    <button id="submit" type="button" className="btn btn-sm btn-primary" disabled={subgreddiit.moderator === props.user.username || subgreddiit.followersarray.indexOf(props.user.username) === -1} onClick={() => leave(subgreddiit)}>Leave</button>
                                    <br></br><br></br>
                                    <button id="submit" type="button" className="btn btn-sm btn-primary" onClick={() => open(subgreddiit)}>Open</button>
                                    <br></br><br></br><br></br>
                                </div>
                            )
                        })
                    }
                    {
                        subgreddiits2.map((subgreddiit) => {
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
                                    <br></br><br></br>
                                    <button id="submit" type="button" className="btn btn-sm btn-primary" onClick={() => join(subgreddiit)}>Join</button>
                                    <br></br><br></br><br></br>
                                </div>
                            )
                        })
                    }
                </>
            }
        </>
    )
}
