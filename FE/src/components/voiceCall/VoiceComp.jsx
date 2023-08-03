import React, { Component } from 'react';

export default class VoiceComp extends Component {

	constructor(props) {
		super(props);
		this.videoRef = React.createRef();
	}

	componentDidUpdate(props) {
		if (props && !!this.videoRef) {
			this.props.streamManager.addVideoElement(this.videoRef.current);
		}
	}

	componentDidMount() {
		if (this.props && !!this.videoRef) {
			this.props.streamManager.addVideoElement(this.videoRef.current);
		}
	}

	render() {
		return <video autoPlay={true} ref={this.videoRef} />;
	}
}