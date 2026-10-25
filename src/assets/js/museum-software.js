/* CPU painter for the same 3D geometry when a GPU context is unavailable. */
export function createSoftwareRenderer(T,canvas) {
  const ctx=canvas.getContext('2d',{alpha:true});if(!ctx)throw new Error('Canvas unavailable');
  let width=1,height=1,ratio=1;
  const projection=new T.Matrix4(),mvp=new T.Matrix4(),normalMatrix=new T.Matrix3();
  const point=new T.Vector3(),normal=new T.Vector3(),a=new T.Vector3(),b=new T.Vector3(),c=new T.Vector3();
  const ab=new T.Vector3(),ac=new T.Vector3(),light=new T.Vector3(-.45,.85,.6).normalize();
  const colors=new WeakMap(),faces=new WeakMap();
  function getFaces(geometry){
    if(faces.has(geometry))return faces.get(geometry);
    const p=geometry.attributes.position,index=geometry.index,result=[];
    for(let i=0;i<(index?index.count:p.count);i+=3){const ids=[0,1,2].map(k=>index?index.getX(i+k):i+k);const points=ids.map(j=>[p.getX(j),p.getY(j),p.getZ(j)]);a.fromArray(points[0]);b.fromArray(points[1]);c.fromArray(points[2]);ab.subVectors(b,a);ac.subVectors(c,a);normal.crossVectors(ab,ac).normalize();result.push({points,normal:normal.toArray()});}
    faces.set(geometry,result);return result;
  }
  return {
    mode:'software',shadowMap:{},setClearColor(){},setPixelRatio(value){ratio=Math.min(value,1.25);},
    setSize(w,h){width=w;height=h;canvas.width=Math.round(w*ratio);canvas.height=Math.round(h*ratio);},
    render(scene,camera){
      ctx.setTransform(ratio,0,0,ratio,0,0);ctx.clearRect(0,0,width,height);
      scene.updateMatrixWorld(true);camera.updateMatrixWorld(true);
      projection.multiplyMatrices(camera.projectionMatrix,camera.matrixWorldInverse);
      const triangles=[];const key=scene.children.find(o=>o.isDirectionalLight);const strength=key?key.intensity:4; if(key)light.copy(key.position).normalize();
      scene.traverse(object=>{
        if(!object.isMesh||!object.visible||object.userData.isFloor)return;
        mvp.multiplyMatrices(projection,object.matrixWorld);normalMatrix.getNormalMatrix(object.matrixWorld);
        const material=Array.isArray(object.material)?object.material[0]:object.material;
        if(!colors.has(material)){const color=material.color.clone().convertLinearToSRGB();colors.set(material,[color.r*255,color.g*255,color.b*255]);}
        const base=colors.get(material);
        for(const face of getFaces(object.geometry)){
          const projected=face.points.map(p=>{point.fromArray(p).applyMatrix4(mvp);return [(point.x*.5+.5)*width,(-point.y*.5+.5)*height,point.z];});
          if(projected.some(p=>p[2]<-1||p[2]>1))continue;
          const [p,q,r]=projected;const area=(q[0]-p[0])*(r[1]-p[1])-(q[1]-p[1])*(r[0]-p[0]);if(area>=0)continue;
          normal.fromArray(face.normal).applyMatrix3(normalMatrix).normalize();
          const illumination=.22+Math.max(0,normal.dot(light))*(strength*.23)+Math.max(0,normal.y)*.12;
          const rgb=base.map(v=>Math.min(255,Math.round(v*illumination)));
          triangles.push({p:projected,z:(p[2]+q[2]+r[2])/3,color:`rgb(${rgb.join(',')})`});
        }
      });
      triangles.sort((a,b)=>b.z-a.z);
      for(const triangle of triangles){ctx.beginPath();ctx.moveTo(...triangle.p[0].slice(0,2));ctx.lineTo(...triangle.p[1].slice(0,2));ctx.lineTo(...triangle.p[2].slice(0,2));ctx.closePath();ctx.fillStyle=triangle.color;ctx.fill();}
    },dispose(){ctx.clearRect(0,0,canvas.width,canvas.height);}
  };
}
