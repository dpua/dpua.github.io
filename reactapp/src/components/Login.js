import React, {Component} from 'react';
import {connect} from 'react-redux';
import {userLoginFetch} from '../redux/actions';

class Login extends Component {
  state = {
    email: "",
    password: ""
  }

  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  handleSubmit = event => {
    event.preventDefault()
    this.props.userLoginFetch(this.state)
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>

        <div class="input-wrap">
        <input
          id="login-email"
          type='email'
          name='email'
          placeholder='Email'
          value={this.state.email}
          onChange={this.handleChange}
          required
          />
          <label className="placeholder" for="login-email">Email</label>
        </div>

        <div class="input-wrap">
        <input
          id="login-password"
          type='password'
          name='password'
          placeholder='Password'
          value={this.state.password}
          onChange={this.handleChange}
          required
          />
          <label className="placeholder" for="login-password">Password</label>
        </div>

        <div class="btn-wrap">
        <button type='submit' className="btn">Enter</button>
        </div>
      </form>
    )
  }
}

const mapDispatchToProps = dispatch => ({
  userLoginFetch: userInfo => dispatch(userLoginFetch(userInfo))
})

export default connect(null, mapDispatchToProps)(Login);