import VoiceComponent from './VoiceComp';
import style from '@/res/css/module/UserVideo.module.css';

function UserVideoComponent(props:any) {

	return (
		<div>
			{
				props.streamManager !== undefined ? (
					<>
						<div className={style.streamcomponent}>
							<VoiceComponent streamManager={props.streamManager} />
						</div>
					</>
				) : null
			}
			{/* {JSON.parse(props.streamManager.stream.connection.data).clientData.name} */}
		</div>
	);
}



export default UserVideoComponent;