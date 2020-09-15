import React from 'react';
import firebase from '../../firebase';
import { connect } from 'react-redux';
import { setCurrentChannel, setPrivateChannel } from '../../actions';
import { Menu, Icon, Label } from 'semantic-ui-react';
import Notifications from '../Test/Notifications';

class DirectMessages extends React.Component {
	state = {
		activeChannel: '',
		privateMessages: [],
		channel: null,
		user: this.props.currentUser,
		users: [],
		usersRef: firebase.database().ref('users'),
		connectedRef: firebase.database().ref('.info/connected'),
		privateMessagesRef: firebase.database().ref('privateMessages'),
		presenceRef: firebase.database().ref('presence'),
		notifications: [],
	};

	componentDidMount() {
		if (this.state.user) {
			this.addListeners(this.state.user.uid);
		}
	}

	componentWillUnmount() {
		this.removeListeners();
	}

	removeListeners = () => {
		this.state.usersRef.off();
		this.state.presenceRef.off();
		this.state.connectedRef.off();
		this.state.privateMessagesRef.off();
		this.state.privateMessages.length > 0 &&
			this.removePrivareMessagesListeners();
	};

	removePrivareMessagesListeners() {
		this.state.privateMessages.forEach((u) => {
			u.forEach((uTo) => {
				this.state.privateMessagesRef.child(`${u}/${uTo}`).off();
			});
		});
	}

	addListeners = (currentUserUid) => {
		let loadedUsers = [];
		this.state.usersRef.on('child_added', (snap) => {
			if (currentUserUid !== snap.key) {
				let user = snap.val();
				user['uid'] = snap.key;
				user['status'] = 'offline';
				loadedUsers.push(user);
				this.setState({ users: loadedUsers });
			}
		});

		this.state.connectedRef.on('value', (snap) => {
			if (snap.val() === true) {
				const ref = this.state.presenceRef.child(currentUserUid);
				ref.set(true);
				ref.onDisconnect().remove((err) => {
					if (err !== null) {
						console.error(err);
					}
				});
			}
		});

		this.state.presenceRef.on('child_added', (snap) => {
			if (currentUserUid !== snap.key) {
				this.addStatusToUser(snap.key);
			}
		});

		this.state.presenceRef.on('child_removed', (snap) => {
			if (currentUserUid !== snap.key) {
				this.addStatusToUser(snap.key, false);
			}
		});

		let loadedPrivateMessage = [];
		this.state.privateMessagesRef.on('child_added', (snap) => {
			loadedPrivateMessage.push(snap.val());
			this.setState({ privateMessages: loadedPrivateMessage }, () =>
				this.setChannel(loadedPrivateMessage[0])
			);
			const usersToMessages = snap.val();
			for (const userFromUserTomessages in usersToMessages) {
				if (usersToMessages.hasOwnProperty(userFromUserTomessages)) {
					this.addNotificationListener(
						`${snap.key}/${userFromUserTomessages}`,
						snap
					);
				}
			}
		});
	};

	addNotificationListener = (messagesChannelId) => {
		this.state.privateMessagesRef
			.child(messagesChannelId)
			.on('value', (snap) => {
				if (this.state.channel) {
					this.handleNotifications(
						messagesChannelId,
						this.state.channel.id,
						this.state.notifications,
						snap
					);
				}
			});
	};

	handleNotifications = (
		messagesChannelId,
		currentChannelId,
		notifications,
		snap
	) => {
		let lastTotal = 0;

		let index = notifications.findIndex(
			(notification) => notification.id === messagesChannelId
		);

		if (index !== -1) {
			if (messagesChannelId !== currentChannelId) {
				lastTotal = notifications[index].total;
				if (snap.numChildren() - lastTotal > 0) {
					notifications[index].count = snap.numChildren() - lastTotal;
					const n = new Notifications();
					n.showNotification();
				}
			}
			notifications[index].lastKnownTotal = snap.numChildren();
		} else {
			notifications.push({
				id: this.getChannelId(snap.key),
				total: snap.numChildren(),
				lastKnownTotal: snap.numChildren(),
				count: 0,
			});
		}

		this.setState({ notifications });
	};

	clearNotifications = () => {
		let index = this.state.notifications.findIndex(
			(notification) => notification.id === this.state.channel.id
		);

		if (index !== -1) {
			let updatedNotifications = [...this.state.notifications];
			updatedNotifications[index].total = this.state.notifications[
				index
			].lastKnownTotal;
			updatedNotifications[index].count = 0;
			this.setState({ notifications: updatedNotifications });
		}
	};

	addStatusToUser = (userId, connected = true) => {
		const updatedUsers = this.state.users.reduce((acc, user) => {
			if (user.uid === userId) {
				user['status'] = `${connected ? 'online' : 'offline'}`;
			}
			return acc.concat(user);
		}, []);
		this.setState({ users: updatedUsers });
	};

	isUserOnline = (user) => user.status === 'online';

	changeChannel = (user) => {
		const channelId = this.getChannelId(user.uid);
		const channelData = {
			id: channelId,
			name: user.name,
		};
		this.clearNotifications();
		this.props.setCurrentChannel(channelData);
		this.props.setPrivateChannel(true);
		this.setActiveChannel(user.uid);
		/* this.setState((state) => {
			// Important: read `state` instead of `this.state` when updating.
			return { channel: channelData };
		}); */
		this.setChannel(channelData);
		this.props.handleSidebarHide && this.props.handleSidebarHide();
	};

	getChannelId = (userId) => {
		const currentUserId = this.state.user.uid;
		return userId < currentUserId
			? `${userId}/${currentUserId}`
			: `${currentUserId}/${userId}`;
	};

	setActiveChannel = (userId) => {
		this.setState({ activeChannel: userId });
	};

	setChannel(channel) {
		this.setState({ channel });
	}

	getNotificationCount = (user) => {
		let count = 0;
		this.state.notifications.forEach((notification) => {
			if (notification.id.includes(user.uid)) {
				count = notification.count;
			}
		});
		if (count > 0) return count;
	};

	render() {
		const { users, activeChannel } = this.state;

		return (
			<Menu.Menu className='menu'>
				<Menu.Item>
					<span>
						<Icon name='mail' /> DIRECT MESSAGES
					</span>{' '}
					({users.length})
				</Menu.Item>
				{users.map((user) => (
					<Menu.Item
						key={user.uid}
						active={user.uid === activeChannel}
						onClick={() => this.changeChannel(user)}
						style={{ opacity: 0.7, fontStyle: 'italic' }}>
						{this.getNotificationCount(user) && (
							<Label color='red'>
								{this.getNotificationCount(user)}
							</Label>
						)}
						<Icon
							name='circle'
							size='small'
							color={this.isUserOnline(user) ? 'green' : 'red'}
						/>
						@ {user.name}
					</Menu.Item>
				))}
			</Menu.Menu>
		);
	}
}

export default connect(null, { setCurrentChannel, setPrivateChannel })(
	DirectMessages
);
