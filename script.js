const yearNode = document.querySelector("#year");
if (yearNode) yearNode.textContent = new Date().getFullYear();

const progressBar = document.querySelector("#scroll-progress-bar");
const updateProgress = () => {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const progress = max > 0 ? window.scrollY / max : 0;
  progressBar?.style.setProperty("width", `${Math.min(1, Math.max(0, progress)) * 100}%`);
};
window.addEventListener("scroll", updateProgress, { passive: true });
updateProgress();

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const gsapReady = window.gsap && window.ScrollTrigger;
if (!reducedMotion && gsapReady) {
  gsap.registerPlugin(ScrollTrigger);
  document.documentElement.classList.add("motion-ready");
  gsap.utils.toArray(".reveal").forEach((element) => {
    gsap.fromTo(element,
      { autoAlpha: 0, y: 70, rotateX: 9, scale: 0.96, transformPerspective: 1100 },
      {
        autoAlpha: 1,
        y: 0,
        rotateX: 0,
        scale: 1,
        ease: "none",
        scrollTrigger: { trigger: element, start: "top 94%", end: "top 58%", scrub: 0.7 },
      }
    );
  });

  const sceneShell = document.querySelector(".scene-shell");
  if (sceneShell) {
    gsap.to(sceneShell, {
      opacity: 0.08,
      scale: 0.78,
      x: 55,
      ease: "none",
      scrollTrigger: {
        trigger: "#journey",
        start: "top bottom",
        endTrigger: "#skills",
        end: "top 35%",
        scrub: 1,
      },
    });
  }
}

