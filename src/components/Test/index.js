/* eslint-disable max-classes-per-file */
/* eslint-disable react/no-multi-comp */

import { createMedia } from '@artsy/fresnel';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
	Button,
	Container,
	Grid,
	Header,
	Icon,
	Menu,
	Segment,
	Sidebar,
	Visibility,
} from 'semantic-ui-react';
import { connect } from 'react-redux';

import { SidePanel, SideBar } from '../SidePanel/SidePanel';
import Messages from '../Messages/Messages';
import MetaPanel from '../MetaPanel/MetaPanel';

const { MediaContextProvider, Media } = createMedia({
	breakpoints: {
		mobile: 0,
		tablet: 768,
		computer: 1024,
	},
});

/* Heads up!
 * HomepageHeading uses inline styling, however it's not the best practice. Use CSS or styled
 * components for such things.
 */
const HomepageHeading = ({ mobile }) => (
	<Container text>
		<Header
			as='h1'
			content='Imagine-a-Company'
			inverted
			style={{
				fontSize: mobile ? '2em' : '4em',
				fontWeight: 'normal',
				marginBottom: 0,
				marginTop: mobile ? '1.5em' : '3em',
			}}
		/>
		<Header
			as='h2'
			content='Do whatever you want when you want to.'
			inverted
			style={{
				fontSize: mobile ? '1.5em' : '1.7em',
				fontWeight: 'normal',
				marginTop: mobile ? '0.5em' : '1.5em',
			}}
		/>
		<Button primary size='huge'>
			Get Started
			<Icon name='right arrow' />
		</Button>
	</Container>
);

HomepageHeading.propTypes = {
	mobile: PropTypes.bool,
};

/* Heads up!
 * Neither Semantic UI nor Semantic UI React offer a responsive navbar, however, it can be implemented easily.
 * It can be more complicated, but you can create really flexible markup.
 */
class DesktopContainer extends Component {
	state = {};

	hideFixedMenu = () => this.setState({ fixed: false });
	showFixedMenu = () => this.setState({ fixed: true });

	render() {
		const { children, currentUser, primaryColor } = this.props;
		return (
			<Media greaterThan='mobile'>
				<Visibility once={false}>
					<SidePanel
						key={currentUser && currentUser.uid}
						currentUser={currentUser}
						primaryColor={primaryColor}
					/>
				</Visibility>
				{children}
			</Media>
		);
	}
}

DesktopContainer.propTypes = {
	children: PropTypes.node,
};

class MobileContainer extends Component {
	state = {};

	handleSidebarHide = () => this.setState({ sidebarOpened: false });

	handleToggle = () => this.setState({ sidebarOpened: true });

	render() {
		const { children, currentUser, primaryColor } = this.props;
		const { sidebarOpened } = this.state;

		return (
			<Media as={Sidebar.Pushable} at='mobile'>
				<Sidebar.Pushable>
					{/* meeee */}
					<SideBar
						key={currentUser && currentUser.uid}
						currentUser={currentUser}
						primaryColor={primaryColor}
						sidebarOpened={sidebarOpened}
						handleSidebarHide={this.handleSidebarHide}
					/>

					<Sidebar.Pusher dimmed={sidebarOpened}>
						<Segment
							inverted
							textAlign='center'
							// style={{ padding: '1em 0em' }}
							vertical>
							<Container>
								<Menu
									inverted
									pointing
									size='large'
									fixed='top'
									style={{ padding: '0' }}>
									<Menu.Item onClick={this.handleToggle}>
										<Icon name='sidebar' />
									</Menu.Item>
									{/* <Menu.Item position='right'>
										<Button as='a' inverted>
											Log in
										</Button>
										<Button
											as='a'
											inverted
											style={{ marginLeft: '0.5em' }}>
											Sign Up
										</Button>
									</Menu.Item> */}
								</Menu>
							</Container>
							{/* <HomepageHeading mobile /> */}
						</Segment>

						{children}
					</Sidebar.Pusher>
				</Sidebar.Pushable>
			</Media>
		);
	}
}

MobileContainer.propTypes = {
	children: PropTypes.node,
};

const ResponsiveContainer = ({ children, currentUser, primaryColor }) => (
	/* Heads up!
	 * For large applications it may not be best option to put all page into these containers at
	 * they will be rendered twice for SSR.
	 */
	<MediaContextProvider>
		<DesktopContainer
			key={currentUser && currentUser.uid}
			currentUser={currentUser}
			primaryColor={primaryColor}>
			{children}
		</DesktopContainer>
		<MobileContainer currentUser={currentUser} primaryColor={primaryColor}>
			{children}
		</MobileContainer>
	</MediaContextProvider>
);

ResponsiveContainer.propTypes = {
	children: PropTypes.node,
};

