import * as THREE from './node_modules/three/build/three.module.js';
import { OrbitControls } from './jsm/OrbitControls.js';
import { CSS2DObject, CSS2DRenderer } from './jsm/CSS2DRenderer.js';
import { CreateInfoBlock, CreateInfo } from './jsm/common.js';

let scene, camera, renderer, labelrenderer;
let fov = 50;
let controls;
let canvas;
let cubemaps = [];
let groups = [];

let sceneNeedsChenge = true;
let current = 0;
let SceneFuncs = [];

let isChanging = false;
let isFirst = true;

const imgPath = './ajax/img/';
const txtPath = './ajax/texts/';

function Init() {
    // scene & group
    scene = new THREE.Scene();

    // camera
    camera = new THREE.PerspectiveCamera(fov, window.innerWidth / window.innerHeight, .1, 1000);
    camera.position.set(3.0, 3.0, 3.0);
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
        InitGroupBq,
        InitGroupTsgN,
        InitXiaoD,
        InitHehua,
        InitBq2
    );

    const tick = () => {
        // ??????????????????
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
});

// ????????????
function InitGroupShumei(code) {

    const smGroup = new THREE.Group();
    smGroup.name = '??????????????????????????????';

    function InitLabels() {

        // shumei label
        const shumeiLebel = new CSS2DObject(CreateInfoBlock(
            './ajax/img/ai-logo.png',
            './ajax/texts/rgzn.html',
            '??????????????????????????????',
            1.4
        ));
        createLabel(new THREE.Vector3(0, -10, 40), smGroup, shumeiLebel);

        // shang label
        const sxyLabel = new CSS2DObject(CreateInfoBlock(
            './ajax/img/sxy-logo.png',
            './ajax/texts/sxy.html',
            '?????????',
            1.0
        ));
        createLabel(new THREE.Vector3(50, -10, 90), smGroup, sxyLabel);

        // erjiao label
        const erjiaoLabel = new CSS2DObject(CreateInfo('???????????????', 0.8));
        createLabel(new THREE.Vector3(100, -10, 50), smGroup, erjiaoLabel);

        // qingshi label
        const qingshiLabel = new CSS2DObject(CreateInfo('??????', 1.2));
        createLabel(new THREE.Vector3(10, -15, -50), smGroup, qingshiLabel);

        // shitang label
        const shitangLabel = new CSS2DObject(CreateInfo('?????????', 0.8));
        createLabel(new THREE.Vector3(-100, -25, -180), smGroup, shitangLabel);

        // dahuang label
        const busLabel = new CSS2DObject(CreateInfo('????????????'), 0.8);
        createLabel(
            new THREE.Vector3(22, -25, -32),
            smGroup,
            busLabel
        );

        //???????????????
        const tsgNavi = new CSS2DObject(CreateNavi('???????????????', 1, 0.8));
        createLabel(
            new THREE.Vector3(110, 10, 50),
            smGroup,
            tsgNavi
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

            if (isFirst) {

                isFirst = false;
                SubscribeEvents();

                setTimeout(() => {
                    $('.change').fadeOut(500, function () {
                        $(this).remove();
                    });
                }, 500);

            }
            else {
                setTimeout(() => {
                    $('.change').fadeOut(200, function () {
                        $(this).remove();
                    });
                    isChanging = false;
                }, 500);
            }
        });
        cubemaps[code] = cubeMap;
    }
    else {
        scene.background = cubemaps[code];
        UpdateCamera();
        InitLabels();

        $('.change').fadeOut(200, function () {
            $(this).remove();
            isChanging = false;
        });
    }

    const helper = new THREE.AxisHelper(5);
    scene.add(helper);

    groups[code] = smGroup;
    scene.add(smGroup);
}

