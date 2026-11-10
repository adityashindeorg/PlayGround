import * as THREE from 'three';

const canvas = document.querySelector('#world');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.8));
renderer.setSize(innerWidth, innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.12;
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x121723);
scene.fog = new THREE.FogExp2(0x141923, 0.012);
const camera = new THREE.PerspectiveCamera(54, innerWidth / innerHeight, 0.1, 280);
const clock = new THREE.Clock();
const world = new THREE.Group(); scene.add(world);
const ambient = new THREE.HemisphereLight(0x9caec9, 0x24212a, 1.55); scene.add(ambient);
const moon = new THREE.DirectionalLight(0xc8d7ff, 2.45); moon.position.set(-25, 34, -9); moon.castShadow = true;
moon.shadow.mapSize.set(1024, 1024); moon.shadow.camera.left = -48; moon.shadow.camera.right = 48; moon.shadow.camera.top = 48; moon.shadow.camera.bottom = -48; scene.add(moon);
const redLight = new THREE.PointLight(0xe44c50, 38, 35, 2); redLight.position.set(0, 5, 37); world.add(redLight);
const goldLight = new THREE.PointLight(0xe5a95e, 22, 30, 2); goldLight.position.set(0, 3, 54); world.add(goldLight);
const mats = {};
const mat = (name, color, roughness = .86, extra = {}) => mats[name] ||= new THREE.MeshStandardMaterial({ color, roughness, ...extra });
const boxGeo = new THREE.BoxGeometry(1,1,1);
function box(parent, name, pos, size, material, cast = true) { const m = new THREE.Mesh(boxGeo, material); m.name=name; m.position.set(...pos); m.scale.set(...size); m.castShadow=cast; m.receiveShadow=true; parent.add(m); return m; }
function sphere(parent, pos, scale, material, seg=12) { const m = new THREE.Mesh(new THREE.SphereGeometry(1,seg,Math.max(8,seg-2)),material); m.position.set(...pos); m.scale.set(...scale); m.castShadow=true; m.receiveShadow=true; parent.add(m); return m; }
function cylinder(parent, pos, radiusTop, radiusBottom, height, material, seg=8) { const m = new THREE.Mesh(new THREE.CylinderGeometry(radiusTop,radiusBottom,height,seg),material); m.position.set(...pos); m.castShadow=true; m.receiveShadow=true; parent.add(m); return m; }
function plane(parent, pos, size, material) { const m = new THREE.Mesh(new THREE.PlaneGeometry(...size),material); m.rotation.x=-Math.PI/2; m.position.set(...pos); m.receiveShadow=true; parent.add(m); return m; }

