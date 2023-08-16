			// RTCPeerConnection init()
			let pc = new RTCPeerConnection({
				iceServers: [
					{
						urls: 'stun:stun.l.google.com:19302'
					}
				]
			})

			// MediaStream init()
			let stream = new MediaStream();

			// log init()
			let log = msg => {
				document.getElementById('div').innerHTML += msg + '<br>';
			}




			// 1. set Channel && setInterval ping(1s)
			sendChannel = pc.createDataChannel('foo');
			sendChannel.onclose = () => console.log('sendChannel has closed');
			sendChannel.onopen = () => {
				console.log('sendChannel has opened');
				sendChannel.send('ping');
				setInterval(() => {
					console.log('ping');
					sendChannel.send('ping');
				}, 1000)
			}
			sendChannel.onmessage = e => log(`Message from DataChannel '${sendChannel.label}' payload '${e.data}'`);


			// 2. Offer to receive 1 video track
			pc.addTransceiver('video', {'direction': 'recvonly'});
			pc.createOffer().then(d => pc.setLocalDescription(d)).catch(log);


			// 3. 서버에서 video 가져오기
			pc.oniceconnectionstatechange = e => log(pc.iceConnectionState)
			pc.onicecandidate = event => {
				if (event.candidate === null) {
					console.log(pc);
					console.log(pc.localDescription.sdp);
					$.post("http://localhost:8888/stream/receiver/H264_PCMALAW", {
						suuid: "H264_PCMALAW",
						data: btoa(pc.localDescription.sdp)
					}, function(data) {
						console.log(atob(data));
						try {
							pc.setRemoteDescription(new RTCSessionDescription({
								type: 'answer',
								sdp: atob(data)
							}))
							console.log(pc);
						} catch (e) {
							console.warn(e);
						}
					});
				}
			}


			// 4.video 재생
			pc.ontrack = function (event) {
				console.log('ontrack');
				console.log(event);
				stream.addTrack(event.track);
				document.getElementById('videoElem').srcObject = stream;
			}