const Test = ({
	currentUser,
	currentChannel,
	isPrivateChannel,
	userPosts,
	primaryColor,
	secondaryColor,
}) => (
	<ResponsiveContainer currentUser={currentUser} primaryColor={primaryColor}>
		<Segment vertical>
			{/* meeeee */}
			<Grid
				columns='equal'
				className='app'
				style={{ background: secondaryColor }}>
				{/* <ColorPanel
					key={currentUser && currentUser.name}
					currentUser={currentUser}
				/> */}
				{/* <SidePanel
					key={currentUser && currentUser.uid}
					currentUser={currentUser}
					primaryColor={primaryColor}
				/> */}

				<Grid.Column className='side-menu-indent'>
					<Messages
						key={currentChannel && currentChannel.id}
						currentChannel={currentChannel}
						currentUser={currentUser}
						isPrivateChannel={isPrivateChannel}
					/>
				</Grid.Column>

				<Grid.Column width={4} only='computer'>
					<MetaPanel
						key={currentChannel && currentChannel.name}
						userPosts={userPosts}
						currentChannel={currentChannel}
						isPrivateChannel={isPrivateChannel}
					/>
				</Grid.Column>
			</Grid>

			{/* <Grid container stackable verticalAlign='middle'>
				<Grid.Row>
					<Grid.Column width={8}>
						<Header as='h3' style={{ fontSize: '2em' }}>
							We Help Companies and Companions
						</Header>
						<p style={{ fontSize: '1.33em' }}>
							We can give your company superpowers to do things
							that they never thought possible. Let us delight
							your customers and empower your needs... through
							pure data analytics.
						</p>
						<Header as='h3' style={{ fontSize: '2em' }}>
							We Make Bananas That Can Dance
						</Header>
						<p style={{ fontSize: '1.33em' }}>
							Yes that's right, you thought it was the stuff of
							dreams, but even bananas can be bioengineered.
						</p>
					</Grid.Column>
					<Grid.Column floated='right' width={6}>
						<Image
							bordered
							rounded
							size='large'
							src='/images/wireframe/white-image.png'
						/>
					</Grid.Column>
				</Grid.Row>
				<Grid.Row>
					<Grid.Column textAlign='center'>
						<Button size='huge'>Check Them Out</Button>
					</Grid.Column>
				</Grid.Row>
			</Grid> */}
		</Segment>

		{/* <Segment style={{ padding: '0em' }} vertical>
			<Grid celled='internally' columns='equal' stackable>
				<Grid.Row textAlign='center'>
					<Grid.Column
						style={{ paddingBottom: '5em', paddingTop: '5em' }}>
						<Header as='h3' style={{ fontSize: '2em' }}>
							"What a Company"
						</Header>
						<p style={{ fontSize: '1.33em' }}>
							That is what they all say about us
						</p>
					</Grid.Column>
					<Grid.Column
						style={{ paddingBottom: '5em', paddingTop: '5em' }}>
						<Header as='h3' style={{ fontSize: '2em' }}>
							"I shouldn't have gone with their competitor."
						</Header>
						<p style={{ fontSize: '1.33em' }}>
							<Image avatar src='/images/avatar/large/nan.jpg' />
							<b>Nan</b> Chief Fun Officer Acme Toys
						</p>
					</Grid.Column>
				</Grid.Row>
			</Grid>
		</Segment>

		<Segment style={{ padding: '8em 0em' }} vertical>
			<Container text>
				<Header as='h3' style={{ fontSize: '2em' }}>
					Breaking The Grid, Grabs Your Attention
				</Header>
				<p style={{ fontSize: '1.33em' }}>
					Instead of focusing on content creation and hard work, we
					have learned how to master the art of doing nothing by
					providing massive amounts of whitespace and generic content
					that can seem massive, monolithic and worth your attention.
				</p>
				<Button as='a' size='large'>
					Read More
				</Button>

				<Divider
					as='h4'
					className='header'
					horizontal
					style={{ margin: '3em 0em', textTransform: 'uppercase' }}>
					<a href='#'>Case Studies</a>
				</Divider>

				<Header as='h3' style={{ fontSize: '2em' }}>
					Did We Tell You About Our Bananas?
				</Header>
				<p style={{ fontSize: '1.33em' }}>
					Yes I know you probably disregarded the earlier boasts as
					non-sequitur filler content, but it's really true. It took
					years of gene splicing and combinatory DNA research, but our
					bananas can really dance.
				</p>
				<Button as='a' size='large'>
					I'm Still Quite Interested
				</Button>
			</Container>
		</Segment>

		<Segment inverted vertical style={{ padding: '5em 0em' }}>
			<Container>
				<Grid divided inverted stackable>
					<Grid.Row>
						<Grid.Column width={3}>
							<Header inverted as='h4' content='About' />
							<List link inverted>
								<List.Item as='a'>Sitemap</List.Item>
								<List.Item as='a'>Contact Us</List.Item>
								<List.Item as='a'>
									Religious Ceremonies
								</List.Item>
								<List.Item as='a'>Gazebo Plans</List.Item>
							</List>
						</Grid.Column>
						<Grid.Column width={3}>
							<Header inverted as='h4' content='Services' />
							<List link inverted>
								<List.Item as='a'>Banana Pre-Order</List.Item>
								<List.Item as='a'>DNA FAQ</List.Item>
								<List.Item as='a'>How To Access</List.Item>
								<List.Item as='a'>Favorite X-Men</List.Item>
							</List>
						</Grid.Column>
						<Grid.Column width={7}>
							<Header as='h4' inverted>
								Footer Header
							</Header>
							<p>
								Extra space for a call to action inside the
								footer that could help re-engage users.
							</p>
						</Grid.Column>
					</Grid.Row>
				</Grid>
			</Container>
		</Segment> */}
	</ResponsiveContainer>
);

const mapStateToProps = (state) => ({
	currentUser: state.user.currentUser,
	currentChannel: state.channel.currentChannel,
	isPrivateChannel: state.channel.isPrivateChannel,
	userPosts: state.channel.userPosts,
	primaryColor: state.colors.primaryColor,
	secondaryColor: state.colors.secondaryColor,
});

export default connect(mapStateToProps)(Test);
