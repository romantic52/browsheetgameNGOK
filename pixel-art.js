"use strict";

/*
 * 7 ДНЕЙ В НГОК / HAND-DRAWN PIXEL ART
 * Original tile-by-tile pixel illustration. No generative-image assets,
 * no photographs embedded, no smooth paths or gradient primitives.
 * Intentional native drawing resolution: 480 × 270 (world), 128 × 180 (cast).
 * Building entrance stylized from reference: blue/white facade, rounded
 * canopy, silver pillars, white double doors, terracotta steps and ACs.
 */
(() => {
  const canvas = document.getElementById("pixelWorld");
  const character = document.getElementById("pixelPortrait");
  const world = document.getElementById("world");
  const portrait = document.getElementById("portrait");
  if (!canvas || !world) return;

  const W=480,H=270;
  const P={
    ink:"#192339",dark:"#233048",deep:"#101a31",sky:"#809db2",
    cloud:"#dfd7c8",white:"#ece5dd",ivory:"#d4d6d2",stone:"#aeb8bb",
    shade:"#88989f",shadow:"#526678",blue:"#22577b",blueLight:"#327a9a",
    steel:"#718999",steelDark:"#445a6f",glass:"#a8cfce",
    glassLit:"#f7d69e",rust:"#99576a",red:"#c96b63",redLight:"#ea9b79",
    ground:"#737880",road:"#474f62",leaf:"#c77768",green:"#4f7779",
    greenDark:"#345a60",gold:"#ffd695"
  };
  let ctx;

  function px(x,y,w,h,color) {
    if(w<=0||h<=0)return;
    ctx.fillStyle=color;ctx.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h));
  }
  function line(x1,y1,x2,y2,color,size=1){
    // Pixelated Bresenham segment, no antialiasing
    x1=Math.round(x1);y1=Math.round(y1);x2=Math.round(x2);y2=Math.round(y2);
    let dx=Math.abs(x2-x1),dy=Math.abs(y2-y1),sx=x1<x2?1:-1,sy=y1<y2?1:-1,err=dx-dy;
    for(let i=0;i<800;i++){
      px(x1,y1,size,size,color);if(x1===x2&&y1===y2)break;
      const e=2*err;if(e>-dy){err-=dy;x1+=sx;}if(e<dx){err+=dx;y1+=sy;}
    }
  }
  const chars={
    "Н":["10101","10101","10101","11111","10101","10101","10101"],
    "Г":["11111","10000","10000","10000","10000","10000","10000"],
    "О":["01110","10001","10001","10001","10001","10001","01110"],
    "К":["10001","10010","10100","11000","10100","10010","10001"],
    "7":["11111","00001","00010","00100","00100","01000","01000"],
    "4":["10010","10010","10010","11111","00010","00010","00010"],
    "0":["01110","10001","10011","10101","11001","10001","01110"],
    "А":["01110","10001","10001","11111","10001","10001","10001"],
    "П":["11111","10001","10001","10001","10001","10001","10001"],
    "Р":["11110","10001","10001","11110","10000","10000","10000"],
    "Х":["10001","10001","01010","00100","01010","10001","10001"],
    "И":["10001","10011","10101","10101","11001","10001","10001"],
    "В":["11110","10001","11110","10001","10001","10001","11110"],
    "Е":["11111","10000","10000","11110","10000","10000","11111"],
    "Т":["11111","00100","00100","00100","00100","00100","00100"],
    "С":["01111","10000","10000","10000","10000","10000","01111"],
    "М":["10001","11011","10101","10101","10001","10001","10001"],
    "Д":["01110","01010","01010","01010","11111","10001","10001"],
    "Я":["01111","10001","10001","01111","00101","01001","10001"],
    " ":["00000","00000","00000","00000","00000","00000","00000"]
  };
  function textPixel(str,x,y,scale,color){
    for(const letter of [...str.toUpperCase()]){
      const pattern=chars[letter]||chars[" "];
      pattern.forEach((row,ry)=>[...row].forEach((digit,rx)=>{
        if(digit==="1")px(x+rx*scale,y+ry*scale,scale,scale,color);
      }));
      x+=6*scale;
    }
  }
  function spark(x,y,color){
    px(x,y,2,2,color);px(x-3,y+1,2,1,color);px(x+4,y+1,2,1,color);px(x+1,y-3,1,2,color);px(x+1,y+4,1,2,color);
  }
  function sky(light){
    const night=light==="night",glitch=light==="glitch";
    const bands=night?["#111a32","#182640","#263452","#34405e"]:
      glitch?["#32243f","#503b59","#74516d","#9b6678"]:
      light==="day"?["#5886a1","#7199ae","#a3b8b9","#d4c6b7"]:
      ["#485f84","#7d809b","#bd8e99","#e1aa93"];
    bands.forEach((v,i)=>px(0,i*42,480,45,v));
    if(night){
      [[30,30],[64,62],[117,15],[161,45],[230,29],[309,17],[403,52],[441,13]].forEach(([x,y])=>spark(x,y,"#c3ced4"));
      px(373,31,20,16,"#e2d7ad");px(369,35,28,8,"#e2d7ad");px(378,27,10,25,"#e2d7ad");
      px(384,27,14,11,bands[0]);
    } else {
      px(370,36,27,27,light==="day"?"#f7ddb2":"#ffe7b7");
      px(367,42,33,15,light==="day"?"#f7ddb2":"#ffe7b7");
      [[35,43],[51,39],[72,53],[282,32],[299,34],[317,29]].forEach(([x,y])=>{
        px(x,y,35,8,"#d0c7bf");px(x+8,y-4,20,4,"#e5dace");px(x+4,y+8,39,4,"#b9b6b7");
      });
    }
  }
  function hills(){
    const skyline=[[0,165,24],[24,154,32],[56,161,35],[91,144,28],[118,157,46],[164,145,29],[193,164,37],[230,152,54],[284,146,38],[322,161,38],[360,150,30],[390,159,56],[446,144,34]];
    for(const [x,y,w] of skyline){px(x,y,w,H-y,"#55697a");px(x+4,y+8,w-8,4,"#667887");}
    px(0,186,W,84,"#5c6573");
  }
  function windowTile(x,y,w=25,h=18,lit=false){
    px(x-2,y-2,w+4,h+5,"#869da4");
    px(x,y,w,h,P.ink);
    px(x+2,y+2,w-4,h-4,lit?P.glassLit:P.glass);
    px(x+2,y+2,Math.max(5,w-9),4,lit?"#fff1c5":"#d1e7df");
    px(x+Math.floor(w/2)-1,y,2,h,P.steel);
    px(x,y+Math.floor(h/2),w,2,P.steel);
    px(x-2,y+h+2,w+4,3,P.ivory);
  }
  function canopy(x,y){
    // Curved in stepped, hand-set chunks - references real silver canopy.
    px(x-7,y+13,164,29,"#303e52");
    px(x-3,y+8,157,22,"#5c7185");
    px(x+4,y+3,143,21,"#657d8e");
    px(x+15,y,118,20,"#718696");
    px(x+14,y+23,123,3,"#aec0c6");
    for(let i=0;i<14;i++)px(x+i*10,y+3,7,2,i%3?"#8ea2ad":"#ced2ce");
    px(x+23,y+9,100,4,"#c3c9c7");
    textPixel("НГОК",x+37,y+10,2,"#cb5757");
    // Two reflective facade pillars below canopy.
    for(const cx of [x+17,x+123]){
      px(cx,y+36,7,49,"#3d5368");px(cx+2,y+36,4,48,"#9baeb2");px(cx+3,y+37,1,47,"#e5e7de");
    }
  }
  function stairs(){
    // Terracotta / off-white patterned steps directly inspired by entrance photo.
    for(let i=0;i<4;i++){
      const x=147-i*15,y=213+i*10,w=165+i*30;
      px(x,y,w,9,i%2===0?"#ae6269":"#b87873");
      px(x,y+1,w,2,"#e7ad9b");
      for(let p=x+4;p<x+w-5;p+=12){
        px(p,y+4,5,2,((p/12|0)+i)%2?"#f3d0b9":"#df9390");
        px(p+6,y+6,3,2,"#734956");
      }
      px(x,y+9,w,2,"#4d5563");
    }
  }
  function campus(light){
    sky(light);
    // Side structure and industrial rails.
    px(10,90,26,98,"#566f83");px(16,96,13,91,"#b0babf");
    px(31,96,18,91,"#344c64");
    px(45,39,425,163,"#35465d");
    px(48,35,420,158,"#9caab0");
    px(48,35,420,5,"#e0e2da");
    px(48,43,420,81,"#c9d2d1");
    px(48,124,420,70,P.blue);
    px(48,117,420,8,"#e3e6e0");
    px(48,190,420,9,"#304c6d");
    px(49,44,419,2,"#f1ede4");
    // White siding seams and blue-panel joints.
    for(let x=52;x<470;x+=23){
      px(x,49,1,68,"#a8b6ba");px(x,126,1,63,"#195377");
    }
    for(let y=52;y<124;y+=10)px(49,y,418,1,"#dfe0db");
    for(let y=131;y<191;y+=10)px(49,y,419,1,"#2a6483");
    // Visible 2 rows of windows behind curved canopy, like photo.
    for(const x of [70,132,193,256,317,379,436]) windowTile(x,54,30,22,light==="night"&&x%2===0);
    for(const x of [66,259,328,396,451]) windowTile(x,140,25,23,light==="night"&&x%2>0);
    // Structural metal frames crossing facade.
    px(251,29,3,168,"#819ca7");
    line(248,31,278,125,"#586e82",2);
    line(286,31,252,123,"#657d8a",2);
    line(435,26,468,120,"#60798a",2);
    // Air conditioners.
    for(const [ax,ay] of [[336,99],[416,145]]){
      px(ax+2,ay+4,26,20,"#364c60");
      px(ax,ay,24,18,"#c9cdd0");
      px(ax+3,ay+3,17,12,"#899fa6");
      px(ax+6,ay+5,11,8,"#44596b");
      px(ax+8,ay+6,7,5,"#a4bac0");
      px(ax+11,ay+6,2,5,"#465b6b");
    }
    // Main entrance is left-of-centre, under unmistakable grey curved canopy.
    px(174,150,51,49,"#304558");
    px(177,152,45,45,"#e6e4db");
    px(180,155,18,30,"#b48b92");
    px(201,155,18,30,"#b48b92");
    px(199,153,2,44,"#536b7e");
    px(181,157,16,5,"#bbcbd0");px(203,157,15,5,"#bbcbd0");
    px(196,174,2,3,"#f4d3b1");px(203,174,2,3,"#f4d3b1");
    px(177,184,45,4,"#c4cbcc");px(177,191,45,5,"#dadecf");
    // Notice board and doorbell.
    px(160,152,8,15,P.white);px(162,154,4,11,P.blueLight);
    px(228,170,4,7,"#d7c9b0");
    canopy(156,112);
    // Glass engineering structure on right.
    line(289,34,310,128,"#657887",2);
    line(309,34,289,128,"#657887",2);
    // Ground & landscaping.
    px(0,198,W,72,"#8c9290");
    px(0,199,W,6,"#d4c6b7");
    for(let y=207;y<263;y+=13){px(0,y,480,2,"#697b82");}
    for(let x=11;x<W;x+=24){px(x,207,1,48,"#727980");}
    // Curved mosaic red stair layers in foreground.
    stairs();
    // Paving stones.
    for(let i=0;i<12;i++){
      const x=i*43;
      px(x,250,39,3,i%2?"#6b7f82":"#8c8889");
      px(x+14,260,29,2,"#666e7b");
    }
    // Sign / bus stop in the yard.
    px(19,159,5,91,"#344653");px(19,157,30,3,"#b4bfc0");
    px(22,154,25,21,"#364c64");
    px(25,156,19,14,"#d7dad1");textPixel("7",31,160,1,"#47596c");
    // Slight autumn greenery around entrance.
    for(let i=0;i<9;i++){
      const x=384+i*11,y=203+(i%3)*4;
      px(x,y,17,11,i%2?P.green:P.greenDark);
      px(x+4,y-5,11,8,i%2?"#8d8f77":"#aa8c70");
      px(x+11,y+10,4,6,"#49596a");
    }
    [[23,239],[80,228],[317,256],[425,234],[463,247],[109,260]].forEach(([x,y],i)=>{
      px(x,y,5,2,i%2?P.leaf:"#e2b18a");px(x+3,y+2,3,1,"#8f6e75");
    });
  }
  function interiorBase(tone){
    px(0,0,W,H,tone.wall);
    px(0,0,W,19,tone.ceil);
    px(0,19,W,4,tone.line);
    px(0,191,W,79,tone.floor);
    for(let y=195;y<270;y+=19)px(0,y,W,2,tone.tile);
    for(let x=0;x<W;x+=40)px(x,194,2,76,tone.tile);
    px(0,187,W,6,tone.base);
  }
  function hall(light){
    const dark=light==="night"||light==="glitch";
    const t=dark?{wall:"#536078",ceil:"#2b354e",line:"#71859a",floor:"#45576e",tile:"#5d6b7b",base:"#2a3a54"}:
      {wall:"#92a5ae",ceil:"#586879",line:"#c5d4cf",floor:"#697a87",tile:"#8a9298",base:"#4e6577"};
    interiorBase(t);
    // Back perspective plane / framed junction.
    px(108,23,264,159,dark?"#52627a":"#c6c7bc");
    px(117,32,246,149,dark?"#677187":"#a3bac0");
    px(192,62,96,130,"#4b5c71");
    px(199,70,82,120,dark?"#4f5671":"#a5b6b5");
    px(238,70,3,120,P.steelDark);
    px(248,124,4,4,P.gold);
    // Receding tiled perspective floor.
    for(let i=0;i<14;i++){line(238,190,i*39,270,"#435365");}
    for(const y of [205,224,247])line(0,y,480,y,"#88979e",2);
    // Door frames / corridors.
    for(const [x,y,h] of [[22,67,122],[390,67,122]]){
      px(x-5,y-4,73,h+11,"#364e66");
      px(x,y,63,h,"#72859a");
      px(x+9,y+9,34,55,"#a6c2c0");
      px(x+46,y+70,5,6,P.gold);
      px(x+3,y+h-15,57,3,"#4f657a");
    }
    // Posters
    px(125,71,49,64,"#1e3e5c");px(130,76,39,53,"#e4d9c7");
    textPixel("НГОК",134,80,1,"#567087");
    px(131,95,35,4,"#c96d71");px(131,104,30,3,"#668c91");px(131,114,35,2,"#b3ad9c");
    px(309,71,52,64,"#3d5068");px(314,76,42,53,"#c1c9be");
    textPixel("7",322,86,3,"#bb7a81");
    // Lighting panels, intentional hard edges.
    for(const x of [55,203,354]){
      px(x,10,65,7,dark?"#9ba3ae":"#f4ebcd");px(x+8,12,42,2,"#fff3d9");
    }
    px(0,164,W,7,dark?"#39475f":"#849aa6");
  }
  function classroom(light){
    const dark=light==="night"||light==="glitch";
    interiorBase({wall:dark?"#626a81":"#9daab0",ceil:"#495c77",line:"#c2c7bb",floor:"#56687b",tile:"#667a86",base:"#5a6577"});
    // Big left windows, shaded with checker highlights.
    for(const x of [24,113]){
      px(x-5,32,84,107,"#506a81");
      px(x,37,74,96,dark?"#536080":"#b4d2ce");
      px(x+34,37,5,96,"#e7dfd0");
      px(x,81,75,5,"#e5ddca");
      px(x+6,45,25,9,dark?"#c49ca3":"#e7e6d4");
      px(x+53,92,9,20,dark?"#4e6b82":"#7e9a9c");
    }
    // blackboard, chalk
    px(228,33,214,113,"#d0bca1");
    px(234,39,202,99,"#294e55");
    px(236,41,198,5,"#406e73");
    textPixel("7",255,64,4,"#c9dfc4");
    textPixel("НГОК",300,81,2,"#a6cfbd");
    px(250,111,153,2,"#a4c4bb");px(250,118,108,2,"#8db5a7");
    px(232,140,208,5,"#b9ac97");px(393,138,22,2,"#f5dfba");
    // paired desks, perspective by row
    for(const [y,scale] of [[162,1],[207,1.3]]){
      for(const x of [17,183,347]){
        const w=103*scale|0;
        px(x,y,w,13,"#b68b78");px(x+4,y+3,w-7,5,"#deb298");
        px(x+8,y+13,5,34*scale,"#45556b");
        px(x+w-14,y+13,5,34*scale,"#45556b");
        px(x+26,y-11,55,9,"#546d83");
      }
    }
    px(423,160,23,31,"#b4c4c8");px(427,152,16,12,"#e1d3c7");
  }
  function cafe(light){
    const dark=light==="night"||light==="glitch";
    interiorBase({wall:dark?"#655773":"#b99e99",ceil:"#564557",line:"#e2bbb0",floor:"#806b72",tile:"#9a8886",base:"#79616a"});
    // Tiled cafe counter-wall and window.
    px(21,36,120,111,"#6c606c");px(27,42,108,99,dark?"#4e5675":"#bbc6c4");
    for(const y of [57,78,99]){px(32,y,99,2,"#d5c0ad");}
    px(79,42,4,99,"#eadac3");
    px(203,37,249,119,"#79636a");
    px(214,45,224,104,"#614e5d");
    for(let i=0;i<3;i++){
      const x=219+i*74;
      px(x,57,57,49,"#b18f7e");px(x+6,63,44,4,"#f1d1ac");
      px(x+6,74,38,3,"#e2bcb0");
      px(x+6,83,30,3,"#e2bcb0");
    }
    px(192,144,276,28,"#d9b6a2");px(192,167,276,60,"#886b71");
    for(let x=218;x<454;x+=48){px(x,180,22,30,"#9f7779");px(x+6,185,10,5,"#b58b7a");}
    for(let x of [240,365]){
      px(x,24,3,29,"#2e3345");
      px(x-16,52,35,10,"#f4d4a3");
      px(x-11,62,24,3,"#e3caa7");
    }
    px(25,225,149,13,"#bf9c89");px(43,238,6,35,"#364c60");px(148,238,6,35,"#364c60");
    px(66,216,24,16,"#ece4d3");px(85,220,9,10,"#ece4d3");px(68,231,26,2,"#6f5a5d");
    // Coffee machine and pastry in counter.
    px(319,117,38,26,"#3b485a");px(322,121,31,6,"#a4b7b5");
    px(328,133,16,7,"#ede7d5");px(355,141,7,3,"#dcd9ca");
    px(393,128,28,12,"#d8b18f");px(395,127,20,6,"#e8c2a3");
  }
  function lab(light){
    const dark=light==="night"||light==="glitch";
    interiorBase({wall:dark?"#35455e":"#66849a",ceil:"#26394f",line:"#7ca1a4",floor:"#435b70",tile:"#537184",base:"#41536c"});
    px(30,30,419,97,"#33485f");
    for(let i=0;i<7;i++){
      const x=40+i*58;
      px(x,37,47,82,"#657f92");
      px(x+5,44,37,64,dark?"#182b46":"#a3bab9");
      px(x+10,49,23,4,"#c2dad2");
    }
    px(0,150,W,13,"#9b8d8f");
    px(0,163,W,31,"#45475c");
    px(31,188,8,71,"#28374c");px(430,188,8,71,"#28374c");
    for(const x of [50,172,294]){
      px(x,102,103,67,"#222d47");
      px(x+5,107,93,53,dark?"#69bb9c":"#6c9ec0");
      px(x+11,113,69,3,"#c4edd2");
      px(x+11,121,40,3,"#c4edd2");
      px(x+11,129,64,3,dark?"#e9a8ab":"#e1d0a6");
      px(x+30,169,9,8,"#273348");px(x+13,177,66,4,"#b7b7ac");
      px(x+9,186,85,4,"#b2a0a0");
      px(x+104,134,8,25,"#ced1c6");
    }
    px(420,29,32,104,"#172a43");for(let y=40;y<122;y+=13){
      px(425,y,22,8,"#467b87");px(429,y+2,7,2,y%2?"#9de3c9":"#edbc9c");
    }
    if(dark){
      for(const [x,y] of [[83,136],[195,150],[302,122]])spark(x,y,"#c5f0ce");
    }
  }
  function rooftop(light){
    const night=light==="night"||light==="glitch";
    sky(night?"night":"sunset");
    // skyline in layers with precise 8-bit stair shapes
    for(const [x,y,w] of [[0,149,33],[30,135,39],[67,160,20],[88,121,48],[135,143,33],[170,111,37],[209,151,52],[259,133,29],[290,147,31],[319,113,44],[364,140,38],[405,120,30],[438,153,42]]){
      px(x,y,w,83,night?"#263550":"#596b7b");
      px(x,y+6,w,3,night?"#364763":"#77838d");
      for(let wy=y+17;wy<202;wy+=13)for(let wx=x+6;wx<x+w-4;wx+=12)px(wx,wy,4,5,night?"#bbad97":"#3c576c");
    }
    px(0,188,W,82,"#546476");px(0,190,W,11,"#37485c");px(0,203,W,4,"#89939b");
    for(let x=17;x<480;x+=58)px(x,203,6,67,"#3a485d");
    px(0,219,W,4,"#cad0c8");
    for(let x=0;x<480;x+=22)px(x+5,224,3,46,"#63788a");
    px(0,254,W,16,"#3d4b62");
    px(352,176,14,14,"#b7b2ae");px(350,187,19,4,"#788392");
    px(69,207,42,3,"#a6a9a9");
    px(75,198,4,9,"#c8b49e");
  }
  function archive(light){
    interiorBase({wall:"#47526b",ceil:"#242f48",line:"#9ca5a5",floor:"#525b6b",tile:"#64727c",base:"#424f67"});
    for(let i=0;i<4;i++){
      const x=17+i*117;
      px(x,25,104,159,"#1f2f47");px(x+5,30,94,149,"#516277");
      for(let j=0;j<4;j++){
        const y=41+j*33;
        px(x+9,y,86,5,"#23384d");
        for(let k=0;k<6;k++){
          const xx=x+13+k*12;
          const col=["#b99d87","#d2c2a9","#a6a7a0","#7b9fa2","#c4ada0","#e0d3b9"][(k+i+j)%6];
          px(xx,y-17,9,19,col);px(xx+2,y-14,2,9,"#ede7d3");
        }
        px(x+8,y+2,88,3,"#a4a3a1");
      }
    }
    // The ominous 7 day archive folder
    px(192,185,98,66,"#2a374e");px(200,182,81,62,"#ad9080");
    px(213,194,57,36,"#ded2b7");textPixel("7",234,200,3,"#80576b");
    px(206,239,71,3,"#7d6c70");
    px(0,245,W,25,"#273750");
  }
  function portraitArt(person){
    if(!character)return;
    const ctx2=character.getContext("2d",{alpha:true});if(!ctx2)return;
    ctx=ctx2; ctx.clearRect(0,0,128,180);
    const faces={
      lera:{hair:"#ab657e",hairHi:"#dd96a7",skin:"#edba9c",skinHi:"#f3d6b8",coat:"#444668",coatHi:"#6c6c8d",shirt:"#d9d9db",bangs:"long",accent:"#e1a6bd"},
      misha:{hair:"#343d58",hairHi:"#56617e",skin:"#daa789",skinHi:"#eed0aa",coat:"#456079",coatHi:"#7291a1",shirt:"#d2c8b9",bangs:"short",accent:"#a9cfde"},
      dasha:{hair:"#906347",hairHi:"#bf8b60",skin:"#e9b398",skinHi:"#f4d1ad",coat:"#765875",coatHi:"#a07793",shirt:"#f0ddd0",bangs:"long",accent:"#e6cd92"},
      artem:{hair:"#343145",hairHi:"#6c6179",skin:"#dbab91",skinHi:"#efd0ab",coat:"#705247",coatHi:"#a78067",shirt:"#d1c2a5",bangs:"short",accent:"#dcb68c"}
    };
    const c=faces[person]||faces.lera;
    const dark="#202339",outline="#24283d";
    // Shadow - made from intentionally sized pixel rectangles.
    px(7,170,114,9,"#17263d");
    px(17,166,95,12,"#253148");
    // Back long hair.
    px(31,41,66,92,c.hair);
    px(26,58,13,94,c.hair);px(88,62,14,88,c.hair);
    px(31,136,15,23,c.hair);
    // Jacket silhouette in stepped blocks.
    px(34,122,58,18,outline);
    px(22,131,83,16,outline);
    px(15,146,98,34,outline);
    px(19,146,90,34,c.coat);
    px(24,139,80,14,c.coat);
    px(31,133,66,14,c.coat);
    px(38,130,52,13,c.coatHi);
    px(53,125,24,28,c.skin);
    // shirt & lapels
    px(53,138,25,38,c.shirt);px(43,139,13,12,c.coatHi);px(79,140,13,13,c.coatHi);
    px(47,143,8,19,c.coatHi);px(79,143,8,19,c.coatHi);
    px(57,147,17,18,c.accent);px(60,151,12,5,c.shirt);
    px(38,163,6,17,c.coatHi);px(86,162,5,18,c.coatHi);
    px(56,168,18,4,dark);
    // Head, face and hair arranged on the grid.
    px(38,30,51,88,c.hair);
    px(31,37,67,67,c.hair);px(27,46,76,42,c.hair);
    px(39,57,52,59,c.skin);
    px(34,69,6,23,c.skin);px(91,67,6,23,c.skin);
    px(43,69,44,39,c.skinHi);
    px(43,109,44,7,c.skin);
    px(46,113,38,6,c.skin);
    // side hair / fringe pixel chunks
    px(30,44,16,73,c.hair);px(88,48,14,74,c.hair);
    px(35,34,54,14,c.hairHi);px(29,43,65,15,c.hair);
    px(36,29,53,8,c.hair);px(43,23,39,8,c.hairHi);
    if(c.bangs==="long"){
      px(37,50,42,13,c.hair);
      px(38,61,25,9,c.hair);px(60,55,29,11,c.hairHi);
      px(40,66,14,7,c.hair);
      px(28,105,12,50,c.hair);px(89,105,13,46,c.hair);
      px(29,132,10,11,c.hairHi);
    } else {
      px(33,46,60,13,c.hair);
      px(34,57,37,8,c.hair);
      px(72,52,22,13,c.hairHi);
      px(32,65,9,21,c.hair);
      px(91,67,8,22,c.hair);
    }
    // eyes, eyebrows, nose, blush, smile - 2-4px sprite highlights.
    px(49,80,10,3,dark);px(74,80,10,3,dark);
    px(50,86,8,6,"#34384a");px(75,86,8,6,"#34384a");
    px(52,86,2,3,"#d3d8d3");px(77,86,2,3,"#d3d8d3");
    px(48,98,8,3,"#dd9a91");px(79,98,8,3,"#dd9a91");
    px(66,95,4,5,"#cf987e");px(65,99,8,2,"#deab97");
    px(57,107,19,2,"#944f61");px(62,110,10,2,"#ca7d78");
    // Pixel clothing motifs per character.
    if(person==="misha"){
      px(35,21,57,8,"#273d56");px(44,18,40,5,"#405b75");
      px(79,26,19,5,"#273d56");px(66,149,4,20,"#41516b");
    }
    if(person==="dasha"){
      px(49,149,4,20,c.accent);px(75,149,4,20,c.accent);
      px(26,125,10,10,"#dbb8a2");
    }
    if(person==="lera"){
      px(20,153,8,5,c.accent);px(98,155,9,5,c.accent);
    }
    if(person==="artem"){
      px(46,153,34,6,"#d3b89b");px(54,162,20,3,"#9f8069");
    }
  }
  function draw(){
    const selected=world.dataset.scene||"campus";
    const light=world.dataset.light||"sunset";
    const bg=canvas.getContext("2d",{alpha:false});
    if(!bg)return;
    ctx=bg;ctx.imageSmoothingEnabled=false;
    const scenes={campus,hall,class:classroom,cafe,roof:rooftop,lab,archive};
    (scenes[selected]||campus)(light);
    if(character&&!portrait.hidden){
      portraitArt(portrait.dataset.persona||"lera");
    }
  }
  let scheduled=false;
  function schedule(){
    if(scheduled)return;
    scheduled=true;
    queueMicrotask(()=>{scheduled=false;draw();});
  }
  const options={attributes:true,attributeFilter:["data-scene","data-light","data-persona","hidden"]};
  new MutationObserver(schedule).observe(world,options);
  if(portrait)new MutationObserver(schedule).observe(portrait,options);
  draw();
})();
