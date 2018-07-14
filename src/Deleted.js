/* Deleted.js */

import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { BookInfo } from './Main'
import { BookImage } from './Main'

/* images */
import CoverNone from './icons/none.jpg'

/*
* button component responsible for displaying the oprions button,
* and displaying the options list.
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
								<Link to={`/MyReads/moreinfo/${props.book.id}=${props.book.title}`}
								onClick={() => props.saveUrl(`/MyReads/moreinfo/${props.book.id}=${props.book.title}`)}
								key={name.class + name.title} tabIndex='0'
								select={props.book.shelf === name.class ? 'true' : 'false'}>
									<span className='glyphicon glyphicon-ok'></span>{name.title}
								</Link>
						})}
					</ul>
				)}
			</div>
		)
}

/*
* Deleted component. It is here where the route is redirected. And from this component
* the delete page is built
*/
class Deleted extends Component {
	constructor(props) {
		super(props);
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
				class: 'deletion',
				title: 'Ultimate Delete',
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
	}

	/* expands the options list when the button is clicked */
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

	render() {
		return (
			<div className='trashBin'>
				<ul className='list' viewtype='grid'>
					{this.props.recentlyDeleted.map(book => (
						<li className='listItem' key={book.id} animation={(() => {
						if (this.props.classNames !== undefined && this.props.classNames.id === book.id) {
							return this.props.classNames.action;
						} else {
							return '';
						}
					})()}>
						<img src={`${CoverNone}`} className='bookCover' alt={`Cover of ${book.title} book`}/>
						<div className='imgCont'>
							<BookImage book={book}/>
							<ButtonCont
								key={book.id + book.title}
								book={book}
								expanded={this.state.expanded}
								expand={(id) => this.expand(id)}
								changeShelf={this.props.changeShelf}
								optionsList={this.optionsList}
								ultimateDelete={this.props.ultimateDelete}
							/>
						</div>
						<BookInfo book={book}/>
						</li>
					))}
				</ul>
			</div>
		)
	}
}

export default Deleted