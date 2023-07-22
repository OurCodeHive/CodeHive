import React, { Component } from 'react';
import VoiceComponent from './VoiceComp';
import './UserVideo.css';

export default class UserVideoComponent extends Component {

	getNicknameTag() {VoiceComponent
		// Gets the nickName of the user
		return JSON.parse(this.props.streamManager.stream.connection.data).clientData;
	}

	render() {
		return (
			<div>
				{
					this.props.streamManager !== undefined ? (
						<>
							<div className="streamcomponent" 
								style={{
									display:"none",
								}}
							>
								<VoiceComponent streamManager={this.props.streamManager} />
							</div>
							<div>{this.getNicknameTag()}</div>
						</>
					) : null
				}
			</div>
		);
	}
}
