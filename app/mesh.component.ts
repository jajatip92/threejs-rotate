import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';

declare const THREE: any;


@Component({
  selector: 'mesh',
  template: `<div id='container' width="200" height="100" #rendererContainer></div>`,
  styles: []
})
export class MeshComponent implements AfterViewInit {
  
   @ViewChild('rendererContainer') rendererContainer: ElementRef;
    camera;
    scene;
    renderer;
    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();
    intersects = [];
    imageUrl = "https://img.techpowerup.org/200709/3dimage.jpg";
    // spriteMaterial = new THREE.SpriteMaterial({
    // map: new THREE.TextureLoader().load(
    //   "..\assets\Marker.png"
    // )
    // });
    markers = [];
    markersCounter = 0;
    isUserInteracting = false;
    onMouseDownMouseX = 0;
    onMouseDownMouseY = 0;
    lon = 0;
    onMouseDownLon = 0;
    lat = 0;
    onMouseDownLat = 0;
    phi = 0;
    theta = 0;
    path = 'https://img.techpowerup.org/200709/marker.png';
    //path = 'https://dev.w3.org/SVG/tools/svgweb/samples/svg-files/AJ_Digital_Camera.svg'
    SVG_NS = "http://www.w3.org/2000/svg";
// an object to define the properties and text content of the text element 
    txtObj = {
    props: {
        x: 50,
        y: 15,
        "dominant-baseline": "middle",
        "text-anchor": "middle"
    },
    txtConent: "test text"
    };

    constructor(private window: Window) {

    }

    ngAfterViewInit() {

        this.init();
    }

    // openModal(){
    //   $("#myModal").modal("show");
    // }

    init() {
        var container, mesh;
        container = document.getElementById("container");
        this.camera = new THREE.PerspectiveCamera(
            75,
            this.window.innerWidth / this.window.innerHeight,
            1,
            1100
        );
        this.camera.target = new THREE.Vector3(0, 0, 0);
        this.scene = new THREE.Scene();
        var geometry = new THREE.SphereBufferGeometry(500, 60, 40);
        // invert the geometry on the x-axis so that all of the faces point inward
        geometry.scale(-1, 1, 1);
        console.log('img', this.imageUrl);
        var material = new THREE.MeshBasicMaterial({
            map: new THREE.TextureLoader().load(
               this.imageUrl
            )
        });
        mesh = new THREE.Mesh(geometry, material);
        this.scene.add(mesh);
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setPixelRatio(this.window.devicePixelRatio);
        this.renderer.setSize(this.window.innerWidth, this.window.innerHeight);
        container.appendChild(this.renderer.domElement);
        this.rendererContainer.nativeElement.addEventListener('mousedown', this.onPointerStart.bind(this), false);
        this.rendererContainer.nativeElement.addEventListener('mousemove', this.onPointerMove.bind(this), false);
        this.rendererContainer.nativeElement.addEventListener('mouseup', this.onPointerUp.bind(this), false);
        this.rendererContainer.nativeElement.addEventListener('wheel', this.onDocumentMouseWheel.bind(this), false);
        this.rendererContainer.nativeElement.addEventListener('touchstart', this.onPointerStart.bind(this), false);
        this.rendererContainer.nativeElement.addEventListener('touchmove', this.onPointerMove.bind(this), false);
        this.rendererContainer.nativeElement.addEventListener('touchend', this.onPointerUp.bind(this), false);

        //
        this.rendererContainer.nativeElement.addEventListener(
            "dragover",
            function (event) {
                event.preventDefault();
                event.dataTransfer.dropEffect = "copy";
            },
            false
        );
        this.rendererContainer.nativeElement.addEventListener(
            "dragenter",
            function () {
                document.body.style.opacity = '0.5';
            },
            false
        );
        this.rendererContainer.nativeElement.addEventListener(
            "dragleave",
            function () {
                document.body.style.opacity = '1';
            },
            false
        );
        this.rendererContainer.nativeElement.addEventListener(
            "drop",
            function (event) {
                event.preventDefault();
                var reader = new FileReader();
                reader.addEventListener(
                    "load",
                    function (event) {
                        material.map.image.src = event.target.result;
                        material.map.needsUpdate = true;
                    },
                    false
                );
                reader.readAsDataURL(event.dataTransfer.files[0]);
                document.body.style.opacity = '1';
            },
            false
        );
        //
        this.window.addEventListener("resize", this.onWindowResize, false);

        this.rendererContainer.nativeElement.addEventListener(
            "dblclick",
            event => {
              //this.openModal();
              this.setMarker(event);
           },
            false
        );
        this.animate();

    }

