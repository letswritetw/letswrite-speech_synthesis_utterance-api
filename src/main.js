const dictionary = ['覿氅','餮鼗','曩磲','蕤顬','鰨鶘','鰷鯔','耱貊','貘鍪','籴耋','瓞耵'];

new Vue({
	el: '#app',
	data: {
    speaker: null,
    voices: [], // 所有語音列表
    voice: '請選擇語音', // 選擇的語音
		dictionary: dictionary,
    textarea: '',
    speed: 1, // 速度，幾倍
    pitch: 1, // 聲調
    volume: 0.5 // 音量
	},
	methods: {
    // 講話
		sound(word) {
      let msg = new SpeechSynthesisUtterance(word);
      
      // 確認voice
      Array.prototype.forEach.call(this.voices, v => {
        if(v.name === this.voice) {
          return msg.voice = v;
        }
      });
      
      msg.rate = this.speed; // 確認速度
      msg.pitch = this.pitch; // 確認音調
      msg.volume = this.volume; // 確認音量

      this.speaker.speak(msg); // 開始講
    }
  },
  created() {
    this.speaker = window.speechSynthesis;
  },
	mounted() {
    const _this = this;
    var items = [
      {
        name: '字數統計',
        url: 'https://auguston.github.io/text-counter/'
      },
      {
        name: '瀏覽器說話',
        url: 'https://auguston.github.io/medium-speech_synthesis_utterance-api/'
      }
    ];
    var ul = '<ul class="js-append-links" style="display: flex; justify-content: center; list-style: none;"></ul>';
    var body = document.querySelector('body');
    body.insertAdjacentHTML('beforeend', ul);
    var jsUl = document.querySelector('.js-append-links');
    Array.prototype.forEach.call(items, item => {
      var li = '<li><a href="' + item.url + '" target="_blank" style="display: block; padding-right: 8px; padding: 8px; font-size: 14px; color: #424242;">' + item.name + '</a></li>'
      jsUl.insertAdjacentHTML('beforeend', li);
    });
    // 載入 window.speechSynthesis.getVoices() 的問題參考：
    // https://stackoverflow.com/questions/49506716/speechsynthesis-getvoices-returns-empty-array-on-windows
    function setVoices() {
      return new Promise((resolve, reject) => {
        let timer;
        timer = setInterval(() => {
          if(_this.speaker.getVoices().length !== 0) {
            resolve(_this.speaker.getVoices());
            clearInterval(timer);
          }
        }, 10);
      })
    }
    setVoices().then(voices => {
      // 濾掉是 Google 語音的部份
      this.voices = voices.filter(v => v.name.indexOf('Google') === -1);
    });
    
    // 速度調整
		const speedSlider = noUiSlider.create(this.$refs.speed, {
			start: 1,
			connect: [true, false],
			range: {
				min: 0.1,
				max: 2
			},
      step: 0.1
    });
    speedSlider.on('slide', e => this.speed = Number(e[0]));

    // 聲調調整
    const pitchSlider = noUiSlider.create(this.$refs.pitch, {
			start: 1,
			connect: [true, false],
			range: {
				min: 0,
				max: 2
			},
      step: 0.1
    });
    pitchSlider.on('slide', e => this.pitch = Number(e[0]));

    // 音量調整
    const volumeSlider = noUiSlider.create(this.$refs.volume, {
			start: 0.5,
			connect: [true, false],
			range: {
				min: 0.1,
				max: 1
			},
      step: 0.1
    });
    volumeSlider.on('slide', e => this.volume = Number(e[0]));

    
	}
});