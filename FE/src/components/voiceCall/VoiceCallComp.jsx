import { OpenVidu } from 'openvidu-browser';
import axios from 'axios';
import { Component } from 'react';
import UserVideoComponent from './UserVideoComponent';
import JoinUser from './JoinUserListComp';

// APPLICATION_SERVER_URL을 상수로 정의하고 타입을 명시합니다.
const APPLICATION_SERVER_URL = import.meta.env.VITE_RTC;

class VoiceCallComp extends Component {
  constructor(props) {
    super(props);

    // state를 초기화합니다.
    this.state = {
      mySessionId: this.props.mySessionId,
      myUserName: this.props.myUserName,
      session: undefined,
      mainStreamManager: undefined,  // Main video of the page. Will be the 'publisher' or one of the 'subscribers'
      publisher: undefined,
      subscribers: [],
    };

    // 이후 메서드에서 this 바인딩이 필요한 경우 바인딩을 해줍니다.
    this.joinSession = this.joinSession.bind(this);
    this.leaveSession = this.leaveSession.bind(this);
    this.switchCamera = this.switchCamera.bind(this);
    this.handleChangeSessionId = this.handleChangeSessionId.bind(this);
    this.handleChangeUserName = this.handleChangeUserName.bind(this);
    this.handleMainVideoStream = this.handleMainVideoStream.bind(this);
    this.onbeforeunload = this.onbeforeunload.bind(this);

  }

  componentDidMount() {
    this.joinSession();
    window.addEventListener('beforeunload', this.onbeforeunload);
  }

  componentWillUnmount() {
    window.removeEventListener('beforeunload', this.onbeforeunload);
  }

  onbeforeunload(event) {
    this.leaveSession();
  }

  handleChangeSessionId(e) {
    this.setState({
      mySessionId: e.target.value,
    });
  }

  handleChangeUserName(e) {
    this.setState({
      myUserName: e.target.value,
    });
  }

  handleMainVideoStream(stream) {
    if (this.state.mainStreamManager !== stream) {
      this.setState({
        mainStreamManager: stream
      });
    }
  }

  deleteSubscriber(streamManager) {
    let subscribers = this.state.subscribers;
    let index = subscribers.indexOf(streamManager, 0);
    if (index > -1) {
      subscribers.splice(index, 1);
      this.setState({
        subscribers: subscribers,
      });
    }
  }

  joinSession() {
    // --- 1) Get an OpenVidu object ---

    this.OV = new OpenVidu();

    // --- 2) Init a session ---

    this.setState(
      {
        session: this.OV.initSession(),
      },
      () => {
        var mySession = this.state.session;

        // --- 3) Specify the actions when events take place in the session ---

        // 새로운 스트림을 받을 때...
        mySession.on('streamCreated', (event) => {
          // 스트림을 구독합니다. 두 번째 매개변수는 스트림에 대한 HTML 비디오를 생성하지 않도록 undefined로 설정합니다.
          var subscriber = mySession.subscribe(event.stream, undefined);
          var subscribers = this.state.subscribers;
          subscribers.push(subscriber);

          // 새로운 구독자(subscriber) 목록을 state에 업데이트합니다.
          this.setState({
            subscribers: subscribers,
          });
        });

        // 스트림이 종료될 때...
        mySession.on('streamDestroyed', (event) => {

          // 스트림을 구독자(subscriber) 목록에서 삭제합니다.
          this.deleteSubscriber(event.stream.streamManager);
        });

        // 비동기 예외가 발생할 때...
        mySession.on('exception', (exception) => {
          console.warn(exception);
        });

        // --- 4) 유효한 사용자 토큰을 이용해 세션에 연결합니다. ---

        // OpenVidu 배포로부터 토큰을 얻어옵니다.
        this.getToken().then((token) => {
          // 첫 번째 매개변수는 OpenVidu 배포로부터 얻은 토큰이며, 두 번째 매개변수는 'streamCreated' 이벤트에서
          // 각 사용자의 클라이언트 데이터로 사용됩니다. DOM에 사용자의 닉네임으로 추가됩니다.
          mySession.connect(token, { clientData: this.state.myUserName })
          .then(async () => {

            // --- 5) 자신의 카메라 스트림을 얻습니다. ---
            // targetElement를 undefined로 설정하여 OpenVidu가 비디오 엘리먼트를 생성하지 않도록 합니다.
            // 대신 사용자가 직접 관리합니다.
            let publisher = await this.OV.initPublisherAsync(undefined, {
              audioSource: undefined, // 오디오의 소스. undefined인 경우 기본 마이크를 사용합니다.
              videoSource: undefined, // 비디오의 소스. undefined인 경우 기본 웹캠을 사용합니다.
              publishAudio: true, // 오디오를 켜거나 끌 수 있습니다.
              publishVideo: false, // 비디오를 켜거나 끌 수 있습니다.
              resolution: '640x480', // 비디오의 해상도
              frameRate: 30, // 비디오의 프레임 레이트
              insertMode: 'APPEND', // 비디오를 'video-container' 내부에 추가하는 방법을 설정합니다.
              mirror: false, // 로컬 비디오를 거울 모드로 설정합니다.
            });

            // --- 6) 자신의 스트림을 발행합니다. ---
            mySession.publish(publisher);

            // 현재 사용 중인 비디오 디바이스를 얻어옵니다.
            var devices = await this.OV.getDevices();
            var videoDevices = devices.filter(device => device.kind === 'videoinput');
            var currentVideoDeviceId = publisher.stream.getMediaStream().getVideoTracks()[0].getSettings().deviceId;
            var currentVideoDevice = videoDevices.find(device => device.deviceId === currentVideoDeviceId);

            // 메인 비디오를 웹캠으로 설정하고 Publisher를 state에 저장합니다.
            this.setState({
              currentVideoDevice: currentVideoDevice,
              mainStreamManager: publisher,
              publisher: publisher,
            });
          })
          .catch((error) => {
            console.log('세션에 연결하는 중 오류가 발생했습니다:', error.code, error.message);
          });
        });
      },
    );
  }

