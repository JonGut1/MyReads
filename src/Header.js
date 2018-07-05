import React, { Component } from 'react'
import { Link } from 'react-router-dom'

class Header extends Component {
	render() {
		return (
			<header>
			<Link to='/' className='linkTag'>
				<span className='title'>Jonas Book Club</span>
			</Link>
			</header>
		)
	}
}

export default Header