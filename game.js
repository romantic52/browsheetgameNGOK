"use strict";

const SAVE_KEY = "seven-days-ngok-v1";
const DAYS = [
  ["ПОНЕДЕЛЬНИК", "Первый звонок"],
  ["ВТОРНИК", "Лишняя пара"],
  ["СРЕДА", "Компьютер №7"],
  ["ЧЕТВЕРГ", "Записки из архива"],
  ["ПЯТНИЦА", "Тот, кто остался"],
  ["СУББОТА", "После звонка"],
  ["ВОСКРЕСЕНЬЕ", "Последний день"]
];
const CAST = {
  lera: {name:"Лера", tag:"ЛЕРА // АРТ"},
  misha: {name:"Миша", tag:"МИША // IT"},
  dasha: {name:"Даша", tag:"ДАША // СТАРОСТА"},
  artem: {name:"Артём", tag:"АРТЁМ // ЛЕГЕНДА"}
};
// Each node has one of: next, choices, or end. Choice effects are stored in the save.
const story = {
  intro: {day:1, scene:"campus", light:"sunset", time:"08:10", who:"", text:"Новосибирск. Осень. Твой телефон показывает понедельник, хотя ты совершенно точно помнишь пятницу.", next:"d1a"},
  d1a: {day:1, scene:"campus", time:"08:11", who:"", text:"На экране — семь пропущенных уведомлений. Все от одного отправителя: «НГОК. Расписание изменено».", next:"d1b"},
  d1b: {day:1, who:"misha", text:"О, живой! Ты тоже видел? У нас сегодня пара в аудитории 404. Четвёртого этажа, правда, нет.", next:"d1c"},
  d1c: {day:1, who:"lera", text:"Не слушай его. Он с утра не спал, потому что пытался взломать автомат с кофе. Кстати, я Лера.", next:"d1choice"},
  d1choice: {day:1, who:"", text:"Первый день начинается странно. С кем пойти на пары?", choices:[
    {label:"Пойти с Мишей искать аудиторию 404", to:"d1m", effects:{misha:2, mystery:1}},
    {label:"С Лерой — она явно знает, что здесь происходит", to:"d1l", effects:{lera:2}},
    {label:"Найти старосту и нормальное расписание", to:"d1d", effects:{dasha:2}}
  ]},
  d1m: {day:1, scene:"hall", who:"misha", text:"Смотри. На старом плане этажа есть дверь, которой на новом плане нет. Это уже интересно!", next:"d1join"},
  d1l: {day:1, scene:"cafe", who:"lera", text:"Расписание можно игнорировать. Главное — никогда не оставаться в корпусе после последнего звонка. Проверено.", next:"d1join"},
  d1d: {day:1, scene:"class", who:"dasha", text:"Я Даша, староста. Список групп у меня есть. А вот твоего имени там почему-то нет. Очень смешно.", next:"d1join"},
  d1join: {day:1, scene:"hall", time:"17:07", who:"", text:"Вечером свет в коридоре моргает. На пустой доске объявлений появляется запись мелом: «ОСТАЛОСЬ 6 ДНЕЙ».", next:"d2a"},
  d2a: {day:2, scene:"class", light:"day", time:"09:00", who:"", text:"Вторник. Все ведут себя так, будто вчера ничего не случилось. Даже доска объявлений снова чистая.", next:"d2b"},
  d2b: {day:2, who:"dasha", text:"У нас лишняя пара в электронном журнале. Преподавателя нет, темы нет, но пропуск засчитают. Вот как это работает?", next:"d2c"},
  d2c: {day:2, who:"misha", text:"Я проверил исходник страницы. Кто-то добавил седьмой день в неделю. После воскресенья там опять понедельник.", next:"d2choice"},
  d2choice: {day:2, who:"", text:"Пока остальные идут на пары, у тебя есть час свободного времени.", choices:[
    {label:"Помочь Мише разобраться с электронным журналом", to:"d2m", effects:{misha:1, mystery:2}},
    {label:"Пойти с Лерой рисовать афишу студсовета", to:"d2l", effects:{lera:2}},
    {label:"С Дашей разобраться в бумажном расписании", to:"d2d", effects:{dasha:2, mystery:1}}
  ]},
  d2m: {day:2, scene:"lab", who:"misha", text:"Так, пароль admin123 не подошёл. Вот это поворот. Но файл с историей изменений почему-то датирован завтрашним числом.", next:"d2join"},
  d2l: {day:2, scene:"cafe", who:"lera", text:"Ты можешь считать меня странной, но каждую осень я рисую одну и ту же афишу. И каждый раз забываю, куда её повесила.", next:"d2join"},
  d2d: {day:2, scene:"archive", who:"dasha", text:"Вот журнал за прошлый год. Группа та же. Преподаватели те же. И, кажется… наша фотография.", next:"d2join"},
  d2join: {day:2, scene:"hall", light:"sunset", time:"17:07", who:"", text:"Последний звонок. В динамике слышится не мелодия, а чей-то тихий голос: «Пожалуйста, не повторяйте ошибку».", next:"d3a"},
  d3a: {day:3, scene:"lab", light:"day", time:"10:35", who:"misha", text:"Среда. Компьютер номер семь сам включился. На рабочем столе папка «НЕ ОТКРЫВАТЬ». Ну ты же понимаешь, что мы сейчас сделаем.", next:"d3b"},
  d3b: {day:3, who:"", text:"В папке всего один файл. Он называется «семь_дней_до_выпуска.txt». Внутри — список знакомых имён и одно зачёркнутое.", next:"d3c"},
  d3c: {day:3, who:"lera", text:"Там было моё имя? Стой. Почему мне кажется, что мы уже задавали этот вопрос?", next:"d3choice"},
  d3choice: {day:3, who:"", text:"На мониторе появляется окно с двумя кнопками. Третью Миша находит в исходном коде.", choices:[
    {label:"Открыть журнал событий", to:"d3log", effects:{misha:2, mystery:2}},
    {label:"Сделать копию файла для Леры", to:"d3copy", effects:{lera:2, mystery:1}},
    {label:"Выключить компьютер и рассказать Даше", to:"d3safe", effects:{dasha:2}}
  ]},
  d3log: {day:3, scene:"lab", light:"glitch", who:"misha", text:"В логах семь одинаковых понедельников. И каждый раз запись обрывается в 17:07. Отлично, теперь я точно не усну.", next:"d3join"},
  d3copy: {day:3, scene:"lab", light:"glitch", who:"lera", text:"Сохрани мне. Если я забуду ещё раз, хотя бы останется доказательство, что мы знакомы.", next:"d3join"},
  d3safe: {day:3, scene:"hall", who:"dasha", text:"Хорошо, что сказал. Я позвоню куратору… Погоди. Почему в списке контактов номер куратора — мой собственный?", next:"d3join"},
  d3join: {day:3, scene:"lab", light:"night", time:"17:07", who:"", text:"Все экраны одновременно загораются. На них появляется фотография: ваша компания стоит у колледжа. Подпись: «Воскресенье. Последний шанс».", next:"d4a"},
  d4a: {day:4, scene:"archive", light:"day", time:"12:20", who:"", text:"Четверг. В подвале корпуса вы находите архив, о котором никто не рассказывал на экскурсии.", next:"d4b"},
  d4b: {day:4, who:"dasha", text:"Здесь журналы посещаемости за десятки лет. Но в каждом из них есть страница с датой сегодняшнего дня.", next:"d4c"},
  d4c: {day:4, who:"artem", text:"А вот и экскурсанты. Меня Артём зовут. Если пришли искать выход из недели, то вы опоздали на несколько попыток.", next:"d4choice"},
  d4choice: {day:4, who:"artem", text:"Я могу рассказать, что знаю. Но сначала скажите: кому вы доверяете?", choices:[
    {label:"Тем, кто ищет ответы, даже если страшно", to:"d4m", effects:{misha:1, mystery:2}},
    {label:"Тем, кто помнит людей, а не события", to:"d4l", effects:{lera:2}},
    {label:"Тем, кто не бросает остальных", to:"d4d", effects:{dasha:2}}
  ]},
  d4m: {day:4, who:"artem", text:"Тогда ищите первую запись на сервере. Иногда ошибка — это просто сообщение, которое никто не прочитал.", next:"d4join"},
  d4l: {day:4, who:"artem", text:"Запоминайте лица. Расписание меняется, а чувства — не так просто. По крайней мере, я на это надеюсь.", next:"d4join"},
  d4d: {day:4, who:"artem", text:"Это хороший ответ. В прошлый раз вы ушли, оставив одного человека здесь. Именно поэтому неделя началась заново.", next:"d4join"},
  d4join: {day:4, scene:"hall", light:"sunset", time:"17:06", who:"", text:"В кармане появляется чужой пропуск. Имя стёрто. На обратной стороне: «Встречаемся на крыше. Пятница».", next:"d5a"},
  d5a: {day:5, scene:"roof", light:"sunset", time:"16:52", who:"", text:"Пятница. Крыша почти пустая. Город шумит далеко внизу, а на парапете лежит старая фотография.", next:"d5b"},
  d5b: {day:5, who:"artem", text:"Мы все были здесь в прошлое воскресенье. Хотели встретить рассвет. Но в колледже начался пожар из-за короткого замыкания.", next:"d5c"},
  d5c: {day:5, who:"artem", text:"Все успели выйти. Кроме одного человека, который вернулся за списком оставшихся. Кто именно — память почему-то скрыла.", next:"d5choice"},
  d5choice: {day:5, who:"", text:"Важнее всего сейчас решить, как действовать.", choices:[
    {label:"Проверить, кто запускал систему оповещения", to:"d5m", effects:{misha:2, mystery:2}},
    {label:"Попросить Леру восстановить события по рисункам", to:"d5l", effects:{lera:2, mystery:1}},
    {label:"Вместе с Дашей составить план эвакуации", to:"d5d", effects:{dasha:2, mystery:1}}
  ]},
  d5m: {day:5, scene:"lab", who:"misha", text:"Проверил. Сигнал тревоги выключили вручную. И сделали это уже после того, как все покинули здание.", next:"d5join"},
  d5l: {day:5, scene:"cafe", who:"lera", text:"Нашла альбом. На рисунке все стоят снаружи… а у окна на четвёртом этаже — ещё один силуэт.", next:"d5join"},
  d5d: {day:5, scene:"hall", who:"dasha", text:"Если получится вернуть тот день, мы сначала проверим людей, а потом документы. Никаких исключений.", next:"d5join"},
  d5join: {day:5, scene:"roof", light:"night", time:"17:07", who:"", text:"Впервые за всю неделю звонок не звучит. Вместо него ветер приносит слова: «Вы почти вспомнили».", next:"d6a"},
  d6a: {day:6, scene:"campus", light:"day", time:"14:30", who:"", text:"Суббота. По расписанию колледж закрыт. Но главная дверь открывается, как только ты подходишь.", next:"d6b"},
  d6b: {day:6, scene:"hall", who:"lera", text:"Я помню. Мы обещали вернуться за ним. За Артёмом. Но дверь захлопнулась, и всё началось сначала.", next:"d6c"},
  d6c: {day:6, who:"artem", text:"Я не призрак, если ты об этом. Скорее… часть воспоминания, из которого никто не хочет уходить. Я застрял в этой неделе.", next:"d6choice"},
  d6choice: {day:6, who:"", text:"У вас есть ночь, чтобы подготовиться к последнему дню.", choices:[
    {label:"Запустить резервную систему оповещения с Мишей", to:"d6m", effects:{misha:2, mystery:2, ready:1}},
    {label:"Собрать все воспоминания вместе с Лерой", to:"d6l", effects:{lera:2, ready:1}},
    {label:"Составить безопасный маршрут с Дашей", to:"d6d", effects:{dasha:2, ready:1}}
  ]},
  d6m: {day:6, scene:"lab", light:"night", who:"misha", text:"Система готова. Только не дай мне забыть пароль: «мы_возвращаемся_вместе». Да, с подчёркиваниями.", next:"d6join"},
  d6l: {day:6, scene:"cafe", light:"night", who:"lera", text:"Смотри на этот рисунок. Здесь есть выход, которого нет на планах. Я помнила его все семь дней.", next:"d6join"},
  d6d: {day:6, scene:"archive", light:"night", who:"dasha", text:"Пересчитала всех дважды. В этот раз никто не останется за дверью. Даже если снова поменяют расписание.", next:"d6join"},
  d6join: {day:6, scene:"roof", light:"night", time:"23:59", who:"", text:"Полночь. Телефон вибрирует. Новое уведомление: «Воскресенье, 17:07. Последний звонок. Решение за вами».", next:"d7a"},
  d7a: {day:7, scene:"campus", light:"sunset", time:"16:50", who:"", text:"Воскресенье. Всё повторяется: тот же свет, тот же ветер, те же шаги по лестнице.", next:"d7b"},
  d7b: {day:7, scene:"hall", who:"artem", text:"Я вспомнил. Я вернулся не за документами. Я вернулся, потому что думал, что внутри остался ты.", next:"d7c"},
  d7c: {day:7, who:"", text:"В 17:06 раздаётся сигнал тревоги. Секундная стрелка будто вязнет в воздухе. Друзья ждут твоего решения.", next:"d7choice"},
  d7choice: {day:7, scene:"hall", light:"glitch", who:"", text:"Впереди три дороги. И только одна минута, которой в этой неделе ещё не было.", choices:[
    {label:"Действовать вместе: вывести всех через запасной выход", to:"d7together", effects:{ready:1}},
    {label:"Довериться Артёму и остаться, чтобы восстановить память", to:"d7memory", effects:{mystery:1}},
    {label:"Пойти за самым близким другом", to:"d7friend", effects:{}}
  ]},
  d7together: {day:7, scene:"roof", light:"sunset", time:"17:08", who:"", text:"Вы находите запасной выход и уходите все вместе. Впервые часы на телефоне показывают 17:08.", end:"together"},
  d7memory: {day:7, scene:"archive", light:"glitch", time:"17:07", who:"artem", text:"Теперь я помню каждый день. Осталось самое страшное: простить себя за тот, который мы никак не могли отпустить.", end:"memory"},
  d7friend: {day:7, scene:"campus", light:"sunset", time:"17:08", who:"", text:"Ты хватаешь друга за руку. Вы выбегаете навстречу прохладному воздуху. За спиной постепенно стихает звонок.", end:"friend"}
};
const $ = id => document.getElementById(id);
const menu = $("menu"), play = $("play"), ending = $("ending"), modal = $("modalBackdrop");
const stateDefaults = () => ({node:"intro", stats:{misha:0, lera:0, dasha:0, mystery:0, ready:0}, history:[], finished:false});
let state = stateDefaults(), busy = false, audio = null, audioOn = false, toastTimer;
const canonicalNodes = new Set(Object.keys(story));
function safeRead() {
  try {
    const saved = JSON.parse(localStorage.getItem(SAVE_KEY));
    if (!saved || !canonicalNodes.has(saved.node) || !saved.stats || !Array.isArray(saved.history)) return null;
    const stats = {};
    for (const key of Object.keys(stateDefaults().stats)) stats[key] = Math.min(100, Math.max(0, Number(saved.stats[key]) || 0));
    return {node:saved.node, stats, history:saved.history.filter(x => x && typeof x.text === "string").slice(-250), finished:!!saved.finished};
  } catch { return null; }
}
function save(notify=false) {
  try { localStorage.setItem(SAVE_KEY, JSON.stringify(state)); if(notify) toast("Игра сохранена"); }
  catch { if(notify) toast("Не получилось сохранить прогресс"); }
}
function toast(message) {
  const el=$("toast"); el.textContent=message; el.classList.add("show");
  clearTimeout(toastTimer); toastTimer=setTimeout(()=>el.classList.remove("show"),2300);
}
function openModal(title, content) {
  $("modalTitle").textContent=title;
  $("modalContent").replaceChildren();
  if (typeof content === "string") $("modalContent").textContent=content;
  else $("modalContent").append(content);
  modal.hidden=false;
  $("modalCloseBtn").focus();
}
function closeModal() { modal.hidden=true; }
function showMenu() {
  save(); menu.hidden=false; play.hidden=true; ending.hidden=true;
  $("continueBtn").hidden = !safeRead() || state.finished;
  $("world").dataset.scene="campus"; $("world").dataset.light="sunset";
}
function renderProgress(day) {
  $("progress").replaceChildren(...Array.from({length:7},(_,i)=>{
    const dot=document.createElement("span"); dot.className=i+1<day?"past":i+1===day?"active":""; return dot;
  }));
}
function render() {
  const node=story[state.node]; if(!node) { state=stateDefaults(); return render(); }
  const day=node.day, [label,title]=DAYS[day-1];
  menu.hidden=true; ending.hidden=true; play.hidden=false;
  $("dayBadge").textContent="ДЕНЬ "+day+" / 7";
  $("chapterLabel").textContent=label;
  $("chapterTitle").textContent=title;
  $("world").dataset.scene=node.scene||"hall";
  $("world").dataset.light=node.light||(day===6?"night":day>=2?"day":"sunset");
  $("placeBadge").textContent=({campus:"У колледжа",hall:"Коридор",class:"Аудитория",cafe:"Столовая",lab:"Компьютерный класс",roof:"Крыша",archive:"Архив"})[node.scene]||"НГОК";
  $("timeBadge").textContent=node.time||"";
  $("speaker").textContent=node.who?CAST[node.who].name:"Повествование";
  $("dialogueText").textContent=node.text;
  const person=$("portrait");
  person.hidden=!node.who;
  if(node.who){ person.dataset.persona=node.who; $("portraitTag").textContent=CAST[node.who].tag; }
  $("choices").hidden=!node.choices;
  $("choices").replaceChildren();
  $("nextBtn").disabled=!!node.choices;
  if(node.choices) {
    node.choices.forEach((option,index)=>{
      const button=document.createElement("button");
      button.className="choice"; button.type="button";
      const number=document.createElement("span"); number.className="choice-index"; number.textContent=String(index+1).padStart(2,"0");
      const label=document.createElement("span"); label.textContent=option.label; label.style.flex="1";
      const arrow=document.createElement("span"); arrow.className="choice-arrow"; arrow.textContent="↗";
      button.append(number,label,arrow);
      button.onclick=()=>choose(index);
      $("choices").append(button);
    });
  }
  renderProgress(day); save();
}
function remember(node) {
  state.history.push({speaker:node.who?CAST[node.who].name:"Повествование",text:node.text,day:node.day});
  if(state.history.length>250) state.history.shift();
}
function move(to) { if(!canonicalNodes.has(to))return; state.node=to; render(); }
function next() {
  if(busy||modal.hidden===false||play.hidden)return;
  const node=story[state.node];
  if(node.choices)return;
  remember(node);
  if(node.end){finish(node.end);return;}
  if(node.next)move(node.next);
}
function choose(index) {
  if(busy||!modal.hidden)return;
  const node=story[state.node], option=node?.choices?.[index]; if(!option)return;
  busy=true;
  remember(node);
  for(const [key,value] of Object.entries(option.effects||{})) {
    if(Object.hasOwn(state.stats,key))state.stats[key]+=value;
  }
  move(option.to); busy=false;
}
function bestFriend() {
  const list=["lera","misha","dasha"];
  return list.sort((a,b)=>state.stats[b]-state.stats[a])[0];
}
function finish(type) {
  state.finished=true; save();
  const stats=state.stats, friend=bestFriend(), name=CAST[friend].name;
  const endings={
    together: stats.mystery>=6&&stats.ready>=2
      ? ["Настоящий выпускной","Ты нашёл способ разорвать петлю. Артём выходит вместе со всеми, а на следующий день в расписании наконец появляется настоящий понедельник. Впервые за долгое время никто не пропал. Ты сохранил и друзей, и память о них.","☀"]
      : ["Новая неделя","Вы выбираетесь из корпуса вместе. Утром телефоны показывают новую дату. Не все загадки разгаданы, зато у вас впервые появилось будущее за пределами этих семи дней.","✦"],
    memory: stats.mystery>=7
      ? ["Память сильнее времени","Ты находишь исходную запись, и Артём вспоминает путь наружу. Время перестаёт зацикливаться. Теперь он может продолжить жить своей жизнью, а вы — своей. Но встречаться по пятницам всё равно договорились.","◈"]
      : ["Ещё один понедельник","Вы нашли правду, но не успели отпустить прошлое. На экране снова загорается уведомление НГОК: «Расписание изменено». Возможно, следующая попытка будет другой.","↻"],
    friend: stats[friend]>=5
      ? ["История, которую мы выбрали", "Ты выходишь из колледжа вместе с "+name+" и остаёшься рядом, когда всё вокруг меняется. Вы не знаете ответов на все вопросы, но обещаете не терять друг друга. Иногда этого достаточно, чтобы неделя закончилась.","♡"]
      : ["До следующего звонка","Вы успеваете выбраться, но некоторые воспоминания остаются за дверью. В кармане лежит пропуск без имени. Похоже, у этой истории есть и другие маршруты.","☾"]
  };
  const [title,description,icon]=endings[type]||endings.together;
  play.hidden=true; ending.hidden=false;
  $("endingTitle").textContent=title;
  $("endingDescription").textContent=description;
  $("endingIcon").textContent=icon;
  $("endingStats").replaceChildren();
  [["Лера",stats.lera],["Миша",stats.misha],["Даша",stats.dasha],["Разгадано улик",stats.mystery]].forEach(([key,value])=>{
    const span=document.createElement("span"), strong=document.createElement("strong");
    strong.textContent=String(value); span.textContent=key+": ";span.append(strong);$("endingStats").append(span);
  });
}
function restart() { state=stateDefaults(); move("intro"); }
function showHistory() {
  const wrap=document.createElement("div");
  if(!state.history.length){wrap.textContent="Пока здесь пусто. Диалоги появятся по мере прохождения.";}
  for(const item of state.history.slice(-60)){
    const div=document.createElement("div");div.className="log-item";
    const name=document.createElement("strong");name.textContent="День "+item.day+" · "+item.speaker;
    const body=document.createElement("div");body.textContent=item.text;
    div.append(name,body);wrap.append(div);
  }
  openModal("История диалогов",wrap);
  $("modalContent").scrollTop=$("modalContent").scrollHeight;
}
function showAbout() {
  const wrap=document.createElement("div");
  wrap.innerHTML="<p><strong>«7 дней в НГОК»</strong> — оригинальная неофициальная браузерная визуальная новелла про колледж, странное расписание и друзей, с которыми можно пройти даже сквозь петлю времени.</p><p>Семь сюжетных дней, выборы, отношения с персонажами, несколько концовок и автоматическое сохранение прогресса в браузере.</p><p>Управление: клик или пробел — следующая реплика, цифры 1–3 — выбор, Esc — закрыть окно. Музыка/звуковая атмосфера включается вручную.</p><p><small>Это фанатский художественный проект. Персонажи и события вымышлены. Не является официальным проектом колледжа и не связан с создателями других визуальных новелл.</small></p>";
  openModal("О нашей истории",wrap);
}
function toggleSound() {
  audioOn=!audioOn; $("soundBtn").setAttribute("aria-pressed",String(audioOn));
  if(audioOn) {
    try {
      if(!audio){
        const ctx=new (window.AudioContext||window.webkitAudioContext)(), gain=ctx.createGain(); gain.gain.value=.025;gain.connect(ctx.destination);
        const a=ctx.createOscillator(), b=ctx.createOscillator();
        a.type="sine";b.type="sine";a.frequency.value=110;b.frequency.value=164.81;
        const ga=ctx.createGain(),gb=ctx.createGain();ga.gain.value=.46;gb.gain.value=.13;
        a.connect(ga).connect(gain);b.connect(gb).connect(gain);a.start();b.start();
        audio={ctx,gain};
      }
      audio.ctx.resume(); audio.gain.gain.setTargetAtTime(.025,audio.ctx.currentTime,.16);
      toast("Фоновая атмосфера включена");
    }catch{audioOn=false;$("soundBtn").setAttribute("aria-pressed","false");toast("Звук недоступен");}
  } else if(audio) { audio.gain.gain.setTargetAtTime(0,audio.ctx.currentTime,.12); toast("Звук выключен"); }
}
$("startBtn").onclick=restart;
$("continueBtn").onclick=()=>{const saved=safeRead();if(saved){state=saved;render();}else toast("Сохранение не найдено");};
$("homeBtn").onclick=showMenu;
$("nextBtn").onclick=next;
$("dialogue").addEventListener("click",e=>{if(!e.target.closest("button"))next();});
$("aboutBtn").onclick=showAbout;
$("historyBtn").onclick=showHistory;
$("soundBtn").onclick=toggleSound;
$("saveBtn").onclick=()=>save(true);
$("replayBtn").onclick=restart;
$("endingMenuBtn").onclick=showMenu;
$("modalCloseBtn").onclick=closeModal;
modal.addEventListener("click",e=>{if(e.target===modal)closeModal();});
document.addEventListener("keydown",e=>{
  if(!modal.hidden){if(e.key==="Escape")closeModal();return;}
  if(play.hidden)return;
  if(["Space","Enter"].includes(e.code) && !e.repeat){
    if(e.target.closest("button"))return;
    e.preventDefault();next();
  }
  if(/^[1-9]$/.test(e.key) && story[state.node].choices) choose(Number(e.key)-1);
});
$("continueBtn").hidden=!safeRead()||!!safeRead()?.finished;
