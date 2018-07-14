/* Header.js */

import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import './Header.css';

/*
* a Header component with a link back to the home page. It also changes the search page,
* url to the default.
*/
class Header extends Component {
	render() {
		return (
			<header>
			<Link to='/MyReads' onClick={this.props.defaultUrl} className='linkTag'>
				<span className='titles'>Jonas Book Club</span>
			</Link>
			</header>
		)
	}
}

export default Header