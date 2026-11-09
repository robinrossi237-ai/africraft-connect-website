import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uProgress;
  uniform vec2 uMouse;
  uniform float uSize;
  varying float vH;
  varying float vFade;
  void main() {
    vec3 p = position;
    float t = uTime;
    float w = sin(p.x * 0.42 + t * 0.55) * 0.55
            + cos(p.z * 0.5 + t * 0.75) * 0.45
            + sin((p.x + p.z) * 0.22 + t * 0.35) * 0.65;
    vec2 m = vec2(uMouse.x * 13.0, -7.0 + uMouse.y * 5.0);
    float d = distance(p.xz, m);
    w += exp(-d * d * 0.06) * 1.4;
    p.y += w * (0.9 + uProgress * 0.9);
    vH = w;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize * (9.0 / -mv.z);
    vFade = smoothstep(46.0, 5.0, -mv.z) * smoothstep(0.3, 2.5, -mv.z);
  }
`;

const fragmentShader = /* glsl */ `
  varying float vH;
  varying float vFade;
  void main() {
    float r = length(gl_PointCoord - 0.5);
    if (r > 0.5) discard;
    float a = smoothstep(0.5, 0.05, r);
    vec3 violet = vec3(0.62, 0.52, 1.0);
    vec3 lilac = vec3(0.85, 0.8, 1.0);
    vec3 gold = vec3(1.0, 0.76, 0.36);
    vec3 col = mix(violet, lilac, smoothstep(-0.6, 0.8, vH));
    col = mix(col, gold, smoothstep(1.1, 2.0, vH));
    gl_FragColor = vec4(col, a * vFade);
  }
`;

/** The brand wave as a field of light points, in 3D. It breathes on its
 *  own, rises under the pointer, and the camera glides in as the page
 *  scrolls ([progress], a motion value from 0 to 1). */
export function ParticleWave({ progress }) {
  const ref = useRef(null);

  useEffect(() => {
    const host = ref.current;
    if (!host) return undefined;
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true, powerPreference: 'high-performance' });
    } catch {
      return undefined; // No WebGL: the gradient behind stays.
    }
    const ratio = Math.min(window.devicePixelRatio || 1, 1.75);
    renderer.setPixelRatio(ratio);
    host.appendChild(renderer.domElement);

    const small = window.innerWidth < 760;
    const COLS = small ? 90 : 170;
    const ROWS = small ? 46 : 80;
    const GAP = small ? 0.42 : 0.3;
    const pos = new Float32Array(COLS * ROWS * 3);
    let k = 0;
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        pos[k++] = (c - COLS / 2) * GAP;
        pos[k++] = 0;
        pos[k++] = -r * GAP * 1.15 + 2;
      }
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const uniforms = {
      uTime: { value: 0 },
      uProgress: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uSize: { value: (small ? 3.6 : 3.4) * ratio },
    };
    const mat = new THREE.ShaderMaterial({
      uniforms,
      vertexShader,
      fragmentShader,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const scene = new THREE.Scene();
    scene.add(new THREE.Points(geo, mat));
    const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 200);

    const resize = () => {
      const w = host.clientWidth;
      const h = host.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / Math.max(h, 1);
      camera.updateProjectionMatrix();
    };
    const ro = new ResizeObserver(resize);
    ro.observe(host);
    resize();

    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    const onMove = (e) => {
      mouse.tx = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.ty = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener('pointermove', onMove, { passive: true });

    let visible = true;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(host);

    let raf = 0;
    let last = performance.now();
    const frame = (now) => {
      raf = requestAnimationFrame(frame);
      if (!visible) return;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (!still) uniforms.uTime.value += dt;
      mouse.x += (mouse.tx - mouse.x) * 0.05;
      mouse.y += (mouse.ty - mouse.y) * 0.05;
      uniforms.uMouse.value.set(mouse.x, mouse.y);
      const p = progress ? progress.get() : 0;
      uniforms.uProgress.value = p;
      camera.position.set(mouse.x * 0.8, 3.4 - p * 1.9 + mouse.y * 0.3, 9 - p * 8);
      camera.lookAt(mouse.x * 0.5, -0.4 - p * 0.6, -8);
      renderer.render(scene, camera);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener('pointermove', onMove);
      geo.dispose();
      mat.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [progress]);

  return <div className="wavefield" ref={ref} aria-hidden="true" />;
}