// Campus grounds and the path through the veil.
plane(world,[0,-.12,12],[220,220],mat('earth',0x252731));
plane(world,[0,-.07,15],[9,125],mat('path',0x34333a));
for(let i=0;i<38;i++){
  const z=-45+i*3.2;
  box(world,'path-stone',[Math.sin(i*8)*.55,-.015,z],[2.2,.045,2.1],mat('stone'+i, i%3===0?0x49474b:0x3e3d43),false);
  if(i%2===0){const x=(i%4?1:-1)*(5.5+Math.sin(i*4)*2); const s=.6+(i%5)*.24;
    cylinder(world,[x,.9,z+Math.cos(i)*2],.2*s,.5*s,1.8*s,mat('trunk'+i,0x292a30),6);
    const crown=sphere(world,[x,2.5*s,z+Math.cos(i)*2],[1.3*s,2.3*s,1.3*s],mat('canopy'+i,i%3===0?0x263839:0x202d32),8); crown.castShadow=true;
    sphere(world,[x-.45*s,2.2*s,z+1],[.5*s,1.05*s,.55*s],mat('canopyb'+i,0x263538),8);
  }
}
// Mossy boundary walls, lanterns and torii gate.
for(const side of [-1,1]){
  for(let i=0;i<8;i++){
    const z=-27+i*13;
    box(world,'wall',[side*12,1.2,z],[.55,2.4,12.9],mat('wall'+side+i,0x33323a));
    box(world,'wallcap',[side*12,2.45,z],[.85,.22,13],mat('wallcap'+side+i,0x48434a));
    if(i%2===0){const x=side*8.2; cylinder(world,[x,1.15,z+4],.08,.12,2.3,mat('lampstand'+i,0x353038),8);box(world,'lantern',[x,2.25,z+4],[.65,.8,.65],mat('lantern'+side+i,0xe6a45e,.4,{emissive:0xc4522a,emissiveIntensity:1.6}));}
  }
}
// Training hall — a timber dojo tucked into the trees.
const dojo= new THREE.Group(); dojo.position.set(0,0,45); world.add(dojo);
box(dojo,'dojo-base',[0,.15,0],[17,.5,12],mat('base',0x38333a));
box(dojo,'dojo-floor',[0,.45,0],[16,.18,11],mat('woodfloor',0x60473e));
box(dojo,'dojo-back',[0,3.2,5.25],[16,5.5,.55],mat('darkwood',0x3c2b2d));
box(dojo,'dojo-sideL',[-7.6,3.1,0],[.5,5.3,10],mat('woodL',0x493234)); box(dojo,'dojo-sideR',[7.6,3.1,0],[.5,5.3,10],mat('woodR',0x493234));
box(dojo,'dojo-front',[0,5.7,0],[18,.45,12],mat('roof',0x24242e));
for(const x of [-7,7]){box(dojo,'pillar',[x,2.9,-4.8],[.48,5.7,.48],mat('pillar'+x,0x6a4240));box(dojo,'pillar-foot',[x,.25,-4.8],[.8,.5,.8],mat('foot'+x,0x39343c));}
for(let i=-5;i<=5;i+=2.5)box(dojo,'rafter',[i,5.98,-.3],[.22,.25,12.2],mat('rafter'+i,0x403237));
box(dojo,'dojo-sign',[0,3.3,-5.58],[3.3,1.4,.18],mat('sign',0x211d25));
const signKanji = new THREE.Mesh(new THREE.PlaneGeometry(1.35,1.05),new THREE.MeshBasicMaterial({color:0xe9d8bd}));signKanji.position.set(0,3.35,-5.46);dojo.add(signKanji);
// Vermilion gate marks the threshold.
const gate=new THREE.Group(); gate.position.set(0,0,23);world.add(gate);
const redWood=mat('redwood',0x8e3039);
for(const x of [-4.3,4.3]){box(gate,'gate-post',[x,3,0],[.62,6,.68],redWood);box(gate,'gate-foot',[x,.35,0],[1,.7,1],mat('gatefoot',0x39333a));}
box(gate,'gate-beam',[0,5.85,0],[11,.7,1],redWood);box(gate,'gate-cap',[0,6.35,0],[12,.28,1.5],mat('gatecap',0x28252c));box(gate,'gate-cross',[0,4.8,.05],[8,.3,.75],redWood);
// Ritual seal and surrounding candles.
const seal = new THREE.Group();seal.position.set(0,.02,59);world.add(seal);
const sealMat=new THREE.MeshBasicMaterial({color:0xd54d54,transparent:true,opacity:.8,side:THREE.DoubleSide});
const ring=new THREE.Mesh(new THREE.RingGeometry(3.2,3.35,64),sealMat);ring.rotation.x=-Math.PI/2;seal.add(ring);
const ring2=new THREE.Mesh(new THREE.RingGeometry(2.1,2.18,64),new THREE.MeshBasicMaterial({color:0xe49d68,transparent:true,opacity:.7,side:THREE.DoubleSide}));ring2.rotation.x=-Math.PI/2;seal.add(ring2);
for(let i=0;i<8;i++){const a=i*Math.PI/4;const x=Math.cos(a)*3.9,z=Math.sin(a)*3.9;cylinder(world,[x,.35,59+z],.1,.13,.7,mat('candle'+i,0x49393b));sphere(world,[x,.78,59+z],[.1,.2,.1],mat('flame'+i,0xffa364,.3,{emissive:0xff6935,emissiveIntensity:2}));}
// Distant silhouette city and moon.
sphere(scene,[-35,44,70],[7,7,7],new THREE.MeshBasicMaterial({color:0xd6d9e8}),24);
for(let i=0;i<28;i++){const x=-85+i*6.4;const h=5+(Math.sin(i*9)+1)*8;box(world,'city',[x,h/2,104],[4,h,4],mat('building'+i,0x1b202b),false);for(let y=1;y<h;y+=2)box(world,'window',[x+(i%2?.4:-.4),y,101.95],[.22,.45,.04],mat('window'+i+y,0x706b65,.5,{emissive:0x514b44,emissiveIntensity:.3}),false);}