  leaveSession() {

    // --- 7) Leave the session by calling 'disconnect' method over the Session object ---

    const mySession = this.state.session;

    if (mySession) {
      mySession.disconnect();
    }

    // Empty all properties...
    this.OV = null;
    this.setState({
      session: undefined,
      subscribers: [],
      mySessionId: this.props.mySessionId,
      myUserName: this.props.myUserName,
      mainStreamManager: undefined,
      publisher: undefined
    });
  }

  async switchCamera() {
    try {
      const devices = await this.OV.getDevices()
      var videoDevices = devices.filter(device => device.kind === 'videoinput');

      if (videoDevices && videoDevices.length > 1) {

        var newVideoDevice = videoDevices.filter(device => device.deviceId !== this.state.currentVideoDevice.deviceId)

        if (newVideoDevice.length > 0) {
          // Creating a new publisher with specific videoSource
          // In mobile devices the default and first camera is the front one
          var newPublisher = this.OV.initPublisher(undefined, {
            videoSource: newVideoDevice[0].deviceId,
            publishAudio: true,
            publishVideo: false,
            mirror: true
          });

          //newPublisher.once("accessAllowed", () => {
          await this.state.session.unpublish(this.state.mainStreamManager)
          await this.state.session.publish(newPublisher)
          this.setState({
            currentVideoDevice: newVideoDevice[0],
            mainStreamManager: newPublisher,
            publisher: newPublisher,
          });
        }
      }
    } catch (e) {
      console.error(e);
    }
  }

  render() {
   
    let list = [];

    const subscribers = this.state.subscribers;
    const pub = this.state.publisher;
    if (pub === undefined) {
    } else {
      list.push(JSON.parse(pub.stream.connection.data).clientData + " 방장");
    }
    if (subscribers === undefined) {
    } else {
      for (let sub of subscribers) {
        list.push(JSON.parse(sub.stream.connection.data).clientData + " 구독자");
      }
    }
    return (
      <>
        <JoinUser user={list}/> 
        <div style={{
          display:"none"
        }}>
          {this.state.session !== undefined ? (
            <div>
              {this.state.mainStreamManager !== undefined ? (
                <div>
                  <UserVideoComponent streamManager={this.state.mainStreamManager} />
                </div>
              ) : null}
              <div>
                {this.state.publisher !== undefined ? (
                  // null
                  <div className="stream-container col-md-6 col-xs-6" onClick={() => this.handleMainVideoStream(this.state.publisher)}>
                    <UserVideoComponent
                      streamManager={this.state.publisher} />
                  </div>
                ) : null}
                {this.state.subscribers.map((sub, i) => (
                  <div key={i} className="stream-container col-md-6 col-xs-6" onClick={() => this.handleMainVideoStream(sub)}>
                    <UserVideoComponent streamManager={sub} />
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </>
    );
  }

  async getToken() {
    const sessionId = await this.createSession(this.state.mySessionId);
    return await this.createToken(sessionId);
  }

  async createSession(sessionId) {
    const response = await axios.post(APPLICATION_SERVER_URL + 'api/sessions', { customSessionId: sessionId }, {
      headers: { 'Content-Type': 'application/json', },
    });
    return response.data; // The sessionId
  }

  async createToken(sessionId) {
    const response = await axios.post(APPLICATION_SERVER_URL + 'api/sessions/' + sessionId + '/connections', {}, {
      headers: { 'Content-Type': 'application/json', },
    });
    return response.data; // The token
  }
}


export default VoiceCallComp;