/* ============================================================
   舌尖BOSS — 交互逻辑脚本
   功能：美食数据管理、区域/口味筛选、卡片渲染、
         详情弹窗、随机挑战、滚动动画、鼠标光效、导航交互
   ============================================================ */

// ==================== 美食数据 ====================
// 每个对象代表一个"味觉BOSS"
// img 使用 Wikimedia Commons 免费图片（Special:FilePath 为官方推荐嵌入方式）
// 若图片加载失败，onerror 会自动隐藏图片，显示回退图标
var foodBosses = [
    {
        id: 1,
        name: "重庆火锅",
        city: "重庆",
        region: "西南",
        type: "麻辣系",
        level: "麻辣王者",
        taste: ["麻", "辣", "鲜", "香"],
        desc: "热辣山城的终极味觉挑战。",
        detail: "重庆火锅以浓烈牛油锅底和丰富毛肚、鸭肠等食材闻名，代表着山城热烈、直接、江湖气十足的饮食性格。一锅红汤翻滚，麻辣鲜香交织，是味蕾的极限挑战。",
        color: "#C0392B",
        icon: "辣",
        img: "https://commons.wikimedia.org/wiki/Special:FilePath/Chengdu_Hotpot.jpg?width=600"
    },
    {
        id: 2,
        name: "广式早茶",
        city: "广州",
        region: "华南",
        type: "精致系",
        level: "岭南宗师",
        taste: ["鲜", "香", "清", "雅"],
        desc: "一盅两件里的从容生活。",
        detail: "广式早茶讲究点心精巧、茶香悠长，是岭南饮食文化中最具生活气息的代表。虾饺、烧卖、叉烧包，配上一壶好茶，体现了广州人对生活品质的讲究。",
        color: "#D6A756",
        icon: "茶",
        img: "https://commons.wikimedia.org/wiki/Special:FilePath/Cuisine_of_China_0105.JPG?width=600"
    },
    {
        id: 3,
        name: "北京烤鸭",
        city: "北京",
        region: "华北",
        type: "经典系",
        level: "帝都名将",
        taste: ["酥", "香", "浓", "郁"],
        desc: "薄饼卷起的京味仪式感。",
        detail: "北京烤鸭以皮脆肉嫩、色泽红亮著称，体现了传统技艺与城市饮食文化的结合。薄饼、甜面酱、葱丝、黄瓜条，一卷入口，层次丰富。",
        color: "#C0392B",
        icon: "鸭",
        img: "https://commons.wikimedia.org/wiki/Special:FilePath/Quanjude_roastduck.JPG?width=600"
    },
    {
        id: 4,
        name: "兰州牛肉面",
        city: "兰州",
        region: "西北",
        type: "面食系",
        level: "西北刀客",
        taste: ["清", "香", "劲", "道"],
        desc: "一清二白三红四绿的面香江湖。",
        detail: "兰州牛肉面讲究汤清、面劲、辣油香，是西北面食文化的重要代表。一碗好面，汤是灵魂，面是筋骨，辣椒油是点睛之笔。",
        color: "#F39C12",
        icon: "面",
        img: "https://commons.wikimedia.org/wiki/Special:FilePath/Lanzhou_lamian,_Changsha.jpg?width=600"
    },
    {
        id: 5,
        name: "西安肉夹馍",
        city: "西安",
        region: "西北",
        type: "硬核系",
        level: "古都战士",
        taste: ["肉", "香", "浓", "厚"],
        desc: "千年古都的烟火气，藏在一口馍香里。",
        detail: "肉夹馍外皮酥香，内馅肉质软烂，是陕西街头美食中极具代表性的存在。腊汁肉肥而不腻，白吉馍外酥里软，两者结合堪称完美。",
        color: "#D6A756",
        icon: "馍",
        img: "https://commons.wikimedia.org/wiki/Special:FilePath/Chinesische_Snacks.JPG?width=600"
    },
    {
        id: 6,
        name: "柳州螺蛳粉",
        city: "柳州",
        region: "华南",
        type: "重口系",
        level: "气味刺客",
        taste: ["酸", "辣", "鲜", "爽"],
        desc: "闻着上头，吃着真香。",
        detail: "螺蛳粉以酸笋、螺蛳汤和米粉形成独特风味，是近年来极具传播力的地方美食。酸笋的独特气味是其标志，但入口后的鲜美让无数人\"真香\"打脸。",
        color: "#27AE60",
        icon: "螺",
        img: "https://commons.wikimedia.org/wiki/Special:FilePath/Lanzhou_lamian,_Changsha.jpg?width=600"
    },
    {
        id: 7,
        name: "长沙臭豆腐",
        city: "长沙",
        region: "华中",
        type: "重口系",
        level: "黑金刺客",
        taste: ["外", "酥", "里", "嫩"],
        desc: "黑色外表下的爆汁灵魂。",
        detail: "长沙臭豆腐色泽深黑，入口酥香，搭配辣椒汤汁后具有鲜明的湘味特色。闻着臭、吃着香，外皮酥脆、内里软嫩，是湘味小吃的人气之王。",
        color: "#2C3E50",
        icon: "臭",
        img: "https://commons.wikimedia.org/wiki/Special:FilePath/Stinky_tofu_stall.JPG?width=600"
    },
    {
        id: 8,
        name: "武汉热干面",
        city: "武汉",
        region: "华中",
        type: "面食系",
        level: "早餐霸主",
        taste: ["芝", "麻", "浓", "香"],
        desc: "一碗拌开的江城清晨。",
        detail: "热干面以芝麻酱香气和劲道面条著称，是武汉过早文化的代表。碱面筋道、芝麻酱浓郁、萝卜丁爽脆，一碗下肚，精神一整天。",
        color: "#D6A756",
        icon: "面",
        img: "https://commons.wikimedia.org/wiki/Special:FilePath/Reganmian_and_Danjiu.jpeg?width=600"
    },
    {
        id: 9,
        name: "上海生煎",
        city: "上海",
        region: "华东",
        type: "精致系",
        level: "海派高手",
        taste: ["鲜", "甜", "酥", "香"],
        desc: "一口爆汁的海派街头味道。",
        detail: "上海生煎底部金黄酥脆，内馅鲜美多汁，体现了海派小吃的精致与实在。咬开一个小口，先吸汤汁，再吃馅料，最后品味酥底，层次分明。",
        color: "#D6A756",
        icon: "煎",
        img: "https://commons.wikimedia.org/wiki/Special:FilePath/Cuisine_of_China_0105.JPG?width=600"
    },
    {
        id: 10,
        name: "南京盐水鸭",
        city: "南京",
        region: "华东",
        type: "经典系",
        level: "金陵雅士",
        taste: ["咸", "鲜", "清", "香"],
        desc: "金陵城里的一抹清鲜。",
        detail: "南京盐水鸭肉质细嫩，咸鲜适口，是南京饮食文化中的经典代表。以低温慢煮工艺制作，保留了鸭肉最本真的鲜美，清爽不腻。",
        color: "#7FB3D8",
        icon: "鸭",
        img: "https://commons.wikimedia.org/wiki/Special:FilePath/Quanjude_roastduck.JPG?width=600"
    },
    {
        id: 11,
        name: "东北锅包肉",
        city: "哈尔滨",
        region: "东北",
        type: "酸甜系",
        level: "冰城猛将",
        taste: ["酸", "甜", "酥", "脆"],
        desc: "外酥里嫩的东北硬菜代表。",
        detail: "锅包肉色泽金黄，口感酸甜酥脆，体现了东北菜豪爽又鲜明的风味。猪里脊肉切片挂糊油炸，浇上糖醋汁，外酥里嫩，酸甜适口。",
        color: "#F39C12",
        icon: "肉",
        img: "https://commons.wikimedia.org/wiki/Special:FilePath/Cuisine_of_China_0105.JPG?width=600"
    },
    {
        id: 12,
        name: "云南过桥米线",
        city: "昆明",
        region: "西南",
        type: "鲜香系",
        level: "滇南术士",
        taste: ["汤", "鲜", "米", "滑"],
        desc: "一碗热汤里的云南风物。",
        detail: "过桥米线以高汤、米线和丰富配料组成，讲究汤温与食材的融合。滚烫的高汤上桌后，依次放入肉片、蔬菜、米线，食材在汤中瞬间烫熟，鲜美无比。",
        color: "#27AE60",
        icon: "线",
        img: "https://commons.wikimedia.org/wiki/Special:FilePath/Lanzhou_lamian,_Changsha.jpg?width=600"
    }
];

