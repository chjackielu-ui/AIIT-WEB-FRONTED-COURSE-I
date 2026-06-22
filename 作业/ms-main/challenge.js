/* ============================================================
   舌尖BOSS — 挑战页面交互逻辑
   ============================================================ */

// 用户选择的条件
let selectedConditions = {
    mood: null,
    weather: null,
    scene: null,
    taste: null
};

// 推荐结果
let currentRecommendation = null;

// ==================== 页面初始化 ====================

document.addEventListener('DOMContentLoaded', () => {
    initTodayBoss();
    initOptions();
    initStats();
    initAchievements();
    initNavSearch();
    initMobileMenu();
});

// ==================== 今日BOSS ====================

function initTodayBoss() {
    const todayBoss = getTodayBoss();
    const hasChallenged = hasChallengedTodayBoss();

    const imgHtml = todayBoss.img
        ? `<img class="boss-img" src="${todayBoss.img}" alt="${todayBoss.name}" onerror="this.style.display='none';">`
        : '';

    const tags = todayBoss.taste.map(t => `<span class="tag tag-primary">${t}</span>`).join('');

    const btnHtml = hasChallenged
        ? `<button class="challenge-btn" disabled>今日已挑战 ✓</button>
           <div class="challenged-badge">✓ 你今天已经挑战过今日BOSS了</div>`
        : `<button class="challenge-btn" onclick="acceptTodayBoss()">⚔️ 接受今日挑战</button>`;

    document.getElementById('todayBossCard').innerHTML = `
        <span class="boss-badge">⚔️ 今日BOSS</span>
        ${imgHtml}
        <h2 class="boss-name">${todayBoss.name}</h2>
        <div class="boss-info">
            <span class="boss-info-item">📍 ${todayBoss.city} · ${todayBoss.province}</span>
            <span class="boss-info-item">⭐ ${todayBoss.level}</span>
            <span class="boss-info-item">🍽️ ${todayBoss.type}</span>
        </div>
        <div class="boss-tags">${tags}</div>
        <p style="text-align: center; color: var(--text-secondary); margin-bottom: 20px;">
            ${todayBoss.desc}
        </p>
        ${btnHtml}
    `;
}

function acceptTodayBoss() {
    const todayBoss = getTodayBoss();

    // 简单的自动匹配（给今日BOSS高分）
    const autoConditions = {
        mood: 'happy',
        weather: 'any',
        scene: 'family',
        taste: 'any'
    };

    const match = calculateMatch(todayBoss, autoConditions);
    saveChallengeRecord(todayBoss.id, autoConditions, match.score);

    // 显示成功动画
    showSuccessModal(todayBoss, match.score);

    // 刷新页面数据
    initTodayBoss();
    initStats();
    initAchievements();
}

// ==================== 初始化选项 ====================

function initOptions() {
    // 心情选项
    const moodHtml = MOODS.map(m => `
        <div class="option-btn" data-type="mood" data-value="${m.id}">
            <div class="option-emoji">${m.emoji}</div>
            <div class="option-label">${m.label}</div>
        </div>
    `).join('');
    document.getElementById('moodOptions').innerHTML = moodHtml;

    // 天气选项
    const weatherHtml = WEATHERS.map(w => `
        <div class="option-btn" data-type="weather" data-value="${w.id}">
            <div class="option-emoji">${w.emoji}</div>
            <div class="option-label">${w.label}</div>
        </div>
    `).join('');
    document.getElementById('weatherOptions').innerHTML = weatherHtml;

    // 场景选项
    const sceneHtml = SCENES.map(s => `
        <div class="option-btn" data-type="scene" data-value="${s.id}">
            <div class="option-emoji">${s.emoji}</div>
            <div class="option-label">${s.label}</div>
        </div>
    `).join('');
    document.getElementById('sceneOptions').innerHTML = sceneHtml;

    // 口味选项
    const tasteHtml = TASTES.map(t => `
        <div class="option-btn" data-type="taste" data-value="${t.id}">
            <div class="option-emoji">${t.emoji}</div>
            <div class="option-label">${t.label}</div>
        </div>
    `).join('');
    document.getElementById('tasteOptions').innerHTML = tasteHtml;

    // 绑定点击事件
    document.querySelectorAll('.option-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const type = this.getAttribute('data-type');
            const value = this.getAttribute('data-value');

            // 取消同类型其他按钮的选中状态
            document.querySelectorAll(`.option-btn[data-type="${type}"]`).forEach(b => {
                b.classList.remove('active');
            });

            // 选中当前按钮
            this.classList.add('active');
            selectedConditions[type] = value;
        });
    });

    // 推荐按钮
    document.getElementById('recommendBtn').addEventListener('click', generateRecommendation);
}

