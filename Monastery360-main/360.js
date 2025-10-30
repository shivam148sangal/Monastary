class MonasteryViewer {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.monastery = null;
        this.autoRotate = true;
        this.rotationSpeed = 0.5;
        this.currentView = 'exterior';
        
        this.init();
    }
    
    init() {
        this.setupScene();
        this.createMonastery();
        this.setupLighting();
        this.setupControls();
        this.setupEventListeners();
        this.animate();
        
        // Hide loading screen and show viewer
        setTimeout(() => {
            document.getElementById('loading').style.display = 'none';
            document.getElementById('viewer').style.display = 'block';
            document.getElementById('viewer').classList.add('fade-in');
        }, 2000);
    }
    
    setupScene() {
        // Scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x87CEEB); // Sky blue
        
        // Camera
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.set(0, 5, 15);
        
        // Renderer
        const canvas = document.getElementById('monastery-canvas');
        this.renderer = new THREE.WebGLRenderer({ 
            canvas: canvas,
            antialias: true 
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.setClearColor(0x87CEEB);
    }
    
    createMonastery() {
        this.monastery = new THREE.Group();
        
        // Create monastery building
        this.createMainBuilding();
        this.createChapel();
        this.createCloister();
        this.createTower();
        this.createGarden();
        this.createGround();
        this.createSkybox();
        
        this.scene.add(this.monastery);
    }
    
    createMainBuilding() {
        const geometry = new THREE.BoxGeometry(8, 6, 8);
        const material = new THREE.MeshLambertMaterial({ 
            color: 0x8B7355,
            transparent: true,
            opacity: 0.9
        });
        const building = new THREE.Mesh(geometry, material);
        building.position.set(0, 3, 0);
        building.castShadow = true;
        building.receiveShadow = true;
        this.monastery.add(building);
        
        // Add windows
        for (let i = 0; i < 4; i++) {
            const windowGeometry = new THREE.BoxGeometry(1, 2, 0.1);
            const windowMaterial = new THREE.MeshLambertMaterial({ 
                color: 0x000080,
                transparent: true,
                opacity: 0.7
            });
            const window = new THREE.Mesh(windowGeometry, windowMaterial);
            
            const angle = (i * Math.PI) / 2;
            window.position.set(
                Math.cos(angle) * 4.1,
                3,
                Math.sin(angle) * 4.1
            );
            window.rotation.y = angle;
            this.monastery.add(window);
        }
        
        // Add roof
        const roofGeometry = new THREE.ConeGeometry(6, 2, 4);
        const roofMaterial = new THREE.MeshLambertMaterial({ color: 0x8B0000 });
        const roof = new THREE.Mesh(roofGeometry, roofMaterial);
        roof.position.set(0, 7, 0);
        roof.rotation.y = Math.PI / 4;
        roof.castShadow = true;
        this.monastery.add(roof);
    }
    
    createChapel() {
        const geometry = new THREE.BoxGeometry(4, 8, 6);
        const material = new THREE.MeshLambertMaterial({ color: 0x696969 });
        const chapel = new THREE.Mesh(geometry, material);
        chapel.position.set(8, 4, 0);
        chapel.castShadow = true;
        chapel.receiveShadow = true;
        this.monastery.add(chapel);
        
        // Chapel roof
        const roofGeometry = new THREE.ConeGeometry(3, 1.5, 4);
        const roofMaterial = new THREE.MeshLambertMaterial({ color: 0x8B0000 });
        const chapelRoof = new THREE.Mesh(roofGeometry, roofMaterial);
        chapelRoof.position.set(8, 9, 0);
        chapelRoof.rotation.y = Math.PI / 4;
        chapelRoof.castShadow = true;
        this.monastery.add(chapelRoof);
        
        // Chapel windows (stained glass effect)
        for (let i = 0; i < 3; i++) {
            const windowGeometry = new THREE.BoxGeometry(0.8, 3, 0.1);
            const windowMaterial = new THREE.MeshLambertMaterial({ 
                color: new THREE.Color().setHSL(i * 0.3, 0.8, 0.5),
                transparent: true,
                opacity: 0.6
            });
            const window = new THREE.Mesh(windowGeometry, windowMaterial);
            window.position.set(8, 4, -2.5 + i * 2.5);
            this.monastery.add(window);
        }
    }
    
    createCloister() {
        // Create cloister walkway
        const cloisterGroup = new THREE.Group();
        
        for (let i = 0; i < 4; i++) {
            const geometry = new THREE.BoxGeometry(6, 4, 1);
            const material = new THREE.MeshLambertMaterial({ color: 0x8B7355 });
            const wall = new THREE.Mesh(geometry, material);
            
            const angle = (i * Math.PI) / 2;
            wall.position.set(
                Math.cos(angle) * 3,
                2,
                Math.sin(angle) * 3
            );
            wall.rotation.y = angle;
            wall.castShadow = true;
            wall.receiveShadow = true;
            cloisterGroup.add(wall);
        }
        
        // Add columns
        for (let i = 0; i < 16; i++) {
            const columnGeometry = new THREE.CylinderGeometry(0.2, 0.2, 4);
            const columnMaterial = new THREE.MeshLambertMaterial({ color: 0x696969 });
            const column = new THREE.Mesh(columnGeometry, columnMaterial);
            
            const side = Math.floor(i / 4);
            const position = (i % 4) - 1.5;
            const angle = (side * Math.PI) / 2;
            
            column.position.set(
                Math.cos(angle) * 2.5 + Math.cos(angle + Math.PI/2) * position * 1.5,
                2,
                Math.sin(angle) * 2.5 + Math.sin(angle + Math.PI/2) * position * 1.5
            );
            column.castShadow = true;
            cloisterGroup.add(column);
        }
        
        cloisterGroup.position.set(-2, 0, -2);
        this.monastery.add(cloisterGroup);
    }
    
    createTower() {
        const geometry = new THREE.CylinderGeometry(1.5, 2, 12);
        const material = new THREE.MeshLambertMaterial({ color: 0x696969 });
        const tower = new THREE.Mesh(geometry, material);
        tower.position.set(-8, 6, 0);
        tower.castShadow = true;
        tower.receiveShadow = true;
        this.monastery.add(tower);
        
        // Tower roof
        const roofGeometry = new THREE.ConeGeometry(2, 3, 8);
        const roofMaterial = new THREE.MeshLambertMaterial({ color: 0x8B0000 });
        const towerRoof = new THREE.Mesh(roofGeometry, roofMaterial);
        towerRoof.position.set(-8, 13.5, 0);
        towerRoof.castShadow = true;
        this.monastery.add(towerRoof);
        
        // Tower windows
        for (let i = 0; i < 3; i++) {
            const windowGeometry = new THREE.BoxGeometry(0.5, 1, 0.1);
            const windowMaterial = new THREE.MeshLambertMaterial({ 
                color: 0x000080,
                transparent: true,
                opacity: 0.7
            });
            const window = new THREE.Mesh(windowGeometry, windowMaterial);
            window.position.set(-8, 6 + i * 3, 1.6);
            this.monastery.add(window);
        }
    }
    
    createGarden() {
        // Create garden area
        const gardenGeometry = new THREE.CircleGeometry(8, 32);
        const gardenMaterial = new THREE.MeshLambertMaterial({ 
            color: 0x228B22,
            transparent: true,
            opacity: 0.8
        });
        const garden = new THREE.Mesh(gardenGeometry, gardenMaterial);
        garden.rotation.x = -Math.PI / 2;
        garden.position.set(0, 0.01, 0);
        garden.receiveShadow = true;
        this.monastery.add(garden);
        
        // Add trees
        for (let i = 0; i < 8; i++) {
            const treeGroup = new THREE.Group();
            
            // Tree trunk
            const trunkGeometry = new THREE.CylinderGeometry(0.3, 0.4, 3);
            const trunkMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
            const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
            trunk.position.y = 1.5;
            trunk.castShadow = true;
            treeGroup.add(trunk);
            
            // Tree foliage
            const foliageGeometry = new THREE.SphereGeometry(2, 8, 6);
            const foliageMaterial = new THREE.MeshLambertMaterial({ color: 0x228B22 });
            const foliage = new THREE.Mesh(foliageGeometry, foliageMaterial);
            foliage.position.y = 4;
            foliage.castShadow = true;
            treeGroup.add(foliage);
            
            const angle = (i * Math.PI * 2) / 8;
            treeGroup.position.set(
                Math.cos(angle) * 6,
                0,
                Math.sin(angle) * 6
            );
            this.monastery.add(treeGroup);
        }
    }
    
    createGround() {
        const groundGeometry = new THREE.PlaneGeometry(50, 50);
        const groundMaterial = new THREE.MeshLambertMaterial({ 
            color: 0x90EE90,
            transparent: true,
            opacity: 0.8
        });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.position.y = -0.1;
        ground.receiveShadow = true;
        this.scene.add(ground);
    }
    
    createSkybox() {
        const skyGeometry = new THREE.SphereGeometry(100, 32, 32);
        const skyMaterial = new THREE.MeshBasicMaterial({
            color: 0x87CEEB,
            side: THREE.BackSide
        });
        const sky = new THREE.Mesh(skyGeometry, skyMaterial);
        this.scene.add(sky);
        
        // Add clouds
        for (let i = 0; i < 20; i++) {
            const cloudGeometry = new THREE.SphereGeometry(2, 8, 6);
            const cloudMaterial = new THREE.MeshBasicMaterial({
                color: 0xFFFFFF,
                transparent: true,
                opacity: 0.6
            });
            const cloud = new THREE.Mesh(cloudGeometry, cloudMaterial);
            cloud.position.set(
                (Math.random() - 0.5) * 200,
                Math.random() * 20 + 10,
                (Math.random() - 0.5) * 200
            );
            cloud.scale.set(
                Math.random() * 2 + 1,
                Math.random() * 0.5 + 0.5,
                Math.random() * 2 + 1
            );
            this.scene.add(cloud);
        }
    }
    
    setupLighting() {
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
        this.scene.add(ambientLight);
        
        // Directional light (sun)
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(10, 10, 5);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        directionalLight.shadow.camera.near = 0.5;
        directionalLight.shadow.camera.far = 50;
        directionalLight.shadow.camera.left = -25;
        directionalLight.shadow.camera.right = 25;
        directionalLight.shadow.camera.top = 25;
        directionalLight.shadow.camera.bottom = -25;
        this.scene.add(directionalLight);
        
        // Point light for warm atmosphere
        const pointLight = new THREE.PointLight(0xffa500, 0.5, 30);
        pointLight.position.set(0, 8, 0);
        this.scene.add(pointLight);
    }
    
    setupControls() {
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.enableZoom = true;
        this.controls.enablePan = true;
        this.controls.maxPolarAngle = Math.PI / 2;
        this.controls.minDistance = 5;
        this.controls.maxDistance = 50;
    }
    
    setupEventListeners() {
        // Auto rotate toggle
        document.getElementById('auto-rotate').addEventListener('change', (e) => {
            this.autoRotate = e.target.checked;
        });
        
        // Rotation speed
        document.getElementById('rotation-speed').addEventListener('input', (e) => {
            this.rotationSpeed = parseFloat(e.target.value);
        });
        
        // View mode
        document.getElementById('view-mode').addEventListener('change', (e) => {
            this.changeView(e.target.value);
        });
        
        // Reset view
        document.getElementById('reset-view').addEventListener('click', () => {
            this.resetView();
        });
        
        // Navigation buttons
        document.getElementById('prev-view').addEventListener('click', () => {
            this.previousView();
        });
        
        document.getElementById('next-view').addEventListener('click', () => {
            this.nextView();
        });
        
        // Window resize
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }
    
    changeView(viewType) {
        this.currentView = viewType;
        
        switch (viewType) {
            case 'exterior':
                this.camera.position.set(0, 5, 15);
                this.controls.target.set(0, 0, 0);
                break;
            case 'interior':
                this.camera.position.set(0, 3, 5);
                this.controls.target.set(0, 2, 0);
                break;
            case 'courtyard':
                this.camera.position.set(0, 8, 0);
                this.controls.target.set(0, 0, 0);
                break;
        }
        this.controls.update();
    }
    
    resetView() {
        this.camera.position.set(0, 5, 15);
        this.controls.target.set(0, 0, 0);
        this.controls.update();
        document.getElementById('view-mode').value = 'exterior';
        this.currentView = 'exterior';
    }
    
    previousView() {
        const views = ['exterior', 'interior', 'courtyard'];
        const currentIndex = views.indexOf(this.currentView);
        const prevIndex = (currentIndex - 1 + views.length) % views.length;
        this.changeView(views[prevIndex]);
        document.getElementById('view-mode').value = views[prevIndex];
    }
    
    nextView() {
        const views = ['exterior', 'interior', 'courtyard'];
        const currentIndex = views.indexOf(this.currentView);
        const nextIndex = (currentIndex + 1) % views.length;
        this.changeView(views[nextIndex]);
        document.getElementById('view-mode').value = views[nextIndex];
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        
        if (this.autoRotate) {
            this.monastery.rotation.y += 0.005 * this.rotationSpeed;
        }
        
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }
}

// Initialize the monastery viewer when the page loads
window.addEventListener('load', () => {
    new MonasteryViewer();
});