// ==================== 全局状态变量 ====================
// 当前选中的区域
var currentRegion = "全部";
// 当前选中的口味类型
var currentType = "全部";

// ==================== 区域选择统一入口 ====================
// 按钮和地图共用的筛选逻辑，保持两者状态同步
function selectRegion(regionName) {
    // 1. 更新全局状态
    currentRegion = regionName;

    // 2. 同步按钮栏 active 状态
    var regionBtns = document.querySelectorAll("#regionButtons .region-btn");
    regionBtns.forEach(function(b) {
        if (b.getAttribute("data-region") === regionName) {
            b.classList.add("active");
        } else {
            b.classList.remove("active");
        }
    });

    // 3. 同步地图 active 高亮状态
    var mapRegions = document.querySelectorAll(".map-region");
    mapRegions.forEach(function(r) {
        if (r.getAttribute("data-region") === regionName) {
            r.classList.add("active");
        } else {
            r.classList.remove("active");
        }
    });

    // 4. 重新渲染 BOSS 卡片
    renderBossCards();
}

// ==================== 页面初始化 ====================
// 页面加载完成后执行
document.addEventListener("DOMContentLoaded", function() {
    // 渲染美食BOSS卡片
    renderBossCards();
    // 绑定所有事件
    bindEvents();
    // 初始化滚动渐入动画
    initScrollReveal();
    // 初始化标准中国地图
    initChinaMap();
});