// ==================== 生成推荐 ====================

function generateRecommendation() {
    // 检查是否所有选项都已选择
    if (!selectedConditions.mood || !selectedConditions.weather ||
        !selectedConditions.scene || !selectedConditions.taste) {
        alert('请选择所有选项后再推荐');
        return;
    }

    // 获取推荐列表
    const recommendations = recommendFoods(selectedConditions);
    currentRecommendation = recommendations[0]; // 取第一个（最高分）

    const food = currentRecommendation.food;
    const score = currentRecommendation.score;
    const reasons = currentRecommendation.reasons;

    const imgHtml = food.img
        ? `<img class="boss-img" src="${food.img}" alt="${food.name}" onerror="this.style.display='none';">`
        : '';

    const tags = food.taste.map(t => `<span class="tag tag-primary">${t}</span>`).join('');

    const reasonsHtml = reasons.length > 0
        ? `<div class="match-reasons">
               <div class="match-reasons-title">💡 推荐理由</div>
               <ul class="match-reasons-list">
                   ${reasons.map(r => `<li class="match-reasons-item">${r}</li>`).join('')}
               </ul>
           </div>`
        : '';

    document.getElementById('resultCard').innerHTML = `
        <div class="match-score">
            <div class="match-score-number">${score}分</div>
            <div class="match-stars">${getStarRating(score)}</div>
            <div class="match-level">${getMatchLevel(score)}</div>
        </div>

        ${imgHtml}

        <h2 class="boss-name">${food.name}</h2>
        <div class="boss-info">
            <span class="boss-info-item">📍 ${food.city} · ${food.province}</span>
            <span class="boss-info-item">⭐ ${food.level}</span>
            <span class="boss-info-item">🍽️ ${food.type}</span>
        </div>
        <div class="boss-tags">${tags}</div>
        <p style="text-align: center; color: var(--text-secondary); margin: 16px 0;">
            ${food.desc}
        </p>

        ${reasonsHtml}

        <div class="result-actions">
            <button class="btn-accept" onclick="acceptRecommendation()">✓ 接受挑战</button>
            <button class="btn-retry" onclick="retryRecommendation()">↻ 换一个</button>
        </div>
    `;

    // 显示结果区域
    document.getElementById('resultSection').classList.add('show');

    // 滚动到结果区域
    document.getElementById('resultSection').scrollIntoView({ behavior: 'smooth' });
}

// ==================== 接受推荐 ====================

function acceptRecommendation() {
    if (!currentRecommendation) return;

    const food = currentRecommendation.food;
    const score = currentRecommendation.score;

    // 保存挑战记录
    saveChallengeRecord(food.id, selectedConditions, score);

    // 显示成功动画
    showSuccessModal(food, score);

    // 刷新统计数据
    initStats();
    initAchievements();

    // 隐藏结果区域
    document.getElementById('resultSection').classList.remove('show');

    // 重置选择
    resetSelections();
}

// ==================== 换一个推荐 ====================

