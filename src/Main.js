/* Main.js */

import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import './Main.css';

/* images */
import CoverCurrent from './icons/currentlyReading.jpg'
import CoverWant from './icons/wantToRead.jpg'
import CoverRead from './icons/read.jpg'
import CoverNone from './icons/none.jpg'

/* a component respnsible for displaying variations of the book's colors */
function BookImage(props) {
	return (
		<img
		src={(() => {
			if (props.book.imageLinks) {
				return props.book.imageLinks.thumbnail;
			} else {
				return '';
			}
		})()}
		alt=''
		/>
	)
}

/*
* displays the options button and the options list when the button is clicked
*/
function ButtonCont(props) {
		return (
			<div>
				<button onClick={() => props.expand(props.book.id)} className='expand'><span className='glyphicon glyphicon-triangle-bottom'></span></button>
				{props.expanded === props.book.id && (
					<ul className='dropDownList'>
						{props.optionsList.map(name => {
							return name.class !== 'moreInfo' ?
								<li key={name.class + name.title} tabIndex='0' select={props.book.shelf === name.class ? 'true' : 'false'}
									onClick={(e) => props.changeShelf(props.book, name.class, e)}>
									<span className='glyphicon glyphicon-ok'></span>{name.title}
								</li>
								:
								<Link to={`/MyReads/moreinfo/${props.book.id}=${props.book.title}`} onClick={() => props.saveURL(`/MyReads/moreinfo/${props.book.id}=${props.book.title}`)} key={name.class + name.title} tabIndex='0' select={props.book.shelf === name.class ? 'true' : 'false'}>
									<span className='glyphicon glyphicon-ok'></span>{name.title}
								</Link>
						})}
					</ul>
				)}
			</div>
		)
}

/*
* book's info component, responsible for displaying authors and title.
*/
function BookInfo(props) {
	return (
		<div className='bookInfo'>
			<span className='bookTitle'>{props.book.title}</span>
				<ul className='authorsCont'>
					{(() => {
						if (props.book.authors) {
							return props.book.authors.map(author => (
								<li key={author + props.book.title}>
									<span className='authors'>{author}</span>
								</li>
							));
						}
					})()}
				</ul>
		</div>
	)
}

/*
* responsible for displaying the book card
*/
class BookCard extends Component {
	constructor(props) {
		super(props);
		this.cover = {
			currentlyReading: CoverCurrent,
			wantToRead: CoverWant,
			read: CoverRead,
			none: CoverNone,
		}
	}
	render() {
		return (
		<ul className='list' viewtype={this.props.view}>
			{this.props.currentCheck.map(book => (
				<li className='listItem' animation={(() => {
					if (this.props.classNames !== undefined && this.props.classNames.id === book.id) {
						return this.props.classNames.action;
					} else {
						return '';
					}
				})()} key={book.id}>
					<img src={`${this.cover[book.shelf]}`} className='bookCover' alt={`cover of ${book.title} book`}/>
					<div className='imgCont'>
						<BookImage book={book}/>
						<ButtonCont
							book={book}
							expanded={this.props.expanded}
							expand={this.props.expand}
							changeShelf={this.props.changeShelf}
							optionsList={this.props.optionsList}
							saveURL={this.props.saveURL}
						/>
					</div>
					<BookInfo book={book}/>
				</li>
			))}
		</ul>
	)
	}
}

/*
* a tab component displays the tab of the shelf
*/
function Tab(props) {
	return (
		<div key={props.shelf + 'titleBar'} className='titleBar'>
			<span key={props.shelf + 'title'} className='titles'>{props.titles[props.shelf]}</span>
			<div key={props.shelf + 'buttonViewCont'} className='buttonViewCont'>
				<button key={props.shelf + 'listView'} onClick={(e) => props.changeView(e)} className='listView' viewtype={props.shelfState}><span className='glyphicon glyphicon-th-list'></span></button>
				<button key={props.shelf + 'gridView'} onClick={(e) => props.changeView(e)} className='gridView' viewtype={props.shelfState}><span className='glyphicon glyphicon-th-large'></span></button>
			</div>
		</div>
	)
}

/*
* Main component. It is here where the route is redirected. And from this component
* the home page is built.
*/
class Main extends Component {
	constructor(props) {
		super(props);
		/* titles of the shelves */
		this.titles = {
			currentlyReading: 'Currently Reading',
			wantToRead: 'Want To Read',
			read: 'Already Read',
		};
		/* this is used so that naming would be returned based on the book's shelf */
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

	/*
	* changes the view of the shelf based on the clicked button,
	* the view types are: grid and list;
	*/
	changeView(e) {
		const name = e.target.parentNode;
		const stateName = name.parentNode.parentNode.parentNode.className;
		if (name.className === 'gridView') {
			this.setState({
				[stateName]: 'grid',
			});
		} else {
			this.setState({
				[stateName]: 'list',
			});
		}
	}

	render() {
		return (
			<main onClick={() => this.expand(false, false)}>
				<Link to='/search'><button onClick={this.props.defaultUrl} className='addBook'><span className='glyphicon glyphicon-search'></span></button></Link>
				<Link to='/deleted'><button className='deletedBooks'><span className='glyphicon glyphicon-trash'>{this.props.recentlyDeleted.length > 0 && (
					<span className='deletedNum'>{this.props.recentlyDeleted.length}</span>)}</span></button></Link>
					{this.props.shelves.map(shelf => (
						<div key={shelf} className={shelf}>
							<Tab
							shelf={shelf}
							titles={this.titles}
							changeView={(e) => this.changeView(e)}
							shelfState={this.state[shelf]}
							/>
							<BookCard
								key={shelf + 'BookCard'}
								currentCheck={this.props[shelf]}
								expanded={this.state.expanded}
								expand={(id) => this.expand(id)}
								changeShelf={this.props.changeShelf}
								view={this.state[shelf]}
								optionsList={this.optionsList}
								saveURL={this.props.saveURL}
								classNames={this.props.classNames}
							/>
						</div>
					))}
			</main>
		)
	}
}

export {
	BookCard,
	BookInfo,
	BookImage,
}
export default Main