// ==================== 标准中国地图生成 ====================
// 省份 → 区域 对照表（基于国家标准七大地理分区）
var provinceToRegion = {
    "北京市": "华北", "天津市": "华北", "河北省": "华北",
    "山西省": "华北", "内蒙古自治区": "华北",
    "辽宁省": "东北", "吉林省": "东北", "黑龙江省": "东北",
    "上海市": "华东", "江苏省": "华东", "浙江省": "华东",
    "安徽省": "华东", "福建省": "华东", "江西省": "华东", "山东省": "华东",
    "河南省": "华中", "湖北省": "华中", "湖南省": "华中",
    "广东省": "华南", "广西壮族自治区": "华南", "海南省": "华南",
    "香港特别行政区": "华南", "澳门特别行政区": "华南",
    "重庆市": "西南", "四川省": "西南", "贵州省": "西南",
    "云南省": "西南", "西藏自治区": "西南",
    "陕西省": "西北", "甘肃省": "西北", "青海省": "西北",
    "宁夏回族自治区": "西北", "新疆维吾尔自治区": "西北",
    "台湾省": "华东"
};

// 区域配色方案
var regionColors = {
    "东北": "#E67E22",
    "华北": "#C0392B",
    "华东": "#D6A756",
    "华中": "#D35400",
    "华南": "#27AE60",
    "西南": "#8E44AD",
    "西北": "#F39C12"
};

// 各区域含美食数量（用于标注）
function getRegionFoodCount(regionName) {
    var count = 0;
    foodBosses.forEach(function(b) {
        if (b.region === regionName) count++;
    });
    return count;
}

// GeoJSON 经纬度 → SVG viewBox 投影
// 中国陆域范围: lng 73~136, lat 17~54
// viewBox: 0 0 720 500（含南海诸岛纵向空间）
var MAP_LNG_MIN = 73, MAP_LNG_MAX = 136,
    MAP_LAT_MIN = 17, MAP_LAT_MAX = 54,
    MAP_W = 720, MAP_H = 500;

function project(lng, lat) {
    var x = ((lng - MAP_LNG_MIN) / (MAP_LNG_MAX - MAP_LNG_MIN)) * MAP_W;
    var y = ((MAP_LAT_MAX - lat) / (MAP_LAT_MAX - MAP_LAT_MIN)) * MAP_H;
    return [parseFloat(x.toFixed(2)), parseFloat(y.toFixed(2))];
}

