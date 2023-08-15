import React, { Component, RefObject } from 'react';

interface Props {
  streamManager: any; // Change 'any' to the appropriate type of 'streamManager'
}

export default class VoiceComp extends Component<Props> {
  private videoRef: RefObject<HTMLVideoElement>;

  constructor(props: Props) {
    super(props);
    this.videoRef = React.createRef<HTMLVideoElement>();
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.streamManager && this.videoRef.current) {
      this.props.streamManager.addVideoElement(this.videoRef.current);
    }
  }

  componentDidMount() {
    if (this.props.streamManager && this.videoRef.current) {
      this.props.streamManager.addVideoElement(this.videoRef.current);
    }
  }

  render() {
    return <video autoPlay={true} ref={this.videoRef} />;
  }
}