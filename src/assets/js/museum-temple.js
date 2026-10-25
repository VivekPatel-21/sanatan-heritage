import { createSoftwareRenderer } from './museum-software.js';
/* Original architectural study: an imagined temple, not a reconstruction. */
export function createTempleScene(T, canvas) {
  let renderer;
  try { const context=canvas.getContext('webgl2',{alpha:true,antialias:true,powerPreference:'low-power'}); if(!context)throw new Error('WebGL unavailable'); renderer = new T.WebGLRenderer({ canvas, context, alpha:true, antialias:true, powerPreference:'low-power' }); renderer.mode='webgl'; } catch { renderer=createSoftwareRenderer(T,canvas); }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  renderer.setClearColor(0x101110, 0);
  renderer.outputColorSpace = T.SRGBColorSpace;
  renderer.toneMapping = T.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.25;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = T.PCFSoftShadowMap;
  const scene = new T.Scene();
  const camera = new T.PerspectiveCamera(34,1,.1,100);
  const root = new T.Group(); scene.add(root);
  const temple = new T.Group(); root.add(temple);
  const stone = new T.MeshStandardMaterial({ color:0xb18c59, roughness:.63, metalness:.32 });
  const darkStone = new T.MeshStandardMaterial({ color:0x655039, roughness:.7, metalness:.25 });
  const trim = new T.MeshStandardMaterial({ color:0xbe995d, roughness:.4, metalness:.6 });
  const darkness = new T.MeshStandardMaterial({ color:0x18140e, roughness:1 });
  // Fine procedural grain is generated in code; no image or object attribution is implied.
  const grain = document.createElement('canvas'); grain.width=grain.height=128;
  const ctx=grain.getContext('2d'); const pixels=ctx.createImageData(128,128);
  let seed=19;
  for(let i=0;i<pixels.data.length;i+=4){seed=(seed*16807)%2147483647;const value=112+(seed%40);pixels.data.set([value,value,value,255],i);}
  ctx.putImageData(pixels,0,0);
  const texture=new T.CanvasTexture(grain); texture.wrapS=texture.wrapT=T.RepeatWrapping;texture.repeat.set(3,3);
  stone.bumpMap=texture;stone.bumpScale=.035;darkStone.bumpMap=texture;darkStone.bumpScale=.025;
  const boxGeo = new T.BoxGeometry(1,1,1);
  const columnProfile=[[.21,0],[.25,.07],[.25,.17],[.19,.23],[.15,.3],[.14,1.3],[.18,1.42],[.22,1.47],[.24,1.59],[.24,1.7]].map(p=>new T.Vector2(...p));
  const columnGeo = new T.LatheGeometry(columnProfile,12);
  function mesh(geo,mat,x,y,z,parent=temple){const m=new T.Mesh(geo,mat);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;}
  function block(w,h,d,x,y,z,mat=stone,parent=temple){const m=mesh(boxGeo,mat,x,y,z,parent);m.scale.set(w,h,d);return m;}
  function dome(radius,y,z,x=0,parent=temple){const m=mesh(new T.SphereGeometry(radius,24,12),trim,x,y,z,parent);m.scale.y=.38;return m;}
  function arch(w,h,depth,x,y,z,parent=temple){
    const shape=new T.Shape();const thickness=w*.13;
    shape.moveTo(-w/2,0);shape.lineTo(-w/2,h*.65);shape.quadraticCurveTo(-w/2,h*.93,0,h);shape.quadraticCurveTo(w/2,h*.93,w/2,h*.65);shape.lineTo(w/2,0);shape.lineTo(w/2-thickness,0);shape.lineTo(w/2-thickness,h*.64);shape.quadraticCurveTo(w/2-thickness,h*.79,0,h-thickness);shape.quadraticCurveTo(-w/2+thickness,h*.79,-w/2+thickness,h*.64);shape.lineTo(-w/2+thickness,0);shape.closePath();
    return mesh(new T.ExtrudeGeometry(shape,{depth,bevelEnabled:true,bevelSegments:2,steps:1,bevelSize:.025,bevelThickness:.02}),trim,x,y,z,parent);
  }
  function tower(x,y,z,radius,height){
    const group=new T.Group();group.position.set(x,y,z);temple.add(group);
    const points=[];
    for(let i=0;i<=28;i++){const t=i/28;points.push(new T.Vector2(.12+radius*Math.pow(1-t,.72),height*t));}
    const body=new T.LatheGeometry(points,8);body.rotateY(Math.PI/8);mesh(body,stone,0,0,0,group);
    // Stepped cornices and vertical ribs give the silhouette depth from every angle.
    for(let i=0;i<20;i++){
      const t=i/21;const rr=.12+radius*Math.pow(1-t,.72);
      const ring=mesh(new T.CylinderGeometry(rr*1.025,rr*1.07,.065,8),i%4===0?trim:stone,0,height*t,0,group);ring.rotation.y=Math.PI/8;
    }
    for(let face=0;face<8;face++){
      const angle=face*Math.PI/4;
      for(let i=1;i<11;i++){
        const t=i/12;const rr=.13+radius*Math.pow(1-t,.72);
        const rib=block(radius*.19,.14,radius*.16,Math.sin(angle)*rr*.95,height*t,Math.cos(angle)*rr*.95,trim,group);rib.rotation.y=angle;
      }
    }
    dome(.3*radius,height+.08,0,0,group);
    mesh(new T.CylinderGeometry(.07,.16,.22,12),trim,0,height+.24,0,group);
    mesh(new T.SphereGeometry(.11,16,10),trim,0,height+.41,0,group);
    mesh(new T.ConeGeometry(.06,.22,12),trim,0,height+.56,0,group);
  }
  // Raised platform and an open pillared entrance; no invented cult image is placed inside.
  block(6.1,.24,5.1,0,0,0,darkStone);
  block(5.85,.16,4.85,0,.2,0,trim);
  block(5.6,.27,4.6,0,.4,0);
  block(5.72,.08,4.72,0,.57,0,trim);
  for(let i=0;i<5;i++)block(2.45,.12,1.45-i*.2,0,-.13+i*.12,2.2+i*.03,stone);
  // Sanctuary is offset behind the entrance hall.
  block(2.8,2.05,2.6,0,1.65,-.7);
  block(2.98,.13,2.78,0,2.74,-.7,trim);
  block(3.16,.16,2.96,0,2.86,-.7);
  tower(0,2.94,-.7,1.49,3.35);
  // Deep entrance framed by multiple carved bands.
  block(1.01,1.68,.04,0,1.48,.62,darkness);
  arch(1.3,1.92,.16,0,.6,.66);
  arch(1.55,2.06,.1,0,.6,.57);
  block(1.7,.16,.35,0,2.68,.82,trim);
  for(const x of [-2.05,-.85,.85,2.05]){
    for(const z of [1.2,2.0]){
      mesh(columnGeo,stone,x,.59,z);
      block(.6,.14,.6,x,2.34,z,trim);
    }
  }
  block(4.9,.18,2.2,0,2.53,1.3);
  block(5.12,.1,2.4,0,2.67,1.3,trim);
  block(4.82,.16,2.1,0,2.8,1.3);
  // Layered pavilion roof.
  for(let i=0;i<7;i++)block(4.7-i*.45,.14,2.08-i*.18,0,2.94+i*.115,1.3,i%2?stone:trim);
  dome(.21,3.76,1.3);
  tower(-1.93,2.73,-.55,.48,1.42);tower(1.93,2.73,-.55,.48,1.42);
  // Wall reliefs: geometric niches, not depictions of specific deities.
  for(const side of [-1,1]){
    for(const z of [-1.35,-.55,.25]){
      const niche=new T.Group();niche.position.set(side*1.43,.88,z);niche.rotation.y=side*Math.PI/2;temple.add(niche);
      block(.48,.94,.035,0,.48,0,darkStone,niche);arch(.56,1.06,.045,0,0,.03,niche);
      mesh(new T.SphereGeometry(.11,12,8),trim,0,.52,.09,niche);
    }
  }
  // Platform balustrade and edge ornaments.
  for(let i=0;i<15;i++){for(const z of [-2.22,2.22]){if(z>0&&Math.abs(-2.55+i*.365)<1.25)continue;block(.13,.18,.13,-2.55+i*.365,.72,z,trim);}}
  const floor=mesh(new T.CircleGeometry(20,64),new T.MeshStandardMaterial({color:0x101110,roughness:.85,metalness:.1}),0,-.2,0,scene);floor.rotation.x=-Math.PI/2;floor.castShadow=false;floor.userData.isFloor=true;
  scene.add(new T.HemisphereLight(0xf3dec1,0x151b25,1.2));
  const key=new T.DirectionalLight(0xffd59d,4.2);key.position.set(-3,8,6);key.castShadow=true;key.shadow.mapSize.set(1024,1024);key.shadow.camera.left=-9;key.shadow.camera.right=9;key.shadow.camera.top=10;key.shadow.camera.bottom=-7;key.shadow.normalBias=.025;scene.add(key);
  const rim=new T.DirectionalLight(0xaabedc,2.4);rim.position.set(5,5,-4);scene.add(rim);
  const fill=new T.PointLight(0xe6b25f,15,20,2);fill.position.set(1,4,5);scene.add(fill);
  const pose={angle:-.38,x:2.0,distance:15.4,elevation:6.2,light:4.2};
  let width=1,height=1,frame=0,visible=true,paused=false,reduced=false,dirty=true,drag=0,dragStart=null,activeTween=null,lastRender=0;
  function render(time=0){
    const compact=width<700;
    root.position.x=compact?0:pose.x;
    root.rotation.y=pose.angle+drag+(!paused&&!reduced?Math.sin(time*.00014)*.025:0);
    camera.position.set(0,pose.elevation,pose.distance*(compact?1.05:1));camera.lookAt(0,2.65,0);
    key.intensity=pose.light;
    renderer.render(scene,camera);
  }
  function loop(time){frame=0;if(!visible)return;if((!paused&&!reduced||dirty)&&(renderer.mode!=='software'||time-lastRender>40)){render(time);dirty=false;lastRender=time;}frame=requestAnimationFrame(loop);}
  function resize(){const bounds=canvas.parentElement.getBoundingClientRect();width=bounds.width;height=bounds.height;if(!width||!height)return;renderer.setSize(width,height,false);camera.aspect=width/height;camera.updateProjectionMatrix();dirty=true;render();}
  function setVisible(value){visible=value;if(value&&!frame)frame=requestAnimationFrame(loop);if(!value&&frame){cancelAnimationFrame(frame);frame=0;}}
  function setMotion(value,reduce=false){paused=value;reduced=reduce;dirty=true;}
  function view(index,gsap,instant=false){
    const poses=[{angle:-.38,x:2.0,distance:15.4,elevation:6.2,light:4.2},{angle:.85,x:-3.3,distance:17.4,elevation:6.4,light:3.1},{angle:-.9,x:1.8,distance:16.5,elevation:7.0,light:4.9}];
    drag=0;activeTween?.kill();
    if(instant||!gsap){Object.assign(pose,poses[index]);dirty=true;render();}
    else activeTween=gsap.to(pose,{...poses[index],duration:1.65,ease:'power3.inOut',onUpdate(){dirty=true;},onComplete(){dirty=true;}});
  }
  canvas.addEventListener('pointerdown',event=>{if(event.pointerType==='touch')return;dragStart=event.clientX;canvas.setPointerCapture(event.pointerId);canvas.classList.add('is-dragging');});
  canvas.addEventListener('pointermove',event=>{if(dragStart===null)return;drag+=(event.clientX-dragStart)*.006;dragStart=event.clientX;dirty=true;});
  function endDrag(){dragStart=null;canvas.classList.remove('is-dragging');}
  canvas.addEventListener('pointerup',endDrag);canvas.addEventListener('pointercancel',endDrag);
  canvas.addEventListener('webglcontextlost',event=>{event.preventDefault();setVisible(false);canvas.dispatchEvent(new CustomEvent('exhibit-context-lost'));});
  const ro=new ResizeObserver(resize);ro.observe(canvas.parentElement);resize();setVisible(true);
  return {mode:renderer.mode,view,setMotion,setVisible,resize,dispose(){setVisible(false);ro.disconnect();renderer.dispose();texture.dispose();scene.traverse(o=>{if(o.isMesh)o.geometry.dispose();});for(const material of [stone,darkStone,trim,darkness])material.dispose();}};
}