// 将 GeoJSON MultiPolygon 的单个环转为 SVG path 片段
function ringToPath(ring) {
    var d = "";
    for (var i = 0; i < ring.length; i++) {
        var p = project(ring[i][0], ring[i][1]);
        d += (i === 0 ? "M" : "L") + p[0] + "," + p[1];
    }
    return d + "Z";
}

// 将 GeoJSON geometry 转为完整 SVG d 属性
function geoToPathD(geometry) {
    var parts = [];
    if (geometry.type === "MultiPolygon") {
        geometry.coordinates.forEach(function(polygon) {
            polygon.forEach(function(ring) {
                parts.push(ringToPath(ring));
            });
        });
    } else if (geometry.type === "Polygon") {
        geometry.coordinates.forEach(function(ring) {
            parts.push(ringToPath(ring));
        });
    }
    return parts.join(" ");
}

// 加载 GeoJSON 并生成标准中国地图
function initChinaMap() {
    var container = document.getElementById("mapContainer");
    if (!container) return;

    // 使用全局变量 CHINA_GEO（由 china_geo_data.js 提供）
    if (typeof CHINA_GEO === "undefined") {
        container.innerHTML =
            '<div class="map-error">地图数据未加载，请检查 china_geo_data.js 文件。</div>';
        return;
    }

    try {
        buildChinaMap(CHINA_GEO, container);
    } catch (err) {
        console.error("中国地图构建失败:", err);
        container.innerHTML =
            '<div class="map-error">地图构建失败。<br>' +
            '<small>错误: ' + err.message + '</small></div>';
    }
}

// 根据 GeoJSON 构建完整 SVG 地图
function buildChinaMap(geoData, container) {
    // 按区域分组收集路径
    var regionPaths = {};  // { "华北": [pathD1, pathD2, ...] }
    var regionCentroids = {}; // { "华北": { sumX, sumY, count } }

    geoData.features.forEach(function(feature) {
        var name = feature.properties.name;
        var region = provinceToRegion[name];
        if (!region) return; // 跳过未知省份

        var d = geoToPathD(feature.geometry);
        if (!regionPaths[region]) {
            regionPaths[region] = [];
            regionCentroids[region] = { sumX: 0, sumY: 0, count: 0 };
        }
        regionPaths[region].push(d);

        // 使用 center 属性估算区域中心
        var center = feature.properties.center;
        if (center) {
            var cp = project(center[0], center[1]);
            regionCentroids[region].sumX += cp[0];
            regionCentroids[region].sumY += cp[1];
            regionCentroids[region].count++;
        }
    });

    // 构建 SVG HTML 字符串
    var svgHtml = '<svg class="china-map" viewBox="0 0 ' + MAP_W + ' ' + MAP_H + '" xmlns="http://www.w3.org/2000/svg">';
    svgHtml += '<title>中国美食分布地图</title>';
    svgHtml += '<desc>数据来源: 阿里云 DataV GeoJSON · 七大地理分区 · 点击区域筛选美食</desc>';

    // 绘制底图轮廓（所有省份合并）
    svgHtml += '<g id="map-outlines">';
    Object.keys(regionPaths).forEach(function(region) {
        regionPaths[region].forEach(function(d) {
            svgHtml += '<path class="map-province-bg" d="' + d + '" />';
        });
    });
    svgHtml += '</g>';

    // 绘制7大区域（可点击）
    svgHtml += '<g id="map-regions">';
    Object.keys(regionPaths).forEach(function(region) {
        var fill = regionColors[region] || "#888888";
        regionPaths[region].forEach(function(d) {
            svgHtml += '<path class="map-region" data-region="' + region + '" fill="' + fill + '" d="' + d + '" />';
        });
    });
    svgHtml += '</g>';

    // 区域标签
    svgHtml += '<g id="map-labels">';
    Object.keys(regionCentroids).forEach(function(region) {
        var c = regionCentroids[region];
        if (c.count === 0) return;
        var cx = (c.sumX / c.count).toFixed(1);
        var cy = (c.sumY / c.count).toFixed(1);
        var count = getRegionFoodCount(region);
        svgHtml += '<text class="map-label" x="' + cx + '" y="' + cy + '">' + region + ' · ' + count + '道</text>';
    });
    svgHtml += '</g>';

    // 图例
    svgHtml += '<g class="map-legend-group" transform="translate(560, 420)">';
    var legendY = 0;
    Object.keys(regionColors).forEach(function(region) {
        var color = regionColors[region];
        svgHtml += '<rect x="0" y="' + legendY + '" width="10" height="10" rx="2" fill="' + color + '" opacity="0.6"/>';
        svgHtml += '<text x="14" y="' + (legendY + 8) + '" class="map-legend">' + region + '</text>';
        legendY += 14;
    });
    svgHtml += '</g>';

    svgHtml += '</svg>';

    container.innerHTML = svgHtml;

    // 为地图区域绑定点击事件
    var mapRegions = container.querySelectorAll(".map-region");
    mapRegions.forEach(function(r) {
        r.addEventListener("click", function() {
            var regionName = this.getAttribute("data-region");
            selectRegion(regionName);
            scrollToSection("boss-grid");
        });
    });
}

