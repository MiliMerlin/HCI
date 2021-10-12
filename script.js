import * as THREE from './node_modules/three/build/three.module.js';
import { OrbitControls } from './jsm/OrbitControls.js';
import { CSS2DObject, CSS2DRenderer } from './jsm/CSS2DRenderer.js';

let scene, camera, renderer, labelrenderer;
let fov = 50;
let controls;
let canvas;
let cubemaps = [];
let groups = [];

let sceneNeedsChenge = true;
let current = 0;
let SceneFuncs = [];

const imgPath = './ajax/img/';
const txtPath = './ajax/texts/';

function Init() {
    // scene & group
    scene = new THREE.Scene();

    // camera
    camera = new THREE.PerspectiveCamera(fov, window.innerWidth / window.innerHeight, .1, 1000);
    camera.position.x = 3;
    camera.position.y = 3;
    camera.position.z = 3;
    scene.add(camera);

    // controls
    controls = new OrbitControls(camera, canvas);
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.enableDamping = true;
    controls.rotateSpeed = 0.25;

    // renders
    renderer = new THREE.WebGLRenderer({ 'canvas': canvas });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    labelrenderer = new CSS2DRenderer();
    labelrenderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(labelrenderer.domElement);

    // window event
    window.addEventListener('resize', function () {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        labelrenderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    }, false);
}

$(function () {
    canvas = document.querySelector('#webgl-canvas');

    Init();

    SceneFuncs.push(
        InitGroupShumei,
        InitGroupTsg,
        InitGroupBq
    );

    const tick = () => {
        // 平滑改变视角
        if (fov != camera.fov) {
            camera.fov += (fov - camera.fov) * 0.05;
            camera.updateProjectionMatrix();
        }

        if (sceneNeedsChenge) {
            SceneFuncs[current](current);
            sceneNeedsChenge = false;
        }

        controls.update();
        renderer.render(scene, camera);
        labelrenderer.render(scene, camera);
        requestAnimationFrame(tick);
    };
    tick();

    // 注册切换场景的函数
    $('.panel li').on('click', function () {

        let code = $(this).attr('value');
        if (current != code) {
            let $div = $('<div class="change">正在切换场景...</div>');
            $('body').prepend($div);
            $($div).fadeIn(100);

            $('.panel ul').slideToggle(150, () => {
                sceneNeedsChenge = true;
                scene.remove(groups[current]);
                $('body>div:last-child').empty();
                current = code;
            });
        }

    });

    // 通过按键改变视角
    $(document).on('keydown', function (event) {
        switch (event.key.toLocaleLowerCase()) {
            case 's':
                if (fov < 80)
                    fov += 10;
                break;
            case 'w':
                if (fov > 30)
                    fov -= 10;
                break;
            default:
                break;
        }
    });
    $('#zoom-out').on('click', () => {
        if (fov < 80)
            fov += 10;
    });
    $('#zoom-in').on('click', () => {
        if (fov > 30)
            fov -= 10;
    });

});

function InitGroupShumei(code) {

    const shumeiPos = new THREE.Vector3(0, -10, 40),
        shangPos = new THREE.Vector3(50, -10, 90),
        erjiaoPos = new THREE.Vector3(100, -10, 50),
        qingshiPos = new THREE.Vector3(10, -15, -50),
        shitangPos = new THREE.Vector3(-100, -25, -180);

    const smGroup = new THREE.Group();
    smGroup.name = '人工智能与计算机学院';

    function InitLabels() {

        // shumei label
        const shumeiLebel = new CSS2DObject(CreateInfoBlock(
            './ajax/img/ai-logo.png',
            './ajax/texts/rgzn.html',
            '人工智能与计算机学院',
            1.4
        ));
        createLabel(shumeiPos, smGroup, shumeiLebel);

        // shang label
        const sxyLabel = new CSS2DObject(CreateInfoBlock(
            './ajax/img/sxy-logo.png',
            './ajax/texts/sxy.html',
            '商学院',
            1.0
        ));
        createLabel(shangPos, smGroup, sxyLabel);

        // erjiao label
        const erjiaoLabel = new CSS2DObject(CreateInfo('第二教学楼', 0.8));
        createLabel(erjiaoPos, smGroup, erjiaoLabel);

        // qingshi label
        const qingshiLabel = new CSS2DObject(CreateInfo('宿舍', 1.2));
        createLabel(qingshiPos, smGroup, qingshiLabel);

        // shitang label
        const shitangLabel = new CSS2DObject(CreateInfo('四食堂', 0.8));
        createLabel(shitangPos, smGroup, shitangLabel);

        // dahuang label
        const busLabel = new CSS2DObject(CreateInfo('公交车站'), 0.8);
        createLabel(
            new THREE.Vector3(22, -25, -32),
            smGroup,
            busLabel
        );

    }

    if (!cubemaps[code]) {
        const path = './images/shumei/';
        const format = '.jpg';
        const urls = [];
        for (let i = 0; i < 6; i++) {
            urls.push(path + i + format);
        }
        let cubeMap = new THREE.CubeTextureLoader().load(urls, () => {
            scene.background = cubemaps[code];
            UpdateCamera();
            InitLabels();

            setTimeout(() => {
                $('.change').fadeOut(100, function () {
                    $(this).remove();
                });
            }, 500);
        });
        cubemaps[code] = cubeMap;
    }
    else {
        scene.background = cubemaps[code];
        UpdateCamera();
        InitLabels();

        $('.change').fadeOut(100, function () {
            $(this).remove();
        });
    }

    const helper = new THREE.AxesHelper(5);
    scene.add(helper);

    groups[code] = smGroup;
    scene.add(smGroup);
}

