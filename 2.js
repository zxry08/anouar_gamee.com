// script.js — quiz logic, bilingual, levels, timer, audio (WebAudio)
(() => {
  // --- Data: 3 levels, 10 Qs each (both ar & en) ---
  const QUESTIONS = {
    easy: [
      // structure: {cat, ar:{q,opts,ans}, en:{...}}
      {cat:'culture', ar:{q:'ما هي لغة البرازيل الرسمية؟', opts:['البرتغالية','الإسبانية','الإنجليزية','الفرنسية'], ans:'البرتغالية'}, en:{q:'What is the official language of Brazil?', opts:['Portuguese','Spanish','English','French'], ans:'Portuguese'}},
      {cat:'general', ar:{q:'كم يوم في الأسبوع؟', opts:['5','6','7','8'], ans:'7'}, en:{q:'How many days in a week?', opts:['5','6','7','8'], ans:'7'}},
      {cat:'science', ar:{q:'ما صيغة الماء الكيميائية؟', opts:['H2O','CO2','O2','H2'], ans:'H2O'}, en:{q:'What is the chemical formula for water?', opts:['H2O','CO2','O2','H2'], ans:'H2O'}},
      {cat:'math', ar:{q:'ما هو ناتج 5 × 6؟', opts:['11','30','56','20'], ans:'30'}, en:{q:'What is 5 × 6?', opts:['11','30','56','20'], ans:'30'}},
      {cat:'history', ar:{q:'في أي سنة هبط كولومبوس على أمريكا؟', opts:['1492','1500','1510','1600'], ans:'1492'}, en:{q:'In which year did Columbus reach America?', opts:['1492','1500','1510','1600'], ans:'1492'}},
      {cat:'sport', ar:{q:'كم لاعب في الفريق لكرة السلة؟', opts:['5','7','6','11'], ans:'5'}, en:{q:'How many players on a basketball team on the court?', opts:['5','7','6','11'], ans:'5'}},
      {cat:'culture', ar:{q:'ما هي عاصمة اليابان؟', opts:['طوكيو','أوساكا','ناغويا','كيوتو'], ans:'طوكيو'}, en:{q:'What is the capital of Japan?', opts:['Tokyo','Osaka','Nagoya','Kyoto'], ans:'Tokyo'}},
      {cat:'science', ar:{q:'الضوء ينتقل بسرعة تقريبا:', opts:['300,000 km/s','150,000 km/s','1,000 km/s','30,000 km/s'], ans:'300,000 km/s'}, en:{q:'Light travels at approximately:', opts:['300,000 km/s','150,000 km/s','1,000 km/s','30,000 km/s'], ans:'300,000 km/s'}},
      {cat:'math', ar:{q:'ما هو مجموع الزوايا في مثلث؟', opts:['180','360','90','270'], ans:'180'}, en:{q:'What is the sum of angles in a triangle?', opts:['180','360','90','270'], ans:'180'}},
      {cat:'history', ar:{q:'من بنى سور الصين العظيم؟', opts:['الإمبراطور تشين شي هوانغ','الإمبراطور هان','الإمبراطور تانغ','الإمبراطور مينغ'], ans:'الإمبراطور تشين شي هوانغ'}, en:{q:'Who started the Great Wall of China?', opts:['Emperor Qin Shi Huang','Emperor Han','Emperor Tang','Emperor Ming'], ans:'Emperor Qin Shi Huang'}}
    ],

    medium: [
      {cat:'culture', ar:{q:'ما أصل رقصة التانغو؟', opts:['الأرجنتين','إسبانيا','المكسيك','البرتغال'], ans:'الأرجنتين'}, en:{q:'Which country is tango from?', opts:['Argentina','Spain','Mexico','Portugal'], ans:'Argentina'}},
      {cat:'general', ar:{q:'أي من هذه وحدة زمن أصغر؟', opts:['ساعة','دقيقة','يوم','أسبوع'], ans:'دقيقة'}, en:{q:'Which is the smallest time unit?', opts:['Hour','Minute','Day','Week'], ans:'Minute'}},
      {cat:'science', ar:{q:'ما هو الكوكب المعروف بالكوكب الأحمر؟', opts:['المريخ','الزهرة','المشتري','زحل'], ans:'المريخ'}, en:{q:'Which planet is known as the Red Planet?', opts:['Mars','Venus','Jupiter','Saturn'], ans:'Mars'}},
      {cat:'math', ar:{q:'حل 12 ÷ 3 = ؟', opts:['2','3','4','6'], ans:'4'}, en:{q:'12 ÷ 3 = ?', opts:['2','3','4','6'], ans:'4'}},
      {cat:'history', ar:{q:'في أي قارة تقع مملكة الفراعنة؟', opts:['أفريقيا','آسيا','أوروبا','أمريكا'], ans:'أفريقيا'}, en:{q:'On which continent were ancient Egyptian kingdoms?', opts:['Africa','Asia','Europe','America'], ans:'Africa'}},
      {cat:'sport', ar:{q:'في كرة القدم، ما هو عدد بدلات اللاعبين الاحتياط؟', opts:['3','5','7','4'], ans:'3'}, en:{q:'How many substitutions were traditionally allowed in football (historic)?', opts:['3','5','7','4'], ans:'3'}},
      {cat:'culture', ar:{q:'من اخترع المطابع الحديثة؟', opts:['غوتنبرغ','تيسلا','أينشتاين','فورد'], ans:'غوتنبرغ'}, en:{q:'Who invented the modern printing press?', opts:['Gutenberg','Tesla','Einstein','Ford'], ans:'Gutenberg'}},
      {cat:'science', ar:{q:'ما هو الغاز الرئيسي في الهواء؟', opts:['النيتروجين','الأكسجين','ثاني أكسيد الكربون','الهيليوم'], ans:'النيتروجين'}, en:{q:'What is the main gas in the air?', opts:['Nitrogen','Oxygen','CO2','Helium'], ans:'Nitrogen'}},
      {cat:'math', ar:{q:'ما هو 7 + 8؟', opts:['14','15','16','13'], ans:'15'}, en:{q:'What is 7 + 8?', opts:['14','15','16','13'], ans:'15'}},
      {cat:'history', ar:{q:'من كان أول رئيس للولايات المتحدة؟', opts:['جورج واشنطن','توماس جيفرسون','أبراهام لنكولن','جون آدامز'], ans:'جورج واشنطن'}, en:{q:'Who was the first US president?', opts:['George Washington','Thomas Jefferson','Abraham Lincoln','John Adams'], ans:'George Washington'}}
    ],

    hard: [
      {cat:'culture', ar:{q:'ما هي لغة الأدب الكلاسيكي في الهند؟', opts:['السنسكريتية','الهندية','الأردية','التاميلية'], ans:'السنسكريتية'}, en:{q:'What is the classical language of India?', opts:['Sanskrit','Hindi','Urdu','Tamil'], ans:'Sanskrit'}},
      {cat:'general', ar:{q:'ما هو البنزين في الكيمياء؟', opts:['هيدروكربون','أمين','كبريتيد','أكسيد'], ans:'هيدروكربون'}, en:{q:'Gasoline in chemistry is mainly a type of?', opts:['Hydrocarbon','Amine','Sulfide','Oxide'], ans:'Hydrocarbon'}},
      {cat:'science', ar:{q:'ما اسم البروتونات سالبة أم موجبة؟', opts:['موجبة','سالبة','محايدة','غير معروفة'], ans:'موجبة'}, en:{q:'Are protons positive or negative?', opts:['Positive','Negative','Neutral','Unknown'], ans:'Positive'}},
      {cat:'math', ar:{q:'حل المعادلة: 2x + 3 = 11', opts:['3','4','5','6'], ans:'4'}, en:{q:'Solve 2x + 3 = 11', opts:['3','4','5','6'], ans:'4'}},
      {cat:'history', ar:{q:'متى انتهت الحرب العالمية الثانية؟', opts:['1945','1939','1918','1950'], ans:'1945'}, en:{q:'When did WWII end?', opts:['1945','1939','1918','1950'], ans:'1945'}},
      {cat:'sport', ar:{q:'كم نقطة الفوز في مباراة التنس في غراند سلام؟', opts:['4','6','3','5'], ans:'4'}, en:{q:'How many points to win a game in tennis (basic)?', opts:['4','6','3','5'], ans:'4'}},
      {cat:'culture', ar:{q:'من كتب الملاحم الإلياذة والأوديسة؟', opts:['هوميروس','شيكسبير','بافر','سنكيز'], ans:'هوميروس'}, en:{q:'Who wrote the Iliad and the Odyssey?', opts:['Homer','Shakespeare','Poe','Sappho'], ans:'Homer'}},
      {cat:'science', ar:{q:'ما هو رمز العنصر الذهب؟', opts:['Au','Ag','Fe','Pb'], ans:'Au'}, en:{q:'What is the chemical symbol for Gold?', opts:['Au','Ag','Fe','Pb'], ans:'Au'}},
      {cat:'math', ar:{q:'ما هو الجذر التربيعي لـ 81؟', opts:['8','9','7','6'], ans:'9'}, en:{q:'What is the square root of 81?', opts:['8','9','7','6'], ans:'9'}},
      {cat:'history', ar:{q:'أي إمبراطورية أسست طريق الحرير؟', opts:['الصينية','الرومانية','البيزنطية','الذاتية'], ans:'الصينية'}, en:{q:'Which empire helped develop the Silk Road?', opts:['Chinese','Roman','Byzantine','Ottoman'], ans:'Chinese'}}
    ]
  };

  // --- State ---
  let state = {
    lang: 'ar',        // 'ar' or 'en'
    level: null,       // 'easy' | 'medium' | 'hard'
    questions: [],     // current shuffled questions
    idx: 0,
    score: 0,
    timePerQ: 30,      // seconds
    timer: null,
    audioOn: true,
    bgLoop: null
  };

  // --- DOM ---
  const startScreen = document.getElementById('startScreen');
  const gameScreen = document.getElementById('gameScreen');
  const endScreen  = document.getElementById('endScreen');
  const levelBtns = document.querySelectorAll('.level-btn');
  const langToggles = document.querySelectorAll('.lang-toggle');
  const homeBtn = document.getElementById('homeBtn');
  const muteBtn = document.getElementById('muteBtn');
  const questionText = document.getElementById('questionText');
  const answersWrap = document.getElementById('answers');
  const timerFill = document.getElementById('timerFill');
  const timerText = document.getElementById('timerText');
  const qProgressFill = document.getElementById('qProgressFill');
  const scoreText = document.getElementById('scoreText');
  const levelName = document.getElementById('levelName');
  const endTitle = document.getElementById('endTitle');
  const endScore = document.getElementById('endScore');
  const playAgain = document.getElementById('playAgain');
  const backHome = document.getElementById('backHome');

  // create AudioContext for sounds & music
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  const audioCtx = AudioCtx ? new AudioCtx() : null;

  function playTone(freq, length=0.15, type='sine', gain=0.12){
    if(!audioCtx || !state.audioOn) return;
    const o = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    o.type = type; o.frequency.value = freq;
    g.gain.setValueAtTime(gain, audioCtx.currentTime);
    o.connect(g); g.connect(audioCtx.destination);
    o.start();
    g.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + length);
    setTimeout(()=>{o.stop()}, length*1000 + 20);
  }

  // short sounds
  function playCorrect(){ playTone(880,0.18,'sine',0.14); playTone(1320,0.12,'sine',0.06); }
  function playWrong(){ playTone(220,0.18,'sawtooth',0.12); playTone(160,0.12,'sawtooth',0.06); }

  // simple bg music loop (arpeggio) — loop via interval if audioCtx available
  function startBgMusic(){
    if(!audioCtx || !state.audioOn) return;
    stopBgMusic();
    const base = 220;
    let i = 0;
    state.bgLoop = setInterval(()=>{
      if(!state.audioOn) return;
      const freqs = [base, base*1.5, base*2, base*2.5];
      playTone(freqs[i%freqs.length], 0.35,'sine',0.06);
      i++;
    }, 400);
  }
  function stopBgMusic(){ if(state.bgLoop){clearInterval(state.bgLoop); state.bgLoop=null;} }

  // --- UI helpers ---
  function showScreen(name){
    startScreen.classList.remove('active');
    gameScreen.classList.remove('active');
    endScreen.classList.remove('active');
    if(name==='start') startScreen.classList.add('active');
    if(name==='game') gameScreen.classList.add('active');
    if(name==='end') endScreen.classList.add('active');
  }

  function shuffle(a){
    for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; }
    return a;
  }

  // prepare questions for chosen level (random order) - pick first 10
  function prepareLevel(level){
    state.level = level;
    const pool = QUESTIONS[level].slice(); // copy
    shuffle(pool);
    state.questions = pool.slice(0,10);
    state.idx = 0; state.score=0;
    qProgressFill.style.width = '0%';
    scoreText.textContent = `${state.score} / ${state.questions.length}`;
    levelName.textContent = level.charAt(0).toUpperCase() + level.slice(1);
  }

  // render current question
  function renderQuestion(){
    if(state.idx >= state.questions.length) return endRound();
    const qObj = state.questions[state.idx][state.lang];
    questionText.textContent = qObj.q;
    answersWrap.innerHTML = '';
    // create shuffled options
    const opts = qObj.opts.slice();
    shuffle(opts);
    opts.forEach(opt=>{
      const b = document.createElement('button');
      b.innerText = opt;
      b.addEventListener('click', ()=> selectAnswer(b,opt));
      answersWrap.appendChild(b);
    });
    // reset timer
    resetTimer();
    updateProgress();
  }

  function updateProgress(){
    const pct = Math.round((state.idx / state.questions.length) * 100);
    qProgressFill.style.width = pct + '%';
    scoreText.textContent = `${state.score} / ${state.questions.length}`;
  }

  // --- Timer behavior ---
  function resetTimer(){
    clearInterval(state.timer);
    state.timeLeft = state.timePerQ;
    updateTimerUI();
    state.timer = setInterval(()=>{
      state.timeLeft--;
      updateTimerUI();
      if(state.timeLeft <= 0){
        clearInterval(state.timer);
        // mark as wrong and reveal correct
        revealCorrect(null, true);
      }
    },1000);
  }

  function updateTimerUI(){
    const total = state.timePerQ;
    const pct = Math.max(0, (state.timeLeft/total)*100);
    timerFill.style.width = pct + '%';
    timerText.innerText = state.timeLeft + 's';
    // change color when <=5
    if(state.timeLeft <= 5){
      timerFill.style.background = 'linear-gradient(90deg,#ff5252,#ff2b2b)';
      playTone(440,0.04,'triangle',0.02); // soft tick near end
    } else {
      timerFill.style.background = 'linear-gradient(90deg,var(--neon-blue),var(--neon-pink))';
    }
  }

  // when user selects answer
  function selectAnswer(btn, selected){
    // disable buttons
    Array.from(answersWrap.children).forEach(x=> x.disabled=true);
    clearInterval(state.timer);
    const qObj = state.questions[state.idx][state.lang];
    const correct = qObj.ans;
    if(selected === correct){
      btn.classList.add('correct');
      state.score++;
      playCorrect();
    } else {
      btn.classList.add('wrong');
      playWrong();
      // highlight correct
      Array.from(answersWrap.children).forEach(x=>{
        if(x.innerText === correct) x.classList.add('correct');
      });
    }
    // small animation effect (scale/shadow)
    setTimeout(()=>{
      state.idx++;
      updateProgress();
      renderQuestion();
    },1000);
  }

  // reveal correct if time out or skip (btn null indicates timeout)
  function revealCorrect(btn, timedOut=false){
    const qObj = state.questions[state.idx][state.lang];
    const correct = qObj.ans;
    Array.from(answersWrap.children).forEach(x=>{
      x.disabled=true;
      if(x.innerText === correct) x.classList.add('correct');
      else x.classList.add('wrong'); // mark others as wrong to give feedback
    });
    if(!timedOut) playWrong();
    setTimeout(()=>{
      state.idx++;
      updateProgress();
      renderQuestion();
    },1200);
  }

  function endRound(){
    stopBgMusic();
    playTone(660,0.4,'sine',0.08);
    showScreen('end');
    endTitle.textContent = (state.lang==='ar' ? 'النهاية' : 'Game Over');
    endScore.textContent = (state.lang==='ar' ? `النقطة ديالك: ${state.score} / ${state.questions.length}` : `Your score: ${state.score} / ${state.questions.length}`);
  }

  // --- EVENTS wiring ---
  levelBtns.forEach(btn=>{
    btn.addEventListener('click', e=>{
      const level = btn.dataset.level;
      prepareLevel(level);
      // set lang from active toggle on startScreen
      const activeLang = document.querySelector('#startScreen .lang-toggle.active')?.dataset.lang || 'ar';
      state.lang = activeLang;
      // show game
      showScreen('game');
      renderQuestion();
      if(state.audioOn) startBgMusic();
    });
  });

  // language toggles (both on start and game)
  function setLangButtons(lang){
    document.querySelectorAll('.lang-toggle').forEach(el=>{
      el.classList.toggle('active', el.dataset.lang === lang);
    });
  }
  langToggles.forEach(lt=>{
    lt.addEventListener('click', ()=>{
      state.lang = lt.dataset.lang;
      setLangButtons(state.lang);
      // if in-game, re-render current question in new language
      if(document.getElementById('gameScreen').classList.contains('active')){
        renderQuestion();
      }
    });
  });

  homeBtn.addEventListener('click', ()=>{
    // stop timers/music
    clearInterval(state.timer); stopBgMusic();
    showScreen('start');
  });

  muteBtn.addEventListener('click', ()=>{
    state.audioOn = !state.audioOn;
    muteBtn.textContent = state.audioOn ? 'Mute' : 'Muted';
    if(state.audioOn) startBgMusic(); else stopBgMusic();
  });

  // end screen actions
  if(playAgain) playAgain.addEventListener('click', ()=>{
    prepareLevel(state.level || 'easy');
    showScreen('game');
    renderQuestion();
    if(state.audioOn) startBgMusic();
  });
  if(backHome) backHome.addEventListener('click', ()=> showScreen('start'));

  // quick helpers: fill missing DOM references if elements created later
  // attach global references
  window.selectAnswer = selectAnswer;

  // initial state
  showScreen('start');
  setLangButtons('ar');

  // expose small API for debugging (optional)
  window._quizState = state;
})();
