import VoiceComponent from './VoiceComp';
import './UserVideo.css';

function UserVideoComponent(props:any) {

	return (
		<div>
			{
				props.streamManager !== undefined ? (
					<>
						<div className="streamcomponent" 
							style={{
								display:"none",
							}}
						>
							<VoiceComponent streamManager={props.streamManager} />
						</div>
					</>
				) : null
			}
			{JSON.parse(props.streamManager.stream.connection.data).clientData}
		</div>
	);
}



export default UserVideoComponent;