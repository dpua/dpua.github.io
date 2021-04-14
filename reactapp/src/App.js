import React, { Component } from 'react';
import { Switch, NavLink, Route } from 'react-router-dom';
import {connect} from 'react-redux';
import {getProfileFetch, logoutUser, switchMenu} from './redux/actions';
import Signup from './components/Signup';
import Login from './components/Login';
import Forgot from './components/Forgot';
import "./App.css";
let classLogin="show";
let classSignup="hide";
let classForgot="hide";

class Nav extends Component {
  render() {
      return (
        <nav>
          <ul>
            <li>
                <NavLink to="/">home</NavLink>
            </li>
            <li>
                <NavLink exact  to="/signup">signup</NavLink>
            </li>
            <li>
                <NavLink exact to="/login">login</NavLink>
            </li>
          </ul>
        </nav>
      )
  }
}

class App extends Component {
  componentDidMount = () => {
    this.props.getProfileFetch()
  }

  handleClick = event => {
    event.preventDefault()
    // Удаление token из localStorage
    localStorage.removeItem("token")
    // удаление из Redux хранилица
    this.props.logoutUser()
  }

  signupClick=()=>{
    classLogin="hide";
    classSignup="show";
    classForgot="hide";
    this.forceUpdate()
  }
  loginClick=()=>{
    classLogin="show";
    classSignup="hide";
    classForgot="hide";
    this.forceUpdate()
  }
  forgotClick=()=>{
    classLogin="hide";
    classSignup="hide";
    classForgot="show";
    this.forceUpdate()
  }




  render() {
    console.log("this.props.currentUser");
    console.log(this.props.currentUser);
    return (
      <div>
        <Nav />
        <Switch>
          <Route path="/signup" component={Signup}/>
          <Route path="/login" component={Login}/>
        </Switch>         
        {this.props.currentUser.username
          ? (
            <div>
              <h1>Dashboard</h1>
              <ul>
                <li>
                  {this.props.currentUser.username}
                </li>
                <li>
                  {this.props.currentUser.email}
                </li>
                <li>
                  {this.props.currentUser.password}
                </li>
                <li>
                  {localStorage.getItem("token")}
                </li>
                <li>
                  <button onClick={this.handleClick}>Log Out</button>
                </li>
              </ul>
            </div>
          )//<button onClick={this.handleClick}>Log Out</button>
          : (
            <nav>
              <ul>
                <li className={classSignup}>
                  <Signup />
                  <button onClick={this.loginClick}>login</button>
                </li>
                <li className={classLogin}>
                  <Login />
                  <button onClick={this.forgotClick}>Forgot Your Password?</button>
                  <button onClick={this.signupClick}>Create Account</button>
                </li>
                <li className={classForgot}>
                  <Forgot />
                  <button onClick={this.loginClick}>login</button>
                  <button onClick={this.signupClick}>Create Account</button>
                </li>
              </ul>
            </nav>
          )//null
        }
      </div>
    );
  }
}

const mapStateToProps = state => ({
  currentUser: state.currentUser
  //currentUser: state.reducer.currentUser
})

const mapDispatchToProps = dispatch => ({
  getProfileFetch: () => dispatch(getProfileFetch()),
  logoutUser: () => dispatch(logoutUser()),
  switchMenu: () => dispatch(switchMenu())
})

export default connect(mapStateToProps, mapDispatchToProps)(App);


/*




import React, { Component } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import {connect} from 'react-redux';
import {getProfileFetch, logoutUser} from './redux/actions';
import Signup from './components/Signup';
import Login from './components/Login';


class App extends Component {
  componentDidMount = () => {
    this.props.getProfileFetch()//this.props.getProfileFetch()
  }

  handleClick = event => {
    event.preventDefault()
    // Удаление token из localStorage
    localStorage.removeItem("token")
    // удаление из Redux хранилица
    this.props.logoutUser()
  }

  render() {
    return (
      <div>
        <BrowserRouter>
          <Switch>
            <Route path="/signup" component={Signup}/>
            <Route path="/login" component={Login}/>
          </Switch>
        </BrowserRouter>
          {this.props.currentUser.username
            ? <button onClick={this.handleClick}>Log Out</button>
            : null
          }
      </div>
    );
  }
}

// const mapStateToProps = state => ({
//   currentUser: state.reducer.currentUser
// }
const mapStateToProps = (state) => {
  console.log("stste: "+state);
  console.log(state);
    return {
    currentUser: state.currentUser
  }
}

const mapDispatchToProps = dispatch => ({
  getProfileFetch: () => dispatch(getProfileFetch()),
  logoutUser: () => dispatch(logoutUser())
})

export default connect(mapStateToProps, mapDispatchToProps)(App);
*/