const roster=[
 {name:'YUJI ITADORI',kanji:'悠',style:'DIVERGENT FIST',attack:'BLACK FLASH',skill:'CURSED BURST',coat:0x332c38,shirt:0xc54850,hair:0xa94a4b,accent:0xe55c5c},
 {name:'NOBARA KUGISAKI',kanji:'釘',style:'STRAW DOLL TECHNIQUE',attack:'HAMMER STRIKE',skill:'RESONANCE',coat:0x352d2b,shirt:0x9e542d,hair:0xb26b3c,accent:0xe5a454},
 {name:'MEGUMI FUSHIGURO',kanji:'恵',style:'TEN SHADOWS',attack:'SHADOW SLASH',skill:'DIVINE DOG',coat:0x252b37,shirt:0x2d394e,hair:0x202531,accent:0x7290d4}
];
function makeSorcerer(index=0){
 const group=new THREE.Group(), rig=new THREE.Group();group.add(rig);group.userData.rig=rig;group.userData.parts=[];
 const c=roster[index], skin=mat('skin'+index,0xe4b69e), hair=mat('hair'+index,c.hair), coat=mat('coat'+index,c.coat), shirt=mat('shirt'+index,c.shirt), boots=mat('boots'+index,0x201e26), glow=mat('glow'+index,c.accent,.35,{emissive:c.accent,emissiveIntensity:.45});
 sphere(rig,[0,1.58,0],[.35,.38,.31],skin);
 sphere(rig,[0,1.91,-.02],[.39,.24,.35],hair);
 for(let s of [-1,1])sphere(rig,[s*.3,1.86,.02],[.19,.24,.24],hair,10);
 // Face marks and eyes face forward along +Z.
 box(rig,'eyeL',[-.12,1.6,.295],[.07,.035,.025],mat('eye'+index,0x29242a),false);box(rig,'eyeR',[.12,1.6,.295],[.07,.035,.025],mat('eyeR'+index,0x29242a),false);
 box(rig,'torso',[0,1.03,0],[.75,.78,.42],coat);
 box(rig,'collar',[0,1.39,.04],[.58,.22,.46],shirt);
 box(rig,'belt',[0,.68,.01],[.7,.12,.43],mat('belt'+index,0x171820));
 const arms=[],legs=[];
 for(const s of [-1,1]){
   const arm=new THREE.Group();arm.position.set(s*.48,1.28,0);rig.add(arm);box(arm,'sleeve',[s*.12,-.22,0],[.28,.6,.31],coat);sphere(arm,[s*.15,-.51,.02],[.13,.14,.13],skin,10);arms.push(arm);
   const leg=new THREE.Group();leg.position.set(s*.2,.62,0);rig.add(leg);box(leg,'leg',[0,-.21,0],[.28,.62,.34],mat('pants'+index,c.index===2?0x171b26:0x27252d));box(leg,'shoe',[0,-.52,.07],[.32,.16,.48],boots);legs.push(leg);
 }
 group.userData.parts={arms,legs,glow};
 // Character aura ring.
 const aura=new THREE.Mesh(new THREE.RingGeometry(.48,.54,36),new THREE.MeshBasicMaterial({color:c.accent,transparent:true,opacity:.24,side:THREE.DoubleSide}));aura.rotation.x=-Math.PI/2;aura.position.y=.045;group.add(aura);group.userData.aura=aura;
 group.castShadow=true;group.traverse(o=>{if(o.isMesh)o.castShadow=true;});
 return group;
}
const player=new THREE.Group();player.userData.actor=makeSorcerer(0);player.add(player.userData.actor);player.position.set(0,0,-18);world.add(player);
const groundRing=new THREE.Mesh(new THREE.CircleGeometry(.65,32),new THREE.MeshBasicMaterial({color:0x000000,transparent:true,opacity:.23}));groundRing.rotation.x=-Math.PI/2;groundRing.position.y=.012;player.add(groundRing);

