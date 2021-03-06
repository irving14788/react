import React, { Component } from 'react';
import Routes from './Routes';
import { Auth } from 'aws-amplify';
import { Header } from './components/Header';
import { withRouter } from 'react-router-dom'
import './App.css';
import './style/css/bulma.css'

class App extends Component {

  constructor(props) {
		super(props);

		this.state = {
			isAuthenticated: false,
			isAuthenticating: true
		};
	}

  async componentDidMount() {
		try {
			if (await Auth.currentSession()) {
				this.userHasAuthenticated(true);
			}
		} catch (e) {
			if (e !== 'No current user') {
				alert(e);
			}
		}

		this.setState({ isAuthenticating: false });
	}

  userHasAuthenticated = authenticated => {
		this.setState({ isAuthenticated: authenticated });
	};

  handleLogout = async event => {
		await Auth.signOut();
		this.userHasAuthenticated(false);
	  this.props.history.push('/login');
	};


  render() {
    const childProps = {
			isAuthenticated: this.state.isAuthenticated,
			userHasAuthenticated: this.userHasAuthenticated
		};
    return (
      <div className='App'>
      {
        this.state.isAuthenticated ? <Header  handleLogout = {this.handleLogout} /> : ""
      }

        <Routes childProps={childProps} />
      </div>
    );
  }
}

export default withRouter(App);
