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
						{props.optionsList.map(name => (
							<li key={name.class + name.title} tabIndex='0' select={props.book.shelf === name.class ? 'true' : 'false'}
									onClick={() => props.changeShelf(props.book, name.class)}>
							{name.class === 'moreInfo' && (
								<Link to='/moreinfo' className='moreInfoLink'>
								</Link>
							)}
							<span className='glyphicon glyphicon-ok'></span>{name.title}
							</li>
						))}
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
						optionsList={props.optionsList}
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
	constructor(props) {
		super(props);
		this.titles = {
			currentlyReading: 'Currently Reading',
			wantToRead: 'Want To Read',
			read: 'Already Read',
		};
		this.optionsList = [
			{
				class: 'currentlyReading',
				title: 'Currently Reading'
			},
			{
				class: 'wantToRead',
				title: 'Want To Read',
			},
			{
				class: 'read',
				title: 'Already Read',
			},
			{
				class: 'none',
				title: 'None',
			},
			{
				class: 'moreInfo',
				title: 'Expand -->',
			},
		];
	}

/* all required states of this component */
	state = {
		expanded: false,
		currentlyReading: 'list',
		wantToRead: 'list',
		read: 'list',
	}

/* expands the options button on the book */
	expand(id, checker) {
		if (checker === false && this.state.expanded === false) {
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

/* changes the view of the shelf */
	changeView(e) {
		const name = e.target.parentNode;
		const stateName = name.parentNode.parentNode.parentNode.className;
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
			<main onClick={() => this.expand(false, false)}>
			<Link tabIndex='0' to='/search'><button className='addBook'><span className='glyphicon glyphicon-search'></span></button></Link>
			<Link tabIndex='0' to='/deleted'><button className='deletedBooks'><span className='glyphicon glyphicon-trash'>{this.props.recentlyDeleted.length > 0 && (
				<span className='deletedNum'>{this.props.recentlyDeleted.length}</span>)}</span></button></Link>
				{this.props.shelves.map(shelf => (
					<div key={shelf} className={shelf}>
						<div key={shelf + 'titleBar'} className='titleBar'>
							<span key={shelf + 'title'} className='title'>{this.titles[shelf]}</span>
							<div key={shelf + 'buttonViewCont'} className='buttonViewCont'>
								<button key={shelf + 'listView'} onClick={(e) => this.changeView(e)} className='listView' viewtype={this.state[shelf]}><span className='glyphicon glyphicon-th-list'></span></button>
								<button key={shelf + 'gridView'} onClick={(e) => this.changeView(e)} className='gridView' viewtype={this.state[shelf]}><span className='glyphicon glyphicon-th-large'></span></button>
							</div>
						</div>
						<BookCard
							key={shelf + 'BookCard'}
							currentCheck={this.props[shelf]}
							expanded={this.state.expanded}
							expand={(id) => this.expand(id)}
							changeShelf={this.props.changeShelf}
							view={this.state[shelf]}
							optionsList={this.optionsList}
						/>
					</div>
				))}
			</main>
		)
	}
}

export {
	BookCard,
	ButtonCont,
}
export default Main