const canvas = document.querySelector("#scene-canvas");
if (!canvas || reducedMotion) {
  canvas?.setAttribute("hidden", "");
} else {
  import("three")
    .then((THREE) => {
      const shell = document.querySelector(".scene-shell");
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
      camera.position.z = 5.5;

      const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.65));
      renderer.setSize(shell.clientWidth, shell.clientHeight, false);
      renderer.outputColorSpace = THREE.SRGBColorSpace;

      const scrollGroup = new THREE.Group();
      const spinGroup = new THREE.Group();
      scene.add(scrollGroup);
      scrollGroup.add(spinGroup);

      const coreMaterial = new THREE.MeshStandardMaterial({
        color: 0x173b43,
        metalness: 0.58,
        roughness: 0.28,
        transparent: true,
        opacity: 0.3,
        wireframe: true,
      });
      const core = new THREE.Mesh(new THREE.IcosahedronGeometry(1.12, 2), coreMaterial);
      spinGroup.add(core);

      const inner = new THREE.Mesh(
        new THREE.IcosahedronGeometry(0.72, 1),
        new THREE.MeshBasicMaterial({ color: 0x5de1d1, wireframe: true, transparent: true, opacity: 0.3 })
      );
      spinGroup.add(inner);

      const ringMaterials = [
        new THREE.MeshBasicMaterial({ color: 0x63e0d2, transparent: true, opacity: 0.63 }),
        new THREE.MeshBasicMaterial({ color: 0xf2bd67, transparent: true, opacity: 0.72 }),
        new THREE.MeshBasicMaterial({ color: 0x55aeb2, transparent: true, opacity: 0.42 }),
      ];
      const ringConfigs = [
        { radius: 1.48, tube: 0.008, rotation: [0.75, 0.2, 0.25] },
        { radius: 1.33, tube: 0.007, rotation: [1.25, 0.65, -0.55] },
        { radius: 1.61, tube: 0.006, rotation: [0.2, 1.0, 0.85] },
      ];
      ringConfigs.forEach((config, index) => {
        const ring = new THREE.Mesh(
          new THREE.TorusGeometry(config.radius, config.tube, 6, 180),
          ringMaterials[index]
        );
        ring.rotation.set(...config.rotation);
        spinGroup.add(ring);
      });

      const glow = new THREE.Mesh(
        new THREE.SphereGeometry(0.18, 24, 24),
        new THREE.MeshBasicMaterial({ color: 0x63e0d2, transparent: true, opacity: 0.8 })
      );
      glow.position.set(-0.72, 0.8, 0.45);
      spinGroup.add(glow);

      const neuralPoints = [];
      const nodeGeometry = new THREE.SphereGeometry(0.027, 10, 10);
      const nodeMaterial = new THREE.MeshBasicMaterial({ color: 0x83f1e3, transparent: true, opacity: 0.78 });
      const networkSize = 18;
      for (let index = 0; index < networkSize; index += 1) {
        const y = 1 - (2 * (index + 0.5)) / networkSize;
        const radius = Math.sqrt(1 - y * y);
        const angle = index * 2.399963229728653;
        const point = new THREE.Vector3(Math.cos(angle) * radius, y, Math.sin(angle) * radius).multiplyScalar(1.38);
        neuralPoints.push(point);
        const node = new THREE.Mesh(nodeGeometry, nodeMaterial);
        node.position.copy(point);
        spinGroup.add(node);
      }
      const links = [];
      neuralPoints.forEach((point, index) => {
        [index + 1, index + 5].forEach((neighbor) => {
          if (neighbor < neuralPoints.length) links.push(point, neuralPoints[neighbor]);
        });
      });
      const networkGeometry = new THREE.BufferGeometry().setFromPoints(links);
      const networkLines = new THREE.LineSegments(
        networkGeometry,
        new THREE.LineBasicMaterial({ color: 0x63e0d2, transparent: true, opacity: 0.19 })
      );
      spinGroup.add(networkLines);

      scene.add(new THREE.AmbientLight(0xffffff, 1.1));
      const keyLight = new THREE.PointLight(0x63e0d2, 12, 10);
      keyLight.position.set(2, 2, 4);
      scene.add(keyLight);

      const resize = () => {
        const width = shell.clientWidth;
        const height = shell.clientHeight;
        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
      };
      window.addEventListener("resize", resize, { passive: true });

      const supportsScrollTrigger = window.gsap && window.ScrollTrigger;
      if (supportsScrollTrigger) {
        gsap.to(scrollGroup.rotation, {
          x: 0.55,
          y: Math.PI * 1.55,
          z: -0.38,
          ease: "none",
          scrollTrigger: { trigger: document.body, start: "top top", end: "bottom bottom", scrub: 1.2 },
        });
        gsap.to(scrollGroup.scale, {
          x: 0.78,
          y: 0.78,
          z: 0.78,
          ease: "none",
          scrollTrigger: { trigger: "#projects", start: "top bottom", end: "bottom center", scrub: 1 },
        });
      }

      let rotationSpeed = 0.0018;
      let dragging = false;
      let lastPointerX = 0;
      let lastPointerY = 0;
      const clampSpeed = (speed) => THREE.MathUtils.clamp(speed, -0.012, 0.012);

      canvas.addEventListener("pointerdown", (event) => {
        if (event.pointerType === "mouse" && event.button !== 0) return;
        dragging = true;
        lastPointerX = event.clientX;
        lastPointerY = event.clientY;
        canvas.classList.add("is-dragging");
        canvas.setPointerCapture(event.pointerId);
      });
      canvas.addEventListener("pointermove", (event) => {
        if (!dragging) return;
        const deltaX = event.clientX - lastPointerX;
        const deltaY = event.clientY - lastPointerY;
        lastPointerX = event.clientX;
        lastPointerY = event.clientY;
        spinGroup.rotation.y += deltaX * 0.008;
        spinGroup.rotation.x += deltaY * 0.008;
        rotationSpeed = clampSpeed(rotationSpeed + deltaX * 0.000025);
      });
      const endDrag = () => {
        dragging = false;
        canvas.classList.remove("is-dragging");
      };
      canvas.addEventListener("pointerup", endDrag);
      canvas.addEventListener("pointercancel", endDrag);
      canvas.addEventListener("lostpointercapture", endDrag);
      canvas.addEventListener("wheel", (event) => {
        rotationSpeed = clampSpeed(rotationSpeed + (event.deltaY < 0 ? 0.0007 : -0.0007));
      }, { passive: true });

      const clock = new THREE.Clock();
      const render = () => {
        const time = clock.getElapsedTime();
        spinGroup.rotation.y += rotationSpeed;
        if (!dragging) spinGroup.rotation.x = Math.sin(time * 0.32) * 0.07;
        glow.material.opacity = 0.58 + Math.sin(time * 1.7) * 0.12;
        renderer.render(scene, camera);
        requestAnimationFrame(render);
      };
      shell.classList.add("scene-ready");
      render();
    })
    .catch(() => {
      canvas.setAttribute("hidden", "");
    });
}
