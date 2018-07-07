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
							<li key={name.class + name.title} tabIndex='0'
									onClick={() => props.changeShelf(props.book, name.class)}>
							{(() => {
								if (name.title === 'Expand -->') {
									<Link to='/expand/{props.book.title}'>
									</Link>
								}
							})()}
							<span className='glyphicon glyphicon-ok'></span>{name.title}
							</li>
						))}
					</ul>
				)}
			</div>
		)
}

class Deleted extends Component {
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

	render() {
		return (
			<div>
				<ul className='list'>
					{this.props.recentlyDeleted.map(book => (
						<li className='listItem' key={book.id}>
							<ButtonCont
								key={book.id + book.title}
								book={book}
								expanded={this.state.expanded}
								expand={(id) => this.expand(id)}
								changeShelf={this.props.changeShelf}
								optionsList={this.optionsList}
								ultimateDelete={this.props.ultimateDelete}
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
			</div>
		)
	}
}

export default Deleted