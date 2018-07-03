import React, { Component } from 'react'

function CurrentlyReading(props) {
	return (
		<div className='currentlyReading'>
			<span className='title'>Currently Reading</span>
			<ul className='list'>
				{props.currentlyReading.map(book => (
					<li className='listItem' key={book.id}>
						<img src={book.imageLinks.thumbnail}/>
						<span className='bookTitle'>{book.title}</span>
							<ul className='authorsCont'>
								{book.authors.map(author => (
								<li key={author + book.title}>
									<span className='authors'>{author}</span>
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
			<span className='title'>Want To Read</span>
			<ul className='list'>
				{props.wantToRead.map(book => (
					<li className='listItem' key={book.id}>
						<img src={book.imageLinks.thumbnail}/>
						<span className='bookTitle'>{book.title}</span>
							<ul className='authorsCont'>
								{book.authors.map(author => (
								<li key={author + book.title}>
									<span className='authors'>{author}</span>
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
			<span className='title'>Read</span>
			<ul className='list'>
				{props.read.map(book => (
					<li className='listItem' key={book.id}>
						<img src={book.imageLinks.thumbnail}/>
						<span className='bookTitle'>{book.title}</span>
							<ul className='authorsCont'>
								{book.authors.map(author => (
								<li key={author + book.title}>
									<span className='authors'>{author}</span>
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