const enemies=[];const effects=[];const pickups=[];
const enemyMat=mat('curseBody',0x342b3b,.64,{emissive:0x6a1534,emissiveIntensity:.65});
const enemyGlow=mat('curseGlow',0xef4058,.38,{emissive:0xf02c58,emissiveIntensity:2});
function makeCurse(boss=false){
 const g=new THREE.Group();
 const size=boss?1.8:1;
 sphere(g,[0,1.05*size,0],[.57*size,.68*size,.48*size],enemyMat,14);
 sphere(g,[0,1.22*size,.33*size],[.34*size,.27*size,.18*size],mat('facecurse',0x17131b),12);
 for(const s of [-1,1])sphere(g,[s*.17*size,1.28*size,.49*size],[.075*size,.08*size,.05*size],enemyGlow,8);
 for(let i=0;i<3;i++){const t=new THREE.Mesh(new THREE.ConeGeometry(.22*size,.8*size,7),enemyMat);t.position.set((i-1)*.33*size,1.7*size,-.1*size);t.rotation.z=(i-1)*-.45;g.add(t);}
 for(let s of [-1,1]){const limb=new THREE.Mesh(new THREE.CylinderGeometry(.08*size,.14*size,.75*size,7),enemyMat);limb.position.set(s*.58*size,.78*size,.03);limb.rotation.z=s*.45;g.add(limb);}
 const eye=new THREE.PointLight(0xef3054,boss?20:7,5);eye.position.set(0,1.3,.7);g.add(eye);
 g.traverse(o=>{if(o.isMesh){o.castShadow=true;o.receiveShadow=true;}});
 g.userData={hp:boss?160:38,maxHp:boss?160:38,boss,attackCooldown:0,dead:false,phase:0,root:g};return g;
}
function spawnCurse(x,z,boss=false){const e=makeCurse(boss);e.position.set(x,0,z);world.add(e);enemies.push(e);return e;}
function burst(position,color=0xe84a58,count=20,power=1){
 const group=new THREE.Group();group.position.copy(position);world.add(group);const material=new THREE.MeshBasicMaterial({color,transparent:true,opacity:.9});
 for(let i=0;i<count;i++){const m=new THREE.Mesh(new THREE.SphereGeometry(.055+Math.random()*.07,6,6),material);m.position.set((Math.random()-.5)*.8,(Math.random()-.5)*.8,(Math.random()-.5)*.8);m.userData.vel=new THREE.Vector3((Math.random()-.5)*power,Math.random()*power,(Math.random()-.5)*power);group.add(m);}
 effects.push({group,life:.7,max:.7});
}
function slashEffect(position,color=0xff4a5e){const geo=new THREE.TorusGeometry(1.35,.055,6,40);const m=new THREE.Mesh(geo,new THREE.MeshBasicMaterial({color,transparent:true,opacity:.9}));m.position.copy(position);m.position.y=1.1;m.rotation.x=Math.PI/2;world.add(m);effects.push({mesh:m,life:.28,max:.28,scale:true});}
const state={started:false,paused:false,over:false,dialogue:false,stage:0,health:100,energy:100,character:0,attacking:0,skillCooldown:0,dashTimer:0,invulnerable:0,time:0,killCount:0,mouseDown:false,cameraYaw:0,cameraPitch:.26,nearSeal:false};
const ui={title:document.querySelector('#title-screen'),hud:document.querySelector('#hud'),pause:document.querySelector('#pause-screen'),end:document.querySelector('#end-screen'),loading:document.querySelector('#loading'),dialogue:document.querySelector('#dialogue'),dialogueName:document.querySelector('#dialogue-name'),dialogueText:document.querySelector('#dialogue-text'),toast:document.querySelector('#toast'),mission:document.querySelector('#mission-banner'),missionText:document.querySelector('#mission-banner-text'),objective:document.querySelector('#objective-text'),health:document.querySelector('#health-bar'),healthText:document.querySelector('#health-text'),energy:document.querySelector('#energy-bar'),energyText:document.querySelector('#energy-text'),interact:document.querySelector('#interact-prompt')};
function setToast(text){ui.toast.textContent=text;ui.toast.classList.add('show');clearTimeout(setToast.timer);setToast.timer=setTimeout(()=>ui.toast.classList.remove('show'),2100);}
function mission(text,objective){ui.missionText.textContent=text;ui.mission.classList.add('show');ui.objective.textContent=objective;clearTimeout(mission.timer);mission.timer=setTimeout(()=>ui.mission.classList.remove('show'),2800);}
function updateBars(){ui.health.style.width=`${Math.max(0,state.health)}%`;ui.healthText.textContent=`${Math.ceil(state.health)} / 100`;ui.energy.style.width=`${state.energy}%`;ui.energyText.textContent=`${Math.ceil(state.energy)}%`;}
function updateCharacter(){const c=roster[state.character];document.querySelector('#char-avatar').textContent=c.kanji;document.querySelector('#character-name').textContent=c.name;document.querySelector('#character-style').textContent=c.style;document.querySelector('#attack-label').textContent=c.attack;document.querySelector('#skill-label').textContent=c.skill;}
let dialogueQueue=[],dialogueDone=null;
function say(lines,onDone){dialogueQueue=lines.slice();dialogueDone=onDone;state.dialogue=true;showLine();}
function showLine(){if(!dialogueQueue.length){ui.dialogue.classList.add('hidden');state.dialogue=false;const fn=dialogueDone;dialogueDone=null;if(fn)fn();return;}const line=dialogueQueue.shift();ui.dialogueName.textContent=line[0];ui.dialogueText.textContent=line[1];ui.dialogue.classList.remove('hidden');}
document.querySelector('#dialogue-next').addEventListener('click',showLine);
function startGame(){state.started=true;state.paused=false;ui.title.classList.remove('visible');ui.hud.classList.remove('hidden');document.querySelector('#game-shell').classList.add('touch-visible');mission('FIELD REPORT 01','Reach the old training hall');say([['GOJO SATORU','The veil is holding, but not for long. There’s a cursed object inside the old training hall. Find it before the spirits do.'],['GOJO SATORU','Your classmates are close by. Keep your eyes open, Yuji. And try not to break the school this time.']],()=>setToast('MISSION STARTED · HEAD THROUGH THE RED GATE'));}
document.querySelector('#start-button').addEventListener('click',startGame);
document.querySelector('#pause-button').addEventListener('click',togglePause);document.querySelector('#resume-button').addEventListener('click',togglePause);
function togglePause(){if(!state.started||state.over||state.dialogue)return;state.paused=!state.paused;ui.pause.classList.toggle('visible',state.paused);}
document.querySelector('#restart-button').addEventListener('click',()=>location.reload());
function switchCharacter(){if(state.dialogue||state.paused||state.over)return;state.character=(state.character+1)%roster.length;player.remove(player.userData.actor);player.userData.actor=makeSorcerer(state.character);player.add(player.userData.actor);updateCharacter();burst(player.position.clone().add(new THREE.Vector3(0,1,0)),roster[state.character].accent,12,.8);setToast(`${roster[state.character].name} · ${roster[state.character].style}`);}
function doAttack(){if(!state.started||state.paused||state.over||state.dialogue||state.attacking>0)return;state.attacking=.34;player.userData.actor.userData.rig.rotation.x=-.3;slashEffect(player.position.clone().add(new THREE.Vector3(0,.1,0)),roster[state.character].accent);let hit=false;
 for(const e of enemies){if(e.userData.dead)continue;const d=player.position.distanceTo(e.position);if(d<4.2){const dir=new THREE.Vector3().subVectors(e.position,player.position);const forward=new THREE.Vector3(0,0,1).applyQuaternion(player.quaternion);if(dir.normalize().dot(forward)>.08||d<1.6){damageEnemy(e,state.character===0?32:25);hit=true;}}}
 if(hit&&Math.random()<.38){state.energy=Math.min(100,state.energy+9);updateBars();}
}
function doSkill(){if(!state.started||state.paused||state.over||state.dialogue||state.energy<28||state.skillCooldown>0)return;state.energy-=28;state.skillCooldown=1.15;updateBars();const c=state.character;color: {
 const color=roster[c].accent;const shock=new THREE.Mesh(new THREE.SphereGeometry(1,16,12),new THREE.MeshBasicMaterial({color,transparent:true,opacity:.27,wireframe:true}));shock.position.copy(player.position);shock.position.y=1;world.add(shock);effects.push({mesh:shock,life:.55,max:.55,scale:true});
 for(const e of enemies){if(!e.userData.dead&&e.position.distanceTo(player.position)<8.5)damageEnemy(e,c===2?60:52);}
 burst(player.position.clone().add(new THREE.Vector3(0,1,0)),color,26,1.8);setToast(`${roster[c].skill.toUpperCase()}!`);
 }}
