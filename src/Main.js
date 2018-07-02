import React, { Component } from 'react'

function CurrentlyReading(props) {
	return (
		<div className='currentlyReading'>
			<span>Currently Reading</span>
			<ul>
				{props.currentlyReading.map(book => (
					<li key={book.id}>
						<img src={book.imageLinks.thumbnail}/>
						<span>{book.title}</span>
							<ul>
								{book.authors.map(author => (
								<li key={author + book.title}>
									<span>{author}</span>
								</li>
								))}
							</ul>
					</li>
				))}
			</ul>
		</div>
	)
}

function WantToRead(props) {
	return (
		<div className='wantToRead'>
			<span>Want To Reading</span>
			<ul>
				{props.wantToRead.map(book => (
					<li key={book.id}>
						<img src={book.imageLinks.thumbnail}/>
						<span>{book.title}</span>
							<ul>
								{book.authors.map(author => (
								<li key={author + book.title}>
									<span>{author}</span>
								</li>
								))}
							</ul>
					</li>
				))}
			</ul>
		</div>
	)
}

function Read(props) {
	return (
		<div className='read'>
			<span>Read</span>
			<ul>
				{props.read.map(book => (
					<li key={book.id}>
						<img src={book.imageLinks.thumbnail}/>
						<span>{book.title}</span>
							<ul>
								{book.authors.map(author => (
								<li key={author + book.title}>
									<span>{author}</span>
								</li>
								))}
							</ul>
					</li>
				))}
			</ul>
		</div>
	)
}

class Main extends Component {
	render() {
		return (
			<main>
				<CurrentlyReading currentlyReading={this.props.currentlyReading}/>
				<WantToRead wantToRead={this.props.wantToRead}/>
				<Read read={this.props.read}/>
			</main>
		)
	}
}

export default Main