// ==================== 渲染美食卡片 ====================
function renderBossCards() {
    var grid = document.getElementById("bossCardsGrid");
    var noResult = document.getElementById("noResult");

    // 根据当前筛选条件过滤数据
    var filtered = foodBosses.filter(function(boss) {
        var matchRegion = (currentRegion === "全部" || boss.region === currentRegion);
        var matchType = (currentType === "全部" || boss.type === currentType);
        return matchRegion && matchType;
    });

    // 如果没有匹配结果，显示提示
    if (filtered.length === 0) {
        grid.innerHTML = "";
        noResult.style.display = "block";
        return;
    }

    noResult.style.display = "none";

    // 构建卡片HTML
    var html = "";
    filtered.forEach(function(boss, index) {
        // 将口味数组转为HTML标签
        var tasteTags = "";
        boss.taste.forEach(function(t) {
            tasteTags += '<span class="card-taste-tag">' + t + '</span>';
        });

        html +=
            '<div class="boss-card" data-id="' + boss.id + '" style="transition-delay: ' + (index * 0.08) + 's;">' +
                '<div class="card-img-wrap">' +
                    '<img class="card-img" src="' + boss.img + '" alt="' + boss.name + '" loading="lazy" onerror="var fb=this.parentElement.querySelector(\'.card-img-fallback\');this.style.display=\'none\';if(fb)fb.style.display=\'flex\';">' +
                    '<div class="card-img-fallback" style="display:none;">' +
                        '<div class="card-icon">' + boss.icon + '</div>' +
                    '</div>' +
                '</div>' +
                '<h3 class="card-name">' + boss.name + '</h3>' +
                '<p class="card-city">' + boss.city + '</p>' +
                '<span class="card-level">' + boss.level + '</span>' +
                '<div class="card-tastes">' + tasteTags + '</div>' +
                '<p class="card-desc">' + boss.desc + '</p>' +
                '<button class="card-btn" data-id="' + boss.id + '">查看详情</button>' +
            '</div>';
    });

    grid.innerHTML = html;

    // 为新卡片绑定详情按钮事件
    bindCardDetailBtns();

    // 触发卡片渐入动画
    setTimeout(revealCards, 50);
}

// ==================== 卡片渐入动画 ====================
function revealCards() {
    var cards = document.querySelectorAll(".boss-card");
    cards.forEach(function(card, i) {
        setTimeout(function() {
            card.classList.add("revealed");
        }, i * 80);
    });
}

// ==================== 绑定卡片详情按钮事件 ====================
function bindCardDetailBtns() {
    var btns = document.querySelectorAll(".card-btn");
    btns.forEach(function(btn) {
        btn.addEventListener("click", function(e) {
            e.stopPropagation(); // 防止事件冒泡
            var id = parseInt(this.getAttribute("data-id"));
            openDetailModal(id);
        });
    });
}