function InitGroupTsg(code) {

    const tsgGroup = new THREE.Group();
    tsgGroup.name = '?????????';


    function InitLabels() {

        // ?????????
        const tsgLabel = new CSS2DObject(CreateInfoBlock(
            './ajax/img/tsg-logo.png',
            './ajax/texts/tsg.html',
            '????????????',
            1.4
        ));
        createLabel(
            new THREE.Vector3(20, -20, 20),
            tsgGroup,
            tsgLabel
        );

        // ??????
        const yjLabel = new CSS2DObject(CreateInfo('???????????????', 1.2));
        createLabel(
            new THREE.Vector3(0, -20, 20),
            tsgGroup,
            yjLabel
        );

        // ??????
        const dmLabel = new CSS2DObject(CreateInfo('?????????', 1.0));
        createLabel(
            new THREE.Vector3(-18, -30, -18),
            tsgGroup,
            dmLabel
        );

        // ??????
        const whgLabel = new CSS2DObject(CreateInfo('?????????'), 1.0);
        createLabel(
            new THREE.Vector3(-15, -30, 5),
            tsgGroup,
            whgLabel
        );

        // ?????????
        const wyLabel = new CSS2DObject(CreateInfoBlock(
            './ajax/img/wy-logo.png',
            './ajax/texts/wy.html',
            '???????????????',
            1.2
        ));
        createLabel(
            new THREE.Vector3(15, -20, -35),
            tsgGroup,
            wyLabel
        );


        // ??????
        const erjiaoLabel = new CSS2DObject(CreateInfo('???????????????', 1.0));
        createLabel(
            new THREE.Vector3(18, -10, -5),
            tsgGroup,
            erjiaoLabel
        );

        // ?????????
        const lxyLabel = new CSS2DObject(CreateInfoBlock(
            './ajax/img/lxy-logo.png',
            './ajax/texts/lxy.html',
            '?????????',
            0.8
        ));
        createLabel(
            new THREE.Vector3(-5, -15, 25),
            tsgGroup,
            lxyLabel
        );

        // ??????
        const btLabel = new CSS2DObject(CreateInfo('??????????????????', 0.8));
        createLabel(
            new THREE.Vector3(-20, -10, 22),
            tsgGroup,
            btLabel
        );

        // ?????????
        const qsqLabel = new CSS2DObject(CreateInfo('?????????'), 0.8);
        createLabel(
            new THREE.Vector3(27, -15, 8),
            tsgGroup,
            qsqLabel
        );

        // ?????????
        const xdNavi = new CSS2DObject(CreateNavi('???????????????', 4, 0.8));
        createLabel(
            new THREE.Vector3(27, -12, 18),
            tsgGroup,
            xdNavi
        );

        // ??????????????????
        const bqNabi = new CSS2DObject(CreateNavi('??????????????????', 2, 0.8));
        createLabel(
            new THREE.Vector3(5, -5, 25),
            tsgGroup,
            bqNabi
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
                $('.change').fadeOut(200, function () {
                    $(this).remove();
                });
                isChanging = false;
            }, 500);
        });
        cubemaps[code] = cubemap;
    }
    else {
        scene.background = cubemaps[code];
        UpdateCamera();
        InitLabels();

        $('.change').fadeOut(200, function () {
            $(this).remove();
            isChanging = false;
        });
    }

    groups[code] = tsgGroup;
    scene.add(tsgGroup);

}

function InitGroupBq(code) {

    const BqGroup = new THREE.Group();
    BqGroup.name = '??????';

    function InitLabels() {
        // ???????
        const syLabel = new CSS2DObject(CreateInfoBlock(
            imgPath + 'sy-logo.png',
            txtPath + 'sy.html',
            '????????????',
            1.2
        ));
        createLabel(
            new THREE.Vector3(20, -5, -15),
            BqGroup,
            syLabel
        );

        // ??????
        const jxLabel = new CSS2DObject(CreateInfoBlock(
            imgPath + 'jx-logo.png',
            txtPath + 'jx.html',
            '??????????????????',
            1.2
        ));
        createLabel(
            new THREE.Vector3(0, -2, -15),
            BqGroup,
            jxLabel
        );

        // ?????????
        const wlwLabel = new CSS2DObject(CreateInfoBlock(
            imgPath + 'wlw-logo.png',
            txtPath + 'wlw.html',
            '?????????????????????',
            1.2
        ));
        createLabel(
            new THREE.Vector3(-20, -3, -5),
            BqGroup,
            wlwLabel
        );

        // ??????????????????
        const btLabel = new CSS2DObject(CreateInfo('??????????????????', 1.0));
        createLabel(
            new THREE.Vector3(30, -5, 30),
            BqGroup,
            btLabel
        );

        // ??????2??????
        const bq2Navi = new CSS2DObject(CreateNavi('??????????????????', 6));
        createLabel(
            new THREE.Vector3(40, 5, 20),
            BqGroup,
            bq2Navi
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
                $('.change').fadeOut(200, function () {
                    $(this).remove();
                });
                isChanging = false;
            }, 500);
        });
        cubemaps[code] = cubemap;
    }
    else {
        scene.background = cubemaps[code];
        UpdateCamera();
        InitLabels();

        $('.change').fadeOut(200, function () {
            $(this).remove();
            isChanging = false;
        });
    }

    groups[code] = BqGroup;
    scene.add(BqGroup);
}

