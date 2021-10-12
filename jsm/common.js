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

function CreateInfo(txt, fontSize = 1.0) {
    let div = $(`<div class="pre" style="font-size:${fontSize}em">${txt}</div>`);
    return div[0];
}

export{
    CreateInfoBlock,
    CreateInfo
};