import * as T from './vendor/three.module.min.js';

const host=document.getElementById('seoul-miniature');
const svg=document.querySelector('.seoul-map');
if(host&&svg) initialise().catch(()=>{host.hidden=true;});
async function initialise(){
 const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
 const small=matchMedia('(max-width: 700px)').matches;
 let renderer;try{renderer=new T.WebGLRenderer({antialias:true,alpha:true,powerPreference:'low-power'});}catch{renderer=new SoftwareMiniatureRenderer();}
 renderer.setPixelRatio(Math.min(devicePixelRatio,small?1.5:2));renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;
 renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.35;
 renderer.domElement.setAttribute('aria-label','Interactive 3D Seoul district map');
 host.prepend(renderer.domElement);
 const scene=new T.Scene();scene.background=new T.Color('#f9eddd');
 const camera=new T.OrthographicCamera(-550,550,430,-430,1,2400);camera.position.set(80,-800,1100);camera.lookAt(0,10,30);
 scene.add(new T.HemisphereLight('#fff3df','#9e9bae',2.3));
 const sun=new T.DirectionalLight('#fff5df',4);sun.position.set(-450,-250,900);sun.castShadow=true;
 sun.shadow.mapSize.set(small?1024:2048,small?1024:2048);sun.shadow.camera.left=-600;sun.shadow.camera.right=600;sun.shadow.camera.top=600;sun.shadow.camera.bottom=-600;sun.shadow.camera.far=1800;sun.shadow.normalBias=1.5;sun.shadow.bias=-.0003;scene.add(sun);
 const fill=new T.DirectionalLight('#d7e5ff',1.2);fill.position.set(500,400,600);scene.add(fill);
 const clay=(color)=>new T.MeshStandardMaterial({color,roughness:.48,metalness:.02});
 const cream=clay('#fff0d2'),white=clay('#fff9ef'),green=clay('#a2cb7f'),darkGreen=clay('#5c9475'),trunk=clay('#a16e45'),pink=clay('#f2a9c1'),roof=clay('#41596c'),red=clay('#c46c52'),gold=clay('#e2b56e');
 function mesh(geo,mat,parent,x=0,y=0,z=0){const m=new T.Mesh(geo,mat);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;}
 function box(parent,x,y,z,w,d,h,mat){return mesh(new T.BoxGeometry(w,d,h),mat,parent,x,y,z+h/2);}
 function cylinder(parent,x,y,z,rt,rb,h,mat,n=20){const m=mesh(new T.CylinderGeometry(rt,rb,h,n),mat,parent,x,y,z+h/2);m.rotation.x=Math.PI/2;return m;}
 function sphere(parent,x,y,z,r,mat){return mesh(new T.SphereGeometry(r,12,10),mat,parent,x,y,z);}
 function tree(parent,x,y,z,size=1,blossom=false){cylinder(parent,x,y,z,2.5*size,3*size,16*size,trunk,8);const mat=blossom?pink:green;sphere(parent,x,y,z+25*size,12*size,mat);sphere(parent,x-9*size,y,z+20*size,10*size,mat);sphere(parent,x+9*size,y,z+20*size,10*size,mat);}
 function roofShape(parent,x,y,z,w,d,h,mat){const sh=new T.Shape();sh.moveTo(-w*.59,0);sh.lineTo(-w*.43,h*.2);sh.lineTo(0,h);sh.lineTo(w*.43,h*.2);sh.lineTo(w*.59,0);sh.closePath();const g=new T.ExtrudeGeometry(sh,{depth:d,bevelEnabled:true,bevelSize:1.6,bevelThickness:1.2,bevelSegments:2,steps:1});const m=mesh(g,mat,parent,x,y+d/2,z);m.rotation.x=Math.PI/2;return m;}
 function palace(parent){box(parent,0,10,34,72,45,5,cream);box(parent,0,10,39,55,30,15,cream);for(const x of [-24,-12,0,12,24])cylinder(parent,x,-4,40,1.6,1.6,16,red,8);roofShape(parent,0,10,54,72,41,12,roof);box(parent,0,10,62,39,22,8,red);roofShape(parent,0,10,70,55,32,12,roof);for(const x of [-15,0,15])box(parent,x,-6,41,7,1,11,darkGreen);tree(parent,-44,7,35,.75,true);tree(parent,39,22,35,.7,true);}
 function tower(parent){const hill=mesh(new T.SphereGeometry(32,18,12),green,parent,0,15,34);hill.scale.z=.38;cylinder(parent,0,15,40,2.5,5,58,white);cylinder(parent,0,15,87,12,10,9,cream);cylinder(parent,0,15,96,10,12,8,roof);cylinder(parent,0,15,104,2,2,22,white);cylinder(parent,0,15,126,.5,1,11,red);tree(parent,-23,15,35,.7);tree(parent,20,5,35,.65,true);}
 function glassTower(parent){const mat=new T.MeshPhysicalMaterial({color:'#a6d4e4',roughness:.2,metalness:.35,clearcoat:1});const m=cylinder(parent,7,15,35,1.5,12,102,mat,6);m.rotation.z=.1;for(let k=0;k<8;k++){const r=11-k;const ring=mesh(new T.TorusGeometry(Math.max(r,2),.45,4,6),white,parent,7,15,44+k*11);ring.rotation.z=.1;}box(parent,-12,-3,35,27,20,9,cream);tree(parent,-22,13,35,.8);}
 function shop(parent){box(parent,0,10,35,45,28,29,cream);box(parent,0,-5,35,18,2,23,clay('#99c1ce'));roofShape(parent,0,10,64,49,33,8,pink);for(let i=0;i<7;i++)box(parent,-21+i*7,-11,55,7,12,4,i%2?white:pink);box(parent,12,-6,41,12,2,10,roof);tree(parent,-31,20,35,.8);}
 function food(parent){box(parent,0,8,35,38,22,17,clay('#f1bd79'));for(let i=0;i<6;i++)box(parent,-18+i*7,8,63,7,31,4,i%2?white:red);for(const x of [-17,17])cylinder(parent,x,6,48,1,1,17,trunk,8);const bowl=sphere(parent,0,-11,48,7,red);bowl.scale.z=.45;for(let i=0;i<3;i++)sphere(parent,-4+i*4,-12,51,2.7,gold);tree(parent,29,15,35,.6);}
 function museum(parent){box(parent,0,12,35,62,28,13,cream);box(parent,0,12,48,66,31,4,roof);for(const x of [-23,-12,0,12,23])box(parent,x,-3,36,2,2,12,red);tree(parent,-39,15,35,.6);}
 const platform=new T.Group();scene.add(platform);
 const base=cylinder(platform,0,0,-44,494,500,34,clay('#e6cdb0'),96);base.scale.z=.84;base.userData.softwareLayer=-2;
 const sea=cylinder(platform,0,0,-10,477,481,8,clay('#7bc9cf'),96);sea.scale.z=.84;sea.receiveShadow=true;sea.userData.softwareLayer=-1;
 // The display base is decorative. District outlines remain the source geographic boundaries.
 const ground=mesh(new T.PlaneGeometry(4000,4000),clay('#f4e6d3'),scene,0,0,-46);ground.receiveShadow=true;ground.userData.skipSoftware=true;
 const records=[];const pickMeshes=[];const palette=['#f5c282','#e8add2','#b5d4e0','#b7d2ab','#c4b3df'];
 const numbered=[...svg.querySelectorAll('.district-shape')].sort((a,b)=>Number(a.querySelector('.district-number').textContent)-Number(b.querySelector('.district-number').textContent));
 const pins=host.querySelector('.miniature-pins');
 for(const [i,g] of numbered.entries()){
  const slug=g.dataset.district;const dot=g.querySelector('.district-dot');const cx=Number(dot.getAttribute('cx'));const cy=Number(dot.getAttribute('cy'));const nums=g.querySelector('.district-top').getAttribute('d').match(/-?\d+(?:\.\d+)?/g).map(Number);
  const shape=new T.Shape();for(let k=0;k<nums.length;k+=2){const x=(nums[k]-cx)*.80,y=-(nums[k+1]-cy)*.80;k?shape.lineTo(x,y):shape.moveTo(x,y);}shape.closePath();
  const geo=new T.ExtrudeGeometry(shape,{depth:30,bevelEnabled:true,bevelThickness:3.5,bevelSize:2.7,bevelSegments:3,curveSegments:3,steps:1});
  const group=new T.Group();group.position.set((cx-400)*1.07,(333-cy)*1.07,0);scene.add(group);
  const top=clay(palette[i%palette.length]),side=clay(new T.Color(palette[i%palette.length]).multiplyScalar(.85));const tile=mesh(geo,[top,side],group);tile.userData.slug=slug;pickMeshes.push(tile);
  cylinder(group,0,-14,34,11,12,3,white);
  const n=g.querySelector('.district-number').textContent.trim();const name=(g.getAttribute('aria-label')||slug).split(' ')[0].replace('-gu','');
  const pin=document.createElement('button');pin.type='button';pin.className='miniature-pin';pin.dataset.slug=slug;pin.textContent=n;pin.setAttribute('aria-label',g.getAttribute('aria-label'));pin.title=g.getAttribute('aria-label');pins.append(pin);pin.addEventListener('click',()=>select(slug));
  const rec={slug,name,group,top,side,tile,pin,base:group.position.clone(),color:new T.Color(palette[i%palette.length]),allowed:true,targetScale:1,targetZ:0};records.push(rec);
  if(slug==='jongno')palace(group);else if(slug==='yongsan')tower(group);else if(slug==='songpa')glassTower(group);else if(['mapo','seongdong','gangnam','jung'].includes(slug))shop(group);else if(['dongdaemun','gwangjin','dongjak'].includes(slug))food(group);else if(slug==='seodaemun')museum(group);else{tree(group,-8,14,35,.7,['eunpyeong','seongbuk'].includes(slug));if(i%2===0)tree(group,14,19,35,.55);}
 }
 // Miniature bridges sit across the decorative water edging without changing district hit areas.
 for(const [x,y] of [[-245,-65],[320,-78],[-53,-210]]){box(scene,x,y,0,48,8,5,cream);for(const xx of [-16,16])cylinder(scene,x+xx,y,-7,2,2,14,cream,8);}
 function cloud(x,y,z){const g=new T.Group();scene.add(g);g.position.set(x,y,z);sphere(g,0,0,0,22,white);sphere(g,-22,0,-8,17,white);sphere(g,22,0,-8,19,white);sphere(g,8,0,12,20,white);}
 cloud(-360,260,75);cloud(365,240,88);
 const ray=new T.Raycaster(),pointer=new T.Vector2();let hover=null,raf=0,frames=0;
 function select(slug){const rec=records.find(r=>r.slug===slug);if(!rec?.allowed)return;document.querySelector('.district-choice[data-district="'+slug+'"]').click();sync();}
 function hit(event){const rect=renderer.domElement.getBoundingClientRect();pointer.set((event.clientX-rect.left)/rect.width*2-1,-(event.clientY-rect.top)/rect.height*2+1);ray.setFromCamera(pointer,camera);return ray.intersectObjects(pickMeshes,false).find(h=>records.find(r=>r.slug===h.object.userData.slug)?.allowed)?.object.userData.slug;}
 renderer.domElement.addEventListener('pointermove',e=>{const next=hit(e)||null;if(next!==hover){hover=next;renderer.domElement.style.cursor=hover?'pointer':'default';sync();}});
 renderer.domElement.addEventListener('pointerleave',()=>{hover=null;sync();});
 renderer.domElement.addEventListener('click',e=>{const slug=hit(e);if(slug)select(slug);});
 function sync(){const current=svg.querySelector('[aria-pressed="true"]')?.dataset.district;for(const r of records){r.allowed=!svg.querySelector('[data-district="'+r.slug+'"]').classList.contains('is-muted');const chosen=r.slug===current;r.targetScale=chosen?1.65:r.slug===hover?1.07:1;r.targetZ=chosen?105:r.slug===hover?12:0;r.top.color.copy(chosen?new T.Color('#ffa566'):r.color);r.side.color.copy(chosen?new T.Color('#d77c42'):r.color.clone().multiplyScalar(.83));if(!r.allowed){r.top.color.lerp(new T.Color('#e2d6c9'),.55);r.side.color.lerp(new T.Color('#c9bcae'),.45);}r.pin.hidden=!r.allowed;r.pin.classList.toggle('selected',chosen);r.pin.setAttribute('aria-pressed',String(chosen));r.pin.textContent=chosen?r.name:r.pin.dataset.number||numbered.find(g=>g.dataset.district===r.slug).querySelector('.district-number').textContent.trim();if(reduce){r.group.scale.setScalar(r.targetScale);r.group.position.z=r.targetZ;}}
  host.querySelector('.miniature-current').textContent=current?records.find(r=>r.slug===current).name+' · selected':'';schedule();}
 function draw(){raf=0;let moving=false;for(const r of records){const dz=r.targetZ-r.group.position.z,ds=r.targetScale-r.group.scale.x;if(Math.abs(dz)>.05||Math.abs(ds)>.001){moving=true;r.group.position.z+=dz*(renderer.isSoftware?.3:.16);r.group.scale.setScalar(r.group.scale.x+ds*(renderer.isSoftware?.3:.16));}else{r.group.position.z=r.targetZ;r.group.scale.setScalar(r.targetScale);}}
  scene.updateMatrixWorld(true);camera.updateMatrixWorld();for(const r of records){const p=new T.Vector3(0,-14,43).applyMatrix4(r.group.matrixWorld).project(camera);r.pin.style.left=(p.x*.5+.5)*100+'%';r.pin.style.top=(-p.y*.5+.5)*100+'%';r.pin.style.zIndex=r.targetZ>50?'4':'2';}
  renderer.render(scene,camera);frames++;if(moving)raf=requestAnimationFrame(draw);}
 function schedule(){if(!raf)raf=requestAnimationFrame(draw);}
 function resize(){const w=host.clientWidth,h=host.clientHeight,aspect=w/h;const span=small?1050:850;camera.left=-span*aspect/2;camera.right=span*aspect/2;camera.top=span/2;camera.bottom=-span/2;camera.updateProjectionMatrix();renderer.setSize(w,h,false);schedule();}
 new ResizeObserver(resize).observe(host);
 new MutationObserver(sync).observe(svg,{subtree:true,attributes:true,attributeFilter:['aria-pressed','class']});
 host.hidden=false;document.querySelector('.map-frame').classList.add('miniature-ready');document.documentElement.classList.add('has-miniature');resize();sync();
 host.dataset.ready='true';host.dataset.renderer=renderer.isSoftware?'canvas':'webgl';
 renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();host.hidden=true;document.querySelector('.map-frame').classList.remove('miniature-ready');});
}

