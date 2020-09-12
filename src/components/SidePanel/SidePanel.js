import React from 'react';
import { Menu, Sidebar } from 'semantic-ui-react';

import UserPanel from './UserPanel';
import Channels from './Channels';
import DirectMessages from './DirectMessages';
import Starred from './Starred';

class SidePanel extends React.Component {
	render() {
		const { currentUser, primaryColor } = this.props;

		return (
			<Menu
				size='large'
				inverted
				fixed='left'
				vertical
				style={{ background: primaryColor, fontSize: '1.2rem' }}>
				<UserPanel
					primaryColor={primaryColor}
					currentUser={currentUser}
				/>
				<Starred currentUser={currentUser} />
				<Channels currentUser={currentUser} />
				<DirectMessages currentUser={currentUser} />
			</Menu>
		);
	}
}

class SideBar extends React.Component {
	// state = {};

	// handleSidebarHide = () => this.setState({ sidebarOpened: false });

	// handleToggle = () => this.setState({ sidebarOpened: true });

	render() {
		const {
			currentUser,
			primaryColor,
			sidebarOpened,
			handleSidebarHide,
		} = this.props;
		// const { sidebarOpened } = this.state;

		return (
			<Sidebar
				as={Menu}
				animation='overlay'
				onHide={handleSidebarHide}
				vertical
				visible={sidebarOpened}
				size='huge'
				inverted
				style={{ background: primaryColor, fontSize: '1.5rem' }}>
				<UserPanel
					primaryColor={primaryColor}
					currentUser={currentUser}
				/>
				<Starred currentUser={currentUser} />
				<Channels
					currentUser={currentUser}
					handleSidebarHide={handleSidebarHide}
				/>
				<DirectMessages
					currentUser={currentUser}
					handleSidebarHide={handleSidebarHide}
				/>
			</Sidebar>
		);
	}
}

export { SidePanel, SideBar };