function InitGroupTsgN(code) {

    const tsgGroup = new THREE.Group();
    tsgGroup.name = '?????????_???';


    function InitLabels() {

        // ?????????
        const tsgLabel = new CSS2DObject(CreateInfoBlock(
            './ajax/img/tsg-logo.png',
            './ajax/texts/tsg.html',
            '????????????',
            1.4
        ));
        createLabel(
            new THREE.Vector3(35, -20, 12),
            tsgGroup,
            tsgLabel
        );

        // ??????
        const yjLabel = new CSS2DObject(CreateInfo('???????????????', 1.2));
        createLabel(
            new THREE.Vector3(15, -20, 25),
            tsgGroup,
            yjLabel
        );

        // ??????
        const dmLabel = new CSS2DObject(CreateInfo('?????????', 1.0));
        createLabel(
            new THREE.Vector3(-30, -25, -10),
            tsgGroup,
            dmLabel
        );

        // ??????
        const whgLabel = new CSS2DObject(CreateInfo('?????????'), 1.0);
        createLabel(
            new THREE.Vector3(-20, -30, 10),
            tsgGroup,
            whgLabel
        );

        // ?????????
        const wyLabel = new CSS2DObject(CreateInfoBlock(
            './ajax/img/wy-logo.png',
            './ajax/texts/wy.html',
            '???????????????',
            1.2
        ));
        createLabel(
            new THREE.Vector3(5, -15, -40),
            tsgGroup,
            wyLabel
        );


        // ??????
        const erjiaoLabel = new CSS2DObject(CreateInfo('???????????????', 1.0));
        createLabel(
            new THREE.Vector3(16, -10, -18),
            tsgGroup,
            erjiaoLabel
        );

        // ?????????
        const lxyLabel = new CSS2DObject(CreateInfoBlock(
            './ajax/img/lxy-logo.png',
            './ajax/texts/lxy.html',
            '?????????',
            0.8
        ));
        createLabel(
            new THREE.Vector3(0, -10, 30),
            tsgGroup,
            lxyLabel
        );

        // ??????
        const btLabel = new CSS2DObject(CreateInfo('??????????????????', 0.8));
        createLabel(
            new THREE.Vector3(-5, -2.5, 15),
            tsgGroup,
            btLabel
        );

        // ?????????
        const qsqLabel = new CSS2DObject(CreateInfo('?????????'), 0.8);
        createLabel(
            new THREE.Vector3(37, -15, -5),
            tsgGroup,
            qsqLabel
        );
    }

    // load cube map
    if (!cubemaps[code]) {
        const path = './images/tsg_night/';
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
                $('.change').fadeOut(200, function () {
                    $(this).remove();
                });
                isChanging = false;
            }, 500);
        });
        cubemaps[code] = cubemap;
    }
    else {
        scene.background = cubemaps[code];
        UpdateCamera();
        InitLabels();

        $('.change').fadeOut(200, function () {
            $(this).remove();
            isChanging = false;
        });
    }

    groups[code] = tsgGroup;
    scene.add(tsgGroup);

}

// ????????????
function InitXiaoD(code) {
    const XdGroup = new THREE.Group();
    XdGroup.name = '??????';


    function InitLabels() {
        // ?????????
        const tsgLabel = new CSS2DObject(CreateInfoBlock(
            './ajax/img/tsg-logo.png',
            './ajax/texts/tsg.html',
            '????????????',
            1.4
        ));
        createLabel(
            new THREE.Vector3(30, 5, 20),
            XdGroup,
            tsgLabel
        );

        // ????????????
        const sgLabel = new CSS2DObject(CreateInfoBlock(
            './ajax/img/sg-logo.png',
            './ajax/texts/sg.html',
            '??????????????????',
            1.4
        ));
        createLabel(
            new THREE.Vector3(-15, 0, 0),
            XdGroup,
            sgLabel
        );

        // ????????????
        const hehuaNavi = new CSS2DObject(CreateNavi('??????????????????', 5, 1.2));
        createLabel(
            new THREE.Vector3(-10, -8, 3),
            XdGroup,
            hehuaNavi
        );

        // ??????????????????
        const bqNavi = new CSS2DObject(CreateNavi('??????????????????', 2));
        createLabel(
            new THREE.Vector3(25, 0, -25),
            XdGroup,
            bqNavi
        );

        // ?????????
        const cmz = new CSS2DObject(CreateInfo('?????????'));
        createLabel(
            new THREE.Vector3(-15, -5, 35),
            XdGroup,
            cmz
        );

        // ?????????
        const qsq = new CSS2DObject(CreateInfo('?????????'));
        createLabel(
            new THREE.Vector3(15, -5, 35),
            XdGroup,
            qsq
        );
    }

    // load cube map
    if (!cubemaps[code]) {
        const path = './images/xiaodao/';
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
                $('.change').fadeOut(200, function () {
                    $(this).remove();
                });
                isChanging = false;
            }, 500);
        });
        cubemaps[code] = cubemap;
    }
    else {
        scene.background = cubemaps[code];
        UpdateCamera();
        InitLabels();

        $('.change').fadeOut(200, function () {
            $(this).remove();
            isChanging = false;
        });
    }

    groups[code] = XdGroup;
    scene.add(XdGroup);

}

