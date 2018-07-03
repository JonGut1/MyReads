import React, { Component } from 'react'

class Header extends Component {
	render() {
		return (
			<header>
				<span className='title'>Jonas Book Club</span>
				<nav>
					<ul>
						<li><span>Currently Reading</span></li>
						<li><span>Want To Read</span></li>
						<li><span>Already Read</span></li>
					</ul>
				</nav>
			</header>
		)
	}
}

export default Header