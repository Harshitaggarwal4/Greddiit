import './App.css';
import Footer from "./mycomponents/footer.js";
import { Header } from "./mycomponents/Header";
import { Login } from "./mycomponents/Login";
import { User } from "./mycomponents/User";
import { Followers } from "./mycomponents/Followers";
import { Following } from "./mycomponents/Following";
import { Mysubs } from "./mycomponents/Mysubgreddiit";
import { Mysubsopen } from "./mycomponents/Mysubgreddiitopen";
import { Subs } from "./mycomponents/Subgreddiits";
import { Subsopen } from "./mycomponents/Subgreddiitopen";
import { Saves } from "./mycomponents/Saves";
import { Chat } from "./mycomponents/Chat";
import { useEffect, useState } from 'react';
import {
  Route,
  Routes,
  BrowserRouter
} from "react-router-dom";


function App() {

  let initlogined;
  if (localStorage.getItem("logined") === null) {
    initlogined = false;
  }
  else {
    initlogined = JSON.parse(localStorage.getItem("logined"));
  }
  const [logined, setlogined] = useState(initlogined);
  useEffect(() => {
    localStorage.setItem("logined", JSON.stringify(logined));
    if (logined === false) {
      setloginedinuser({ username: "admin" })
    }
  }, [logined])

  let initloginedinuser;
  if (localStorage.getItem("logineduser") === null) {
    initloginedinuser = {
      username: "admin"
    };
  }
  else {
    initloginedinuser = JSON.parse(localStorage.getItem("logineduser"));
  }
  const [loginedinuser, setloginedinuser] = useState(initloginedinuser);
  useEffect(() => {
    localStorage.setItem("logineduser", JSON.stringify(loginedinuser));
  }, [loginedinuser])

  var pathh = (window.location.pathname);
  var path = pathh.split("/");
  if (path[1] === "" && loginedinuser !== "") { path[1] = loginedinuser.username }
  async function finduser() {
    setisloading(0);
    var response = await fetch(`http://localhost:5000/user/${path[1]}`, {
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
    setcurrentuser(record);
    if (record !== null) {
      if (record.username === loginedinuser.username) {
        setloginedinuser(record)
      }
    }

    response = await fetch(`http://localhost:5000/subgreddiit/${loginedinuser.username}`, {
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
    setsubgreddiits(record);
  }

  const [isloading, setisloading] = useState(0);
  const [currentuser, setcurrentuser] = useState();
  const [navigatedone, setnavigatedone] = useState(0);
  const [currcount, setcurrcount] = useState(0);
  const [subgreddiits, setsubgreddiits] = useState([]);
  useEffect(() => { finduser() }, [navigatedone])
  useEffect(() => {
    if (currcount === 0) { setcurrcount(1) }
    else {
      if (currentuser) {
        setisloading(1);
      }
      else {
        if (logined === true) {
          setisloading(2);
        }
        else {
          setisloading(1);
        }
      }
    }
  }, [currentuser]);

  const [incorrectpass, setincorrectpass] = useState(false);

  let initoppenedsubgreddiit;
  if (localStorage.getItem("oppenedsubgreddiit") === null) {
    initoppenedsubgreddiit = "";
  }
  else {
    initoppenedsubgreddiit = JSON.parse(localStorage.getItem("oppenedsubgreddiit"));
  }
  const [oppenedsubgreddiit, setoppenedsubgreddiit] = useState(initoppenedsubgreddiit);
  useEffect(() => {
    localStorage.setItem("oppenedsubgreddiit", JSON.stringify(oppenedsubgreddiit));
  }, [oppenedsubgreddiit])

  let initoppenedsubgreddiit1;
  if (localStorage.getItem("oppenedsubgreddiit1") === null) {
    initoppenedsubgreddiit1 = "";
  }
  else {
    initoppenedsubgreddiit1 = JSON.parse(localStorage.getItem("oppenedsubgreddiit1"));
  }
  const [oppenedsubgreddiit1, setoppenedsubgreddiit1] = useState(initoppenedsubgreddiit1);
  useEffect(() => {
    localStorage.setItem("oppenedsubgreddiit1", JSON.stringify(oppenedsubgreddiit1));
  }, [oppenedsubgreddiit1])

  useEffect(() => {
    localStorage.setItem("chatwith", "admin");
  }, [])

  return (
    <>
      <div id="page-container">
        <BrowserRouter>
          <div id="content-wrap">
            <Header setincorrectpass={setincorrectpass} user={loginedinuser} logout={setlogined} logedin={logined} setnavigatedone={setnavigatedone} navigatedone={navigatedone} />
            {isloading === 0 ? <>Loading</> : isloading === 2 ? <><p>Page not Available!</p></> : <>{logined ? <>
              <Routes>
                <Route exact path="/" element={
                  <>
                    <User user={loginedinuser} currentuser={loginedinuser} setnavigatedone={setnavigatedone} navigatedone={navigatedone} setloginedinuser={setloginedinuser} />
                  </>
                } />
                <Route exact path={"/" + loginedinuser.username} element={
                  <>
                    <User user={loginedinuser} currentuser={loginedinuser} setnavigatedone={setnavigatedone} navigatedone={navigatedone} setloginedinuser={setloginedinuser} />
                  </>
                } />
                {/* <Route exact path={"/" + currentuser.username} element={
                  <>
                    <User user={loginedinuser} currentuser={currentuser} setnavigatedone={setnavigatedone} navigatedone={navigatedone} setloginedinuser={setloginedinuser} />
                  </>
                } /> */}
                <Route exact path={"/" + loginedinuser.username + "/followers"} element={
                  <>
                    <Followers user={loginedinuser} setuser={setloginedinuser} setnavigatedone={setnavigatedone} navigatedone={navigatedone} />
                  </>
                } />
                <Route exact path={"/" + loginedinuser.username + "/following"} element={
                  <>
                    <Following user={loginedinuser} setuser={setloginedinuser} setnavigatedone={setnavigatedone} navigatedone={navigatedone} />
                  </>
                } />
                <Route exact path={"/" + loginedinuser.username + "/mysubgreddiits"} element={
                  <>
                    <Mysubs user={loginedinuser} setnavigatedone={setnavigatedone} navigatedone={navigatedone} subgreddiits={subgreddiits} oppenedsubgreddiit={oppenedsubgreddiit} setoppenedsubgreddiit={setoppenedsubgreddiit} />
                  </>
                } />
                <Route exact path={"/" + loginedinuser.username + "/mysubgreddiits/open"} element={
                  <>
                    <Mysubsopen oppenedsubgreddiit={oppenedsubgreddiit} setnavigatedone={setnavigatedone} navigatedone={navigatedone} />
                  </>
                } />
                <Route exact path={"/" + loginedinuser.username + "/subgreddiits"} element={
                  <>
                    <Subs user={loginedinuser} setnavigatedone={setnavigatedone} navigatedone={navigatedone} setoppenedsubgreddiit1={setoppenedsubgreddiit1} />
                  </>
                } />
                <Route exact path={"/" + loginedinuser.username + "/subgreddiit/open"} element={
                  <>
                    <Subsopen user={loginedinuser} setnavigatedone={setnavigatedone} navigatedone={navigatedone} oppenedsubgreddiit1={oppenedsubgreddiit1} />
                  </>
                } />
                <Route exact path={"/" + loginedinuser.username + "/saved"} element={
                  <>
                    <Saves user={loginedinuser} setnavigatedone={setnavigatedone} navigatedone={navigatedone} />
                  </>
                } />
                {/* <Route exact path={"/" + loginedinuser.username + "/chat"} element={
                  <>
                    <Chat user={loginedinuser} setnavigatedone={setnavigatedone} navigatedone={navigatedone} />
                  </>
                } /> */}
                <Route path="*" element={
                  <>
                    <p>Page not available!!</p>
                  </>
                } />
              </Routes>
            </> : <>
              <Login setincorrectpass={setincorrectpass} incorrectpass={incorrectpass} setlogined={setlogined} user={setloginedinuser} userr={loginedinuser} setnavigatedone={setnavigatedone} navigatedone={navigatedone} />
            </>}</>
            }
          </div>
          <Footer />
        </BrowserRouter>
      </div>
    </>
  );
}

export default App;

// stats    4


// fuzzy search 2
// image    2
// email notification  1+1
// keyboard shortcuts  1
// chat functionality  5