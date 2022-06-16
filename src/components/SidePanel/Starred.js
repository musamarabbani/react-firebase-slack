import React from 'react';
import { Menu, Icon } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { setCurrentChannel, setPrivateChannel } from '../../redux/actions';

class Starred extends React.Component {
  state = {
    activeChannel: '',
    starredChannels: []
  };

  changeChannel = (channel) => {
    this.setActiveChannel(channel);
    this.props.setCurrentChannel(channel);
    this.props.setPrivateChannel(false);
    this.setState({ channel });
  };

  displayChannel = (starredChannel) =>
    starredChannel.length > 0 &&
    starredChannel.map((channel) => (
      <Menu.Item
        key={channel.id}
        style={{ opacity: 0.7 }}
        active={this.state.activeChannel.id === channel.id}
        name={channel.name}
        onClick={() => {
          this.changeChannel(channel);
        }}
      >
        #{channel.name}
      </Menu.Item>
    ));

  render() {
    const { starredChannels } = this.state;
    return (
      <Menu.Menu className="menu">
        <Menu.Item>
          <span>
            <Icon name="star" />
            STARRED
          </span>
          ({starredChannels.length})
        </Menu.Item>
        {this.displayChannel(starredChannels)}
      </Menu.Menu>
    );
  }
}

export default connect(null, { setCurrentChannel, setPrivateChannel })(Starred);
