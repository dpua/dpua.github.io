import React, {Component} from 'react';
import {connect} from 'react-redux';
import {userPostForgot} from '../redux/actions';

class Forgot extends Component {
  state = {
    email: ""
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
        <h1>Forgot Your Password?</h1>

        <div class="input-wrap">
        <input
          id="forgot-email"
          type='email'
          name='email'
          placeholder='Email'
          value={this.state.email}
          onChange={this.handleChange} 
          required
          />
          <label className="placeholder" for="forgot-email">Email</label>
          </div>
  
          <div class="btn-wrap">
        <button type='submit' className="btn">Enter</button>
        </div>
      </form>
    )
  }
}

const mapDispatchToProps = dispatch => ({
  userPostForgot: userInfo => dispatch(userPostForgot(userInfo))
})

export default connect(null, mapDispatchToProps)(Forgot);