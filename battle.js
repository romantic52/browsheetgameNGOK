"use strict";

// Original turn-based classroom battles. Runs entirely offline.
// All strings are game data; text is rendered with textContent, never interpolated as HTML.
(() => {
  const QUESTION_BANK = {
    math: [
      {prompt:"Реши пример: 12 × 7 = ?", answers:["84","72","96"], correct:0, hint:"12 × (5 + 2) = 60 + 24.", why:"12 × 7 = 84."},
      {prompt:"Найди x: 2x + 6 = 20", answers:["x = 8","x = 7","x = 13"], correct:1, hint:"Сначала вычти 6, затем раздели на 2.", why:"2x = 14, значит x = 7."},
      {prompt:"Сколько будет ¾ от 80?", answers:["20","55","60"], correct:2, hint:"Раздели 80 на четыре и умножь на три.", why:"80 ÷ 4 × 3 = 60."},
      {prompt:"В аудитории 24 студента. 25% не пришли. Сколько на паре?", answers:["18","20","16"], correct:0, hint:"Четверть от 24 — это 6.", why:"24 − 6 = 18."},
      {prompt:"Упрости: 3(2 + 5) − 4", answers:["15","17","21"], correct:1, hint:"Сначала скобки.", why:"3 × 7 − 4 = 17."},
      {prompt:"Чему равен квадрат числа −6?", answers:["−36","12","36"], correct:2, hint:"Отрицательное × отрицательное = положительное.", why:"(−6) × (−6) = 36."},
      {prompt:"Поезд едет 60 км/ч. Сколько он проедет за 30 минут?", answers:["30 км","60 км","120 км"], correct:0, hint:"30 минут — это половина часа.", why:"60 × 0,5 = 30 км."},
      {prompt:"5² − 4² = ?", answers:["1","9","41"], correct:1, hint:"Вычисли квадраты по отдельности.", why:"25 − 16 = 9."}
    ],
    english: [
      {prompt:"Teacher: «Could you introduce yourself?»", answers:["I have a pencil.","My name is Alex. Nice to meet you.","Yes, I do."], correct:1, hint:"Тебя просят представиться.", why:"«My name is…» — естественное начало знакомства."},
      {prompt:"Classmate: «How was your weekend?»", answers:["It was great, thanks!","I am weekend.","At seven o'clock."], correct:0, hint:"How was…? — спрашивают, как прошло.", why:"«It was great» — ответ о прошедших выходных."},
      {prompt:"Teacher: «Why are you late?»", answers:["Because my bus was delayed.","I late yesterday tomorrow.","I'm nineteen."], correct:0, hint:"Why? — нужен ответ с причиной.", why:"Because my bus was delayed — потому что автобус задержался."},
      {prompt:"Как вежливо попросить повторить вопрос?", answers:["Speak more!","I repeat you.","Could you repeat that, please?"], correct:2, hint:"Вежливый запрос обычно начинается с Could you…", why:"«Could you repeat that, please?» — корректная просьба."},
      {prompt:"Complete: «Yesterday I ___ to college.»", answers:["go","went","going"], correct:1, hint:"Yesterday требует прошедшего времени.", why:"Past Simple от go — went."},
      {prompt:"Friend: «Would you like some tea?»", answers:["Yes, please.","I am tea.","Yes, I like yesterday."], correct:0, hint:"На предложение можно ответить «Да, пожалуйста».", why:"«Yes, please» — короткий вежливый ответ."},
      {prompt:"Complete: «She ___ studying now.»", answers:["is","are","does"], correct:0, hint:"Present Continuous: am/is/are + ing.", why:"Для she употребляется is."},
      {prompt:"Teacher: «What does this word mean?»", answers:["It's on Monday.","It means «schedule».","I'm good, thanks."], correct:1, hint:"От тебя ждут значение слова.", why:"«It means…» — «это означает…»."}
    ],
    patience: [
      {prompt:"Одногруппник выступает уже 15 минут. Тебя клонит в сон. Что сделаешь?", answers:["Начну перебивать.","Кратко законспектирую главную мысль.","Уйду посреди выступления."], correct:1, hint:"Задача — не потерять внимание и проявить уважение.", why:"Заметки помогают сохранять внимание и спокойствие."},
      {prompt:"Преподаватель задаёт каверзный вопрос перед всей группой.", answers:["Попрошу секунду подумать.","Начну спорить, не слушая.","Скажу первое, что пришло в голову."], correct:0, hint:"Пауза лучше паники.", why:"Короткая пауза помогает дать более точный ответ."},
      {prompt:"Твой доклад прерывают на середине.", answers:["Замолчу навсегда.","Повышу голос.","Спокойно уточню вопрос и продолжу."], correct:2, hint:"Важно удержать контакт с аудиторией.", why:"Уточнение и спокойный тон помогают сохранить ход доклада."},
      {prompt:"На слайде обнаружилась опечатка.", answers:["Сделаю вид, что всё идеально.","Исправлю её словами и пойду дальше.","Закрою презентацию."], correct:1, hint:"Небольшая ошибка — не катастрофа.", why:"Краткая поправка лучше, чем паника."},
      {prompt:"До конца пары две минуты, а кто-то затянул обсуждение.", answers:["Вежливо подведу итог.","Громко вздохну на весь зал.","Начну листать телефон."], correct:0, hint:"Конструктивное завершение лучше раздражения.", why:"Краткий итог помогает завершить разговор без конфликта."},
      {prompt:"Забыл следующую фразу во время защиты проекта.", answers:["Убегу с кафедры.","Скажу «всё» и сяду.","Взгляну в план, вдохну и продолжу."], correct:2, hint:"Опорный план существует именно для таких случаев.", why:"Пауза и план позволяют восстановить мысль."},
      {prompt:"Тебя перебивают замечанием: «Неубедительно!»", answers:["Попрошу конкретизировать замечание.","Отвечу грубостью.","Игнорирую все вопросы."], correct:0, hint:"Уточняй аргументы, а не спорь с эмоциями.", why:"Конкретный вопрос переводит критику в обсуждение."}
    ]
  };
  const FIGHTS = {
    algebra: {label:"ПОНЕДЕЛЬНИК · МАТЕМАТИКА", enemy:"ВНЕЗАПНАЯ КОНТРОЛЬНАЯ", type:"math", hp:64, intro:"Задачи атакуют одна за другой. Правильный ответ — твой удар.", symbol:"∑", color:"#f0dc80"},
    grammar: {label:"ВТОРНИК · АНГЛИЙСКИЙ", enemy:"THE ENGLISH TEACHER", type:"english", hp:75, intro:"Неожиданный разговор на английском. Ответь так, чтобы не потерять самообладание.", symbol:"ABC", color:"#b4b5ff"},
    monitor: {label:"СРЕДА · ИНФОРМАТИКА", enemy:"КОД ОШИБКИ 404", type:"math", hp:94, intro:"Компьютер засыпает тебя задачами. Каждый верный ответ разбивает один слой защиты.", symbol:"404", color:"#92e4ed"},
    stage: {label:"ЧЕТВЕРГ · ВЫСТУПЛЕНИЕ", enemy:"СТРАХ СЦЕНЫ", type:"patience", hp:96, intro:"Публика ждёт твоей реакции. Сохраняй терпение — и тревога отступит.", symbol:"!", color:"#eda4c7"},
    oral: {label:"ПЯТНИЦА · УСТНЫЙ ЗАЧЁТ", enemy:"THE ORAL EXAM", type:"english", hp:105, intro:"Устный зачёт — это диалог, а не казнь. Выбери естественные реплики.", symbol:"?!", color:"#b4b5ff"},
    defense: {label:"СУББОТА · ЗАЩИТА ПРОЕКТА", enemy:"БЕСКОНЕЧНЫЙ ДОКЛАД", type:"patience", hp:113, intro:"У тебя остаётся только спокойствие. Не сорвись на последних минутах.", symbol:"…", color:"#eda4c7"},
    session: {label:"ВОСКРЕСЕНЬЕ · ФИНАЛ", enemy:"ВЕЛИКАЯ СЕССИЯ", type:"mixed", hp:152, intro:"Финальный экзамен из всего, чему научила эта неделя. Математика, английский и самообладание.", symbol:"7", color:"#ff9b83"}
  };
  let current=null, finishedCallback=null, exitCallback=null;
  const $=id=>document.getElementById(id);
  const cap=(n,min,max)=>Math.min(max,Math.max(min,n));
  const root=()=> $("battle");
  function safeText(id,value){$(id).textContent=value;}
  function start(id,onWin,onExit){
    if(!Object.prototype.hasOwnProperty.call(FIGHTS,id))throw new Error("Unknown challenge");
    if(current)return;
    const fight=FIGHTS[id];
    current={id, fight, hp:100, sp:4, enemyHp:fight.hp, turn:0, correct:0, attempted:0, action:"", step:"action", lastPool:"", lastIndex:-1};
    finishedCallback=typeof onWin==="function"?onWin:null;
    exitCallback=typeof onExit==="function"?onExit:null;
    root().hidden=false;
    $("battleEnemySymbol").textContent=fight.symbol;
    $("battleEnemySymbol").style.setProperty("--enemy-color",fight.color);
    safeText("battleLabel",fight.label);
    safeText("battleEnemyName",fight.enemy);
    safeText("battleIntro",fight.intro);
    safeText("battleResult", "");
    safeText("battleQuestion","");
    $("battleAnswers").replaceChildren();
    $("battleResultButton").hidden=true;
    $("battleActions").hidden=false;
    $("battleQuestionPanel").hidden=true;
    $("battleExitBtn").hidden=false;
    render();
    $("battleActionAttack").focus();
  }
  function stop(){
    current=null;finishedCallback=null;exitCallback=null;root().hidden=true;
  }
  function exit(){
    const callback=exitCallback;stop();if(callback)callback();
  }
  function isActive(){return current!==null;}
  function poolName(){
    const type=current.fight.type;
    return type==="mixed"?["math","english","patience"][current.turn%3]:type;
  }
  function question(){
    const type=poolName(), pool=QUESTION_BANK[type], index=(current.turn*3 + (current.id==="session"?2:1))%pool.length;
    current.lastPool=type;current.lastIndex=index;
    return pool[index];
  }
  function action(kind){
    if(!current||current.step!=="action")return;
    if(kind==="rest"){
      current.hp=cap(current.hp+21,0,100);current.sp=cap(current.sp+2,0,6);
      current.turn++;
      current.hp=cap(current.hp-9,0,100);
      if(current.hp<=0){end(false);return;}
      safeText("battleResult","Тебе удалось перевести дух: +21 к нервам, +2 к энергии. Но испытание не ждёт: −9 к нервам.");
      current.step="message";$("battleActions").hidden=true;$("battleQuestionPanel").hidden=false;
      $("battleAnswers").replaceChildren();safeText("battleQuestion","ПЕРЕДЫШКА");$("battleResultButton").hidden=false;
      render();$("battleResultButton").focus();return;
    }
    if(kind==="skill"){
      if(current.sp<2){safeText("battleResult","Для особого навыка нужны 2 единицы энергии. Сделай передышку.");return;}
      current.sp-=2;
    }
    current.action=kind;current.step="question";
    $("battleActions").hidden=true;$("battleQuestionPanel").hidden=false;$("battleResultButton").hidden=true;
    const q=question();
    safeText("battleQuestion",q.prompt);
    safeText("battleResult",kind==="skill"?"ОСОБЫЙ НАВЫК: усиленный удар! Подсказка: "+q.hint:"");
    $("battleAnswers").replaceChildren();
    q.answers.forEach((answer,i)=>{
      const button=document.createElement("button");button.type="button";button.className="battle-answer";
      const number=document.createElement("span");number.className="battle-answer-num";number.textContent=String(i+1).padStart(2,"0");
      const wording=document.createElement("span");wording.textContent=answer;
      button.append(number,wording);
      button.addEventListener("click",()=>answerQuestion(i));
      $("battleAnswers").append(button);
    });
    render();$("battleAnswers button")?.focus();
  }
  function answerQuestion(index){
    if(!current||current.step!=="question")return;
    const q=QUESTION_BANK[current.lastPool][current.lastIndex], accurate=index===q.correct;
    current.attempted++;
    const damage=current.action==="skill"?54:32;
    if(accurate){current.correct++;current.enemyHp=Math.max(0,current.enemyHp-damage);current.sp=cap(current.sp+1,0,6);current.hp=Math.max(0,current.hp-(current.id==="session"?7:3));}
    else current.hp=Math.max(0,current.hp-(current.id==="session"?25:19));
    current.turn++;
    $("battleAnswers").querySelectorAll("button").forEach((b,i)=>{
      b.disabled=true;
      if(i===q.correct)b.classList.add("correct");
      else if(i===index)b.classList.add("wrong");
    });
    safeText("battleResult",(accurate?"ПОПАДАНИЕ! −"+damage+" к стойкости врага. ":"МИМО! −"+(current.id==="session"?25:19)+" к твоим нервам. ")+q.why);
    current.step="message";$("battleResultButton").hidden=false;
    if(current.enemyHp<=0){end(true);return;}
    if(current.hp<=0){end(false);return;}
    render();$("battleResultButton").focus();
  }
  function continueTurn(){
    if(!current||current.step!=="message")return;
    current.step="action";$("battleActions").hidden=false;$("battleQuestionPanel").hidden=true;$("battleResultButton").hidden=true;
    safeText("battleResult","");
    render();$("battleActionAttack").focus();
  }
  function end(won){
    if(!current)return;
    current.step=won?"won":"lost";
    $("battleActions").hidden=true;$("battleQuestionPanel").hidden=false;
    $("battleAnswers").replaceChildren();
    $("battleResultButton").hidden=false;$("battleExitBtn").hidden=won;
    safeText("battleQuestion",won?"ПОБЕДА!":"ПОРАЖЕНИЕ");
    safeText("battleResult",won
      ?"Испытание пройдено. Верных решений: "+current.correct+" из "+current.attempted+". Теперь можно вернуться к истории."
      :"Нервы на нуле. В колледже это ещё не конец: можно восстановиться и попробовать снова.");
    $("battleResultButton").textContent=won?"Продолжить историю ↗":"Реванш ↗";
    render();$("battleResultButton").focus();
  }
  function resultAction(){
    if(!current)return;
    if(current.step==="message"){continueTurn();return;}
    if(current.step==="lost"){
      const {id}=current, onWin=finishedCallback, onExit=exitCallback;stop();start(id,onWin,onExit);return;
    }
    if(current.step==="won"){
      const payload={id:current.id,accuracy:current.attempted?current.correct/current.attempted:0,perfect:current.correct===current.attempted};
      const callback=finishedCallback;stop();if(callback)callback(payload);
    }
  }
  function render(){
    if(!current)return;
    const c=current;
    safeText("battlePlayerHP",c.hp+"/100");
    safeText("battlePlayerSP",c.sp+"/6");
    safeText("battleEnemyHP",c.enemyHp+"/"+c.fight.hp);
    safeText("battleTurn","ХОД "+(c.turn+1).toString().padStart(2,"0"));
    $("battlePlayerHPBar").style.width=(c.hp)+"%";
    $("battlePlayerSPBar").style.width=(c.sp/6*100)+"%";
    $("battleEnemyBar").style.width=(c.enemyHp/c.fight.hp*100)+"%";
    $("battleActionSkill").disabled=c.sp<2||c.step!=="action";
    $("battleActionAttack").disabled=c.step!=="action";
    $("battleActionRest").disabled=c.step!=="action";
    if(c.step==="message")$("battleResultButton").textContent="Следующий ход →";
    safeText("battleType",({math:"МАТЕМАТИКА",english:"АНГЛИЙСКИЙ",patience:"САМООБЛАДАНИЕ"})[poolName()]);
  }
  function bind(){
    $("battleActionAttack").addEventListener("click",()=>action("attack"));
    $("battleActionSkill").addEventListener("click",()=>action("skill"));
    $("battleActionRest").addEventListener("click",()=>action("rest"));
    $("battleResultButton").addEventListener("click",resultAction);
    $("battleExitBtn").addEventListener("click",exit);
    document.addEventListener("keydown",event=>{
      if(!isActive()||event.repeat||event.ctrlKey||event.altKey||event.metaKey)return;
      if(!event.target.closest("#battle"))return;
      if(event.key==="Escape"){event.preventDefault();exit();return;}
      if(current.step==="question"&&/^[1-3]$/.test(event.key)){event.preventDefault();answerQuestion(Number(event.key)-1);}
      if(current.step==="action"){
        if(event.key==="1")action("attack");
        if(event.key==="2")action("skill");
        if(event.key==="3")action("rest");
      }
    });
  }
  bind();
  window.NGOKBattle={start,stop,isActive};
  // Exposed frozen data for automated smoke tests or future battle editors.
  window.NGOKBattleData=Object.freeze({questions:QUESTION_BANK,fights:FIGHTS});
})();