// ????????????
function InitHehua(code) {
    const HehuaGroup = new THREE.Group();
    HehuaGroup.name = '??????';


    function InitLabels() {

    }

    // load cube map
    if (!cubemaps[code]) {
        const path = './images/hehua/';
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
                $('.change').fadeOut(200, function () {
                    $(this).remove();
                });
                isChanging = false;
            }, 500);
        });
        cubemaps[code] = cubemap;
    }
    else {
        scene.background = cubemaps[code];
        UpdateCamera();
        InitLabels();

        $('.change').fadeOut(200, function () {
            $(this).remove();
            isChanging = false;
        });
    }

    groups[code] = HehuaGroup;
    scene.add(HehuaGroup);

}

// ????????????
function InitBq2(code) {
    const bq2Group = new THREE.Group();
    bq2Group.name = '??????2';


    function InitLabels() {
        const yist = new CSS2DObject(CreateInfo('?????????'));
        createLabel(
            new THREE.Vector3(8, -10, 8),
            bq2Group,
            yist
        );

        const beihuo = new CSS2DObject(CreateInfo('?????????????????????'));
        createLabel(
            new THREE.Vector3(10, -10, -10),
            bq2Group,
            beihuo
        );

        const beiti = new CSS2DObject(CreateInfo('??????????????????'));
        createLabel(
            new THREE.Vector3(-20, -10, -14),
            bq2Group,
            beiti
        );

        const tiyubu = new CSS2DObject(CreateInfo('?????????'));
        createLabel(
            new THREE.Vector3(-8, -10, -25),
            bq2Group,
            tiyubu
        );
    }

    // load cube map
    if (!cubemaps[code]) {
        const path = './images/bq2/';
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
                $('.change').fadeOut(200, function () {
                    $(this).remove();
                });
                isChanging = false;
            }, 500);
        });
        cubemaps[code] = cubemap;
    }
    else {
        scene.background = cubemaps[code];
        UpdateCamera();
        InitLabels();

        $('.change').fadeOut(200, function () {
            $(this).remove();
            isChanging = false;
        });
    }

    groups[code] = bq2Group;
    scene.add(bq2Group);

}

// ?????? CSS2D ??????
function createLabel(pos, group, css2d) {
    const obj = new THREE.Object3D();
    obj.position.copy(pos);
    group.add(obj);
    css2d.position.copy(pos);
    obj.add(css2d);
}

// ????????????
function UpdateCamera() {
    camera.position.set(3.0, 3.0, 3.0);
    camera.fov = fov = 50;
    camera.updateProjectionMatrix();
}

// ????????????
function SubscribeEvents() {
    // ???????????????????????????
    $('.panel li').on('click', function () {
        if (!isChanging) {
            let code = $(this).attr('value');
            if (current != code) {
                isChanging = true;
                let $div = $('<div class="change">??????????????????...</div>');
                $('body').prepend($div);
                $($div).fadeIn(200);

                $('.panel ul').slideToggle(150, () => {
                    sceneNeedsChenge = true;
                    scene.remove(groups[current]);
                    $('body>div:last-child').empty();
                    current = code;
                });
            }
        }
    });

    // ????????????????????????
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
}

// ??????????????????
function CreateNavi(txt, SceneCode, fontSize = 1.0) {
    // ????????????????????????????????? hover ??????
    let $pre = $(`<div class="pre clickable" style="cursor: pointer;font-size:${fontSize}em;color:lightblue" value=${SceneCode}>${txt}<div>`)
    $pre.hover(function () {
        $(this).css('background', 'rgba(80, 80, 80, 0.6)');
    }, function () {
        $(this).css('background', 'rgba(0, 0, 0, 0.6)');
    });

    // ???????????????????????????
    $pre.on('click', function () {
        if (!isChanging) {
            let code = $(this).attr('value');
            if (current != code) {
                isChanging = true;
                let $div = $('<div class="change">??????????????????...</div>');
                $('body').prepend($div);

                $($div).fadeIn(200, () => {
                    sceneNeedsChenge = true;
                    scene.remove(groups[current]);
                    $('body>div:last-child').empty();
                    current = code;
                });
            }
        }
    });
    return $pre[0];
}