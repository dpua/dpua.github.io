import React, {Component} from 'react';
import {connect} from 'react-redux';
import {userPostFetch} from '../redux/actions';

class Signup extends Component {
  state = {
    username: "",
    email: "",
    password: "",
    passwordagain: ""
  }

  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  handleSubmit = event => {
    event.preventDefault()
    this.props.userPostFetch(this.state)
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>

         <div class="input-wrap">
        <input
          id="signup-username"
          name='username'
          placeholder='Username'
          value={this.state.username}
          onChange={this.handleChange}
          required
          />
          <label className="placeholder" for="signup-username">Username</label>
        </div>
  
        <div class="input-wrap">
        <input
          id="signup-email"
          type='email'
          name='email'
          placeholder='Email'
          value={this.state.email}
          onChange={this.handleChange}
          required
          />
          <label className="placeholder" for="signup-email">Email</label>
        </div>

        <div class="input-wrap">
        <input
          id="signup-password"
          type='password'
          name='password'
          placeholder='Password'
          value={this.state.password}
          onChange={this.handleChange}
          required
          />
          <label className="placeholder" for="signup-password">Password</label>
        </div>

        <div class="input-wrap">
        <input
          id="signup-passwordagain"
          type='password'
          name='passwordagain'
          placeholder='Password again'
          value={this.state.passwordagain}
          onChange={this.handleChange}
          required
          />
          <label className="placeholder" for="signup-passwordagain">Password again</label>
        </div>

        <div class="btn-wrap">
        <button type='submit' className="btn">Enter</button>
        </div>
      </form>
    )
  }
}

const mapDispatchToProps = dispatch => ({
  userPostFetch: userInfo => dispatch(userPostFetch(userInfo))
})

export default connect(null, mapDispatchToProps)(Signup);