// Canvas fallback for browsers where WebGL is disabled. It projects the same
// meshes, lights their faces, and paints them in depth order; interaction and
// selection use the same camera and district geometry as the GPU renderer.
function SoftwareMiniatureRenderer(){
 this.domElement=document.createElement('canvas');this.isSoftware=true;this.shadowMap={};let ratio=1,w=1,h=1;
 const ctx=this.domElement.getContext('2d',{alpha:false});if(!ctx)throw Error('Canvas unavailable');
 this.setPixelRatio=v=>{ratio=Math.min(v,1.25);};
 this.setSize=(width,height)=>{w=width;h=height;this.domElement.width=Math.round(w*ratio);this.domElement.height=Math.round(h*ratio);};
 const sun=new T.Vector3(-.45,-.25,.85).normalize();
 this.render=(scene,camera)=>{
  scene.updateMatrixWorld(true);camera.updateMatrixWorld();ctx.setTransform(ratio,0,0,ratio,0,0);ctx.globalAlpha=1;ctx.fillStyle=scene.background?.getStyle()||'#f9eddd';ctx.fillRect(0,0,w,h);
  const shade=ctx.createRadialGradient(w*.5,h*.67,0,w*.5,h*.67,w*.43);shade.addColorStop(0,'#73563833');shade.addColorStop(1,'#73563800');ctx.fillStyle=shade;ctx.fillRect(0,h*.22,w,h*.78);
  const faces=[];
  scene.traverse(obj=>{
   if(!obj.isMesh||!obj.visible||obj.userData.skipSoftware)return;
   const pos=obj.geometry.attributes.position,norm=obj.geometry.attributes.normal,index=obj.geometry.index;
   const nmat=new T.Matrix3().getNormalMatrix(obj.matrixWorld),mvp=new T.Matrix4().multiplyMatrices(camera.projectionMatrix,camera.matrixWorldInverse).multiply(obj.matrixWorld);
   const points=new Array(pos.count),normals=new Array(pos.count);
   for(let i=0;i<pos.count;i++){const p=new T.Vector3().fromBufferAttribute(pos,i).applyMatrix4(mvp);points[i]=[(p.x*.5+.5)*w,(-p.y*.5+.5)*h,p.z];normals[i]=norm?new T.Vector3().fromBufferAttribute(norm,i).applyMatrix3(nmat).normalize():new T.Vector3(0,0,1);}
   const length=index?index.count:pos.count;
   for(let k=0;k<length;k+=3){const a=index?index.getX(k):k,b=index?index.getX(k+1):k+1,c=index?index.getX(k+2):k+2;const p=points[a],q=points[b],r=points[c];if(!p||!q||!r)continue;
    const cross=(q[0]-p[0])*(r[1]-p[1])-(q[1]-p[1])*(r[0]-p[0]);if(cross>=0)continue;
    let mat=obj.material;if(Array.isArray(mat)){const group=obj.geometry.groups.find(g=>k>=g.start&&k<g.start+g.count);mat=mat[group?.materialIndex||0];}if(!mat?.visible)continue;
    const normal=normals[a].clone().add(normals[b]).add(normals[c]).normalize();const lit=.40+Math.max(0,normal.dot(sun))*.75+Math.max(0,normal.z)*.13;
    const color=mat.color.clone().multiplyScalar(lit);faces.push({p,q,r,z:(p[2]+q[2]+r[2])/3,color:color.getStyle(),alpha:mat.opacity??1,layer:obj.userData.softwareLayer||0});
   }
  });
  faces.sort((a,b)=>a.layer-b.layer||b.z-a.z);
  for(const f of faces){ctx.globalAlpha=f.alpha;ctx.fillStyle=f.color;ctx.strokeStyle=f.color;ctx.lineWidth=.45;ctx.beginPath();ctx.moveTo(f.p[0],f.p[1]);ctx.lineTo(f.q[0],f.q[1]);ctx.lineTo(f.r[0],f.r[1]);ctx.closePath();ctx.fill();ctx.stroke();}ctx.globalAlpha=1;
 };
}