// ==================== 打开详情弹窗 ====================
function openDetailModal(id) {
    // 查找对应美食数据
    var boss = foodBosses.find(function(b) {
        return b.id === id;
    });

    if (!boss) return;

    // 构建弹窗内容
    var tasteStr = boss.taste.join("、");

    var html =
        '<div class="modal-img-wrap">' +
            '<img class="modal-img" src="' + boss.img + '" alt="' + boss.name + '" onerror="var w=this.parentElement;this.style.display=\'none\';if(w)w.style.display=\'none\';">' +
        '</div>' +
        '<h2 class="modal-name">' + boss.name + '</h2>' +
        '<p class="modal-city">' + boss.city + ' · ' + boss.region + '</p>' +
        '<div class="modal-meta">' +
            '<div class="modal-meta-item">' +
                '<span class="meta-label">BOSS等级</span>' +
                '<span class="meta-value" style="color: #E74C3C;">' + boss.level + '</span>' +
            '</div>' +
            '<div class="modal-meta-item">' +
                '<span class="meta-label">挑战类型</span>' +
                '<span class="meta-value">' + boss.type + '</span>' +
            '</div>' +
            '<div class="modal-meta-item">' +
                '<span class="meta-label">所属区域</span>' +
                '<span class="meta-value">' + boss.region + '</span>' +
            '</div>' +
            '<div class="modal-meta-item">' +
                '<span class="meta-label">口味特点</span>' +
                '<span class="meta-value">' + tasteStr + '</span>' +
            '</div>' +
        '</div>' +
        '<p class="modal-detail">' + boss.detail + '</p>';

    document.getElementById("modalBody").innerHTML = html;

    // 显示弹窗
    document.getElementById("modalOverlay").classList.add("active");

    // 禁止页面滚动
    document.body.style.overflow = "hidden";
}

// ==================== 关闭详情弹窗 ====================
function closeDetailModal() {
    document.getElementById("modalOverlay").classList.remove("active");
    // 恢复页面滚动
    document.body.style.overflow = "";
}

// ==================== 随机抽取今日BOSS ====================
function randomBoss() {
    // 从美食数组中随机选一个
    var randomIndex = Math.floor(Math.random() * foodBosses.length);
    var boss = foodBosses[randomIndex];
    var tasteStr = boss.taste.join("、");

    var html =
        '<p class="challenge-label">◆ 今日挑战 ◆</p>' +
        '<div class="challenge-img-wrap">' +
            '<img class="challenge-img" src="' + boss.img + '" alt="' + boss.name + '" onerror="var w=this.parentElement;this.style.display=\'none\';if(w)w.style.display=\'none\';">' +
        '</div>' +
        '<h2 class="challenge-name">' + boss.name + '</h2>' +
        '<div class="challenge-info">' +
            '<p><span class="clabel">城市</span><span class="cvalue">' + boss.city + '</span></p>' +
            '<p><span class="clabel">BOSS等级</span><span class="cvalue" style="color: #E74C3C;">' + boss.level + '</span></p>' +
            '<p><span class="clabel">挑战类型</span><span class="cvalue">' + boss.type + '</span></p>' +
            '<p><span class="clabel">口味特点</span><span class="cvalue">' + tasteStr + '</span></p>' +
        '</div>' +
        '<p class="challenge-reason">"' + boss.detail.substring(0, 40) + '……"</p>';

    var resultDiv = document.getElementById("dailyResult");
    resultDiv.innerHTML = html;
    resultDiv.style.display = "block";

    // 滚动到结果区域
    resultDiv.scrollIntoView({ behavior: "smooth", block: "center" });
}

// ==================== 滚动到指定区块 ====================
function scrollToSection(sectionId) {
    var target = document.getElementById(sectionId);
    if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
}

