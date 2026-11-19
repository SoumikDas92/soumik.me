import * as T from './vendor/three.module.min.js';
export function createLab(viewport, angle, elbow, reset) {
  const scene = new T.Scene();
  scene.background = new T.Color(0x0a1424);
  scene.fog = new T.FogExp2(0x0a1424, .055);
  const camera = new T.PerspectiveCamera(37, 1, .1, 75);
  const renderer = new T.WebGLRenderer({antialias:devicePixelRatio < 2, powerPreference:'low-power'});
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.6));
  renderer.toneMapping = T.ACESFilmicToneMapping;
  renderer.domElement.setAttribute('aria-label','Procedural industrial robot arm. Drag to orbit, or use the joint sliders below.');
  renderer.domElement.setAttribute('role','img');
  viewport.append(renderer.domElement);
  scene.add(new T.HemisphereLight(0xcde7ff, 0x243147, 2.2));
  for (const [c, power, x, y, z] of [[0xddeeff,5,3,6,4],[0x2c81ff,7,-4,3,-3],[0xffffff,2,-3,4,2]]) {
    const light = new T.DirectionalLight(c,power); light.position.set(x,y,z); scene.add(light);
  }
  const mat = (color, metalness, roughness, emissive = 0) => new T.MeshStandardMaterial({color,metalness,roughness,emissive});
  const metal = mat(0xc8dcef,.62,.29), edge = mat(0x6e879e,.55,.35), dark = mat(0x202c3c,.38,.42), blue = mat(0x61ceff,.25,.28,0x167fce);
  function mesh(parent, shape, material, x=0,y=0,z=0) {
    const part = new T.Mesh(shape,material); part.position.set(x,y,z); parent.add(part); return part;
  }
  function box(parent, material, width,height,depth,x,y,z) { return mesh(parent,new T.BoxGeometry(width,height,depth),material,x,y,z); }
  function cyl(parent, material, radius, length, x,y,z, axis='y') {
    const part = mesh(parent,new T.CylinderGeometry(radius,radius,length,32),material,x,y,z);
    if(axis === 'z') part.rotation.x = Math.PI / 2;
    return part;
  }
  const grid = new T.GridHelper(32,64,0x3975ac,0x203752); scene.add(grid);
  cyl(scene,dark,1.02,.22,0,.12,0); cyl(scene,metal,.87,.15,0,.29,0); cyl(scene,blue,.83,.026,0,.375,0);
  const base = new T.Group(); scene.add(base);
  cyl(base,dark,.69,.4,0,.57,0); cyl(base,edge,.58,.12,0,.82,0);
  for (let i=0;i<8;i++) { const a=i*Math.PI/4; cyl(scene,edge,.05,.04,Math.cos(a)*.77,.38,Math.sin(a)*.77); }
  const shoulder = new T.Group(); shoulder.position.y = 1.03; shoulder.rotation.z=.36; base.add(shoulder);
  function joint(parent,radius) {
    cyl(parent,dark,radius,.62,0,0,0,'z');
    for(const side of [-1,1]) {
      cyl(parent,metal,radius*.83,.085,0,0,.34*side,'z');
      cyl(parent,blue,radius*.57,.03,0,0,.39*side,'z');
      cyl(parent,edge,radius*.45,.045,0,0,.42*side,'z');
      for (let i=0;i<6;i++) { const a=i*Math.PI/3; cyl(parent,dark,.025,.027,Math.sin(a)*radius*.69,Math.cos(a)*radius*.69,.39*side,'z'); }
    }
  }
  function link(parent,length,width) {
    box(parent,dark,width,length,.37,0,length/2,0);
    for (const side of [-1,1]) {
      const plate = new T.Shape(); plate.moveTo(-width*.57,.13); plate.lineTo(width*.53,.18); plate.lineTo(width*.38,length-.17); plate.lineTo(-width*.25,length-.09); plate.closePath();
      mesh(parent,new T.ExtrudeGeometry(plate,{depth:.055,bevelThickness:.038,bevelSize:.04,bevelSegments:2,steps:1}),metal,0,0,side*.216-.027);
      box(parent,blue,.038,length*.47,.026,-width*.13,length*.52,side*.299);
    }
  }
  joint(shoulder,.37); link(shoulder,1.39,.44);
  const upper = new T.Group(); upper.position.y=1.4; shoulder.add(upper); joint(upper,.31); link(upper,1.3,.39);
  const wrist = new T.Group(); wrist.position.y=1.3; wrist.rotation.z=-.48; upper.add(wrist); joint(wrist,.19);
  cyl(wrist,edge,.16,.35,0,.21,0); box(wrist,dark,.37,.18,.34,0,.41,0);
  for(const side of [-1,1]) { box(wrist,metal,.09,.29,.13,side*.17,.59,0); box(wrist,edge,.145,.08,.13,side*.13,.71,0); }
  const lowMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let orbit=.72, inclination=.39, shownOrbit=orbit, shownInclination=inclination, pointer, frame=0, running=false;
  const canvas=renderer.domElement;
  canvas.addEventListener('pointerdown',e=>{ if (pointer) return; pointer={id:e.pointerId,x:e.clientX,y:e.clientY}; canvas.setPointerCapture(e.pointerId); });
  canvas.addEventListener('pointermove',e=>{ if(pointer?.id!==e.pointerId)return; orbit-=(e.clientX-pointer.x)*.012; inclination=T.MathUtils.clamp(inclination+(e.clientY-pointer.y)*.009,.08,1.17); pointer.x=e.clientX; pointer.y=e.clientY; });
  canvas.addEventListener('lostpointercapture',()=>{pointer=null;});
  reset.addEventListener('click',()=>{ orbit=.72; inclination=.39; angle.value='0'; elbow.value='-52'; });
  function resize() { const w=viewport.clientWidth,h=viewport.clientHeight; if (!w || !h) return; camera.aspect=w/h; camera.updateProjectionMatrix(); renderer.setSize(w,h,false); }
  const observer=new ResizeObserver(resize);
  function render(time) {
    if (!running) return;
    const s=lowMotion.matches?1:.16;
    shownOrbit=T.MathUtils.lerp(shownOrbit,orbit,s); shownInclination=T.MathUtils.lerp(shownInclination,inclination,s);
    const distance=camera.aspect<1.2?9.6:7.8;
    camera.position.set(Math.sin(shownOrbit)*Math.cos(shownInclination)*distance,1.82+Math.sin(shownInclination)*distance,Math.cos(shownOrbit)*Math.cos(shownInclination)*distance); camera.lookAt(0,1.82,0);
    base.rotation.y=T.MathUtils.lerp(base.rotation.y,T.MathUtils.degToRad(Number(angle.value)),s);
    upper.rotation.z=T.MathUtils.lerp(upper.rotation.z,T.MathUtils.degToRad(Number(elbow.value))+(lowMotion.matches?0:Math.sin(time*.0012)*.025),s);
    renderer.render(scene,camera); frame=requestAnimationFrame(render);
  }
  return {start(){if(running)return; resize(); observer.observe(viewport); running=true; frame=requestAnimationFrame(render);},stop(){running=false; cancelAnimationFrame(frame); observer.disconnect();}};
}