function InitGroupTsg(code) {

    const tsgGroup = new THREE.Group();
    tsgGroup.name = '图书馆';


    function InitLabels() {

        // 图书馆
        const tsgLabel = new CSS2DObject(CreateInfoBlock(
            './ajax/img/tsg-logo.png',
            './ajax/texts/tsg.html',
            '校图书馆',
            1.4
        ));
        createLabel(
            new THREE.Vector3(20, -20, 20),
            tsgGroup,
            tsgLabel
        );

        // 一教
        const yjLabel = new CSS2DObject(CreateInfo('第一教学楼', 1.2));
        createLabel(
            new THREE.Vector3(0, -20, 20),
            tsgGroup,
            yjLabel
        );

        // 东门
        const dmLabel = new CSS2DObject(CreateInfo('东大门', 1.0));
        createLabel(
            new THREE.Vector3(-18, -30, -18),
            tsgGroup,
            dmLabel
        );

        // ？馆
        const whgLabel = new CSS2DObject(CreateInfo('文浩馆'), 1.0);
        createLabel(
            new THREE.Vector3(-15, -30, 5),
            tsgGroup,
            whgLabel
        );

        // 外国语
        const wyLabel = new CSS2DObject(CreateInfoBlock(
            './ajax/img/wy-logo.png',
            './ajax/texts/wy.html',
            '外国语学院',
            1.2
        ));
        createLabel(
            new THREE.Vector3(15, -20, -35),
            tsgGroup,
            wyLabel
        );


        // 二教
        const erjiaoLabel = new CSS2DObject(CreateInfo('第二教学楼', 1.0));
        createLabel(
            new THREE.Vector3(18, -10, -5),
            tsgGroup,
            erjiaoLabel
        );

        // 理学院
        const lxyLabel = new CSS2DObject(CreateInfoBlock(
            './ajax/img/lxy-logo.png',
            './ajax/texts/lxy.html',
            '理学院',
            0.8
        ));
        createLabel(
            new THREE.Vector3(-5, -15, 25),
            tsgGroup,
            lxyLabel
        );

        // 北体
        const btLabel = new CSS2DObject(CreateInfo('北区体育中心', 0.8));
        createLabel(
            new THREE.Vector3(-20, -10, 22),
            tsgGroup,
            btLabel
        );
    }

    // load cube map
    if (!cubemaps[code]) {
        const path = './images/tsg/';
        const format = '.jpg';
        const urls = [];
        for (let i = 0; i < 6; i++) {
            urls.push(path + i + format);
        }
        let cubemap = new THREE.CubeTextureLoader().load(urls, () => {
            scene.background = cubemaps[code];
            UpdateCamera();
            InitLabels();

            setTimeout(() => {
                $('.change').fadeOut(100, function () {
                    $(this).remove();
                });
            }, 500);
        });
        cubemaps[code] = cubemap;
    }
    else {
        scene.background = cubemaps[code];
        UpdateCamera();
        InitLabels();

        $('.change').fadeOut(100, function () {
            $(this).remove();
        });
    }

    groups[code] = tsgGroup;
    scene.add(tsgGroup);

}