// ==================== 绑定所有交互事件 ====================
function bindEvents() {
    // ---- 区域筛选按钮 ----
    var regionBtns = document.querySelectorAll("#regionButtons .region-btn");
    regionBtns.forEach(function(btn) {
        btn.addEventListener("click", function() {
            var regionName = this.getAttribute("data-region");
            selectRegion(regionName);
        });
    });

    // ---- 口味筛选按钮 ----
    var tasteBtns = document.querySelectorAll("#tasteButtons .taste-btn");
    tasteBtns.forEach(function(btn) {
        btn.addEventListener("click", function() {
            // 移除所有激活状态
            tasteBtns.forEach(function(b) { b.classList.remove("active"); });
            // 设置当前按钮为激活
            this.classList.add("active");
            // 更新筛选条件
            currentType = this.getAttribute("data-taste");
            // 重新渲染卡片
            renderBossCards();
        });
    });

    // ---- 随机抽取按钮 ----
    var randomBtn = document.getElementById("randomBtn");
    if (randomBtn) {
        randomBtn.addEventListener("click", randomBoss);
    }

    // ---- 弹窗关闭按钮 ----
    var closeBtn = document.getElementById("modalClose");
    if (closeBtn) {
        closeBtn.addEventListener("click", closeDetailModal);
    }

    // ---- 点击遮罩关闭弹窗 ----
    var overlay = document.getElementById("modalOverlay");
    if (overlay) {
        overlay.addEventListener("click", function(e) {
            // 只有点击遮罩本身（不是弹窗内容）时才关闭
            if (e.target === overlay) {
                closeDetailModal();
            }
        });
    }

    // ---- 按Esc键关闭弹窗 ----
    document.addEventListener("keydown", function(e) {
        if (e.key === "Escape") {
            var overlay = document.getElementById("modalOverlay");
            if (overlay.classList.contains("active")) {
                closeDetailModal();
            }
        }
    });

    // ---- 鼠标跟随光效 ----
    var cursorGlow = document.querySelector(".cursor-glow");
    document.addEventListener("mousemove", function(e) {
        if (cursorGlow) {
            cursorGlow.style.left = e.clientX + "px";
            cursorGlow.style.top = e.clientY + "px";
        }
    });

    // ---- 导航栏滚动效果 ----
    window.addEventListener("scroll", function() {
        var navbar = document.getElementById("navbar");
        if (window.scrollY > 60) {
            navbar.classList.add("scrolled");
        } else {
            navbar.classList.remove("scrolled");
        }

        // 更新导航激活项（根据当前滚动位置）
        updateActiveNav();
    });

    // ---- 手机菜单按钮 ----
    var mobileBtn = document.getElementById("mobileMenuBtn");
    if (mobileBtn) {
        mobileBtn.addEventListener("click", function() {
            var navLinks = document.querySelector(".nav-links");
            navLinks.classList.toggle("mobile-open");
        });
    }

    // ---- 导航链接点击（手机端关闭菜单 + 平滑滚动） ----
    var navLinks = document.querySelectorAll(".nav-link");
    navLinks.forEach(function(link) {
        link.addEventListener("click", function(e) {
            e.preventDefault();
            var targetId = this.getAttribute("href").substring(1);
            scrollToSection(targetId);
            // 关闭手机菜单
            document.querySelector(".nav-links").classList.remove("mobile-open");
        });
    });
}

// ==================== 更新导航激活状态 ====================
function updateActiveNav() {
    var sections = ["home", "stats", "boss-grid", "daily", "about"];
    var navLinks = document.querySelectorAll(".nav-link");
    var scrollPos = window.scrollY + 120; // 偏移量，让检测更准确

    // 找到当前所在的区块
    var currentSection = "home";
    sections.forEach(function(id) {
        var el = document.getElementById(id);
        if (el && el.offsetTop <= scrollPos) {
            currentSection = id;
        }
    });

    // 更新导航链接的激活状态
    navLinks.forEach(function(link) {
        link.classList.remove("active");
        if (link.getAttribute("href") === "#" + currentSection) {
            link.classList.add("active");
        }
    });
}

// ==================== 滚动渐入动画（IntersectionObserver） ====================
function initScrollReveal() {
    // 创建 IntersectionObserver 实例
    // 当被观察的元素进入视口时，自动添加 active 类触发动画
    var observer = new IntersectionObserver(
        function(entries) {
            entries.forEach(function(entry) {
                // 如果元素进入了视口
                if (entry.isIntersecting) {
                    // 添加 active 类，触发 CSS 渐入动画
                    entry.target.classList.add("active");
                    // 动画只播放一次，之后取消观察
                    observer.unobserve(entry.target);
                }
            });
        },
        {
            // 当元素露出 15% 时触发
            threshold: 0.15,
            // 提前 50px 开始触发，让动画更流畅
            rootMargin: "0px 0px -50px 0px"
        }
    );

    // 找到所有带 reveal 类的元素并开始观察
    var revealElements = document.querySelectorAll(".reveal");
    revealElements.forEach(function(el) {
        observer.observe(el);
    });
}

// 将 scrollToSection 挂到全局，以便 HTML 中的 onclick 能调用
window.scrollToSection = scrollToSection;
