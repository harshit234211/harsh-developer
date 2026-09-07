/**
 * HARSH DEVELOPER — 3D CYBERNETIC DEVELOPER CORE
 * Real WebGL Three.js Interactive Experience
 * Features:
 * - Geometric cyber-core with multi-axis gimbal rings
 * - Holographic data nodes & glowing energy core
 * - 1,200-node cyberspace particle constellation
 * - Smooth pointer/touch parallax lerping
 * - Battery-friendly auto-pause when out of viewport
 * - Graceful WebGL fallback detection & cleanup
 */

(function () {
  let scene, camera, renderer, animationFrameId;
  let coreGroup, innerNode, ring1, ring2, ring3, dataNodesGroup, particleSystem;
  let mouseX = 0, mouseY = 0;
  let targetRotationX = 0, targetRotationY = 0;
  let isVisible = true;
  let container, canvas;

  // WebGL availability check
  function isWebGLAvailable() {
    try {
      const testCanvas = document.createElement('canvas');
      return !!(
        window.WebGLRenderingContext &&
        (testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl'))
      );
    } catch (e) {
      return false;
    }
  }

  function initThreeScene() {
    container = document.getElementById('three-container');
    canvas = document.getElementById('three-canvas');
    const fallback = document.getElementById('three-fallback');

    if (!container || !canvas) return;

    if (!isWebGLAvailable() || typeof THREE === 'undefined') {
      console.warn('[3D Engine] WebGL not available or Three.js CDN failed to load. Enabling fallback visual.');
      if (fallback) fallback.style.display = 'flex';
      if (canvas) canvas.style.display = 'none';
      return;
    }

    const width = container.clientWidth || 500;
    const height = container.clientHeight || 500;

    // 1. Scene
    scene = new THREE.Scene();

    // 2. Camera
    camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 12;

    // 3. Renderer
    renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

    // 4. Lighting
    const ambientLight = new THREE.AmbientLight(0x0e172a, 2.0);
    scene.add(ambientLight);

    const cyanLight = new THREE.PointLight(0x00f0ff, 4, 30);
    cyanLight.position.set(6, 6, 8);
    scene.add(cyanLight);

    const violetLight = new THREE.PointLight(0x8a2be2, 3.5, 30);
    violetLight.position.set(-6, -6, 6);
    scene.add(violetLight);

    const emeraldLight = new THREE.PointLight(0x10b981, 2.5, 20);
    emeraldLight.position.set(0, -6, -4);
    scene.add(emeraldLight);

    // 5. Build Core Group
    coreGroup = new THREE.Group();

    // Inner Pulsating Octahedron (The Tech Core)
    const innerGeo = new THREE.OctahedronGeometry(1.2, 0);
    const innerMat = new THREE.MeshStandardMaterial({
      color: 0x00f0ff,
      emissive: 0x0088ff,
      emissiveIntensity: 0.6,
      roughness: 0.2,
      metalness: 0.9,
      wireframe: false
    });
    innerNode = new THREE.Mesh(innerGeo, innerMat);
    coreGroup.add(innerNode);

    // Mid Wireframe Icosahedron
    const icoGeo = new THREE.IcosahedronGeometry(2.2, 1);
    const icoMat = new THREE.MeshStandardMaterial({
      color: 0x00f0ff,
      wireframe: true,
      transparent: true,
      opacity: 0.85,
      emissive: 0x004488,
      emissiveIntensity: 0.3
    });
    const icoMesh = new THREE.Mesh(icoGeo, icoMat);
    coreGroup.add(icoMesh);

    // Gimbal Ring 1 (Cyan Equatorial Ring)
    const ring1Geo = new THREE.TorusGeometry(3.3, 0.035, 16, 100);
    const ring1Mat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      transparent: true,
      opacity: 0.75
    });
    ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    coreGroup.add(ring1);

    // Gimbal Ring 2 (Violet Polar Ring)
    const ring2Geo = new THREE.TorusGeometry(3.9, 0.035, 16, 100);
    const ring2Mat = new THREE.MeshBasicMaterial({
      color: 0x9d4edd,
      transparent: true,
      opacity: 0.7
    });
    ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.x = Math.PI / 3;
    coreGroup.add(ring2);

    // Gimbal Ring 3 (Emerald Outer Ring)
    const ring3Geo = new THREE.TorusGeometry(4.5, 0.03, 16, 100);
    const ring3Mat = new THREE.MeshBasicMaterial({
      color: 0x10b981,
      transparent: true,
      opacity: 0.55
    });
    ring3 = new THREE.Mesh(ring3Geo, ring3Mat);
    ring3.rotation.y = Math.PI / 4;
    coreGroup.add(ring3);

    // Data Nodes Orbiting
    dataNodesGroup = new THREE.Group();
    const nodeCount = 8;
    const nodeGeo = new THREE.BoxGeometry(0.18, 0.18, 0.18);
    const nodeMat = new THREE.MeshStandardMaterial({
      color: 0x00f0ff,
      emissive: 0x00f0ff,
      emissiveIntensity: 0.8
    });

    for (let i = 0; i < nodeCount; i++) {
      const angle = (i / nodeCount) * Math.PI * 2;
      const radius = 3.3;
      const node = new THREE.Mesh(nodeGeo, nodeMat);
      node.position.set(Math.cos(angle) * radius, Math.sin(angle) * radius, 0);
      dataNodesGroup.add(node);
    }
    coreGroup.add(dataNodesGroup);

    scene.add(coreGroup);

    // 6. Cyberspace Particle Constellation
    const particleCount = 1000;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const colorChoices = [
      new THREE.Color(0x00f0ff), // Cyan
      new THREE.Color(0x8a2be2), // Violet
      new THREE.Color(0x10b981), // Emerald
      new THREE.Color(0xffffff)  // White star
    ];

    for (let i = 0; i < particleCount; i++) {
      const radius = 6 + Math.random() * 12;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);

      const chosenColor = colorChoices[Math.floor(Math.random() * colorChoices.length)];
      colors[i * 3] = chosenColor.r;
      colors[i * 3 + 1] = chosenColor.g;
      colors[i * 3 + 2] = chosenColor.b;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.05,
      vertexColors: true,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending
    });

    particleSystem = new THREE.Points(particleGeo, particleMat);
    scene.add(particleSystem);

    // 7. Event Listeners (Pointer & Parallax)
    window.addEventListener('mousemove', onPointerMove, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('resize', onWindowResize);

    // 8. Performance Optimization: Pause rendering when offscreen
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        isVisible = entries[0].isIntersecting;
      }, { threshold: 0.1 });
      observer.observe(container);
    }

    // 9. Start Animation Loop
    animate(0);
  }

  function onPointerMove(e) {
    mouseX = (e.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    targetRotationY = mouseX * 0.45;
    targetRotationX = -mouseY * 0.45;
  }

  function onTouchMove(e) {
    if (e.touches.length > 0) {
      const touch = e.touches[0];
      mouseX = (touch.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(touch.clientY / window.innerHeight) * 2 + 1;
      targetRotationY = mouseX * 0.35;
      targetRotationX = -mouseY * 0.35;
    }
  }

  function onWindowResize() {
    if (!container || !renderer || !camera) return;
    const width = container.clientWidth;
    const height = container.clientHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  }

  let clock = new THREE.Clock();

  function animate(timestamp) {
    animationFrameId = requestAnimationFrame(animate);

    if (!isVisible) return; // Skip calculation when out of view

    const delta = clock.getDelta();
    const elapsedTime = clock.getElapsedTime();

    // Smooth Lerp for interactive tilt
    coreGroup.rotation.y += (targetRotationY - coreGroup.rotation.y) * 0.06;
    coreGroup.rotation.x += (targetRotationX - coreGroup.rotation.x) * 0.06;

    // Autonomous Core Rotations
    innerNode.rotation.y += delta * 0.8;
    innerNode.rotation.x += delta * 0.5;

    // Pulsing Scale
    const pulse = 1 + Math.sin(elapsedTime * 2.5) * 0.08;
    innerNode.scale.set(pulse, pulse, pulse);

    // Gimbal Rings Rotations
    ring1.rotation.z += delta * 0.4;
    ring2.rotation.y -= delta * 0.35;
    ring3.rotation.x += delta * 0.3;

    // Data Nodes Orbiting
    dataNodesGroup.rotation.z += delta * 0.5;

    // Subtle Particle Drift
    particleSystem.rotation.y += delta * 0.05;
    particleSystem.rotation.x += delta * 0.02;

    renderer.render(scene, camera);
  }

  // Lifecycle Cleanup (Exported)
  window.destroyThreeScene = function () {
    if (animationFrameId) cancelAnimationFrame(animationFrameId);
    window.removeEventListener('mousemove', onPointerMove);
    window.removeEventListener('touchmove', onTouchMove);
    window.removeEventListener('resize', onWindowResize);

    if (renderer) {
      renderer.dispose();
    }
  };

  // Auto-init on DOMContentLoaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initThreeScene);
  } else {
    initThreeScene();
  }
})();