    setMarker(event) {
    //this.element = <Element>this.root;
    //const canvas = <HTMLCanvasElement><unknown>document.getElementsByTagName("canvas");
    //var ctx = canvas[0].getContext("2d");
    debugger
      //const canvas = document.getElementsByTagName("canvas");
      //var ctx1: CanvasRenderingContext2D = canvas.getContext("2d");
     // ctx.fillRect(50,50,80,80);
      //this.InitDemo();
      //this.drawText(this.txtObj,);
      var svg = document.getElementsByTagName('svg')[0]; //Get svg element
     
      this.mouse.x = event.clientX / this.window.innerWidth * 2 - 1;
      this.mouse.y = -(event.clientY / this.window.innerHeight) * 2 + 1;

      this.raycaster.setFromCamera(this.mouse, this.camera);
      let spriteMaterial = new THREE.SpriteMaterial({
          map: new THREE.TextureLoader().load(
           this.path
          )
      });
//var geometry = new THREE.CircleGeometry( 1, 5 );
//var material = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
//var shape = new THREE.TextGeometry('1', {font: 'helvetiker',size:'24',curveSegments: 20, weight: 'normal',height : 4,hover:30});
//var marker = new THREE.Mesh( geometry, material );
//marker.add(shape);

     let marker = new THREE.Sprite(spriteMaterial);
      marker.scale.set(20, 20, 1);
      marker.name = "marker" + this.markersCounter;
      this.raycaster.ray.at(210, marker.position);
      this.scene.add(marker);
      this.markers.push(marker);
      this.markersCounter++;

    }

    onPointerStart(event) {
        this.isUserInteracting = true;
        var clientX = event.clientX || event.touches[0].clientX;
        var clientY = event.clientY || event.touches[0].clientY;
        this.onMouseDownMouseX = clientX;
        this.onMouseDownMouseY = clientY;
        this.onMouseDownLon = this.lon;
        this.onMouseDownLat = this.lat;

        // Deletion
        this.mouse.x = clientX / window.innerWidth * 2 - 1;
        this.mouse.y = -(clientY / window.innerHeight) * 2 + 1;

        this.raycaster.setFromCamera(this.mouse, this.camera);

        this.intersects = this.raycaster.intersectObjects(this.markers);

        if (this.intersects.length > 0) {
            let obj = this.intersects[0];
            let uv = obj.uv;
            if (Math.min(uv.x, uv.y) > 0.75) {
                obj.object.visible = false; // you have to do the stuff for real clearance
            }
        }


    }

    onPointerMove(event) {
        if (this.isUserInteracting === true) {
            var clientX = event.clientX || event.touches[0].clientX;
            var clientY = event.clientY || event.touches[0].clientY;
            this.lon = (this.onMouseDownMouseX - clientX) * 0.1 + this.onMouseDownLon;
            this.lat = (clientY - this.onMouseDownMouseY) * 0.1 + this.onMouseDownLat;
        }
    }

    onPointerUp() {
        this.isUserInteracting = false;
    }

    onDocumentMouseWheel(event) {
        var fov = this.camera.fov + event.deltaY * 0.05;
        this.camera.fov = THREE.Math.clamp(fov, 10, 75);
        this.camera.updateProjectionMatrix();
    }

    onWindowResize() {

        this.camera.aspect = this.window.innerWidth / this.window.innerHeight;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize(this.window.innerWidth, this.window.innerHeight);

    }

    render() {
        //this.wheels = wheels;
        var time = - performance.now() / 1000;

        // for ( var i = 0; i < this.wheels.length; i ++ ) {

        // 	this.wheels[ i ].rotation.x = time * Math.PI;

        // }

        //this.grid.position.z = - ( time ) % 5;

        this.renderer.render(this.scene, this.camera);

        //this.stats.update();

    }

    animate() {
        requestAnimationFrame(() => { this.animate() });
        this.update();
    }

    update() {
        if (this.isUserInteracting === false) {
            //lon += 0.1;
        }
        this.lat = Math.max(-85, Math.min(85, this.lat));
        this.phi = THREE.Math.degToRad(90 - this.lat);
        this.theta = THREE.Math.degToRad(this.lon);
        this.camera.target.x = 500 * Math.sin(this.phi) * Math.cos(this.theta);
        this.camera.target.y = 500 * Math.cos(this.phi);
        this.camera.target.z = 500 * Math.sin(this.phi) * Math.sin(this.theta);
        this.camera.lookAt(this.camera.target);
        /*
                      // distortion
                      camera.position.copy( camera.target ).negate();
                      */
        this.renderer.render(this.scene, this.camera);
    }





}