function InitGroupBq(code) {

    const BqGroup = new THREE.Group();
    BqGroup.name = '北区';

    function InitLabels() {
        // 🐍院
        const syLabel = new CSS2DObject(CreateInfoBlock(
            imgPath + 'sy-logo.png',
            txtPath + 'sy.html',
            '设计学院',
            1.2
        ));
        createLabel(
            new THREE.Vector3(20, -5, -15),
            BqGroup,
            syLabel
        );

        // 机械
        const jxLabel = new CSS2DObject(CreateInfoBlock(
            imgPath + 'jx-logo.png',
            txtPath + 'jx.html',
            '机械工程学院',
            1.2
        ));
        createLabel(
            new THREE.Vector3(0, -2, -15),
            BqGroup,
            jxLabel
        );

        // 物联网
        const wlwLabel = new CSS2DObject(CreateInfoBlock(
            imgPath + 'wlw-logo.png',
            txtPath + 'wlw.html',
            '物联网工程学院',
            1.2
        ));
        createLabel(
            new THREE.Vector3(-20, -3, -5),
            BqGroup,
            wlwLabel
        );

        // 北区体育中心
        const btLabel = new CSS2DObject(CreateInfo('北区体育中心', 1.0));
        createLabel(
            new THREE.Vector3(30, -5, 30),
            BqGroup,
            btLabel
        );
    }

    // load cube map
    if (!cubemaps[code]) {
        const path = './images/bq/';
        const format = '.jpg';
        const urls = [];
        for (let i = 0; i < 6; i++) {
            urls.push(path + i + format);
        }
        let cubemap = new THREE.CubeTextureLoader().load(urls, () => {
            scene.background = cubemaps[code];
            UpdateCamera();
            InitLabels();

            setTimeout(() => {
                $('.change').fadeOut(100, function () {
                    $(this).remove();
                });
            }, 500);

        });
        cubemaps[code] = cubemap;
    }
    else {
        scene.background = cubemaps[code];
        UpdateCamera();
        InitLabels();

        $('.change').fadeOut(100, function () {
            $(this).remove();
        });
    }

    groups[code] = BqGroup;
    scene.add(BqGroup);
}

// 创建信息显示条
function CreateInfoBlock(imgURL, txtURL, txt, fontSize = 1.0) {
    // 添加父元素，确定字体大小
    let $div = $(`<div class="info" style="font-size:${fontSize}em"></div>`);

    // 添加简介信息，添加鼠标 hover 事件
    let $pre = $(`<div class="pre clickable" style="cursor: pointer">${txt}<div>`)
    $pre.hover(function () {
        $(this).css('background', 'rgba(80, 80, 80, 0.6)');
    }, function () {
        $(this).css('background', 'rgba(0, 0, 0, 0.6)');
    });

    $div.append($pre);

    // 添加详细信息
    let $infoBox = $('<div class="info-box"></div>');
    $infoBox.attr("img", imgURL);
    $infoBox.attr("txt", txtURL);
    $div.append($infoBox);

    $pre.on('click', function () {
        // 动态加载图片和文字
        if ($infoBox.attr('txt') || $infoBox.attr('img')) {
            (async () => {
                let imgRes = await fetch(imgURL);
                let objURL = URL.createObjectURL(await imgRes.blob());

                let image = new Image();
                image.src = objURL;
                image.className = 'logo';

                if ($infoBox.children('img').length == 0)
                    $infoBox.append(image);

                $infoBox.append('<hr>');

                let texts = await fetch(txtURL);
                if ($infoBox.children('p').length == 0)
                    $infoBox.append(await texts.text());
            })().then(() => {
                let $span = $('<span class="close">关闭</span>');
                $span.on('click', () => {
                    $infoBox.hide();
                    $pre.show();
                });
                $pre.hide();
                $infoBox.prepend($span).fadeIn(100)
                    .removeAttr('txt').removeAttr('img');
            });
        }
        else {
            $infoBox.fadeIn(100);
            $pre.hide();
        }
    });
    return $div[0];
}

// 创建单个信息显示条
function CreateInfo(txt, fontSize = 1.0) {
    let div = $(`<div class="pre" style="font-size:${fontSize}em">${txt}</div>`);
    return div[0];
}

// 创建 CSS2D 标签
function createLabel(pos, group, css2d) {
    const obj = new THREE.Object3D();
    obj.position.copy(pos);
    group.add(obj);
    css2d.position.copy(pos);
    obj.add(css2d);
}

// 更新相机
function UpdateCamera() {
    camera.position.x = 3;
    camera.position.y = 3;
    camera.position.z = 3;
    camera.fov = fov = 50;
    camera.updateProjectionMatrix();
}