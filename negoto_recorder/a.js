const $btnStartToggle = document.getElementById("btnStartToggle")
const $speaking_time = document.getElementById('speaking_time')
const rawAudioBuffer = {}
// const enumStartToggle = ['stopped', 'started']
let statusStartToggle = 'stopped'
let recorder = null
let chunks = []

function onSuccessGetUserMedia (stream) {
    const audioCtx = new AudioContext()
    const source = audioCtx.createMediaStreamSource(stream)
    const analyser = audioCtx.createAnalyser()
    const dataArray = new Uint8Array(analyser.fftSize)
    source.connect(analyser)

    recorder = new MediaRecorder(stream)
    recorder.addEventListener('dataavailable', (e)=>{
        if(e.data.size > 0) chunks.push(e.data)
    })
    recorder.addEventListener('stop', (e)=>{
        const $audio = document.getElementById('audio')
        const $download = document.getElementById('download')
        const data = new Blob(chunks);
        audio.src = URL.createObjectURL(data)
        $download.href = URL.createObjectURL(data)
        const now = new Date()
        const now_timestamp = ``
        $download.download = `negoto_${~~(new Date() /1000)}.webm`
        //audio.play()
    })
    let silent_cnt = 0
    setInterval(()=>{
        analyser.getByteTimeDomainData(dataArray)
        const volume =  Math.max(...dataArray) - 128
        if (volume > 1 && recorder.state === 'paused') {
            recorder.resume()
            console.log('start')
            let $li = document.createElement('li')
            $li.innerHTML = `${(new Date()).toLocaleString()}`
            $speaking_time.appendChild($li)
            silent_cnt = 0
        } else if (volume <= 0 && recorder.state === 'recording') {
            silent_cnt++
            if(silent_cnt >= 10){
                silent_cnt = 0
                recorder.pause()
                console.log('pause')
            }
        }
    }, 100)
}

navigator.mediaDevices.getUserMedia({ audio: true, video: false}).then(onSuccessGetUserMedia)

function startRecording() {
    statusStartToggle = 'started'
    $btnStartToggle.value = '録音を終了して保存'
    chunks = []
    $speaking_time.innerHTML = ''

    recorder.start()
    recorder.pause()
};

function stopRecording() {
    statusStartToggle = 'stopped'
    $btnStartToggle.value = 'リセットして録音を始める'
    recorder.stop()
}

$btnStartToggle.addEventListener("click", () =>{
    if (statusStartToggle === 'stopped') {
        startRecording()
    } else {
        stopRecording()
    }

    
})