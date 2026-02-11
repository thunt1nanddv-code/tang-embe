import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

let scene, camera, renderer, controls, dragonParticles, animationId;
let photos = [];
let currentQuiz = 0;

const quizzes = [
    { ch: "CHƯƠNG I: CÁI NẾT ĐÁNG YÊU", q: "Món ăn nào là 'chân ái' của em?", options: ["Trà sữa", "Bún đậu", "Mì cay", "Cơm anh nấu"], a: 3, hint: "Ngọt ngào như em vậy!" },
    { ch: "CHƯƠNG I: CÁI NẾT ĐÁNG YÊU", q: "Em bảo 'Em không sao' nghĩa là gì?", options: ["Dỗ em mau", "Em ổn thật", "Anh tới số rồi", "A và C đúng"], a: 3, hint: "Đừng tin lời con gái nói nha!" },
    { ch: "CHƯƠNG I: CÁI NẾT ĐÁNG YÊU", q: "Lúc đói em giống con gì nhất?", options: ["Mèo", "Hổ đói", "Khủng long", "Gấu lười"], a: 2, hint: "Lúc đó em hơi bị đáng sợ đấy..." },
    { ch: "CHƯƠNG II: SIÊU QUẬY CÔNG CHÚA", q: "Câu của em hay nói nhất là gì?", options: ["Cacc", "llll", "lmj", "Cả 3 luôn"], a: 3, hint: "Thừa nhận đi nào quỷ sứ!" },
    { ch: "CHƯƠNG II: SIÊU QUẬY CÔNG CHÚA", q: "Nếu có siêu năng lực, em sẽ là gì?", options: ["Nữ hoàng bơ anh", "Chiến thần ăn", "Siêu nhân dỗi", "Wonder Woman"], a: 0, hint: "Kỹ năng ngủ xuyên lục địa của em đó." },
    { ch: "CHƯƠNG II: SIÊU QUẬY CÔNG CHÚA", q: "Em ăn gì?", options: ["Gì cũng được", "Tùy anh", "Em ko biết", "Ăn anh"], a: 3, hint: "Câu đố khó nhất thiên niên kỷ." },
    { ch: "CHƯƠNG II: SIÊU QUẬY CÔNG CHÚA", q: "Ai là người luôn đúng?", options: ["Em", "Vợ anh", "Bé yêu", "Tất cả đúng"], a: 3, hint: "Châm ngôn sống của anh rồi." },
    { ch: "CHƯƠNG III: VŨ TRỤ VÀ SINH NHẬT", q: "Anh đẹp trai nhất khi nào?", options: ["Lúc nhìn em", "Lúc nấu ăn", "Lúc dỗ em", "Luôn luôn!"], a: 3, hint: "Chọn câu nịnh anh nhất đi." },
    { ch: "CHƯƠNG III: VŨ TRỤ VÀ SINH NHẬT", q: "Quà gì em muốn nhận nhất?", options: ["Hôn anh", "Vũ trụ này", "Tình yêu", "Tất cả luôn"], a: 3, hint: "Tham lam một tí mới đáng yêu." },
    { ch: "CHƯƠNG III: VŨ TRỤ VÀ SINH NHẬT", q: "Sẵn sàng đón tuổi 18 rực rỡ chưa?", options: ["Sẵn sàng!", "Rất sẵn sàng!", "Đợi nãy giờ", "Mở quà thôi!"], a: 3, hint: "Nhấn nút cuối cùng để gặp Rồng!" }
];

window.startGame = () => { showQuiz(); };

function showQuiz() {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById('screen-quiz').classList.add('active');
    const q = quizzes[currentQuiz];
    document.getElementById('chapter-name').innerText = q.ch;
    document.getElementById('quiz-title').innerText = `Câu hỏi ${currentQuiz + 1}/10`;
    document.getElementById('quiz-question').innerText = q.q;
    document.getElementById('quiz-hint').innerText = `Gợi ý: ${q.hint}`;
    const optionsContainer = document.getElementById('quiz-options');
    optionsContainer.innerHTML = "";
    q.options.forEach((opt, i) => {
        const btn = document.createElement('button');
        btn.className = 'btn';
        btn.innerText = opt;
        btn.onclick = () => {
            if (i === q.a) {
                confetti({ particleCount: 100, spread: 70, origin: { y: 0.8 } });
                currentQuiz++;
                if (currentQuiz < quizzes.length) showQuiz();
                else showFinal();
            } else { alert("Sai rồi đồ embee đáng yêu! Thử lại nha 😜"); }
        };
        optionsContainer.appendChild(btn);
    });
}

function showFinal() {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById('screen-final').classList.add('active');
    document.getElementById('final-wish').innerHTML = `
        <div style="text-align: left; font-size: 0.95em; color: #ffebee; line-height: 1.6;">
            <p>✨ <b>Gửi bé yêu 1m61 của anh:</b></p>
            <p>Chúc mừng sinh nhật cô gái tuyệt vời nhất ngày 12/02! Sang tuổi 18, chúc em luôn rạng rỡ như ánh sao, xinh đẹp bất chấp camera thường và lúc nào cũng tràn ngập niềm vui.</p>
            <p>Cảm ơn em đã xuất hiện và làm cho thế giới của anh trở nên màu sắc hơn. Anh hy vọng mình được là người mà em yêu nhiều nhất, anh chỉ ước em luôn bình an, luôn hạnh phúc dù sau này có bao nhiêu thay đổi đi nữa.</p>
            <p>💖 <b>Mãi là công chúa của anh nhé! Yêu em nhất!</b></p>
        </div>
    `;
}

