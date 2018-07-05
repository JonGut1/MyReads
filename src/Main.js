import React, { Component } from 'react'
import { Link } from 'react-router-dom'

function ButtonCont(props) {
		return (
			<div className='imgCont'>
				<img
				src={(() => {
					if (props.book.imageLinks) {
						return props.book.imageLinks.thumbnail;
					} else {
						return '';
					}
				})()}
				/>

				<button onClick={() => props.expand(props.book.id)} className='expand'><span className='glyphicon glyphicon-triangle-bottom'></span></button>
				{props.expanded === props.book.id && (
					<ul role='datalist' className='dropDownList'>
						<li tabIndex='0' select={props.book.shelf === 'currentlyReading' ? 'true' : 'false'}
						onClick={() => props.changeShelf(props.book, 'currentlyReading')}><span className='glyphicon glyphicon-ok'></span>Currently Reading</li>
						<li tabIndex='0' select={props.book.shelf === 'wantToRead' ? 'true' : 'false'}
						onClick={() => props.changeShelf(props.book, 'wantToRead')}><span className='glyphicon glyphicon-ok'></span>Want To Read</li>
						<li tabIndex='0' select={props.book.shelf === 'read' ? 'true' : 'false'}
						onClick={() => props.changeShelf(props.book, 'read')}><span className='glyphicon glyphicon-ok'></span>Already Read</li>
						<li tabIndex='0' select={props.book.shelf === 'none' ? 'true' : 'false'}
						onClick={() => props.changeShelf(props.book, 'none')}><span className='glyphicon glyphicon-ok'></span>None</li>
					</ul>
				)}
			</div>
		)
}

function BookCard(props) {
	return (
		<ul className='list' viewtype={props.view}>
			{props.currentCheck.map(book => (
				<li className='listItem' key={book.id}>
					<div sort={book.shelf} className='readingStatus'></div>
					<ButtonCont
						key={book.id + book.title}
						book={book}
						expanded={props.expanded}
						expand={props.expand}
						changeShelf={props.changeShelf}
					/>
					<span className='bookTitle'>{book.title}</span>
						<ul className='authorsCont'>
							{(() => {
								if (book.authors) {
									return book.authors.map(author => (
										<li key={author + book.title}>
											<span className='authors'>{author}</span>
										</li>
									));
								}
							})()}
						</ul>
				</li>
			))}
		</ul>
	)
}

class Main extends Component {

	state = {
		expanded: false,
		gridcurrentlyReading: 'list',
		gridwantToRead: 'list',
		gridread: 'list',
	}

	expand(id, checker) {
		if (checker === 'main' && this.state.expanded === false) {
			return;
		}
		if (this.state.expanded !== false) {
			this.setState({
				expanded: false,
			});
		} else {
			this.setState({
				expanded: id,
			});
		}
	}

	changeView(e) {
		const name = e.target.parentNode;
		const stateName = 'grid' + name.parentNode.parentNode.parentNode.className;
		if (name.className === 'gridView') {
			this.setState({
				[stateName]: 'grid',
			});
			console.log(this.state);
		} else {
			this.setState({
				[stateName]: 'list',
			});
		}
		console.log(e.target.parentNode.className);
	}

	render() {
		return (
			<main onClick={() => this.expand(false, 'main')}>
			<Link tabIndex='0' to='/search'><button className='addBook'><span className='glyphicon glyphicon-search'></span></button></Link>
				<div className='currentlyReading'>
					<div className='titleBar'>
						<span className='title'>Currently Reading</span>
						<div className='buttonViewCont'>
							<button onClick={(e) => this.changeView(e)} className='gridView'><span className='glyphicon glyphicon-th-large'></span></button>
							<button onClick={(e) => this.changeView(e)} className='listView'><span className='glyphicon glyphicon-th-list'></span></button>
						</div>
					</div>
					<BookCard
						currentCheck={this.props.currentlyReading}
						expanded={this.state.expanded}
						expand={(id) => this.expand(id)}
						changeShelf={this.props.changeShelf}
						view={this.state.gridcurrentlyReading}
					/>
				</div>
				<div className='wantToRead'>
					<div className='titleBar'>
						<span className='title'>Want To Read</span>
						<div className='buttonViewCont'>
							<button onClick={(e) => this.changeView(e)} className='gridView'><span className='glyphicon glyphicon-th-large'></span></button>
							<button onClick={(e) => this.changeView(e)} className='listView'><span className='glyphicon glyphicon-th-list'></span></button>
						</div>
					</div>
					<BookCard
						currentCheck={this.props.wantToRead}
						expanded={this.state.expanded}
						expand={(id) => this.expand(id)}
						changeShelf={this.props.changeShelf}
						view={this.state.gridwantToRead}
					/>
				</div>
				<div className='read'>
					<div className='titleBar'>
						<span className='title'>Already Read</span>
						<div className='buttonViewCont'>
							<button onClick={(e) => this.changeView(e)} className='gridView'><span className='glyphicon glyphicon-th-large'></span></button>
							<button onClick={(e) => this.changeView(e)} className='listView'><span className='glyphicon glyphicon-th-list'></span></button>
						</div>
					</div>
					<BookCard
						currentCheck={this.props.read}
						expanded={this.state.expanded}
						expand={(id) => this.expand(id)}
						changeShelf={this.props.changeShelf}
						view={this.state.gridread}
					/>
				</div>
			</main>
		)
	}
}

export {
	BookCard,
	ButtonCont,
}
export default Main