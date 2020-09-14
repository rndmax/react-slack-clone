import React, { Component } from 'react';

class Notifications extends Component {
	constructor() {
		super();
		this.showNotification = this.showNotification.bind(this);
	}

	componentDidMount() {
		console.log('good notif1!');
		if (!('Notification' in window)) {
			console.log('This browser does not support desktop notification');
		} else {
			console.log('good notif!');
			Notification.requestPermission();
		}
	}

	showNotification() {
		new Notification('Hey');
	}

	render() {
		return (
			<div>
				<button onClick={this.showNotification}>
					Click to show notification
				</button>
			</div>
		);
	}
}

export default Notifications;