function damageEnemy(e,amount){if(e.userData.dead)return;e.userData.hp-=amount;burst(e.position.clone().add(new THREE.Vector3(0,1,0)),0xf14c60,8,.7);e.scale.setScalar(e.userData.boss?1.8:1);e.userData.hitFlash=.13;
 if(e.userData.hp<=0){e.userData.dead=true;burst(e.position.clone().add(new THREE.Vector3(0,1,0)),0xff6170,e.userData.boss?52:23,e.userData.boss?2.5:1.5);if(e.userData.boss)finishMission();else{state.killCount++;state.energy=Math.min(100,state.energy+8);updateBars();}setTimeout(()=>{if(e.parent)e.parent.remove(e);},360);}
}
function doDash(){if(!state.started||state.paused||state.over||state.dialogue||state.energy<10||state.dashTimer>0)return;state.energy-=10;state.dashTimer=.22;state.invulnerable=.42;updateBars();const f=new THREE.Vector3(0,0,1).applyQuaternion(player.quaternion);player.position.addScaledVector(f,3.8);burst(player.position.clone().add(new THREE.Vector3(0,.3,0)),roster[state.character].accent,8,1.1);}
function doInteract(){if(state.dialogue){showLine();return;}if(state.paused||state.over)return;
 if(state.stage===2&&player.position.distanceTo(seal.position)<6){state.stage=3;seal.scale.setScalar(1.3);say([['NOBARA KUGISAKI','This thing is crawling with cursed energy. The object’s inside.'],['MEGUMI FUSHIGURO','Something’s coming through the veil. Get ready!']],()=>{spawnCurse(0,68,true);mission('SPECIAL GRADE DETECTED','Exorcise the special grade curse');document.querySelector('#area-name').textContent='RITUAL CLEARING';setToast('SPECIAL GRADE CURSE · STAY SHARP');});}
}
document.addEventListener('keydown',e=>{if(['Space','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.code))e.preventDefault();if(e.repeat)return;if(e.code==='Escape'||e.code==='KeyP'){togglePause();return;}if(e.code==='KeyF'||e.code==='Enter'){doInteract();return;}if(e.code==='KeyQ'){switchCharacter();return;}if(e.code==='Space'){doAttack();return;}if(e.code==='KeyE'){doSkill();return;}if(e.code==='ShiftLeft'||e.code==='ShiftRight'){doDash();return;}keys.add(e.code);});
document.addEventListener('keyup',e=>keys.delete(e.code));
const keys=new Set();
window.addEventListener('blur',()=>keys.clear());
canvas.addEventListener('pointerdown',e=>{if(e.pointerType==='mouse'&&state.started){state.mouseDown=true;canvas.setPointerCapture(e.pointerId);}});
canvas.addEventListener('pointerup',()=>state.mouseDown=false);
canvas.addEventListener('pointermove',e=>{if(state.mouseDown){state.cameraYaw-=e.movementX*.004;state.cameraPitch=THREE.MathUtils.clamp(state.cameraPitch+e.movementY*.002,-.04,.58);}});
canvas.addEventListener('wheel',e=>{camera.userData.distance=THREE.MathUtils.clamp((camera.userData.distance||8)+e.deltaY*.008,5,13);});
// Simple touch joystick and action buttons.
const joystick=document.querySelector('#joystick'),stick=joystick.querySelector('.stick');let touchVector={x:0,y:0};
joystick.addEventListener('pointerdown',e=>{joystick.setPointerCapture(e.pointerId);moveStick(e);});joystick.addEventListener('pointermove',e=>{if(e.buttons)moveStick(e);});joystick.addEventListener('pointerup',()=>{touchVector={x:0,y:0};stick.style.transform='translate(0,0)';});
function moveStick(e){const r=joystick.getBoundingClientRect(),dx=e.clientX-(r.left+r.width/2),dy=e.clientY-(r.top+r.height/2),len=Math.hypot(dx,dy),max=34,n=Math.min(1,len/max);touchVector={x:dx/(len||1)*n,y:dy/(len||1)*n};stick.style.transform=`translate(${touchVector.x*max}px,${touchVector.y*max}px)`;}
document.querySelectorAll('.touch-actions button').forEach(b=>b.addEventListener('pointerdown',e=>{e.preventDefault();({attack:doAttack,skill:doSkill,dash:doDash})[b.dataset.action]();}));

function beginAssault(){state.stage=1;state.killCount=0;spawnCurse(-4,42);spawnCurse(4,48);spawnCurse(0,53);mission('CURSE ACTIVITY RISING','Exorcise the curses in the training hall');document.querySelector('#area-name').textContent='OLD TRAINING HALL';say([['NOBARA KUGISAKI','You took your time. There are three of them—and they’re all yours, Itadori.'],['MEGUMI FUSHIGURO','Don’t let them reach the seal. I’ll cover the entrance.']]);}
function startRitual(){state.stage=2;mission('THE CURSES ARE EXORCISED','Investigate the ritual seal');document.querySelector('#area-name').textContent='THE INNER GROUNDS';setToast('THE SEAL IS PULSING · INVESTIGATE IT');}
function finishMission(){state.over=true;document.querySelector('#boss-hud').classList.add('hidden');document.querySelector('#end-eyebrow').textContent='MISSION COMPLETE · FIELD REPORT 01';document.querySelector('#end-title').textContent='THE VEIL IS BROKEN.';document.querySelector('#end-copy').textContent='The first-years have made it through the night. The next curse is already waiting.';setTimeout(()=>ui.end.classList.add('visible'),700);mission('SPECIAL GRADE EXORCISED','Mission complete');}
function failMission(){state.over=true;document.querySelector('#end-eyebrow').textContent='MISSION FAILED';document.querySelector('#end-title').textContent='THE VEIL CONSUMES.';document.querySelector('#end-copy').textContent='Regroup with your classmates and try the mission again.';setTimeout(()=>ui.end.classList.add('visible'),500);}
function updateWorld(dt){
 state.time+=dt;
 // Decorative atmosphere, animated seal and curse energy.
 seal.rotation.y+=dt*.15;ring.material.opacity=.65+Math.sin(state.time*2)*.2;
 redLight.intensity=34+Math.sin(state.time*2.7)*7;goldLight.intensity=18+Math.sin(state.time*1.6)*5;
 if(!state.started||state.paused||state.over){camera.position.lerp(new THREE.Vector3(Math.sin(state.time*.11)*28,13,player.position.z-34),.018);camera.lookAt(0,3,18);return;}
 if(state.dialogue)return;
 const fwd=new THREE.Vector3(Math.sin(state.cameraYaw),0,Math.cos(state.cameraYaw));const right=new THREE.Vector3(fwd.z,0,-fwd.x);
 let ix=(keys.has('KeyD')?1:0)-(keys.has('KeyA')?1:0)+touchVector.x;
 let iz=(keys.has('KeyW')?1:0)-(keys.has('KeyS')?1:0)-touchVector.y;
 const move=new THREE.Vector3().addScaledVector(right,ix).addScaledVector(fwd,iz);
 if(move.lengthSq()>1)move.normalize();
 const speed=state.dashTimer>0?24:6.5;
 player.position.addScaledVector(move,speed*dt);
 player.position.x=THREE.MathUtils.clamp(player.position.x,-9.6,9.6);player.position.z=THREE.MathUtils.clamp(player.position.z,-45,72);
 if(move.lengthSq()>.001){player.rotation.y=Math.atan2(move.x,move.z);const rig=player.userData.actor.userData.rig;const walk=Math.sin(state.time*13);rig.position.y=.045+Math.abs(walk)*.055;for(let i=0;i<2;i++){const p=player.userData.actor.userData.parts;p.legs[i].rotation.x=walk*(i?1:-1)*.52;p.arms[i].rotation.x=-walk*(i?1:-1)*.28;}}
 else{const rig=player.userData.actor.userData.rig;rig.position.y=Math.sin(state.time*2)*.025;for(const arm of player.userData.actor.userData.parts.arms)arm.rotation.x=THREE.MathUtils.damp(arm.rotation.x,0,8,dt);}
 if(state.attacking>0){state.attacking-=dt;const rig=player.userData.actor.userData.rig;rig.rotation.x=state.attacking>.18?-.42:0;}
 state.skillCooldown=Math.max(0,state.skillCooldown-dt);state.dashTimer=Math.max(0,state.dashTimer-dt);state.invulnerable=Math.max(0,state.invulnerable-dt);
 state.energy=Math.min(100,state.energy+dt*2.5);updateBars();
 // A veil boundary softly discourages leaving the mission area.
 if(player.position.z>64&&state.stage<3)player.position.z=64;
 if(state.stage===0&&player.position.z>37)beginAssault();
 if(state.stage===1&&state.killCount>=3)startRitual();
 const near=state.stage===2&&player.position.distanceTo(seal.position)<6;ui.interact.classList.toggle('hidden',!near);
 if(state.stage===2&&player.position.distanceTo(seal.position)<6.2)state.nearSeal=true;
 // Curse behavior: pursue, feint, strike, then retreat. Boss gets longer reach.
 for(const e of enemies){if(e.userData.dead)continue;const data=e.userData;data.phase+=dt;const to=new THREE.Vector3().subVectors(player.position,e.position);to.y=0;const dist=to.length();const boss=data.boss;const reach=boss?3.2:1.55;
   if(data.hitFlash>0){data.hitFlash-=dt;e.scale.setScalar((boss?1.8:1)*(1+Math.sin(state.time*55)*.06));}else e.scale.setScalar(boss?1.8:1);
   if(dist>reach){to.normalize();e.position.addScaledVector(to,dt*(boss?1.65:2.05));e.rotation.y=Math.atan2(to.x,to.z);}else{data.attackCooldown-=dt;if(data.attackCooldown<=0){data.attackCooldown=boss?1.2:1.55;data.windup=.48;}}
   if(data.windup>0){data.windup-=dt;if(data.windup<=0&&dist<(boss?4:2.25)&&state.invulnerable<=0){state.health=Math.max(0,state.health-(boss?15:8));updateBars();player.userData.actor.userData.rig.position.y=.13;burst(player.position.clone().add(new THREE.Vector3(0,1,0)),0xe74d60,6,.45);if(state.health<=0)failMission();}}
   if(boss){const bar=document.querySelector('#boss-hud');bar.classList.remove('hidden');const pct=Math.max(0,data.hp/data.maxHp*100);document.querySelector('#boss-hp-bar').style.width=`${pct}%`;document.querySelector('#boss-hp-text').textContent=`${Math.ceil(pct)}%`;}
 }
 // Move the companion curses in from the hall, while keeping them outside the combat lane.
 if(state.stage===1){const remaining=enemies.filter(e=>!e.userData.dead&&!e.userData.boss).length;if(remaining===0&&state.killCount>=3)startRitual();}
 // Camera follows behind, with a small shoulder offset and adjustable orbit.
 const distance=camera.userData.distance||8.5;const horiz=distance*Math.cos(state.cameraPitch),height=3.1+distance*Math.sin(state.cameraPitch);
 const target=new THREE.Vector3(player.position.x-fwd.x*horiz+right.x*.85,player.position.y+height,player.position.z-fwd.z*horiz+right.z*.85);
 camera.position.lerp(target,1-Math.pow(.001,dt));camera.lookAt(player.position.x,1.25,player.position.z);
}
function resize(){camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.8));}
window.addEventListener('resize',resize);
function animate(){requestAnimationFrame(animate);const dt=Math.min(.05,clock.getDelta());updateWorld(dt);
 for(let i=effects.length-1;i>=0;i--){const fx=effects[i];fx.life-=dt;const p=1-fx.life/fx.max;if(fx.group){for(const m of fx.group.children){m.position.addScaledVector(m.userData.vel,dt);m.userData.vel.y-=dt*2;}fx.group.children.forEach(m=>{m.material.opacity=Math.max(0,fx.life/fx.max);});}
  if(fx.mesh&&fx.scale){const s=1+p*7;fx.mesh.scale.setScalar(s);fx.mesh.material.opacity=Math.max(0,(1-p)*.8);}
  if(fx.life<=0){if(fx.mesh)world.remove(fx.mesh);if(fx.group)world.remove(fx.group);effects.splice(i,1);}}
 renderer.render(scene,camera);
}
updateCharacter();camera.position.set(0,12,-32);camera.lookAt(0,2,20);animate();
window.addEventListener('load',()=>setTimeout(()=>ui.loading.classList.add('done'),450));