window.openUniverse = () => {
    document.getElementById('universe-overlay').style.display = 'block';
    initThree();
};

window.closeUniverse = () => {
    document.getElementById('universe-overlay').style.display = 'none';
    cancelAnimationFrame(animationId);
};

function initThree() {
    const container = document.getElementById('canvas-container');
    container.innerHTML = "";
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 2000);
    camera.position.z = 150;

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.5;

    scene.add(new THREE.AmbientLight(0xffffff, 2.0));

    // Hiệu ứng sao nền
    const starGeo = new THREE.BufferGeometry();
    const starPos = [];
    for (let i = 0; i < 8000; i++) starPos.push((Math.random() - 0.5) * 1500, (Math.random() - 0.5) * 1500, (Math.random() - 0.5) * 1500);
    starGeo.setAttribute('position', new THREE.Float32BufferAttribute(starPos, 3));
    scene.add(new THREE.Points(starGeo, new THREE.PointsMaterial({ color: 0xffffff, size: 0.8 })));

    // Rồng Thần
    const dragonPoints = 3500;
    const dragonGeo = new THREE.BufferGeometry();
    const dPos = new Float32Array(dragonPoints * 3);
    const dCol = new Float32Array(dragonPoints * 3);
    for (let i = 0; i < dragonPoints; i++) {
        const c = new THREE.Color().setHSL(i / dragonPoints, 1, 0.5);
        dCol[i * 3] = c.r; dCol[i * 3 + 1] = c.g; dCol[i * 3 + 2] = c.b;
    }
    dragonGeo.setAttribute('position', new THREE.BufferAttribute(dPos, 3));
    dragonGeo.setAttribute('color', new THREE.BufferAttribute(dCol, 3));
    dragonParticles = new THREE.Points(dragonGeo, new THREE.PointsMaterial({ size: 0.7, vertexColors: true, blending: THREE.AdditiveBlending }));
    scene.add(dragonParticles);

    // --- XỬ LÝ LOAD ẢNH VƯỢT NGROK ---
    const loader = new THREE.TextureLoader();

    // Header quan trọng nhất để vượt qua trang cảnh báo của Ngrok
    loader.setRequestHeader({ 'ngrok-skip-browser-warning': 'true' });

    for (let i = 1; i <= 50; i++) {
        const tryLoad = (basePath, index) => {
            // Thêm v=... để tránh cache lỗi của ngrok
            const finalUrl = basePath + "?v=" + Math.floor(Math.random() * 1000);

            loader.load(finalUrl, (tex) => {
                tex.minFilter = THREE.LinearFilter;
                const mesh = new THREE.Mesh(
                    new THREE.PlaneGeometry(12, 16),
                    new THREE.MeshBasicMaterial({ map: tex, side: 2, transparent: true, opacity: 0 })
                );

                const phi = Math.acos(-1 + (2 * index) / 50);
                const theta = Math.sqrt(50 * Math.PI) * phi;
                mesh.position.set(85 * Math.cos(theta) * Math.sin(phi), 85 * Math.sin(theta) * Math.sin(phi), 85 * Math.cos(phi));
                mesh.lookAt(0, 0, 0);

                scene.add(mesh);
                photos.push(mesh);
                gsap.to(mesh.material, { opacity: 1, duration: 1.2 });
                mesh.userData = { url: basePath };
            }, undefined, () => {
                // Tự động thử lại với các trường hợp đuôi file khác nhau
                if (basePath.endsWith('.jpg')) {
                    tryLoad(`ebe/${index}.jpg.jpg`, index);
                } else if (basePath.endsWith('.jpg.jpg')) {
                    tryLoad(`ebe/${index}.JPG`, index);
                }
            });
        };
        tryLoad(`ebe/${i}.jpg`, i);
    }

    // Sự kiện tương tác
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    const onSelect = (e) => {
        let clientX = e.clientX || (e.touches && e.touches[0].clientX);
        let clientY = e.clientY || (e.touches && e.touches[0].clientY);
        if (!clientX) return;
        mouse.x = (clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(clientY / window.innerHeight) * 2 + 1;
        raycaster.setFromCamera(mouse, camera);
        const inter = raycaster.intersectObjects(photos);
        if (inter.length > 0) {
            document.getElementById('full-img').src = inter[0].object.userData.url;
            document.getElementById('photo-modal').style.display = 'flex';
        }
    };

    renderer.domElement.addEventListener('click', onSelect);
    renderer.domElement.addEventListener('touchstart', onSelect);

    function animate(time) {
        animationId = requestAnimationFrame(animate);
        controls.update();
        const pos = dragonParticles.geometry.attributes.position.array;
        for (let i = 0; i < dragonPoints; i++) {
            const t = time * 0.0008 + i * 0.005;
            pos[i * 3] = Math.sin(t) * 70 + Math.cos(t * 0.5) * 35;
            pos[i * 3 + 1] = Math.cos(t * 0.6) * 70;
            pos[i * 3 + 2] = Math.sin(t * 0.3) * 70;
        }
        dragonParticles.geometry.attributes.position.needsUpdate = true;
        renderer.render(scene, camera);
    }
    animate();
}