function retryRecommendation() {
    // 获取推荐列表
    const recommendations = recommendFoods(selectedConditions);

    // 找到当前推荐的索引
    const currentIndex = recommendations.findIndex(r =>
        r.food.id === currentRecommendation.food.id
    );

    // 获取下一个推荐
    const nextIndex = (currentIndex + 1) % recommendations.length;
    currentRecommendation = recommendations[nextIndex];

    // 重新渲染（复用generateRecommendation的逻辑）
    generateRecommendation();
}

// ==================== 成功提示 ====================

function showSuccessModal(food, score) {
    const stats = getChallengeStats();

    const message = `
🎉 挑战成功！

【${food.name}】

匹配度：${score}分 ${getStarRating(score)}

已完成：${stats.challenged} / ${stats.total} 道
进度：${stats.percentage}%

${stats.challenged === stats.total ? '🎊 恭喜你！已完成所有美食挑战！' : ''}
    `;

    alert(message);
}

// ==================== 初始化统计 ====================

function initStats() {
    const stats = getChallengeStats();

    const statsHtml = `
        <div class="stat-card">
            <div class="stat-icon">🍜</div>
            <div class="stat-number">${stats.challenged} / ${stats.total}</div>
            <div class="stat-label">已挑战美食</div>
        </div>
        <div class="stat-card">
            <div class="stat-icon">📊</div>
            <div class="stat-number">${stats.percentage}%</div>
            <div class="stat-label">完成进度</div>
        </div>
        <div class="stat-card">
            <div class="stat-icon">🔥</div>
            <div class="stat-number">${stats.consecutiveDays}</div>
            <div class="stat-label">连续挑战天数</div>
        </div>
        <div class="stat-card">
            <div class="stat-icon">📝</div>
            <div class="stat-number">${stats.totalRecords}</div>
            <div class="stat-label">总挑战次数</div>
        </div>
    `;

    document.getElementById('statsGrid').innerHTML = statsHtml;
}

// ==================== 初始化成就 ====================

function initAchievements() {
    const achievements = getAchievements();

    const achievementsHtml = achievements.map(a => `
        <div class="achievement-card ${a.unlocked ? 'unlocked' : 'locked'}">
            <div class="achievement-icon">${a.icon}</div>
            <div class="achievement-name">${a.name}</div>
            <div class="achievement-desc">${a.desc}</div>
        </div>
    `).join('');

    document.getElementById('achievementsGrid').innerHTML = achievementsHtml;
}

// ==================== 重置选择 ====================

function resetSelections() {
    selectedConditions = {
        mood: null,
        weather: null,
        scene: null,
        taste: null
    };

    document.querySelectorAll('.option-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    document.getElementById('resultSection').classList.remove('show');
}

// ==================== 导航栏搜索 ====================

function initNavSearch() {
    const navSearchToggle = document.getElementById('navSearchToggle');
    const navSearchBox = document.getElementById('navSearchBox');
    const navSearchInput = document.getElementById('navSearchInput');
    const navSearchSubmit = document.getElementById('navSearchSubmit');

    if (!navSearchToggle || !navSearchBox) return;

    navSearchToggle.addEventListener('click', () => {
        navSearchBox.classList.toggle('active');
        if (navSearchBox.classList.contains('active')) {
            navSearchInput.focus();
        }
    });

    function performNavSearch() {
        const keyword = navSearchInput.value.trim();
        if (keyword) {
            const searchUrl = `https://www.baidu.com/s?wd=${encodeURIComponent(keyword + ' 美食')}`;
            window.open(searchUrl, '_blank');
            navSearchInput.value = '';
        }
    }

    navSearchSubmit.addEventListener('click', performNavSearch);
    navSearchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performNavSearch();
        }
    });

    document.addEventListener('click', (e) => {
        if (!navSearchToggle.contains(e.target) && !navSearchBox.contains(e.target)) {
            navSearchBox.classList.remove('active');
        }
    });
}

// ==================== 手机菜单 ====================

function initMobileMenu() {
    const btn = document.getElementById('mobileMenuBtn');
    if (btn) {
        btn.addEventListener('click', () => {
            document.querySelector('.nav-links').classList.toggle('mobile-open');
        });
    }
}
